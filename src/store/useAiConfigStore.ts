import { create } from "zustand";
import {
  activeKey,
  activeProviderId,
  defaultAiConfig,
  defaultFallbackGroupForProvider,
  defaultModelForProvider,
  hasKey,
  loadAiConfig,
  saveAiConfig,
  type AiConfig,
} from "@/ai/config";
import type { AiErrorKind } from "@/ai/gemini/errors";
import { splitQualified } from "@/ai/models";
import type { ProviderId } from "@/ai/providers/types";
import { PROVIDER_CATALOG } from "@/ai/providers/catalog";
import { getProvider } from "@/ai/providers";

export type KeyStatus = "unset" | "validating" | "valid" | "invalid" | "network-error";

function emptyKeyStatus(): Record<ProviderId, KeyStatus> {
  const out = {} as Record<ProviderId, KeyStatus>;
  for (const p of PROVIDER_CATALOG) {
    out[p.id] = "unset";
  }
  return out;
}

function statusesFromConfig(config: AiConfig): Record<ProviderId, KeyStatus> {
  const out = emptyKeyStatus();
  for (const p of PROVIDER_CATALOG) {
    out[p.id] = hasKey(config, p.id) ? "valid" : "unset";
  }
  return out;
}

interface AiConfigState {
  config: AiConfig;
  loaded: boolean;
  /** Per-provider key status. Only validated keys are persisted. */
  keyStatus: Record<ProviderId, KeyStatus>;
  lastError: AiErrorKind | null;

  hydrate: () => Promise<void>;
  /** Validate against the provider API and persist only on success. */
  saveAndValidateKey: (providerId: ProviderId, apiKey: string) => Promise<boolean>;
  clearKey: (providerId: ProviderId) => Promise<void>;
  setActiveProvider: (providerId: ProviderId) => Promise<void>;
  setBaseUrl: (providerId: ProviderId, baseUrl: string) => Promise<void>;
  setModel: (model: AiConfig["model"]) => Promise<void>;
  setConfirmWrites: (v: boolean) => Promise<void>;
  setAutoFallback: (v: boolean) => Promise<void>;
  setFallbackGroup: (group: string) => Promise<void>;
  setRagEnabled: (v: boolean) => Promise<void>;
}

async function validateProviderKey(
  providerId: ProviderId,
  apiKey: string,
  baseUrl?: string,
): Promise<{ ok: true } | { ok: false; error: AiErrorKind }> {
  const provider = await getProvider(providerId);
  return provider.validateKey(apiKey, baseUrl);
}

export const useAiConfigStore = create<AiConfigState>((set, get) => ({
  config: defaultAiConfig(),
  loaded: false,
  keyStatus: emptyKeyStatus(),
  lastError: null,

  async hydrate() {
    const config = await loadAiConfig();
    set({
      config,
      loaded: true,
      keyStatus: statusesFromConfig(config),
    });
  },

  async saveAndValidateKey(providerId, apiKey) {
    const trimmed = apiKey.trim();
    if (!trimmed) return false;
    set((s) => ({
      keyStatus: { ...s.keyStatus, [providerId]: "validating" },
      lastError: null,
    }));
    const baseUrl = get().config.providers[providerId]?.baseUrl;
    const res = await validateProviderKey(providerId, trimmed, baseUrl);
    if (!res.ok) {
      set((s) => ({
        keyStatus: {
          ...s.keyStatus,
          [providerId]: res.error === "invalid-key" ? "invalid" : "network-error",
        },
        lastError: res.error,
      }));
      return false;
    }
    const prev = get().config;
    const prevProv = prev.providers[providerId] ?? { apiKey: "" };
    // Solo tocar model/fallbackGroup al cambiar de proveedor. Rotar la key del
    // activo no debe pisar la elección del usuario (spec 049 F3 / D5).
    const switchingProvider =
      prev.activeProvider !== providerId ||
      splitQualified(prev.model).provider !== providerId;
    const config: AiConfig = {
      ...prev,
      activeProvider: providerId,
      providers: {
        ...prev.providers,
        [providerId]: { ...prevProv, apiKey: trimmed },
      },
      ...(switchingProvider
        ? {
            model: prevProv.lastModel ?? defaultModelForProvider(providerId),
            fallbackGroup: defaultFallbackGroupForProvider(providerId),
          }
        : {}),
    };
    await saveAiConfig(config);
    set((s) => ({
      config,
      keyStatus: { ...s.keyStatus, [providerId]: "valid" },
      lastError: null,
    }));
    return true;
  },

  async clearKey(providerId) {
    const prev = get().config;
    const nextProviders = { ...prev.providers };
    delete nextProviders[providerId];
    const config: AiConfig = { ...prev, providers: nextProviders };
    // If we wiped the active provider's key, keep activeProvider but chat will warn.
    await saveAiConfig(config);
    set((s) => ({
      config,
      keyStatus: { ...s.keyStatus, [providerId]: "unset" },
      lastError: null,
    }));
  },

  async setActiveProvider(providerId) {
    const prev = get().config;
    const last = prev.providers[providerId]?.lastModel;
    const model = last ?? defaultModelForProvider(providerId);
    const config: AiConfig = {
      ...prev,
      activeProvider: providerId,
      model,
      fallbackGroup: defaultFallbackGroupForProvider(providerId),
    };
    await saveAiConfig(config);
    set({ config });
  },

  async setBaseUrl(providerId, baseUrl) {
    const prev = get().config;
    const prevProv = prev.providers[providerId] ?? { apiKey: "" };
    const trimmed = baseUrl.trim();
    const config: AiConfig = {
      ...prev,
      providers: {
        ...prev.providers,
        [providerId]: {
          ...prevProv,
          baseUrl: trimmed || undefined,
        },
      },
    };
    await saveAiConfig(config);
    set({ config });
  },

  async setModel(model) {
    const prev = get().config;
    const providerId = activeProviderId(prev);
    const prevProv = prev.providers[providerId] ?? { apiKey: "" };
    const config: AiConfig = {
      ...prev,
      model,
      providers: {
        ...prev.providers,
        [providerId]: { ...prevProv, lastModel: model },
      },
    };
    await saveAiConfig(config);
    set({ config });
  },

  async setConfirmWrites(confirmWrites) {
    const config = { ...get().config, confirmWrites };
    await saveAiConfig(config);
    set({ config });
  },

  async setAutoFallback(autoFallback) {
    const config = { ...get().config, autoFallback };
    await saveAiConfig(config);
    set({ config });
  },

  async setFallbackGroup(fallbackGroup) {
    const config = { ...get().config, fallbackGroup };
    await saveAiConfig(config);
    set({ config });
  },

  async setRagEnabled(ragEnabled) {
    const config = { ...get().config, ragEnabled };
    await saveAiConfig(config);
    set({ config });
  },
}));

/** Convenience: status of the active provider's key (for simple UI). */
export function activeKeyStatus(state: AiConfigState): KeyStatus {
  return state.keyStatus[activeProviderId(state.config)] ?? "unset";
}

export { activeKey, activeProviderId };
