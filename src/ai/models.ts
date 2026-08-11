import type { ProviderId } from "./providers/types";
import { isProviderId } from "./providers/catalog";

export interface ModelLimit {
  rpm: number;
  tpm: number;
  rpd: number;
}

export interface ModelDefinition {
  /** Id calificado: `"gemini:gemini-2.5-flash"` (D4). */
  id: string;
  provider: ProviderId;
  /** Id sin prefijo — lo que viaja en el request al proveedor. */
  modelId: string;
  label: string;
  category: "texto" | "multimodal" | "agentes" | "audio" | "embedding" | "live" | "otros";
  limits: ModelLimit;
  /** Sin límites publicados ≠ sin cuota (proveedores nuevos). */
  limitsUnknown?: boolean;
  unlimitedTpm?: boolean;
  unlimitedRpm?: boolean;
  unlimitedRpd?: boolean;
  /** Grupo de fallback calificado: `"gemini:flash"`, `"openai:general"`. */
  fallbackGroup: string;
  priority: number;
}

export function qualify(provider: ProviderId, modelId: string): string {
  return `${provider}:${modelId}`;
}

export function splitQualified(id: string): { provider: ProviderId; modelId: string } {
  const idx = id.indexOf(":");
  if (idx <= 0) {
    // Compat: ids viejos sin prefijo se asumen Gemini.
    return { provider: "gemini", modelId: id };
  }
  const provider = id.slice(0, idx);
  const modelId = id.slice(idx + 1);
  if (!isProviderId(provider) || !modelId) {
    return { provider: "gemini", modelId: id };
  }
  return { provider, modelId };
}

/** `true` solo si el id tiene forma `<proveedor válido>:<modelo no vacío>`. */
export function isQualifiedModelId(id: string): boolean {
  const idx = id.indexOf(":");
  if (idx <= 0) return false;
  return isProviderId(id.slice(0, idx)) && id.slice(idx + 1).length > 0;
}

function gemini(
  modelId: string,
  label: string,
  category: ModelDefinition["category"],
  limits: ModelLimit,
  fallbackGroup: string,
  priority: number,
  extras: Partial<ModelDefinition> = {},
): ModelDefinition {
  return {
    id: qualify("gemini", modelId),
    provider: "gemini",
    modelId,
    label,
    category,
    limits,
    fallbackGroup: qualify("gemini", fallbackGroup),
    priority,
    ...extras,
  };
}

export const MODEL_REGISTRY: ModelDefinition[] = [
  gemini("gemini-2.5-flash", "Gemini 2.5 Flash", "texto", { rpm: 6, tpm: 250_000, rpd: 20 }, "flash", 1),
  gemini("gemini-2.5-flash-lite", "Gemini 2.5 Flash Lite", "texto", { rpm: 10, tpm: 250_000, rpd: 20 }, "flash", 2),
  gemini("gemini-3-flash", "Gemini 3 Flash", "texto", { rpm: 5, tpm: 250_000, rpd: 20 }, "flash", 3),
  gemini("gemini-3.5-flash", "Gemini 3.5 Flash", "texto", { rpm: 5, tpm: 250_000, rpd: 20 }, "flash", 4),
  gemini("gemini-3.1-flash-lite", "Gemini 3.1 Flash Lite", "texto", { rpm: 15, tpm: 250_000, rpd: 500 }, "flash-extended", 1),
  gemini("gemma-4-26b", "Gemma 4 26B", "otros", { rpm: 15, tpm: 0, rpd: 1_500 }, "flash-extended", 2, {
    unlimitedTpm: true,
  }),
  gemini("gemma-4-31b", "Gemma 4 31B", "otros", { rpm: 15, tpm: 0, rpd: 1_500 }, "flash-extended", 3, {
    unlimitedTpm: true,
  }),
  gemini("gemini-2.5-pro", "Gemini 2.5 Pro", "texto", { rpm: 0, tpm: 0, rpd: 0 }, "pro", 1),
  gemini("gemini-3.1-pro", "Gemini 3.1 Pro", "texto", { rpm: 0, tpm: 0, rpd: 0 }, "pro", 2),
  gemini("gemini-2.5-flash-tts", "Gemini 2.5 Flash TTS", "audio", { rpm: 3, tpm: 10_000, rpd: 10 }, "audio", 1),
  gemini("gemini-3.1-flash-tts", "Gemini 3.1 Flash TTS", "audio", { rpm: 3, tpm: 10_000, rpd: 10 }, "audio", 2),
  gemini("gemini-embedding-001", "Gemini Embedding 001", "embedding", { rpm: 100, tpm: 30_000, rpd: 1_000 }, "embedding", 1),
  gemini("gemini-embedding-2", "Gemini Embedding 2", "embedding", { rpm: 100, tpm: 30_000, rpd: 1_000 }, "embedding", 2),

  // OpenAI (limits desconocidos publicamente en esta app)
  {
    id: qualify("openai", "gpt-5.4"),
    provider: "openai",
    modelId: "gpt-5.4",
    label: "GPT-5.4",
    category: "texto",
    limits: { rpm: 0, tpm: 0, rpd: 0 },
    limitsUnknown: true,
    fallbackGroup: "openai:general",
    priority: 1,
  },
  {
    id: qualify("openai", "gpt-5.4-mini"),
    provider: "openai",
    modelId: "gpt-5.4-mini",
    label: "GPT-5.4 Mini",
    category: "texto",
    limits: { rpm: 0, tpm: 0, rpd: 0 },
    limitsUnknown: true,
    fallbackGroup: "openai:general",
    priority: 2,
  },
  {
    id: qualify("openai", "gpt-5.4-nano"),
    provider: "openai",
    modelId: "gpt-5.4-nano",
    label: "GPT-5.4 Nano",
    category: "texto",
    limits: { rpm: 0, tpm: 0, rpd: 0 },
    limitsUnknown: true,
    fallbackGroup: "openai:general",
    priority: 3,
  },

  // Z.ai
  {
    id: qualify("zai", "glm-5.2"),
    provider: "zai",
    modelId: "glm-5.2",
    label: "GLM-5.2",
    category: "texto",
    limits: { rpm: 0, tpm: 0, rpd: 0 },
    limitsUnknown: true,
    fallbackGroup: "zai:general",
    priority: 1,
  },
  {
    id: qualify("zai", "glm-4.7-flash"),
    provider: "zai",
    modelId: "glm-4.7-flash",
    label: "GLM-4.7 Flash",
    category: "texto",
    limits: { rpm: 0, tpm: 0, rpd: 0 },
    limitsUnknown: true,
    fallbackGroup: "zai:general",
    priority: 2,
  },
  {
    id: qualify("zai", "glm-4.5-air"),
    provider: "zai",
    modelId: "glm-4.5-air",
    label: "GLM-4.5 Air",
    category: "texto",
    limits: { rpm: 0, tpm: 0, rpd: 0 },
    limitsUnknown: true,
    fallbackGroup: "zai:general",
    priority: 3,
  },
  // nvidia / opencode-zen: sin modelos fijos (id personalizado en UI)
];

export interface FallbackChain {
  group: string;
  label: string;
  models: string[];
}

export const FALLBACK_CHAINS: FallbackChain[] = [
  {
    group: "gemini:flash",
    label: "Flash (rápido, propósito general)",
    models: [
      "gemini:gemini-2.5-flash",
      "gemini:gemini-2.5-flash-lite",
      "gemini:gemini-3-flash",
      "gemini:gemini-3.5-flash",
    ],
  },
  {
    group: "gemini:flash-extended",
    label: "Flash extendido (más cuota)",
    models: ["gemini:gemini-3.1-flash-lite", "gemini:gemma-4-26b", "gemini:gemma-4-31b"],
  },
  {
    group: "gemini:pro",
    label: "Pro (razonamiento profundo)",
    models: ["gemini:gemini-2.5-pro", "gemini:gemini-3.1-pro"],
  },
  {
    group: "gemini:audio",
    label: "Audio / TTS",
    models: ["gemini:gemini-2.5-flash-tts", "gemini:gemini-3.1-flash-tts"],
  },
  {
    group: "gemini:embedding",
    label: "Embeddings",
    models: ["gemini:gemini-embedding-001", "gemini:gemini-embedding-2"],
  },
  {
    group: "openai:general",
    label: "OpenAI (general)",
    models: ["openai:gpt-5.4", "openai:gpt-5.4-mini", "openai:gpt-5.4-nano"],
  },
  {
    group: "zai:general",
    label: "Z.ai (general)",
    models: ["zai:glm-5.2", "zai:glm-4.7-flash", "zai:glm-4.5-air"],
  },
  {
    group: "nvidia:general",
    label: "NVIDIA (personalizado)",
    models: [],
  },
  {
    group: "opencode-zen:general",
    label: "OpenCode Zen (personalizado)",
    models: [],
  },
];

export function getModelDef(id: string): ModelDefinition | undefined {
  return MODEL_REGISTRY.find((m) => m.id === id);
}

export function getModelsByGroup(group: string): ModelDefinition[] {
  return MODEL_REGISTRY.filter((m) => m.fallbackGroup === group).sort(
    (a, b) => a.priority - b.priority,
  );
}

export function getModelsByProvider(provider: ProviderId): ModelDefinition[] {
  return MODEL_REGISTRY.filter((m) => m.provider === provider).sort(
    (a, b) => a.priority - b.priority,
  );
}

export function getChainForGroup(group: string): FallbackChain | undefined {
  return FALLBACK_CHAINS.find((c) => c.group === group);
}

export function getDefaultGroup(): string {
  return "gemini:flash";
}

export function isModelAvailable(def: ModelDefinition): boolean {
  if (def.limitsUnknown) return true;
  return def.limits.rpm > 0 || def.limits.tpm > 0 || def.limits.rpd > 0 || !!def.unlimitedTpm;
}

/** Construye un ModelDefinition ad-hoc para ids personalizados (nvidia / opencode-zen). */
export function customModelDef(provider: ProviderId, modelId: string): ModelDefinition {
  return {
    id: qualify(provider, modelId),
    provider,
    modelId,
    label: modelId,
    category: "otros",
    limits: { rpm: 0, tpm: 0, rpd: 0 },
    limitsUnknown: true,
    fallbackGroup: `${provider}:general`,
    priority: 99,
  };
}
