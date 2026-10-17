import { todayKey } from "@/lib/dates";
import type { Project, Task } from "./schemas";

/** Opciones de `stampTaskCompletions`. */
export interface StampOptions {
  /** Confía en la fecha de cierre entrante (pull de GitHub, spec 077): una
   * tarea que entra a done con `completedAt` no nulo la conserva. */
  trustIncoming?: boolean;
}

/**
 * Estampa `completedAt` al pasar una tarea a «done» (spec 077 D4).
 * - Entra a done (o nace done): `completedAt = now`, `completedAtEstimated = false`
 *   — salvo `trustIncoming` con fecha entrante no nula, que se conserva.
 * - Cualquier tarea no done: se limpia (`null` / `false`), aunque no viniera de done (D4 c).
 * - Ya estaba done: se conservan los campos como vienen en `next`; si `next`
 *   trae `completedAt` null y `prev` tenía fecha, se conservan los de `prev`
 *   (una copia vieja nunca borra un cierre). Una done sin fecha sigue sin fecha.
 * Solo copia el proyecto y las tareas que cambian; si nada cambia devuelve `next`.
 */
export function stampTaskCompletions(
  prev: Project | null,
  next: Project,
  now: string,
  options?: StampOptions,
): Project {
  const before = new Map<string, Task>();
  for (const t of prev?.tasks ?? []) before.set(t.id, t);

  let changed = false;
  const tasks = next.tasks.map((t) => {
    const old = before.get(t.id);
    const wasDone = old?.status === "done";
    const isDone = t.status === "done";
    if (isDone && !wasDone) {
      if (options?.trustIncoming && t.completedAt !== null) return t;
      changed = true;
      return { ...t, completedAt: now, completedAtEstimated: false };
    }
    if (isDone && old?.status === "done" && t.completedAt === null && old.completedAt !== null) {
      changed = true;
      return {
        ...t,
        completedAt: old.completedAt,
        completedAtEstimated: old.completedAtEstimated,
      };
    }
    if (!isDone && (t.completedAt !== null || t.completedAtEstimated)) {
      changed = true;
      return { ...t, completedAt: null, completedAtEstimated: false };
    }
    return t;
  });
  return changed ? { ...next, tasks } : next;
}

/** Día local de una fecha ISO, o `null` si no se puede interpretar. */
function validDay(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : todayKey(d);
}

/**
 * Día local de cierre de una tarea hecha (spec 077 D8). Usa `completedAt`;
 * si falta o es inválida, cae a `updatedAt` marcado como estimado. `null` si no
 * está done o ninguna fecha es válida.
 */
export function completionDay(
  task: Task,
): { day: string; estimated: boolean } | null {
  if (task.status !== "done") return null;
  // Fechas ilegibles se saltan: nunca «NaN-NaN-NaN» (spec 077 F4).
  const closed = validDay(task.completedAt);
  if (closed) return { day: closed, estimated: task.completedAtEstimated };
  const updated = validDay(task.updatedAt);
  return updated ? { day: updated, estimated: true } : null;
}
