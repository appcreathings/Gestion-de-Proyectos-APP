/**
 * Servidor de producción para despliegue fuera de Vercel (Dokploy / Docker).
 *
 * Reproduce lo que Vercel hacía con `vercel.json` + `api/`:
 * - Redirecciones de `vercel.json` (308 permanente / 307 temporal).
 * - Rutas `/api/github/**` → los mismos handlers de `api/` (sin cambios).
 * - Archivos estáticos de `dist/` (incluye `dist/<ruta>/index.html` del prerender).
 * - Fallback SPA: cualquier ruta no-API sin archivo → `dist/index.html`.
 * - Cache-Control: `/assets/*` inmutable (tienen hash), el resto `no-cache`.
 * - Compresión gzip/brotli para respuestas de texto.
 *
 * Se empaqueta con rolldown a `server-dist/server.mjs` (sin dependencias en runtime).
 */
import http, { type IncomingMessage, type ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

import vercelConfig from "../vercel.json";
import callback from "../api/github/callback";
import connect from "../api/github/connect";
import health from "../api/github/health";
import connection from "../api/github/connection/[id]";
import contents from "../api/github/connection/[id]/contents";
import projects from "../api/github/connection/[id]/projects";
import repositories from "../api/github/connection/[id]/repositories";
import revoke from "../api/github/connection/[id]/revoke";

type Handler = (req: never, res: never) => Promise<void> | void;
type ApiRoute = { pattern: RegExp; handler: Handler };

const API_ROUTES: ApiRoute[] = [
  { pattern: /^\/api\/github\/callback\/?$/, handler: callback },
  { pattern: /^\/api\/github\/connect\/?$/, handler: connect },
  { pattern: /^\/api\/github\/health\/?$/, handler: health },
  { pattern: /^\/api\/github\/connection\/(?<id>[^/]+)\/contents\/?$/, handler: contents },
  { pattern: /^\/api\/github\/connection\/(?<id>[^/]+)\/projects\/?$/, handler: projects },
  { pattern: /^\/api\/github\/connection\/(?<id>[^/]+)\/repositories\/?$/, handler: repositories },
  { pattern: /^\/api\/github\/connection\/(?<id>[^/]+)\/revoke\/?$/, handler: revoke },
  { pattern: /^\/api\/github\/connection\/(?<id>[^/]+)\/?$/, handler: connection },
];

const REDIRECTS = new Map(
  (vercelConfig.redirects ?? []).map((r) => [r.source, { to: r.destination, permanent: r.permanent }]),
);

const here = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(process.env.DIST_DIR ?? path.join(here, "..", "dist"));
const PORT = Number(process.env.PORT ?? 3000);
const INDEX_HTML = path.join(DIST, "index.html");

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
  ".wasm": "application/wasm",
};

const COMPRESSIBLE = /^(text\/|application\/(javascript|json|xml|manifest\+json)|image\/svg\+xml)/;

/** Resuelve un pathname a un archivo dentro de dist/ (o null). Bloquea path traversal. */
function resolveStatic(pathname: string): string | null {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (decoded.includes("\0")) return null;
  const target = path.normalize(path.join(DIST, decoded));
  if (target !== DIST && !target.startsWith(DIST + path.sep)) return null;
  try {
    const stat = fs.statSync(target);
    if (stat.isFile()) return target;
    if (stat.isDirectory()) {
      const index = path.join(target, "index.html");
      if (fs.statSync(index).isFile()) return index;
    }
  } catch {
    /* no existe */
  }
  return null;
}

function pickEncoding(req: IncomingMessage): "br" | "gzip" | null {
  const accept = String(req.headers["accept-encoding"] ?? "");
  if (/\bbr\b/.test(accept)) return "br";
  if (/\bgzip\b/.test(accept)) return "gzip";
  return null;
}

function sendFile(req: IncomingMessage, res: ServerResponse, file: string, pathname: string): void {
  const type = MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  res.setHeader("Content-Type", type);
  res.setHeader(
    "Cache-Control",
    pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache",
  );
  res.setHeader("Vary", "Accept-Encoding");
  res.setHeader("X-Content-Type-Options", "nosniff");

  const encoding = COMPRESSIBLE.test(type) ? pickEncoding(req) : null;
  if (req.method === "HEAD") {
    if (encoding) res.setHeader("Content-Encoding", encoding);
    res.statusCode = 200;
    res.end();
    return;
  }
  const stream = fs.createReadStream(file);
  stream.on("error", () => {
    if (!res.headersSent) res.statusCode = 500;
    res.end();
  });
  res.statusCode = 200;
  if (encoding === "br") {
    res.setHeader("Content-Encoding", "br");
    stream.pipe(zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } })).pipe(res);
  } else if (encoding === "gzip") {
    res.setHeader("Content-Encoding", "gzip");
    stream.pipe(zlib.createGzip()).pipe(res);
  } else {
    res.setHeader("Content-Length", fs.statSync(file).size);
    stream.pipe(res);
  }
}

async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? "/", "http://localhost");
  const { pathname } = url;

  // 1. Redirecciones de vercel.json
  const redirect = REDIRECTS.get(pathname) ?? REDIRECTS.get(pathname.replace(/\/$/, ""));
  if (redirect) {
    res.statusCode = redirect.permanent ? 308 : 307;
    res.setHeader("Location", redirect.to + url.search);
    res.end();
    return;
  }

  // 2. API (mismos handlers que en Vercel; [id] llega en req.query como allí)
  if (pathname === "/api" || pathname.startsWith("/api/")) {
    for (const route of API_ROUTES) {
      const match = route.pattern.exec(pathname);
      if (!match) continue;
      const query: Record<string, string | string[]> = {};
      for (const key of new Set(url.searchParams.keys())) {
        const all = url.searchParams.getAll(key);
        query[key] = all.length > 1 ? all : all[0]!;
      }
      if (match.groups?.id) query.id = decodeURIComponent(match.groups.id);
      Object.assign(req, { query });
      await (route.handler as (q: unknown, s: unknown) => Promise<void>)(req, res);
      return;
    }
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ message: "Not found" }));
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    res.end();
    return;
  }

  // 3. Estático (filesystem primero, como Vercel) y 4. fallback SPA
  const file = resolveStatic(pathname);
  if (file) {
    sendFile(req, res, file, pathname);
    return;
  }
  // Un asset con hash que no existe no debe devolver index.html (rompería el MIME).
  if (pathname.startsWith("/assets/")) {
    res.statusCode = 404;
    res.end();
    return;
  }
  sendFile(req, res, INDEX_HTML, pathname);
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((error) => {
    console.error("[server]", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ message: "Internal error" }));
    } else {
      res.end();
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[server] Hito escuchando en :${PORT} (dist: ${DIST})`);
});

for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5000).unref();
  });
}
