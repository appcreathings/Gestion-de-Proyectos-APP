import { DEFAULT_AUTHOR } from "../data/articles-index";

type AuthorCardProps = {
  author?: { name: string; role?: string };
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Firma del artículo — spec 059.
 *
 * `meta.author` ya alimentaba el schema `BlogPosting` pero no se mostraba en
 * ningún lado: para Google había autoría y para el lector no. Esto cierra esa
 * señal E-E-A-T del lado visible.
 *
 * El avatar son iniciales sobre el color de la categoría, no una imagen —
 * coherente con «mockup = HTML+Tailwind, no raster» de la guía de marca.
 */
export function AuthorCard({ author }: AuthorCardProps) {
  const resolved = author ?? DEFAULT_AUTHOR;

  return (
    <div className="mt-16 flex items-center gap-4 border-t border-border/60 pt-8">
      <span
        aria-hidden
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--cat-h)_60%_45%/0.14)] font-mono text-sm font-medium text-foreground/80 dark:bg-[hsl(var(--cat-h)_65%_60%/0.18)]"
      >
        {initials(resolved.name)}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold tracking-tight">{resolved.name}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {resolved.role ? `${resolved.role} · ` : ""}
          Escribimos sobre gestión de proyectos local-first desde la práctica de
          construir Hito.
        </p>
      </div>
    </div>
  );
}
