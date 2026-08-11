import { z } from "zod";
import { idbDel, idbGet, idbSet } from "@/storage/idb";
import { MODEL_REGISTRY, isModelAvailable, getModelsByProvider } from "./models";
import type { ProviderId } from "./providers/types";
import { isProviderId } from "./providers/catalog";

/**
 * Device-local AI configuration. Lives in IndexedDB, NEVER in workspace.json:
 * the workspace is exported/shared and the API key must never travel with it
 * (constitución, principio I — nada a la nube sin acción explícita).
 *
 * Spec 047: multi-key v2 — una key por proveedor, proveedor activo, baseUrl opcional.
 */

export const AI_MODELS = MODEL_REGISTRY
  .filter((m) => m.category !== "embedding")
  .map((m) => ({
    value: m.id,
    label: m.label,
    hint: m.limitsUnknown
      ? "límites no publicados"
      : isModelAvailable(m)
        ? `${m.limits.rpm > 0 ? `${m.limits.rpm} req/min` : ""}${m.limits.tpm > 0 ? ` · ${(m.limits.tpm / 1000).toFixed(0)}K tok/min` : ""}${m.unlimitedTpm ? " · tok ilimitado" : ""}`
        : `sin cuota disponible`,
    available: isModelAvailable(m),
    provider: m.provider,
  }));

export function modelsForProvider(provider: ProviderId) {
  return AI_MODELS.filter((m) => m.provider === provider);
}

export const AiProviderConfigSchema = z.object({
  apiKey: z.string().default(""),
  baseUrl: z.string().optional(),
  lastModel: z.string().optional(),
});
export type AiProviderConfig = z.infer<typeof AiProviderConfigSchema>;

export const AiConfigSchema = z.object({
  configVersion: z.literal(2).default(2),
  activeProvider: z.string().default("gemini"),
  providers: z.record(AiProviderConfigSchema).default({}),
  model: z.string().default("gemini:gemini-2.5-flash"),
  confirmWrites: z.boolean().default(true),
  autoFallback: z.boolean().default(true),
  fallbackGroup: z.string().default("gemini:flash"),
  ragEnabled: z.boolean().default(true),
});
export type AiConfig = z.infer<typeof AiConfigSchema>;

const IDB_KEY = "aiConfig";

/** Migración silenciosa v1 → v2 (D10). La key existente no se pierde. */
export function migrateAiConfig(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const r = raw as Record<string, unknown>;
  if (r.configVersion === 2) return r;

  // v1: { apiKey, model, confirmWrites, autoFallback, fallbackGroup, ragEnabled }
  const apiKey = typeof r.apiKey === "string" ? r.apiKey : "";
  const model = typeof r.model === "string" ? r.model : "gemini-2.5-flash";
  const group = typeof r.fallbackGroup === "string" ? r.fallbackGroup : "flash";
  const { apiKey: _drop, ...rest } = r;
  return {
    ...rest,
    configVersion: 2,
    activeProvider: "gemini",
    providers: apiKey ? { gemini: { apiKey } } : {},
    model: model.includes(":") ? model : `gemini:${model}`,
    fallbackGroup: group.includes(":") ? group : `gemini:${group}`,
  };
}

export function defaultAiConfig(): AiConfig {
  return AiConfigSchema.parse({});
}

export async function loadAiConfig(): Promise<AiConfig> {
  try {
    const raw = await idbGet<unknown>(IDB_KEY);
    const migrated = migrateAiConfig(raw ?? {});
    const parsed = AiConfigSchema.safeParse(migrated ?? {});
    return parsed.success ? parsed.data : defaultAiConfig();
  } catch {
    return defaultAiConfig();
  }
}

export async function saveAiConfig(config: AiConfig): Promise<void> {
  await idbSet(IDB_KEY, AiConfigSchema.parse(config));
}

export async function clearAiConfig(): Promise<void> {
  await idbDel(IDB_KEY);
}

// ── Selectores derivados (D9 / design §4) ──────────────────────────────────

export function activeProviderId(c: AiConfig): ProviderId {
  return isProviderId(c.activeProvider) ? c.activeProvider : "gemini";
}

export function activeKey(c: AiConfig): string {
  const id = activeProviderId(c);
  return c.providers[id]?.apiKey ?? "";
}

export function activeBaseUrl(c: AiConfig): string | undefined {
  const id = activeProviderId(c);
  const url = c.providers[id]?.baseUrl?.trim();
  return url || undefined;
}

export function geminiKey(c: AiConfig): string {
  return c.providers.gemini?.apiKey ?? "";
}

export function hasKey(c: AiConfig, id: ProviderId): boolean {
  return Boolean(c.providers[id]?.apiKey?.trim());
}

export function providerConfig(c: AiConfig, id: ProviderId): AiProviderConfig {
  return c.providers[id] ?? { apiKey: "" };
}

/** Default model for a provider when switching active provider. */
export function defaultModelForProvider(id: ProviderId): string {
  const models = getModelsByProvider(id).filter((m) => m.category !== "embedding");
  return models[0]?.id ?? "";
}

export function defaultFallbackGroupForProvider(id: ProviderId): string {
  if (id === "gemini") return "gemini:flash";
  return `${id}:general`;
}
