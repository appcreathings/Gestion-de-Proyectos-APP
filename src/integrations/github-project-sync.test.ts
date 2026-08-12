import { describe, expect, it } from "vitest";
import { applyPullToProject, buildProjectSyncPlan } from "./github-project-sync";
import { newProject } from "@/domain/factories";

describe("github project metadata sync", () => {
  it("plans pull and push when name and description differ", () => {
    const plan = buildProjectSyncPlan(
      { name: "Local", description: "Local desc" },
      { name: "Remote", description: "Remote desc" },
    );
    expect(plan.pullChanges).toEqual({ name: "Remote", description: "Remote desc" });
    expect(plan.pushChanges).toEqual({ name: "Local", description: "Local desc" });
  });

  it("does not plan name pull when remote name is empty", () => {
    const plan = buildProjectSyncPlan(
      { name: "Local", description: "" },
      { name: "  ", description: "" },
    );
    expect(plan.pullChanges).toEqual({});
  });

  it("applies pull without wiping untouched fields", () => {
    const project = newProject("Old");
    project.description = "keep or replace";
    const next = applyPullToProject(project, { name: "New" });
    expect(next.name).toBe("New");
    expect(next.description).toBe("keep or replace");
    expect(next.tasks).toBe(project.tasks);
  });

  it("applies description pull when provided", () => {
    const project = newProject("A");
    project.description = "old";
    const next = applyPullToProject(project, { description: "new desc" });
    expect(next.description).toBe("new desc");
    expect(next.name).toBe("A");
  });
});
