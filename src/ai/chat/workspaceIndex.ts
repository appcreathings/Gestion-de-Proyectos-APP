import type { UiContext } from "@/ai/chat/uiContext";
import { emptyWorkspace, type WorkspaceIndex } from "@/domain/schemas";

/**
 * Recorta el índice al foco de pantalla (spec 060 §5). Devuelve un índice
 * nuevo; las colecciones omitidas quedan como arrays vacíos.
 */
export function selectWorkspaceIndex(
  index: WorkspaceIndex,
  uiCtx: UiContext,
): WorkspaceIndex {
  const selected: WorkspaceIndex = { ...emptyWorkspace().index };

  const keepPortfolio = () => {
    selected.projects = index.projects.slice();
    selected.products = index.products.slice();
  };

  if (uiCtx.kind === "project" || uiCtx.kind === "task") {
    const project = index.projects.find((p) => p.id === uiCtx.projectId);
    selected.projects = project ? [project] : [];
    if (project?.productId) {
      const product = index.products.find((p) => p.id === project.productId);
      selected.products = product ? [product] : [];
    }
    return selected;
  }

  if (uiCtx.kind === "none") {
    keepPortfolio();
    return selected;
  }

  switch (uiCtx.section) {
    case "products":
      selected.products = index.products.slice();
      break;
    case "projects":
      selected.projects = index.projects.slice();
      break;
    case "library":
      selected.types = index.types.slice();
      selected.templates = index.templates.slice();
      selected.processTemplates = index.processTemplates.slice();
      break;
    default:
      keepPortfolio();
      break;
  }

  return selected;
}
