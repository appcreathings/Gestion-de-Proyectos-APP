import { loadGitHubOAuthEnv } from "../../_lib/env";
import { parseConnectionId } from "../../_lib/crypto";
import {
  json,
  methodNotAllowed,
  pathParamId,
  withHandler,
  type ApiRequest,
  type ApiResponse,
} from "../../_lib/http";

/**
 * POST /api/github/connection/:id/revoke
 * Stateless connections: validate id and acknowledge. Client drops local row.
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  await withHandler(req, res, () => {
    if ((req.method ?? "GET").toUpperCase() !== "POST") {
      methodNotAllowed(res, "POST");
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
    parseConnectionId(loaded.env.stateSecret, id);
    // Already invalid/expired — treat as revoked for the client.
    json(res, 200, { revoked: true });
  });
}
