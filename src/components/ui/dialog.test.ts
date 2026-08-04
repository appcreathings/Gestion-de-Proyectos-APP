import { describe, it, expect } from "vitest";
import { DIALOG_SIZE, type DialogSize } from "@/components/ui/dialog";

describe("DIALOG_SIZE", () => {
  const cases: Array<{
    size: DialogSize;
    /** Fragmentos de clase que deben aparecer para este tamaño. */
    contains: string[];
  }> = [
    { size: "sm", contains: ["h-auto", "max-h-[70vh]", "sm:max-w-md"] },
    {
      size: "md",
      contains: ["sm:min-h-[68vh]", "sm:max-h-[88vh]", "md:max-w-5xl"],
    },
    {
      size: "lg",
      contains: ["sm:min-h-[72vh]", "sm:max-h-[90vh]", "md:max-w-6xl"],
    },
    {
      size: "xl",
      contains: ["sm:min-h-[68vh]", "sm:max-h-[88vh]", "md:max-w-5xl"],
    },
    {
      size: "full",
      contains: ["sm:h-[99vh]", "md:h-[99vh]", "lg:h-[99vh]", "md:max-w-[min(96rem,calc(100vw-1rem))]"],
    },
  ];

  it.each(cases)("size $size contiene las clases esperadas", ({ size, contains }) => {
    const cls = DIALOG_SIZE[size];
    for (const fragment of contains) {
      expect(cls).toContain(fragment);
    }
  });

  it("todos los tamaños usan max-h o h (nunca quedan sin tope de altura)", () => {
    for (const size of Object.keys(DIALOG_SIZE) as DialogSize[]) {
      const cls = DIALOG_SIZE[size];
      // sm usa max-h sin prefijo; el resto suele usar sm:max-h / sm:h / sm:min-h+max-h.
      const hasHeightCap = /(^|\s)(sm:)?(max-h-|min-h-|h-)/.test(cls);
      expect(hasHeightCap, `size ${size} no define tope de altura`).toBe(true);
    }
  });

  it("'full' reproduce el comportamiento anterior (h fija, no max-h)", () => {
    // full es el único que usa altura fija (h-[99vh]) en vez de max-h, a propósito.
    expect(DIALOG_SIZE.full).toMatch(/sm:h-\[99vh\]/);
    expect(DIALOG_SIZE.full).not.toMatch(/sm:max-h/);
  });
});
