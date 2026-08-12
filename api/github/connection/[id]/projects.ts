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

/**
 * Vercel a veces entrega body parseado, string o Buffer.
 * Sin esto, POST "crear Project" llega vacío → "Se requieren owner y title".
 */
async function readJsonBody(req: ApiRequest): Promise<Record<string, unknown>> {
  const anyReq = req as ApiRequest & {
    body?: unknown;
    on?: (event: string, cb: (chunk?: Buffer | string) => void) => void;
  };

  if (anyReq.body != null) {
    if (typeof anyReq.body === "string") {
      try {
        const parsed = JSON.parse(anyReq.body || "{}") as unknown;
        return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
      } catch {
        return {};
      }
    }
    if (Buffer.isBuffer(anyReq.body)) {
      try {
        const parsed = JSON.parse(anyReq.body.toString("utf8") || "{}") as unknown;
        return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
      } catch {
        return {};
      }
    }
    if (typeof anyReq.body === "object") {
      return anyReq.body as Record<string, unknown>;
    }
  }

  // Fallback: leer el stream (handlers sin helpers de body).
  if (typeof anyReq.on === "function") {
    const raw = await new Promise<string>((resolve) => {
      const chunks: Buffer[] = [];
      anyReq.on!("data", (chunk) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk ?? ""));
      });
      anyReq.on!("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      anyReq.on!("error", () => resolve(""));
      // Si no hay data, end puede no llegar en algunos mocks; timeout corto.
      setTimeout(() => resolve(Buffer.concat(chunks).toString("utf8")), 50);
    });
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown;
        return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
      } catch {
        return {};
      }
    }
  }

  return {};
}

/**
 * GET  /api/github/connection/:id/projects?owner=...
 * POST /api/github/connection/:id/projects
 *   { owner, title, repositoryNodeId?, makePrivate? }
 * PATCH /api/github/connection/:id/projects
 *   { projectId, title?, shortDescription?, public? }
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
      const repositoryNodeId =
        typeof body.repositoryNodeId === "string" ? body.repositoryNodeId.trim() : undefined;
      const makePrivate = body.makePrivate === false ? false : true;

      if (!owner || !title) {
        json(res, 400, {
          message: "Se requieren owner y title.",
          receivedKeys: Object.keys(body),
        });
        return;
      }

      const created = await createGitHubProject(token.token, owner, title, {
        repositoryNodeId: repositoryNodeId || null,
        makePrivate,
      });
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
      public: typeof body.public === "boolean" ? body.public : undefined,
    });
    if (!updated.ok) {
      json(res, 502, { message: updated.message });
      return;
    }
    json(res, 200, updated.project);
  });
}
