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

export function getGitHubConnectUrl(): string {
  return url("/github/connect");
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
