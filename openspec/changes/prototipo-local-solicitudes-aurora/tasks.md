# Tareas de implementación

## 1. Archivo y datos de demostración

- [ ] 1.1 Crear `comercial-aurora.html` con CSS y JavaScript incorporados. Abrirlo por doble clic con la red deshabilitada y comprobar que carga la interfaz sin peticiones externas.
- [x] 1.2 Precargar clientes y solicitudes ficticias con antigüedades relativas a la apertura. Comprobar que hay ejemplos en los cuatro tramos para casos activos, casos resueltos a tiempo y fuera de plazo, y solicitudes asignadas a cada agente.

## 2. Registro y seguimiento

- [x] 2.1 Implementar el formulario, los catálogos de la especificación A05 y la asignación por turnos. Registrar cuatro casos válidos y comprobar la rotación, el identificador mensual, el estado inicial y el rechazo de una descripción incompleta sin avanzar el turno.
- [x] 2.2 Implementar bandeja, filtros, detalle y selector de perfiles. Comprobar que cada agente ve sus casos y que el coordinador consulta y filtra la bandeja completa.
- [x] 2.3 Implementar transiciones, resolución con respuesta, cierre, reasignación e historial. Verificar el responsable anterior y nuevo en una reasignación y confirmar que cada transición registra el perfil actuante.

## 3. Control de plazos

- [x] 3.1 Implementar el cálculo a 48 horas corridas y la visualización en hora de Colombia. Comprobar un caso de viernes a domingo y resoluciones a las 48 horas exactas y después del plazo.
- [x] 3.2 Implementar el tablero del coordinador con los contadores, avisos y acceso a los casos por tramo. Verificar cambios de tramo a las 24 y 36 horas, vencimiento después de las 48 horas, salida del tablero de alertas al resolver y actualización del porcentaje resuelto a tiempo.

## 4. Importación y respaldo

- [x] 4.1 Importar el directorio CSV o JSON y mostrar el formato esperado. Probar clientes nuevos, duplicados, razones sociales con comas y archivos inválidos sin alterar el directorio vigente en caso de rechazo.
- [x] 4.2 Exportar y restaurar un respaldo JSON versionado. Cerrar y reabrir el HTML, restaurar el archivo y comprobar que se conservan los datos, el historial, el consecutivo y el turno. Probar un respaldo incompatible y confirmar que la sesión previa se conserva.

## 5. Aceptación en navegador

- [x] 5.1 Ejecutar de principio a fin un recorrido de radicación, asignación, resolución y respaldo con red deshabilitada, usando el HTML final. Revisar el uso con teclado y la presentación en tamaños móvil y escritorio.
