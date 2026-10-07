import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FolderKanban, Plus, Boxes } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { EntityCard } from "@/components/EntityCard";
import { HealthDot } from "@/components/HealthBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectFormDialog } from "./ProjectFormDialog";
import { CreateFromTypeDialog } from "./CreateFromTypeDialog";
import { ProjectPlanRow } from "./components/ProjectPlanRow";
import { useDataStore } from "@/store/useDataStore";
import { useAppStore } from "@/store/useAppStore";
import {
  priorityLabel,
  priorityVariant,
  projectStatusLabel,
  projectStatusVariant,
  healthLabel,
} from "@/domain/labels";
import {
  aggregateChecklistProgress,
  aggregateTaskProgress,
  projectChecklistProgress,
  projectLiveTaskProgress,
} from "@/domain/compute";
import { effectiveHealth } from "@/domain/health";
import type { Health, Product, Project, Quarter, Settings } from "@/domain/schemas";
import {
  applyProjectsFilter,
  clearProjectFilters,
  compareProjects,
  filterProjectsByQuery,
  hasProjectFilters,
  healthSummaryFragments,
  parseProjectsQuery,
  projectDueLabel,
  summarizeProjects,
} from "./filterProjects";
import { ROUTES } from "@/routes/paths";

const VIEW_HEALTHS: readonly Health[] = ["red", "amber", "green"];

export function ProjectsPage() {
  return (
    <>
      <Helmet>
        <title>Proyectos | Hito</title>
        <meta name="description" content="Gestiona proyectos con áreas, procesos, checklists y tareas en Hito." />
      </Helmet>
      <ProjectsContent />
    </>
  );
}

function ProjectsContent() {
  const projects = useDataStore((s) => s.projects);
  const products = useDataStore((s) => s.products);
  const quarters = useDataStore((s) => s.quarters);
  const people = useDataStore((s) => s.people);
  const createProject = useDataStore((s) => s.createProject);
  const settings = useAppStore((s) => s.workspace?.settings) ?? null;

  const [searchParams, setSearchParams] = useSearchParams();
  const [formOpen, setFormOpen] = useState(false);
  const [fromTypeOpen, setFromTypeOpen] = useState(false);

  // URL es la fuente de verdad de filtros, orden y vista (specs 063 D2, 072 D2).
  const query = useMemo(() => parseProjectsQuery(searchParams), [searchParams]);
  const known = useMemo(
    () => ({
      productIds: new Set(products.map((p) => p.id)),
      quarterIds: new Set(quarters.map((q) => q.id)),
      ownerIds: new Set(people.map((p) => p.id)),
    }),
    [products, quarters, people],
  );

  const now = useMemo(() => new Date(), []);

  const filtered = useMemo(
    () => filterProjectsByQuery(projects, query, settings, now, known),
    [projects, query, settings, now, known],
  );

  // El orden es un paso aparte, sobre el resultado del filtro (D11).
  const ordered = useMemo(
    () => [...filtered].sort((a, b) => compareProjects(a, b, query.sort, settings, now)),
    [filtered, query.sort, settings, now],
  );

  function commit(next: URLSearchParams) {
    setSearchParams(next, { replace: true });
  }

  // Búsqueda con debounce (D7): el borrador vive en el input; al escribir en la
  // URL desde afuera (limpiar, atrás), el borrador vuelve al param. La forma
  // funcional no pisa un filtro cambiado durante los 200 ms.
  const [qDraft, setQDraft] = useState(query.q);
  const qTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setQDraft(query.q);
  }, [query.q]);
  useEffect(
    () => () => {
      if (qTimer.current) clearTimeout(qTimer.current);
    },
    [],
  );
  function onSearch(value: string) {
    setQDraft(value);
    if (qTimer.current) clearTimeout(qTimer.current);
    qTimer.current = setTimeout(() => {
      setSearchParams((prev) => applyProjectsFilter(prev, "q", value.trim() || null), {
        replace: true,
      });
    }, 200);
  }

  const productName = (id: string | null) => products.find((p) => p.id === id)?.name;
  const quarterName = (id: string | null) => quarters.find((q) => q.id === id)?.name;
  const personName = (id: string | null) => people.find((p) => p.id === id)?.name;

  const summary = ordered.length > 0 ? summarizeProjects(ordered, settings, now) : null;
  const fragments = summary ? healthSummaryFragments(summary.byHealth) : null;
  const showClear = hasProjectFilters(searchParams);

  const filterEmpty = (
    <div className="py-8 text-center">
      <p className="text-sm text-muted-foreground">
        Ningún proyecto coincide con los filtros actuales.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={() => commit(clearProjectFilters(searchParams))}
      >
        Limpiar filtros
      </Button>
    </div>
  );

  return (
    <div>
      <PageHeader
        label="Proyectos"
        title="Proyectos"
        description="Esfuerzos con áreas, procesos, checklists y tareas."
        actions={
          <>
            <Button variant="outline" onClick={() => setFromTypeOpen(true)}>
              <Boxes className="size-4" />
              Desde tipo
            </Button>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="size-4" />
              Nuevo proyecto
            </Button>
          </>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Aún no hay proyectos"
          description="Crea tu primer proyecto. Luego podrás documentar áreas, procesos y checklists, y gestionar tareas."
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="size-4" />
              Nuevo proyecto
            </Button>
          }
        />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Input
              type="search"
              aria-label="Buscar por nombre"
              placeholder="Buscar por nombre"
              value={qDraft}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select
              className="w-full sm:w-48"
              aria-label="Producto"
              value={query.productId && known.productIds.has(query.productId) ? query.productId : ""}
              onChange={(e) => commit(applyProjectsFilter(searchParams, "product", e.target.value || null))}
            >
              <option value="">Todos los productos</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
            <Select
              className="w-full sm:w-48"
              aria-label="Estado"
              value={query.status ?? ""}
              onChange={(e) => commit(applyProjectsFilter(searchParams, "status", e.target.value || null))}
            >
              <option value="">Todos los estados</option>
              {Object.entries(projectStatusLabel).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
            <Select
              className="w-full sm:w-48"
              aria-label="Prioridad"
              value={query.priority ?? ""}
              onChange={(e) => commit(applyProjectsFilter(searchParams, "priority", e.target.value || null))}
            >
              <option value="">Todas las prioridades</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </Select>
            <Select
              className="w-full sm:w-48"
              aria-label="Responsable"
              value={query.ownerId ?? ""}
              onChange={(e) => commit(applyProjectsFilter(searchParams, "owner", e.target.value || null))}
            >
              <option value="">Todos los responsables</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
            <Select
              className="w-full sm:w-48"
              aria-label="Vencimiento"
              value={query.due ?? ""}
              onChange={(e) => commit(applyProjectsFilter(searchParams, "due", e.target.value || null))}
            >
              <option value="">Cualquier fecha</option>
              <option value="overdue">Vencidos</option>
              <option value="soon">En 14 días</option>
              <option value="none">Sin fecha</option>
            </Select>
            <Select
              className="w-full sm:w-48"
              aria-label="Salud"
              value={query.health ?? ""}
              onChange={(e) => commit(applyProjectsFilter(searchParams, "health", e.target.value || null))}
            >
              <option value="">Cualquier salud</option>
              {(Object.entries(healthLabel) as [Health, string][]).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={query.stalled}
                onCheckedChange={(c) => commit(applyProjectsFilter(searchParams, "stalled", c ? "1" : null))}
                aria-label="Solo estancados"
              />
              Solo estancados
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={query.closed}
                onCheckedChange={(c) => commit(applyProjectsFilter(searchParams, "closed", c ? "1" : null))}
                aria-label="Mostrar cerrados"
              />
              Mostrar cerrados
            </label>
            {showClear && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => commit(clearProjectFilters(searchParams))}
              >
                Limpiar filtros
              </Button>
            )}
          </div>

          {summary && fragments && (
            <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>
                {summary.count} {summary.count === 1 ? "proyecto" : "proyectos"}
              </span>
              {fragments.map((label, i) => {
                const health = VIEW_HEALTHS[i];
                return (
                  <Button
                    key={health}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-muted-foreground"
                    aria-pressed={query.health === health}
                    onClick={() =>
                      commit(
                        applyProjectsFilter(searchParams, "health", query.health === health ? null : health),
                      )
                    }
                  >
                    <HealthDot health={health} ariaHidden />
                    {label}
                  </Button>
                );
              })}
              {summary.overdueProjects > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-muted-foreground"
                  aria-pressed={query.due === "overdue"}
                  onClick={() =>
                    commit(
                      applyProjectsFilter(searchParams, "due", query.due === "overdue" ? null : "overdue"),
                    )
                  }
                >
                  {summary.overdueProjects} {summary.overdueProjects === 1 ? "vencido" : "vencidos"}
                </Button>
              )}
            </div>
          )}

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Select
              className="w-full sm:w-40"
              aria-label="Orden"
              value={query.sort === "attention" ? "" : query.sort}
              onChange={(e) => commit(applyProjectsFilter(searchParams, "sort", e.target.value || null))}
            >
              <option value="">Atención</option>
              <option value="due">Fecha</option>
              <option value="name">Nombre</option>
              <option value="progress">Avance</option>
              <option value="updated">Actualización</option>
            </Select>
            <Tabs
              value={query.view}
              onValueChange={(v) => commit(applyProjectsFilter(searchParams, "view", v === "plan" ? null : v))}
            >
              <TabsList>
                <TabsTrigger value="plan">Plan</TabsTrigger>
                <TabsTrigger value="list">Lista</TabsTrigger>
                <TabsTrigger value="quarter">Por trimestre</TabsTrigger>
                <TabsTrigger value="product">Por producto</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {query.view === "plan" &&
            (ordered.length === 0 ? (
              filterEmpty
            ) : (
              <div className="space-y-2">
                {ordered.map((p) => (
                  <ProjectPlanRow
                    key={p.id}
                    project={p}
                    settings={settings}
                    now={now}
                    productName={productName(p.productId)}
                    quarterName={quarterName(p.quarterId)}
                    ownerName={personName(p.ownerId)}
                  />
                ))}
              </div>
            ))}

          {query.view === "list" &&
            (ordered.length === 0 ? (
              filterEmpty
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ordered.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    settings={settings}
                    now={now}
                    productName={productName(p.productId)}
                  />
                ))}
              </div>
            ))}

          {query.view === "quarter" && (
            <GroupedProjects
              projects={ordered}
              groups={quarters}
              groupKey={(p) => p.quarterId}
              unassignedLabel="Sin trimestre"
              settings={settings}
              now={now}
              productName={productName}
              highlightId={query.quarterId}
              empty={filterEmpty}
            />
          )}

          {query.view === "product" && (
            <GroupedProjects
              projects={ordered}
              groups={products}
              groupKey={(p) => p.productId}
              unassignedLabel="Sin producto"
              settings={settings}
              now={now}
              productName={productName}
              empty={filterEmpty}
            />
          )}
        </>
      )}

      <ProjectFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={(p) => createProject(p)}
      />
      <CreateFromTypeDialog open={fromTypeOpen} onOpenChange={setFromTypeOpen} />
    </div>
  );
}

/** Project card shared by the flat list and every grouped view (spec 072 D17). */
function ProjectCard({
  project: p,
  settings,
  now,
  productName,
}: {
  project: Project;
  settings: Settings | null;
  now: Date;
  productName?: string;
}) {
  const prog = projectChecklistProgress(p);
  const tasks = projectLiveTaskProgress(p);
  const health = settings ? effectiveHealth(p, settings, now) : p.health;
  return (
    <EntityCard
      href={ROUTES.project(p.id)}
      title={p.name}
      meta={
        <>
          <HealthDot health={health} ariaHidden />
          <Badge variant={projectStatusVariant[p.status]}>{projectStatusLabel[p.status]}</Badge>
          {productName && <span className="text-xs text-muted-foreground">{productName}</span>}
          <Badge variant={priorityVariant[p.priority]}>{priorityLabel[p.priority]}</Badge>
        </>
      }
    >
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Checklists</span>
          <span>
            {prog.done}/{prog.total} · {prog.pct}%
          </span>
        </div>
        <Progress value={prog.pct} />
        {tasks.total > 0 && (
          <>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Tareas</span>
              <span>
                {tasks.done}/{tasks.total} · {tasks.pct}%
              </span>
            </div>
            <Progress value={tasks.pct} className="h-1.5" indicatorClassName="bg-success" />
          </>
        )}
      </div>
      {p.dueDate && (
        <p className="mt-2 text-xs text-muted-foreground">{projectDueLabel(p.dueDate, now)}</p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        {p.areas.length} {p.areas.length === 1 ? "área" : "áreas"} · {tasks.total}{" "}
        {tasks.total === 1 ? "tarea" : "tareas"}
      </p>
    </EntityCard>
  );
}

/** Groups projects by a `{id,name}` entity (product or quarter) with an aggregate
 *  progress header. `projects` already arrives sorted (D11); each bucket keeps
 *  that order — do not re-sort inside. */
function GroupedProjects({
  projects,
  groups,
  groupKey,
  unassignedLabel,
  settings,
  now,
  productName,
  highlightId,
  empty,
}: {
  projects: Project[];
  groups: (Product | Quarter)[];
  groupKey: (p: Project) => string | null;
  unassignedLabel: string;
  settings: Settings | null;
  now: Date;
  productName: (id: string | null) => string | undefined;
  highlightId?: string | null;
  empty: React.ReactNode;
}) {
  const buckets = useMemo(() => {
    const byId = new Map<string, Project[]>();
    const unassigned: Project[] = [];
    for (const p of projects) {
      const key = groupKey(p);
      if (!key) {
        unassigned.push(p);
        continue;
      }
      const list = byId.get(key) ?? [];
      list.push(p);
      byId.set(key, list);
    }
    const named = groups
      .map((g) => ({ id: g.id, name: g.name, projects: byId.get(g.id) ?? [] }))
      .filter((g) => g.projects.length > 0);
    return unassigned.length > 0
      ? [...named, { id: "__unassigned", name: unassignedLabel, projects: unassigned }]
      : named;
  }, [projects, groups, groupKey, unassignedLabel]);

  if (buckets.length === 0) {
    return <>{empty}</>;
  }

  return (
    <div className="space-y-8">
      {buckets.map((group) => {
        const checks = aggregateChecklistProgress(group.projects);
        const tasks = aggregateTaskProgress(group.projects);
        const counts = [
          `${group.projects.length} ${group.projects.length === 1 ? "proyecto" : "proyectos"}`,
          checks.total > 0 ? `checklists ${checks.pct}%` : null,
          tasks.total > 0 ? `tareas ${tasks.pct}%` : null,
        ]
          .filter((part): part is string => part !== null)
          .join(" · ");
        return (
          <section key={group.id}>
            <div
              className={
                group.id === highlightId
                  ? "mb-3 flex items-center gap-3 rounded-lg bg-foreground/5 p-2"
                  : "mb-3 flex items-center gap-3"
              }
            >
              <SectionLabel>{group.name}</SectionLabel>
              <span className="text-xs text-muted-foreground">{counts}</span>
              <Progress value={checks.pct} className="h-1.5 max-w-40" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  settings={settings}
                  now={now}
                  productName={productName(p.productId)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
