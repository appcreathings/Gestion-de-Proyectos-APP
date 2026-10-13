# Tasks 075 — Tablero global y orden de proyectos

Fases en orden. Después de A, de B y de C:

```
npx tsc --noEmit
npx vitest run --exclude ".worktrees/**" src/domain/sidebarOrder.test.ts src/domain/migrations.test.ts src/features/board/boardQuery.test.ts
```

Al cerrar E, la suite entera con el mismo exclude.

TDD en A (migración), B (orden) y C (query): el test nuevo falla antes del código. Los tests que ya están verdes tienen que seguir verdes.

Rama: `feat/075-tablero-global-y-orden`. `SCHEMA_VERSION` **25**.
Snippets: `design.md`. Autoridad: `spec.md` D1–D24.

PowerShell: sin `&&`. Un comando por línea.

## Fase A — Esquema

- [x] A1 En `migrations.test.ts`, el caso que espera la versión actual pasa de 24 a 25. Agregar el caso workspace v24 → v25 de design §9.4 (claves nuevas, y una vista preexistente que no se pisa). En `keys-never-exported.test.ts`, el pin pasa a 25. Deben **fallar**.
- [x] A2 `SCHEMA_VERSION = 25` en `common.ts`. `sidebarOrder` y `boardViews` en `SettingsSchema` (design §1).
- [x] A3 Paso `workspace` `{ to: 25 }` (design §2). No agregar pasos a projects.
- [x] A4 A1 verde. `npx tsc --noEmit`.

## Fase B — Orden en la barra

Deps: A, porque persistir usa el tipo de settings.

- [x] B1 Crear `src/domain/sidebarOrder.test.ts` con design §9.1. Debe **fallar**.
- [x] B2 Crear `src/domain/sidebarOrder.ts` con `UNASSIGNED_GROUP`, `groupKey`, `orderProjects`, `reorderWithin`.
- [x] B3 `ProjectTree` ordena cada grupo con `orderProjects` y `sidebarOrder` leído de `useAppStore`. Un `DndContext` por grupo abierto. Asa con `SortableItem`; el `NavLink` no lleva listeners. Sensores de design §3.
- [x] B4 Flecha arriba y Flecha abajo en el asa. `aria-live` con el puesto. En el extremo, no-op.
- [x] B5 Al soltar o al usar la flecha, `updateSettings` con el record completo de ese grupo (design §3 y trampa de §10). «Abrir todos» / «Cerrar todos» quedan como están. Cero grupos sigue en `null`.
- [x] B6 B1 verde.

## Fase C — Tablero

Deps: A y B2 (el rango usa `orderProjects`). No espera al asa de B3.

- [x] C1 Crear `src/features/board/boardQuery.test.ts` con design §9.2 y §9.3. Debe **fallar**.
- [x] C2 Crear `boardQuery.ts`: parseo, canónico, `collectBoardCards`, `boardProjectRank`, `sortCards`, `boardColumns`, `viewNameError`, `matchingViewId`.
- [x] C3 `ROUTES.board`. Lazy y ruta en `App.tsx`. Ítem «Tablero» en `NAV` después de Mis tareas. No cambiar `MOBILE_PRIMARY_NAV`.
- [x] C4 `BoardPage` y `GlobalTaskCard` (design §6). Filtros en la URL con `replace: true`. Chips, selects, búsqueda con `useDebounce` ~200 ms. Vacío sin proyectos y vacío con filtros, con los textos del diseño.
- [x] C5 Columnas `sm+` con drop en todo / doing / blocked / done. Otras no es droppable. Misma columna: no-op. `mutateProject` + `updateTask`. Debajo de `sm`, `KanbanColumnPager` sin alta y sin arrastre.
- [x] C6 Clic abre `TaskDetailDrawer` sin flechas de etapa. Si la tarea guardada ya no pasa el filtro, el drawer se cierra.
- [x] C7 Prefijo y label en `uiContext.ts` (design §8).
- [x] C8 C1 verde. `npx tsc --noEmit`.

## Fase D — Vistas guardadas

Deps: C.

- [x] D1 Menú «Vistas»: listar, marcar la coincidente, estado vacío «Sin vistas guardadas».
- [x] D2 Diálogo guardar / renombrar con los tres errores de design §7. A las 20, «Guardar vista» y «Guardar como nueva» deshabilitados. Actualizar no suma.
- [x] D3 Aplicar escribe filtros + `view`. Cambiar un filtro deja `view` y muestra «Vista modificada», con Actualizar y Guardar como nueva.
- [x] D4 Eliminar saca la vista. Si era la de la URL, saca `view` y deja el resto. Id de `view` desconocido, con el store hidratado, se borra del param.
- [x] D5 «Limpiar filtros» hace D13: no toca `done`.

## Fase E — Cierre

Deps: B y D.

- [x] E1 `npx tsc --noEmit`.
- [x] E2 `npx vitest run --exclude ".worktrees/**"`.
- [x] E3 `npx eslint src/domain/sidebarOrder.ts src/domain/sidebarOrder.test.ts src/domain/schemas/workspace.ts src/domain/migrations.ts src/features/board src/components/layout/ProjectTree.tsx src/components/layout/AppLayout.tsx src/App.tsx src/routes/paths.ts src/ai/chat/uiContext.ts`. Un error que ya estaba y no es de estos archivos no se «arregla» en esta spec.
- [x] E4 Smoke de `smoke.md`. Si no hay browser, anotar qué no se pudo clicar.
- [x] E5 `graphify update .`.
- [x] E6 `spec.md` → estado **IMPLEMENTADO**, con la rama real.

### Resultado del smoke (2026-10-12, browser 1440×900 y 390×844, modo demo)

Clicado y verificado: 1–10 (el 7 y el 8 con arrastre real de asa por coordenadas; el 10 con
pager, sin asas y cambio de estado desde el drawer), 11–14 (guardar con nombre vacío, guardar,
recargar, modificar, actualizar, borrar; al guardar se esperaba la escritura de `updateSettings`
antes de aplicar para que el limpiador de `view` desconocido no se coma el param) y 15–18
(arrastre real al primer puesto, persiste tras recargar; Flecha abajo con aviso «Quedó en el
puesto 2 en Nimbus»; minimizar oculta el árbol y no aparece otro control; «Cerrar todos» no
reabre el grupo al navegar). El proyecto terminado dejó de aportar tareas y la columna Otras
desapareció con él. No se clicó nada: quedó todo verificado.

### Commits sugeridos

Hacelos solo si en el chat pidieron commit. Si no, dejá el working tree y decilo.

1. `feat(board): persist sidebar order and saved views in workspace` — fase A
2. `feat(sidebar): reorder projects within a product` — fase B
3. `feat(board): global kanban with url filters` — fase C
4. `feat(board): save and apply task views` — fase D
