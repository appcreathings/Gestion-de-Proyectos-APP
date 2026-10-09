import { describe, it, expect } from "vitest";
import { pickActiveStatus } from "./columnScroll";

const ORDER = ["todo", "doing", "blocked", "done"] as const;

describe("pickActiveStatus (spec 054)", () => {
  it("picks the highest intersection ratio", () => {
    expect(
      pickActiveStatus(
        [
          { status: "todo", intersectionRatio: 0.2 },
          { status: "doing", intersectionRatio: 0.8 },
          { status: "blocked", intersectionRatio: 0.1 },
        ],
        "todo",
        ORDER,
      ),
    ).toBe("doing");
  });

  it("on tie prefers earlier column order", () => {
    expect(
      pickActiveStatus(
        [
          { status: "done", intersectionRatio: 0.5 },
          { status: "todo", intersectionRatio: 0.5 },
        ],
        "done",
        ORDER,
      ),
    ).toBe("todo");
  });

  it("falls back when empty", () => {
    expect(pickActiveStatus([], "blocked", ORDER)).toBe("blocked");
  });

  it("el desempate sigue el orden del tablero que le pasan (spec 073)", () => {
    // Mismos ratios, orden custom: "custom-1" va antes que "todo".
    expect(
      pickActiveStatus(
        [
          { status: "todo", intersectionRatio: 0.5 },
          { status: "custom-1", intersectionRatio: 0.5 },
        ],
        "todo",
        ["custom-1", "todo", "done"],
      ),
    ).toBe("custom-1");
  });
});
