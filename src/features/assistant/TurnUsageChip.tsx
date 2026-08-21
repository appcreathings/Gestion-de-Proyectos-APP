import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatTurnChip } from "@/ai/usage/format";
import type { RagSkipReason, TurnUsageView } from "@/ai/usage/types";

function skipReasonLabel(reason: RagSkipReason): string {
  if (reason === "continuation") return "continuación";
  if (reason === "cache-hit") return "cache";
  if (reason === "disabled") return "off";
  return reason;
}

export function TurnUsageChip({ turn }: { turn: TurnUsageView }) {
  const { label, ariaLabel } = formatTurnChip({
    requests: turn.requests,
    tokens: turn.totalTokens,
    estimated: turn.estimated,
  });
  const ragLine = turn.rag?.injected
    ? "RAG inyectado"
    : turn.rag?.skipReason
      ? `skip: ${skipReasonLabel(turn.rag.skipReason)}`
      : "RAG off";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className="inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
        >
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 text-xs">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <dt>Requests</dt><dd>{turn.requests}</dd>
          <dt>Rondas</dt><dd>{turn.rounds}</dd>
          <dt>Input</dt><dd>{turn.inputTokens}</dd>
          <dt>Output</dt><dd>{turn.outputTokens}</dd>
          <dt>Fuente</dt><dd>{turn.estimated ? "Estimado" : "Proveedor"}</dd>
          <dt>RAG</dt><dd>{ragLine}</dd>
          <dt>Índice</dt><dd>{turn.rag?.indexFocused ? "recortado" : "completo"}</dd>
        </dl>
      </PopoverContent>
    </Popover>
  );
}
