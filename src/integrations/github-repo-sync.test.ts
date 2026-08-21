import { describe, expect, it } from "vitest";
import { newProject } from "@/domain/factories";
import type { Attachment } from "@/domain/schemas/attachment";
import {
  attachmentRepoPath,
  buildProjectRepoPayload,
  collectProjectAttachments,
  detectPullConflict,
  githubRepoHtmlUrl,
  parseProjectRepoPayload,
  projectForSyncMode,
  projectRepoPath,
} from "./github-repo-sync";

function makeAtt(partial: Partial<Attachment> & Pick<Attachment, "id" | "kind" | "relativePath">): Attachment {
  return {
    name: partial.name ?? "file.pdf",
    ext: partial.ext ?? "pdf",
    mimeType: partial.mimeType ?? "application/pdf",
    size: partial.size ?? 100,
    description: partial.description ?? "",
    createdAt: partial.createdAt ?? "x",
    updatedAt: partial.updatedAt ?? "x",
    id: partial.id,
    kind: partial.kind,
    relativePath: partial.relativePath,
  };
}

describe("github-repo-sync", () => {
  it("builds a safe path under .hito/projects", () => {
    expect(projectRepoPath("abc-123")).toBe(".hito/projects/abc-123.json");
    expect(projectRepoPath("../evil")).toBe(".hito/projects/___evil.json");
  });

  it("maps attachment paths under .hito/attachments", () => {
    expect(attachmentRepoPath("attachments/projects/p1/project/a__doc.pdf")).toBe(
      ".hito/attachments/projects/p1/project/a__doc.pdf",
    );
    expect(() => attachmentRepoPath("evil/path")).toThrow();
    expect(() => attachmentRepoPath("attachments/../secret")).toThrow();
  });

  it("builds github.com repo URL", () => {
    expect(githubRepoHtmlUrl("acme", "hito-data")).toBe("https://github.com/acme/hito-data");
  });

  it("collects attachments from project tree and dedupes", () => {
    const project = newProject("P");
    const shared = makeAtt({
      id: "a1",
      kind: "document",
      relativePath: "attachments/projects/p/project/a1__x.pdf",
    });
    project.attachments = [shared];
    project.tasks = [
      {
        id: "t1",
        title: "T",
        description: "",
        summary: "",
        status: "todo",
        priority: "medium",
        workType: "task",
        krCurrent: null,
        krTarget: null,
        krUnit: "",
        assigneeId: null,
        dueDate: null,
        areaId: null,
        sourceItemId: null,
        sprintId: null,
        tags: [],
        comments: [],
        archived: false,
        estimate: null,
        actualHours: null,
        subtasks: [],
        attachments: [
          shared,
          makeAtt({
            id: "a2",
            kind: "video",
            name: "clip.mp4",
            ext: "mp4",
            mimeType: "video/mp4",
            relativePath: "attachments/projects/p/tasks/t1/a2__clip.mp4",
          }),
        ],
        links: [],
        dedupeKey: null,
        createdAt: "x",
        updatedAt: "x",
      },
    ];
    const all = collectProjectAttachments(project);
    expect(all).toHaveLength(2);
    expect(all.map((a) => a.id).sort()).toEqual(["a1", "a2"]);
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
        workType: "task",
        krCurrent: null,
        krTarget: null,
        krUnit: "",
        assigneeId: null,
        dueDate: null,
        areaId: null,
        sourceItemId: null,
        sprintId: null,
        tags: [],
        comments: [{ id: "c1", authorId: null, text: "hi", createdAt: "x", updatedAt: "x" }],
        archived: false,
        estimate: null,
        actualHours: null,
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
        workType: "task",
        krCurrent: null,
        krTarget: null,
        krUnit: "",
        assigneeId: null,
        dueDate: null,
        areaId: null,
        sourceItemId: null,
        sprintId: null,
        tags: [],
        comments: [{ id: "c1", authorId: null, text: "hi", createdAt: "x", updatedAt: "x" }],
        archived: false,
        estimate: null,
        actualHours: null,
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
