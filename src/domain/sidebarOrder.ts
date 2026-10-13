/** Orden de proyectos dentro de la barra (spec 075 D16/D17). Puro: la única
 * forma de fijar un puesto es el arrastre o las flechas del asa; crear, borrar
 * o cambiar de producto no escribe la lista, la lectura ya los ubica. */

/** Grupo de los proyectos con `productId` null (spec 075 D16). */
export const UNASSIGNED_GROUP = "__unassigned";

/** La clave de `settings.sidebarOrder` es el id del producto, o el grupo de
 * «Sin producto» cuando `productId` es null. */
export function groupKey(productId: string | null): string {
  return productId ?? UNASSIGNED_GROUP;
}

/** Ids de `listed` que siguen en `projects`, en ese orden. Un id que no está
 * en `projects` se salta; un proyecto que no está en `listed` va al final, en
 * el orden de entrada. Ids repetidos cuentan una vez. */
export function orderProjects<T extends { id: string }>(
  projects: readonly T[],
  listed: readonly string[] | undefined,
): T[] {
  if (!listed || listed.length === 0) return [...projects];

  const byId = new Map(projects.map((p) => [p.id, p] as const));
  const ordered: T[] = [];
  const seen = new Set<string>();
  for (const id of listed) {
    if (seen.has(id)) continue;
    seen.add(id);
    const project = byId.get(id);
    if (project) ordered.push(project);
  }
  for (const p of projects) {
    if (!seen.has(p.id)) ordered.push(p);
  }
  return ordered;
}

/** null = no hay movimiento: id ausente o el mismo puesto. No muta el input. */
export function reorderWithin(
  ids: readonly string[],
  activeId: string,
  overId: string,
): string[] | null {
  const from = ids.indexOf(activeId);
  const to = ids.indexOf(overId);
  if (from === -1 || to === -1 || from === to) return null;
  const next = [...ids];
  const [moved] = next.splice(from, 1);
  if (!moved) return null;
  next.splice(to, 0, moved);
  return next;
}
