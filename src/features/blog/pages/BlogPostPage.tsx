import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { SeoPage } from "@/features/seo/SeoPage";
import { SeoArticle } from "@/features/seo/SeoArticle";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getArticleMeta } from "../data/articles-index";
import { loadArticle } from "../data/articles";
import type { BlogArticleContent, BlogArticleMeta } from "../types";
import { RelatedPosts } from "../components/RelatedPosts";

type BlogPostViewProps = {
  meta: BlogArticleMeta;
  content: BlogArticleContent | null;
};

/**
 * Presentacional puro, sin hooks de carga — así el prerender (spec 040 fase
 * C, `src/prerender/entry.tsx`) puede resolver `loadArticle` de antemano y
 * renderizar esto directamente con `renderToString`. `useEffect` no corre en
 * SSR: si esta lógica siguiera viviendo en `BlogPostPage`, el HTML estático
 * saldría con el cuerpo del artículo vacío.
 */
export function BlogPostView({ meta, content }: BlogPostViewProps) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  const publishedDate = formatDate(meta.publishedAt);
  const updatedDate = meta.updatedAt ? formatDate(meta.updatedAt) : null;

  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: meta.title,
      description: meta.excerpt,
      image: "https://hito.autos/og-image.png",
      author: { "@type": "Organization", name: meta.author?.name ?? "Hito" },
      publisher: { "@type": "Organization", name: "Hito" },
      datePublished: meta.publishedAt,
      dateModified: meta.updatedAt ?? meta.publishedAt,
      mainEntityOfPage: `https://hito.autos/blogs/${meta.slug}`,
    },
  ];
  if (content?.faq?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }
  if (content?.howTo) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: content.howTo.name,
      step: content.howTo.steps.map((step) => ({
        "@type": "HowToStep",
        name: step.name,
        text: step.text,
      })),
    });
  }

  return (
    <SeoPage
      title={meta.seo.title}
      description={meta.seo.description}
      path={`/blogs/${meta.slug}`}
      ogImageAlt={meta.seo.ogImageAlt}
      ogType="article"
      breadcrumb={[
        { label: "Inicio", path: "/" },
        { label: "Blog", path: "/blogs" },
        { label: meta.title, path: `/blogs/${meta.slug}` },
      ]}
      schemaJson={schemas}
    >
      <article className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-6 pt-24 sm:pt-32">
          <Breadcrumb
            items={[{ label: "Blog", href: "/blogs" }, { label: meta.title }]}
            className="mb-6"
          />
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono uppercase tracking-widest">
              {meta.categoryLabel}
            </span>
            <span aria-hidden>·</span>
            <span>{publishedDate}</span>
            {updatedDate ? (
              <>
                <span aria-hidden>·</span>
                <span>Actualizado el {updatedDate}</span>
              </>
            ) : null}
            <span aria-hidden>·</span>
            <span>{meta.readingTime} de lectura</span>
          </div>
        </div>

        <SeoArticle
          eyebrow={content?.eyebrow ?? meta.categoryLabel}
          title={meta.title}
          intro={content?.intro ?? meta.excerpt}
          sections={content?.sections ?? []}
          faq={content?.faq}
          cta={{ label: "Probar Hito — sin registro" }}
        />
      </article>

      <RelatedPosts currentSlug={meta.slug} category={meta.category} />
    </SeoPage>
  );
}

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

  return <BlogPostView meta={meta} content={content} />;
}
