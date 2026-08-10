import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "reuniones-de-status-eliminar",
  title: "Reemplazar reuniones de status por un tablero",
  excerpt:
    "La reunión de status no informa a nadie: confirma en voz alta lo que un tablero ya muestra. Cómo migrar a un tablero + update escrito sin perder visibilidad.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-02-15",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "gestionar-varios-proyectos-a-la-vez",
  related: [
    "gestionar-varios-proyectos-a-la-vez",
    "daily-standup-util",
    "seguimiento-de-tareas-equipo",
    "reducir-trabajo-en-curso",
  ],
  seo: {
    title: "Reemplazar reuniones de status por un tablero | Hito",
    description:
      "La reunión de status no informa a nadie: confirma en voz alta lo que un tablero ya muestra. Cómo migrar a un tablero + update escrito sin perder visibilidad.",
    ogImageAlt: "Reemplazar reuniones de status por un tablero y un update escrito.",
  },
  content: {
    eyebrow: "Tips y problemas reales",
    intro: (
      <>
        <strong>En una línea:</strong> si tu reunión de status consiste en que cada persona diga
        en qué está trabajando mientras el resto espera su turno, no es una reunión — es un{" "}
        <strong>tablero leído en voz alta</strong>. La solución no es eliminarla de un día para el
        otro: es reemplazar la parte informativa por un tablero visible más un update escrito
        semanal, y reservar el tiempo síncrono solo para lo que realmente necesita conversación.
      </>
    ),
    sections: [
      {
        heading: "Por qué la reunión de status sobrevive aunque todos la odian",
        body: (
          <>
            <p>
              Nadie diseña la reunión de status semanal de 45 minutos a propósito. Nace chica —
              “juntémonos 15 minutos el lunes”— y crece porque nadie la audita después de que deja
              de funcionar. Sobrevive por tres razones, casi nunca por su valor real:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Ansiedad de visibilidad:</strong> el lead no confía en que el trabajo
                avanza si no lo escucha decir en voz alta.
              </li>
              <li>
                <strong>Inercia de calendario:</strong> está agendada hace un año; cancelarla se
                siente más arriesgado que sostenerla.
              </li>
              <li>
                <strong>Falta de alternativa visible:</strong> si no hay un tablero que todos
                miren, la reunión es el único lugar donde “se sabe” qué está pasando.
              </li>
            </ul>
            <p>
              El costo real no es el tiempo de la reunión en sí — es el tiempo × personas. Diez
              personas en 30 minutos son 5 horas-persona semanales para transmitir información que
              cabría en un tablero actualizado.
            </p>
          </>
        ),
      },
      {
        heading: "El test: ¿esta reunión debería ser un tablero?",
        body: (
          <>
            <p>Antes de cortar nada, clasificá lo que pasa en la reunión actual en dos baldes:</p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Si en la reunión...</th>
                  <th className="py-2 font-semibold">Entonces es...</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cada uno dice “sigo con X, todo bien”
                  </td>
                  <td className="py-2 text-muted-foreground">Información → tablero</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Alguien lee una lista de tareas terminadas
                  </td>
                  <td className="py-2 text-muted-foreground">Información → tablero</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Dos personas negocian una dependencia o prioridad
                  </td>
                  <td className="py-2 text-muted-foreground">Decisión → reunión</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Se destraba un bloqueo entre áreas
                  </td>
                  <td className="py-2 text-muted-foreground">Decisión → reunión</td>
                </tr>
              </tbody>
            </table>
            <p>
              Si el 80% de tu reunión de status es la columna izquierda, ya tenés el diagnóstico:
              sobra información, falta decisión. Ese es exactamente el patrón que describimos en{" "}
              <Link
                to="/blogs/gestionar-varios-proyectos-a-la-vez"
                className="underline underline-offset-2"
              >
                cómo gestionar varios proyectos a la vez
              </Link>
              , donde las reuniones de status multiplican el cambio de contexto sin agregar
              decisión.
            </p>
          </>
        ),
      },
      {
        heading: "El reemplazo: tablero siempre visible + update escrito semanal",
        body: (
          <>
            <p>El sistema mínimo tiene dos piezas, no una:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Tablero vivo:</strong> cada tarea con su estado real, actualizado por quien
                la hace — no por alguien que pregunta y transcribe.
              </li>
              <li>
                <strong>Update escrito semanal (5-8 líneas):</strong> lo que el tablero no muestra
                por sí solo — riesgos, decisiones pendientes, cambios de fecha.
              </li>
            </ol>
            <p>
              El tablero resuelve “¿en qué está cada cosa?”. El update resuelve “¿qué necesito
              saber que no está en una tarjeta?”. Ninguno de los dos reemplaza al otro.
            </p>
          </>
        ),
      },
      {
        heading: "Qué SÍ sigue necesitando una reunión síncrona",
        body: (
          <>
            <p>Eliminar el status no significa eliminar toda sincronía. Mantené reunión cuando:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Hay una decisión con dueños en conflicto que necesita negociarse en vivo.</li>
              <li>Un bloqueo cruza dos equipos y nadie tiene autoridad para resolverlo solo.</li>
              <li>
                Es una ceremonia de valor probado, como una{" "}
                <Link
                  to="/blogs/retrospectivas-formatos"
                  className="underline underline-offset-2"
                >
                  retrospectiva
                </Link>{" "}
                o un{" "}
                <Link
                  to="/blogs/sprint-planning-como-hacerlo"
                  className="underline underline-offset-2"
                >
                  sprint planning
                </Link>
                .
              </li>
              <li>
                Un{" "}
                <Link to="/blogs/daily-standup-util" className="underline underline-offset-2">
                  daily corto
                </Link>{" "}
                sigue teniendo sentido si el equipo trabaja muy acoplado día a día — la diferencia
                con el status semanal es que el daily es de bloqueos, no de reporte.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Cómo hacer la transición sin generar pánico",
        body: (
          <>
            <p>
              Cancelar la reunión de un día para el otro genera ansiedad (“¿ahora cómo sé qué
              pasa?”). Anunciá el cambio con una plantilla corta:
            </p>
            <p className="rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              “Desde el [fecha] reemplazamos el status del [día] por: (1) tablero actualizado por
              cada uno al cerrar el día, y (2) un update escrito los viernes con riesgos y
              decisiones pendientes. La reunión sigue existiendo, pero solo si hay algo puntual
              que resolver — la convoco yo con agenda clara. Si algo no está claro en el tablero,
              preguntá ahí mismo en la tarjeta.”
            </p>
            <p>
              Probá 3 semanas antes de declarar éxito o fracaso. La primera semana casi siempre se
              siente rara — es el equipo aprendiendo a escribir en el tablero en vez de guardarlo
              para el lunes.
            </p>
          </>
        ),
      },
      {
        heading: "Formato del update escrito (lo que reemplaza al reporte oral)",
        body: (
          <>
            <p className="rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <strong>Esta semana:</strong> 2-3 líneas de lo entregado.
              <br />
              <strong>Riesgos:</strong> qué puede mover una fecha, y desde cuándo se sabe.
              <br />
              <strong>Decisión pendiente:</strong> qué necesita que alguien defina, y quién.
              <br />
              <strong>Próxima semana:</strong> 1-2 líneas del foco.
            </p>
            <p>
              Si un proyecto no tiene nada nuevo que decir en riesgos o decisiones, ese es el
              mejor update posible: “verde, sin cambios” en una línea vale más que una reunión de
              10 minutos confirmándolo.
            </p>
          </>
        ),
      },
      {
        heading: "Errores comunes al eliminar reuniones de status",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Eliminar sin reemplazo:</strong> sin tablero ni update, la información no
                desaparece del proyecto, desaparece de la vista — y reaparece como sorpresa.
              </li>
              <li>
                <strong>Tablero desactualizado:</strong> si nadie lo toca entre reuniones, el
                tablero es tan inútil como la reunión que reemplazó. El hábito de actualizarlo se
                construye, no se asume.
              </li>
              <li>
                <strong>Convertir el update escrito en otra reunión:</strong> si el update necesita
                que alguien lo “presente”, no ahorraste nada.
              </li>
              <li>
                <strong>No dar una vía para decisiones urgentes:</strong> sin reunión default, hace
                falta un canal claro para pedir una síncrona puntual cuando sí hace falta.
              </li>
            </ul>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo reemplazar la reunión de status por un tablero",
      steps: [
        {
          name: "Auditar la última reunión",
          text: "Clasificá cada intervención en información (va al tablero) o decisión (necesita reunión). Si la mayoría es información, hay reemplazo posible.",
        },
        {
          name: "Poner el tablero al día como fuente única",
          text: "Cada tarea con estado real, actualizado por quien la ejecuta, visible para todos los que antes escuchaban el status.",
        },
        {
          name: "Definir el formato del update escrito",
          text: "4 bloques fijos: esta semana, riesgos, decisión pendiente, próxima semana. Máximo 8 líneas.",
        },
        {
          name: "Anunciar el cambio con fecha y vía de excepción",
          text: "Comunicá qué reemplaza a qué y cómo pedir una reunión puntual si surge algo que sí necesita síncrono.",
        },
        {
          name: "Revisar a las 3 semanas",
          text: "Preguntá si algo se perdió en el camino. Ajustá el formato del update antes de volver a la reunión vieja por default.",
        },
      ],
    },
    faq: [
      {
        question: "¿Eliminar el status significa que nadie se junta nunca?",
        answer:
          "No. Se elimina la reunión recurrente de puro reporte; las reuniones que resuelven una decisión o un bloqueo entre personas siguen existiendo, convocadas puntualmente y con agenda.",
      },
      {
        question: "¿Y si el cliente o un stakeholder externo pide la reunión semanal igual?",
        answer:
          "Podés ofrecer el update escrito como reemplazo y reservar 15 minutos síncronos solo si, leyéndolo, queda algo por decidir. Muchos stakeholders prefieren el update escrito porque pueden leerlo cuando les sirve.",
      },
      {
        question: "¿Cuánto tarda un equipo en acostumbrarse a actualizar el tablero solo?",
        answer:
          "Entre 2 y 3 semanas si alguien recuerda el hábito activamente los primeros días. Después se vuelve más rápido que esperar a la reunión para contarlo.",
      },
      {
        question: "¿Sirve esto para equipos remotos y para presenciales por igual?",
        answer:
          "Funciona mejor todavía en remoto o híbrido, porque el tablero y el update escrito no dependen de que todos coincidan en horario. En equipos muy presenciales, el daily corto puede seguir aportando algo que el update no reemplaza: la conversación espontánea.",
      },
    ],
  },
};
