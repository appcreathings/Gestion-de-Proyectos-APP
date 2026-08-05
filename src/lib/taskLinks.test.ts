import { describe, expect, it } from "vitest";
import {
  MAX_TASK_LINKS,
  normalizeTaskLinkUrl,
  taskLinkDisplayLabel,
} from "./taskLinks";

describe("normalizeTaskLinkUrl", () => {
  it("accepts a full https URL", () => {
    const r = normalizeTaskLinkUrl("https://example.com/path?q=1");
    expect(r).toEqual({ ok: true, url: "https://example.com/path?q=1" });
  });

  it("accepts http", () => {
    const r = normalizeTaskLinkUrl("http://localhost:3000/app");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.url).toBe("http://localhost:3000/app");
  });

  it("prepends https when scheme is missing", () => {
    const r = normalizeTaskLinkUrl("github.com/org/repo");
    expect(r).toEqual({ ok: true, url: "https://github.com/org/repo" });
  });

  it("trims whitespace", () => {
    const r = normalizeTaskLinkUrl("  https://figma.com/file/abc  ");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.url).toBe("https://figma.com/file/abc");
  });

  it("rejects empty input", () => {
    expect(normalizeTaskLinkUrl("   ")).toEqual({
      ok: false,
      error: "Pega una URL.",
    });
  });

  it("rejects javascript: protocol", () => {
    const r = normalizeTaskLinkUrl("javascript:alert(1)");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/http/i);
  });

  it("rejects data: protocol", () => {
    const r = normalizeTaskLinkUrl("data:text/html,hi");
    expect(r.ok).toBe(false);
  });

  it("rejects garbage", () => {
    const r = normalizeTaskLinkUrl("not a url at all :::");
    expect(r.ok).toBe(false);
  });
});

describe("taskLinkDisplayLabel", () => {
  it("prefers the label when present", () => {
    expect(
      taskLinkDisplayLabel({ url: "https://example.com/x", label: "Mockups" }),
    ).toBe("Mockups");
  });

  it("falls back to hostname without www", () => {
    expect(
      taskLinkDisplayLabel({
        url: "https://www.notion.so/page",
        label: "  ",
      }),
    ).toBe("notion.so");
  });

  it("falls back to url string if parse fails", () => {
    expect(taskLinkDisplayLabel({ url: "not-a-url", label: "" })).toBe(
      "not-a-url",
    );
  });
});

describe("MAX_TASK_LINKS", () => {
  it("is 20", () => {
    expect(MAX_TASK_LINKS).toBe(20);
  });
});
