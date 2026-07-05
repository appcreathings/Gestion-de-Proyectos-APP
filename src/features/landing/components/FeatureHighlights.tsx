import { KanbanSquare, Workflow, Sparkles, HardDriveDownload, ClipboardCheck, LayoutDashboard } from "lucide-react";

const FEATURES = [
  {
    icon: KanbanSquare,
    title: "Kanban arrastrable",
    body: "Tareas por estado con foco por área. Reordenás con mouse o teclado; el cambio se persiste al instante en tu JSON.",
  },
  {
    icon: ClipboardCheck,
    title: "Checklists & SOPs",
    body: "Documentá procesos con Markdown, creá checklists reutilizables y asigná responsables. Cada área tiene su propia documentación.",
  },
  {
    icon: Workflow,
    title: "Automatizaciones",
    body: "Reglas trigger → condición → acción. Mové tareas, asigná plantillas, mandá recordatorios. Sin macros raras.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard de portafolio",
    body: "Vista global con KPIs, salud RAG por proyecto y distribución por estado. Identificá proyectos en riesgo de un vistazo.",
  },
  {
    icon: Sparkles,
    title: "Asistente IA (Gemini)",
    body: "Preguntale por el estado de tus proyectos, tareas bloqueadas o qué SOP le falta a un equipo. Sin enviar tus datos a la nube.",
  },
  {
    icon: HardDriveDownload,
    title: "Offline-first / PWA",
    body: "Funciona sin internet, se instala como app de escritorio y abre directo. Tu carpeta, tu caché, tu decisión.",
  },
];

export function FeatureHighlights() {
  return (
    <section id="caracteristicas" className="border-b border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="mx-auto mb-16 max-w-2xl text-center sm:mb-20">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Características
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Todo lo que necesitás para operar, en un solo lugar.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Productos, proyectos, procesos (SOPs), checklists, tareas y reglas
            que las mueven solas.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border sm:grid-cols-2">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-background p-8">
                <div className="mb-5 flex size-10 items-center justify-center rounded-lg border border-border bg-background">
                  <Icon className="size-5 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
