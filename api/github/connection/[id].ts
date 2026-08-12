import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loadGitHubEnv } from "../_lib/env";
import { parseConnectionId } from "../_lib/crypto";
import { json, methodNotAllowed } from "../_lib/http";

/**
 * GET /api/github/connection/:id
 * Returns an opaque connection summary (no tokens).
 */
export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== "GET") {
    methodNotAllowed(res, "GET");
    return;
  }

  const loaded = loadGitHubEnv();
  if (!loaded.ok) {
    json(res, 503, { message: "El backend de GitHub no está configurado.", missing: loaded.missing });
    return;
  }

  const id = typeof req.query.id === "string" ? req.query.id : "";
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
}
