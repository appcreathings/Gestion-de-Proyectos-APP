# Tasks — Archivado de tareas (015)

Tareas numeradas por fase. `[P]` = paralelizable dentro de la fase. Cada fase deja la app usable de
punta a punta y termina con `tsc --noEmit` + `vitest run` + smoke visual manual confirmado antes de
avanzar.

**Prerequisito:** spec 013 (kanban-task-detail-drawer) debe estar implementado y mergeado.

## Fase 1 — Schema y migración
- [ ] T1501 `src/domain/schemas/common.ts`: actualizar `SCHEMA_VERSION` de 4 a 5.
- [ ] T1502 `src/domain/schemas/project.ts`: agregar `archived: z.boolean().default(false)` a
  `TaskSchema`.
- [ ] T1503 `src/domain/migrations.ts`: agregar migración v4→v5 que agrega `archived: false` a tareas
  existentes (si no tienen el campo).
- [ ] T1504 `src/domain/factories.ts`: actualizar `newTask()` para incluir `archived: false`.
- [ ] T1505 Verificar: `npx tsc --noEmit` y `npx vitest run` pasan sin errores.

## Fase 2 — Filtrado y toggle en TasksTab
- [ ] T1510 `TasksTab.tsx`: filtrar `project.tasks` para excluir `archived: true` por defecto. El
  filtro se aplica antes de derivar las columnas del kanban.
- [ ] T1511 `TasksTab.tsx`: agregar estado `showArchived: boolean` (default: false).
- [ ] T1512 `TasksTab.tsx`: agregar toggle/botón "Archivadas" en la barra del kanban (junto a filtros
  de área y sprint). Mostrar contador de tareas archivadas.
- [ ] T1513 `TasksTab.tsx`: cuando `showArchived` es true, ocultar el kanban y mostrar componente
  `ArchivedTasksList` (se crea en fase 3). Por ahora, mostrar un placeholder.
- [ ] T1514 `TasksTab.tsx`: cuando `showArchived` es true, el `SprintSwitcher` no cuenta tareas
  archivadas.
- [ ] T1515 Verificar: tareas archivadas no aparecen en el tablero por defecto, toggle funciona
  (aunque el placeholder se muestre).

## Fase 3 — ArchivedTasksList y botones de archivar
- [ ] T1520 Crear `src/features/projects/components/kanban/ArchivedTasksList.tsx` con lista plana de
  tareas archivadas.
- [ ] T1521 `ArchivedTasksList.tsx`: implementar ordenamiento por fecha de archivado (default: más
  reciente primero) o fecha de creación.
- [ ] T1522 `ArchivedTasksList.tsx`: cada card muestra título, summary, status, priority, assignee,
  fecha de archivado. Click abre drawer en modo lectura.
- [ ] T1523 `TaskDetailDrawer.tsx`: agregar botón "Archivar" al final del drawer (con ícono `Archive`).
  Si la tarea ya está archivada, el botón cambia a "Desarchivar" (ícono `ArchiveRestore`).
- [ ] T1524 `TaskDetailDrawer.tsx`: implementar lógica de archivar/desarchivar: llamar a `mutate()` con
  `ops.updateTask(taskId, { archived: true/false })`. Cerrar el drawer después de archivar.
- [ ] T1525 `TaskCard.tsx`: agregar menú contextual "..." (ícono `MoreVertical`) con opciones: Editar,
  Archivar, Eliminar. Implementar dropdown con shadcn/ui `DropdownMenu`.
- [ ] T1526 `TaskCard.tsx`: implementar acción "Archivar" en el menú: llamar a `mutate()` con
  `ops.updateTask(taskId, { archived: true })`.
- [ ] T1527 Verificar: archivar desde drawer y card funciona, lista de archivadas se muestra
  correctamente, desarchivar restaura la tarea al tablero.

## Fase 4 — Integración con actividad y OverviewTab
- [ ] T1530 `src/automations/events.ts`: agregar detección de eventos `task.archived` y
  `task.unarchived`. Comparar `prevTask.archived` vs `nextTask.archived`.
- [ ] T1531 `src/automations/activity.ts`: agregar mensajes para `task.archived` ("Tarea 'X' archivada")
  y `task.unarchived` ("Tarea 'X' desarchivada").
- [ ] T1532 `src/features/projects/components/ActivityTab.tsx`: verificar que click en entrada de
  actividad de archivado abre drawer con `?detail=<taskId>`.
- [ ] T1533 `src/features/projects/components/OverviewTab.tsx`: ajustar progreso para incluir tareas
  archivadas si su status es "done". Mostrar "archivadas" en el tooltip para claridad.
- [ ] T1534 Verificar: eventos se registran en activity log, mensajes aparecen correctamente, progreso
  se calcula correctamente.
- [ ] T1535 Verificar final: `npx tsc --noEmit`, `npx vitest run`, `npm run build` pasan sin errores.
  Smoke visual de HU-01 a HU-05. Actualizar memoria del proyecto con resumen de 015.

## Explícitamente fuera de este tasks.md
- Archivado automático de tareas hechas después de X días
- Eliminación permanente de tareas archivadas (purge)
- Exportar tareas archivadas a CSV/JSON
- Búsqueda dentro de tareas archivadas
- Archivado de proyectos completos (ya existe `ProjectStatus.archived`)

## Verificación por fase
Tras cada fase: `npx tsc --noEmit`, `npx vitest run`, smoke visual manual en dev server de los
casos listados. No se avanza con typecheck o tests rotos, ni sin confirmación visual. Al cerrar la
fase 4: `npm run build` y actualización de la memoria del proyecto con el resumen de 015.
