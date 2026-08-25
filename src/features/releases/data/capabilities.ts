/**
 * Mapa de capacidades ya en producto (snapshot honesto).
 * Anclado a features reales de `src/` y specs 001-067.
 */
export type Capability = {
  title: string;
  body: string;
  /** Specs o hitos de origen (referencia interna, no siempre se muestra). */
  source?: string;
};

export const CAPABILITIES: Capability[] = [
  {
    title: "Portafolio local-first",
    body: "Productos, proyectos, áreas, SOPs en Markdown, checklists y tareas — todo en JSON en tu carpeta (o demo en el navegador), con dashboard de portafolio y drill-down a listas filtradas.",
    source: "001 · M0–M6 · 030 · 063 · 066–067",
  },
  {
    title: "Kanban de uso diario",
    body: "Drag-and-drop, drawer con comentarios y subtareas, archivo, tags, estimación, WIP limits, vista lista, filtros en la URL, bulk multi-drag, tipos de trabajo y color por urgencia.",
    source: "010–017 · 054 · 062 · 064–065",
  },
  {
    title: "Mis tareas y Daily",
    body: "Vista cross-proyecto de lo asignado a vos, con filtros de triaje y vistas por prioridad o proyecto; y standup del día (hecho / para hoy / bloqueado) sin abrir cada tablero.",
    source: "017 · 061",
  },
  {
    title: "Biblioteca reutilizable",
    body: "Tipos de proyecto, plantillas de checklist y de proceso; crear un proyecto desde un tipo despliega la estructura sola.",
    source: "001 · M2",
  },
  {
    title: "Automatizaciones + Flujos",
    body: "Reglas internas del proyecto y un builder visual con React Flow: eventos, polling HubSpot/Sheets, webhooks Make/Zapier, trigger programado, guardas por salida, dry-run e historial de corridas.",
    source: "001 · 018–039 · 051 · 055–056",
  },
  {
    title: "Asistente IA + RAG",
    body: "Gemini o cualquier proveedor compatible con OpenAI, con tools estilo MCP (lee y escribe con confirmación), embeddings locales, fallback entre modelos y auditoría de tokens por turno.",
    source: "005–007 · 012 · 031 · 047 · 060",
  },
  {
    title: "Anexos en disco",
    body: "PDFs, imágenes, audio y video colgados a tareas y otras entidades, con preview y limpieza al borrar. Las tareas también llevan links clickeables y descripciones con Markdown.",
    source: "042–045",
  },
  {
    title: "Sitio, docs y blog",
    body: "Landing, `/docs` por módulo, más de 50 artículos en `/blogs` (5 clusters + mini-cluster MCP) y páginas SEO (alternativa a Trello/Notion, offline) con HTML prerenderizado.",
    source: "004 · 009 · 028–029 · 035 · 040 · 058–059",
  },
];
