import { Progress } from "@/components/ui/progress";

export function ProgressRow(props: {
  label: string;
  done: number;
  total: number;
  pct: number;
  indicatorClassName?: string;
  tooltip?: string;
}) {
  const { label, done, total, pct, indicatorClassName, tooltip } = props;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground" title={tooltip}>
          {done}/{total} · {pct}%
        </span>
      </div>
      <Progress value={pct} indicatorClassName={indicatorClassName} />
    </div>
  );
}
