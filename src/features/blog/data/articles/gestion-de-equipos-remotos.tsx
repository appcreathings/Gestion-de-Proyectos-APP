import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "gestion-de-equipos-remotos",
  title: "Gestión de equipos remotos: cómo coordinar proyectos sin estar en la misma oficina",
  excerpt:
    "Un equipo remoto no necesita más reuniones sino más claridad: trabajo asíncrono, un tablero como fuente de verdad, acuerdos de equipo, ritmo de comunicación y métricas de resultados, no de presencia.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-10-23",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "seguimiento-de-tareas-equipo",
  related: [
    "seguimiento-de-tareas-equipo",
    "reuniones-de-status-eliminar",
    "daily-standup-util",
    "plan-de-comunicacion-proyecto",
  ],
  seo: {
    title: "Gestión de equipos remotos: guía práctica | Hito",
    description:
      "Gestión de equipos remotos: trabajo asíncrono, tablero como fuente de verdad, acuerdos de equipo, ritmo de reuniones y cómo medir resultados en lugar de presencia.",
    ogImageAlt: "Equipo remoto coordinado con un tablero de tareas compartido.",
  },
  content: {
    eyebrow: "Equipos y comunicación",
    intro: (
      <>
        <strong>En una línea:</strong> en un equipo remoto el trabajo deja de verse, así que la
        gestión consiste en volverlo visible con pocas reglas claras: qué se hace, quién lo hace,
        cuándo se entrega y dónde se habla de ello.
      </>
    ),
    sections: [
      {
        heading: "Por qué fallan los equipos remotos (y no es el café)",
        body: (
          <>
            <p>
              En una oficina, mucha coordinación ocurre por casualidad: oyes que alguien está
              bloqueado, ves quién no ha almorzado, notas el ánimo del equipo. En remoto nada de
              eso es automático. Lo que sí aparece es lo contrario: reuniones de más para
              compensar la falta de visibilidad, mensajes que esperan horas, decisiones que se
              repiten porque nadie sabe qué se acordó.
            </p>
            <p>
              La respuesta casi nunca es «más videollamadas». Es cambiar el modo por defecto: de
              coordinarse hablando a coordinarse escribiendo, con una fuente de verdad visible
              para todos. La reunión pasa de ser el mecanismo a ser la excepción.
            </p>
          </>
        ),
      },
      {
        heading: "Las 5 bases de un equipo remoto que funciona",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Trabajo asíncrono por defecto.</strong> Un mensaje debería poder
                responderse en horas, no en minutos, y debe contener todo lo necesario para
                actuar sin pedir contexto. «¿Tienes un minuto?» es el anti-patrón: obliga a la
                otra persona a interrumpirse sin saber para qué.
              </li>
              <li>
                <strong>Un tablero como fuente de verdad.</strong> Todo trabajo vive en una
                tarea con responsable, fecha y estado. Si no está en el tablero, no existe. Un{" "}
                <Link to="/blogs/tablero-kanban" className="underline underline-offset-2">
                  tablero Kanban
                </Link>{" "}
                reemplaza gran parte de las preguntas de «¿cómo vas con eso?».
              </li>
              <li>
                <strong>Acuerdos de equipo escritos.</strong> Una página con las reglas: horario
                de solapamiento, tiempo de respuesta esperado por canal, qué va por chat y qué
                por correo, cómo se avisa de un bloqueo. Lo que no se escribe se asume distinto
                en cada cabeza.
              </li>
              <li>
                <strong>Ritmo de comunicación predecible.</strong> Pocas reuniones fijas, con
                agenda y notas escritas. Ver más abajo.
              </li>
              <li>
                <strong>Medir resultados, no presencia.</strong> Entregables y hitos, no horas
                conectado. Medir presencia incentiva parecer ocupado; medir resultados incentiva
                terminar.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "El ritmo semanal mínimo",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Ritual</th>
                  <th className="py-2 pr-4 font-semibold">Formato</th>
                  <th className="py-2 font-semibold">Para qué</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Standup diario</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Escrito, 3 líneas (hice, haré, bloqueos)
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Visibilidad sin interrumpir. Ver{" "}
                    <Link to="/blogs/daily-standup-util" className="underline underline-offset-2">
                      daily standup útil
                    </Link>
                    .
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Planificación semanal</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Videollamada corta (30 min)
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Alinear prioridades de la semana.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Informe de estado</td>
                  <td className="py-2 pr-4 text-muted-foreground">Escrito, viernes</td>
                  <td className="py-2 text-muted-foreground">
                    Reemplaza la reunión de status. Ver{" "}
                    <Link
                      to="/blogs/reuniones-de-status-eliminar"
                      className="underline underline-offset-2"
                    >
                      reemplazar reuniones de status
                    </Link>
                    .
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">1 a 1</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Videollamada, 30 min cada 1–2 semanas
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Lo que no se ve en el tablero: ánimo, carga, crecimiento. Ver{" "}
                    <Link to="/blogs/reuniones-1a1" className="underline underline-offset-2">
                      reuniones 1 a 1
                    </Link>
                    .
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Con esto se cubre lo esencial. Si necesitas más reuniones, primero pregúntate qué
              información falta en el tablero o en los informes escritos.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo montar el sistema en 5 pasos",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Escribe los acuerdos de equipo (1 hora).</strong> Canales, horarios,
                tiempos de respuesta y cómo se escalan los bloqueos. Una página, revisada con el
                equipo.
              </li>
              <li>
                <strong>Monta el tablero (1 hora).</strong> Columnas simples (por hacer, en curso,
                en revisión, hecho) y cada tarea con responsable y fecha. Ver{" "}
                <Link to="/blogs/seguimiento-de-tareas-equipo" className="underline underline-offset-2">
                  seguimiento de tareas sin microgestionar
                </Link>
                .
              </li>
              <li>
                <strong>Define el ritmo semanal.</strong> Los cuatro rituales de la tabla,
                con día y hora fijos.
              </li>
              <li>
                <strong>Documenta decisiones.</strong> Cada decisión importante queda escrita en
                un lugar fijo, con fecha y razón. Evita que se repita la misma discusión.
              </li>
              <li>
                <strong>Revisa a las 4 semanas.</strong> Pregunta al equipo qué sobra y qué falta.
                El sistema se ajusta; no se hereda.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Zonas horarias, confianza y errores comunes",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Zonas horarias.</strong> Define una ventana de solapamiento de 2–3 horas
                para lo sincrónico y trabaja el resto de forma asíncrona. Evita rotar siempre la
                incomodidad a las mismas personas.
              </li>
              <li>
                <strong>Microgestión por herramienta.</strong> Software de vigilancia y mensajes
                constantes de «¿estás ahí?» destruyen la confianza. Si no confías en que alguien
                trabaje, el problema no se resuelve con monitoreo.
              </li>
              <li>
                <strong>Delegar sin criterio de «hecho».</strong> En remoto, una tarea sin
                definición clara de cuándo está terminada genera idas y vueltas. Usa una{" "}
                <Link to="/blogs/definition-of-done" className="underline underline-offset-2">
                  definición de hecho
                </Link>{" "}
                y{" "}
                <Link to="/blogs/como-delegar-tareas" className="underline underline-offset-2">
                  delega con claridad
                </Link>
                .
              </li>
              <li>
                <strong>Descuidar lo humano.</strong> Sin pasillos, el contacto informal
                desaparece. Reserva espacio para conversación no laboral y atiende señales de
                aislamiento en los 1 a 1.
              </li>
            </ul>
            <p>
              Las herramientas importan menos que las reglas, pero una que ponga tareas,
              plantillas y asistente en un mismo sitio reduce fricción. Con{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              tu equipo coordina proyectos con tableros y checklists, y los datos quedan en
              archivos de una carpeta tuya, sin cuenta ni nube.
            </p>
            <p>
              👉{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                <strong>Prueba Hito gratis</strong>
              </a>{" "}
              — coordinación de equipo clara, local-first.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo montar la gestión de un equipo remoto",
      steps: [
        {
          name: "Escribe los acuerdos de equipo",
          text: "Una página con canales, horarios de solapamiento, tiempos de respuesta y cómo escalar bloqueos.",
        },
        {
          name: "Monta el tablero de tareas",
          text: "Columnas simples y cada tarea con responsable y fecha; si no está en el tablero, no existe.",
        },
        {
          name: "Define el ritmo semanal",
          text: "Standup escrito diario, planificación semanal corta, informe de estado escrito y 1 a 1 periódicos.",
        },
        {
          name: "Documenta las decisiones",
          text: "Registra cada decisión importante con fecha y razón en un lugar fijo.",
        },
        {
          name: "Revisa a las cuatro semanas",
          text: "Pregunta al equipo qué sobra y qué falta y ajusta el sistema.",
        },
      ],
    },
    faq: [
      {
        question: "¿Cómo se gestiona un equipo remoto?",
        answer:
          "Haciendo visible el trabajo con pocas reglas claras: comunicación asíncrona por defecto, un tablero compartido como fuente de verdad, acuerdos de equipo escritos, un ritmo semanal predecible de reuniones y medición por resultados en lugar de presencia.",
      },
      {
        question: "¿Qué herramientas necesita un equipo remoto?",
        answer:
          "Lo mínimo: un tablero de tareas compartido, un canal de mensajería, videollamadas para reuniones puntuales y un lugar para documentación y decisiones. Las reglas de uso importan más que la marca de la herramienta.",
      },
      {
        question: "¿Cuántas reuniones debe tener un equipo remoto?",
        answer:
          "Las mínimas: una planificación semanal corta, 1 a 1 periódicos y reuniones puntuales para temas complejos. El standup y el informe de estado pueden hacerse por escrito. Si hacen falta más, suele faltar información visible en el tablero.",
      },
      {
        question: "¿Cómo manejar zonas horarias distintas?",
        answer:
          "Define una ventana de solapamiento de 2–3 horas para lo sincrónico y trabaja el resto de forma asíncrona, con mensajes que incluyan todo el contexto necesario. Rota la incomodidad de horarios entre el equipo en lugar de cargarla siempre a las mismas personas.",
      },
      {
        question: "¿Cómo medir el rendimiento de un equipo remoto?",
        answer:
          "Por entregables, hitos cumplidos y calidad, no por horas conectado. Medir presencia incentiva parecer ocupado; medir resultados incentiva terminar el trabajo.",
      },
    ],
  },
};
