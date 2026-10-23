import { describe, expect, it } from "vitest";
import { filterArticles, paginate } from "./listing";
import type { BlogArticleMeta } from "../types";

const make = (title: string, excerpt = "", categoryLabel = "Procesos") =>
  ({ title, excerpt, categoryLabel }) as BlogArticleMeta;

describe("filterArticles", () => {
  const articles = [
    make("Tablero Kanban", "Cómo organizarlo"),
    make("Automatización sin nube", "Flujos locales", "Automatización"),
  ];

  it("devuelve todo con búsqueda vacía", () => {
    expect(filterArticles(articles, "  ")).toHaveLength(2);
  });

  it("ignora mayúsculas y acentos", () => {
    expect(filterArticles(articles, "AUTOMATIZACION")).toHaveLength(1);
    expect(filterArticles(articles, "como")).toHaveLength(1);
  });

  it("exige todas las palabras", () => {
    expect(filterArticles(articles, "kanban nube")).toHaveLength(0);
    expect(filterArticles(articles, "kanban tablero")).toHaveLength(1);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 25 }, (_, i) => i);

  it("corta por página", () => {
    expect(paginate(items, 1, 12).items).toHaveLength(12);
    expect(paginate(items, 3, 12).items).toEqual([24]);
  });

  it("acota páginas fuera de rango o inválidas", () => {
    expect(paginate(items, 99, 12).page).toBe(3);
    expect(paginate(items, 0, 12).page).toBe(1);
    expect(paginate(items, NaN, 12).page).toBe(1);
  });

  it("lista vacía tiene una página", () => {
    expect(paginate([], 1).totalPages).toBe(1);
  });
});
