import type {
  ChecklistTemplate,
  ProcessTemplate,
  Product,
  Project,
  ProjectType,
} from "@/domain/schemas";

/** Cuenta anexos en el workspace (metadatos embebidos). Spec 042 §8. */
export function countWorkspaceAttachments(input: {
  projects: Project[];
  products: Product[];
  processTemplates: ProcessTemplate[];
  checklistTemplates?: ChecklistTemplate[];
  projectTypes?: ProjectType[];
}): number {
  let n = 0;
  for (const p of input.projects) {
    n += p.attachments?.length ?? 0;
    for (const a of p.areas) {
      n += a.attachments?.length ?? 0;
      for (const pr of a.processes) n += pr.attachments?.length ?? 0;
    }
    for (const t of p.tasks) n += t.attachments?.length ?? 0;
  }
  for (const prod of input.products) n += prod.attachments?.length ?? 0;
  for (const tpl of input.processTemplates) n += tpl.attachments?.length ?? 0;
  for (const tpl of input.checklistTemplates ?? []) n += tpl.attachments?.length ?? 0;
  for (const t of input.projectTypes ?? []) n += t.attachments?.length ?? 0;
  return n;
}
