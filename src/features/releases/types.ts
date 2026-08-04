/** Horizonte del roadmap público. */
export type RoadmapHorizon = "now" | "next" | "later";

/** Estado de un ítem del roadmap. */
export type RoadmapStatus = "planned" | "in_progress" | "shipped";

export type RoadmapItem = {
  id: string;
  title: string;
  description: string;
  horizon: RoadmapHorizon;
  status: RoadmapStatus;
  /** Área del producto (opcional, para filtrar visualmente). */
  area?: string;
};

/** Tipo de cambio dentro de un release. */
export type ReleaseChangeKind = "feature" | "improvement" | "fix";

export type ReleaseChange = {
  kind: ReleaseChangeKind;
  text: string;
};

export type ReleaseEntry = {
  /** Identificador estable para anclas (#v1-4). */
  id: string;
  /** Etiqueta visible (v1.4, 2026-08, M9–M11…). */
  version: string;
  /** Fecha ISO (YYYY-MM-DD) o mes (YYYY-MM) para orden y display. */
  date: string;
  /** Título corto del release. */
  title: string;
  /** Resumen en 1–2 frases. */
  summary?: string;
  changes: ReleaseChange[];
};
