import { Link } from "react-router-dom";
import { ArrowRight, Map, Rocket, Sparkles, Wrench } from "lucide-react";
import { SeoPage } from "@/features/seo/SeoPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/paths";
import { cn } from "@/lib/utils";
import { CAPABILITIES, RELEASES, ROADMAP, ROADMAP_HORIZONS } from "./data";
import type { ReleaseChangeKind, RoadmapStatus } from "./types";

const STATUS_LABEL: Record<RoadmapStatus, string> = {
  planned: "Planificado",
  in_progress: "En curso",
  shipped: "Publicado",
};

const STATUS_VARIANT: Record<
  RoadmapStatus,
  "secondary" | "warning" | "success"
> = {
  planned: "secondary",
  in_progress: "warning",
  shipped: "success",
};

const KIND_META: Record<
  ReleaseChangeKind,
  { label: string; icon: typeof Sparkles; className: string }
> = {
  feature: {
    label: "Nuevo",
    icon: Sparkles,
    className: "text-brand-accent",
  },
  improvement: {
    label: "Mejora",
    icon: Rocket,
    className: "text-foreground/70",
  },
  fix: {
    label: "Fix",
    icon: Wrench,
    className: "text-muted-foreground",
  },
};

function formatReleaseDate(date: string): string {
  // YYYY-MM → "jun 2026"; YYYY-MM-DD → "4 ago 2026"
  const parts = date.split("-").map(Number);
  const year = parts[0]!;
  const month = parts[1]!;
  const day = parts[2];
  const d = new Date(year, month - 1, day ?? 1);
  if (Number.isNaN(d.getTime())) return date;
  if (day == null) {
    return d.toLocaleDateString("es-CO", { month: "short", year: "numeric" });
  }
  return d.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ReleasesPage() {
  return (
    <SeoPage
      title="Releases y roadmap — Hito"
      description="Qué ya podés hacer en Hito, qué viene en el roadmap y el historial de funcionalidades por fecha. Changelog público, sin humo."
      path="/releases"
      breadcrumb={[
        { label: "Inicio", path: "/" },
        { label: "Releases", path: "/releases" },
      ]}
      schemaJson={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Releases y roadmap — Hito",
        description:
          "Roadmap de producto e historial de releases de Hito, gestor de proyectos local-first.",
        url: "https://hito.autos/releases",
        isPartOf: {
          "@type": "WebSite",
          name: "Hito",
          url: "https://hito.autos",
        },
      }}
    >
      {/* Hero */}
      <div className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Releases
          </p>
          <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Construido en público, con fechas y sin humo.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Un mapa honesto del producto: lo que ya está en producción (anclado
            a las specs 001–042), lo que viene en el roadmap, y el historial
            release a release. Sin humo retroactivo.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#hoy">
              <Button size="lg" variant="outline" className="h-11 gap-2 px-6">
                Qué hay hoy
              </Button>
            </a>
            <a href="#roadmap">
              <Button size="lg" variant="outline" className="h-11 gap-2 px-6">
                <Map className="size-4" />
                Roadmap
              </Button>
            </a>
            <a href="#historial">
              <Button size="lg" variant="ghost" className="h-11 gap-2 px-6">
                Historial
                <ArrowRight className="size-4" />
              </Button>
            </a>
            <Link to={ROUTES.dashboard} className="sm:ml-2">
              <Button size="lg" className="h-11 gap-2 px-6">
                Probar Hito
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Qué hay hoy */}
      <section id="hoy" className="scroll-mt-20 border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Producto
            </p>
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Lo que ya podés hacer
            </h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Snapshot del producto real — no un wishlist. Cada bloque existe
              en la app y nació de specs implementadas.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((cap) => (
              <li
                key={cap.title}
                className="rounded-xl border border-border/60 bg-background p-5 shadow-sm"
              >
                <h3 className="text-sm font-semibold tracking-tight">
                  {cap.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {cap.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Roadmap */}
      <section
        id="roadmap"
        className="scroll-mt-20 border-b border-border/60 bg-muted/15"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Roadmap
            </p>
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Hacia dónde va Hito
            </h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Tres horizontes anclados a backlog real (spec 033 de flujos, blog
              editorial, gaps del dashboard). Si un ítem se publica, pasa al
              historial. Lo de «Más adelante» genera expectativa sin prometer
              fecha.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {ROADMAP_HORIZONS.map((horizon) => {
              const items = ROADMAP.filter((i) => i.horizon === horizon.key);
              return (
                <div key={horizon.key} className="flex flex-col">
                  <div className="mb-4 border-b border-border/60 pb-4">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {horizon.label}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {horizon.description}
                    </p>
                  </div>
                  <ul className="flex flex-1 flex-col gap-3">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className={cn(
                          "rounded-xl border border-border/60 bg-background p-4 shadow-sm",
                          item.status === "in_progress" &&
                            "border-brand-accent/40 ring-1 ring-brand-accent/15",
                        )}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={STATUS_VARIANT[item.status]}>
                            {STATUS_LABEL[item.status]}
                          </Badge>
                          {item.area ? (
                            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                              {item.area}
                            </span>
                          ) : null}
                        </div>
                        <h4 className="mt-3 text-sm font-semibold leading-snug tracking-tight">
                          {item.title}
                        </h4>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </li>
                    ))}
                    {items.length === 0 ? (
                      <li className="rounded-xl border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
                        Nada en este horizonte por ahora.
                      </li>
                    ) : null}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Historial */}
      <section id="historial" className="scroll-mt-20">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Historial
            </p>
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Qué se fue sumando
            </h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              De más reciente a más viejo. Si querés el detalle commit a commit,
              el{" "}
              <a
                href="https://github.com/appcreathings/Gestion-de-Proyectos-APP"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                repositorio en GitHub
              </a>{" "}
              es la fuente de verdad.
            </p>
          </div>

          <ol className="relative mt-12 space-y-0 border-l border-border/60 pl-0">
            {RELEASES.map((release, index) => (
              <li
                key={release.id}
                id={release.id}
                className="relative scroll-mt-24 border-b border-border/40 py-10 pl-8 last:border-b-0 sm:pl-10"
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-[5px] top-12 size-2.5 rounded-full border-2 border-background",
                    index === 0
                      ? "bg-brand-accent"
                      : "bg-muted-foreground/40",
                  )}
                />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p className="font-mono text-xs uppercase tracking-widest text-brand-accent">
                    {formatReleaseDate(release.date)}
                  </p>
                  <span className="font-mono text-xs text-muted-foreground">
                    {release.version}
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                  {release.title}
                </h3>
                {release.summary ? (
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {release.summary}
                  </p>
                ) : null}
                <ul className="mt-5 space-y-3">
                  {release.changes.map((change) => {
                    const meta = KIND_META[change.kind];
                    const Icon = meta.icon;
                    return (
                      <li
                        key={change.text}
                        className="flex gap-3 text-sm leading-relaxed"
                      >
                        <span
                          className={cn(
                            "mt-0.5 inline-flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase tracking-wider",
                            meta.className,
                          )}
                          title={meta.label}
                        >
                          <Icon className="size-3.5" aria-hidden />
                          <span className="sr-only">{meta.label}: </span>
                        </span>
                        <span className="text-foreground/85">{change.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-xl border border-border/60 bg-muted/20 p-6 sm:p-8">
            <p className="text-sm font-medium tracking-tight">
              ¿Falta algo que ya usás y no aparece acá?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Abrí un issue en GitHub o mirá el log del repo. Este historial se
              actualiza a mano cuando un cambio vale la pena contarlo a quien
              usa el producto.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://github.com/appcreathings/Gestion-de-Proyectos-APP/issues/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  Reportar issue
                  <span aria-hidden>↗</span>
                </Button>
              </a>
              <Link to="/docs">
                <Button variant="ghost" size="sm" className="gap-2">
                  Ver documentación
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SeoPage>
  );
}
