import { describe, expect, it } from "vitest";
import { newProduct, newProject, newTask } from "@/domain/factories";
import type { Project, Task } from "@/domain/schemas";
import {
  buildGanttRows,
  dotTooltip,
  ganttTasks,
  ganttWindow,
  groupDots,
  placeDay,
  placeRange,
  projectBar,
  shiftAnchor,
  type GanttTaskRow,
} from "./ganttModel";
import type { GanttQuery } from "./ganttQuery";

const TODAY = "2026-10-17";
const Q: GanttQuery = { productIds: [], projectIds: [], scale: "quarter", at: null };

function task(title: string, patch: Partial<Task> = {}): Task {
  return { ...newTask(title), ...patch };
}
function doneTask(title: string, iso: string, patch: Partial<Task> = {}): Task {
  return task(title, { status: "done", completedAt: iso, updatedAt: iso, ...patch });
}
function proj(name: string, patch: Partial<Project> = {}): Project {
  return { ...newProject(name), ...patch };
}
const win = () => ganttWindow("quarter", TODAY);

describe("ganttWindow", () => {
  it("quarter window is 13 weeks with the anchor week 7th", () => {
    const w = ganttWindow("quarter", TODAY);
    expect(w.columns).toHaveLength(13);
    expect(w.columns[6].start <= TODAY && TODAY <= w.columns[6].end).toBe(true);
    expect(new Date(w.start + "T00:00:00").getDay()).toBe(1);
    expect(w.totalDays).toBe(91);
  });
  it("month window is 42 days", () => {
    const w = ganttWindow("month", TODAY);
    expect(w.totalDays).toBe(42);
    expect(w.columns).toHaveLength(42);
    expect(w.columns[0].label).toBe(String(Number(w.start.slice(8))));
    expect(w.columns[14].start).toBe("2026-10-12");
  });
  it("year window is 12 months from April", () => {
    const w = ganttWindow("year", TODAY);
    expect(w.start).toBe("2026-04-01");
    expect(w.end).toBe("2027-03-31");
    expect(w.columns).toHaveLength(12);
    expect(w.columns[0].label).toBe("abr");
  });
  it("quarter labels use d mmm of the Monday", () => {
    expect(ganttWindow("quarter", TODAY).columns[6].label).toBe("12 oct");
  });
});

describe("shiftAnchor", () => {
  it("moves one period", () => {
    expect(shiftAnchor("quarter", TODAY, 1)).toBe("2027-01-17");
    expect(shiftAnchor("year", TODAY, -1)).toBe("2025-10-17");
    expect(shiftAnchor("month", "2026-01-31", 1)).toBe("2026-02-28");
  });
});

describe("placeDay / placeRange", () => {
  it("placeDay returns null outside the window", () => {
    const w = win();
    expect(placeDay(w, w.start)).toBe(0);
    expect(placeDay(w, "2000-01-01")).toBeNull();
    expect(placeDay(w, "2099-01-01")).toBeNull();
  });
  it("placeRange clips a bar that overflows the window", () => {
    const w = win();
    expect(placeRange(w, "2000-01-01", "2099-01-01")).toEqual({ left: 0, width: 100 });
    expect(placeRange(w, "2000-01-01", "2000-02-01")).toBeNull();
    const r = placeRange(w, w.start, w.start)!;
    expect(r.left).toBe(0);
    expect(r.width).toBeCloseTo(100 / 91);
  });
});

describe("projectBar", () => {
  it("uses project dates", () => {
    const p = proj("P", { startDate: "2026-08-01", dueDate: "2026-09-01" });
    expect(projectBar(p, [])).toEqual({ start: "2026-08-01", end: "2026-09-01", derived: false });
  });
  it("fills a missing end from tasks", () => {
    const p = proj("P", { startDate: "2026-08-01", dueDate: null });
    const tasks = [
      task("a", { dueDate: "2026-11-30" }),
      doneTask("b", new Date(2026, 11, 2, 12).toISOString()),
    ];
    expect(projectBar(p, tasks)).toEqual({ start: "2026-08-01", end: "2026-12-02", derived: true });
  });
  it("no dates at all returns null", () => {
    expect(projectBar(proj("P"), [])).toBeNull();
  });
  it("swapped dates are ordered", () => {
    const p = proj("P", { startDate: "2026-09-01", dueDate: "2026-08-01" });
    expect(projectBar(p, [])).toEqual({ start: "2026-08-01", end: "2026-09-01", derived: false });
  });
  it("derived range tolerates completion before createdAt", () => {
    const t = doneTask("x", new Date(2026, 0, 5, 12).toISOString(), {
      createdAt: new Date(2026, 1, 1, 12).toISOString(),
    });
    expect(projectBar(proj("P"), [t])).toEqual({ start: "2026-01-05", end: "2026-01-05", derived: true });
  });
});

describe("projectBar with invalid dates (F4)", () => {
  it("skips an unparseable createdAt", () => {
    const p = proj("P", { startDate: null, dueDate: "2026-09-01" });
    const t = task("a", { createdAt: "basura" });
    expect(projectBar(p, [t])).toEqual({ start: "2026-09-01", end: "2026-09-01", derived: true });
  });
  it("skips an unparseable task dueDate", () => {
    const p = proj("P", { startDate: "2026-08-01", dueDate: null });
    const t = task("a", { createdAt: new Date(2026, 7, 2, 12).toISOString(), dueDate: "zzz" });
    // Sin puntas finales válidas la barra cae a su inicio.
    expect(projectBar(p, [t])).toEqual({ start: "2026-08-01", end: "2026-08-01", derived: true });
  });
  it("skips unparseable completedAt and updatedAt", () => {
    const p = proj("P", { startDate: "2026-08-01", dueDate: null });
    const t = doneTask("a", "basura", {
      createdAt: new Date(2026, 7, 3, 12).toISOString(),
      updatedAt: "basura",
    });
    expect(projectBar(p, [t])).toEqual({ start: "2026-08-01", end: "2026-08-01", derived: true });
  });
  it("skips unparseable project dates", () => {
    const p = proj("P", { startDate: "nope", dueDate: "nope" });
    const t = task("a", { createdAt: new Date(2026, 7, 3, 12).toISOString(), dueDate: "2026-08-10" });
    expect(projectBar(p, [t])).toEqual({ start: "2026-08-03", end: "2026-08-10", derived: true });
  });
  it("never yields NaN when everything is invalid", () => {
    const p = proj("P");
    const t = task("a", { createdAt: "basura", dueDate: "basura" });
    expect(projectBar(p, [t])).toBeNull();
  });
});

describe("ganttTasks", () => {
  it("keeps archived done and drops archived pending", () => {
    const keep = task("k");
    const archDone = doneTask("ad", new Date().toISOString(), { archived: true });
    const archPending = task("ap", { archived: true });
    const p = proj("P", { tasks: [keep, archDone, archPending] });
    expect(ganttTasks(p).map((t) => t.title)).toEqual(["k", "ad"]);
  });
});

function rowsFor(tasks: Task[], today = TODAY) {
  const p = proj("P", { tasks });
  return buildGanttRows({
    projects: [p],
    products: [],
    sidebarOrder: {},
    productOrder: [],
    query: { ...Q, projectIds: [p.id] },
    window: win(),
    today,
  })[0];
}

describe("task rows and dots", () => {
  it("pending task past due is overdue", () => {
    const r = rowsFor([task("a", { dueDate: "2026-10-16" }), task("b", { dueDate: TODAY })]);
    expect(r.taskRows.find((x) => x.task.title === "a")!.kind).toBe("overdue");
    expect(r.taskRows.find((x) => x.task.title === "b")!.kind).toBe("pending");
  });
  it("task rows order done, then pending, then undated", () => {
    const r = rowsFor([
      task("undated"),
      task("later", { dueDate: "2026-11-10" }),
      doneTask("d2", new Date(2026, 9, 10, 12).toISOString()),
      task("sooner", { dueDate: "2026-10-20" }),
      doneTask("d1", new Date(2026, 9, 5, 12).toISOString()),
    ]);
    expect(r.taskRows.map((x) => x.task.title)).toEqual(["d1", "d2", "sooner", "later", "undated"]);
    expect(r.taskRows[4].left).toBeNull();
  });
  it("groupDots merges same-day tasks and dotTooltip caps at 5", () => {
    const iso = new Date(2026, 9, 10, 12).toISOString();
    const ts = Array.from({ length: 7 }, (_, i) => doneTask(`t${i}`, iso));
    const r = rowsFor(ts);
    expect(r.dots).toHaveLength(1);
    expect(r.dots[0].tasks).toHaveLength(7);
    expect(dotTooltip(r.dots[0]).split("\n")).toEqual(["t0", "t1", "t2", "t3", "t4", "y 2 más"]);
  });
  it("groupDots separates estimated and skips undated rows", () => {
    const rows: GanttTaskRow[] = [
      { task: task("a"), day: "2026-10-10", kind: "done", estimated: false, left: 10 },
      { task: task("b"), day: "2026-10-10", kind: "done", estimated: true, left: 10 },
      { task: task("c"), day: null, kind: "pending", estimated: false, left: null },
    ];
    expect(groupDots(win(), rows)).toHaveLength(2);
  });
  it("counts done/total over ganttTasks", () => {
    const r = rowsFor([
      doneTask("d", new Date().toISOString()),
      task("p"),
      task("ap", { archived: true }),
      doneTask("ad", new Date().toISOString(), { archived: true }),
    ]);
    expect(r.done).toBe(2);
    expect(r.total).toBe(3);
  });
});

describe("buildGanttRows", () => {
  const build = (
    projects: Project[],
    query: GanttQuery = Q,
    products: ReturnType<typeof newProduct>[] = [],
  ) =>
    buildGanttRows({
      projects,
      products,
      sidebarOrder: {},
      productOrder: [],
      query,
      window: win(),
      today: TODAY,
    });

  it("hides out-of-window projects when no project is chosen", () => {
    const inWin = proj("in", { startDate: "2026-10-01", dueDate: "2026-10-30" });
    const out = proj("out", { startDate: "2020-01-01", dueDate: "2020-02-01" });
    const none = proj("none");
    expect(build([inWin, out, none]).map((r) => r.project.name)).toEqual(["in"]);
  });
  it("shows a chosen project even without dates", () => {
    const none = proj("none");
    const rows = build([none], { ...Q, projectIds: [none.id] });
    expect(rows).toHaveLength(1);
    expect(rows[0].bar).toBeNull();
  });
  it("includes done projects and excludes archived", () => {
    const d = { startDate: "2026-10-01", dueDate: "2026-10-05" };
    const done = proj("done", { ...d, status: "done" });
    const arch = proj("arch", { ...d, status: "archived" });
    expect(build([done, arch]).map((r) => r.project.name)).toEqual(["done"]);
    expect(build([arch], { ...Q, projectIds: [arch.id] })).toHaveLength(0);
  });
  it("combines product and project with AND", () => {
    const prod = newProduct("Prod");
    const d = { startDate: "2026-10-01", dueDate: "2026-10-05" };
    const a = proj("a", { ...d, productId: prod.id });
    const b = proj("b", { ...d, productId: null });
    expect(build([a, b], { ...Q, productIds: [prod.id] }, [prod]).map((r) => r.project.name)).toEqual(["a"]);
    expect(build([a, b], { ...Q, productIds: [prod.id], projectIds: [b.id] }, [prod])).toHaveLength(0);
  });
  it("orders like the sidebar including done projects", () => {
    const d = { startDate: "2026-10-01", dueDate: "2026-10-05" };
    const a = proj("a", d);
    const b = proj("b", { ...d, status: "done" });
    const c = proj("c", d);
    const rows = buildGanttRows({
      projects: [a, b, c],
      products: [],
      productOrder: [],
      sidebarOrder: { __unassigned: [c.id, b.id, a.id] },
      query: Q,
      window: win(),
      today: TODAY,
    });
    expect(rows.map((r) => r.project.name)).toEqual(["c", "b", "a"]);
  });
});
