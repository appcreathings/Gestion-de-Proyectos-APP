# Design 072 — Vista de proyectos para planear

> Autoridad: `spec.md` (D1–D29). Snippets de esta página. Sin bump de schema (`SCHEMA_VERSION` 23).

## 0. Mapa de archivos

| Archivo | Qué |
|---------|-----|
| `src/features/projects/filterProjects.ts` | Query, parse, writers, filtro, orden, resumen, fecha relativa, vencidas, `projectsOfProduct` |
| `src/features/projects/filterProjects.test.ts` | Casos §8. Ajustar el helper `q()` y el 5º argumento |
| `src/features/projects/ProjectsPage.tsx` | Controles, Plan, tarjeta, grupos. Quitar `viewMode` y el `useEffect` de `quarter` |
| `src/features/projects/components/ProjectPlanRow.tsx` | **Nuevo.** Fila D14 |
| `src/features/products/ProductsPage.tsx` | Lista de nombres bajo el conteo (D28) |
| `src/features/my-tasks/filterMyTasks.ts` | Canonizar y decidir si restaurar la query (D29). Sin cambiar el pipeline 061. |
| `src/features/my-tasks/filterMyTasks.test.ts` | Casos §10 |
| `src/features/my-tasks/MyTasksPage.tsx` | Guardar en cada `commit`. Restaurar una vez si la URL llega vacía. |

No se toca: `projectTaskProgress`, `src/domain/schemas/common.ts`, `src/components/EntityCard.tsx`, `src/routes/paths.ts`, `src/features/dashboard/dashboardHrefs.ts`, `src/features/dashboard/DashboardPage.tsx` (panel Por producto), `package.json`, `PortfolioCalendarView`, `QuartersPage` (el copy «N proyectos →» ya es correcto).

Reusar: `HealthDot` (`@/components/HealthBadge`), `Progress`, `ExpandableList`, `Checkbox`, `Select`, `Badge`, `effectiveHealth`, `daysUntil`, `isStalled`, `projectChecklistProgress`, `projectLiveTaskProgress`, `aggregateChecklistProgress`, `aggregateTaskProgress`, `healthSentence`, `projectStatusLabel`, `priorityLabel`, `healthLabel`.

## 1. Tipos y parse

```ts
export type ProjectSort = "attention" | "due" | "name" | "progress" | "updated";
export type ProjectView = "plan" | "list" | "quarter" | "product";
export type ProjectDue = "overdue" | "soon" | "none";

export type ProjectsQuery = {
  productId: string | null;
  status: ProjectStatus | null;
  health: Health | null;
  stalled: boolean;
  quarterId: string | null;
  q: string;
  priority: Priority | null;
  ownerId: string | null;
  due: ProjectDue | null;
  closed: boolean;
  sort: ProjectSort;
  view: ProjectView;
};

export type KnownProjectRefs = {
  productIds: ReadonlySet<string>;
  quarterIds: ReadonlySet<string>;
  ownerIds: ReadonlySet<string>;
};
```

`parseProjectsQuery`:

- `q`: `params.get("q")?.trim() ?? ""`.
- `priority` / `due`: si no está en el conjunto, `null`.
- `owner`: string o `null`. El id desconocido se descarta en el filtro, no en el parse (igual que `product`).
- `closed`: `params.get("closed") === "1"`.
- `sort`: si no está en `due|name|progress|updated`, `"attention"`.
- `view`: si no está en `list|quarter|product`, `"plan"`. `view=plan` explícito también es plan.
- El resto, igual que hoy (`stalled` solo `"1"`, status/health inválidos → null).

Defaults del helper de test `q()`: `q: ""`, `priority: null`, `ownerId: null`, `due: null`, `closed: false`, `sort: "attention"`, `view: "plan"`.

## 2. Writers

`applyProjectsFilter` suma claves: `"priority" | "owner" | "due" | "q" | "closed" | "quarter" | "sort" | "view"`, más las actuales.

Reglas nuevas:

- `status` = `done` o `archived` → setea `status` **y** `closed=1`. Otro status setea solo `status`. `null` borra `status` y no toca `closed`.
- `closed` = `"1"` → setea `closed`. Otro valor (incluido `null`) borra `closed` y, si `status` es `done` o `archived`, borra `status`.
- `q`: trim; vacío borra el param. Si no, setea el trim.
- `sort` = `"attention"` o `null` → borra `sort`. Otro valor válido lo setea.
- `view` = `"plan"` o `null` → borra `view`. `list|quarter|product` lo setean.
- `quarter` / `owner` / `priority` / `due`: `null` borra; si no, setea.

```ts
const CLEARABLE = [
  "product", "status", "health", "stalled", "priority",
  "owner", "q", "due", "closed", "quarter", "sort",
] as const;

export function clearProjectFilters(params: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(params);
  for (const key of CLEARABLE) next.delete(key);
  return next;
}

export function hasProjectFilters(params: URLSearchParams): boolean {
  return CLEARABLE.some((key) => params.has(key));
}
```

`view` no entra en ninguna de las dos. Cada writer devuelve un `URLSearchParams` nuevo (como hoy).

## 3. Filtro

Firma nueva. Actualizar cada llamada del test y la de `ProjectsPage`.

```ts
export function filterProjectsByQuery(
  projects: Project[],
  query: ProjectsQuery,
  settings: Settings | null,
  now: Date,
  known: KnownProjectRefs,
): Project[]
```

Puerta de cerrados, antes del resto:

```ts
function passesClosed(p: Project, query: ProjectsQuery): boolean {
  const isClosed = p.status === "done" || p.status === "archived";
  if (!isClosed) return true;
  if (query.status === "done" || query.status === "archived") return true;
  return query.closed;
}
```

Después, AND:

1. Producto, si `productId` está en `known.productIds`.
2. Estado, si `query.status` y `p.status` difiere.
3. Salud, solo con `settings`: done/archived afuera (063 D14); si no, `effectiveHealth !== query.health` afuera.
4. Estancados, solo con `settings`: `!isStalled(p, settings.stalledAfterDays, now)` afuera.
5. Trimestre, si `quarterId` está en `known.quarterIds` y `p.quarterId` difiere.
6. Prioridad, si `query.priority` y difiere.
7. Responsable, si `ownerId` está en `known.ownerIds` y `p.ownerId` difiere.
8. Vencimiento, si `query.due` y `matchesDue` falla.
9. `q`, si `fold(p.name)` no incluye `fold(query.q)`.

```ts
const DUE_SOON_DAYS = 14;

function matchesDue(p: Project, due: ProjectDue, now: Date): boolean {
  if (due === "none") return !p.dueDate;
  const d = daysUntil(p.dueDate, now);
  if (d === null) return false;
  if (due === "overdue") return d < 0;
  return d >= 0 && d <= DUE_SOON_DAYS;
}

export function foldName(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
```

Un id que no está en `known.*` no filtra (el set vacío del arranque tampoco). El filtro **no ordena**.

## 4. Orden, etiquetas, resumen, producto

```ts
const HEALTH_RANK: Record<Health, number> = { red: 0, amber: 1, green: 2 };

function healthOf(p: Project, settings: Settings | null, now: Date): Health {
  return settings ? effectiveHealth(p, settings, now) : p.health;
}

function byName(a: Project, b: Project): number {
  return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
}

/** Sin fecha ordena al final en `attention` y `due`. */
function dueAsc(a: Project, b: Project): number {
  const ad = a.dueDate ?? "\uffff";
  const bd = b.dueDate ?? "\uffff";
  return ad.localeCompare(bd);
}

export function compareProjects(
  a: Project,
  b: Project,
  sort: ProjectSort,
  settings: Settings | null,
  now: Date,
): number {
  if (sort === "name") return byName(a, b);
  if (sort === "updated") return b.updatedAt.localeCompare(a.updatedAt) || byName(a, b);
  if (sort === "due") return dueAsc(a, b) || byName(a, b);
  if (sort === "progress") {
    const checklist = projectChecklistProgress(b).pct - projectChecklistProgress(a).pct;
    if (checklist) return checklist;
    const tasks = projectLiveTaskProgress(b).pct - projectLiveTaskProgress(a).pct;
    return tasks || byName(a, b);
  }
  const health = HEALTH_RANK[healthOf(a, settings, now)] - HEALTH_RANK[healthOf(b, settings, now)];
  return health || dueAsc(a, b) || byName(a, b);
}
```

```ts
export function projectDueLabel(dueDate: string | null, now: Date): string {
  const d = daysUntil(dueDate, now);
  if (d === null) return "Sin fecha";
  if (d === 0) return "vence hoy";
  if (d === 1) return "vence en 1 día";
  if (d > 1) return `vence en ${d} días`;
  if (d === -1) return "venció hace 1 día";
  return `venció hace ${Math.abs(d)} días`;
}

export function overdueLiveTaskCount(p: Project, now: Date): number {
  return p.tasks.filter((t) => {
    if (t.archived || t.status === "done") return false;
    const d = daysUntil(t.dueDate, now);
    return d !== null && d < 0;
  }).length;
}

export type ProjectsSummary = {
  count: number;
  byHealth: Record<Health, number>;
  overdueProjects: number;
};

export function summarizeProjects(
  projects: readonly Project[],
  settings: Settings | null,
  now: Date,
): ProjectsSummary

export function projectsOfProduct(projects: readonly Project[], productId: string): Project[]
```

`summarizeProjects` cuenta `healthOf` y proyectos con `daysUntil(dueDate, now) < 0`. No reimplementa `healthSentence`: la página arma tres botones y un test comprueba que unidos con ` · ` dan `healthSentence(byHealth)`.

`projectsOfProduct` filtra `productId` (incluye done y archived) y ordena con `byName`. No usa `filterProjectsByQuery`.

La página ordena **después** de filtrar:

```ts
const ordered = [...filtered].sort((a, b) =>
  compareProjects(a, b, query.sort, settings, now),
);
```

`GroupedProjects` recibe `ordered`. Al armar cada bucket, empuja en ese orden. No reordena adentro. El orden de las secciones sigue siendo el array de trimestres/productos.

## 5. ProjectsPage

Borrar el `useState` de `viewMode` y el `useEffect` que hace `setViewMode("quarter")`. La vista es `query.view`.

`known` sale de `products`, `quarters` y `people` del store (`useDataStore((s) => s.people)`).

`now` = `new Date()` una vez por render está bien; los tests inyectan la fecha en las funciones puras.

### Controles

Fila `flex flex-wrap gap-2`. Cada control: `w-full sm:w-auto` (los `Select` actuales usan `w-full sm:w-48`; la búsqueda `w-full sm:w-64`).

| Control | Nombre accesible | Escribe |
|---------|------------------|---------|
| `<input type="search">` | `aria-label="Buscar por nombre"`, placeholder igual | `q`, debounce 200 ms |
| Producto | `aria-label="Producto"` | igual que hoy |
| Estado | `aria-label="Estado"` | vía writer de `status` (D6) |
| Prioridad | `aria-label="Prioridad"` | `priority`; opción vacía «Todas las prioridades»; las cuatro, crítica incluida |
| Responsable | `aria-label="Responsable"` | `owner`; «Todos los responsables»; personas por nombre |
| Vencimiento | `aria-label="Vencimiento"` | vacío «Cualquier fecha», `overdue` «Vencidos», `soon` «En 14 días», `none` «Sin fecha» |
| Salud | `aria-label="Salud"` | vacío «Cualquier salud», valores `healthLabel` |
| Casilla | texto visible «Solo estancados» + `aria-label` igual | `stalled` `1` / null |
| Casilla | texto visible «Mostrar cerrados» + `aria-label` igual | `closed` `1` / null |
| Limpiar | `Button type="button"` «Limpiar filtros» | `clearProjectFilters`, solo si `hasProjectFilters` |

El debounce escribe así, para no clobber:

```ts
setSearchParams((prev) => applyProjectsFilter(prev, "q", draft.trim() || null), {
  replace: true,
});
```

Al cambiar `query.q` desde afuera (limpiar, atrás), el borrador se sincroniza.

### Resumen (D19)

Solo si `ordered.length > 0`. Entre los controles y las tabs.

- Texto: `{count} proyecto` / `{count} proyectos`.
- Tres `button type="button"`: `` `${n} en rojo` ``, `` `${n} ámbar` ``, `` `${n} verde` `` o `` `${n} verdes` `` (misma regla que `healthSentence`). `aria-pressed` si ese `health` está activo. Click: si ya está, `health` null; si no, ese valor.
- Si `overdueProjects > 0`, botón `{n} vencido` / `{n} vencidos` que escribe `due=overdue`.

### Tabs y orden (D13, D21)

Tabs en este orden. Plan llama `applyProjectsFilter(..., "view", null)`. Las otras escriben `list` / `quarter` / `product`. La activa usa el mismo estilo que las tabs de hoy (`bg-secondary` vs `ghost`).

`Select` `aria-label="Orden"` al lado: Atención (borra `sort`), Fecha, Nombre, Avance, Actualización.

### Contenido

- `plan`: lista `space-y-2` de `ProjectPlanRow`.
- `list`: la grilla actual, tarjetas con D17.
- `quarter` / `product`: `GroupedProjects` con `ordered`, `highlightId={query.quarterId}` solo en trimestre.

Empty de `projects.length === 0`: el bloque actual, intacto. Empty de filtro: la frase de D25 y el botón Limpiar. Sin resumen en ese caso.

### ProjectPlanRow

`Link` a `ROUTES.project(id)`. Clases: `flex flex-col gap-2 rounded-lg border p-3 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:gap-3`.

1. Identidad: `HealthDot` `aria-hidden`, nombre truncado, `Badge` de estado, `Badge` de prioridad.
2. Meta `text-xs text-muted-foreground`, wrap: responsable o «Sin responsable»; `projectDueLabel` (en Plan siempre, incluye «Sin fecha»); producto y/o trimestre unidos con ` · ` solo si existen; «Estancado» solo con `settings` e `isStalled`; «N vencidas» solo si `overdueLiveTaskCount > 0`.
3. Barras en `sm:w-40`. Cada una envuelta en un `span` con `title` «Checklists a/b» o «Tareas a/b». Label visible de 10px + `Progress` `h-1.5`. Omitir la de tareas vivas si `total === 0`. Igual la de checklists. `indicatorClassName="bg-success"` en la de tareas, como el dashboard.

Sin `<a>` adentro del `Link`.

### Tarjeta Lista (D17)

En el `meta` del `EntityCard`, antes del badge de estado: `HealthDot` `aria-hidden`. Debajo de la barra de checklists, si `projectLiveTaskProgress.total > 0`, otra fila «Tareas» con su `Progress`. Si `dueDate`, una línea `text-xs text-muted-foreground` con `projectDueLabel`. El conteo «N tareas» usa `.total` de tareas vivas. No sumar responsable, estancado ni vencidas.

## 6. ProductsPage (D28)

```ts
const list = projectsOfProduct(projects, p.id);
const count = list.length;
```

El link «N proyectos →» se queda (`ROUTES.projectsByProduct`). Si `count > 0`, debajo:

```tsx
<ExpandableList
  items={list}
  className="mt-2"
  listClassName="space-y-1"
  getKey={(pr) => pr.id}
  renderItem={(pr) => (
    <Link
      to={ROUTES.project(pr.id)}
      className="flex items-center justify-between gap-2 text-sm hover:underline"
    >
      <span className="truncate">{pr.name}</span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {projectStatusLabel[pr.status]}
      </span>
    </Link>
  )}
/>
```

`renderItem` no agrega otro `<li>` (`ExpandableList` ya lo pone). `count === 0` sigue en «Sin proyectos aún.». No aplicar D6: un terminado se ve en la lista y entra en el número.

## 7. Cabecera de grupo (D18)

Reemplazar el único `%` de checklists por:

```ts
const checks = aggregateChecklistProgress(items);
const tasks = aggregateTaskProgress(items);
```

Copy: `N proyectos`, y si `checks.total > 0` añadir ` · checklists ${checks.pct}%`, y si `tasks.total > 0` añadir ` · tareas ${tasks.pct}%`.

## 8. Tests

Todo en `filterProjects.test.ts`. `NOW` sigue siendo el `new Date(2026, 7, 20)` del archivo (20 de agosto de 2026). Las fechas de los casos nuevos se calculan contra esa constante.

Ajustar las llamadas viejas a `filterProjectsByQuery` para pasar `known` con los sets que cada caso ya necesitaba (`quarterIds` y `ownerIds` vacíos salvo que el caso los use). Los casos 063 que ya pasan tienen que seguir verdes: status, health sin settings, stalled, producto desconocido, health excluye done/archived.

Casos nuevos:

| Caso | Esperado |
|------|----------|
| Parse defaults | `q ""`, sort attention, view plan, closed false, resto null |
| `priority=nope`, `due=week`, `view=kanban`, `sort=magic`, `closed=yes` | null / attention / plan / closed false |
| `q` con espacios | trim |
| Writer status done | `status=done` y `closed=1` |
| Writer apaga closed con status done | borra los dos |
| Writer apaga closed con status active | borra `closed`, deja `active` |
| Writer view plan / sort attention | borra el param |
| `clearProjectFilters` | borra filtros y sort, deja `view` |
| `hasProjectFilters` | false sin params; true con `quarter` |
| Sin closed | esconde done y archived |
| `closed=1` | los muestra |
| `status=done` sin closed | solo terminados |
| `closed=1` + `health=red` | un done en rojo no entra (D14) |
| `quarter` conocido | solo ese `quarterId` |
| `quarter` desconocido | no filtra |
| `q=arbol` contra «Árbol» | matchea; no mira tags |
| `owner` desconocido | no filtra |
| `due=soon` con `now` y una fecha a 14 días, otra a 15, otra vencida, otra null | solo la de 14 |
| `due=none` | solo sin fecha |
| `due=overdue` | solo `daysUntil < 0` |
| sort attention | rojo antes que ámbar, ámbar antes que verde; a igual salud, fecha ascendente; sin fecha al final; dos nombres iguales → comparador `0` |
| sort progress | mayor pct de checklists primero; empate por tareas vivas |
| `projectDueLabel` | hoy, 1, N, -1, -N, null |
| `overdueLiveTaskCount` | ignora archivadas, hechas y sin fecha |
| `summarizeProjects` | byHealth + overdueProjects del conjunto que recibe (ya filtrado) |
| `healthSentence(summary.byHealth)` | estable con los tres fragmentos |
| `projectsOfProduct` | incluye done/archived, excluye otro producto, ordena por nombre, length = conteo |

## 9. Fases

| Fase | Qué | Depende de |
|------|-----|------------|
| **A** | Parse, writers, filtro, orden. Tests de esas filas | — |
| **B** | `projectDueLabel`, `overdueLiveTaskCount`, `summarizeProjects`, `projectsOfProduct`, clear/has. Tests | A (mismo archivo: no en paralelo) |
| **C** | `ProjectsPage` + `ProjectPlanRow` + cabeceras | B |
| **D** | `ProductsPage` | B. Puede ir en paralelo con C |
| **E** | Memoria de Mis tareas (D29) | — (no toca `filterProjects.ts`; puede ir en paralelo con C y D) |
| **F** | Smoke, `graphify update .`, spec a IMPLEMENTADO | C, D y E |

Verificación de cada fase de proyectos: `npx tsc --noEmit` y `npx vitest run --exclude ".worktrees/**" src/features/projects/filterProjects.test.ts`. En la fase de Mis tareas, el archivo es `src/features/my-tasks/filterMyTasks.test.ts`. En C y D, el vitest del archivo de proyectos alcanza (no hay RTL). Al cerrar, la suite entera.

## 10. Memoria de Mis tareas (D29)

Funciones puras en `filterMyTasks.ts`. El storage entra por argumento para testear sin `jsdom`.

```ts
export const MY_TASKS_MEMORY_KEY = "hito.myTasks.lastQuery";

const MY_TASKS_KEYS = [
  "person", "status", "priority", "date", "project", "workType", "done", "view",
] as const;

export function myTasksQueryIsEmpty(params: URLSearchParams): boolean {
  return MY_TASKS_KEYS.every((key) => !params.has(key));
}

/** Solo las claves conocidas, en el orden de arriba. */
export function canonicalMyTasksSearch(params: URLSearchParams): string

/**
 * null = no tocar la URL.
 * Si `current` ya tiene alguna clave, null (el link gana y no se lee `saved`).
 * Si `saved` canoniza a "", null.
 */
export function restoreMyTasksSearch(
  current: URLSearchParams,
  saved: string | null,
): URLSearchParams | null

export function readMyTasksMemory(storage: Pick<Storage, "getItem">): string | null
export function writeMyTasksMemory(storage: Pick<Storage, "setItem">, search: string): void
```

`read` y `write` tragan la excepción (modo privado). `write("")` guarda string vacío: la próxima entrada pelada no restaura nada.

En `MyTasksPage`, `commit` sigue haciendo `setSearchParams(next, { replace: true })` y además `writeMyTasksMemory(localStorage, canonicalMyTasksSearch(next))`. El efecto que hoy borra un `person` desconocido, después de escribir la URL sin esa persona, también guarda ese canónico, para no revivir un id borrado.

Restaurar, una vez por montaje:

```tsx
const didRestore = useRef(false);
useEffect(() => {
  if (didRestore.current) return;
  didRestore.current = true;
  const next = restoreMyTasksSearch(searchParams, readMyTasksMemory(localStorage));
  if (next) setSearchParams(next, { replace: true });
}, [searchParams, setSearchParams]);
```

El ref corta el ciclo: restaurar → URL con params → el efecto no vuelve a leer la memoria. Una URL que ya trae `?person=` no llama a `write` en el montaje, así el dashboard no pisa lo guardado.

No se agregan controles. `clearMyTaskFilters` no cambia su contrato (061 D11); el `commit` que ya lo usa persiste lo que queda.
