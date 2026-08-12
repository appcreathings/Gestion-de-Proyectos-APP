import { loadGitHubEnv } from "../../_lib/env.js";
import { parseConnectionId } from "../../_lib/crypto.js";
import {
  createGitHubProject,
  createInstallationToken,
  listOrgProjects,
  updateGitHubProject,
} from "../../_lib/github.js";
import {
  json,
  methodNotAllowed,
  pathParamId,
  queryParam,
  withHandler,
  type ApiRequest,
  type ApiResponse,
} from "../../_lib/http.js";

async function readJsonBody(req: ApiRequest): Promise<Record<string, unknown>> {
  const anyReq = req as ApiRequest & { body?: unknown };
  if (anyReq.body && typeof anyReq.body === "object") {
    return anyReq.body as Record<string, unknown>;
  }
  return {};
}

/**
 * GET  /api/github/connection/:id/projects?owner=...
 * POST /api/github/connection/:id/projects  { owner, title }
 * PATCH /api/github/connection/:id/projects { projectId, title?, shortDescription? }
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  await withHandler(req, res, async () => {
    const method = (req.method ?? "GET").toUpperCase();
    if (method !== "GET" && method !== "POST" && method !== "PATCH") {
      methodNotAllowed(res, "GET, POST, PATCH");
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

    if (method === "GET") {
      const owner = queryParam(req, "owner");
      if (!owner) {
        json(res, 400, { message: "Falta el parámetro owner." });
        return;
      }
      const projects = await listOrgProjects(token.token, owner);
      if (!projects.ok) {
        json(res, 502, { message: projects.message });
        return;
      }
      json(res, 200, projects.projects);
      return;
    }

    const body = await readJsonBody(req);

    if (method === "POST") {
      const owner = typeof body.owner === "string" ? body.owner.trim() : "";
      const title = typeof body.title === "string" ? body.title.trim() : "";
      if (!owner || !title) {
        json(res, 400, { message: "Se requieren owner y title." });
        return;
      }
      const created = await createGitHubProject(token.token, owner, title);
      if (!created.ok) {
        json(res, 502, { message: created.message });
        return;
      }
      json(res, 201, created.project);
      return;
    }

    // PATCH
    const projectId = typeof body.projectId === "string" ? body.projectId.trim() : "";
    if (!projectId) {
      json(res, 400, { message: "Se requiere projectId." });
      return;
    }
    const updated = await updateGitHubProject(token.token, projectId, {
      title: typeof body.title === "string" ? body.title : undefined,
      shortDescription:
        body.shortDescription === null
          ? null
          : typeof body.shortDescription === "string"
            ? body.shortDescription
            : undefined,
    });
    if (!updated.ok) {
      json(res, 502, { message: updated.message });
      return;
    }
    json(res, 200, updated.project);
  });
}
