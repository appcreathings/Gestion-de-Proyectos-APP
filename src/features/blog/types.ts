import type { ReactNode } from "react";

export type BlogCategory =
  | "privacidad"
  | "procesos"
  | "automatizacion"
  | "inteligencia-artificial"
  | "productividad"
  | "pensamiento"
  | "comparativas"
  | "implementacion";

/**
 * Metadata ligera de un artículo — sin el cuerpo JSX.
 * La consumen el índice, las tarjetas y los relacionados. Vive en
 * `data/articles-index.ts` como módulo estático (no arrastra `content`).
 */
export type BlogArticleMeta = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  categoryLabel: string;
  publishedAt: string;
  readingTime: string;
  featured: boolean;
  seo: {
    title: string;
    description: string;
    ogImageAlt?: string;
  };
};

/**
 * Cuerpo del artículo (JSX pesado). Se carga de forma diferida por slug
 * desde `data/articles/<slug>.tsx` — un chunk por artículo.
 */
export type BlogArticleContent = {
  eyebrow: string;
  intro: ReactNode;
  sections: { heading: string; body: ReactNode }[];
};

export type BlogArticle = BlogArticleMeta & {
  content: BlogArticleContent;
};
