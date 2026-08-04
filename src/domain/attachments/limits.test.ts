import { describe, it, expect } from "vitest";
import { maxBytesFor, maxCountFor, MAX_BYTES_FILESYSTEM, MAX_COUNT_FILESYSTEM, MAX_BYTES_DOWNLOAD, MAX_COUNT_DOWNLOAD } from "./limits";

describe("limits", () => {
  it("MAX_BYTES_FILESYSTEM es 25 MB", () => {
    expect(MAX_BYTES_FILESYSTEM).toBe(25 * 1024 * 1024);
  });

  it("MAX_COUNT_FILESYSTEM es 50", () => {
    expect(MAX_COUNT_FILESYSTEM).toBe(50);
  });

  it("MAX_BYTES_DOWNLOAD es 5 MB", () => {
    expect(MAX_BYTES_DOWNLOAD).toBe(5 * 1024 * 1024);
  });

  it("MAX_COUNT_DOWNLOAD es 20", () => {
    expect(MAX_COUNT_DOWNLOAD).toBe(20);
  });

  it("maxBytesFor filesystem devuelve 25 MB", () => {
    expect(maxBytesFor("filesystem")).toBe(MAX_BYTES_FILESYSTEM);
  });

  it("maxBytesFor download devuelve 5 MB", () => {
    expect(maxBytesFor("download")).toBe(MAX_BYTES_DOWNLOAD);
  });

  it("maxCountFor filesystem devuelve 50", () => {
    expect(maxCountFor("filesystem")).toBe(MAX_COUNT_FILESYSTEM);
  });

  it("maxCountFor download devuelve 20", () => {
    expect(maxCountFor("download")).toBe(MAX_COUNT_DOWNLOAD);
  });
});