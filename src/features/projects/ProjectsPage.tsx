import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FolderKanban, Plus, Boxes } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { EntityCard } from "@/components/EntityCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectFormDialog } from "./ProjectFormDialog";
import { CreateFromTypeDialog } from "./CreateFromTypeDialog";
import { useDataStore } from "@/store/useDataStore";
import {
  priorityLabel,
  priorityVariant,
  projectStatusLabel,
  projectStatusVariant,
} from "@/domain/labels";
import { aggregateChecklistProgress, projectChecklistProgress } from "@/domain/compute";
import { ROUTES } from "@/routes/paths";
import type { Product, Project, Quarter } from "@/domain/schemas";

type ViewMode = "list" | "quarter" | "product";

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
  const createProject = useDataStore((s) => s.createProject);

  const [searchParams] = useSearchParams();
  const [formOpen, setFormOpen] = useState(false);
  const [fromTypeOpen, setFromTypeOpen] = useState(false);
  const [productFilter, setProductFilter] = useState(searchParams.get("product") ?? "");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Sync productFilter when URL param changes (e.g. clicking product link)
  useEffect(() => {
    const param = searchParams.get("product") ?? "";
    setProductFilter(param);
  }, [searchParams]);

  // Deep-link from Trimestres (?quarter=<id>) jumps straight into the "Por trimestre" view.
  const quarterParam = searchParams.get("quarter");
  useEffect(() => {
    if (quarterParam) setViewMode("quarter");
  }, [quarterParam]);

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (!productFilter || p.productId === productFilter) &&
          (!statusFilter || p.status === statusFilter),
      ),
    [projects, productFilter, statusFilter],
  );

  const productName = (id: string | null) =>
    products.find((p) => p.id === id)?.name;

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
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              <Select
                className="w-full sm:w-48"
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos los estados</option>
                {Object.entries(projectStatusLabel).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <TabsList>
                <TabsTrigger value="list">Lista</TabsTrigger>
                <TabsTrigger value="quarter">Por trimestre</TabsTrigger>
                <TabsTrigger value="product">Por producto</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {viewMode === "list" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProjectCard key={p.id} project={p} productName={productName(p.productId)} />
              ))}
            </div>
          )}

          {viewMode === "quarter" && (
            <GroupedProjects
              projects={filtered}
              groups={quarters}
              groupKey={(p) => p.quarterId}
              unassignedLabel="Sin trimestre"
              productName={productName}
              highlightId={quarterParam}
            />
          )}

          {viewMode === "product" && (
            <GroupedProjects
              projects={filtered}
              groups={products}
              groupKey={(p) => p.productId}
              unassignedLabel="Sin producto"
              productName={productName}
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

/** Project card shared by the flat list and every grouped view. */
function ProjectCard({ project: p, productName }: { project: Project; productName?: string }) {
  const prog = projectChecklistProgress(p);
  return (
    <EntityCard
      href={ROUTES.project(p.id)}
      title={p.name}
      meta={
        <>
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
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {p.areas.length} {p.areas.length === 1 ? "área" : "áreas"} · {p.tasks.length}{" "}
        {p.tasks.length === 1 ? "tarea" : "tareas"}
      </p>
    </EntityCard>
  );
}

/** Groups projects by a `{id,name}` entity (product or quarter) with an aggregate progress header. */
function GroupedProjects({
  projects,
  groups,
  groupKey,
  unassignedLabel,
  productName,
  highlightId,
}: {
  projects: Project[];
  groups: (Product | Quarter)[];
  groupKey: (p: Project) => string | null;
  unassignedLabel: string;
  productName: (id: string | null) => string | undefined;
  highlightId?: string | null;
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
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Ningún proyecto coincide con los filtros actuales.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {buckets.map((group) => {
        const rollup = aggregateChecklistProgress(group.projects);
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
              <span className="text-xs text-muted-foreground">
                {group.projects.length} {group.projects.length === 1 ? "proyecto" : "proyectos"} ·{" "}
                {rollup.pct}%
              </span>
              <Progress value={rollup.pct} className="h-1.5 max-w-40" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.projects.map((p) => (
                <ProjectCard key={p.id} project={p} productName={productName(p.productId)} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
