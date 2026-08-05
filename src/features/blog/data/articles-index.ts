import type { BlogArticleMeta, BlogCategory } from "../types";

/**
 * Fuente de verdad de la LISTA del blog: metadata sin cuerpo JSX.
 * Módulo ligero — no importa el contenido de ningún artículo.
 *
 * `author` es opcional por artículo: la mayoría no lo declara y
 * `BLOG_ARTICLES_META` lo completa con `DEFAULT_AUTHOR` abajo.
 */
export const DEFAULT_AUTHOR = { name: "Equipo Hito", role: "Producto" };

const RAW_ARTICLES: BlogArticleMeta[] = [
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
    pillar: "gestion-de-proyectos-guia-completa",
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
    pillar: "gestion-de-proyectos-guia-completa",
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
    pillar: "gestion-de-proyectos-guia-completa",
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
    pillar: "gestion-de-proyectos-guia-completa",
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
  // --- Cluster "Gestión de proyectos" (spec 040) — primeros 6 de un roadmap de 32,
  // ver ROADMAP_BLOG.md. Pilar + 5 satélites; el resto del cluster cuelga de aquí
  // a medida que se publica.
  {
    slug: "gestion-de-proyectos-guia-completa",
    title: "Gestión de proyectos: la guía completa y práctica",
    excerpt:
      "Qué es la gestión de proyectos, sus fases, roles y métodos — explicado sin jerga, con ejemplos que podés aplicar hoy mismo, uses la herramienta que uses.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2026-10-12",
    readingTime: "12 min",
    featured: true,
    related: [
      "fases-de-un-proyecto",
      "como-estimar-tiempos-proyecto",
      "matriz-raci",
      "alcance-de-proyecto-scope-creep",
      "scrum-vs-kanban",
    ],
    seo: {
      title: "Gestión de proyectos: la guía completa y práctica | Hito",
      description:
        "Qué es la gestión de proyectos, sus fases, roles y métodos explicados sin jerga, con ejemplos aplicables hoy mismo con cualquier herramienta.",
      ogImageAlt: "Guía completa de gestión de proyectos: fases, roles y métodos.",
    },
  },
  {
    slug: "fases-de-un-proyecto",
    title: "Las 5 fases de un proyecto, con ejemplos",
    excerpt:
      "Inicio, planificación, ejecución, seguimiento y cierre: las 5 fases de cualquier proyecto explicadas con un ejemplo real, sin depender de una metodología específica.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2026-10-19",
    readingTime: "9 min",
    featured: false,
    pillar: "gestion-de-proyectos-guia-completa",
    related: ["como-estimar-tiempos-proyecto", "alcance-de-proyecto-scope-creep"],
    seo: {
      title: "Las 5 fases de un proyecto, con ejemplos | Hito",
      description:
        "Inicio, planificación, ejecución, seguimiento y cierre: las 5 fases de cualquier proyecto explicadas con un ejemplo real.",
      ogImageAlt: "Las 5 fases de un proyecto explicadas con ejemplos.",
    },
  },
  {
    slug: "como-estimar-tiempos-proyecto",
    title: "Cómo estimar tiempos de un proyecto sin fallar siempre",
    excerpt:
      "3 técnicas de estimación —por analogía, PERT y Planning Poker— y por qué casi siempre subestimamos. Con ejemplos para tu próximo proyecto.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2026-10-26",
    readingTime: "9 min",
    featured: false,
    pillar: "gestion-de-proyectos-guia-completa",
    related: ["fases-de-un-proyecto", "matriz-raci"],
    seo: {
      title: "Cómo estimar tiempos de un proyecto sin fallar siempre | Hito",
      description:
        "3 técnicas de estimación de tiempos —analogía, PERT y Planning Poker— y por qué casi siempre subestimamos. Con ejemplos prácticos.",
      ogImageAlt: "Cómo estimar tiempos de un proyecto: 3 técnicas con ejemplos.",
    },
  },
  {
    slug: "matriz-raci",
    title: "Matriz RACI: qué es, cómo armarla y plantilla",
    excerpt:
      "La matriz RACI aclara quién hace, quién aprueba y quién solo necesita estar informado. Cómo construirla paso a paso, con un ejemplo completo y errores comunes.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2026-11-02",
    readingTime: "8 min",
    featured: false,
    pillar: "gestion-de-proyectos-guia-completa",
    related: ["como-estimar-tiempos-proyecto", "alcance-de-proyecto-scope-creep"],
    seo: {
      title: "Matriz RACI: qué es, cómo armarla y plantilla | Hito",
      description:
        "La matriz RACI aclara quién hace, quién aprueba y quién solo necesita estar informado. Paso a paso, con ejemplo y errores comunes.",
      ogImageAlt: "Matriz RACI: responsable, aprobador, consultado e informado.",
    },
  },
  {
  // Cuelga del pilar del cluster "Metodologías" (ver ROADMAP_BLOG.md)
  slug: "scrum-vs-kanban",
  title: "Scrum vs Kanban: diferencias reales y cuál elegir",
  excerpt:
    "Scrum y Kanban resuelven problemas distintos. Comparativa honesta de roles, ritmo y control de flujo para decidir cuál conviene a tu equipo.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-11-09",
  readingTime: "10 min",
  featured: false,
  pillar: "metodologias-gestion-proyectos",
    related: ["fases-de-un-proyecto", "matriz-raci"],
    seo: {
      title: "Scrum vs Kanban: diferencias reales y cuál elegir | Hito",
      description:
        "Scrum y Kanban resuelven problemas distintos. Comparativa honesta de roles, ritmo y control de flujo para elegir bien.",
      ogImageAlt: "Scrum vs Kanban: comparativa de roles, ritmo y flujo.",
    },
  },
  {
    slug: "alcance-de-proyecto-scope-creep",
    title: "Alcance de proyecto: definirlo y evitar el scope creep",
    excerpt:
      "Qué es el alcance de un proyecto, cómo documentarlo y las 4 señales de scope creep antes de que se coma tu cronograma.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2026-11-16",
    readingTime: "8 min",
    featured: false,
    pillar: "gestion-de-proyectos-guia-completa",
    related: ["fases-de-un-proyecto", "matriz-raci"],
    seo: {
      title: "Alcance de proyecto: definirlo y evitar el scope creep | Hito",
      description:
        "Qué es el alcance de un proyecto, cómo documentarlo y las 4 señales de scope creep antes de que se coma tu cronograma.",
      ogImageAlt: "Alcance de proyecto y cómo evitar el scope creep.",
    },
  },
  {
    slug: "ruta-critica-proyecto",
    title: "Ruta crítica: qué tareas no se pueden atrasar",
    excerpt:
      "La ruta crítica identifica qué tareas determinan la fecha de entrega de tu proyecto. Cómo calcularla, por qué importa y qué hacer cuando se mueve.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2026-11-23",
    readingTime: "10 min",
    featured: false,
    pillar: "gestion-de-proyectos-guia-completa",
    related: ["como-estimar-tiempos-proyecto", "fases-de-un-proyecto"],
    seo: {
      title: "Ruta crítica: qué tareas no se pueden atrasar | Hito",
      description:
        "La ruta crítica identifica qué tareas determinan la fecha de entrega. Cómo calcularla, por qué importa y qué hacer cuando se mueve.",
      ogImageAlt: "Ruta crítica del proyecto: tareas que no pueden atrasarse.",
    },
  },
  {
    slug: "objetivos-proyecto-smart-okr",
    title: "Objetivos de proyecto: SMART, OKR y cuándo cada uno",
    excerpt:
      "¿Objetivos SMART u OKR? Depende del tipo de proyecto y el horizonte de tiempo. Cuál elegir, con ejemplos y por qué mezclarlos suele ser el error.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2026-11-30",
    readingTime: "11 min",
    featured: false,
    pillar: "gestion-de-proyectos-guia-completa",
    related: ["como-estimar-tiempos-proyecto", "fases-de-un-proyecto"],
    seo: {
      title: "Objetivos de proyecto: SMART, OKR y cuándo cada uno | Hito",
      description:
        "¿Objetivos SMART u OKR? Depende del tipo de proyecto y el horizonte de tiempo. Cuál elegir, con ejemplos y por qué mezclarlos suele ser el error.",
      ogImageAlt: "Objetivos de proyecto: SMART vs OKR.",
    },
  },
  {
    slug: "gestion-de-riesgos-simple",
    title: "Gestión de riesgos para equipos pequeños",
    excerpt:
      "No necesitás matrices 50×50. Gestión de riesgos para equipos pequeños: cómo identificar, priorizar y mitigar en 15 minutos por semana.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2026-12-07",
    readingTime: "8 min",
    featured: false,
    pillar: "gestion-de-proyectos-guia-completa",
    related: ["como-estimar-tiempos-proyecto", "alcance-de-proyecto-scope-creep"],
    seo: {
      title: "Gestión de riesgos para equipos pequeños | Hito",
      description:
        "No necesitás matrices 50×50. Gestión de riesgos para equipos pequeños: cómo identificar, priorizar y mitigar en 15 minutos por semana.",
      ogImageAlt: "Gestión de riesgos simple para equipos pequeños.",
    },
  },
  {
    slug: "metodologias-gestion-proyectos",
    title: "PILAR — Metodologías de gestión de proyectos: cuál usar según tu equipo",
    excerpt:
      "Scrum, Kanban, Waterfall, Agile: cuál conviene según el tipo de proyecto, el tamaño del equipo y la incertidumbre del alcance. Guía práctica sin certificaciones.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2026-12-14",
    readingTime: "14 min",
    featured: true,
    related: [
      "scrum-vs-kanban",
      "que-es-scrum-equipos-pequenos",
      "kanban-limites-wip",
      "waterfall-vs-agile",
      "sprint-planning-como-hacerlo",
      "daily-standup-util",
      "retrospectivas-formatos",
    ],
    seo: {
      title: "Metodologías de gestión de proyectos: cuál usar según tu equipo | Hito",
      description:
        "Scrum, Kanban, Waterfall, Agile: cuál conviene según el tipo de proyecto, el tamaño del equipo y la incertidumbre del alcance. Guía práctica sin certificaciones.",
      ogImageAlt: "Metodologías de gestión de proyectos: cuál elegir según tu equipo.",
    },
  },
  {
    slug: "que-es-scrum-equipos-pequenos",
    title: "Qué es Scrum, sin certificaciones",
    excerpt:
      "Scrum explicado sin la burocracia de certificaciones: qué es, cómo funciona en la práctica para equipos pequeños, y qué ceremonias son realmente necesarias.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2026-12-21",
    readingTime: "9 min",
    featured: false,
    pillar: "metodologias-gestion-proyectos",
    related: [
      "scrum-vs-kanban",
      "kanban-limites-wip",
      "sprint-planning-como-hacerlo",
      "daily-standup-util",
      "retrospectivas-formatos",
    ],
    seo: {
      title: "Qué es Scrum, sin certificaciones | Hito",
      description:
        "Scrum explicado sin la burocracia de certificaciones: qué es, cómo funciona en la práctica para equipos pequeños, y qué ceremonias son realmente necesarias.",
      ogImageAlt: "Qué es Scrum explicado sin certificaciones.",
    },
  },
  {
    slug: "kanban-limites-wip",
    title: "Kanban en la práctica: límites WIP",
    excerpt:
      "El principio de límites WIP (Work In Progress) es lo que hace que Kanban funcione: no podés empezar algo nuevo antes de terminar algo viejo. Cómo definirlo y por qué importa.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2026-12-28",
    readingTime: "8 min",
    featured: false,
    pillar: "metodologias-gestion-proyectos",
    related: [
      "scrum-vs-kanban",
      "que-es-scrum-equipos-pequenos",
      "gestionar-varios-proyectos-a-la-vez",
    ],
    seo: {
      title: "Kanban en la práctica: límites WIP | Hito",
      description:
        "El principio de límites WIP (Work In Progress) es lo que hace que Kanban funcione: no podés empezar algo nuevo antes de terminar algo viejo. Cómo definirlo y por qué importa.",
      ogImageAlt: "Kanban en la práctica: límites WIP explicados.",
    },
  },
  {
    slug: "sprint-planning-como-hacerlo",
    title: "Sprint planning que se cumple",
    excerpt:
      "Cómo hacer un sprint planning que el equipo realmente pueda cumplir: capacidad real, poco trabajo bien cortado y un compromiso en una frase.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-01-04",
    readingTime: "9 min",
    featured: false,
    pillar: "metodologias-gestion-proyectos",
    related: [
      "que-es-scrum-equipos-pequenos",
      "como-estimar-tiempos-proyecto",
      "daily-standup-util",
    ],
    seo: {
      title: "Sprint planning que se cumple: guía práctica | Hito",
      description:
        "Cómo hacer un sprint planning que el equipo realmente pueda cumplir: capacidad real, poco trabajo bien cortado y un compromiso en una frase.",
      ogImageAlt: "Sprint planning que se cumple: capacidad, backlog y compromiso.",
    },
  },
  {
    slug: "daily-standup-util",
    title: "Daily standup que no sea pérdida de tiempo",
    excerpt:
      "El daily no es un status report al jefe: es coordinación de bloqueos en 15 minutos. Formato que funciona y cuándo hacerlo asíncrono.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-01-11",
    readingTime: "8 min",
    featured: false,
    pillar: "metodologias-gestion-proyectos",
    related: [
      "sprint-planning-como-hacerlo",
      "que-es-scrum-equipos-pequenos",
      "scrum-vs-kanban",
    ],
    seo: {
      title: "Daily standup que no sea pérdida de tiempo | Hito",
      description:
        "El daily no es un status report al jefe: es coordinación de bloqueos en 15 minutos. Formato que funciona y cuándo hacerlo asíncrono.",
      ogImageAlt: "Daily standup útil: 15 minutos y foco en bloqueos.",
    },
  },
  {
    slug: "retrospectivas-formatos",
    title: "Retrospectivas: 5 formatos y cómo elegir",
    excerpt:
      "Una retro sin 1–2 acciones con dueño y fecha es teatro. Cinco formatos prácticos y cómo elegir el correcto en 30 segundos.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-01-18",
    readingTime: "9 min",
    featured: false,
    pillar: "metodologias-gestion-proyectos",
    related: [
      "sprint-planning-como-hacerlo",
      "que-es-scrum-equipos-pequenos",
      "scrum-vs-kanban",
    ],
    seo: {
      title: "Retrospectivas: 5 formatos y cómo elegir | Hito",
      description:
        "Una retro sin 1–2 acciones con dueño y fecha es teatro. Cinco formatos prácticos y cómo elegir el correcto en 30 segundos.",
      ogImageAlt: "Formatos de retrospectiva de sprint: Start/Stop, 4Ls, Sailboat y más.",
    },
  },
  {
    slug: "waterfall-vs-agile",
    title: "Waterfall vs Agile: cuándo cascada es la respuesta correcta",
    excerpt:
      "Cascada no es “vieja y mala”. Cuándo Waterfall es honesto, cuándo Agile es teatro, y una tabla de decisión sin moda de industria.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-01-25",
    readingTime: "10 min",
    featured: true,
    pillar: "metodologias-gestion-proyectos",
    related: [
      "metodologias-gestion-proyectos",
      "scrum-vs-kanban",
      "fases-de-un-proyecto",
      "alcance-de-proyecto-scope-creep",
    ],
    seo: {
      title: "Waterfall vs Agile: cuándo cascada es la respuesta correcta | Hito",
      description:
        "Cascada no es “vieja y mala”. Cuándo Waterfall es honesto, cuándo Agile es teatro, y una tabla de decisión sin moda de industria.",
      ogImageAlt: "Waterfall vs Agile: cuándo elegir cascada y cuándo iterar.",
    },
  },
  {
    slug: "gestionar-varios-proyectos-a-la-vez",
    title: "Cómo gestionar varios proyectos a la vez",
    excerpt:
      "No es multitasking heroico: es un portafolio personal con capacidad compartida, WIP entre proyectos y un ritmo semanal que evita el caos.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-02-01",
    readingTime: "13 min",
    featured: true,
    related: [
      "proyecto-atrasado-que-hacer",
      "como-priorizar-tareas",
      "organizar-proyectos-tareas-jerarquia",
      "kanban-limites-wip",
    ],
    seo: {
      title: "Cómo gestionar varios proyectos a la vez | Hito",
      description:
        "No es multitasking heroico: es un portafolio personal con capacidad compartida, WIP entre proyectos y un ritmo semanal que evita el caos.",
      ogImageAlt: "Gestionar varios proyectos a la vez: portafolio, WIP y ritmo semanal.",
    },
  },
  {
    slug: "proyecto-atrasado-que-hacer",
    title: "Tu proyecto va atrasado: 6 movimientos antes de pedir plazo",
    excerpt:
      "Playbook de crisis: diagnosticar, congelar alcance, recortar, liberar la ruta crítica y comunicar con datos — antes de pedir más tiempo.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-02-08",
    readingTime: "9 min",
    featured: false,
    pillar: "gestionar-varios-proyectos-a-la-vez",
    related: [
      "gestionar-varios-proyectos-a-la-vez",
      "ruta-critica-proyecto",
      "alcance-de-proyecto-scope-creep",
      "como-estimar-tiempos-proyecto",
    ],
    seo: {
      title: "Tu proyecto va atrasado: 6 movimientos antes de pedir plazo | Hito",
      description:
        "Playbook de crisis: diagnosticar, congelar alcance, recortar, liberar la ruta crítica y comunicar con datos — antes de pedir más tiempo.",
      ogImageAlt: "Proyecto atrasado: 6 movimientos antes de pedir más plazo.",
    },
  },
];

export const BLOG_ARTICLES_META: BlogArticleMeta[] = RAW_ARTICLES.map((a) => ({
  author: DEFAULT_AUTHOR,
  ...a,
}));

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

/**
 * Relacionados en cascada: (1) `related` explícito del artículo, (2) resto del
 * cluster (mismo `pillar`, o el propio pilar si el actual es un satélite), (3)
 * relleno por categoría — comportamiento previo, para clusters aún sin poblar.
 */
export function getRelatedMeta(
  currentSlug: string,
  category: BlogCategory,
  limit = 3,
): BlogArticleMeta[] {
  const current = getArticleMeta(currentSlug);
  const result: BlogArticleMeta[] = [];
  const seen = new Set<string>([currentSlug]);

  const add = (candidates: BlogArticleMeta[]) => {
    for (const a of candidates) {
      if (result.length >= limit) return;
      if (seen.has(a.slug)) continue;
      seen.add(a.slug);
      result.push(a);
    }
  };

  if (current?.related?.length) {
    add(
      current.related
        .map((slug) => getArticleMeta(slug))
        .filter((a): a is BlogArticleMeta => Boolean(a)),
    );
  }

  if (result.length < limit) {
    const pillarSlug = current?.pillar ?? currentSlug;
    add(BLOG_ARTICLES_META.filter((a) => a.slug === pillarSlug || a.pillar === pillarSlug));
  }

  if (result.length < limit) {
    add(BLOG_ARTICLES_META.filter((a) => a.category === category));
  }

  return result.slice(0, limit);
}
