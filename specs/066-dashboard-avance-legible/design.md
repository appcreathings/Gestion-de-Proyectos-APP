# Design 066 — Dashboard: avance legible y listas con «ver más»

Snippets y puntos de enganche. La autoridad de producto es `spec.md` (D1–D26, HU-01…08).
Sin bump de `SCHEMA_VERSION` (sigue **23**). Sin dependencias npm.

## 0. Mapa de archivos

| Acción | Archivo | Rol |
|--------|---------|-----|
| Nuevo | `src/domain/compute.test.ts` | `projectLiveTaskProgress` / `aggregateTaskProgress` |
| Nuevo | `src/features/dashboard/portfolio.test.ts` | Dual, ranking, workload, stalled, frase |
| Nuevo | `src/components/ExpandableList.tsx` | Primitiva D9 |
| Nuevo | `src/components/ExpandableList.test.ts` | Helpers puros |
| Nuevo | `src/components/ProgressRow.tsx` | Extraído de Overview |
| Edit | `src/domain/compute.ts` | `projectLiveTaskProgress` + `aggregateTaskProgress` |
| Edit | `src/features/dashboard/portfolio.ts` | Tipos + compute + comparators + `healthSentence` |
| Edit | `src/features/dashboard/dashboardHrefs.ts` | `dueSoonAnchor` |
| Edit | `src/features/dashboard/dashboardHrefs.test.ts` | Alias hash |
| Edit | `src/features/dashboard/DashboardPage.tsx` | Layout A, tiles, hero, ranking, un-nest, cards |
| Edit | `src/features/projects/components/OverviewTab.tsx` | Importa `ProgressRow`; borra helper local |
| Edit | `src/features/reports/statusReport.ts` | Totales duales; `avgProgress` DTO = pct ponderado |
| Edit | `src/features/reports/statusReportMarkdown.ts` | Copy cifras; omitir `total === 0` |
| Edit | `src/features/reports/statusReport.test.ts` | No «Avance medio» ni `0/0` |
| Edit | `src/ai/tools/read/workspace.ts` | Output + alias `byProduct.avgProgress` |
| Edit | `specs/063-dashboard-drill-down/smoke.md` | Nota en paso 6 |
| No tocar | `progress.tsx`, `StatTile`, `HealthBadge`, `filterProjects.ts`, `paths.ts`, `common.ts` (`SCHEMA_VERSION`), `projectTaskProgress`, `package.json` | |

```
useDataStore + settings
        │
        ▼
computePortfolio(..., now)     ← now inyectable (informes). Dashboard: new Date() en el useMemo (no cambiar)
        │
        ├─ aggregateChecklistProgress(open)
        ├─ aggregateTaskProgress(open)          ← live, !archived
        ├─ projectRows + compareProjectRankingRows
        ├─ workload: !archived && status !== done
        ├─ stalled.sort(updatedAt asc)
        └─ ProductRollup dual ProgressStat
                │
                ├─ DashboardPage (Layout A)
                ├─ buildPortfolioReport (DTO avgProgress = checklist.pct)
                └─ get_workspace_overview
```

Fases (ver `tasks.md`): **A dominio → B primitiva → C Layout A → D Due + ver más → E secundarias → F cierre.**
A y B en paralelo. C espera a ambas. Main espera a F.

---

## 1. Dominio — `src/domain/compute.ts`

`ProgressStat` y `stat()` **no se tocan**. `projectTaskProgress` **no se toca** (Overview + informe de proyecto).

Junto a L40–43 y L65–74:

```ts
/** Task progress excluding archived tasks. Dashboard / portfolio ranking use this. */
export function projectLiveTaskProgress(p: Project): ProgressStat {
  const live = p.tasks.filter((t) => !t.archived);
  const done = live.filter((t) => t.status === "done").length;
  return stat(done, live.length);
}

/** Aggregate live (non-archived) task progress across a set of projects. */
export function aggregateTaskProgress(projects: Project[]): ProgressStat {
  let done = 0;
  let total = 0;
  for (const p of projects) {
    const s = projectLiveTaskProgress(p);
    done += s.done;
    total += s.total;
  }
  return stat(done, total);
}
```

Una `archived: true` + `status: "todo"` **no** entra en `total` ni en remaining.

Tests: fábricas `newProject` / `newArea` / `newChecklist` / `newItem` / `newTask` de `src/domain/factories.ts` (`newChecklist` L105, `newItem` L118). No armar checklists a mano.

---

## 2. `portfolio.ts`

### 2.1 Tipos

**Se elimina** `avgProgress` de `PortfolioStats` y `ProductRollup`.

```ts
import type { ProgressStat } from "@/domain/compute";
import type { Health } from "@/domain/schemas";

export interface ProductRollup {
  id: string | null;
  name: string;
  total: number;
  byHealth: Record<Health, number>;
  checklistProgress: ProgressStat;
  taskProgress: ProgressStat;
}

export interface ProjectRankingRow {
  id: string;
  name: string;
  health: Health;
  checklist: ProgressStat;
  tasks: ProgressStat;
  remainingWork: number;
}

export interface PortfolioStats {
  total: number;
  active: number; // sigue = open.length — NO se toca (063 D13)
  checklistProgress: ProgressStat;
  taskProgress: ProgressStat;
  projectRows: ProjectRankingRow[];
  overdue: DueRow[];
  dueSoon: DueRow[];
  stalled: Project[];
  byStatus: Record<ProjectStatus, number>;
  byHealth: Record<Health, number>;
  byProduct: ProductRollup[];
  workload: WorkloadEntry[];
}
```

### 2.2 Comparators (exportados, testeables)

```ts
const HEALTH_RANK: Record<Health, number> = { red: 0, amber: 1, green: 2 };

export function remainingWorkOf(cl: ProgressStat, tk: ProgressStat): number {
  return cl.total - cl.done + (tk.total - tk.done);
}

export function compareProjectRankingRows(
  a: ProjectRankingRow,
  b: ProjectRankingRow,
): number {
  const healthDelta = HEALTH_RANK[a.health] - HEALTH_RANK[b.health];
  if (healthDelta !== 0) return healthDelta;
  if (b.remainingWork !== a.remainingWork) return b.remainingWork - a.remainingWork;
  return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
}

export function healthSentence(byHealth: Record<Health, number>): string {
  const verdes = byHealth.green === 1 ? "verde" : "verdes";
  return `${byHealth.red} en rojo · ${byHealth.amber} ámbar · ${byHealth.green} ${verdes}`;
}
```

Triple empate → `0` (sort estable). Ejemplo normativo: `healthSentence({ red: 3, amber: 2, green: 8 }) === "3 en rojo · 2 ámbar · 8 verdes"`.

### 2.3 Cuerpo de `computePortfolio`

Imports nuevos: `projectLiveTaskProgress`, `aggregateChecklistProgress`, `aggregateTaskProgress`. **No** importar `projectTaskProgress`. Hoy: `daysUntil, isStalled, projectChecklistProgress` (L1).

Reemplazo de L74–79 y return L107–118:

```ts
const checklistProgress = aggregateChecklistProgress(open);
const taskProgress = aggregateTaskProgress(open);

const projectRows: ProjectRankingRow[] = open
  .map((p) => {
    const checklist = projectChecklistProgress(p);
    const tasks = projectLiveTaskProgress(p);
    return {
      id: p.id,
      name: p.name,
      health: effectiveHealth(p, settings, now),
      checklist,
      tasks,
      remainingWork: remainingWorkOf(checklist, tasks),
    };
  })
  .sort(compareProjectRankingRows);

return {
  total: projects.length,
  active: open.length,
  checklistProgress,
  taskProgress,
  projectRows,
  overdue: rows.filter((r) => r.d < 0).sort((a, b) => a.d - b.d),
  dueSoon: rows.filter((r) => r.d >= 0 && r.d <= settings.dueSoonDays).sort((a, b) => a.d - b.d),
  stalled: projects
    .filter((p) => isStalled(p, settings.stalledAfterDays, now))
    .sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt)),
  byStatus,
  byHealth,
  byProduct: rollupByProduct(open, products, settings, now),
  workload,
};
```

Workload (reemplazo L84–91):

```ts
for (const project of open) {
  for (const task of project.tasks) {
    if (!task.assigneeId || task.archived || task.status === "done") continue;
    const entry = workloadMap.get(task.assigneeId) ?? { taskCount: 0, totalEstimate: 0 };
    entry.taskCount++;
    entry.totalEstimate += task.estimate ?? 0;
    workloadMap.set(task.assigneeId, entry);
  }
}
```

`rollupByProduct` (L139–152): dejar de acumular `progressSum` / `avgProgress`. Por grupo:

```ts
checklistProgress: aggregateChecklistProgress(list),
taskProgress: aggregateTaskProgress(list),
```

Sort por riesgo **sin cambios** (L156–161).

### 2.4 Typecheck puente (fase A)

Hasta que exista el hero, `DashboardPage` debe compilar:

- tile: `stats.checklistProgress.pct` (temporal; fase C lo saca)
- producto: quitar `· {r.avgProgress}% avance` o pintar `r.checklistProgress.pct` — fase E pinta la mini-barra. En A: `{r.total} proyecto(s)` sin el % (la copy `· N% avance` muere acá para que typecheck pase).

Informe + tool: §8, **mismo commit de dominio**.

---

## 3. `dashboardHrefs`

```ts
export const dashboardHrefs = {
  activeProjects: () => `${ROUTES.projects}?status=active`,
  stalledProjects: () => `${ROUTES.projects}?stalled=1`,
  overdueAnchor: () => `${ROUTES.dashboard}#vencimientos`,
  dueSoonAnchor: () => `${ROUTES.dashboard}#vencimientos`,
  byHealth: (h: Health) => `${ROUTES.projects}?health=${h}`,
  byStatus: (s: ProjectStatus) => `${ROUTES.projects}?status=${s}`,
  byProduct: (productId: string) => ROUTES.projectsByProduct(productId),
  personTasks: (personId: string) => `${ROUTES.myTasks}?person=${encodeURIComponent(personId)}`,
} as const;
```

Test: `dueSoonAnchor() === overdueAnchor() === "/app#vencimientos"`. El resto de 063 se queda.

---

## 4. `ExpandableList`

Nuevo `src/components/ExpandableList.tsx`. Contrato normativo (sin RTL; esto sustituye tests de componente):

```tsx
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";

export const EXPANDABLE_LIST_INITIAL = 5;

export function expandableRemaining(
  n: number,
  initial: number = EXPANDABLE_LIST_INITIAL,
): number {
  return Math.max(0, n - initial);
}

export function expandableMoreLabel(remaining: number): string {
  return `Ver ${remaining} más`;
}

export const EXPANDABLE_LESS_LABEL = "Ver menos";

interface ExpandableListProps<T> {
  items: readonly T[];
  initial?: number;
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  moreLabel?: (remaining: number) => string;
  lessLabel?: string;
  className?: string;
  listClassName?: string;
}

export function ExpandableList<T>({
  items,
  initial = EXPANDABLE_LIST_INITIAL,
  getKey,
  renderItem,
  moreLabel = expandableMoreLabel,
  lessLabel = EXPANDABLE_LESS_LABEL,
  className,
  listClassName = "space-y-1.5",
}: ExpandableListProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const remaining = expandableRemaining(items.length, initial);
  const visible = expanded || remaining === 0 ? items : items.slice(0, initial);

  return (
    <div className={className}>
      <ul id={listId} className={listClassName}>
        {visible.map((item, i) => (
          <li key={getKey(item, i)}>{renderItem(item, i)}</li>
        ))}
      </ul>
      {remaining > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 w-full sm:w-auto"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? lessLabel : moreLabel(remaining)}
        </Button>
      )}
    </div>
  );
}
```

Normas:

- `useId()` interno. **No** hay prop `id`.
- `useState(false)` local; no persistir.
- Botón **después** del `<ul>`. `type="button"` **obligatorio**: `button.tsx` L40–48 hace spread y **no** defaulta `type`.
- `items` llega **ya ordenado**.
- `renderItem` **no** envuelve en `<li>` (el componente lo crea). `DueSection` hoy hace `<li><Link/></li>`: achatar a `renderItem` → `<Link/>`.
- No anidar `<a>`.

`listClassName` por superficie (no usar el default a ciegas):

| Superficie | `listClassName` |
|------------|-----------------|
| Ranking | `"space-y-1.5"` |
| `DueSection` | `"space-y-1.5"` |
| `StalledCard` | `"space-y-1.5"` |
| `WorkloadCard` | `"space-y-3"` |
| `ProductCard` | `"space-y-2"` |

Carga: `maxTasks` **una vez** sobre el array completo, por closure en `renderItem`:

```ts
const maxTasks = Math.max(0, ...workload.map((w) => w.taskCount));
```

---

## 5. `ProgressRow`

Nuevo `src/components/ProgressRow.tsx`. Mover el helper de `OverviewTab.tsx` L133–159 **sin cambiar comportamiento** (Overview sigue mostrando 0/0 si total es 0).

```tsx
import { Progress } from "@/components/ui/progress";

export function ProgressRow(props: {
  label: string;
  done: number;
  total: number;
  pct: number;
  indicatorClassName?: string;
  tooltip?: string;
}) {
  const { label, done, total, pct, indicatorClassName, tooltip } = props;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground" title={tooltip}>
          {done}/{total} · {pct}%
        </span>
      </div>
      <Progress value={pct} indicatorClassName={indicatorClassName} />
    </div>
  );
}
```

---

## 6. Dashboard — Layout A (`DashboardPage.tsx`)

### 6.1 Orden DOM (CA-07.2) — fase C instala el shell

```tsx
<ScrollToHash />
<PageHeader ... />

{/* tiles — §6.2 */}

<Panel label="Avance" title="Avance del portafolio">{/* hero §6.3 */}</Panel>

<Panel label="Proyectos" title="Avance por proyecto">{/* ranking §6.4, ExpandableList obligatorio */}</Panel>

<div className="mt-6 grid gap-6 lg:grid-cols-2">
  {/* DueCard col-span-full. En C el inner lg:grid-cols-2 puede quedarse.
      En D se aplana a dos DueSection hermanas. */}
  <div id="vencimientos" className="scroll-mt-6 col-span-full">
    <DueCard overdue={...} dueSoon={...} />
  </div>
  <StalledCard projects={stats.stalled} stalledAfterDays={settings.stalledAfterDays} />
  <WorkloadCard workload={stats.workload} knownPersonIds={personIds} />
</div>

<div className="mt-6 grid gap-6 lg:grid-cols-2">
  <HealthCard byHealth={stats.byHealth} />
  <StatusCard byStatus={stats.byStatus} total={stats.total} />
</div>

<ProductCard rollups={stats.byProduct} />
```

`DueCard` **nunca** vuelve a ser hermano de Carga en una celda de 50 %. Producto **nunca** vuelve al grid `Producto | Estancados`.

**Prohibido** `display: contents` en el ancla (Safari + `ScrollToHash` / `getElementById`).

Empty de página (`projects.length === 0`, L57–98): **sin cambios**.

### 6.2 Tiles (fase C; quita el puente de A)

Grid **igual** que L115: `grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border sm:grid-cols-2 lg:grid-cols-4`.

```tsx
<Link to={dashboardHrefs.activeProjects()} className="block">
  <StatTile value={stats.byStatus.active} label="Proyectos activos" icon={FolderKanban} tone="default" />
</Link>
<Link to={dashboardHrefs.overdueAnchor()} className="block">
  <StatTile value={stats.overdue.length} label="Vencidos" icon={AlertTriangle} tone="destructive" />
</Link>
<Link to={dashboardHrefs.dueSoonAnchor()} className="block">
  <StatTile value={stats.dueSoon.length} label="Por vencer" icon={CalendarClock} tone="warning" />
</Link>
<Link to={dashboardHrefs.stalledProjects()} className="block">
  <StatTile value={stats.stalled.length} label="Estancados" icon={Hourglass} tone="warning" />
</Link>
```

Quitar `Gauge`. `StatTile` no se modifica. Tiles en 0 sí enlazan.

### 6.3 Hero

```tsx
{stats.checklistProgress.total > 0 && (
  <ProgressRow
    label="Avance de checklists"
    done={stats.checklistProgress.done}
    total={stats.checklistProgress.total}
    pct={stats.checklistProgress.pct}
  />
)}
{stats.taskProgress.total > 0 && (
  <ProgressRow
    label="Tareas completadas"
    done={stats.taskProgress.done}
    total={stats.taskProgress.total}
    pct={stats.taskProgress.pct}
    indicatorClassName="bg-success"
  />
)}
{stats.checklistProgress.total === 0 && stats.taskProgress.total === 0 && (
  <p className="text-sm text-muted-foreground">
    {stats.active > 0
      ? "Todavía no hay checklists ni tareas en los proyectos abiertos."
      : "No hay proyectos abiertos."}
  </p>
)}
```

El `Panel` **no** es `Link`. Sin `cursor-pointer`.

### 6.4 Ranking — fila

```tsx
<Link
  to={ROUTES.project(row.id)}
  className={cn(ROW_LINK_CLASS, "flex-col items-stretch sm:flex-row sm:items-center")}
>
  <div className="flex min-w-0 flex-1 items-center gap-3">
    <HealthDot health={row.health} />
    <span className="min-w-0 flex-1 truncate text-sm">{row.name}</span>
  </div>
  <div className="flex w-full shrink-0 flex-col gap-1 sm:w-36">
    {row.checklist.total > 0 && (
      <div className="flex items-center gap-2" title={`Checklists ${row.checklist.done}/${row.checklist.total}`}>
        <Progress value={row.checklist.pct} className="h-1.5" />
        <span className="min-w-[2.25rem] text-right font-mono text-[10px] tabular-nums text-muted-foreground">
          {row.checklist.pct}%
        </span>
      </div>
    )}
    {row.tasks.total > 0 && (
      <div className="flex items-center gap-2" title={`Tareas ${row.tasks.done}/${row.tasks.total}`}>
        <Progress value={row.tasks.pct} className="h-1.5" indicatorClassName="bg-success" />
        <span className="min-w-[2.25rem] text-right font-mono text-[10px] tabular-nums text-muted-foreground">
          {row.tasks.pct}%
        </span>
      </div>
    )}
  </div>
</Link>
```

`getKey={(row) => row.id}`. `ExpandableList` **obligatorio** en esta fase (no shippear un dump nuevo).

---

## 7. Atención — Due, stalled, carga (fase D)

### 7.1 Flatten Due (CA-07.4)

Cuando **al menos una** lista tiene filas:

```tsx
<div id="vencimientos" className="scroll-mt-6 col-span-full grid gap-6 lg:grid-cols-2">
  <DueSection title="Vencidos" icon={AlertTriangle} tone="destructive" rows={overdue}
    format={(r) => `hace ${-r.d} día${r.d === -1 ? "" : "s"}`} />
  <DueSection title="Por vencer" icon={CalendarClock} tone="warning" rows={dueSoon}
    format={(r) => (r.d === 0 ? "vence hoy" : `en ${r.d} día${r.d === 1 ? "" : "s"}`)} />
</div>
```

`DueSection` **siempre se pinta** en este caso. Si `rows.length === 0`: frase muted (`text-sm text-muted-foreground`), **sin** `CheckCircle2`, **sin** `return null`.

Ambas vacías: el `id="vencimientos"` envuelve el Panel único actual (L334–344) con `col-span-full`. Copy del Panel: «No hay fechas vencidas ni próximos vencimientos.»

Filas de fecha: **sin cambio** de href (`tab`/`focus` 063). `getKey` = el `key` de hoy (`kind-itemId|taskId|projectId`). `renderItem` = el `<Link>` (sin `<li>`).

### 7.2 Stalled / Workload

- Stalled: `items={stats.stalled}` ya ordenado. **No** `.sort()` en JSX.
- Workload: `listClassName="space-y-3"`. `maxTasks` del array completo. Copy vacío D25. Nombre sigue siendo el único `Link`.

---

## 8. Cards secundarias (fase E)

### 8.1 Salud

```tsx
<div className="mb-4 flex h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
  {/* segmentos healthColorClass, igual L175–185 */}
</div>
<p className="mb-4 text-sm text-foreground">{healthSentence(byHealth)}</p>
<ul className="space-y-3">{/* filas 063 */}</ul>
```

Barra decorativa. **No** `role="img"` (eso es Estado).

### 8.2 Estado

**Cero** `<Progress>`.

```ts
const STATUS_COMPOSITION_CLASS: Record<ProjectStatus, string> = {
  backlog: "bg-muted-foreground/40",
  active: "bg-primary",
  paused: "bg-warning",
  blocked: "bg-destructive",
  done: "bg-success",
  archived: "bg-muted-foreground/20",
};
```

```tsx
const segments = rows; // statuses with count > 0
<div
  className="mb-4 flex h-2 overflow-hidden rounded-full bg-muted"
  role="img"
  aria-label={segments.map((s) => `${byStatus[s]} ${projectStatusLabel[s]}`).join(", ") + ` de ${total}`}
>
  {segments.map((s) => (
    <div key={s} className={STATUS_COMPOSITION_CLASS[s]}
      style={{ width: `${(byStatus[s] / total) * 100}%` }} />
  ))}
</div>
```

Fila: `projectStatusLabel[s]` + `{count} de {total}`. Links 063 si count > 0.

### 8.3 Producto

```ts
function productBarMetric(r: ProductRollup): ProgressStat | null {
  if (r.checklistProgress.total > 0) return r.checklistProgress;
  if (r.taskProgress.total > 0) return r.taskProgress;
  return null;
}
```

Subtítulo: `{n} proyecto(s)` **sin** `% avance`. `title` en wrapper, no en `Progress`. Checklists = `Progress` default; si caemos a tareas, `indicatorClassName="bg-success"`. `listClassName="space-y-2"`. ExpandableList si `length > 5`. «Sin producto» no enlaza.

---

## 9. Informe 052 + tool IA (fase A, mismo commit)

### 9.1 DTO `PortfolioStatusReport`

Conserva `totals.avgProgress: number` (no reescribir HTML print) y **añade** los dos `ProgressStat`:

```ts
totals: {
  projects: number;
  open: number;
  avgProgress: number; // = checklistProgress.pct ponderado
  checklist: ProgressStat;
  tasks: ProgressStat;
};
byProduct: {
  name: string;
  total: number;
  avgProgress: number; // = checklistProgress.pct del grupo
  healthSummary: string;
}[];
```

Asignación (`statusReport.ts` ~L343–358):

```ts
totals: {
  projects: stats.total,
  open: stats.active,
  avgProgress: stats.checklistProgress.pct,
  checklist: stats.checklistProgress,
  tasks: stats.taskProgress,
},
byProduct: stats.byProduct.map((p) => ({
  name: p.name,
  total: p.total,
  avgProgress: p.checklistProgress.pct,
  healthSummary: `🔴 ${p.byHealth.red} · 🟡 ${p.byHealth.amber} · 🟢 ${p.byHealth.green}`,
})),
```

### 9.2 Markdown

Reemplazar `**Avance medio:** N%` (`statusReportMarkdown.ts` L133):

```ts
lines.push(`- **Proyectos (total):** ${r.totals.projects}`);
lines.push(`- **Abiertos:** ${r.totals.open}`);
if (r.totals.checklist.total > 0) {
  const c = r.totals.checklist;
  lines.push(`- **Avance de checklists:** ${c.done}/${c.total} · ${c.pct}%`);
}
if (r.totals.tasks.total > 0) {
  const t = r.totals.tasks;
  lines.push(`- **Tareas completadas:** ${t.done}/${t.total} · ${t.pct}%`);
}
```

Columna de tabla de producto (L162): sigue `%` pero ahora ponderado. Header puede pasar a «Avance».

### 9.3 Tool `get_workspace_overview`

```ts
return {
  org: ws?.org.name ?? null,
  totalProjects: stats.total,
  openProjects: stats.active,
  avgChecklistProgressPct: stats.checklistProgress.pct,
  checklistProgress: stats.checklistProgress,
  taskProgress: stats.taskProgress,
  byStatus: stats.byStatus,
  byHealth: stats.byHealth,
  overdue: stats.overdue.map(/* igual que hoy */),
  dueSoon: stats.dueSoon.map(/* igual que hoy */),
  stalledProjects: stats.stalled.map((p) => ({ id: p.id, name: p.name })),
  byProduct: stats.byProduct.map((p) => ({
    id: p.id,
    name: p.name,
    total: p.total,
    byHealth: p.byHealth,
    checklistProgress: p.checklistProgress,
    taskProgress: p.taskProgress,
    avgProgress: p.checklistProgress.pct,
  })),
};
```

Descripción del tool (L12–13): «avance medio» → «avance ponderado de checklists y tareas». `computePortfolio` hoy no recibe `people` en el tool (L25–30): **no hace falta** para los campos nuevos; `workload` no se expone. Dejar la firma igual.

---

## 10. Tests (fixtures)

Criterio 063: **puros**. Sin RTL de `DashboardPage`.

`now` y `settings` fijos en portfolio: `{ stalledAfterDays: 14, dueSoonDays: 7, deriveHealth: false }`.

### `compute.test.ts`

1. `aggregateTaskProgress([])` → `{ done: 0, total: 0, pct: 0 }`.
2. Dos proyectos 1/2 y 1/2 (nada archivado) → `{ done: 2, total: 4, pct: 50 }`.
3. Antivanity checklists: A 1/1, B 0/99 → `aggregateChecklistProgress` = `{1, 100, 1}`. Documentar que la media de pct sería 50.
4. `projectLiveTaskProgress`: 1 done + 1 todo + 1 archived-todo → `{1, 2, 50}`. El mismo fixture con `projectTaskProgress` → `{1, 3, 33}`.
5. `aggregateTaskProgress` sobre ese proyecto: archivada fuera.

### `portfolio.test.ts`

1. Antivanity en `checklistProgress`.
2. `expect(stats).not.toHaveProperty("avgProgress")`.
3. `projectRows` omite `done` / `archived`.
4. Sort: rojo remaining 1 **antes** que ámbar remaining 99; dos rojos → gana más remaining; empate remaining → `"Á"` antes que `"B"`; triple empate → comparator `0`.
5. Remaining ignora `archived`+todo. Dos rojos: A 1 live todo; B 5 archived-todo 0 live → A primero.
6. Workload: 1 todo + 1 done mismo assignee → `taskCount === 1`; estimate de la done no suma. archived-todo de otra persona → esa persona no aparece.
7. `stalled` por `updatedAt` asc.
8. `dueSoon` / `overdue` no cambian (regresión 063).
9. `byProduct[].checklistProgress` ponderado del grupo.
10. `healthSentence({ red: 3, amber: 2, green: 8 })`; `green: 1` → `"verde"`.

### `ExpandableList.test.ts`

1. `expandableRemaining(0|5) === 0`, `(6) === 1`, `(12) === 7`.
2. `expandableMoreLabel(1) === "Ver 1 más"`, `(7) === "Ver 7 más"`.
3. `EXPANDABLE_LESS_LABEL === "Ver menos"`.
4. `EXPANDABLE_LIST_INITIAL === 5`.

No montar el componente.

### Informe

Fixture de `statusReport.test.ts` L72–87 (sin ítems):

```ts
expect(md).not.toContain("Avance medio");
expect(md).not.toContain("0/0");
```

Un fixture con checklist sí contiene «Avance de checklists».

---

## 11. Responsive

| Zona | `< sm` | `sm` | `lg+` |
|------|--------|------|-------|
| Tiles | 1 col | 2×2 | 4 |
| Hero / ranking / producto | full | full | full |
| Atención (4 cards) | 1 col | 1 col | 2×2 (`Due` es `col-span-full` + inner 2) |
| Secundaria | 1 col | 1 col | 2 |
| Botón «Ver N más» | `w-full` | auto | auto |

Jerarquía = **orden DOM**, no sombras nuevas.

---

## 12. Fuera de este diseño

- Tendencias HU-15. Recharts. Schema bump.
- Cambiar `projectTaskProgress`. Tests RTL de páginas.
- Hash `#por-vencer`. Persistencia de expand. Feature flags.
- Extraer barra de filtros con Mis tareas.
- `people` en el tool (no se usa para los campos nuevos).
