import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "diagrama-de-hitos",
  title: "Diagrama de hitos: qué es y cómo hacerlo (con ejemplo)",
  excerpt:
    "Qué es un diagrama de hitos, en qué se diferencia del Gantt, cómo hacerlo en 5 pasos y un ejemplo completo. La vista mínima que tu cliente sí entiende.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-05",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "hito-project-gestion-por-hitos",
  related: [
    "hito-project-gestion-por-hitos",
    "diagrama-de-gantt",
    "cronograma-de-hitos",
  ],
  seo: {
    title: "Diagrama de hitos: qué es y cómo hacerlo (con ejemplo) | Hito",
    description:
      "Diagrama de hitos: qué es, en qué se diferencia del Gantt, cómo hacer uno en 5 pasos y un ejemplo completo. La vista mínima que tu cliente sí entiende.",
    ogImageAlt:
      "Diagrama de hitos en línea de tiempo: kickoff, plan, beta y lanzamiento.",
  },
  content: {
    eyebrow: "Hitos",
    intro: (
      <>
        <strong>En una línea:</strong> un diagrama de hitos es la línea de tiempo mínima de tu
        proyecto: solo los puntos de control que importan, sin barras ni ruido. Aquí verás qué
        es, en qué se diferencia del Gantt, cómo hacerlo en 5 pasos y un ejemplo completo que tu
        cliente sí entiende.
      </>
    ),
    howTo: {
      name: "Cómo hacer un diagrama de hitos",
      steps: [
        {
          name: "Lista los hitos candidatos",
          text: "Repasa el alcance y anota toda aprobación, entrega o arranque que cambie el estado del proyecto. De la lista saldrán entre 4 y 8 mojones.",
        },
        {
          name: "Verifica que cada uno sea verificable y tenga dueño",
          text: "Cada hito necesita un criterio objetivo de cumplido —una firma, una aprobación, un sistema en producción— y una persona que responde por hacerlo acontecer.",
        },
        {
          name: "Fechalos con dependencias reales",
          text: "La fecha sale del trabajo que hace verificable el hito, no del deseo de cerrar antes. Si la fecha es un deseo, el diagrama miente desde el primer día.",
        },
        {
          name: "Ordénalos en la línea de tiempo",
          text: "Dibuja una escala semanal o mensual y coloca los mojones en orden. Si dos quedan pegados, revisa si uno sobra o si hay una fase comprimida de más.",
        },
        {
          name: "Publícalo donde todos lo vean",
          text: "Compártelo con el equipo y el cliente, cuelga el PDF o déjalo en la portada del proyecto. Un diagrama guardado en una carpeta que nadie abre no gestiona nada.",
        },
      ],
    },
    sections: [
      {
        heading: "Qué es un diagrama de hitos",
        body: (
          <>
            <p>
              Un <strong>diagrama de hitos</strong> es la versión mínima de la línea de tiempo
              de tu proyecto: una escala temporal —semanas o meses— con los puntos de control
              marcados encima, uno tras otro. Sin barras, sin dependencias dibujadas, sin
              asignaciones: solo los mojones que indican qué se logró y cuándo debería lograrse.
            </p>
            <p>
              Esa falta de detalle no es una limitación: es la función. El diagrama de hitos es
              la vista que le muestras al cliente, al directorio o a alguien nuevo del equipo
              para que entienda el plan en diez segundos, mientras el plan detallado vive en otro
              nivel. Es también la representación más pura de la{" "}
              <Link
                to="/blogs/hito-project-gestion-por-hitos"
                className="underline underline-offset-2"
              >
                gestión de proyectos por hitos
              </Link>
              : si los mojones están bien elegidos, con este dibujo basta para saber si el
              proyecto va bien.
            </p>
          </>
        ),
      },
      {
        heading: "Diagrama de hitos vs diagrama de Gantt",
        body: (
          <>
            <p>
              Como el Gantt también dibuja la línea de tiempo, la confusión es natural. La
              diferencia está en el nivel de detalle y en el público de cada vista:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Aspecto</th>
                  <th className="py-2 pr-4 font-semibold">Diagrama de hitos</th>
                  <th className="py-2 font-semibold">Diagrama de Gantt</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Qué muestra</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Solo los puntos de control y sus fechas.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Cada tarea, con barra de duración y dependencias.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Para quién</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cliente, dirección, personas nuevas del equipo.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El equipo que ejecuta y quien lleva el plan.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Mantenimiento</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Solo cambia cuando un hito cambia de fecha o se cumple.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Se actualiza a diario, tarea por tarea.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Falla cuando</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Hay demasiados hitos o sin criterio de cumplido.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Se usa para explicar el plan a externos: se pierden en el detalle.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El Gantt completo —barras, dependencias, ruta crítica— tiene su propio artículo en{" "}
              <Link to="/blogs/diagrama-de-gantt" className="underline underline-offset-2">
                el diagrama de Gantt
              </Link>
              . Aquí nos quedamos en la vista de mojones, que es la que comunica.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo hacer un diagrama de hitos en 5 pasos",
        body: (
          <>
            <p>
              El procedimiento completo cabe en cinco pasos. El segundo es el que separa un
              diagrama útil de una decoración:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Lista los hitos candidatos.</strong> Repasa el alcance y anota toda
                aprobación, entrega o arranque que cambie el estado del proyecto: kickoff, plan
                aprobado, beta, lanzamiento, aceptación. No filtres todavía; filtra después.
              </li>
              <li>
                <strong>Verifica que cada uno sea verificable y tenga dueño.</strong> Un hito
                necesita criterio objetivo de cumplido —firma, acta, sistema en producción— y
                una persona que responde. Lo que no pase esta prueba sale de la lista.
              </li>
              <li>
                <strong>Fechalos con dependencias reales.</strong> La fecha de cada mojón sale
                de cuánto tarda el trabajo que lo hace verificable, no del deseo de cerrar antes
                del fin de año. Fechar por deseo es programar el incumplimiento.
              </li>
              <li>
                <strong>Ordénalos en la línea de tiempo.</strong> Una escala semanal o mensual
                con los mojones en orden. Si dos quedan demasiado juntos, uno sobra o el plan
                tiene una fase comprimida; en ambos casos, es mejor verlo ahora que en la
                retrospectiva.
              </li>
              <li>
                <strong>Publícalo donde el equipo y el cliente lo vean.</strong> Compártelo,
                cuelga el PDF, déjalo a la vista en la portada del proyecto. El diagrama sirve
                si se consulta; archivado, es solo un dibujo bonito.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Ejemplo: el diagrama de hitos de un proyecto web",
        body: (
          <>
            <p>
              Una agencia web firma un proyecto de 12 semanas. El diagrama completo cabe en una
              tabla —que en la pared se dibuja como línea de tiempo— de cinco mojones:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Hito</th>
                  <th className="py-2 pr-4 font-semibold">Semana</th>
                  <th className="py-2 font-semibold">Criterio de cumplido</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Kickoff</td>
                  <td className="py-2 pr-4 text-muted-foreground">1</td>
                  <td className="py-2 text-muted-foreground">
                    Reunión hecha y acta enviada al cliente.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Plan aprobado</td>
                  <td className="py-2 pr-4 text-muted-foreground">2</td>
                  <td className="py-2 text-muted-foreground">
                    Cliente firma alcance, cronograma y presupuesto.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Beta interna</td>
                  <td className="py-2 pr-4 text-muted-foreground">8</td>
                  <td className="py-2 text-muted-foreground">
                    Sitio navegable en staging y pruebas pasadas.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Lanzamiento</td>
                  <td className="py-2 pr-4 text-muted-foreground">11</td>
                  <td className="py-2 text-muted-foreground">
                    Sitio en producción con dominio propio del cliente.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Cierre</td>
                  <td className="py-2 pr-4 text-muted-foreground">12</td>
                  <td className="py-2 text-muted-foreground">
                    Aceptación firmada y manual entregado.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Fíjate en que la tabla ya es casi el diagrama: hito, fecha y criterio. Esa misma
              estructura, mantenida como documento vivo con responsables y estado, es lo que en{" "}
              <Link to="/blogs/cronograma-de-hitos" className="underline underline-offset-2">
                el cronograma de hitos
              </Link>{" "}
              se convierte en el compromiso formal del proyecto.
            </p>
          </>
        ),
      },
      {
        heading: "Con qué herramientas hacerlo (opciones honestas)",
        body: (
          <>
            <p>
              No necesitas software caro para cinco mojones. Estas son las opciones reales y
              cuándo tiene sentido cada una:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Herramienta</th>
                  <th className="py-2 font-semibold">Cuándo tiene sentido</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Excel / hoja de cálculo</td>
                  <td className="py-2 text-muted-foreground">
                    Proyectos cortos y un solo responsable: una fila por hito, formato
                    condicional para los cumplidos y exportación a PDF para el cliente.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">TeamGantt</td>
                  <td className="py-2 text-muted-foreground">
                    Cuando quieres la vista de línea de tiempo presentable sin aprender una
                    herramienta compleja; tiene plantillas de hitos y planes mensuales.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">GanttPro</td>
                  <td className="py-2 text-muted-foreground">
                    Similar a TeamGantt, con buen balance entre vista de hitos y plan de tareas;
                    útil si ya gestionas el día a día ahí.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">MS Project</td>
                  <td className="py-2 text-muted-foreground">
                    Proyectos grandes con planificación de recursos; para solo mojones es un
                    cañón para matar moscas. La mecánica concreta está en{" "}
                    <Link
                      to="/blogs/hito-en-ms-project"
                      className="underline underline-offset-2"
                    >
                      el hito en MS Project
                    </Link>
                    .
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Y si quieres que el diagrama no sea un archivo muerto sino parte de la herramienta
              donde el equipo trabaja —JSON local en tu carpeta, sin cuenta, dashboard de
              portafolio para ver todos los proyectos y PWA que funciona offline—{" "}
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
              — convierte tus hitos en puntos de control vivos, local-first y sin suscripciones.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un diagrama de hitos?",
        answer:
          "Es la línea de tiempo mínima de un proyecto: una escala temporal con los puntos de control marcados —kickoff, plan aprobado, beta, lanzamiento—, sin barras de tareas ni dependencias. Su función es que el cliente, la dirección o el equipo entiendan el plan en segundos y puedan preguntar por cada mojón.",
      },
      {
        question: "¿Cómo hacer un diagrama de hitos paso a paso?",
        answer:
          "En cinco pasos: lista los hitos candidatos, verifica que cada uno sea verificable y tenga dueño, fechalos según dependencias reales, ordénalos en la línea de tiempo y publícalo donde el equipo y el cliente lo vean. La clave está en el segundo paso: sin criterio de cumplido, el diagrama es decoración.",
      },
      {
        question:
          "¿Cuál es la diferencia entre un diagrama de hitos y un diagrama de Gantt?",
        answer:
          "El nivel de detalle y el público. El diagrama de hitos muestra solo los puntos de control y sus fechas; el Gantt muestra cada tarea con su barra de duración y sus dependencias. El de hitos se explica solo y sirve para comunicar; el Gantt requiere mantenimiento diario y sirve para ejecutar.",
      },
      {
        question: "¿Qué debe incluir un diagrama de hitos?",
        answer:
          "Lo mínimo: los hitos (entre 4 y 8), su fecha y, en la versión útil, el criterio que define que cada uno está cumplido. Si el diagrama funciona como compromiso con el cliente, añade un responsable por hito; si es solo la vista de comunicación, con fechas y nombres basta.",
      },
      {
        question: "¿Sirve Excel para hacer un diagrama de hitos?",
        answer:
          "Sí, y para proyectos cortos es la opción más honesta: una fila por hito, una columna de fecha y formato condicional para marcar los cumplidos. Se queda corto cuando quieres dependencias o varias personas actualizando a la vez; entonces conviene una herramienta de gestión que mantenga el cronograma vivo.",
      },
    ],
  },
};
