import { describe, it, expect } from "vitest";
import {
  prepareAttachment,
  attachmentTreePrefix,
  removedSubtreePrefixes,
  getAttachmentsFromState,
  withAttachments,
  AttachmentValidationError,
} from "./ops";
import type { Project } from "@/domain/schemas";
import { SCHEMA_VERSION } from "@/domain/schemas/common";

function fakeFile(name: string, size: number, type = ""): File {
  return { name, size, type } as File;
}

function emptyProject(id: string, overrides: Partial<Project> = {}): Project {
  return {
    id,
    schemaVersion: SCHEMA_VERSION,
    name: "P",
    productId: null,
    typeId: null,
    status: "active",
    health: "green",
    ownerId: null,
    quarterId: null,
    startDate: null,
    targetDate: null,
    description: "",
    areas: [],
    tasks: [],
    sprints: [],
    milestones: [],
    attachments: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  } as Project;
}

describe("prepareAttachment", () => {
  const parent = { type: "task" as const, projectId: "p1", taskId: "t1" };
  const now = "2026-08-03T12:00:00.000Z";

  it("construye Attachment con path y kind correctos (filesystem)", () => {
    const att = prepareAttachment({
      file: fakeFile("Acta Kickoff.pdf", 1024, "application/pdf"),
      parent,
      existingCount: 0,
      adapterKind: "filesystem",
      id: "att-1",
      now,
    });
    expect(att.id).toBe("att-1");
    expect(att.ext).toBe("pdf");
    expect(att.kind).toBe("document");
    expect(att.size).toBe(1024);
    expect(att.relativePath).toBe(
      "attachments/projects/p1/tasks/t1/att-1__acta-kickoff.pdf",
    );
    expect(att.createdAt).toBe(now);
  });

  it("rechaza extensión no permitida", () => {
    expect(() =>
      prepareAttachment({
        file: fakeFile("malware.exe", 10),
        parent,
        existingCount: 0,
        adapterKind: "filesystem",
        id: "a",
        now,
      }),
    ).toThrow(AttachmentValidationError);
  });

  it("rechaza archivo sobre el límite de download (5 MB)", () => {
    expect(() =>
      prepareAttachment({
        file: fakeFile("big.pdf", 6 * 1024 * 1024),
        parent,
        existingCount: 0,
        adapterKind: "download",
        id: "a",
        now,
      }),
    ).toThrow(/límite/i);
  });

  it("acepta 6 MB en filesystem (límite 25 MB)", () => {
    const att = prepareAttachment({
      file: fakeFile("big.pdf", 6 * 1024 * 1024),
      parent,
      existingCount: 0,
      adapterKind: "filesystem",
      id: "a",
      now,
    });
    expect(att.size).toBe(6 * 1024 * 1024);
  });

  it("rechaza cuando se alcanza el cupo de entidad", () => {
    expect(() =>
      prepareAttachment({
        file: fakeFile("ok.pdf", 100),
        parent,
        existingCount: 20,
        adapterKind: "download",
        id: "a",
        now,
      }),
    ).toThrow(/máximo/i);
  });
});

describe("attachmentTreePrefix", () => {
  it("project / task / product / processTemplate", () => {
    expect(attachmentTreePrefix({ type: "project", projectId: "p" })).toBe(
      "attachments/projects/p",
    );
    expect(
      attachmentTreePrefix({ type: "task", projectId: "p", taskId: "t" }),
    ).toBe("attachments/projects/p/tasks/t");
    expect(attachmentTreePrefix({ type: "product", productId: "x" })).toBe(
      "attachments/products/x",
    );
    expect(
      attachmentTreePrefix({ type: "processTemplate", templateId: "tpl" }),
    ).toBe("attachments/process-templates/tpl");
  });
});

describe("removedSubtreePrefixes", () => {
  it("detecta tarea y área eliminadas", () => {
    const prev = emptyProject("p1", {
      areas: [
        {
          id: "a1",
          name: "A",
          icon: "folder",
          ownerId: null,
          completed: false,
          processes: [
            {
              id: "pr1",
              name: "Proc",
              description: "",
              steps: [],
              version: 1,
              ownerId: null,
              templateId: null,
              attachments: [],
              createdAt: "2026-01-01T00:00:00.000Z",
              updatedAt: "2026-01-01T00:00:00.000Z",
            },
          ],
          checklists: [],
          attachments: [],
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
      tasks: [
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
          subtasks: [],
          attachments: [],
          links: [],
          dedupeKey: null,
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    });
    const next = emptyProject("p1", { areas: [], tasks: [] });
    const prefixes = removedSubtreePrefixes(prev, next);
    expect(prefixes).toContain("attachments/projects/p1/areas/a1");
    expect(prefixes).toContain("attachments/projects/p1/processes/pr1");
    expect(prefixes).toContain("attachments/projects/p1/tasks/t1");
  });

  it("no emite prefijos si no hay bajas", () => {
    const p = emptyProject("p1");
    expect(removedSubtreePrefixes(p, p)).toEqual([]);
  });
});

describe("getAttachmentsFromState / withAttachments", () => {
  const now = "2026-08-03T12:00:00.000Z";
  const att = {
    id: "att-1",
    name: "x.pdf",
    ext: "pdf",
    mimeType: "application/pdf",
    kind: "document" as const,
    size: 1,
    relativePath: "attachments/projects/p1/tasks/t1/att-1__x.pdf",
    description: "",
    createdAt: now,
    updatedAt: now,
  };

  it("lee y escribe anexos de tarea", () => {
    const project = emptyProject("p1", {
      tasks: [
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
          subtasks: [],
          attachments: [],
          links: [],
          dedupeKey: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
    });
    const state = {
      projects: [project],
      products: [],
      processTemplates: [],
      checklistTemplates: [],
      projectTypes: [],
    };
    expect(
      getAttachmentsFromState(
        { type: "task", projectId: "p1", taskId: "t1" },
        state,
      ),
    ).toEqual([]);

    const result = withAttachments(
      { type: "task", projectId: "p1", taskId: "t1" },
      [att],
      state,
      now,
    );
    expect(result.kind).toBe("project");
    if (result.kind === "project") {
      expect(result.project.tasks[0].attachments).toEqual([att]);
    }
  });
});
