import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { daysBetween, formatDay, formatRange, relativeDay, todayKey } from "@/lib/dates";

interface DateFieldPreviewProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  value: string;
  /** Days out still considered "próxima" — shown in the warning tone. */
  warnWithinDays?: number;
}

/**
 * Native `<input type="date">` with a live preview line underneath
 * ("sáb, 5 jul 2026 · en 3 días"), colored by urgency. Kept as the plain
 * native input for accessibility/zero-dependency reasons — only the preview
 * is new.
 */
export function DateFieldPreview({
  value,
  warnWithinDays = 3,
  className,
  ...props
}: DateFieldPreviewProps) {
  return (
    <div className="grid gap-1">
      <Input type="date" value={value} className={className} {...props} />
      {value && <DatePreviewLine value={value} warnWithinDays={warnWithinDays} />}
    </div>
  );
}

function DatePreviewLine({ value, warnWithinDays }: { value: string; warnWithinDays: number }) {
  const diff = daysBetween(todayKey(new Date()), value);
  const tone =
    diff < 0 ? "text-destructive" : diff <= warnWithinDays ? "text-warning" : "text-muted-foreground";
  return (
    <p className={cn("text-xs", tone)}>
      {formatDay(value)} · {relativeDay(value)}
    </p>
  );
}

/**
 * Presentational summary for a start/end date pair — pairs with two separate
 * `DateFieldPreview` inputs to show the combined range and duration
 * ("1–14 jul 2026 · 14 días"), or a warning when the end precedes the start.
 */
export function DateRangeSummary({
  start,
  end,
  className,
}: {
  start: string;
  end: string;
  className?: string;
}) {
  if (!start || !end) return null;
  const invalid = daysBetween(start, end) < 0;
  return (
    <p className={cn("text-xs", invalid ? "text-destructive" : "text-muted-foreground", className)}>
      {invalid ? "La fecha de fin es anterior a la de inicio." : formatRange(start, end)}
    </p>
  );
}
