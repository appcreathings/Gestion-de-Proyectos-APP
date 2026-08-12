import { loadGitHubEnv, loadGitHubOAuthEnv } from "./_lib/env.js";
import { json, withHandler, type ApiRequest, type ApiResponse } from "./_lib/http.js";

/**
 * GET /api/github/health
 * Diagnostic endpoint — never throws; shows which server env vars are present
 * without leaking secret values.
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  await withHandler(req, res, () => {
    const oauth = loadGitHubOAuthEnv();
    const full = loadGitHubEnv();
    json(res, oauth.ok ? 200 : 503, {
      ok: oauth.ok,
      oauthConfigured: oauth.ok,
      appConfigured: full.ok,
      missing: oauth.ok ? (full.ok ? [] : full.missing) : oauth.missing,
      callbackUrl: oauth.ok ? oauth.env.callbackUrl : null,
      frontendReturnUrl: oauth.ok ? oauth.env.frontendReturnUrl : null,
      runtime: "node",
      createRepoRequires: {
        permission: "Administration: Read and write",
        note:
          "Resource not accessible by integration = falta Administration write en la App, " +
          "o no se aceptó el nuevo permiso / no se reconectó OAuth.",
      },
    });
  });
}
