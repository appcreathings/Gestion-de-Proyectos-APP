import { describe, expect, it } from "vitest";
import { newProject, newTask } from "./factories";
import { completionDay, stampTaskCompletions } from "./taskCompletion";
import type { Project, Task } from "./schemas";

const NOW = "2026-10-17T12:00:00.000Z";

function proj(tasks: Task[]): Project {
  return { ...newProject("P"), tasks };
}
function task(over: Partial<Task>): Task {
  return { ...newTask("T"), ...over };
}

describe("stampTaskCompletions", () => {
  it("stamps now when a task moves into done", () => {
    const t = task({ status: "doing" });
    const prev = proj([t]);
    const next = proj([{ ...t, status: "done" }]);
    const out = stampTaskCompletions(prev, next, NOW);
    expect(out.tasks[0].completedAt).toBe(NOW);
    expect(out.tasks[0].completedAtEstimated).toBe(false);
  });

  it("stamps a new task created as done", () => {
    const t = task({ status: "done" });
    const next = proj([t]);
    expect(stampTaskCompletions(null, next, NOW).tasks[0].completedAt).toBe(NOW);
    const prev = proj([]);
    expect(stampTaskCompletions(prev, next, NOW).tasks[0].completedAt).toBe(NOW);
  });

  it("keeps an existing close date on unrelated saves", () => {
    const t = task({
      status: "done",
      completedAt: "2026-01-02T10:00:00.000Z",
      completedAtEstimated: true,
    });
    const out = stampTaskCompletions(proj([t]), proj([{ ...t, title: "X" }]), NOW);
    expect(out.tasks[0].completedAt).toBe("2026-01-02T10:00:00.000Z");
    expect(out.tasks[0].completedAtEstimated).toBe(true);
  });

  it("does not stamp an already-done task with null completedAt", () => {
    const t = task({ status: "done", completedAt: null });
    const out = stampTaskCompletions(proj([t]), proj([{ ...t, title: "X" }]), NOW);
    expect(out.tasks[0].completedAt).toBeNull();
  });

  it("clears the close date when a task leaves done", () => {
    const t = task({
      status: "done",
      completedAt: "2026-01-02T10:00:00.000Z",
      completedAtEstimated: true,
    });
    const out = stampTaskCompletions(proj([t]), proj([{ ...t, status: "todo" }]), NOW);
    expect(out.tasks[0].completedAt).toBeNull();
    expect(out.tasks[0].completedAtEstimated).toBe(false);
  });

  it("clears stale dates on a non-done task that was not done before", () => {
    const stale = task({ status: "todo", completedAt: "2026-01-02T10:00:00.000Z" });
    const est = task({ status: "doing", completedAt: null, completedAtEstimated: true });
    const next = proj([stale, est]);
    for (const prev of [null, proj([stale, est]), proj([])]) {
      const out = stampTaskCompletions(prev, next, NOW);
      for (const t of out.tasks) {
        expect(t.completedAt).toBeNull();
        expect(t.completedAtEstimated).toBe(false);
      }
    }
  });

  it("keeps the reference of unchanged tasks when another is stamped", () => {
    const a = task({ status: "doing" });
    const b = task({ status: "todo" });
    const out = stampTaskCompletions(
      proj([a, b]),
      proj([{ ...a, status: "done" }, b]),
      NOW,
    );
    expect(out.tasks[1]).toBe(b);
  });

  it("returns the same object when nothing changes", () => {
    const t = task({ status: "doing" });
    const next = proj([t]);
    expect(stampTaskCompletions(proj([t]), next, NOW)).toBe(next);
  });
});

describe("completionDay", () => {
  it("uses the local day of completedAt", () => {
    const t = task({
      status: "done",
      completedAt: new Date(2026, 9, 16, 23, 30).toISOString(),
    });
    expect(completionDay(t)).toEqual({ day: "2026-10-16", estimated: false });
  });

  it("falls back to updatedAt as estimated", () => {
    const t = task({
      status: "done",
      completedAt: null,
      updatedAt: new Date(2026, 4, 3, 10, 0).toISOString(),
    });
    expect(completionDay(t)).toEqual({ day: "2026-05-03", estimated: true });
  });

  it("returns null for a pending task", () => {
    expect(completionDay(task({ status: "todo" }))).toBeNull();
  });
});
