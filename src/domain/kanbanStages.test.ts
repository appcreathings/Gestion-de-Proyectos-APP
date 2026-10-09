import { describe, expect, it } from "vitest";
import { newProject, newTask } from "./factories";
import * as ops from "./projectOps";
import {
  BUILTIN_STAGE_IDS,
  DEFAULT_STAGES,
  STAGE_COLORS,
  boardColumns,
  isBuiltinStageId,
  isDoneStatus,
  neighborStageId,
  nextStageColor,
  normalizeStages,
  stageDotClass,
  stageLabel,
  stageNameError,
} from "./kanbanStages";
import type { KanbanStage } from "./kanbanStages";
import type { Project, Task } from "./schemas";

function task(over: Partial<Task> & Pick<Task, "title">): Task {
  return { ...newTask(over.title), ...over };
}

function project(over: Partial<Project> = {}): Project {
  return { ...newProject("P"), ...over };
}

describe("normalizeStages (spec 073 §4.1)", () => {
  it.each([undefined, [], "no"])("input %j → las cuatro de fábrica en orden", (input) => {
    expect(normalizeStages(input).map((s) => s.id)).toEqual([...BUILTIN_STAGE_IDS]);
  });

  it("inserta un id base faltante con nombre y color de fábrica", () => {
    const input: KanbanStage[] = [
      { id: "todo", name: "Por hacer", color: "slate" },
      { id: "doing", name: "En curso", color: "blue" },
      { id: "done", name: "Hecha", color: "green" },
    ];
    const out = normalizeStages(input);
    expect(out.map((s) => s.id)).toEqual(["todo", "doing", "blocked", "done"]);
    expect(out.find((s) => s.id === "blocked")).toMatchObject({
      name: "Bloqueada",
      color: "amber",
    });
  });

  it("done fuera del final termina último; el resto conserva su orden relativo", () => {
    const input: KanbanStage[] = [
      { id: "done", name: "Hecha", color: "green" },
      { id: "doing", name: "En curso", color: "blue" },
      { id: "todo", name: "Por hacer", color: "slate" },
    ];
    // blocked falta: entra en su índice de fábrica (2). done se mueve al final.
    expect(normalizeStages(input).map((s) => s.id)).toEqual([
      "doing",
      "blocked",
      "todo",
      "done",
    ]);
  });

  it("ids repetidos: gana el primero", () => {
    const input: KanbanStage[] = [
      { id: "todo", name: "Primera", color: "blue" },
      { id: "todo", name: "Segunda", color: "rose" },
    ];
    const out = normalizeStages(input);
    expect(out.filter((s) => s.id === "todo")).toHaveLength(1);
    expect(out.find((s) => s.id === "todo")?.name).toBe("Primera");
  });

  it("color desconocido → slate", () => {
    const input = [{ id: "custom", name: "X", color: "rosa" }];
    expect(normalizeStages(input)[0].color).toBe("slate");
  });

  it("nombre vacío en una base → nombre de fábrica; en una custom → «Etapa»", () => {
    const input: KanbanStage[] = [
      { id: "todo", name: "   ", color: "slate" },
      { id: "custom-1", name: "", color: "rose" },
    ];
    const out = normalizeStages(input);
    expect(out.find((s) => s.id === "todo")?.name).toBe("Por hacer");
    expect(out.find((s) => s.id === "custom-1")?.name).toBe("Etapa");
  });

  it("no muta el array de entrada", () => {
    const input: KanbanStage[] = [
      { id: "done", name: "Hecha", color: "green" },
      { id: "todo", name: "Por hacer", color: "slate" },
    ];
    const snapshot = input.map((s) => ({ ...s }));
    normalizeStages(input);
    expect(input).toEqual(snapshot);
  });
});

describe("nombres y color (spec 073 §4.2)", () => {
  it("stageNameError: recorte y mayúsculas no cuentan; el acento sí", () => {
    const stages: KanbanStage[] = [{ id: "s1", name: "revisión", color: "rose" }];
    expect(stageNameError(stages, "  Revisión ")).toBe("duplicate");
    expect(stageNameError(stages, "Revision")).toBeNull();
  });

  it("stageNameError: vacío o espacios → empty", () => {
    expect(stageNameError([], "")).toBe("empty");
    expect(stageNameError([], "   ")).toBe("empty");
  });

  it("stageNameError ignora la propia etapa al renombrar", () => {
    const stages: KanbanStage[] = [{ id: "s1", name: "Revisión", color: "rose" }];
    expect(stageNameError(stages, "  revisión ", "s1")).toBeNull();
  });

  it("nextStageColor: primera libre; con las ocho usadas → slate", () => {
    expect(nextStageColor(DEFAULT_STAGES)).toBe("rose");
    const all: KanbanStage[] = STAGE_COLORS.map((color, i) => ({
      id: `s${i}`,
      name: `E${i}`,
      color,
    }));
    expect(nextStageColor(all)).toBe("slate");
  });
});

describe("stageLabel / boardColumns / neighborStageId (spec 073 §4.3, §5.1)", () => {
  it("stageLabel: nombre de la etapa, fallback de base, «etapa eliminada»", () => {
    const p = project();
    expect(stageLabel(p, "doing")).toBe("En curso");
    const withCustom = ops.addStage(p, { name: "Revisión", color: "violet" });
    const rev = withCustom.stages.find((s) => s.name === "Revisión")!;
    expect(stageLabel(withCustom, rev.id)).toBe("Revisión");
    expect(stageLabel(withCustom, "desconocido")).toBe("etapa eliminada");
  });

  it("boardColumns: etapas primero, un ghost por status desconocido no archivado, en orden de aparición", () => {
    const p = project({
      tasks: [
        task({ title: "A", status: "custom-x" }),
        task({ title: "B", status: "done" }),
        task({ title: "C", status: "custom-y", archived: true }),
        task({ title: "D", status: "custom-x" }),
        task({ title: "E", status: "custom-y" }),
      ],
    });
    const cols = boardColumns(p);
    expect(cols.filter((c) => !c.ghost).map((c) => c.stage.id)).toEqual([
      "todo",
      "doing",
      "blocked",
      "done",
    ]);
    const ghosts = cols.filter((c) => c.ghost);
    expect(ghosts.map((c) => c.stage.id)).toEqual(["custom-x", "custom-y"]);
    expect(ghosts[0].stage).toEqual({ id: "custom-x", name: "custom-x", color: "slate" });
  });

  it("neighborStageId: vecino según el orden, null en los extremos o con id ausente", () => {
    const p = project();
    expect(neighborStageId(p.stages, "todo", 1)).toBe("doing");
    expect(neighborStageId(p.stages, "doing", -1)).toBe("todo");
    expect(neighborStageId(p.stages, "todo", -1)).toBeNull();
    expect(neighborStageId(p.stages, "done", 1)).toBeNull();
    expect(neighborStageId(p.stages, "no-existe", 1)).toBeNull();
  });
});

describe("helpers base", () => {
  it("isBuiltinStageId e isDoneStatus", () => {
    expect(isBuiltinStageId("done")).toBe(true);
    expect(isBuiltinStageId("custom-1")).toBe(false);
    expect(isDoneStatus("done")).toBe(true);
    expect(isDoneStatus("custom-1")).toBe(false);
  });

  it("stageDotClass devuelve una clase por color", () => {
    expect(stageDotClass("slate")).toBe("bg-muted-foreground");
    expect(stageDotClass("violet")).toBe("bg-violet-500");
  });
});

describe("ops de etapas (spec 073 §4.2)", () => {
  it("addStage inserta antes de done y no mueve las tareas", () => {
    const p = project({ tasks: [task({ title: "A", status: "doing" })] });
    const p2 = ops.addStage(p, { name: "Revisión", color: "violet" });
    const ids = p2.stages.map((s) => s.id);
    expect(ids).toEqual(["todo", "doing", "blocked", expect.any(String), "done"]);
    expect(p2.stages[3].name).toBe("Revisión");
    expect(p2.tasks).toEqual(p.tasks);
  });

  it("addStage rechaza nombre vacío, repetido (sin mayúsculas) y color inválido con la misma referencia", () => {
    const p = project();
    expect(ops.addStage(p, { name: "   ", color: "rose" })).toBe(p);
    expect(ops.addStage(p, { name: "por hacer", color: "rose" })).toBe(p);
    expect(ops.addStage(p, { name: "X", color: "rosa" as never })).toBe(p);
  });

  it("addStage recorta el nombre y rechaza nombres de más de 40", () => {
    const p = project();
    const p2 = ops.addStage(p, { name: "  Revisión  ", color: "rose" });
    expect(p2.stages.find((s) => s.name === "Revisión")).toBeDefined();
    expect(ops.addStage(p, { name: "x".repeat(41), color: "rose" })).toBe(p);
  });

  it("renameStage cambia el nombre y conserva el id y las tareas", () => {
    const doneTask = task({ title: "T", status: "done" });
    const p = project({ tasks: [doneTask] });
    const p2 = ops.renameStage(p, "done", "Listo");
    const done = p2.stages.find((s) => s.id === "done");
    expect(done?.name).toBe("Listo");
    expect(done?.id).toBe("done");
    expect(p2.tasks.find((t) => t.id === doneTask.id)?.status).toBe("done");
  });

  it("renameStage rechaza duplicado (ignorando la propia), vacío e id ausente", () => {
    const p = project();
    expect(ops.renameStage(p, "done", "por hacer")).toBe(p);
    expect(ops.renameStage(p, "done", "  ")).toBe(p);
    expect(ops.renameStage(p, "no-existe", "X")).toBe(p);
    const p2 = ops.renameStage(p, "done", "Listo");
    expect(ops.renameStage(p2, "doing", "LISTO")).toBe(p2);
  });

  it("moveStage(blocked, -1) la deja antes de doing; done no se mueve en ninguna dirección", () => {
    const p = project();
    expect(ops.moveStage(p, "blocked", -1).stages.map((s) => s.id)).toEqual([
      "todo",
      "blocked",
      "doing",
      "done",
    ]);
    expect(ops.moveStage(p, "done", 1)).toBe(p);
    expect(ops.moveStage(p, "done", -1)).toBe(p);
  });

  it("moveStage: la etapa pegada a done no avanza a la derecha; id ausente no cambia nada", () => {
    const p = ops.addStage(project(), { name: "Revisión", color: "violet" });
    const rev = p.stages.find((s) => s.name === "Revisión")!;
    expect(ops.moveStage(p, rev.id, 1)).toBe(p);
    expect(ops.moveStage(p, rev.id, -1).stages.map((s) => s.id)).toEqual([
      "todo",
      "doing",
      rev.id,
      "blocked",
      "done",
    ]);
    expect(ops.moveStage(p, "no-existe", -1)).toBe(p);
  });

  it("recolorStage cambia el color; rechaza color inválido o id ausente", () => {
    const p = project();
    expect(ops.recolorStage(p, "doing", "rose").stages.find((s) => s.id === "doing")?.color).toBe(
      "rose",
    );
    expect(ops.recolorStage(p, "doing", "rosa" as never)).toBe(p);
    expect(ops.recolorStage(p, "no-existe", "rose")).toBe(p);
  });

  it("removeStage de una base devuelve la misma referencia", () => {
    const p = project();
    expect(ops.removeStage(p, "todo")).toBe(p);
    expect(ops.removeStage(p, "done")).toBe(p);
    expect(ops.removeStage(p, "no-existe")).toBe(p);
  });

  it("removeStage de una custom mueve vivas y archivadas a la etapa de la izquierda", () => {
    const p0 = ops.addStage(project(), { name: "Revisión", color: "violet" });
    const rev = p0.stages.find((s) => s.name === "Revisión")!;
    const live = task({ title: "Viva", status: rev.id });
    const archived = task({ title: "Archivada", status: rev.id, archived: true });
    const p = { ...p0, tasks: [live, archived] };

    const p2 = ops.removeStage(p, rev.id);
    expect(p2.stages.map((s) => s.id)).toEqual([...BUILTIN_STAGE_IDS]);
    const moved = p2.tasks.map((t) => ({ status: t.status, archived: t.archived }));
    expect(moved).toEqual([
      { status: "blocked", archived: false },
      { status: "blocked", archived: true },
    ]);
  });

  it("removeStage de una custom primera manda las tareas a la de la derecha", () => {
    const p = project({
      stages: [
        { id: "custom-1", name: "Primera", color: "rose" },
        { id: "todo", name: "Por hacer", color: "slate" },
        { id: "doing", name: "En curso", color: "blue" },
        { id: "blocked", name: "Bloqueada", color: "amber" },
        { id: "done", name: "Hecha", color: "green" },
      ],
      tasks: [task({ title: "A", status: "custom-1" })],
    });
    const p2 = ops.removeStage(p, "custom-1");
    expect(p2.stages.map((s) => s.id)).toEqual([...BUILTIN_STAGE_IDS]);
    expect(p2.tasks[0].status).toBe("todo");
  });

  it("moveStage y removeStage normalizan el resultado", () => {
    const p = project({
      stages: [
        { id: "done", name: "Hecha", color: "green" },
        { id: "doing", name: "En curso", color: "blue" },
      ],
    });
    // done no arranca último: cualquier op válida re-normaliza al final.
    expect(ops.moveStage(p, "doing", -1).stages.map((s) => s.id)).toEqual([
      "todo",
      "doing",
      "blocked",
      "done",
    ]);
  });
});
