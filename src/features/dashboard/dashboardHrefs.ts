import { ROUTES } from "@/routes/paths";
import type { Health, ProjectStatus } from "@/domain/schemas";

/** Hrefs del mapa de clicks del dashboard (spec 063 §5). Puros y testeables. */
export const dashboardHrefs = {
  activeProjects: () => `${ROUTES.projects}?status=active`,
  stalledProjects: () => `${ROUTES.projects}?stalled=1`,
  overdueAnchor: () => `${ROUTES.dashboard}#vencimientos`,
  dueSoonAnchor: () => `${ROUTES.dashboard}#vencimientos`,
  byHealth: (h: Health) => `${ROUTES.projects}?health=${h}`,
  byStatus: (s: ProjectStatus) => `${ROUTES.projects}?status=${s}`,
  byProduct: (productId: string) => ROUTES.projectsByProduct(productId),
  personTasks: (personId: string) => `${ROUTES.myTasks}?person=${encodeURIComponent(personId)}`,
} as const;
