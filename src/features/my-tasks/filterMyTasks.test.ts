import { describe, it, expect } from "vitest";
import {
  parseMyTasksQuery,
  applyShowDone,
  applyStatus,
  applyFilter,
  clearMyTaskFilters,
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
