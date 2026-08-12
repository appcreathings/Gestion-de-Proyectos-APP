import { loadGitHubEnv } from "../../_lib/env.js";
import { parseConnectionId } from "../../_lib/crypto.js";
import {
  createInstallationToken,
  getRepoFile,
  putRepoFile,
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
  if (anyReq.body != null && typeof anyReq.body === "object" && !Buffer.isBuffer(anyReq.body)) {
    return anyReq.body as Record<string, unknown>;
  }
  if (typeof anyReq.body === "string") {
    try {
      const parsed = JSON.parse(anyReq.body || "{}") as unknown;
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * GET  /api/github/connection/:id/contents?owner=&repo=&path=
 * PUT  /api/github/connection/:id/contents
 *   { owner, repo, path, content, message, sha? }
 *
 * Escribe/lee archivos en el repositorio conectado (no crea GitHub Projects).
 * Los datos de Hito van en rutas tipo `.hito/projects/{id}.json`.
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  await withHandler(req, res, async () => {
    const method = (req.method ?? "GET").toUpperCase();
    if (method !== "GET" && method !== "PUT") {
      methodNotAllowed(res, "GET, PUT");
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
      const owner = queryParam(req, "owner");
      const repo = queryParam(req, "repo");
      const path = queryParam(req, "path");
      if (!owner || !repo || !path) {
        json(res, 400, { message: "Se requieren owner, repo y path." });
        return;
      }
      const file = await getRepoFile(token.token, owner, repo, path);
      if (!file.ok) {
        json(res, file.status === 404 ? 404 : 502, {
          message: file.message,
          status: file.status,
        });
        return;
      }
      json(res, 200, {
        path: file.file.path,
        sha: file.file.sha,
        content: file.file.content,
        size: file.file.size,
      });
      return;
    }

    // PUT
    const body = await readJsonBody(req);
    const owner = typeof body.owner === "string" ? body.owner.trim() : "";
    const repo = typeof body.repo === "string" ? body.repo.trim() : "";
    const path = typeof body.path === "string" ? body.path.trim() : "";
    const content = typeof body.content === "string" ? body.content : "";
    const message =
      typeof body.message === "string" && body.message.trim()
        ? body.message.trim()
        : `chore(hito): update ${path}`;
    const sha = typeof body.sha === "string" && body.sha ? body.sha : undefined;
    const branch = typeof body.branch === "string" && body.branch ? body.branch : undefined;

    if (!owner || !repo || !path) {
      json(res, 400, { message: "Se requieren owner, repo y path." });
      return;
    }

    // Límite razonable para serverless (~1.5 MB de texto).
    if (content.length > 1_500_000) {
      json(res, 413, { message: "El contenido del archivo es demasiado grande." });
      return;
    }

    const put = await putRepoFile(token.token, {
      owner,
      repo,
      path,
      content,
      message,
      sha,
      branch,
    });
    if (!put.ok) {
      json(res, put.status === 409 ? 409 : 502, {
        message: put.message,
        status: put.status,
      });
      return;
    }

    json(res, 200, {
      path,
      sha: put.sha,
      commitSha: put.commitSha,
      htmlUrl: put.htmlUrl,
    });
  });
}
