/** Etiquetas de texto del detalle de tarea (spec 064 §6).
 *
 * Vivían embebidas en el JSX del drawer como ternarios anidados, con la
 * pluralización de "día/días" repetida en cuatro sitios. Aquí son funciones
 * puras: es lo único de este rediseño que se puede probar sin montar React
 * (el proyecto no tiene jsdom configurado — ver spec 064 §8). */

const DAY_MONTH = new Intl.DateTimeFormat("es", { day: "numeric", month: "short" });
const DAY_MONTH_YEAR = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Días exactos, sin "un día" ni "1 días". */
function days(n: number): string {
  return `${n} ${n === 1 ? "día" : "días"}`;
}

/** Texto del chip de vencimiento. `null` cuando no hay fecha.
 *
 * Devuelve texto para **cualquier** número de días: decidir si el chip se
 * muestra es del llamador (solo se pinta si la tarea vence pronto o ya venció
 * y no está hecha). */
export function dueLabel(daysUntilDue: number | null): string | null {
  if (daysUntilDue === null) return null;
  if (daysUntilDue < 0) return `Vencida hace ${days(Math.abs(daysUntilDue))}`;
  if (daysUntilDue === 0) return "Vence hoy";
  return `Vence en ${days(daysUntilDue)}`;
}

/** Sufijo relativo que acompaña a la fecha en la fila de propiedad:
 * "· en 5 días", "· hoy", "· hace 3 días". `null` si no hay fecha. */
export function dueSuffix(daysUntilDue: number | null): string | null {
  if (daysUntilDue === null) return null;
  if (daysUntilDue < 0) return `hace ${days(Math.abs(daysUntilDue))}`;
  if (daysUntilDue === 0) return "hoy";
  return `en ${days(daysUntilDue)}`;
}

/** "ahora" | "hace 5 min" | "hace 2 h" | "hace 3 d" | "12 ago 2026".
 *
 * Se usa tanto en los comentarios como en el pie de metadatos, para que el
 * panel no hable de tiempo de dos maneras distintas. */
export function relativeSince(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = now.getTime() - then;
  if (diffMs < 0) return "ahora";

  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;

  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 24) return `hace ${hours} h`;

  const dayCount = Math.floor(diffMs / 86_400_000);
  if (dayCount < 7) return `hace ${dayCount} d`;

  return formatDate(iso, now);
}

/** Fecha corta: "3 ago" dentro del año en curso, "3 ago 2025" fuera de él. */
export function formatDate(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const formatter =
    date.getFullYear() === now.getFullYear() ? DAY_MONTH : DAY_MONTH_YEAR;
  return formatter.format(date);
}

/** Pie del panel: "Creada 3 ago · Actualizada hace 2 h" (spec 064 D9). */
export function metaLabel(
  createdAt: string,
  updatedAt: string,
  now: Date = new Date(),
): string {
  return `Creada ${formatDate(createdAt, now)} · Actualizada ${relativeSince(updatedAt, now)}`;
}
