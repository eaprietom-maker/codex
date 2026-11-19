# Correo de resolución y cierre

## Purpose

Informar al cliente cuando Comercial Aurora resuelve o cierra su solicitud y dejar constancia del resultado de cada aviso.

## ADDED Requirements

### Requirement: Notificar al cliente al resolver o cerrar una solicitud

Al guardar una transición válida a Resuelto o Cerrado, el sistema SHALL enviar automáticamente un correo al contacto válido del cliente asociado a la solicitud. Cada transición genera un aviso distinto. El aviso incluye el identificador del ticket y el nuevo estado. El aviso de resolución incluye la respuesta de fondo destinada al cliente.

#### Scenario: Avisar que la solicitud fue resuelta

- **GIVEN** una solicitud activa con un correo de contacto válido
- **WHEN** el agente registra la respuesta de fondo y guarda la transición a Resuelto
- **THEN** se envía un correo de resolución al cliente con el identificador del ticket y la respuesta
- **AND** el correo excluye las notas internas y el historial de la solicitud

#### Scenario: Avisar del cierre posterior

- **GIVEN** una solicitud Resuelta que ya generó su correo de resolución
- **WHEN** el agente guarda la transición a Cerrado
- **THEN** se envía un correo de cierre con el identificador del mismo ticket y el estado Cerrado

#### Scenario: Evitar avisos por acciones sin transición

- **WHEN** se consulta o restaura una solicitud, se repite la misma operación de guardado o se cambia a un estado distinto de Resuelto y Cerrado
- **THEN** el sistema no genera otro aviso por esas acciones

### Requirement: Mostrar el resultado del aviso

El sistema SHALL registrar en el historial el estado que originó el aviso y su resultado. Solo marcará el aviso como enviado cuando el servicio de correo confirme que lo aceptó. La ausencia de correo, la falta de conexión y el error del servicio no revocan ni impiden la transición de la solicitud.

#### Scenario: Cliente sin correo válido

- **WHEN** se resuelve o cierra una solicitud cuyo contacto carece de correo válido
- **THEN** se guarda la transición y el historial indica que se omitió el aviso por falta de un correo válido

#### Scenario: Servicio no disponible o respuesta incierta

- **WHEN** se guarda la transición y el servicio rechaza el correo, no hay conexión o no se puede confirmar que el servicio aceptó el mensaje
- **THEN** el estado de la solicitud permanece guardado y el historial identifica el envío como fallido o pendiente de confirmación, según corresponda
- **AND** procesar otra vez el mismo aviso no genera otro correo si el primero ya fue aceptado
