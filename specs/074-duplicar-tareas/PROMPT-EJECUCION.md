# Prompt de ejecución — Spec 074

> Pegar esto como **primer mensaje** en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 074 de este proyecto: `specs/074-duplicar-tareas/`.

Es una feature ya diseñada: **duplicar tareas del kanban** en el mismo proyecto (instantáneo, abre el drawer de la copia), en otro proyecto (diálogo) y en lote desde la selección múltiple. **No re-diseñes ni re-preguntes el alcance.** Ejecuta `spec.md`, `design.md` y `tasks.md`. Si algo es ambiguo al borde de una decisión ya documentada, elige la opción de D1–D17 y sigue. Si `design.md` y `spec.md` chocan, gana el spec. Solo pregunta si chocas con un invariante real o un bug bloqueante.

## Orden de lectura obligatorio (antes de tocar código)

1. `CLAUDE.md` — hay grafo en `graphify-out/`. `graphify query "..."` antes de leer a ciegas; `graphify update .` al terminar.
2. `.specify/memory/constitution.md` — si tasks contradice la constitución, gana la constitución y avisa.
3. `specs/074-duplicar-tareas/spec.md` — D1–D17 y HU-01…07. **Esto manda.**
4. `specs/074-duplicar-tareas/design.md` — dominio, diálogo, cableado, tests §6, trampas §7.
5. `specs/074-duplicar-tareas/tasks.md` — fases A→D.
6. Código de referencia (releerlo; puede haber cambiado):
   - `src/domain/schemas/project.ts` — `TaskSchema`, `SubtaskSchema`, `TaskLinkSchema`
   - `src/domain/factories.ts` — `newTask`, imports de `uuid`/`nowIso`
   - `src/domain/projectOps.ts` — `addTask`, `updateTask`
   - `src/automations/events.ts` y `events.test.ts` — diff que emite `task.added`
   - `src/features/projects/components/TasksTab.tsx` — `mutate`, `openDetail`, barra de selección, `DragOverlay`
   - `src/features/projects/components/kanban/TaskCard.tsx` — menú `⋯`
   - `src/features/projects/components/kanban/TaskDetailDrawer.tsx` — pie con Archivar
   - `src/store/useDataStore.ts` — `mutateProject`, `projects`
   - `src/store/useToastStore.ts`

## Rama

`feat/074-duplicar-tareas` desde el estado actual de `main`. No pushees.

## Qué hay que lograr

- La copia trae el trabajo: título, descripción, resumen, prioridad, tipo, `krTarget`/`krUnit`, responsable, fecha, estimación, tags, links (ids nuevos) y subtareas (ids nuevos, todas sin marcar).
- La copia no trae historia: `status "todo"`, sin archivar, sin comentarios, adjuntos, horas reales, `krCurrent`, `sourceItemId` ni `dedupeKey`. No entra en hitos.
- Mismo proyecto: título + « (copia)» (sin repetir), justo después de la original en el array, conserva área y sprint.
- Otro proyecto: título igual, al final del destino, área y sprint en `null`. El origen no cambia.
- Una sola escritura por confirmación. Cada copia emite `task.added`.
- Sin cambio de esquema: `SCHEMA_VERSION` sigue en 24.

## Reglas de trabajo

- TDD en la fase A: el test nuevo falla antes del código.
- PowerShell: sin `&&`. Un comando por línea.
- Copy de UI exactamente como spec §5. No inventes otro texto.
- No agregues librerías. No toques esquemas, migraciones, flujos ni herramientas de IA.
- No hagas commit de fases a medias rotas. Commits sugeridos al final de `tasks.md`; hazlos solo si el usuario no pidió lo contrario en este chat.
- Marca las casillas de `tasks.md` cuando el comando correspondiente salió verde.

## Definición de hecho

- [ ] Fases A–D de `tasks.md`
- [ ] HU-01…HU-07 del spec
- [ ] Tests de design §6 verdes
- [ ] `npx tsc --noEmit`, `npx vitest run --exclude ".worktrees/**"`, `npx vite build`
- [ ] `graphify update .`
- [ ] `spec.md` → **IMPLEMENTADO**
- [ ] Smoke de `tasks.md` D5. Si no hay browser, anota qué no se pudo clicar.
