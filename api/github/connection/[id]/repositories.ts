import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loadGitHubEnv } from "../../_lib/env";
import { parseConnectionId } from "../../_lib/crypto";
import { createInstallationToken, listInstallationRepos } from "../../_lib/github";
import { json, methodNotAllowed } from "../../_lib/http";

/**
 * GET /api/github/connection/:id/repositories
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
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
      owner: r.owner.login,
      name: r.name,
      fullName: r.full_name,
      private: r.private,
      defaultBranch: r.default_branch,
    })),
  );
}
