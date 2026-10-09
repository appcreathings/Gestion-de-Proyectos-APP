import type { Project } from "./schemas";

/** Etapas del kanban por proyecto (spec 073). Las cuatro base conservan su id
 * para que avance, flujos e IA sigan sobre `todo` / `doing` / `blocked` /
 * `done`; el nombre visible puede cambiar. Una etapa nueva es trabajo abierto:
 * solo `done` cierra una tarea. */

export const STAGE_COLORS = [
  "slate",
  "blue",
  "amber",
  "green",
  "rose",
  "violet",
  "teal",
  "orange",
] as const;
export type StageColor = (typeof STAGE_COLORS)[number];

export const BUILTIN_STAGE_IDS = ["todo", "doing", "blocked", "done"] as const;
export type BuiltinStageId = (typeof BUILTIN_STAGE_IDS)[number];

export interface KanbanStage {
  id: string;
  name: string;
  color: StageColor;
}

export const DEFAULT_STAGES: KanbanStage[] = [
  { id: "todo", name: "Por hacer", color: "slate" },
  { id: "doing", name: "En curso", color: "blue" },
  { id: "blocked", name: "Bloqueada", color: "amber" },
  { id: "done", name: "Hecha", color: "green" },
];

/** Punto de 8 px del encabezado. Mismas clases en claro y oscuro (spec 073 §8):
 * los tokens soft ya tienen variante oscura; violeta, teal y naranja usan la
 * escala de Tailwind con opacidad. */
const STAGE_DOT: Record<StageColor, string> = {
  slate: "bg-muted-foreground",
  blue: "bg-info-soft-foreground",
  amber: "bg-warning-soft-foreground",
  green: "bg-success-soft-foreground",
  rose: "bg-destructive-soft-foreground",
  violet: "bg-violet-500",
  teal: "bg-teal-500",
  orange: "bg-orange-500",
};

export function isBuiltinStageId(id: string): id is BuiltinStageId {
  return (BUILTIN_STAGE_IDS as readonly string[]).includes(id);
}

/** Terminada = `done` y solo `done` (spec 073 D5). Ni renombrar Hecha ni una
 * etapa custom al final cambian eso. */
export function isDoneStatus(status: string): boolean {
  return status === "done";
}

export function stageDotClass(color: StageColor): string {
  return STAGE_DOT[color];
}

export function foldStageName(name: string): string {
  return name.trim().toLocaleLowerCase("es");
}

/** null = válido. El input de la UI lleva maxLength={40}; la op que guarda es
 * la red de seguridad, no el mensaje. */
export function stageNameError(
  stages: readonly KanbanStage[],
  name: string,
  ignoreId?: string,
): "empty" | "duplicate" | null {
  const folded = foldStageName(name);
  if (!folded) return "empty";
  const taken = stages.some(
    (s) => s.id !== ignoreId && foldStageName(s.name) === folded,
  );
  return taken ? "duplicate" : null;
}

/** Primera clave libre de la paleta; si están las ocho usadas, slate. */
export function nextStageColor(stages: readonly KanbanStage[]): StageColor {
  const used = new Set(stages.map((s) => s.color));
  return STAGE_COLORS.find((c) => !used.has(c)) ?? "slate";
}

const MAX_STAGE_NAME = 40;

/** Pura y copia siempre: no muta el input. La usan la migración y cada
 * operación de guardado (spec 073 §4.1). */
export function normalizeStages(input: unknown): KanbanStage[] {
  if (!Array.isArray(input)) return DEFAULT_STAGES.map((s) => ({ ...s }));

  const byId = new Map<string, KanbanStage>();
  for (const raw of input) {
    if (typeof raw !== "object" || raw === null) continue;
    const rec = raw as Record<string, unknown>;
    if (typeof rec.id !== "string" || rec.id === "") continue;
    if (byId.has(rec.id)) continue; // ids repetidos: gana el primero

    const builtin = isBuiltinStageId(rec.id);
    const factoryName = DEFAULT_STAGES.find((s) => s.id === rec.id)?.name;
    const rawName = typeof rec.name === "string" ? rec.name.trim() : "";
    const fallbackName = builtin ? factoryName ?? "Etapa" : "Etapa";
    const name = (rawName || fallbackName).slice(0, MAX_STAGE_NAME);
    const color = (STAGE_COLORS as readonly string[]).includes(rec.color as string)
      ? (rec.color as StageColor)
      : "slate";
    byId.set(rec.id, { id: rec.id, name, color });
  }

  const stages = [...byId.values()];
  if (stages.length === 0) return DEFAULT_STAGES.map((s) => ({ ...s }));

  // Un id base que falte vuelve en su lugar relativo de fábrica.
  for (const [i, factory] of DEFAULT_STAGES.entries()) {
    if (byId.has(factory.id)) continue;
    stages.splice(Math.min(i, stages.length), 0, { ...factory });
  }

  // Hecha queda siempre última.
  const doneIndex = stages.findIndex((s) => s.id === "done");
  if (doneIndex !== -1 && doneIndex !== stages.length - 1) {
    const [done] = stages.splice(doneIndex, 1);
    if (done) stages.push(done);
  }
  return stages;
}

/** Nombre visible de un status: la etapa del proyecto, el nombre de fábrica si
 * es base, o «etapa eliminada» (spec 073 §4.3). Acepta un proyecto parcial
 * porque también lo usan Mis tareas y el informe, donde el proyecto puede no
 * estar a mano. */
export function stageLabel(
  project: Pick<Project, "stages"> | null | undefined,
  statusId: string,
): string {
  return (
    project?.stages?.find((s) => s.id === statusId)?.name ??
    DEFAULT_STAGES.find((s) => s.id === statusId)?.name ??
    "etapa eliminada"
  );
}

export interface BoardColumn {
  stage: KanbanStage;
  ghost: boolean;
}

/** Columnas del tablero: `project.stages` en orden + un ghost por cada status
 * desconocido de tareas no archivadas, en orden de primera aparición. El ghost
 * no se persiste y su encabezado es el id crudo, no `stageLabel`. */
export function boardColumns(project: Project): BoardColumn[] {
  const columns: BoardColumn[] = (project.stages ?? []).map((stage) => ({
    stage,
    ghost: false,
  }));
  const known = new Set(columns.map((c) => c.stage.id));
  for (const task of project.tasks ?? []) {
    if (task.archived) continue;
    if (known.has(task.status)) continue;
    known.add(task.status);
    columns.push({ stage: { id: task.status, name: task.status, color: "slate" }, ghost: true });
  }
  return columns;
}

/** Vecino dentro de `stages` para las flechas de la tarjeta. No envuelve:
 * fuera de rango o id ausente → null (el botón no se renderiza). */
export function neighborStageId(
  stages: readonly KanbanStage[],
  id: string,
  direction: -1 | 1,
): string | null {
  const index = stages.findIndex((s) => s.id === id);
  const target = index + direction;
  if (index === -1 || target < 0 || target > stages.length - 1) return null;
  return stages[target].id;
}
