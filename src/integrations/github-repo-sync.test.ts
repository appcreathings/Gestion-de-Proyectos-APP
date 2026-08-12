import { describe, expect, it } from "vitest";
import { newProject } from "@/domain/factories";
import {
  buildProjectRepoPayload,
  parseProjectRepoPayload,
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
    const payload = buildProjectRepoPayload(project);
    const raw = JSON.stringify(payload);
    const parsed = parseProjectRepoPayload(raw);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.project.name).toBe("Demo");
      expect(parsed.project.description).toBe("Hola");
      expect(parsed.project.id).toBe(project.id);
    }
  });

  it("rejects invalid JSON", () => {
    expect(parseProjectRepoPayload("not-json").ok).toBe(false);
  });
});
