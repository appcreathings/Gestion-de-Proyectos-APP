/** Server-only GitHub App env. Never import this from the Vite frontend. */

export type GitHubOAuthEnv = {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  frontendReturnUrl: string;
  stateSecret: string;
  /**
   * URL slug of the GitHub App (https://github.com/apps/<slug>).
   * Used to send users to the install page when OAuth succeeded but the account
   * has no installation, and for the explicit `mode=install` connect.
   */
  appSlug: string | null;
};

export type GitHubAppEnv = GitHubOAuthEnv & {
  appId: string;
  privateKey: string;
};

/** Public install URL for the GitHub App (choose account + repos). */
export function githubAppInstallUrl(appSlug: string, state?: string): string {
  const url = new URL(`https://github.com/apps/${encodeURIComponent(appSlug)}/installations/new`);
  if (state) url.searchParams.set("state", state);
  return url.toString();
}

/** Classic user OAuth authorize URL (no installation UI). */
export function githubOAuthAuthorizeUrl(input: {
  clientId: string;
  callbackUrl: string;
  state: string;
}): string {
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", input.clientId);
  authorize.searchParams.set("redirect_uri", input.callbackUrl);
  authorize.searchParams.set("state", input.state);
  authorize.searchParams.set("allow_signup", "false");
  return authorize.toString();
}

function required(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function siteOrigin(): string | null {
  const explicit = required("GITHUB_SITE_URL") ?? required("VITE_SITE_URL");
  if (explicit) return explicit.replace(/\/$/, "");
  // Prefer production custom domain over the ephemeral *.vercel.app host.
  const vercelEnv = process.env.VERCEL_ENV;
  const productionUrl = required("VERCEL_PROJECT_PRODUCTION_URL");
  if (vercelEnv === "production" && productionUrl) {
    return productionUrl.startsWith("http") ? productionUrl.replace(/\/$/, "") : `https://${productionUrl}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return null;
}

function resolvePrivateKey(): string | null {
  const raw = process.env.GITHUB_PRIVATE_KEY?.trim();
  if (raw) {
    let key = raw;
    if (
      (key.startsWith('"') && key.endsWith('"')) ||
      (key.startsWith("'") && key.endsWith("'"))
    ) {
      key = key.slice(1, -1);
    }
    return key.includes("\\n") ? key.replace(/\\n/g, "\n") : key;
  }
  const b64 = process.env.GITHUB_PRIVATE_KEY_BASE64?.trim();
  if (b64) {
    try {
      return Buffer.from(b64, "base64").toString("utf8");
    } catch {
      return null;
    }
  }
  return null;
}

/** Env for OAuth start + callback (no App private key required). */
export function loadGitHubOAuthEnv():
  | { ok: true; env: GitHubOAuthEnv }
  | { ok: false; missing: string[] } {
  const clientId = required("GITHUB_CLIENT_ID");
  const clientSecret = required("GITHUB_CLIENT_SECRET");
  const origin = siteOrigin();
  const callbackUrl =
    required("GITHUB_CALLBACK_URL") ?? (origin ? `${origin}/api/github/callback` : null);
  const frontendReturnUrl =
    required("GITHUB_SETUP_URL") ??
    required("GITHUB_FRONTEND_RETURN_URL") ??
    (origin ? `${origin}/github/connect` : null);
  const stateSecret = required("GITHUB_STATE_SECRET") ?? clientSecret;
  // Slug from the public App URL: github.com/apps/<slug>. Optional but required
  // to redirect to the install page (callback fallback and `mode=install`).
  const appSlugRaw = required("GITHUB_APP_SLUG");
  const appSlug = appSlugRaw
    ? appSlugRaw.replace(/^https?:\/\/github\.com\/apps\//i, "").replace(/\/+$/, "").toLowerCase()
    : null;

  const missing: string[] = [];
  if (!clientId) missing.push("GITHUB_CLIENT_ID");
  if (!clientSecret) missing.push("GITHUB_CLIENT_SECRET");
  if (!callbackUrl) missing.push("GITHUB_CALLBACK_URL");
  if (!frontendReturnUrl) missing.push("GITHUB_SETUP_URL");
  if (!stateSecret) missing.push("GITHUB_STATE_SECRET");

  if (missing.length > 0 || !clientId || !clientSecret || !callbackUrl || !frontendReturnUrl || !stateSecret) {
    return { ok: false, missing };
  }

  return {
    ok: true,
    env: {
      clientId,
      clientSecret,
      callbackUrl,
      frontendReturnUrl,
      stateSecret,
      appSlug,
    },
  };
}

/** Full env including App JWT material (repos / projects / sync). */
export function loadGitHubEnv():
  | { ok: true; env: GitHubAppEnv }
  | { ok: false; missing: string[] } {
  const oauth = loadGitHubOAuthEnv();
  if (!oauth.ok) return oauth;

  const appId = required("GITHUB_APP_ID");
  const privateKey = resolvePrivateKey();
  const missing: string[] = [];
  if (!appId) missing.push("GITHUB_APP_ID");
  if (!privateKey) missing.push("GITHUB_PRIVATE_KEY");

  if (missing.length > 0 || !appId || !privateKey) {
    return { ok: false, missing: [...(oauth.ok ? [] : []), ...missing] };
  }

  return {
    ok: true,
    env: {
      ...oauth.env,
      appId,
      privateKey,
    },
  };
}
