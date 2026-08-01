#!/usr/bin/env node
// Prerender de las rutas públicas (spec 040 fase C). Corre después de
// `vite build` — toma dist/index.html ya construido (assets con hash,
// PWA manifest, etc.) como plantilla y, para cada ruta de marketing, escribe
// dist/<ruta>/index.html con el HTML real ya resuelto (no un shell vacío),
// para que un crawler o un navegador sin JS reciban el contenido completo.
//
// Ejecutado vía `tsx` (ya en devDependencies, mismo patrón que
// `scripts/mcp-server.mjs`) para poder importar `src/prerender/entry.tsx`
// tal cual, sin un segundo build de Vite.

import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { renderRoute, renderBlogPost } from "../src/prerender/entry.tsx";
import { BLOG_SLUGS } from "../src/features/blog/data/articles-index.ts";
import { BLOG_CATEGORY_SLUGS } from "../src/features/blog/data/categories.ts";
import { DOC_SLUGS } from "../src/features/docs/data/slugs.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");

const GENERIC_ROUTES = [
  "/",
  "/alternativa-trello",
  "/alternativa-notion-local",
  "/gestor-proyectos-offline",
  "/changelog",
  "/docs",
  "/blogs",
  ...DOC_SLUGS.map((slug) => `/docs/${slug}`),
  ...BLOG_CATEGORY_SLUGS.map((slug) => `/blogs/categoria/${slug}`),
];

function outputPathFor(route) {
  // "/" -> dist/index.html (el propio template, se sobreescribe con su HTML
  // ya resuelto). Cualquier otra ruta -> dist/<ruta>/index.html, que Vercel
  // sirve por filesystem antes de caer al rewrite SPA de vercel.json.
  if (route === "/") return path.join(distDir, "index.html");
  return path.join(distDir, route.replace(/^\//, ""), "index.html");
}

function injectIntoTemplate(template, { html, head }) {
  let out = template;
  // El template trae un <title> y una <meta name="description"> genéricos
  // (index.html): cada página los reemplaza con los suyos vía Helmet, así
  // que se retiran para no duplicar/contradecir lo que aporta `head`.
  out = out.replace(/<title>[\s\S]*?<\/title>\s*/, "");
  out = out.replace(/<meta\s+name="description"[^>]*>\s*/, "");
  out = out.replace("</head>", `${head}\n</head>`);
  out = out.replace(
    '<div id="root" class="h-full"></div>',
    `<div id="root" class="h-full">${html}</div>`,
  );
  return out;
}

async function writeRoute(route, template, result) {
  const outPath = outputPathFor(route);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, injectIntoTemplate(template, result), "utf-8");
  console.log(`[prerender] ${route} -> ${path.relative(root, outPath)}`);
}

async function main() {
  const template = await fs.readFile(path.join(distDir, "index.html"), "utf-8");

  for (const route of GENERIC_ROUTES) {
    const result = await renderRoute(route);
    await writeRoute(route, template, result);
  }

  for (const slug of BLOG_SLUGS) {
    const result = await renderBlogPost(slug);
    if (!result) {
      console.warn(`[prerender] omitido /blogs/${slug}: sin metadata (revisar articles-index.ts)`);
      continue;
    }
    await writeRoute(`/blogs/${slug}`, template, result);
  }

  console.log(
    `[prerender] listo: ${GENERIC_ROUTES.length + BLOG_SLUGS.length} rutas escritas como HTML estático.`,
  );
}

main().catch((error) => {
  console.error("[prerender] falló:", error);
  process.exit(1);
});
