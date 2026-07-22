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
};

export async function loadArticle(slug: string): Promise<BlogArticle | undefined> {
  const loader = loaders[slug];
  if (!loader) return undefined;
  const mod = await loader();
  return mod.article;
}
