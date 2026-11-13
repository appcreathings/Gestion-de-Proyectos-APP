/**
 * Eventos de Umami (script en index.html). Nunca enviar contenido del usuario
 * (nombres de proyectos, tareas, repos): Hito es local-first y solo se miden
 * acciones anónimas.
 *
 * Los clics en enlaces se miden sin código con `data-umami-event` en el JSX.
 */
type UmamiData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (event: string, data?: UmamiData) => void };
  }
}

export function track(event: string, data?: UmamiData): void {
  try {
    window.umami?.track(event, data);
  } catch {
    /* bloqueado por el navegador o un adblocker: no debe romper la app */
  }
}
