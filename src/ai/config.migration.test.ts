import { describe, expect, it } from "vitest";
import {
  AiConfigSchema,
  activeKey,
  activeProviderId,
  defaultAiConfig,
  geminiKey,
  hasKey,
  migrateAiConfig,
} from "./config";

describe("migrateAiConfig v1 → v2", () => {
  it("migra key + model + fallbackGroup a forma calificada", () => {
    const migrated = migrateAiConfig({
      apiKey: "AIza-test-key",
      model: "gemini-2.5-flash",
      confirmWrites: true,
      autoFallback: true,
      fallbackGroup: "flash",
      ragEnabled: true,
    });
    const parsed = AiConfigSchema.parse(migrated);
    expect(parsed.configVersion).toBe(2);
    expect(parsed.activeProvider).toBe("gemini");
    expect(parsed.providers.gemini?.apiKey).toBe("AIza-test-key");
    expect(parsed.model).toBe("gemini:gemini-2.5-flash");
    expect(parsed.fallbackGroup).toBe("gemini:flash");
    expect(activeKey(parsed)).toBe("AIza-test-key");
    expect(geminiKey(parsed)).toBe("AIza-test-key");
  });

  it("sin key deja providers vacío", () => {
    const migrated = migrateAiConfig({
      apiKey: "",
      model: "gemini-2.5-flash-lite",
      fallbackGroup: "flash",
    });
    const parsed = AiConfigSchema.parse(migrated);
    expect(parsed.providers).toEqual({});
    expect(activeKey(parsed)).toBe("");
    expect(hasKey(parsed, "gemini")).toBe(false);
  });

  it("ya-v2 se deja intacto (la key sobrevive)", () => {
    const v2 = {
      configVersion: 2 as const,
      activeProvider: "openai",
      providers: {
        gemini: { apiKey: "AIza-keep" },
        openai: { apiKey: "sk-keep", baseUrl: "https://proxy.example/v1" },
      },
      model: "openai:gpt-5.4-mini",
      confirmWrites: false,
      autoFallback: true,
      fallbackGroup: "openai:general",
      ragEnabled: false,
    };
    const migrated = migrateAiConfig(v2);
    expect(migrated).toBe(v2);
    const parsed = AiConfigSchema.parse(migrated);
    expect(parsed.providers.gemini?.apiKey).toBe("AIza-keep");
    expect(parsed.providers.openai?.apiKey).toBe("sk-keep");
    expect(activeProviderId(parsed)).toBe("openai");
    expect(activeKey(parsed)).toBe("sk-keep");
  });

  it("corrupto cae al default sin romper", () => {
    // loadAiConfig: migrate(raw ?? {}) → safeParse → si falla, defaultAiConfig()
    expect(AiConfigSchema.safeParse(migrateAiConfig({})).success).toBe(true);
    // string no-objeto: migrate lo devuelve tal cual; safeParse falla → default
    expect(AiConfigSchema.safeParse(migrateAiConfig("boom")).success).toBe(false);
    expect(defaultAiConfig().configVersion).toBe(2);
    expect(defaultAiConfig().model).toBe("gemini:gemini-2.5-flash");
  });

  it("model ya calificado no se doble-prefija", () => {
    const migrated = migrateAiConfig({
      apiKey: "k",
      model: "gemini:gemini-3-flash",
      fallbackGroup: "gemini:flash-extended",
    });
    const parsed = AiConfigSchema.parse(migrated);
    expect(parsed.model).toBe("gemini:gemini-3-flash");
    expect(parsed.fallbackGroup).toBe("gemini:flash-extended");
  });
});
