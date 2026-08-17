import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useParams, Navigate } from "react-router-dom";
import { SeoPage } from "@/features/seo/SeoPage";
import { SeoArticle } from "@/features/seo/SeoArticle";
import { getArticleMeta } from "../data/articles-index";
import { loadArticle } from "../data/articles";
import { getCategoryHue } from "../data/categories";
import type { BlogArticleContent, BlogArticleMeta } from "../types";
import { RelatedPosts } from "../components/RelatedPosts";
import { ArticleHeader } from "../components/ArticleHeader";
import { ArticleToc } from "../components/ArticleToc";
import { AuthorCard } from "../components/AuthorCard";
import { ReadingProgress } from "../components/ReadingProgress";

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
  // Solo mide el avance de lectura — no carga datos, así que `BlogPostView`
  // sigue siendo presentacional puro y el prerender lo renderiza tal cual.
  const articleRef = useRef<HTMLElement>(null);
  const sections = content?.sections ?? [];

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
      {/* `--cat-h` se declara acá y la heredan header, viñetas del cuerpo,
          barra de progreso y TOC — un solo punto de verdad por artículo. */}
      <article
        ref={articleRef}
        className="border-b border-border/60"
        style={{ "--cat-h": getCategoryHue(meta.category) } as CSSProperties}
      >
        <ReadingProgress targetRef={articleRef} />

        <ArticleHeader meta={meta} intro={content?.intro ?? meta.excerpt} />

        <SeoArticle
          hasOwnHeader
          eyebrow={content?.eyebrow ?? meta.categoryLabel}
          title={meta.title}
          intro={content?.intro ?? meta.excerpt}
          sections={sections}
          faq={content?.faq}
          cta={{ label: "Probar Hito — sin registro" }}
          asideSlot={
            sections.length > 1 ? (
              <ArticleToc headings={sections.map((s) => s.heading)} />
            ) : undefined
          }
          footerSlot={<AuthorCard author={meta.author} />}
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
