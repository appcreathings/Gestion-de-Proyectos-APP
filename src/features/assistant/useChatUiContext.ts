import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { resolveUiContext, type UiContext } from "@/ai/chat/uiContext";
import { useAppStore } from "@/store/useAppStore";
import { useDataStore } from "@/store/useDataStore";

/**
 * Hook que resuelve el contexto de pantalla actual (spec 050 D1).
 * Puro en datos: derivado de la URL + los stores. No muta nada.
 */
export function useChatUiContext(): UiContext {
  const { pathname, search } = useLocation();
  const projects = useDataStore((s) => s.projects);
  const indexProjects = useAppStore((s) => s.workspace?.index?.projects ?? []);

  return useMemo(
    () =>
      resolveUiContext({
        pathname,
        search,
        getProject: (id) => {
          // El índice trae id/name/status/health; alcanza para el contexto.
          const p = indexProjects.find((x) => x.id === id);
          return p ? { id: p.id, name: p.name, status: p.status, health: p.health } : null;
        },
        getTask: (projectId, taskId) => {
          const project = projects.find((p) => p.id === projectId);
          if (!project) return null;
          const t = project.tasks.find((x) => x.id === taskId);
          return t
            ? { id: t.id, title: t.title, status: t.status, priority: t.priority }
            : null;
        },
      }),
    [pathname, search, indexProjects, projects],
  );
}
