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

describe("filterAndSortMyTasks filters / groups / options", () => {
  it("date=overdue excludes undated and hidden done", () => {
    const area = newArea("Core");
    const projects = [
      project(
        "Alpha",
        [
          task({ title: "Over", dueDate: "2026-08-15", status: "todo" }),
          task({ title: "Today", dueDate: "2026-08-20", status: "todo" }),
          task({ title: "None", dueDate: null, status: "todo" }),
          task({ title: "DoneOver", dueDate: "2026-08-10", status: "done" }),
        ],
        [area],
      ),
    ];
    const hidden = filterAndSortMyTasks(projects, q({ date: "overdue" }), NOW);
    expect(hidden.rows.map((r) => r.title)).toEqual(["Over"]);

    const shown = filterAndSortMyTasks(
      projects,
      q({ date: "overdue", showDone: true }),
      NOW,
    );
    expect(shown.rows.map((r) => r.title)).toEqual(["DoneOver", "Over"]);
  });

  it("project recorta; unknown id does not recortar", () => {
    const alphaTasks = [task({ title: "A", priority: "high" })];
    const betaTasks = [task({ title: "B", priority: "critical" })];
    const alpha = project("Alpha", alphaTasks);
    const beta = project("Beta", betaTasks);
    const projects = [alpha, beta];

    const cut = filterAndSortMyTasks(projects, q({ projectId: alpha.id }), NOW);
    expect(cut.rows.map((r) => r.title)).toEqual(["A"]);

    const unknown = filterAndSortMyTasks(projects, q({ projectId: "missing" }), NOW);
    expect(unknown.rows.map((r) => r.title)).toEqual(["B", "A"]);
  });

  it("groups: most urgent project's group first; order preserved inside", () => {
    const alpha = project("Alpha", [
      task({ title: "A-low", priority: "low", dueDate: "2026-08-30" }),
    ]);
    const beta = project("Beta", [
      task({ title: "B-crit", priority: "critical", dueDate: "2026-08-15" }),
      task({ title: "B-med", priority: "medium", dueDate: "2026-08-20" }),
    ]);
    const result = filterAndSortMyTasks([alpha, beta], q(), NOW);
    expect(result.rows.map((r) => r.title)).toEqual(["B-crit", "B-med", "A-low"]);
    expect(result.groups.map((g) => g.projectName)).toEqual(["Beta", "Alpha"]);
    expect(result.groups[0].tasks.map((t) => t.title)).toEqual(["B-crit", "B-med"]);
  });

  it("projectOptions omits a project that only has hidden done", () => {
    const alpha = project("Alpha", [task({ title: "Open", status: "todo" })]);
    const beta = project("Beta", [task({ title: "Done", status: "done" })]);
    const hidden = filterAndSortMyTasks([alpha, beta], q(), NOW);
    expect(hidden.projectOptions.map((o) => o.name)).toEqual(["Alpha"]);

    const shown = filterAndSortMyTasks([alpha, beta], q({ showDone: true }), NOW);
    expect(shown.projectOptions.map((o) => o.name)).toEqual(["Alpha", "Beta"]);
  });
});
