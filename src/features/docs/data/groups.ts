import type { DocGroup } from "../types";

export const DOC_GROUPS: Record<DocGroup, { label: string; description: string; order: number }> = {
  empezar: {
    label: "Primeros pasos",
    description: "Elige tu carpeta local y crea tu primer producto y proyecto.",
    order: 1,
  },
  organizar: {
    label: "Organizar tu trabajo",
    description: "Productos, proyectos, procesos, checklists, Kanban, sprints y tu día a día.",
    order: 2,
  },
  "plantillas-ia": {
    label: "Plantillas, automatización e IA",
    description: "Tipos y plantillas reutilizables, Flujos e integraciones, asistente IA.",
    order: 3,
  },
  seguimiento: {
    label: "Seguimiento y configuración",
    description: "Dashboard de portafolio, notificaciones, personas, datos y seguridad.",
    order: 4,
  },
};

export const DOC_GROUP_ORDER: DocGroup[] = (
  Object.keys(DOC_GROUPS) as DocGroup[]
).sort((a, b) => DOC_GROUPS[a].order - DOC_GROUPS[b].order);
