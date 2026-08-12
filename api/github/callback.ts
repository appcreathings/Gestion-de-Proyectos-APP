import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loadGitHubEnv } from "./_lib/env";
import { mintConnectionId, verifyState } from "./_lib/crypto";
import {
  exchangeOAuthCode,
  getAuthenticatedUser,
  listUserInstallations,
} from "./_lib/github";
import {
  frontendErrorRedirect,
  frontendSuccessRedirect,
  getRequestUrl,
  json,
  methodNotAllowed,
  redirect,
} from "./_lib/http";

/**
 * GET /api/github/callback
 * GitHub OAuth callback. Exchanges code, picks installation, mints opaque connectionId.
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "GET") {
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
  const { env } = loaded;
  const returnBase = env.frontendReturnUrl;
  const url = getRequestUrl(req);

  const oauthError = url.searchParams.get("error");
  if (oauthError) {
    redirect(
      res,
      frontendErrorRedirect(
        returnBase,
        url.searchParams.get("error_description") || oauthError,
      ),
    );
    return;
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) {
    redirect(res, frontendErrorRedirect(returnBase, "Faltan code o state en el callback."));
    return;
  }

  const stateCheck = verifyState(env.stateSecret, state);
  if (!stateCheck.ok) {
    redirect(res, frontendErrorRedirect(returnBase, `State inválido: ${stateCheck.reason}`));
    return;
  }

  const tokenResult = await exchangeOAuthCode(env.clientId, env.clientSecret, code, env.callbackUrl);
  if (!tokenResult.ok) {
    redirect(res, frontendErrorRedirect(returnBase, tokenResult.message));
    return;
  }

  const userResult = await getAuthenticatedUser(tokenResult.accessToken);
  if (!userResult.ok) {
    redirect(res, frontendErrorRedirect(returnBase, userResult.message));
    return;
  }

  const installationsResult = await listUserInstallations(tokenResult.accessToken);
  if (!installationsResult.ok) {
    redirect(res, frontendErrorRedirect(returnBase, installationsResult.message));
    return;
  }

  const installations = installationsResult.data.installations ?? [];
  if (installations.length === 0) {
    // User authorized the App but has not installed it on any account yet.
    const installUrl = env.clientId
      ? `https://github.com/apps/installations/new`
      : "https://github.com/settings/apps";
    // Prefer GitHub's install flow via App; frontend will show guidance.
    redirect(
      res,
      frontendErrorRedirect(
        returnBase,
        `no_installation: Autorizaste Hito pero aún no hay una instalación. Instala la App en un repositorio y vuelve a conectar. ${installUrl}`,
      ),
    );
    return;
  }

  // Prefer the first installation; multi-install selection can be a later UI step.
  const installation = installations[0]!;
  const connectionId = mintConnectionId(env.stateSecret, {
    installationId: installation.id,
    githubUserId: userResult.data.id,
    githubLogin: userResult.data.login,
  });

  redirect(res, frontendSuccessRedirect(returnBase, connectionId));
}
