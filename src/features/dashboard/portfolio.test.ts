import { describe, it, expect } from "vitest";
import {
  computePortfolio,
  compareProjectRankingRows,
  healthSentence,
  remainingWorkOf,
  type ProjectRankingRow,
} from "./portfolio";
import { newProject, newArea, newChecklist, newItem, newTask, newPerson } from "@/domain/factories";
import type { Health, Project, Settings } from "@/domain/schemas";

const settings: Settings = {
  theme: "system",
  stalledAfterDays: 14,
  dueSoonDays: 7,
  deriveHealth: false,
};
const now = new Date(2026, 7, 24, 12, 0, 0);

function projectWithChecklistItems(name: string, done: number, total: number, health: Health = "green"): Project {
  const p = newProject(name);
  p.health = health;
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

function row(overrides: Partial<ProjectRankingRow>): ProjectRankingRow {
  return {
    id: overrides.id ?? "x",
    name: overrides.name ?? "X",
    health: overrides.health ?? "green",
    checklist: overrides.checklist ?? { done: 0, total: 0, pct: 0 },
    tasks: overrides.tasks ?? { done: 0, total: 0, pct: 0 },
    remainingWork: overrides.remainingWork ?? 0,
  };
}

describe("computePortfolio — avance dual ponderado (D8/D17)", () => {
  it("antivanity: A checklist 1/1 + B 0/99 → checklistProgress 1/100 · 1%", () => {
    const a = projectWithChecklistItems("A", 1, 1);
    const b = projectWithChecklistItems("B", 0, 99);
    const stats = computePortfolio([a, b], [], settings, now);
    expect(stats.checklistProgress).toEqual({ done: 1, total: 100, pct: 1 });
  });

  it("taskProgress agrega tareas live (sin archivadas)", () => {
    const a = newProject("A");
    const t1 = newTask("Hecha");
    t1.status = "done";
    const t2 = newTask("Pendiente");
    const t3 = newTask("Archivada");
    t3.archived = true;
    a.tasks = [t1, t2, t3];
    const stats = computePortfolio([a], [], settings, now);
    expect(stats.taskProgress).toEqual({ done: 1, total: 2, pct: 50 });
  });

  it("PortfolioStats ya no tiene avgProgress (D8)", () => {
    const stats = computePortfolio([newProject("A")], [], settings, now);
    expect(stats).not.toHaveProperty("avgProgress");
  });
});

describe("computePortfolio — projectRows (D11/D21)", () => {
  it("omite proyectos done y archived", () => {
    const open = newProject("Abierto");
    const done = newProject("Cerrado");
    done.status = "done";
    const archived = newProject("Archivado");
    archived.status = "archived";
    const stats = computePortfolio([open, done, archived], [], settings, now);
    expect(stats.projectRows.map((r) => r.name)).toEqual(["Abierto"]);
  });

  it("rojo con remaining 1 va antes que ámbar con remaining 99", () => {
    const red = projectWithChecklistItems("Rojo", 0, 1, "red");
    const amber = projectWithChecklistItems("Ámbar", 0, 99, "amber");
    const stats = computePortfolio([amber, red], [], settings, now);
    expect(stats.projectRows.map((r) => r.name)).toEqual(["Rojo", "Ámbar"]);
  });

  it("dos rojos: gana el de más remainingWork", () => {
    const r1 = projectWithChecklistItems("R1", 0, 2, "red");
    const r2 = projectWithChecklistItems("R2", 0, 5, "red");
    const stats = computePortfolio([r1, r2], [], settings, now);
    expect(stats.projectRows.map((r) => r.name)).toEqual(["R2", "R1"]);
  });

  it("remaining ignora tareas archivadas: A con 1 live todo va antes que B con 5 archived-todo", () => {
    const a = newProject("A");
    a.health = "red";
    const live = newTask("Live");
    a.tasks = [live];
    const b = newProject("B");
    b.health = "red";
    b.tasks = Array.from({ length: 5 }, () => {
      const t = newTask("Archivada");
      t.archived = true;
      return t;
    });
    const stats = computePortfolio([b, a], [], settings, now);
    const rowA = stats.projectRows.find((r) => r.name === "A");
    const rowB = stats.projectRows.find((r) => r.name === "B");
    expect(rowA?.remainingWork).toBe(1);
    expect(rowB?.remainingWork).toBe(0);
    expect(stats.projectRows.map((r) => r.name)).toEqual(["A", "B"]);
  });

  it("empate de salud y remaining → localeCompare es (Á antes que B)", () => {
    const stats = computePortfolio(
      [projectWithChecklistItems("B", 0, 1), projectWithChecklistItems("Á", 0, 1)],
      [],
      settings,
      now,
    );
    expect(stats.projectRows.map((r) => r.name)).toEqual(["Á", "B"]);
  });

  it("remainingWorkOf suma checklists y tareas restantes", () => {
    expect(
      remainingWorkOf({ done: 1, total: 4, pct: 25 }, { done: 0, total: 2, pct: 0 }),
    ).toBe(5);
  });

  it("comparator: triple empate → 0", () => {
    const a = row({ id: "a", name: "A", health: "red" });
    const b = row({ id: "b", name: "A", health: "red" });
    expect(compareProjectRankingRows(a, b)).toBe(0);
  });
});

describe("computePortfolio — workload (D10)", () => {
  it("hechas y archivadas fuera; estimate solo de vivas no hechas", () => {
    const p = newProject("P");
    const ana = newPerson("Ana");
    const todo = newTask("Pendiente");
    todo.assigneeId = ana.id;
    todo.estimate = 3;
    const done = newTask("Hecha");
    done.assigneeId = ana.id;
    done.status = "done";
    done.estimate = 5;
    p.tasks = [todo, done];
    const stats = computePortfolio([p], [], settings, now, [ana]);
    expect(stats.workload).toEqual([
      { personId: ana.id, personName: "Ana", taskCount: 1, totalEstimate: 3 },
    ]);
  });

  it("persona solo con tareas archivadas no aparece", () => {
    const p = newProject("P");
    const ana = newPerson("Ana");
    const archived = newTask("Archivada");
    archived.assigneeId = ana.id;
    archived.archived = true;
    p.tasks = [archived];
    const stats = computePortfolio([p], [], settings, now, [ana]);
    expect(stats.workload).toEqual([]);
  });
});

describe("computePortfolio — stalled ordenado (D26)", () => {
  it("sale ordenado por updatedAt asc (más viejo primero)", () => {
    const older = newProject("Más viejo");
    older.updatedAt = "2026-07-01T00:00:00.000Z";
    const newer = newProject("Menos viejo");
    newer.updatedAt = "2026-08-01T00:00:00.000Z";
    const stats = computePortfolio([newer, older], [], settings, now);
    expect(stats.stalled.map((p) => p.name)).toEqual(["Más viejo", "Menos viejo"]);
  });
});

describe("computePortfolio — regresión 063", () => {
  it("dueSoon/overdue siguen filtrando y ordenando por días", () => {
    const p = newProject("P");
    const overdue2 = newTask("Vencida hace 2");
    overdue2.dueDate = "2026-08-22";
    const overdue1 = newTask("Vencida hace 1");
    overdue1.dueDate = "2026-08-23";
    const soon = newTask("Por vencer");
    soon.dueDate = "2026-08-26";
    const far = newTask("Lejos");
    far.dueDate = "2026-12-01";
    p.tasks = [soon, far, overdue2, overdue1];
    const stats = computePortfolio([p], [], settings, now);
    expect(stats.overdue.map((r) => r.label)).toEqual(["Vencida hace 2", "Vencida hace 1"]);
    expect(stats.dueSoon.map((r) => r.label)).toEqual(["Por vencer"]);
  });

  it("byProduct trae checklistProgress ponderado del grupo", () => {
    const a = projectWithChecklistItems("A", 1, 2);
    const b = projectWithChecklistItems("B", 0, 2);
    const stats = computePortfolio([a, b], [], settings, now);
    const sin = stats.byProduct.find((r) => r.id === null);
    expect(sin?.checklistProgress).toEqual({ done: 1, total: 4, pct: 25 });
    expect(sin).not.toHaveProperty("avgProgress");
  });
});

describe("healthSentence (D13)", () => {
  it("incluye ceros y pluraliza solo verde/verdes", () => {
    expect(healthSentence({ red: 3, amber: 2, green: 8 })).toBe("3 en rojo · 2 ámbar · 8 verdes");
    expect(healthSentence({ red: 0, amber: 0, green: 1 })).toBe("0 en rojo · 0 ámbar · 1 verde");
  });
});
