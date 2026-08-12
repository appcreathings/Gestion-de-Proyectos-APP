import { loadGitHubEnv } from "../../_lib/env";
import { parseConnectionId } from "../../_lib/crypto";
import { createInstallationToken, listOrgProjects } from "../../_lib/github";
import {
  json,
  methodNotAllowed,
  pathParamId,
  queryParam,
  withHandler,
  type ApiRequest,
  type ApiResponse,
} from "../../_lib/http";

/**
 * GET /api/github/connection/:id/projects?owner=...
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
    const owner = queryParam(req, "owner");
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
  });
}
