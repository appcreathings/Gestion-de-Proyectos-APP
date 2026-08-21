/**
 * Avance de un key result (spec 062 D8): `clamp(krCurrent / krTarget, 0, 1)`.
 * Devuelve `null` cuando no hay números (KR cualitativo), alguno no es finito
 * o el target es 0 — la UI no pinta la barra en esos casos y nunca divide
 * por cero.
 */
export function krProgress(
  current: number | null,
  target: number | null,
): number | null {
  if (current === null || target === null) return null;
  if (!Number.isFinite(current) || !Number.isFinite(target) || target === 0) return null;
  return Math.min(1, Math.max(0, current / target));
}
