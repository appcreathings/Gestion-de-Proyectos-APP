# Tasks 073 — Etapas del kanban y árbol de proyectos

Fases en orden salvo donde se dice. Después de A y de C:
`npx tsc --noEmit` y
`npx vitest run --exclude ".worktrees/**" src/domain/kanbanStages.test.ts src/domain/migrations.test.ts src/features/my-tasks/filterMyTasks.test.ts`.
Después de B y de D, el mismo typecheck. Al cerrar E, la suite entera con el mismo exclude.

TDD en A y en el filtro de C: el test nuevo falla antes de la implementación. Los tests que ya están verdes tienen que seguir verdes.

Rama: `feat/073-etapas-kanban-y-arbol`. `SCHEMA_VERSION` **24**.
Snippets: `design.md`. Autoridad: `spec.md` D1–D15.

D no toca el dominio: puede ir en paralelo con A. B y C esperan a A. B y C pueden ir en paralelo entre sí. E espera a las tres.

PowerShell: sin `&&`. Un comando por línea.

## Fase A — Dominio

- [x] A1 Crear `src/domain/kanbanStages.test.ts` con los casos de design §9 (normalize, nombres, color, ops). Deben **fallar** (o no compilar) antes de A2.
- [x] A2 Crear `src/domain/kanbanStages.ts` con design §1: paleta, `DEFAULT_STAGES`, `normalizeStages`, `stageNameError`, `nextStageColor`, `stageLabel`, `boardColumns`, `neighborStageId`, `stageDotClass`, `isBuiltinStageId`, `isDoneStatus`.
- [x] A3 `SCHEMA_VERSION = 24` en `common.ts`. El enum `TaskStatus` se queda. En `project.ts`, `Task.status` pasa a `z.string().min(1).default("todo")` y `Project.stages` defaultea a una **copia** de `DEFAULT_STAGES` (design §2).
- [x] A4 `newProject` escribe `stages`. Paso `projects` `{ to: 24 }` llama `normalizeStages` y no toca `tasks` (design §3).
- [x] A5 En `migrations.test.ts`, el caso que espera la versión actual pasa de 23 a 24 y afirma las cuatro etapas. Agregar el caso v23 → v24: la tarea `doing` no cambia de status. En `keys-never-exported.test.ts`, el pin de `SCHEMA_VERSION` pasa a 24. No reescribir tests que migran hacia v22 o v23 a propósito.
- [x] A6 `addStage`, `renameStage`, `recolorStage`, `moveStage`, `removeStage` en `projectOps.ts` (design §4). Los rechazos devuelven la misma referencia. `removeStage` mueve también las archivadas.
- [x] A7 Los casos de A1 verdes. `npx tsc --noEmit` puede seguir en rojo por literales `Project` sin `stages` y por `taskStatusLabel[task.status]`: eso se cierra en B y C, no se castea.

## Fase B — Tablero

Deps: A.

- [x] B1 `TasksTab`: columnas desde `boardColumns`. `activeKanbanCol` es `string`. El set de DnD incluye ghosts. `pickActiveStatus` recibe el orden (design §5.1). Flechas con `neighborStageId`, sin envolver; en el extremo no se muestran.
- [x] B2 `KanbanColumn`: punto, nombre, menú (`DropdownMenu`). Renombrar, color, mover, eliminar según design §5.2 y §5.4. Sin menú en un ghost. WIP solo en id base.
- [x] B3 Diálogo «Nueva etapa» al final del tablero y botón «+» en el pager móvil (`aria-label="Nueva etapa"`). Color inicial `nextStageColor`. Errores de design §4. El «+» no es una columna.
- [x] B4 Botón «Archivar N» solo en el id `done`, con el conteo visible. Un solo `mutate` con `reduce` + `updateTask` (`archived: true`, mismo `status`). Copy de design §5.5.
- [x] B5 `TaskFormDialog`, `TaskDetailDrawer` y «Mover a…» listan `project.stages`. `KanbanListView` y `ArchivedTasksList` usan `stageLabel` y el punto.
- [x] B6 `columnScroll.ts`: el desempate usa el `order` argumento, no `TASK_COLUMNS`.

## Fase C — Etiqueta fuera del tablero y Mis tareas

Deps: A. Puede ir junto con B.

- [x] C1 Tests de design §9 en `filterMyTasks.test.ts` para `otras`, `done`, sin `showDone`, y un status inválido. Deben **fallar**.
- [x] C2 `MyTasksStatusFilter` y el filtro (design §7). `applyStatus("otras")` no escribe `done=1`. Opción «Otras etapas» en `MyTasksPage`. La fila usa `stageLabel`.
- [x] C3 `activity.ts`: `task.statusChanged` usa `stageLabel(project, event.from | event.to)`.
- [x] C4 `buildCalendarItems` agrega `statusLabel`. `TaskCalendarView` y `PortfolioCalendarView` lo muestran. `ReportTaskRow.statusLabel` se llena en `statusReport.ts` y `statusReportMarkdown.ts` lo imprime. Donde `taskStatusLabel[task.status]` no compile, no castear: usar `stageLabel` o el campo ya resuelto.
- [x] C5 `ActionConfigFields` y las herramientas de IA siguen en el enum `TaskStatus` / `TASK_COLUMNS`. No listar etapas custom.

## Fase D — Árbol

Sin deps de A. Puede ir en paralelo.

- [x] D1 Fila «Proyectos» + botón «Abrir todos» / «Cerrar todos» en `ProjectTree.tsx` (design §8). `type="button"`. Cero grupos: el componente sigue en `null`.
- [x] D2 `skipGroup` compara el id del grupo activo. El `useEffect` depende solo de `activeGroupId`. Cerrar todos deja cerrado el producto del proyecto abierto. Cambiar de proyecto abre el grupo nuevo.
- [x] D3 Sin `localStorage`. El rail minimizado no monta el árbol: no agregar otro modo.

## Fase E — Cierre

Deps: B, C y D.

- [x] E1 `npx tsc --noEmit`.
- [x] E2 `npx vitest run --exclude ".worktrees/**"`.
- [x] E3 `npx eslint src` en los archivos tocados. Un error que ya estaba en `useBreakpoint` no es de esta spec.
- [x] E4 Smoke de abajo. Si no hay browser, anotar qué no se pudo clicar.
- [x] E5 `graphify update .`.
- [x] E6 `spec.md` → estado **IMPLEMENTADO**.

### Registro del smoke (2026-10-08, Chromium headless del entorno contra `vite` local, datos demo)

1. Proyecto viejo abre con las cuatro columnas, tareas en su lugar; avance 2/8 · 25% antes de tocar nada.
2. «Revisión» violeta queda antes de Hecha y sobrevive la recarga.
3. Hecha renombrada a «Listo»: encabezado, pager, badges de Archivadas y el diálogo de archivado usan el nombre nuevo; mover una tarea ahí sube el avance 25% → 38%; en Revisión se queda 25%.
4. Alta: vacío → «Escribí un nombre.»; «listo» vs «Listo» → «Ya hay una etapa con ese nombre.» El diálogo no cierra.
5. Borrar Revisión con 1 viva + 1 archivada: diálogo «2 tareas pasan a "Bloqueada"» (cuenta archivadas); ambas quedan en Bloqueada y la archivada sigue en Archivadas con badge «Bloqueada» (sin columna fantasma).
6. Menú de Hecha: solo Renombrar + color (fix aplicado durante el smoke: mostraba «Mover a la izquierda»). Las base no ofrecen Eliminar; `removeStage` de una base devuelve `p` (testeado).
7. Con alcance Backlog el botón decía «Archivar 1» y con Sprint 12 «Archivar 2»; confirmar archivó solo las 2 visibles del sprint y la hecha del Backlog quedó en el tablero. Archivadas (3) con badges «Listo»/«Bloqueada». Nota: con sprint activo, elegir «Todas las tareas» rebota al sprint — comportamiento preexistente del SprintSwitcher, fuera de esta spec.
8. A 390 px el pager muestra pill + punto + conteo por etapa y el «+» abre el mismo alta; «Cierre» quedó en el carrusel entre QA y Listo.
9. Mis tareas (Beto Cueva): la tarea en QA se ve sin «Mostrar hechas» con badge «QA»; «Otras etapas» la aísla (1 abierta).
10. «Abrir todos» expande todo y pasa a «Cerrar todos»; cerrar deja solo «Nimbus» (producto del proyecto activo incluido) y el efecto no lo reabre; recargar vuelve a abrir solo el activo. **No se pudo clicar**: CA-07.3 (navegar a un proyecto de *otro* producto — el demo solo tiene Nimbus) y el drawer móvil (CA-07.5), porque el entorno no simuló el gesto de abrir el drawer; el botón vive en `SidebarContent`, compartido con el drawer.

Quirk del entorno (no es de la app): en este Chromium headless los diálogos Radix cerrados quedan como nodos `data-state="closed"` con `pointer-events:auto` porque la animación de salida nunca corre; tapó el centro de la pantalla hasta recargar. En un browser real la animación desmonta el nodo.

### Smoke

1. Abrir un proyecto viejo: cuatro columnas, tareas en su lugar, avance igual.
2. Crear «Revisión» con color violeta. Queda antes de Hecha. Recargar: sigue ahí.
3. Renombrar Hecha a «Listo». Mover una tarea ahí sube el avance. Una tarea en Revisión no lo sube.
4. Intentar un nombre repetido: «Ya hay una etapa con ese nombre.» Nombre vacío: «Escribí un nombre.»
5. Borrar Revisión con una tarea viva y una archivada: las dos pasan a la columna de la izquierda. La archivada sigue archivada.
6. Hecha no se mueve ni se borra. Por hacer, En curso y Bloqueada no se borran.
7. Con un filtro de sprint, «Archivar N» archiva solo las hechas visibles. Al quitar el filtro, las otras hechas siguen en la columna. En Archivadas conservan el estado.
8. En el teléfono, el «+» del pager crea la etapa y aparece en el carrusel.
9. Mis tareas: la tarea en Revisión se ve sin «Mostrar hechas». «Otras etapas» la aísla y no muestra Por hacer.
10. En el sidebar, «Abrir todos» muestra los proyectos de cada producto. «Cerrar todos» deja solo los productos, incluido el del proyecto abierto. Entrar a un proyecto de otro producto abre ese producto. Recargar vuelve a abrir solo el activo.

Commits sugeridos, uno por fase:

- `feat(kanban): project stages in the domain (spec 073)`
- `feat(kanban): add, recolor and archive stages (spec 073)`
- `feat(tasks): label custom stages outside the board (spec 073)`
- `feat(sidebar): expand or collapse every project (spec 073)`
