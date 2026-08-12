import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loadGitHubEnv } from "../../_lib/env";
import { parseConnectionId } from "../../_lib/crypto";
import { createInstallationToken, listOrgProjects } from "../../_lib/github";
import { getRequestUrl, json, methodNotAllowed } from "../../_lib/http";

/**
 * GET /api/github/connection/:id/projects?owner=...
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
  const url = getRequestUrl(req);
  const owner = url.searchParams.get("owner") ?? "";
  if (!owner) {
    json(res, 400, { message: "Falta el parámetro owner." });
    return;
  }

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

  const projects = await listOrgProjects(token.token, owner);
  if (!projects.ok) {
    json(res, 502, { message: projects.message });
    return;
  }

  json(res, 200, projects.projects);
}
