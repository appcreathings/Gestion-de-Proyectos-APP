import { describe, it, expect } from "vitest";
import { newProject, newTask, newArea, newQuarter } from "@/domain/factories";
import {
  buildCalendarModel,
  buildPortfolioCalendarModel,
  monthsOverlapping,
  packSprintLanes,
  partitionDayChips,
  sprintsCoveringDay,
  taskMatchesSearch,
  taskMatchesSprintScope,
} from "./buildCalendarItems";
import { weekRangeContaining, monthRangeContaining, eachDay } from "@/lib/dates";

describe("calendar date ranges (spec 053)", () => {
  it("week containing Wednesday is Mon–Sun", () => {
    // 2026-08-12 is Wednesday
    const r = weekRangeContaining("2026-08-12");
    expect(r.start).toBe("2026-08-10");
    expect(r.end).toBe("2026-08-16");
    expect(eachDay(r)).toHaveLength(7);
  });

  it("month range for August 2026", () => {
    const r = monthRangeContaining("2026-08-12");
    expect(r.start).toBe("2026-08-01");
    expect(r.end).toBe("2026-08-31");
  });
});

describe("buildCalendarModel", () => {
  it("includes tasks in range and unscheduled without due", () => {
    const project = newProject("P");
    project.id = "p1";
    const a = newArea("A");
    project.areas = [a];
    const t1 = newTask("In range");
    t1.id = "t1";
    t1.dueDate = "2026-08-12";
    t1.status = "todo";
    const t2 = newTask("No date");
    t2.id = "t2";
    t2.dueDate = null;
    t2.status = "doing";
    const t3 = newTask("Out of range");
    t3.id = "t3";
    t3.dueDate = "2026-09-01";
    project.tasks = [t1, t2, t3];

    const model = buildCalendarModel({
      project,
      range: weekRangeContaining("2026-08-12"),
      sprintScope: "all",
      searchQuery: "",
      areaId: null,
      includeDone: false,
    });

    expect(model.tasks.map((t) => t.id)).toEqual(["t1"]);
    expect(model.unscheduled.map((t) => t.id)).toEqual(["t2"]);
  });

  it("excludes archived and done by default", () => {
    const project = newProject("P");
    const done = newTask("Done");
    done.id = "d1";
    done.dueDate = "2026-08-12";
    done.status = "done";
    const arch = newTask("Arch");
    arch.id = "a1";
    arch.dueDate = "2026-08-12";
    arch.archived = true;
    project.tasks = [done, arch];

    const model = buildCalendarModel({
      project,
      range: weekRangeContaining("2026-08-12"),
      sprintScope: "all",
      searchQuery: "",
      areaId: null,
      includeDone: false,
    });
    expect(model.tasks).toHaveLength(0);
  });

  it("includes sprint bands that intersect range", () => {
    const project = newProject("P");
    project.sprints = [
      {
        id: "s1",
        name: "Sprint 1",
        goal: "",
        startDate: "2026-08-10",
        endDate: "2026-08-23",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    const model = buildCalendarModel({
      project,
      range: weekRangeContaining("2026-08-12"),
      sprintScope: "all",
      searchQuery: "",
      areaId: null,
      includeDone: false,
    });
    expect(model.sprints).toHaveLength(1);
    expect(model.sprints[0].name).toBe("Sprint 1");
  });

  it("taskMatchesSprintScope backlog vs sprint", () => {
    expect(taskMatchesSprintScope({ sprintId: null }, "backlog")).toBe(true);
    expect(taskMatchesSprintScope({ sprintId: "s1" }, "backlog")).toBe(false);
    expect(taskMatchesSprintScope({ sprintId: "s1" }, "s1")).toBe(true);
  });

  it("partitionDayChips", () => {
    expect(partitionDayChips([1, 2, 3, 4], 3)).toEqual({ visible: [1, 2, 3], more: 1 });
  });

  it("taskMatchesSearch looks at title, summary and tags", () => {
    const task = {
      title: "Landing",
      description: "",
      summary: "hero CTA",
      tags: ["seo", "web"],
    };
    expect(taskMatchesSearch(task, "cta")).toBe(true);
    expect(taskMatchesSearch(task, "SEO")).toBe(true);
    expect(taskMatchesSearch(task, "pago")).toBe(false);
  });

  it("packs overlapping sprints into separate lanes", () => {
    const range = weekRangeContaining("2026-08-12");
    const packed = packSprintLanes(
      [
        {
          kind: "sprint",
          id: "s1",
          name: "A",
          start: "2026-08-10",
          end: "2026-08-16",
          status: "active",
          goal: "",
        },
        {
          kind: "sprint",
          id: "s2",
          name: "B",
          start: "2026-08-12",
          end: "2026-08-20",
          status: "planned",
          goal: "",
        },
      ],
      range,
    );
    expect(packed.laneCount).toBe(2);
    expect(new Set(packed.bands.map((b) => b.lane)).size).toBe(2);
    expect(sprintsCoveringDay(packed.bands.map((b) => ({
      kind: "sprint" as const,
      id: b.id,
      name: b.name,
      start: b.start,
      end: b.end,
      status: b.status,
      goal: b.goal,
    })), "2026-08-12")).toHaveLength(2);
  });
});

describe("buildPortfolioCalendarModel", () => {
  it("merges tasks and project dues from every open project", () => {
    const a = newProject("Alpha");
    a.id = "pa";
    a.dueDate = "2026-08-14";
    const t = newTask("Ship");
    t.id = "ta";
    t.dueDate = "2026-08-12";
    a.tasks = [t];

    const b = newProject("Beta");
    b.id = "pb";
    b.status = "done";
    const tb = newTask("Cerrada");
    tb.id = "tb";
    tb.dueDate = "2026-08-12";
    b.tasks = [tb];

    const archived = newProject("Viejo");
    archived.status = "archived";

    const q = newQuarter("Q3 2026");
    q.id = "q3";
    q.startDate = "2026-07-01";
    q.endDate = "2026-09-30";

    const model = buildPortfolioCalendarModel({
      projects: [a, b, archived],
      quarters: [q],
      range: weekRangeContaining("2026-08-12"),
      includeDone: false,
    });

    expect(model.tasks.map((x) => x.id)).toEqual(["ta"]);
    expect(model.tasks[0].projectName).toBe("Alpha");
    expect(model.projectDues.map((d) => d.name)).toEqual(["Alpha"]);
    expect(model.bands.some((band) => band.kind === "quarter" && band.name === "Q3 2026")).toBe(true);
  });

  it("adds a project range band when start and due intersect the range", () => {
    const p = newProject("Rollout");
    p.id = "pr";
    p.startDate = "2026-08-01";
    p.dueDate = "2026-08-31";
    const model = buildPortfolioCalendarModel({
      projects: [p],
      quarters: [],
      range: weekRangeContaining("2026-08-12"),
      includeDone: false,
    });
    expect(model.bands).toEqual([
      expect.objectContaining({ kind: "project", name: "Rollout", start: "2026-08-01" }),
    ]);
  });

  it("monthsOverlapping covers a quarter span", () => {
    const months = monthsOverlapping({ start: "2026-07-01", end: "2026-09-30" });
    expect(months.map((m) => m.start)).toEqual(["2026-07-01", "2026-08-01", "2026-09-01"]);
  });
});
