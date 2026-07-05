import { ShieldCheck, FolderCog, FileJson } from "lucide-react";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Tus datos nunca salen de tu equipo",
    description:
      "Sin backend ni cuenta: todo se guarda en una carpeta local que tú eliges. Nadie más tiene acceso.",
    highlight: "Privacidad total",
  },
  {
    icon: FolderCog,
    title: "Archivos .json, no una caja negra",
    description:
      "Tus proyectos son archivos legibles que puedes versionar con git, respaldar o editar con cualquier herramienta.",
    highlight: "Transparencia total",
  },
  {
    icon: FileJson,
    title: "Exporta e importa cuando quieras",
    description:
      "Sin candados: descarga un respaldo completo o cambia de equipo sin perder nada.",
    highlight: "Libertad total",
  },
];

export function ValueProps() {
  return (
    <section className="border-y bg-gradient-to-b from-muted/20 to-muted/5 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tu privacidad es nuestra prioridad
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Tres razones por las que miles de equipos confían en Hito
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title} 
                className="group relative rounded-2xl border bg-background/50 p-6 text-center transition-all duration-300 hover:bg-background hover:shadow-lg hover:-translate-y-1"
              >
                {/* Número decorativo */}
                <span className="absolute right-4 top-4 text-6xl font-bold text-muted/10 select-none">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Badge superior */}
                <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {item.highlight}
                </div>

                {/* Ícono con animación */}
                <div className="relative mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 transition-transform duration-300 group-hover:scale-110 group-hover:from-primary/30 group-hover:to-primary/10">
                  <Icon className="size-7 text-primary" />
                </div>

                <h3 className="mb-2 text-lg font-semibold leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
