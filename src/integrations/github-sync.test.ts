import { describe, expect, it } from "vitest";
import { GITHUB_SCHEDULE_MS, getNextGitHubSyncAt } from "./github-sync";

describe("github sync scheduling", () => {
  it("returns no next run for manual scheduling", () => {
    expect(getNextGitHubSyncAt("manual")).toBeNull();
    expect(GITHUB_SCHEDULE_MS.manual).toBeNull();
  });

  it("calculates the next run from the selected interval", () => {
    expect(getNextGitHubSyncAt("15m", 0)).toBe(new Date(15 * 60_000).toISOString());
    expect(getNextGitHubSyncAt("1h", 1_000)).toBe(new Date(60 * 60_000 + 1_000).toISOString());
  });
});
