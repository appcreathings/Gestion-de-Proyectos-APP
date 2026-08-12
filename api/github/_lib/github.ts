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
  node_id: string;
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

const ADMIN_HINT =
  " En la GitHub App: Repository permissions → Administration = Read and write, " +
  "guarda, acepta el nuevo permiso en la instalación y vuelve a Conectar GitHub en Hito. " +
  "Metadata sola no alcanza para crear repos.";

/**
 * Crea un repositorio.
 * GitHub Apps requieren permiso **Administration: write** (no solo Metadata/Contents).
 * - Usuario: user access token + POST /user/repos
 * - Org: installation token + POST /orgs/{org}/repos
 */
export async function createRepository(
  tokens: {
    userAccessToken?: string;
    installationToken: string;
    installationId?: number;
  },
  input: {
    name: string;
    description?: string;
    private?: boolean;
    autoInit?: boolean;
    /** Si es org login, crea bajo la org; si no, bajo el usuario autenticado. */
    org?: string | null;
  },
): Promise<{ ok: true; repo: GitHubRepository } | { ok: false; message: string }> {
  const name = input.name.trim();
  if (!/^[A-Za-z0-9_.-]+$/.test(name)) {
    return {
      ok: false,
      message:
        "Nombre de repositorio inválido. Usa solo letras, números, guiones, puntos y guiones bajos.",
    };
  }

  const baseBody = {
    name,
    description: input.description?.trim() || undefined,
    private: input.private !== false,
  };

  const org = input.org?.trim();
  if (org) {
    const result = await gh<GitHubRepository>(`/orgs/${encodeURIComponent(org)}/repos`, {
      method: "POST",
      token: tokens.installationToken,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...baseBody,
        auto_init: input.autoInit !== false,
      }),
    });
    if (!result.ok) {
      return {
        ok: false,
        message:
          result.message +
          (result.status === 403 || /not accessible by integration/i.test(result.message)
            ? ADMIN_HINT
            : ""),
      };
    }
    return {
      ok: true,
      repo: { ...result.data, description: result.data.description ?? null },
    };
  }

  if (!tokens.userAccessToken) {
    return {
      ok: false,
      message:
        "No hay token de usuario para crear el repo. Pulsa Conectar GitHub de nuevo " +
        "(el token se renueva al conectar) y reintenta.",
    };
  }

  // 1) Intento con README (auto_init). 2) Si falla por permisos, sin auto_init.
  const attempts: Array<{ auto_init: boolean }> = [{ auto_init: true }, { auto_init: false }];
  let lastMessage = "No se pudo crear el repositorio.";

  for (const attempt of attempts) {
    if (input.autoInit === false && attempt.auto_init) continue;

    const result = await gh<GitHubRepository>("/user/repos", {
      method: "POST",
      token: tokens.userAccessToken,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...baseBody, auto_init: attempt.auto_init }),
    });

    if (result.ok) {
      const repo = { ...result.data, description: result.data.description ?? null };
      // Si la App está en modo "only select repositories", el repo nuevo no entra
      // solo: hay que añadirlo a la instalación para que luego aparezca al listar.
      if (tokens.installationId && tokens.userAccessToken) {
        await addRepoToUserInstallation(
          tokens.userAccessToken,
          tokens.installationId,
          repo.id,
        );
      }
      return { ok: true, repo };
    }

    lastMessage = result.message;
    const integrationBlocked =
      result.status === 403 ||
      result.status === 401 ||
      /not accessible by integration/i.test(result.message);

    if (integrationBlocked) {
      return { ok: false, message: result.message + ADMIN_HINT };
    }
    if (result.status === 422) {
      return {
        ok: false,
        message: `${result.message} ¿Ya existe un repo con ese nombre en tu cuenta?`,
      };
    }
    // Otros errores: no reintentar
    if (result.status !== 0) break;
  }

  return { ok: false, message: lastMessage };
}

/** Añade un repo recién creado a la instalación de la App (solo repos seleccionados). */
export async function addRepoToUserInstallation(
  userAccessToken: string,
  installationId: number,
  repositoryId: number,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const result = await gh<unknown>(
    `/user/installations/${installationId}/repositories/${repositoryId}`,
    {
      method: "PUT",
      token: userAccessToken,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
      },
    },
  );
  if (!result.ok) {
    // No es fatal: el repo existe; el usuario puede añadirlo a mano en la App.
    return { ok: false, message: result.message };
  }
  return { ok: true };
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

const PROJECTS_HINT =
  " En la GitHub App: Organization permissions → Projects = Read and write " +
  "(y para Projects de usuario usa el token de usuario: vuelve a Conectar GitHub). " +
  "Guarda, acepta permisos y reintenta.";

/**
 * GraphQL tolerante a errores parciales.
 * Acepta installation token o user access token.
 */
async function graphql<T>(
  accessToken: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<{ ok: true; data: T; warnings: string[] } | { ok: false; message: string }> {
  try {
    const res = await fetch(`${GITHUB_API}/graphql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: ACCEPT,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": API_VERSION,
        "User-Agent": "Hito-GitHub-BFF",
      },
      body: JSON.stringify({ query, variables }),
    });
    const json = (await res.json()) as {
      data?: T | null;
      errors?: Array<{ message: string; type?: string; path?: Array<string | number> }>;
    };
    const warnings = (json.errors ?? []).map((e) => e.message).filter(Boolean);

    if (!res.ok) {
      return {
        ok: false,
        message: warnings[0] ?? `GraphQL HTTP ${res.status}`,
      };
    }

    // Si hay data usable, aceptar aunque existan errores en campos opcionalmente nulos.
    if (json.data != null && typeof json.data === "object") {
      return { ok: true, data: json.data, warnings };
    }

    return {
      ok: false,
      message:
        warnings[0] ??
        "Respuesta GraphQL vacía." + PROJECTS_HINT,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Error GraphQL con GitHub.",
    };
  }
}

/** Elige el mejor token: user para cuenta personal; installation para org. */
function pickGraphqlToken(
  tokens: { installationToken: string; userAccessToken?: string },
  preferUser: boolean,
): { token: string; kind: "user" | "installation" } {
  if (preferUser && tokens.userAccessToken) {
    return { token: tokens.userAccessToken, kind: "user" };
  }
  return { token: tokens.installationToken, kind: "installation" };
}

export async function resolveOwnerNodeId(
  accessToken: string,
  owner: string,
): Promise<{ ok: true; ownerId: string; kind: "user" | "organization" } | { ok: false; message: string }> {
  // Consultas separadas: evita que un error de organization tumbe el user.
  const userQ = `
    query($login: String!) {
      user(login: $login) { id }
    }
  `;
  const userRes = await graphql<{ user?: { id: string } | null }>(accessToken, userQ, {
    login: owner,
  });
  if (userRes.ok && userRes.data.user?.id) {
    return { ok: true, ownerId: userRes.data.user.id, kind: "user" };
  }

  const orgQ = `
    query($login: String!) {
      organization(login: $login) { id }
    }
  `;
  const orgRes = await graphql<{ organization?: { id: string } | null }>(
    accessToken,
    orgQ,
    { login: owner },
  );
  if (orgRes.ok && orgRes.data.organization?.id) {
    return { ok: true, ownerId: orgRes.data.organization.id, kind: "organization" };
  }

  // Fallback: viewer (útil con user token cuando el login coincide).
  const viewerQ = `query { viewer { id login } }`;
  const viewerRes = await graphql<{ viewer?: { id: string; login: string } | null }>(
    accessToken,
    viewerQ,
    {},
  );
  if (
    viewerRes.ok &&
    viewerRes.data.viewer?.id &&
    viewerRes.data.viewer.login.toLowerCase() === owner.toLowerCase()
  ) {
    return { ok: true, ownerId: viewerRes.data.viewer.id, kind: "user" };
  }

  return {
    ok: false,
    message: `No se encontró el owner "${owner}" en GitHub (¿instalación de la App en esa cuenta?).`,
  };
}

export async function listOrgProjects(
  tokens: { installationToken: string; userAccessToken?: string },
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
        public: boolean | null;
      }>;
    }
  | { ok: false; message: string }
> {
  // Probar user token primero (Projects de usuario), luego installation.
  const attempts = [
    pickGraphqlToken(tokens, true),
    pickGraphqlToken(tokens, false),
  ].filter((a, i, arr) => arr.findIndex((x) => x.token === a.token) === i);

  let lastError = "No se pudieron listar Projects.";

  for (const attempt of attempts) {
    const ownerRes = await resolveOwnerNodeId(attempt.token, owner);
    if (!ownerRes.ok) {
      lastError = ownerRes.message;
      continue;
    }

    const query =
      ownerRes.kind === "user"
        ? `
          query($login: String!) {
            user(login: $login) {
              projectsV2(first: 50, orderBy: { field: UPDATED_AT, direction: DESC }) {
                nodes { id number title shortDescription public }
              }
            }
          }
        `
        : `
          query($login: String!) {
            organization(login: $login) {
              projectsV2(first: 50, orderBy: { field: UPDATED_AT, direction: DESC }) {
                nodes { id number title shortDescription public }
              }
            }
          }
        `;

    const result = await graphql<{
      user?: { projectsV2?: { nodes?: Array<(GhProject & { public?: boolean | null }) | null> } };
      organization?: {
        projectsV2?: { nodes?: Array<(GhProject & { public?: boolean | null }) | null> };
      };
    }>(attempt.token, query, { login: owner });

    if (!result.ok) {
      lastError = result.message;
      continue;
    }

    const nodes = (
      ownerRes.kind === "user"
        ? result.data.user?.projectsV2?.nodes
        : result.data.organization?.projectsV2?.nodes
    ) ?? [];

    return {
      ok: true,
      projects: nodes
        .filter((n): n is GhProject & { public?: boolean | null } => Boolean(n))
        .map((n) => ({
          id: n.id,
          number: n.number,
          title: n.title,
          shortDescription: n.shortDescription ?? null,
          ownerLogin: owner,
          public: typeof n.public === "boolean" ? n.public : null,
        })),
    };
  }

  return { ok: false, message: lastError + PROJECTS_HINT };
}

export async function createGitHubProject(
  tokens: { installationToken: string; userAccessToken?: string },
  owner: string,
  title: string,
  options?: { repositoryNodeId?: string | null; makePrivate?: boolean },
): Promise<
  | {
      ok: true;
      project: {
        id: string;
        number: number;
        title: string;
        shortDescription: string | null;
        ownerLogin: string;
        public: boolean | null;
      };
    }
  | { ok: false; message: string }
> {
  // Projects personales (user-owned) suelen exigir user access token.
  // Org projects: installation token con Organization → Projects write.
  const attempts = [
    pickGraphqlToken(tokens, true),
    pickGraphqlToken(tokens, false),
  ].filter((a, i, arr) => arr.findIndex((x) => x.token === a.token) === i);

  if (!tokens.userAccessToken) {
    // Aviso temprano: sin reconectar no hay user token sellado.
    // Aún intentamos installation (sirve en algunas orgs).
  }

  let lastError = "No se pudo crear el GitHub Project.";

  for (const attempt of attempts) {
    const ownerRes = await resolveOwnerNodeId(attempt.token, owner);
    if (!ownerRes.ok) {
      lastError = ownerRes.message;
      continue;
    }

    // Para user-owned, preferir user token; si solo hay installation y kind=user, avisar.
    if (ownerRes.kind === "user" && attempt.kind === "installation" && !tokens.userAccessToken) {
      lastError =
        "Para crear un Project en tu cuenta personal hace falta reconectar GitHub " +
        "(token de usuario).";
      continue;
    }

    const mutation = options?.repositoryNodeId
      ? `
        mutation($ownerId: ID!, $title: String!, $repositoryId: ID!) {
          createProjectV2(input: {
            ownerId: $ownerId
            title: $title
            repositoryId: $repositoryId
          }) {
            projectV2 { id number title shortDescription public }
          }
        }
      `
      : `
        mutation($ownerId: ID!, $title: String!) {
          createProjectV2(input: { ownerId: $ownerId, title: $title }) {
            projectV2 { id number title shortDescription public }
          }
        }
      `;

    const variables: Record<string, unknown> = {
      ownerId: ownerRes.ownerId,
      title,
    };
    if (options?.repositoryNodeId) {
      variables.repositoryId = options.repositoryNodeId;
    }

    const result = await graphql<{
      createProjectV2?: {
        projectV2?: (GhProject & { public?: boolean | null }) | null;
      } | null;
    }>(attempt.token, mutation, variables);

    if (!result.ok) {
      lastError = result.message;
      if (/not accessible by integration|permission|INSUFFICIENT/i.test(result.message)) {
        lastError = result.message + PROJECTS_HINT;
      }
      continue;
    }

    // GraphQL puede devolver data + errors y createProjectV2 null.
    let project = result.data.createProjectV2?.projectV2 ?? null;
    if (!project) {
      const warn = result.warnings[0];
      lastError = warn
        ? `${warn}${PROJECTS_HINT}`
        : "GitHub no devolvió el Project creado." + PROJECTS_HINT;
      // Si falló por repositoryId, reintentar sin vincular el repo.
      if (options?.repositoryNodeId && /repositor/i.test(lastError + warn)) {
        const plain = await graphql<{
          createProjectV2?: {
            projectV2?: (GhProject & { public?: boolean | null }) | null;
          } | null;
        }>(
          attempt.token,
          `
            mutation($ownerId: ID!, $title: String!) {
              createProjectV2(input: { ownerId: $ownerId, title: $title }) {
                projectV2 { id number title shortDescription public }
              }
            }
          `,
          { ownerId: ownerRes.ownerId, title },
        );
        if (plain.ok && plain.data.createProjectV2?.projectV2) {
          project = plain.data.createProjectV2.projectV2;
        } else if (plain.ok === false) {
          lastError = plain.message + PROJECTS_HINT;
          continue;
        } else if (!project) {
          continue;
        }
      } else {
        continue;
      }
    }

    if (!project) continue;

    // Forzar privado si se pidió.
    if (options?.makePrivate !== false) {
      const updated = await updateGitHubProject(attempt.token, project.id, {
        public: false,
      });
      if (updated.ok) {
        project = {
          ...project,
          title: updated.project.title,
          shortDescription: updated.project.shortDescription,
          public: updated.project.public,
        };
      }
    }

    return {
      ok: true,
      project: {
        id: project.id,
        number: project.number,
        title: project.title,
        shortDescription: project.shortDescription ?? null,
        ownerLogin: owner,
        public: typeof project.public === "boolean" ? project.public : false,
      },
    };
  }

  if (!tokens.userAccessToken) {
    return {
      ok: false,
      message:
        lastError +
        " Además: no hay token de usuario en la sesión — pulsa Conectar GitHub y reintenta.",
    };
  }

  return { ok: false, message: lastError };
}

export async function updateGitHubProject(
  installationToken: string,
  projectId: string,
  input: {
    title?: string;
    shortDescription?: string | null;
    public?: boolean;
  },
): Promise<
  | {
      ok: true;
      project: {
        id: string;
        number: number;
        title: string;
        shortDescription: string | null;
        public: boolean | null;
      };
    }
  | { ok: false; message: string }
> {
  // Solo enviar campos definidos: null en title/shortDescription puede borrar valores.
  const inputFields: string[] = ["projectId: $projectId"];
  const varDefs: string[] = ["$projectId: ID!"];
  const variables: Record<string, unknown> = { projectId };

  if (typeof input.title === "string") {
    varDefs.push("$title: String!");
    inputFields.push("title: $title");
    variables.title = input.title;
  }
  if (input.shortDescription !== undefined) {
    varDefs.push("$shortDescription: String");
    inputFields.push("shortDescription: $shortDescription");
    variables.shortDescription = input.shortDescription;
  }
  if (typeof input.public === "boolean") {
    varDefs.push("$public: Boolean!");
    inputFields.push("public: $public");
    variables.public = input.public;
  }

  const mutation = `
    mutation(${varDefs.join(", ")}) {
      updateProjectV2(input: { ${inputFields.join("\n        ")} }) {
        projectV2 { id number title shortDescription public }
      }
    }
  `;
  const result = await graphql<{
    updateProjectV2?: {
      projectV2?: (GhProject & { public?: boolean | null }) | null;
    };
  }>(installationToken, mutation, variables);
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
      public: typeof project.public === "boolean" ? project.public : null,
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
