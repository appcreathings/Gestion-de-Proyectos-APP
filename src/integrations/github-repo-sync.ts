/**
 * Sincroniza proyectos de Hito **como archivos en el repositorio GitHub**.
 * No crea GitHub Projects ni issues.
 *
 * Rutas:
 *   .hito/projects/{projectId}.json
 *   .hito/manifest.json
 */

import type { Project, Task, Area } from "@/domain/schemas";
import { ProjectSchema } from "@/domain/schemas/project";
import { nowIso } from "@/lib/utils";
import type { GitHubLink, GitHubSyncMode } from "@/storage/integration-db";
import { getGitHubRepoFile, putGitHubRepoFile } from "./github-bff";
import { saveGitHubLink } from "./github-sync";

export const HITO_REPO_ROOT = ".hito";
export const HITO_PROJECTS_DIR = `${HITO_REPO_ROOT}/projects`;
export const HITO_MANIFEST_PATH = `${HITO_REPO_ROOT}/manifest.json`;

export type HitoRepoManifest = {
  version: 1;
  updatedAt: string;
  projects: Array<{
    id: string;
    name: string;
    path: string;
    updatedAt: string;
    syncMode?: GitHubSyncMode;
  }>;
};

export type RepoSyncResult =
  | {
      ok: true;
      path: string;
      commitSha?: string;
      link: GitHubLink;
    }
  | { ok: false; message: string };

export type PullConflict = {
  kind: "conflict";
  localUpdatedAt: string;
  remoteUpdatedAt: string;
  lastSyncedAt: string | null;
  remoteProject: Project;
  localProject: Project;
};

export type PullResult =
  | { ok: true; project: Project; changed: boolean; link: GitHubLink }
  | { ok: false; message: string }
  | ({ ok: false; message: string } & PullConflict);

export const SYNC_MODE_LABELS: Record<GitHubSyncMode, string> = {
  light: "Ligera",
  medium: "Media",
  full: "Completa",
};

export const SYNC_MODE_HINTS: Record<GitHubSyncMode, string> = {
  light: "Nombre, descripción, estado, fechas y tags.",
  medium: "Ligera + tareas, áreas, milestones y sprints (sin comentarios ni adjuntos).",
  full: "Todo lo serializable, con comentarios y metadatos de adjuntos (sin binarios).",
};

export function projectRepoPath(projectId: string): string {
  const safe = projectId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${HITO_PROJECTS_DIR}/${safe}.json`;
}

function stripTaskForMode(task: Task, mode: GitHubSyncMode): Task {
  if (mode === "full") {
    return {
      ...task,
      attachments: (task.attachments ?? []).map((a) => ({ ...a })),
    };
  }
  // light no incluye tasks; medium sin comments/attachments
  return {
    ...task,
    comments: [],
    attachments: [],
  };
}

function stripAreaForMode(area: Area, mode: GitHubSyncMode): Area {
  if (mode === "light") return area;
  return {
    ...area,
    attachments: mode === "full" ? (area.attachments ?? []).map((a) => ({ ...a })) : [],
    processes: (area.processes ?? []).map((p) => ({
      ...p,
      attachments: mode === "full" ? (p.attachments ?? []).map((a) => ({ ...a })) : [],
    })),
    checklists: area.checklists ?? [],
  };
}

/** Proyecta el proyecto según el nivel de sync. */
export function projectForSyncMode(project: Project, mode: GitHubSyncMode): Project {
  if (mode === "light") {
    return {
      ...project,
      areas: [],
      tasks: [],
      milestones: [],
      sprints: [],
      attachments: [],
      stakeholders: project.stakeholders ?? [],
    };
  }

  if (mode === "medium") {
    return {
      ...project,
      tasks: (project.tasks ?? []).map((t) => stripTaskForMode(t, "medium")),
      areas: (project.areas ?? []).map((a) => stripAreaForMode(a, "medium")),
      attachments: [],
      milestones: project.milestones ?? [],
      sprints: project.sprints ?? [],
    };
  }

  // full
  return {
    ...project,
    tasks: (project.tasks ?? []).map((t) => stripTaskForMode(t, "full")),
    areas: (project.areas ?? []).map((a) => stripAreaForMode(a, "full")),
    attachments: (project.attachments ?? []).map((a) => ({ ...a })),
  };
}

export function buildProjectRepoPayload(
  project: Project,
  mode: GitHubSyncMode = "medium",
): {
  format: "hito-project";
  version: 1;
  syncMode: GitHubSyncMode;
  exportedAt: string;
  project: Project;
} {
  return {
    format: "hito-project",
    version: 1,
    syncMode: mode,
    exportedAt: nowIso(),
    project: projectForSyncMode(project, mode),
  };
}

export function parseProjectRepoPayload(
  raw: string,
): { ok: true; project: Project; syncMode?: GitHubSyncMode } | { ok: false; message: string } {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, message: "El archivo en el repo no es JSON válido." };
  }
  if (!data || typeof data !== "object") {
    return { ok: false, message: "JSON vacío o inválido en el repo." };
  }
  const obj = data as { format?: string; project?: unknown; syncMode?: string };
  const candidate = obj.project ?? data;
  const parsed = ProjectSchema.safeParse(candidate);
  if (!parsed.success) {
    return {
      ok: false,
      message: `El proyecto en el repo no cumple el schema: ${parsed.error.issues[0]?.message ?? "inválido"}`,
    };
  }
  const syncMode =
    obj.syncMode === "light" || obj.syncMode === "medium" || obj.syncMode === "full"
      ? obj.syncMode
      : undefined;
  return { ok: true, project: parsed.data, syncMode };
}

/** Detecta si local y remoto divergieron desde el último sync exitoso. */
export function detectPullConflict(input: {
  local: Project;
  remote: Project;
  lastSyncedProjectUpdatedAt?: string | null;
}): boolean {
  const { local, remote, lastSyncedProjectUpdatedAt } = input;
  if (local.updatedAt === remote.updatedAt) return false;
  // Primer pull: no forzar diálogo de conflicto; el usuario eligió recibir.
  if (!lastSyncedProjectUpdatedAt) return false;
  const localChanged = local.updatedAt !== lastSyncedProjectUpdatedAt;
  const remoteChanged = remote.updatedAt !== lastSyncedProjectUpdatedAt;
  return localChanged && remoteChanged;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  isRetryable: (err: T) => boolean,
  attempts = 3,
): Promise<T> {
  let last: T | undefined;
  for (let i = 0; i < attempts; i++) {
    last = await fn();
    if (!isRetryable(last)) return last;
    await new Promise((r) => setTimeout(r, 400 * (i + 1)));
  }
  return last as T;
}

/**
 * Sube el proyecto local al repositorio vinculado.
 */
export async function pushProjectToRepo(input: {
  backendConnectionId: string;
  link: GitHubLink;
  project: Project;
  syncMode?: GitHubSyncMode;
}): Promise<RepoSyncResult> {
  const { backendConnectionId, link, project } = input;
  const mode: GitHubSyncMode = input.syncMode ?? link.syncMode ?? "medium";
  const path = projectRepoPath(project.id);
  const payload = buildProjectRepoPayload(project, mode);
  const content = `${JSON.stringify(payload, null, 2)}\n`;

  const putResult = await withRetry(
    async () => {
      let sha: string | undefined;
      const existing = await getGitHubRepoFile(backendConnectionId, {
        owner: link.owner,
        repo: link.repository,
        path,
      });
      if (existing.ok) {
        sha = existing.data.sha;
      } else if (existing.status !== 404 && existing.kind === "http" && existing.status !== 404) {
        return { ok: false as const, message: existing.message, retry: existing.status === 502 || existing.status === 503 };
      } else if (!existing.ok && existing.kind === "network") {
        return { ok: false as const, message: existing.message, retry: true };
      }

      const put = await putGitHubRepoFile(backendConnectionId, {
        owner: link.owner,
        repo: link.repository,
        path,
        content,
        message: `chore(hito): sync project «${project.name}» [${mode}]`,
        sha,
      });
      if (!put.ok) {
        return {
          ok: false as const,
          message: put.message,
          retry: put.status === 502 || put.status === 503 || put.kind === "network",
        };
      }
      return {
        ok: true as const,
        commitSha: put.data.commitSha,
        retry: false,
      };
    },
    (r) => Boolean(r && "retry" in r && r.retry),
  );

  if (!putResult.ok) {
    const failedLink: GitHubLink = {
      ...link,
      status: "error",
      consecutiveFailures: (link.consecutiveFailures ?? 0) + 1,
      updatedAt: nowIso(),
    };
    await saveGitHubLink(failedLink);
    return { ok: false, message: putResult.message };
  }

  await upsertManifest(backendConnectionId, link, {
    id: project.id,
    name: project.name,
    path,
    updatedAt: project.updatedAt,
    syncMode: mode,
  });

  const nextLink: GitHubLink = {
    ...link,
    scope: "project",
    syncMode: mode,
    lastSyncAt: nowIso(),
    lastSuccessAt: nowIso(),
    lastSyncedProjectUpdatedAt: project.updatedAt,
    consecutiveFailures: 0,
    status: "active",
    remoteProjectTitle: project.name,
    remoteProjectDescription: project.description,
    updatedAt: nowIso(),
  };
  await saveGitHubLink(nextLink);

  return {
    ok: true,
    path,
    commitSha: putResult.commitSha,
    link: nextLink,
  };
}

/**
 * Baja el proyecto desde el repositorio.
 * Si hay conflicto y resolve !== 'remote'|'local', devuelve kind conflict.
 */
export async function pullProjectFromRepo(input: {
  backendConnectionId: string;
  link: GitHubLink;
  localProject?: Project | null;
  /** Si hay conflicto: 'remote' aplica remoto, 'local' mantiene local, omitir = reportar. */
  resolve?: "remote" | "local";
}): Promise<PullResult> {
  const { backendConnectionId, link, localProject } = input;
  const path = projectRepoPath(link.projectId);

  const file = await withRetry(
    async () => {
      const res = await getGitHubRepoFile(backendConnectionId, {
        owner: link.owner,
        repo: link.repository,
        path,
      });
      if (!res.ok && (res.kind === "network" || res.status === 502 || res.status === 503)) {
        return { ...res, retry: true };
      }
      return { ...res, retry: false };
    },
    (r) => Boolean(r && "retry" in r && r.retry),
  );

  if (!file.ok) {
    if (file.status === 404) {
      return {
        ok: false,
        message: `No hay datos de este proyecto en el repo (${path}). Usa «Enviar al repo» o «Sincronizar todo» primero.`,
      };
    }
    return { ok: false, message: file.message };
  }

  const parsed = parseProjectRepoPayload(file.data.content);
  if (!parsed.ok) return parsed;

  const remoteProject: Project = {
    ...parsed.project,
    id: link.projectId,
  };

  if (localProject) {
    const conflict = detectPullConflict({
      local: localProject,
      remote: remoteProject,
      lastSyncedProjectUpdatedAt: link.lastSyncedProjectUpdatedAt,
    });
    if (conflict && !input.resolve) {
      return {
        ok: false,
        kind: "conflict",
        message:
          "Conflicto: el proyecto cambió en Hito y en el repositorio desde la última sincronización.",
        localUpdatedAt: localProject.updatedAt,
        remoteUpdatedAt: remoteProject.updatedAt,
        lastSyncedAt: link.lastSyncedProjectUpdatedAt ?? null,
        remoteProject,
        localProject,
      };
    }
    if (conflict && input.resolve === "local") {
      const nextLink: GitHubLink = {
        ...link,
        lastSyncAt: nowIso(),
        status: "active",
        updatedAt: nowIso(),
      };
      await saveGitHubLink(nextLink);
      return { ok: true, project: localProject, changed: false, link: nextLink };
    }
  }

  const changed =
    !localProject ||
    localProject.updatedAt !== remoteProject.updatedAt ||
    JSON.stringify(projectForSyncMode(localProject, link.syncMode ?? "medium")) !==
      JSON.stringify(projectForSyncMode(remoteProject, link.syncMode ?? "medium"));

  const nextLink: GitHubLink = {
    ...link,
    lastSyncAt: nowIso(),
    lastSuccessAt: nowIso(),
    lastSyncedProjectUpdatedAt: remoteProject.updatedAt,
    consecutiveFailures: 0,
    status: "active",
    remoteProjectTitle: remoteProject.name,
    remoteProjectDescription: remoteProject.description,
    updatedAt: nowIso(),
  };
  await saveGitHubLink(nextLink);

  return { ok: true, project: remoteProject, changed, link: nextLink };
}

export async function pushAllLinkedProjects(input: {
  backendConnectionId: string;
  links: GitHubLink[];
  projectsById: Map<string, Project>;
  syncMode?: GitHubSyncMode;
}): Promise<{
  ok: number;
  failed: Array<{ projectId: string; name: string; message: string }>;
}> {
  const failed: Array<{ projectId: string; name: string; message: string }> = [];
  let ok = 0;

  for (const link of input.links) {
    if (link.status === "disconnected") continue;
    const project = input.projectsById.get(link.projectId);
    if (!project) {
      failed.push({
        projectId: link.projectId,
        name: link.projectId,
        message: "Proyecto local no encontrado.",
      });
      continue;
    }
    const result = await pushProjectToRepo({
      backendConnectionId: input.backendConnectionId,
      link,
      project,
      syncMode: input.syncMode ?? link.syncMode,
    });
    if (result.ok) ok += 1;
    else {
      failed.push({
        projectId: project.id,
        name: project.name,
        message: result.message,
      });
    }
  }

  return { ok, failed };
}

async function upsertManifest(
  backendConnectionId: string,
  link: GitHubLink,
  entry: HitoRepoManifest["projects"][number],
): Promise<void> {
  let manifest: HitoRepoManifest = {
    version: 1,
    updatedAt: nowIso(),
    projects: [],
  };
  let sha: string | undefined;

  const existing = await getGitHubRepoFile(backendConnectionId, {
    owner: link.owner,
    repo: link.repository,
    path: HITO_MANIFEST_PATH,
  });
  if (existing.ok) {
    sha = existing.data.sha;
    try {
      const parsed = JSON.parse(existing.data.content) as HitoRepoManifest;
      if (parsed && Array.isArray(parsed.projects)) {
        manifest = {
          version: 1,
          updatedAt: nowIso(),
          projects: parsed.projects.filter((p) => p && p.id !== entry.id),
        };
      }
    } catch {
      /* rewrite */
    }
  } else if (existing.status !== 404) {
    return;
  }

  manifest.projects.push(entry);
  manifest.projects.sort((a, b) => a.name.localeCompare(b.name, "es"));
  manifest.updatedAt = nowIso();

  await putGitHubRepoFile(backendConnectionId, {
    owner: link.owner,
    repo: link.repository,
    path: HITO_MANIFEST_PATH,
    content: `${JSON.stringify(manifest, null, 2)}\n`,
    message: "chore(hito): update manifest",
    sha,
  });
}
