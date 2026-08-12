/**
 * GitHubSyncSection — Sincronización de proyectos Hito con un repositorio GitHub.
 *
 * Local-first: el workspace sigue en tu carpeta; GitHub es espejo exportable
 * (.hito/projects + .hito/attachments en modo completa, sin videos).
 */
import {
  ArrowRight,
  FileJson,
  FolderGit2,
  Github,
  Link2,
  Paperclip,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const PILLARS = [
  {
    icon: FolderGit2,
    tag: "Repositorio",
    title: "Un repo tuyo, no una cuenta en la nube de Hito",
    body: "Creá o elegí un repositorio (público o privado), vinculá uno o varios proyectos y abrí github.com cuando quieras con «Ir al repositorio».",
    detail: "Crear repo · Elegir existente · Abrir en GitHub",
  },
  {
    icon: FileJson,
    tag: "Archivos .hito/",
    title: "Proyectos como JSON versionable",
    body: "Cada proyecto se guarda en .hito/projects/<id>.json con el nivel que elijas: ligera, media o completa. Ideal para backup y revisión en Git.",
    detail: "Ligera · Media · Completa",
  },
  {
    icon: Paperclip,
    tag: "Recursos",
    title: "Subí adjuntos (todo menos videos)",
    body: "En sync completa, Hito sube PDF, imágenes, documentos y audio a .hito/attachments/. Omite videos y archivos demasiado grandes para la API.",
    detail: "Imágenes · Docs · Audio · Sin videos",
  },
];

const FLOW_STEPS = [
  {
    icon: Github,
    label: "Conectar",
    desc: "Autorizá la GitHub App e instalala en la cuenta o repos que quieras usar.",
  },
  {
    icon: Link2,
    label: "Vincular",
    desc: "Elegí o creá un repositorio y asociá tus proyectos de Hito.",
  },
  {
    icon: RefreshCw,
    label: "Sincronizar",
    desc: "Enviá al repo, recibí cambios o sincronizá todo; resolvé conflictos si ambos lados cambiaron.",
  },
  {
    icon: ShieldCheck,
    label: "Control",
    desc: "Los secretos de la App no van al navegador; el contenido vive en tu repo.",
  },
];

export function GitHubSyncSection() {
  return (
    <section id="github" className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="mx-auto mb-16 max-w-2xl text-center sm:mb-20">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            GitHub
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Respaldá y versioná proyectos en tu repositorio.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Conectá la GitHub App, vinculá proyectos y sincronizá a{" "}
            <code className="font-mono text-xs text-foreground/80">.hito/</code> — sin Issues ni
            tableros ajenos. Local-first: GitHub es el espejo, no el dueño de tus datos.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.tag}
                className="group relative flex flex-col gap-4 rounded-2xl border border-border/60 bg-muted/20 p-7 transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.02]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-background transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-primary/[0.06]">
                    <Icon className="size-5 transition-colors duration-300 group-hover:text-primary" />
                  </div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
                    {p.tag}
                  </span>
                </div>
                <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                <p className="mt-auto border-t border-border/60 pt-4 font-mono text-xs text-foreground/70">
                  {p.detail}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-20">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Cómo se usa
            </p>
            <h3 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Cuatro pasos, del connect al commit.
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className="group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 p-5 transition-all duration-300 hover:border-primary/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-full border border-primary/30 bg-primary/[0.06] font-mono text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <Icon className="size-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                  </div>
                  <h4 className="text-sm font-semibold tracking-tight">{step.label}</h4>
                  <p className="text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
                  {i < FLOW_STEPS.length - 1 && (
                    <ArrowRight className="hidden lg:absolute lg:-right-3 lg:top-1/2 lg:block lg:size-3 lg:-translate-y-1/2 lg:text-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Guía paso a paso en la{" "}
          <Link
            to="/docs/github-sync"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            documentación de GitHub
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
