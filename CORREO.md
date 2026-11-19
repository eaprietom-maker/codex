# Avisos por correo de Comercial Aurora

El HTML sigue disponible como aplicación local. Al resolver o cerrar un ticket, guarda el aviso en el historial. Para que el servicio pueda enviarlo, abre la aplicación desde el servidor de correo.

## Configuración local

1. Obtén una clave de envío de Resend y verifica el dominio de la dirección remitente.
2. Crea un archivo local `.env.correo` con estos valores. Reemplaza los ejemplos antes de arrancar.

   ```dotenv
   AURORA_PASSWORD=una-clave-larga-de-acceso
   RESEND_API_KEY=clave-de-resend
   AURORA_FROM="Comercial Aurora <avisos@tu-dominio>"
   AURORA_PORT=4177
   ```

3. Ejecuta `node --env-file=.env.correo correo-servidor.mjs` con Node.js 22.20 o superior. Abre `http://127.0.0.1:4177/` e inicia sesión como `aurora` con la contraseña configurada.
4. Desde el perfil coordinador, asigna un correo de contacto en **Datos y respaldo**. También puedes incluir la columna o clave opcional `correo` al importar clientes. Para la primera prueba, usa un destinatario bajo tu control.

El proceso escucha en la interfaz local. Para acceso remoto, publícalo detrás de un proxy HTTPS y conserva la base SQLite en un volumen persistente. Puedes cambiar su ruta con `AURORA_DB`. La contraseña del servicio y la clave del proveedor pertenecen al entorno del servidor.

## Historial y respaldos

- **Enviado** indica que Resend aceptó el aviso. La entrega al buzón se consulta con el proveedor.
- **Pendiente de confirmación** incluye sesiones sin conexión y envíos cuyo resultado aún no se conoce. Con la aplicación abierta desde el servidor, usa **Consultar o procesar aviso** en el historial. El servicio conserva la identidad del aviso y reutiliza la clave de idempotencia del proveedor durante la ventana de reintento. Tras 23 horas, un aviso todavía incierto requiere verificar el resultado en el proveedor antes de intentar otro envío.
- Los respaldos exportados incluyen los correos y el historial de avisos. La aplicación sigue leyendo respaldos anteriores. Restaurar un archivo recupera los avisos sin enviarlos automáticamente.

Ejecuta `node --test correo-servidor.test.mjs` para comprobar el servicio con un proveedor simulado.
