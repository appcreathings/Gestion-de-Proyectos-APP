import { ChevronDown } from "lucide-react";

type ArticleFaqProps = {
  faq: { question: string; answer: string }[];
};

/**
 * Preguntas frecuentes desplegables — spec 059.
 *
 * `<details>` nativo, NO un accordion de Radix, y es una decisión deliberada:
 * Radix desmonta el contenido cerrado, así que las respuestas desaparecerían
 * del HTML que genera `npm run prerender` y el schema `FAQPage` que emite
 * `BlogPostPage` quedaría sin respaldo visible en la página. Con `<details>` el
 * texto siempre está en el DOM, funciona sin JS y trae la accesibilidad puesta.
 */
export function ArticleFaq({ faq }: ArticleFaqProps) {
  if (faq.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">Preguntas frecuentes</h2>
      <div className="mt-6 divide-y divide-border/60 border-y border-border/60">
        {faq.map((item, i) => (
          <details
            key={item.question}
            // La primera abierta insinúa que las demás también se abren.
            open={i === 0}
            className="group/faq [&[open]_svg]:rotate-180"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-semibold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200"
                aria-hidden
              />
            </summary>
            <div className="pb-5 text-base leading-relaxed text-muted-foreground">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
