import { describe, expect, it } from "vitest";
import { shouldSkipRag } from "./skipRag";

describe("shouldSkipRag", () => {
  it("retorna true si el flag explícito está activo (chip/slash)", () => {
    expect(shouldSkipRag("cualquier texto largo de usuario", true)).toBe(true);
  });

  it("retorna true para continuaciones cortas conocidas", () => {
    for (const t of ["continúa", "continua", "sí", "si", "ok", "dale", "proseguí", "sigue"]) {
      expect(shouldSkipRag(t)).toBe(true);
    }
  });

  it("normaliza trim + minúsculas antes de comparar", () => {
    expect(shouldSkipRag("  Continúa  ")).toBe(true);
    expect(shouldSkipRag("OK")).toBe(true);
  });

  it("retorna true si el texto empieza con / (slash crudo defensivo)", () => {
    expect(shouldSkipRag("/resumen")).toBe(true);
  });

  it("retorna false para texto libre largo (CA-06.5)", () => {
    expect(shouldSkipRag("¿Qué tareas están bloqueadas en el proyecto?")).toBe(false);
    expect(shouldSkipRag("resumí el estado general del portafolio")).toBe(false);
  });

  it("no salta por prefijo suelto: 'siguiente paso' no es continuación corta", () => {
    expect(shouldSkipRag("siguiente paso")).toBe(false);
  });

  it("vacío no salta RAG (no es un turno real)", () => {
    expect(shouldSkipRag("   ")).toBe(false);
  });
});
