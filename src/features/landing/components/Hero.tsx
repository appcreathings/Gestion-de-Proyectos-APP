import { Link } from "react-router-dom";
import { Flag, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/paths";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-28 sm:pt-36">
      {/* Fondo con gradiente sutil */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      {/* Patrón decorativo sutil */}
      <div className="absolute inset-0 -z-10 opacity-[0.015]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="mx-auto max-w-4xl text-center">
        {/* Badge decorativo */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <Zap className="size-3.5" />
          <span>100% local y privado</span>
        </div>

        {/* Ícono principal con animación */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/20" />
            <div className="relative flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <Flag className="size-8" />
            </div>
          </div>
        </div>

        {/* Título con gradiente */}
        <h1 className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl">
          Hito
        </h1>

        {/* Subtítulo mejorado */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          El gestor de proyectos, procesos y checklists que vive{" "}
          <span className="font-semibold text-foreground">100% en tu equipo</span>. 
          Sin cuenta, sin nube, sin que tus datos salgan de tu carpeta.
        </p>

        {/* Botones con mejor espaciado */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to={ROUTES.dashboard}>
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
              Empezar ahora
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <a href="#como-funciona">
            <Button variant="outline" size="lg" className="gap-2">
              Ver cómo funciona
            </Button>
          </a>
        </div>

        {/* Social proof sutil */}
        <p className="mt-12 text-sm text-muted-foreground">
          ✓ Sin registro &nbsp;&nbsp; ✓ Sin conexión a internet &nbsp;&nbsp; ✓ Tus datos son tuyos
        </p>
      </div>
    </section>
  );
}
