/** Server-only GitHub App env. Never import this from the Vite frontend. */

export type GitHubEnv = {
  appId: string;
  clientId: string;
  clientSecret: string;
  privateKey: string;
  callbackUrl: string;
  frontendReturnUrl: string;
  stateSecret: string;
};

function required(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function resolvePrivateKey(): string | null {
  const raw = process.env.GITHUB_PRIVATE_KEY?.trim();
  if (raw) {
    return raw.includes("\\n") ? raw.replace(/\\n/g, "\n") : raw;
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

export function loadGitHubEnv():
  | { ok: true; env: GitHubEnv }
  | { ok: false; missing: string[] } {
  const appId = required("GITHUB_APP_ID");
  const clientId = required("GITHUB_CLIENT_ID");
  const clientSecret = required("GITHUB_CLIENT_SECRET");
  const privateKey = resolvePrivateKey();
  const callbackUrl =
    required("GITHUB_CALLBACK_URL") ??
    // Same-origin default when the SPA and BFF share hito.autos.
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/github/callback` : null);
  const frontendReturnUrl =
    required("GITHUB_SETUP_URL") ??
    required("GITHUB_FRONTEND_RETURN_URL") ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/github/connect` : null);
  const stateSecret = required("GITHUB_STATE_SECRET") ?? clientSecret;

  const missing: string[] = [];
  if (!appId) missing.push("GITHUB_APP_ID");
  if (!clientId) missing.push("GITHUB_CLIENT_ID");
  if (!clientSecret) missing.push("GITHUB_CLIENT_SECRET");
  if (!privateKey) missing.push("GITHUB_PRIVATE_KEY");
  if (!callbackUrl) missing.push("GITHUB_CALLBACK_URL");
  if (!frontendReturnUrl) missing.push("GITHUB_SETUP_URL");
  if (!stateSecret) missing.push("GITHUB_STATE_SECRET");

  if (missing.length > 0 || !appId || !clientId || !clientSecret || !privateKey || !callbackUrl || !frontendReturnUrl || !stateSecret) {
    return { ok: false, missing };
  }

  return {
    ok: true,
    env: {
      appId,
      clientId,
      clientSecret,
      privateKey,
      callbackUrl,
      frontendReturnUrl,
      stateSecret,
    },
  };
}
