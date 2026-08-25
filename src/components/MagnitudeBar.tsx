import { cn } from "@/lib/utils";

/** 0..100. max<=0 o value<=0 → 0. Nunca NaN. */
export function magnitudeBarWidth(value: number, max: number): number {
  if (max <= 0 || value <= 0) return 0;
  return Math.min(100, (value / max) * 100);
}

export function MagnitudeBar({
  value,
  max,
  label,
  className,
  indicatorClassName,
}: {
  value: number;
  max: number;
  /** Nombre accesible, p.ej. "12 restantes de un máximo de 18". */
  label: string;
  className?: string;
  indicatorClassName?: string;
}) {
  const width = magnitudeBarWidth(value, max);
  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-muted", className)}
      role="img"
      aria-label={label}
    >
      <div
        className={cn("h-full rounded-full bg-primary transition-all", indicatorClassName)}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
