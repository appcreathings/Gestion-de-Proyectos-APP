import { Outlet } from "react-router-dom";
import { ProjectTree } from "@/components/layout/ProjectTree";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Two-panel workspace for /app/projects and /app/projects/:id: a Producto →
 * Proyecto → Área tree (the "ÁRBOL" column from the landing preview) beside
 * the routed content. Collapses to a single column on mobile — the rail's
 * own lightweight tree (see AppLayout/ProjectTree) covers navigation there.
 */
export function ProjectsLayout() {
  return (
    <div className="lg:grid lg:grid-cols-[240px_1fr] lg:items-start lg:gap-8">
      <aside className="hidden lg:sticky lg:top-6 lg:block lg:rounded-lg lg:border lg:border-border/60 lg:bg-background lg:p-3">
        <SectionLabel className="mb-2 block px-2">Árbol</SectionLabel>
        <ProjectTree showAreas />
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
