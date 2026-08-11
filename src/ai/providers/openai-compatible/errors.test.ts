import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { classifyOpenAiError, HttpError } from "./errors";

function forceOnline(on: boolean) {
  Object.defineProperty(navigator, "onLine", {
    value: on,
    configurable: true,
    writable: true,
  });
}
const originalOnLine = navigator.onLine;

beforeEach(() => forceOnline(true));
afterEach(() => forceOnline(originalOnLine));

describe("classifyOpenAiError", () => {
  it("401/403 → invalid-key", () => {
    expect(classifyOpenAiError(new HttpError(401, "nope"))).toBe("invalid-key");
    expect(classifyOpenAiError(new HttpError(403, "forbidden"))).toBe("invalid-key");
  });

  it("400 con api key en body → invalid-key", () => {
    expect(classifyOpenAiError(new HttpError(400, "Invalid API key"))).toBe("invalid-key");
  });

  it("429 rate vs quota", () => {
    expect(classifyOpenAiError(new HttpError(429, "Rate limit exceeded"))).toBe("rate-limit");
    expect(classifyOpenAiError(new HttpError(429, "You exceeded your quota"))).toBe(
      "quota-exhausted",
    );
    expect(classifyOpenAiError(new HttpError(429, "daily token limit"))).toBe("quota-exhausted");
  });

  it("500 → unknown", () => {
    expect(classifyOpenAiError(new HttpError(500, "oops"))).toBe("unknown");
  });

  it("TypeError + online → cors-blocked", () => {
    forceOnline(true);
    expect(classifyOpenAiError(new TypeError("Failed to fetch"))).toBe("cors-blocked");
  });

  it("TypeError + offline → offline", () => {
    forceOnline(false);
    expect(classifyOpenAiError(new TypeError("Failed to fetch"))).toBe("offline");
  });

  it("AbortError → aborted", () => {
    expect(classifyOpenAiError(new DOMException("aborted", "AbortError"))).toBe("aborted");
    const err = new Error("aborted");
    err.name = "AbortError";
    expect(classifyOpenAiError(err)).toBe("aborted");
  });
});
