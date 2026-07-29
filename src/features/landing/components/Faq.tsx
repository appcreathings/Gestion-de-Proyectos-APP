/**
 * Faq — Acordeón de preguntas frecuentes con animación de expansión.
 *
 * Usa un estado controlado (openIndex) para permitir solo una pregunta
 * abierta a la vez. Las respuestas se animan con grid-template-rows.
 *
 * El contenido vive en ../data/faqs.ts, compartido con el JSON-LD FAQPage
 * de LandingPage.tsx para habilitar rich snippets de FAQ en Google.
 */
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "../data/faqs";

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-medium transition-colors hover:text-foreground/80"
        aria-expanded={open}
      >
        <span>{question}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ${
          open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        }`}
      >
        <p className="min-h-0 text-sm leading-relaxed text-muted-foreground">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="mx-auto mb-16 max-w-2xl text-center sm:mb-20">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            FAQ
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Todo lo que necesitas saber antes de probar Hito.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          {FAQS.map((faq, i) => (
            <FaqItem
              key={i}
              question={faq.q}
              answer={faq.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
