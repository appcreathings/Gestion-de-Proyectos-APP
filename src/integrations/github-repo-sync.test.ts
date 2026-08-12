import { describe, expect, it } from "vitest";
import { newProject } from "@/domain/factories";
import {
  buildProjectRepoPayload,
  detectPullConflict,
  parseProjectRepoPayload,
  projectForSyncMode,
  projectRepoPath,
} from "./github-repo-sync";

describe("github-repo-sync", () => {
  it("builds a safe path under .hito/projects", () => {
    expect(projectRepoPath("abc-123")).toBe(".hito/projects/abc-123.json");
    expect(projectRepoPath("../evil")).toBe(".hito/projects/___evil.json");
  });

  it("round-trips project JSON payload", () => {
    const project = newProject("Demo");
    project.description = "Hola";
    const payload = buildProjectRepoPayload(project, "medium");
    expect(payload.syncMode).toBe("medium");
    const parsed = parseProjectRepoPayload(JSON.stringify(payload));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.project.name).toBe("Demo");
      expect(parsed.syncMode).toBe("medium");
    }
  });

  it("light mode strips tasks and areas", () => {
    const project = newProject("P");
    project.tasks = [
      {
        id: "t1",
        title: "T",
        description: "",
        summary: "",
        status: "todo",
        priority: "medium",
        assigneeId: null,
        dueDate: null,
        areaId: null,
        sourceItemId: null,
        sprintId: null,
        tags: [],
        comments: [{ id: "c1", authorId: null, text: "hi", createdAt: "x", updatedAt: "x" }],
        archived: false,
        estimate: null,
        subtasks: [],
        attachments: [],
        links: [],
        dedupeKey: null,
        createdAt: "x",
        updatedAt: "x",
      },
    ];
    const light = projectForSyncMode(project, "light");
    expect(light.tasks).toHaveLength(0);
    expect(light.areas).toHaveLength(0);
  });

  it("medium mode keeps tasks but drops comments", () => {
    const project = newProject("P");
    project.tasks = [
      {
        id: "t1",
        title: "T",
        description: "d",
        summary: "",
        status: "todo",
        priority: "medium",
        assigneeId: null,
        dueDate: null,
        areaId: null,
        sourceItemId: null,
        sprintId: null,
        tags: [],
        comments: [{ id: "c1", authorId: null, text: "hi", createdAt: "x", updatedAt: "x" }],
        archived: false,
        estimate: null,
        subtasks: [],
        attachments: [],
        links: [],
        dedupeKey: null,
        createdAt: "x",
        updatedAt: "x",
      },
    ];
    const medium = projectForSyncMode(project, "medium");
    expect(medium.tasks).toHaveLength(1);
    expect(medium.tasks[0]!.comments).toHaveLength(0);
  });

  it("detects conflict when both sides changed after last sync", () => {
    const local = newProject("L");
    local.updatedAt = "2026-01-03T00:00:00.000Z";
    const remote = newProject("R");
    remote.updatedAt = "2026-01-04T00:00:00.000Z";
    expect(
      detectPullConflict({
        local,
        remote,
        lastSyncedProjectUpdatedAt: "2026-01-02T00:00:00.000Z",
      }),
    ).toBe(true);
  });

  it("no conflict on first pull without lastSynced", () => {
    const local = newProject("L");
    local.updatedAt = "2026-01-03T00:00:00.000Z";
    const remote = newProject("R");
    remote.updatedAt = "2026-01-04T00:00:00.000Z";
    expect(detectPullConflict({ local, remote, lastSyncedProjectUpdatedAt: null })).toBe(false);
  });

  it("rejects invalid JSON", () => {
    expect(parseProjectRepoPayload("not-json").ok).toBe(false);
  });
});
