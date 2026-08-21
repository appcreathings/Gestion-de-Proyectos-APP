# Tasks 062 — Tipos de trabajo

Fases secuenciales. Después de cada una: `npx tsc --noEmit` y
`npx vitest run --exclude ".worktrees/**"` verdes.

## Fase A — Dominio

- [ ] A1 `WorkType` enum + `SCHEMA_VERSION = 22` en `common.ts`
- [ ] A2 Campos en `TaskSchema` (`workType`, `krCurrent`, `krTarget`, `krUnit`)
- [ ] A3 `CreateTaskOutputSchema.workType` opcional
- [ ] A4 `newTask()` con defaults
- [ ] A5 Migración `{ to: 22 }` en `projects` y `flows`
- [ ] A6 Tests: parse tarea sin workType → `task`; migración v21→v22; test de
      `SCHEMA_VERSION` actualizado a 22; `newTask().workType === "task"`

## Fase B — Labels, badge, KR

- [ ] B1 `workTypeLabel` / `workTypeVariant` / `WORK_TYPE_OPTIONS`
- [ ] B2 `WorkTypeBadge` (no render si `task`)
- [ ] B3 `krProgress()` + tests (nulls, target 0, clamp >1, 0.5)

## Fase C — Forms y cards

- [ ] C1 Select Tipo en `TaskFormDialog`
- [ ] C2 Select Tipo + hints spike/PRD + campos KR en `TaskDetailDrawer`
- [ ] C3 Badge (+ barra KR compacta) en `TaskCard` y `KanbanListView`
- [ ] C4 Fila de Mis tareas muestra `WorkTypeBadge`

## Fase D — Filtros

- [ ] D1 Kanban `TasksTab`: param `workType`, select, clear, contador
- [ ] D2 `filterMyTasks` parse/filter/clear + test
- [ ] D3 Select Tipo en `MyTasksPage` (entra en Limpiar filtros)

## Fase E — IA y flujos

- [ ] E1 `create_task` / `update_task` + `taskView`
- [ ] E2 Engine `createTask` asigna `workType` si es válido
- [ ] E3 Select opcional en `ActionConfigFields` case `createTask`
- [ ] E4 Test de shapes: `workType` no required

## Fase F — Cierre

- [ ] F1 typecheck + test + lint (no fallar por `useBreakpoint` preexistente)
- [ ] F2 `graphify update .`
- [ ] F3 Spec → **IMPLEMENTADO**; casillas de este archivo
- [ ] F4 Smoke manual (si hay browser): crear historia/spike/KR/bug/PRD, filtrar
      Kanban y Mis tareas, recargar URL
