import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/storage/idb", () => {
  const store = new Map<string, unknown>();
  return {
    idbGet: vi.fn(async (k: string) => store.get(k)),
    idbSet: vi.fn(async (k: string, v: unknown) => {
      if (v === undefined) store.delete(k);
      else store.set(k, v);
    }),
    idbDel: vi.fn(async (k: string) => {
      store.delete(k);
    }),
    __store: store,
  };
});

import { saveAiConfig, type AiConfig } from "@/ai/config";
import { DownloadAdapter } from "@/storage/DownloadAdapter";
import { SCHEMA_VERSION } from "@/domain/schemas/common";

const SECRET_KEYS = [
  "AIza-secret-gemini-key-XXXX",
  "sk-secret-openai-key-YYYY",
  "zai-secret-key-ZZZZ",
];

describe("CA-06.2 — las API keys nunca salen en el export del workspace", () => {
  beforeEach(async () => {
    const idb = await import("@/storage/idb");
    (idb as unknown as { __store: Map<string, unknown> }).__store.clear();
  });

  it("exportAll no contiene ninguna de las N keys configuradas en aiConfig", async () => {
    const config: AiConfig = {
      configVersion: 2,
      activeProvider: "openai",
      providers: {
        gemini: { apiKey: SECRET_KEYS[0] },
        openai: { apiKey: SECRET_KEYS[1] },
        zai: { apiKey: SECRET_KEYS[2] },
      },
      model: "openai:gpt-5.4-mini",
      confirmWrites: true,
      autoFallback: true,
      fallbackGroup: "openai:general",
      ragEnabled: true,
    };
    await saveAiConfig(config);

    const adapter = new DownloadAdapter();
    await adapter.init();
    const blob = await adapter.exportAll();
    const text = await blob.text();

    for (const key of SECRET_KEYS) {
      expect(text).not.toContain(key);
    }
    // Sanidad: el export sí trae workspace (no está vacío)
    expect(text).toContain("workspace");
    expect(SCHEMA_VERSION).toBe(23);
  });

  it("el documento de aiConfig en idb NO se incluye como colección del bundle", async () => {
    await saveAiConfig({
      configVersion: 2,
      activeProvider: "gemini",
      providers: { gemini: { apiKey: SECRET_KEYS[0] } },
      model: "gemini:gemini-2.5-flash",
      confirmWrites: true,
      autoFallback: true,
      fallbackGroup: "gemini:flash",
      ragEnabled: true,
    });

    const adapter = new DownloadAdapter();
    await adapter.init();
    const bundle = JSON.parse(await (await adapter.exportAll()).text()) as Record<
      string,
      unknown
    >;

    expect(bundle).not.toHaveProperty("aiConfig");
    expect(JSON.stringify(bundle)).not.toMatch(/apiKey/i);
  });
});
