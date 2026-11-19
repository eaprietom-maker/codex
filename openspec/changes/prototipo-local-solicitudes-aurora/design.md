# Diseño del prototipo

## Context

La aplicación se ejecutará mediante `file://`. El repositorio cuenta con OpenSpec para planificar y validar las especificaciones. El navegador instalado será el entorno donde Comercial Aurora pruebe el producto.

## Goals / Non-Goals

- Aplicar el stack acordado en un HTML autónomo, adaptable y sin dependencias de ejecución externas.
- Mantener dentro de la sesión la integridad de las solicitudes, sus referencias y su historial.
- Reservar para la solución operativa la identidad verificable, la concurrencia y el almacenamiento compartido.

## Decisions

1. **Archivo único.** Incorporar CSS, datos de demostración y JavaScript en el HTML. Organizar el script en secciones para datos, reglas de negocio y actualización de la interfaz. La apertura por doble clic requiere eliminar dependencias de un servidor, CDN o descarga de recursos.
2. **Estado y perfiles.** Representar en objetos y arreglos los clientes, usuarios, solicitudes, historial, consecutivos mensuales y turno siguiente. Aplicar las capacidades de cada perfil en las acciones de la interfaz. El coordinador administra reasignación, importación y respaldo. Nuevo es el estado de radicación. La atención pasa a En proceso, Pendiente logística o Pendiente ventas. El cierre se hace desde Resuelto. Conservar el identificador y el historial al reasignar.
3. **Reloj local y reglas de plazo.** Capturar instantes desde el navegador y persistirlos como ISO 8601. Usar la hora de Colombia para la presentación y el mes del identificador. Calcular la diferencia en milisegundos y recalcular el tablero al abrirlo, al cambiar datos y periódicamente durante la sesión. Sembrar los casos de demostración con fechas relativas al arranque.
4. **Archivos de datos.** Validar entradas antes de modificar el estado y presentar los valores importados como texto. El CSV tendrá encabezados `nit,razon_social`, admitirá campos entre comillas y el JSON de clientes será un arreglo con esas claves. Un respaldo incluirá versión de formato y se validará en una copia temporal antes de sustituir los datos. Mantener el NIT como texto.
5. **Prueba del archivo entregable.** Probar la navegación local en el navegador, con red deshabilitada, a tamaños de escritorio y móvil. Verificar el flujo desde la bandeja hasta el historial y repetirlo después de reabrir y restaurar un respaldo.

## Risks / Trade-offs

- Los datos de la sesión se pierden si se cierra sin respaldo. La interfaz mostrará el estado de los cambios y la acción para exportar.
- El reloj del dispositivo afecta los plazos. Las pruebas de umbral usarán instantes controlados y la demostración calculará las fechas a partir de un mismo instante inicial.
- Los perfiles son simulados y el JSON es editable. La prueba utilizará datos ficticios y permitirá verificar el flujo de trabajo desde distintas perspectivas.

## Migration Plan

Distribuir el HTML para abrirlo con doble clic. Para actualizar una copia de prueba, exportar el JSON, abrir la nueva versión y restaurar el respaldo compatible.
