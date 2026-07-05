import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KanbanSquare, Workflow, Sparkles, HardDriveDownload } from "lucide-react";

const FEATURES = [
  {
    icon: KanbanSquare,
    title: "Kanban con arrastrar y soltar",
    description: "Tareas por estado, reordenables dentro de cada columna, con foco por área.",
    color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
  },
  {
    icon: Workflow,
    title: "Automatizaciones",
    description:
      "Reglas de trigger→condición→acción para cambios de estado, plantillas y recordatorios.",
    color: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30",
  },
  {
    icon: Sparkles,
    title: "Asistente IA integrado",
    description:
      "Conversa con Gemini sobre tus proyectos: estado, riesgos, tareas bloqueadas y más.",
    color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30",
  },
  {
    icon: HardDriveDownload,
    title: "Instalable como app",
    description: "Funciona offline y se instala en tu escritorio como cualquier aplicación.",
    color: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30",
  },
];

export function FeatureHighlights() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Todo lo que necesitas para operar
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Productos, proyectos, procesos (SOPs), checklists y tareas, en un solo lugar.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <Card 
              key={f.title}
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-muted"
            >
              {/* Indicador de color en el borde superior */}
              <div className={`absolute inset-x-0 top-0 h-1 ${f.color.replace('text-', 'bg-').replace('bg-', 'bg-')}`} />
              
              <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${f.color} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="size-6" />
                </div>
                <CardTitle className="text-xl font-semibold">{f.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </CardContent>

              {/* Hover glow effect */}
              <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
                style={{
                  background: `radial-gradient(circle at 50% 100%, currentColor, transparent 70%)`,
                  opacity: 0.05,
                }} 
              />
            </Card>
          );
        })}
      </div>
    </section>
  );
}
