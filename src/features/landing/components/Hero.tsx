import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/paths";

const TRUST_SIGNALS = [
  "Gratuito · Open Source (MIT)",
  "Sin límite de usuarios",
  "Offline-first",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.4] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)/0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)/0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse_60%_50%_at_50%_30%,#000,transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse_60%_50%_at_50%_30%,#000,transparent)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            Local-first · Sin nube · Sin cuenta · MIT
          </div>

          <h1 className="text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Gestioná proyectos, procesos y equipos{" "}
            <span className="text-muted-foreground">sin rendir cuentas a la nube.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Hito es un gestor local-first. Tus datos viven en archivos .json en
            tu máquina: versionables con Git, exportables, 100% tuyos. Sin
            backend, sin suscripción, sin límite de usuarios.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to={ROUTES.dashboard}>
              <Button size="lg" className="h-11 gap-2 px-6">
                Empezar ahora
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <a href="#caracteristicas">
              <Button variant="outline" size="lg" className="h-11 gap-2 px-6">
                Ver características
              </Button>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {TRUST_SIGNALS.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80"
              >
                <Check className="size-3 text-emerald-500" />
                {s}
              </span>
            ))}
          </div>

          <p className="mt-8 font-mono text-xs text-muted-foreground/70">
            proyectos/*.json  ·  sin servidor  ·  MIT
          </p>
        </div>
      </div>
    </section>
  );
}
