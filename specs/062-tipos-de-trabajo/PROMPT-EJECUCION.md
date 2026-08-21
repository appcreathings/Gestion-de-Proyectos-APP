# Prompt de ejecución — Spec 062

> Pegar esto como **primer mensaje** en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 062 de este proyecto: `specs/062-tipos-de-trabajo/`.

Es una feature ya diseñada: **tipo de trabajo en la tarea** (`workType`: historia,
enabler, spike, key result, bug, PRD, tarea). El Área **no** se convierte en
épica. **No re-diseñes ni re-preguntes el alcance**: ejecutá `spec.md`,
`design.md` y `tasks.md`. Si algo es ambiguo en el borde de una decisión ya
documentada, elegí la opción de “Decisiones fijadas” y seguí. Solo preguntá si
chocás con un invariante real o un bug bloqueante.

## Orden de lectura obligatorio (antes de tocar código)

1. `Claude.md` / `CLAUDE.md` — reglas graphify. Hay grafo en `graphify-out/`:
   `graphify query "..."` antes de leer a ciegas; `graphify update .` al terminar.
2. `specs/062-tipos-de-trabajo/spec.md` — D1–D15, semántica por tipo, HUs, fuera
   de alcance. **Esto manda.**
3. `specs/062-tipos-de-trabajo/design.md` — snippets de schema, labels, KR,
   filtros, IA, flows.
4. `specs/062-tipos-de-trabajo/tasks.md` — fases A→F.
5. Código de referencia (releerlo; puede haber cambiado):
   - `src/domain/schemas/common.ts` (`SCHEMA_VERSION` hoy **21**, enums)
   - `src/domain/schemas/project.ts` (`TaskSchema`)
   - `src/domain/schemas/flow.ts` (`CreateTaskOutputSchema`)
   - `src/domain/factories.ts` (`newTask`)
   - `src/domain/migrations.ts` + `migrations.test.ts` (último paso projects = 19
     con convergencia a 21; flows ya tiene `{ to: 21 }`)
   - `src/domain/labels.ts`
   - `src/features/projects/components/TaskFormDialog.tsx`
   - `src/features/projects/components/kanban/TaskDetailDrawer.tsx`
   - `src/features/projects/components/kanban/TaskCard.tsx`
   - `src/features/projects/components/TasksTab.tsx` (filtros URL)
   - `src/features/my-tasks/filterMyTasks.ts` + `MyTasksPage.tsx` (spec 061)
   - `src/ai/tools/write/task.ts` + `src/ai/tools/serializers.ts` (`taskView`)
   - `src/flows/engine.ts` (~L1104 `newTask` en createTask)
   - `src/features/flows/canvas/ActionConfigFields.tsx` case `"createTask"`

## Baseline al empezar

```bash
npx tsc --noEmit
npx vitest run --exclude ".worktrees/**"
npx eslint src
```

Anotá el número de tests (**1209** al cerrar el 061, puede haber subido). Solo
puede subir o mantenerse. Lint: el error preexistente de `useBreakpoint` no es
de esta spec.

**`SCHEMA_VERSION` 21 → 22.** Sí hay bump y pasos de migración identidad.

## Cómo ejecutar

Seguí `tasks.md` en orden A→F. Después de **cada fase**: typecheck + vitest
con `--exclude ".worktrees/**"`.

1. **A — Dominio** (schema, factory, migración). Sin UI.
2. **B — Labels + `WorkTypeBadge` + `krProgress`**.
3. **C — Forms y cards** (drawer, form, TaskCard, Mis tareas fila).
4. **D — Filtros** Kanban + Mis tareas (`workType=`).
5. **E — IA y flujos**.
6. **F — Cierre**: spec IMPLEMENTADO, `graphify update .`.

Commits por fase, mensajes tipo `feat(tasks): add workType schema (spec 062)`.
PowerShell: `git commit -m "mensaje"` (sin heredoc).

Trabajá en una rama (`feat/062-tipos-de-trabajo`), no en `main`, salvo que te
pidan lo contrario.

## Decisiones ya fijadas — no re-preguntar

1. Campo **`workType`**, no `kind`.
2. Enum: `task | story | enabler | spike | key_result | bug | prd`. Default `task`.
3. **Área intacta.** Sin épicas, sin padre/hijo.
4. Badge **oculto** cuando el tipo es `task`.
5. Spike reusa `estimate` (label “Time-box (h)”). No bloquea guardar sin hours.
6. KR: `krCurrent` / `krTarget` / `krUnit`. UI solo si tipo = key result. Cambiar
   de tipo **no borra** los números. Barra solo si target ≠ 0 y ambos son finite.
7. PRD = descripción. Sin schema extra.
8. URL param `workType`. Inválido → se ignora. Entra en Limpiar filtros de Mis tareas.
9. IA: campo opcional, no `required`.
10. Flows: `workType` string opcional; engine solo asigna si el valor es del enum.
11. Fuera: GitHub types, Daily, calendario, dashboard, bulk, módulo OKR, auto-cierre de spikes.
12. Copy tuteo. Labels ES; valores JSON en inglés.

## Invariantes (no romper)

- No renombrar Área ni tocar `markAreaComplete` / tipos de proyecto.
- No cambiar el contrato de URL del 061 salvo **agregar** `workType`.
- `clearMyTaskFilters` sigue **sin** borrar `person`, `done`, `view`.
- `newTask` debe seguir compilando en todos los callers (automations, tests, engine).
- `taskView` puede crecer, no puede quitar campos.
- Vitest **nunca** debe correr tests de `.worktrees/` (otra rama/worktree sucia rompe la suite).
- Principio V: un `WorkTypeBadge` reusado, no tres copias del Badge.

## Definición de hecho

- [ ] Fases A–F en `tasks.md`
- [ ] HU-01…HU-05 del spec
- [ ] `SCHEMA_VERSION === 22` y migración projects+flows
- [ ] typecheck +  tests verdes con exclude de worktrees
- [ ] `graphify update .`
- [ ] spec.md → **IMPLEMENTADO**

Si al terminar el usuario quiere merge: skill finishing-a-development-branch;
no pushees a origin a menos que te lo pidan.
