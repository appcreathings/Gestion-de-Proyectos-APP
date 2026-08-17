import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/paths";
import { buildSectionIds } from "@/features/blog/utils/sectionId";
import { ArticleFaq } from "./ArticleFaq";
import { SectionAnchor } from "./SectionAnchor";

type SeoArticleProps = {
  eyebrow: string;
  title: React.ReactNode;
  intro: React.ReactNode;
  sections: { heading: string; body: React.ReactNode }[];
  /** Preguntas frecuentes, renderizadas al final — su schema FAQPage lo emite el caller. */
  faq?: { question: string; answer: string }[];
  cta: { label: string; href?: string };
  /**
   * El caller ya renderizó su propia cabecera (caso blog, spec 059): no se
   * repiten eyebrow/h1/intro ni se abre un `<article>` propio, y el padding
   * superior lo aporta ese header.
   */
  hasOwnHeader?: boolean;
  /** Columna lateral fija en ≥xl — la tabla de contenidos del artículo. */
  asideSlot?: React.ReactNode;
  /** Se inserta después de las FAQ y antes del CTA final — la firma del autor. */
  footerSlot?: React.ReactNode;
};

/** Editorial layout for SEO satellite pages: eyebrow → h1 → intro → sections → FAQ → CTA. */
export function SeoArticle({
  eyebrow,
  title,
  intro,
  sections,
  faq,
  cta,
  hasOwnHeader = false,
  asideSlot,
  footerSlot,
}: SeoArticleProps) {
  const sectionIds = buildSectionIds(sections.map((s) => s.heading));

  const body = (
    <div
      className={`relative mx-auto max-w-3xl px-6 ${
        hasOwnHeader ? "py-16 sm:py-20" : "py-24 sm:py-32"
      }`}
    >
      {!hasOwnHeader ? (
        <>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">{intro}</p>
        </>
      ) : null}

      {/* Un solo nodo para las dos formas de la TOC: en compacto queda en el
          flujo, arriba del cuerpo (donde se muestra colapsada); en ≥xl sale del
          flujo y cuelga al costado con `left-full`, de modo que el texto siga
          alineado con el header en vez de correrse para hacerle lugar. */}
      {asideSlot ? (
        <div className="xl:absolute xl:left-full xl:top-0 xl:h-full xl:w-52 xl:pl-8">
          {asideSlot}
        </div>
      ) : null}

      {/* ~68 caracteres por línea a 18px: el header puede respirar más ancho
          que el cuerpo, pero la medida de lectura no. */}
      <div className={`article-prose max-w-[40rem] ${hasOwnHeader ? "" : "mt-12"}`}>
        {sections.map((s, i) => (
          <section key={s.heading} className="mb-12">
            <h2
              id={sectionIds[i]}
              className="group scroll-mt-20 text-2xl font-semibold tracking-tight text-foreground"
            >
              {s.heading}
              <SectionAnchor id={sectionIds[i]} heading={s.heading} />
            </h2>
            <div className="mt-4">{s.body}</div>
          </section>
        ))}
      </div>

      {faq && faq.length > 0 ? (
        <div className="max-w-[40rem]">
          <ArticleFaq faq={faq} />
        </div>
      ) : null}

      {footerSlot ? <div className="max-w-[40rem]">{footerSlot}</div> : null}

      <div className="mt-16 max-w-[40rem] rounded-2xl border border-border/60 bg-muted/30 p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Empieza
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">
          ¿Listo para tener el control de tus datos y proyectos?
        </h3>
        <div className="mt-6">
          <Link to={cta.href ?? ROUTES.dashboard}>
            <Button size="lg" className="h-11 gap-2 px-6">
              {cta.label}
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  // Con `hasOwnHeader` el caller ya abrió su propio `<article>`: anidar otro
  // duplicaría el borde inferior y confundiría al parser (bug del spec 059).
  return hasOwnHeader ? body : <article className="border-b border-border/60">{body}</article>;
}
