import type { UsageEvent } from "./types";

export function buildExportPayload(events: UsageEvent[], exportedAt: string) {
  return { exportedAt, events };
}
