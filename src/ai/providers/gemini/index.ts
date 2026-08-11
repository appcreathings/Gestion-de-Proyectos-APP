import { createClient, validateApiKey } from "@/ai/gemini/client";
import { classifyAiError } from "@/ai/gemini/errors";
import type { AiProvider } from "../types";
import { geminiStreamTurn } from "./streamTurn";

export { toGeminiContents, fromGeminiContents, looksLikeGeminiHistory, looksLikeNeutralHistory } from "./mapping";
export { geminiStreamTurn } from "./streamTurn";

export const geminiProvider: AiProvider = {
  id: "gemini",

  validateKey(apiKey: string) {
    return validateApiKey(apiKey);
  },

  streamTurn(opts) {
    return geminiStreamTurn(opts);
  },

  classifyError(e: unknown) {
    return classifyAiError(e);
  },

  async embed(text: string, apiKey: string, model: string): Promise<number[]> {
    const ai = await createClient(apiKey);
    const response = await ai.models.embedContent({
      model: model.startsWith("models/") ? model : `models/${model}`,
      contents: [text],
    });
    const embedding = response.embeddings?.[0]?.values;
    if (!embedding) throw new Error("No embedding returned");
    return embedding;
  },
};
