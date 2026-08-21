export function formatTokenCount(n: number): string {
  if (n < 1000) return String(n);
  const thousands = n / 1000;
  const raw = thousands < 10 ? thousands.toFixed(1) : thousands.toFixed(0);
  return `${raw.replace(/\.0$/, "")}k`;
}

export function formatTurnChip(input: {
  requests: number;
  tokens: number;
  estimated: boolean;
}): { label: string; ariaLabel: string } {
  const tok = formatTokenCount(input.tokens);
  const tilde = input.estimated ? "~" : "";
  return {
    label: `${input.requests} req · ${tilde}${tok} tok`,
    ariaLabel: `Este turno: ${input.requests} requests, ${input.tokens} tokens`,
  };
}
