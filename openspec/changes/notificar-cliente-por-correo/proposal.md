# Notificación al cliente por correo

## Why

Los clientes de Comercial Aurora necesitan saber cuándo se resolvió su solicitud y cuándo se cerró. Un aviso automático en cada hito reduce la necesidad de preguntar por el estado y deja constancia de la comunicación.

## What Changes

- Notificar al correo de contacto del cliente en cada transición efectiva a Resuelto o Cerrado.
- Identificar el ticket y el estado en el mensaje e incluir la respuesta destinada al cliente al resolver.
- Registrar el resultado de cada aviso sin impedir que avance la solicitud si el envío falla o falta el correo.

## Capabilities

### New Capabilities

- `notificaciones-por-correo` — Envío y trazabilidad de avisos al resolver o cerrar solicitudes.

### Modified Capabilities

## Impact

El cambio se apoya en las transiciones y el directorio del cambio `prototipo-local-solicitudes-aurora`. El correo de contacto será opcional para mantener la compatibilidad con clientes y respaldos anteriores. El envío real requiere conexión y un servicio de correo con credenciales gestionadas fuera del HTML.
