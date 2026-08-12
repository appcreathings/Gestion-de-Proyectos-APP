import { integrationDb } from "@/storage/integration-db";
import type {
  GitHubConnection,
  GitHubLink,
  GitHubMapping,
  GitHubSyncRun,
  GitHubSyncSchedule,
} from "@/storage/integration-db";

export type { GitHubConnection, GitHubLink, GitHubMapping, GitHubSyncRun, GitHubSyncSchedule };

export async function getGitHubConnections(): Promise<GitHubConnection[]> {
  return integrationDb.githubConnections.toArray();
}

export async function saveGitHubConnection(
  input: Omit<GitHubConnection, "createdAt" | "updatedAt">
): Promise<GitHubConnection> {
  const now = new Date().toISOString();
  const connection: GitHubConnection = { ...input, createdAt: now, updatedAt: now };
  await integrationDb.githubConnections.put(connection);
  return connection;
}

export async function deleteGitHubConnection(id: string): Promise<void> {
  await integrationDb.transaction("rw", [integrationDb.githubConnections, integrationDb.githubLinks], async () => {
    await integrationDb.githubConnections.delete(id);
    await integrationDb.githubLinks.where("connectionId").equals(id).modify({ status: "disconnected" });
  });
}

export async function getGitHubLinks(projectId?: string): Promise<GitHubLink[]> {
  return projectId
    ? integrationDb.githubLinks.where("projectId").equals(projectId).toArray()
    : integrationDb.githubLinks.toArray();
}

export async function saveGitHubLink(link: GitHubLink): Promise<void> {
  await integrationDb.githubLinks.put(link);
}

export async function getGitHubMappings(linkId: string): Promise<GitHubMapping[]> {
  return integrationDb.githubMappings.where("linkId").equals(linkId).toArray();
}

export async function saveGitHubMapping(mapping: GitHubMapping): Promise<void> {
  await integrationDb.githubMappings.put(mapping);
}

export async function createGitHubSyncRun(linkId: string): Promise<GitHubSyncRun> {
  const run: GitHubSyncRun = {
    id: crypto.randomUUID(),
    linkId,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    status: "running",
    created: 0,
    updated: 0,
    skipped: 0,
    conflicts: 0,
    errors: [],
  };
  await integrationDb.githubSyncRuns.add(run);
  return run;
}

export async function finishGitHubSyncRun(
  id: string,
  result: Omit<GitHubSyncRun, "id" | "startedAt" | "linkId">
): Promise<void> {
  await integrationDb.githubSyncRuns.update(id, { ...result, finishedAt: result.finishedAt ?? new Date().toISOString() });
}

export const GITHUB_SCHEDULE_MS: Record<GitHubSyncSchedule, number | null> = {
  manual: null,
  "5m": 5 * 60_000,
  "15m": 15 * 60_000,
  "30m": 30 * 60_000,
  "1h": 60 * 60_000,
  "6h": 6 * 60 * 60_000,
  "24h": 24 * 60 * 60_000,
};

export function getNextGitHubSyncAt(schedule: GitHubSyncSchedule, from = Date.now()): string | null {
  const interval = GITHUB_SCHEDULE_MS[schedule];
  return interval === null ? null : new Date(from + interval).toISOString();
}
