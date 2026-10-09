# Spec 073 — Etapas del kanban y árbol de proyectos

> Estado: **IMPLEMENTADO** (rama `feat/073-etapas-kanban-y-arbol`)
> Feature dir: `specs/073-etapas-kanban-y-arbol/` · Fecha: 2026-10-08
> Baseline al empezar: `SCHEMA_VERSION` **23** → **24**
> Depende de: 010 (tablero y DnD), 015 (archivado), 046 (sidebar), 054 (carrusel móvil), 061 (filtro de estado en Mis tareas), 065 (el color de la tarjeta es urgencia)
> Principios: **IV** (claridad), **V** (rebanada vertical, sin librerías nuevas)
> Copy de UI en rioplatense, **tuteo**
> Diseño: `design.md` · Tareas: `tasks.md` · Prompt: `PROMPT-EJECUCION.md`

## 1. Contexto

El tablero de un proyecto tiene cuatro columnas fijas. El id vive en `Task.status` (`TaskStatus` en `src/domain/schemas/common.ts`) y el nombre sale de `taskStatusLabel` / `TASK_COLUMNS` en `src/domain/labels.ts`:

| Id | Nombre |
|----|--------|
| `todo` | Por hacer |
| `doing` | En curso |
| `blocked` | Bloqueada |
| `done` | Hecha |

Ese id lo usan el avance (`projectLiveTaskProgress` en `src/domain/compute.ts`), Mis tareas, el informe, el calendario, el dashboard, los flujos y las herramientas de IA. Una tarea está terminada solo cuando `status === "done"`. El color de la tarjeta es urgencia (spec 065) y no dice nada de la columna.

Archivar ya existe: `Task.archived` (spec 015). Se archiva de a una desde la tarjeta o el drawer, o en lote después de seleccionar. La columna Hecha no tiene un botón para vaciarla.

El árbol del sidebar (`ProjectTree` en `src/components/layout/ProjectTree.tsx`) agrupa proyectos por producto. Cada producto se abre solo. El producto del proyecto activo se vuelve a abrir en un `useEffect`. No hay forma de abrirlos o cerrarlos todos. El árbol se oculta cuando el sidebar está minimizado (spec 046).

## 2. Objetivo

En un proyecto, la persona agrega etapas, les pone nombre, color y orden, y archiva de una vez lo que está en Hecha. Las cuatro etapas de siempre siguen siendo la base, y solo Hecha marca una tarea como terminada. En el panel izquierdo, un botón abre o cierra todos los productos del árbol.

## 3. Decisiones

| # | Decisión | Razón |
|---|----------|--------|
| **D1** | Dos toques en un solo spec: etapas en el proyecto, y el botón del árbol. Sin rutas nuevas. | Son los dos pedidos. El árbol no toca el esquema. |
| **D2** | `SCHEMA_VERSION` pasa a **24**. Migración `projects` `{ to: 24 }` escribe `stages` cuando falta o está vacío. No reescribe `task.status`. El resto de los kinds sigue por el fallback de `migrateRecord`. | Los proyectos viejos abren con las cuatro columnas y las tareas en su lugar. |
| **D3** | Las etapas viven en `Project.stages`, en orden de tablero. Cada una es `{ id, name, color }`. Las cuatro base tienen id fijo: `todo`, `doing`, `blocked`, `done`. Una etapa nueva tiene id `uuid`. | Un id estable deja el avance, los flujos y la IA sobre `done` / `todo` / `doing` / `blocked`. El nombre visible puede cambiar. |
| **D4** | `Task.status` pasa a `string` (default `"todo"`). El enum `TaskStatus` se queda como los cuatro id base y lo siguen usando flujos y herramientas de IA. Un status custom no es un valor de ese enum. | Los flujos no aprenden etapas por proyecto en este spec. |
| **D5** | Terminada = `status === "done"`. Cualquier otro id, custom o desconocido, es trabajo abierto. Renombrar Hecha no cambia eso. | Acuerdo de producto: todo cuenta como pendiente hasta pasar a Hecha. |
| **D6** | Hecha queda siempre última. No se mueve y no se borra. Por hacer, En curso y Bloqueada tampoco se borran. Sí se renombran y se recoloran. Se pueden reordenar entre sí y con las etapas nuevas, siempre antes de Hecha. | Hecha es el cierre del recorrido. Borrarla rompe el avance. |
| **D7** | Alta de etapa: nombre + color. Queda insertada justo antes de Hecha. El nombre es único en el proyecto, sin distinguir mayúsculas, ya recortado. Largo 1–40. | «Revisión» tiene que poder existir entre En curso y Hecha. Dos columnas con el mismo nombre no se distinguen. |
| **D8** | Borrar solo una etapa nueva. Toda tarea con ese `status` —archivada o no— pasa a la etapa de la izquierda. Si era la primera, pasa a la de la derecha. Después se quita la etapa. Hecha no se mueve de lugar. | Borrar una columna no borra trabajo. |
| **D9** | El color es una de 8 claves, no un hex libre. Se pinta como punto de 8 px junto al nombre. La tarjeta no cambia (spec 065). | Un color libre pelea con la urgencia de la tarjeta. |
| **D10** | `wipLimits` no cambia de forma y solo aplica a los cuatro id base. Una etapa nueva no tiene límite. | El límite ya existe para esas columnas. Este spec no lo rediseña. |
| **D11** | Archivar la columna Hecha reutiliza `archived: true` y deja `status` en `done`. Alcanza a las tareas visibles en esa columna con los filtros actuales. Pide confirmación con el número. | Mismo archivado de la spec 015. «Las que están ahí» son las que se ven. |
| **D12** | Flujos (`ActionConfigFields`) y herramientas de IA siguen ofreciendo solo los cuatro id base. No crean etapas ni escriben un id custom. | Una etapa custom es de un proyecto. El flujo no tiene esa lista. |
| **D13** | Mis tareas suma el filtro `status=otras`: tareas cuyo status no es uno de los cuatro id base. El valor inválido sigue sin filtrar. Una etapa custom entra en la lista de pendientes (no es Hecha). | Si no, esas tareas solo aparecen en «Todas» y no se pueden aislar. |
| **D14** | El botón del árbol vive en `ProjectTree`, en una fila «Proyectos». Si falta abrir algún producto, dice «Abrir todos». Si están todos abiertos, dice «Cerrar todos». No se persiste. El sidebar minimizado no muestra el árbol, igual que hoy. | El pedido es un botón, no un buscador nuevo. ⌘K queda como está. |
| **D15** | «Cerrar todos» también cierra el producto del proyecto en el que estás, y frena el `useEffect` que lo reabriría. Al cambiar de proyecto, ese producto se abre de nuevo. | Si el efecto gana, el botón no cierra nada. |

## 4. Modelo

### 4.1 Etapa

```ts
export const STAGE_COLORS = [
  "slate",
  "blue",
  "amber",
  "green",
  "rose",
  "violet",
  "teal",
  "orange",
] as const;

export const DEFAULT_STAGES = [
  { id: "todo", name: "Por hacer", color: "slate" },
  { id: "doing", name: "En curso", color: "blue" },
  { id: "blocked", name: "Bloqueada", color: "amber" },
  { id: "done", name: "Hecha", color: "green" },
] as const;
```

`Project.stages` es un array de `{ id: string; name: string; color: StageColor }`. Zod defaultea a `DEFAULT_STAGES`. `newProject` lo escribe explícito.

`normalizeStages` es pura y la usan la migración y cada operación de guardado:

1. Vacío o ausente → `DEFAULT_STAGES`.
2. Un id base que falte se inserta en su lugar relativo de `DEFAULT_STAGES`, con su nombre y color de fábrica.
3. Ids repetidos: gana el primero.
4. El id `done` se mueve al final.
5. Nombre vacío en una base → el nombre de fábrica. Nombre vacío en una custom → `"Etapa"`.
6. Color desconocido → `slate`.

### 4.2 Operaciones

Viven en `src/domain/projectOps.ts`. Devuelven un proyecto nuevo. No tocan la UI.

| Función | Comportamiento |
|---------|----------------|
| `addStage(p, { name, color })` | Recorta el nombre. Si queda vacío, pasa de 40, o ya existe (sin mayúsculas), devuelve `p` sin cambio. Id nuevo. Inserta en el índice de `done`. |
| `renameStage(p, id, name)` | Misma validación de nombre, ignorando la propia etapa. Si el id no existe, no cambia. |

El formulario valida antes de llamar. El input tiene `maxLength={40}`. Nombre vacío → «Escribí un nombre.» Nombre repetido → «Ya hay una etapa con ese nombre.» La operación que no cambia `p` es la red de seguridad, no el mensaje.
| `recolorStage(p, id, color)` | Color fuera de la paleta → no cambia. |
| `moveStage(p, id, direction)` | `direction` es `-1` o `1`. El id `done` no se mueve. Ninguna etapa puede quedar después de `done`. Un paso que se sale del rango no cambia. |
| `removeStage(p, id)` | Si el id es base o no existe, no cambia. Las tareas con ese status pasan al id de la etapa en `index - 1`, o `index + 1` si era la primera. Luego se quita la etapa y se normaliza. |

### 4.3 Nombre visible

`stageLabel(project, statusId)`:

1. El `name` de la etapa con ese id.
2. Si no está y el id es base, `taskStatusLabel[id]`.
3. Si no está, `"etapa eliminada"`.

Lo usan la lista, el drawer, el formulario, Mis tareas y el texto de actividad. En `src/automations/activity.ts` el formateador recibe el proyecto del evento y reemplaza el id crudo por `stageLabel`. El encabezado de una columna de recuperación (sección 5.1) muestra el id crudo, no esta etiqueta: si hay dos ids desconocidos, cada columna se tiene que distinguir.

### 4.4 Migración

`{ to: 24, up }` en `projects`: si `stages` no es un array con al menos un elemento, asigna `DEFAULT_STAGES`. Si ya hay etapas, corre `normalizeStages`. No modifica tareas.

## 5. Tablero

### 5.1 Columnas

`TasksTab` deja de iterar `TASK_COLUMNS` para pintar. Itera `project.stages`. El pager móvil (`KanbanColumnPager`), el orden de las flechas de la tarjeta y el DnD usan ese mismo orden.

`KanbanColumn` recibe la etapa (id, nombre, color, si es `done`, si es base) en lugar de asumir `taskStatusLabel[status]`. El encabezado muestra el punto de color y el nombre. El límite `n/m` solo si el id es base y `wipLimits[id]` es un número.

Una tarea cuyo status no está en `stages` se agrupa en una columna extra, después de Hecha y antes del alta, titulada con el id, color `slate`, sin menú. No se persiste. Arrastrar la tarjeta a una etapa real le escribe ese id. Sin tareas así, la columna no existe.

### 5.2 Menú de etapa

Cada columna persistida tiene un menú en el encabezado:

| Acción | Cuándo |
|--------|--------|
| Renombrar | Siempre. El nombre nuevo pasa por `renameStage`. Error inline: «Ya hay una etapa con ese nombre.» |
| Color | Ocho muestras. La activa queda marcada. |
| Mover a la izquierda / Mover a la derecha | Oculta el sentido que `moveStage` no aplicaría. Hecha no muestra ninguna. |
| Eliminar | Solo etapas nuevas. Diálogo: «Eliminar “{nombre}”. {N} tarea(s) pasan a “{destino}”.» N cuenta archivadas y no archivadas. Acciones: Eliminar / Cancelar. |

No hay drag de columnas. El drag sigue siendo de tarjetas.

### 5.3 Alta

Al final del tablero, un control «Nueva etapa» abre nombre + muestras de color. El color inicial es la primera clave de `STAGE_COLORS` que ninguna etapa use; si están las ocho usadas, `slate`. Crear llama a `addStage`. En el carrusel móvil el pager tiene un «+» que abre el mismo diálogo.

### 5.4 Archivar Hecha

En el encabezado de la etapa cuyo id es `done`, si hay al menos una tarea visible:

- 1 tarea → botón «Archivar 1»
- N tareas → botón «Archivar N»

Visible = las tarjetas que esa columna está pintando (mismos filtros de área, sprint, prioridad, responsable, fecha y tipo de trabajo; las archivadas ya no están en el tablero).

Diálogo: «Archivar N tareas de {nombre}? Salen del tablero y quedan en Archivadas.» Acciones: Archivar / Cancelar. Cada tarea se actualiza con `archived: true` y el mismo `status`. No abre el modo seleccionar ni usa la selección actual.

### 5.5 Otros lugares que nombran el estado de una tarea del proyecto

Estos listan `project.stages` en orden, con punto y nombre, y guardan el id:

- Alta y edición en `TaskFormDialog`
- Estado en `TaskDetailDrawer`
- «Mover a…» del lote en `TasksTab`
- Badge de `KanbanListView` y de `ArchivedTasksList`

## 6. Mis tareas, informes y el resto

No se rediseñan. La regla D5 alcanza para que el porcentaje, el dashboard, el informe, el calendario y el standup sigan contando solo `done` como hecho.

En Mis tareas el filtro de estado gana la opción «Otras etapas» (`status=otras`). La fila muestra `stageLabel` del proyecto de esa tarea. `showDone` no esconde las etapas custom, porque no están hechas.

## 7. Árbol de proyectos

Dentro de `ProjectTree`, arriba de los productos:

```
Proyectos                    Abrir todos
```

El botón es `type="button"`. Su texto es también el `aria-label`.

| Estado | Botón | Click |
|--------|-------|-------|
| Algún producto cerrado, o la lista vacía de expandidos | Abrir todos | `expanded` = todos los id de grupo |
| Todos los grupos abiertos | Cerrar todos | `expanded` = vacío, y `suppressActive = true` |

El `useEffect` que hoy abre el grupo del proyecto activo no corre mientras `suppressActive` sea true. Cuando `activeGroupId` cambia, `suppressActive` vuelve a false y ese grupo se abre.

Abrir o cerrar un producto a mano no cambia `suppressActive`. No hay `localStorage`. Con cero grupos el componente sigue devolviendo `null` y el botón no aparece.

El drawer móvil usa el mismo `SidebarContent`, así que el botón está ahí también. Con el sidebar en rail de íconos el árbol no se monta.

## 8. Color

El punto usa estas clases, las mismas en claro y oscuro (el token soft ya tiene variante oscura en `src/index.css` para los cinco primeros; violeta, teal y naranja usan la escala de Tailwind con opacidad):

| Clave | Clase del punto | Etapa de fábrica |
|-------|-----------------|------------------|
| `slate` | `bg-muted-foreground` | Por hacer |
| `blue` | `bg-info-soft-foreground` | En curso |
| `amber` | `bg-warning-soft-foreground` | Bloqueada |
| `green` | `bg-success-soft-foreground` | Hecha |
| `rose` | `bg-destructive-soft-foreground` | — |
| `violet` | `bg-violet-500` | — |
| `teal` | `bg-teal-500` | — |
| `orange` | `bg-orange-500` | — |

El punto va en el encabezado de columna, en el pager, en los select de estado y en el badge de la lista. El fondo de la columna solo cambia por el aviso de WIP que ya existe.

## 9. Historias y criterios

### HU-01 — Ver las cuatro etapas de siempre

**Como** persona que abre un proyecto existente, **quiero** el mismo tablero de siempre **para** no reacomodar el trabajo.

- **CA-01.1** Un proyecto sin `stages` migrado a v24 tiene las cuatro etapas de `DEFAULT_STAGES`, en ese orden, y cada tarea conserva su `status`.
- **CA-01.2** El avance del proyecto no cambia por la migración.
- **CA-01.3** `newProject` ya trae `stages`.

### HU-02 — Agregar una etapa

**Como** persona en un proyecto, **quiero** agregar una etapa **para** reflejar un paso de mi proceso.

- **CA-02.1** «Nueva etapa» pide nombre y color, y la columna aparece inmediatamente antes de Hecha.
- **CA-02.2** Nombre vacío no crea la etapa y muestra «Escribí un nombre.» Un nombre repetido, sin importar mayúsculas, muestra «Ya hay una etapa con ese nombre.» El input no deja pasar de 40 caracteres.
- **CA-02.3** Puedo crear una tarea en esa columna, y mover otra arrastrando. La tarea queda con el id de la etapa.
- **CA-02.4** Recargar el proyecto muestra la misma etapa, el mismo color y las mismas tareas.
- **CA-02.5** En el teléfono, el «+» del pager abre el mismo alta y la etapa entra en el carrusel.

### HU-03 — Nombre, color y orden

**Como** persona, **quiero** ajustar una etapa **para** que el tablero se lea como mi proceso.

- **CA-03.1** Renombrar Hecha a «Listo» cambia el encabezado, el pager, el drawer y Mis tareas. Las tareas siguen en `done` y siguen contando como terminadas.
- **CA-03.2** Cambiar el color cambia el punto. Las tarjetas siguen con el color de urgencia.
- **CA-03.3** Mover «Bloqueada» a la izquierda la deja antes de «En curso». Hecha sigue última y su menú no ofrece mover.
- **CA-03.4** La etapa inmediatamente anterior a Hecha no ofrece «Mover a la derecha».

### HU-04 — Borrar una etapa nueva

**Como** persona, **quiero** sacar una etapa que ya no uso **para** que las tareas no queden huérfanas.

- **CA-04.1** El menú de Por hacer, En curso, Bloqueada y Hecha no tiene Eliminar.
- **CA-04.2** Eliminar una etapa custom con 3 tareas (una archivada) pide confirmación y las tres quedan en la etapa de la izquierda, con el mismo `archived`.
- **CA-04.3** Eliminar la primera etapa manda sus tareas a la etapa que le sigue.
- **CA-04.4** Cancelar no cambia nada.

### HU-05 — Archivar lo que está en Hecha

**Como** persona, **quiero** un botón en Hecha **para** limpiar el tablero sin borrar el historial.

- **CA-05.1** Con 12 tareas visibles en Hecha, el botón dice «Archivar 12». Con una, «Archivar 1». Con cero, no está.
- **CA-05.2** Confirmar marca esas tareas `archived: true`, les deja `status: "done"` y desaparecen del tablero. Siguen en Archivadas.
- **CA-05.3** Un filtro de sprint activo limita el botón a las tareas de Hecha que el filtro muestra. Las otras hechas siguen en el tablero al quitar el filtro.
- **CA-05.4** Cancelar no archiva.
- **CA-05.5** El botón usa el nombre actual de la etapa, no la palabra fija «Hecha», cuando fue renombrada.

### HU-06 — Pendiente hasta Hecha

**Como** persona, **quiero** que una etapa nueva no cierre el trabajo **para** que el porcentaje no mienta.

- **CA-06.1** Una tarea en una etapa custom cuenta como abierta en el avance, en el informe y en el dashboard.
- **CA-06.2** Mis tareas la muestra sin activar «Mostrar hechas».
- **CA-06.3** El filtro «Otras etapas» la incluye y no incluye las cuatro base.
- **CA-06.4** Un flujo o la IA que escribe `status: "done"` sigue cerrando la tarea. No pueden elegir la etapa custom.

### HU-07 — Abrir o cerrar todos los proyectos

**Como** persona con varios productos en el panel izquierdo, **quiero** abrirlos o cerrarlos todos **para** encontrar un proyecto sin ir de a uno.

- **CA-07.1** Con al menos un producto cerrado, el botón dice «Abrir todos» y un click muestra los proyectos de cada producto.
- **CA-07.2** Con todos abiertos, dice «Cerrar todos» y un click deja solo los nombres de producto, incluido el del proyecto abierto.
- **CA-07.3** Después de cerrar todos, navegar a un proyecto de otro producto abre ese producto.
- **CA-07.4** Recargar la página vuelve al comportamiento de hoy: solo el producto del proyecto activo empieza abierto.
- **CA-07.5** Con el sidebar minimizado el botón no está. En el drawer móvil sí.

## 10. Pruebas

Unitarias, sin navegador:

- `normalizeStages`: ausente, id base faltante, `done` fuera del final, color inválido, id duplicado.
- `addStage`, `renameStage`, `recolorStage`, `moveStage`, `removeStage` con los rechazos de D6–D8, incluidas las archivadas en el borrado.
- Migración de un proyecto v23 sin `stages`: queda en v24, cuatro etapas, statuses intactos.
- `parseMyTasksQuery` / el filtro: `status=otras` aísla ids que no son base; `status=done` no las incluye.

Los tests que arman un proyecto con `ProjectSchema.parse` o `newProject` siguen válidos porque `stages` defaultea. Un snapshot del documento entero ahora incluye `stages`.

## 11. Fuera de este spec

- Copiar etapas de un proyecto a otro, o definirlas en el tipo de proyecto.
- Borrar o reordenar Hecha, o hacer que una etapa custom cuente como terminada.
- Selector de color libre, drag de columnas, límite WIP en etapas nuevas.
- Un buscador dentro del árbol. La búsqueda ⌘K no se toca.
- Que los flujos o la IA creen etapas o muevan una tarea a un id custom.

## 12. Archivos que este spec espera tocar

Dominio: `src/domain/schemas/common.ts`, `src/domain/schemas/project.ts`, `src/domain/factories.ts`, `src/domain/migrations.ts`, `src/domain/projectOps.ts`, un módulo nuevo `src/domain/kanbanStages.ts`, `src/automations/activity.ts`.

Tablero: `src/features/projects/components/TasksTab.tsx`, `kanban/KanbanColumn.tsx`, `kanban/KanbanColumnPager.tsx`, `kanban/KanbanListView.tsx`, `kanban/ArchivedTasksList.tsx`, `kanban/TaskDetailDrawer.tsx`, `TaskFormDialog.tsx`.

Mis tareas: `src/features/my-tasks/filterMyTasks.ts` y el control de estado de `MyTasksPage.tsx`.

Árbol: `src/components/layout/ProjectTree.tsx`.

No se tocan `wipLimits`, el color de `TaskCard`, ni el catálogo de estados de flujos y de IA, salvo el tipo de `Task.status` donde el compilador lo pida para aceptar un id custom.
