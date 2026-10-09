# Tasks 074 — Duplicar tareas

Fases en orden. Después de A:
`npx vitest run --exclude ".worktrees/**" src/domain/duplicateTask.test.ts src/automations/events.test.ts`.
Después de B y de C: `npx tsc --noEmit`. Al cerrar D, la suite entera con el mismo exclude y `npx vite build`.

TDD en A: el test nuevo falla antes de la implementación. Los tests que ya están verdes tienen que seguir verdes.

Rama: `feat/074-duplicar-tareas`. `SCHEMA_VERSION` **24** (sin cambio).
Snippets: `design.md`. Autoridad: `spec.md` D1–D17.

PowerShell: sin `&&`. Un comando por línea.

## Fase A — Dominio

- [x] A1 Crear `src/domain/duplicateTask.test.ts` con los casos de design §6.1. Deben **fallar** (o no compilar) antes de A2.
- [x] A2 Crear `src/domain/duplicateTask.ts` (design §1): `COPY_SUFFIX`, `copyTitle`, `cloneTask`, `insertTaskCopies`, `appendTasks`. `uuid`/`nowIso` de `@/lib/utils`.
- [x] A3 Caso de design §6.2 en `src/automations/events.test.ts` (`diffProjectEvents`).
- [x] A4 Casos de A1 y A3 verdes.

## Fase B — Diálogo

Deps: A.

- [x] B1 Crear `src/features/projects/components/kanban/DuplicateTasksDialog.tsx` (design §2). Copy de spec §5.
- [x] B2 Sin destinos: texto «No hay otros proyectos activos.» y Duplicar deshabilitado (D14).

## Fase C — Tarjeta, drawer y tablero

Deps: A y B.

- [x] C1 `TaskCard`: props `onDuplicate`/`onDuplicateElsewhere` y los dos ítems del menú (design §3). La instancia del `DragOverlay` recibe no-ops.
- [x] C2 `TaskDetailDrawer`: mismas props y dos botones en el pie (design §3).
- [x] C3 `TasksTab`: `handleDuplicate` (clona fuera del `mutate`, `insertTaskCopies`, `openDetail(copy.id)`), estado del diálogo, `handleConfirmDuplicate` con **una** escritura (design §4).
- [x] C4 Barra de selección: botón «Duplicar» entre «Mover a…» y Archivar; abre el diálogo con `includeCurrent` y limpia la selección al confirmar.
- [x] C5 `npx tsc --noEmit` limpio.

## Fase D — Cierre

Deps: C.

- [x] D1 `npx tsc --noEmit`.
- [x] D2 `npx vitest run --exclude ".worktrees/**"`.
- [x] D3 `npx eslint .` sin errores nuevos.
- [x] D4 `npx vite build`.
- [x] D5 Smoke en navegador, HU-01…07 del spec:
  - Duplicar desde `⋯`: aparece «(copia)» en Por hacer y se abre su drawer.
  - Duplicar desde el drawer de una tarea archivada: copia sin archivar.
  - Duplicar en otro proyecto: toast, tarea al final de Por hacer del destino, sin área ni sprint.
  - Lote de 3 en este proyecto y en otro: orden relativo, selección limpia.
  - Copia sin comentarios, adjuntos ni horas reales; subtareas sin marcar; links y tags presentes.
  - Con una automatización «Al crear una tarea»: se dispara una vez por copia.
- [x] D6 `graphify update .`
- [x] D7 `spec.md` → **IMPLEMENTADO**.

## Commits sugeridos

1. `feat(tasks): clone tasks in the domain (spec 074)` — Fase A
2. `feat(kanban): duplicate tasks from the card, drawer and selection (spec 074)` — Fases B y C
3. `docs(spec 074): mark IMPLEMENTADO and refresh the graph` — Fase D
