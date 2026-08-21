# Design 063 — Dashboard: drill-down a listas filtradas

Snippets y puntos de enganche. La autoridad de producto es `spec.md` (D1–D15).
Sin bump de `SCHEMA_VERSION`. Sin dependencias npm.

## 0. Mapa de archivos

| Área | Archivo | Rol |
|------|---------|-----|
| Nuevo | `src/features/projects/filterProjects.ts` | Parse de query, writers URL, `filterProjectsByQuery` |
| Nuevo | `src/features/projects/filterProjects.test.ts` | Casos §9 |
| Nuevo | `src/features/dashboard/dashboardHrefs.ts` | Hrefs puros del mapa de clicks |
| Nuevo | `src/features/dashboard/dashboardHrefs.test.ts` | Casos §9.8 |
| Existente | `src/features/dashboard/DashboardPage.tsx` | Links en tiles/filas; `id="vencimientos"`; `ScrollToHash` |
| Existente | `src/features/projects/ProjectsPage.tsx` | URL = fuente de verdad; chips; empty de lista |
| Existente | `src/features/dashboard/portfolio.ts` | **No** cambiar `stats.active` (abiertos). El tile deja de usarlo (D13) |
| Existente | `src/domain/health.ts` | Reusar `effectiveHealth` |
| Existente | `src/domain/compute.ts` | Reusar `isStalled` |
| Existente | `src/routes/paths.ts` | Opcional: `projectsQuery` / `myTasksByPerson` si evita strings sueltos |
| Existente | `src/components/ScrollToHash.tsx` | Montarlo en el dashboard (hoy solo landing/SEO) |
| Existente | `src/domain/labels.ts` | `projectStatusLabel`, labels de salud si existen |

```
Dashboard click
  dashboardHrefs.*  ──►  /app/projects?...  |  /app#vencimientos  |  /app/my-tasks?person=
         │
         ▼
ProjectsPage
  parseProjectsQuery(searchParams)
  filterProjectsByQuery(projects, query, settings, now, productIds)
  Select status/product  ──replace──►  searchParams
  chips health/stalled   ──delete──►  ese param
```

## 1. Query — `src/features/projects/filterProjects.ts`

Misma forma que `parseMyTasksQuery` (061): valores inválidos → `null` / `false`, no throw.

```ts
import { effectiveHealth } from "@/domain/health";
import { isStalled } from "@/domain/compute";
import type { Health, Project, ProjectStatus, Settings } from "@/domain/schemas";

const STATUSES: readonly ProjectStatus[] = [
  "backlog", "active", "paused", "blocked", "done", "archived",
];
const HEALTHS: readonly Health[] = ["red", "amber", "green"];

export type ProjectsQuery = {
  productId: string | null;
  status: ProjectStatus | null;
  health: Health | null;
  stalled: boolean;
  quarterId: string | null; // no filtra; la página lo usa para vista + highlight
};

export function parseProjectsQuery(params: URLSearchParams): ProjectsQuery {
  const statusRaw = params.get("status");
  const healthRaw = params.get("health");
  const stalledRaw = params.get("stalled");
  return {
    productId: params.get("product"),
    status: isStatus(statusRaw) ? statusRaw : null,
    health: isHealth(healthRaw) ? healthRaw : null,
    stalled: stalledRaw === "1",
    quarterId: params.get("quarter"),
  };
}

export function applyProjectsFilter(
  params: URLSearchParams,
  key: "product" | "status" | "health" | "stalled",
  value: string | null,
): URLSearchParams {
  const next = new URLSearchParams(params);
  if (key === "stalled") {
    if (value === "1") next.set("stalled", "1");
    else next.delete("stalled");
    return next;
  }
  if (!value) next.delete(key);
  else next.set(key, value);
  return next;
}

export function filterProjectsByQuery(
  projects: Project[],
  query: ProjectsQuery,
  settings: Settings,
  now: Date,
  knownProductIds: ReadonlySet<string>,
): Project[] {
  const productOk =
    query.productId !== null && knownProductIds.has(query.productId)
      ? query.productId
      : null;

  return projects.filter((p) => {
    if (productOk && p.productId !== productOk) return false;
    if (query.status && p.status !== query.status) return false;
    if (query.health) {
      if (p.status === "done" || p.status === "archived") return false; // D14
      if (effectiveHealth(p, settings, now) !== query.health) return false;
    }
    if (query.stalled && !isStalled(p, settings.stalledAfterDays, now)) return false;
    return true;
  });
}
```

AND entre params. `quarter` no se aplica aquí.

`knownProductIds`: el id tiene que existir en `products` del store. Un `?product=foo` inventado no recorta (D5 / §4). Hoy `p.productId === "foo"` dejaba la grilla vacía; eso se corrige.

## 2. Hrefs — `src/features/dashboard/dashboardHrefs.ts`

No esparcir strings en el JSX. `ROUTES` sigue siendo el prefijo.

```ts
import { ROUTES } from "@/routes/paths";
import type { Health, ProjectStatus } from "@/domain/schemas";

export const dashboardHrefs = {
  activeProjects: () => `${ROUTES.projects}?status=active`,
  stalledProjects: () => `${ROUTES.projects}?stalled=1`,
  overdueAnchor: () => `${ROUTES.dashboard}#vencimientos`,
  byHealth: (h: Health) => `${ROUTES.projects}?health=${h}`,
  byStatus: (s: ProjectStatus) => `${ROUTES.projects}?status=${s}`,
  byProduct: (productId: string) => ROUTES.projectsByProduct(productId),
  personTasks: (personId: string) => `${ROUTES.myTasks}?person=${encodeURIComponent(personId)}`,
} as const;
```

`person` puede ser un uuid; `encodeURIComponent` es barato y evita romper el query. Product/status/health son enums o ids ya usados en `ROUTES.projectsByProduct` (sin encode hoy): no cambiar ese helper.

## 3. Dashboard — `DashboardPage.tsx`

### 3.1 Tiles

```tsx
<ScrollToHash />

<div className="grid ...">
  <Link to={dashboardHrefs.activeProjects()} className="block">
    <StatTile value={stats.byStatus.active} label="Proyectos activos" ... />
  </Link>
  <StatTile value={`${stats.avgProgress}%`} label="Avance medio" ... />
  <Link to={dashboardHrefs.overdueAnchor()} className="block">
    <StatTile value={stats.overdue.length} label="Vencidos" tone="destructive" ... />
  </Link>
  <Link to={dashboardHrefs.stalledProjects()} className="block">
    <StatTile value={stats.stalled.length} label="Estancados" tone="warning" ... />
  </Link>
</div>
```

D13: el valor del primer tile **cambia** (puede bajar si hay backlog/paused/blocked). No tocar `computePortfolio.active`; otros consumidores (`statusReport`, tool `workspace`) siguen hablando de abiertos.

Avance medio: **no** envolver en `Link`. Sin `cursor-pointer`.

### 3.2 Filas (count > 0)

`HealthCard` / `StatusCard` / `ProductCard`: el `<li>` con count > 0 (producto: `r.id !== null`) pasa a `Link` con las mismas clases de fila que `StalledCard` (`flex ... rounded-md border ... hover:bg-accent`). Count 0: `<li>` estático, sin `href`.

«Sin producto» (`r.id === null`): no enlaza (spec §5).

No anidar `<a>`: `HealthBadge` no es link.

### 3.3 Carga

Solo el **nombre** es `Link` a `dashboardHrefs.personTasks(entry.personId)`. La barra no es clickeable.

Si `people` no contiene `entry.personId` (label «Persona eliminada»): `<span>`, no `Link`. Pasar `people` a `WorkloadCard` o un `Set` de ids.

061 D1: sin `done=1` → Mis tareas oculta hechas. El recuento del dashboard **incluye** hechas en proyectos abiertos; no se cambia `workload` aquí (spec §8).

### 3.4 Vencimientos + hash

`DueCard` envuelve su raíz (vacío o grid de dos `DueSection`) en:

```tsx
<div id="vencimientos" className="scroll-mt-6">
```

Filas de fecha: sin cambio (siguen al proyecto con `tab`/`focus`).

Montar `<ScrollToHash />` al inicio de `DashboardPage` (el componente ya existe; Settings `#uso` usa un `useEffect` local — no copiarlo). `ScrollToTop` ya ignora navegación con hash.

`id="estancados"` en `StalledCard`: opcional, no es CA.

## 4. Proyectos — `ProjectsPage.tsx`

Eliminar `useState` de `productFilter` / `statusFilter` y el `useEffect` que sincroniza `product`. Leer:

```ts
const [searchParams, setSearchParams] = useSearchParams();
const query = useMemo(() => parseProjectsQuery(searchParams), [searchParams]);
const settings = useAppStore((s) => s.workspace?.settings);
const knownProductIds = useMemo(() => new Set(products.map((p) => p.id)), [products]);

const filtered = useMemo(() => {
  if (!settings) return projects;
  return filterProjectsByQuery(projects, query, settings, new Date(), knownProductIds);
}, [projects, query, settings, knownProductIds]);

function commit(next: URLSearchParams) {
  setSearchParams(next, { replace: true });
}
```

Selects:

```tsx
<Select
  value={query.status ?? ""}
  onChange={(e) => commit(applyProjectsFilter(searchParams, "status", e.target.value || null))}
>
...
<Select
  value={query.productId && knownProductIds.has(query.productId) ? query.productId : ""}
  onChange={(e) => commit(applyProjectsFilter(searchParams, "product", e.target.value || null))}
>
```

Si el `product` de la URL no está en `products`, el Select muestra «Todos» **y** el filtro no recorta (parse deja el string, `filterProjectsByQuery` lo ignora). No hace falta borrar el param (061 borra `person` desconocido porque sin persona la página no sirve; aquí el param huérfano es inofensivo).

`quarter` + `viewMode`: **igual que hoy** (`useEffect` que pasa a vista trimestre). No meter `view` en la URL.

### 4.1 Chips (D15)

Junto a los Selects, si `query.health` o `query.stalled`:

```tsx
{query.health && (
  <Badge variant="secondary" className="gap-1">
    {healthLabel[query.health]}
    <button type="button" aria-label="Quitar filtro de salud"
      onClick={() => commit(applyProjectsFilter(searchParams, "health", null))}>
      ×
    </button>
  </Badge>
)}
{query.stalled && (
  <Badge variant="warning" className="gap-1">
    Estancados
    <button type="button" aria-label="Quitar filtro de estancados"
      onClick={() => commit(applyProjectsFilter(searchParams, "stalled", null))}>
      ×
    </button>
  </Badge>
)}
```

Copy del chip de salud: `healthLabel` de `@/domain/labels` (el mismo que `HealthBadge`). No añadir un tercer Select.

### 4.2 Empty de lista plana

Hoy la grilla lista sin matches queda en blanco. Si `viewMode === "list" && filtered.length === 0`:

```tsx
<p className="py-8 text-center text-sm text-muted-foreground">
  Ningún proyecto coincide con los filtros actuales.
</p>
```

Mismo copy que `GroupedProjects`.

## 5. Settings inyectados

`filterProjectsByQuery` necesita `settings.deriveHealth` y `settings.stalledAfterDays`. `ProjectsPage` ya no los lee; hay que tomar `useAppStore((s) => s.workspace?.settings)` como el dashboard. Si `settings` es null (workspace aún no hidratado), no filtrar por health/stalled (mostrar `projects` crudo o `[]` — preferir no montar filtros derivados hasta tener settings; patrón dashboard: `if (!settings) return null` es demasiado agresivo en Proyectos). Fallback: `health`/`stalled` se ignoran si no hay settings; `status`/`product` sí aplican.

## 6. Tests

`filterProjects.test.ts` (fábricas `newProject` + settings mínimo):

1. `status=active` deja solo active.
2. `stalled=1` ≡ `isStalled`; un `done` con `updatedAt` viejo no entra.
3. `deriveHealth=false`, `health=red` usa `project.health`; un `done` red no entra (D14).
4. `deriveHealth=true`, `health=red` usa `deriveHealth()` (estancado o fecha vencida).
5. AND `status=active` + `health=green`.
6. `stalled=yes` → `query.stalled === false`.
7. `product` ausente en `knownProductIds` no recorta; id conocido sí.
8. `health=purple` → `query.health === null`.

`dashboardHrefs.test.ts`:

- `activeProjects()` termina en `?status=active`.
- `stalledProjects()` en `stalled=1`.
- `overdueAnchor()` es `/app#vencimientos`.
- `personTasks("abc")` es `/app/my-tasks?person=abc`.

No tests de componente de las páginas (igual 061).

## 7. Fuera de este diseño

- No cambiar `computePortfolio` (salvo que un test de informe asuma el valor del **tile**; no lo hace).
- No `workType` en dashboard/proyectos.
- No `date=` en `/app/projects`.
- No tendencias HU-15.
- No extraer barra de filtros compartida con Mis tareas.

## 8. Riesgos de implementación

| Riesgo | Mitigación |
|--------|------------|
| Select de estado vs URL en pelea con `useState("")` | Borrar el state; una sola fuente. |
| Hash `#vencimientos` vs `ScrollToTop` | Ya skipea si hay hash; montar `ScrollToHash` en dashboard. |
| `DueCard` a veces es un Panel y a veces un grid de 2 | El `id` va en un wrapper, no en `Panel`. |
| Link alrededor de `StatTile` (div) | `Link className="block"` como hoy; no anidar `<a>`. |
| Número del tile Activos baja (D13) | Copy del tile se queda; es el arreglo honesto, no un bug de filtro. |
| `encodeURIComponent` en person vs `projectsByProduct` sin encode | Ids de persona/producto son uuid del dominio; encode solo en el helper nuevo. |
