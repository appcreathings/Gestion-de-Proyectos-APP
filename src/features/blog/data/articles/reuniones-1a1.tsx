import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "reuniones-1a1",
  title: "Reuniones 1:1 con tu equipo: la agenda mínima y los errores",
  excerpt:
    "Las reuniones 1:1 bien hechas son el detector temprano de problemas de tu equipo: agenda de 30 minutos, banco de preguntas y los 5 errores que las convierten en un status incómodo.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-09",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "registro-de-horas",
  related: ["que-hace-un-project-manager", "como-delegar-tareas", "daily-standup-util"],
  seo: {
    title: "Reuniones 1:1: agenda mínima y errores a evitar | Hito",
    description:
      "Reuniones 1:1 con tu equipo: para qué sirven de verdad, la agenda de 30 minutos, qué preguntar y los 5 errores que las convierten en un status incómodo.",
    ogImageAlt: "Agenda de reunión 1:1 entre líder y colaborador de equipo.",
  },
  content: {
    eyebrow: "Tiempo y capacidad",
    intro: (
      <>
        <strong>En una línea:</strong> la reunión 1:1 es una cita fija de 30 minutos entre líder
        y colaborador donde se habla de lo que no cabe en ningún otro espacio — bloqueos, dudas,
        desarrollo, fricciones — y es el detector temprano más barato que tiene un equipo.
      </>
    ),
    sections: [
      {
        heading: "Qué es una 1:1 (y para qué sirve de verdad)",
        body: (
          <>
            <p>
              Una reunión 1:1 es un encuentro recurrente, calendarizado, entre ti y cada persona
              de tu equipo. La condición que la define no es la duración (30 minutos es el
              estándar) sino el contenido: <strong>no es un status</strong>. El estado del trabajo
              ya vive en el tablero — preguntarlo en persona es gastar el mejor espacio de
              conversación en datos que ya tienes.
            </p>
            <p>
              Para qué sirve entonces: para que los problemas pequeños se digan cuando son
              pequeños. El bloqueo que el daily no alcanzó a resolver, la duda sobre una
              decisión, la sobrecarga que la persona no quiso admitir en público, la idea que no
              valía una reunión pero sí vale algo. En equipos pequeños estos temas suelen
              surfear de casualidad en un pasillo o en un mensaje a las 23:00; la 1:1 les da un
              lugar sistemático.
            </p>
            <p>
              El beneficio estratégico es el que describe{" "}
              <Link to="/blogs/que-hace-un-project-manager" className="underline underline-offset-2">
                el rol del project manager
              </Link>
              : gran parte del trabajo de liderar es quitar obstáculos antes de que se vuelvan
              fechas rotas. La 1:1 es el radar. Y complementa — no reemplaza — al{" "}
              <Link to="/blogs/daily-standup-util" className="underline underline-offset-2">
                daily standup
              </Link>
              : el daily coordina el día; la 1:1 sostiene a la persona.
            </p>
          </>
        ),
      },
      {
        heading: "La agenda de 30 minutos",
        body: (
          <>
            <p>
              La agenda mínima que funciona tiene cuatro bloques, y el orden importa: lo
              operativo primero, lo profundo después.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Bloque</th>
                  <th className="py-2 pr-4 font-semibold">Tiempo</th>
                  <th className="py-2 font-semibold">Pregunta que lo abre</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Su semana</td>
                  <td className="py-2 pr-4 text-muted-foreground">10 min</td>
                  <td className="py-2 text-muted-foreground">
                    «¿Cómo vienes? ¿Qué está consumiendo más de lo que debería?»
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Bloqueos</td>
                  <td className="py-2 pr-4 text-muted-foreground">8 min</td>
                  <td className="py-2 text-muted-foreground">
                    «¿Qué necesitas de mí antes de la próxima?»
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Desarrollo</td>
                  <td className="py-2 pr-4 text-muted-foreground">7 min</td>
                  <td className="py-2 text-muted-foreground">
                    «¿En qué te gustaría crecer o qué te gustaría hacer más?»
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Acuerdos</td>
                  <td className="py-2 pr-4 text-muted-foreground">5 min</td>
                  <td className="py-2 text-muted-foreground">
                    «Cerramos: yo me llevo X, tú Y. Lo anoto.»
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Dos detalles de la agenda que hacen la diferencia. Primero:{" "}
              <strong>el colaborador trae los temas</strong> — la 1:1 es su reunión; si tú
              llenas la agenda con tus temas, es una reunión de reporte con mejor decorado.
              Segundo: <strong>los acuerdos se anotan</strong>, aunque sea en dos líneas — sin
              registro, la 1:1 deriva en conversaciones que se repiten cada semana como la
              película en bucle de un equipo sin memoria.
            </p>
          </>
        ),
      },
      {
        heading: "Frecuencia y duración",
        body: (
          <>
            <p>
              La respuesta corta para un equipo de 1 a 15 personas: <strong>semanal o quincenal,
              30 minutos</strong>. Los matices:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Personas nuevas o en cambio de rol:</strong> semanal los primeros 2–3
                meses. El costo de un desalineamiento temprano es altísimo; 30 minutos
                semanales es el seguro más barato disponible.
              </li>
              <li>
                <strong>Personas senior y autónomas:</strong> quincenal funciona, y mantiene la
                cita viva sin sentirla burocrática. Mensual es lo mínimo tolerable — con más
                distancia, la reunión deja de detectar problemas temprano y se convierte en
                puesta al día.
              </li>
              <li>
                <strong>Proyectos en crisis:</strong> no suspenderlas, sino acortarlas. En
                semanas de fuego la 1:1 de 15 minutos («¿qué necesitas de mí hoy?») sostiene a
                la persona justo cuando más presión recibe.
              </li>
            </ul>
            <p>
              Y la regla de cancelación: las 1:1 casi nunca se cancelan — se acortan. El
              mensaje de «hoy no hay tiempo para vos» repetido tres veces enseña a la persona
              que la reunión no importa, y con ella deja de importar todo lo que traía para
              decir.
            </p>
          </>
        ),
      },
      {
        heading: "Los 5 errores que arruinan una 1:1",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Convertirla en status.</strong> «¿Cómo va el proyecto X?» es una
                pregunta de tablero, no de 1:1. Si la reunión se llena de reporte, la persona
                deja de traer lo importante porque no hay tiempo para ello.
              </li>
              <li>
                <strong>Cancelarla sistemáticamente.</strong> El error más común y el más
                corrosivo. Tres cancelaciones seguidas comunican mejor que cualquier discurso
                que la persona está al final de la lista de prioridades.
              </li>
              <li>
                <strong>Hablar solo el líder.</strong> Si la 1:1 eres tú hablando 25 minutos, no
                es una 1:1. La proporción sana de escucha es al menos 60/40 para el
                colaborador — y en la práctica se logra con una sola disciplina: preguntar y
                callar.
              </li>
              <li>
                <strong>No anotar acuerdos.</strong> Sin registro, los compromisos («voy a
                revisar el presupuesto», «te consigo acceso a X») flotan y se pierden. Dos
                líneas bastan; la memoria del equipo no.
              </li>
              <li>
                <strong>Guardarla para las malas noticias.</strong> Si la 1:1 solo aparece
                cuando hay problemas o evaluación, la gente aprende a temerla y llega
                blindada. El feedback sobre desempeño se da en el momento, con su propio
                espacio — la 1:1 es para el cultivo continuo, no para la poda.
              </li>
            </ul>
            <p>
              Nótese el patrón: casi todos los errores son formas de que la reunión deje de ser
              de la persona. La agenda de la sección anterior existe justamente para blindar
              eso.
            </p>
          </>
        ),
      },
      {
        heading: "Banco de preguntas para cuando no sabes qué preguntar",
        body: (
          <>
            <p>
              Los primeros meses, la 1:1 puede sentirse forzada. Estas preguntas abren las
              conversaciones que el ritmo diario no deja entrar:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>«¿Qué parte de tu trabajo te gustaría hacer más?» / «¿Y menos?»</li>
              <li>«¿Qué es lo más confuso o ambiguo de lo que estás haciendo ahora?»</li>
              <li>«¿Hay algo que estés evitando o postergando? ¿Por qué?»</li>
              <li>«¿Dónde perdés más tiempo en trabas?»</li>
              <li>«¿Cómo estuvo tu carga esta semana: muy liviana, justa o al borde?»</li>
              <li>«¿Qué decisión mía te complicó la vida últimamente?»</li>
              <li>«¿En qué sentís que estás creciendo? ¿En qué te estancás?»</li>
              <li>«Si fueras yo por una semana, ¿qué cambiarías primero?»</li>
            </ul>
            <p>
              No hace falta usarlas todas — con dos que lleguen a una conversación real, la 1:1
              pagó la semana. Y cuando la conversación revela sobrecarga crónica, el siguiente
              paso es ponerle número con{" "}
              <Link
                to="/blogs/planificacion-de-capacidad"
                className="underline underline-offset-2"
              >
                planificación de capacidad
              </Link>
              , no con voluntad.
            </p>
          </>
        ),
      },
      {
        heading: "Cuándo una 1:1 no alcanza",
        body: (
          <>
            <p>
              La 1:1 es un instrumento de mantenimiento, no de cirugía. Hay tres situaciones
              donde ritualizar el problema es peor que enfrentarlo:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Problemas de desempeño concretos:</strong> se dan feedback específico
                pronto, con ejemplos y expectativa clara — no se guardan para «la 1:1 del
                jueves» durante tres semanas.
              </li>
              <li>
                <strong>Decisiones de proyecto urgentes:</strong> se conversan cuando ocurren,
                con quienes correspondan — la 1:1 no es el buzón donde viven las decisiones
                que nadie toma.
              </li>
              <li>
                <strong>Conflicto entre dos personas:</strong> se media entre las partes — no
                se canaliza por separado en 1:1s paralelas, que es la receta para convertir un
                conflicto en dos versiones irreconciliables.
              </li>
            </ul>
            <p>
              Para lo demás — el pulso del equipo, los bloqueos silenciosos, el desarrollo de
              cada persona — la 1:1 es el hábito con mejor relación costo-beneficio que existe.
              Y si quieres que los acuerdos que salen de esas conversaciones queden anclados
              junto a las tareas y hitos a los que refieren — checklists y notas en el mismo
              archivo local, sin nube—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              está pensado para equipos como el tuyo.
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
              — acuerdos de tus 1:1 viviendo junto al trabajo, local-first.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es una reunión 1 a 1?",
        answer:
          "Es un encuentro recurrente y calendarizado entre líder y colaborador, de unos 30 minutos, para hablar de bloqueos, dudas, carga y desarrollo — no del estado de las tareas, que ya vive en el tablero. Es el espacio sistemático para los problemas pequeños antes de que sean grandes.",
      },
      {
        question: "¿Cada cuánto se hacen las reuniones 1:1?",
        answer:
          "Semanal para personas nuevas o en cambio de rol; quincenal para gente senior y autónoma. Mensual es el mínimo tolerable: con más distancia la reunión se convierte en puesta al día y pierde su función de detector temprano. Casi nunca se cancelan — se acortan.",
      },
      {
        question: "¿Qué se habla en una 1:1?",
        answer:
          "Cuatro bloques: cómo viene la persona y qué le consume tiempo, qué necesita de ti, en qué quiere crecer, y los acuerdos concretos de la semana. Lo que no se habla: el status del proyecto, que se lee del tablero antes de entrar.",
      },
      {
        question: "¿Quién dirige la agenda de una 1:1?",
        answer:
          "El colaborador trae los temas principales; el líder aporta preguntas y se lleva acuerdos. Si la agenda la llena el jefe, deja de ser 1:1 y pasa a ser reunión de reporte. La proporción sana de escucha es al menos 60/40 a favor del colaborador.",
      },
      {
        question: "¿Cuál es la diferencia entre la 1:1 y el daily standup?",
        answer:
          "El daily es grupal, de 10–15 minutos, y coordina el día: qué se hizo, qué sigue, qué bloquea. La 1:1 es individual, de 30 minutos, y sostiene a la persona: carga, dudas, desarrollo, fricciones. Uno coordina el trabajo; la otra cuida a quien lo hace.",
      },
    ],
  },
};
