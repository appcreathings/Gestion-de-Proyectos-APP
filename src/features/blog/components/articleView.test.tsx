import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { SeoArticle } from "@/features/seo/SeoArticle";
import { ArticleHeader } from "./ArticleHeader";
import { ArticleToc } from "./ArticleToc";
import { AuthorCard } from "./AuthorCard";
import { BLOG_CATEGORIES } from "../data/categories";
import { DEFAULT_AUTHOR } from "../data/articles-index";
import { buildSectionIds } from "../utils/sectionId";
import type { BlogArticleMeta } from "../types";

/**
 * Spec 059 — la vista de artículo se prerenderiza (`scripts/prerender.mjs`), así
 * que lo que importa verificar es el HTML estático, no el comportamiento tras
 * hidratar. `renderToStaticMarkup` reproduce exactamente ese output: los
 * `useEffect` no corren, igual que en el servidor.
 */
function render(node: React.ReactNode) {
  return renderToStaticMarkup(<StaticRouter location="/blogs/x">{node}</StaticRouter>);
}

const META: BlogArticleMeta = {
  slug: "kanban-limites-wip",
  title: "Kanban WIP: qué significa el límite",
  excerpt: "Resumen del artículo.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-12-28",
  readingTime: "8 min",
  featured: false,
  author: { name: "Equipo Hito", role: "Producto" },
  seo: { title: "t", description: "d" },
};

const SECTIONS = [
  { heading: "Qué es el límite WIP", body: <p>Cuerpo uno.</p> },
  { heading: "Cómo definirlo", body: <p>Cuerpo dos.</p> },
];

describe("ArticleHeader", () => {
  it("no repite la categoría (antes salía como metadata y otra vez como eyebrow)", () => {
    const html = render(<ArticleHeader meta={META} intro="Intro." />);
    const matches = html.match(/Gestión de proyectos/g) ?? [];
    expect(matches).toHaveLength(1);
  });

  it("enlaza la categoría a su URL indexable", () => {
    const html = render(<ArticleHeader meta={META} intro="Intro." />);
    expect(html).toContain('href="/blogs/categoria/gestion-proyectos"');
  });

  it("omite el chip de actualización cuando no hay updatedAt", () => {
    const html = render(<ArticleHeader meta={META} intro="Intro." />);
    expect(html).not.toContain("Actualizado el");
  });

  it("destaca updatedAt cuando existe", () => {
    const html = render(
      <ArticleHeader meta={{ ...META, updatedAt: "2027-01-15" }} intro="Intro." />,
    );
    expect(html).toContain("Actualizado el");
    // React 18 emite el atributo como `dateTime`; el parser HTML lo normaliza.
    expect(html.toLowerCase()).toContain('datetime="2027-01-15"');
  });

  it("no corre las fechas un día hacia atrás en zonas al oeste de UTC", () => {
    // `new Date("2026-12-28")` es medianoche UTC: sin `timeZone: "UTC"` toda
    // América veía la fecha del día anterior.
    const html = render(<ArticleHeader meta={META} intro="Intro." />);
    expect(html).toContain("28 de diciembre de 2026");
  });

  it("emite el sentinel que gobierna el CTA flotante", () => {
    expect(render(<ArticleHeader meta={META} intro="Intro." />)).toContain("data-cta-sentinel");
  });
});

describe("SeoArticle — vista de blog", () => {
  it("no abre un <article> propio cuando el caller ya trae cabecera", () => {
    const conHeader = render(
      <SeoArticle
        hasOwnHeader
        eyebrow="e"
        title="t"
        intro="i"
        sections={SECTIONS}
        cta={{ label: "cta" }}
      />,
    );
    expect(conHeader).not.toContain("<article");

    // Las páginas satélite SEO siguen recibiendo su <article> como siempre.
    const sinHeader = render(
      <SeoArticle eyebrow="e" title="t" intro="i" sections={SECTIONS} cta={{ label: "cta" }} />,
    );
    expect(sinHeader).toContain("<article");
  });

  it("no repite el h1 ni la intro cuando la cabecera ya los mostró", () => {
    const html = render(
      <SeoArticle
        hasOwnHeader
        eyebrow="Metodologías"
        title="Kanban WIP"
        intro="Intro única."
        sections={SECTIONS}
        cta={{ label: "cta" }}
      />,
    );
    expect(html).not.toContain("<h1");
    expect(html).not.toContain("Intro única.");
  });

  it("aplica la capa tipográfica real, no las clases prose muertas", () => {
    const html = render(
      <SeoArticle eyebrow="e" title="t" intro="i" sections={SECTIONS} cta={{ label: "cta" }} />,
    );
    expect(html).toContain("article-prose");
    // `@tailwindcss/typography` no está instalado: estas clases no generaban CSS.
    expect(html).not.toContain("prose-neutral");
    expect(html).not.toContain("prose-invert");
  });

  it("da id y ancla permanente a cada sección", () => {
    const html = render(
      <SeoArticle eyebrow="e" title="t" intro="i" sections={SECTIONS} cta={{ label: "cta" }} />,
    );
    for (const id of buildSectionIds(SECTIONS.map((s) => s.heading))) {
      expect(html).toContain(`id="${id}"`);
      expect(html).toContain(`href="#${id}"`);
    }
  });

  it("deja las respuestas de FAQ en el HTML aunque el <details> esté cerrado", () => {
    // Es el motivo de usar <details> nativo en vez de Radix: el schema FAQPage
    // necesita respaldo visible en la página prerenderizada.
    const html = render(
      <SeoArticle
        eyebrow="e"
        title="t"
        intro="i"
        sections={SECTIONS}
        faq={[
          { question: "¿Qué es WIP?", answer: "Work In Progress." },
          { question: "¿Y en Scrum?", answer: "Se usa igual." },
        ]}
        cta={{ label: "cta" }}
      />,
    );
    expect(html).toContain("Work In Progress.");
    expect(html).toContain("Se usa igual.");
    // Solo la primera viene abierta.
    expect(html.match(/<details[^>]*\sopen/g) ?? []).toHaveLength(1);
  });
});

describe("ArticleToc", () => {
  it("apunta a los mismos ids que emite SeoArticle", () => {
    const headings = SECTIONS.map((s) => s.heading);
    const toc = render(<ArticleToc headings={headings} />);
    const article = render(
      <SeoArticle eyebrow="e" title="t" intro="i" sections={SECTIONS} cta={{ label: "cta" }} />,
    );

    for (const id of buildSectionIds(headings)) {
      expect(toc).toContain(`href="#${id}"`);
      expect(article).toContain(`id="${id}"`);
    }
  });

  it("funciona sin JS: es una lista de anclas, no botones", () => {
    const html = render(<ArticleToc headings={SECTIONS.map((s) => s.heading)} />);
    expect(html).not.toContain("<button");
    expect(html).toContain("En este artículo");
  });

  it("no renderiza nada sin secciones", () => {
    expect(render(<ArticleToc headings={[]} />)).toBe("");
  });
});

describe("AuthorCard", () => {
  it("cae a DEFAULT_AUTHOR cuando el artículo no declara autor", () => {
    expect(render(<AuthorCard />)).toContain(DEFAULT_AUTHOR.name);
  });

  it("no imprime un separador huérfano cuando falta el rol", () => {
    const html = render(<AuthorCard author={{ name: "Ana Pérez" }} />);
    expect(html).toContain("Ana Pérez");
    expect(html).not.toContain("· Escribimos");
  });
});

describe("firma de categoría", () => {
  it("cada categoría resuelve a un hue distinto para --cat-h", () => {
    const hues = Object.values(BLOG_CATEGORIES).map((c) => c.hue);
    expect(new Set(hues).size).toBe(hues.length);
  });
});
