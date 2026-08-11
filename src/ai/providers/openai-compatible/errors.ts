import type { AiErrorKind } from "@/ai/gemini/errors";

export class HttpError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(`HTTP ${status}: ${body.slice(0, 200)}`);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

export function classifyOpenAiError(e: unknown): AiErrorKind {
  if (e instanceof DOMException && e.name === "AbortError") return "aborted";
  if (e instanceof Error && e.name === "AbortError") return "aborted";

  if (e instanceof HttpError) {
    if (e.status === 401 || e.status === 403) return "invalid-key";
    if (e.status === 400 && /api key|token|auth|unauthorized/i.test(e.body)) {
      return "invalid-key";
    }
    if (e.status === 429) {
      return /token|quota|daily/i.test(e.body) ? "quota-exhausted" : "rate-limit";
    }
    if (e.status >= 500) return "unknown";
  }

  // fetch bloqueado: TypeError sin status. Offline REAL solo si el navegador lo dice.
  if (e instanceof TypeError) {
    return typeof navigator !== "undefined" && navigator.onLine === false
      ? "offline"
      : "cors-blocked";
  }

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return "offline";
  }

  return "unknown";
}
