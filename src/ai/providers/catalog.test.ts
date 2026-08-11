import { describe, expect, it } from "vitest";
import { getProviderDef, isProviderId, PROVIDER_CATALOG } from "./catalog";

describe("PROVIDER_CATALOG", () => {
  it("tiene 5 proveedores con ids únicos", () => {
    expect(PROVIDER_CATALOG).toHaveLength(5);
    const ids = PROVIDER_CATALOG.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("todo browserBlocked tiene keyUrl y defaultBaseUrl sin barra final", () => {
    for (const p of PROVIDER_CATALOG) {
      expect(p.keyUrl).toMatch(/^https:\/\//);
      expect(p.defaultBaseUrl.endsWith("/")).toBe(false);
      if (p.browserBlocked) {
        expect(p.keyUrl.length).toBeGreaterThan(0);
      }
    }
  });

  it("gemini/openai/zai no están bloqueados; nvidia/opencode-zen sí (medición CORS)", () => {
    expect(getProviderDef("gemini").browserBlocked).toBe(false);
    expect(getProviderDef("openai").browserBlocked).toBe(false);
    expect(getProviderDef("zai").browserBlocked).toBe(false);
    expect(getProviderDef("nvidia").browserBlocked).toBe(true);
    expect(getProviderDef("opencode-zen").browserBlocked).toBe(true);
  });

  it("openai-compatible usan Bearer; gemini usa x-goog-api-key", () => {
    expect(getProviderDef("gemini").auth).toEqual({ header: "x-goog-api-key" });
    for (const id of ["openai", "zai", "nvidia", "opencode-zen"] as const) {
      expect(getProviderDef(id).auth).toEqual({
        header: "Authorization",
        scheme: "Bearer",
      });
    }
  });

  it("isProviderId / getProviderDef", () => {
    expect(isProviderId("gemini")).toBe(true);
    expect(isProviderId("foo")).toBe(false);
    expect(getProviderDef("openai").label).toContain("OpenAI");
  });
});
