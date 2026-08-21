import { describe, expect, it } from "vitest";
import type { RagStatus } from "@/ai/rag/types";
import type { RagSkipReason } from "@/ai/usage/types";
import { shouldAutoRag, shouldFocusIndex } from "./ragPolicy";

type Case = {
  name: string;
  ragEnabled: boolean;
  status: RagStatus;
  entityCount: number;
  skip: false | "slash" | "continuation";
  hasGeminiKey: boolean;
  focus: boolean;
  auto: boolean;
  skipReason?: RagSkipReason;
};

const cases: Case[] = [
  {
    name: "fresh+no skip → auto true, focus true",
    ragEnabled: true,
    status: "up-to-date",
    entityCount: 10,
    skip: false,
    hasGeminiKey: true,
    focus: true,
    auto: true,
  },
  {
    name: "fresh+slash → auto false slash, focus still true",
    ragEnabled: true,
    status: "up-to-date",
    entityCount: 10,
    skip: "slash",
    hasGeminiKey: true,
    focus: true,
    auto: false,
    skipReason: "slash",
  },
  {
    name: "fresh+continuation → auto false continuation, focus true",
    ragEnabled: true,
    status: "up-to-date",
    entityCount: 10,
    skip: "continuation",
    hasGeminiKey: true,
    focus: true,
    auto: false,
    skipReason: "continuation",
  },
  {
    name: "partial → stale, focus false",
    ragEnabled: true,
    status: "partial",
    entityCount: 10,
    skip: false,
    hasGeminiKey: true,
    focus: false,
    auto: false,
    skipReason: "stale",
  },
  {
    name: "ragEnabled false → disabled, focus false",
    ragEnabled: false,
    status: "up-to-date",
    entityCount: 10,
    skip: false,
    hasGeminiKey: true,
    focus: false,
    auto: false,
    skipReason: "disabled",
  },
  {
    name: "indexing → stale, focus false",
    ragEnabled: true,
    status: "indexing",
    entityCount: 10,
    skip: false,
    hasGeminiKey: true,
    focus: false,
    auto: false,
    skipReason: "stale",
  },
  {
    name: "entityCount 0 → stale, focus false",
    ragEnabled: true,
    status: "up-to-date",
    entityCount: 0,
    skip: false,
    hasGeminiKey: true,
    focus: false,
    auto: false,
    skipReason: "stale",
  },
  {
    name: "no key → no-key, focus true (fresh)",
    ragEnabled: true,
    status: "up-to-date",
    entityCount: 10,
    skip: false,
    hasGeminiKey: false,
    focus: true,
    auto: false,
    skipReason: "no-key",
  },
  {
    name: "idle → stale, focus false",
    ragEnabled: true,
    status: "idle",
    entityCount: 5,
    skip: false,
    hasGeminiKey: true,
    focus: false,
    auto: false,
    skipReason: "stale",
  },
  {
    name: "error → stale, focus false",
    ragEnabled: true,
    status: "error",
    entityCount: 5,
    skip: false,
    hasGeminiKey: true,
    focus: false,
    auto: false,
    skipReason: "stale",
  },
];

describe("ragPolicy", () => {
  it.each(cases)(
    "$name",
    ({ ragEnabled, status, entityCount, skip, hasGeminiKey, focus, auto, skipReason }) => {
      expect(shouldFocusIndex({ ragEnabled, status, entityCount })).toBe(focus);

      const result = shouldAutoRag({
        ragEnabled,
        status,
        entityCount,
        skip,
        hasGeminiKey,
      });
      expect(result.auto).toBe(auto);
      if (skipReason === undefined) {
        expect(result.skipReason).toBeUndefined();
      } else {
        expect(result.skipReason).toBe(skipReason);
      }
    }
  );
});
