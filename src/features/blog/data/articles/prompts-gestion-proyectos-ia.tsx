import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
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
  content: {
    eyebrow: "Inteligencia artificial",
    intro: (
      <>
        <strong>En una línea:</strong> un buen prompt para un asistente de IA de gestión de
        proyectos no es un pedido genérico ("ayúdame a organizarme") — es una instrucción
        concreta que la IA puede ejecutar sobre tus datos reales. Estos 10 prompts están
        pensados para el asistente de Hito, que puede crear tareas, resumir proyectos y buscar
        en tu workspace de verdad, no solo conversar sobre ellos.
      </>
    ),
    sections: [
      {
        heading: "Los 10 prompts",
        body: (
          <>
            <p>
              Si le pides a un asistente genérico "ayúdame a priorizar mi semana", te va a
              devolver un consejo genérico. Si tu asistente está integrado a tu gestor de
              proyectos —como el de Hito, que actúa sobre tus tareas y proyectos reales mediante
              function calling— el mismo tipo de pedido puede convertirse en una acción
              concreta. La diferencia está en cómo lo pides.
            </p>
            <ol className="list-decimal space-y-4 pl-6 text-muted-foreground">
              <li>
                <strong>"Dame un resumen del estado de todos mis proyectos activos."</strong>
                <p className="mt-1">
                  Dispara un resumen general del workspace: proyectos, salud y alertas, sin que
                  tengas que entrar proyecto por proyecto.
                </p>
              </li>
              <li>
                <strong>"¿Qué tareas están bloqueadas en el proyecto [nombre]?"</strong>
                <p className="mt-1">
                  Filtra las tareas de ese proyecto por estado "bloqueada", para que sepas
                  exactamente dónde intervenir antes de la próxima reunión de equipo.
                </p>
              </li>
              <li>
                <strong>
                  "Crea una tarea en [proyecto]: 'Revisar contrato con legal', prioridad alta,
                  vence el viernes."
                </strong>
                <p className="mt-1">
                  Crea la tarea directamente en el proyecto indicado, con prioridad y fecha de
                  vencimiento — sin abrir el formulario manualmente.
                </p>
              </li>
              <li>
                <strong>
                  "Busca todo lo relacionado a 'migración de datos' en mi workspace."
                </strong>
                <p className="mt-1">
                  Ejecuta una búsqueda semántica sobre tus proyectos, tareas y procesos —
                  encuentra menciones relevantes aunque no uses exactamente esas palabras en el
                  texto original.
                </p>
              </li>
              <li>
                <strong>
                  "Crea un proyecto nuevo a partir del tipo 'Implementación de cliente'."
                </strong>
                <p className="mt-1">
                  Si ya tienes un tipo de proyecto definido con su estructura estándar, este
                  prompt te ahorra recrear áreas y procesos desde cero cada vez.
                </p>
              </li>
              <li>
                <strong>"Actualiza la tarea 'Enviar propuesta' a completada."</strong>
                <p className="mt-1">
                  Cambia el estado de una tarea puntual sin que tengas que ubicarla manualmente
                  en el kanban.
                </p>
              </li>
              <li>
                <strong>"Dame la salud del proyecto [nombre]: ¿está en riesgo?"</strong>
                <p className="mt-1">
                  Pide un diagnóstico puntual de un proyecto específico — útil antes de un
                  check-in con un cliente o con tu equipo directivo.
                </p>
              </li>
              <li>
                <strong>
                  "Crea un proceso llamado 'Cierre de sprint' con estos pasos: revisar backlog,
                  actualizar estimaciones, retro del equipo, planificar el siguiente sprint."
                </strong>
                <p className="mt-1">
                  Genera un SOP nuevo en tu biblioteca de procesos, listo para aplicar al
                  próximo sprint.
                </p>
              </li>
              <li>
                <strong>
                  "Agrega un ítem a la checklist de onboarding: 'Confirmar acceso al
                  repositorio'."
                </strong>
                <p className="mt-1">
                  Suma un paso puntual a una checklist existente sin abrir el editor de
                  plantillas.
                </p>
              </li>
              <li>
                <strong>
                  "Dame un overview completo: productos activos, proyectos en riesgo y
                  notificaciones pendientes."
                </strong>
                <p className="mt-1">
                  El pedido más amplio de la lista — junta varias fuentes de tu workspace en una
                  sola respuesta, útil para arrancar el lunes con contexto completo.
                </p>
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Cómo escribir tus propios prompts",
        body: (
          <>
            <p>
              La regla general: nombra la entidad exacta (proyecto, tarea, checklist) y el
              resultado que quieres, en lugar de pedir algo abstracto. "Ayúdame con el proyecto
              X" es ambiguo. "Dame la salud del proyecto X" o "crea una tarea en el proyecto X"
              son instrucciones que el asistente puede ejecutar porque mapean directamente a una
              acción concreta sobre tus datos.
            </p>
            <p>
              Vale la pena recordar el trade-off de privacidad: el asistente de Hito usa{" "}
              <a
                href="https://hito.autos/blogs/que-es-mcp"
                target="_blank"
                rel="noopener noreferrer"
              >
                function calling nativo y RAG local
              </a>
              , pero para responder, el contenido relevante de tu workspace viaja a la API de
              Gemini con tu propia API key. Si no quieres activar el asistente, el resto de Hito
              —incluyendo{" "}
              <a
                href="https://hito.autos/blogs/como-priorizar-tareas"
                target="_blank"
                rel="noopener noreferrer"
              >
                priorizar tus tareas con cualquiera de estos métodos
              </a>
              — sigue funcionando 100% local.
            </p>
          </>
        ),
      },
      {
        heading: "Conclusión",
        body: (
          <>
            <p>
              Los prompts más útiles para un asistente de gestión de proyectos no son los más
              creativos, son los más específicos. Copia estos 10, adáptalos a tus proyectos
              reales, y vas a notar la diferencia entre pedirle consejo a una IA y pedirle que
              haga el trabajo.
            </p>
            <p>
              👉{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                <strong>Prueba Hito gratis</strong>
              </a>{" "}
              — gestor de proyectos, procesos y checklists 100% local-first, con un asistente de
              IA opcional que tú controlas con tu propia API key.
            </p>
          </>
        ),
      },
    ],
  },
};
