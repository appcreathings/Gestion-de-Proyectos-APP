import { z } from "zod";
import { areaProgress, daysUntil, projectTaskProgress } from "@/domain/compute";
import {
  instantiateChecklistFromTemplate,
  instantiateProcessFromTemplate,
} from "@/domain/instantiate";
import * as ops from "@/domain/projectOps";
import { newArea } from "@/domain/factories";
import { defineTool, type AiTool, type ToolContext } from "./types";

export function createCompositeTools(ctx: ToolContext): AiTool[] {
  const { getData, actions } = ctx;

  return [
    defineTool({
      name: "summarize_project_health",
      description:
        "Resumen completo de salud de un proyecto: áreas con % de avance, ítems vencidos y próximos, tareas por estado, ítems requeridos sin completar. Idempotente, no muta.",
      mode: "read",
      input: z.object({ projectId: z.string() }),
      execute: ({ projectId }) => {
        const data = getData();
        const project = data.projects.find((p) => p.id === projectId);
        if (!project) throw new Error(`Proyecto no encontrado: ${projectId}`);

        const allDueSoonItems: Array<{
          areaId: string;
          areaName: string;
          checklistId: string;
          itemId: string;
          text: string;
          dueDate: string;
          daysLeft: number;
        }> = [];
        let totalOverdue = 0;
        let totalDueSoon = 0;
        let totalRequiredIncomplete = 0;

        const areas = project.areas.map((a) => {
          const prog = areaProgress(a);
          let overdueItems = 0;
          let dueSoonItems = 0;
          let requiredIncomplete = 0;
          const tasks = project.tasks.filter((t) => t.areaId === a.id);

          for (const c of a.checklists) {
            for (const i of c.items) {
              if (i.done) continue;
              if (i.required) requiredIncomplete++;
              const d = daysUntil(i.dueDate ?? null);
              if (d !== null) {
                if (d < 0) overdueItems++;
                else if (d <= 7) {
                  dueSoonItems++;
                  allDueSoonItems.push({
                    areaId: a.id,
                    areaName: a.name,
                    checklistId: c.id,
                    itemId: i.id,
                    text: i.text,
                    dueDate: i.dueDate!,
                    daysLeft: d,
                  });
                }
              }
            }
          }

          totalOverdue += overdueItems;
          totalDueSoon += dueSoonItems;
          totalRequiredIncomplete += requiredIncomplete;

          return {
            id: a.id,
            name: a.name,
            completed: a.completed,
            progressPct: prog.pct,
            overdueItems,
            dueSoonItems,
            tasks: {
              total: tasks.length,
              todo: tasks.filter((t) => t.status === "todo").length,
              doing: tasks.filter((t) => t.status === "doing").length,
              done: tasks.filter((t) => t.status === "done").length,
            },
          };
        });

        const taskStats = projectTaskProgress(project);

        return {
          project: {
            id: project.id,
            name: project.name,
            status: project.status,
            health: project.health,
            daysUntilDue: daysUntil(project.dueDate),
          },
          areas,
          totals: {
            overdueItems: totalOverdue,
            dueSoonItems: totalDueSoon,
            requiredIncomplete: totalRequiredIncomplete,
            tasksByStatus: {
              total: project.tasks.length,
              todo: project.tasks.filter((t) => t.status === "todo").length,
              doing: project.tasks.filter((t) => t.status === "doing").length,
              blocked: project.tasks.filter((t) => t.status === "blocked").length,
              done: taskStats.done,
            },
          },
          next: allDueSoonItems
            .sort((a, b) => a.daysLeft - b.daysLeft)
            .slice(0, 10),
        };
      },
    }),

    defineTool({
      name: "complete_checklist",
      description:
        "Marca como completados todos (o algunos) ítems de un checklist. Mode 'all' completa todos; 'required' solo los obligatorios; 'ids' los indicados en itemIds.",
      mode: "write",
      input: z.object({
        projectId: z.string(),
        areaId: z.string(),
        checklistId: z.string(),
        mode: z.enum(["all", "required", "ids"]),
        itemIds: z.array(z.string()).optional(),
      }),
      describeCall: (a) => {
        const p = getData().projects.find((x) => x.id === a.projectId);
        const checklist = p?.areas
          .find((x) => x.id === a.areaId)
          ?.checklists.find((c) => c.id === a.checklistId);
        const total = checklist?.items.length ?? 0;
        const desc =
          a.mode === "all"
            ? `todos los ${total} ítems`
            : a.mode === "required"
              ? `ítems obligatorios`
              : `${a.itemIds?.length ?? 0} ítems específicos`;
        return `Completar ${desc} del checklist "${checklist?.name ?? a.checklistId}" en "${p?.name ?? a.projectId}"`;
      },
      execute: async (a) => {
        const project = getData().projects.find((x) => x.id === a.projectId);
        if (!project) throw new Error(`Proyecto no encontrado: ${a.projectId}`);
        const area = project.areas.find((x) => x.id === a.areaId);
        if (!area) throw new Error(`Área no encontrada: ${a.areaId}`);
        const checklist = area.checklists.find((c) => c.id === a.checklistId);
        if (!checklist) throw new Error(`Checklist no encontrado: ${a.checklistId}`);

        let targets = checklist.items;
        if (a.mode === "required")
          targets = targets.filter((i) => i.required);
        if (a.mode === "ids") {
          if (!a.itemIds?.length)
            throw new Error("Se requiere itemIds cuando mode='ids'");
          targets = targets.filter((i) => a.itemIds!.includes(i.id));
        }

        const alreadyDone = targets.filter((i) => i.done);
        const toMark = targets.filter((i) => !i.done);

        for (const item of toMark) {
          await actions.mutateProject(a.projectId, (p) =>
            ops.updateItem(p, a.areaId, a.checklistId, { ...item, done: true }),
          );
        }

        return {
          ok: true,
          marked: toMark.length,
          skipped: alreadyDone.length,
        };
      },
    }),

    defineTool({
      name: "apply_type_to_project",
      description:
        "Despliega las áreas de un Tipo de Proyecto en un proyecto ya existente. Por defecto solo agrega áreas faltantes (sin duplicar las que ya existen por nombre). Requiere que el tipo exista.",
      mode: "write",
      input: z.object({
        projectId: z.string(),
        typeId: z.string(),
        onlyMissing: z.boolean().optional().default(true),
      }),
      describeCall: (a) => {
        const p = getData().projects.find((x) => x.id === a.projectId);
        const t = getData().projectTypes.find((x) => x.id === a.typeId);
        return `Aplicar tipo "${t?.name ?? a.typeId}" al proyecto "${p?.name ?? a.projectId}"${a.onlyMissing !== false ? " (solo áreas faltantes)" : ""}`;
      },
      execute: async (a) => {
        const data = getData();
        const project = data.projects.find((x) => x.id === a.projectId);
        if (!project) throw new Error(`Proyecto no encontrado: ${a.projectId}`);
        const type = data.projectTypes.find((x) => x.id === a.typeId);
        if (!type) throw new Error(`Tipo de proyecto no encontrado: ${a.typeId}`);

        const addedAreas: Array<{
          name: string;
          instantiatedChecklists: number;
          instantiatedProcesses: number;
        }> = [];

        const isMissing = a.onlyMissing !== false;
        const existingNames = isMissing
          ? new Set(project.areas.map((a) => a.name.toLowerCase()))
          : new Set<string>();

        for (const da of type.defaultAreas) {
          if (isMissing && existingNames.has(da.name.toLowerCase())) continue;

          const area = newArea(da.name, da.icon ?? "folder");
          area.checklists = da.checklistTemplateIds
            .map((tid) => data.checklistTemplates.find((t) => t.id === tid))
            .filter((t): t is NonNullable<typeof t> => !!t)
            .map(instantiateChecklistFromTemplate);
          area.processes = da.processTemplateIds
            .map((tid) => data.processTemplates.find((t) => t.id === tid))
            .filter((t): t is NonNullable<typeof t> => !!t)
            .map(instantiateProcessFromTemplate);

          await actions.mutateProject(a.projectId, (p) => ops.addArea(p, area));
          addedAreas.push({
            name: area.name,
            instantiatedChecklists: area.checklists.length,
            instantiatedProcesses: area.processes.length,
          });
        }

        return {
          ok: true,
          addedAreas,
        };
      },
    }),
  ];
}
