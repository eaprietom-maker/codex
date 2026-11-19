import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createMailServer } from "./correo-servidor.mjs";

test("autoriza y registra cada aviso sin duplicarlo al reintentar o reiniciar", async t => {
  const directory = await mkdtemp(join(tmpdir(), "aurora-correo-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const password = randomUUID();
  let time = 1_000_000;
  const calls = [];
  const accepted = new Set();
  const interrupted = randomUUID();
  const rejected = randomUUID();
  const options = {
    password,
    apiKey: "clave-ficticia",
    sender: "Aurora <sender@example.test>",
    database: join(directory, "mail.sqlite"),
    now: () => time,
    fetchMail: async (url, options) => {
      assert.equal(url, "https://api.resend.com/emails");
      assert.equal(options.headers.Authorization, "Bearer clave-ficticia");
      const key = options.headers["Idempotency-Key"];
      calls.push({ key, ...JSON.parse(options.body) });
      if (key === rejected) return new Response("", { status: 422 });
      const known = accepted.has(key);
      accepted.add(key);
      if (key === interrupted && !known) throw new Error("Respuesta interrumpida después de aceptar");
      return Response.json({ id: "aceptado" });
    },
  };

  let server;
  let url;
  async function start() {
    server = createMailServer(options);
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    url = `http://127.0.0.1:${server.address().port}`;
  }
  const stop = () => new Promise(resolve => server.close(resolve));
  t.after(() => server.listening ? stop() : undefined);
  await start();

  const headers = {
    "Content-Type": "application/json",
    "X-Aurora-Request": "aviso",
    Authorization: "Basic " + Buffer.from("aurora:" + password).toString("base64"),
  };
  const resolved = {
    id: randomUUID(), ticket: "AUR-202611-0001", status: "resolved",
    to: "cliente@example.test", answer: "Se confirmó el pedido.",
    history: "nota interna",
  };
  const closed = { ...resolved, status: "closed", id: randomUUID() };
  const post = (value, requestHeaders = headers) => fetch(url + "/api/avisos", {
    method: "POST", headers: requestHeaders, body: JSON.stringify(value),
  });
  const outcome = async value => (await (await post(value)).json()).status;

  assert.equal((await post(resolved, { ...headers, Authorization: "" })).status, 401);
  assert.equal((await post(resolved, { ...headers, "Sec-Fetch-Site": "cross-site" })).status, 403);
  assert.equal((await post({ ...resolved, to: "incorrecto" })).status, 400);
  assert.deepEqual(calls, []);
  const duplicates = await Promise.all([outcome(resolved), outcome(resolved)]);
  assert(duplicates.includes("sent"));
  assert.equal(await outcome(closed), "sent");
  assert.equal(calls.length, 2);
  assert.deepEqual(calls.map(call => call.to), [[resolved.to], [resolved.to]]);
  assert.match(calls[0].subject, /AUR-202611-0001.*Resuelto/);
  assert.match(calls[0].text, /Se confirmó el pedido/);
  assert.doesNotMatch(calls[0].text, /nota interna/);
  assert.match(calls[1].subject, /AUR-202611-0001.*Cerrado/);
  assert.doesNotMatch(calls[1].text, /Se confirmó el pedido/);
  assert.equal((await post({ ...resolved, to: "otro@example.test" })).status, 409);

  const uncertain = { ...resolved, id: interrupted };
  assert.equal(await outcome(uncertain), "pending");
  assert.equal(await outcome(uncertain), "pending");
  assert.equal(calls.filter(call => call.key === interrupted).length, 1);
  assert.equal(await outcome({ ...resolved, id: rejected }), "failed");
  await stop();
  await start();
  time += 30_000;
  assert.equal(await outcome(uncertain), "sent");
  assert.equal(await outcome(resolved), "sent");
  assert.equal(await outcome(closed), "sent");
  assert.equal(calls.filter(call => call.key === resolved.id).length, 1);
  assert.equal(calls.filter(call => call.key === closed.id).length, 1);
  assert.equal(calls.filter(call => call.key === interrupted).length, 2);
  assert.equal(accepted.size, 3);
});
