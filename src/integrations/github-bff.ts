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
  ownerLogin: string;
}

const BFF_BASE_URL = (import.meta.env.VITE_GITHUB_BFF_URL as string | undefined)?.replace(/\/$/, "") ?? "";

function url(path: string): string {
  if (!BFF_BASE_URL) throw new Error("Falta configurar VITE_GITHUB_BFF_URL.");
  return `${BFF_BASE_URL}${path}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<GitHubBffResult<T>> {
  let response: Response;
  try {
    response = await fetch(url(path), {
      ...init,
      headers: { Accept: "application/json", ...init?.headers },
      signal: init?.signal ?? AbortSignal.timeout(15_000),
    });
  } catch (error) {
    return { ok: false, kind: "network", message: error instanceof Error ? error.message : "Error de red." };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { ok: false, kind: "invalid", message: "El backend de GitHub no devolvió JSON válido.", status: response.status };
  }
  if (!response.ok) {
    const message = body && typeof body === "object" && "message" in body && typeof body.message === "string"
      ? body.message
      : `El backend de GitHub respondió HTTP ${response.status}.`;
    return { ok: false, kind: "http", message, status: response.status };
  }
  return { ok: true, data: body as T };
}

export function getGitHubConnectUrl(): string {
  return url("/github/connect");
}

export function getGitHubConnection(id: string): Promise<GitHubBffResult<GitHubConnectionSummary>> {
  return request(`/github/connection/${encodeURIComponent(id)}`);
}

export function getGitHubRepositories(id: string): Promise<GitHubBffResult<GitHubRepository[]>> {
  return request(`/github/connection/${encodeURIComponent(id)}/repositories`);
}

export function getGitHubProjects(id: string, owner: string): Promise<GitHubBffResult<GitHubProjectSummary[]>> {
  return request(`/github/connection/${encodeURIComponent(id)}/projects?owner=${encodeURIComponent(owner)}`);
}

export function revokeGitHubConnection(id: string): Promise<GitHubBffResult<{ revoked: true }>> {
  return request(`/github/connection/${encodeURIComponent(id)}/revoke`, { method: "POST" });
}
