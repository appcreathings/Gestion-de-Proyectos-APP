import type { ProviderId } from "./types";

export interface ProviderDefinition {
  id: ProviderId;
  label: string;
  kind: "gemini" | "openai-compatible";
  /** Base por defecto; el usuario puede sobrescribirla (D7). */
  defaultBaseUrl: string;
  /** Cómo viaja la key. */
  auth: { header: "Authorization"; scheme: "Bearer" } | { header: "x-goog-api-key" };
  /** Medido el 2026-08-11 — ver spec §2. `true` ⇒ exige baseUrl propia. */
  browserBlocked: boolean;
  /** Dónde saca el usuario la key. */
  keyUrl: string;
  keyHint: string;
}

export const PROVIDER_CATALOG: ProviderDefinition[] = [
  {
    id: "gemini",
    label: "Google Gemini",
    kind: "gemini",
    defaultBaseUrl: "https://generativelanguage.googleapis.com",
    auth: { header: "x-goog-api-key" },
    browserBlocked: false,
    keyUrl: "https://aistudio.google.com/apikey",
    keyHint: "AIza…",
  },
  {
    id: "openai",
    label: "OpenAI (API key de platform)",
    kind: "openai-compatible",
    defaultBaseUrl: "https://api.openai.com/v1",
    auth: { header: "Authorization", scheme: "Bearer" },
    browserBlocked: false,
    keyUrl: "https://platform.openai.com/api-keys",
    keyHint: "sk-…",
  },
  {
    id: "zai",
    label: "Z.ai (GLM)",
    kind: "openai-compatible",
    defaultBaseUrl: "https://api.z.ai/api/paas/v4",
    auth: { header: "Authorization", scheme: "Bearer" },
    browserBlocked: false,
    keyUrl: "https://z.ai/manage-apikey/apikey-list",
    keyHint: "…",
  },
  {
    id: "nvidia",
    label: "NVIDIA NIM",
    kind: "openai-compatible",
    defaultBaseUrl: "https://integrate.api.nvidia.com/v1",
    auth: { header: "Authorization", scheme: "Bearer" },
    browserBlocked: true,
    keyUrl: "https://build.nvidia.com/",
    keyHint: "nvapi-…",
  },
  {
    id: "opencode-zen",
    label: "OpenCode Zen",
    kind: "openai-compatible",
    defaultBaseUrl: "https://opencode.ai/zen/v1",
    auth: { header: "Authorization", scheme: "Bearer" },
    browserBlocked: true,
    keyUrl: "https://opencode.ai/auth",
    keyHint: "…",
  },
];

const BY_ID = new Map(PROVIDER_CATALOG.map((d) => [d.id, d]));

export function getProviderDef(id: ProviderId): ProviderDefinition {
  const def = BY_ID.get(id);
  if (!def) {
    throw new Error(`Proveedor desconocido: ${id}`);
  }
  return def;
}

export function isProviderId(value: string): value is ProviderId {
  return BY_ID.has(value as ProviderId);
}
