import type { TaskStatus } from "@/domain/schemas";
import { TASK_COLUMNS } from "@/domain/labels";

/** Elige la columna más visible según intersection ratios (spec 054). */
export function pickActiveStatus(
  entries: { status: TaskStatus; intersectionRatio: number }[],
  fallback: TaskStatus,
): TaskStatus {
  if (entries.length === 0) return fallback;
  let best = entries[0];
  for (const e of entries) {
    if (e.intersectionRatio > best.intersectionRatio) best = e;
    else if (
      e.intersectionRatio === best.intersectionRatio &&
      TASK_COLUMNS.indexOf(e.status) < TASK_COLUMNS.indexOf(best.status)
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
