import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UserCheck, ChevronDown, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { priorityLabel, priorityVariant, taskStatusLabel, workTypeLabel, WORK_TYPE_OPTIONS } from "@/domain/labels";
import { taskUrgency } from "@/domain/taskUrgency";
import { URGENCY_ARIA, URGENCY_RAIL } from "@/lib/urgencyStyles";
import { useDataStore } from "@/store/useDataStore";
import type { Project, Task } from "@/domain/schemas";
import { TaskDetailDrawer } from "@/features/projects/components/kanban/TaskDetailDrawer";
import { WorkTypeBadge } from "@/features/projects/components/kanban/WorkTypeBadge";
import * as ops from "@/domain/projectOps";
import {
  applyFilter,
  applyShowDone,
  applyStatus,
  clearMyTaskFilters,
  filterAndSortMyTasks,
  parseMyTasksQuery,
  type MyTaskRow,
} from "./filterMyTasks";

export function MyTasksPage() {
  const projects = useDataStore((s) => s.projects);
  const people = useDataStore((s) => s.people);
  const mutate = useDataStore((s) => s.mutateProject);
  const [searchParams, setSearchParams] = useSearchParams();

  const query = useMemo(() => parseMyTasksQuery(searchParams), [searchParams]);
  const selectedPerson = query.personId
    ? people.find((p) => p.id === query.personId) ?? null
    : null;

  useEffect(() => {
    if (query.personId && !selectedPerson) {
      setSearchParams(applyFilter(searchParams, "person", null), { replace: true });
    }
  }, [query.personId, selectedPerson, searchParams, setSearchParams]);

  const result = useMemo(
    () => filterAndSortMyTasks(projects, query, new Date()),
    [projects, query],
  );

  const hasActiveFilters = Boolean(
    query.status || query.priority || query.date || query.projectId || query.workType,
  );

  function commit(next: URLSearchParams) {
    setSearchParams(next, { replace: true });
  }

  const [detailTask, setDetailTask] = useState<MyTaskRow | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  function openDetail(row: MyTaskRow) {
    const project = projects.find((p) => p.id === row.projectId) ?? null;
    setDetailTask(row);
    setDetailProject(project);
  }

  function closeDetail() {
    setDetailTask(null);
    setDetailProject(null);
  }

  function handleUpdateTask(updatedTask: Task) {
    if (!detailProject) return;
    mutate(detailProject.id, (p) => ops.updateTask(p, updatedTask));
    if (updatedTask.status === "done" && !query.showDone) {
      setDetailTask(null);
      setDetailProject(null);
      return;
    }
    const area = detailProject.areas.find((a) => a.id === updatedTask.areaId);
    setDetailTask({
      ...updatedTask,
      projectId: detailProject.id,
      projectName: detailProject.name,
      areaName: area?.name,
    });
  }

  return (
    <div>
      <PageHeader
        label="Mis tareas"
        title="Tareas asignadas"
        description="Vista unificada de todas tus tareas asignadas en todos los proyectos."
      />

      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[12rem] flex-1">
            <label className="mb-1.5 block text-sm font-medium">Persona</label>
            <Select
              value={query.personId ?? ""}
              onChange={(e) => commit(applyFilter(searchParams, "person", e.target.value || null))}
            >
              <option value="">Seleccionar persona...</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Checkbox
              checked={query.showDone}
              onCheckedChange={(c) => commit(applyShowDone(searchParams, c))}
              aria-label="Mostrar hechas"
            />
            Mostrar hechas
          </label>

          <div className="min-w-[9rem] flex-1">
            <label className="mb-1.5 block text-sm font-medium">Estado</label>
            <Select
              value={query.status ?? ""}
              onChange={(e) => commit(applyStatus(searchParams, e.target.value || null))}
            >
              <option value="">Todos</option>
              <option value="todo">Por hacer</option>
              <option value="doing">En curso</option>
              <option value="blocked">Bloqueada</option>
              <option value="done">Hecha</option>
            </Select>
          </div>

          <div className="min-w-[9rem] flex-1">
            <label className="mb-1.5 block text-sm font-medium">Prioridad</label>
            <Select
              value={query.priority ?? ""}
              onChange={(e) => commit(applyFilter(searchParams, "priority", e.target.value || null))}
            >
              <option value="">Todas</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </Select>
          </div>

          <div className="min-w-[11rem] flex-1">
            <label className="mb-1.5 block text-sm font-medium">Vencimiento</label>
            <Select
              value={query.date ?? ""}
              onChange={(e) => commit(applyFilter(searchParams, "date", e.target.value || null))}
            >
              <option value="">Todas</option>
              <option value="overdue">Vencidas</option>
              <option value="due-soon">Por vencer (3 días)</option>
              <option value="this-week">Esta semana</option>
            </Select>
          </div>

          <div className="min-w-[11rem] flex-1">
            <label className="mb-1.5 block text-sm font-medium">Proyecto</label>
            <Select
              value={query.projectId ?? ""}
              onChange={(e) => commit(applyFilter(searchParams, "project", e.target.value || null))}
            >
              <option value="">Todos</option>
              {result.projectOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </Select>
          </div>

          <div className="min-w-[9rem] flex-1">
            <label className="mb-1.5 block text-sm font-medium">Tipo</label>
            <Select
              value={query.workType ?? ""}
              onChange={(e) => commit(applyFilter(searchParams, "workType", e.target.value || null))}
            >
              <option value="">Todas</option>
              {WORK_TYPE_OPTIONS.map((v) => (
                <option key={v} value={v}>{workTypeLabel[v]}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-md border border-border/70">
            <Button
              type="button"
              variant={query.view === "priority" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => commit(applyFilter(searchParams, "view", null))}
            >
              Por prioridad
            </Button>
            <Button
              type="button"
              variant={query.view === "project" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => commit(applyFilter(searchParams, "view", "project"))}
            >
              Por proyecto
            </Button>
          </div>
          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={() => commit(clearMyTaskFilters(searchParams))}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {!query.personId || !selectedPerson ? (
        <EmptyState
          icon={UserCheck}
          title="Selecciona una persona"
          description="Elige una persona del selector superior para ver sus tareas asignadas."
        />
      ) : result.assignedCount === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No hay tareas asignadas"
          description={`No hay tareas asignadas a ${selectedPerson.name}.`}
        />
      ) : result.totalCount === 0 && !hasActiveFilters && !query.showDone ? (
        <EmptyState
          icon={UserCheck}
          title="No hay tareas abiertas"
          description={`Todas las tareas de ${selectedPerson.name} están hechas.`}
          action={
            <Button type="button" size="sm" onClick={() => commit(applyShowDone(searchParams, true))}>
              Mostrar hechas
            </Button>
          }
        />
      ) : result.totalCount === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="Ninguna coincide con los filtros"
          description="Prueba a limpiar los filtros para volver a ver las tareas de esta persona."
          action={
            <Button type="button" size="sm" variant="outline" onClick={() => commit(clearMyTaskFilters(searchParams))}>
              Limpiar filtros
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {query.showDone
              ? `${result.totalCount} tarea${result.totalCount !== 1 ? "s" : ""}`
              : `${result.openCount} abierta${result.openCount !== 1 ? "s" : ""}`}
            {" "}asignada{result.totalCount !== 1 ? "s" : ""} a{" "}
            <span className="font-medium text-foreground">{selectedPerson.name}</span>
          </p>
          {query.view === "project"
            ? result.groups.map((g) => (
                <ProjectTaskGroup
                  key={g.projectId}
                  projectName={g.projectName}
                  tasks={g.tasks}
                  onOpenDetail={openDetail}
                />
              ))
            : (
                <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-background">
                  {result.rows.map((row) => (
                    <TaskRow
                      key={row.id}
                      task={row}
                      showProjectName
                      onClick={() => openDetail(row)}
                    />
                  ))}
                </div>
              )}
        </div>
      )}

      {detailTask && detailProject && (
        <TaskDetailDrawer
          task={detailTask}
          projectId={detailProject.id}
          areas={detailProject.areas}
          people={people}
          sprints={detailProject.sprints}
          onUpdate={handleUpdateTask}
          onClose={closeDetail}
        />
      )}
    </div>
  );
}

function ProjectTaskGroup({
  projectName,
  tasks,
  onOpenDetail,
}: {
  projectName: string;
  tasks: MyTaskRow[];
  onOpenDetail: (t: MyTaskRow) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="rounded-2xl border border-border/70 bg-background">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center gap-3 border-b border-border/60 p-4 text-left hover:bg-accent/50"
      >
        {collapsed ? (
          <ChevronRight className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
        <span className="flex-1 font-semibold">{projectName}</span>
        <Badge variant="secondary">{tasks.length}</Badge>
      </button>
      {!collapsed && (
        <div className="divide-y divide-border/60">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              showProjectName={false}
              onClick={() => onOpenDetail(task)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskRow({
  task,
  onClick,
  showProjectName,
}: {
  task: MyTaskRow;
  onClick: () => void;
  showProjectName: boolean;
}) {
  const urgency = taskUrgency(task);
  const rail = URGENCY_RAIL[urgency];
  const urgencyAria = URGENCY_ARIA[urgency];

  return (
    <button
      onClick={onClick}
      aria-label={`Abrir detalle de ${task.title}${urgencyAria ? ` — ${urgencyAria}` : ""}`}
      className={cn(
        // Riel de urgencia de 3 px (spec 065 D6), sin fondos lavados.
        "flex w-full items-center gap-3 border-l-[3px] p-4 text-left transition-colors hover:bg-accent/50",
        rail ?? "border-l-transparent",
        urgency === "done" && "opacity-70",
      )}
    >
      <WorkTypeBadge workType={task.workType} />
      <Badge variant={priorityVariant[task.priority]} className="text-xs">
        {priorityLabel[task.priority]}
      </Badge>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{task.title}</p>
        {(showProjectName || task.areaName) && (
          <p className="truncate text-xs text-muted-foreground">
            {showProjectName ? task.projectName : null}
            {showProjectName && task.areaName ? " · " : null}
            {task.areaName}
          </p>
        )}
      </div>
      {task.dueDate && (
        <Badge
          variant={
            urgency === "overdue"
              ? "destructive"
              : urgency === "soon"
                ? "warning"
                : "outline"
          }
          className="text-xs"
        >
          {task.dueDate}
        </Badge>
      )}
      <Badge variant="outline" className="text-xs">
        {taskStatusLabel[task.status]}
      </Badge>
    </button>
  );
}
