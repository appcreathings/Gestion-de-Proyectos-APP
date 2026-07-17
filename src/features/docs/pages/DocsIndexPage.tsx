import { SeoPage } from "@/features/seo/SeoPage";
import { DOC_GROUP_ORDER, DOC_GROUPS } from "../data/groups";
import { DOC_MODULES } from "../data/modules";
import { DocCard } from "../components/DocCard";

export function DocsIndexPage() {
  return (
    <SeoPage
      title="Documentación — Hito"
      description="Guías para sacarle provecho a cada módulo de Hito: proyectos, procesos, Kanban, Flujos e integraciones, asistente IA y más."
      path="/docs"
    >
      <div className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Docs
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Documentación
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Guías cortas y prácticas para cada módulo de Hito, organizadas en el orden en que
            normalmente los vas a usar.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="space-y-16">
          {DOC_GROUP_ORDER.map((groupKey) => {
            const group = DOC_GROUPS[groupKey];
            const modules = DOC_MODULES.filter((m) => m.group === groupKey);
            if (modules.length === 0) return null;
            return (
              <section key={groupKey}>
                <h2 className="text-2xl font-semibold tracking-tight">{group.label}</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{group.description}</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {modules.map((doc) => (
                    <DocCard key={doc.slug} module={doc} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </SeoPage>
  );
}
