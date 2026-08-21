import { describe, expect, it } from "vitest";
import { buildOpenAiChatBody, shouldRetryWithoutStreamOptions } from "./index";

describe("buildOpenAiChatBody (spec 060 D23)", () => {
  it("includes stream_options.include_usage when asked", () => {
    const body = buildOpenAiChatBody({
      model: "gpt-x",
      messages: [],
      includeUsage: true,
    });
    expect(body.stream).toBe(true);
    expect(body.stream_options).toEqual({ include_usage: true });
  });

  it("omits stream_options when includeUsage is false (retry path)", () => {
    const body = buildOpenAiChatBody({
      model: "gpt-x",
      messages: [],
      includeUsage: false,
    });
    expect(body.stream_options).toBeUndefined();
  });
});

describe("shouldRetryWithoutStreamOptions", () => {
  it("retries only on 400 whose body mentions stream_options", () => {
    expect(shouldRetryWithoutStreamOptions(400, "Unknown parameter: stream_options")).toBe(true);
    expect(shouldRetryWithoutStreamOptions(400, "invalid model")).toBe(false);
    expect(shouldRetryWithoutStreamOptions(401, "stream_options")).toBe(false);
  });
});
