# Prompt de ejecución — Spec 075

> Pegar esto como **primer mensaje** en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 075 de este proyecto: `specs/075-tablero-global-y-orden/`.

Es una feature ya diseñada. Tiene dos partes: **un kanban en `/app/board` con las tareas de todos los proyectos**, filtrable por producto o por un recorte propio que se puede guardar, y **arrastrar proyectos dentro de su producto en la barra izquierda**. **No re-diseñes ni re-preguntes el alcance.** Ejecutá `spec.md`, `design.md` y `tasks.md`. Si algo es ambiguo al borde de una decisión ya documentada, elegí la opción de D1–D24 y seguí. Si `design.md` y `spec.md` chocan, gana el spec. Solo preguntá si chocás con un invariante real o un bug bloqueante.

## Orden de lectura obligatorio (antes de tocar código)

1. `CLAUDE.md` — hay grafo en `graphify-out/`. `graphify query "..."` antes de leer a ciegas; `graphify update .` al terminar.
2. `.specify/memory/constitution.md` — si tasks contradice la constitución, gana la constitución y avisá.
3. `specs/075-tablero-global-y-orden/spec.md` — D1–D24 y HU-01…06. **Esto manda.**
4. `specs/075-tablero-global-y-orden/design.md` — tipos, migración, orden, query, página, vistas, tests §9, trampas §10.
5. `specs/075-tablero-global-y-orden/tasks.md` — fases A→E, en ese orden.
6. `specs/075-tablero-global-y-orden/smoke.md` — verificación final.
7. Código de referencia (releerlo; puede haber cambiado):
   - `src/domain/schemas/common.ts` — `SCHEMA_VERSION` 24
   - `src/domain/schemas/workspace.ts` — `SettingsSchema`
   - `src/domain/migrations.ts` — `migrateRecord` y el paso projects v24
   - `src/storage/FileSystemAdapter.ts` — `readWorkspace` escribe el JSON migrado y después parsea
   - `src/store/useAppStore.ts` — `updateSettings` hace spread de `settings`
   - `src/domain/kanbanStages.ts` — `stageLabel`, `stageDotClass`
   - `src/domain/projectOps.ts` — `updateTask`
   - `src/features/my-tasks/filterMyTasks.ts` — `date` en 0..3 y 0..7
   - `src/features/projects/filterProjects.ts` — `foldName`
   - `src/features/my-tasks/MyTasksPage.tsx` — drawer cross-proyecto
   - `src/components/layout/ProjectTree.tsx` — grupos y «Cerrar todos»
   - `src/components/layout/AppLayout.tsx` — `NAV` y `MOBILE_PRIMARY_NAV`
   - `src/features/projects/components/kanban/KanbanColumnPager.tsx`
   - `src/ai/chat/uiContext.ts` — `SECTION_PREFIXES`

## Rama

`feat/075-tablero-global-y-orden` desde el estado actual de la rama de trabajo. No cambies de rama si ya estás parado ahí con el working tree de esta spec. No pushees.

## Qué hay que lograr

- `/app/board` («Tablero», después de Mis tareas en el nav) muestra un kanban con las tareas no archivadas de los proyectos que no están `done` ni `archived`.
- Columnas: Por hacer, En curso, Bloqueada, Otras (solo si hay etapas propias) y Hecha. Hecha siempre está. Sin `done=1` sus tarjetas no se ven y el encabezado cuenta «N ocultas». Soltar ahí igual marca `done`.
- Soltar en una columna base cambia `task.status` de ese proyecto vía `updateTask`. Otras no recibe drops. Soltar en la misma columna no reordena. En menos de `sm` no hay arrastre: está el pager y el drawer.
- Filtros en la URL, todos AND: `product`, `project`, `person`, `priority`, `date`, `q`, `done`, `view`. Se pueden guardar hasta 20 vistas con nombre en `workspace.settings.boardViews`.
- En la barra, un asa reordena proyectos dentro del mismo producto. El orden queda en `settings.sidebarOrder`. Flecha arriba y Flecha abajo hacen lo mismo. El orden se nota también en las columnas del tablero.
- `SCHEMA_VERSION` **25**. La migración es solo del workspace.

## Reglas de trabajo

- TDD en A, B y C: el test nuevo falla antes del código. No adelantes la implementación para que el test nazca verde.
- PowerShell: sin `&&`. Un comando por línea.
- Copy de UI en rioplatense, tuteo, como está escrito en el spec y el design. No inventes otro texto.
- No agregues librerías. No toques `TasksTab`, `TaskCard`, etapas, WIP, Mis tareas ni la lista de `/app/projects`.
- No hagas commit de fases a medias rotas. Los commits sugeridos están al final de `tasks.md`; hacelos solo si el usuario no pidió lo contrario en este chat. Si no te pidieron commit, dejá los cambios en el working tree y decilo.
- Marcá las casillas de `tasks.md` cuando el comando correspondiente salió verde.
- Si cambiás UI, verificá el flujo en el browser (filtrar, guardar vista, soltar tarjeta, arrastrar en la barra, ancho de celular). Un screenshot solo no alcanza.

## Trampas (leé design §10)

- El id `otras` no se persiste en `task.status`.
- `updateSettings` necesita el record `sidebarOrder` completo, con la clave del grupo reemplazada.
- `readWorkspace` guarda el archivo migrado antes de Zod. El paso v25 tiene que escribir `sidebarOrder` y `boardViews` en ese objeto.
- El test de «versión actual» de projects pasa a esperar 25. Los tests que fijan el target en 24 se quedan.
- El `useEffect` de «Cerrar todos» no se reescribe. Sigue dependiendo solo de `activeGroupId`.
- Debajo de `sm` no hay drag de tarjetas.
