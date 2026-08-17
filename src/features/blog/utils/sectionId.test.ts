import { describe, expect, it } from "vitest";
import { buildSectionIds } from "./sectionId";

describe("buildSectionIds", () => {
  it("deriva un slug por heading", () => {
    expect(buildSectionIds(["Qué es el límite WIP", "Cómo definirlo"])).toEqual([
      "que-es-el-limite-wip",
      "como-definirlo",
    ]);
  });

  it("desambigua headings que colapsan al mismo slug", () => {
    // Un id duplicado rompe el salto por ancla y es HTML inválido.
    expect(buildSectionIds(["Ejemplos", "Ejemplos", "Ejémplos"])).toEqual([
      "ejemplos",
      "ejemplos-2",
      "ejemplos-3",
    ]);
  });

  it("no arrastra el contador entre slugs distintos", () => {
    expect(buildSectionIds(["Uno", "Dos", "Uno", "Dos"])).toEqual([
      "uno",
      "dos",
      "uno-2",
      "dos-2",
    ]);
  });

  it("da un id utilizable a headings sin caracteres alfanuméricos", () => {
    expect(buildSectionIds(["", "¿?", "—"])).toEqual([
      "seccion",
      "seccion-2",
      "seccion-3",
    ]);
  });

  it("devuelve una lista vacía sin secciones", () => {
    expect(buildSectionIds([])).toEqual([]);
  });
});
