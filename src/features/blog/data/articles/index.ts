import type { BlogArticle } from "../../types";

/**
 * Registro de carga diferida del cuerpo de cada artículo.
 * Vite genera un chunk por entrada — abrir un post solo baja su chunk.
 */
const loaders: Record<string, () => Promise<{ article: BlogArticle }>> = {
  "gestion-proyectos-sin-nube": () => import("./gestion-proyectos-sin-nube"),
  "como-documentar-procesos-equipos": () => import("./como-documentar-procesos-equipos"),
  "asistente-ia-proyectos-sin-datos": () => import("./asistente-ia-proyectos-sin-datos"),
  "organizar-proyectos-tareas-jerarquia": () =>
    import("./organizar-proyectos-tareas-jerarquia"),
  "automatizar-tareas-sin-nube": () => import("./automatizar-tareas-sin-nube"),
  "que-es-un-hito-gestion-proyectos": () => import("./que-es-un-hito-gestion-proyectos"),
  "hito-project-gestion-por-hitos": () => import("./hito-project-gestion-por-hitos"),
  "hito-vs-trello": () => import("./hito-vs-trello"),
  "alternativas-a-notion": () => import("./alternativas-a-notion"),
  "migrar-trello-a-hito": () => import("./migrar-trello-a-hito"),
  "que-es-mcp": () => import("./que-es-mcp"),
  "local-first-guia-definitiva-2026": () => import("./local-first-guia-definitiva-2026"),
  "versionar-proyectos-con-git": () => import("./versionar-proyectos-con-git"),
  "hito-vs-clickup": () => import("./hito-vs-clickup"),
  "como-priorizar-tareas": () => import("./como-priorizar-tareas"),
  "prompts-gestion-proyectos-ia": () => import("./prompts-gestion-proyectos-ia"),
  "rag-local-explicado": () => import("./rag-local-explicado"),
  "hito-para-estudio-juridico": () => import("./hito-para-estudio-juridico"),
  "gestion-de-proyectos-guia-completa": () => import("./gestion-de-proyectos-guia-completa"),
  "fases-de-un-proyecto": () => import("./fases-de-un-proyecto"),
  "como-estimar-tiempos-proyecto": () => import("./como-estimar-tiempos-proyecto"),
  "matriz-raci": () => import("./matriz-raci"),
  "scrum-vs-kanban": () => import("./scrum-vs-kanban"),
  "alcance-de-proyecto-scope-creep": () => import("./alcance-de-proyecto-scope-creep"),
  "ruta-critica-proyecto": () => import("./ruta-critica-proyecto"),
  "objetivos-proyecto-smart-okr": () => import("./objetivos-proyecto-smart-okr"),
  "gestion-de-riesgos-simple": () => import("./gestion-de-riesgos-simple"),
  "metodologias-gestion-proyectos": () => import("./metodologias-gestion-proyectos"),
  "que-es-scrum-equipos-pequenos": () => import("./que-es-scrum-equipos-pequenos"),
  "kanban-limites-wip": () => import("./kanban-limites-wip"),
  "sprint-planning-como-hacerlo": () => import("./sprint-planning-como-hacerlo"),
  "daily-standup-util": () => import("./daily-standup-util"),
  "retrospectivas-formatos": () => import("./retrospectivas-formatos"),
  "waterfall-vs-agile": () => import("./waterfall-vs-agile"),
  "gestionar-varios-proyectos-a-la-vez": () =>
    import("./gestionar-varios-proyectos-a-la-vez"),
  "proyecto-atrasado-que-hacer": () => import("./proyecto-atrasado-que-hacer"),
  "reuniones-de-status-eliminar": () => import("./reuniones-de-status-eliminar"),
  "reducir-trabajo-en-curso": () => import("./reducir-trabajo-en-curso"),
  "como-delegar-tareas": () => import("./como-delegar-tareas"),
  "seguimiento-de-tareas-equipo": () => import("./seguimiento-de-tareas-equipo"),
  "cierre-de-proyecto-checklist": () => import("./cierre-de-proyecto-checklist"),
  "gestionar-proyectos-con-clientes": () => import("./gestionar-proyectos-con-clientes"),
  "como-funciona-mcp-paso-a-paso": () => import("./como-funciona-mcp-paso-a-paso"),
  "mcp-vs-function-calling-vs-rag": () => import("./mcp-vs-function-calling-vs-rag"),
  "plantillas-gestion-proyectos": () => import("./plantillas-gestion-proyectos"),
  "plantilla-plan-de-proyecto": () => import("./plantilla-plan-de-proyecto"),
  "acta-constitucion-proyecto": () => import("./acta-constitucion-proyecto"),
  "informe-de-estado-semanal": () => import("./informe-de-estado-semanal"),
  "gestion-proyectos-excel": () => import("./gestion-proyectos-excel"),
  "herramientas-gestion-proyectos-gratis": () =>
    import("./herramientas-gestion-proyectos-gratis"),
  "kickoff-de-proyecto": () => import("./kickoff-de-proyecto"),
  "wbs-estructura-desglose-trabajo": () => import("./wbs-estructura-desglose-trabajo"),
  "plantilla-cronograma-proyecto": () => import("./plantilla-cronograma-proyecto"),
  "gestion-proyectos-freelancers": () => import("./gestion-proyectos-freelancers"),
  "gestion-proyectos-agencias": () => import("./gestion-proyectos-agencias"),
  "servidores-mcp-para-que-sirven": () => import("./servidores-mcp-para-que-sirven"),
  "kpis-gestion-proyectos": () => import("./kpis-gestion-proyectos"),
  "diagrama-de-gantt": () => import("./diagrama-de-gantt"),
  "burndown-chart": () => import("./burndown-chart"),
  "lecciones-aprendidas-proyecto": () => import("./lecciones-aprendidas-proyecto"),
  "que-son-stakeholders": () => import("./que-son-stakeholders"),
  "matriz-de-stakeholders": () => import("./matriz-de-stakeholders"),
  "gestion-de-recursos-proyecto": () => import("./gestion-de-recursos-proyecto"),
  "que-hace-un-project-manager": () => import("./que-hace-un-project-manager"),
  "presupuesto-de-proyecto": () => import("./presupuesto-de-proyecto"),
  "costos-directos-e-indirectos": () => import("./costos-directos-e-indirectos"),
  "valor-ganado-evm": () => import("./valor-ganado-evm"),
  "sobrecosto-de-proyecto": () => import("./sobrecosto-de-proyecto"),
};

export async function loadArticle(slug: string): Promise<BlogArticle | undefined> {
  const loader = loaders[slug];
  if (!loader) return undefined;
  const mod = await loader();
  return mod.article;
}
