import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  isValidTab,
  readLastTab,
  writeLastTab,
  LAST_TAB_KEY,
  VALID_TABS,
} from "./projectTabMemory";

describe("isValidTab", () => {
  it("accepts every known tab", () => {
    for (const tab of VALID_TABS) {
      expect(isValidTab(tab)).toBe(true);
    }
  });

  it("rejects null, empty, and unknown values", () => {
    expect(isValidTab(null)).toBe(false);
    expect(isValidTab("")).toBe(false);
    expect(isValidTab("overview ")).toBe(false);
    expect(isValidTab("foo")).toBe(false);
    expect(isValidTab("TASKS")).toBe(false);
  });
});

describe("readLastTab / writeLastTab", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("defaults to overview when nothing is stored (CA-01.4)", () => {
    expect(readLastTab()).toBe("overview");
  });

  it("returns a previously written valid tab (CA-01.1 / CA-01.2)", () => {
    writeLastTab("tasks");
    expect(store.get(LAST_TAB_KEY)).toBe("tasks");
    expect(readLastTab()).toBe("tasks");
  });

  it("falls back to overview on invalid/corrupt storage (CA-01.5)", () => {
    store.set(LAST_TAB_KEY, "not-a-tab");
    expect(readLastTab()).toBe("overview");
  });

  it("falls back to overview when localStorage throws (CA-01.5)", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("quota");
      },
      setItem: () => {
        throw new Error("quota");
      },
      removeItem: () => undefined,
    });
    expect(readLastTab()).toBe("overview");
    expect(() => writeLastTab("areas")).not.toThrow();
  });
});
