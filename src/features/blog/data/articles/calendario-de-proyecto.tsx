import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "calendario-de-proyecto",
  title: "Calendario de proyecto: la vista día y semana del equipo",
  excerpt:
    "Calendario de proyecto: qué es, en qué se diferencia del Gantt y del cronograma, qué poner (y qué no) y cómo evitar que se vuelva un museo de fechas.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-08",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "tablero-kanban",
  related: [
    "tablero-kanban",
    "plantilla-cronograma-proyecto",
    "diagrama-de-gantt",
  ],
  seo: {
    title: "Calendario de proyecto: la vista día y semana del equipo | Hito",
    description:
      "Calendario de proyecto: qué es, en qué se diferencia del Gantt y del cronograma, qué poner (y qué no) y cómo evitar que se vuelva un museo de fechas.",
    ogImageAlt:
      "Calendario de proyecto semanal con entregas y hitos del equipo.",
  },
  content: {
    eyebrow: "Organización del trabajo",
    intro: (
      <>
        <strong>En una línea:</strong> el calendario de proyecto es la vista día y semana donde
        el equipo ve qué se entrega, cuándo y ante quién. No es el Gantt —eso es planificación
        de dependencias— ni el cronograma completo: es la capa operativa. Si tiene fechas para
        todo, se convierte en un museo que nadie visita.
      </>
    ),
    sections: [
      {
        heading: "Qué es un calendario de proyecto",
        body: (
          <>
            <p>
              Un calendario de proyecto es la vista día y semana donde el equipo ve los
              compromisos con fecha: qué se entrega, cuándo y ante quién. No es un adorno
              visual del plan: es la capa operativa donde las fechas del proyecto tocan la vida
              real de las personas, la que se consulta el lunes para saber qué toca y el
              jueves para saber qué se está cayendo.
            </p>
            <p>
              Su materia prima son los compromisos, no las intenciones. Cada evento del
              calendario responde a una promesa con destinatario: «entrega de la propuesta al
              cliente el jueves», «cierre de fase el 30», «demo interna el viernes a las 11».
              Si un bloque del calendario no tiene destinatario ni consecuencia por
              incumplirse, no es un compromiso: es un deseo con color.
            </p>
          </>
        ),
      },
      {
        heading: "Calendario, Gantt y cronograma: quién es quién",
        body: (
          <>
            <p>
              Las tres herramientas trabajan con fechas y se confunden constantemente, pero
              operan a alturas distintas: el cronograma fija los compromisos del proyecto
              completo, el Gantt planifica las dependencias entre bloques y el calendario los
              aterriza al día y la semana del equipo:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Herramienta</th>
                  <th className="py-2 pr-4 font-semibold">Qué muestra</th>
                  <th className="py-2 pr-4 font-semibold">Horizonte</th>
                  <th className="py-2 font-semibold">Para qué sirve</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Cronograma</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Fases, hitos y fechas comprometidas del proyecto.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Semanas o meses</td>
                  <td className="py-2 text-muted-foreground">
                    Negociar y comunicar plazos.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Gantt</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Barras de tareas y sus dependencias en el tiempo.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Semanas o meses</td>
                  <td className="py-2 text-muted-foreground">
                    Ver qué bloquea qué y replanificar.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Calendario de proyecto
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Entregas, hitos y ventanas concretas de cada día y semana.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Hoy y esta semana</td>
                  <td className="py-2 text-muted-foreground">
                    Saber qué toca ahora y qué se cae antes de caerse.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El{" "}
              <Link to="/blogs/diagrama-de-gantt" className="underline underline-offset-2">
                diagrama de Gantt
              </Link>{" "}
              es la herramienta de planificación de dependencias: brilla cuando un retraso se
              propaga en cadena y necesitas ver qué mueve qué. El{" "}
              <Link
                to="/blogs/plantilla-cronograma-proyecto"
                className="underline underline-offset-2"
              >
                cronograma
              </Link>{" "}
              es el compromiso temporal del proyecto: fases, hitos y fechas que se negocian
              con el cliente. El calendario no compite con ninguno: es donde esos dos
              documentos se convierten en «el jueves toca esto».
            </p>
            <p>
              La regla de convivencia: las fechas nacen en el cronograma, se validan en el
              Gantt y se viven en el calendario. Si tu calendario semanal contiene más de una
              docena de elementos, probablemente estás dibujando un Gantt en el lugar
              equivocado.
            </p>
          </>
        ),
      },
      {
        heading: "Qué va en el calendario (y qué no)",
        body: (
          <>
            <p>
              El calendario soporta muy poca carga antes de volverse ruido. Entra lo que tiene
              fecha comprometida y destinatario; fuera todo lo demás. Lo que sí va:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Entregas con fecha comprometida.</strong> Lo que sale hacia alguien:
                propuesta, versión, publicación, factura. Con destinatario, no solo con día.
              </li>
              <li>
                <strong>Hitos.</strong> Los cierres que parten el proyecto: fin de fase,
                aprobación, lanzamiento. Pocos y gruesos.
              </li>
              <li>
                <strong>Reuniones fijas.</strong> Las que estructuran la semana: reparto del
                lunes, revisión del viernes, demo.
              </li>
              <li>
                <strong>Ventanas de foco.</strong> Los bloques protegidos de trabajo profundo
                que el equipo defiende de la agenda ajena.
              </li>
              <li>
                <strong>Plazos externos.</strong> Los que no negocias tú: impuestos,
                renovaciones, ventanas de publicación de terceros.
              </li>
            </ul>
            <p>Y lo que no va:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Tareas sin fecha real.</strong> Viven en el backlog y en el tablero;
                ponerles fecha por ansiedad fabrica falsos compromisos.
              </li>
              <li>
                <strong>Deseos.</strong> «Quizá empecemos la web nueva» no es un evento: es una
                opción, y las opciones no van en el calendario.
              </li>
              <li>
                <strong>Micrométricas de 15 minutos.</strong> El calendario no es el tablero;
                si apuntas cada tarea pequeña, la vista semanal se convierte en un mosaico
                ilegible.
              </li>
              <li>
                <strong>Todo lo que cambia a diario.</strong> Si un bloque se mueve tres
                veces, no era un compromiso: era una intención disfrazada de fecha.
              </li>
            </ul>
            <p>
              La prueba de fuego: si alguien nuevo mira el calendario y puede decirte qué se
              entrega esta semana y ante quién en 30 segundos, está bien cargado. Si necesita
              explicación, está lleno de lo que no va.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo mantenerlo vivo: ritual y un solo dueño",
        body: (
          <>
            <p>
              Los calendarios compartidos mueren siempre igual: se llenan en la semana de
              arranque y nadie vuelve a tocarlos. La vida se sostiene con dos piezas. La
              primera es el ritual: la revisión semanal —10 minutos, junto al reparto del
              lunes— es el momento en que el calendario se actualiza con lo que cambió, no un
              documento aparte que mantiene las fechas dormidas.
            </p>
            <p>
              La segunda es el dueño: una sola persona responde por la coherencia del
              calendario —que las fechas del cronograma estén reflejadas, que no haya
              duplicados, que lo caído se renegocie—. Compartido no significa huérfano: todos
              lo ven y todos lo comentan, pero una persona responde por él. Sin dueño, cada
              fecha caducada se queda semanas, enseñándole al equipo a ignorar la herramienta.
            </p>
            <p>
              La regla de higiene: si un compromiso cambia de fecha dos veces, se saca del
              calendario y se vuelve a negociar, o se convierte en tarea sin fecha del
              backlog. El calendario que miente dos veces pierde la confianza que lo hace
              útil.
            </p>
          </>
        ),
      },
      {
        heading: "Calendario y tablero: dos vistas del mismo trabajo",
        body: (
          <>
            <p>
              El calendario y el tablero no compiten: responden preguntas distintas. El{" "}
              <Link to="/blogs/tablero-kanban" className="underline underline-offset-2">
                tablero kanban
              </Link>{" "}
              responde «¿qué está en curso y qué sigue?»; el calendario responde «¿qué se
              comprometió para cuándo?». Uno gestiona el flujo, el otro los plazos. El error
              clásico es intentar que una sola vista haga las dos cosas: o el calendario se
              llena de tarjetas intrascendentes, o el tablero acumula fechas que nadie
              respeta.
            </p>
            <p>
              El acoplamiento sano: lo que tiene fecha comprometida aparece en ambas —tarjeta
              con dueño en el tablero, evento con destinatario en el calendario—, y lo que no
              tiene fecha solo vive en el tablero. Cuando el viernes llega y la tarjeta no va
              a llegar, se ve en los dos lados el mismo día: en el tablero como tarjeta
              atascada, en el calendario como entrega que toca renegociar hoy, no el día del
              vencimiento.
            </p>
            <p>
              Si quieres calendario y tablero en el mismo lugar, sin nube —una herramienta
              local-first con tus datos en tu propia carpeta, en JSON, con dashboard de
              portafolio y modo offline—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              está hecho para equipos de 1 a 15 personas.
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
              — entregas y hitos junto a tu tablero, local-first y sin registro.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un calendario de proyecto?",
        answer:
          "Es la vista día y semana donde el equipo ve los compromisos con fecha del proyecto: entregas con destinatario, hitos, reuniones fijas y ventanas de foco. Es la capa operativa del plan —la que se consulta cada día—, distinta del cronograma completo y del diagrama de Gantt, que trabajan con horizontes más largos.",
      },
      {
        question: "¿Cuál es la diferencia entre calendario de proyecto y diagrama de Gantt?",
        answer:
          "El horizonte y la función: el Gantt planifica las dependencias entre bloques del proyecto —qué tarea bloquea cuál y cómo se propaga un retraso—, mientras que el calendario muestra la capa día y semana que vive el equipo. Las fechas se planifican en el Gantt, pero se cumplen —o se caen— en el calendario.",
      },
      {
        question: "¿Qué debe incluir un calendario de proyecto?",
        answer:
          "Cinco tipos de elemento: entregas con fecha comprometida y destinatario, hitos de cierre, reuniones fijas que estructuran la semana, ventanas de foco protegidas y plazos externos que no negocias tú. Fuera quedan las tareas sin fecha real, los deseos y las microtareas: si el calendario se llena de eso, deja de servir para saber qué toca.",
      },
      {
        question: "¿Cómo hacer un calendario de proyecto para un equipo?",
        answer:
          "Parte de los compromisos del cronograma, carga solo lo que tiene fecha y destinatario, nombra a una sola persona responsable de mantenerlo y actualízalo en el ritual semanal del equipo —junto al reparto del lunes—. La prueba de calidad: alguien nuevo debe poder decir qué se entrega esta semana y ante quién en 30 segundos.",
      },
      {
        question: "¿Sirve un calendario compartido si ya tenemos tablero kanban?",
        answer:
          "Sí, porque responden preguntas distintas: el tablero dice qué está en curso y qué sigue; el calendario dice qué se comprometió para cuándo y ante quién. Sin calendario, los plazos viven en la cabeza de quien coordina; sin tablero, las fechas flotan sin flujo que las sostenga. El acople sano: compromiso con fecha = tarjeta en el tablero más evento en el calendario.",
      },
    ],
  },
};
