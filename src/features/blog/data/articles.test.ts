import { describe, expect, it } from "vitest";
import { BLOG_ARTICLES_META, BLOG_SLUGS, getArticleMeta, getRelatedMeta } from "./articles-index";
import { loadArticle } from "./articles";
import { BLOG_CATEGORIES } from "./categories";

/**
 * Anti-drift (fase C pendiente de spec 035, ejecutada en spec 040): con 24+
 * artículos y enlaces pilar/satélite explícitos, un slug desincronizado entre
 * `articles-index.ts` y `articles/index.ts`, o un `pillar`/`related` que
 * apunta a nada, deja de ser hipotético.
 */
describe("blog articles — anti-drift", () => {
  it("loadArticle resuelve todos los slugs declarados en BLOG_ARTICLES_META", async () => {
    for (const slug of BLOG_SLUGS) {
      const article = await loadArticle(slug);
      expect(article, `loadArticle("${slug}") no debe ser undefined`).toBeDefined();
      expect(article?.slug).toBe(slug);
    }
  });

  it("no hay slugs duplicados", () => {
    expect(new Set(BLOG_SLUGS).size).toBe(BLOG_SLUGS.length);
  });

  it("todo slug coincide con getArticleMeta", () => {
    for (const slug of BLOG_SLUGS) {
      expect(getArticleMeta(slug)?.slug).toBe(slug);
    }
  });

  it("toda categoría usada existe en BLOG_CATEGORIES", () => {
    for (const article of BLOG_ARTICLES_META) {
      expect(BLOG_CATEGORIES[article.category], `categoría de "${article.slug}"`).toBeDefined();
    }
  });

  it("todo `pillar` apunta a un slug existente", () => {
    for (const article of BLOG_ARTICLES_META) {
      if (!article.pillar) continue;
      expect(
        BLOG_SLUGS.includes(article.pillar),
        `"${article.slug}".pillar = "${article.pillar}" no existe`,
      ).toBe(true);
    }
  });

  it("todo `related` apunta a slugs existentes y no se autorreferencia", () => {
    for (const article of BLOG_ARTICLES_META) {
      if (!article.related) continue;
      for (const slug of article.related) {
        expect(
          BLOG_SLUGS.includes(slug),
          `"${article.slug}".related incluye "${slug}", que no existe`,
        ).toBe(true);
        expect(slug, `"${article.slug}".related no debe autorreferenciarse`).not.toBe(
          article.slug,
        );
      }
    }
  });

  it("getRelatedMeta nunca incluye el propio artículo ni excede el límite", () => {
    for (const article of BLOG_ARTICLES_META) {
      const related = getRelatedMeta(article.slug, article.category);
      expect(related.some((a) => a.slug === article.slug)).toBe(false);
      expect(related.length).toBeLessThanOrEqual(3);
    }
  });
});
