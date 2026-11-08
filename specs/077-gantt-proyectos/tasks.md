# Tasks 077 — Gantt de proyectos

> **Para quien ejecute (agente):** SUB-SKILL REQUERIDA: usar superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan checkboxes (`- [ ]`).

**Objetivo:** página `/app/gantt` con una fila por proyecto (barra + puntos de tareas hechas/pendientes/vencidas), desplegable por proyecto, filtrable por producto/proyecto, y con `Task.completedAt` registrado en cada cierre.

**Arquitectura:** el cierre se estampa en un solo punto (`persistProject`) con una función pura de dominio. Toda la geometría del Gantt (ventana, columnas, barras, puntos, filtro, orden, URL) son funciones puras en `src/features/gantt/` con tests; la página solo pinta con CSS grid + posiciones en %.

**Stack:** React 18 + TS estricto, Zustand, Zod, Vitest, Tailwind, lucide-react 0.456. Sin librerías nuevas.

**Spec:** `specs/077-gantt-proyectos/spec.md` (autoridad: D1–D26, HU-01…09). Si este archivo y el spec chocan, gana el spec.

## Restricciones globales

- `SCHEMA_VERSION` **26 → 27**. Rama: `feat/077-gantt-proyectos`.
- Sin dependencias npm nuevas (`package.json` no cambia).
- Copy de UI en rioplatense, **tuteo**. Textos cerrados: «Gantt», «+ Proyecto», «Cerrados», «Limpiar filtros», «Hoy», «Mes», «Trimestre», «Año», «Sin fechas», «Sin fecha», «Fecha aproximada», «No hay proyectos con fechas ni tareas en este período.», «Ir a hoy».
- Solo `status === "done"` cuenta como hecha (073 D5).
- Ningún módulo fuera de `src/domain/taskCompletion.ts` escribe `completedAt` / `completedAtEstimated` (salvo `newTask`, la migración y el seed de demo, que solo inicializan).
- Clave de memoria: `hito.gantt.lastQuery`. Params de URL: `product`, `project`, `scale`, `at`.
- PowerShell: sin `&&`. Un comando por línea.
- Verificación después de cada tarea:
  ```
  npx tsc --noEmit
  npx vitest run --exclude ".worktrees/**" <tests de la tarea>
  ```
  Al cerrar la Tarea 7, la suite entera con el mismo exclude, y `graphify update .`.

## Foco de revisión

Lo que el spec implica y es más probable que muerda a quien use la app. Cada línea tiene su test en la tarea dueña.

1. **Zona horaria:** una tarea cerrada a las 23:30 hora local (`completedAt` ISO en UTC del día siguiente) cae en el **día local** del cierre, no en el siguiente → Tarea 2 (`completionDay`).
2. **Barra que excede la ventana:** un proyecto que empezó antes y termina después de la ventana se recorta a los bordes (0 %–100 %) y no desborda; un punto fuera de la ventana no se dibuja → Tarea 5 (`placeRange`, `buildGanttRows`).
3. **Fechas al revés:** `dueDate < startDate` en un proyecto no rompe: la barra va del menor al mayor → Tarea 5 (`projectBar`).
4. **Ids basura en URL o memoria:** un id de proyecto archivado, borrado o inventado, o un `localStorage` corrupto/inaccesible, se ignora sin romper la página → Tarea 4.
5. **Muchas tareas el mismo día:** se agrupan en un solo punto con número y el tooltip corta en 5 + «y N más» → Tarea 5 (`groupDots`, `dotTooltip`).

---

### Tarea 1: Esquema v27 y migración

**Archivos:**
- Modificar: `src/domain/schemas/common.ts:3` (`SCHEMA_VERSION = 27`)
- Modificar: `src/domain/schemas/project.ts` (`TaskSchema`, después de `actualHours`)
- Modificar: `src/domain/factories.ts` (`newTask`: `completedAt: null`, `completedAtEstimated: false`)
- Modificar: `src/domain/migrations.ts` (paso `projects` `{ to: 27 }` al final del array `projects`)
- Test: `src/domain/migrations.test.ts`, `src/ai/keys-never-exported.test.ts:61`

**Interfaces:**
- Produce: `Task.completedAt: string | null`, `Task.completedAtEstimated: boolean` (spec §4, con el JSDoc de ahí).

- [ ] **Paso 1: tests que fallan.** En `migrations.test.ts`, el caso «defaults the target to the current SCHEMA_VERSION (real registry: projects v1 -> v26)» pasa a v27 y espera `schemaVersion` 27. Agregar `describe("projects v26 -> v27 (spec 077: completedAt)")`:
  ```ts
  it("backfills done tasks from updatedAt as estimated", () => {
    const doc = { schemaVersion: 26, id: "p", name: "P", tasks: [
      { id: "a", title: "A", status: "done", updatedAt: "2026-03-04T15:00:00.000Z" },
      { id: "b", title: "B", status: "doing", updatedAt: "2026-03-05T15:00:00.000Z" },
    ] };
    const { value } = migrateRecord("projects", doc, 27, MIGRATIONS);
    expect(value.tasks[0]).toMatchObject({ completedAt: "2026-03-04T15:00:00.000Z", completedAtEstimated: true });
    expect(value.tasks[1]).toMatchObject({ completedAt: null, completedAtEstimated: false });
  });
  it("does not overwrite an existing completedAt", () => { /* done + completedAt "2026-01-01T00:00:00.000Z", estimated false → queda igual */ });
  it("tolerates a project without tasks", () => { /* tasks ausente → no tira, schemaVersion 27 */ });
  ```
  En `keys-never-exported.test.ts:61` el pin pasa a 27.
- [ ] **Paso 2:** correr `npx vitest run --exclude ".worktrees/**" src/domain/migrations.test.ts src/ai/keys-never-exported.test.ts` → FALLA.
- [ ] **Paso 3:** implementar. El paso 27 recorre `data.tasks` si es array; para cada tarea, si `status === "done"` y `completedAt` no es string → `completedAt = updatedAt ?? null`, `completedAtEstimated = true`; si no es `done` → `completedAt = null`, `completedAtEstimated = false`; si ya tenía `completedAt` string se deja. Agregar los dos campos a `TaskSchema` y a `newTask`.
- [ ] **Paso 4:** mismo comando → PASA. `npx tsc --noEmit` limpio (los literales de `Task` que tsc marque reciben los dos campos).
- [ ] **Paso 5:** commit `feat(077): add Task.completedAt with v27 migration`.

### Tarea 2: Estampado y día de cierre (dominio puro)

**Archivos:**
- Crear: `src/domain/taskCompletion.ts`
- Test: `src/domain/taskCompletion.test.ts`

**Interfaces:**
- Consume: `Task`, `Project` (Tarea 1); `todayKey` de `@/lib/dates`.
- Produce:
  - `stampTaskCompletions(prev: Project | null, next: Project, now: string): Project` (spec D4)
  - `completionDay(task: Task): { day: string; estimated: boolean } | null` (spec D8; null si `status !== "done"`)

- [ ] **Paso 1: tests que fallan** (`describe("stampTaskCompletions")`), con `now = "2026-10-17T12:00:00.000Z"`:
  - `stamps now when a task moves into done` → prev `doing`, next `done` → `completedAt === now`, `completedAtEstimated === false`.
  - `stamps a new task created as done` → `prev = null` y también prev sin esa tarea → `completedAt === now`.
  - `keeps an existing close date on unrelated saves` → prev y next `done` con `completedAt: "2026-01-02T10:00:00.000Z"`, `estimated: true` → se conservan los dos.
  - `does not stamp an already-done task with null completedAt` → prev y next `done`, `completedAt: null` → sigue `null` (D4 b).
  - `clears the close date when a task leaves done` → prev `done` con fecha, next `todo` → `null` / `false`.
  - `returns the same object when nothing changes` → `expect(result).toBe(next)`.
  
  `describe("completionDay")`:
  - `uses the local day of completedAt` → `completedAt` = `new Date(2026, 9, 16, 23, 30).toISOString()` → `{ day: "2026-10-16", estimated: false }` (foco 1).
  - `falls back to updatedAt as estimated` → done, `completedAt: null`, `updatedAt` del 2026-05-03 local → `{ day: "2026-05-03", estimated: true }`.
  - `returns null for a pending task`.
- [ ] **Paso 2:** `npx vitest run --exclude ".worktrees/**" src/domain/taskCompletion.test.ts` → FALLA.
- [ ] **Paso 3:** implementar. El día local sale de `todayKey(new Date(iso))`. El estampado solo copia el proyecto y las tareas que cambian.
- [ ] **Paso 4:** mismo comando → PASA.
- [ ] **Paso 5:** commit `feat(077): stamp and resolve task completion dates`.

### Tarea 3: Estampar en `persistProject` y seed de demo

**Archivos:**
- Modificar: `src/store/useDataStore.ts:732` (`persistProject`)
- Modificar: `src/domain/demo/seedData.ts:423` (`task()`)
- Test: `src/store/useDataStore.completedAt.test.ts` (nuevo; mismo patrón de mocks que `useDataStore.runFlowNow.test.ts`), `src/domain/demo/seed.test.ts`

**Interfaces:**
- Consume: `stampTaskCompletions` (Tarea 2).
- Produce: todo proyecto en `useDataStore.getState().projects` y en disco tiene sus cierres estampados.

- [ ] **Paso 1: tests que fallan.** Con un adapter en memoria/mockeado (como los tests existentes del store):
  - `saveProject stamps a task moved to done` → crear proyecto con tarea `todo`, `mutateProject` a `done` → la tarea en el store tiene `completedAt` string y `completedAtEstimated === false`, y lo escrito por `adapter().write("projects", …)` también.
  - `flow results are stamped too` → llamar al camino de `applyFlowResult` (o al `runFlowNow` mockeado como en `runFlowNow.test.ts`) con un `changedProjects` que cierra una tarea → tiene `completedAt` (spec HU-08).
  - `reopening clears completedAt` → `done` → `doing` → `completedAt === null`.
  
  En `seed.test.ts`: `demo done tasks carry completedAt` → toda tarea `done` del seed tiene `completedAt` string.
- [ ] **Paso 2:** `npx vitest run --exclude ".worktrees/**" src/store/useDataStore.completedAt.test.ts src/domain/demo/seed.test.ts` → FALLA.
- [ ] **Paso 3:** en `persistProject`, primera línea: `p = stampTaskCompletions(s.projects.find((x) => x.id === p.id) ?? null, p, nowIso())` antes de armar `next` (spec D5). En el seed, `task()` con `status === "done"` pone `completedAt` = `createdAt` restándole entre 1 y 20 días según el índice, para que la demo muestre historia; `completedAtEstimated: false`.
- [ ] **Paso 4:** mismo comando → PASA. Correr también `npx vitest run --exclude ".worktrees/**" src/store` para que los tests del store sigan verdes.
- [ ] **Paso 5:** commit `feat(077): stamp completions on every project write`.

### Tarea 4: Query de la URL y memoria

**Archivos:**
- Crear: `src/features/gantt/ganttQuery.ts`
- Modificar: `src/features/board/boardQuery.ts` (exportar `parseIdList` tal cual está)
- Test: `src/features/gantt/ganttQuery.test.ts`

**Interfaces:**
- Consume: `parseIdList` de `boardQuery`.
- Produce:
  ```ts
  export type GanttScale = "month" | "quarter" | "year";
  export interface GanttQuery { productIds: string[]; projectIds: string[]; scale: GanttScale; at: string | null }
  export interface KnownGanttRefs { productIds: ReadonlySet<string>; projectIds: ReadonlySet<string> }
  export const GANTT_MEMORY_KEY = "hito.gantt.lastQuery";
  export function parseGanttQuery(params: URLSearchParams, known?: KnownGanttRefs): GanttQuery;
  export function canonicalGanttSearch(q: GanttQuery): URLSearchParams; // orden: product, project, scale (omitido si "quarter"), at
  export function clearGanttFilters(q: GanttQuery): GanttQuery;          // vacía product/project, conserva scale y at (D20)
  export function ganttQueryIsEmpty(params: URLSearchParams): boolean;
  export function restoreGanttSearch(params: URLSearchParams, memory: string | null): string | null; // memoria sin `at` si params vacíos (D19)
  export function readGanttMemory(storage: Pick<Storage, "getItem">): string | null;  // try/catch → null
  export function writeGanttMemory(storage: Pick<Storage, "setItem">, search: string): void; // try/catch, guarda sin `at`
  ```
  `known.projectIds` = ids de proyectos **no archivados** (incluye `done`, spec D14b).

- [ ] **Paso 1: tests que fallan:**
  - `parses ids, scale and at` → `?project=b,a&scale=year&at=2026-01-15` → `projectIds ["b","a"]` (o normalizado), `scale "year"`, `at "2026-01-15"`.
  - `defaults scale to quarter and ignores invalid values` → `scale=week&at=2026-13-99` → `"quarter"`, `at null`.
  - `drops unknown and archived project ids` (foco 4) → `known.projectIds` sin `"x"` → `?project=x,a` da `["a"]`.
  - `canonical sorts ids and omits default scale` → `{projectIds:["b","a"], scale:"quarter"}` → `"project=a%2Cb"` (o `a,b` según `toString`), sin `scale`.
  - `clear keeps scale and at`.
  - `restore drops at from memory` → memoria `"project=a&scale=year&at=2025-01-01"`, params vacíos → `"project=a&scale=year"`; con params no vacíos → `null`.
  - `memory survives a throwing storage` (foco 4) → `getItem` que tira → `null`; `setItem` que tira → no propaga.
- [ ] **Paso 2:** `npx vitest run --exclude ".worktrees/**" src/features/gantt/ganttQuery.test.ts` → FALLA.
- [ ] **Paso 3:** implementar. `at` válido = regex `^\d{4}-\d{2}-\d{2}$` y que `parseDayKey` produzca la misma clave.
- [ ] **Paso 4:** mismo comando → PASA. `src/features/board/boardQuery.test.ts` sigue verde.
- [ ] **Paso 5:** commit `feat(077): gantt URL query and last-query memory`.

### Tarea 5: Modelo del Gantt (ventana, barras, puntos, filas)

**Archivos:**
- Crear: `src/features/gantt/ganttModel.ts`
- Modificar: `src/features/board/boardQuery.ts:183` (`boardProjectRank` suma 5.º parámetro `options: { includeDone?: boolean } = {}`; con `includeDone` solo se excluyen `archived`; default sin cambios)
- Test: `src/features/gantt/ganttModel.test.ts`, `src/features/board/boardQuery.test.ts` (un caso nuevo)

**Interfaces:**
- Consume: `GanttQuery`, `GanttScale` (Tarea 4); `completionDay` (Tarea 2); `boardProjectRank`; `DayRange`, `eachDay`, `daysBetween`, `parseDayKey`, `dayKeyFromDate`, `weekRangeContaining`, `monthRangeContaining` de `@/lib/dates`.
- Produce:
  ```ts
  export interface GanttColumn { start: string; end: string; label: string }
  export interface GanttWindow extends DayRange { scale: GanttScale; columns: GanttColumn[]; totalDays: number }
  export type DotKind = "done" | "pending" | "overdue";
  export interface GanttDot { day: string; kind: DotKind; estimated: boolean; tasks: Task[]; left: number } // left en %
  export interface GanttBar { start: string; end: string; derived: boolean; left: number; width: number }  // % recortados a la ventana
  export interface GanttTaskRow { task: Task; day: string | null; kind: DotKind; estimated: boolean; left: number | null }
  export interface GanttProjectRow { project: Project; bar: GanttBar | null; done: number; total: number; dots: GanttDot[]; taskRows: GanttTaskRow[] }

  export function ganttWindow(scale: GanttScale, anchor: string): GanttWindow;
  export function shiftAnchor(scale: GanttScale, anchor: string, delta: number): string; // ±1, ±3, ±12 meses
  export function placeDay(win: GanttWindow, day: string): number | null;                // % del inicio del día; null fuera
  export function placeRange(win: GanttWindow, start: string, end: string): { left: number; width: number } | null; // recorta; null si no intersecta
  export function projectBar(project: Project, tasks: readonly Task[]): { start: string; end: string; derived: boolean } | null; // D9
  export function ganttTasks(project: Project): Task[];                                 // D12
  export function groupDots(win: GanttWindow, rows: readonly GanttTaskRow[]): GanttDot[]; // por día+kind+estimated
  export function dotTooltip(dot: GanttDot): string;                                     // máx. 5 títulos + «y N más»
  export function buildGanttRows(input: {
    projects: readonly Project[]; products: readonly Product[];
    sidebarOrder: Readonly<Record<string, string[]>>; productOrder: readonly string[];
    query: GanttQuery; window: GanttWindow; today: string;
  }): GanttProjectRow[];
  ```
  Ventanas (spec D17): **month** = 6 semanas de lunes a domingo, la que contiene `anchor` es la 3.ª, columna = día, label = número de día. **quarter** = 13 semanas, la que contiene `anchor` es la 7.ª, columna = semana, label = «d mmm» del lunes. **year** = 12 meses, el de `anchor` es el 7.º, columna = mes, label = mes corto. `totalDays` = días inclusivos de la ventana.

- [ ] **Paso 1: tests que fallan:**
  - `quarter window is 13 weeks with the anchor week 7th` → `ganttWindow("quarter","2026-10-17")`: `columns.length === 13`, `columns[6]` contiene `2026-10-17`, `start` es lunes.
  - `month window is 42 days`, `year window is 12 months from April` (anchor octubre → `start "2026-04-01"`, `end "2027-03-31"`).
  - `shiftAnchor moves one period` → quarter +1 desde `2026-10-17` → `2027-01-17`; year −1 → `2025-10-17`.
  - `placeRange clips a bar that overflows the window` (foco 2) → start antes y end después → `{ left: 0, width: 100 }`; fuera por completo → `null`.
  - `placeDay returns null outside the window` (foco 2).
  - `projectBar uses project dates` → `{start, end, derived:false}`; `fills a missing end from tasks` → sin `dueDate`, tareas con `dueDate "2026-11-30"` y cierre `"2026-12-02"` → `end "2026-12-02"`, `derived true`; `no dates at all → null`; `swapped dates are ordered` (foco 3) → `startDate "2026-09-01"`, `dueDate "2026-08-01"` → `start "2026-08-01"`, `end "2026-09-01"`.
  - `ganttTasks keeps archived done and drops archived pending` (D12, HU-07).
  - `pending task past due is overdue` → `dueDate < today` → kind `"overdue"`; `dueDate === today` → `"pending"`.
  - `groupDots merges same-day tasks` (foco 5) → 7 hechas el mismo día → 1 punto con `tasks.length 7`; `dotTooltip` → 5 títulos y `"y 2 más"`.
  - `task rows order done, then pending, then undated` (D16).
  - `buildGanttRows hides out-of-window projects when no project is chosen` (D13) y `shows a chosen project even without dates` (fila con `bar null`).
  - `buildGanttRows includes done projects and excludes archived` (D13), `combines product and project with AND`, `orders like the sidebar including done projects` (D14).
  - `counts done/total over ganttTasks` → `done`, `total` (D10).
  
  En `boardQuery.test.ts`: `boardProjectRank ranks done projects only with includeDone` → default: el `done` no tiene rango; `{ includeDone: true }`: tiene rango dentro de su producto.
- [ ] **Paso 2:** `npx vitest run --exclude ".worktrees/**" src/features/gantt/ganttModel.test.ts src/features/board/boardQuery.test.ts` → FALLA.
- [ ] **Paso 3:** implementar. Fila desplegada: `left` = `placeDay` del `day` (null si no tiene día o cae fuera). El relleno de avance (D10) lo pinta la UI con `done / total`; el modelo no calcula más que esos dos números.
- [ ] **Paso 4:** mismo comando → PASA.
- [ ] **Paso 5:** commit `feat(077): gantt window, bars, dots and rows model`.

### Tarea 6: Página Gantt, ruta y navegación

**Archivos:**
- Crear: `src/features/gantt/GanttPage.tsx` (filtros, escala, navegación, estado vacío, drawer)
- Crear: `src/features/gantt/GanttGrid.tsx` (columna de nombres sticky + grilla; filas de proyecto y de tarea)
- Modificar: `src/routes/paths.ts` (`gantt: "/app/gantt"`)
- Modificar: `src/App.tsx` (ruta lazy `{ path: "gantt", element: page(<GanttPage />) }`, junto a `board`)
- Modificar: `src/components/layout/AppLayout.tsx:59` (`{ to: ROUTES.gantt, label: "Gantt", icon: GanttChart }` después de «Tablero»; `GanttChart` existe en lucide 0.456)
- Modificar: `src/ai/chat/uiContext.ts:58,188` (`["/app/gantt", "gantt"]` y label `gantt: "Gantt"`)
- Test: `src/ai/chat/uiContext.test.ts` (o el test existente de `uiContext`): `/app/gantt` → section `gantt`, label «Gantt».

**Interfaces:**
- Consume: todo lo de las Tareas 4 y 5; `TaskDetailDrawer` (`src/features/projects/components/kanban/TaskDetailDrawer.tsx`) con las mismas props que usa `BoardPage.tsx:567-576`; `Chip`/selectores de producto y proyecto de `BoardPage` (copiar el patrón, no importar el componente privado); `PageHeader`, `EmptyState`, `Button`, `Select`, `Badge`; `useDataStore` (`projects`, `products`, `people`, `mutateProject`), `useAppStore` (`workspace.settings.sidebarOrder`, `productOrder`); `ops.updateTask` para `onUpdate`.

Comportamiento (cada punto refiere al spec):
- URL ↔ estado con `setSearchParams(canonicalGanttSearch(q), { replace: true })` (D18). Al montar, si `ganttQueryIsEmpty`, aplicar `restoreGanttSearch(params, readGanttMemory(localStorage))`; en cada cambio, `writeGanttMemory` (D19).
- Barra de filtros: selector de producto (chips), «+ Proyecto» con grupo «Cerrados» para los `done` (D14b), «Limpiar filtros» (D20), «‹» «Hoy» «›» con `shiftAnchor` (D17) y un toggle Mes | Trimestre | Año.
- Fila de proyecto: botón con `aria-expanded` sobre el nombre (D15, D22), contador «hechas/total», ícono `ExternalLink` que navega a `ROUTES.project(id)`. Barra con borde punteado si `derived`; relleno fuerte de `done/total` (D10); sin barra → texto «Sin fechas» (D9).
- Puntos: botón con `aria-label` («<título>, hecha el <fecha>» / «vence el <fecha>» / «vencida el <fecha>», + «, fecha aproximada» si `estimated`); `title` = `dotTooltip`; hecha = verde lleno, estimada = hueco con borde verde punteado (D8), pendiente = borde de acento, vencida = borde rojo (D11). Número encima si `tasks.length > 1`. Clic en un punto de 1 tarea abre el drawer; de varias, despliega el proyecto.
- Fila de tarea: título + punto; sin día → «Sin fecha» (D11, D16). Clic abre el drawer.
- Pasado sombreado (de `start` a hoy) y línea de hoy con `aria-hidden` (D22).
- Contenedor de la grilla con `overflow-x-auto`; columna de nombres `sticky left-0`, ancho menor debajo de `sm`, nombre truncado con `title` (D21). El body nunca hace scroll horizontal.
- Estado de despliegue en `useState<Set<string>>` (no en la URL, D15).
- Vacío (D24): `EmptyState` con «No hay proyectos con fechas ni tareas en este período.» y acción «Limpiar filtros» si hay filtros, si no «Ir a hoy».

- [ ] **Paso 1:** test de `uiContext` que falla → correr → FALLA.
- [ ] **Paso 2:** implementar ruta, nav, `uiContext`, `GanttPage`, `GanttGrid`.
- [ ] **Paso 3:** `npx tsc --noEmit` limpio y `npx vitest run --exclude ".worktrees/**" src/ai/chat` → PASA.
- [ ] **Paso 4:** `npm run dev`, abrir `/app/gantt` con la demo cargada y comprobar HU-01, HU-04, HU-05 y HU-06 a mano en desktop y a 375 px de ancho (sin scroll horizontal del body).
- [ ] **Paso 5:** commit `feat(077): gantt page with project filters`.

### Tarea 7: Smoke, suite y grafo

**Archivos:**
- Crear: `specs/077-gantt-proyectos/smoke.md` (HU-01…09 como checklist manual, mismo formato que `specs/075-tablero-global-y-orden/smoke.md`)
- Modificar: `specs/077-gantt-proyectos/spec.md` (Estado → **IMPLEMENTADO**)

- [ ] **Paso 1:** recorrer el smoke en la app (incluye HU-02 cerrar/reabrir en el kanban, HU-03 con un workspace v26 migrado, HU-07 archivado, HU-08 con un flujo que cierra una tarea).
- [ ] **Paso 2:** `npx vitest run --exclude ".worktrees/**"` → toda la suite verde. `npx tsc --noEmit` y `npm run lint` limpios.
- [ ] **Paso 3:** `graphify update .`.
- [ ] **Paso 4:** commit `docs(077): smoke checklist and mark spec implemented`.
