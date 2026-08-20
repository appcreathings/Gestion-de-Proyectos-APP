import { describe, expect, it } from "vitest";
import { formatTokenCount, formatTurnChip } from "./format";

describe("formatTurnChip (CA-05.1, CA-05.2, CA-05.5)", () => {
  it("formats thousands with k", () => {
    expect(formatTokenCount(850)).toBe("850");
    expect(formatTokenCount(4200)).toBe("4.2k");
    expect(formatTokenCount(12000)).toBe("12k");
  });

  it("tilde only when estimated", () => {
    expect(formatTurnChip({ requests: 2, tokens: 4200, estimated: false })).toEqual({
      label: "2 req · 4.2k tok",
      ariaLabel: "Este turno: 2 requests, 4200 tokens",
    });
    expect(formatTurnChip({ requests: 2, tokens: 4200, estimated: true }).label).toBe(
      "2 req · ~4.2k tok",
    );
  });
});
