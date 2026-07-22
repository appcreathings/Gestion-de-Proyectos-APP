import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { SeoPage } from "@/features/seo/SeoPage";
import { SeoArticle } from "@/features/seo/SeoArticle";
import { getArticleMeta } from "../data/articles-index";
import { loadArticle } from "../data/articles";
import type { BlogArticleContent } from "../types";
import { RelatedPosts } from "../components/RelatedPosts";

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const meta = slug ? getArticleMeta(slug) : undefined;
  const [content, setContent] = useState<BlogArticleContent | null>(null);

  useEffect(() => {
    let active = true;
    setContent(null);
    if (!slug) return;
    void loadArticle(slug).then((article) => {
      if (active) setContent(article?.content ?? null);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (!meta) {
    return <Navigate to="/blogs" replace />;
  }

  const publishedDate = new Date(meta.publishedAt).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <SeoPage
      title={meta.seo.title}
      description={meta.seo.description}
      path={`/blogs/${meta.slug}`}
      ogImageAlt={meta.seo.ogImageAlt}
      schemaJson={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: meta.title,
        description: meta.excerpt,
        author: { "@type": "Organization", name: "Hito" },
        publisher: { "@type": "Organization", name: "Hito" },
        datePublished: meta.publishedAt,
        mainEntityOfPage: `https://hito.autos/blogs/${meta.slug}`,
      }}
    >
      <article className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-6 pt-24 sm:pt-32">
          <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono uppercase tracking-widest">
              {meta.categoryLabel}
            </span>
            <span aria-hidden>·</span>
            <span>{publishedDate}</span>
            <span aria-hidden>·</span>
            <span>{meta.readingTime} de lectura</span>
          </div>
        </div>

        <SeoArticle
          eyebrow={content?.eyebrow ?? meta.categoryLabel}
          title={meta.title}
          intro={content?.intro ?? meta.excerpt}
          sections={content?.sections ?? []}
          cta={{ label: "Probar Hito — sin registro" }}
        />
      </article>

      <RelatedPosts currentSlug={meta.slug} category={meta.category} />
    </SeoPage>
  );
}
