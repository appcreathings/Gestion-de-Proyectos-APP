import { describe, expect, it } from "vitest";
import {
  canonicalGanttSearch,
  clearGanttFilters,
  ganttQueryIsEmpty,
  parseGanttQuery,
  readGanttMemory,
  restoreGanttSearch,
  writeGanttMemory,
} from "./ganttQuery";

describe("ganttQuery", () => {
  it("parses ids, scale and at", () => {
    const q = parseGanttQuery(new URLSearchParams("project=b,a&scale=year&at=2026-01-15"));
    expect(q.projectIds).toEqual(["b", "a"]);
    expect(q.scale).toBe("year");
    expect(q.at).toBe("2026-01-15");
  });

  it("defaults scale to quarter and ignores invalid values", () => {
    const q = parseGanttQuery(new URLSearchParams("scale=week&at=2026-13-99"));
    expect(q.scale).toBe("quarter");
    expect(q.at).toBeNull();
  });

  it("drops unknown and archived project ids", () => {
    const known = { productIds: new Set<string>(), projectIds: new Set(["a"]) };
    const q = parseGanttQuery(new URLSearchParams("project=x,a"), known);
    expect(q.projectIds).toEqual(["a"]);
  });

  it("canonical sorts ids and omits default scale", () => {
    const params = canonicalGanttSearch({
      productIds: [],
      projectIds: ["b", "a"],
      scale: "quarter",
      at: null,
    });
    expect(params.get("project")).toBe("a,b");
    expect(params.has("scale")).toBe(false);
  });

  it("clear keeps scale and at", () => {
    const q = clearGanttFilters({
      productIds: ["p"],
      projectIds: ["a"],
      scale: "year",
      at: "2026-01-15",
    });
    expect(q).toEqual({ productIds: [], projectIds: [], scale: "year", at: "2026-01-15" });
  });

  it("detects an empty query", () => {
    expect(ganttQueryIsEmpty(new URLSearchParams())).toBe(true);
    expect(ganttQueryIsEmpty(new URLSearchParams("scale=year"))).toBe(false);
  });

  it("restore drops at from memory", () => {
    const memory = "project=a&scale=year&at=2025-01-01";
    expect(restoreGanttSearch(new URLSearchParams(), memory)).toBe("project=a&scale=year");
    expect(restoreGanttSearch(new URLSearchParams("scale=month"), memory)).toBeNull();
  });

  it("memory survives a throwing storage", () => {
    const boom = () => {
      throw new Error("denied");
    };
    expect(readGanttMemory({ getItem: boom })).toBeNull();
    expect(() => writeGanttMemory({ setItem: boom }, "project=a")).not.toThrow();
  });

  it("writes memory without at", () => {
    const saved: string[] = [];
    writeGanttMemory({ setItem: (_k, v) => void saved.push(v) }, "project=a&at=2025-01-01");
    expect(saved).toEqual(["project=a"]);
  });
});
