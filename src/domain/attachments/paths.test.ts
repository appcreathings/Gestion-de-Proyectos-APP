import { describe, it, expect } from "vitest";
import {
  safeFileBase,
  attachmentRelativePath,
  assertSafeAttachmentPath,
  type AttachmentParent,
} from "./paths";

describe("safeFileBase", () => {
  it("elimina extensión", () => {
    expect(safeFileBase("documento.pdf")).toBe("documento");
  });

  it("normaliza acentos y diacríticos", () => {
    expect(safeFileBase("Actá Kickóff.pdf")).toBe("acta-kickoff");
  });

  it("reemplaza espacios por guiones", () => {
    expect(safeFileBase("mi archivo.txt")).toBe("mi-archivo");
  });

  it("reemplaza caracteres especiales por guiones", () => {
    expect(safeFileBase("archivo@#$%^&*()+=[]{}|;':\",./<>?.txt")).toBe("archivo");
  });

  it("colapsa múltiples guiones", () => {
    expect(safeFileBase("archivo---con---guiones.txt")).toBe("archivo-con-guiones");
  });

  it("trim de guiones y puntos al inicio/final", () => {
    expect(safeFileBase("--.archivo..--")).toBe("archivo");
  });

  it("límite de 60 caracteres", () => {
    const long = "a".repeat(100);
    expect(safeFileBase(long)).toHaveLength(60);
  });

  it("devuelve 'file' si queda vacío", () => {
    expect(safeFileBase("@#$%")).toBe("file");
  });

  it("conserva underscores y puntos internos", () => {
    expect(safeFileBase("archivo_con.puntos.txt")).toBe("archivo_con-puntos");
  });

  it("rechaza path-like ../x (solo base, no path)", () => {
    expect(safeFileBase("../../etc/passwd")).toBe("file");
  });
});

describe("attachmentRelativePath", () => {
  const projectId = "proj-123";
  const areaId = "area-456";
  const processId = "proc-789";
  const taskId = "task-abc";
  const productId = "prod-def";
  const templateId = "tpl-ghi";
  const attachmentId = "att-xyz";
  const safeBase = "acta-kickoff";
  const ext = "pdf";

  it("project parent genera ruta correcta", () => {
    const parent: AttachmentParent = { type: "project", projectId };
    const path = attachmentRelativePath(parent, attachmentId, safeBase, ext);
    expect(path).toBe(`attachments/projects/${projectId}/project/${attachmentId}__${safeBase}.${ext}`);
  });

  it("area parent genera ruta correcta", () => {
    const parent: AttachmentParent = { type: "area", projectId, areaId };
    const path = attachmentRelativePath(parent, attachmentId, safeBase, ext);
    expect(path).toBe(`attachments/projects/${projectId}/areas/${areaId}/${attachmentId}__${safeBase}.${ext}`);
  });

  it("process parent genera ruta correcta", () => {
    const parent: AttachmentParent = { type: "process", projectId, processId };
    const path = attachmentRelativePath(parent, attachmentId, safeBase, ext);
    expect(path).toBe(`attachments/projects/${projectId}/processes/${processId}/${attachmentId}__${safeBase}.${ext}`);
  });

  it("checklistTemplate parent genera ruta correcta", () => {
    const parent: AttachmentParent = { type: "checklistTemplate", templateId };
    const path = attachmentRelativePath(parent, attachmentId, safeBase, ext);
    expect(path).toBe(
      `attachments/checklist-templates/${templateId}/${attachmentId}__${safeBase}.${ext}`,
    );
  });

  it("projectType parent genera ruta correcta", () => {
    const parent: AttachmentParent = { type: "projectType", typeId: "type-1" };
    const path = attachmentRelativePath(parent, attachmentId, safeBase, ext);
    expect(path).toBe(
      `attachments/project-types/type-1/${attachmentId}__${safeBase}.${ext}`,
    );
  });

  it("task parent genera ruta correcta", () => {
    const parent: AttachmentParent = { type: "task", projectId, taskId };
    const path = attachmentRelativePath(parent, attachmentId, safeBase, ext);
    expect(path).toBe(`attachments/projects/${projectId}/tasks/${taskId}/${attachmentId}__${safeBase}.${ext}`);
  });

  it("product parent genera ruta correcta", () => {
    const parent: AttachmentParent = { type: "product", productId };
    const path = attachmentRelativePath(parent, attachmentId, safeBase, ext);
    expect(path).toBe(`attachments/products/${productId}/${attachmentId}__${safeBase}.${ext}`);
  });

  it("processTemplate parent genera ruta correcta", () => {
    const parent: AttachmentParent = { type: "processTemplate", templateId };
    const path = attachmentRelativePath(parent, attachmentId, safeBase, ext);
    expect(path).toBe(`attachments/process-templates/${templateId}/${attachmentId}__${safeBase}.${ext}`);
  });
});

describe("assertSafeAttachmentPath", () => {
  it("acepta ruta válida", () => {
    expect(() => assertSafeAttachmentPath("attachments/projects/123/tasks/456/att__file.pdf")).not.toThrow();
  });

  it("normaliza backslashes", () => {
    expect(() => assertSafeAttachmentPath("attachments\\projects\\123\\tasks\\456\\att__file.pdf")).not.toThrow();
  });

  it("rechaza ruta sin prefijo attachments/", () => {
    expect(() => assertSafeAttachmentPath("projects/123/tasks/456/att.pdf")).toThrow();
  });

  it("rechaza segmento ..", () => {
    expect(() => assertSafeAttachmentPath("attachments/projects/../tasks/att.pdf")).toThrow();
  });

  it("rechaza segmento .", () => {
    expect(() => assertSafeAttachmentPath("attachments/projects/./tasks/att.pdf")).toThrow();
  });

  it("rechaza segmento vacío", () => {
    expect(() => assertSafeAttachmentPath("attachments/projects//tasks/att.pdf")).toThrow();
  });

  it("rechaza ruta absoluta", () => {
    expect(() => assertSafeAttachmentPath("/attachments/projects/123/tasks/att.pdf")).toThrow();
  });

  it("rechaza ruta > 512 caracteres", () => {
    const longSegment = "a".repeat(500);
    const longPath = `attachments/projects/123/tasks/${longSegment}/att.pdf`;
    expect(() => assertSafeAttachmentPath(longPath)).toThrow();
  });
});