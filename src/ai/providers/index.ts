import type { ProviderId, AiProvider } from "./types";
import { getProviderDef } from "./catalog";

/**
 * Lazy provider factory. Adapters load via `import()` so the initial bundle
 * stays light for users who never configure the assistant (D13).
 */
export async function getProvider(id: ProviderId): Promise<AiProvider> {
  const def = getProviderDef(id);
  if (def.kind === "gemini") {
    const { geminiProvider } = await import("./gemini");
    return geminiProvider;
  }
  const { createOpenAiCompatibleProvider } = await import("./openai-compatible");
  return createOpenAiCompatibleProvider(def);
}

export type { ProviderId, AiProvider, AiMessage, AiToolCall } from "./types";
export { PROVIDER_CATALOG, getProviderDef, isProviderId } from "./catalog";
