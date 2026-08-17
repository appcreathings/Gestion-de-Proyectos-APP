import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, RefreshCw } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BLOG_CATEGORIES } from "../data/categories";
import type { BlogArticleMeta } from "../types";
import { ShareButton } from "./ShareButton";

type ArticleHeaderProps = {
  meta: BlogArticleMeta;
  /** Lead del artículo: `content.intro ?? meta.excerpt`. */
  intro: ReactNode;
};

function formatDate(iso: string) {
  // `new Date("2026-12-28")` es medianoche UTC; sin fijar la zona,
  // `toLocaleDateString` la corre al día anterior en toda América (la audiencia
  // del blog es LATAM). El código previo a la spec 059 tenía este bug: los
  // artículos mostraban su fecha de publicación un día antes.
  return new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Cabecera del artículo — spec 059.
 *
 * Tres capas de fondo, todas CSS: radial teñido con el hue de la categoría,
 * grid de líneas con `maskImage` (el mismo patrón que el Hero de la landing) y
 * el borde que cierra el bloque. Cero imágenes: el header no descarga un byte.
 *
 * El color variable viaja por `--cat-h` (declarada en el `<article>` padre), no
 * por className: Tailwind purga cualquier clase armada por interpolación, así
 * que las clases arbitrarias de abajo son literales estáticos y un solo par de
 * reglas light/dark sirve para las 10 categorías.
 *
 * Sin estado ni efectos → se prerenderiza tal cual.
 */
export function ArticleHeader({ meta, intro }: ArticleHeaderProps) {
  const categoryLabel = BLOG_CATEGORIES[meta.category]?.label ?? meta.categoryLabel;
  const publishedDate = formatDate(meta.publishedAt);
  const updatedDate = meta.updatedAt ? formatDate(meta.updatedAt) : null;

  return (
    <header className="relative isolate overflow-hidden border-b border-border/60">
      {/* Capa 1 — dos focos desalineados en vez de un halo simétrico: la
          asimetría es lo que hace que el fondo se lea como textura y no como
          un degradado de plantilla. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_75%_at_18%_0%,hsl(var(--cat-h)_72%_52%/0.22),transparent_60%),radial-gradient(ellipse_50%_60%_at_88%_10%,hsl(calc(var(--cat-h)_+_28)_70%_55%/0.13),transparent_62%)] dark:bg-[radial-gradient(ellipse_60%_75%_at_18%_0%,hsl(var(--cat-h)_72%_58%/0.20),transparent_60%),radial-gradient(ellipse_50%_60%_at_88%_10%,hsl(calc(var(--cat-h)_+_28)_70%_60%/0.12),transparent_62%)]"
      />
      {/* Capa 2 — grid desvanecido hacia abajo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70 dark:opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)/0.55) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)/0.55) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 85% 85% at 50% 0%, #000, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 85% at 50% 0%, #000, transparent 75%)",
        }}
      />
      {/* Capa 3 — funde el bloque con el cuerpo para que el borde inferior no
          corte el color de golpe. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-background"
      />

      <div className="mx-auto max-w-3xl px-6 pb-12 pt-28 sm:pb-16 sm:pt-32">
        <Breadcrumb
          items={[{ label: "Blog", href: "/blogs" }, { label: meta.title }]}
          className="mb-8"
        />

        <Link
          to={`/blogs/categoria/${meta.category}`}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-[hsl(var(--cat-h)_60%_45%)] dark:bg-[hsl(var(--cat-h)_65%_60%)]"
          />
          {categoryLabel}
        </Link>

        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {meta.title}
        </h1>

        {/* `intro` puede traer bloques (`<p>`), así que el lead es un div: un
            `<p>` anidado sería HTML inválido y el navegador lo cerraría solo. */}
        <div className="mt-6 text-pretty text-lg leading-relaxed text-foreground/80 sm:text-xl">
          {intro}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden />
            <time dateTime={meta.publishedAt}>{publishedDate}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            {meta.readingTime} de lectura
          </span>
          {/* `updatedAt` es la señal de frescura que más pesa (para el lector y
              para Google): va como chip, no como un gris más de la fila. */}
          {updatedDate && meta.updatedAt ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 font-medium text-foreground/70 backdrop-blur">
              <RefreshCw className="size-3" aria-hidden />
              Actualizado el <time dateTime={meta.updatedAt}>{updatedDate}</time>
            </span>
          ) : null}
          <ShareButton
            title={meta.title}
            url={`https://hito.autos/blogs/${meta.slug}`}
            className="ml-auto"
          />
        </div>
      </div>

      {/* Umbral del CTA flotante: aparece una vez pasada la cabecera. */}
      <div data-cta-sentinel aria-hidden />
    </header>
  );
}
