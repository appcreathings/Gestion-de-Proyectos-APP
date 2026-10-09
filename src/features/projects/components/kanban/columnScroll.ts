/** Elige la columna más visible según intersection ratios (spec 054).
 * El desempate usa el orden que le pasan — el del tablero del proyecto
 * (etapas + ghosts), no un catálogo fijo (spec 073 §5.1). */
export function pickActiveStatus(
  entries: { status: string; intersectionRatio: number }[],
  fallback: string,
  order: readonly string[],
): string {
  if (entries.length === 0) return fallback;
  let best = entries[0];
  for (const e of entries) {
    if (e.intersectionRatio > best.intersectionRatio) best = e;
    else if (
      e.intersectionRatio === best.intersectionRatio &&
      order.indexOf(e.status) < order.indexOf(best.status)
    ) {
      best = e;
    }
  }
  return best.intersectionRatio > 0 ? best.status : fallback;
}

export function scrollBoardToColumn(
  board: HTMLElement,
  column: HTMLElement,
  behavior: ScrollBehavior = "smooth",
): void {
  const left = column.offsetLeft - board.offsetLeft;
  board.scrollTo({ left: Math.max(0, left), behavior });
}
