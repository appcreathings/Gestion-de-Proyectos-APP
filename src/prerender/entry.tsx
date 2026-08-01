import type { ReactNode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "node:stream";
import { StaticRouter } from "react-router-dom/server";
import { useRoutes, type RouteObject } from "react-router-dom";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { ThemeProvider } from "@/components/ThemeProvider";
import { marketingRoutes } from "@/routes/marketingRoutes";
import { BlogPostView } from "@/features/blog/pages/BlogPostPage";
import { getArticleMeta } from "@/features/blog/data/articles-index";
import { loadArticle } from "@/features/blog/data/articles";

export type RenderResult = { html: string; head: string };

function RouteTree({ routes }: { routes: RouteObject[] }) {
  return useRoutes(routes);
}

/**
 * `renderToString` no espera a los `React.lazy()` de `marketingRoutes` —
 * renderiza el fallback de `<Suspense>` de inmediato y listo (documentado:
 * no soporta esperar datos/código diferido). `renderToPipeableStream` sí
 * espera: `onAllReady` solo dispara cuando todo Suspense —incluidos los
 * imports diferidos— ya resolvió, así que el HTML final trae el contenido
 * real, no "Cargando…".
 */
function renderElement(element: ReactNode): Promise<RenderResult> {
  const helmetContext: { helmet?: HelmetServerState } = {};

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      abort(new Error("Prerender: renderToPipeableStream no resolvió a tiempo"));
    }, 15_000);

    const { pipe, abort } = renderToPipeableStream(
      <HelmetProvider context={helmetContext}>{element}</HelmetProvider>,
      {
        onAllReady() {
          clearTimeout(timeout);
          const chunks: Buffer[] = [];
          const passthrough = new PassThrough();
          passthrough.on("data", (chunk: Buffer) => chunks.push(chunk));
          passthrough.on("end", () => {
            const html = Buffer.concat(chunks).toString("utf-8");
            const helmet = helmetContext.helmet;
            const head = helmet
              ? [helmet.title, helmet.meta, helmet.link, helmet.script]
                  .map((tag) => tag?.toString() ?? "")
                  .join("\n")
              : "";
            resolve({ html, head });
          });
          pipe(passthrough);
        },
        onError(error) {
          clearTimeout(timeout);
          reject(error);
        },
      },
    );
  });
}

/** Rutas genéricas (landing, blog index/categoría, docs, SEO satélite). */
export function renderRoute(url: string): Promise<RenderResult> {
  return renderElement(
    <StaticRouter location={url}>
      <ThemeProvider>
        <RouteTree routes={marketingRoutes} />
      </ThemeProvider>
    </StaticRouter>,
  );
}

/**
 * Caso especial para `/blogs/:slug`: `BlogPostPage` resuelve el cuerpo del
 * artículo en un `useEffect` (que no corre en SSR), así que en vez de pasar
 * por el router se resuelve `loadArticle` acá y se renderiza `BlogPostView`
 * —la mitad presentacional, sin hooks de carga— directamente con los datos
 * ya listos.
 */
export async function renderBlogPost(slug: string): Promise<RenderResult | undefined> {
  const meta = getArticleMeta(slug);
  if (!meta) return undefined;
  const article = await loadArticle(slug);

  return renderElement(
    <StaticRouter location={`/blogs/${slug}`}>
      <ThemeProvider>
        <BlogPostView meta={meta} content={article?.content ?? null} />
      </ThemeProvider>
    </StaticRouter>,
  );
}
