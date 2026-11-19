# Seguimiento de solicitudes

## Purpose

Dar a Comercial Aurora una forma de registrar cada solicitud, asignar un responsable y reconstruir lo ocurrido hasta su cierre.

## ADDED Requirements

### Requirement: Radicación manual y asignación por turnos

La aplicación SHALL registrar el canal, cliente, tipo y descripción de cada solicitud, generar un identificador mensual único e inmutable en formato `AUR-YYYYMM-XXXX`, guardar el instante de recepción en formato ISO 8601 a partir del reloj del navegador y asignar el caso en estado Nuevo a uno de los cuatro agentes mediante rotación.

#### Scenario: Registrar cuatro solicitudes consecutivas

- **WHEN** se guardan cuatro solicitudes válidas consecutivas de un cliente del directorio por teléfono, correo o mensajería
- **THEN** cada caso recibe un identificador distinto y los cuatro agentes reciben un caso cada uno
- **AND** el historial de cada caso registra su radicación y responsable

#### Scenario: Catálogos de radicación

- **WHEN** se abre el formulario de radicación
- **THEN** el canal se elige entre Mensajería, Correo electrónico y Llamada telefónica
- **AND** el tipo se elige entre Consulta de stock, Estado del pedido, Inconformidad de envío, Facturación y cobro, y Devolución
- **AND** el cliente se elige por NIT o razón social del directorio y se puede indicar una referencia de pedido opcional

#### Scenario: Primera radicación del mes

- **WHEN** se radica una solicitud en un mes sin tickets previos, según la hora de Colombia
- **THEN** su identificador termina en `0001` con el nuevo año y mes
- **AND** se conserva el siguiente turno de asignación del equipo

#### Scenario: Datos incompletos

- **WHEN** faltan el canal, el cliente o el tipo, o la descripción tiene menos de diez caracteres
- **THEN** se indican los campos que requieren corrección y se conserva el formulario sin crear un caso ni avanzar el turno

### Requirement: Bandeja y perfiles simulados

La aplicación SHALL ofrecer un selector de cuatro agentes y un coordinador. Cada agente podrá radicar casos y consultar o gestionar los que tenga asignados. El coordinador podrá consultar todos los casos, abrir el tablero y reasignar casos activos.

#### Scenario: Cambiar de agente a coordinador

- **WHEN** se cambia del perfil de un agente al de coordinador
- **THEN** la bandeja pasa de mostrar las solicitudes asignadas al agente a mostrar las de todo el equipo
- **AND** quedan disponibles el tablero y la reasignación

#### Scenario: Consultar solicitudes por filtros

- **WHEN** un usuario busca por identificador, NIT o nombre del cliente, o filtra por estado, canal o responsable
- **THEN** la bandeja muestra los resultados que coinciden dentro del alcance de su perfil

#### Scenario: Radicar un caso asignado a otro agente

- **WHEN** un agente registra una solicitud y el turno corresponde a otro agente
- **THEN** el formulario confirma el identificador y el responsable asignado
- **AND** el nuevo caso aparece en la bandeja del responsable y en la del coordinador

### Requirement: Estados e historial

La aplicación SHALL registrar los cambios de estado y las reasignaciones como eventos consultables por solicitud, con fecha, perfil actuante, acción y valores anterior y nuevo cuando corresponda.

#### Scenario: Seguir un caso activo hasta el cierre

- **GIVEN** un caso en estado Nuevo
- **WHEN** el responsable inicia la atención y pasa por En proceso, Pendiente logística o Pendiente ventas según corresponda
- **THEN** puede continuar el trabajo en cualquiera de esos tres estados, registrar una respuesta de fondo para marcarlo como Resuelto y cerrarlo desde Resuelto
- **AND** el detalle muestra el estado vigente y el historial conserva los eventos anteriores en orden cronológico de registro

#### Scenario: Impedir una transición inválida

- **WHEN** se intenta cerrar un caso activo directamente, resolverlo con una respuesta vacía o cambiar un caso Cerrado
- **THEN** se conserva el estado anterior y el historial permanece intacto

#### Scenario: Reasignar un caso activo

- **WHEN** el coordinador asigna un caso activo a otro agente
- **THEN** se conserva el ticket y el caso aparece en la bandeja del nuevo agente
- **AND** el evento de reasignación muestra el responsable anterior, el nuevo y el perfil que hizo el cambio
