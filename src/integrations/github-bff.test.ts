import { describe, expect, it } from "vitest";
import {
  getGitHubConnectPageUrl,
  getGitHubConnectUrl,
  isGitHubBffConfigured,
} from "./github-bff";

describe("github bff client", () => {
  it("defaults to same-origin /api when VITE_GITHUB_BFF_URL is empty", () => {
    expect(isGitHubBffConfigured()).toBe(true);
    expect(getGitHubConnectUrl()).toBe("/api/github/connect");
  });

  it("exposes a public SPA connect page path", () => {
    expect(getGitHubConnectPageUrl()).toMatch(/\/github\/connect$/);
  });
});
