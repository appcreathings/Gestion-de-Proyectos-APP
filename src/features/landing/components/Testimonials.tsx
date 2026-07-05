import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Pasamos de tener los procesos en la cabeza de cada PM a documentarlos en Hito. Hoy onboarding de nuevos miembros lleva la mitad del tiempo.",
    name: "Martina G.",
    role: "PM en agencia digital",
    team: "12 personas",
  },
  {
    quote:
      "Lo que me vende es que los datos son míos. No pido permiso para exportar, no hay un vendor lock-in, y si mañana quiero dejar de usarlo, tengo mis JSON.",
    name: "Federico L.",
    role: "CEO de startup SaaS",
    team: "8 personas",
  },
  {
    quote:
      "Trabajo con información sensible de clientes. Hito me da la tranquilidad de que ningún servidor externo tiene acceso. Y encima es gratis.",
    name: "Carolina R.",
    role: "Abogada freelance",
    team: "sola + colaboradores",
  },
];

export function Testimonials() {
  return (
    <section className="border-b border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="mx-auto mb-16 max-w-2xl text-center sm:mb-20">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Testimonios
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Lo que dicen quienes ya lo usan
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Equipos chicos, resultados grandes. Esto es lo que cuentan.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="relative flex flex-col gap-4 rounded-2xl border border-border/60 bg-background p-7"
            >
              <Quote className="size-6 text-muted-foreground/30" />
              <blockquote className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-auto border-t border-border/60 pt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t.role} · {t.team}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
