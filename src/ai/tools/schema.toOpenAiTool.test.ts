import { describe, expect, it } from "vitest";
import { z } from "zod";
import { defineTool } from "./types";
import { toOpenAiTool } from "./schema";

describe("toOpenAiTool", () => {
  it("produce shape { type: function, function: { name, description, parameters } } sin $ref", () => {
    const tool = defineTool({
      name: "list_projects",
      description: "Lista proyectos del workspace",
      mode: "read",
      input: z.object({
        query: z.string().optional(),
        limit: z.number().int().optional(),
      }),
      execute: async () => [],
    });

    const out = toOpenAiTool(tool);
    expect(out).toEqual({
      type: "function",
      function: {
        name: "list_projects",
        description: "Lista proyectos del workspace",
        parameters: expect.objectContaining({
          type: "object",
        }),
      },
    });
    const json = JSON.stringify(out);
    expect(json).not.toContain("$ref");
    expect(json).not.toContain("$schema");
  });
});
