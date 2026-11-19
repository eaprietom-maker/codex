# Diseño de notificaciones por correo

## Context

El prototipo guarda solicitudes y clientes en memoria y permite exportarlos en JSON. El directorio actual contiene NIT y razón social. Los perfiles son simulados y el HTML se puede abrir sin un servidor.

## Goals / Non-Goals

- Vincular un aviso al evento de transición, con un resultado consultable en el historial.
- Conservar el uso local para registrar y resolver solicitudes sin conexión.

## Decisions

- Incorporar un correo de contacto opcional al directorio. Mantener la lectura de directorios y respaldos existentes sin ese campo. Conservar el correo y el registro de avisos al exportar un respaldo nuevo.
- Enviar mediante un servicio autorizado, con identidad verificable para sus llamadas y credenciales del proveedor almacenadas en el servidor. Los perfiles simulados no conceden acceso al servicio. La selección y configuración del proveedor se resuelven en la implementación.
- Identificar cada aviso de manera estable a partir de la solicitud y del evento de transición. Mantener su estado separado del estado de la solicitud y usar la misma identidad en cualquier reintento. Registrar como enviado cuando el servicio confirme la aceptación.
- Formar el correo de resolución con el ticket, el estado y la respuesta para el cliente. Formar el de cierre con el ticket y el estado. La confirmación de entrega al buzón queda fuera del alcance del aviso.

## Risks / Trade-offs

- Si el navegador se queda sin conexión, el aviso queda pendiente y la solicitud conserva el nuevo estado. La recuperación de la sesión local depende del respaldo JSON.
- Si hay una respuesta incierta, consultar el resultado del mismo aviso antes de volver a enviarlo para reducir el riesgo de duplicados.
