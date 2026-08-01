import { useMemo } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SeoPage } from "@/features/seo/SeoPage";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/paths";
import { BLOG_ARTICLES_META } from "../data/articles-index";
import { BLOG_CATEGORIES } from "../data/categories";
import { BlogCard } from "../components/BlogCard";
import { CategoryBadge } from "../components/CategoryBadge";
import type { BlogCategory } from "../types";

export function BlogIndexPage() {
  const [searchParams] = useSearchParams();
  const featuredArticle = useMemo(
    () => BLOG_ARTICLES_META.find((a) => a.featured),
    [],
  );

  // `?categoria=X` era la única forma de filtrar por categoría antes de que
  // existiera /blogs/categoria/:category (spec 040) — conserva el link equity
  // de cualquier enlace o bookmark viejo que aún la use.
  const legacyCategory = searchParams.get("categoria");
  if (legacyCategory) {
    return <Navigate to={`/blogs/categoria/${legacyCategory}`} replace />;
  }

  return (
    <SeoPage
      title="Blog — Hito"
      description="Reflexiones, guías e ideas sobre gestión de proyectos, privacidad, procesos y el futuro del trabajo local-first."
      path="/blogs"
      breadcrumb={[
        { label: "Inicio", path: "/" },
        { label: "Blog", path: "/blogs" },
      ]}
    >
      <div className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Blog
          </p>
          <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Ideas para trabajar con más claridad y menos ruido.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Reflexiones sobre gestión de proyectos, soberanía de datos,
            automatización y cómo organizar el trabajo sin perder el control.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to={ROUTES.dashboard}>
              <Button size="lg" className="h-11 gap-2 px-6">
                Probar Hito — sin registro
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link
              to={ROUTES.landing}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Conocer el producto →
            </Link>
          </div>
        </div>
      </div>

      {/* Featured post */}
      {featuredArticle && (
        <div className="border-b border-border/60 bg-muted/20">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Destacado
            </p>
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
              <div>
                <CategoryBadge category={featuredArticle.category} />
                <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                  {featuredArticle.title}
                </h2>
                <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
                  {featuredArticle.excerpt}
                </p>
                <a
                  href={`/blogs/${featuredArticle.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  Leer artículo destacado
                  <span aria-hidden>→</span>
                </a>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background p-6 lg:p-8">
                <blockquote className="text-balance text-lg font-medium leading-relaxed text-foreground/90">
                  “La soberanía de los datos no significa rechazar toda la nube.
                  Significa decidir conscientemente qué información vive dónde,
                  bajo qué condiciones y quién puede acceder a ella.”
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters — cada categoría es una URL propia (/blogs/categoria/:category),
          indexable, en vez del ?categoria= de antes. */}
      <div className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background">
              Todos
            </span>
            {(Object.keys(BLOG_CATEGORIES) as BlogCategory[]).map((category) => (
              <Link
                key={category}
                to={`/blogs/categoria/${category}`}
                className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
              >
                {BLOG_CATEGORIES[category].label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Articles grid */}
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_ARTICLES_META.map((article) => (
            <BlogCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </SeoPage>
  );
}
