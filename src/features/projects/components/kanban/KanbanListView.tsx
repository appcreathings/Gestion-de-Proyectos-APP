import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { daysUntil } from "@/domain/compute";
import { priorityLabel, priorityVariant, taskStatusLabel } from "@/domain/labels";
import type { Area, Person, Task } from "@/domain/schemas";

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
              const d = daysUntil(task.dueDate);
              const overdue = task.status !== "done" && d !== null && d < 0;
              const dueSoon = task.status !== "done" && d !== null && d >= 0 && d <= 3;

              return (
                <tr
                  key={task.id}
                  onClick={() => onOpenDetail(task.id)}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-accent/50",
                    overdue && "bg-red-50 dark:bg-red-950/20",
                    dueSoon && !overdue && "bg-amber-50 dark:bg-amber-950/20",
                  )}
                >
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {taskStatusLabel[task.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {task.status === "blocked" && (
                        <span className="text-red-500 text-xs">🔒</span>
                      )}
                      <span className="text-sm font-medium">{task.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {area && (
                      <Badge variant="secondary" className="text-xs">
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
                      <Badge variant={overdue ? "destructive" : "outline"} className="text-xs">
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
