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
    publishedAt: "2026-08-01",
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
    title: "Cómo documentar un proceso: SOPs y checklists para equipos",
    excerpt:
      "Aprende a escribir SOPs y checklists que tu equipo realmente use. Sin wikis abandonados ni manuales que nadie lee.",
    category: "procesos",
    categoryLabel: "Procesos",
    publishedAt: "2026-08-02",
    readingTime: "7 min",
    featured: false,
    related: ["organizar-proyectos-tareas-jerarquia", "cierre-de-proyecto-checklist"],
    seo: {
      title: "Cómo documentar un proceso: SOPs y checklists | Hito",
      description:
        "Cómo documentar un proceso y documentar procesos en equipos pequeños: SOPs útiles, checklists reutilizables y documentación que sí se usa.",
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
    publishedAt: "2026-08-04",
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
    publishedAt: "2026-08-05",
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
    publishedAt: "2026-08-07",
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
    publishedAt: "2026-08-08",
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
    publishedAt: "2026-08-10",
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
    publishedAt: "2026-08-12",
    readingTime: "9 min",
    featured: false,
    related: [
      "plantillas-gestion-proyectos",
      "herramientas-gestion-proyectos-gratis",
      "migrar-trello-a-hito",
    ],
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
    publishedAt: "2026-08-13",
    readingTime: "10 min",
    featured: false,
    related: [
      "plantillas-gestion-proyectos",
      "herramientas-gestion-proyectos-gratis",
      "hito-vs-clickup",
    ],
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
    publishedAt: "2026-08-15",
    readingTime: "9 min",
    featured: false,
    related: ["hito-vs-trello", "plantillas-gestion-proyectos", "herramientas-gestion-proyectos-gratis"],
    seo: {
      title: "Cómo migrar de Trello a Hito (guía honesta, paso a paso) — Hito",
      description:
        "Guía honesta para migrar de Trello a Hito: tabla de mapeo verificada, paso a paso y qué hacer con los datos sin equivalente directo. Sin promesas falsas.",
      ogImageAlt: "Migración de Trello a Hito paso a paso.",
    },
  },
  {
    slug: "que-es-mcp",
    title: "Qué es MCP (Model Context Protocol): guía del protocolo",
    excerpt:
      "MCP explicado sin hype: qué es, para qué sirve y en qué se diferencia de function calling y RAG. Con un ejemplo real.",
    category: "inteligencia-artificial",
    categoryLabel: "Inteligencia artificial",
    publishedAt: "2026-08-16",
    readingTime: "9 min",
    featured: false,
    related: [
      "como-funciona-mcp-paso-a-paso",
      "mcp-vs-function-calling-vs-rag",
      "servidores-mcp-para-que-sirven",
      "rag-local-explicado",
    ],
    seo: {
      title: "Qué es MCP (Model Context Protocol) y el protocolo | Hito",
      description:
        "MCP (Model Context Protocol) explicado: qué es el protocolo MCP, qué son los primitives y cómo se diferencia de function calling y RAG.",
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
    related: [
      "plantillas-gestion-proyectos",
      "herramientas-gestion-proyectos-gratis",
      "hito-vs-trello",
    ],
    seo: {
      title: "Hito vs ClickUp: comparativa honesta (2026) | Hito",
      description:
        "ClickUp es más completo, pero no es gratis de verdad ni es local-first. Comparativa honesta de precio, IA y privacidad para elegir bien.",
      ogImageAlt: "Comparativa honesta Hito vs ClickUp 2026.",
    },
  },
  {
    slug: "como-priorizar-tareas",
    title: "Cómo priorizar tareas: 4 métodos de priorización",
    excerpt:
      "4 métodos para priorizar tareas —Eisenhower, MoSCoW, RICE e Ivy Lee— con ejemplos y cómo aplicarlos hoy, en cualquier herramienta.",
    category: "productividad",
    categoryLabel: "Productividad",
    publishedAt: "2026-09-14",
    readingTime: "10 min",
    featured: false,
    pillar: "gestion-de-proyectos-guia-completa",
    related: ["alcance-de-proyecto-scope-creep", "fases-de-un-proyecto"],
    seo: {
      title: "Cómo priorizar tareas: 4 métodos de priorización | Hito",
      description:
        "Cómo priorizar tareas y la priorización de tareas con Eisenhower, MoSCoW, RICE e Ivy Lee. Guía práctica, con ejemplos, para cualquier herramienta.",
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
    related: ["gestion-proyectos-agencias", "plantillas-gestion-proyectos"],
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
    title: "Fases de un proyecto: las 5 etapas, con ejemplos",
    excerpt:
      "Inicio, planificación, ejecución, seguimiento y cierre: las 5 fases de cualquier proyecto explicadas con un ejemplo real, sin depender de una metodología específica.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2026-10-19",
    readingTime: "9 min",
    featured: false,
    pillar: "gestion-de-proyectos-guia-completa",
    related: [
      "como-estimar-tiempos-proyecto",
      "alcance-de-proyecto-scope-creep",
      "objetivos-proyecto-smart-okr",
    ],
    seo: {
      title: "Fases de un proyecto: las 5 etapas, con ejemplos | Hito",
      description:
        "Las fases de un proyecto (y cada etapa de un proyecto): inicio, planificación, ejecución, seguimiento y cierre, con un ejemplo real.",
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
    title: "Matriz RACI: qué es, ejemplo y diferencia con RASCI",
    excerpt:
      "La matriz RACI aclara quién hace, quién aprueba y quién solo necesita estar informado. Cómo construirla paso a paso, con un ejemplo completo y errores comunes.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2026-11-02",
    readingTime: "8 min",
    featured: false,
    pillar: "gestion-de-proyectos-guia-completa",
    related: [
      "como-estimar-tiempos-proyecto",
      "alcance-de-proyecto-scope-creep",
      "plantillas-gestion-proyectos",
    ],
    seo: {
      title: "Matriz RACI: qué es, ejemplo y diferencia con RASCI | Hito",
      description:
        "Qué es una matriz RACI, con un ejemplo completo. También cubre la matriz RASCI y cómo armarla paso a paso con roles claros.",
      ogImageAlt: "Matriz RACI: responsable, aprobador, consultado e informado.",
    },
  },
  {
  // Cuelga del pilar del cluster "Metodologías" (ver ROADMAP_BLOG.md)
  slug: "scrum-vs-kanban",
  title: "Kanban vs Scrum: diferencias reales y cuál elegir",
  excerpt:
    "Scrum y Kanban resuelven problemas distintos. Comparativa honesta de roles, ritmo y control de flujo para decidir cuál conviene a tu equipo.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-11-09",
  readingTime: "10 min",
  featured: false,
  pillar: "metodologias-gestion-proyectos",
    related: ["fases-de-un-proyecto", "matriz-raci", "kanban-limites-wip"],
    seo: {
      title: "Kanban vs Scrum (y Scrum vs Kanban): cuál elegir | Hito",
      description:
        "Kanban vs Scrum y Scrum vs Kanban: diferencias de roles, ritmo y flujo. También Kanban y Scrum juntos, para decidir cuál le conviene a tu equipo.",
      ogImageAlt: "Kanban vs Scrum: comparativa de roles, ritmo y flujo.",
    },
  },
  {
    slug: "alcance-de-proyecto-scope-creep",
    title: "Scope creep: qué es (corrupción del alcance) y cómo evitarlo",
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
      title: "Scope creep: qué es (corrupción del alcance) | Hito",
      description:
        "Qué es el scope creep en español (corrupción del alcance), cómo documentarlo y las 4 señales antes de que se coma el cronograma de tu proyecto.",
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
    title: "Kanban WIP: qué significa el límite y cómo usarlo",
    excerpt:
      "El principio de límites WIP (Work In Progress) es lo que hace que Kanban funcione: no puedes empezar algo nuevo antes de terminar algo viejo. Cómo definirlo y por qué importa.",
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
      "reducir-trabajo-en-curso",
    ],
    seo: {
      title: "Kanban WIP: qué significa y cómo limitar el trabajo | Hito",
      description:
        "Kanban WIP explicado: qué significa W.I.P., cómo fijar el límite y qué pasa con el WIP en Scrum. Termina antes de empezar más.",
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
    title: "Metodología Waterfall vs Agile: cuándo elegir cascada",
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
      title: "Metodología Waterfall vs Agile (y Agile vs Waterfall) | Hito",
      description:
        "Metodología Waterfall vs Agile y Agile vs Waterfall: cuándo usar cascada, cuándo iterar y cómo se ve una metodología agile cascada honesta.",
      ogImageAlt: "Waterfall vs Agile: cuándo elegir cascada y cuándo iterar.",
    },
  },
  {
    slug: "gestionar-varios-proyectos-a-la-vez",
    title: "Proyectos múltiples: cómo gestionar varios a la vez",
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
      title: "Proyectos múltiples: cómo gestionar varios a la vez | Hito",
      description:
        "Cómo gestionar proyectos múltiples a la vez: un portafolio, pocos frentes abiertos y un ritmo semanal que evita el caos.",
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
  {
    slug: "reuniones-de-status-eliminar",
    title: "Reemplazar reuniones de status por un tablero",
    excerpt:
      "La reunión de status no informa a nadie: confirma en voz alta lo que un tablero ya muestra. Cómo migrar a un tablero + update escrito sin perder visibilidad.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-02-15",
    readingTime: "8 min",
    featured: false,
    pillar: "gestionar-varios-proyectos-a-la-vez",
    related: [
      "gestionar-varios-proyectos-a-la-vez",
      "daily-standup-util",
      "seguimiento-de-tareas-equipo",
      "informe-de-estado-semanal",
    ],
    seo: {
      title: "Reemplazar reuniones de status por un tablero | Hito",
      description:
        "La reunión de status no informa a nadie: confirma en voz alta lo que un tablero ya muestra. Cómo migrar a un tablero + update escrito sin perder visibilidad.",
      ogImageAlt: "Reemplazar reuniones de status por un tablero y un update escrito.",
    },
  },
  {
    slug: "reducir-trabajo-en-curso",
    title: "Por qué tu equipo entrega poco: demasiado trabajo empezado",
    excerpt:
      "Más tareas “en curso” no es más progreso — es más cambio de contexto y menos entregas. Cómo medir el WIP real y bajarlo sin frenar al equipo.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-02-22",
    readingTime: "9 min",
    featured: false,
    pillar: "gestionar-varios-proyectos-a-la-vez",
    related: [
      "kanban-limites-wip",
      "gestionar-varios-proyectos-a-la-vez",
      "reuniones-de-status-eliminar",
      "sprint-planning-como-hacerlo",
    ],
    seo: {
      title: "Por qué tu equipo entrega poco: demasiado trabajo empezado | Hito",
      description:
        "Más tareas “en curso” no es más progreso — es más cambio de contexto y menos entregas. Cómo medir el WIP real y bajarlo sin frenar al equipo.",
      ogImageAlt: "Reducir el trabajo en curso (WIP) para entregar más rápido.",
    },
  },
  {
    slug: "como-delegar-tareas",
    title: "Cómo delegar y dejar de ser el cuello de botella",
    excerpt:
      "Delegar no es soltar del todo ni microgestionar: son 3 niveles según cuánto confiás en la tarea. Con RACI para que quede claro quién decide qué.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-03-01",
    readingTime: "9 min",
    featured: false,
    pillar: "gestionar-varios-proyectos-a-la-vez",
    related: [
      "matriz-raci",
      "seguimiento-de-tareas-equipo",
      "gestionar-varios-proyectos-a-la-vez",
      "proyecto-atrasado-que-hacer",
    ],
    seo: {
      title: "Cómo delegar y dejar de ser el cuello de botella | Hito",
      description:
        "Delegar no es soltar del todo ni microgestionar: son 3 niveles según cuánto confiás en la tarea. Con RACI para que quede claro quién decide qué.",
      ogImageAlt: "Cómo delegar tareas y dejar de ser el cuello de botella del equipo.",
    },
  },
  {
    slug: "seguimiento-de-tareas-equipo",
    title: "Seguimiento de tareas sin microgestionar",
    excerpt:
      "Preguntar todos los días “¿cómo vas?” no es seguimiento, es ansiedad con forma de mensaje. Un sistema de visibilidad pull que reemplaza el pedido de reportes.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-03-08",
    readingTime: "8 min",
    featured: false,
    pillar: "gestionar-varios-proyectos-a-la-vez",
    related: [
      "como-delegar-tareas",
      "kanban-limites-wip",
      "daily-standup-util",
      "reuniones-de-status-eliminar",
    ],
    seo: {
      title: "Seguimiento de tareas sin microgestionar | Hito",
      description:
        "Preguntar todos los días “¿cómo vas?” no es seguimiento, es ansiedad con forma de mensaje. Un sistema de visibilidad pull que reemplaza el pedido de reportes.",
      ogImageAlt: "Seguimiento de tareas de equipo sin caer en la microgestión.",
    },
  },
  {
    slug: "cierre-de-proyecto-checklist",
    title: "Cierre de proyecto: el checklist que casi nadie hace",
    excerpt:
      "La mayoría de los proyectos no cierran, se apagan: el equipo pasa al siguiente sin archivar, sin retro y sin cobrar el último hito. Checklist de cierre real.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-03-15",
    readingTime: "8 min",
    featured: false,
    pillar: "gestionar-varios-proyectos-a-la-vez",
    related: [
      "fases-de-un-proyecto",
      "retrospectivas-formatos",
      "lecciones-aprendidas-proyecto",
      "gestion-de-riesgos-simple",
    ],
    seo: {
      title: "Cierre de proyecto: el checklist que casi nadie hace | Hito",
      description:
        "La mayoría de los proyectos no cierran, se apagan: el equipo pasa al siguiente sin archivar, sin retro y sin cobrar el último hito. Checklist de cierre real.",
      ogImageAlt: "Checklist de cierre de proyecto: lo que casi nadie hace al final.",
    },
  },
  {
    slug: "gestionar-proyectos-con-clientes",
    title: "Proyectos con clientes externos",
    excerpt:
      "Un cliente externo no es un stakeholder más: cambia el costo del cambio de alcance, el canal de comunicación y quién tiene la última palabra. Cómo ordenarlo.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-03-22",
    readingTime: "9 min",
    featured: false,
    pillar: "gestionar-varios-proyectos-a-la-vez",
    related: [
      "gestionar-varios-proyectos-a-la-vez",
      "matriz-raci",
      "alcance-de-proyecto-scope-creep",
      "hito-para-estudio-juridico",
    ],
    seo: {
      title: "Proyectos con clientes externos | Hito",
      description:
        "Un cliente externo no es un stakeholder más: cambia el costo del cambio de alcance, el canal de comunicación y quién tiene la última palabra. Cómo ordenarlo.",
      ogImageAlt: "Gestionar proyectos con clientes externos: alcance, canal y RACI.",
    },
  },
  {
    slug: "como-funciona-mcp-paso-a-paso",
    title: "Cómo funciona MCP paso a paso: sesión e Introducing MCP",
    excerpt:
      "Cómo funciona MCP en la práctica: qué es una sesión MCP, qué cubrió Introducing MCP y qué puede hacer un servidor (tools, resources, prompts).",
    category: "inteligencia-artificial",
    categoryLabel: "Inteligencia artificial",
    publishedAt: "2027-03-29",
    readingTime: "10 min",
    featured: false,
    pillar: "que-es-mcp",
    related: [
      "que-es-mcp",
      "mcp-vs-function-calling-vs-rag",
      "servidores-mcp-para-que-sirven",
    ],
    seo: {
      title: "MCP paso a paso: sesión e Introducing MCP | Hito",
      description:
        "Cómo funciona MCP paso a paso: qué es una sesión MCP, qué cubre Introducing MCP y qué puede hacer (tools, resources, prompts).",
      ogImageAlt: "Cómo funciona MCP paso a paso: sesión, Introducing MCP y capabilities.",
    },
  },
  {
    slug: "mcp-vs-function-calling-vs-rag",
    title: "MCP vs function calling vs RAG: cuándo usar cada uno",
    excerpt:
      "MCP, function calling y RAG no son tres alternativas: son tres capas. Qué problema resuelve cada una, cómo se combinan y cuándo no necesitas las tres.",
    category: "inteligencia-artificial",
    categoryLabel: "Inteligencia artificial",
    publishedAt: "2027-04-05",
    readingTime: "11 min",
    featured: false,
    pillar: "que-es-mcp",
    related: [
      "que-es-mcp",
      "como-funciona-mcp-paso-a-paso",
      "servidores-mcp-para-que-sirven",
    ],
    seo: {
      title: "MCP vs function calling vs RAG: cuándo usar cada uno | Hito",
      description:
        "MCP vs function calling vs RAG: qué problema resuelve cada uno, cómo se combinan y cuándo no necesitas los tres. Con tabla y ejemplo.",
      ogImageAlt: "MCP vs function calling vs RAG: tres capas, no tres alternativas.",
    },
  },
  {
    slug: "plantillas-gestion-proyectos",
    title: "Las 8 plantillas de gestión de proyectos que sí se usan",
    excerpt:
      "Ocho plantillas que un equipo pequeño realmente llena: plan, acta, informe, RACI, riesgos, kickoff, WBS y cronograma. Cuáles saltarte.",
    category: "plantillas",
    categoryLabel: "Plantillas",
    publishedAt: "2027-04-12",
    readingTime: "12 min",
    featured: true,
    related: [
      "plantilla-plan-de-proyecto",
      "acta-constitucion-proyecto",
      "informe-de-estado-semanal",
      "gestion-proyectos-excel",
      "herramientas-gestion-proyectos-gratis",
    ],
    seo: {
      title: "8 plantillas de gestión de proyectos que sí se usan | Hito",
      description:
        "Ocho plantillas de gestión de proyectos que un equipo pequeño sí llena: plan, acta, WBS, cronograma, RACI, informe, riesgos y cierre. Cuáles saltar.",
      ogImageAlt:
        "Ocho plantillas de gestión de proyectos que un equipo pequeño sí llena, y cuáles saltarse.",
    },
  },
  {
    slug: "plantilla-plan-de-proyecto",
    title: "Plantilla de plan de proyecto y cómo llenarla",
    excerpt:
      "Un plan de proyecto no es un Gantt de 40 páginas. Qué secciones llenar, en qué orden, y un ejemplo corto que cabe en una página.",
    category: "plantillas",
    categoryLabel: "Plantillas",
    publishedAt: "2027-04-19",
    readingTime: "10 min",
    featured: false,
    pillar: "plantillas-gestion-proyectos",
    related: [
      "plantillas-gestion-proyectos",
      "acta-constitucion-proyecto",
      "fases-de-un-proyecto",
    ],
    seo: {
      title: "Plantilla de plan de proyecto: cómo llenarla | Hito",
      description:
        "Plantilla de plan de proyecto: qué secciones llenar, en qué orden, y un ejemplo de una página. Qué dejar en blanco y cómo se diferencia del acta.",
      ogImageAlt:
        "Plantilla de plan de proyecto con las secciones que sí se llenan y un ejemplo de una página.",
    },
  },
  {
    slug: "acta-constitucion-proyecto",
    title: "Acta de constitución de proyecto (project charter): plantilla",
    excerpt:
      "El project charter autoriza el proyecto y da autoridad a quien lo dirige. Plantilla corta, qué no meter, y cómo se diferencia del plan.",
    category: "plantillas",
    categoryLabel: "Plantillas",
    publishedAt: "2027-04-26",
    readingTime: "9 min",
    featured: false,
    pillar: "plantillas-gestion-proyectos",
    related: [
      "plantillas-gestion-proyectos",
      "plantilla-plan-de-proyecto",
      "alcance-de-proyecto-scope-creep",
    ],
    seo: {
      title: "Acta de constitución de proyecto (project charter) | Hito",
      description:
        "El acta de constitución de proyecto (project charter) autoriza el trabajo y da autoridad a quien lo dirige. Plantilla de una página y qué no meter.",
      ogImageAlt:
        "Acta de constitución de proyecto (project charter): plantilla corta y diferencia con el plan.",
    },
  },
  {
    slug: "informe-de-estado-semanal",
    title: "Informe de estado semanal en 5 líneas",
    excerpt:
      "Un informe de estado de proyecto no necesita una reunión ni un PowerPoint. Cinco líneas, una vez por semana, y el tablero ya no hace falta explicarlo.",
    category: "plantillas",
    categoryLabel: "Plantillas",
    publishedAt: "2027-05-03",
    readingTime: "8 min",
    featured: false,
    pillar: "plantillas-gestion-proyectos",
    related: [
      "plantillas-gestion-proyectos",
      "reuniones-de-status-eliminar",
      "seguimiento-de-tareas-equipo",
    ],
    seo: {
      title: "Informe de estado semanal de proyecto en 5 líneas | Hito",
      description:
        "Cómo escribir un informe de estado de proyecto en 5 líneas, una vez por semana, y dejar de usar la reunión de status para repetir el tablero.",
      ogImageAlt: "Plantilla de informe de estado semanal de proyecto en 5 líneas.",
    },
  },
  {
    slug: "gestion-proyectos-excel",
    title: "Gestión de proyectos en Excel: cuándo alcanza y cuándo no",
    excerpt:
      "Excel alcanza para un proyecto chico con un dueño. Deja de alcanzar cuando hay dependencias, varias personas actualizando, o el archivo se vuelve la fuente de verdad.",
    category: "plantillas",
    categoryLabel: "Plantillas",
    publishedAt: "2027-05-10",
    readingTime: "10 min",
    featured: false,
    pillar: "plantillas-gestion-proyectos",
    related: [
      "plantillas-gestion-proyectos",
      "herramientas-gestion-proyectos-gratis",
      "gestionar-varios-proyectos-a-la-vez",
    ],
    seo: {
      title: "Gestión de proyectos en Excel: cuándo sí y cuándo no | Hito",
      description:
        "Gestión de proyectos en Excel: cuándo una hoja alcanza (un dueño, un proyecto) y cuándo falla (versiones, dependencias, WIP, varios editores).",
      ogImageAlt: "Gestión de proyectos en Excel: cuándo sí alcanza y cuándo ya no.",
    },
  },
  {
    slug: "herramientas-gestion-proyectos-gratis",
    title: "Herramientas gratis de gestión de proyectos (con límites reales)",
    excerpt:
      "“Gratis” casi nunca es gratis de verdad. Comparativa honesta de herramientas de gestión de proyectos gratis: qué incluye el plan free, dónde te empujan a pagar, y cuándo conviene local-first.",
    category: "plantillas",
    categoryLabel: "Plantillas",
    publishedAt: "2027-05-17",
    readingTime: "11 min",
    featured: false,
    pillar: "plantillas-gestion-proyectos",
    related: [
      "plantillas-gestion-proyectos",
      "hito-vs-trello",
      "alternativas-a-notion",
      "hito-vs-clickup",
    ],
    seo: {
      title: "Herramientas gratis de gestión de proyectos | Hito",
      description:
        "Herramientas gratis de gestión de proyectos con límites reales: Trello, Asana, ClickUp, Jira, Notion, OpenProject, Excel y local-first.",
      ogImageAlt:
        "Comparativa de herramientas gratis de gestión de proyectos y los límites del plan free.",
    },
  },
  {
    slug: "kickoff-de-proyecto",
    title: "Kickoff de proyecto: agenda, plantilla y errores",
    excerpt:
      "El kickoff no es un discurso de lanzamiento. Es la reunión donde se confirma alcance, roles y la primera semana. Agenda de 45 minutos y plantilla.",
    category: "plantillas",
    categoryLabel: "Plantillas",
    publishedAt: "2027-05-24",
    readingTime: "9 min",
    featured: false,
    pillar: "plantillas-gestion-proyectos",
    related: ["plantillas-gestion-proyectos", "acta-constitucion-proyecto", "fases-de-un-proyecto"],
    seo: {
      title: "Kickoff de proyecto: agenda y plantilla | Hito",
      description:
        "Kickoff de proyecto: agenda de 45 minutos, plantilla y errores. La reunión de kickoff confirma alcance, roles y la primera semana.",
      ogImageAlt: "Agenda de kickoff de proyecto de 45 minutos, con plantilla.",
    },
  },
  {
    slug: "wbs-estructura-desglose-trabajo",
    title: "WBS: estructura de desglose de trabajo, con ejemplo",
    excerpt:
      "El WBS parte el proyecto en entregables, no en tareas sueltas. Cómo armarlo en una tarde, hasta qué nivel bajar, y un ejemplo completo.",
    category: "plantillas",
    categoryLabel: "Plantillas",
    publishedAt: "2027-05-31",
    readingTime: "10 min",
    featured: false,
    pillar: "plantillas-gestion-proyectos",
    related: [
      "plantillas-gestion-proyectos",
      "plantilla-plan-de-proyecto",
      "alcance-de-proyecto-scope-creep",
    ],
    seo: {
      title: "WBS: estructura de desglose de trabajo con ejemplo | Hito",
      description:
        "WBS (estructura de desglose de trabajo): cómo armarlo en una tarde, hasta qué nivel bajar, y un ejemplo completo de 3 niveles.",
      ogImageAlt: "WBS: estructura de desglose de trabajo con ejemplo de 3 niveles.",
    },
  },
  {
    slug: "plantilla-cronograma-proyecto",
    title: "Plantilla de cronograma de proyecto (sin Gantt eterno)",
    excerpt:
      "Un cronograma útil cabe en hitos y dependencias, no en 200 barras. Plantilla simple, relación con la ruta crítica, y cuándo un Gantt miente.",
    category: "plantillas",
    categoryLabel: "Plantillas",
    publishedAt: "2027-06-07",
    readingTime: "10 min",
    featured: false,
    pillar: "plantillas-gestion-proyectos",
    related: ["plantillas-gestion-proyectos", "ruta-critica-proyecto", "diagrama-de-gantt"],
    seo: {
      title: "Plantilla de cronograma de proyecto | Hito",
      description:
        "Plantilla de cronograma de proyecto por hitos y dependencias, sin un Gantt de 200 barras. Relación con la ruta crítica y cuándo un Gantt miente.",
      ogImageAlt: "Plantilla de cronograma de proyecto por hitos, sin Gantt eterno.",
    },
  },
  {
    slug: "gestion-proyectos-freelancers",
    title: "Gestión de proyectos para freelancers",
    excerpt:
      "Un freelancer no necesita un PMO. Necesita alcance cerrado, un canal con el cliente y un tope de trabajo en curso. El sistema mínimo que evita el caos.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-06-14",
    readingTime: "10 min",
    featured: false,
    related: [
      "gestionar-varios-proyectos-a-la-vez",
      "gestionar-proyectos-con-clientes",
      "plantillas-gestion-proyectos",
      "gestion-de-proyectos-guia-completa",
    ],
    seo: {
      title: "Gestión de proyectos para freelancers | Hito",
      description:
        "Gestión de proyectos para freelancers: alcance escrito, un canal con el cliente y un tope de WIP. El sistema mínimo para varios clientes sin caos.",
      ogImageAlt:
        "Gestión de proyectos para freelancers: alcance, canal único y tope de WIP.",
    },
  },
  {
    slug: "gestion-proyectos-agencias",
    title: "Gestión de proyectos para agencias y estudios",
    excerpt:
      "Una agencia no falla por falta de talento: falla por demasiados proyectos abiertos, kickoffs flojos y un solo PM como cuello de botella. Cómo ordenarlo.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-06-21",
    readingTime: "11 min",
    featured: false,
    related: [
      "gestionar-varios-proyectos-a-la-vez",
      "gestion-proyectos-freelancers",
      "metodologias-gestion-proyectos",
      "plantillas-gestion-proyectos",
    ],
    seo: {
      title: "Gestión de proyectos para agencias y estudios | Hito",
      description:
        "Gestión de proyectos para agencias y estudios: WIP por disciplina, RACI por cuenta y una vista semanal de portafolio. Cómo ordenar kickoffs y status.",
      ogImageAlt:
        "Gestión de proyectos para agencias: WIP por disciplina, RACI y portafolio semanal.",
    },
  },
  {
    slug: "servidores-mcp-para-que-sirven",
    title: "Servidores MCP: para qué sirven (sin ser developer)",
    excerpt:
      "Un servidor MCP no es un chatbot. Es el adaptador que deja a un asistente de IA leer archivos, APIs o tu tablero con un protocolo común. Casos de uso reales.",
    category: "inteligencia-artificial",
    categoryLabel: "Inteligencia artificial",
    publishedAt: "2027-06-28",
    readingTime: "10 min",
    featured: false,
    pillar: "que-es-mcp",
    related: ["que-es-mcp", "como-funciona-mcp-paso-a-paso", "mcp-vs-function-calling-vs-rag"],
    seo: {
      title: "Servidores MCP: para qué sirven, sin jerga | Hito",
      description:
        "Para qué sirven los servidores MCP y qué es un mcp-handler: el adaptador que deja a un asistente leer archivos, APIs o tu tablero, sin ser developer.",
      ogImageAlt:
        "Servidores MCP: para qué sirven, casos de uso y qué es un mcp-handler.",
    },
  },
  {
    slug: "kpis-gestion-proyectos",
    title: "KPIs de gestión de proyectos: los que sí importan",
    excerpt:
      "La fecha proyectada de fin, el WIP y la desviación de presupuesto cambian decisiones. Los KPIs que caben en un informe semanal y los que solo decoran.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-07-05",
    readingTime: "10 min",
    featured: true,
    related: ["diagrama-de-gantt", "burndown-chart", "valor-ganado-evm", "informe-de-estado-semanal"],
    seo: {
      title: "KPIs de gestión de proyectos: los que importan | Hito",
      description:
        "KPIs de gestión de proyectos que sí cambian decisiones: fecha proyectada de fin, WIP, desviación de costo y alcance. Los 8 indicadores del informe semanal.",
      ogImageAlt:
        "Los 8 KPIs de gestión de proyectos que caben en un informe semanal, en una tabla.",
    },
  },
  {
    slug: "diagrama-de-gantt",
    title: "Diagrama de Gantt: qué es, cómo hacerlo y cuándo sobra",
    excerpt:
      "Qué es un diagrama de Gantt, cómo hacerlo paso a paso con o sin Excel, y el error de las 200 barras que esconde la ruta crítica. Cuándo ayuda y cuándo estorba.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-07-12",
    readingTime: "10 min",
    featured: false,
    pillar: "kpis-gestion-proyectos",
    related: ["kpis-gestion-proyectos", "ruta-critica-proyecto", "plantilla-cronograma-proyecto"],
    seo: {
      title: "Diagrama de Gantt: qué es y cómo hacerlo | Hito",
      description:
        "Qué es un diagrama de Gantt, cómo hacerlo paso a paso (con o sin Excel) y cuándo ayuda de verdad. El error de las 200 barras y cómo evitarlo.",
      ogImageAlt: "Diagrama de Gantt simplificado con hitos, dependencias y ruta crítica.",
    },
  },
  {
    slug: "burndown-chart",
    title: "Burndown chart: qué es y cómo leerlo (sin jerga)",
    excerpt:
      "Cómo leer un burndown chart en 10 segundos: línea ideal vs. real, los 4 patrones que delatan un sprint en problemas, y cuándo un burnup cuenta mejor la historia.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-07-19",
    readingTime: "8 min",
    featured: false,
    pillar: "kpis-gestion-proyectos",
    related: ["kpis-gestion-proyectos", "kanban-limites-wip", "sprint-planning-como-hacerlo"],
    seo: {
      title: "Burndown chart: qué es y cómo leerlo | Hito",
      description:
        "Qué es un burndown chart, cómo leerlo en 10 segundos (línea ideal vs. real), los patrones que delatan problemas y cuándo un burnup es mejor opción.",
      ogImageAlt: "Burndown chart con línea ideal y línea real divergiendo a mitad de sprint.",
    },
  },
  {
    slug: "lecciones-aprendidas-proyecto",
    title: "Lecciones aprendidas de un proyecto: formato y ejemplo",
    excerpt:
      "La mayoría de las lecciones aprendidas mueren en un documento que nadie abre. Formato de 4 columnas, reunión de 45 minutos y el truco para que el siguiente proyecto las use.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-07-26",
    readingTime: "9 min",
    featured: false,
    pillar: "kpis-gestion-proyectos",
    related: ["kpis-gestion-proyectos", "cierre-de-proyecto-checklist", "retrospectivas-formatos"],
    seo: {
      title: "Lecciones aprendidas de un proyecto | Hito",
      description:
        "Cómo documentar lecciones aprendidas de un proyecto: reunión de 45 minutos, formato de 4 columnas con ejemplos y cómo hacer que el siguiente proyecto las lea.",
      ogImageAlt: "Formato de lecciones aprendidas de un proyecto en tabla de 4 columnas.",
    },
  },
  {
    slug: "que-son-stakeholders",
    title: "Stakeholders: qué son y cómo gestionarlos en un proyecto",
    excerpt:
      "Un stakeholder es cualquiera que puede decir “no” a tu proyecto o lo que este afecta. Quiénes son, ejemplos internos y externos, y cómo gestionarlos por interés e influencia.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-08-02",
    readingTime: "10 min",
    featured: true,
    related: ["matriz-de-stakeholders", "matriz-raci", "gestionar-proyectos-con-clientes"],
    seo: {
      title: "Stakeholders: qué son y cómo gestionarlos | Hito",
      description:
        "Qué es un stakeholder, ejemplos internos y externos, diferencia con shareholders y cómo gestionar cada tipo según su interés e influencia en el proyecto.",
      ogImageAlt: "Tipos de stakeholders de un proyecto: internos, externos y su nivel de influencia.",
    },
  },
  {
    slug: "matriz-de-stakeholders",
    title: "Matriz de stakeholders: plantilla poder-interés con ejemplo",
    excerpt:
      "La matriz de stakeholders clasifica a los interesados en 4 cuadrantes según poder e interés. Plantilla con ejemplo, cómo llenarla en 30 minutos y qué hacer con cada cuadrante.",
    category: "plantillas",
    categoryLabel: "Plantillas",
    publishedAt: "2027-08-09",
    readingTime: "9 min",
    featured: false,
    pillar: "que-son-stakeholders",
    related: ["que-son-stakeholders", "matriz-raci", "plantillas-gestion-proyectos"],
    seo: {
      title: "Matriz de stakeholders: plantilla y ejemplo | Hito",
      description:
        "Matriz de stakeholders (poder-interés): plantilla de 4 cuadrantes con ejemplo, cómo llenarla en 30 minutos y la estrategia de comunicación para cada cuadrante.",
      ogImageAlt: "Matriz de stakeholders poder-interés con los 4 cuadrantes y ejemplos.",
    },
  },
  {
    slug: "gestion-de-recursos-proyecto",
    title: "Gestión de recursos en proyectos: asignar sin sobrecargar",
    excerpt:
      "Gestión de recursos en proyectos: tipos de recursos, cómo asignar según capacidad real (no nominal) y las señales de que tu equipo está sobrecargado antes de que explote.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-08-16",
    readingTime: "10 min",
    featured: false,
    pillar: "que-son-stakeholders",
    related: ["que-son-stakeholders", "como-delegar-tareas", "reducir-trabajo-en-curso"],
    seo: {
      title: "Gestión de recursos en proyectos | Hito",
      description:
        "Gestión de recursos en proyectos: tipos de recursos, cómo asignar por capacidad real y no nominal, y las señales tempranas de sobrecarga del equipo.",
      ogImageAlt: "Planificación de recursos: capacidad real del equipo contra asignaciones del proyecto.",
    },
  },
  {
    slug: "que-hace-un-project-manager",
    title: "Qué hace un project manager: el rol, sin humo",
    excerpt:
      "Qué hace un project manager día a día: responsabilidades reales, qué NO es su trabajo, cómo se diferencia de un product manager o scrum master y cuándo lo necesita un equipo.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-08-23",
    readingTime: "10 min",
    featured: false,
    pillar: "que-son-stakeholders",
    related: ["que-son-stakeholders", "gestion-proyectos-agencias", "metodologias-gestion-proyectos"],
    seo: {
      title: "Qué hace un project manager (sin humo) | Hito",
      description:
        "Qué hace un project manager día a día: responsabilidades reales, qué no es su trabajo, diferencias con product manager y scrum master, y cuándo contratar uno.",
      ogImageAlt: "Qué hace un project manager: responsabilidades, día a día y límites del rol.",
    },
  },
  {
    slug: "presupuesto-de-proyecto",
    title: "Presupuesto de un proyecto: cómo armarlo y controlarlo",
    excerpt:
      "Cómo hacer el presupuesto de un proyecto paso a paso: costos directos e indirectos, reserva de contingencia, margen y el control mensual que detecta el sobrecosto a tiempo.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-08-30",
    readingTime: "11 min",
    featured: true,
    related: ["costos-directos-e-indirectos", "valor-ganado-evm", "como-estimar-tiempos-proyecto"],
    seo: {
      title: "Presupuesto de un proyecto: guía y ejemplo | Hito",
      description:
        "Cómo hacer el presupuesto de un proyecto paso a paso: costos directos e indirectos, contingencia y margen, con ejemplo completo y control mensual anti-sobrecosto.",
      ogImageAlt:
        "Estructura del presupuesto de un proyecto: costos directos, indirectos, contingencia y margen.",
    },
  },
  {
    slug: "costos-directos-e-indirectos",
    title: "Costos directos e indirectos de un proyecto (con ejemplos)",
    excerpt:
      "Qué son los costos directos e indirectos en un proyecto, cómo clasificarlos con una pregunta simple, ejemplos reales y por qué equivocarse revienta el margen.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-09-06",
    readingTime: "9 min",
    featured: false,
    pillar: "presupuesto-de-proyecto",
    related: ["presupuesto-de-proyecto", "sobrecosto-de-proyecto", "plantilla-plan-de-proyecto"],
    seo: {
      title: "Costos directos e indirectos: ejemplos | Hito",
      description:
        "Costos directos e indirectos en un proyecto: qué son, cómo clasificarlos con una pregunta simple, ejemplos reales y el efecto de confundirlos en tu margen.",
      ogImageAlt: "Tabla de costos directos e indirectos de un proyecto con ejemplos.",
    },
  },
  {
    slug: "valor-ganado-evm",
    title: "Valor ganado (EVM): si tu proyecto va bien, en 3 números",
    excerpt:
      "Valor ganado (EVM) sin jerga: PV, EV y AC, las fórmulas de CPI y SPI, un ejemplo numérico completo y hasta dónde vale la pena aplicarlo en equipos pequeños.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-09-13",
    readingTime: "10 min",
    featured: false,
    pillar: "presupuesto-de-proyecto",
    related: ["presupuesto-de-proyecto", "kpis-gestion-proyectos", "ruta-critica-proyecto"],
    seo: {
      title: "Valor ganado EVM: CPI, SPI y ejemplo | Hito",
      description:
        "Valor ganado (EVM) sin jerga: qué son PV, EV y AC, cómo calcular CPI y SPI, un ejemplo numérico completo y cómo usarlo en proyectos pequeños sin burocracia.",
      ogImageAlt: "Valor ganado EVM: PV, EV y AC con fórmulas de CPI y SPI y ejemplo numérico.",
    },
  },
  {
    slug: "sobrecosto-de-proyecto",
    title: "Sobrecosto en proyectos: 7 causas y cómo frenarlo",
    excerpt:
      "Por qué se dispara el costo de un proyecto: 7 causas reales (estimación optimista, scope creep, indirectos ocultos) y el control mensual que lo detecta antes de que sea irreversible.",
    category: "gestion-proyectos",
    categoryLabel: "Gestión de proyectos",
    publishedAt: "2027-09-20",
    readingTime: "10 min",
    featured: false,
    pillar: "presupuesto-de-proyecto",
    related: ["presupuesto-de-proyecto", "alcance-de-proyecto-scope-creep", "proyecto-atrasado-que-hacer"],
    seo: {
      title: "Sobrecosto en proyectos: causas y solución | Hito",
      description:
        "Por qué se dispara el costo de un proyecto: 7 causas reales y cómo detectar el sobrecosto a tiempo con control mensual, umbrales de cambio y contingencia.",
      ogImageAlt: "Sobrecosto en proyectos: causas frecuentes y control mensual de costos.",
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
