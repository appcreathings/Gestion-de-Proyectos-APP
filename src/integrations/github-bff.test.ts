import { describe, expect, it } from "vitest";
import {
  getGitHubCallbackUrl,
  getGitHubConnectPageUrl,
  getGitHubConnectUrl,
  isGitHubBffConfigured,
} from "./github-bff";

describe("github bff client", () => {
  it("defaults to same-origin /api when VITE_GITHUB_BFF_URL is empty", () => {
    expect(isGitHubBffConfigured()).toBe(true);
    expect(getGitHubConnectUrl()).toBe("/api/github/connect");
  });

  it("supports oauth-only connect mode for reconnect", () => {
    expect(getGitHubConnectUrl({ mode: "oauth" })).toBe("/api/github/connect?mode=oauth");
  });

  it("builds callback URL for Setup URL code handoff", () => {
    expect(
      getGitHubCallbackUrl({
        code: "abc",
        state: "xyz",
        installationId: "99",
      }),
    ).toBe("/api/github/callback?code=abc&state=xyz&installation_id=99");
  });

  it("exposes a public SPA connect page path", () => {
    expect(getGitHubConnectPageUrl()).toMatch(/\/github\/connect$/);
  });
});
