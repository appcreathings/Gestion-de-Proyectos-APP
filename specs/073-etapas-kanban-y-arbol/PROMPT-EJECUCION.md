# Prompt de ejecución — Spec 073

> Pegar esto como **primer mensaje** en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 073 de este proyecto: `specs/073-etapas-kanban-y-arbol/`.

Es una feature ya diseñada. Tiene dos partes: **etapas del kanban por proyecto** (alta, nombre, color, orden, borrado, archivar lo visible en Hecha) y **un botón en el árbol del sidebar** para abrir o cerrar todos los productos. **No re-diseñes ni re-preguntes el alcance.** Ejecutá `spec.md`, `design.md` y `tasks.md`. Si algo es ambiguo al borde de una decisión ya documentada, elegí la opción de D1–D15 y seguí. Si `design.md` y `spec.md` chocan, gana el spec. Solo preguntá si chocás con un invariante real o un bug bloqueante.

## Orden de lectura obligatorio (antes de tocar código)

1. `CLAUDE.md` — hay grafo en `graphify-out/`. `graphify query "..."` antes de leer a ciegas; `graphify update .` al terminar.
2. `.specify/memory/constitution.md` — si tasks contradice la constitución, gana la constitución y avisá.
3. `specs/073-etapas-kanban-y-arbol/spec.md` — D1–D15 y HU-01…07. **Esto manda.**
4. `specs/073-etapas-kanban-y-arbol/design.md` — tipos, operaciones, tablero, Mis tareas, árbol, tests §9.
5. `specs/073-etapas-kanban-y-arbol/tasks.md` — fases A→E. D puede ir en paralelo con A. B y C esperan a A.
6. Código de referencia (releerlo; puede haber cambiado):
   - `src/domain/schemas/common.ts` — `SCHEMA_VERSION` 23, enum `TaskStatus`
   - `src/domain/schemas/project.ts` — `Task.status`, `Project.wipLimits`
   - `src/domain/projectOps.ts` — `updateTask`
   - `src/domain/migrations.ts` — el paso v23 y `migrateRecord`
   - `src/domain/labels.ts` — `TASK_COLUMNS`, `taskStatusLabel` (se quedan para flujos e IA)
   - `src/features/projects/components/TasksTab.tsx` — `NEXT` / `PREV`, filtros, `handleBulkArchive`
   - `src/features/projects/components/kanban/KanbanColumn.tsx`
   - `src/components/layout/ProjectTree.tsx`
   - `src/features/my-tasks/filterMyTasks.ts`

## Rama

`feat/073-etapas-kanban-y-arbol` desde el estado actual de la rama de trabajo. No cambies de rama si ya estás parado ahí con el working tree de esta spec. No pushees.

## Qué hay que lograr

- Cada proyecto guarda `stages`: las cuatro de siempre (`todo`, `doing`, `blocked`, `done`) más las que la persona agregue. Migración a `SCHEMA_VERSION` **24**. Las tareas viejas no cambian de `status`.
- Una tarea está terminada solo si `status === "done"`. Renombrar Hecha no cambia eso. Una etapa nueva es trabajo abierto.
- Se puede crear, renombrar, recolorar, reordenar y borrar. Hecha queda última y no se borra. Las otras tres base tampoco se borran. Borrar una etapa nueva mueve todas sus tareas (archivadas incluidas) a la columna vecina.
- El color es una de 8 claves, un punto en el encabezado. La tarjeta sigue pintándose por urgencia.
- En Hecha, «Archivar N» archiva las tareas **visibles** con los filtros actuales, en un solo `mutate`, y las deja en Archivadas con el mismo status.
- Mis tareas gana `status=otras`. Flujos e IA siguen ofreciendo solo los cuatro id base.
- En el árbol, «Abrir todos» / «Cerrar todos». Cerrar todos incluye el producto del proyecto abierto y no se vuelve a abrir hasta cambiar de proyecto.

## Reglas de trabajo

- TDD en la fase A y en el filtro de C: el test nuevo falla antes del código. No adelantes la implementación para que el test nazca verde.
- PowerShell: sin `&&`. Un comando por línea.
- Copy de UI en rioplatense, tuteo, como está escrito en el spec y el design. No inventes otro texto.
- No agregues librerías. No toques `wipLimits`, el color de `TaskCard`, ni el catálogo de estados de flujos y de IA.
- No hagas commit de fases a medias rotas. Los commits sugeridos están al final de `tasks.md`; hacelos solo si el usuario no pidió lo contrario en este chat. Si no te pidieron commit, dejá los cambios en el working tree y decilo.
- Marcá las casillas de `tasks.md` cuando el comando correspondiente salió verde.

## Trampas (leé design §10)

- `taskStatusLabel[task.status]` no va a compilar cuando `status` sea `string`. No lo castees a `TaskStatus`. Usá `stageLabel` o un `statusLabel` ya resuelto.
- Un literal `Project` sin `stages` deja de asignar al tipo. El default de Zod no cubre eso.
- Archivar con varios `mutate` escribe N veces. Un `reduce` adentro de un solo `mutate`.
- `removeStage` tiene que mover también las archivadas. Si no, al desarchivar aparecen en una columna fantasma.
- `moveStage` de `done` es un no-op aunque el menú esconda el ítem.
- El `useEffect` del árbol depende solo de `activeGroupId`. `skipGroup` compara el **id** del grupo. Un boolean que se traga el efecto siguiente no abre el producto al navegar.
- El ghost de un status desconocido no se persiste.
- `applyStatus("otras")` no escribe `done=1`.
- El pin `expect(SCHEMA_VERSION).toBe(23)` de `src/ai/keys-never-exported.test.ts` y el caso «versión actual» de `migrations.test.ts` tienen que pasar a 24. Los tests que migran hacia v22 o v23 a propósito no se reescriben.

## Definición de hecho

- [ ] Fases A–E de `tasks.md`
- [ ] HU-01…HU-07 del spec
- [ ] Tests de design §9 verdes
- [ ] `npx tsc --noEmit` y `npx vitest run --exclude ".worktrees/**"`
- [ ] `graphify update .`
- [ ] `spec.md` → **IMPLEMENTADO**
- [ ] Smoke de `tasks.md`. Si no hay browser, anotá qué no se pudo clicar.

Si al terminar el usuario quiere merge: no pushees a origin a menos que te lo pidan.
