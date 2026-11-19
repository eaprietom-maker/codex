# Datos locales

## Purpose

Permitir que el equipo pruebe la aplicación desde el primer arranque y guarde o traslade su trabajo mediante archivos.

## ADDED Requirements

### Requirement: Apertura local con datos de demostración

El prototipo SHALL funcionar al abrir su archivo HTML mediante doble clic, con la red deshabilitada. Iniciará con clientes y solicitudes ficticios, cuatro agentes y un coordinador, incluyendo casos activos en cada tramo del plazo y casos resueltos a tiempo y fuera de plazo.

#### Scenario: Abrir el archivo por primera vez

- **WHEN** se abre el HTML en el navegador sin cargar un respaldo
- **THEN** se pueden abrir solicitudes, alternar perfiles y ver ejemplos de cada alerta en el tablero
- **AND** se puede radicar otro caso para un cliente ficticio precargado

### Requirement: Importación del directorio de clientes

La aplicación SHALL permitir al coordinador importar clientes mediante CSV o JSON con NIT y razón social. El CSV usará los encabezados `nit,razon_social` y el JSON será un arreglo de objetos con esas mismas claves. El NIT se tratará como texto y la aplicación mostrará el resultado de la importación.

#### Scenario: Agregar clientes desde CSV o JSON

- **WHEN** el coordinador importa un directorio válido
- **THEN** los nuevos clientes aparecen en el selector de radicación y las solicitudes e historiales se conservan
- **AND** los NIT ya existentes se omiten y se informan junto con la cantidad de clientes agregados

#### Scenario: Importar una razón social con comas y un NIT con ceros iniciales

- **WHEN** el coordinador importa una fila CSV con NIT `001234` y razón social `"Papelería Aurora, S. A. S."`
- **THEN** ambos valores se conservan completos y el cliente se puede buscar por `001234`

#### Scenario: Rechazar un directorio inválido

- **WHEN** se importa un archivo con estructura inválida o filas sin NIT o razón social
- **THEN** se muestra un diagnóstico y el directorio sigue disponible con sus datos previos

### Requirement: Respaldo y restauración

La aplicación SHALL permitir al coordinador exportar en un JSON versionado el directorio, perfiles, solicitudes, historial y datos necesarios para continuar los consecutivos y turnos. Restaurar un respaldo válido reemplazará la sesión actual tras confirmación.

#### Scenario: Continuar en otra sesión

- **WHEN** se guarda el respaldo, se reabre el HTML y el coordinador restaura el JSON válido
- **THEN** se recuperan los registros y sus vínculos
- **AND** la próxima radicación continúa el consecutivo y el turno del respaldo

#### Scenario: Cancelar una restauración

- **WHEN** el coordinador cancela la confirmación de restaurar un respaldo válido
- **THEN** se conservan los datos y los contadores de la sesión actual

#### Scenario: Rechazar respaldo dañado o incompatible

- **WHEN** se intenta restaurar un respaldo inválido, con versión incompatible o referencias inexistentes
- **THEN** aparece el motivo del rechazo y la sesión conserva sus datos y contadores
