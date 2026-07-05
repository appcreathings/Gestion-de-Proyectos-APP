import type { ToolData } from "@/ai/tools/types";
import { embedText } from "./search";
import { loadEmbeddings, saveEmbeddings, saveMeta } from "./store";
import type { RagEntity, RagEntry, RagProgress } from "./types";

export function makeEntityId(entityType: string, entityId: string): string {
  return `${entityType}:${entityId}`;
}

export function collectEntities(data: ToolData): RagEntity[] {
  const entities: RagEntity[] = [];
  const now = new Date().toISOString();

  for (const product of data.products) {
    const text = [
      `Producto: ${product.name}`,
      product.description && `Descripción: ${product.description}`,
      product.vision && `Visión: ${product.vision}`,
      ...product.objectives.map((o) => `Objetivo: ${o.text}`),
    ]
      .filter(Boolean)
      .join(" — ");

    entities.push({
      id: makeEntityId("product", product.id),
      entityType: "product",
      entityId: product.id,
      text,
      updatedAt: product.updatedAt,
      indexedAt: now,
    });
  }

  for (const project of data.projects) {
    const text = [
      `Proyecto: ${project.name}`,
      project.description && `Descripción: ${project.description}`,
    ]
      .filter(Boolean)
      .join(" — ");

    entities.push({
      id: makeEntityId("project", project.id),
      entityType: "project",
      entityId: project.id,
      text,
      updatedAt: project.updatedAt,
      indexedAt: now,
    });

    for (const task of project.tasks) {
      const taskText = [
        `Tarea: ${task.title}`,
        task.description && `Descripción: ${task.description}`,
      ]
        .filter(Boolean)
        .join(" — ");
      entities.push({
        id: makeEntityId("task", task.id),
        entityType: "task",
        entityId: task.id,
        parentProjectId: project.id,
        text: taskText,
        updatedAt: task.updatedAt,
        indexedAt: now,
      });
    }

    for (const area of project.areas) {
      entities.push({
        id: makeEntityId("area", area.id),
        entityType: "area",
        entityId: area.id,
        parentProjectId: project.id,
        text: `Área: ${area.name}`,
        updatedAt: area.updatedAt,
        indexedAt: now,
      });

      for (const checklist of area.checklists) {
        for (const item of checklist.items) {
          const itemText = [
            `Checklist: ${item.text}`,
            item.notes && `Nota: ${item.notes}`,
          ]
            .filter(Boolean)
            .join(" — ");
          entities.push({
            id: makeEntityId("checklist_item", item.id),
            entityType: "checklist_item",
            entityId: item.id,
            parentProjectId: project.id,
            text: itemText,
            updatedAt: project.updatedAt,
            indexedAt: now,
          });
        }
      }
    }
  }

  for (const person of data.people) {
    const text = [
      `Persona: ${person.name}`,
      person.roleTitle && `Rol: ${person.roleTitle}`,
    ]
      .filter(Boolean)
      .join(" — ");
    entities.push({
      id: makeEntityId("person", person.id),
      entityType: "person",
      entityId: person.id,
      text,
      updatedAt: person.updatedAt,
      indexedAt: now,
    });
  }

  for (const tmpl of data.checklistTemplates) {
    const text = [
      `Plantilla de checklist: ${tmpl.name}`,
      tmpl.category && `Categoría: ${tmpl.category}`,
    ]
      .filter(Boolean)
      .join(" — ");
    entities.push({
      id: makeEntityId("checklist_template", tmpl.id),
      entityType: "checklist_template",
      entityId: tmpl.id,
      text,
      updatedAt: tmpl.updatedAt,
      indexedAt: now,
    });
  }

  for (const tmpl of data.processTemplates) {
    const text = [
      `Plantilla de proceso: ${tmpl.name}`,
      tmpl.description && `Descripción: ${tmpl.description}`,
      tmpl.category && `Categoría: ${tmpl.category}`,
    ]
      .filter(Boolean)
      .join(" — ");
    entities.push({
      id: makeEntityId("process_template", tmpl.id),
      entityType: "process_template",
      entityId: tmpl.id,
      text,
      updatedAt: tmpl.updatedAt,
      indexedAt: now,
    });
  }

  for (const pt of data.projectTypes) {
    const text = [
      `Tipo de proyecto: ${pt.name}`,
      pt.description && `Descripción: ${pt.description}`,
    ]
      .filter(Boolean)
      .join(" — ");
    entities.push({
      id: makeEntityId("project_type", pt.id),
      entityType: "project_type",
      entityId: pt.id,
      text,
      updatedAt: pt.updatedAt,
      indexedAt: now,
    });
  }

  for (const rule of data.automations) {
    entities.push({
      id: makeEntityId("automation", rule.id),
      entityType: "automation",
      entityId: rule.id,
      text: `Automatización: ${rule.name}`,
      updatedAt: rule.updatedAt,
      indexedAt: now,
    });
  }

  return entities;
}

function buildEmbeddingText(entity: RagEntity): string {
  return entity.text;
}

export async function indexAllEntities(
  data: ToolData,
  apiKey: string,
  onProgress?: (progress: RagProgress) => void,
  signal?: AbortSignal,
): Promise<void> {
  const existing = await loadEmbeddings();
  const entities = collectEntities(data);
  const total = entities.length;
  let indexed = 0;

  for (let i = 0; i < entities.length; i++) {
    if (signal?.aborted) throw new DOMException("AbortError");

    const entity = entities[i];
    const existingEntry = existing.get(entity.id);

    if (existingEntry && existingEntry.entity.updatedAt === entity.updatedAt) {
      existingEntry.entity.indexedAt = entity.indexedAt;
      indexed++;
      onProgress?.({ current: indexed, total, phase: entity.entityType });
      continue;
    }

    const text = buildEmbeddingText(entity);
    const embedding = await embedText(text, apiKey);

    const entry: RagEntry = {
      id: entity.id,
      embedding,
      entity,
    };
    existing.set(entity.id, entry);
    indexed++;
    onProgress?.({ current: indexed, total, phase: entity.entityType });
  }

  await saveEmbeddings(existing);
  await saveMeta({
    lastIndexedAt: new Date().toISOString(),
    entityCount: existing.size,
  });
}

export async function removeStaleEmbeddings(
  data: ToolData,
): Promise<number> {
  const existing = await loadEmbeddings();
  const current = new Set(collectEntities(data).map((e) => e.id));
  let removed = 0;
  for (const id of existing.keys()) {
    if (!current.has(id)) {
      existing.delete(id);
      removed++;
    }
  }
  if (removed > 0) {
    await saveEmbeddings(existing);
  }
  return removed;
}
