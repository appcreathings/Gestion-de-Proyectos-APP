import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SeoPage } from "@/features/seo/SeoPage";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/paths";
import { BLOG_ARTICLES_META } from "../data/articles-index";
import { BLOG_CATEGORIES } from "../data/categories";
import { BlogCard } from "../components/BlogCard";
import type { BlogCategory } from "../types";

/**
 * Versión indexable del filtro de categoría de `BlogIndexPage` (que hoy vive
 * en `?categoria=X`, una sola URL para las 8+ categorías ante Google). Cada
 * categoría tiene aquí su propia ruta, título y `CollectionPage` en JSON-LD.
 */
export function BlogCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const isValid = category !== undefined && category in BLOG_CATEGORIES;

  const articles = useMemo(() => {
    if (!isValid) return [];
    return BLOG_ARTICLES_META.filter((a) => a.category === category);
  }, [category, isValid]);

  if (!isValid) {
    return <Navigate to="/blogs" replace />;
  }

  const cat = category as BlogCategory;
  const label = BLOG_CATEGORIES[cat].label;
  const description = BLOG_CATEGORIES[cat].description;

  return (
    <SeoPage
      title={`${label} — Blog Hito`}
      description={`Artículos de ${label.toLowerCase()}: ${description} Guías prácticas de gestión de proyectos.`}
      path={`/blogs/categoria/${cat}`}
      breadcrumb={[
        { label: "Inicio", path: "/" },
        { label: "Blog", path: "/blogs" },
        { label, path: `/blogs/categoria/${cat}` },
      ]}
      schemaJson={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${label} — Blog Hito`,
        description,
        url: `https://hito.autos/blogs/categoria/${cat}`,
        hasPart: articles.map((a) => ({
          "@type": "BlogPosting",
          headline: a.title,
          url: `https://hito.autos/blogs/${a.slug}`,
        })),
      }}
    >
      <div className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <Link
            to="/blogs"
            className="mb-4 inline-block font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Blog
          </Link>
          <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {label}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to={ROUTES.dashboard}>
              <Button size="lg" className="h-11 gap-2 px-6">
                Probar Hito — sin registro
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        {articles.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No hay artículos en esta categoría todavía.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <BlogCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </SeoPage>
  );
}
