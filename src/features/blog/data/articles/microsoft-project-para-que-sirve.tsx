import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "microsoft-project-para-que-sirve",
  title: "Microsoft Project para qué sirve (y cuándo no)",
  excerpt:
    "Microsoft Project sirve para un plan con dependencias, recursos y ruta crítica. No es una lista de tareas ni un tablero. Cuándo te hace falta y cuándo sobra.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-10-15",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "alternativa-a-ms-project",
  related: ["alternativa-a-ms-project", "hito-en-ms-project", "diagrama-de-gantt", "cronograma-de-actividades"],
  seo: {
    title: "Microsoft Project para qué sirve | Hito",
    description:
      "Microsoft Project para qué sirve: dependencias, recursos y ruta crítica. Cuándo te alcanza, cuándo sobra y en qué no reemplaza a un tablero.",
    ogImageAlt: "Plan de Microsoft Project con dependencias, recursos y ruta crítica.",
  },
  content: {
    eyebrow: "Herramientas",
    intro: (
      <>
        <strong>En una línea:</strong> Microsoft Project sirve para armar un plan donde las
        fechas dependen de otras fechas y de quién está asignado, y para ver qué tareas mueven
        la entrega. No es una lista de pendientes ni un tablero de la semana. Si no vas a
        mantener dependencias y recursos, el programa te sobra.
      </>
    ),
    sections: [
      {
        heading: "Para qué sirve Microsoft Project",
        body: (
          <>
            <p>
              MS Project es un planificador de proyecto. Tomas el trabajo, lo partes, le pones
              duración, dices qué no puede empezar hasta que otra cosa termine y asignas a las
              personas o a los equipos que lo van a hacer. El programa recalcula las fechas y te
              muestra el camino que, si se atrasa, atrasa la entrega.
            </p>
            <p>Eso resuelve cuatro preguntas que una lista no responde:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Si esta tarea se mueve tres días, ¿qué más se mueve?</li>
              <li>¿Quién está asignado a dos cosas el mismo día?</li>
              <li>¿Cuál es la cadena de tareas que fija la fecha final?</li>
              <li>¿El plan de hoy sigue siendo el plan que se aprobó, o ya se fue?</li>
            </ul>
            <p>
              La última pregunta es la línea base: una foto del plan aprobado contra la que
              comparas el avance. Sin esa foto, «vamos atrasados» es una sensación. Con ella, es
              una diferencia de fechas.
            </p>
            <p>
              El archivo clásico es el <strong>.mpp</strong>. Quien te pide «pásame el Project»
              suele pedir ese archivo, no una opinión sobre el proyecto.
            </p>
          </>
        ),
      },
      {
        heading: "Qué problema no resuelve",
        body: (
          <>
            <p>
              No reemplaza la lista de lo que hay que hacer esta semana, ni el tablero donde el
              equipo mueve tarjetas, ni el lugar donde se escribe cómo se hace un proceso. Esas
              son otras herramientas. Meterlas dentro de Project produce un archivo enorme que
              solo abre una persona.
            </p>
            <p>Tampoco decide el alcance. Si el proyecto no tiene claro qué entra, Project ordena
              el desorden con barras muy precisas. La precisión no corrige un alcance abierto.
              Antes de abrir el programa hacen falta las{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                fases
              </Link>{" "}
              y un{" "}
              <Link to="/blogs/cronograma-de-actividades" className="underline underline-offset-2">
                cronograma de actividades
              </Link>{" "}
              que quepa en una tabla. Project es el paso siguiente, no el primero.
            </p>
          </>
        ),
      },
      {
        heading: "Escritorio, nube y Planner no son el mismo producto",
        body: (
          <>
            <p>
              La búsqueda «Microsoft Project» mezcla tres cosas. Conviene separarlas antes de
              pagar o de descargar.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-3 font-semibold">Lo que la gente nombra</th>
                  <th className="py-2 pr-3 font-semibold">Qué es</th>
                  <th className="py-2 font-semibold">Para qué alcanza</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-3 text-muted-foreground">Project de escritorio</td>
                  <td className="py-2 pr-3 text-muted-foreground">
                    El programa del archivo .mpp, con Gantt, recursos y línea base.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Planes con dependencias y carga de personas. Lo usa quien mantiene el plan.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-3 text-muted-foreground">Project en la web</td>
                  <td className="py-2 pr-3 text-muted-foreground">
                    La versión en el navegador, más simple, atada a la cuenta de Microsoft.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Equipos que quieren un plan compartido sin instalar el escritorio.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 text-muted-foreground">Planner</td>
                  <td className="py-2 pr-3 text-muted-foreground">
                    El tablero de tareas de Microsoft 365. Microsoft lo ha ido juntando con
                    Project.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El trabajo de la semana. No calcula una ruta crítica seria.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              «Descargar Microsoft Project», «Project 2019» o «Project 365» buscan el instalador
              o la licencia. Esta página no es esa descarga. Si lo que necesitas es saber si el
              programa te sirve, la licencia es el paso de después. Las versiones viejas de
              escritorio siguen abriendo .mpp; no hace falta la última para aprender para qué
              sirve.
            </p>
          </>
        ),
      },
      {
        heading: "Cuándo te hace falta y cuándo sobra",
        body: (
          <>
            <p>Te hace falta si reconoces al menos dos de estas situaciones:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                El cliente o la obra te pide un Gantt con dependencias, no una lista de fases.
              </li>
              <li>
                Las mismas personas están en varios frentes y necesitas ver la sobrecarga.
              </li>
              <li>
                Una fecha se mueve y tienes que decir, el mismo día, qué entregas se corren.
              </li>
              <li>
                Hay una línea base firmada y el avance se compara contra ella.
              </li>
            </ul>
            <p>Te sobra si el trabajo real es otro:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Un equipo de menos de quince personas que se reparte tareas cada semana.</li>
              <li>Un proyecto que cabe en veinte filas y una revisión de los viernes.</li>
              <li>Nadie del equipo va a actualizar duraciones y dependencias.</li>
              <li>
                Lo que duele es saber en qué va cada cosa, no recalcular el camino crítico.
              </li>
            </ul>
            <p>
              En ese segundo grupo, un{" "}
              <Link to="/blogs/diagrama-de-gantt" className="underline underline-offset-2">
                diagrama de Gantt
              </Link>{" "}
              corto o un tablero alcanza. Abrir Project «porque los proyectos serios lo usan»
              deja un archivo que mantiene una sola persona y que el resto no mira.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo probar si de verdad lo necesitas",
        body: (
          <>
            <p>
              No hace falta comprar el plan anual para salir de dudas. Un proyecto que ya
              conoces, en una tarde, alcanza.
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Pasa a Project solo los entregables y sus dependencias.</strong> No las
                microtareas. Si partes de un{" "}
                <Link
                  to="/blogs/cronograma-de-actividades"
                  className="underline underline-offset-2"
                >
                  cronograma de actividades
                </Link>
                , ya tienes esa lista.
              </li>
              <li>
                <strong>Asigna a las personas que de verdad trabajan esas filas.</strong> Mira
                si el programa las marca como sobrecargadas. Si la sobrecarga te sorprende, el
                programa te está sirviendo.
              </li>
              <li>
                <strong>Mueve una tarea una semana.</strong> Si entender qué más se mueve te
                ahorra una reunión, quédate. Si ya lo sabías de memoria, el programa no aportó.
              </li>
              <li>
                <strong>Guarda la línea base y no la vuelvas a tocar.</strong> La comparación
                contra esa foto es la mitad del valor. Sin ella, Project es un Gantt caro.
              </li>
            </ol>
            <p>
              Los hitos dentro del archivo tienen su propia mecánica. Está explicada en{" "}
              <Link to="/blogs/hito-en-ms-project" className="underline underline-offset-2">
                qué es un hito en MS Project
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Si el programa te queda grande",
        body: (
          <>
            <p>
              Hay equipos que necesitan el Gantt y los recursos, y equipos que necesitan otra
              cosa. La comparación honesta de opciones está en{" "}
              <Link to="/blogs/alternativa-a-ms-project" className="underline underline-offset-2">
                alternativas a MS Project
              </Link>
              . OpenProject entra cuando quieres código abierto y un servidor. Un gestor local
              entra cuando el trabajo son procesos, listas e hitos, no una nivelación de
              recursos.
            </p>
            <p>
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              es ese segundo caso: carpeta en tu equipo, sin cuenta y sin asientos, con tablero
              e hitos. No calcula la ruta crítica de una obra ni parte una persona al 25 % entre
              tres proyectos. Si eso es lo que venías a buscar en Project, Hito no te lo
              reemplaza.
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
              — para el equipo que coordina el trabajo de la semana, no para reemplazar un .mpp.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo saber si Microsoft Project te sirve",
      steps: [
        {
          name: "Pasa solo entregables y dependencias",
          text: "No importes las microtareas. Si no tienes esa lista, arma antes un cronograma de actividades en una tabla.",
        },
        {
          name: "Asigna a quien hace cada fila",
          text: "Mira si el programa marca sobrecarga. Si la sobrecarga te sorprende, Project te está mostrando algo que la lista no mostraba.",
        },
        {
          name: "Mueve una tarea una semana",
          text: "Si ver qué más se corre te ahorra una reunión, el recálculo vale. Si ya lo sabías, el programa no aportó.",
        },
        {
          name: "Guarda una línea base y no la pises",
          text: "Comparar el plan de hoy contra el plan aprobado es la mitad del valor. Sin esa foto, Project queda en un Gantt caro.",
        },
      ],
    },
    faq: [
      {
        question: "¿Para qué sirve Microsoft Project?",
        answer:
          "Para planificar un proyecto con duraciones, dependencias y personas asignadas, ver qué tareas mueven la fecha final y comparar el avance contra el plan aprobado. No es una lista de pendientes ni un tablero de la semana.",
      },
      {
        question: "¿MS Project es gratis?",
        answer:
          "No. El escritorio y la versión en la web van con una licencia de Microsoft. Hay pruebas y hay planes dentro de Microsoft 365, pero «Project gratis» no es el producto. Para saber si te sirve, la licencia es el paso de después.",
      },
      {
        question: "¿En qué se diferencia de Excel?",
        answer:
          "Excel guarda la tabla. Project recalcula fechas cuando una tarea se mueve, muestra la sobrecarga de una persona y guarda una línea base. Si tu cronograma no tiene dependencias ni recursos, Excel alcanza.",
      },
      {
        question: "¿Sirve para un equipo pequeño?",
        answer:
          "Sirve si ese equipo mantiene dependencias y carga de personas. Si son menos de quince y el trabajo es repartir la semana, el programa suele quedar en un archivo que abre una sola persona.",
      },
      {
        question: "¿Qué es un archivo MPP?",
        answer:
          "Es el archivo de Microsoft Project de escritorio. Guarda tareas, dependencias, recursos y la línea base. Quien pide «el Project» casi siempre pide ese archivo.",
      },
    ],
  },
};
