/**
 * Sincroniza proyectos de Hito **como archivos en el repositorio GitHub**.
 * No crea GitHub Projects ni issues.
 *
 * Rutas en el repo:
 *   .hito/projects/{projectId}.json
 *   .hito/manifest.json
 */

import type { Project } from "@/domain/schemas";
import { ProjectSchema } from "@/domain/schemas/project";
import { nowIso } from "@/lib/utils";
import type { GitHubLink } from "@/storage/integration-db";
import {
  getGitHubRepoFile,
  putGitHubRepoFile,
  type GitHubBffResult,
} from "./github-bff";
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

export function projectRepoPath(projectId: string): string {
  // Evitar path traversal en ids raros.
  const safe = projectId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${HITO_PROJECTS_DIR}/${safe}.json`;
}

/** Payload que se escribe en el repo (proyecto completo serializable). */
export function buildProjectRepoPayload(project: Project): {
  format: "hito-project";
  version: 1;
  exportedAt: string;
  project: Project;
} {
  // Quitar adjuntos binarios: solo metadatos de attachments viajan en el JSON.
  const cleaned: Project = {
    ...project,
    attachments: (project.attachments ?? []).map((a) => ({
      ...a,
      // no hay blob en el schema típico; por si acaso no expandimos blobs
    })),
  };
  return {
    format: "hito-project",
    version: 1,
    exportedAt: nowIso(),
    project: cleaned,
  };
}

export function parseProjectRepoPayload(
  raw: string,
): { ok: true; project: Project } | { ok: false; message: string } {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, message: "El archivo en el repo no es JSON válido." };
  }
  if (!data || typeof data !== "object") {
    return { ok: false, message: "JSON vacío o inválido en el repo." };
  }
  const obj = data as { format?: string; project?: unknown };
  const candidate = obj.project ?? data;
  const parsed = ProjectSchema.safeParse(candidate);
  if (!parsed.success) {
    return {
      ok: false,
      message: `El proyecto en el repo no cumple el schema: ${parsed.error.issues[0]?.message ?? "inválido"}`,
    };
  }
  return { ok: true, project: parsed.data };
}

/**
 * Sube (push) el proyecto local al repositorio vinculado.
 * Crea o actualiza `.hito/projects/{id}.json` y refresca el manifest.
 */
export async function pushProjectToRepo(input: {
  backendConnectionId: string;
  link: GitHubLink;
  project: Project;
}): Promise<RepoSyncResult> {
  const { backendConnectionId, link, project } = input;
  const path = projectRepoPath(project.id);
  const payload = buildProjectRepoPayload(project);
  const content = `${JSON.stringify(payload, null, 2)}\n`;

  // SHA actual si el archivo existe (requerido para update).
  let sha: string | undefined;
  const existing = await getGitHubRepoFile(backendConnectionId, {
    owner: link.owner,
    repo: link.repository,
    path,
  });
  if (existing.ok) {
    sha = existing.data.sha;
  } else if (existing.status !== 404) {
    return { ok: false, message: existing.message };
  }

  const put = await putGitHubRepoFile(backendConnectionId, {
    owner: link.owner,
    repo: link.repository,
    path,
    content,
    message: `chore(hito): sync project «${project.name}»`,
    sha,
  });
  if (!put.ok) return { ok: false, message: put.message };

  // Actualizar manifest (best-effort).
  await upsertManifest(backendConnectionId, link, {
    id: project.id,
    name: project.name,
    path,
    updatedAt: project.updatedAt,
  });

  const nextLink: GitHubLink = {
    ...link,
    scope: "project",
    lastSyncAt: nowIso(),
    lastSuccessAt: nowIso(),
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
    commitSha: put.data.commitSha,
    link: nextLink,
  };
}

/**
 * Baja (pull) el proyecto desde el repositorio y lo valida.
 * El caller debe persistir con saveProject si ok.
 */
export async function pullProjectFromRepo(input: {
  backendConnectionId: string;
  link: GitHubLink;
  localProject?: Project | null;
}): Promise<
  | { ok: true; project: Project; changed: boolean; link: GitHubLink }
  | { ok: false; message: string }
> {
  const { backendConnectionId, link, localProject } = input;
  const path = projectRepoPath(link.projectId);
  const file = await getGitHubRepoFile(backendConnectionId, {
    owner: link.owner,
    repo: link.repository,
    path,
  });
  if (!file.ok) {
    if (file.status === 404) {
      return {
        ok: false,
        message: `No hay datos de este proyecto en el repo (${path}). Usa «Enviar» o «Sincronizar todo» primero.`,
      };
    }
    return { ok: false, message: file.message };
  }

  const parsed = parseProjectRepoPayload(file.data.content);
  if (!parsed.ok) return parsed;

  // Conservar el id local del vínculo (por si el JSON remoto tiene otro id).
  const project: Project = {
    ...parsed.project,
    id: link.projectId,
  };

  const changed =
    !localProject ||
    localProject.updatedAt !== project.updatedAt ||
    JSON.stringify(localProject) !== JSON.stringify(project);

  const nextLink: GitHubLink = {
    ...link,
    lastSyncAt: nowIso(),
    lastSuccessAt: nowIso(),
    consecutiveFailures: 0,
    status: "active",
    remoteProjectTitle: project.name,
    remoteProjectDescription: project.description,
    updatedAt: nowIso(),
  };
  await saveGitHubLink(nextLink);

  return { ok: true, project, changed, link: nextLink };
}

/** Empuja todos los proyectos vinculados (por cada link activo). */
export async function pushAllLinkedProjects(input: {
  backendConnectionId: string;
  links: GitHubLink[];
  projectsById: Map<string, Project>;
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
    return; // no bloquear el sync principal
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

/** Helper de tipos re-export para tests. */
export type { GitHubBffResult };
