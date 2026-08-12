# Tasks 057 — GitHub App y sincronización local-first

Numeración T5700+. Estado inicial: planificación.

## Fase 0 — Contratos y seguridad

- [ ] **T5700** — Definir schema de `GitHubConnection`, `GitHubLink`, `GitHubMapping` y `GitHubSyncRun`.
- [ ] **T5701** — Añadir migración y bump de `schemaVersion`.
- [ ] **T5702** — Añadir provider `github` a `connections.ts` sin romper providers existentes.
- [ ] **T5703** — Documentar backend mínimo, variables de entorno y límites de secreto.
- [ ] **T5704** — Tests de serialización, migración y ausencia de secretos en exportaciones.
- [ ] **Checkpoint 0:** typecheck + tests de storage/connections.

## Fase 1 — GitHub App

- [ ] **T5710** — Implementar endpoint de inicio OAuth/App.
- [ ] **T5711** — Implementar callback con validación de `state`.
- [ ] **T5712** — Implementar validación de instalación y token temporal.
- [ ] **T5713** — Implementar endpoint normalizado de identidad, repositorios y Projects.
- [ ] **T5714** — Implementar errores de permisos, revocación, timeout y rate limit.
- [ ] **Checkpoint 1:** conectar, instalar sobre repositorio seleccionado y desconectar.

## Fase 2 — Vinculación e importación

- [ ] **T5720** — UI de conexión y selección de repositorio/Project.
- [ ] **T5721** — Guardar vínculo al proyecto local.
- [ ] **T5722** — Importar issues paginados y normalizar labels/assignees/status.
- [ ] **T5723** — Crear mappings estables e idempotentes.
- [ ] **T5724** — UI de mapeo de estados, prioridad y labels.
- [ ] **Checkpoint 2:** importar sin duplicados y conservar datos locales.

## Fase 3 — Publicación y sincronización

- [ ] **T5730** — Publicación explícita de tareas locales hacia issues.
- [ ] **T5731** — Actualización incremental por hash y `updated_at`.
- [ ] **T5732** — Implementar frecuencias, próxima ejecución, foco de ventana y pausa.
- [ ] **T5733** — Implementar cancelación, backoff y pausa tras tres fallos.
- [ ] **T5734** — Implementar conflictos y estado `remote-missing` sin borrado automático.
- [ ] **T5735** — Historial de ejecuciones y resumen de resultados.
- [ ] **Checkpoint 3:** sincronización manual y programada mientras la app está abierta.

## Fase 4 — Cierre

- [ ] **T5740** — Tests unitarios, integración API mock y E2E del flujo completo.
- [ ] **T5741** — Auditoría de XSS/Markdown, logs y secretos.
- [ ] **T5742** — Documentación de usuario y guía `github-app-setup.md`.
- [ ] **T5743** — Ejecutar `typecheck`, `lint`, `test` y `build`.
- [ ] **T5744** — Actualizar roadmap y progreso del spec.
