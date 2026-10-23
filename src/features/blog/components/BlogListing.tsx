import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BlogCard } from "./BlogCard";
import { filterArticles, paginate } from "../data/listing";
import type { BlogArticleMeta } from "../types";

type BlogListingProps = {
  articles: BlogArticleMeta[];
  emptyMessage?: string;
};

/**
 * Buscador + grid + paginación. Búsqueda y página viven en la URL
 * (`?q=` y `?page=`) para poder compartir y volver atrás.
 */
export function BlogListing({
  articles,
  emptyMessage = "No hay artículos todavía.",
}: BlogListingProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const rawPage = Number(searchParams.get("page") ?? 1);

  const filtered = useMemo(() => filterArticles(articles, query), [articles, query]);
  const { items, page, totalPages } = paginate(filtered, rawPage);

  const update = (next: { q?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams);
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
      params.delete("page");
    }
    if (next.page !== undefined) {
      if (next.page > 1) params.set("page", String(next.page));
      else params.delete("page");
    }
    setSearchParams(params, { replace: next.q !== undefined });
  };

  const goTo = (target: number) => {
    update({ page: target });
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="relative mb-8 max-w-md">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Buscar artículos…"
          aria-label="Buscar artículos"
          className="pl-9"
        />
      </div>

      {query && (
        <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"} para “
          {query}”
        </p>
      )}

      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {query ? "No encontramos artículos con esa búsqueda." : emptyMessage}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <BlogCard key={article.slug} article={article} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Paginación"
          className="mt-12 flex items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page <= 1}
            className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
            Anterior
          </button>
          <span className="font-mono text-xs text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page >= totalPages}
            className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            Siguiente
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </div>
  );
}
