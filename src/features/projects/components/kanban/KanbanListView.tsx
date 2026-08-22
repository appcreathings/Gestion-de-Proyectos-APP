import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { priorityLabel, priorityVariant, taskStatusLabel } from "@/domain/labels";
import { taskUrgency } from "@/domain/taskUrgency";
import { URGENCY_ARIA, URGENCY_RAIL } from "@/lib/urgencyStyles";
import type { Area, Person, Task } from "@/domain/schemas";
import { WorkTypeBadge } from "./WorkTypeBadge";

interface Props {
  tasks: Task[];
  areas: Area[];
  people: Person[];
  onOpenDetail: (taskId: string) => void;
}

export function KanbanListView({ tasks, areas, people, onOpenDetail }: Props) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border/60 bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Título
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Área
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Prioridad
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Assignee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {tasks.map((task) => {
              const area = areas.find((a) => a.id === task.areaId);
              const assignee = people.find((p) => p.id === task.assigneeId);
              const urgency = taskUrgency(task);
              const rail = URGENCY_RAIL[urgency];
              const urgencyAria = URGENCY_ARIA[urgency];

              return (
                <tr
                  key={task.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Abrir detalle de ${task.title}${urgencyAria ? ` — ${urgencyAria}` : ""}`}
                  onClick={() => onOpenDetail(task.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpenDetail(task.id);
                    }
                  }}
                  className={cn(
                    "cursor-pointer outline-none transition-colors hover:bg-accent/50 focus-visible:bg-accent/50",
                    urgency === "done" && "opacity-70",
                  )}
                >
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {taskStatusLabel[task.status]}
                    </Badge>
                  </td>
                  <td
                    className={cn(
                      // Riel de urgencia de 3 px (spec 065 D6): en una tabla
                      // el borde vive en la celda, no en el tr. Siempre presente
                      // (transparente sin nivel) para que la columna no baile.
                      "border-l-[3px] px-4 py-3",
                      rail ?? "border-l-transparent",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {task.status === "blocked" && (
                        <span className="text-muted-foreground text-xs">🔒</span>
                      )}
                      <WorkTypeBadge workType={task.workType} />
                      <span className="text-sm font-medium">{task.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {area && (
                      <Badge variant="outline" className="text-xs">
                        {area.name}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={priorityVariant[task.priority]} className="text-xs">
                      {priorityLabel[task.priority]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {assignee && (
                      <Badge variant="outline" className="text-xs">
                        {assignee.name}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {tasks.length === 0 && (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          No hay tareas para mostrar
        </div>
      )}
    </div>
  );
}
