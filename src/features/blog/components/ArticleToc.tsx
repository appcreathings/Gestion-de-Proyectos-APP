import { useEffect, useMemo, useState } from "react";
import { List } from "lucide-react";
import { buildSectionIds } from "../utils/sectionId";

type ArticleTocProps = {
  /** Los headings del artículo, en orden. */
  headings: string[];
  className?: string;
};

/**
 * Tabla de contenidos del artículo — spec 059.
 *
 * Se construye desde `content.sections`, NO parseando el DOM: así existe
 * también en el HTML prerenderizado, donde no hay documento que recorrer.
 *
 * Los ids salen de `buildSectionIds`, la misma función que usa `SeoArticle`
 * para los `<h2>` — determinista sobre el mismo input, así que los enlaces no
 * pueden desincronizarse de sus destinos.
 *
 * Progressive enhancement: sin JS es una lista de anclas perfectamente
 * funcional; el resaltado de la sección activa es lo único que necesita
 * hidratación.
 */
export function ArticleToc({ headings, className }: ArticleTocProps) {
  const items = useMemo(() => {
    const ids = buildSectionIds(headings);
    return headings.map((heading, i) => ({ id: ids[i], heading }));
  }, [headings]);

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Puede haber varias secciones dentro de la banda a la vez; gana la
        // más alta en pantalla para que el resaltado no salte hacia atrás.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // Banda estrecha bajo el nav: marca activa la sección que el lector
      // tiene efectivamente delante, no la que apenas asoma abajo.
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const list = (
    <ol className="space-y-1 text-sm">
      {items.map((item, i) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            aria-current={activeId === item.id ? "location" : undefined}
            className={`block border-l-2 py-1 pl-3 leading-snug transition-colors ${
              activeId === item.id
                ? "border-[hsl(var(--cat-h)_60%_45%)] text-foreground dark:border-[hsl(var(--cat-h)_65%_60%)]"
                : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
            }`}
          >
            <span className="mr-1.5 font-mono text-[10px] text-muted-foreground/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            {item.heading}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Compacto: colapsado por defecto para no empujar el texto. */}
      <details className={`group/toc mb-10 rounded-xl border border-border/60 bg-muted/20 xl:hidden ${className ?? ""}`}>
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
          <List className="size-3.5" aria-hidden />
          En este artículo
          <span className="ml-auto text-[10px] normal-case tracking-normal">
            {items.length} secciones
          </span>
        </summary>
        <div className="px-4 pb-4">{list}</div>
      </details>

      {/* Escritorio: fija al costado mientras dura el artículo. */}
      <nav
        aria-label="Contenido del artículo"
        className="sticky top-24 hidden xl:block"
      >
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          En este artículo
        </p>
        {list}
      </nav>
    </>
  );
}
