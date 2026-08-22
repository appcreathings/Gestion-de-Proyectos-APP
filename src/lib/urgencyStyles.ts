import type { UrgencyLevel } from "@/domain/taskUrgency";

/** Familia pastel única de la app (spec 065 D12). Reemplaza las dos copias que
 * vivían en PortfolioCalendarView (6 tonos) y TaskCalendarView (4 tonos).
 *
 * Patrón validado por ambos calendarios: fondo muy claro + texto del mismo
 * tono muy oscuro, con pareja explícita para tema oscuro. Las clases van
 * literales y completas: el escáner de Tailwind no sigue interpolaciones. */
export const TONES = {
  blue: "border-blue-300 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
  violet:
    "border-violet-300 bg-violet-50 text-violet-900 dark:bg-violet-950/40 dark:text-violet-100",
  teal: "border-teal-300 bg-teal-50 text-teal-900 dark:bg-teal-950/40 dark:text-teal-100",
  amber:
    "border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  rose: "border-rose-300 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100",
  sky: "border-sky-300 bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-100",
} as const;

export type ToneKey = keyof typeof TONES;

export const TONE_KEYS = Object.keys(TONES) as ToneKey[];

/** Riel de urgencia de 3 px por nivel (spec 065 D6). `null` = sin riel.
 * El riel usa -400/-500 y no el pastel de fondo: a 3 px de ancho, un -100
 * desaparece (design §1). */
export const URGENCY_RAIL: Record<UrgencyLevel, string | null> = {
  done: null,
  overdue: "border-l-rose-400 dark:border-l-rose-500",
  blocked: "border-l-violet-400 dark:border-l-violet-500",
  soon: "border-l-amber-400 dark:border-l-amber-500",
  priority: "border-l-blue-400 dark:border-l-blue-500",
  calm: null,
};

/** Texto del nivel para el aria-label de la tarjeta (spec 065 D11): el riel
 * es color puro, el nivel tiene que viajar por texto. `null` = calma, no
 * hace falta decir nada. */
export const URGENCY_ARIA: Record<UrgencyLevel, string | null> = {
  done: null,
  overdue: "vencida",
  blocked: "bloqueada",
  soon: "vence pronto",
  priority: "prioridad alta",
  calm: null,
};
