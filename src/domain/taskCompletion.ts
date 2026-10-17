import { todayKey } from "@/lib/dates";
import type { Project, Task } from "./schemas";

/**
 * Estampa `completedAt` al pasar una tarea a «done» (spec 077 D4).
 * - Entra a done (o nace done): `completedAt = now`, `completedAtEstimated = false`.
 * - Sale de done: se limpia (`null` / `false`).
 * - Ya estaba done: no se toca (una tarea done sin fecha sigue sin fecha).
 * Solo copia el proyecto y las tareas que cambian; si nada cambia devuelve `next`.
 */
export function stampTaskCompletions(
  prev: Project | null,
  next: Project,
  now: string,
): Project {
  const before = new Map<string, Task>();
  for (const t of prev?.tasks ?? []) before.set(t.id, t);

  let changed = false;
  const tasks = next.tasks.map((t) => {
    const wasDone = before.get(t.id)?.status === "done";
    const isDone = t.status === "done";
    if (isDone && !wasDone) {
      changed = true;
      return { ...t, completedAt: now, completedAtEstimated: false };
    }
    if (!isDone && wasDone && (t.completedAt !== null || t.completedAtEstimated)) {
      changed = true;
      return { ...t, completedAt: null, completedAtEstimated: false };
    }
    return t;
  });
  return changed ? { ...next, tasks } : next;
}

/**
 * Día local de cierre de una tarea hecha (spec 077 D8). Usa `completedAt`;
 * si falta, cae a `updatedAt` marcado como estimado. `null` si no está done.
 */
export function completionDay(
  task: Task,
): { day: string; estimated: boolean } | null {
  if (task.status !== "done") return null;
  if (task.completedAt) {
    return { day: todayKey(new Date(task.completedAt)), estimated: false };
  }
  return { day: todayKey(new Date(task.updatedAt)), estimated: true };
}
