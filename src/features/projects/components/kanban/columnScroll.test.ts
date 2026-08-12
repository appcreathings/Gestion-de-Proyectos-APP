import { describe, it, expect } from "vitest";
import { pickActiveStatus } from "./columnScroll";

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
      ),
    ).toBe("todo");
  });

  it("falls back when empty", () => {
    expect(pickActiveStatus([], "blocked")).toBe("blocked");
  });
});
