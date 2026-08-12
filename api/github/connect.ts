import {
  githubAppInstallUrl,
  githubOAuthAuthorizeUrl,
  loadGitHubOAuthEnv,
} from "./_lib/env.js";
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
 *
 * Starts GitHub App connection.
 *
 * Default: send the user to the **App install** page so accounts without an
 * installation create one (and, with "Request user authorization during
 * installation", also complete OAuth in the same flow).
 *
 * Query:
 * - `mode=oauth` — skip install UI and only authorize the user (for reconnect
 *   when the installation already exists).
 * - `linkId` — optional opaque id echoed in signed state.
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
          "En Vercel define GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_APP_SLUG " +
          "y opcionalmente GITHUB_CALLBACK_URL / GITHUB_SETUP_URL.",
      });
      return;
    }

    const { env } = loaded;
    const linkId = queryParam(req, "linkId") || undefined;
    const mode = (queryParam(req, "mode") || "install").toLowerCase();

    const state = signState(env.stateSecret, {
      n: randomToken(16),
      linkId,
    });

    // Sanity: ensure URL construction did not produce garbage.
    getRequestUrl(req);

    // Prefer install-first when we know the App slug. Users without an
    // installation must install; users who already installed can re-confirm
    // repos / account. OAuth-only is kept for explicit reconnects.
    if (mode !== "oauth" && env.appSlug) {
      redirect(res, githubAppInstallUrl(env.appSlug, state));
      return;
    }

    redirect(
      res,
      githubOAuthAuthorizeUrl({
        clientId: env.clientId,
        callbackUrl: env.callbackUrl,
        state,
      }),
    );
  });
}
