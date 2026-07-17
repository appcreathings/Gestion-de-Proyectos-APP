import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { DocModule } from "../types";

type DocCardProps = {
  module: DocModule;
};

export function DocCard({ module: doc }: DocCardProps) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-border/60 bg-background p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.02]">
      <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
        <Link to={`/docs/${doc.slug}`} className="focus:outline-none">
          <span aria-hidden className="absolute inset-0" />
          {doc.title}
        </Link>
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{doc.excerpt}</p>

      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors group-hover:text-primary">
        <span>Leer guía</span>
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </article>
  );
}
