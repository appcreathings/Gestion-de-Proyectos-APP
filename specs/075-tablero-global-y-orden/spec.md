# Spec 075 — Tablero global y orden de proyectos

> Estado: **IMPLEMENTADO** (rama `feat/075-tablero-global-y-orden`)
> Feature dir: `specs/075-tablero-global-y-orden/` · Fecha: 2026-10-12
> Baseline al empezar: `SCHEMA_VERSION` **24** → **25**
> Depende de: 010 (DnD del kanban), 046 (la barra minimizada oculta el árbol), 054 (pager móvil), 061 (semántica de `date` y de «Mostrar hechas»), 065 (el color de la tarjeta es urgencia), 072 (`foldName`), 073 (etapas por proyecto; solo `done` cierra)
> Principios: **I** (el orden y las vistas viajan con la carpeta), **II** (el esquema sube de versión), **IV** (claridad), **V** (rebanada vertical, sin librerías nuevas)
> Copy de UI en rioplatense, **tuteo**
> Diseño: `design.md` · Tareas: `tasks.md` · Smoke: `smoke.md` · Prompt: `PROMPT-EJECUCION.md`

## 1. Contexto

El kanban vive adentro de un proyecto (`TasksTab`). Las columnas salen de `project.stages` (`boardColumns` en `src/domain/kanbanStages.ts`). Las cuatro base comparten id (`todo`, `doing`, `blocked`, `done`). Una etapa agregada en un proyecto tiene un id propio. Solo `status === "done"` marca la tarea como hecha (073 D5).

`TaskCard` está armada para ese tablero: flechas al vecino de **ese** proyecto, selección masiva, archivado. Pintarla en un tablero de columnas fijas mostraría flechas que no coinciden con las columnas.

Mis tareas (`/app/my-tasks`, spec 061) junta tareas de varios proyectos en una lista, pide una persona y no es un kanban. La URL es la fuente de verdad (`replace: true`). `date` vale `overdue` | `due-soon` (0–3 días) | `this-week` (0–7), medido con `daysUntil`.

La barra izquierda (`ProjectTree`) agrupa Producto → Proyecto en el orden del store. No hay campo de orden. El árbol no se monta con la barra minimizada (046). «Abrir todos» / «Cerrar todos» es de la 073 y se queda.

`workspace.settings` se guarda con `useAppStore.updateSettings`, que escribe `workspace.json`. Hoy tiene tema y umbrales. `readWorkspace` migra y después parsea con `WorkspaceSchema`.

## 2. Objetivo

Una opción «Tablero» muestra las tareas abiertas de todos los proyectos en un solo kanban, recortable por producto o por una combinación propia (proyectos, persona, prioridad, vencimiento, búsqueda), y esa combinación se puede guardar con nombre.

En la barra, arrastrar un proyecto lo reordena entre los de su producto. Ese orden queda guardado y, al reabrir, la barra y el tablero lo respetan.

## 3. Decisiones

| # | Decisión | Razón |
|---|----------|--------|
| **D1** | Dos superficies: la ruta `/app/board` y el arrastre en `ProjectTree`. El kanban del proyecto, Mis tareas y `/app/projects` no cambian de comportamiento. | Es una opción más para gestionar tareas, más el orden de la barra. |
| **D2** | «Tablero» entra en `NAV` justo después de «Mis tareas», con ícono `LayoutGrid`. `MOBILE_PRIMARY_NAV` sigue siendo `NAV.slice(0, 4)`: Dashboard, Productos, Proyectos, Mis tareas. El árbol sigue colgando de «Proyectos». | Meterlo antes sacaría Mis tareas de la barra inferior del celular. |
| **D3** | Un solo tablero. Columnas, en este orden: Por hacer (`todo`), En curso (`doing`), Bloqueada (`blocked`), Otras (si hay tarjetas), Hecha (`done`). Las tres primeras se ven siempre, aunque estén en cero. | Las etapas propias de cada proyecto no arman una columna compartida. Las columnas base tienen que existir para poder soltar. |
| **D4** | «Otras» junta toda tarea cuyo `status` no es uno de los cuatro id base. La tarjeta muestra el nombre con `stageLabel(project, status)`. Si no hay ninguna, la columna no se renderiza. No es destino de soltar. | Soltar ahí no sabría qué etapa propia elegir. El nombre en la tarjeta no se pierde. |
| **D5** | Hecha es siempre una columna. Sin `done=1`, sus tarjetas no se renderizan. El encabezado dice el número oculto cuando es mayor a cero: «N ocultas». Soltar una tarjeta en Hecha escribe `status: "done"` y la tarjeta sale de las columnas visibles. «Mostrar hechas» revela las tarjetas. | Completar desde el tablero tiene que ser posible con las hechas ocultas. El default sigue sirviendo para triar. |
| **D6** | Soltar en `todo`, `doing`, `blocked` o `done` llama `mutateProject` de ese proyecto con `updateTask` y el status nuevo. `updateTask` ya pone `updatedAt` en la tarea. Soltar en la misma columna no cambia nada. No se guarda un orden de tareas entre proyectos. | El orden dentro del archivo del proyecto es de ese tablero. Este spec no inventa otro. |
| **D7** | Dentro de cada columna, las tarjetas se ordenan por el puesto del proyecto en la barra (D16) y, si empatan, por el índice de la tarea en `project.tasks`. El puesto compara primero el orden de los productos en el store y después el orden interno del producto. | El proyecto que subiste en la barra queda más arriba en cada columna. |
| **D8** | Entran tareas con `archived !== true` de proyectos cuyo `status` no es `done` ni `archived`. Un proyecto pausado o bloqueado sí entra. | El archivo de tareas es el de la 015. Un proyecto cerrado no se mezcla en la gestión del día. |
| **D9** | La tarjeta es un componente nuevo. Muestra título, nombre del proyecto, prioridad, vencimiento si hay, responsable si hay, y en Otras el nombre de la etapa. La franja de color sigue `taskUrgency` y `URGENCY_RAIL` (065). El clic abre `TaskDetailDrawer` de ese proyecto, igual que Mis tareas. Sin flechas de etapa, sin selección masiva y sin alta de tarea en esta pantalla. | `TaskCard` arrastra el comportamiento de un solo proyecto. El alta pide área y etapa: queda en el proyecto. El drawer ya edita, archiva y cambia el estado. |
| **D10** | La URL es la fuente de verdad de lo que está filtrado. `setSearchParams(..., { replace: true })`. Un id desconocido o un valor inválido se ignora y no rompe la página. | Mismo contrato que 061 y 072. Un link reproduce el tablero. |
| **D11** | Params AND: `product`, `project`, `person`, `priority`, `date`, `q`, `done`, `view`. Varios ids van separados por coma, en orden lexicográfico dentro del param. `date` copia la semántica de Mis tareas. `q` busca en `task.title` con `foldName` (072), debounce ~200 ms. `priority` acepta `critical`. | Por producto y a mano conviven. `project` es la lista de proyectos que elegís. El resto recorta las tareas. |
| **D12** | No hay usuario «yo». `person` es un id de `people`. Ausente = todas. | 061 D9. La app no tiene sesión de persona. |
| **D13** | «Limpiar filtros» borra `product`, `project`, `person`, `priority`, `date`, `q` y `view`. No toca `done`. | Hechas es el marco de la pantalla. La vista aplicada deja de ser la activa. |
| **D14** | Una vista guardada es `{ id, name, query }`. El nombre tiene 1–40 caracteres ya recortado y es único con `foldName`. Máximo 20. `query` es el query canónico de los filtros, **sin** el param `view`, e **incluye** `done` cuando está prendido. Viven en `workspace.settings.boardViews`. Aplicar escribe esos params y `view=<id>`. Si después cambiás un filtro, `view` se queda: la vista figura como modificada y se puede actualizar o guardar como nueva. | Elegiste las dos cosas: filtrar en el momento y guardar la combinación. Van en el workspace (principio I). |
| **D15** | `SCHEMA_VERSION` **25**. Migración del kind `workspace` `{ to: 25 }`: si faltan, escribe `sidebarOrder: {}` y `boardViews: []`. No toca proyectos ni tareas. El fallback de `migrateRecord` sube el resto de los kinds. | El orden y las vistas son del workspace. Un proyecto no gana un campo nuevo. |
| **D16** | El arrastre reordena proyectos dentro del mismo producto. No cambia `productId`. No reordena los grupos de producto. «Sin producto» es un grupo (`__unassigned`). Cada grupo abierto tiene su propio `DndContext`. | Un contexto por grupo hace imposible soltar en otro producto. |
| **D17** | El orden persiste en `settings.sidebarOrder`, un record de id de grupo → ids de proyecto. Al soltar, se escribe la lista visible de **ese** grupo: ids que ya no están se descartan, los que faltaban quedan en el puesto en que se ven. Leer ignora ids desconocidos y manda al final, en orden del store, a los proyectos que no están en la lista. Crear, borrar o cambiar de producto no hace falta que escriban la lista: la lectura ya los ubica. | El único gesto que fija un puesto es el arrastre. El resto no deja el árbol desordenado. |
| **D18** | El clic en el nombre sigue abriendo el proyecto. El arrastre nace de un asa. Con el asa enfocada, Flecha arriba y Flecha abajo mueven un puesto. Un aviso `aria-live` dice el puesto nuevo. La barra minimizada no muestra el árbol y no ofrece otro lugar para reordenar. | El árbol es navegación. El teclado tiene que poder ordenar (principio IV). |
| **D19** | Debajo de `sm`, el tablero usa `KanbanColumnPager` con estas columnas y no arrastra tarjetas. El cambio de estado en el celular se hace desde el drawer. De `sm` para arriba se ven las columnas juntas y el mouse cruza de columna. El drawer de «Más» monta el mismo `ProjectTree`, así que el asa también está ahí. | El pager de la 054 ya resuelve el ancho. Un arrastre entre columnas que no se ven pelea con el scroll. |
| **D20** | Filtro, columnas, orden de tarjetas, vistas y orden de la barra son funciones puras, testeadas sin montar React. | Mismo corte que `filterMyTasks` y `filterProjects`. |
| **D21** | Límites WIP, alta de etapa, archivado masivo y alta de tarea siguen en el tablero del proyecto. Esta pantalla no los replica. | El tablero global mueve de estado y abre el drawer. |
| **D22** | Flujos, herramientas de IA, dashboard e informe no leen `sidebarOrder` ni `boardViews`. El chip del asistente, en `/app/board`, dice «Tablero» (`uiContext`). | Son preferencia de esta pantalla y de la barra. El chip no puede mostrar el id crudo. |
| **D23** | Copy en rioplatense, tuteo. Los textos cerrados están en el diseño §6 y §7. | Principio IV. Un texto nuevo en la implementación se copia de ahí. |
| **D24** | Quedan afuera: carriles por proyecto, reordenar productos, soltar un proyecto en otro producto, Gantt, vistas en `localStorage`, alta de tarea en el tablero global. | Para que el chat que implemente no los agregue. |

## 4. Modelo

`Settings` suma:

```ts
sidebarOrder: Record<string, string[]>  // default {}
boardViews: { id: string; name: string; query: string }[]  // default [], max 20
```

La clave de `sidebarOrder` es el id del producto, o `__unassigned` cuando `productId` es null.

`query` guardado es una query sin `?` inicial. Orden de keys: `product`, `project`, `person`, `priority`, `date`, `q`, `done`. Cada key ausente no se escribe. Los ids de `product` y `project` van ordenados con `localeCompare`.

## 5. Tablero

Ruta: `ROUTES.board = "/app/board"`.

La barra de filtros deja agregar productos y proyectos como chips, y elige una persona, una prioridad y una ventana de vencimiento. La búsqueda filtra por título. «Mostrar hechas» escribe o borra `done=1`. «Limpiar filtros» hace D13.

`product` y `project` se combinan con AND. Un proyecto elegido que no pertenece a los productos elegidos no entra.

El clic en una tarjeta abre el drawer de esa tarea en su proyecto. Cerrar el drawer deja la URL como estaba. Si el drawer marca la tarea como hecha y `done` no está, la tarjeta desaparece al guardar, porque el filtro la saca.

## 6. Vistas

El menú «Vistas» lista las guardadas. La que coincide con los filtros de la URL (comparando el query canónico, sin mirar `view`) se marca. Si `view` apunta a una vista y los filtros ya no coinciden, el menú dice que está modificada.

Guardar con el nombre vacío muestra «Escribí un nombre.» Un nombre repetido muestra «Ya hay una vista con ese nombre.» Al llegar a 20, guardar una nueva se deshabilita y dice «Podés guardar hasta 20 vistas.» Actualizar una existente no cuenta como nueva.

Borrar la vista que está en la URL saca el param `view` y deja los filtros.

## 7. Barra

Dentro de cada grupo abierto, cada proyecto tiene un asa a la izquierda del nombre. El grupo cerrado no muestra asas. «Abrir todos» / «Cerrar todos» no se tocan.

Al soltar, `updateSettings({ sidebarOrder })` persiste solo el grupo movido; el resto de las claves quedan igual.

## 8. Historias

- **HU-01** Desde el nav, abro Tablero y veo las tareas abiertas de los proyectos activos en Por hacer, En curso y Bloqueada.
- **HU-02** Filtro por un producto y el tablero se achica. Recargo y el link sigue filtrado.
- **HU-03** Armo un recorte con proyectos, persona, prioridad, vencimiento y búsqueda, y lo guardo con nombre.
- **HU-04** Aplico esa vista, cambio un filtro, actualizo la vista, y al recargar vuelve el recorte nuevo.
- **HU-05** Suelto una tarjeta en otra columna y el kanban de ese proyecto muestra el estado nuevo.
- **HU-06** Arrastro un proyecto dentro de su producto en la barra. Recargo y quedó en ese puesto. Uno de otro producto no se mueve.

## 9. Fuera de alcance

Carriles, orden de productos, mudanza de producto por arrastre, Gantt, alta de tarea en esta ruta, editar etapas, WIP, vistas en `localStorage`, cambios al kanban de un proyecto, a Mis tareas o a la lista de `/app/projects`.
