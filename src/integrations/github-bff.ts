import type { GitHubRepository } from "./github-types";

export type GitHubBffResult<T> =
  | { ok: true; data: T }
  | { ok: false; kind: "http" | "network" | "invalid"; message: string; status?: number };

export interface GitHubConnectionSummary {
  connectionId: string;
  githubUserId: number;
  githubLogin: string;
  installationId: number;
  expiresAt: string;
}

export interface GitHubProjectSummary {
  id: string;
  number: number;
  title: string;
  shortDescription?: string | null;
  ownerLogin: string;
  public?: boolean | null;
}

/**
 * Public base of the GitHub BFF.
 * - If `VITE_GITHUB_BFF_URL` is set (e.g. https://hito.autos/api), use it.
 * - Otherwise default to same-origin `/api`.
 */
function resolveBffBase(): string {
  const raw = (import.meta.env.VITE_GITHUB_BFF_URL as string | undefined)?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "/api";
}

const BFF_BASE_URL = resolveBffBase();

export function isGitHubBffConfigured(): boolean {
  return Boolean(BFF_BASE_URL);
}

function url(path: string): string {
  if (!BFF_BASE_URL) throw new Error("Falta configurar VITE_GITHUB_BFF_URL.");
  return `${BFF_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<GitHubBffResult<T>> {
  let response: Response;
  try {
    response = await fetch(url(path), {
      ...init,
      headers: { Accept: "application/json", ...init?.headers },
      signal: init?.signal ?? AbortSignal.timeout(20_000),
    });
  } catch (error) {
    return {
      ok: false,
      kind: "network",
      message: error instanceof Error ? error.message : "Error de red.",
    };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return {
      ok: false,
      kind: "invalid",
      message: "El backend de GitHub no devolvió JSON válido.",
      status: response.status,
    };
  }
  if (!response.ok) {
    const message =
      body && typeof body === "object" && "message" in body && typeof body.message === "string"
        ? body.message
        : `El backend de GitHub respondió HTTP ${response.status}.`;
    return { ok: false, kind: "http", message, status: response.status };
  }
  return { ok: true, data: body as T };
}

/**
 * BFF start URL. Default is authorize-only (GitHub vuelve al callback);
 * pasa mode=install solo para abrir la UI de instalación de la App.
 */
export function getGitHubConnectUrl(options?: { mode?: "install" | "oauth"; linkId?: string }): string {
  const base = url("/github/connect");
  const params = new URLSearchParams();
  if (options?.mode === "install") params.set("mode", "install");
  if (options?.linkId) params.set("linkId", options.linkId);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

/** Server OAuth callback — used when GitHub returns `code` to the SPA Setup URL. */
export function getGitHubCallbackUrl(query: {
  code: string;
  state: string;
  installationId?: string | null;
}): string {
  const base = url("/github/callback");
  const params = new URLSearchParams({
    code: query.code,
    state: query.state,
  });
  if (query.installationId) params.set("installation_id", query.installationId);
  return `${base}?${params.toString()}`;
}

export function getGitHubConnectPageUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/github/connect`;
  }
  return "/github/connect";
}

export function getGitHubConnection(id: string): Promise<GitHubBffResult<GitHubConnectionSummary>> {
  return request(`/github/connection/${encodeURIComponent(id)}`);
}

export function getGitHubRepositories(id: string): Promise<GitHubBffResult<GitHubRepository[]>> {
  return request(`/github/connection/${encodeURIComponent(id)}/repositories`);
}

export function createGitHubRepository(
  connectionId: string,
  input: {
    name: string;
    description?: string;
    private?: boolean;
    autoInit?: boolean;
    /** Org login si se crea bajo organización; omitir para cuenta personal. */
    owner?: string;
  },
): Promise<GitHubBffResult<GitHubRepository>> {
  return request(`/github/connection/${encodeURIComponent(connectionId)}/repositories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: input.name,
      description: input.description,
      private: input.private ?? true,
      autoInit: input.autoInit ?? true,
      owner: input.owner,
    }),
  });
}

export function getGitHubProjects(
  id: string,
  owner: string,
): Promise<GitHubBffResult<GitHubProjectSummary[]>> {
  return request(
    `/github/connection/${encodeURIComponent(id)}/projects?owner=${encodeURIComponent(owner)}`,
  );
}

export function createGitHubProjectRemote(
  connectionId: string,
  input: {
    owner: string;
    title: string;
    /** GraphQL node id del repo — mejora acceso con repos privados. */
    repositoryNodeId?: string;
    /** Por defecto true: Project privado. */
    makePrivate?: boolean;
  },
): Promise<GitHubBffResult<GitHubProjectSummary>> {
  return request(`/github/connection/${encodeURIComponent(connectionId)}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      owner: input.owner,
      title: input.title,
      repositoryNodeId: input.repositoryNodeId,
      makePrivate: input.makePrivate ?? true,
    }),
  });
}

export function updateGitHubProjectRemote(
  connectionId: string,
  input: {
    projectId: string;
    title?: string;
    shortDescription?: string | null;
    public?: boolean;
  },
): Promise<GitHubBffResult<GitHubProjectSummary>> {
  return request(`/github/connection/${encodeURIComponent(connectionId)}/projects`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function revokeGitHubConnection(id: string): Promise<GitHubBffResult<{ revoked: true }>> {
  return request(`/github/connection/${encodeURIComponent(id)}/revoke`, { method: "POST" });
}

export type GitHubRepoFile = {
  path: string;
  sha: string;
  content: string;
  size: number;
  /** Presente si se pidió encoding=base64 (binarios). */
  encoding?: "utf-8" | "base64" | string;
};

export type GitHubRepoFilePutResult = {
  path: string;
  sha: string;
  commitSha: string;
  htmlUrl: string | null;
};

/** Lee un archivo del repositorio (Contents API). */
export function getGitHubRepoFile(
  connectionId: string,
  input: {
    owner: string;
    repo: string;
    path: string;
    /** base64 = contenido binario sin decodificar a UTF-8. */
    encoding?: "utf-8" | "base64";
  },
): Promise<GitHubBffResult<GitHubRepoFile>> {
  const q = new URLSearchParams({
    owner: input.owner,
    repo: input.repo,
    path: input.path,
  });
  if (input.encoding === "base64") q.set("encoding", "base64");
  return request(`/github/connection/${encodeURIComponent(connectionId)}/contents?${q}`);
}

/** Crea o actualiza un archivo en el repositorio (commit). */
export function putGitHubRepoFile(
  connectionId: string,
  input: {
    owner: string;
    repo: string;
    path: string;
    content: string;
    message: string;
    sha?: string;
    branch?: string;
    /** base64 = `content` ya está en base64 (adjuntos). Default utf-8. */
    encoding?: "utf-8" | "base64";
  },
): Promise<GitHubBffResult<GitHubRepoFilePutResult>> {
  return request(`/github/connection/${encodeURIComponent(connectionId)}/contents`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
