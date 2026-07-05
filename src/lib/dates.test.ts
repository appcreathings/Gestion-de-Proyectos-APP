import { describe, expect, it } from "vitest";
import { daysBetween, formatRange, relativeDay } from "./dates";

describe("daysBetween", () => {
  it("cuenta los días completos entre dos claves YYYY-MM-DD", () => {
    expect(daysBetween("2026-07-01", "2026-07-14")).toBe(13);
  });

  it("es negativo cuando b es anterior a a", () => {
    expect(daysBetween("2026-07-14", "2026-07-01")).toBe(-13);
  });

  it("es cero para la misma fecha", () => {
    expect(daysBetween("2026-07-05", "2026-07-05")).toBe(0);
  });
});

describe("relativeDay", () => {
  const now = new Date(2026, 6, 5); // 5 jul 2026

  it("hoy", () => {
    expect(relativeDay("2026-07-05", now)).toBe("hoy");
  });

  it("mañana", () => {
    expect(relativeDay("2026-07-06", now)).toBe("mañana");
  });

  it("ayer", () => {
    expect(relativeDay("2026-07-04", now)).toBe("ayer");
  });

  it("en N días", () => {
    expect(relativeDay("2026-07-08", now)).toBe("en 3 días");
  });

  it("hace N días", () => {
    expect(relativeDay("2026-07-01", now)).toBe("hace 4 días");
  });
});

describe("formatRange", () => {
  it("incluye el rango y la duración inclusiva", () => {
    expect(formatRange("2026-07-01", "2026-07-14")).toBe("1 jul 2026 – 14 jul 2026 · 14 días");
  });

  it("usa singular para un solo día", () => {
    expect(formatRange("2026-07-01", "2026-07-01")).toBe("1 jul 2026 – 1 jul 2026 · 1 día");
  });
});
