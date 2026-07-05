import { z } from "zod";
import {
  newChecklistTemplate,
  newProcessTemplate,
  newProjectType,
} from "@/domain/factories";
import { ProjectStatus } from "@/domain/schemas";
import { uuid } from "@/lib/utils";
import { defineTool, type AiTool, type ToolContext } from "../types";
import {
  checklistTemplateName,
  processTemplateName,
  typeName,
} from "../glossary";

export function createTemplateWriteTools(ctx: ToolContext): AiTool[] {
  const { getData, actions } = ctx;

  return [
    defineTool({
      name: "create_checklist_template",
      description:
        "Crea una plantilla de checklist reutilizable (ítems verificables). Úsala para estandarizar controles repetibles; luego puede referenciarse desde un Tipo de Proyecto o instanciarse en áreas. Verifica con list_templates que no exista una similar.",
      mode: "write",
      input: z.object({
        name: z.string().min(1),
        category: z
          .string()
          .optional()
          .describe("Categoría libre, p. ej. 'Lanzamiento', 'QA'"),
        items: z
          .array(
            z.object({
              text: z.string().min(1),
              required: z.boolean().optional(),
            }),
          )
          .min(1),
        tags: z.array(z.string()).optional(),
      }),
      describeCall: (a) =>
        `Crear plantilla de checklist "${a.name}" con ${a.items.length} ítems`,
      execute: async (a) => {
        const tpl = newChecklistTemplate(a.name);
        if (a.category) tpl.category = a.category;
        if (a.tags) tpl.tags = a.tags;
        tpl.items = a.items.map((i) => ({
          id: uuid(),
          text: i.text,
          required: i.required ?? false,
        }));
        await actions.createChecklistTemplate(tpl);
        return {
          ok: true,
          template: { id: tpl.id, name: tpl.name, itemCount: tpl.items.length },
        };
      },
    }),

    defineTool({
      name: "update_checklist_template",
      description:
        "Actualiza una plantilla de checklist (nombre, categoría, tags). Si se provee items, reemplaza la lista completa.",
      mode: "write",
      input: z.object({
        templateId: z.string(),
        name: z.string().optional(),
        category: z.string().optional(),
        items: z
          .array(z.object({ text: z.string().min(1), required: z.boolean().optional() }))
          .optional(),
        tags: z.array(z.string()).optional(),
      }),
      describeCall: (a) =>
        `Actualizar plantilla de checklist "${checklistTemplateName(ctx, a.templateId)}"`,
      execute: async (a) => {
        const tpl = getData().checklistTemplates.find((x) => x.id === a.templateId);
        if (!tpl) throw new Error(`Plantilla de checklist no encontrada: ${a.templateId}`);
        const next = {
          ...tpl,
          ...(a.name !== undefined && { name: a.name }),
          ...(a.category !== undefined && { category: a.category }),
          ...(a.tags !== undefined && { tags: a.tags }),
          ...(a.items !== undefined && {
            items: a.items.map((i) => ({
              id: uuid(),
              text: i.text,
              required: i.required ?? false,
            })),
          }),
        };
        await actions.updateChecklistTemplate(next);
        return {
          ok: true,
          template: { id: next.id, name: next.name, itemCount: next.items.length },
        };
      },
    }),

    defineTool({
      name: "delete_checklist_template",
      description:
        "Elimina una plantilla de checklist. No afecta checklists ya instanciados en proyectos existentes. Requiere confirmación.",
      mode: "write",
      input: z.object({ templateId: z.string() }),
      describeCall: (a) =>
        `Eliminar la plantilla de checklist "${checklistTemplateName(ctx, a.templateId)}"`,
      execute: async (a) => {
        if (!getData().checklistTemplates.find((x) => x.id === a.templateId))
          throw new Error(`Plantilla de checklist no encontrada: ${a.templateId}`);
        await actions.deleteChecklistTemplate(a.templateId);
        return { ok: true };
      },
    }),

    defineTool({
      name: "create_process_template",
      description:
        "Crea una plantilla de proceso (SOP) con pasos ordenados. Cada paso puede llevar detalles de ejecución. Referénciala desde un Tipo de Proyecto o instánciala en áreas.",
      mode: "write",
      input: z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        category: z.string().optional(),
        steps: z
          .array(
            z.object({
              text: z.string().min(1),
              details: z.string().optional(),
            }),
          )
          .min(1)
          .describe("Pasos en orden de ejecución"),
      }),
      describeCall: (a) =>
        `Crear plantilla de proceso "${a.name}" con ${a.steps.length} pasos`,
      execute: async (a) => {
        const tpl = newProcessTemplate(a.name);
        if (a.description) tpl.description = a.description;
        if (a.category) tpl.category = a.category;
        tpl.steps = a.steps.map((s) => ({
          id: uuid(),
          text: s.text,
          details: s.details ?? "",
        }));
        await actions.createProcessTemplate(tpl);
        return {
          ok: true,
          template: { id: tpl.id, name: tpl.name, stepCount: tpl.steps.length },
        };
      },
    }),

    defineTool({
      name: "update_process_template",
      description:
        "Actualiza una plantilla de proceso (nombre, descripción, categoría). Si se provee steps, reemplaza la lista completa de pasos.",
      mode: "write",
      input: z.object({
        templateId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        steps: z
          .array(z.object({ text: z.string().min(1), details: z.string().optional() }))
          .optional(),
      }),
      describeCall: (a) =>
        `Actualizar plantilla de proceso "${processTemplateName(ctx, a.templateId)}"`,
      execute: async (a) => {
        const tpl = getData().processTemplates.find((x) => x.id === a.templateId);
        if (!tpl) throw new Error(`Plantilla de proceso no encontrada: ${a.templateId}`);
        const next = {
          ...tpl,
          ...(a.name !== undefined && { name: a.name }),
          ...(a.description !== undefined && { description: a.description }),
          ...(a.category !== undefined && { category: a.category }),
          ...(a.steps !== undefined && {
            steps: a.steps.map((s) => ({
              id: uuid(),
              text: s.text,
              details: s.details ?? "",
            })),
          }),
        };
        await actions.updateProcessTemplate(next);
        return {
          ok: true,
          template: { id: next.id, name: next.name, stepCount: next.steps.length },
        };
      },
    }),

    defineTool({
      name: "delete_process_template",
      description:
        "Elimina una plantilla de proceso. No afecta procesos ya instanciados en proyectos existentes. Requiere confirmación.",
      mode: "write",
      input: z.object({ templateId: z.string() }),
      describeCall: (a) =>
        `Eliminar la plantilla de proceso "${processTemplateName(ctx, a.templateId)}"`,
      execute: async (a) => {
        if (!getData().processTemplates.find((x) => x.id === a.templateId))
          throw new Error(`Plantilla de proceso no encontrada: ${a.templateId}`);
        await actions.deleteProcessTemplate(a.templateId);
        return { ok: true };
      },
    }),

    defineTool({
      name: "create_project_type",
      description:
        "Crea un Tipo de Proyecto (blueprint) con áreas por defecto que referencian plantillas de checklist y proceso EXISTENTES por id (usa list_templates o crea las plantillas primero). Después instáncialo con create_project_from_type.",
      mode: "write",
      input: z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        statusWorkflow: z
          .array(ProjectStatus)
          .min(1)
          .optional()
          .describe("Opcional; por defecto el flujo completo backlog→archived"),
        defaultAreas: z
          .array(
            z.object({
              name: z.string().min(1),
              icon: z
                .string()
                .optional()
                .describe("Nombre de icono lucide, p. ej. 'rocket'"),
              checklistTemplateIds: z.array(z.string()).optional(),
              processTemplateIds: z.array(z.string()).optional(),
            }),
          )
          .min(1),
      }),
      describeCall: (a) =>
        `Crear tipo de proyecto "${a.name}" con ${a.defaultAreas.length} áreas por defecto`,
      execute: async (a) => {
        const data = getData();
        const clIds = new Set(data.checklistTemplates.map((t) => t.id));
        const prIds = new Set(data.processTemplates.map((t) => t.id));
        for (const area of a.defaultAreas) {
          for (const id of area.checklistTemplateIds ?? [])
            if (!clIds.has(id))
              throw new Error(
                `Plantilla de checklist no encontrada: ${id} (área "${area.name}")`,
              );
          for (const id of area.processTemplateIds ?? [])
            if (!prIds.has(id))
              throw new Error(
                `Plantilla de proceso no encontrada: ${id} (área "${area.name}")`,
              );
        }
        const type = newProjectType(a.name);
        if (a.description) type.description = a.description;
        if (a.statusWorkflow) type.statusWorkflow = a.statusWorkflow;
        type.defaultAreas = a.defaultAreas.map((area) => ({
          name: area.name,
          icon: area.icon ?? "folder",
          checklistTemplateIds: area.checklistTemplateIds ?? [],
          processTemplateIds: area.processTemplateIds ?? [],
        }));
        await actions.createProjectType(type);
        return {
          ok: true,
          projectType: {
            id: type.id,
            name: type.name,
            defaultAreas: type.defaultAreas.map((x) => x.name),
          },
        };
      },
    }),

    defineTool({
      name: "update_project_type",
      description:
        "Actualiza un Tipo de Proyecto (nombre, descripción, flujo de estados, áreas por defecto). Si se provee defaultAreas, revalida que las plantillas referenciadas existan y reemplaza la lista completa.",
      mode: "write",
      input: z.object({
        typeId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        statusWorkflow: z.array(ProjectStatus).min(1).optional(),
        defaultAreas: z
          .array(
            z.object({
              name: z.string().min(1),
              icon: z.string().optional(),
              checklistTemplateIds: z.array(z.string()).optional(),
              processTemplateIds: z.array(z.string()).optional(),
            }),
          )
          .min(1)
          .optional(),
      }),
      describeCall: (a) => `Actualizar tipo de proyecto "${typeName(ctx, a.typeId)}"`,
      execute: async (a) => {
        const type = getData().projectTypes.find((x) => x.id === a.typeId);
        if (!type) throw new Error(`Tipo de proyecto no encontrado: ${a.typeId}`);
        if (a.defaultAreas) {
          const data = getData();
          const clIds = new Set(data.checklistTemplates.map((t) => t.id));
          const prIds = new Set(data.processTemplates.map((t) => t.id));
          for (const area of a.defaultAreas) {
            for (const id of area.checklistTemplateIds ?? [])
              if (!clIds.has(id))
                throw new Error(
                  `Plantilla de checklist no encontrada: ${id} (área "${area.name}")`,
                );
            for (const id of area.processTemplateIds ?? [])
              if (!prIds.has(id))
                throw new Error(
                  `Plantilla de proceso no encontrada: ${id} (área "${area.name}")`,
                );
          }
        }
        const next = {
          ...type,
          ...(a.name !== undefined && { name: a.name }),
          ...(a.description !== undefined && { description: a.description }),
          ...(a.statusWorkflow !== undefined && { statusWorkflow: a.statusWorkflow }),
          ...(a.defaultAreas !== undefined && {
            defaultAreas: a.defaultAreas.map((area) => ({
              name: area.name,
              icon: area.icon ?? "folder",
              checklistTemplateIds: area.checklistTemplateIds ?? [],
              processTemplateIds: area.processTemplateIds ?? [],
            })),
          }),
        };
        await actions.updateProjectType(next);
        return {
          ok: true,
          projectType: {
            id: next.id,
            name: next.name,
            defaultAreas: next.defaultAreas.map((x) => x.name),
          },
        };
      },
    }),

    defineTool({
      name: "delete_project_type",
      description:
        "Elimina un Tipo de Proyecto. No afecta proyectos ya creados a partir de él. Requiere confirmación.",
      mode: "write",
      input: z.object({ typeId: z.string() }),
      describeCall: (a) => `Eliminar el tipo de proyecto "${typeName(ctx, a.typeId)}"`,
      execute: async (a) => {
        if (!getData().projectTypes.find((x) => x.id === a.typeId))
          throw new Error(`Tipo de proyecto no encontrado: ${a.typeId}`);
        await actions.deleteProjectType(a.typeId);
        return { ok: true };
      },
    }),
  ];
}
