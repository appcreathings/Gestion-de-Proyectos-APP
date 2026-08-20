import { describe, it, expect } from "vitest";
import { newArea, newProject, newTask } from "@/domain/factories";
import type { Project, Task } from "@/domain/schemas";
import {
  parseMyTasksQuery,
  applyShowDone,
  applyStatus,
  applyFilter,
  clearMyTaskFilters,
  filterAndSortMyTasks,
  type MyTasksQuery,
} from "./filterMyTasks";

describe("parseMyTasksQuery", () => {
  it("defaults: no person, hide done, priority view, null filters", () => {
    const q = parseMyTasksQuery(new URLSearchParams());
    expect(q).toEqual({
      personId: null,
      status: null,
      priority: null,
      date: null,
      projectId: null,
      showDone: false,
      view: "priority",
    });
  });

  it("reads valid params and treats done=1 / view=project", () => {
    const q = parseMyTasksQuery(
      new URLSearchParams(
        "person=ana&status=doing&priority=critical&date=overdue&project=p1&done=1&view=project",
      ),
    );
    expect(q.personId).toBe("ana");
    expect(q.status).toBe("doing");
    expect(q.priority).toBe("critical");
    expect(q.date).toBe("overdue");
    expect(q.projectId).toBe("p1");
    expect(q.showDone).toBe(true);
    expect(q.view).toBe("project");
  });

  it("ignores invalid status/priority/date and treats other done/view as defaults", () => {
    const q = parseMyTasksQuery(
      new URLSearchParams("status=nope&priority=urgent&date=soon&done=true&view=list"),
    );
    expect(q.status).toBeNull();
    expect(q.priority).toBeNull();
    expect(q.date).toBeNull();
    expect(q.showDone).toBe(false);
    expect(q.view).toBe("priority");
  });
});

describe("URL writers (D7, D11)", () => {
  it("applyStatus(done) also sets done=1", () => {
    const next = applyStatus(new URLSearchParams("person=ana"), "done");
    expect(next.get("status")).toBe("done");
    expect(next.get("done")).toBe("1");
    expect(next.get("person")).toBe("ana");
  });

  it("applyShowDone(false) clears done and status=done", () => {
    const next = applyShowDone(new URLSearchParams("status=done&done=1&priority=high"), false);
    expect(next.get("done")).toBeNull();
    expect(next.get("status")).toBeNull();
    expect(next.get("priority")).toBe("high");
  });

  it("applyShowDone(false) keeps status when it is not done", () => {
    const next = applyShowDone(new URLSearchParams("status=doing&done=1"), false);
    expect(next.get("done")).toBeNull();
    expect(next.get("status")).toBe("doing");
  });

  it("clearMyTaskFilters keeps person, done and view", () => {
    const next = clearMyTaskFilters(
      new URLSearchParams("person=ana&status=todo&priority=high&date=overdue&project=p1&done=1&view=project"),
    );
    expect(next.get("person")).toBe("ana");
    expect(next.get("done")).toBe("1");
    expect(next.get("view")).toBe("project");
    expect(next.get("status")).toBeNull();
    expect(next.get("priority")).toBeNull();
    expect(next.get("date")).toBeNull();
    expect(next.get("project")).toBeNull();
  });

  it("applyFilter deletes the key when value is null; view=priority deletes view", () => {
    const withView = applyFilter(new URLSearchParams(), "view", "project");
    expect(withView.get("view")).toBe("project");
    const flat = applyFilter(withView, "view", null);
    expect(flat.get("view")).toBeNull();
  });
});

const NOW = new Date(2026, 7, 20, 12, 0, 0); // 20 ago 2026 local
const ANA = "ana";

function q(over: Partial<MyTasksQuery> = {}): MyTasksQuery {
  return {
    personId: ANA,
    status: null,
    priority: null,
    date: null,
    projectId: null,
    showDone: false,
    view: "priority",
    ...over,
  };
}

function task(over: Partial<Task> & Pick<Task, "title">): Task {
  return { ...newTask(over.title), assigneeId: ANA, ...over };
}

function project(name: string, tasks: Task[], areas = [newArea("Core")]): Project {
  const p = newProject(name);
  return { ...p, areas, tasks };
}

describe("filterAndSortMyTasks hide-done / archive / sort", () => {
  it("hides done unless showDone; archived never appear", () => {
    const open = task({ title: "Open", status: "todo" });
    const done = task({ title: "Done", status: "done" });
    const archived = task({ title: "Archived", status: "todo", archived: true });
    const projects = [project("Alpha", [open, done, archived])];

    const hidden = filterAndSortMyTasks(projects, q(), NOW);
    expect(hidden.rows.map((r) => r.title)).toEqual(["Open"]);
    expect(hidden.assignedCount).toBe(2); // open + done, not archived
    expect(hidden.totalCount).toBe(1);
    expect(hidden.openCount).toBe(1);

    const shown = filterAndSortMyTasks(projects, q({ showDone: true }), NOW);
    expect(shown.rows.map((r) => r.title).sort()).toEqual(["Done", "Open"]);
    expect(shown.totalCount).toBe(2);
    expect(shown.openCount).toBe(1);
  });

  it("status=done and showDone=false yields empty rows", () => {
    const projects = [project("Alpha", [task({ title: "Done", status: "done" })])];
    const result = filterAndSortMyTasks(projects, q({ status: "done", showDone: false }), NOW);
    expect(result.rows).toEqual([]);
    expect(result.assignedCount).toBe(1);
  });

  it("sorts critical→low, nearer dueDate first, null dates last, title as tiebreak", () => {
    const projects = [
      project("Alpha", [
        task({ title: "M", priority: "medium", dueDate: "2026-08-20" }),
        task({ title: "L", priority: "low", dueDate: "2026-08-15" }),
        task({ title: "H-later", priority: "high", dueDate: "2026-08-30" }),
        task({ title: "H-over", priority: "high", dueDate: "2026-08-15" }),
        task({ title: "C-none", priority: "critical", dueDate: null }),
        task({ title: "C-soon", priority: "critical", dueDate: "2026-08-21" }),
      ]),
    ];
    const titles = filterAndSortMyTasks(projects, q(), NOW).rows.map((r) => r.title);
    expect(titles).toEqual(["C-soon", "C-none", "H-over", "H-later", "M", "L"]);
  });
});
