import { describe, expect, it } from "vitest";
import { getGitHubConnectUrl } from "./github-bff";

describe("github bff client", () => {
  it("requires a configured BFF URL", () => {
    expect(() => getGitHubConnectUrl()).toThrow("VITE_GITHUB_BFF_URL");
  });
});
