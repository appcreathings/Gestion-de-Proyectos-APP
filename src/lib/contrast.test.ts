import { describe, expect, it } from "vitest";

/** Contraste AA de los tokens semánticos (spec 065 HU-04).
 *
 * Los valores están declarados aquí A PROPÓSITO, duplicados de `src/index.css`
 * (`:root` y `.dark`): el test es el contrato verificable; el CSS es el que
 * pinta. Si editás `index.css`, actualizá esta tabla — y al revés. El paso F2
 * de `tasks.md` incluye compararlas una vez a ojo; no merece un parser de CSS.
 *
 * El umbral es 4.5:1 (WCAG 2.1 AA, texto normal). Si un par no llega, se
 * ajusta la luminosidad del token en `index.css` — nunca este número.
 */

/** HSL "H S% L%" → [r, g, b] (0–255). */
function hslToRgb(hsl: string): [number, number, number] {
  const [h, sPct, lPct] = hsl.replace(/%/g, "").split(" ").map(Number);
  const s = sPct / 100;
  const l = lPct / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((v) => Math.round(v * 255)) as [
    number,
    number,
    number,
  ];
}

/** Luminancia relativa WCAG 2.1 de un color sRGB. */
function luminance(rgb: [number, number, number]): number {
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = rgb.map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Ratio de contraste WCAG 2.1 entre dos colores HSL declarados "H S% L%". */
export function ratio(hslA: string, hslB: string): number {
  const la = luminance(hslToRgb(hslA));
  const lb = luminance(hslToRgb(hslB));
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** [nombre, fondo, texto] — 10 pares soft (D2) + 6 sólidos ajustados (D3). */
const PAIRS: [name: string, bg: string, fg: string][] = [
  // Soft, tema claro (:root)
  ["destructive-soft claro", "356 100% 95%", "336 74% 30%"],
  ["warning-soft claro", "48 96% 89%", "28 78% 26%"],
  ["success-soft claro", "149 80% 90%", "164 86% 16%"],
  ["info-soft claro", "214 95% 93%", "224 64% 33%"],
  ["primary-soft claro", "214 32% 91%", "222 47% 25%"],
  // Soft, tema oscuro (.dark)
  ["destructive-soft oscuro", "342 88% 16%", "356 100% 95%"],
  ["warning-soft oscuro", "28 74% 12%", "48 96% 89%"],
  ["success-soft oscuro", "166 91% 9%", "149 80% 90%"],
  ["info-soft oscuro", "226 57% 21%", "214 95% 93%"],
  ["primary-soft oscuro", "222 40% 20%", "210 40% 92%"],
  // Sólidos desaturados (D3), ambos temas
  ["destructive claro", "0 60% 52%", "210 40% 98%"],
  ["destructive oscuro", "0 52% 47%", "210 40% 98%"],
  ["warning claro", "38 78% 47%", "222 47% 11%"],
  ["warning oscuro", "38 78% 52%", "222 47% 11%"],
  ["success claro", "142 58% 32%", "210 40% 98%"],
  ["success oscuro", "142 52% 32%", "210 40% 98%"],
];

describe.each(PAIRS)("contraste AA %s", (name, bg, fg) => {
  it(`${name} ≥ 4.5:1`, () => {
    expect(ratio(bg, fg)).toBeGreaterThanOrEqual(4.5);
  });
});
