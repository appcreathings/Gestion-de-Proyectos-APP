import type { RoadmapHorizon, RoadmapItem } from "../types";

/**
 * Roadmap público de producto.
 *
 * Anclado a backlog real:
 * - Spec 033 fases 2–3 (expresividad y madurez de flujos)
 * - ROADMAP_BLOG.md (clusters 2–5 pendientes)
 * - Spec 017 HU-15 (tendencias de dashboard — no está en código)
 * - Follow-ups naturales de 042 (anexos) y del producto local-first
 *
 * «Ahora» = en curso o siguiente tanda realista.
 * «Próximo» = planeado con spec o demanda clara.
 * «Más adelante» = dirección deseable que genera expectativa, sin fecha.
 *
 * Al shippear: mover el valor al historial en `releases.ts` y retirar o
 * marcar `shipped` acá.
 */
export const ROADMAP: RoadmapItem[] = [
  // ── Ahora ────────────────────────────────────────────────────────────
  {
    id: "blog-cluster-2-finish",
    title: "Cerrar el cluster de metodologías en el blog",
    description:
      "Sprint planning que se cumple, daily que no sea pérdida de tiempo, retrospectivas con 5 formatos y Waterfall vs Agile — los 4 satélites que faltan del cluster 2 (ROADMAP_BLOG).",
    horizon: "now",
    status: "in_progress",
    area: "Contenido",
  },
  {
    id: "flows-schedule-trigger",
    title: "Flujos que corren solos a la hora que elegís",
    description:
      "Trigger programado (cada día / cada semana a las 9:00) con catch-up al reabrir Hito. Hoy solo hay evento de dominio y polling de integraciones — spec 033 · B1.",
    horizon: "now",
    status: "planned",
    area: "Flujos",
  },
  {
    id: "flows-output-guards",
    title: "Si el deal es grande… (ramas sin duplicar el flujo)",
    description:
      "Guarda por salida: un output solo corre si su condición pasa. «Deal > 10k → crear proyecto y avisar; si no, solo tarea» sin clonar el flujo entero — spec 033 · B2.",
    horizon: "now",
    status: "planned",
    area: "Flujos",
  },
  {
    id: "attachments-delight",
    title: "Anexos que se sienten nativos",
    description:
      "Pulido post-042: previews más fluidos, feedback al subir archivos grandes, contadores claros y atajos desde el drawer de tarea.",
    horizon: "now",
    status: "in_progress",
    area: "Anexos",
  },

  // ── Próximo ──────────────────────────────────────────────────────────
  {
    id: "webhook-http-power",
    title: "Webhooks que hablan el idioma de cualquier API",
    description:
      "Método PUT/PATCH y headers custom interpolables (`Authorization: Bearer {{token}}`) en el output webhook — para ir más allá de los catch-hooks de Make — spec 033 · B3.",
    horizon: "next",
    status: "planned",
    area: "Integraciones",
  },
  {
    id: "flow-version-rollback",
    title: "Versionado y rollback de flujos",
    description:
      "Snapshot al guardar (últimas N versiones) y «Restaurar» sin miedo. Un flujo que crea tareas reales no debería sobrescribirse a ciegas — spec 033 · C2.",
    horizon: "next",
    status: "planned",
    area: "Flujos",
  },
  {
    id: "blog-cluster-3-tips",
    title: "Guías de problemas reales (cluster 3 del blog)",
    description:
      "Cómo gestionar varios proyectos a la vez, qué hacer si vas atrasado, delegar sin ser cuello de botella, cerrar proyectos y bajar el WIP del equipo.",
    horizon: "next",
    status: "planned",
    area: "Contenido",
  },
  {
    id: "dashboard-trends",
    title: "Tendencias del portafolio en el Dashboard",
    description:
      "Evolución de salud RAG y avance medio en el tiempo (spec 017 · HU-15). Hoy el dashboard es un corte del presente; queremos ver si el portafolio mejora o se estanca.",
    horizon: "next",
    status: "planned",
    area: "Dashboard",
  },
  {
    id: "export-status-pack",
    title: "Sacar un informe sin abrir Hito",
    description:
      "Export de resumen de proyecto o portfolio a Markdown/PDF: estado, tareas vencidas, avance por área. Para el cliente o el CEO que no va a instalar la app.",
    horizon: "next",
    status: "planned",
    area: "Proyectos",
  },
  {
    id: "industry-template-packs",
    title: "Packs de plantillas por industria",
    description:
      "Tipos de proyecto + checklists + procesos listos: estudio jurídico, agencia creativa, producto digital y operaciones. Empezar con estructura, no con un JSON vacío.",
    horizon: "next",
    status: "planned",
    area: "Biblioteca",
  },
  {
    id: "assistant-project-context",
    title: "Asistente que «está» en el proyecto abierto",
    description:
      "Más grounding del chat con el proyecto, sprint, anexos y tarea en foco — menos «¿a qué te referís?» y más acciones que calzan a la primera.",
    horizon: "next",
    status: "planned",
    area: "IA",
  },

  // ── Más adelante ─────────────────────────────────────────────────────
  {
    id: "blog-plantillas-y-roles",
    title: "Plantillas descargables y guías por rol",
    description:
      "Clusters 4 y 5 del blog: plantilla de plan, charter, informe semanal, y guías para freelancers y agencias — el contenido que se busca y se guarda.",
    horizon: "later",
    status: "planned",
    area: "Contenido",
  },
  {
    id: "inbox-signature-verify",
    title: "Inbox que verifica la firma de cada entrega",
    description:
      "HMAC por entrega en el poller entrante (spec 033 · B4). Si el proxy es abierto, Hito igual puede rechazar payloads manipulados.",
    horizon: "later",
    status: "planned",
    area: "Integraciones",
  },
  {
    id: "poll-coalescing",
    title: "Un solo poll para muchos flujos",
    description:
      "Coalescing: varios flujos sobre la misma conexión y cadencia comparten una consulta por tick (spec 033 · C3). Menos cupo quemado en HubSpot/Sheets.",
    horizon: "later",
    status: "planned",
    area: "Integraciones",
  },
  {
    id: "connections-portable",
    title: "Exportar conexiones (sin secretos) y reconectar",
    description:
      "Llevar la definición de integraciones a otro workspace y reenganchar secretos al abrir el vault — portabilidad real entre equipos (spec 033 · C4).",
    horizon: "later",
    status: "planned",
    area: "Integraciones",
  },
  {
    id: "timeline-calendar",
    title: "Vista línea de tiempo / calendario",
    description:
      "Ver vencimientos y sprints en un eje temporal, no solo columnas Kanban. Ideal para el PM que planifica la semana de un vistazo.",
    horizon: "later",
    status: "planned",
    area: "Proyectos",
  },
  {
    id: "mobile-kanban",
    title: "Kanban usable en el teléfono",
    description:
      "Flujo táctil para revisar, comentar y mover tareas desde el móvil — sin pretender ser una app nativa completa.",
    horizon: "later",
    status: "planned",
    area: "Kanban",
  },
  {
    id: "community-templates",
    title: "Plantillas de la comunidad",
    description:
      "Import/export de un pack (tipos + procesos + checklists) para compartir entre equipos open source. El marketplace sin marketplace: un archivo y listo.",
    horizon: "later",
    status: "planned",
    area: "Biblioteca",
  },
  {
    id: "multi-device-story",
    title: "La historia multi-dispositivo, contada en serio",
    description:
      "Guía y pulido del camino recomendado (carpeta compartida, Git, o modo navegador) sin inventar un servidor central. Local-first no es anti-equipo: es anti-rehén.",
    horizon: "later",
    status: "planned",
    area: "Local-first",
  },
];

export const ROADMAP_HORIZONS: {
  key: RoadmapHorizon;
  label: string;
  description: string;
}[] = [
  {
    key: "now",
    label: "Ahora",
    description: "En construcción o en la cola inmediata.",
  },
  {
    key: "next",
    label: "Próximo",
    description: "Siguiente tanda cuando lo de Ahora se estabilice.",
  },
  {
    key: "later",
    label: "Más adelante",
    description: "Dirección deseada; genera expectativa, sin fecha cerrada.",
  },
];
