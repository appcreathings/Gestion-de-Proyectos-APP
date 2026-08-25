import { describe, it, expect } from "vitest";
import {
  aggregateChecklistProgress,
  aggregateTaskProgress,
  projectLiveTaskProgress,
  projectTaskProgress,
} from "./compute";
import { newProject, newArea, newChecklist, newItem, newTask } from "./factories";
import type { Project } from "./schemas";

function projectWithChecklistItems(name: string, done: number, total: number): Project {
  const p = newProject(name);
  const area = newArea("Área");
  const checklist = newChecklist("Checklist");
  checklist.items = Array.from({ length: total }, (_, i) => {
    const item = newItem(`Ítem ${i + 1}`);
    item.done = i < done;
    return item;
  });
  area.checklists = [checklist];
  p.areas = [area];
  return p;
}

function projectWithTasks(
  name: string,
  tasks: Array<{ status: "todo" | "doing" | "done"; archived?: boolean }>,
): Project {
  const p = newProject(name);
  p.tasks = tasks.map((t, i) => {
    const task = newTask(`Tarea ${i + 1}`);
    task.status = t.status;
    task.archived = t.archived ?? false;
    return task;
  });
  return p;
}

describe("aggregateTaskProgress (spec 066 D18)", () => {
  it("conjunto vacío → 0/0", () => {
    expect(aggregateTaskProgress([])).toEqual({ done: 0, total: 0, pct: 0 });
  });

  it("dos proyectos 1/2 y 1/2 → 2/4 · 50%", () => {
    const a = projectWithTasks("A", [{ status: "done" }, { status: "todo" }]);
    const b = projectWithTasks("B", [{ status: "done" }, { status: "todo" }]);
    expect(aggregateTaskProgress([a, b])).toEqual({ done: 2, total: 4, pct: 50 });
  });

  it("excluye tareas archivadas del denominador", () => {
    const p = projectWithTasks("A", [
      { status: "done" },
      { status: "todo" },
      { status: "todo", archived: true },
    ]);
    expect(aggregateTaskProgress([p])).toEqual({ done: 1, total: 2, pct: 50 });
  });
});

describe("projectLiveTaskProgress (spec 066 D18)", () => {
  it("1 done + 1 todo + 1 archived-todo → 1/2 · 50%", () => {
    const p = projectWithTasks("A", [
      { status: "done" },
      { status: "todo" },
      { status: "todo", archived: true },
    ]);
    expect(projectLiveTaskProgress(p)).toEqual({ done: 1, total: 2, pct: 50 });
  });

  it("projectTaskProgress sigue contando archivadas (Overview intacto)", () => {
    const p = projectWithTasks("A", [
      { status: "done" },
      { status: "todo" },
      { status: "todo", archived: true },
    ]);
    expect(projectTaskProgress(p)).toEqual({ done: 1, total: 3, pct: 33 });
  });
});

describe("aggregateChecklistProgress ponderado (spec 066 D8, antivanity)", () => {
  it("A 1/1 + B 0/99 → 1/100 · 1%, no la media de porcentajes (50%)", () => {
    const a = projectWithChecklistItems("A", 1, 1);
    const b = projectWithChecklistItems("B", 0, 99);
    const agg = aggregateChecklistProgress([a, b]);
    expect(agg).toEqual({ done: 1, total: 100, pct: 1 });
    const mediaDePct = Math.round((100 + 0) / 2);
    expect(agg.pct).not.toBe(mediaDePct);
  });
});
