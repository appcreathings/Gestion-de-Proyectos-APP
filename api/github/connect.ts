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
 * Default: **authorize only** (`/login/oauth/authorize`). It carries a
 * `redirect_uri`, so GitHub always returns the user to our callback. GitHub
 * itself offers "Install & Authorize" when the account has no installation, and
 * the callback redirects to the install page if none was created.
 *
 * The install page (`/apps/<slug>/installations/new`) takes no `redirect_uri`:
 * an account that already installed the App lands on the App page in GitHub and
 * never comes back. That is why it is not the default.
 *
 * Query:
 * - `mode=install` — force the install UI (add repos / pick another account).
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
    const mode = (queryParam(req, "mode") || "oauth").toLowerCase();

    const state = signState(env.stateSecret, {
      n: randomToken(16),
      linkId,
    });

    // Sanity: ensure URL construction did not produce garbage.
    getRequestUrl(req);

    // Install UI only when explicitly requested (add repos / change account).
    // It has no redirect_uri, so it is a dead end for already-installed users.
    if (mode === "install" && env.appSlug) {
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
