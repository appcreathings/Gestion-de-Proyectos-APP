export type AttachmentParent =
  | { type: "project"; projectId: string }
  | { type: "area"; projectId: string; areaId: string }
  | { type: "process"; projectId: string; processId: string }
  | { type: "task"; projectId: string; taskId: string }
  | { type: "product"; productId: string }
  | { type: "processTemplate"; templateId: string };

export function safeFileBase(originalName: string): string {
  let name = originalName;

  const lastDot = name.lastIndexOf(".");
  if (lastDot !== -1) {
    name = name.slice(0, lastDot);
  }

  name = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  name = name.replace(/[^a-z0-9_-]/g, "-");
  name = name.replace(/-+/g, "-");
  name = name.replace(/^-+|-+$/g, "");

  if (name.length === 0) {
    return "file";
  }

  if (name.length > 60) {
    name = name.slice(0, 60);
  }

  return name;
}

export function attachmentRelativePath(
  parent: AttachmentParent,
  attachmentId: string,
  safeBase: string,
  ext: string,
): string {
  const filename = `${attachmentId}__${safeBase}.${ext}`;
  switch (parent.type) {
    case "project":
      return `attachments/projects/${parent.projectId}/project/${filename}`;
    case "area":
      return `attachments/projects/${parent.projectId}/areas/${parent.areaId}/${filename}`;
    case "process":
      return `attachments/projects/${parent.projectId}/processes/${parent.processId}/${filename}`;
    case "task":
      return `attachments/projects/${parent.projectId}/tasks/${parent.taskId}/${filename}`;
    case "product":
      return `attachments/products/${parent.productId}/${filename}`;
    case "processTemplate":
      return `attachments/process-templates/${parent.templateId}/${filename}`;
  }
}

export function assertSafeAttachmentPath(path: string): void {
  const normalized = path.replace(/\\/g, "/");

  if (!normalized.startsWith("attachments/")) {
    throw new Error(`La ruta debe comenzar con "attachments/": ${path}`);
  }

  const segments = normalized.split("/");
  for (const seg of segments) {
    if (seg === "" || seg === "." || seg === "..") {
      throw new Error(`Segmento de ruta inválido en: ${path}`);
    }
  }

  if (normalized.length > 512) {
    throw new Error(`La ruta excede los 512 caracteres: ${path}`);
  }
}