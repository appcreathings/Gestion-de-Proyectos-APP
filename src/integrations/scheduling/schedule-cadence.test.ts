import { describe, it, expect } from "vitest";
import {
  formatScheduleSummary,
  isDue,
  nextFireAfter,
  previousFireAtOrBefore,
  syntheticScheduleRecord,
} from "./schedule-cadence";

describe("schedule-cadence (spec 051)", () => {
  // Wednesday 2026-08-12 11:00 local
  const wed11 = new Date(2026, 7, 12, 11, 0, 0, 0).getTime();

  it("daily previous fire is today at atHour when now is later", () => {
    const prev = previousFireAtOrBefore({ cadence: "daily", atHour: 9, atMinute: 0 }, wed11);
    expect(prev).toBe(new Date(2026, 7, 12, 9, 0, 0, 0).getTime());
  });

  it("daily isDue when never fired and time passed", () => {
    expect(isDue({ cadence: "daily", atHour: 9, atMinute: 0 }, null, wed11)).toBe(true);
  });

  it("daily is not due if already fired after today's anchor", () => {
    const fired = new Date(2026, 7, 12, 9, 1, 0, 0).getTime();
    expect(isDue({ cadence: "daily", atHour: 9, atMinute: 0 }, fired, wed11)).toBe(false);
  });

  it("hourly is due on next hour after watermark", () => {
    const last = new Date(2026, 7, 12, 10, 0, 5, 0).getTime();
    const now = new Date(2026, 7, 12, 11, 0, 10, 0).getTime();
    expect(isDue({ cadence: "hourly", atMinute: 0 }, last, now)).toBe(true);
    const mid = new Date(2026, 7, 12, 10, 30, 0, 0).getTime();
    expect(isDue({ cadence: "hourly", atMinute: 0 }, last, mid)).toBe(false);
  });

  it("weekly previous is last monday when weekday=1", () => {
    // Wed 12 → previous Monday 10 Aug 2026 09:00
    const prev = previousFireAtOrBefore(
      { cadence: "weekly", atHour: 9, atMinute: 0, weekday: 1 },
      wed11,
    );
    expect(prev).toBe(new Date(2026, 7, 10, 9, 0, 0, 0).getTime());
  });

  it("nextFireAfter is strictly after", () => {
    const at = new Date(2026, 7, 12, 9, 0, 0, 0).getTime();
    const next = nextFireAfter({ cadence: "daily", atHour: 9, atMinute: 0 }, at);
    expect(next).toBe(new Date(2026, 7, 13, 9, 0, 0, 0).getTime());
  });

  it("formatScheduleSummary is Spanish", () => {
    expect(formatScheduleSummary({ cadence: "daily", atHour: 9, atMinute: 0 })).toBe(
      "Cada día a las 09:00",
    );
    expect(formatScheduleSummary({ cadence: "hourly", atMinute: 0 })).toBe(
      "Cada hora en el minuto 00",
    );
    expect(
      formatScheduleSummary({ cadence: "weekly", atHour: 9, atMinute: 0, weekday: 1 }),
    ).toBe("Cada lunes a las 09:00");
  });

  it("syntheticScheduleRecord includes firedAt and cadence", () => {
    expect(
      syntheticScheduleRecord({ cadence: "daily", atHour: 9, atMinute: 0 }, "2026-08-12T12:00:00.000Z"),
    ).toEqual({ firedAt: "2026-08-12T12:00:00.000Z", cadence: "daily" });
  });
});
