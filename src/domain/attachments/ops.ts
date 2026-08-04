import type { Attachment } from "@/domain/schemas/attachment";
import type {
  ChecklistTemplate,
  ProcessTemplate,
  Product,
  Project,
  ProjectType,
} from "@/domain/schemas";
import { classifyFile } from "./allowlist";
import { maxBytesFor, maxCountFor, type AdapterKind } from "./limits";
import {
  attachmentRelativePath,
  safeFileBase,
  type AttachmentParent,
} from "./paths";
import { formatBytes } from "@/lib/formatBytes";

/** Error de validación de anexo (allowlist, cupo, tamaño). */
export class AttachmentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AttachmentValidationError";
  }
}

/**
 * Clasifica el archivo, aplica límites y construye el metadato `Attachment`
 * (sin I/O). Puro y testeable en Node (spec 042 §5.1, T4230/T4233).
 */
export function prepareAttachment(input: {
  file: Pick<File, "name" | "size" | "type">;
  parent: AttachmentParent;
  existingCount: number;
  adapterKind: AdapterKind;
  id: string;
  now: string;
}): Attachment {
  const { file, parent, existingCount, adapterKind, id, now } = input;

  const classified = classifyFile(file as File);
  if (!classified.ok) {
    throw new AttachmentValidationError(classified.reason);
  }

  const maxBytes = maxBytesFor(adapterKind);
  if (file.size > maxBytes) {
    throw new AttachmentValidationError(
      `El archivo supera el límite de ${formatBytes(maxBytes)} (${formatBytes(file.size)}).`,
    );
  }

  const maxCount = maxCountFor(adapterKind);
  if (existingCount >= maxCount) {
    throw new AttachmentValidationError(
      `Esta entidad ya tiene el máximo de ${maxCount} anexos.`,
    );
  }

  const safeBase = safeFileBase(file.name);
  const relativePath = attachmentRelativePath(parent, id, safeBase, classified.ext);

  return {
    id,
    name: file.name,
    ext: classified.ext,
    mimeType: classified.mimeType,
    kind: classified.kind,
    size: file.size,
    relativePath,
    description: "",
    createdAt: now,
    updatedAt: now,
  };
}

/** Prefijo de árbol de blobs a borrar para un parent (cascada HU-05). */
export function attachmentTreePrefix(parent: AttachmentParent): string {
  switch (parent.type) {
    case "project":
      return `attachments/projects/${parent.projectId}`;
    case "area":
      return `attachments/projects/${parent.projectId}/areas/${parent.areaId}`;
    case "process":
      return `attachments/projects/${parent.projectId}/processes/${parent.processId}`;
    case "task":
      return `attachments/projects/${parent.projectId}/tasks/${parent.taskId}`;
    case "product":
      return `attachments/products/${parent.productId}`;
    case "processTemplate":
      return `attachments/process-templates/${parent.templateId}`;
    case "checklistTemplate":
      return `attachments/checklist-templates/${parent.templateId}`;
    case "projectType":
      return `attachments/project-types/${parent.typeId}`;
  }
}

/**
 * Prefijos de subárbol a purgar cuando un `saveProject` elimina áreas,
 * procesos o tareas (design §5.2).
 */
export function removedSubtreePrefixes(prev: Project, next: Project): string[] {
  const prefixes: string[] = [];
  const nextAreaIds = new Set(next.areas.map((a) => a.id));
  const nextTaskIds = new Set(next.tasks.map((t) => t.id));

  for (const area of prev.areas) {
    if (!nextAreaIds.has(area.id)) {
      prefixes.push(
        attachmentTreePrefix({
          type: "area",
          projectId: prev.id,
          areaId: area.id,
        }),
      );
      for (const proc of area.processes) {
        prefixes.push(
          attachmentTreePrefix({
            type: "process",
            projectId: prev.id,
            processId: proc.id,
          }),
        );
      }
      continue;
    }
    const nextArea = next.areas.find((a) => a.id === area.id)!;
    const nextProcIds = new Set(nextArea.processes.map((p) => p.id));
    for (const proc of area.processes) {
      if (!nextProcIds.has(proc.id)) {
        prefixes.push(
          attachmentTreePrefix({
            type: "process",
            projectId: prev.id,
            processId: proc.id,
          }),
        );
      }
    }
  }

  for (const task of prev.tasks) {
    if (!nextTaskIds.has(task.id)) {
      prefixes.push(
        attachmentTreePrefix({
          type: "task",
          projectId: prev.id,
          taskId: task.id,
        }),
      );
    }
  }

  return prefixes;
}

export type AttachmentStateSlice = {
  projects: Project[];
  products: Product[];
  processTemplates: ProcessTemplate[];
  checklistTemplates: ChecklistTemplate[];
  projectTypes: ProjectType[];
};

/**
 * Array vacío **estable** para selectores de Zustand.
 * Devolver `[]` literal en cada lectura hace `Object.is` fallar y React entra
 * en "Maximum update depth exceeded" (useSyncExternalStore).
 */
export const EMPTY_ATTACHMENTS: Attachment[] = [];

export function getAttachmentsFromState(
  parent: AttachmentParent,
  state: AttachmentStateSlice,
): Attachment[] {
  switch (parent.type) {
    case "project": {
      const p = state.projects.find((x) => x.id === parent.projectId);
      return p?.attachments ?? EMPTY_ATTACHMENTS;
    }
    case "area": {
      const p = state.projects.find((x) => x.id === parent.projectId);
      const area = p?.areas.find((a) => a.id === parent.areaId);
      return area?.attachments ?? EMPTY_ATTACHMENTS;
    }
    case "process": {
      const p = state.projects.find((x) => x.id === parent.projectId);
      for (const area of p?.areas ?? []) {
        const proc = area.processes.find((pr) => pr.id === parent.processId);
        if (proc) return proc.attachments ?? EMPTY_ATTACHMENTS;
      }
      return EMPTY_ATTACHMENTS;
    }
    case "task": {
      const p = state.projects.find((x) => x.id === parent.projectId);
      const task = p?.tasks.find((t) => t.id === parent.taskId);
      return task?.attachments ?? EMPTY_ATTACHMENTS;
    }
    case "product": {
      const prod = state.products.find((x) => x.id === parent.productId);
      return prod?.attachments ?? EMPTY_ATTACHMENTS;
    }
    case "processTemplate": {
      const t = state.processTemplates.find((x) => x.id === parent.templateId);
      return t?.attachments ?? EMPTY_ATTACHMENTS;
    }
    case "checklistTemplate": {
      const t = state.checklistTemplates.find((x) => x.id === parent.templateId);
      return t?.attachments ?? EMPTY_ATTACHMENTS;
    }
    case "projectType": {
      const t = state.projectTypes.find((x) => x.id === parent.typeId);
      return t?.attachments ?? EMPTY_ATTACHMENTS;
    }
  }
}

/** Aplica una nueva lista de anexos al contenedor del parent; devuelve la entidad mutada. */
export function withAttachments(
  parent: AttachmentParent,
  nextAttachments: Attachment[],
  state: AttachmentStateSlice,
  now: string,
):
  | { kind: "project"; project: Project }
  | { kind: "product"; product: Product }
  | { kind: "processTemplate"; template: ProcessTemplate }
  | { kind: "checklistTemplate"; template: ChecklistTemplate }
  | { kind: "projectType"; projectType: ProjectType } {
  switch (parent.type) {
    case "project": {
      const p = state.projects.find((x) => x.id === parent.projectId);
      if (!p) throw new AttachmentValidationError("Proyecto no encontrado.");
      return {
        kind: "project",
        project: { ...p, attachments: nextAttachments, updatedAt: now },
      };
    }
    case "area": {
      const p = state.projects.find((x) => x.id === parent.projectId);
      if (!p) throw new AttachmentValidationError("Proyecto no encontrado.");
      const areas = p.areas.map((a) =>
        a.id === parent.areaId
          ? { ...a, attachments: nextAttachments, updatedAt: now }
          : a,
      );
      if (!areas.some((a) => a.id === parent.areaId)) {
        throw new AttachmentValidationError("Área no encontrada.");
      }
      return { kind: "project", project: { ...p, areas, updatedAt: now } };
    }
    case "process": {
      const p = state.projects.find((x) => x.id === parent.projectId);
      if (!p) throw new AttachmentValidationError("Proyecto no encontrado.");
      let found = false;
      const areas = p.areas.map((a) => ({
        ...a,
        processes: a.processes.map((pr) => {
          if (pr.id !== parent.processId) return pr;
          found = true;
          return { ...pr, attachments: nextAttachments, updatedAt: now };
        }),
      }));
      if (!found) throw new AttachmentValidationError("Proceso no encontrado.");
      return { kind: "project", project: { ...p, areas, updatedAt: now } };
    }
    case "task": {
      const p = state.projects.find((x) => x.id === parent.projectId);
      if (!p) throw new AttachmentValidationError("Proyecto no encontrado.");
      const tasks = p.tasks.map((t) =>
        t.id === parent.taskId
          ? { ...t, attachments: nextAttachments, updatedAt: now }
          : t,
      );
      if (!tasks.some((t) => t.id === parent.taskId)) {
        throw new AttachmentValidationError("Tarea no encontrada.");
      }
      return { kind: "project", project: { ...p, tasks, updatedAt: now } };
    }
    case "product": {
      const prod = state.products.find((x) => x.id === parent.productId);
      if (!prod) throw new AttachmentValidationError("Producto no encontrado.");
      return {
        kind: "product",
        product: { ...prod, attachments: nextAttachments, updatedAt: now },
      };
    }
    case "processTemplate": {
      const t = state.processTemplates.find((x) => x.id === parent.templateId);
      if (!t) throw new AttachmentValidationError("Plantilla de proceso no encontrada.");
      return {
        kind: "processTemplate",
        template: { ...t, attachments: nextAttachments, updatedAt: now },
      };
    }
    case "checklistTemplate": {
      const t = state.checklistTemplates.find((x) => x.id === parent.templateId);
      if (!t) throw new AttachmentValidationError("Plantilla de checklist no encontrada.");
      return {
        kind: "checklistTemplate",
        template: { ...t, attachments: nextAttachments, updatedAt: now },
      };
    }
    case "projectType": {
      const t = state.projectTypes.find((x) => x.id === parent.typeId);
      if (!t) throw new AttachmentValidationError("Tipo de proyecto no encontrado.");
      return {
        kind: "projectType",
        projectType: { ...t, attachments: nextAttachments, updatedAt: now },
      };
    }
  }
}
