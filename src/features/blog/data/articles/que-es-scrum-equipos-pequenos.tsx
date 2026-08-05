import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "que-es-scrum-equipos-pequenos",
  title: "Qué es Scrum, sin certificaciones",
  excerpt:
    "Scrum explicado sin la burocracia de certificaciones: qué es, cómo funciona en la práctica para equipos pequeños, y qué ceremonias son realmente necesarias.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-12-21",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "metodologias-gestion-proyectos",
  related: [
    "scrum-vs-kanban",
    "kanban-limites-wip",
    "sprint-planning-como-hacerlo",
    "daily-standup-util",
    "retrospectivas-formatos",
  ],
  seo: {
    title: "Qué es Scrum, sin certificaciones | Hito",
    description:
      "Scrum explicado sin la burocracia de certificaciones: qué es, cómo funciona en la práctica para equipos pequeños, y qué ceremonias son realmente necesarias.",
    ogImageAlt: "Qué es Scrum explicado sin certificaciones.",
  },
  content: {
    eyebrow: "Metodologías",
    intro: (
      <>
        <strong>En una línea:</strong> Scrum divide el trabajo en sprints de 2-4 semanas, cada uno con
        un objetivo claro, un backlog de tareas y tres ceremonias: planning al inicio, daily (15 min)
        cada mañana y retrospectiva al final. No necesitás un Scrum Master certificado ni un Product
        Owner full-time en un equipo pequeño — necesitás un dueño del backlog (una persona que decide
        qué entra en el sprint) y disciplina para seguir el ritmo.
      </>
    ),
    sections: [
      {
        heading: "Qué es Scrum (sin la definición de manual)",
        body: (
          <>
            <p>
              Scrum es un framework para gestionar trabajo complejo en iteraciones cortas llamadas{" "}
              <strong>sprints</strong>. Cada sprint tiene una duración fija (generalmente 2 semanas), un
              objetivo claro y una lista de tareas que el equipo se compromete a completar. Al final del
              sprint, se entrega algo que funciona — no necesariamente completo, pero usable.
            </p>
            <p>
              La diferencia clave con Waterfall (cascada) es que Scrum permite cambiar el alcance entre
              sprints según lo que se aprendió. Si descubrís que una funcionalidad no es tan importante,
                la sacás del siguiente sprint. Si descubrís que otra es crítica, la agregás. Eso es{" "}
              <strong>Agile</strong> en la práctica.
            </p>
          </>
        ),
      },
      {
        heading: "Los 3 roles (simplificados para equipos pequeños)",
        body: (
          <>
            <p>
              Scrum define tres roles, pero en equipos pequeños algunos se pueden fusionar:
            </p>
            <ul className="list-disc space-y-3 pl-6 text-muted-foreground">
              <li>
                <strong>Product Owner:</strong> dueño del backlog (lista de tareas pendientes). Decide qué
                entra en el sprint y qué prioridad tiene. En un equipo pequeño, puede ser el fundador,
                el PM o alguien del equipo técnico que tenga visión de producto.
              </li>
              <li>
                <strong>Scrum Master:</strong> facilitador. Se asegura de que el proceso Scrum se siga y
                de que las reuniones sean útiles, no burocracia. En equipos pequeños de 3-5 personas, este
                rol suele ser compartido o innecesario — el mismo Product Owner puede facilitar.
              </li>
              <li>
                <strong>Equipo de desarrollo:</strong> quienes hacen el trabajo. En Scrum puro, este equipo
                es cross-functional (tiene todas las habilidades necesarias para completar el sprint sin
                depender de otros). En la práctica, equipos pequeños a veces dependen de una persona externa
                (diseñador freelancer, etc.) — no es ideal, pero se puede trabajar con eso.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "El ciclo de un sprint, paso a paso",
        body: (
          <>
            <p>
              Un sprint sigue este ciclo (adaptado a equipos pequeños):
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Sprint planning (1 hora):</strong> al inicio del sprint, el equipo revisa el
                objetivo, decide qué tareas entra en el sprint y se compromete a completarlas. No es una
                promesa de hierro — es un compromiso en base a la información disponible.
              </li>
              <li>
                <strong>Daily standup (15 min):</strong> cada mañana, el equipo se reúne 15 minutos para
                responder tres preguntas: ¿qué hice ayer? ¿qué haré hoy? ¿qué me está bloqueando? No es
                un reporte al jefe, es sincronización entre pares. Ver{" "}
                <Link to="/blogs/daily-standup-util" className="underline underline-offset-2">
                  daily standup que no sea pérdida de tiempo
                </Link>
                .
              </li>
              <li>
                <strong>Ejecución:</strong> el equipo trabaja en las tareas. El Product Owner está disponible
                para dudas, pero no cambia prioridades a mitad de sprint — eso rompe el compromiso.
              </li>
              <li>
                <strong>Sprint review (30 min):</strong> al final, el equipo muestra lo que completó y recibe
                feedback. No es una demo formal — es una conversación sobre qué funcionó y qué no.
              </li>
              <li>
                <strong>Retrospectiva (30 min):</strong> el equipo discute qué funcionó bien del proceso y qué
                hay que mejorar en el próximo sprint. Ver{" "}
                <Link to="/blogs/retrospectivas-formatos" className="underline underline-offset-2">
                  formatos de retrospectiva
                </Link>
                .
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Qué ceremonias NO necesitás en un equipo pequeño",
        body: (
          <>
            <p>
              Scrum "de manual" tiene más ceremonias de las que un equipo pequeño realmente necesita:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Backlog grooming:</strong> una reunión específica para limpiar el backlog. En equipos
                pequeños, esto se hace de forma continua — el Product Owner mantiene el backlog limpio sin
                una reunión formal.
              </li>
              <li>
                <strong>Scrum de Scrum:</strong> reunión entre Scrum Masters de varios equipos. Si tu equipo es
                uno solo, esta reunión no tiene sentido.
              </li>
              <li>
                <strong>Daily standup formalizada al extremo:</strong> si el equipo trabaja en la misma
                habitación y se comunica todo el día, la daily puede ser innecesaria. Si el equipo es remoto,
                la daily es útil, pero no tiene que ser estrictamente "cada mañana a las 9am" — puede ser
                cuando el equipo lo necesite.
              </li>
            </ul>
            <p>
              La regla de oro: si una ceremonia no aporta valor, sacala. Scrum es un medio, no un fin.
            </p>
          </>
        ),
      },
      {
        heading: "Scrum vs Kanban: cuándo elegir cuál",
        body: (
          <>
            <p>
              Scrum y Kanban resuelven problemas distintos. Scrum te da un ritmo fijo (sprints) y
              forzante (compromiso). Kanban te da flujo continuo y visibilidad del trabajo en curso. Si tu
              equipo se dispersa fácilmente sin ritmos regulares, Scrum. Si prefiere trabajar sin
              interrupciones artificiales, Kanban. Comparativa completa en{" "}
              <Link to="/blogs/scrum-vs-kanban" className="underline underline-offset-2">
                Scrum vs Kanban
              </Link>
              .
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Necesito un Scrum Master certificado?",
        answer:
          "No. En equipos pequeños de 3-5 personas, el rol de Scrum Master suele ser compartido o innecesario. Lo importante es que alguien se asegure de que el proceso se siga, no que tenga un certificado.",
      },
      {
        question: "¿El objetivo del sprint tiene que ser funcional al 100%?",
        answer:
          "Scrum original dice que sí, pero en la práctica, equipos pequeños a veces entregan algo funcional pero no completo. Lo clave es que sea usable — no un demo vacío, pero tampoco necesariamente perfecto.",
      },
      {
        question: "¿Qué pasa si no terminamos todas las tareas del sprint?",
        answer:
          "Pasó. No es un fracaso, es información. En la retrospectiva, revisá por qué no se terminó (estimación equivocada, bloqueos externos, cambio de prioridad) y ajustá el próximo sprint. Lo que NO conviene es arrastrar las tareas pendientes automáticamente al siguiente sprint — priorizá de nuevo.",
      },
    ],
  },
};