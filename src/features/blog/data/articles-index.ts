import type { BlogArticleMeta, BlogCategory } from "../types";

/**
 * Fuente de verdad de la LISTA del blog: metadata sin cuerpo JSX.
 * Módulo ligero — no importa el contenido de ningún artículo.
 */
export const BLOG_ARTICLES_META: BlogArticleMeta[] = [
  {
    slug: "gestion-proyectos-sin-nube",
    title: "Gestión de proyectos sin nube: por qué la soberanía de datos es una ventaja",
    excerpt:
      "Descubre por qué cada vez más equipos eligen un gestor de proyectos sin nube. Control total, privacidad real y datos que siempre puedes migrar.",
    category: "privacidad",
    categoryLabel: "Privacidad",
    publishedAt: "2026-07-05",
    readingTime: "7 min",
    featured: true,
    seo: {
      title: "Gestión de proyectos sin nube: soberanía de datos como ventaja — Hito",
      description:
        "¿Por qué usar un gestor de proyectos sin nube? Ventajas de local-first: privacidad, control total, sin suscripciones y datos siempre migrables.",
      ogImageAlt: "Gestión de proyectos local-first sin nube.",
    },
  },
  {
    slug: "como-documentar-procesos-equipos",
    title: "Cómo documentar procesos en equipos pequeños: guía de SOPs y checklists",
    excerpt:
      "Aprendé a escribir SOPs y checklists que tu equipo realmente use. Sin wikis abandonados ni manuales que nadie lee.",
    category: "procesos",
    categoryLabel: "Procesos",
    publishedAt: "2026-07-05",
    readingTime: "7 min",
    featured: false,
    seo: {
      title: "Cómo documentar procesos en equipos: guía de SOPs y checklists — Hito",
      description:
        "Guía práctica para documentar procesos en equipos pequeños. Cómo crear SOPs útiles, checklists reutilizables y mantener la documentación viva.",
      ogImageAlt: "Documentación de procesos con SOPs y checklists.",
    },
  },
  {
    slug: "asistente-ia-proyectos-sin-datos",
    title: "Asistente de IA para proyectos: cómo usarlo sin entrenar modelos con tus datos",
    excerpt:
      "La IA puede acelerar la gestión de proyectos, pero no debería costar tu confidencialidad. Cómo usar un asistente de IA sin entregar tus datos.",
    category: "inteligencia-artificial",
    categoryLabel: "Inteligencia artificial",
    publishedAt: "2026-07-05",
    readingTime: "7 min",
    featured: true,
    seo: {
      title: "Asistente de IA para proyectos sin sacrificar privacidad — Hito",
      description:
        "Cómo usar un asistente de IA para proyectos manteniendo tus datos locales. Guía para usar IA privada sin entrenar modelos con tu información.",
      ogImageAlt: "Asistente de IA privado para gestión de proyectos.",
    },
  },
  {
    slug: "organizar-proyectos-tareas-jerarquia",
    title: "Cómo organizar proyectos y tareas: una jerarquía simple para equipos",
    excerpt:
      "No necesitas más apps: necesitas una estructura clara. Descubre una jerarquía práctica para organizar proyectos, áreas, procesos y tareas.",
    category: "productividad",
    categoryLabel: "Productividad",
    publishedAt: "2026-07-05",
    readingTime: "7 min",
    featured: false,
    seo: {
      title: "Cómo organizar proyectos y tareas: jerarquía práctica — Hito",
      description:
        "Aprendé a organizar proyectos y tareas con una jerarquía clara. Producto, proyecto, área, proceso y tarea: cómo estructurar el trabajo de tu equipo.",
      ogImageAlt: "Jerarquía para organizar proyectos y tareas.",
    },
  },
  {
    slug: "automatizar-tareas-sin-nube",
    title: "Cómo automatizar tareas sin nube: reglas locales para tu equipo",
    excerpt:
      "Las automatizaciones no tienen por qué depender de servicios externos. Aprendé a crear reglas locales trigger→condición→acción que funcionan offline.",
    category: "automatizacion",
    categoryLabel: "Automatización",
    publishedAt: "2026-07-05",
    readingTime: "7 min",
    featured: false,
    seo: {
      title: "Cómo automatizar tareas sin nube: reglas locales — Hito",
      description:
        "Guía para automatizar tareas sin depender de la nube. Cómo crear reglas trigger-condición-acción locales, offline y bajo tu control.",
      ogImageAlt: "Automatización de tareas sin nube.",
    },
  },
  {
    slug: "que-es-un-hito-gestion-proyectos",
    title: "Qué es un hito en gestión de proyectos: definición y ejemplos prácticos",
    excerpt:
      "Un hito marca un punto de control clave en cualquier proyecto. Aprendé a definirlos, diferenciarlos de las tareas y usarlos para avanzar con claridad.",
    category: "productividad",
    categoryLabel: "Productividad",
    publishedAt: "2026-07-07",
    readingTime: "6 min",
    featured: false,
    seo: {
      title: "Qué es un hito en gestión de proyectos: guía práctica — Hito",
      description:
        "Un hito en gestión de proyectos marca un punto de control clave. Aprendé a definirlos, diferenciarlos de las tareas y usarlos para avanzar con claridad.",
      ogImageAlt: "Definición de hito en gestión de proyectos.",
    },
  },
  {
    slug: "hito-project-gestion-por-hitos",
    title: "Hito Project: cómo gestionar proyectos avanzando por hitos",
    excerpt:
      "Gestionar por hitos es avanzar con puntos de control claros. Conocé la filosofía del Hito Project: proyectos locales, hitos verificables y cero dependencia de la nube.",
    category: "productividad",
    categoryLabel: "Productividad",
    publishedAt: "2026-07-07",
    readingTime: "7 min",
    featured: true,
    seo: {
      title: "Hito Project: gestión de proyectos por hitos, sin nube — Hito",
      description:
        "Gestionar por hitos es avanzar con puntos de control claros. Conocé la filosofía del Hito Project: proyectos locales, hitos verificables y cero dependencia de la nube.",
      ogImageAlt: "Filosofía Hito Project: gestión por hitos.",
    },
  },
  {
    slug: "hito-vs-trello",
    title: "Hito vs Trello: cuál elegir en 2026",
    excerpt:
      "Comparativa honesta entre Hito y Trello: privacidad, IA, precio y casos de uso. Descubre cuál te conviene según tu situación y cómo migrar.",
    category: "comparativas",
    categoryLabel: "Comparativas",
    publishedAt: "2026-07-20",
    readingTime: "9 min",
    featured: false,
    seo: {
      title: "Hito vs Trello: cuál elegir en 2026 — Comparativa honesta",
      description:
        "Comparativa honesta entre Hito y Trello: privacidad, IA, precio y casos de uso. Descubre cuál te conviene según tu situación y cómo migrar.",
      ogImageAlt: "Comparativa Hito vs Trello en 2026.",
    },
  },
  {
    slug: "alternativas-a-notion",
    title: "Las 7 mejores alternativas a Notion en 2026",
    excerpt:
      "7 alternativas a Notion según privacidad, precio y funciones: Hito, Obsidian, Trello, ClickUp, Anytype, Capacities y AppFlowy. Comparativa honesta.",
    category: "comparativas",
    categoryLabel: "Comparativas",
    publishedAt: "2026-07-27",
    readingTime: "10 min",
    featured: false,
    seo: {
      title: "Las 7 mejores alternativas a Notion en 2026 — Comparativa honesta",
      description:
        "7 alternativas a Notion según privacidad, precio y funciones: Hito, Obsidian, Trello, ClickUp, Anytype, Capacities y AppFlowy. Comparativa honesta.",
      ogImageAlt: "Alternativas a Notion en 2026.",
    },
  },
  {
    slug: "migrar-trello-a-hito",
    title: "Cómo migrar de Trello a Hito (guía honesta, paso a paso)",
    excerpt:
      "Guía honesta para migrar de Trello a Hito: tabla de mapeo verificada, paso a paso y qué hacer con los datos sin equivalente directo. Sin promesas falsas.",
    category: "implementacion",
    categoryLabel: "Implementación",
    publishedAt: "2026-08-03",
    readingTime: "9 min",
    featured: false,
    seo: {
      title: "Cómo migrar de Trello a Hito (guía honesta, paso a paso) — Hito",
      description:
        "Guía honesta para migrar de Trello a Hito: tabla de mapeo verificada, paso a paso y qué hacer con los datos sin equivalente directo. Sin promesas falsas.",
      ogImageAlt: "Migración de Trello a Hito paso a paso.",
    },
  },
  {
    slug: "que-es-mcp",
    title: "Qué es MCP (Model Context Protocol): guía simple y honesta",
    excerpt:
      "MCP explicado sin hype: qué es, para qué sirve y en qué se diferencia de function calling y RAG. Con un ejemplo real.",
    category: "inteligencia-artificial",
    categoryLabel: "Inteligencia artificial",
    publishedAt: "2026-08-10",
    readingTime: "9 min",
    featured: false,
    seo: {
      title: "Qué es MCP (Model Context Protocol): la guía simple y honesta — Hito",
      description:
        "MCP explicado sin hype: qué es, para qué sirve y en qué se diferencia de function calling y RAG. Con un ejemplo real.",
      ogImageAlt: "Qué es MCP (Model Context Protocol).",
    },
  },
  {
    slug: "local-first-guia-definitiva-2026",
    title: "Local-first: la guía definitiva (2026)",
    excerpt:
      "Descubre qué es el software local-first, cómo se diferencia de la nube y qué herramientas puedes usar hoy. Guía honesta con ejemplos reales.",
    category: "privacidad",
    categoryLabel: "Privacidad",
    publishedAt: "2026-08-17",
    readingTime: "10 min",
    featured: false,
    seo: {
      title: "Local-first: qué es y cómo funciona en 2026 — Hito",
      description:
        "Descubre qué es el software local-first, cómo se diferencia de la nube y qué herramientas puedes usar hoy. Guía honesta con ejemplos reales.",
      ogImageAlt: "Guía definitiva de software local-first en 2026.",
    },
  },
  {
    slug: "versionar-proyectos-con-git",
    title: "Cómo versionar proyectos con Git",
    excerpt:
      "Aprende a poner tu gestor de proyectos bajo control de versiones con Git: historial real, diffs legibles y cero dependencia de un servidor ajeno.",
    category: "privacidad",
    categoryLabel: "Privacidad",
    publishedAt: "2026-08-24",
    readingTime: "8 min",
    featured: false,
    seo: {
      title: "Cómo versionar proyectos con Git: guía paso a paso — Hito",
      description:
        "Aprende a poner tu gestor de proyectos bajo control de versiones con Git: historial real, diffs legibles y cero dependencia de un servidor ajeno.",
      ogImageAlt: "Versionar proyectos con Git.",
    },
  },
  {
    slug: "hito-vs-clickup",
    title: "Hito vs ClickUp: comparativa honesta",
    excerpt:
      "ClickUp es más completo, pero no es gratis de verdad ni es local-first. Comparativa honesta de precio, IA y privacidad para elegir bien.",
    category: "comparativas",
    categoryLabel: "Comparativas",
    publishedAt: "2026-08-31",
    readingTime: "14 min",
    featured: false,
    seo: {
      title: "Hito vs ClickUp: comparativa honesta (2026) | Hito",
      description:
        "ClickUp es más completo, pero no es gratis de verdad ni es local-first. Comparativa honesta de precio, IA y privacidad para elegir bien.",
      ogImageAlt: "Comparativa honesta Hito vs ClickUp 2026.",
    },
  },
  {
    slug: "como-priorizar-tareas",
    title: "Cómo priorizar tareas: 4 métodos con ejemplos",
    excerpt:
      "4 métodos para priorizar tareas —Eisenhower, MoSCoW, RICE e Ivy Lee— con ejemplos y cómo aplicarlos hoy, en cualquier herramienta.",
    category: "productividad",
    categoryLabel: "Productividad",
    publishedAt: "2026-09-14",
    readingTime: "10 min",
    featured: false,
    seo: {
      title: "Cómo priorizar tareas: 4 métodos con ejemplos | Hito",
      description:
        "4 métodos para priorizar tareas —Eisenhower, MoSCoW, RICE e Ivy Lee— con ejemplos y cómo aplicarlos hoy, en cualquier herramienta.",
      ogImageAlt: "Cómo priorizar tareas con 4 métodos: Eisenhower, MoSCoW, RICE e Ivy Lee.",
    },
  },
  {
    slug: "prompts-gestion-proyectos-ia",
    title: "10 prompts de gestión de proyectos para usar con IA",
    excerpt:
      "10 prompts concretos para tu asistente de IA de gestión de proyectos: crear tareas, resumir salud de proyecto, buscar y más.",
    category: "inteligencia-artificial",
    categoryLabel: "Inteligencia artificial",
    publishedAt: "2026-09-21",
    readingTime: "8 min",
    featured: false,
    seo: {
      title: "10 prompts de gestión de proyectos para usar con IA | Hito",
      description:
        "10 prompts concretos para tu asistente de IA de gestión de proyectos: crear tareas, resumir salud de proyecto, buscar y más.",
      ogImageAlt: "10 prompts de gestión de proyectos para usar con inteligencia artificial.",
    },
  },
  {
    slug: "rag-local-explicado",
    title: "RAG local explicado sin jerga",
    excerpt:
      "Qué es RAG, qué lo hace 'local' y cómo lo implementa Hito de verdad: qué se indexa, dónde vive y qué viaja a un servidor externo.",
    category: "inteligencia-artificial",
    categoryLabel: "Inteligencia artificial",
    publishedAt: "2026-09-28",
    readingTime: "10 min",
    featured: false,
    seo: {
      title: "RAG local explicado sin jerga | Hito",
      description:
        "Qué es RAG, qué lo hace 'local' y cómo lo implementa Hito de verdad: qué se indexa, dónde vive y qué viaja a un servidor externo.",
      ogImageAlt: "RAG local explicado sin jerga: búsqueda semántica en tu dispositivo.",
    },
  },
  {
    slug: "hito-para-estudio-juridico",
    title: "Cómo configurar Hito para un estudio jurídico",
    excerpt:
      "Guía práctica para organizar expedientes, clientes y tareas de un estudio jurídico en Hito, sin nube ni cuentas externas.",
    category: "implementacion",
    categoryLabel: "Implementación",
    publishedAt: "2026-10-05",
    readingTime: "11 min",
    featured: false,
    seo: {
      title: "Cómo configurar Hito para un estudio jurídico | Hito",
      description:
        "Guía práctica para organizar expedientes, clientes y tareas de un estudio jurídico en Hito, sin nube ni cuentas externas.",
      ogImageAlt:
        "Configurar Hito para un estudio jurídico: expedientes, clientes y colaboración.",
    },
  },
];

export const BLOG_SLUGS = BLOG_ARTICLES_META.map((a) => a.slug);

export function getArticleMeta(slug: string): BlogArticleMeta | undefined {
  return BLOG_ARTICLES_META.find((a) => a.slug === slug);
}

export function getFeaturedArticles(): BlogArticleMeta[] {
  return BLOG_ARTICLES_META.filter((a) => a.featured);
}

export function getRecentArticles(limit?: number): BlogArticleMeta[] {
  const sorted = [...BLOG_ARTICLES_META].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getRelatedMeta(
  currentSlug: string,
  category: BlogCategory,
  limit = 2,
): BlogArticleMeta[] {
  return BLOG_ARTICLES_META.filter(
    (a) => a.slug !== currentSlug && a.category === category,
  ).slice(0, limit);
}
