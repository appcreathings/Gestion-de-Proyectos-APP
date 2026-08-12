import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  createSign,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

function b64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function b64urlJson(value: unknown): string {
  return b64url(JSON.stringify(value));
}

function decodeB64url(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(padded + pad, "base64");
}

export function randomToken(bytes = 24): string {
  return randomBytes(bytes).toString("base64url");
}

/** Signed, short-lived OAuth state (TTL enforces reuse window). */
export function signState(secret: string, payload: Record<string, unknown>): string {
  const body = b64urlJson({ ...payload, exp: Math.floor(Date.now() / 1000) + 10 * 60 });
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyState(
  secret: string,
  token: string,
): { ok: true; payload: Record<string, unknown> } | { ok: false; reason: string } {
  const [body, sig] = token.split(".");
  if (!body || !sig) return { ok: false, reason: "state_malformed" };
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "state_invalid" };
  }
  try {
    const json = JSON.parse(decodeB64url(body).toString("utf8")) as Record<string, unknown>;
    const exp = typeof json.exp === "number" ? json.exp : 0;
    if (exp < Math.floor(Date.now() / 1000)) return { ok: false, reason: "state_expired" };
    return { ok: true, payload: json };
  } catch {
    return { ok: false, reason: "state_parse" };
  }
}

export type ConnectionClaims = {
  connectionId: string;
  installationId: number;
  githubUserId: number;
  githubLogin: string;
  exp: number;
  /**
   * User-to-server access token cifrado (AES-GCM). Solo el BFF puede abrirlo.
   * Necesario para crear repos de usuario (POST /user/repos).
   */
  userAccessToken?: string;
};

function aesKey(secret: string): Buffer {
  return createHash("sha256").update(`hito-gh-uat:${secret}`).digest();
}

/** Cifra un secreto para meterlo en el connectionId sin exponerlo en claro. */
export function sealSecret(secret: string, plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", aesKey(secret), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${enc.toString("base64url")}`;
}

export function openSecret(secret: string, sealed: string): string | null {
  try {
    const [ivB64, tagB64, encB64] = sealed.split(".");
    if (!ivB64 || !tagB64 || !encB64) return null;
    const iv = Buffer.from(ivB64, "base64url");
    const tag = Buffer.from(tagB64, "base64url");
    const enc = Buffer.from(encB64, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", aesKey(secret), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

/** Opaque connection handle — claims firmados; el user token va cifrado. */
export function mintConnectionId(
  secret: string,
  claims: {
    installationId: number;
    githubUserId: number;
    githubLogin: string;
    /** Plain user OAuth token; se sella antes de firmar. */
    userAccessToken?: string;
  },
  ttlSec = 8 * 3600,
): string {
  const payload: Record<string, unknown> = {
    installationId: claims.installationId,
    githubUserId: claims.githubUserId,
    githubLogin: claims.githubLogin,
    exp: Math.floor(Date.now() / 1000) + ttlSec,
  };
  if (claims.userAccessToken) {
    payload.uat = sealSecret(secret, claims.userAccessToken);
  }
  const body = b64urlJson(payload);
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function parseConnectionId(
  secret: string,
  connectionId: string,
): { ok: true; claims: ConnectionClaims } | { ok: false; reason: string } {
  const [body, sig] = connectionId.split(".");
  if (!body || !sig) return { ok: false, reason: "connection_malformed" };
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "connection_invalid" };
  }
  try {
    const json = JSON.parse(decodeB64url(body).toString("utf8")) as {
      installationId?: number;
      githubUserId?: number;
      githubLogin?: string;
      exp?: number;
      uat?: string;
    };
    if (
      typeof json.installationId !== "number" ||
      typeof json.githubUserId !== "number" ||
      typeof json.githubLogin !== "string" ||
      typeof json.exp !== "number"
    ) {
      return { ok: false, reason: "connection_payload" };
    }
    if (json.exp < Math.floor(Date.now() / 1000)) {
      return { ok: false, reason: "connection_expired" };
    }
    let userAccessToken: string | undefined;
    if (typeof json.uat === "string" && json.uat) {
      userAccessToken = openSecret(secret, json.uat) ?? undefined;
    }
    return {
      ok: true,
      claims: {
        connectionId,
        installationId: json.installationId,
        githubUserId: json.githubUserId,
        githubLogin: json.githubLogin,
        exp: json.exp,
        userAccessToken,
      },
    };
  } catch {
    return { ok: false, reason: "connection_parse" };
  }
}

/**
 * GitHub App JWT (RS256). Returns a result instead of throwing so bad PEMs
 * never crash the serverless process with FUNCTION_INVOCATION_FAILED.
 */
export function createAppJwt(
  appId: string,
  privateKeyPem: string,
): { ok: true; jwt: string } | { ok: false; message: string } {
  try {
    const header = b64urlJson({ alg: "RS256", typ: "JWT" });
    const now = Math.floor(Date.now() / 1000);
    const payload = b64urlJson({ iat: now - 60, exp: now + 9 * 60, iss: appId });
    const data = `${header}.${payload}`;
    const signer = createSign("RSA-SHA256");
    signer.update(data);
    signer.end();
    const signature = signer.sign(normalizePem(privateKeyPem)).toString("base64url");
    return { ok: true, jwt: `${data}.${signature}` };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? `Private key inválida o no usable: ${error.message}`
          : "Private key inválida o no usable.",
    };
  }
}

/** Accept PEM with literal \n, missing newlines, or PKCS#1 / PKCS#8 headers. */
function normalizePem(raw: string): string {
  let key = raw.trim();
  // Strip wrapping quotes often pasted into Vercel UI.
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  key = key.replace(/\\n/g, "\n");
  // If someone pasted the PEM without line breaks, restore them.
  if (!key.includes("\n") && key.includes("-----BEGIN")) {
    key = key
      .replace(/-----BEGIN ([A-Z0-9 ]+)-----/, "-----BEGIN $1-----\n")
      .replace(/-----END ([A-Z0-9 ]+)-----/, "\n-----END $1-----")
      .replace(/\s+/g, (m, offset, s) => {
        // Keep single newlines we just inserted; collapse other whitespace in body.
        if (m.includes("\n")) return m;
        return "";
      });
    // Better body wrap: extract and rewrap base64 body at 64 cols.
    const match = key.match(/-----BEGIN ([A-Z0-9 ]+)-----\s*([\s\S]*?)\s*-----END \1-----/);
    if (match) {
      const label = match[1]!;
      const body = match[2]!.replace(/\s+/g, "");
      const lines = body.match(/.{1,64}/g)?.join("\n") ?? body;
      key = `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`;
    }
  }
  return key;
}
