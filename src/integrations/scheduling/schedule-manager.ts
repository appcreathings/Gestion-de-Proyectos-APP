/**
 * Scheduler de Flujos con trigger `schedule` (spec 051).
 * Un tick compartido evalúa todos los registros; watermark ANTES de onFire (at-most-once).
 */
import {
  formatScheduleSummary,
  isDue,
  scheduleSpecFromTrigger,
  type ScheduleSpec,
} from "./schedule-cadence";
import { clearLastFiredAt, loadLastFiredAt, saveLastFiredAt } from "./schedule-sync-state";

export interface ScheduleRegistration {
  flowId: string;
  flowName: string;
  spec: ScheduleSpec;
  onFire: (firedAtIso: string) => Promise<void>;
}

const TICK_MS = 60_000;

class ScheduleManager {
  private registrations = new Map<string, ScheduleRegistration>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private paused = false;
  /** Injected clock for tests (ms epoch). */
  nowMs: () => number = () => Date.now();

  register(reg: ScheduleRegistration): void {
    this.registrations.set(reg.flowId, reg);
    this.ensureTimer();
  }

  unregister(flowId: string): void {
    this.registrations.delete(flowId);
    if (this.registrations.size === 0) this.clearTimer();
  }

  /** Optional hygiene when a flow is deleted. */
  clearWatermark(flowId: string): void {
    clearLastFiredAt(flowId);
  }

  pause(): void {
    this.paused = true;
    this.clearTimer();
  }

  resume(): void {
    this.paused = false;
    if (this.registrations.size > 0) {
      this.ensureTimer();
      void this.evaluateAll();
    }
  }

  getAllStatuses(): Record<
    string,
    { flowName: string; summary: string; lastFiredAt: string | null; spec: ScheduleSpec }
  > {
    const out: Record<
      string,
      { flowName: string; summary: string; lastFiredAt: string | null; spec: ScheduleSpec }
    > = {};
    for (const [id, reg] of this.registrations) {
      out[id] = {
        flowName: reg.flowName,
        summary: formatScheduleSummary(reg.spec),
        lastFiredAt: loadLastFiredAt(id),
        spec: reg.spec,
      };
    }
    return out;
  }

  async evaluateAll(nowMs?: number): Promise<void> {
    if (this.paused) return;
    const now = nowMs ?? this.nowMs();
    const nowIso = new Date(now).toISOString();

    for (const reg of [...this.registrations.values()]) {
      const lastIso = loadLastFiredAt(reg.flowId);
      const lastMs = lastIso ? Date.parse(lastIso) : null;
      const lastOk = lastMs !== null && !Number.isNaN(lastMs) ? lastMs : null;
      if (!isDue(reg.spec, lastOk, now)) continue;

      // Watermark first — at-most-once (spec 051 design).
      saveLastFiredAt(reg.flowId, nowIso);
      try {
        await reg.onFire(nowIso);
      } catch (err) {
        console.error(`[schedule-manager] onFire failed for ${reg.flowId}:`, err);
      }
    }
  }

  private ensureTimer(): void {
    if (this.paused || this.timer) return;
    this.timer = setInterval(() => {
      void this.evaluateAll();
    }, TICK_MS);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /** Test / teardown helper. */
  stopAll(): void {
    this.clearTimer();
    this.registrations.clear();
    this.paused = false;
  }
}

export const scheduleManager = new ScheduleManager();

export function registerScheduleFlow(
  flow: { id: string; name: string; trigger: { type: string; cadence?: ScheduleSpec["cadence"]; atMinute?: number; atHour?: number; weekday?: number } },
  onFire: (firedAtIso: string) => Promise<void>,
): void {
  if (flow.trigger.type !== "schedule") return;
  const spec = scheduleSpecFromTrigger({
    cadence: flow.trigger.cadence!,
    atMinute: flow.trigger.atMinute ?? 0,
    atHour: flow.trigger.atHour,
    weekday: flow.trigger.weekday,
  });
  scheduleManager.register({
    flowId: flow.id,
    flowName: flow.name,
    spec,
    onFire,
  });
}

export function unregisterScheduleFlow(flowId: string): void {
  scheduleManager.unregister(flowId);
}
