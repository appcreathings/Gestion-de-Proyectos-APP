import { describe, expect, it, beforeEach } from "vitest";
import { ModelSelector } from "./modelSelector";
import { RateLimiter } from "./rateLimiter";

describe("ModelSelector", () => {
  let limiter: RateLimiter;
  let selector: ModelSelector;

  beforeEach(() => {
    limiter = new RateLimiter();
    selector = new ModelSelector(limiter);
  });

  it("selecciona el modelo preferido cuando tiene cuota", () => {
    const result = selector.select("gemini:gemini-2.5-flash");
    expect(result.modelId).toBe("gemini:gemini-2.5-flash");
    expect(result.switched).toBe(false);
    expect(result.reason).toBe("preferred");
  });

  it("hace fallback al siguiente cuando el preferido está saturado", () => {
    limiter.markSaturated("gemini:gemini-2.5-flash", 60);
    const result = selector.select("gemini:gemini-2.5-flash");
    expect(result.modelId).not.toBe("gemini:gemini-2.5-flash");
    expect(result.switched).toBe(true);
    expect(result.reason).toBe("fallback");
    expect(result.fallbackEvent).toBeDefined();
    expect(result.fallbackEvent!.from).toBe("gemini:gemini-2.5-flash");
  });

  it("devuelve none-available cuando todos en el grupo están saturados", () => {
    limiter.markSaturated("gemini:gemini-2.5-flash", 60);
    limiter.markSaturated("gemini:gemini-2.5-flash-lite", 60);
    limiter.markSaturated("gemini:gemini-3-flash", 60);
    limiter.markSaturated("gemini:gemini-3.5-flash", 60);

    const result = selector.select("gemini:gemini-2.5-flash");
    expect(result.modelId).toBeNull();
    expect(result.reason).toBe("none-available");
  });

  it("selecciona el de menor prioridad disponible en la cadena", () => {
    limiter.markSaturated("gemini:gemini-2.5-flash", 60);
    limiter.markSaturated("gemini:gemini-2.5-flash-lite", 60);
    // gemini-3-flash está disponible (priority 3)
    const result = selector.select("gemini:gemini-2.5-flash");
    expect(result.modelId).toBe("gemini:gemini-3-flash");
    expect(result.switched).toBe(true);
  });

  it("usa el grupo override cuando se especifica", () => {
    const result = selector.select("gemini:gemini-2.5-flash", "gemini:flash-extended");
    expect(result.modelId).toMatch(/gemini:gemini-3\.1-flash-lite|gemini:gemma-4/);
  });

  it("respeta excludeIds para saltar modelos ya probados en un bucle de fallback", () => {
    // Simula el `tried` acumulativo del nuevo bucle de agent.ts (spec 031).
    const tried = new Set<string>(["gemini:gemini-2.5-flash", "gemini:gemini-2.5-flash-lite"]);
    const result = selector.select("gemini:gemini-2.5-flash", undefined, tried);
    expect(result.modelId).not.toBe("gemini:gemini-2.5-flash");
    expect(result.modelId).not.toBe("gemini:gemini-2.5-flash-lite");
    expect(result.switched).toBe(true);
  });

  it("devuelve none-available cuando excludeIds cubre todo el grupo", () => {
    const tried = new Set<string>([
      "gemini:gemini-2.5-flash",
      "gemini:gemini-2.5-flash-lite",
      "gemini:gemini-3-flash",
      "gemini:gemini-3.5-flash",
    ]);
    const result = selector.select("gemini:gemini-2.5-flash", undefined, tried);
    expect(result.modelId).toBeNull();
    expect(result.reason).toBe("none-available");
  });

  it("dispara onFallback cuando hay switch", () => {
    const events: { from: string; to: string; reason: string }[] = [];
    selector.onFallback = (ev) => events.push(ev);

    limiter.markSaturated("gemini:gemini-2.5-flash", 60);
    selector.select("gemini:gemini-2.5-flash");

    expect(events).toHaveLength(1);
    expect(events[0].from).toBe("gemini:gemini-2.5-flash");
    expect(events[0].to).toBe("gemini:gemini-2.5-flash-lite");
    expect(events[0].reason).toBe("saturated");
  });

  // Spec 049 — modelos ad-hoc (nvidia / opencode-zen escritos a mano)
  it("id ad-hoc calificado válido → preferred (sin estar en el registry)", () => {
    const result = selector.select("nvidia:meta/llama-3.1-8b-instruct");
    expect(result.modelId).toBe("nvidia:meta/llama-3.1-8b-instruct");
    expect(result.switched).toBe(false);
    expect(result.reason).toBe("preferred");
  });

  it("id ad-hoc en excludeIds → none-available", () => {
    const tried = new Set<string>(["nvidia:meta/llama-3.1-8b-instruct"]);
    const result = selector.select("nvidia:meta/llama-3.1-8b-instruct", undefined, tried);
    expect(result.modelId).toBeNull();
    expect(result.reason).toBe("none-available");
  });

  it("id ad-hoc saturado → none-available (no inventa fallback)", () => {
    limiter.markSaturated("nvidia:meta/llama-3.1-8b-instruct", 60);
    const result = selector.select("nvidia:meta/llama-3.1-8b-instruct");
    expect(result.modelId).toBeNull();
    expect(result.reason).toBe("none-available");
  });
});
