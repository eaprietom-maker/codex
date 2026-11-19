import { createHash, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import { pathToFileURL } from "node:url";

const UUID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const EMAIL = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;
const MAX_BODY = 256 * 1024;
const RETRY_DELAY = 30_000;
// Dejamos un margen frente a las 24 horas de idempotencia del proveedor.
const RETRY_WINDOW = 23 * 60 * 60 * 1000;
const endpoint = "/api/avisos";
const hash = value => createHash("sha256").update(value).digest();

async function readNotice(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request.iterator({ destroyOnReturn: false })) {
    size += chunk.length;
    if (size > MAX_BODY) return null;
    chunks.push(chunk);
  }

  let body;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
  if (!body || typeof body.id !== "string" || !UUID.test(body.id) ||
      typeof body.ticket !== "string" || !/^AUR-\d{6}-\d{4}$/.test(body.ticket) ||
      typeof body.to !== "string" || body.to.length > 254 || !EMAIL.test(body.to) ||
      !["resolved", "closed"].includes(body.status) ||
      (body.status === "resolved" && (typeof body.answer !== "string" || !body.answer.trim()))) return null;
  const { id, ticket, to, status } = body;
  return { id, ticket, to, status, answer: status === "resolved" ? body.answer.trim() : "" };
}

function json(response, code, status) {
  response.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ status }));
}

export function createMailServer({ password, apiKey, sender, database, fetchMail = fetch, now = Date.now }) {
  const authorization = hash("Basic " + Buffer.from("aurora:" + password).toString("base64"));
  const db = new DatabaseSync(database);
  db.exec(`
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS notices (
      id TEXT PRIMARY KEY, digest TEXT NOT NULL, status TEXT NOT NULL,
      first_attempt INTEGER NOT NULL, last_attempt INTEGER NOT NULL
    )
  `);
  const find = db.prepare("SELECT * FROM notices WHERE id = ?");
  const reserve = db.prepare("INSERT OR IGNORE INTO notices VALUES (?, ?, 'pending', ?, ?)");
  const claim = db.prepare("UPDATE notices SET last_attempt = ? WHERE id = ? AND status = 'pending' AND last_attempt = ?");
  const finish = db.prepare("UPDATE notices SET status = ? WHERE id = ? AND last_attempt = ?");

  async function deliver(notice) {
    const digest = hash(JSON.stringify(notice)).toString("hex");
    const time = now();
    if (!reserve.run(notice.id, digest, time, time).changes) {
      const previous = find.get(notice.id);
      if (previous.digest !== digest) return "conflict";
      if (previous.status !== "pending") return previous.status;
      if (time - previous.last_attempt < RETRY_DELAY || time - previous.first_attempt >= RETRY_WINDOW ||
          !claim.run(time, notice.id, previous.last_attempt).changes) return "pending";
    }

    const state = notice.status === "resolved" ? "Resuelto" : "Cerrado";
    const subject = `Comercial Aurora · ${notice.ticket} · ${state}`;
    const text = notice.status === "resolved"
      ? `Tu solicitud ${notice.ticket} fue resuelta.\n\n${notice.answer}\n\nComercial Aurora`
      : `Tu solicitud ${notice.ticket} fue cerrada.\n\nComercial Aurora`;
    let status = "pending";
    try {
      const result = await fetchMail("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": notice.id,
        },
        body: JSON.stringify({ from: sender, to: [notice.to], subject, text }),
        signal: AbortSignal.timeout(8000),
        redirect: "error",
      });
      if (result.ok) {
        const receipt = await result.json();
        if (typeof receipt?.id === "string" && receipt.id) status = "sent";
      } else if (result.status >= 400 && result.status < 500 &&
          ![408, 409, 425, 429].includes(result.status) && time === find.get(notice.id).first_attempt) {
        // Un rechazo definitivo en el primer intento no implica una entrega previa.
        status = "failed";
      }
    } catch {
      // Un tiempo de espera o corte de red puede ocurrir después de que el proveedor acepte.
    }
    finish.run(status, notice.id, time);
    return status;
  }

  const server = createServer(async (request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "no-referrer");
    try {
      if (!timingSafeEqual(authorization, hash(request.headers.authorization ?? ""))) {
        response.setHeader("WWW-Authenticate", 'Basic realm="Comercial Aurora", charset="UTF-8"');
        return json(response, 401, "unauthorized");
      }
      if (request.method === "GET" && request.url === "/descargar/comercial-aurora.html") {
        const html = await readFile(new URL("./comercial-aurora.html", import.meta.url));
        response.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": 'attachment; filename="comercial-aurora.html"',
        });
        response.end(html);
        return;
      }
      if (request.method === "GET" && ["/", "/comercial-aurora.html"].includes(request.url)) {
        const html = await readFile(new URL("./comercial-aurora.html", import.meta.url), "utf8");
        response.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
        });
        response.end(html.replace('<html lang="es-CO">', '<html lang="es-CO" data-correo="activo">'));
        return;
      }
      if (request.method !== "POST" || request.url !== endpoint) return json(response, 404, "not_found");
      if (request.headers["x-aurora-request"] !== "aviso" ||
          (request.headers["sec-fetch-site"] && request.headers["sec-fetch-site"] !== "same-origin") ||
          request.headers["content-type"]?.split(";")[0] !== "application/json") {
        return json(response, 403, "forbidden");
      }
      const notice = await readNotice(request);
      if (!notice) {
        response.setHeader("Connection", "close");
        return json(response, 400, "failed");
      }
      const status = await deliver(notice);
      return json(response, status === "conflict" ? 409 : 200, status);
    } catch {
      if (!response.headersSent) json(response, 503, "pending");
      else response.end();
    }
  });
  server.on("close", () => db.close());
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const password = process.env.AURORA_PASSWORD;
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.AURORA_FROM;
  const port = Number(process.env.AURORA_PORT ?? 4177);
  if (!password || password.length < 16 || !apiKey || !sender || !Number.isInteger(port) || port < 1 || port > 65535) {
    console.error("Configura AURORA_PASSWORD (al menos 16 caracteres), RESEND_API_KEY, AURORA_FROM y un puerto válido.");
    process.exitCode = 1;
  } else {
    const database = process.env.AURORA_DB || "aurora-correo.sqlite";
    createMailServer({ password, apiKey, sender, database }).listen(port, "127.0.0.1", () => {
      console.log(`Comercial Aurora: http://127.0.0.1:${port}/`);
    });
  }
}
