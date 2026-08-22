import { describe, expect, it } from "vitest";
import { newTask } from "./factories";
import type { Priority, Task, TaskStatus } from "./schemas";
import { SOON_WINDOW_DAYS, taskUrgency } from "./taskUrgency";

const NOW = new Date("2026-08-21T12:00:00.000Z");

function dayOffset(days: number): string {
  const d = new Date(NOW);
  d.setDate(d.getDate() + days);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function task(overrides: {
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string | null;
}): Task {
  const t = newTask("Entrega");
  if (overrides.status) t.status = overrides.status;
  if (overrides.priority) t.priority = overrides.priority;
  t.dueDate = overrides.dueDate ?? null;
  return t;
}

describe("taskUrgency (spec 065 §5)", () => {
  it("done gana aunque la fecha haya pasado", () => {
    expect(taskUrgency(task({ status: "done", dueDate: dayOffset(-7) }), NOW)).toBe("done");
  });

  it("dueDate ayer → overdue", () => {
    expect(taskUrgency(task({ status: "todo", dueDate: dayOffset(-1) }), NOW)).toBe("overdue");
  });

  it("vencida y bloqueada → overdue (el orden gana)", () => {
    expect(taskUrgency(task({ status: "blocked", dueDate: dayOffset(-1) }), NOW)).toBe("overdue");
  });

  it("bloqueada sin fecha → blocked", () => {
    expect(taskUrgency(task({ status: "blocked", dueDate: null }), NOW)).toBe("blocked");
  });

  it("dueDate hoy (daysUntil 0) → soon", () => {
    expect(taskUrgency(task({ dueDate: dayOffset(0) }), NOW)).toBe("soon");
  });

  it("dueDate en 3 días → soon (borde incluido)", () => {
    expect(taskUrgency(task({ dueDate: dayOffset(SOON_WINDOW_DAYS) }), NOW)).toBe("soon");
  });

  it("dueDate en 4 días → priority con prioridad alta, calm con media", () => {
    expect(taskUrgency(task({ priority: "high", dueDate: dayOffset(4) }), NOW)).toBe("priority");
    expect(taskUrgency(task({ priority: "medium", dueDate: dayOffset(4) }), NOW)).toBe("calm");
  });

  it("critical sin fecha → priority", () => {
    expect(taskUrgency(task({ priority: "critical", dueDate: null }), NOW)).toBe("priority");
  });

  it("high sin fecha → priority", () => {
    expect(taskUrgency(task({ priority: "high", dueDate: null }), NOW)).toBe("priority");
  });

  it("medium sin fecha → calm", () => {
    expect(taskUrgency(task({ priority: "medium", dueDate: null }), NOW)).toBe("calm");
  });
});
