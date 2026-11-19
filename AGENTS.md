# Desarrollo con OpenSpec y Codex

- Ejecuta `npm ci` si faltan las dependencias del proyecto. En los ejemplos de las skills, ejecuta `openspec <comando>` como `npm run openspec -- <comando>` para usar la versión del proyecto.
- Para proponer un cambio de software, usa `$openspec-propose` antes de implementarlo. Si el cambio ya existe, consulta su estado con `npm run openspec -- status --change <nombre>` y actualiza los artefactos con `$openspec-update-change` cuando sea necesario.
- Usa `$openspec-apply-change` para implementar las tareas. Valida el cambio con `npm run openspec -- validate <nombre> --strict` y usa `$openspec-archive-change` cuando esté listo para archivarse.
- Las especificaciones vigentes viven en `openspec/specs/`. Los cambios en curso y los archivados viven en `openspec/changes/` y `openspec/changes/archive/`, respectivamente.
