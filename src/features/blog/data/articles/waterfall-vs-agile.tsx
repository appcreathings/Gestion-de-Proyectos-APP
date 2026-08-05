import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "waterfall-vs-agile",
  title: "Waterfall vs Agile: cuándo cascada es la respuesta correcta",
  excerpt:
    "Cascada no es “vieja y mala”. Cuándo Waterfall es honesto, cuándo Agile es teatro, y una tabla de decisión sin moda de industria.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-01-25",
  readingTime: "10 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  pillar: "metodologias-gestion-proyectos",
  related: [
    "metodologias-gestion-proyectos",
    "scrum-vs-kanban",
    "fases-de-un-proyecto",
    "alcance-de-proyecto-scope-creep",
  ],
  seo: {
    title: "Waterfall vs Agile: cuándo cascada es la respuesta correcta | Hito",
    description:
      "Cascada no es “vieja y mala”. Cuándo Waterfall es honesto, cuándo Agile es teatro, y una tabla de decisión sin moda de industria.",
    ogImageAlt: "Waterfall vs Agile: cuándo elegir cascada y cuándo iterar.",
  },
  content: {
    eyebrow: "Metodologías",
    intro: (
      <>
        <strong>En una línea:</strong> elegí <strong>Waterfall (cascada)</strong> cuando el
        alcance es fijo, conocido y el costo de cambiar a mitad de camino es altísimo; elegí{" "}
        <strong>Agile</strong> cuando vas a descubrir el producto en el camino y el feedback
        temprano reduce el riesgo. La pelea “moderno vs antiguo” es ruido: la pregunta correcta
        es qué tan bien conocés hoy lo que hay que entregar.
      </>
    ),
    sections: [
      {
        heading: "La pregunta que decide: ¿sé hoy qué hay que entregar?",
        body: (
          <>
            <p>
              Antes de metodologías, roles y ceremonias, contestá esto con honestidad:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Sí, con detalle y firmas:</strong> requisitos estables, regulaciones,
                contrato cerrado, diseño físico o fechas inamovibles → cascada (o híbrido muy
                cercano).
              </li>
              <li>
                <strong>No, lo vamos a aprender con usuarios o el mercado:</strong> producto
                digital, marketing, innovaciones → Agile (Scrum, Kanban u otro ritmo iterativo).
              </li>
            </ul>
            <p>
              Esa es la misma lógica del pilar{" "}
              <Link
                to="/blogs/metodologias-gestion-proyectos"
                className="underline underline-offset-2"
              >
                metodologías de gestión de proyectos
              </Link>
              : la metodología responde al tipo de incertidumbre, no a la moda de LinkedIn.
            </p>
          </>
        ),
      },
      {
        heading: "Waterfall en 5 líneas (sin caricatura)",
        body: (
          <>
            <p>
              Waterfall planifica y acuerda el “qué” antes de construir en volumen. Avanza por
              fases secuenciales — típicas: requisitos → diseño → construcción → prueba →
              despliegue/cierre — con gates de aprobación. Cambiar de idea a mitad de camino es
              caro a propósito: el proceso asume que el costo de rehacer es mayor que el costo de
              analizar bien al inicio.
            </p>
            <p>
              Encaja con las{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                5 fases de un proyecto
              </Link>{" "}
              cuando esas fases son realmente secuenciales y el alcance no debería moverse sin
              control de cambios formal.
            </p>
            <p>
              <strong>Ejemplos honestos:</strong> obra o instalación con planos, migración con
              ventana de corte fija, cumplimiento normativo con checklist auditado, evento con
              fecha que no se mueve.
            </p>
          </>
        ),
      },
      {
        heading: "Agile en 5 líneas (sin hype)",
        body: (
          <>
            <p>
              Agile no es “sin plan”: es planificar en ciclos cortos, entregar valor usable
              seguido y ajustar con lo aprendido. Scrum y Kanban son implementaciones; el
              manifiesto es la brújula (individuos e interacciones, software que funciona,
              colaboración con el cliente, respuesta al cambio).
            </p>
            <p>
              Encaja cuando el{" "}
              <Link
                to="/blogs/alcance-de-proyecto-scope-creep"
                className="underline underline-offset-2"
              >
                alcance
              </Link>{" "}
              va a evolucionar y pretender congelarlo el día 1 es mentira contractual o
              autoengaño del equipo.
            </p>
            <p>
              Entre Scrum y Kanban, la segunda pregunta es ritmo fijo vs flujo continuo — ver{" "}
              <Link to="/blogs/scrum-vs-kanban" className="underline underline-offset-2">
                Scrum vs Kanban
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Tabla de decisión",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Señal</th>
                  <th className="py-2 pr-4 font-semibold">Inclina a Waterfall</th>
                  <th className="py-2 font-semibold">Inclina a Agile</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Alcance</td>
                  <td className="py-2 pr-4 text-muted-foreground">Fijo y conocido</td>
                  <td className="py-2 text-muted-foreground">Emergente / descubrible</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Costo del cambio</td>
                  <td className="py-2 pr-4 text-muted-foreground">Muy alto (rehacer físico/legal)</td>
                  <td className="py-2 text-muted-foreground">Bajo-medio (software, contenido)</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Fecha</td>
                  <td className="py-2 pr-4 text-muted-foreground">Inamovible con entregable cerrado</td>
                  <td className="py-2 text-muted-foreground">
                    Flexible o con hitos de aprendizaje
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Cliente / usuario</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Sabe exactamente qué pidió
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Necesita ver versiones para decidir
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Riesgo principal</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Fallar por mal diseño inicial
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Fallar por construir lo incorrecto
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Híbridos que sí funcionan (y los que son disfraz)",
        body: (
          <>
            <p>
              <strong>Híbridos honestos:</strong>
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Cascada en el contrato, iterativo en la ejecución interna:</strong> el
                cliente firma fases y entregables; el equipo entrega demos internas cada 2
                semanas para no descubrir el desastre al final.
              </li>
              <li>
                <strong>Agile con milestones fijos de negocio:</strong> sprints cortos hacia una
                fecha de lanzamiento inamovible, con recorte de alcance (no de calidad).
              </li>
            </ul>
            <p>
              <strong>Disfraces:</strong>
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                “Hacemos Agile” pero el alcance está cerrado en un Gantt de 9 meses sin margen
                de aprendizaje.
              </li>
              <li>
                “Hacemos Waterfall” pero cambian requisitos cada semana sin control de cambios ni
                ajuste de fecha/presupuesto.
              </li>
              <li>
                Daily + tablero Kanban + cero entregas usables = teatro con stickers.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Cuándo tu “Agile” es cascada con standups",
        body: (
          <>
            <p>Señales de que solo renombraste el proceso:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>El “sprint” es un mes de tareas de un plan que no se puede tocar.</li>
              <li>No hay review con feedback que pueda cambiar el próximo ciclo.</li>
              <li>
                La retrospectiva no produce cambios de proceso (ver{" "}
                <Link
                  to="/blogs/retrospectivas-formatos"
                  className="underline underline-offset-2"
                >
                  formatos de retrospectiva
                </Link>
                ).
              </li>
              <li>
                El{" "}
                <Link
                  to="/blogs/sprint-planning-como-hacerlo"
                  className="underline underline-offset-2"
                >
                  planning
                </Link>{" "}
                es un wishlist, no un compromiso de capacidad.
              </li>
            </ul>
            <p>
              No hay vergüenza en usar cascada cuando corresponde. Hay desperdicio en fingir
              Agile para quedar bien en la industria y seguir planificando como en 2005 sin la
              disciplina de 2005.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo elegir sin pelearte con la moda",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Escribí en una frase el resultado del proyecto y cuánto puede cambiar el “qué”.</li>
              <li>Marcá en la tabla de arriba 3–5 señales dominantes.</li>
              <li>
                Elegí el sistema mínimo: fases y gates (cascada) o ciclos y feedback (Agile).
              </li>
              <li>
                Definí cómo se aprueban cambios de alcance — sin eso, cualquier metodología se
                pudre.
              </li>
              <li>
                Revisá a las 2–4 semanas: ¿estamos aprendiendo o solo reportando? Ajustá el
                ritmo, no el eslogan.
              </li>
            </ol>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Waterfall está “obsoleto”?",
        answer:
          "No. Está mal aplicado en contextos de alta incertidumbre, igual que Agile está mal aplicado cuando el alcance es fijo y el cambio es carísimo. La herramienta sigue siendo válida para el problema correcto.",
      },
      {
        question: "¿Puedo mezclar Waterfall y Agile en el mismo proyecto?",
        answer:
          "Sí, si sos explícito: por ejemplo, diseño y compliance en cascada, implementación en sprints; o contrato por fases con demos internas frecuentes. Lo que no funciona es mezclar sin reglas de cambio de alcance.",
      },
      {
        question: "¿Agile siempre es Scrum?",
        answer:
          "No. Scrum es un framework Agile. Kanban también puede ser Agile en espíritu (entregar seguido, limitar WIP, mejorar el flujo). Elegí según ritmo y tipo de trabajo, no por el logo de la certificación.",
      },
      {
        question: "¿Qué hago si el cliente pide cascada y el equipo quiere Agile?",
        answer:
          "Negociá la interfaz: entregables y fechas de fase para el cliente; ciclos cortos y demos internas para el equipo. Traducí el lenguaje de ambos lados en un solo plan de hitos, no en dos religiones.",
      },
    ],
  },
};
