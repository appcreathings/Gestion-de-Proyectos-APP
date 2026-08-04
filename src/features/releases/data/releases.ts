import type { ReleaseEntry } from "../types";

/**
 * Historial público de releases (más reciente primero).
 *
 * Fuente de verdad cruzada:
 * - Specs 001-042 (specs/.../spec.md y tasks)
 * - Codigo en src/ (rutas, schemas, features)
 * - Commits de producto
 *
 * Tono brand: entusiasta y especifico. Que cambio y por que importa.
 * No inventar features que no esten en el codigo.
 */
export const RELEASES: ReleaseEntry[] = [
  // ── 2026.08 ──────────────────────────────────────────────────────────
  {
    id: "2026-08-attachments",
    version: "2026.08",
    date: "2026-08-04",
    title: "Anexos multimedia en tu carpeta",
    summary:
      "Spec 042: colgá PDFs, capturas, audio y video a tareas, procesos, áreas y productos. Los binarios viven en tu workspace — no en un CDN de terceros.",
    changes: [
      {
        kind: "feature",
        text: "Anexos locales con schema v17+, carpeta attachments/ (File System Access) y blobs en modo navegador/demo.",
      },
      {
        kind: "feature",
        text: "UI reutilizable de adjuntos + preview de imagen, video y documentos dentro de la app.",
      },
      {
        kind: "improvement",
        text: "Cascada al borrar entidades: se limpian los archivos huérfanos para no ensuciar el disco.",
      },
      {
        kind: "fix",
        text: "MIME correcto en blob URLs y preview de video usable en el diálogo de previsualización.",
      },
    ],
  },
  {
    id: "2026-08-ux-trust",
    version: "2026.08",
    date: "2026-08-03",
    title: "La app te contesta (UX de confianza)",
    summary:
      "Specs 040 (feedback) y 041: toasts propios, guardado veraz, formularios que anuncian errores, y diálogos del editor de flujos a medida del nodo.",
    changes: [
      {
        kind: "feature",
        text: "Canal de feedback con toasts: éxito, error y estado de envío visibles al guardar.",
      },
      {
        kind: "improvement",
        text: "Guardado veraz: si la escritura falla, se revierte el estado en memoria y se avisa — no se finge que quedó guardado.",
      },
      {
        kind: "improvement",
        text: "Errores de formulario en los diálogos principales; teclado en tarjetas y filas clicables.",
      },
      {
        kind: "improvement",
        text: "Editor de flujos: tamaño de diálogo según el tipo de nodo (spec 041).",
      },
      {
        kind: "fix",
        text: "Chat que no tapa el botón +; confirmaciones compactas; Cmd+K con lista a altura útil.",
      },
    ],
  },
  {
    id: "2026-08-blog-clusters",
    version: "2026.08",
    date: "2026-08-03",
    title: "Blog: fundamentos y metodologías",
    summary:
      "Spec 040 blog + ROADMAP_BLOG: se completó el cluster de Fundamentos y arrancó Metodologías — guía completa, RACI, ruta crítica, Scrum vs Kanban, límites WIP…",
    changes: [
      {
        kind: "feature",
        text: "Cluster 1 completo: guía de gestión de proyectos, fases, estimación, scope creep, RACI, ruta crítica, SMART/OKR y riesgos.",
      },
      {
        kind: "feature",
        text: "Cluster 2 en marcha: pilar de metodologías, Scrum vs Kanban, Scrum para equipos chicos y Kanban con límites WIP.",
      },
      {
        kind: "improvement",
        text: "~30 artículos públicos en `/blogs`, con prerender HTML estático para crawlers (spec 040 fase C).",
      },
    ],
  },

  // ── 2026.07 — Flujos e integraciones ─────────────────────────────────
  {
    id: "2026-07-flows-editor",
    version: "2026.07",
    date: "2026-07-22",
    title: "Editor de flujos que se puede confiar",
    summary:
      "Specs 036–039: canvas maximizable, variables de primera clase, deshacer, simulación visible y una sola forma de elegir campos del evento.",
    changes: [
      {
        kind: "feature",
        text: "Canvas maximizable, controles propios, panel de variables y chips arrastrables a los campos.",
      },
      {
        kind: "feature",
        text: "Verdad en el canvas: nodos mal configurados se ven; dry-run y simulación antes de activar.",
      },
      {
        kind: "feature",
        text: "Datos del evento legibles y un único flujo para elegir variables (sin adivinar rutas JSON).",
      },
      {
        kind: "improvement",
        text: "Correcciones de mapeo, condiciones y transformaciones que antes fallaban en silencio.",
      },
    ],
  },
  {
    id: "2026-07-webhooks-make",
    version: "2026.07",
    date: "2026-07-22",
    title: "Round-trip con Make y Zapier",
    summary:
      "Specs 032–034 y fase 1 de 033: webhooks salientes firmables, inbox entrante por polling, delivery log con reenvío y salud por conexión.",
    changes: [
      {
        kind: "feature",
        text: "Firma HMAC saliente verificable y modo Simple (sin firma) para el primer contacto con un iPaaS.",
      },
      {
        kind: "feature",
        text: "Inbox-polling entrante (proxy Apps Script) + botón «Enviar entrega de prueba» en la conexión.",
      },
      {
        kind: "feature",
        text: "Delivery log durable con detalle de respuesta y acción Reenviar; deep-link desde la notificación de fallo al run.",
      },
      {
        kind: "feature",
        text: "Salud por conexión: semáforo de entrada/salida, backlog del inbox y warnings de carga.",
      },
      {
        kind: "improvement",
        text: "Suscripciones de webhook sin pelear con el vault; secretos de webhook migrados a un modelo más simple.",
      },
    ],
  },
  {
    id: "2026-07-flows-product",
    version: "2026.07",
    date: "2026-07-16",
    title: "Flujos listos para producto",
    summary:
      "Specs 019–027: motor unificado, React Flow, dry-run, interpolación real, plantillas de flujo, validación y política de reintentos.",
    changes: [
      {
        kind: "feature",
        text: "Flow Builder unificado (las automatizaciones legacy migran a Flujos) con canvas React Flow.",
      },
      {
        kind: "feature",
        text: "Triggers por evento de dominio y por polling (HubSpot, Sheets); ejecución manual y muestras reales para mapear.",
      },
      {
        kind: "feature",
        text: "Interpolación {{variables}} confiable, debugger panel y persistencia de muestras de evento.",
      },
      {
        kind: "feature",
        text: "Plantillas de flujo, validación pre-activación, organización e historial de corridas.",
      },
      {
        kind: "feature",
        text: "Vault para secretos de integración, cola saliente con reintentos y logs de sync.",
      },
      {
        kind: "improvement",
        text: "Robustez HubSpot/Sheets (errores reales de API, no silencios) y hardening de UX de integraciones.",
      },
    ],
  },

  // ── 2026.07 — Acceso, docs, IA, sitio ────────────────────────────────
  {
    id: "2026-07-access-docs",
    version: "2026.07",
    date: "2026-07-20",
    title: "Abrí la app sin fricción + docs in-house",
    summary:
      "Specs 028–031 y 035: demo local, modo navegador, documentación `/docs`, resiliencia Gemini y blog más rápido.",
    changes: [
      {
        kind: "feature",
        text: "Demo local y modo navegador por defecto (spec 030): probá Hito sin elegir carpeta al primer clic.",
      },
      {
        kind: "feature",
        text: "Documentación pública en `/docs`, organizada por módulo (spec 029).",
      },
      {
        kind: "improvement",
        text: "Resiliencia Gemini ante cuota de proyecto en 0: mensajes claros y fallback entre modelos (specs 006/012/031).",
      },
      {
        kind: "improvement",
        text: "Landing y blog reenfocados a audiencia LatAm (spec 028); blog partido en chunks por artículo (spec 035).",
      },
      {
        kind: "feature",
        text: "Licencia MIT publicada; schema SEO (SoftwareApplication) y breadcrumbs en páginas públicas.",
      },
    ],
  },

  // ── 2026.07 — Experiencia PM y Kanban ────────────────────────────────
  {
    id: "2026-07-pm-kanban",
    version: "2026.07",
    date: "2026-07-06",
    title: "Experiencia PM completa en el Kanban",
    summary:
      "Specs 010–017 (epic de tareas + wave PM): drawer unificado, comentarios, archivo, Mis tareas, Daily, filtros, WIP, estimación y bulk.",
    changes: [
      {
        kind: "feature",
        text: "Drawer de detalle de tarea con edición unificada, summary en card, resize horizontal y menú contextual.",
      },
      {
        kind: "feature",
        text: "Comentarios en tareas, archivado con lista dedicada, tags y subtareas con progreso en la card.",
      },
      {
        kind: "feature",
        text: "Búsqueda y filtros ricos (prioridad, assignee, fecha, tags) persistidos en la URL.",
      },
      {
        kind: "feature",
        text: "Rutas Mis tareas (`/app/my-tasks`) y Daily Standup (`/app/daily`); vista lista además de Kanban.",
      },
      {
        kind: "feature",
        text: "Estimación de esfuerzo, WIP limits por columna, selección múltiple y multi-drag bulk.",
      },
      {
        kind: "feature",
        text: "Carga de trabajo por persona en el Dashboard; drill-down desde KPIs hacia listados filtrados.",
      },
      {
        kind: "improvement",
        text: "UX de drag-and-drop del Kanban (preview de destino, menos saltos) y 2 columnas en tablet.",
      },
      {
        kind: "feature",
        text: "«Mejorar con IA» con selector de modelo inline y fallback automático entre flash/pro.",
      },
    ],
  },
  {
    id: "2026-07-sprints-tree",
    version: "2026.07",
    date: "2026-07-05",
    title: "Sprints, trimestres y árbol de proyectos",
    summary:
      "Spec 008: la jerarquía que mostraba el mockup de la landing — por fin existe en la app.",
    changes: [
      {
        kind: "feature",
        text: "Sprints por proyecto y página de Trimestres; switcher de sprint en el tablero.",
      },
      {
        kind: "feature",
        text: "Árbol de proyectos en el sidebar (producto → proyectos) con navegación directa.",
      },
    ],
  },

  // ── 2026.07 — Marca, blog, IA core ───────────────────────────────────
  {
    id: "2026-07-brand-ai",
    version: "2026.07",
    date: "2026-07-05",
    title: "Hito, blog público y asistente con MCP + RAG",
    summary:
      "Specs 004–007 y 009 + hitos M9–M11: rebrand a Hito, landing, tools estilo MCP, embeddings locales y chat global.",
    changes: [
      {
        kind: "feature",
        text: "Rebrand a Hito (hito.autos), landing pública, app bajo `/app/*`, PWA e ícono de mojón.",
      },
      {
        kind: "feature",
        text: "Blog `/blogs` con artículos SEO (local-first, comparativas, guías) y páginas satélite (alternativa Trello/Notion, gestor offline).",
      },
      {
        kind: "feature",
        text: "Capa de tools estilo MCP (lectura/escritura con Zod), cliente Gemini en streaming y confirmación antes de escribir.",
      },
      {
        kind: "feature",
        text: "RAG semántico local: embeddings e índice para que el asistente encuentre por significado, no solo por nombre.",
      },
      {
        kind: "feature",
        text: "Panel de chat global (Cmd/Ctrl+J), registry de modelos y rate-limit consciente.",
      },
      {
        kind: "improvement",
        text: "Tools MCP refactorizados en módulos tipados (spec 005) en lugar de monolitos.",
      },
    ],
  },

  // ── 2026.05–06 — Núcleo ──────────────────────────────────────────────
  {
    id: "2026-06-daily-polish",
    version: "2026.06",
    date: "2026-06",
    title: "Uso diario: Kanban DnD, actividad y command palette",
    summary:
      "M7–M8 + specs 002–003: reordenar por arrastre, historial de actividad, automatizaciones por proyecto y Cmd+K.",
    changes: [
      {
        kind: "feature",
        text: "Kanban con drag-and-drop (dnd-kit) y fallback de teclado «Mover».",
      },
      {
        kind: "feature",
        text: "Tab Actividad por proyecto (cap 500 entradas) con deep-links al foco.",
      },
      {
        kind: "feature",
        text: "Command palette (Cmd/Ctrl+K): proyectos, productos, plantillas y acciones rápidas.",
      },
      {
        kind: "feature",
        text: "Reordenar por arrastre: ítems de checklist, pasos de proceso, áreas y plantillas.",
      },
      {
        kind: "improvement",
        text: "Sistema de diseño unificado (headers, empty states, badges, cards) — spec 002.",
      },
      {
        kind: "feature",
        text: "Nombre de organización editable; tab de automatizaciones filtrado al proyecto actual.",
      },
    ],
  },
  {
    id: "2026-05-core",
    version: "2026.05",
    date: "2026-05",
    title: "Núcleo local-first (M0–M6)",
    summary:
      "Spec 001: productos, proyectos, áreas, SOPs, checklists, Kanban, plantillas, automatizaciones temporales, notificaciones y dashboard CEO — todo en JSON en tu carpeta.",
    changes: [
      {
        kind: "feature",
        text: "Storage local-first: File System Access API + fallback IndexedDB/export; schema Zod y migraciones versionadas.",
      },
      {
        kind: "feature",
        text: "CRUD de productos, proyectos, áreas, procesos (Markdown), checklists, tareas y personas.",
      },
      {
        kind: "feature",
        text: "Biblioteca: tipos de proyecto, plantillas de checklist y de proceso; crear proyecto desde tipo.",
      },
      {
        kind: "feature",
        text: "Automatizaciones trigger → condición → acción (estado, plantillas, recordatorios) con motor puro e idempotente.",
      },
      {
        kind: "feature",
        text: "Fechas y notificaciones: vencidos, por vencer, estancados, checklists recurrentes y centro in-app.",
      },
      {
        kind: "feature",
        text: "Dashboard de portafolio: KPIs, salud RAG (manual + derivada), proyectos estancados y resumen del día.",
      },
      {
        kind: "feature",
        text: "Export/import por colección, backups antes de migrar, empty states y a11y base.",
      },
    ],
  },
];
