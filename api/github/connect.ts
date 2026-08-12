import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loadGitHubEnv } from "./_lib/env";
import { randomToken, signState } from "./_lib/crypto";
import { getRequestUrl, json, methodNotAllowed, redirect } from "./_lib/http";

/**
 * GET /api/github/connect
 * Starts GitHub App user authorization and redirects to GitHub.
 */
export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== "GET") {
    methodNotAllowed(res, "GET");
    return;
  }

  const loaded = loadGitHubEnv();
  if (!loaded.ok) {
    json(res, 503, {
      message: "El backend de GitHub no está configurado.",
      missing: loaded.missing,
      hint: "Define GITHUB_APP_ID, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET y GITHUB_PRIVATE_KEY en Vercel.",
    });
    return;
  }

  const { env } = loaded;
  const url = getRequestUrl(req);
  const linkId = url.searchParams.get("linkId") ?? undefined;

  const state = signState(env.stateSecret, {
    n: randomToken(16),
    linkId,
  });

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", env.clientId);
  authorize.searchParams.set("redirect_uri", env.callbackUrl);
  authorize.searchParams.set("state", state);
  // Request user authorization during installation is configured on the App;
  // scope stays empty for GitHub Apps user-to-server.
  authorize.searchParams.set("allow_signup", "false");

  redirect(res, authorize.toString());
}
