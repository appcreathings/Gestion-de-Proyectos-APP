/**
 * Sincroniza proyectos de Hito **como archivos en el repositorio GitHub**.
 * No crea GitHub Projects ni issues.
 *
 * Rutas:
 *   .hito/projects/{projectId}.json
 *   .hito/manifest.json
 *   .hito/attachments/...   (modo full: recursos salvo videos)
 */

import type { Attachment } from "@/domain/schemas/attachment";
import type { Project, Task, Area } from "@/domain/schemas";
import { ProjectSchema } from "@/domain/schemas/project";
import { nowIso } from "@/lib/utils";
import type { GitHubLink, GitHubSyncMode } from "@/storage/integration-db";
import { getGitHubRepoFile, putGitHubRepoFile } from "./github-bff";
import { saveGitHubLink } from "./github-sync";

export const HITO_REPO_ROOT = ".hito";
export const HITO_PROJECTS_DIR = `${HITO_REPO_ROOT}/projects`;
export const HITO_MANIFEST_PATH = `${HITO_REPO_ROOT}/manifest.json`;

/**
 * Tope del BFF (~1.5 MB de body en base64 ≈ ~1 MB binario).
 * Videos se omiten siempre; archivos mayores se saltan con aviso.
 */
export const MAX_GITHUB_ATTACHMENT_BYTES = 1_000_000;

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

export type AttachmentSyncStats = {
  uploaded: number;
  downloaded: number;
  skippedVideo: number;
  skippedLarge: number;
  skippedMissing: number;
  failed: number;
};

export type RepoSyncResult =
  | {
      ok: true;
      path: string;
      commitSha?: string;
      link: GitHubLink;
      attachments?: AttachmentSyncStats;
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
  full: "Todo + comentarios y recursos (PDF, imágenes, docs…). No sube videos ni archivos >1 MB.",
};

/** URL pública del repositorio en github.com. */
export function githubRepoHtmlUrl(owner: string, repository: string): string {
  return `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`;
}

export function projectRepoPath(projectId: string): string {
  const safe = projectId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${HITO_PROJECTS_DIR}/${safe}.json`;
}

/** Ruta del adjunto en el repo: `.hito/attachments/...` */
export function attachmentRepoPath(relativePath: string): string {
  const clean = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!clean.startsWith("attachments/")) {
    throw new Error(`Ruta de adjunto inválida: ${relativePath}`);
  }
  if (clean.includes("..")) {
    throw new Error(`Ruta de adjunto insegura: ${relativePath}`);
  }
  return `${HITO_REPO_ROOT}/${clean}`;
}

/** Recoge todos los adjuntos del árbol del proyecto. */
export function collectProjectAttachments(project: Project): Attachment[] {
  const out: Attachment[] = [];
  for (const a of project.attachments ?? []) out.push(a);
  for (const task of project.tasks ?? []) {
    for (const a of task.attachments ?? []) out.push(a);
  }
  for (const area of project.areas ?? []) {
    for (const a of area.attachments ?? []) out.push(a);
    for (const proc of area.processes ?? []) {
      for (const a of proc.attachments ?? []) out.push(a);
    }
  }
  // Dedup por id
  const seen = new Set<string>();
  return out.filter((a) => {
    if (seen.has(a.id)) return false;
    seen.add(a.id);
    return true;
  });
}

export function emptyAttachmentStats(): AttachmentSyncStats {
  return {
    uploaded: 0,
    downloaded: 0,
    skippedVideo: 0,
    skippedLarge: 0,
    skippedMissing: 0,
    failed: 0,
  };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("No se pudo leer el archivo como base64."));
        return;
      }
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Error leyendo el adjunto."));
    reader.readAsDataURL(blob);
  });
}

function base64ToUint8Array(b64: string): Uint8Array {
  const clean = b64.replace(/\s/g, "");
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/**
 * Sube adjuntos del proyecto al repo (modo full).
 * Omite videos y archivos que superan el límite del BFF.
 */
export async function pushProjectAttachments(input: {
  backendConnectionId: string;
  link: GitHubLink;
  project: Project;
  readBlob: (relativePath: string) => Promise<Blob>;
}): Promise<AttachmentSyncStats> {
  const stats = emptyAttachmentStats();
  const attachments = collectProjectAttachments(input.project);

  for (const att of attachments) {
    if (att.kind === "video") {
      stats.skippedVideo += 1;
      continue;
    }
    if (att.size > MAX_GITHUB_ATTACHMENT_BYTES) {
      stats.skippedLarge += 1;
      continue;
    }

    let blob: Blob;
    try {
      blob = await input.readBlob(att.relativePath);
    } catch {
      stats.skippedMissing += 1;
      continue;
    }

    if (blob.size > MAX_GITHUB_ATTACHMENT_BYTES) {
      stats.skippedLarge += 1;
      continue;
    }

    let path: string;
    try {
      path = attachmentRepoPath(att.relativePath);
    } catch {
      stats.failed += 1;
      continue;
    }

    let contentB64: string;
    try {
      contentB64 = await blobToBase64(blob);
    } catch {
      stats.failed += 1;
      continue;
    }

    let sha: string | undefined;
    const existing = await getGitHubRepoFile(input.backendConnectionId, {
      owner: input.link.owner,
      repo: input.link.repository,
      path,
      encoding: "base64",
    });
    if (existing.ok) sha = existing.data.sha;

    const put = await putGitHubRepoFile(input.backendConnectionId, {
      owner: input.link.owner,
      repo: input.link.repository,
      path,
      content: contentB64,
      encoding: "base64",
      message: `chore(hito): sync attachment «${att.name}»`,
      sha,
    });
    if (put.ok) stats.uploaded += 1;
    else stats.failed += 1;
  }

  return stats;
}

/**
 * Descarga adjuntos no-video del repo al workspace local (modo full al recibir).
 */
export async function pullProjectAttachments(input: {
  backendConnectionId: string;
  link: GitHubLink;
  project: Project;
  writeBlob: (relativePath: string, data: Blob | Uint8Array) => Promise<void>;
}): Promise<AttachmentSyncStats> {
  const stats = emptyAttachmentStats();
  const attachments = collectProjectAttachments(input.project);

  for (const att of attachments) {
    if (att.kind === "video") {
      stats.skippedVideo += 1;
      continue;
    }

    let path: string;
    try {
      path = attachmentRepoPath(att.relativePath);
    } catch {
      stats.failed += 1;
      continue;
    }

    const file = await getGitHubRepoFile(input.backendConnectionId, {
      owner: input.link.owner,
      repo: input.link.repository,
      path,
      encoding: "base64",
    });
    if (!file.ok) {
      if (file.status === 404) stats.skippedMissing += 1;
      else stats.failed += 1;
      continue;
    }

    try {
      const bytes = base64ToUint8Array(file.data.content);
      // Copia a ArrayBuffer “propio” para satisfacer BlobPart en TS estricto.
      const copy = new Uint8Array(bytes.byteLength);
      copy.set(bytes);
      const blob = new Blob([copy.buffer], {
        type: att.mimeType || "application/octet-stream",
      });
      await input.writeBlob(att.relativePath, blob);
      stats.downloaded += 1;
    } catch {
      stats.failed += 1;
    }
  }

  return stats;
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
 * En modo `full` y con `readBlob`, también sube recursos (excepto videos).
 */
export async function pushProjectToRepo(input: {
  backendConnectionId: string;
  link: GitHubLink;
  project: Project;
  syncMode?: GitHubSyncMode;
  /** Necesario en modo full para subir binarios de adjuntos. */
  readBlob?: (relativePath: string) => Promise<Blob>;
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

  let attachments: AttachmentSyncStats | undefined;
  if (mode === "full" && input.readBlob) {
    attachments = await pushProjectAttachments({
      backendConnectionId,
      link,
      project,
      readBlob: input.readBlob,
    });
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
    attachments,
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
  /** En modo full, descarga recursos del repo al workspace. */
  writeBlob?: (relativePath: string, data: Blob | Uint8Array) => Promise<void>;
}): Promise<PullResult & { attachments?: AttachmentSyncStats }> {
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

  let attachments: AttachmentSyncStats | undefined;
  const pullMode = link.syncMode ?? parsed.syncMode ?? "medium";
  if (pullMode === "full" && input.writeBlob) {
    attachments = await pullProjectAttachments({
      backendConnectionId,
      link,
      project: remoteProject,
      writeBlob: input.writeBlob,
    });
  }

  return { ok: true, project: remoteProject, changed, link: nextLink, attachments };
}

export async function pushAllLinkedProjects(input: {
  backendConnectionId: string;
  links: GitHubLink[];
  projectsById: Map<string, Project>;
  syncMode?: GitHubSyncMode;
  readBlob?: (relativePath: string) => Promise<Blob>;
}): Promise<{
  ok: number;
  failed: Array<{ projectId: string; name: string; message: string }>;
  attachmentsUploaded: number;
}> {
  const failed: Array<{ projectId: string; name: string; message: string }> = [];
  let ok = 0;
  let attachmentsUploaded = 0;

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
      readBlob: input.readBlob,
    });
    if (result.ok) {
      ok += 1;
      attachmentsUploaded += result.attachments?.uploaded ?? 0;
    } else {
      failed.push({
        projectId: project.id,
        name: project.name,
        message: result.message,
      });
    }
  }

  return { ok, failed, attachmentsUploaded };
}

/** Texto breve para toasts con stats de recursos. */
export function formatAttachmentStats(stats?: AttachmentSyncStats | null): string {
  if (!stats) return "";
  const parts: string[] = [];
  if (stats.uploaded) parts.push(`${stats.uploaded} recurso${stats.uploaded === 1 ? "" : "s"} subido${stats.uploaded === 1 ? "" : "s"}`);
  if (stats.downloaded) parts.push(`${stats.downloaded} recurso${stats.downloaded === 1 ? "" : "s"} descargado${stats.downloaded === 1 ? "" : "s"}`);
  if (stats.skippedVideo) parts.push(`${stats.skippedVideo} video${stats.skippedVideo === 1 ? "" : "s"} omitido${stats.skippedVideo === 1 ? "" : "s"}`);
  if (stats.skippedLarge) parts.push(`${stats.skippedLarge} demasiado grande${stats.skippedLarge === 1 ? "" : "s"}`);
  if (stats.skippedMissing) parts.push(`${stats.skippedMissing} no encontrado${stats.skippedMissing === 1 ? "" : "s"}`);
  if (stats.failed) parts.push(`${stats.failed} con error`);
  return parts.length ? ` · ${parts.join(", ")}` : "";
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
