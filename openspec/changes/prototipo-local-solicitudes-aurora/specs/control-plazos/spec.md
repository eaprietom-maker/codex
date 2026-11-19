# Control de plazos

## Purpose

Detectar solicitudes que se acercan al vencimiento y comprobar si la atención se completó dentro del plazo de servicio.

## ADDED Requirements

### Requirement: Plazo por solicitud

La aplicación SHALL calcular el vencimiento como 48 horas corridas desde la recepción, incluidas noches, fines de semana y festivos. En el detalle mostrará la fecha y hora límite y, mientras el caso esté activo, el tiempo restante o transcurrido desde el vencimiento.

#### Scenario: Consultar el plazo durante un fin de semana

- **WHEN** se consulta un caso recibido el viernes a las 10:00
- **THEN** el plazo mostrado vence el domingo a las 10:00 en hora de Colombia

### Requirement: Tablero del coordinador

El tablero SHALL agrupar los casos activos en menos de 24 horas, desde 24 hasta menos de 36 horas, desde 36 horas hasta el límite de 48 horas y vencidos después del límite. Cada grupo mostrará un contador y permitirá consultar sus casos. Los avisos se identificarán con texto además de color.

#### Scenario: Mantener el plazo mientras se espera una respuesta interna

- **WHEN** una solicitud pasa a Pendiente logística o Pendiente ventas
- **THEN** conserva la fecha límite original y sigue en el tramo que le corresponde en el tablero

#### Scenario: Recalcular alertas durante la sesión

- **WHEN** un caso activo alcanza las 24 horas, alcanza las 36 horas o supera las 48 horas mientras la aplicación está abierta
- **THEN** el tablero actualiza su grupo, su contador y el aviso visual correspondiente

### Requirement: Cumplimiento al resolver

La aplicación SHALL registrar la fecha de resolución y las horas transcurridas entre recepción y resolución. El indicador del coordinador mostrará la proporción de casos con resolución dentro de las 48 horas sobre el total de casos con resolución registrada.

#### Scenario: Resolver en el límite

- **WHEN** un agente resuelve un caso exactamente a las 48 horas de su recepción
- **THEN** el caso cuenta como atendido dentro del plazo y sale de las alertas activas

#### Scenario: Resolver después del vencimiento

- **WHEN** un agente resuelve un caso después de las 48 horas de su recepción
- **THEN** se registra como resuelto fuera de plazo y deja de sumar en el contador de vencidos activos

#### Scenario: Calcular el indicador con casos cerrados

- **GIVEN** un caso cerrado que se resolvió dentro del plazo, un caso resuelto fuera de plazo y un caso activo vencido
- **WHEN** el coordinador abre el tablero
- **THEN** el indicador de cumplimiento muestra 50 % sobre los dos casos con resolución registrada

#### Scenario: Consultar el indicador sin resoluciones

- **WHEN** el coordinador abre el tablero y ningún caso tiene una resolución registrada
- **THEN** el indicador muestra que aún no hay casos resueltos
