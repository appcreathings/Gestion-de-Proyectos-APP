# Prompt de ejecución — Spec 076

> Pegar esto como **primer mensaje** en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 076 de este proyecto: `specs/076-orden-productos-barra/`.

Es una feature ya diseñada. En la barra izquierda, un asa reordena los **productos** entre sí. El orden queda en `settings.productOrder` y el tablero global lo usa como primera clave de sus tarjetas. **No re-diseñes ni re-preguntes el alcance.** Ejecutá `spec.md`, `design.md` y `tasks.md`. Si algo es ambiguo al borde de una decisión ya documentada, elegí la opción de D1–D14 y seguí. Si `design.md` y `spec.md` chocan, gana el spec. Solo preguntá si chocás con un invariante real o un bug bloqueante.

## Orden de lectura obligatorio (antes de tocar código)

1. `CLAUDE.md` — hay grafo en `graphify-out/`. `graphify query "..."` antes de leer a ciegas; `graphify update .` al terminar.
2. `.specify/memory/constitution.md` — si tasks contradice la constitución, gana la constitución y avisá.
3. `specs/076-orden-productos-barra/spec.md` — D1–D14 y HU-01…07. **Esto manda.**
4. `specs/076-orden-productos-barra/design.md` — migración, árbol, rango, tests, trampas §6.
5. `specs/076-orden-productos-barra/tasks.md` — fases A→D. B y C pueden ir en paralelo después de A.
6. `specs/076-orden-productos-barra/smoke.md` — verificación final.
7. Código de referencia (releerlo; puede haber cambiado):
   - `src/domain/schemas/common.ts` — `SCHEMA_VERSION` 25
   - `src/domain/schemas/workspace.ts` — `sidebarOrder` y `boardViews`
   - `src/domain/migrations.ts` — paso workspace `{ to: 25 }`
   - `src/domain/sidebarOrder.ts` — `orderProjects`, `reorderWithin`, `UNASSIGNED_GROUP`
   - `src/components/layout/ProjectTree.tsx` — grupos, asa de proyecto, «Cerrar todos»
   - `src/components/dnd/SortableItem.tsx`
   - `src/features/board/boardQuery.ts` — `boardProjectRank`
   - `src/features/board/BoardPage.tsx` — el llamado de tres argumentos
   - `src/store/useAppStore.ts` — `updateSettings` hace spread de `settings`

## Rama

`feat/076-orden-productos-barra` desde el estado actual de la rama de trabajo. No cambies de rama si ya estás parado ahí con el working tree de esta spec. No pushees.

## Qué hay que lograr

- Cada producto visible en la barra tiene un asa. Arrastrarla, o Flecha arriba / Flecha abajo con el asa enfocada, lo reordena entre los otros productos.
- «Sin producto» sigue último y sin asa.
- El orden queda en `settings.productOrder`. Recargar lo conserva. `sidebarOrder` no se toca con este gesto.
- El clic en el nombre del producto sigue abriendo y cerrando el grupo. «Abrir todos» / «Cerrar todos» siguen igual.
- En el tablero, las tarjetas respetan ese orden de productos y, adentro, el orden de proyectos que ya había.
- `SCHEMA_VERSION` **26**. La migración es solo del workspace.

## Reglas de trabajo

- TDD en A y en C: el test nuevo falla antes del código. No adelantes la implementación para que el test nazca verde.
- PowerShell: sin `&&`. Un comando por línea.
- Copy de UI en rioplatense, tuteo, como está escrito en el diseño §3. No inventes otro texto.
- No agregues librerías. No reescribas `orderProjects`. No toques la grilla de productos, el dashboard, Mis tareas, el kanban de un proyecto ni el selector de producto del tablero.
- No hagas commit de fases a medias rotas. Los commits sugeridos están al final de `tasks.md`; hacelos solo si el usuario no pidió lo contrario en este chat. Si no te pidieron commit, dejá los cambios en el working tree y decilo. El refresco de graphify, si hay commit, va aparte.
- Marcá las casillas de `tasks.md` cuando el comando correspondiente salió verde.
- Si cambiás UI, verificá el flujo en el browser (arrastrar producto, flecha, recargar, tablero, cajón móvil, «Cerrar todos»). Un screenshot solo no alcanza.

## Trampas (leé design §6)

- Dos `DndContext`, no uno. El asa de proyecto no puede cambiar de producto.
- `updateSettings({ productOrder: next })` reemplaza solo esa clave. No metas el array adentro de `sidebarOrder`.
- `readWorkspace` guarda el archivo migrado antes de Zod. El paso v26 tiene que escribir `productOrder` en ese objeto.
- El test de «versión actual» de projects pasa a esperar 26. Los tests que fijan el target en 25 se quedan.
- El `useEffect` de «Cerrar todos» no se reescribe. Sigue dependiendo solo de `activeGroupId`.
- `BoardPage` tiene que pasar `productOrder`. El default `[]` del rango es para los tests viejos.
