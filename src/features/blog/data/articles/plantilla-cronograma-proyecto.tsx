import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "plantilla-cronograma-proyecto",
  title: "Plantilla de cronograma de proyecto (sin Gantt eterno)",
  excerpt:
    "Un cronograma útil cabe en hitos y dependencias, no en 200 barras. Plantilla simple, relación con la ruta crítica, y cuándo un Gantt miente.",
  category: "plantillas",
  categoryLabel: "Plantillas",
  publishedAt: "2027-06-07",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "plantillas-gestion-proyectos",
  related: ["plantillas-gestion-proyectos", "ruta-critica-proyecto", "como-estimar-tiempos-proyecto"],
  seo: {
    title: "Plantilla de cronograma de proyecto | Hito",
    description:
      "Plantilla de cronograma de proyecto por hitos y dependencias, sin un Gantt de 200 barras. Relación con la ruta crítica y cuándo un Gantt miente.",
    ogImageAlt: "Plantilla de cronograma de proyecto por hitos, sin Gantt eterno.",
  },
  content: {
    eyebrow: "Plantillas",
    intro: (
      <>
        <strong>En una línea:</strong> un <strong>cronograma de proyecto</strong> útil cabe en
        hitos, dueños, dependencias y holgura — no en 200 barras que nadie actualiza. El Gantt
        es una visualización opcional; la plantilla es la tabla. Si el gráfico se ve preciso al
        día y el equipo estima en semanas, el Gantt está mintiendo.
      </>
    ),
    sections: [
      {
        heading: "Un cronograma no es un Gantt de 200 barras",
        body: (
          <>
            <p>
              La búsqueda típica de “plantilla de cronograma” o “plantilla Gantt” termina en un
              archivo con decenas de filas y un diagrama que se ve profesional el día 1. El día
              12 ya no coincide con la realidad, y nadie se atreve a tocarlo. El problema no es
              el Gantt: es tratar la visualización como el plan.
            </p>
            <p>
              Para un equipo chico, el cronograma es una lista de hitos con dueño, dependencia,
              fecha objetivo y holgura. Con eso respondes las únicas tres preguntas de
              seguimiento: ¿qué vence?, ¿qué está bloqueado?, ¿si esto se atrasa, se mueve el
              final? El Gantt puede dibujar esa tabla. No la reemplaza.
            </p>
          </>
        ),
      },
      {
        heading: "La plantilla: cinco columnas que sí se usan",
        body: (
          <>
            <p>
              Copia esta tabla. Si una columna no cambia una decisión, no la agregues.
              “Porcentaje completo” y “color” casi nunca la cambian.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Columna</th>
                  <th className="py-2 font-semibold">Para qué sirve</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Hito / paquete</td>
                  <td className="py-2 text-muted-foreground">
                    El resultado que se puede aceptar, no una actividad suelta
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Dueño</td>
                  <td className="py-2 text-muted-foreground">
                    Una persona, no un área. Quien responde si la fecha se mueve
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Depende de</td>
                  <td className="py-2 text-muted-foreground">
                    Qué otro hito tiene que existir antes. Vacío = puede empezar ya
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Fecha objetivo</td>
                  <td className="py-2 text-muted-foreground">
                    Día o semana, no hora. Es un pronóstico, no un tallado en piedra
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Holgura</td>
                  <td className="py-2 text-muted-foreground">
                    Días que puede atrasarse sin mover la entrega (0 = crítico)
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Los hitos salen del{" "}
              <Link
                to="/blogs/wbs-estructura-desglose-trabajo"
                className="underline underline-offset-2"
              >
                WBS
              </Link>
              : el cronograma no inventa trabajo, le pone fecha al trabajo ya nombrado. Si una
              fila no existe en el WBS, o es gestión (y no va), o es alcance nuevo.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo: el mismo rediseño de sitio, ahora con fechas",
        body: (
          <>
            <p>
              Paquetes de nivel 3 de un rediseño de 5 páginas. Con los hitos que alguien puede
              aceptar, el cronograma ya dirige el seguimiento:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Hito</th>
                  <th className="py-2 pr-4 font-semibold">Dueño</th>
                  <th className="py-2 pr-4 font-semibold">Depende de</th>
                  <th className="py-2 pr-4 font-semibold">Fecha</th>
                  <th className="py-2 font-semibold">Holgura</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Brief de contenido</td>
                  <td className="py-2 pr-4 text-muted-foreground">Ana</td>
                  <td className="py-2 pr-4 text-muted-foreground">—</td>
                  <td className="py-2 pr-4 text-muted-foreground">12 jun</td>
                  <td className="py-2 text-muted-foreground">0 días</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Wireframes de 5 páginas</td>
                  <td className="py-2 pr-4 text-muted-foreground">Luis</td>
                  <td className="py-2 pr-4 text-muted-foreground">Brief</td>
                  <td className="py-2 pr-4 text-muted-foreground">19 jun</td>
                  <td className="py-2 text-muted-foreground">0 días</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Textos de las 5 páginas</td>
                  <td className="py-2 pr-4 text-muted-foreground">Ana</td>
                  <td className="py-2 pr-4 text-muted-foreground">Brief</td>
                  <td className="py-2 pr-4 text-muted-foreground">26 jun</td>
                  <td className="py-2 text-muted-foreground">2 días</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">UI de páginas clave</td>
                  <td className="py-2 pr-4 text-muted-foreground">Luis</td>
                  <td className="py-2 pr-4 text-muted-foreground">Wireframes</td>
                  <td className="py-2 pr-4 text-muted-foreground">3 jul</td>
                  <td className="py-2 text-muted-foreground">0 días</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Front + QA</td>
                  <td className="py-2 pr-4 text-muted-foreground">Marta</td>
                  <td className="py-2 pr-4 text-muted-foreground">UI y textos</td>
                  <td className="py-2 pr-4 text-muted-foreground">17 jul</td>
                  <td className="py-2 text-muted-foreground">0 días</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Go-live</td>
                  <td className="py-2 pr-4 text-muted-foreground">Marta</td>
                  <td className="py-2 pr-4 text-muted-foreground">Front + QA</td>
                  <td className="py-2 pr-4 text-muted-foreground">24 jul</td>
                  <td className="py-2 text-muted-foreground">0 días</td>
                </tr>
              </tbody>
            </table>
            <p>
              La cadena brief → wireframes → UI → front → go-live tiene holgura 0: es la ruta
              crítica. Los textos pueden atrasarse dos días sin mover el lanzamiento, siempre
              que no se coman esa holgura. Eso es lo que el seguimiento semanal necesita ver —
              no 40 barras de “ajustar padding”.
            </p>
          </>
        ),
      },
      {
        heading: "Relación con la ruta crítica y con estimar tiempos",
        body: (
          <>
            <p>
              La holgura no se adivina: se deriva de las dependencias y de las duraciones. La{" "}
              <Link to="/blogs/ruta-critica-proyecto" className="underline underline-offset-2">
                ruta crítica
              </Link>{" "}
              es el camino más largo; cualquier atraso ahí mueve la fecha final. Si la holgura
              es 0, es crítico; si tiene días de margen, no lo es… todavía.
            </p>
            <p>
              Las fechas son tan buenas como las estimaciones. Si cada hito se fechó “a ojo”
              en el escenario ideal, la ruta crítica va a ser igual de optimista. Antes de
              comprometer un go-live,{" "}
              <Link
                to="/blogs/como-estimar-tiempos-proyecto"
                className="underline underline-offset-2"
              >
                estima tiempos
              </Link>{" "}
              por analogía o con tres escenarios, y deja un búfer explícito al final. Esto
              pertenece a la{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                fase de planificación
              </Link>
              : el cronograma no crea tiempo, nombra el orden en el que se va a gastar.
            </p>
          </>
        ),
      },
      {
        heading: "Cuándo un Gantt miente",
        body: (
          <>
            <p>
              Un Gantt no es mentiroso por ser Gantt. Miente cuando reemplaza una conversación
              que el equipo no está teniendo:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Falsa precisión.</strong> Barras al día cuando las estimaciones son de
                semanas. Redondea a semana si el equipo estima a semana.
              </li>
              <li>
                <strong>Nunca se actualiza.</strong> El día 12 el camino crítico ya cambió y el
                diagrama sigue en el día 1. Peor información que no tenerlo.
              </li>
              <li>
                <strong>Confunde esfuerzo con duración.</strong> “Marta tiene 5 días de front”
                no es “el front tarda 5 días corridos” si Marta está en dos proyectos.
              </li>
              <li>
                <strong>Esconde la ruta crítica en 200 filas.</strong> Si hay que hacer zoom
                para ver qué no puede atrasarse, el diagrama no está haciendo su trabajo.
              </li>
              <li>
                <strong>Se presenta como contrato.</strong> Un cronograma es un pronóstico.
                Tratar cada barra interna como contrato convierte cada ajuste honesto en una
                “traición al plan”.
              </li>
            </ul>
            <p>
              Si no lo vas a actualizar en la cadencia de seguimiento, no lo dibujes. Un Gantt
              opcional, regenerado cuando cambia una dependencia, es honesto; un Gantt eterno
              es decoración.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo llenar la plantilla",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Parte del WBS. Cada fila es un hito o un paquete de nivel 3.</li>
              <li>
                Marca dependencias reales (“no puede empezar hasta que exista X”), no
                preferencias.
              </li>
              <li>
                Estima duración, luego fecha objetivo. La fecha se deriva, no se elige porque
                “queda bien en julio”.
              </li>
              <li>Calcula holgura. Lo que quede en 0 es a lo que miras cada semana.</li>
              <li>
                Revisa en la cadencia de seguimiento — semanal suele alcanzar — no “cuando ya
                está atrasado”.
              </li>
            </ol>
            <p>
              El cronograma alimenta el{" "}
              <Link to="/blogs/plantilla-plan-de-proyecto" className="underline underline-offset-2">
                plan de proyecto
              </Link>
              ; no lo reemplaza. El plan dice para qué y con quién; el cronograma, en qué
              orden. Si actualizas uno y no el otro, vuelves a tener dos verdades.
            </p>
          </>
        ),
      },
      {
        heading: "Qué hacer cuando una fecha se mueve",
        body: (
          <>
            <p>
              Una fecha crítica se atrasó. El cronograma no se “estira un poco” en silencio.
              Tienes las mismas tres palancas: recortar alcance en el camino crítico, mover
              recursos hacia el hito sin holgura, o mover la fecha final y decirlo. Lo que no
              funciona es dejar las barras donde estaban y esperar que el tiempo aparezca.
            </p>
            <p>
              Cuando muevas una fecha, actualiza holguras: un hito que no era crítico puede
              volverse crítico en el mismo movimiento. Esta tabla es una de las{" "}
              <Link
                to="/blogs/plantillas-gestion-proyectos"
                className="underline underline-offset-2"
              >
                8 plantillas de gestión de proyectos
              </Link>{" "}
              que sí se usan: hitos y dependencias, no un Gantt que se pudre.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo armar un cronograma de proyecto por hitos",
      steps: [
        {
          name: "Tomar hitos o paquetes del WBS",
          text: "Cada fila es un resultado que se puede aceptar. Fecha lo que ya nombraste; no inventes trabajo en el cronograma.",
        },
        {
          name: "Marcar dueño y dependencias reales",
          text: "Una persona por hito. “Depende de” solo si el siguiente no puede existir sin el anterior.",
        },
        {
          name: "Estimar duración y poner fecha objetivo",
          text: "Estima en el mismo grano en el que trabajas. La fecha se deriva de duración más dependencias, no al revés.",
        },
        {
          name: "Calcular holgura y marcar la ruta crítica",
          text: "Holgura 0 = crítico. Ese camino es lo que se mira cada semana.",
        },
        {
          name: "Revisar en la cadencia de seguimiento",
          text: "Semanal suele alcanzar. Actualiza fechas y holguras cuando algo se mueve.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es un cronograma de proyecto?",
        answer:
          "Un cronograma de proyecto es el plan de cuándo ocurren los hitos y en qué orden, con dueños, dependencias y holgura. Responde qué vence, qué está bloqueado y qué atraso mueve la fecha final.",
      },
      {
        question: "¿Necesito un Gantt para tener un cronograma?",
        answer:
          "No. El Gantt es una visualización opcional de la misma información. Para un equipo chico, una tabla de hitos con dependencias y holgura suele ser más honesta y más fácil de actualizar.",
      },
      {
        question: "¿Qué columnas tiene una plantilla de cronograma útil?",
        answer:
          "Cinco alcanzan: hito o paquete, dueño, de qué depende, fecha objetivo y holgura. Porcentaje completo, color y prioridad rara vez cambian una decisión y suelen pudrirse antes que las fechas.",
      },
      {
        question: "¿Cuándo un Gantt miente?",
        answer:
          "Cuando muestra precisión que las estimaciones no tienen, cuando no se actualiza, cuando confunde esfuerzo con duración o cuando esconde la ruta crítica en 200 barras. Un Gantt desactualizado da peor información que no tenerlo.",
      },
      {
        question: "¿Cómo se relaciona el cronograma con la ruta crítica?",
        answer:
          "La ruta crítica es el camino de hitos con holgura cero: cualquier atraso ahí mueve la entrega. El cronograma por hitos la hace visible sin software; el Gantt solo ayuda si filtra a ese camino. Se revisa en la cadencia de seguimiento, normalmente una vez por semana.",
      },
    ],
  },
};
