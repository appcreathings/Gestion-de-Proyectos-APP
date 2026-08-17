import { slugify } from "./slugify";

/**
 * Ids estables para las secciones de un artículo — spec 059.
 *
 * Fuente ÚNICA de los anchors: la consumen tanto los `<h2>` de `SeoArticle`
 * como la tabla de contenidos. Si cada uno los calculara por su cuenta, un
 * cambio en `slugify` desincronizaría los enlaces sin que ningún test lo note.
 *
 * Dos headings que colapsan al mismo slug reciben sufijo (`-2`, `-3`): un `id`
 * duplicado rompe el salto por ancla y es HTML inválido.
 */
export function buildSectionIds(headings: string[]): string[] {
  const used = new Map<string, number>();

  return headings.map((heading) => {
    // `slugify` devuelve "" para headings vacíos o solo-símbolos ("¿?", "—").
    const base = slugify(heading) || "seccion";
    const seen = used.get(base) ?? 0;
    used.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen + 1}`;
  });
}
