import type { ReactNode } from "react";

export type BlogCategory =
  | "privacidad"
  | "procesos"
  | "automatizacion"
  | "inteligencia-artificial"
  | "productividad"
  | "pensamiento"
  | "comparativas"
  | "implementacion"
  | "gestion-proyectos"
  | "plantillas";

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
  /** ISO; si falta, el render y el schema caen a `publishedAt`. */
  updatedAt?: string;
  readingTime: string;
  featured: boolean;
  /**
   * Señal E-E-A-T para schema `author` — no se muestra como bio pública.
   * Opcional: los artículos anteriores a spec 040 no lo declaran en su propio
   * `data/articles/<slug>.tsx` (esos archivos duplican metadata que
   * `BlogPostPage` no usa) y reciben `DEFAULT_AUTHOR` vía `BLOG_ARTICLES_META`
   * en `articles-index.ts`, la única fuente que el render realmente consume.
   */
  author?: { name: string; role?: string };
  /** Slug del artículo pilar del cluster (vacío en los propios pilares). */
  pillar?: string;
  /** Slugs relacionados explícitos, cross-categoría; tienen prioridad sobre el fallback por categoría. */
  related?: string[];
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
  /** Preguntas frecuentes — alimenta el schema FAQPage y se renderiza al final del artículo. */
  faq?: { question: string; answer: string }[];
  /** Procedimiento paso a paso — alimenta el schema HowTo. */
  howTo?: { name: string; steps: { name: string; text: string }[] };
};

export type BlogArticle = BlogArticleMeta & {
  content: BlogArticleContent;
};
