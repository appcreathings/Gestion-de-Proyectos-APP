import { daysUntil } from "./compute";
import type { Task } from "./schemas";

/** Escala ordenada de urgencia (spec 065 §5). El orden del array ES el
 * contrato: `taskUrgency` devuelve el primer nivel cuya condición se cumple.
 * Sin imports de UI ni clases de CSS (D13) — se testea con objetos planos. */
export type UrgencyLevel =
  | "done"
  | "overdue"
  | "blocked"
  | "soon"
  | "priority"
  | "calm";

/** Días de antelación con los que una fecha empieza a considerarse próxima
 * (incluye el día 0: "vence hoy" es `soon`, no un nivel aparte). */
export const SOON_WINDOW_DAYS = 3;

/** Nivel de urgencia de una tarea: la única fuente de esta regla en la app
 * (spec 065 D5). Primera condición que aplica gana:
 * `done` → `overdue` → `blocked` → `soon` → `priority` → `calm`.
 *
 * Toma solo los tres campos que decide — `Pick` estructural para que chips
 * de calendario (que no son un `Task` completo) también puedan usarla. */
export function taskUrgency(
  task: Pick<Task, "status" | "priority" | "dueDate">,
  now: Date = new Date(),
): UrgencyLevel {
  if (task.status === "done") return "done";

  const d = daysUntil(task.dueDate, now);
  if (d !== null && d < 0) return "overdue";
  if (task.status === "blocked") return "blocked";
  if (d !== null && d >= 0 && d <= SOON_WINDOW_DAYS) return "soon";
  if (task.priority === "high" || task.priority === "critical") {
    return "priority";
  }
  return "calm";
}
