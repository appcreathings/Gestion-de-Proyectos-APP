import { describe, it, expect } from "vitest";
import { formatBytes } from "../lib/formatBytes";

describe("formatBytes", () => {
  it("0 bytes → '0 B'", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("bytes simples", () => {
    expect(formatBytes(1)).toBe("1 B");
    expect(formatBytes(500)).toBe("500 B");
    expect(formatBytes(999)).toBe("999 B");
  });

  it("kilobytes", () => {
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(10 * 1024)).toBe("10 KB");
    expect(formatBytes(999 * 1024)).toBe("999 KB");
  });

  it("megabytes", () => {
    expect(formatBytes(1024 * 1024)).toBe("1.0 MB");
    expect(formatBytes(1.5 * 1024 * 1024)).toBe("1.5 MB");
    expect(formatBytes(25 * 1024 * 1024)).toBe("25 MB");
  });

  it("gigabytes", () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe("1.0 GB");
    expect(formatBytes(2.5 * 1024 * 1024 * 1024)).toBe("2.5 GB");
  });

  it("redondeo correcto", () => {
    expect(formatBytes(1100)).toBe("1.1 KB");
    expect(formatBytes(1150)).toBe("1.1 KB");
    expect(formatBytes(11500)).toBe("11 KB");
  });
});