import { loadGitHubEnv } from "../../_lib/env.js";
import { parseConnectionId } from "../../_lib/crypto.js";
import {
  createInstallationToken,
  createRepository,
  listInstallationRepos,
  resolveOwnerNodeId,
} from "../../_lib/github.js";
import {
  json,
  methodNotAllowed,
  pathParamId,
  withHandler,
  type ApiRequest,
  type ApiResponse,
} from "../../_lib/http.js";

async function readJsonBody(req: ApiRequest): Promise<Record<string, unknown>> {
  const anyReq = req as ApiRequest & { body?: unknown };
  if (anyReq.body != null) {
    if (typeof anyReq.body === "string") {
      try {
        const parsed = JSON.parse(anyReq.body || "{}") as unknown;
        return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
      } catch {
        return {};
      }
    }
    if (typeof anyReq.body === "object") {
      return anyReq.body as Record<string, unknown>;
    }
  }
  return {};
}

function mapRepo(r: {
  id: number;
  node_id?: string;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  description: string | null;
  owner: { login: string };
}) {
  return {
    id: r.id,
    nodeId: r.node_id ?? "",
    owner: r.owner?.login ?? "",
    name: r.name,
    fullName: r.full_name,
    private: Boolean(r.private),
    defaultBranch: r.default_branch,
    description: r.description ?? null,
  };
}

/**
 * GET  /api/github/connection/:id/repositories
 * POST /api/github/connection/:id/repositories
 *   { name, description?, private?, autoInit?, org? }
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  await withHandler(req, res, async () => {
    const method = (req.method ?? "GET").toUpperCase();
    if (method !== "GET" && method !== "POST") {
      methodNotAllowed(res, "GET, POST");
      return;
    }

    const loaded = loadGitHubEnv();
    if (!loaded.ok) {
      json(res, 503, {
        message: "El backend de GitHub no está configurado.",
        missing: loaded.missing,
      });
      return;
    }

    const id = pathParamId(req);
    // OAuth env for state secret (user token seal) + full env for app key.
    const parsed = parseConnectionId(loaded.env.stateSecret, id);
    if (!parsed.ok) {
      json(res, 401, {
        message: `Conexión inválida o expirada (${parsed.reason}). Vuelve a Conectar GitHub.`,
      });
      return;
    }

    const token = await createInstallationToken(
      loaded.env.appId,
      loaded.env.privateKey,
      parsed.claims.installationId,
    );
    if (!token.ok) {
      json(res, 502, { message: token.message });
      return;
    }

    if (method === "GET") {
      const repos = await listInstallationRepos(token.token);
      if (!repos.ok) {
        json(res, 502, { message: repos.message });
        return;
      }
      json(
        res,
        200,
        repos.repos.map((r) => mapRepo(r)),
      );
      return;
    }

    // POST — crear repositorio
    const body = await readJsonBody(req);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      json(res, 400, { message: "Se requiere name del repositorio." });
      return;
    }

    const description =
      typeof body.description === "string" ? body.description.trim() : undefined;
    const isPrivate = body.private === false ? false : true;
    const autoInit = body.autoInit === false ? false : true;
    let org =
      typeof body.org === "string" && body.org.trim() ? body.org.trim() : null;

    // Si no se pasa org, y el owner de la instalación es una org, usarla.
    // Si es usuario, org queda null → POST /user/repos con user token.
    if (!org) {
      const ownerLogin = parsed.claims.githubLogin;
      const ownerKind = await resolveOwnerNodeId(token.token, ownerLogin);
      // Prefer explicit: if user selected org in UI they pass org.
      // Default: create under the authenticated user (user token).
      void ownerKind;
      org = null;
    }

    // Si body.org está vacío pero body.owner es org distinta del user login
    if (typeof body.owner === "string" && body.owner.trim()) {
      const owner = body.owner.trim();
      if (owner.toLowerCase() !== parsed.claims.githubLogin.toLowerCase()) {
        org = owner;
      }
    }

    const created = await createRepository(
      {
        installationToken: token.token,
        userAccessToken: parsed.claims.userAccessToken,
        installationId: parsed.claims.installationId,
      },
      {
        name,
        description,
        private: isPrivate,
        autoInit,
        org,
      },
    );

    if (!created.ok) {
      json(res, 502, {
        message: created.message,
        hasUserToken: Boolean(parsed.claims.userAccessToken),
        code: "github_create_repo_failed",
        help: {
          requiredPermission: "Repository permissions → Administration → Read and write",
          steps: [
            "Abre la GitHub App → Permissions",
            "Administration = Read and write",
            "Save y acepta el nuevo permiso en la instalación",
            "En Hito: Conectar GitHub otra vez",
            "O crea el repo en github.com/new y elígelo en la lista",
          ],
        },
      });
      return;
    }

    json(res, 201, mapRepo(created.repo));
  });
}
