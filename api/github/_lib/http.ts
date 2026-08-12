import type { VercelRequest, VercelResponse } from "@vercel/node";

export function json(res: VercelResponse, status: number, body: unknown): void {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.json(body);
}

export function redirect(res: VercelResponse, location: string): void {
  res.status(302).setHeader("Location", location);
  res.setHeader("Cache-Control", "no-store");
  res.end();
}

export function methodNotAllowed(res: VercelResponse, allow: string): void {
  res.setHeader("Allow", allow);
  json(res, 405, { message: `Método no permitido. Usa ${allow}.` });
}

export function getRequestUrl(req: VercelRequest): URL {
  const host = (req.headers["x-forwarded-host"] as string | undefined) ?? req.headers.host ?? "localhost";
  const proto = (req.headers["x-forwarded-proto"] as string | undefined) ?? "https";
  return new URL(req.url ?? "/", `${proto}://${host}`);
}

export function frontendErrorRedirect(base: string, error: string): string {
  const url = new URL(base);
  url.searchParams.set("status", "error");
  url.searchParams.set("error", error);
  return url.toString();
}

export function frontendSuccessRedirect(base: string, connectionId: string): string {
  const url = new URL(base);
  url.searchParams.set("status", "ok");
  url.searchParams.set("connectionId", connectionId);
  return url.toString();
}
