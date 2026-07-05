import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/paths";

const BENEFITS = [
  "Sin tarjeta de crédito",
  "Sin límite de proyectos",
  "Actualizaciones gratuitas",
  "Soporte por comunidad",
];

export function FinalCta() {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" />
      
      {/* Patrón decorativo */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative mx-auto max-w-2xl text-center">
        {/* Badge decorativo */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span>Empieza en menos de 2 minutos</span>
        </div>

        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Empieza gratis,{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            hoy mismo
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
          Elige una carpeta en tu equipo y ten tu primer proyecto organizado en minutos. 
          Sin complicaciones, sin compromisos.
        </p>

        {/* Lista de beneficios */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {BENEFITS.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA principal */}
        <div className="mt-10">
          <Link to={ROUTES.dashboard}>
            <Button size="lg" className="gap-2 px-8 text-base shadow-xl shadow-primary/25 transition-all hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5">
              Empezar ahora
              <ArrowRight className="size-5" />
            </Button>
          </Link>
        </div>

        {/* Testimonio sutil */}
        <p className="mt-8 text-sm text-muted-foreground/60">
          Únete a los equipos que ya gestionan sus proyectos con Hito
        </p>
      </div>
    </section>
  );
}
