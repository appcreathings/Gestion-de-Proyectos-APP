import { describe, expect, it } from "vitest";
import {
  customModelDef,
  getModelsByProvider,
  isModelAvailable,
  isQualifiedModelId,
  MODEL_REGISTRY,
  qualify,
  splitQualified,
} from "./models";

describe("isQualifiedModelId", () => {
  it("acepta proveedor válido + modelo no vacío", () => {
    expect(isQualifiedModelId("nvidia:meta/llama-3.1")).toBe(true);
    expect(isQualifiedModelId("gemini:gemini-2.5-flash")).toBe(true);
  });

  it("rechaza modelo vacío tras el separador", () => {
    expect(isQualifiedModelId("nvidia:")).toBe(false);
  });

  it("rechaza ids sin prefijo de proveedor", () => {
    expect(isQualifiedModelId("gemini-2.5-flash")).toBe(false);
  });

  it("rechaza proveedor desconocido", () => {
    expect(isQualifiedModelId("noexiste:x")).toBe(false);
  });

  it("rechaza string vacío", () => {
    expect(isQualifiedModelId("")).toBe(false);
  });
});

describe("ids calificados", () => {
  it("qualify / splitQualified round-trip", () => {
    const id = qualify("openai", "gpt-5.4-mini");
    expect(id).toBe("openai:gpt-5.4-mini");
    expect(splitQualified(id)).toEqual({ provider: "openai", modelId: "gpt-5.4-mini" });
  });

  it("splitQualified asume gemini para ids sin prefijo (compat)", () => {
    expect(splitQualified("gemini-2.5-flash")).toEqual({
      provider: "gemini",
      modelId: "gemini-2.5-flash",
    });
  });

  it("isModelAvailable respeta limitsUnknown", () => {
    const openai = MODEL_REGISTRY.find((m) => m.id === "openai:gpt-5.4")!;
    expect(openai.limitsUnknown).toBe(true);
    expect(isModelAvailable(openai)).toBe(true);

    const pro = MODEL_REGISTRY.find((m) => m.id === "gemini:gemini-2.5-pro")!;
    expect(pro.limitsUnknown).toBeUndefined();
    expect(isModelAvailable(pro)).toBe(false);
  });

  it("getModelsByProvider filtra correctamente", () => {
    const gemini = getModelsByProvider("gemini");
    expect(gemini.every((m) => m.provider === "gemini")).toBe(true);
    expect(gemini.some((m) => m.modelId === "gemini-2.5-flash")).toBe(true);

    const openai = getModelsByProvider("openai");
    expect(openai.map((m) => m.modelId)).toEqual(["gpt-5.4", "gpt-5.4-mini", "gpt-5.4-nano"]);

    const zai = getModelsByProvider("zai");
    expect(zai.map((m) => m.modelId)).toEqual(["glm-5.2", "glm-4.7-flash", "glm-4.5-air"]);

    expect(getModelsByProvider("nvidia")).toEqual([]);
    expect(getModelsByProvider("opencode-zen")).toEqual([]);
  });

  it("customModelDef produce id calificado con limitsUnknown", () => {
    const def = customModelDef("nvidia", "meta/llama-3.1-8b-instruct");
    expect(def.id).toBe("nvidia:meta/llama-3.1-8b-instruct");
    expect(def.limitsUnknown).toBe(true);
    expect(isModelAvailable(def)).toBe(true);
  });

  it("todos los modelos de gemini tienen ids y grupos calificados", () => {
    for (const m of getModelsByProvider("gemini")) {
      expect(m.id.startsWith("gemini:")).toBe(true);
      expect(m.fallbackGroup.startsWith("gemini:")).toBe(true);
    }
  });
});
