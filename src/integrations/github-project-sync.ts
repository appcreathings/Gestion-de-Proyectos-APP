/**
 * Sincronización de metadatos de proyecto Hito ↔ GitHub Project / repo.
 * No toca issues ni tareas.
 */

import type { Project } from "@/domain/schemas";
import { nowIso } from "@/lib/utils";
import type { GitHubLink } from "@/storage/integration-db";
import {
  createGitHubProjectRemote,
  getGitHubProjects,
  updateGitHubProjectRemote,
  type GitHubProjectSummary,
} from "./github-bff";
import { saveGitHubLink } from "./github-sync";

export type ProjectMetaSnapshot = {
  name: string;
  description: string;
};

export type ProjectSyncPlan = {
  local: ProjectMetaSnapshot;
  remote: ProjectMetaSnapshot;
  /** Campos locales que cambiarían al hacer pull. */
  pullChanges: Partial<ProjectMetaSnapshot>;
  /** Campos remotos que cambiarían al hacer push. */
  pushChanges: Partial<ProjectMetaSnapshot>;
};

export function buildProjectSyncPlan(
  local: ProjectMetaSnapshot,
  remote: ProjectMetaSnapshot,
): ProjectSyncPlan {
  const pullChanges: Partial<ProjectMetaSnapshot> = {};
  const pushChanges: Partial<ProjectMetaSnapshot> = {};

  if (remote.name.trim() && remote.name.trim() !== local.name.trim()) {
    pullChanges.name = remote.name.trim();
    pushChanges.name = local.name.trim();
  }
  // Descripción: pull solo si remoto trae texto y difiere; push si local tiene y difiere.
  if ((remote.description ?? "") !== (local.description ?? "")) {
    if (remote.description.trim()) pullChanges.description = remote.description;
    if (local.description.trim() || remote.description.trim()) {
      pushChanges.description = local.description;
    }
  }

  return { local, remote, pullChanges, pushChanges };
}

export function applyPullToProject(project: Project, pull: Partial<ProjectMetaSnapshot>): Project {
  return {
    ...project,
    name: pull.name?.trim() || project.name,
    description: pull.description !== undefined ? pull.description : project.description,
    updatedAt: nowIso(),
  };
}

export async function resolveRemoteProjectMeta(
  backendConnectionId: string,
  link: Pick<GitHubLink, "owner" | "projectNodeId" | "remoteProjectTitle" | "remoteProjectDescription" | "remoteRepositoryDescription">,
): Promise<{ ok: true; remote: ProjectMetaSnapshot; project?: GitHubProjectSummary } | { ok: false; message: string }> {
  if (!link.projectNodeId) {
    return {
      ok: true,
      remote: {
        name: link.remoteProjectTitle?.trim() || "",
        description:
          link.remoteProjectDescription?.trim() ||
          link.remoteRepositoryDescription?.trim() ||
          "",
      },
    };
  }

  const list = await getGitHubProjects(backendConnectionId, link.owner);
  if (!list.ok) return { ok: false, message: list.message };

  const project = list.data.find((p) => p.id === link.projectNodeId);
  if (!project) {
    return {
      ok: true,
      remote: {
        name: link.remoteProjectTitle?.trim() || "",
        description:
          link.remoteProjectDescription?.trim() ||
          link.remoteRepositoryDescription?.trim() ||
          "",
      },
    };
  }

  return {
    ok: true,
    project,
    remote: {
      name: project.title,
      description: project.shortDescription?.trim() || link.remoteRepositoryDescription?.trim() || "",
    },
  };
}

export async function pushProjectMetaToGitHub(input: {
  backendConnectionId: string;
  link: GitHubLink;
  local: ProjectMetaSnapshot;
  /** Node id GraphQL del repositorio (para Projects sobre repos privados). */
  repositoryNodeId?: string | null;
  /** Crear Project como privado (default true). */
  makePrivate?: boolean;
}): Promise<{ ok: true; link: GitHubLink } | { ok: false; message: string }> {
  const { backendConnectionId, link, local } = input;
  let projectNodeId = link.projectNodeId;
  let projectNumber = link.projectNumber;
  let remoteTitle = local.name.trim();
  let remoteDescription = local.description.trim();

  if (!projectNodeId) {
    const created = await createGitHubProjectRemote(backendConnectionId, {
      owner: link.owner,
      title: remoteTitle || link.repository,
      repositoryNodeId: input.repositoryNodeId || undefined,
      makePrivate: input.makePrivate ?? true,
    });
    if (!created.ok) return { ok: false, message: created.message };
    projectNodeId = created.data.id;
    projectNumber = created.data.number;
    remoteTitle = created.data.title;
    remoteDescription = created.data.shortDescription?.trim() || remoteDescription;
  } else {
    const updated = await updateGitHubProjectRemote(backendConnectionId, {
      projectId: projectNodeId,
      title: remoteTitle || undefined,
      shortDescription: remoteDescription || null,
      public: input.makePrivate === false ? true : false,
    });
    if (!updated.ok) return { ok: false, message: updated.message };
    remoteTitle = updated.data.title;
    remoteDescription = updated.data.shortDescription?.trim() || "";
  }

  const next: GitHubLink = {
    ...link,
    scope: "project",
    projectNodeId,
    projectNumber,
    remoteProjectTitle: remoteTitle,
    remoteProjectDescription: remoteDescription,
    lastSyncAt: nowIso(),
    lastSuccessAt: nowIso(),
    consecutiveFailures: 0,
    status: "active",
    updatedAt: nowIso(),
  };
  await saveGitHubLink(next);
  return { ok: true, link: next };
}

export async function pullProjectMetaFromGitHub(input: {
  backendConnectionId: string;
  link: GitHubLink;
  project: Project;
}): Promise<
  | { ok: true; project: Project; link: GitHubLink; changed: boolean }
  | { ok: false; message: string }
> {
  const remoteRes = await resolveRemoteProjectMeta(input.backendConnectionId, input.link);
  if (!remoteRes.ok) return remoteRes;

  const plan = buildProjectSyncPlan(
    { name: input.project.name, description: input.project.description },
    remoteRes.remote,
  );
  const hasPull = Object.keys(plan.pullChanges).length > 0;
  const nextProject = hasPull ? applyPullToProject(input.project, plan.pullChanges) : input.project;

  const nextLink: GitHubLink = {
    ...input.link,
    scope: "project",
    remoteProjectTitle: remoteRes.remote.name || input.link.remoteProjectTitle,
    remoteProjectDescription: remoteRes.remote.description || input.link.remoteProjectDescription,
    lastSyncAt: nowIso(),
    lastSuccessAt: nowIso(),
    consecutiveFailures: 0,
    status: "active",
    updatedAt: nowIso(),
  };
  await saveGitHubLink(nextLink);

  return { ok: true, project: nextProject, link: nextLink, changed: hasPull };
}
