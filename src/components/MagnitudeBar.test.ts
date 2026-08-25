import { describe, it, expect } from "vitest";
import { magnitudeBarWidth } from "./MagnitudeBar";

describe("magnitudeBarWidth (spec 067 CA-03.1)", () => {
  it("0 / 10 → 0", () => {
    expect(magnitudeBarWidth(0, 10)).toBe(0);
  });

  it("5 / 10 → 50", () => {
    expect(magnitudeBarWidth(5, 10)).toBe(50);
  });

  it("10 / 10 → 100", () => {
    expect(magnitudeBarWidth(10, 10)).toBe(100);
  });

  it("max 0 → 0 (no NaN)", () => {
    expect(magnitudeBarWidth(3, 0)).toBe(0);
  });

  it("value negativo → 0", () => {
    expect(magnitudeBarWidth(-1, 10)).toBe(0);
  });

  it("value > max se capea a 100", () => {
    expect(magnitudeBarWidth(12, 10)).toBe(100);
  });
});
