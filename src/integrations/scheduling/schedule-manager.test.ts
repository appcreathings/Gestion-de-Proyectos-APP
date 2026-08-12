import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { scheduleManager } from "./schedule-manager";
import { loadLastFiredAt, clearLastFiredAt } from "./schedule-sync-state";

describe("schedule-manager (spec 051)", () => {
  const flowId = "flow-sched-1";
  let now = new Date(2026, 7, 12, 11, 0, 0, 0).getTime();

  beforeEach(() => {
    scheduleManager.stopAll();
    clearLastFiredAt(flowId);
    now = new Date(2026, 7, 12, 11, 0, 0, 0).getTime();
    scheduleManager.nowMs = () => now;
  });

  afterEach(() => {
    scheduleManager.stopAll();
    clearLastFiredAt(flowId);
  });

  it("fires once when due and does not re-fire on second evaluate", async () => {
    const onFire = vi.fn(async () => {});
    scheduleManager.register({
      flowId,
      flowName: "Daily 9",
      spec: { cadence: "daily", atHour: 9, atMinute: 0 },
      onFire,
    });

    await scheduleManager.evaluateAll(now);
    expect(onFire).toHaveBeenCalledTimes(1);
    expect(loadLastFiredAt(flowId)).toBeTruthy();

    await scheduleManager.evaluateAll(now);
    expect(onFire).toHaveBeenCalledTimes(1);
  });

  it("unregister stops future fires", async () => {
    const onFire = vi.fn(async () => {});
    scheduleManager.register({
      flowId,
      flowName: "X",
      spec: { cadence: "daily", atHour: 9, atMinute: 0 },
      onFire,
    });
    scheduleManager.unregister(flowId);
    await scheduleManager.evaluateAll(now);
    expect(onFire).not.toHaveBeenCalled();
  });

  it("pause prevents evaluate", async () => {
    const onFire = vi.fn(async () => {});
    scheduleManager.register({
      flowId,
      flowName: "X",
      spec: { cadence: "daily", atHour: 9, atMinute: 0 },
      onFire,
    });
    scheduleManager.pause();
    await scheduleManager.evaluateAll(now);
    expect(onFire).not.toHaveBeenCalled();
  });

  it("advances watermark before onFire (at-most-once)", async () => {
    let watermarkDuringFire: string | null = null;
    scheduleManager.register({
      flowId,
      flowName: "X",
      spec: { cadence: "daily", atHour: 9, atMinute: 0 },
      onFire: async () => {
        watermarkDuringFire = loadLastFiredAt(flowId);
      },
    });
    await scheduleManager.evaluateAll(now);
    expect(watermarkDuringFire).toBeTruthy();
  });
});
