import { loadGitHubOAuthEnv } from "../_lib/env";
import { parseConnectionId } from "../_lib/crypto";
import {
  json,
  methodNotAllowed,
  pathParamId,
  withHandler,
  type ApiRequest,
  type ApiResponse,
} from "../_lib/http";

/**
 * GET /api/github/connection/:id
 * Returns an opaque connection summary (no tokens).
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  await withHandler(req, res, () => {
    if ((req.method ?? "GET").toUpperCase() !== "GET") {
      methodNotAllowed(res, "GET");
      return;
    }

    const loaded = loadGitHubOAuthEnv();
    if (!loaded.ok) {
      json(res, 503, {
        message: "El backend de GitHub no está configurado.",
        missing: loaded.missing,
      });
      return;
    }

    const id = pathParamId(req);
    if (!id) {
      json(res, 400, { message: "Falta connection id." });
      return;
    }

    const parsed = parseConnectionId(loaded.env.stateSecret, id);
    if (!parsed.ok) {
      json(res, 401, { message: `Conexión inválida o expirada (${parsed.reason}).` });
      return;
    }

    json(res, 200, {
      connectionId: parsed.claims.connectionId,
      githubUserId: parsed.claims.githubUserId,
      githubLogin: parsed.claims.githubLogin,
      installationId: parsed.claims.installationId,
      expiresAt: new Date(parsed.claims.exp * 1000).toISOString(),
    });
  });
}
