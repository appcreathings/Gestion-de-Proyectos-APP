# Tasks 062 — Tipos de trabajo

Fases secuenciales. Después de cada una: `npx tsc --noEmit` y
`npx vitest run --exclude ".worktrees/**"` verdes.

## Fase A — Dominio

- [x] A1 `WorkType` enum + `SCHEMA_VERSION = 22` en `common.ts`
- [x] A2 Campos en `TaskSchema` (`workType`, `krCurrent`, `krTarget`, `krUnit`)
- [x] A3 `CreateTaskOutputSchema.workType` opcional
- [x] A4 `newTask()` con defaults
- [x] A5 Migración `{ to: 22 }` en `projects` y `flows`
- [x] A6 Tests: parse tarea sin workType → `task`; migración v21→v22; test de
      `SCHEMA_VERSION` actualizado a 22; `newTask().workType === "task"`

## Fase B — Labels, badge, KR

- [x] B1 `workTypeLabel` / `workTypeVariant` / `WORK_TYPE_OPTIONS`
- [x] B2 `WorkTypeBadge` (no render si `task`)
- [x] B3 `krProgress()` + tests (nulls, target 0, clamp >1, 0.5)

## Fase C — Forms y cards

- [x] C1 Select Tipo en `TaskFormDialog`
- [x] C2 Select Tipo + hints spike/PRD + campos KR en `TaskDetailDrawer`
- [x] C3 Badge (+ barra KR compacta) en `TaskCard` y `KanbanListView`
- [x] C4 Fila de Mis tareas muestra `WorkTypeBadge`

## Fase D — Filtros

- [x] D1 Kanban `TasksTab`: param `workType`, select, clear, contador
- [x] D2 `filterMyTasks` parse/filter/clear + test
- [x] D3 Select Tipo en `MyTasksPage` (entra en Limpiar filtros)

## Fase E — IA y flujos

- [x] E1 `create_task` / `update_task` + `taskView`
- [x] E2 Engine `createTask` asigna `workType` si es válido
- [x] E3 Select opcional en `ActionConfigFields` case `createTask`
- [x] E4 Test de shapes: `workType` no required

## Fase F — Cierre

- [x] F1 typecheck + test + lint (no fallar por `useBreakpoint` preexistente)
- [x] F2 `graphify update .`
- [x] F3 Spec → **IMPLEMENTADO**; casillas de este archivo
- [ ] F4 Smoke manual (si hay browser): crear historia/spike/KR/bug/PRD, filtrar
      Kanban y Mis tareas, recargar URL — pendiente: este entorno no tiene browser
