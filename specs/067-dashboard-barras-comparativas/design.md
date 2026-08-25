# Design 067 — Barras comparativas en ranking y carga

Autoridad: `spec.md` (D1–D14). Sin bump de schema. Sin deps npm.
066 sigue siendo el contrato de sort, ExpandableList, hrefs y compute.

## 0. Archivos

| Acción | Archivo | Rol |
|--------|---------|-----|
| Nuevo | `src/components/MagnitudeBar.tsx` | Track + fill, `role="img"` |
| Nuevo | `src/components/MagnitudeBar.test.ts` | `magnitudeBarWidth` |
| Edit | `src/features/dashboard/DashboardPage.tsx` | `RankingCard`, `WorkloadCard`; título del panel ranking |
| No tocar | `portfolio.ts`, `compute.ts`, `ProgressRow.tsx`, `progress.tsx`, hero, salud, estado, producto, Due, Stalled, `dashboardHrefs`, `package.json` | |

```
projectRows ── maxRemaining = max(remainingWork) ── RankingCard
workload    ── maxTasks     = max(taskCount)     ── WorkloadCard
                         │
                         ▼
              MagnitudeBar(value, max)
```

## 1. `magnitudeBarWidth` + `MagnitudeBar`

```ts
/** 0..100. max<=0 o value<=0 → 0. Nunca NaN. */
export function magnitudeBarWidth(value: number, max: number): number {
  if (max <= 0 || value <= 0) return 0;
  return Math.min(100, (value / max) * 100);
}
```

```tsx
import { cn } from "@/lib/utils";

export function MagnitudeBar({
  value,
  max,
  label,
  className,
  indicatorClassName,
}: {
  value: number;
  max: number;
  /** Nombre accesible, p.ej. "12 restantes de un máximo de 18". */
  label: string;
  className?: string;
  indicatorClassName?: string;
}) {
  const width = magnitudeBarWidth(value, max);
  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-muted", className)}
      role="img"
      aria-label={label}
    >
      <div
        className={cn("h-full rounded-full bg-primary transition-all", indicatorClassName)}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
```

**No** usar `Progress`. **No** `role="progressbar"`.

## 2. Ranking — `RankingCard`

`maxRemaining` **fuera** de `renderItem`, sobre `rows` completo:

```ts
const maxRemaining = Math.max(0, ...rows.map((r) => r.remainingWork));
```

Título del `Panel` (el que hoy dice «Avance por proyecto»):

```tsx
<Panel label="Proyectos" title="Qué falta por proyecto" className="mt-6">
```

`renderItem` (reemplaza el sidecar `sm:w-36` + `Progress`):

```tsx
<Link
  to={ROUTES.project(row.id)}
  className={cn(ROW_LINK_CLASS, "flex-col items-stretch")}
>
  <div className="flex min-w-0 items-center gap-3">
    <HealthDot health={row.health} />
    <span className="min-w-0 flex-1 truncate text-sm">{row.name}</span>
    <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
      {row.remainingWork === 1 ? "1 restante" : `${row.remainingWork} restantes`}
    </span>
  </div>
  {(row.checklist.total > 0 || row.tasks.total > 0) && (
    <div className="mt-1.5 flex w-full flex-col gap-1">
      {row.checklist.total > 0 && (
        <div title={`Checklists ${row.checklist.done}/${row.checklist.total}`}>
          <MagnitudeBar
            value={row.checklist.total - row.checklist.done}
            max={maxRemaining}
            label={`${row.checklist.total - row.checklist.done} de checklist restantes de un máximo de ${maxRemaining}`}
          />
        </div>
      )}
      {row.tasks.total > 0 && (
        <div title={`Tareas ${row.tasks.done}/${row.tasks.total}`}>
          <MagnitudeBar
            value={row.tasks.total - row.tasks.done}
            max={maxRemaining}
            indicatorClassName="bg-success"
            label={`${row.tasks.total - row.tasks.done} tareas restantes de un máximo de ${maxRemaining}`}
          />
        </div>
      )}
    </div>
  )}
</Link>
```

`maxRemaining` entra al `renderItem` por closure. Expandir no lo recalcula sobre el slice.

Grep al cerrar: `RankingCard` no importa `Progress`.

## 3. Carga — `WorkloadCard`

`maxTasks` ya está sobre el array completo (L593). Mover el recuento a la pista:

```tsx
renderItem={(entry) => {
  const tareas =
    entry.taskCount === 1 ? "1 tarea" : `${entry.taskCount} tareas`;
  const meta =
    entry.totalEstimate > 0 ? `${tareas} · ${entry.totalEstimate}h` : tareas;
  return (
    <div>
      {knownPersonIds.has(entry.personId) ? (
        <Link
          to={dashboardHrefs.personTasks(entry.personId)}
          className="font-medium hover:underline"
        >
          {entry.personName}
        </Link>
      ) : (
        <span className="font-medium">{entry.personName}</span>
      )}
      <div className="mt-1.5 flex items-center gap-2">
        <MagnitudeBar
          value={entry.taskCount}
          max={maxTasks}
          className="min-w-0 flex-1"
          label={`${meta} de un máximo de ${maxTasks}`}
        />
        <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
          {meta}
        </span>
      </div>
    </div>
  );
}}
```

Quitar el `mb-1.5 flex justify-between` que ponía el número arriba. `listClassName="space-y-3"` se queda.

Grep al cerrar: `WorkloadCard` no importa `Progress`.

## 4. Tests

`MagnitudeBar.test.ts` (puros, sin RTL):

```ts
expect(magnitudeBarWidth(0, 10)).toBe(0);
expect(magnitudeBarWidth(5, 10)).toBe(50);
expect(magnitudeBarWidth(10, 10)).toBe(100);
expect(magnitudeBarWidth(3, 0)).toBe(0);
expect(magnitudeBarWidth(-1, 10)).toBe(0);
expect(magnitudeBarWidth(12, 10)).toBe(100);
```

No montar el componente. No tests de `DashboardPage` (criterio 063/066).

## 5. Fuera de este diseño

Hero `ProgressRow`, `StatusCard` composición, `HealthCard` frase, mini-barra de producto (ésa **sí** sigue siendo `%` de sí misma: un producto no se compara en eje de restante; 066 D15).
Si más adelante se quiere ranking-por-producto comparativo, es otro spec.
