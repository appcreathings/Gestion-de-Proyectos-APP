import { useMemo } from "react";
import { Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { useDataStore } from "@/store/useDataStore";
import { priorityLabel, priorityVariant } from "@/domain/labels";
import { daysUntil } from "@/domain/compute";
import type { Task, Project } from "@/domain/schemas";

interface TaskWithProject extends Task {
  project: Project;
}

export function DailyStandupPage() {
  const projects = useDataStore((s) => s.projects);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allTasks = useMemo(() => {
    const tasks: TaskWithProject[] = [];
    for (const project of projects) {
      for (const task of project.tasks) {
        if (!task.archived) {
          tasks.push({ ...task, project });
        }
      }
    }
    return tasks;
  }, [projects]);

  const doneRecently = useMemo(() => {
    return allTasks.filter((t) => {
      if (t.status !== "done") return false;
      const updatedAt = new Date(t.updatedAt);
      const diffMs = today.getTime() - updatedAt.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours >= 0 && diffHours <= 24;
    });
  }, [allTasks, today]);

  const forToday = useMemo(() => {
    return allTasks.filter((t) => {
      if (!t.dueDate) return false;
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      return due.getTime() === today.getTime();
    });
  }, [allTasks, today]);

  const blocked = useMemo(() => {
    return allTasks.filter((t) => t.status === "blocked");
  }, [allTasks]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Daily Standup"
        description="Revisa rápidamente qué hiciste ayer, qué harás hoy y qué te bloquea."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold">Hecho recientemente</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">Últimas 24 horas</p>
          {doneRecently.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay tareas completadas recientemente</p>
          ) : (
            <ul className="space-y-3">
              {doneRecently.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Para hoy</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            {today.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          {forToday.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay tareas para hoy</p>
          ) : (
            <ul className="space-y-3">
              {forToday.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold">Bloqueado</h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">Tareas que necesitan atención</p>
          {blocked.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay tareas bloqueadas</p>
          ) : (
            <ul className="space-y-3">
              {blocked.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: TaskWithProject }) {
  const d = daysUntil(task.dueDate);
  const overdue = task.status !== "done" && d !== null && d < 0;

  return (
    <li className="rounded-lg border p-3 hover:bg-accent/50 transition-colors">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-tight">{task.title}</p>
        <Badge variant={priorityVariant[task.priority]} className="text-xs">
          {priorityLabel[task.priority]}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="truncate">{task.project.name}</span>
        {task.areaId && (
          <>
            <span>•</span>
            <span className="truncate">
              {task.project.areas.find((a) => a.id === task.areaId)?.name}
            </span>
          </>
        )}
        {task.dueDate && (
          <>
            <span>•</span>
            <span className={overdue ? "text-red-600 font-medium" : ""}>
              {task.dueDate}
            </span>
          </>
        )}
      </div>
    </li>
  );
}
