/**
 * Ventana del historial que se envía al modelo en cada turno (spec 050 D8 / HU-06).
 * La UI sigue mostrando hasta `MAX_PERSISTED_MESSAGES`; solo el envío al proveedor
 * se recorta a las últimas N entradas. El array almacenado en el store NO se muta.
 */

/** Tamaño máximo del historial enviado al modelo por turno (D8). */
export const AGENT_HISTORY_WINDOW = 12;

/**
 * Recorta el historial a las últimas `max` entradas. No muta el array original.
 * Si `history.length <= max`, devuelve el mismo array (sin copia).
 */
export function trimAgentHistory<T>(history: T[], max: number = AGENT_HISTORY_WINDOW): T[] {
  if (history.length <= max) return history;
  return history.slice(history.length - max);
}
