# Propuesta para Comercial Aurora

## Why

Comercial Aurora atiende 300 clientes, procesa cerca de 1.200 pedidos al mes y recibe unas 600 solicitudes de servicio. La especificación A05 estima que se pierde el 10 % de esas solicitudes y que el 30 % carece de responsable. Un prototipo local permitirá comprobar si la radicación, la asignación y el seguimiento funcionan para el equipo antes de invertir en un piloto operativo, donde la confiabilidad de las entregas y la atención tienen impacto en la recompra.

## What Changes

- Entregar un único archivo HTML adaptable, con CSS y JavaScript incorporados, que se pueda abrir con doble clic y probar en el navegador sin servidor ni conexión.
- Registrar manualmente solicitudes recibidas por mensajería, correo electrónico o teléfono. Generar un identificador por caso, asignar por turnos a los cuatro agentes y consultar bandeja, estados e historial.
- Alternar entre cuatro perfiles simulados de agente y uno de coordinador. El agente registra casos y gestiona los propios. El coordinador consulta la operación completa, reasigna casos activos y revisa el tablero.
- Mostrar en cada solicitud el plazo de 48 horas corridas. El tablero incluye avisos visuales a las 24 y 36 horas, casos vencidos y cumplimiento de los casos resueltos.
- Precargar clientes y solicitudes ficticias en distintos estados. Importar directorios de clientes en CSV o JSON y exportar o restaurar el conjunto de trabajo en JSON.

## Capabilities

### New Capabilities

- `seguimiento-solicitudes` — Radicación, identificación, asignación, bandeja, perfiles, estados e historial.
- `control-plazos` — Plazo por solicitud, alertas y medición de cumplimiento.
- `datos-locales` — Datos ficticios, importación de clientes, exportación y recuperación.

### Modified Capabilities

## Impact

El prototipo adapta la captura de H1 y el seguimiento visual de H2 de la especificación A05 a una sesión local con datos en memoria. La hoja de ruta operativa conserva la concurrencia, autenticación, base de datos compartida, integraciones de correo, mensajería y ERP, notificaciones externas, portal y analítica para fases posteriores. El piloto de seis semanas y los topes de COP 12.000.000 de desarrollo y COP 300.000 mensuales son referencias de la hoja de ruta operativa.

La aceptación consiste en abrir el HTML y probar la radicación, rotación, perfiles, alertas, resolución, importación y recuperación de un respaldo. En un piloto operativo posterior se podrán medir la cobertura de registro y asignación, la proporción resuelta dentro de 48 horas, el tiempo administrativo y el costo de reprocesos.
