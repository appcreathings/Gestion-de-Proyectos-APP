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

  it("keeps the stored close date when a stale copy arrives", () => {
    const t = task({ status: "done", completedAt: "2026-01-02T10:00:00.000Z" });
    const stale = { ...t, completedAt: null, title: "X" };
    const out = stampTaskCompletions(proj([t]), proj([stale]), NOW);
    expect(out.tasks[0].completedAt).toBe("2026-01-02T10:00:00.000Z");
    expect(out.tasks[0].completedAtEstimated).toBe(false);
    expect(out.tasks[0].title).toBe("X");
  });

  it("keeps the stored estimated flag too", () => {
    const t = task({
      status: "done",
      completedAt: "2026-01-02T10:00:00.000Z",
      completedAtEstimated: true,
    });
    const stale = { ...t, completedAt: null, completedAtEstimated: false };
    const out = stampTaskCompletions(proj([t]), proj([stale]), NOW);
    expect(out.tasks[0].completedAt).toBe("2026-01-02T10:00:00.000Z");
    expect(out.tasks[0].completedAtEstimated).toBe(true);
  });

  it("keeps a non-null incoming date on a done task as sent", () => {
    const t = task({ status: "done", completedAt: "2026-01-02T10:00:00.000Z" });
    const edited = { ...t, completedAt: "2026-03-04T10:00:00.000Z" };
    const out = stampTaskCompletions(proj([t]), proj([edited]), NOW);
    expect(out.tasks[0].completedAt).toBe("2026-03-04T10:00:00.000Z");
  });

  it("trustIncoming keeps the close date of a task entering done", () => {
    const t = task({ status: "doing" });
    const remote = {
      ...t,
      status: "done" as const,
      completedAt: "2026-01-02T10:00:00.000Z",
      completedAtEstimated: true,
    };
    const out = stampTaskCompletions(proj([t]), proj([remote]), NOW, {
      trustIncoming: true,
    });
    expect(out.tasks[0].completedAt).toBe("2026-01-02T10:00:00.000Z");
    expect(out.tasks[0].completedAtEstimated).toBe(true);
  });

  it("trustIncoming still stamps now when the incoming date is null", () => {
    const t = task({ status: "doing" });
    const remote = { ...t, status: "done" as const, completedAt: null };
    const out = stampTaskCompletions(proj([t]), proj([remote]), NOW, {
      trustIncoming: true,
    });
    expect(out.tasks[0].completedAt).toBe(NOW);
  });

  it("without trustIncoming a re-close gets now (HU-02)", () => {
    const t = task({ status: "doing" });
    const reclosed = {
      ...t,
      status: "done" as const,
      completedAt: "2026-01-02T10:00:00.000Z",
      completedAtEstimated: true,
    };
    const out = stampTaskCompletions(proj([t]), proj([reclosed]), NOW);
    expect(out.tasks[0].completedAt).toBe(NOW);
    expect(out.tasks[0].completedAtEstimated).toBe(false);
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

  it("propagates completedAtEstimated when completedAt exists", () => {
    const t = task({
      status: "done",
      completedAt: new Date(2026, 9, 16, 23, 30).toISOString(),
      completedAtEstimated: true,
    });
    expect(completionDay(t)).toEqual({ day: "2026-10-16", estimated: true });
  });

  it("falls back to updatedAt as estimated", () => {
    const t = task({
      status: "done",
      completedAt: null,
      updatedAt: new Date(2026, 4, 3, 10, 0).toISOString(),
    });
    expect(completionDay(t)).toEqual({ day: "2026-05-03", estimated: true });
  });

  it("falls back to updatedAt when completedAt is invalid", () => {
    const t = task({
      status: "done",
      completedAt: "no-es-fecha",
      updatedAt: new Date(2026, 4, 3, 10, 0).toISOString(),
    });
    expect(completionDay(t)).toEqual({ day: "2026-05-03", estimated: true });
  });

  it("returns null when both dates are invalid", () => {
    const t = task({ status: "done", completedAt: "basura", updatedAt: "basura" });
    expect(completionDay(t)).toBeNull();
  });

  it("returns null for a pending task", () => {
    expect(completionDay(task({ status: "todo" }))).toBeNull();
  });
});
