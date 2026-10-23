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
