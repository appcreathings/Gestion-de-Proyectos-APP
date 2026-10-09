import { nowIso, uuid } from "@/lib/utils";
import type { Project, Task } from "./schemas";

/** Sufijo del título de una copia en el mismo proyecto (spec 074 D5). */
export const COPY_SUFFIX = " (copia)";

/** Agrega « (copia)» una sola vez: duplicar una copia no lo repite. */
export function copyTitle(title: string): string {
  return title.endsWith(COPY_SUFFIX) ? title : `${title}${COPY_SUFFIX}`;
}

export interface CloneTaskOptions {
  /** true = la copia queda en el mismo proyecto (conserva área y sprint). */
  sameProject: boolean;
}

/** Copia el trabajo de una tarea y deja afuera su historia (spec 074 D3–D8).
 * Pura: no lee ni escribe proyectos. Subtareas y links reciben ids nuevos. */
export function cloneTask(task: Task, { sameProject }: CloneTaskOptions): Task {
  const ts = nowIso();
  return {
    ...task,
    id: uuid(),
    title: sameProject ? copyTitle(task.title) : task.title,
    status: "todo",
    archived: false,
    areaId: sameProject ? task.areaId : null,
    sprintId: sameProject ? task.sprintId : null,
    tags: [...task.tags],
    links: task.links.map((l) => ({ ...l, id: uuid(), createdAt: ts, updatedAt: ts })),
    subtasks: task.subtasks.map((s) => ({
      ...s,
      id: uuid(),
      done: false,
      createdAt: ts,
      updatedAt: ts,
    })),
    comments: [],
    attachments: [],
    actualHours: null,
    krCurrent: null,
    sourceItemId: null,
    dedupeKey: null,
    createdAt: ts,
    updatedAt: ts,
  };
}

export interface TaskCopy {
  sourceId: string;
  task: Task;
}

/** Inserta cada copia justo después de su original (spec 074 D9). Si el
 * original ya no está, la copia va al final. */
export function insertTaskCopies(p: Project, copies: TaskCopy[]): Project {
  if (copies.length === 0) return p;
  const bySource = new Map(copies.map((c) => [c.sourceId, c.task]));
  const tasks: Task[] = [];
  for (const t of p.tasks) {
    tasks.push(t);
    const copy = bySource.get(t.id);
    if (copy) {
      tasks.push(copy);
      bySource.delete(t.id);
    }
  }
  tasks.push(...bySource.values());
  return { ...p, tasks };
}

/** Agrega las tareas al final del proyecto destino, en orden (spec 074 D10). */
export function appendTasks(p: Project, tasks: Task[]): Project {
  if (tasks.length === 0) return p;
  return { ...p, tasks: [...p.tasks, ...tasks] };
}
