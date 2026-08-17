import type { BlogCategory } from "../types";

export type BlogCategoryMeta = {
  label: string;
  description: string;
  /**
   * Matiz HSL (0–360) que firma visualmente la categoría — spec 059.
   *
   * Se inyecta como custom property `--cat-h` en el `<article>` y de ahí lo
   * heredan el degradado del header, las viñetas del cuerpo y la TOC. NO se usa
   * para construir clases de Tailwind: el build purga cualquier nombre armado
   * por interpolación (`bg-${cat}-500` no existe nunca), así que el color
   * variable tiene que viajar por CSS, no por className.
   *
   * Regla de contraste: el hue solo aparece en fondos con alfa ≤ 0.16 y en
   * marcas decorativas. El texto siempre usa `foreground`/`muted-foreground`,
   * así que ningún hue puede romper AA.
   */
  hue: number;
};

export const BLOG_CATEGORIES: Record<BlogCategory, BlogCategoryMeta> = {
  privacidad: {
    label: "Privacidad",
    description: "Control de datos, local-first y soberanía digital.",
    hue: 224,
  },
  procesos: {
    label: "Procesos",
    description: "Documentación, SOPs y checklists que se usan.",
    hue: 38,
  },
  automatizacion: {
    label: "Automatización",
    description: "Reglas, flujos y productividad sin fricción.",
    hue: 268,
  },
  "inteligencia-artificial": {
    label: "Inteligencia artificial",
    description: "IA útil sin sacrificar la privacidad.",
    hue: 292,
  },
  productividad: {
    label: "Productividad",
    description: "Formas de trabajar mejor con menos herramientas.",
    hue: 158,
  },
  pensamiento: {
    label: "Pensamiento",
    description: "Ideas, principios y reflexiones sobre cómo trabajamos.",
    hue: 12,
  },
  comparativas: {
    label: "Comparativas",
    description: "Hito frente a otras herramientas, con honestidad.",
    hue: 186,
  },
  implementacion: {
    label: "Implementación",
    description: "Guías paso a paso para adoptar y migrar a Hito.",
    hue: 205,
  },
  "gestion-proyectos": {
    label: "Gestión de proyectos",
    description: "Fundamentos, metodologías y práctica real.",
    hue: 248,
  },
  plantillas: {
    label: "Plantillas",
    description: "Formatos listos para copiar y adaptar.",
    hue: 80,
  },
};

/** Hue de respaldo para páginas que usan `SeoArticle` sin categoría de blog. */
export const DEFAULT_CATEGORY_HUE = 224;

export function getCategoryHue(category?: BlogCategory): number {
  return category ? BLOG_CATEGORIES[category].hue : DEFAULT_CATEGORY_HUE;
}

export const BLOG_CATEGORY_SLUGS = Object.keys(BLOG_CATEGORIES) as BlogCategory[];
