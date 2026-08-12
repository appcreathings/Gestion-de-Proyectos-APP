import {
  githubAppInstallUrl,
  loadGitHubOAuthEnv,
} from "./_lib/env.js";
import { mintConnectionId, randomToken, signState, verifyState } from "./_lib/crypto.js";
import {
  exchangeOAuthCode,
  getAuthenticatedUser,
  listUserInstallations,
} from "./_lib/github.js";
import {
  frontendErrorRedirect,
  frontendSuccessRedirect,
  json,
  methodNotAllowed,
  queryParam,
  redirect,
  withHandler,
  type ApiRequest,
  type ApiResponse,
} from "./_lib/http.js";

/**
 * GET /api/github/callback
 * GitHub OAuth callback. Exchanges code, picks installation, mints opaque connectionId.
 *
 * Also accepts `installation_id` (install + OAuth during installation, or when the
 * SPA Setup URL forwards code here).
 */
export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  await withHandler(req, res, async () => {
    if ((req.method ?? "GET").toUpperCase() !== "GET") {
      methodNotAllowed(res, "GET");
      return;
    }

    const loaded = loadGitHubOAuthEnv();
    if (!loaded.ok) {
      json(res, 503, {
        message: "El backend de GitHub no está configurado.",
        missing: loaded.missing,
      });
      return;
    }

    const { env } = loaded;
    const returnBase = env.frontendReturnUrl;

    const oauthError = queryParam(req, "error");
    if (oauthError) {
      redirect(
        res,
        frontendErrorRedirect(returnBase, queryParam(req, "error_description") || oauthError),
      );
      return;
    }

    const code = queryParam(req, "code");
    const state = queryParam(req, "state");
    if (!code || !state) {
      redirect(res, frontendErrorRedirect(returnBase, "Faltan code o state en el callback."));
      return;
    }

    const stateCheck = verifyState(env.stateSecret, state);
    if (!stateCheck.ok) {
      redirect(res, frontendErrorRedirect(returnBase, `State inválido: ${stateCheck.reason}`));
      return;
    }

    const tokenResult = await exchangeOAuthCode(
      env.clientId,
      env.clientSecret,
      code,
      env.callbackUrl,
    );
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
      // OAuth succeeded but this account never installed the App. Send them
      // straight to the install UI instead of a dead-end error (when slug is set).
      if (env.appSlug) {
        const priorLinkId =
          typeof stateCheck.payload.linkId === "string" ? stateCheck.payload.linkId : undefined;
        const installState = signState(env.stateSecret, {
          n: randomToken(16),
          linkId: priorLinkId,
        });
        redirect(res, githubAppInstallUrl(env.appSlug, installState));
        return;
      }
      redirect(
        res,
        frontendErrorRedirect(
          returnBase,
          "no_installation: Autorizaste Hito pero aún no hay una instalación. " +
            "Define GITHUB_APP_SLUG en el servidor e instala la App en un repositorio, luego vuelve a conectar.",
        ),
      );
      return;
    }

    const preferredRaw = queryParam(req, "installation_id");
    const preferredId = preferredRaw ? Number(preferredRaw) : NaN;
    const installation =
      (Number.isFinite(preferredId)
        ? installations.find((i) => i.id === preferredId)
        : undefined) ?? installations[0]!;

    // El user access token se sella dentro del connectionId (solo el BFF lo abre)
    // para poder crear repositorios de usuario (POST /user/repos).
    const connectionId = mintConnectionId(env.stateSecret, {
      installationId: installation.id,
      githubUserId: userResult.data.id,
      githubLogin: userResult.data.login,
      userAccessToken: tokenResult.accessToken,
    });

    redirect(res, frontendSuccessRedirect(returnBase, connectionId));
  });
}
