/**
 * Heurística de skip RAG (spec 050 D7 / HU-06). Mensajes que no se benefician
 * de embeddings (continuaciones cortas, slash expandido, chips marcados) no
 * pagan el round-trip de `buildRagContext`.
 *
 * Lista blanca explícita — el texto libre largo siempre puede usar RAG (CA-06.5).
 */

/** Continuaciones cortas habituales en español (la → el resto del porte). */
const CONTINUATIONS = new Set([
  "continúa",
  "continua",
  "continuar",
  "sí",
  "si",
  "ok",
  "okay",
  "dale",
  "prosegui",
  "proseguí",
  "sigue",
  "seguí",
  "sigue",
  "avanzá",
  "avanza",
  "next",
  "siguiente",
]);

/**
 * Decide si el turno actual debe saltear RAG.
 *
 * - `explicitFlag`: chip marcado `skipRag: true` o slash expandido → siempre skip.
 * - Mensaje normalizado exacto en la lista de continuaciones → skip.
 * - Empieza con `/` (llegó crudo, raro pero defensivo) → skip.
 */
export function shouldSkipRag(text: string, explicitFlag?: boolean): boolean {
  if (explicitFlag) return true;
  const n = text.trim().toLowerCase();
  if (!n) return false;
  if (CONTINUATIONS.has(n)) return true;
  if (n.startsWith("/")) return true;
  return false;
}
