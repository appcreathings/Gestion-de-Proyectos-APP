import { describe, it, expect } from "vitest";
import {
  EXPANDABLE_LIST_INITIAL,
  EXPANDABLE_LESS_LABEL,
  expandableMoreLabel,
  expandableRemaining,
} from "./ExpandableList";

describe("expandableRemaining (spec 066 D9)", () => {
  it("0 y 5 → 0 (sin botón)", () => {
    expect(expandableRemaining(0)).toBe(0);
    expect(expandableRemaining(5)).toBe(0);
  });

  it("6 → 1, 12 → 7", () => {
    expect(expandableRemaining(6)).toBe(1);
    expect(expandableRemaining(12)).toBe(7);
  });

  it("respeta un initial custom", () => {
    expect(expandableRemaining(7, 3)).toBe(4);
    expect(expandableRemaining(2, 3)).toBe(0);
  });
});

describe("labels", () => {
  it("expandableMoreLabel", () => {
    expect(expandableMoreLabel(1)).toBe("Ver 1 más");
    expect(expandableMoreLabel(7)).toBe("Ver 7 más");
  });

  it("EXPANDABLE_LESS_LABEL", () => {
    expect(EXPANDABLE_LESS_LABEL).toBe("Ver menos");
  });

  it("EXPANDABLE_LIST_INITIAL === 5", () => {
    expect(EXPANDABLE_LIST_INITIAL).toBe(5);
  });
});
