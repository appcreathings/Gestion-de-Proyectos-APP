import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loadGitHubEnv } from "../../_lib/env";
import { parseConnectionId } from "../../_lib/crypto";
import { json, methodNotAllowed } from "../../_lib/http";

/**
 * POST /api/github/connection/:id/revoke
 * Stateless connections: validate id and acknowledge. Client drops local row.
 */
export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== "POST") {
    methodNotAllowed(res, "POST");
    return;
  }

  const loaded = loadGitHubEnv();
  if (!loaded.ok) {
    json(res, 503, { message: "El backend de GitHub no está configurado.", missing: loaded.missing });
    return;
  }

  const id = typeof req.query.id === "string" ? req.query.id : "";
  const parsed = parseConnectionId(loaded.env.stateSecret, id);
  if (!parsed.ok) {
    // Already invalid/expired — treat as revoked for the client.
    json(res, 200, { revoked: true });
    return;
  }

  json(res, 200, { revoked: true });
}
