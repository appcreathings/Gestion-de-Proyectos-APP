import { Suspense, lazy, type ReactNode } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";

// Route-level code-splitting: each page ships in its own chunk.
const LandingPage = lazy(() =>
  import("@/features/landing/LandingPage").then((m) => ({ default: m.LandingPage })),
);
const AlternativaTrelloPage = lazy(() =>
  import("@/features/seo/AlternativaTrelloPage").then((m) => ({
    default: m.AlternativaTrelloPage,
  })),
);
const AlternativaNotionPage = lazy(() =>
  import("@/features/seo/AlternativaNotionPage").then((m) => ({
    default: m.AlternativaNotionPage,
  })),
);
const GestorOfflinePage = lazy(() =>
  import("@/features/seo/GestorOfflinePage").then((m) => ({
    default: m.GestorOfflinePage,
  })),
);
const ChangelogPage = lazy(() =>
  import("@/features/seo/ChangelogPage").then((m) => ({ default: m.ChangelogPage })),
);
const DocsIndexPage = lazy(() =>
  import("@/features/docs/pages/DocsIndexPage").then((m) => ({ default: m.DocsIndexPage })),
);
const DocModulePage = lazy(() =>
  import("@/features/docs/pages/DocModulePage").then((m) => ({ default: m.DocModulePage })),
);
const BlogIndexPage = lazy(() =>
  import("@/features/blog/pages/BlogIndexPage").then((m) => ({
    default: m.BlogIndexPage,
  })),
);
const BlogCategoryPage = lazy(() =>
  import("@/features/blog/pages/BlogCategoryPage").then((m) => ({
    default: m.BlogCategoryPage,
  })),
);
const BlogPostPage = lazy(() =>
  import("@/features/blog/pages/BlogPostPage").then((m) => ({
    default: m.BlogPostPage,
  })),
);

export function Loading() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      Cargando…
    </div>
  );
}

export function page(el: ReactNode) {
  return (
    <Suspense fallback={<Loading />}>
      <ScrollToTop />
      {el}
    </Suspense>
  );
}

/**
 * Rutas públicas / de marketing — sin auth, sin IndexedDB, indexables por
 * buscadores. Fuente única compartida entre el router de la app (`App.tsx`) y
 * el entry de prerender (`src/prerender/entry.tsx`, spec 040 fase C): sin
 * esto, las rutas prerenderizadas y las servidas en producción podrían
 * divergir en silencio.
 */
export const marketingRoutes: RouteObject[] = [
  { path: "/", element: page(<LandingPage />) },
  { path: "/alternativa-trello", element: page(<AlternativaTrelloPage />) },
  { path: "/alternativa-notion-local", element: page(<AlternativaNotionPage />) },
  { path: "/gestor-proyectos-offline", element: page(<GestorOfflinePage />) },
  { path: "/changelog", element: page(<ChangelogPage />) },
  { path: "/docs", element: page(<DocsIndexPage />) },
  { path: "/docs/:slug", element: page(<DocModulePage />) },
  { path: "/blogs", element: page(<BlogIndexPage />) },
  { path: "/blogs/categoria/:category", element: page(<BlogCategoryPage />) },
  { path: "/blogs/:slug", element: page(<BlogPostPage />) },
  // Redirecciones por renombre de slugs (SEO-friendly, conserva link equity)
  { path: "/blog", element: <Navigate to="/blogs" replace /> },
  {
    path: "/blogs/soberania-datos-ventaja-competitiva",
    element: <Navigate to="/blogs/gestion-proyectos-sin-nube" replace />,
  },
  {
    path: "/blogs/documentar-procesos-equipo",
    element: <Navigate to="/blogs/como-documentar-procesos-equipos" replace />,
  },
  {
    path: "/blogs/asistente-ia-sin-entrenar-modelos",
    element: <Navigate to="/blogs/asistente-ia-proyectos-sin-datos" replace />,
  },
  {
    path: "/blogs/menos-herramientas-mas-claridad",
    element: <Navigate to="/blogs/organizar-proyectos-tareas-jerarquia" replace />,
  },
  {
    path: "/blogs/automatizaciones-sin-nube",
    element: <Navigate to="/blogs/automatizar-tareas-sin-nube" replace />,
  },
];
