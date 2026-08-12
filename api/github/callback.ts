import { loadGitHubOAuthEnv } from "./_lib/env";
import { mintConnectionId, verifyState } from "./_lib/crypto";
import {
  exchangeOAuthCode,
  getAuthenticatedUser,
  listUserInstallations,
} from "./_lib/github";
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
} from "./_lib/http";

/**
 * GET /api/github/callback
 * GitHub OAuth callback. Exchanges code, picks installation, mints opaque connectionId.
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
      redirect(
        res,
        frontendErrorRedirect(
          returnBase,
          "no_installation: Autorizaste Hito pero aún no hay una instalación. Instala la App en un repositorio y vuelve a conectar.",
        ),
      );
      return;
    }

    const installation = installations[0]!;
    const connectionId = mintConnectionId(env.stateSecret, {
      installationId: installation.id,
      githubUserId: userResult.data.id,
      githubLogin: userResult.data.login,
    });

    redirect(res, frontendSuccessRedirect(returnBase, connectionId));
  });
}
