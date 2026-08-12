import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CalendarDays, CalendarRange, LayoutGrid, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { EntityCard } from "@/components/EntityCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { QuarterFormDialog } from "./QuarterFormDialog";
import { PortfolioCalendarView } from "@/features/projects/calendar/PortfolioCalendarView";
import { TaskDetailDrawer } from "@/features/projects/components/kanban/TaskDetailDrawer";
import { useDataStore } from "@/store/useDataStore";
import { quarterStatusLabel, quarterStatusVariant } from "@/domain/labels";
import { quarterRollup } from "@/domain/compute";
import { formatRange } from "@/lib/dates";
import { ROUTES } from "@/routes/paths";
import * as ops from "@/domain/projectOps";
import type { Project, Quarter, Task } from "@/domain/schemas";

export function QuartersPage() {
  return (
    <>
      <Helmet>
        <title>Trimestres | Hito</title>
        <meta
          name="description"
          content="Agrupa proyectos por trimestre y sigue el progreso agregado en Hito."
        />
      </Helmet>
      <QuartersContent />
    </>
  );
}

type QuartersView = "list" | "calendar";

function readView(): QuartersView {
  try {
    const saved = localStorage.getItem("quarters-view-mode");
    if (saved === "calendar" || saved === "list") return saved;
  } catch {
    // ignore
  }
  return "list";
}

function QuartersContent() {
  const quarters = useDataStore((s) => s.quarters);
  const projects = useDataStore((s) => s.projects);
  const people = useDataStore((s) => s.people);
  const createQuarter = useDataStore((s) => s.createQuarter);
  const updateQuarter = useDataStore((s) => s.updateQuarter);
  const deleteQuarter = useDataStore((s) => s.deleteQuarter);
  const mutateProject = useDataStore((s) => s.mutateProject);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Quarter | undefined>();
  const [toDelete, setToDelete] = useState<Quarter | undefined>();
  const [viewMode, setViewMode] = useState<QuartersView>(readView);
  const [detail, setDetail] = useState<{ task: Task; project: Project } | null>(null);

  function setQuartersView(next: QuartersView) {
    setViewMode(next);
    try {
      localStorage.setItem("quarters-view-mode", next);
    } catch {
      // ignore
    }
  }

  function openNew() {
    setEditing(undefined);
    setFormOpen(true);
  }
  function openEdit(q: Quarter) {
    setEditing(q);
    setFormOpen(true);
  }

  return (
    <div>
      <PageHeader
        label="Trimestres"
        title="Trimestres"
        description="Agrupa proyectos por trimestre o míralos todos en un calendario de vencimientos."
        actions={
          <>
            <div className="flex items-center rounded-md border border-border/70">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="min-h-11 rounded-r-none px-2.5 sm:min-h-9 sm:px-3"
                aria-label="Vista lista"
                aria-pressed={viewMode === "list"}
                onClick={() => setQuartersView("list")}
              >
                <LayoutGrid className="size-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Lista</span>
              </Button>
              <Button
                variant={viewMode === "calendar" ? "secondary" : "ghost"}
                size="sm"
                className="min-h-11 rounded-l-none border-l border-border/70 px-2.5 sm:min-h-9 sm:px-3"
                aria-label="Vista calendario"
                aria-pressed={viewMode === "calendar"}
                onClick={() => setQuartersView("calendar")}
              >
                <CalendarDays className="size-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Calendario</span>
              </Button>
            </div>
            <Button onClick={openNew}>
              <Plus className="size-4" />
              Nuevo trimestre
            </Button>
          </>
        }
      />

      {viewMode === "calendar" ? (
        <PortfolioCalendarView
          projects={projects}
          quarters={quarters}
          onOpenTask={(taskId, projectId) => {
            const project = projects.find((p) => p.id === projectId);
            const task = project?.tasks.find((t) => t.id === taskId);
            if (project && task) setDetail({ project, task });
          }}
        />
      ) : quarters.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="Aún no hay trimestres"
          description="Crea un trimestre (p. ej. Q3 2026) y asígnale proyectos para ver su progreso agregado."
          action={
            <Button onClick={openNew}>
              <Plus className="size-4" />
              Nuevo trimestre
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quarters.map((q) => {
            const rollup = quarterRollup(q, projects);
            return (
              <EntityCard
                key={q.id}
                title={q.name}
                meta={
                  <Badge variant={quarterStatusVariant[q.status]}>
                    {quarterStatusLabel[q.status]}
                  </Badge>
                }
                onEdit={() => openEdit(q)}
                onDelete={() => setToDelete(q)}
              >
                {q.goal && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{q.goal}</p>
                )}
                {q.startDate && q.endDate && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatRange(q.startDate, q.endDate)}
                  </p>
                )}
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progreso agregado</span>
                    <span>
                      {rollup.done}/{rollup.total} · {rollup.pct}%
                    </span>
                  </div>
                  <Progress value={rollup.pct} />
                </div>
                {rollup.projectCount > 0 ? (
                  <Link
                    to={ROUTES.projectsByQuarter(q.id)}
                    className="mt-3 block text-xs text-primary hover:underline"
                  >
                    {rollup.projectCount}{" "}
                    {rollup.projectCount === 1 ? "proyecto" : "proyectos"} →
                  </Link>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">Sin proyectos aún.</p>
                )}
              </EntityCard>
            );
          })}
        </div>
      )}

      <QuarterFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        quarter={editing}
        onSubmit={(q) => (editing ? updateQuarter(q) : createQuarter(q))}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(undefined)}
        title={`¿Eliminar "${toDelete?.name}"?`}
        description="Los proyectos asociados no se borrarán; quedarán sin trimestre."
        onConfirm={() => toDelete && deleteQuarter(toDelete.id)}
      />

      {detail && (
        <TaskDetailDrawer
          task={
            projects.find((p) => p.id === detail.project.id)?.tasks.find((t) => t.id === detail.task.id) ??
            detail.task
          }
          projectId={detail.project.id}
          areas={(projects.find((p) => p.id === detail.project.id) ?? detail.project).areas}
          people={people}
          sprints={(projects.find((p) => p.id === detail.project.id) ?? detail.project).sprints}
          onUpdate={(updated) => {
            void mutateProject(detail.project.id, (p) => ops.updateTask(p, updated));
            setDetail((prev) => (prev ? { ...prev, task: updated } : prev));
          }}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  );
}
