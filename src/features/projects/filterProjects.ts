import { effectiveHealth } from "@/domain/health";
import { isStalled } from "@/domain/compute";
import type { Health, Project, ProjectStatus, Settings } from "@/domain/schemas";

const STATUSES: readonly ProjectStatus[] = [
  "backlog",
  "active",
  "paused",
  "blocked",
  "done",
  "archived",
];
const HEALTHS: readonly Health[] = ["red", "amber", "green"];

export type ProjectsQuery = {
  productId: string | null;
  status: ProjectStatus | null;
  health: Health | null;
  stalled: boolean;
  /** No filtra: la página lo usa para vista «Por trimestre» + highlight (D15). */
  quarterId: string | null;
};

function isStatus(v: string | null): v is ProjectStatus {
  return v !== null && (STATUSES as readonly string[]).includes(v);
}

function isHealth(v: string | null): v is Health {
  return v !== null && (HEALTHS as readonly string[]).includes(v);
}

export function parseProjectsQuery(params: URLSearchParams): ProjectsQuery {
  const statusRaw = params.get("status");
  const healthRaw = params.get("health");
  return {
    productId: params.get("product"),
    status: isStatus(statusRaw) ? statusRaw : null,
    health: isHealth(healthRaw) ? healthRaw : null,
    stalled: params.get("stalled") === "1",
    quarterId: params.get("quarter"),
  };
}

export function applyProjectsFilter(
  params: URLSearchParams,
  key: "product" | "status" | "health" | "stalled",
  value: string | null,
): URLSearchParams {
  const next = new URLSearchParams(params);
  if (key === "stalled") {
    if (value === "1") next.set("stalled", "1");
    else next.delete("stalled");
    return next;
  }
  if (!value) next.delete(key);
  else next.set(key, value);
  return next;
}

/**
 * Filtro AND de `/app/projects` (spec 063). Un proyecto `done`/`archived`
 * nunca entra con `health` (D14) ni con `stalled=1` (`isStalled` ya lo excluye).
 * Un `product` que no existe en `knownProductIds` se ignora (D5/§4).
 * Sin `settings` (workspace sin hidratar) `health`/`stalled` se ignoran;
 * `status`/`product` sí aplican (design §5).
 */
export function filterProjectsByQuery(
  projects: Project[],
  query: ProjectsQuery,
  settings: Settings | null,
  now: Date,
  knownProductIds: ReadonlySet<string>,
): Project[] {
  const productOk =
    query.productId !== null && knownProductIds.has(query.productId)
      ? query.productId
      : null;

  return projects.filter((p) => {
    if (productOk && p.productId !== productOk) return false;
    if (query.status && p.status !== query.status) return false;
    if (query.health && settings) {
      if (p.status === "done" || p.status === "archived") return false; // D14
      if (effectiveHealth(p, settings, now) !== query.health) return false;
    }
    if (query.stalled && settings && !isStalled(p, settings.stalledAfterDays, now)) return false;
    return true;
  });
}
