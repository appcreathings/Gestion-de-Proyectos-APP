import { describe, expect, it } from "vitest";
import {
  parseGeminiUsage,
  parseOpenAiUsage,
  estimateTokensFromChars,
  estimateTurnUsage,
} from "./parseUsage";

describe("parseGeminiUsage", () => {
  it("maps prompt/candidates/total (CA-01.1)", () => {
    expect(
      parseGeminiUsage({
        promptTokenCount: 100,
        candidatesTokenCount: 20,
        totalTokenCount: 120,
      }),
    ).toEqual({
      inputTokens: 100,
      outputTokens: 20,
      totalTokens: 120,
      source: "provider",
    });
  });

  it("sums in+out when total is missing", () => {
    expect(
      parseGeminiUsage({ promptTokenCount: 10, candidatesTokenCount: 5 }),
    ).toMatchObject({ totalTokens: 15, source: "provider" });
  });

  it("accepts legitimate 0/0/0", () => {
    expect(
      parseGeminiUsage({
        promptTokenCount: 0,
        candidatesTokenCount: 0,
        totalTokenCount: 0,
      }),
    ).toMatchObject({ totalTokens: 0, source: "provider" });
  });

  it("returns null for garbage", () => {
    expect(parseGeminiUsage(null)).toBeNull();
    expect(parseGeminiUsage({ promptTokenCount: "x" })).toBeNull();
  });
});

describe("parseOpenAiUsage", () => {
  it("maps prompt_tokens / completion_tokens (CA-01.2)", () => {
    expect(
      parseOpenAiUsage({
        prompt_tokens: 80,
        completion_tokens: 12,
        total_tokens: 92,
      }),
    ).toEqual({
      inputTokens: 80,
      outputTokens: 12,
      totalTokens: 92,
      source: "provider",
    });
  });

  it("returns null when usage is missing", () => {
    expect(parseOpenAiUsage(undefined)).toBeNull();
  });
});

describe("estimateTokensFromChars", () => {
  it("ceil chars/4 with min 1 (CA-01.3)", () => {
    expect(estimateTokensFromChars(0)).toBe(1);
    expect(estimateTokensFromChars(4)).toBe(1);
    expect(estimateTokensFromChars(5)).toBe(2);
  });
});

describe("estimateTurnUsage", () => {
  it("marks source estimated and splits in/out", () => {
    const u = estimateTurnUsage({
      systemInstruction: "aaaa",
      historyJson: "bbbb",
      userMessage: "cccc",
      outputText: "dddd",
    });
    expect(u.source).toBe("estimated");
    expect(u.inputTokens).toBe(estimateTokensFromChars(12));
    expect(u.outputTokens).toBe(estimateTokensFromChars(4));
    expect(u.totalTokens).toBe(u.inputTokens + u.outputTokens);
  });
});
