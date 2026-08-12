/** Minimal helpers — no @vercel/node (avoids runtime import of a devDependency). */

export type ApiRequest = {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
};

export type ApiResponse = {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
  writableEnded?: boolean;
  headersSent?: boolean;
};

export function headerValue(
  headers: ApiRequest["headers"],
  name: string,
): string | undefined {
  const raw = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

function alreadySent(res: ApiResponse): boolean {
  return Boolean(res.writableEnded || res.headersSent);
}

export function json(res: ApiResponse, status: number, body: unknown): void {
  if (alreadySent(res)) return;
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export function redirect(res: ApiResponse, location: string): void {
  if (alreadySent(res)) return;
  res.statusCode = 302;
  res.setHeader("Location", location);
  res.setHeader("Cache-Control", "no-store");
  res.end();
}

export function methodNotAllowed(res: ApiResponse, allow: string): void {
  res.setHeader("Allow", allow);
  json(res, 405, { message: `Método no permitido. Usa ${allow}.` });
}

export function getRequestUrl(req: ApiRequest): URL {
  const host =
    headerValue(req.headers, "x-forwarded-host") ??
    headerValue(req.headers, "host") ??
    "localhost";
  const proto = headerValue(req.headers, "x-forwarded-proto") ?? "https";
  const path = req.url && req.url.length > 0 ? req.url : "/";
  try {
    if (/^https?:\/\//i.test(path)) return new URL(path);
    return new URL(path, `${proto}://${host}`);
  } catch {
    return new URL("/", `https://${host}`);
  }
}

export function queryParam(req: ApiRequest, name: string): string {
  const fromQuery = req.query?.[name];
  if (typeof fromQuery === "string") return fromQuery;
  if (Array.isArray(fromQuery) && typeof fromQuery[0] === "string") return fromQuery[0];
  try {
    return getRequestUrl(req).searchParams.get(name) ?? "";
  } catch {
    return "";
  }
}

export function pathParamId(req: ApiRequest): string {
  // Dynamic segment [id] lands in query on Vercel Node handlers.
  const fromQuery = queryParam(req, "id");
  if (fromQuery) return fromQuery;
  try {
    const url = getRequestUrl(req);
    const parts = url.pathname.split("/").filter(Boolean);
    // /api/github/connection/:id[/...]
    const idx = parts.indexOf("connection");
    if (idx >= 0 && parts[idx + 1]) return decodeURIComponent(parts[idx + 1]!);
  } catch {
    /* ignore */
  }
  return "";
}

export function frontendErrorRedirect(base: string, error: string): string {
  try {
    const url = new URL(base);
    url.searchParams.set("status", "error");
    url.searchParams.set("error", error.slice(0, 500));
    return url.toString();
  } catch {
    return `/github/connect?status=error&error=${encodeURIComponent(error.slice(0, 200))}`;
  }
}

export function frontendSuccessRedirect(base: string, connectionId: string): string {
  try {
    const url = new URL(base);
    url.searchParams.set("status", "ok");
    url.searchParams.set("connectionId", connectionId);
    return url.toString();
  } catch {
    return `/github/connect?status=ok&connectionId=${encodeURIComponent(connectionId)}`;
  }
}

export function safeErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Error interno del BFF de GitHub.";
}

export async function withHandler(
  req: ApiRequest,
  res: ApiResponse,
  run: () => void | Promise<void>,
): Promise<void> {
  try {
    await run();
  } catch (error) {
    console.error("[api/github]", error);
    json(res, 500, {
      message: safeErrorMessage(error),
      code: "FUNCTION_INVOCATION_FAILED",
    });
  }
}
