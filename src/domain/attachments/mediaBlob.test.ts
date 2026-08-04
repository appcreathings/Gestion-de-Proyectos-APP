import { describe, expect, it } from "vitest";
import { blobForMedia, coerceToBlob, resolveAttachmentMime } from "./mediaBlob";

describe("resolveAttachmentMime", () => {
  it("usa mimeType del metadato si es útil", () => {
    expect(resolveAttachmentMime({ mimeType: "video/mp4", ext: "mp4" })).toBe("video/mp4");
  });

  it("cae a allowlist por extensión si type vacío u octet-stream", () => {
    expect(resolveAttachmentMime({ mimeType: "", ext: "webm" })).toBe("video/webm");
    expect(resolveAttachmentMime({ mimeType: "application/octet-stream", ext: "mp4" })).toBe(
      "video/mp4",
    );
  });
});

describe("coerceToBlob", () => {
  it("pasa Blob tal cual", () => {
    const b = new Blob(["x"], { type: "text/plain" });
    expect(coerceToBlob(b)).toBe(b);
  });

  it("envuelve ArrayBuffer", () => {
    const buf = new TextEncoder().encode("hi").buffer;
    const b = coerceToBlob(buf);
    expect(b).toBeInstanceOf(Blob);
    expect(b.size).toBe(2);
  });

  it("envuelve Uint8Array", () => {
    const b = coerceToBlob(new Uint8Array([1, 2, 3]));
    expect(b.size).toBe(3);
  });
});

describe("blobForMedia", () => {
  it("reescribe type vacío a video/mp4", () => {
    const raw = new Blob([new Uint8Array([0, 0, 0, 0])], { type: "" });
    const out = blobForMedia(raw, { mimeType: "video/mp4", ext: "mp4" });
    expect(out.type).toBe("video/mp4");
    expect(out.size).toBe(raw.size);
  });

  it("no clona si el type ya es correcto", () => {
    const raw = new Blob([new Uint8Array([1])], { type: "video/webm" });
    const out = blobForMedia(raw, { mimeType: "video/webm", ext: "webm" });
    expect(out).toBe(raw);
  });
});
