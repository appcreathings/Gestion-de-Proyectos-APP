import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "metodologias-gestion-proyectos",
  title: "PILAR — Metodologías de gestión de proyectos: cuál usar según tu equipo",
  excerpt:
    "Scrum, Kanban, Waterfall, Agile: cuál conviene según el tipo de proyecto, el tamaño del equipo y la incertidumbre del alcance. Guía práctica sin certificaciones.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-12-14",
  readingTime: "14 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  related: [
    "scrum-vs-kanban",
    "que-es-scrum-equipos-pequenos",
    "kanban-limites-wip",
    "waterfall-vs-agile",
  ],
  seo: {
    title: "Metodologías de gestión de proyectos: cuál usar según tu equipo | Hito",
    description:
      "Scrum, Kanban, Waterfall, Agile: cuál conviene según el tipo de proyecto, el tamaño del equipo y la incertidumbre del alcance. Guía práctica sin certificaciones.",
    ogImageAlt: "Metodologías de gestión de proyectos: cuál elegir según tu equipo.",
  },
  content: {
    eyebrow: "Metodologías",
    intro: (
      <>
        <strong>En una línea:</strong> la metodología correcta no es la de moda, es la que se adapta a
        tu tipo de proyecto. Si el alcance es fijo y conocido, cascada (Waterfall). Si el alcance es
        incierto y puede cambiar, Agile (Scrum, Kanban). Entre Scrum y Kanban, la elección depende de
        si tu equipo necesita ritmos fijos (Scrum) o flujo continuo (Kanban). Las certificaciones no te
        enseñan a elegir; esta guía sí.
      </>
    ),
    sections: [
      {
        heading: "Las dos preguntas que deciden todo",
        body: (
          <>
            <p>
              Antes de evaluar cualquier metodología, respondé dos preguntas:
            </p>
            <ol className="list-decimal space-y-3 pl-6 text-muted-foreground">
              <li>
                <strong>¿Sé hoy exactamente qué hay que entregar, o lo voy a descubrir en el camino?</strong>
                {" "}Si lo sabés, cascada. Si lo vas a descubrir, Agile.
              </li>
              <li>
                <strong>¿El equipo trabaja mejor con ritmos fijos o con flujo continuo?</strong> Si el equipo
                necesita checkpoints regulares para no perder foco, Scrum. Si prefiere no interrumpir el
                trabajo artificialmente, Kanban.
              </li>
            </ol>
            <p>
              Todas las metodologías son respuestas a estas dos preguntas. Lo demás (ceremonias,
              artefactos, roles) es implementación. Elegir la metodología equivocada porque "es la que
              se usa" en tu industria es la forma más rápida de crear burocracia sin resolver el
              problema real.
            </p>
          </>
        ),
      },
      {
        heading: "Waterfall (cascada): cuándo el alcance es fijo y conocido",
        body: (
          <>
            <p>
              Waterfall planifica todo el proyecto antes de empezar y ejecuta en fases secuenciales:
              requisitos → diseño → desarrollo → testing → despliegue. No hay vuelta atrás fácil: si
              descubrís un problema en desarrollo, te cuesta cambiar requisitos porque el diseño ya se
              aprobó y el presupuesto se asignó.
            </p>
            <p>
              <strong>Cuándo conviene:</strong> construcción, cumplimiento regulatorio, migraciones con
              fecha inamovible, proyectos donde el costo de equivocarse es alto (por ejemplo,
              hardware). Características clave: alcance fijo, fecha clara, el cliente sabe exactamente
              qué quiere.
            </p>
            <p>
              <strong>Cuándo NO conviene:</strong> productos digitales, marketing, cualquier proyecto
              donde el feedback del usuario puede cambiar el rumbo. Comparativa completa{" "}
              <Link to="/blogs/waterfall-vs-agile" className="underline underline-offset-2">
                Waterfall vs Agile
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Agile: cuando el alcance es incierto y puede cambiar",
        body: (
          <>
            <p>
              Agile no es una metodología, es una filosofía: planificamos en ciclos cortos, entregamos
              valor rápidamente, y ajustamos según lo que aprendemos. Scrum y Kanban son las dos
              implementaciones más comunes, pero Agile puede ser simplemente "entregar algo cada dos
              semanas y preguntar al cliente si vamos bien".
            </p>
            <p>
              <strong>Cuándo conviene:</strong> productos digitales, marketing, proyectos donde no sabés
              exactamente qué necesita el usuario hasta que lo ve en acción. Características clave:
              alcance flexible, feedback temprano, iteración.
            </p>
          </>
        ),
      },
      {
        heading: "Scrum: cuando tu equipo necesita ritmos fijos",
        body: (
          <>
            <p>
              Scrum divide el trabajo en <strong>sprints</strong> de 2-4 semanas. Cada sprint tiene un
              objetivo claro, una lista de tareas (backlog) y tres ceremonias: sprint planning al
              inicio, daily standup cada mañana (15 minutos) y retrospectiva al final. Al final del
              sprint, se entrega algo incrementable — no necesariamente completo, pero funcional.
            </p>
            <p>
              <strong>Cuándo conviene:</strong> equipos que se dispersan fácilmente sin ritmos
              regulares, proyectos donde el stakeholder necesita ver progreso predecible cada sprint.
              Características clave: tiempo fijo, alcance flexible, roles definidos (Product Owner,
              Scrum Master, equipo). Ver{" "}
              <Link to="/blogs/que-es-scrum-equipos-pequenos" className="underline underline-offset-2">
                Qué es Scrum, sin certificaciones
              </Link>{" "}
              para la guía práctica.
            </p>
          </>
        ),
      },
      {
        heading: "Kanban: cuando tu equipo prefiere flujo continuo",
        body: (
          <>
            <p>
              Kanban no tiene sprints ni fechas fijas. El trabajo se mueve en un tablero con columnas
              (por ejemplo, Por hacer / En curso / Hecho) y se aplica el principio de{" "}
              <strong>límite WIP</strong> (Work In Progress): no se pueden tener más de X tareas en
              "En curso" a la vez. El límite fuerza a terminar antes de empezar algo nuevo. El foco es
              el flujo continuo y reducir el tiempo que tarda una tarea en pasar de Por hacer a Hecho.
            </p>
            <p>
              <strong>Cuándo conviene:</strong> equipos que trabajan mejor sin interrupciones
              artificiales, soporte y mantenimiento, proyectos donde las prioridades cambian
              frecuentemente y no conviene planificar sprints fijos. Características clave: flujo
              continuo, límites WIP, visualización del trabajo. Ver{" "}
              <Link to="/blogs/kanban-limites-wip" className="underline underline-offset-2">
                Kanban en la práctica: límites WIP
              </Link>{" "}
              para cómo implementarlo.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo elegir: árbol de decisión simple",
        body: (
          <>
            <p>
              ¿Tu proyecto tiene alcance fijo y conocido? → Sí →{" "}
              <strong>Waterfall</strong> (cascada). No → ¿Tu equipo necesita ritmos fijos? → Sí →{" "}
              <strong>Scrum</strong>. No → <strong>Kanban</strong>.
            </p>
            <p>
              Eso es todo. Las 100 páginas de documentación de cada metodología son para implementar
              detalles, no para decidir. Si tu equipo ya está usando algo y funciona, no cambies por la
              guía de otra persona — cambia solo cuando el dolor de la metodología actual sea mayor que
              el costo de aprender algo nuevo.
            </p>
          </>
        ),
      },
      {
        heading: "Metodologías y fases del proyecto",
        body: (
          <>
            <p>
              La metodología que elijas determina cómo se vive la{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                fase de planificación y seguimiento del proyecto
              </Link>
              , pero no las fases en sí. Todo proyecto tiene inicio, planificación, ejecución,
              seguimiento y cierre — la metodología define cuánto tiempo pasás en cada una y con qué
              herramientas. Lo que no cambia es la pregunta central del seguimiento: ¿vamos a tiempo?
              Lo que cambia es cómo respondés esa pregunta: con sprints (Scrum), con flujo continuo
              (Kanban) o con hitos planificados de antemano (Waterfall).
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo elegir metodología en 3 pasos",
      steps: [
        {
          name: "Respondé si el alcance es fijo",
          text: "¿Sé hoy exactamente qué hay que entregar? Si sí, cascada. Si no, Agile (Scrum o Kanban).",
        },
        {
          name: "Definí si tu equipo necesita ritmos fijos",
          text: "¿El equipo se dispersa sin checkpoints regulares? Si sí, Scrum (sprints). Si no, Kanban (flujo continuo).",
        },
        {
          name: "Arrancá simple",
          text: "No implementes todas las ceremonias de una metodología el primer día. Arrancá con el mínimo (por ejemplo, un solo sprint de Scrum sin Scrum Master, o un tablero Kanban sin límites WIP) y agregá complejidad solo cuando el dolor de no tenerla sea real.",
        },
      ],
    },
  },
};