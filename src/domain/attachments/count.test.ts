import { describe, it, expect } from "vitest";
import { countWorkspaceAttachments } from "./count";
import type { Project } from "@/domain/schemas";
import { SCHEMA_VERSION } from "@/domain/schemas/common";

describe("countWorkspaceAttachments", () => {
  it("suma anexos de proyecto, tareas y productos", () => {
    const project = {
      id: "p1",
      schemaVersion: SCHEMA_VERSION,
      attachments: [{ id: "a1" }],
      areas: [
        {
          id: "ar",
          attachments: [{ id: "a2" }, { id: "a3" }],
          processes: [{ id: "pr", attachments: [{ id: "a4" }] }],
        },
      ],
      tasks: [{ id: "t1", attachments: [{ id: "a5" }] }],
    } as unknown as Project;

    expect(
      countWorkspaceAttachments({
        projects: [project],
        products: [{ id: "prod", attachments: [{ id: "a6" }, { id: "a7" }] } as never],
        processTemplates: [{ id: "tpl", attachments: [] } as never],
      }),
    ).toBe(7);
  });

  it("devuelve 0 sin datos", () => {
    expect(
      countWorkspaceAttachments({ projects: [], products: [], processTemplates: [] }),
    ).toBe(0);
  });
});
