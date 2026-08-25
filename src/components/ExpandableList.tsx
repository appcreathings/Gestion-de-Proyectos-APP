import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

export const EXPANDABLE_LIST_INITIAL = 5;

export function expandableRemaining(
  n: number,
  initial: number = EXPANDABLE_LIST_INITIAL,
): number {
  return Math.max(0, n - initial);
}

export function expandableMoreLabel(remaining: number): string {
  return `Ver ${remaining} más`;
}

export const EXPANDABLE_LESS_LABEL = "Ver menos";

interface ExpandableListProps<T> {
  items: readonly T[];
  initial?: number;
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
  moreLabel?: (remaining: number) => string;
  lessLabel?: string;
  className?: string;
  listClassName?: string;
}

export function ExpandableList<T>({
  items,
  initial = EXPANDABLE_LIST_INITIAL,
  getKey,
  renderItem,
  moreLabel = expandableMoreLabel,
  lessLabel = EXPANDABLE_LESS_LABEL,
  className,
  listClassName = "space-y-1.5",
}: ExpandableListProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const remaining = expandableRemaining(items.length, initial);
  const visible = expanded || remaining === 0 ? items : items.slice(0, initial);

  return (
    <div className={className}>
      <ul id={listId} className={listClassName}>
        {visible.map((item, i) => (
          <li key={getKey(item, i)}>{renderItem(item, i)}</li>
        ))}
      </ul>
      {remaining > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 w-full sm:w-auto"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? lessLabel : moreLabel(remaining)}
        </Button>
      )}
    </div>
  );
}
