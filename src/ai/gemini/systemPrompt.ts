import type { Settings, Workspace } from "@/domain/schemas";
import { semanticSearchDetailed } from "@/ai/rag/search";
import { loadEmbeddings } from "@/ai/rag/store";
import type { SearchResult } from "@/ai/rag/types";

function formatRagBlock(query: string, results: SearchResult[]): string {
  if (results.length === 0) return "";

  const entries = results
    .map(
      (r, i) =>
        `[${i + 1}] ${r.entity.entityType}:${r.entity.entityId}
   "${r.entity.text}"
   (similitud: ${(r.score * 100).toFixed(0)}%)`,
    )
    .join("\n\n");

  return `## Contexto semántico (búsqueda: "${query}")
Los siguientes registros coinciden semánticamente con la consulta del usuario. Úsalos si son relevantes para responder, pero verifica los detalles actuales con herramientas de lectura cuando sea necesario.

${entries}

`;
}

/**
 * Semantic-search context plus cache/hit metadata for send() usage events.
 * `fromCache` comes from `semanticSearchDetailed` (CA-02.5).
 */
export async function buildRagContextDetailed(
  query: string,
  apiKey: string,
  topK: number = 5,
): Promise<{ block: string; hits: number; fromCache: boolean }> {
  const embeddings = await loadEmbeddings();
  if (embeddings.size === 0) return { block: "", hits: 0, fromCache: false };

  const { results, fromCache } = await semanticSearchDetailed(query, apiKey, topK);
  return {
    block: formatRagBlock(query, results),
    hits: results.length,
    fromCache,
  };
}

/**
 * Build a RAG context string by performing semantic search against embedded
 * entities. Returns a formatted block with the top-k matches, or an empty
 * string if no embeddings are available.
 */
export async function buildRagContext(
  query: string,
  apiKey: string,
  topK: number = 5,
): Promise<string> {
  return (await buildRagContextDetailed(query, apiKey, topK)).block;
}

/** design.md §6 — solo cuando ragContext no está vacío. */
const EVIDENCE_BLOCK = `## Prioridad de evidencia
El índice de abajo está recortado al foco de pantalla. El bloque "Contexto semántico" son hits del RAG (índice actualizado). Usalos antes de llamar list_projects, list_tasks o search_workspace. Si necesitás detalle de un id concreto, usá get_project / list_tasks filtrado por ese id. No re-descubras el portafolio si el foco + RAG alcanzan para responder.
`;

function renderSection(
  title: string,
  body: string,
  emptyPlaceholder: string,
  omitEmpty: boolean,
): string {
  if (!body) {
    if (omitEmpty) return "";
    return `${title}\n${emptyPlaceholder}`;
  }
  return `${title}\n${body}`;
}

/**
 * Pure system-prompt builder. Injects the lightweight workspace index (already
 * maintained by useDataStore.reindex) so the model knows every project/product
 * id without expensive tool round-trips.
 *
 * `screenContextBlock` (spec 050 HU-01/D2) se inserta después del índice del
 * workspace para que el modelo vea primero el catálogo y luego el foco actual.
 *
 * `options.omitEmptyIndexSections` (spec 060 CA-03.6): si hay workspace y el
 * flag está activo, no serializa secciones de índice con array vacío.
 */
export function buildSystemPrompt(
  workspace: Workspace | null,
  ragContext: string = "",
  today: Date = new Date(),
  screenContextBlock: string = "",
  options?: { omitEmptyIndexSections?: boolean },
): string {
  const org = workspace?.org.name ?? "Mi Empresa";
  const settings: Settings = workspace?.settings ?? {
    theme: "system",
    stalledAfterDays: 14,
    dueSoonDays: 7,
    deriveHealth: false,
  };
  const date = today.toISOString().slice(0, 10);

  const index = workspace?.index;
  const projects = (index?.projects ?? [])
    .map((p) => `- ${p.name} (id: ${p.id}, estado: ${p.status}, salud: ${p.health})`)
    .join("\n");
  const products = (index?.products ?? [])
    .map((p) => `- ${p.name} (id: ${p.id}, estado: ${p.status})`)
    .join("\n");
  const types = (index?.types ?? []).map((t) => `- ${t.name} (id: ${t.id})`).join("\n");
  const templates = (index?.templates ?? [])
    .map((t) => `- ${t.name} (id: ${t.id})`)
    .join("\n");
  const processTemplates = (index?.processTemplates ?? [])
    .map((t) => `- ${t.name} (id: ${t.id})`)
    .join("\n");

  const omitEmpty = Boolean(workspace && options?.omitEmptyIndexSections);
  const indexMarkdown = [
    renderSection("Proyectos:", projects, "(ninguno)", omitEmpty),
    renderSection("Productos:", products, "(ninguno)", omitEmpty),
    renderSection("Tipos de proyecto:", types, "(ninguno)", omitEmpty),
    renderSection("Plantillas de checklist:", templates, "(ninguna)", omitEmpty),
    renderSection("Plantillas de proceso:", processTemplates, "(ninguna)", omitEmpty),
  ]
    .filter((section) => section.length > 0)
    .join("\n\n");

  const evidenceBlock = ragContext ? EVIDENCE_BLOCK : "";

  return `Eres el asistente de gestión de proyectos de "${org}". Ayudas a un Project Manager con su portafolio: productos, proyectos, áreas, procesos (SOPs), checklists, tareas Kanban y automatizaciones. Respondes siempre en español, de forma directa y accionable.

Hoy es ${date}. Un proyecto se considera estancado tras ${settings.stalledAfterDays} días sin cambios; "por vencer" significa a ${settings.dueSoonDays} días o menos.

## Herramientas
- Usa las herramientas de lectura libremente y cuantas veces necesites antes de responder. No inventes datos: si no lo has leído con una herramienta, no lo afirmes.
- Usa SIEMPRE los ids exactos del índice de abajo o de resultados de herramientas. Nunca inventes ids.
- Para escrituras que requieren ids internos (áreas, checklists, ítems), llama primero a get_project.
- Las escrituras pueden requerir confirmación del usuario; si una acción se cancela, no la reintentes: pregunta qué prefiere.
- Tras completar escrituras, resume brevemente qué cambió.

## Plantillas y tipos de proyecto
- Cuando detectes trabajo repetible (lanzamientos, onboarding, publicaciones), propone estandarizarlo: crea plantillas y un Tipo de Proyecto en vez de tareas sueltas.
- Flujo recomendado en varios pasos: 1) create_checklist_template y/o create_process_template → 2) create_project_type referenciando esos ids en defaultAreas → 3) create_project_from_type para instanciar. Usa los ids devueltos por cada paso; verifica plantillas existentes con list_templates antes de duplicar.
- Buenos ítems de checklist: verificables y binarios (hecho/no hecho), empiezan con verbo, uno por resultado ("Publicar nota de prensa", no "Prensa"). Marca required solo lo imprescindible. Entre 3 y 12 ítems.
- Buenos pasos de proceso (SOP): en orden de ejecución, empiezan con verbo, con el detalle operativo en details (quién, con qué herramienta, criterio de salida). Entre 3 y 10 pasos.
- Nombra plantillas por su resultado ("Checklist de lanzamiento web") y usa category para agrupar ("Lanzamiento", "QA", "Marketing").

## Índice del workspace (siempre actualizado)
${indexMarkdown}
${screenContextBlock}
${ragContext}
${evidenceBlock}## Estilo
- Sé conciso; usa listas y negritas con moderación.
- Piensa como PM: prioriza por vencimiento, bloqueos y salud; una tarea sin responsable ni fecha rara vez avanza; los proyectos en rojo o ámbar merecen atención antes que nuevas iniciativas.
- Si la petición es ambigua (p. ej. varios proyectos con nombre similar), pregunta antes de escribir datos.`;
}
