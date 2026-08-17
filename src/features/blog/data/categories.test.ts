import { describe, expect, it } from "vitest";
import {
  BLOG_CATEGORIES,
  BLOG_CATEGORY_SLUGS,
  DEFAULT_CATEGORY_HUE,
  getCategoryHue,
} from "./categories";

describe("BLOG_CATEGORIES", () => {
  it("declara un hue válido en cada categoría", () => {
    for (const slug of BLOG_CATEGORY_SLUGS) {
      const { hue } = BLOG_CATEGORIES[slug];
      expect(Number.isFinite(hue), `${slug} sin hue numérico`).toBe(true);
      expect(hue, `${slug} fuera de rango`).toBeGreaterThanOrEqual(0);
      expect(hue, `${slug} fuera de rango`).toBeLessThan(360);
    }
  });

  it("separa los hues lo suficiente para distinguirlos en fondos de baja saturación", () => {
    // A ≤16% de alfa, dos hues muy cercanos se ven idénticos y la firma por
    // categoría deja de orientar al lector.
    const hues = BLOG_CATEGORY_SLUGS.map((slug) => ({
      slug,
      hue: BLOG_CATEGORIES[slug].hue,
    })).sort((a, b) => a.hue - b.hue);

    for (let i = 1; i < hues.length; i += 1) {
      const gap = hues[i].hue - hues[i - 1].hue;
      expect(gap, `${hues[i - 1].slug} y ${hues[i].slug} están a ${gap}°`).toBeGreaterThanOrEqual(15);
    }

    // La rueda es circular: el último y el primero también son vecinos.
    const wrap = 360 - hues[hues.length - 1].hue + hues[0].hue;
    expect(wrap).toBeGreaterThanOrEqual(15);
  });

  it("resuelve el hue de una categoría y cae al de respaldo sin ella", () => {
    expect(getCategoryHue("privacidad")).toBe(BLOG_CATEGORIES.privacidad.hue);
    expect(getCategoryHue(undefined)).toBe(DEFAULT_CATEGORY_HUE);
  });
});
