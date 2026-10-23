import type { BlogArticleMeta } from "../types";

export const BLOG_PAGE_SIZE = 12;

/** Minúsculas y sin acentos, para que "automatización" coincida con "automatizacion". */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Filtra por título, extracto y categoría; cada palabra de la búsqueda debe aparecer. */
export function filterArticles(
  articles: BlogArticleMeta[],
  query: string,
): BlogArticleMeta[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return articles;
  return articles.filter((a) => {
    const haystack = normalize(`${a.title} ${a.excerpt} ${a.categoryLabel}`);
    return terms.every((t) => haystack.includes(t));
  });
}

/** Devuelve la página pedida acotada a un rango válido (`?page=` puede venir roto). */
export function paginate<T>(
  items: T[],
  rawPage: number,
  pageSize = BLOG_PAGE_SIZE,
): { items: T[]; page: number; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Number.isFinite(rawPage)
    ? Math.min(Math.max(1, Math.floor(rawPage)), totalPages)
    : 1;
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    totalPages,
  };
}

/**
 * Números de página a mostrar: las primeras y últimas `edge`, y `around` a cada
 * lado de la actual. Los huecos se marcan con "…". Ej.: 1 2 … 5 6 7 … 12 13
 */
export function pageItems(
  page: number,
  totalPages: number,
  edge = 2,
  around = 1,
): (number | "…")[] {
  const keep = new Set<number>();
  for (let i = 1; i <= Math.min(edge, totalPages); i += 1) keep.add(i);
  for (let i = Math.max(1, totalPages - edge + 1); i <= totalPages; i += 1) keep.add(i);
  for (
    let i = Math.max(1, page - around);
    i <= Math.min(totalPages, page + around);
    i += 1
  ) {
    keep.add(i);
  }

  const sorted = [...keep].sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  sorted.forEach((n, idx) => {
    const prev = sorted[idx - 1];
    if (prev !== undefined && n - prev > 1) {
      // Un hueco de una sola página se muestra como número, no como "…".
      result.push(n - prev === 2 ? n - 1 : "…");
    }
    result.push(n);
  });
  return result;
}
