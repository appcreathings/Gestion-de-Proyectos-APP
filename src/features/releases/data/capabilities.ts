/**
 * Mapa de capacidades ya en producto (snapshot honesto).
 * Anclado a features reales de `src/` y specs 001–042.
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
    body: "Productos, proyectos, áreas, SOPs en Markdown, checklists y tareas — todo en JSON en tu carpeta (o demo en el navegador).",
    source: "001 · M0–M6 · 030",
  },
  {
    title: "Kanban de uso diario",
    body: "Drag-and-drop, drawer con comentarios y subtareas, archivo, tags, estimación, WIP limits, vista lista, filtros en la URL y bulk multi-drag.",
    source: "010–017",
  },
  {
    title: "Mis tareas y Daily",
    body: "Vista cross-proyecto de lo asignado a vos, y standup del día (hecho / para hoy / bloqueado) sin abrir cada tablero.",
    source: "017",
  },
  {
    title: "Biblioteca reutilizable",
    body: "Tipos de proyecto, plantillas de checklist y de proceso; crear un proyecto desde un tipo despliega la estructura sola.",
    source: "001 · M2",
  },
  {
    title: "Automatizaciones + Flujos",
    body: "Reglas internas del proyecto y un builder visual con React Flow: eventos, polling HubSpot/Sheets, webhooks Make/Zapier, dry-run e historial de corridas.",
    source: "001 · 018–039",
  },
  {
    title: "Asistente IA + RAG",
    body: "Gemini con tools estilo MCP (lee y escribe con confirmación), embeddings locales y fallback entre modelos cuando hay cuota o rate-limit.",
    source: "005–007 · 012 · 031 · M9–M11",
  },
  {
    title: "Anexos en disco",
    body: "PDFs, imágenes, audio y video colgados a tareas y otras entidades, con preview y limpieza al borrar.",
    source: "042",
  },
  {
    title: "Sitio, docs y blog",
    body: "Landing, `/docs` por módulo, ~30 artículos en `/blogs` y páginas SEO (alternativa a Trello/Notion, offline) con HTML prerenderizado.",
    source: "004 · 009 · 028–029 · 035 · 040",
  },
];
