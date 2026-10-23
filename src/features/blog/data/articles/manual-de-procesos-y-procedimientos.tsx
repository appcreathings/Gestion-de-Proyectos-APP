import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "manual-de-procesos-y-procedimientos",
  title: "Manual de procesos y procedimientos: qué es, ejemplo y cómo armarlo",
  excerpt:
    "El manual de procesos y procedimientos reúne cómo trabaja tu empresa en un solo lugar: qué contiene, diferencia entre proceso, procedimiento e instrucción, estructura, ejemplo y cómo mantenerlo vivo.",
  category: "procesos",
  categoryLabel: "Procesos",
  publishedAt: "2026-10-23",
  readingTime: "9 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  related: [
    "como-documentar-procesos-equipos",
    "plantilla-para-documentar-procesos",
    "procedimiento-operativo-estandarizado-sop",
    "procedimiento-de-control-de-documentos",
  ],
  seo: {
    title: "Manual de procesos y procedimientos: ejemplo y guía | Hito",
    description:
      "Manual de procesos y procedimientos: qué es, en qué se diferencia un proceso de un procedimiento, estructura recomendada, ejemplo de una empresa pequeña y cómo mantenerlo actualizado.",
    ogImageAlt: "Estructura de un manual de procesos y procedimientos con ejemplo.",
  },
  content: {
    eyebrow: "Documentación de procesos",
    intro: (
      <>
        <strong>En una línea:</strong> un manual de procesos y procedimientos es el documento que
        describe cómo trabaja una organización — qué procesos tiene, quién es responsable de cada
        uno y qué pasos sigue cada procedimiento — para que el trabajo no dependa de la memoria de
        una persona.
      </>
    ),
    sections: [
      {
        heading: "Qué es un manual de procesos y procedimientos",
        body: (
          <>
            <p>
              Es el conjunto ordenado de la documentación operativa de una empresa o un área: un
              mapa de los procesos principales y, para cada uno, los procedimientos que explican
              cómo se ejecuta. Sirve para tres cosas concretas: que alguien nuevo pueda
              trabajar sin interrumpir a tres personas, que el resultado no cambie según quién
              haga la tarea y que puedas mejorar lo que ves escrito, porque lo que solo vive en
              la cabeza de alguien no se mejora, se hereda.
            </p>
            <p>
              Los nombres varían — «manual de procesos», «manual de procedimientos», «manual de
              funciones y procedimientos», «manual de gestión» — y en la práctica se usan casi
              como sinónimos. Lo que importa no es la etiqueta sino que el contenido responda a
              «cómo hacemos esto aquí». Si buscas la versión de una sola tarea, mira el{" "}
              <Link
                to="/blogs/procedimiento-operativo-estandarizado-sop"
                className="underline underline-offset-2"
              >
                procedimiento operativo estandarizado (SOP)
              </Link>
              ; el manual es la carpeta que contiene muchos de ellos.
            </p>
          </>
        ),
      },
      {
        heading: "Proceso, procedimiento e instrucción: tres niveles distintos",
        body: (
          <>
            <p>
              La confusión entre estos términos produce manuales ilegibles. Una forma simple de
              separarlos es por nivel de detalle:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Nivel</th>
                  <th className="py-2 pr-4 font-semibold">Responde a</th>
                  <th className="py-2 font-semibold">Ejemplo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Proceso</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Qué resultado produce esta área y con qué entradas y salidas?
                  </td>
                  <td className="py-2 text-muted-foreground">Gestión de ventas</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Procedimiento</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Qué pasos, en qué orden y quién los hace?
                  </td>
                  <td className="py-2 text-muted-foreground">Alta de un cliente nuevo</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Instrucción de trabajo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Cómo se ejecuta exactamente este paso en esta herramienta?
                  </td>
                  <td className="py-2 text-muted-foreground">Crear el cliente en el CRM</td>
                </tr>
              </tbody>
            </table>
            <p>
              El manual se arma de arriba hacia abajo: primero el mapa de procesos, después un
              procedimiento por cada proceso crítico y solo al final las instrucciones de las
              tareas que fallan. Empezar por las instrucciones es la manera más rápida de
              terminar con 80 páginas que nadie abre.
            </p>
          </>
        ),
      },
      {
        heading: "Estructura recomendada del manual",
        body: (
          <>
            <p>
              Un manual útil para una empresa de 5 a 50 personas cabe en una estructura simple:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Propósito y alcance.</strong> Qué cubre el manual, a qué áreas aplica y
                quién lo mantiene. Un párrafo.
              </li>
              <li>
                <strong>Mapa de procesos.</strong> Los 5–10 procesos principales (estratégicos,
                operativos y de apoyo) y cómo se conectan.
              </li>
              <li>
                <strong>Responsables.</strong> Quién es dueño de cada proceso. Una{" "}
                <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                  matriz RACI
                </Link>{" "}
                resume esto en una tabla.
              </li>
              <li>
                <strong>Procedimientos.</strong> Uno por proceso crítico, con el mismo formato
                (propósito, pasos, controles, registros).
              </li>
              <li>
                <strong>Formatos y registros.</strong> Las plantillas que los procedimientos
                piden llenar — ver{" "}
                <Link
                  to="/blogs/plantilla-para-documentar-procesos"
                  className="underline underline-offset-2"
                >
                  plantilla para documentar procesos
                </Link>
                .
              </li>
              <li>
                <strong>Control de versiones.</strong> Fecha, versión y qué cambió, siguiendo un{" "}
                <Link
                  to="/blogs/procedimiento-de-control-de-documentos"
                  className="underline underline-offset-2"
                >
                  procedimiento de control de documentos
                </Link>
                .
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Ejemplo: manual de una agencia de 8 personas",
        body: (
          <>
            <p>
              Así se ve el esqueleto de un manual real y corto. Cada línea del segundo nivel es
              un procedimiento de una a dos páginas:
            </p>
            <p className="rounded-md border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
              <strong>1. Gestión comercial</strong> · Responsable: dirección
              <br />
              — Atención de consultas entrantes · Elaboración y envío de propuestas · Alta de
              cliente nuevo
              <br />
              <strong>2. Ejecución de proyectos</strong> · Responsable: líder de proyecto
              <br />
              — Kickoff · Seguimiento semanal · Control de cambios · Entrega y cierre
              <br />
              <strong>3. Administración y finanzas</strong> · Responsable: administración
              <br />
              — Facturación mensual · Cobranza de facturas vencidas · Pago a proveedores
              <br />
              <strong>4. Gestión de personas</strong> · Responsable: dirección
              <br />
              — Incorporación de personal · Evaluación semestral · Salida de personal
            </p>
            <p>
              Son 4 procesos y 14 procedimientos. Con uno por semana, el manual está completo en
              tres meses sin parar el trabajo de nadie — y los primeros que se escriben son los
              que más dolor causan, no los del orden del índice.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo armarlo en 6 pasos",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Lista los procesos.</strong> En una hora, con el equipo, escribe qué
                hace la empresa de punta a punta. Menos de 10 procesos; si salen 25, estás
                listando tareas.
              </li>
              <li>
                <strong>Elige los 3 que más duelen.</strong> Los que generan errores,
                retrabajo o dependen de una sola persona. Empieza ahí, no por el primero del
                índice.
              </li>
              <li>
                <strong>Haz que lo escriba quien lo hace.</strong> Quien ejecuta el proceso
                redacta el borrador (o lo dicta); el responsable lo revisa. Un manual escrito
                por quien nunca hizo la tarea se nota.
              </li>
              <li>
                <strong>Usa un solo formato.</strong> Todos los procedimientos con los mismos
                campos. Cuanto más uniforme, más fácil leer, revisar y mantener.
              </li>
              <li>
                <strong>Prueba el procedimiento con alguien nuevo.</strong> Si una persona que
                no conoce la tarea puede ejecutarla sin preguntar, el procedimiento funciona.
                Si pregunta, falta algo.
              </li>
              <li>
                <strong>Fija una fecha de revisión.</strong> Cada procedimiento con dueño y
                fecha de próxima revisión (6 o 12 meses). Sin esto, el manual envejece en
                silencio.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Errores que matan el manual",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Escribirlo para el auditor y no para el equipo.</strong> Si el único
                lector es quien viene a certificar, el manual se vuelve ficción. Lo escrito debe
                coincidir con lo que realmente se hace.
              </li>
              <li>
                <strong>Querer documentarlo todo.</strong> Documenta lo que se repite, lo que
                falla y lo que depende de una persona. El resto es ruido.
              </li>
              <li>
                <strong>Un PDF de 100 páginas.</strong> Un manual que se consulta tiene
                documentos cortos, con buscador y enlazados al trabajo.
              </li>
              <li>
                <strong>Sin dueño.</strong> «Es de todos» significa que no es de nadie. Cada
                proceso, un responsable con nombre.
              </li>
              <li>
                <strong>Separado del trabajo.</strong> Un manual en una carpeta aparte compite
                con el trabajo real y pierde. Lo que se usa está a un clic de la tarea; ver{" "}
                <Link
                  to="/blogs/como-documentar-procesos-equipos"
                  className="underline underline-offset-2"
                >
                  cómo documentar procesos para equipos
                </Link>{" "}
                y{" "}
                <Link to="/blogs/tareas-recurrentes" className="underline underline-offset-2">
                  tareas recurrentes
                </Link>
                .
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Dónde guardarlo para que se use",
        body: (
          <>
            <p>
              El formato importa menos que la distancia al trabajo. Un documento de Word en una
              carpeta compartida sirve para empezar y para equipos muy pequeños. Una wiki sirve
              mientras alguien la cuida. Lo que mejor funciona en equipos pequeños es que el
              procedimiento viva junto a las tareas y proyectos que lo usan: se abre desde la
              tarea, se actualiza cuando se descubre un error y se reutiliza como plantilla de
              checklist cada vez que el proceso se repite.
            </p>
            <p>
              Si quieres tus SOPs, checklists y plantillas ligados a los proyectos, guardados en
              archivos de tu propia carpeta — sin cuenta ni nube —{" "}
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
              — documenta procesos junto a tus proyectos, local-first.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo armar un manual de procesos y procedimientos",
      steps: [
        {
          name: "Lista los procesos",
          text: "Con el equipo, escribe en una hora los 5–10 procesos principales de punta a punta.",
        },
        {
          name: "Prioriza los 3 que más duelen",
          text: "Empieza por los que generan errores, retrabajo o dependen de una sola persona.",
        },
        {
          name: "Que lo escriba quien lo hace",
          text: "El ejecutor redacta el borrador; el responsable del proceso lo revisa.",
        },
        {
          name: "Usa un formato único",
          text: "Todos los procedimientos con los mismos campos para que sean fáciles de leer y mantener.",
        },
        {
          name: "Pruébalo con alguien nuevo",
          text: "Si una persona que no conoce la tarea la ejecuta sin preguntar, el procedimiento funciona.",
        },
        {
          name: "Fija revisión y dueño",
          text: "Asigna responsable y fecha de próxima revisión (6–12 meses) a cada procedimiento.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es un manual de procesos y procedimientos?",
        answer:
          "Es el documento que reúne cómo trabaja una organización: el mapa de sus procesos, los responsables de cada uno y los procedimientos paso a paso. Su función es que el trabajo no dependa de la memoria de una persona y que el resultado sea consistente.",
      },
      {
        question: "¿Cuál es la diferencia entre proceso y procedimiento?",
        answer:
          "El proceso describe el resultado que produce un área, con sus entradas y salidas (por ejemplo, gestión de ventas). El procedimiento describe los pasos concretos para ejecutar una parte de ese proceso (por ejemplo, alta de un cliente nuevo). Un proceso contiene varios procedimientos.",
      },
      {
        question: "¿Qué debe contener un manual de procesos?",
        answer:
          "Propósito y alcance, mapa de procesos, responsables, procedimientos con formato uniforme, formatos y registros asociados, y control de versiones con fecha de revisión.",
      },
      {
        question: "¿Cuánto tarda en hacerse un manual de procesos?",
        answer:
          "Depende del tamaño, pero un manual básico de una empresa pequeña (4 procesos y unos 14 procedimientos) se completa en unos tres meses escribiendo uno por semana, sin detener el trabajo. Empieza por los procesos que más errores o dependencia generan.",
      },
      {
        question: "¿Un manual de procesos es lo mismo que un SOP?",
        answer:
          "No. Un SOP (procedimiento operativo estandarizado) documenta una tarea concreta con sus pasos. El manual de procesos es el conjunto: el mapa de procesos y la colección de SOPs y formatos que describen cómo opera la organización.",
      },
    ],
  },
};
