import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/ai/providers", () => ({
  getProvider: vi.fn(async () => ({
    id: "gemini",
    validateKey: vi.fn(async () => ({ ok: true })),
    streamTurn: vi.fn(),
    classifyError: () => "unknown",
  })),
}));

vi.mock("@/storage/idb", () => {
  const store = new Map<string, unknown>();
  return {
    idbGet: vi.fn(async (k: string) => store.get(k)),
    idbSet: vi.fn(async (k: string, v: unknown) => {
      store.set(k, v);
    }),
    idbDel: vi.fn(async (k: string) => {
      store.delete(k);
    }),
    __store: store,
  };
});

import { getProvider } from "@/ai/providers";
import { defaultAiConfig, loadAiConfig } from "@/ai/config";
import { useAiConfigStore } from "./useAiConfigStore";

describe("useAiConfigStore multi-provider", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const idb = await import("@/storage/idb");
    (idb as unknown as { __store: Map<string, unknown> }).__store?.clear?.();
    useAiConfigStore.setState({
      config: defaultAiConfig(),
      loaded: false,
      keyStatus: {
        gemini: "unset",
        openai: "unset",
        zai: "unset",
        nvidia: "unset",
        "opencode-zen": "unset",
      },
      lastError: null,
    });
    vi.mocked(getProvider).mockResolvedValue({
      id: "gemini",
      validateKey: vi.fn(async (): Promise<{ ok: true }> => ({ ok: true })),
      streamTurn: vi.fn(),
      classifyError: () => "unknown" as const,
    });
  });

  it("guardar key de A no borra la de B", async () => {
    await useAiConfigStore.getState().saveAndValidateKey("gemini", "AIza-aaa");
    await useAiConfigStore.getState().saveAndValidateKey("openai", "sk-bbb");

    const { config, keyStatus } = useAiConfigStore.getState();
    expect(config.providers.gemini?.apiKey).toBe("AIza-aaa");
    expect(config.providers.openai?.apiKey).toBe("sk-bbb");
    expect(keyStatus.gemini).toBe("valid");
    expect(keyStatus.openai).toBe("valid");
    expect(config.activeProvider).toBe("openai");
  });

  it("borrar la key de un proveedor no toca las demás", async () => {
    await useAiConfigStore.getState().saveAndValidateKey("gemini", "AIza-aaa");
    await useAiConfigStore.getState().saveAndValidateKey("zai", "zai-ccc");
    await useAiConfigStore.getState().clearKey("gemini");

    const { config, keyStatus } = useAiConfigStore.getState();
    expect(config.providers.gemini).toBeUndefined();
    expect(config.providers.zai?.apiKey).toBe("zai-ccc");
    expect(keyStatus.gemini).toBe("unset");
    expect(keyStatus.zai).toBe("valid");
  });

  it("setActiveProvider ajusta model al lastModel del proveedor", async () => {
    await useAiConfigStore.getState().saveAndValidateKey("gemini", "AIza-aaa");
    await useAiConfigStore.getState().setModel("gemini:gemini-3-flash");
    await useAiConfigStore.getState().saveAndValidateKey("openai", "sk-bbb");
    expect(useAiConfigStore.getState().config.model).toMatch(/^openai:/);

    await useAiConfigStore.getState().setActiveProvider("gemini");
    expect(useAiConfigStore.getState().config.activeProvider).toBe("gemini");
    expect(useAiConfigStore.getState().config.model).toBe("gemini:gemini-3-flash");
  });

  it("key inválida no se persiste", async () => {
    vi.mocked(getProvider).mockResolvedValue({
      id: "gemini",
      validateKey: vi.fn(
        async (): Promise<{ ok: false; error: "invalid-key" }> => ({
          ok: false,
          error: "invalid-key",
        }),
      ),
      streamTurn: vi.fn(),
      classifyError: () => "unknown" as const,
    });
    const ok = await useAiConfigStore.getState().saveAndValidateKey("gemini", "bad");
    expect(ok).toBe(false);
    expect(useAiConfigStore.getState().keyStatus.gemini).toBe("invalid");
    expect(useAiConfigStore.getState().config.providers.gemini).toBeUndefined();
  });

  it("hydrate marca valid las keys ya guardadas (sin re-validar)", async () => {
    await useAiConfigStore.getState().saveAndValidateKey("gemini", "AIza-saved");
    const callsBeforeHydrate = vi.mocked(getProvider).mock.calls.length;
    useAiConfigStore.setState({
      config: defaultAiConfig(),
      loaded: false,
      keyStatus: {
        gemini: "unset",
        openai: "unset",
        zai: "unset",
        nvidia: "unset",
        "opencode-zen": "unset",
      },
    });
    await useAiConfigStore.getState().hydrate();
    const { config, keyStatus } = useAiConfigStore.getState();
    expect(config.providers.gemini?.apiKey).toBe("AIza-saved");
    expect(keyStatus.gemini).toBe("valid");
    // hydrate no vuelve a validar
    expect(vi.mocked(getProvider).mock.calls.length).toBe(callsBeforeHydrate);
  });

  it("loadAiConfig migra v1 del idb", async () => {
    const idb = await import("@/storage/idb");
    await idb.idbSet("aiConfig", {
      apiKey: "AIza-legacy",
      model: "gemini-2.5-flash",
      fallbackGroup: "flash",
    });
    const config = await loadAiConfig();
    expect(config.configVersion).toBe(2);
    expect(config.providers.gemini?.apiKey).toBe("AIza-legacy");
    expect(config.model).toBe("gemini:gemini-2.5-flash");
  });
});
