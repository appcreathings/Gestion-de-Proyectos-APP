import { createAppJwt } from "./crypto";

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
  owner: { login: string };
};

async function gh<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<{ ok: true; data: T } | { ok: false; status: number; message: string }> {
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
      body && typeof body === "object" && body !== null && "message" in body && typeof (body as { message: unknown }).message === "string"
        ? (body as { message: string }).message
        : `GitHub HTTP ${res.status}`;
    return { ok: false, status: res.status, message };
  }

  return { ok: true, data: body as T };
}

export async function exchangeOAuthCode(
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string,
): Promise<{ ok: true; accessToken: string } | { ok: false; message: string }> {
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
  const result = await gh<{ token: string; expires_at: string }>(
    `/app/installations/${installationId}/access_tokens`,
    { method: "POST", token: jwt },
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
    repos.push(...result.data.repositories);
    if (repos.length >= result.data.total_count || result.data.repositories.length === 0) break;
    page += 1;
  }
  return { ok: true, repos };
}

export async function listOrgProjects(
  installationToken: string,
  owner: string,
): Promise<{ ok: true; projects: Array<{ id: string; number: number; title: string; ownerLogin: string }> } | { ok: false; message: string }> {
  // GitHub Projects v2 via GraphQL (user or org).
  const query = `
    query($login: String!) {
      user(login: $login) {
        projectsV2(first: 20) { nodes { id number title } }
      }
      organization(login: $login) {
        projectsV2(first: 20) { nodes { id number title } }
      }
    }
  `;
  const res = await fetch(`${GITHUB_API}/graphql`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${installationToken}`,
      Accept: ACCEPT,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": API_VERSION,
      "User-Agent": "Hito-GitHub-BFF",
    },
    body: JSON.stringify({ query, variables: { login: owner } }),
  });
  const json = (await res.json()) as {
    data?: {
      user?: { projectsV2?: { nodes?: Array<{ id: string; number: number; title: string } | null> } };
      organization?: { projectsV2?: { nodes?: Array<{ id: string; number: number; title: string } | null> } };
    };
    errors?: Array<{ message: string }>;
  };
  if (!res.ok || json.errors?.length) {
    return {
      ok: false,
      message: json.errors?.[0]?.message ?? `GraphQL HTTP ${res.status}`,
    };
  }
  const nodes = [
    ...(json.data?.user?.projectsV2?.nodes ?? []),
    ...(json.data?.organization?.projectsV2?.nodes ?? []),
  ].filter((n): n is { id: string; number: number; title: string } => Boolean(n));
  return {
    ok: true,
    projects: nodes.map((n) => ({
      id: n.id,
      number: n.number,
      title: n.title,
      ownerLogin: owner,
    })),
  };
}
