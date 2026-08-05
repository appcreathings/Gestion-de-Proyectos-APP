/** Helpers para Task.links (spec 043). */

/** Tope de links por tarea (spec 043 D8). */
export const MAX_TASK_LINKS = 20;

export type NormalizeTaskLinkResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Normaliza y valida una URL de link de tarea.
 * - trim
 * - antepone `https://` si no hay esquema
 * - solo `http:` / `https:`
 */
export function normalizeTaskLinkUrl(raw: string): NormalizeTaskLinkResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Pega una URL." };
  }

  let candidate = trimmed;
  if (!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, error: "Esa URL no es válida." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Solo se permiten links http o https." };
  }

  if (!parsed.hostname) {
    return { ok: false, error: "Esa URL no es válida." };
  }

  return { ok: true, url: parsed.href };
}

/**
 * Texto visible del botón: etiqueta si hay; si no, hostname sin `www.`.
 */
export function taskLinkDisplayLabel(link: { url: string; label: string }): string {
  const label = link.label.trim();
  if (label) return label;

  try {
    const host = new URL(link.url).hostname.replace(/^www\./i, "");
    return host || link.url;
  } catch {
    return link.url;
  }
}
