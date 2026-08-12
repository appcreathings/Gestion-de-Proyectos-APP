import { loadGitHubEnv } from "../../_lib/env.js";
import { parseConnectionId } from "../../_lib/crypto.js";
import { createInstallationToken, listInstallationRepos } from "../../_lib/github.js";
import {
  json,
  methodNotAllowed,
  pathParamId,
  withHandler,
  type ApiRequest,
  type ApiResponse,
} from "../../_lib/http.js";

/**
 * GET /api/github/connection/:id/repositories
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  await withHandler(req, res, async () => {
    if ((req.method ?? "GET").toUpperCase() !== "GET") {
      methodNotAllowed(res, "GET");
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
    const parsed = parseConnectionId(loaded.env.stateSecret, id);
    if (!parsed.ok) {
      json(res, 401, { message: `Conexión inválida o expirada (${parsed.reason}).` });
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

    const repos = await listInstallationRepos(token.token);
    if (!repos.ok) {
      json(res, 502, { message: repos.message });
      return;
    }

    json(
      res,
      200,
      repos.repos.map((r) => ({
        id: r.id,
        nodeId: r.node_id ?? "",
        owner: r.owner?.login ?? "",
        name: r.name,
        fullName: r.full_name,
        private: Boolean(r.private),
        defaultBranch: r.default_branch,
        description: r.description ?? null,
      })),
    );
  });
}
