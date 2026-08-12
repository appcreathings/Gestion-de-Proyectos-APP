import { loadGitHubOAuthEnv } from "./_lib/env.js";
import { randomToken, signState } from "./_lib/crypto.js";
import {
  getRequestUrl,
  json,
  methodNotAllowed,
  queryParam,
  redirect,
  withHandler,
  type ApiRequest,
  type ApiResponse,
} from "./_lib/http.js";

/**
 * GET /api/github/connect
 * Starts GitHub App user authorization and redirects to GitHub.
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  await withHandler(req, res, () => {
    if ((req.method ?? "GET").toUpperCase() !== "GET") {
      methodNotAllowed(res, "GET");
      return;
    }

    const loaded = loadGitHubOAuthEnv();
    if (!loaded.ok) {
      json(res, 503, {
        message: "El backend de GitHub no está configurado.",
        missing: loaded.missing,
        hint:
          "En Vercel define GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET y opcionalmente GITHUB_CALLBACK_URL / GITHUB_SETUP_URL.",
      });
      return;
    }

    const { env } = loaded;
    const linkId = queryParam(req, "linkId") || undefined;

    const state = signState(env.stateSecret, {
      n: randomToken(16),
      linkId,
    });

    const authorize = new URL("https://github.com/login/oauth/authorize");
    authorize.searchParams.set("client_id", env.clientId);
    authorize.searchParams.set("redirect_uri", env.callbackUrl);
    authorize.searchParams.set("state", state);
    authorize.searchParams.set("allow_signup", "false");

    // Sanity: ensure URL construction did not produce garbage.
    getRequestUrl(req);

    redirect(res, authorize.toString());
  });
}
