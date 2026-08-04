import { describe, it, expect } from "vitest";
import { ATTACHMENT_ALLOWLIST, classifyFile } from "./allowlist";

describe("allowlist", () => {
  it("ATTACHMENT_ALLOWLIST tiene todas las extensiones del spec", () => {
    const expectedExtensions = [
      "png", "jpg", "jpeg", "webp", "gif", "svg",
      "pdf", "txt", "md", "csv", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
      "mp4", "webm", "mov",
      "mp3", "wav", "ogg", "m4a",
      "zip",
    ];
    expectedExtensions.forEach((ext) => {
      expect(ATTACHMENT_ALLOWLIST[ext]).toBeDefined();
    });
  });

  it("classifyFile acepta extensión permitida en minúsculas", () => {
    const file = new File(["content"], "test.pdf", { type: "application/pdf" });
    const result = classifyFile(file);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.ext).toBe("pdf");
      expect(result.kind).toBe("document");
      expect(result.mimeType).toBe("application/pdf");
    }
  });

  it("classifyFile acepta extensión permitida en mayúsculas", () => {
    const file = new File(["content"], "TEST.PNG", { type: "" });
    const result = classifyFile(file);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.ext).toBe("png");
      expect(result.kind).toBe("image");
      expect(result.mimeType).toBe("image/png");
    }
  });

  it("classifyFile rechaza extensión no permitida", () => {
    const file = new File(["content"], "test.exe", { type: "" });
    const result = classifyFile(file);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain("no permitida");
    }
  });

  it("classifyFile rechaza archivo sin extensión", () => {
    const file = new File(["content"], "testfile", { type: "" });
    const result = classifyFile(file);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain("no tiene extensión");
    }
  });

  it("classifyFile usa mime de fallback cuando File.type está vacío", () => {
    const file = new File(["content"], "test.docx", { type: "" });
    const result = classifyFile(file);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.mimeType).toBe("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    }
  });

  it("classifyFile prefiere File.type si está presente", () => {
    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
    const result = classifyFile(file);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.mimeType).toBe("image/jpeg");
    }
  });
});