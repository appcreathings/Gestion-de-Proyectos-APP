import { describe, expect, it } from "vitest";
import { krProgress } from "./krProgress";

describe("krProgress (spec 062 D8)", () => {
  it("devuelve null si falta current o target", () => {
    expect(krProgress(null, 55)).toBeNull();
    expect(krProgress(40, null)).toBeNull();
    expect(krProgress(null, null)).toBeNull();
  });

  it("devuelve null si target es 0 o algún valor no es finito", () => {
    expect(krProgress(40, 0)).toBeNull();
    expect(krProgress(Number.NaN, 55)).toBeNull();
    expect(krProgress(40, Number.NaN)).toBeNull();
    expect(krProgress(Number.POSITIVE_INFINITY, 55)).toBeNull();
  });

  it("calcula la fracción y clampea a [0, 1]", () => {
    expect(krProgress(40, 55)).toBeCloseTo(40 / 55);
    expect(krProgress(110, 100)).toBe(1);
    expect(krProgress(-10, 100)).toBe(0);
  });

  it("mitad exacta", () => {
    expect(krProgress(50, 100)).toBe(0.5);
  });
});
