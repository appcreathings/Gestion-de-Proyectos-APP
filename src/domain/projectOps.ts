import { nowIso, uuid } from "@/lib/utils";
import type {
  Area,
  Checklist,
  ChecklistItem,
  Process,
  Project,
  Sprint,
  Task,
} from "./schemas";
import {
  STAGE_COLORS,
  isBuiltinStageId,
  normalizeStages,
  stageNameError,
  type StageColor,
} from "./kanbanStages";

/** Pure, immutable update helpers for the aggregated Project document. */

/** Longitud máxima del nombre de una etapa (spec 073 D7). */
const STAGE_NAME_MAX = 40;

function isStageColor(color: unknown): color is StageColor {
  return (STAGE_COLORS as readonly string[]).includes(color as string);
}

function touchArea(a: Area): Area {
  return { ...a, updatedAt: nowIso() };
}

export function addArea(p: Project, area: Area): Project {
  return { ...p, areas: [...p.areas, area] };
}

export function updateArea(p: Project, area: Area): Project {
  return {
    ...p,
    areas: p.areas.map((a) => (a.id === area.id ? touchArea(area) : a)),
  };
}

export function removeArea(p: Project, areaId: string): Project {
  return { ...p, areas: p.areas.filter((a) => a.id !== areaId) };
}

function mapArea(p: Project, areaId: string, fn: (a: Area) => Area): Project {
  return {
    ...p,
    areas: p.areas.map((a) => (a.id === areaId ? touchArea(fn(a)) : a)),
  };
}

export function addProcess(p: Project, areaId: string, proc: Process): Project {
  return mapArea(p, areaId, (a) => ({ ...a, processes: [...a.processes, proc] }));
}

export function updateProcess(p: Project, areaId: string, proc: Process): Project {
  return mapArea(p, areaId, (a) => ({
    ...a,
    processes: a.processes.map((x) =>
      x.id === proc.id ? { ...proc, updatedAt: nowIso() } : x,
    ),
  }));
}

export function removeProcess(p: Project, areaId: string, procId: string): Project {
  return mapArea(p, areaId, (a) => ({
    ...a,
    processes: a.processes.filter((x) => x.id !== procId),
  }));
}

export function addChecklist(p: Project, areaId: string, cl: Checklist): Project {
  return mapArea(p, areaId, (a) => ({ ...a, checklists: [...a.checklists, cl] }));
}

export function removeChecklist(p: Project, areaId: string, clId: string): Project {
  return mapArea(p, areaId, (a) => ({
    ...a,
    checklists: a.checklists.filter((c) => c.id !== clId),
  }));
}

function mapChecklist(
  p: Project,
  areaId: string,
  clId: string,
  fn: (c: Checklist) => Checklist,
): Project {
  return mapArea(p, areaId, (a) => ({
    ...a,
    checklists: a.checklists.map((c) =>
      c.id === clId ? { ...fn(c), updatedAt: nowIso() } : c,
    ),
  }));
}

export function addItem(
  p: Project,
  areaId: string,
  clId: string,
  item: ChecklistItem,
): Project {
  return mapChecklist(p, areaId, clId, (c) => ({ ...c, items: [...c.items, item] }));
}

export function updateItem(
  p: Project,
  areaId: string,
  clId: string,
  item: ChecklistItem,
): Project {
  return mapChecklist(p, areaId, clId, (c) => ({
    ...c,
    items: c.items.map((i) => (i.id === item.id ? item : i)),
  }));
}

export function removeItem(
  p: Project,
  areaId: string,
  clId: string,
  itemId: string,
): Project {
  return mapChecklist(p, areaId, clId, (c) => ({
    ...c,
    items: c.items.filter((i) => i.id !== itemId),
  }));
}

export function addTask(p: Project, task: Task): Project {
  return { ...p, tasks: [...p.tasks, task] };
}

export function updateTask(p: Project, task: Task): Project {
  return {
    ...p,
    tasks: p.tasks.map((t) =>
      t.id === task.id ? { ...task, updatedAt: nowIso() } : t,
    ),
  };
}

export function removeTask(p: Project, taskId: string): Project {
  return { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) };
}

export function addSprint(p: Project, sprint: Sprint): Project {
  return { ...p, sprints: [...p.sprints, sprint] };
}

export function updateSprint(p: Project, sprint: Sprint): Project {
  return {
    ...p,
    sprints: p.sprints.map((s) => (s.id === sprint.id ? { ...sprint, updatedAt: nowIso() } : s)),
  };
}

/** Removing a sprint returns its tasks to the backlog (sprintId = null). */
export function removeSprint(p: Project, sprintId: string): Project {
  return {
    ...p,
    sprints: p.sprints.filter((s) => s.id !== sprintId),
    tasks: p.tasks.map((t) => (t.sprintId === sprintId ? { ...t, sprintId: null } : t)),
  };
}

/** Move a task into a sprint, or back to the backlog when `sprintId` is null. */
export function assignTaskToSprint(
  p: Project,
  taskId: string,
  sprintId: string | null,
): Project {
  return {
    ...p,
    tasks: p.tasks.map((t) =>
      t.id === taskId ? { ...t, sprintId, updatedAt: nowIso() } : t,
    ),
  };
}

/**
 * Reorder the elements whose ids appear in `orderedIds` into that sequence,
 * keeping every other element in its original slot. Ids not present in the
 * array (or duplicated) are ignored. Returns the input array untouched when
 * nothing effectively changes.
 */
function reorderByIds<T extends { id: string }>(arr: T[], orderedIds: string[]): T[] {
  const byId = new Map(arr.map((x) => [x.id, x] as const));
  const seen = new Set<string>();
  const validIds = orderedIds.filter((id) => {
    if (!byId.has(id) || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  if (validIds.length < 2) return arr;
  const slots: number[] = [];
  arr.forEach((x, i) => {
    if (seen.has(x.id)) slots.push(i);
  });
  const next = [...arr];
  let changed = false;
  slots.forEach((slot, k) => {
    const el = byId.get(validIds[k])!;
    if (next[slot] !== el) {
      next[slot] = el;
      changed = true;
    }
  });
  return changed ? next : arr;
}

export function reorderChecklistItems(
  p: Project,
  areaId: string,
  clId: string,
  orderedIds: string[],
): Project {
  return mapChecklist(p, areaId, clId, (c) => ({
    ...c,
    items: reorderByIds(c.items, orderedIds),
  }));
}

export function reorderAreas(p: Project, orderedIds: string[]): Project {
  return { ...p, areas: reorderByIds(p.areas, orderedIds) };
}

export function reorderTasks(p: Project, orderedIds: string[]): Project {
  return { ...p, tasks: reorderByIds(p.tasks, orderedIds) };
}

/** Apply a checklist to an existing area (non-destructive: always adds). */
export function applyChecklistToArea(
  p: Project,
  areaId: string,
  checklist: Checklist,
): Project {
  return mapArea(p, areaId, (a) => ({ ...a, checklists: [...a.checklists, checklist] }));
}

/** Apply a process to an existing area (non-destructive: always adds). */
export function applyProcessToArea(
  p: Project,
  areaId: string,
  process: Process,
): Project {
  return mapArea(p, areaId, (a) => ({ ...a, processes: [...a.processes, process] }));
}

// ── Etapas del kanban (spec 073 §4.2) ────────────────────────────────────────
// Devuelven un Project nuevo; si el pedido no es válido, devuelven `p` (misma
// referencia) para que la UI pueda ver que no hubo cambio. El formulario
// valida antes de llamar: la op es la red de seguridad, no el mensaje.

/** Alta de etapa: nombre válido + color de la paleta. Queda insertada justo
 * antes de Hecha, con id uuid. */
export function addStage(
  p: Project,
  { name, color }: { name: string; color: StageColor },
): Project {
  const trimmed = name.trim();
  if (
    stageNameError(p.stages, trimmed) !== null ||
    trimmed.length > STAGE_NAME_MAX ||
    !isStageColor(color)
  ) {
    return p;
  }
  const stages = normalizeStages(p.stages);
  const doneIndex = stages.findIndex((s) => s.id === "done");
  const stage = { id: uuid(), name: trimmed, color };
  stages.splice(doneIndex === -1 ? stages.length : doneIndex, 0, stage);
  return { ...p, stages };
}

/** Renombrar: misma validación de nombre, ignorando la propia etapa. */
export function renameStage(p: Project, id: string, name: string): Project {
  const trimmed = name.trim();
  if (
    stageNameError(p.stages, trimmed, id) !== null ||
    trimmed.length > STAGE_NAME_MAX ||
    !p.stages.some((s) => s.id === id)
  ) {
    return p;
  }
  const stages = normalizeStages(p.stages).map((s) =>
    s.id === id ? { ...s, name: trimmed } : s,
  );
  return { ...p, stages };
}

/** Recolorar: color fuera de la paleta → no cambia. */
export function recolorStage(p: Project, id: string, color: StageColor): Project {
  if (!p.stages.some((s) => s.id === id) || !isStageColor(color)) return p;
  const stages = normalizeStages(p.stages).map((s) =>
    s.id === id ? { ...s, color } : s,
  );
  return { ...p, stages };
}

/** Reordenar de a un paso. `done` no se mueve y ninguna etapa puede quedar
 * después de él; el menú esconde el ítem, la op es la red de seguridad. */
export function moveStage(p: Project, id: string, direction: -1 | 1): Project {
  const stages = normalizeStages(p.stages);
  const index = stages.findIndex((s) => s.id === id);
  const target = index + direction;
  if (
    index === -1 ||
    id === "done" ||
    target < 0 ||
    target > stages.length - 2 // nada puede terminar después de Hecha
  ) {
    return p;
  }
  const next = [...stages];
  [next[index], next[target]] = [next[target], next[index]];
  return { ...p, stages: next };
}

/** Borrar solo una etapa nueva. TODA tarea con ese status —archivada
 * incluida— pasa a la etapa vecina (izquierda, o derecha si era la primera):
 * si quedaran huérfanas, al desarchivar aparecerían en una columna fantasma. */
export function removeStage(p: Project, id: string): Project {
  if (isBuiltinStageId(id)) return p;
  const stages = normalizeStages(p.stages);
  const index = stages.findIndex((s) => s.id === id);
  if (index === -1) return p;
  const destId = stages[index - 1]?.id ?? stages[index + 1].id;
  return {
    ...p,
    stages: stages.filter((s) => s.id !== id),
    tasks: p.tasks.map((t) =>
      t.status === id ? { ...t, status: destId, updatedAt: nowIso() } : t,
    ),
  };
}
