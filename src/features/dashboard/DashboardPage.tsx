import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  AlertTriangle,
  CalendarClock,
  Hourglass,
  CheckCircle2,
  ArrowRight,
  Library,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Panel } from "@/components/ui/Panel";
import { StatTile } from "@/components/ui/StatTile";
import { HierarchyLegend } from "@/components/HierarchyLegend";
import { ScrollToHash } from "@/components/ScrollToHash";
import { HealthBadge, HealthDot, healthColorClass } from "@/components/HealthBadge";
import { ExpandableList } from "@/components/ExpandableList";
import { MagnitudeBar } from "@/components/MagnitudeBar";
import { ProgressRow } from "@/components/ProgressRow";
import { useDataStore } from "@/store/useDataStore";
import { useAppStore } from "@/store/useAppStore";
import { isDemoCleared } from "@/storage/mode";
import { projectStatusLabel } from "@/domain/labels";
import { cn } from "@/lib/utils";
import type { ProgressStat } from "@/domain/compute";
import {
  computePortfolio,
  healthSentence,
  type DueRow,
  type ProductRollup,
  type ProjectRankingRow,
} from "./portfolio";
import { dashboardHrefs } from "./dashboardHrefs";
import type { Health, Project, ProjectStatus } from "@/domain/schemas";
import { ROUTES } from "@/routes/paths";
import { ExportReportMenu } from "@/features/reports/ExportReportMenu";

const HEALTH_ORDER: Health[] = ["red", "amber", "green"];

/** Fila de card clickable (mismo look que las filas de StalledCard, spec 063 §3.2). */
const ROW_CLASS = "flex items-center gap-3 rounded-md border border-border/60 px-3 py-2";
const ROW_LINK_CLASS = `${ROW_CLASS} transition-colors hover:bg-accent`;

export function DashboardPage() {
  const projects = useDataStore((s) => s.projects);
  const products = useDataStore((s) => s.products);
  const people = useDataStore((s) => s.people);
  const settings = useAppStore((s) => s.workspace?.settings);
  const mode = useAppStore((s) => s.mode);
  const loadDemo = useAppStore((s) => s.loadDemo);

  const stats = useMemo(
    () => (settings ? computePortfolio(projects, products, settings, new Date(), people) : null),
    [projects, products, settings, people],
  );

  const personIds = useMemo(() => new Set(people.map((p) => p.id)), [people]);

  if (!settings || !stats) return null;

  if (projects.length === 0) {
    return (
      <div>
        <PageHeader
          label="Dashboard"
          title="Aún no hay proyectos"
          description="El dashboard se llena con salud, vencidos y estancados en cuanto crees tu primer proyecto."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <EmptyState
            icon={FolderKanban}
            title="Empezá por crear un proyecto"
            description="Si querés, definí primero plantillas en la Biblioteca para acelerar el setup."
            action={
              <div className="flex flex-wrap gap-2">
                <Link to={ROUTES.library("checklists")}>
                  <Button variant="outline" size="sm">
                    <Library className="size-4" />
                    1. Ir a Biblioteca
                  </Button>
                </Link>
                <Link to={ROUTES.projects}>
                  <Button size="sm">
                    <FolderKanban className="size-4" />
                    2. Crear proyecto
                  </Button>
                </Link>
                {mode === "browser" && !isDemoCleared() && (
                  <Button variant="outline" size="sm" onClick={() => void loadDemo()}>
                    <Sparkles className="size-4" />
                    Cargar datos de ejemplo
                  </Button>
                )}
              </div>
            }
          />
          <Panel label="Jerarquía" title="Datos de la organización">
            <HierarchyLegend />
          </Panel>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ScrollToHash />
      <PageHeader
        label="Dashboard"
        title="Portafolio"
        description={
          settings.deriveHealth
            ? "Salud RAG automática, derivada de fechas y actividad."
            : "Vista global de productos, proyectos y salud."
        }
        actions={<ExportReportMenu scope="portfolio" />}
      />

      <div className="grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Link to={dashboardHrefs.activeProjects()} className="block">
          <StatTile
            value={stats.byStatus.active}
            label="Proyectos activos"
            icon={FolderKanban}
            tone="default"
          />
        </Link>
        <Link to={dashboardHrefs.overdueAnchor()} className="block">
          <StatTile
            value={stats.overdue.length}
            label="Vencidos"
            icon={AlertTriangle}
            tone="destructive"
          />
        </Link>
        <Link to={dashboardHrefs.dueSoonAnchor()} className="block">
          <StatTile
            value={stats.dueSoon.length}
            label="Por vencer"
            icon={CalendarClock}
            tone="warning"
          />
        </Link>
        <Link to={dashboardHrefs.stalledProjects()} className="block">
          <StatTile
            value={stats.stalled.length}
            label="Estancados"
            icon={Hourglass}
            tone="warning"
          />
        </Link>
      </div>

      <Panel label="Avance" title="Avance del portafolio" className="mt-8">
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
      </Panel>

      <Panel label="Proyectos" title="Qué falta por proyecto" className="mt-6">
        <RankingCard rows={stats.projectRows} />
      </Panel>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div id="vencimientos" className="scroll-mt-6 col-span-full">
          <DueCard overdue={stats.overdue} dueSoon={stats.dueSoon} />
        </div>
        <StalledCard projects={stats.stalled} stalledAfterDays={settings.stalledAfterDays} />
        <WorkloadCard workload={stats.workload} knownPersonIds={personIds} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <HealthCard byHealth={stats.byHealth} />
        <StatusCard byStatus={stats.byStatus} total={stats.total} />
      </div>

      <div className="mt-6">
        <ProductCard rollups={stats.byProduct} />
      </div>
    </div>
  );
}

/* ---- Ranking por proyecto (spec 067 HU-01) ---- */
function RankingCard({ rows }: { rows: ProjectRankingRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay proyectos abiertos.</p>;
  }
  const maxRemaining = Math.max(0, ...rows.map((r) => r.remainingWork));
  return (
    <ExpandableList
      items={rows}
      getKey={(row) => row.id}
      renderItem={(row) => (
        <Link to={ROUTES.project(row.id)} className={cn(ROW_LINK_CLASS, "flex-col items-stretch")}>
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
      )}
    />
  );
}

/* ---- Salud RAG ---- */
function HealthCard({ byHealth }: { byHealth: Record<Health, number> }) {
  const total = HEALTH_ORDER.reduce((s, h) => s + byHealth[h], 0);
  return (
    <Panel label="Salud" title="Salud del portafolio">
      {total === 0 ? (
        <p className="text-sm text-muted-foreground">No hay proyectos activos.</p>
      ) : (
        <>
          <div className="mb-4 flex h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
            {HEALTH_ORDER.map((h) =>
              byHealth[h] > 0 ? (
                <div
                  key={h}
                  className={healthColorClass[h]}
                  style={{ width: `${(byHealth[h] / total) * 100}%` }}
                />
              ) : null,
            )}
          </div>
          <p className="mb-4 text-sm text-foreground">{healthSentence(byHealth)}</p>
          <ul className="space-y-3">
            {HEALTH_ORDER.map((h) => {
              const row = (
                <>
                  <HealthBadge health={h} className="flex-1 text-muted-foreground" />
                  <span className="font-mono text-sm font-semibold">{byHealth[h]}</span>
                </>
              );
              return byHealth[h] > 0 ? (
                <li key={h}>
                  <Link to={dashboardHrefs.byHealth(h)} className={ROW_LINK_CLASS}>
                    {row}
                  </Link>
                </li>
              ) : (
                <li key={h} className={ROW_CLASS}>
                  {row}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Panel>
  );
}

/* ---- Distribución por estado ---- */
const STATUS_COMPOSITION_CLASS: Record<ProjectStatus, string> = {
  backlog: "bg-muted-foreground/40",
  active: "bg-primary",
  paused: "bg-warning",
  blocked: "bg-destructive",
  done: "bg-success",
  archived: "bg-muted-foreground/20",
};

function StatusCard({
  byStatus,
  total,
}: {
  byStatus: Record<ProjectStatus, number>;
  total: number;
}) {
  const rows = (Object.keys(byStatus) as ProjectStatus[]).filter((s) => byStatus[s] > 0);
  return (
    <Panel label="Estado" title="Distribución por estado">
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin proyectos activos.</p>
      ) : (
        <>
          <div
            className="mb-4 flex h-2 overflow-hidden rounded-full bg-muted"
            role="img"
            aria-label={
              rows.map((s) => `${byStatus[s]} ${projectStatusLabel[s]}`).join(", ") +
              ` de ${total}`
            }
          >
            {rows.map((s) => (
              <div
                key={s}
                className={STATUS_COMPOSITION_CLASS[s]}
                style={{ width: `${total === 0 ? 0 : (byStatus[s] / total) * 100}%` }}
              />
            ))}
          </div>
          <ul className="space-y-4">
            {rows.map((s) => (
              <li key={s}>
                <Link
                  to={dashboardHrefs.byStatus(s)}
                  className="block rounded-md px-1 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{projectStatusLabel[s]}</span>
                    <span className="font-mono text-sm font-semibold">
                      {byStatus[s]} de {total}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </Panel>
  );
}

/* ---- Salud por producto ---- */
function productBarMetric(r: ProductRollup): ProgressStat | null {
  if (r.checklistProgress.total > 0) return r.checklistProgress;
  if (r.taskProgress.total > 0) return r.taskProgress;
  return null;
}

function ProductCard({ rollups }: { rollups: ProductRollup[] }) {
  return (
    <Panel label="Producto" title="Por producto">
      {rollups.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay proyectos activos.</p>
      ) : (
        <ExpandableList
          items={rollups}
          listClassName="space-y-2"
          getKey={(r) => r.id ?? "none"}
          renderItem={(r) => {
            const metric = productBarMetric(r);
            const metricIsTasks = metric !== null && r.checklistProgress.total === 0;
            const row = (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.total} proyecto{r.total === 1 ? "" : "s"}
                  </p>
                  {metric && (
                    <div
                      className="mt-1.5"
                      title={
                        metricIsTasks
                          ? `Tareas ${metric.done}/${metric.total}`
                          : `Checklists ${metric.done}/${metric.total}`
                      }
                    >
                      <Progress
                        value={metric.pct}
                        className="h-1.5"
                        indicatorClassName={metricIsTasks ? "bg-success" : undefined}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {HEALTH_ORDER.map((h) =>
                    r.byHealth[h] > 0 ? (
                      <span key={h} className="flex items-center gap-1 font-mono text-xs">
                        <HealthDot health={h} className="size-2" />
                        {r.byHealth[h]}
                      </span>
                    ) : null,
                  )}
                </div>
              </>
            );
            return r.id === null ? (
              <div className={ROW_CLASS}>{row}</div>
            ) : (
              <Link to={dashboardHrefs.byProduct(r.id)} className={ROW_LINK_CLASS}>
                {row}
              </Link>
            );
          }}
        />
      )}
    </Panel>
  );
}

/* ---- Proyectos estancados ---- */
function StalledCard({
  projects,
  stalledAfterDays,
}: {
  projects: Project[];
  stalledAfterDays: number;
}) {
  return (
    <Panel label="Estancados" title={`Proyectos sin actividad hace más de ${stalledAfterDays} días`}>
      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">👌 Todo se mueve.</p>
      ) : (
        <ExpandableList
          items={projects}
          getKey={(p) => p.id}
          renderItem={(p) => (
            <Link
              to={ROUTES.project(p.id)}
              className="flex items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <span className="min-w-0 truncate">{p.name}</span>
              <span className="flex shrink-0 items-center gap-1 font-mono text-xs font-medium text-warning">
                {daysSince(p.updatedAt)} días
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          )}
        />
      )}
    </Panel>
  );
}

/* ---- Resumen del día: fechas ---- */
function DueCard({ overdue, dueSoon }: { overdue: DueRow[]; dueSoon: DueRow[] }) {
  if (overdue.length === 0 && dueSoon.length === 0) {
    return (
      <Panel label="Vencimientos" title="Sin fechas urgentes">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <CheckCircle2 className="size-5 text-success" />
          No hay fechas vencidas ni próximos vencimientos.
        </div>
      </Panel>
    );
  }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DueSection
        title="Vencidos"
        icon={AlertTriangle}
        tone="destructive"
        rows={overdue}
        emptyCopy="No hay fechas vencidas."
        format={(r) => `hace ${-r.d} día${r.d === -1 ? "" : "s"}`}
      />
      <DueSection
        title="Por vencer"
        icon={CalendarClock}
        tone="warning"
        rows={dueSoon}
        emptyCopy="No hay próximos vencimientos."
        format={(r) => (r.d === 0 ? "vence hoy" : `en ${r.d} día${r.d === 1 ? "" : "s"}`)}
      />
    </div>
  );
}

function DueSection({
  title,
  icon: Icon,
  tone,
  rows,
  emptyCopy,
  format,
}: {
  title: string;
  icon: typeof AlertTriangle;
  tone: "destructive" | "warning";
  rows: DueRow[];
  emptyCopy: string;
  format: (r: DueRow) => string;
}) {
  const toneText = tone === "destructive" ? "text-destructive" : "text-warning";
  return (
    <Panel
      label={
        <span className="flex items-center gap-2">
          <Icon className={`size-3.5 ${toneText}`} />
          {title}
        </span>
      }
      title={
        <span className="flex items-center gap-2">
          {title}
          <Badge variant="secondary">{rows.length}</Badge>
        </span>
      }
    >
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyCopy}</p>
      ) : (
        <ExpandableList
          items={rows}
          getKey={(r) => `${r.ref.kind}-${r.ref.itemId ?? r.ref.taskId ?? r.ref.projectId}`}
          renderItem={(r) => {
            const params = new URLSearchParams();
            if (r.ref.kind === "task") {
              params.set("tab", "tasks");
              if (r.ref.taskId) params.set("focus", r.ref.taskId);
            } else if (r.ref.kind === "checklistItem") {
              params.set("tab", "areas");
              if (r.ref.itemId) params.set("focus", r.ref.itemId);
            } else {
              params.set("tab", "overview");
            }
            return (
              <Link
                to={`${ROUTES.project(r.projectId)}?${params.toString()}`}
                className="flex items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <span className="min-w-0 truncate">{r.label}</span>
                <span className={`shrink-0 font-mono text-xs font-medium ${toneText}`}>
                  {format(r)}
                </span>
              </Link>
            );
          }}
        />
      )}
    </Panel>
  );
}

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

/* ---- Carga de trabajo por persona ---- */
function WorkloadCard({
  workload,
  knownPersonIds,
}: {
  workload: import("./portfolio").WorkloadEntry[];
  knownPersonIds: ReadonlySet<string>;
}) {
  if (workload.length === 0) {
    return (
      <Panel label="Carga" title="Carga de trabajo">
        <p className="text-sm text-muted-foreground">No hay tareas abiertas asignadas.</p>
      </Panel>
    );
  }

  const maxTasks = Math.max(0, ...workload.map((w) => w.taskCount));

  return (
    <Panel label="Carga" title="Carga de trabajo por persona">
      <ExpandableList
        items={workload}
        listClassName="space-y-3"
        getKey={(entry) => entry.personId}
        renderItem={(entry) => {
          const tareas = entry.taskCount === 1 ? "1 tarea" : `${entry.taskCount} tareas`;
          const meta = entry.totalEstimate > 0 ? `${tareas} · ${entry.totalEstimate}h` : tareas;
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
      />
    </Panel>
  );
}
