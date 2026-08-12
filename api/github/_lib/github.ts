import { createAppJwt } from "./crypto.js";

const GITHUB_API = "https://api.github.com";
const ACCEPT = "application/vnd.github+json";
const API_VERSION = "2022-11-28";

export type GitHubUser = {
  id: number;
  login: string;
};

export type GitHubInstallation = {
  id: number;
  account: { login: string; id: number } | null;
};

export type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  description: string | null;
  owner: { login: string };
};

async function gh<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<{ ok: true; data: T } | { ok: false; status: number; message: string }> {
  try {
    const headers = new Headers(init.headers);
    headers.set("Accept", ACCEPT);
    headers.set("X-GitHub-Api-Version", API_VERSION);
    headers.set("User-Agent", "Hito-GitHub-BFF");
    if (init.token) headers.set("Authorization", `Bearer ${init.token}`);

    const res = await fetch(path.startsWith("http") ? path : `${GITHUB_API}${path}`, {
      ...init,
      headers,
    });

    const text = await res.text();
    let body: unknown = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    if (!res.ok) {
      const message =
        body &&
        typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof (body as { message: unknown }).message === "string"
          ? (body as { message: string }).message
          : `GitHub HTTP ${res.status}`;
      return { ok: false, status: res.status, message };
    }

    return { ok: true, data: body as T };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      message: error instanceof Error ? error.message : "Error de red con GitHub.",
    };
  }
}

export async function exchangeOAuthCode(
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string,
): Promise<{ ok: true; accessToken: string } | { ok: false; message: string }> {
  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });
    const data = (await res.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };
    if (!data.access_token) {
      return {
        ok: false,
        message: data.error_description || data.error || "No se pudo canjear el código OAuth.",
      };
    }
    return { ok: true, accessToken: data.access_token };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error al canjear el código OAuth.",
    };
  }
}

export async function getAuthenticatedUser(token: string) {
  return gh<GitHubUser>("/user", { token });
}

export async function listUserInstallations(token: string) {
  return gh<{ installations: GitHubInstallation[] }>("/user/installations", { token });
}

export async function createInstallationToken(
  appId: string,
  privateKey: string,
  installationId: number,
): Promise<{ ok: true; token: string; expiresAt: string } | { ok: false; message: string }> {
  const jwt = createAppJwt(appId, privateKey);
  if (!jwt.ok) return { ok: false, message: jwt.message };

  const result = await gh<{ token: string; expires_at: string }>(
    `/app/installations/${installationId}/access_tokens`,
    { method: "POST", token: jwt.jwt },
  );
  if (!result.ok) return { ok: false, message: result.message };
  return { ok: true, token: result.data.token, expiresAt: result.data.expires_at };
}

export async function listInstallationRepos(
  installationToken: string,
): Promise<{ ok: true; repos: GitHubRepository[] } | { ok: false; message: string }> {
  const repos: GitHubRepository[] = [];
  let page = 1;
  while (page <= 10) {
    const result = await gh<{ repositories: GitHubRepository[]; total_count: number }>(
      `/installation/repositories?per_page=100&page=${page}`,
      { token: installationToken },
    );
    if (!result.ok) return { ok: false, message: result.message };
    repos.push(...(result.data.repositories ?? []));
    if (
      repos.length >= (result.data.total_count ?? 0) ||
      (result.data.repositories ?? []).length === 0
    ) {
      break;
    }
    page += 1;
  }
  return { ok: true, repos };
}

type GhProject = { id: string; number: number; title: string; shortDescription?: string | null };

async function graphql<T>(
  installationToken: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  try {
    const res = await fetch(`${GITHUB_API}/graphql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${installationToken}`,
        Accept: ACCEPT,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": API_VERSION,
        "User-Agent": "Hito-GitHub-BFF",
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = (await res.json()) as {
      data?: T;
      errors?: Array<{ message: string }>;
    };
    if (!res.ok || json.errors?.length) {
      return {
        ok: false,
        message: json.errors?.[0]?.message ?? `GraphQL HTTP ${res.status}`,
      };
    }
    if (!json.data) return { ok: false, message: "Respuesta GraphQL vacía." };
    return { ok: true, data: json.data };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error GraphQL con GitHub.",
    };
  }
}

export async function listOrgProjects(
  installationToken: string,
  owner: string,
): Promise<
  | {
      ok: true;
      projects: Array<{
        id: string;
        number: number;
        title: string;
        shortDescription: string | null;
        ownerLogin: string;
      }>;
    }
  | { ok: false; message: string }
> {
  const query = `
    query($login: String!) {
      user(login: $login) {
        projectsV2(first: 40) { nodes { id number title shortDescription } }
      }
      organization(login: $login) {
        projectsV2(first: 40) { nodes { id number title shortDescription } }
      }
    }
  `;
  const result = await graphql<{
    user?: { projectsV2?: { nodes?: Array<GhProject | null> } };
    organization?: { projectsV2?: { nodes?: Array<GhProject | null> } };
  }>(installationToken, query, { login: owner });
  if (!result.ok) return result;

  const nodes = [
    ...(result.data.user?.projectsV2?.nodes ?? []),
    ...(result.data.organization?.projectsV2?.nodes ?? []),
  ].filter((n): n is GhProject => Boolean(n));

  return {
    ok: true,
    projects: nodes.map((n) => ({
      id: n.id,
      number: n.number,
      title: n.title,
      shortDescription: n.shortDescription ?? null,
      ownerLogin: owner,
    })),
  };
}

export async function resolveOwnerNodeId(
  installationToken: string,
  owner: string,
): Promise<{ ok: true; ownerId: string; kind: "user" | "organization" } | { ok: false; message: string }> {
  const query = `
    query($login: String!) {
      user(login: $login) { id }
      organization(login: $login) { id }
    }
  `;
  const result = await graphql<{
    user?: { id: string } | null;
    organization?: { id: string } | null;
  }>(installationToken, query, { login: owner });
  if (!result.ok) return result;
  if (result.data.user?.id) return { ok: true, ownerId: result.data.user.id, kind: "user" };
  if (result.data.organization?.id) {
    return { ok: true, ownerId: result.data.organization.id, kind: "organization" };
  }
  return { ok: false, message: `No se encontró el owner "${owner}" en GitHub.` };
}

export async function createGitHubProject(
  installationToken: string,
  owner: string,
  title: string,
): Promise<
  | { ok: true; project: { id: string; number: number; title: string; shortDescription: string | null; ownerLogin: string } }
  | { ok: false; message: string }
> {
  const ownerRes = await resolveOwnerNodeId(installationToken, owner);
  if (!ownerRes.ok) return ownerRes;

  const mutation = `
    mutation($ownerId: ID!, $title: String!) {
      createProjectV2(input: { ownerId: $ownerId, title: $title }) {
        projectV2 { id number title shortDescription }
      }
    }
  `;
  const result = await graphql<{
    createProjectV2?: { projectV2?: GhProject | null };
  }>(installationToken, mutation, { ownerId: ownerRes.ownerId, title });
  if (!result.ok) return result;
  const project = result.data.createProjectV2?.projectV2;
  if (!project) return { ok: false, message: "GitHub no devolvió el Project creado." };
  return {
    ok: true,
    project: {
      id: project.id,
      number: project.number,
      title: project.title,
      shortDescription: project.shortDescription ?? null,
      ownerLogin: owner,
    },
  };
}

export async function updateGitHubProject(
  installationToken: string,
  projectId: string,
  input: { title?: string; shortDescription?: string | null },
): Promise<
  | { ok: true; project: { id: string; number: number; title: string; shortDescription: string | null } }
  | { ok: false; message: string }
> {
  const mutation = `
    mutation($projectId: ID!, $title: String, $shortDescription: String) {
      updateProjectV2(input: {
        projectId: $projectId
        title: $title
        shortDescription: $shortDescription
      }) {
        projectV2 { id number title shortDescription }
      }
    }
  `;
  const result = await graphql<{
    updateProjectV2?: { projectV2?: GhProject | null };
  }>(installationToken, mutation, {
    projectId,
    title: input.title ?? null,
    shortDescription: input.shortDescription ?? null,
  });
  if (!result.ok) return result;
  const project = result.data.updateProjectV2?.projectV2;
  if (!project) return { ok: false, message: "GitHub no devolvió el Project actualizado." };
  return {
    ok: true,
    project: {
      id: project.id,
      number: project.number,
      title: project.title,
      shortDescription: project.shortDescription ?? null,
    },
  };
}

export async function getRepository(
  installationToken: string,
  owner: string,
  repo: string,
): Promise<{ ok: true; repo: GitHubRepository } | { ok: false; message: string }> {
  const result = await gh<GitHubRepository>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
    { token: installationToken },
  );
  if (!result.ok) return { ok: false, message: result.message };
  return {
    ok: true,
    repo: {
      ...result.data,
      description: result.data.description ?? null,
    },
  };
}

export async function updateRepositoryDescription(
  installationToken: string,
  owner: string,
  repo: string,
  description: string,
): Promise<{ ok: true; description: string | null } | { ok: false; message: string }> {
  const result = await gh<GitHubRepository>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
    {
      method: "PATCH",
      token: installationToken,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    },
  );
  if (!result.ok) return { ok: false, message: result.message };
  return { ok: true, description: result.data.description ?? null };
}
