import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "seguimiento-de-tareas-equipo",
  title: "Seguimiento de tareas sin microgestionar",
  excerpt:
    "Preguntar todos los días “¿cómo vas?” no es seguimiento, es ansiedad con forma de mensaje. Un sistema de visibilidad pull que reemplaza el pedido de reportes.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-03-08",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
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
  content: {
    eyebrow: "Tips y problemas reales",
    intro: (
      <>
        <strong>En una línea:</strong> hacer seguimiento no es preguntar seguido — es diseñar un
        sistema donde <strong>vos podés ver el estado sin interrumpir</strong> a nadie, y donde la
        persona sabe exactamente cuándo escalar sola. La microgestión no nace de preocuparse por
        el trabajo del equipo; nace de no tener otra forma de saber cómo va.
      </>
    ),
    sections: [
      {
        heading: "La línea entre seguimiento y microgestión",
        body: (
          <>
            <p>
              Ambos parten de la misma intención — que el trabajo avance —, pero se sienten
              radicalmente distintos del otro lado:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Seguimiento</th>
                  <th className="py-2 font-semibold">Microgestión</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Vos mirás el tablero cuando necesitás saber
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Le pedís a la persona que te reporte
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Preguntás sobre el resultado o el bloqueo
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Preguntás sobre el método paso a paso
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Frecuencia según el riesgo de la tarea
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Frecuencia según tu ansiedad del día
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La diferencia clave es <strong>quién genera el movimiento</strong>: en el
              seguimiento sano, la información fluye hacia vos sin que tengas que pedirla (modelo
              pull); en la microgestión, la exigís activamente (modelo push).
            </p>
          </>
        ),
      },
      {
        heading: "Señales de que estás microgestionando",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Pedís updates por chat en vez de mirar el tablero.</li>
              <li>Preguntás “¿cómo vas?” más de una vez al día por la misma tarea.</li>
              <li>Corregís el cómo, no solo el resultado, en tareas que ya delegaste.</li>
              <li>
                La persona te avisa cosas que no necesitabas saber, “por las dudas” — señal de que
                aprendió que no informar tiene costo.
              </li>
            </ul>
            <p>
              Si delegaste una tarea (ver{" "}
              <Link to="/blogs/como-delegar-tareas" className="underline underline-offset-2">
                cómo delegar tareas
              </Link>
              ) pero seguís preguntando como si no lo hubieras hecho, delegaste el trabajo sin
              delegar la confianza — y eso es peor que no delegar, porque además genera fricción.
            </p>
          </>
        ),
      },
      {
        heading: "El sistema: visibilidad pull, no push",
        body: (
          <>
            <p>
              El reemplazo de “preguntar seguido” es un tablero donde el estado real está siempre
              disponible sin pedirlo. Tres condiciones para que funcione:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Estados que dicen algo real:</strong> “En curso” no alcanza si puede
                significar “avanzando bien” o “trabado hace 3 días” — agregá una columna o etiqueta
                de bloqueo.
              </li>
              <li>
                <strong>Actualización por quien hace la tarea,</strong> en el momento en que cambia
                de estado — no reconstruida de memoria una vez por semana.
              </li>
              <li>
                <strong>Vos mirás, no preguntás.</strong> Si necesitás algo que el tablero no
                muestra, esa es la señal de que falta un campo, no de que falta preguntar más.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Qué preguntar (y qué no) en un check-in",
        body: (
          <>
            <p>
              Cuando sí hace falta hablar, la pregunta importa. Comparación directa:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>En vez de</strong> “¿cómo vas con eso?” → <strong>preguntá</strong> “¿hay
                algo bloqueando que yo pueda resolver?”.
              </li>
              <li>
                <strong>En vez de</strong> “¿por qué todavía no terminaste?” →{" "}
                <strong>preguntá</strong> “¿el alcance cambió respecto a lo que hablamos?”.
              </li>
              <li>
                <strong>En vez de</strong> pedir el reporte diario → <strong>preguntá</strong> solo
                cuando el tablero muestra una señal real de riesgo.
              </li>
            </ul>
            <p>
              La primera pregunta de cada ejemplo asume que falta algo de la persona; la segunda
              asume que puede faltar algo del sistema. Casi siempre es lo segundo.
            </p>
          </>
        ),
      },
      {
        heading: "Frecuencia de seguimiento según riesgo de la tarea",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Tipo de tarea</th>
                  <th className="py-2 font-semibold">Frecuencia sana</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    Rutina, persona con experiencia probada
                  </td>
                  <td className="py-2 text-muted-foreground">Solo si el tablero muestra bloqueo</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    Nueva para la persona, riesgo medio
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Un check-in a mitad de camino, agendado de antemano
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Alto riesgo o alta visibilidad</td>
                  <td className="py-2 text-muted-foreground">
                    Checkpoints cortos definidos junto con la persona, no improvisados
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Cuándo el seguimiento debe subir de nivel",
        body: (
          <>
            <p>
              No todo bloqueo espera al próximo check-in agendado. Definí con cada persona, de
              antemano, cuándo escalar sin esperar: por ejemplo, “si esto va a tardar más del doble
              de lo estimado, avisame ese mismo día”. Eso reemplaza tu necesidad de preguntar por
              un criterio objetivo que la persona controla. Si el patrón se repite en varias
              tareas, puede ser síntoma de algo más grande — ver{" "}
              <Link
                to="/blogs/proyecto-atrasado-que-hacer"
                className="underline underline-offset-2"
              >
                tu proyecto va atrasado: 6 movimientos
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Herramientas: tablero antes que preguntar por chat",
        body: (
          <>
            <p>
              El chat privado es el canal más caro para hacer seguimiento: interrumpe, no queda
              visible para el resto del equipo y crea la sensación de estar “rindiendo cuentas” en
              vez de compartir estado. Un tablero visible, más un{" "}
              <Link to="/blogs/daily-standup-util" className="underline underline-offset-2">
                daily corto
              </Link>{" "}
              si el equipo lo necesita, cubre el 90% de los casos sin que nadie se sienta vigilado.
              El mismo principio de reemplazar preguntas por visibilidad está detrás de{" "}
              <Link
                to="/blogs/reuniones-de-status-eliminar"
                className="underline underline-offset-2"
              >
                eliminar las reuniones de status
              </Link>
              .
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo hacer seguimiento de tareas sin microgestionar",
      steps: [
        {
          name: "Poner el estado real en el tablero, no en tu cabeza",
          text: "Estados que digan algo (bloqueado, en riesgo, avanzando), actualizados por quien hace la tarea.",
        },
        {
          name: "Definir la frecuencia según riesgo, no según ansiedad",
          text: "Rutina: seguimiento pasivo. Nueva o de alto riesgo: checkpoints agendados de antemano.",
        },
        {
          name: "Acordar el criterio de escalamiento temprano",
          text: "\"Si tarda más del doble de lo estimado, avisá ese mismo día\" reemplaza la necesidad de preguntar seguido.",
        },
        {
          name: "Cambiar la pregunta del check-in",
          text: "De \"¿cómo vas?\" a \"¿hay algo bloqueando que yo pueda resolver?\" — pone el foco en el sistema, no en la persona.",
        },
        {
          name: "Sacar el seguimiento del chat privado",
          text: "Moverlo al tablero compartido reduce la sensación de estar rindiendo cuentas y hace visible el estado para todo el equipo.",
        },
      ],
    },
    faq: [
      {
        question: "¿Cómo sé si estoy microgestionando sin darme cuenta?",
        answer:
          "Si preguntás por el estado de una tarea más seguido de lo que el tablero cambia, o si preguntás por el método en vez del resultado en tareas ya delegadas, es una señal clara.",
      },
      {
        question: "¿Qué hago si el tablero nunca refleja la realidad?",
        answer:
          "Es el problema real a resolver antes que el seguimiento en sí: sin estados confiables, cualquier sistema de seguimiento vuelve a depender de preguntar. Empezá por acordar qué significa cada estado con el equipo.",
      },
      {
        question: "¿Los checkpoints agendados no son también una forma de microgestión?",
        answer:
          "No si se definen de antemano y en conjunto con la persona, en vez de improvisarse cuando a vos te da ansiedad. La diferencia está en quién decide la frecuencia y con qué criterio.",
      },
      {
        question: "¿Este sistema funciona con personas junior sin experiencia?",
        answer:
          "Sí, pero con frecuencia más alta y checkpoints más cortos al principio — no significa volver a preguntar sin criterio, significa acordar una cadencia más cercana mientras se construye la confianza.",
      },
    ],
  },
};
