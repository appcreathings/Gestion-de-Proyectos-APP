import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "hitos-de-un-proyecto-ejemplos",
  title: "Hitos de un proyecto: los que sí o sí se marcan",
  excerpt:
    "Los hitos de un proyecto que casi todo plan serio marca —kickoff, plan aprobado, beta, entrega, aceptación— con ejemplos por industria y tres filtros para elegir los tuyos.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-04",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "hito-project-gestion-por-hitos",
  related: [
    "hito-project-gestion-por-hitos",
    "que-es-un-hito-gestion-proyectos",
    "hito-vs-entregable",
  ],
  seo: {
    title: "Hitos de un proyecto: los que sí o sí se marcan | Hito",
    description:
      "Hitos de un proyecto: los típicos por fase (kickoff, plan aprobado, beta, entrega, aceptación) con ejemplos por industria y cómo elegir los tuyos.",
    ogImageAlt: "Línea de tiempo con los hitos típicos de un proyecto por fase.",
  },
  content: {
    eyebrow: "Hitos",
    intro: (
      <>
        <strong>En una línea:</strong> los hitos de un proyecto son los puntos de control que
        marcan que una fase terminó y la siguiente puede empezar: kickoff, plan aprobado, beta,
        entrega, aceptación. Aquí tienes los que casi todo plan serio marca, con ejemplos por
        industria y tres filtros para elegir los tuyos.
      </>
    ),
    sections: [
      {
        heading: "Qué es un hito de un proyecto (en dos líneas)",
        body: (
          <>
            <p>
              Un <strong>hito de un proyecto</strong> es un punto de control sin duración que
              marca que algo quedó logrado: una fase terminó, una aprobación llegó, un
              entregable fue aceptado. No es una tarea —nadie «trabaja» en un hito— y no
              consume recursos: se cumple o no se cumple, y por eso sirve para medir el avance
              de verdad. Una aclaración de una línea, por si llegaste buscando otra cosa: aquí
              hablamos de hitos de proyecto, no del hito histórico o deportivo.
            </p>
            <p>
              La definición completa —criterios, tipos y la confusión frecuente con las
              tareas— está en{" "}
              <Link
                to="/blogs/que-es-un-hito-gestion-proyectos"
                className="underline underline-offset-2"
              >
                Qué es un hito en la gestión de proyectos
              </Link>
              . Este artículo asume esa definición y va a lo práctico: qué hitos se marcan, en
              qué orden y cómo elegir los tuyos.
            </p>
          </>
        ),
      },
      {
        heading: "Los hitos típicos, fase por fase",
        body: (
          <>
            <p>
              Casi todo proyecto, sin importar la industria, marca hitos en los mismos cuatro
              momentos. Estos son los que sí o sí aparecen en un plan serio:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Inicio: kickoff y acta aprobada.</strong> El kickoff marca que el
                proyecto arrancó formalmente; el acta o plan aprobado marca que todos —equipo y
                cliente— aceptaron el alcance, el presupuesto y las fechas. Sin este hito,
                cualquier desacuerdo posterior se negocia sin base documental.
              </li>
              <li>
                <strong>Planificación: línea base y contratos.</strong> La línea base del
                cronograma aprobada congela el «qué, cuándo y quién» contra el que medirás el
                desvío. En proyectos con proveedores, los contratos firmados son otro mojón
                natural de esta fase: sin ellos, las dependencias externas viven en el aire.
              </li>
              <li>
                <strong>Ejecución: prototipo, beta, entregas parciales.</strong> Según el tipo
                de proyecto: el prototipo aprobado en diseño, la beta con usuarios reales en
                software, la entrega parcial en consultoría o construcción. Son los puntos donde
                el cliente ve materializarse el trabajo y puede corregir el rumbo a tiempo, en
                vez de descubrir el error en la entrega final.
              </li>
              <li>
                <strong>Cierre: entrega final, aceptación y lecciones aprendidas.</strong> La
                entrega final pone el resultado en manos del cliente; la aceptación es que ese
                cliente confirme por escrito que cumple lo pactado; la retrospectiva cierra el
                proyecto convirtiendo lo aprendido en proceso para el siguiente.
              </li>
            </ol>
            <p>
              Nota el patrón: cada hito marca el fin de una fase verificable, no el fin de
              «trabajar mucho». Si no puedes señalar con el dedo qué quedó aprobado o entregado,
              no es un hito; es una wish de calendario.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplos de hitos por industria",
        body: (
          <>
            <p>
              Los nombres cambian según la industria, pero la lógica es idéntica: un punto de
              control verificable al final de cada tramo. Estos son los más comunes en cuatro
              mundos:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Industria</th>
                  <th className="py-2 font-semibold">Hitos típicos del proyecto</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Software</td>
                  <td className="py-2 text-muted-foreground">
                    Kickoff, plan técnico aprobado, MVP funcional, beta con usuarios reales,
                    lanzamiento en producción, cierre del proyecto con retro.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Agencia (marketing, diseño)
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Propuesta y presupuesto aprobados, brief firmado, entregas parciales por
                    fase (concepto, producción, medios), aceptación final del cliente.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Consultoría</td>
                  <td className="py-2 text-muted-foreground">
                    Diagnóstico entregado, recomendaciones presentadas al comité, plan de
                    implementación aprobado, cierre con resultados medidos contra la línea
                    base.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Construcción</td>
                  <td className="py-2 text-muted-foreground">
                    Permisos otorgados, obra gruesa terminada, instalaciones certificadas,
                    entrega y recepción municipal. La lista completa, con sus criterios de
                    cumplido, está en{" "}
                    <Link
                      to="/blogs/hitos-en-construccion"
                      className="underline underline-offset-2"
                    >
                      Hitos en proyectos de construcción
                    </Link>
                    .
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Fíjate que en las cuatro industrias hay un hito de aprobación temprana, uno o dos
              de avance verificable en el medio y uno de aceptación al final. Ese esqueleto se
              repite; lo que cambia es el vocabulario.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo elegir tus hitos: tres filtros",
        body: (
          <>
            <p>
              Los ejemplos anteriores son punto de partida, no plantilla para copiar completa.
              Tu proyecto merece sus propios hitos, y para destilarlos sirve pasar cada
              candidato por tres filtros:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>¿Es verificable?</strong> Un hito necesita un criterio objetivo de
                cumplido: una firma, una aprobación por escrito, un sistema en producción. «Todo
                más o menos listo» no pasa el filtro, y sin evidencia no hay discusión posible
                sobre si se llegó o no.
              </li>
              <li>
                <strong>¿Son pocos?</strong> Entre 4 y 8 hitos para un proyecto típico. Si
                tienes 25, no tienes hitos: tienes un plan de tareas disfrazado de mojones, y
                nadie —ni tu cliente ni tu equipo— va a poder nombrarlos de memoria.
              </li>
              <li>
                <strong>¿Tiene fecha y dueño?</strong> Cada hito lleva la fecha comprometida y
                la persona que responde por hacerlo verificable. Un hito sin dueño es un deseo;
                sin fecha, una intención; con ambos, es un compromiso que se puede auditar.
              </li>
            </ul>
            <p>
              Esta manera de trabajar —el proyecto como una sucesión de mojones verificables en
              vez de una lista infinita de tareas— es la base de la{" "}
              <Link
                to="/blogs/hito-project-gestion-por-hitos"
                className="underline underline-offset-2"
              >
                gestión de proyectos por hitos
              </Link>
              , donde el progreso se mide en puntos de control superados y no en porcentajes
              estimados a ojo.
            </p>
          </>
        ),
      },
      {
        heading: "Los tres errores que arruinan un plan de hitos",
        body: (
          <>
            <p>
              Marcar hitos mal es peor que no marcarlos, porque da la sensación de control sin
              dar el control. Estos son los errores más frecuentes:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Confundir hito con tarea o con entregable.</strong> «Diseño del logo» no
                es un hito: es trabajo con duración y esfuerzo. El hito es «logo aprobado por el
                cliente». La diferencia completa —y cómo se emparejan en el WBS— está en{" "}
                <Link to="/blogs/hito-vs-entregable" className="underline underline-offset-2">
                  Hito vs entregable
                </Link>
                .
              </li>
              <li>
                <strong>Marcar hitos en exceso.</strong> Uno por semana en un proyecto de seis
                meses diluye el valor de cada mojón: si todo es un hito, nada lo es. Redúcelos a
                las aprobaciones y entregas que de verdad cambian el estado del proyecto.
              </li>
              <li>
                <strong>Hitos sin criterio de verificación.</strong> «Fase 1 lista» no dice
                nada. ¿Lista según quién? ¿Con qué evidencia? Si el criterio de cumplido no cabe
                en una línea, el hito todavía no está bien definido y va a generar discusión
                justo cuando menos conviene.
              </li>
            </ol>
            <p>
              Si quieres marcar y seguir los hitos de tus proyectos en una herramienta que vive
              en tu carpeta —JSON local, sin cuenta, sin asientos, con checklists que convierten
              cada proceso terminado en un punto de control verificable—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              está pensado para equipos de 1 a 15 personas.
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
              — marca los hitos de tu proyecto y avanza con puntos de control visibles,
              local-first y sin nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Cuáles son los hitos de un proyecto?",
        answer:
          "Son los puntos de control que marcan el paso de una fase a otra. Los más comunes: kickoff y acta aprobada (inicio), línea base del cronograma y contratos firmados (planificación), prototipo, beta o entregas parciales (ejecución) y entrega final con aceptación y lecciones aprendidas (cierre). Un proyecto típico lleva entre 4 y 8, cada uno con fecha, dueño y criterio verificable.",
      },
      {
        question: "¿Qué es un hito en un proyecto con ejemplo?",
        answer:
          "Un hito es un punto de control sin duración que marca que algo quedó logrado. Por ejemplo: «plan aprobado por el cliente» es un hito, porque se cumple en un momento y con evidencia (la aprobación); «elaborar el plan», en cambio, es una tarea, porque tiene duración y consume trabajo del equipo.",
      },
      {
        question: "¿Cuántos hitos debe tener un proyecto?",
        answer:
          "Entre 4 y 8 para un proyecto típico, reservados para las aprobaciones y entregas que de verdad cambian el estado del proyecto. Si tienes más de diez, es señal de que estás listando tareas con otro nombre: los hitos pierden su función de referencia porque nadie puede recordarlos todos.",
      },
      {
        question: "¿Cuál es la diferencia entre un hito y un entregable?",
        answer:
          "El entregable es el resultado verificable que se entrega (un logo, un manual, un sistema); el hito es el punto de control sin duración que marca que ese entregable fue producido y aceptado. Por eso los planes serios emparejan cada entregable relevante con un hito de aceptación: uno es la cosa, el otro es el momento en que la cosa quedó validada.",
      },
      {
        question: "¿Qué hitos tiene un proyecto de construcción?",
        answer:
          "Los típicos son: permisos y licencias otorgados, obra gruesa terminada, instalaciones y acabados completos, pruebas certificadas, entrega con recepción municipal y cierre de garantías. Cada uno marca un cambio de fase verificable, y por eso muchos contratos de construcción se pagan contra hitos y no contra tiempo transcurrido.",
      },
    ],
  },
};
