import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/paths";

type SeoArticleProps = {
  eyebrow: string;
  title: React.ReactNode;
  intro: React.ReactNode;
  sections: { heading: string; body: React.ReactNode }[];
  /** Preguntas frecuentes, renderizadas al final — su schema FAQPage lo emite el caller. */
  faq?: { question: string; answer: string }[];
  cta: { label: string; href?: string };
};

/** Editorial layout for SEO satellite pages: eyebrow → h1 → intro → sections → FAQ → CTA. */
export function SeoArticle({ eyebrow, title, intro, sections, faq, cta }: SeoArticleProps) {
  return (
    <article className="border-b border-border/60">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">{intro}</p>

        <div className="prose prose-neutral mt-12 max-w-none dark:prose-invert">
          {sections.map((s) => (
            <section key={s.heading} className="mb-10">
              <h2 className="text-2xl font-semibold tracking-tight">{s.heading}</h2>
              <div className="mt-3 space-y-4 text-base leading-relaxed text-muted-foreground">
                {s.body}
              </div>
            </section>
          ))}
        </div>

        {faq && faq.length > 0 ? (
          <div className="mt-4">
            <h2 className="text-2xl font-semibold tracking-tight">Preguntas frecuentes</h2>
            <dl className="mt-6 space-y-6">
              {faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold tracking-tight">{item.question}</dt>
                  <dd className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        <div className="mt-16 rounded-2xl border border-border/60 bg-muted/30 p-8">
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
    </article>
  );
}
