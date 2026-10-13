# Design 075 — Tablero global y orden de proyectos

> Autoridad: `spec.md` (D1–D24, HU-01…06). Si este archivo y el spec chocan, gana el spec.
> Snippets de esta página. `SCHEMA_VERSION` **24 → 25**.

## 0. Mapa de archivos

| Archivo | Qué |
|---------|-----|
| `src/domain/schemas/common.ts` | `SCHEMA_VERSION = 25` |
| `src/domain/schemas/workspace.ts` | `sidebarOrder`, `boardViews` en `SettingsSchema` |
| `src/domain/migrations.ts` | Paso `workspace` `{ to: 25 }` |
| `src/domain/migrations.test.ts` | El default del registry deja de ser v24. Caso workspace v24 → v25 |
| `src/ai/keys-never-exported.test.ts` | El pin `SCHEMA_VERSION === 24` pasa a 25 |
| `src/domain/sidebarOrder.ts` | **Nuevo.** Clave de grupo, orden de lectura, reorder |
| `src/domain/sidebarOrder.test.ts` | **Nuevo.** Casos §9.1 |
| `src/features/board/boardQuery.ts` | **Nuevo.** Parseo, canónico, filtro, columnas, vistas |
| `src/features/board/boardQuery.test.ts` | **Nuevo.** Casos §9.2 y §9.3 |
| `src/features/board/BoardPage.tsx` | **Nuevo.** Filtros, columnas, drawer, menú de vistas |
| `src/features/board/GlobalTaskCard.tsx` | **Nuevo.** Tarjeta |
| `src/routes/paths.ts` | `board: "/app/board"` |
| `src/App.tsx` | Ruta lazy `board` |
| `src/components/layout/AppLayout.tsx` | Ítem «Tablero» después de Mis tareas |
| `src/components/layout/ProjectTree.tsx` | Asa, `DndContext` por grupo, flechas |
| `src/ai/chat/uiContext.ts` | Prefijo `/app/board` → `board`, label «Tablero» |

No se toca: `TasksTab`, `TaskCard`, `filterMyTasks`, `filterProjects` (solo se importa `foldName`), `projectOps` (se llama `updateTask`), etapas, WIP, `package.json`.

Reusar: `PageHeader`, `EmptyState`, `Select`, `Input`, `Button`, `Checkbox`, `Badge`, `DropdownMenu`, `Dialog`, `KanbanColumnPager`, `TaskDetailDrawer`, `useDebounce`, `useBreakpoint`, `SortableItem`, `taskUrgency`, `URGENCY_RAIL`, `stageLabel`, `stageDotClass`, `priorityLabel`, `daysUntil`, `uuid`, `updateSettings`. Sin librerías nuevas. PowerShell: sin `&&`.

## 1. Settings

En `SettingsSchema`, después de `deriveHealth`:

```ts
sidebarOrder: z.record(z.string(), z.array(z.string())).default({}),
boardViews: z
  .array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1).max(40),
      query: z.string(),
    }),
  )
  .max(20)
  .default([]),
```

`emptyWorkspace()` los recibe por el default de Zod. No hace falta tocar `newProject`.

## 2. Migración

Kind nuevo en el registry. Los otros kinds no ganan un paso: `migrateRecord` les escribe `schemaVersion: 25` por el fallback.

```ts
workspace: [
  {
    to: 25,
    up(data) {
      const raw = data.settings;
      const settings =
        typeof raw === "object" && raw !== null
          ? { ...(raw as Record<string, unknown>) }
          : {};
      if (typeof settings.sidebarOrder !== "object" || settings.sidebarOrder === null) {
        settings.sidebarOrder = {};
      }
      if (!Array.isArray(settings.boardViews)) settings.boardViews = [];
      return { ...data, settings };
    },
  },
],
```

`readWorkspace` escribe el JSON migrado antes del parse. Por eso el paso tiene que dejar las dos claves en el archivo, no confiar solo en el default de Zod.

El test que hoy dice `projects v1 -> v24` y espera `schemaVersion === 24` pasa a esperar **25**. Las cuatro etapas siguen ahí (el paso 24 de projects corre igual). El pin de `keys-never-exported.test.ts` pasa a 25. No reescribir tests que migran hacia v24 a propósito (`migrateRecord(..., 24, MIGRATIONS)`).

## 3. Orden de la barra

`src/domain/sidebarOrder.ts`.

```ts
export const UNASSIGNED_GROUP = "__unassigned";

export function groupKey(productId: string | null): string {
  return productId ?? UNASSIGNED_GROUP;
}

/** Ids de `listed` que siguen en `projects`, en ese orden.
 *  Los que no están en `listed` van al final, en el orden de `projects`. */
export function orderProjects<T extends { id: string }>(
  projects: readonly T[],
  listed: readonly string[] | undefined,
): T[]

/** null = no hay movimiento (id ausente o el mismo puesto). */
export function reorderWithin(
  ids: readonly string[],
  activeId: string,
  overId: string,
): string[] | null
```

`ProjectTree` deja de empujar los proyectos en el orden crudo del store. Para cada grupo llama `orderProjects(group.projects, sidebarOrder[group.id])`.

Al soltar dentro del grupo:

1. `visible = orderProjects(proyectos del grupo, lista actual).map(p => p.id)`
2. `next = reorderWithin(visible, activeId, overId)`
3. Si `next` es null, no se escribe.
4. `updateSettings({ sidebarOrder: { ...sidebarOrder, [groupId]: next } })`

El asa usa `SortableItem`. Los `listeners` van en el botón del asa, no en el `NavLink`. Sensor de mouse con `activationConstraint: { distance: 8 }`. En touch, `TouchSensor` con `delay: 200` y `tolerance: 8`, para que el scroll de la barra siga ganando si el dedo se mueve enseguida.

El botón del asa:

- `type="button"`
- `aria-label={`Reordenar ${project.name}`}`
- `ArrowUp` / `ArrowDown`: `preventDefault`, calculan el vecino en la lista visible y escriben con la misma función. En el extremo no hacen nada.

Una región `aria-live="polite"` en el árbol anuncia «Quedó primero en {producto}» o «Quedó en el puesto {n} en {producto}». `n` es 1-based.

Cero grupos: el componente sigue devolviendo `null`, como hoy. El efecto de «Cerrar todos» no se toca.

## 4. Query del tablero

`src/features/board/boardQuery.ts`.

```ts
export type BoardDateFilter = "overdue" | "due-soon" | "this-week";

export interface BoardQuery {
  productIds: string[];
  projectIds: string[];
  personId: string | null;
  priority: Priority | null;
  date: BoardDateFilter | null;
  q: string;
  showDone: boolean;
  viewId: string | null;
}

export interface BoardCard {
  task: Task;
  projectId: string;
  projectName: string;
  productId: string | null;
  taskIndex: number;
  stageName: string;
}

export interface BoardColumnModel {
  id: "todo" | "doing" | "blocked" | "otras" | "done";
  name: string;
  color: StageColor;
  cards: BoardCard[];
  /** Hecha, con las tarjetas ocultas. 0 en el resto. */
  hiddenCount: number;
}
```

`parseBoardQuery(params, known)`:

- Parte `product` y `project` por coma, recorta, tira vacíos y duplicados.
- Un id que no está en `known.productIds` / `known.projectIds` se descarta. Si no queda ninguno, el filtro no se aplica.
- `person` desconocido → null. `priority` fuera del enum → null. `date` fuera de los tres valores → null.
- `done` solo cuenta si es `"1"`. `q` se recorta. `view` se guarda tal cual; la página decide si el id existe.

`canonicalBoardSearch(query): URLSearchParams` escribe solo lo activo, en el orden de keys del spec §4. Los ids van con `localeCompare`. `view` no entra en esta función.

`filtersEqual(a, b)` compara los campos de filtro, sin `viewId`.

`collectBoardCards(projects, query, now)`:

1. Saltea proyectos `done` y `archived`.
2. Si hay `productIds`, exige `productId` en el set.
3. Si hay `projectIds`, exige `id` en el set.
4. Saltea tareas archivadas.
5. `personId`: exige `assigneeId`.
6. `priority`: exige igualdad.
7. `date`: misma función que Mis tareas (`daysUntil`; vencida `< 0`, por vencer `0..3`, esta semana `0..7`; sin fecha no matchea).
8. `q`: `foldName(title)` contiene `foldName(q)`. `q` vacío no filtra.
9. Arma `BoardCard` con `taskIndex` = índice en `project.tasks` y `stageName = stageLabel(project, task.status)`.

`boardProjectRank(products, projects, sidebarOrder): Map<string, number>` recorre `products` en orden del array. En cada uno, `orderProjects` de los proyectos de ese `productId` que no estén `done`/`archived`. Después el grupo `__unassigned`. Asigna 0, 1, 2… Un proyecto que no entró queda con un rango alto (`Number.MAX_SAFE_INTEGER`).

`sortCards(cards, rank)` ordena por rango, después `taskIndex`, después `title` con `localeCompare(..., "es")`.

`boardColumns(cards, showDone, rank): BoardColumnModel[]`:

- Clasifica: `todo` / `doing` / `blocked` / `done` por id. Cualquier otro status va a `otras`.
- Ordena cada balde con `sortCards`.
- Devuelve siempre todo, doing, blocked.
- Agrega otras solo si `cards.length > 0`.
- Hecha va siempre al final. Si `showDone` es false, `cards` de Hecha va vacío y `hiddenCount` es el tamaño real del balde. Si es true, `hiddenCount` es 0 y las tarjetas se ven.

`hiddenCount` no se usa en las otras columnas.

## 5. Vistas

En el mismo módulo. Operan sobre el array y devuelven uno nuevo, o un error. No tocan la URL.

```ts
export type ViewNameError = "empty" | "duplicate" | "limit";

export function viewNameError(
  views: readonly { id: string; name: string }[],
  name: string,
  ignoreId?: string,
): ViewNameError | null

export function matchingViewId(
  views: readonly { id: string; query: string }[],
  search: URLSearchParams,
): string | null
```

`viewNameError`: trim, vacío → `empty`; más de 40 no llega porque el input tiene `maxLength={40}`; `foldName` igual a otra → `duplicate`; si no se pasa `ignoreId` y ya hay 20 → `limit`. Actualizar no llama esto.

`matchingViewId` parsea cada `query` guardado y usa `filtersEqual` contra `parseBoardQuery(search)`. El primer match gana.

La página:

- Aplicar: `setSearchParams(canonical + view=id, { replace: true })`.
- Guardar: `uuid()`, append, `updateSettings`. Después aplica, para que `view` quede en la URL.
- Actualizar: reemplaza `query` de ese id por `canonicalBoardSearch` de lo que hay ahora (sin `view`).
- Renombrar: mismo error de nombre, ignorando el propio id.
- Borrar: filtra el array. Si `view` de la URL es ese id, se borra el param y se dejan los filtros.

`view` con un id que no está en `boardViews` se ignora al pintar. No se borra solo, para no pelear con un workspace que todavía no hidrató. Cuando `hydrated` es true y el id no existe, la página lo saca con `replace: true`, igual que Mis tareas hace con la persona desconocida.

## 6. Página

`BoardPage`. Título de `PageHeader`: label «Tablero», title «Todas las tareas», description «Un kanban con las tareas de tus proyectos. Filtrá por producto o guardá tu propio recorte.»

Controles, en una fila que wrappea:

| Control | Texto |
|---------|--------|
| Select de producto | Primera opción «Agregar producto». Al elegir, suma el id y vuelve a vacío. |
| Select de proyecto | «Agregar proyecto». Lista proyectos que no están `done` ni `archived`, en el orden de `boardProjectRank`, etiqueta `Nombre` y, si tiene producto, `Nombre · Producto`. |
| Chip | `aria-label={`Quitar ${nombre}`}` |
| Persona | «Todas» + people. Label «Persona». |
| Prioridad | «Todas» + las cuatro, labels de `priorityLabel`. Label «Prioridad». |
| Vencimiento | «Todas», «Vencidas», «Por vencer (3 días)», «Esta semana». Label «Vencimiento». |
| Búsqueda | placeholder «Buscar tarea». Label «Buscar». |
| Checkbox | «Mostrar hechas», `aria-label="Mostrar hechas"`. |
| Botón | «Limpiar filtros». Se deshabilita si no hay ninguno de D13 activo. |
| Menú | «Vistas». |

Chips arriba de los selects cuando hay alguno.

Vacío de proyectos elegibles (ningún proyecto fuera de done/archived), sin filtros: `EmptyState` title «Todavía no hay proyectos.» description «Creá un proyecto para ver sus tareas acá.»

Con filtros y cero tarjetas en todo/doing/blocked/otras, y Hecha sin ocultas o también vacía: title «Ninguna tarea coincide con estos filtros.» y un botón «Limpiar filtros».

Columna: encabezado con punto (`stageDotClass`), nombre y conteo de tarjetas visibles. En Hecha, si `hiddenCount > 0`, al lado del conteo visible (0) el texto «{n} ocultas». Otras usa color `slate` y nombre «Otras».

De `sm` para arriba, las columnas en una fila con scroll horizontal, el mismo aire que el kanban del proyecto. Cada columna es droppable con su `id`. Las tarjetas son draggable. «Otras» no es droppable. Soltar en la misma columna: return. Soltar en otra: `mutateProject(projectId, (p) => updateTask(p, { ...task, status: columnId }))`. El id `otras` nunca se escribe en `task.status`.

Debajo de `sm`: `KanbanColumnPager` sin `onAddStage`. Una columna a la vez. Las tarjetas no usan `useSortable`. El estado se cambia en el drawer.

`GlobalTaskCard`: título, línea del proyecto en `text-muted-foreground`, badge de prioridad, fecha si hay, nombre del responsable si hay. En la columna Otras, un badge con `stageName`. Franja `URGENCY_RAIL[taskUrgency(task)]`. El clic llama `openDetail`. El asa de la tarjeta (solo `sm+`) tiene `aria-label={`Mover ${title}`}`.

El drawer es `TaskDetailDrawer` con el proyecto de la tarjeta, como `MyTasksPage.openDetail` / `handleUpdateTask`. No se le pasan las flechas de etapa. Si al guardar la tarea deja de pasar el filtro (por ejemplo pasó a hecha con el interruptor apagado), se cierra el drawer.

El overlay de arrastre es la misma tarjeta con `isOverlay`.

## 7. Menú de vistas

Ítems:

- Cada vista guardada. La que `matchingViewId` devuelve lleva una marca. Clic = aplicar.
- Si no hay ninguna: un ítem deshabilitado «Sin vistas guardadas».
- Separador.
- «Guardar vista» abre un diálogo con input «Nombre» y botón «Guardar». Errores debajo del input, en `text-sm text-destructive`: «Escribí un nombre.», «Ya hay una vista con ese nombre.», «Podés guardar hasta 20 vistas.»
- Si la URL tiene un `view` que existe y los filtros ya no coinciden: texto «Vista modificada», ítem «Actualizar "{nombre}"», ítem «Guardar como nueva».
- Con una vista coincidente o modificada: «Renombrar» (mismo diálogo) y «Eliminar». Eliminar no pide confirmación: es una preferencia, no borra tareas.

## 8. Nav y contexto

`App.tsx`: lazy de `BoardPage`, ruta `path: "board"` hermana de `my-tasks`.

`uiContext.ts`: en `SECTION_PREFIXES`, la entrada `["/app/board", "board"]`. En `SECTION_LABELS`, `board: "Tablero"`. El `default` de `selectWorkspaceIndex` ya deja el portafolio, que es lo que esta pantalla necesita. No hace falta un case nuevo.

## 9. Tests

TDD: el archivo de test de cada fase falla antes de la implementación.

### 9.1 `sidebarOrder.test.ts`

- Sin lista, el orden de entrada se conserva.
- La lista manda. Un id que no está en los proyectos se salta. Un proyecto que no está en la lista va al final.
- Ids repetidos en la lista: cuenta una vez.
- `reorderWithin` mueve y devuelve null si el destino es el mismo id o no está.
- `groupKey(null)` es `__unassigned`.

### 9.2 `boardQuery.test.ts` — filtro y columnas

- Un proyecto `archived` y uno `done` no aportan tareas. Uno `paused` sí.
- Una tarea archivada no entra. Una con status propio cae en Otras y `stageName` es el nombre de la etapa.
- Sin tareas en Otras, la columna no está. Hecha está. Con `showDone` false, Hecha tiene `cards` vacío y `hiddenCount` igual al número de hechas que pasaron el filtro.
- `product` y `project` son AND.
- Ids desconocidos en la coma se ignoran. Si todos son desconocidos, ese param no filtra.
- `date=due-soon` toma 0..3 y deja afuera una tarea sin fecha. `q` no distingue mayúsculas ni diacríticos.
- El orden de las tarjetas sigue `sidebarOrder` dentro del producto, y el orden de productos del array. Dentro del proyecto, manda `taskIndex`.
- `canonicalBoardSearch` omite defaults y ordena los ids.

### 9.3 Vistas

- Nombre vacío y nombre repetido por `foldName`.
- El límite 20 solo al crear.
- `matchingViewId` ignora `view` y `done` se compara de verdad: una vista guardada con `done=1` no matchea la URL sin `done`.

### 9.4 Migración

- Un workspace v24 sin esas claves sale con `schemaVersion` 25, `sidebarOrder` `{}` y `boardViews` `[]`.
- Un workspace que ya trae una vista no la pisa.

## 10. Trampas

- No escribas el id `otras` en `task.status`. Es una columna de presentación.
- `TaskCard` no se importa en el tablero global. Las flechas de la 073 no aplican.
- `updateSettings` reemplaza con spread de primer nivel. Hay que pasar el record `sidebarOrder` completo, no una clave suelta: `{ sidebarOrder: { ...prev, [groupId]: next } }`.
- El árbol minimizado no está montado. No agregues un segundo editor de orden en Ajustes.
- En `< sm` no registres sensores de arrastre de tarjetas. El pager y el drawer alcanzan.
- Un `Project` literal viejo no se toca: este spec no cambia `ProjectSchema`.
- El test de migración a «versión actual» tiene que esperar 25. Un test que fija el target en 24 se queda en 24.
