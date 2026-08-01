import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "scrum-vs-kanban",
  title: "Scrum vs Kanban: diferencias reales y cuál elegir",
  excerpt:
    "Scrum y Kanban resuelven problemas distintos. Comparativa honesta de roles, ritmo y control de flujo para decidir cuál conviene a tu equipo.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-11-09",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  // Cuelga temporalmente del pilar general: cuando se publique el pilar del
  // cluster "Metodologías" (`metodologias-gestion-proyectos`, ver ROADMAP_BLOG.md)
  // este `pillar` debe apuntar ahí en vez de a la guía general.
  pillar: "gestion-de-proyectos-guia-completa",
  related: ["fases-de-un-proyecto", "matriz-raci"],
  seo: {
    title: "Scrum vs Kanban: diferencias reales y cuál elegir | Hito",
    description:
      "Scrum y Kanban resuelven problemas distintos. Comparativa honesta de roles, ritmo y control de flujo para elegir bien.",
    ogImageAlt: "Scrum vs Kanban: comparativa de roles, ritmo y flujo.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> Scrum organiza el trabajo en ciclos fijos (sprints) con
        roles y reuniones definidas, pensado para equipos que planifican qué van a entregar cada
        2-4 semanas. Kanban organiza el trabajo como un flujo continuo con límites de tareas en
        curso, pensado para equipos que reciben trabajo de forma impredecible (soporte,
        operaciones, mantenimiento). No son enemigos ni sucesores uno del otro — resuelven
        problemas distintos, y muchos equipos terminan usando un híbrido.
      </>
    ),
    sections: [
      {
        heading: "Qué es Scrum, en corto",
        body: (
          <>
            <p>
              Scrum divide el trabajo en <strong>sprints</strong> — ciclos de duración fija,
              típicamente 2 semanas — con tres roles (Product Owner, Scrum Master, equipo de
              desarrollo) y un ritual fijo: planificación al inicio del sprint, daily standup
              cada día, revisión y retrospectiva al final. El equipo se compromete a un conjunto
              cerrado de tareas al empezar el sprint y no lo modifica a mitad de camino salvo
              excepción.
            </p>
            <p>
              El valor central de Scrum es la <strong>previsibilidad del ciclo</strong>: al final
              de cada sprint hay una demo con algo funcionando, y el equipo puede medir su
              velocidad (cuánto trabajo completa por sprint) para planificar mejor los
              siguientes.
            </p>
          </>
        ),
      },
      {
        heading: "Qué es Kanban, en corto",
        body: (
          <>
            <p>
              Kanban no tiene ciclos ni roles fijos. El trabajo fluye por columnas (típicamente{" "}
              <em>Por hacer → En curso → Hecho</em>) y la única regla dura es el{" "}
              <strong>límite de trabajo en curso (WIP)</strong>: un máximo de tareas permitidas en
              cada columna intermedia. Cuando una columna llega a su límite, nadie puede tomar
              una tarea nueva hasta que termine y saque una de las que ya están en curso — esto
              fuerza a terminar antes de empezar más.
            </p>
            <p>
              No hay sprints ni compromiso cerrado: las tareas entran y salen del tablero de
              forma continua, según la prioridad del momento. Es el sistema natural para equipos
              cuyo trabajo llega de forma impredecible — soporte técnico, operaciones, un equipo
              de diseño que atiende pedidos de varias áreas.
            </p>
          </>
        ),
      },
      {
        heading: "Comparativa lado a lado",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold"></th>
                  <th className="py-2 pr-4 font-semibold">Scrum</th>
                  <th className="py-2 font-semibold">Kanban</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Ritmo</td>
                  <td className="py-2 pr-4">Ciclos fijos (sprints)</td>
                  <td className="py-2">Flujo continuo</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Roles</td>
                  <td className="py-2 pr-4">Product Owner, Scrum Master, equipo</td>
                  <td className="py-2">Ninguno obligatorio</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Cambios a mitad de ciclo</td>
                  <td className="py-2 pr-4">Se evitan hasta el próximo sprint</td>
                  <td className="py-2">Se aceptan en cualquier momento</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Métrica clave</td>
                  <td className="py-2 pr-4">Velocidad por sprint</td>
                  <td className="py-2">Tiempo de ciclo (cycle time)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Mejor para</td>
                  <td className="py-2 pr-4">Trabajo planificable en bloques de 2-4 semanas</td>
                  <td className="py-2">Trabajo impredecible o continuo</td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Cuál elegir según tu situación",
        body: (
          <>
            <p>
              La pregunta que decide no es "¿cuál es mejor?" sino:{" "}
              <strong>¿el trabajo que recibe mi equipo llega en lotes planificables, o llega de
              forma impredecible?</strong>
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Elegí Scrum</strong> si tu equipo construye producto o software con un
                backlog priorizable, y te beneficia mostrar avances cada 2-4 semanas a
                stakeholders — la cadencia fija ordena el trabajo y facilita reportar progreso.
              </li>
              <li>
                <strong>Elegí Kanban</strong> si tu equipo hace soporte, operaciones, o recibe
                pedidos de múltiples áreas sin poder planificarlos con semanas de anticipación —
                forzar un sprint sobre trabajo que llega al azar solo genera reordenar tareas
                constantemente.
              </li>
              <li>
                <strong>Un híbrido</strong> (a veces llamado Scrumban) — sprints con duración
                fija pero sin roles formales, o Kanban con una revisión periódica tipo
                retrospectiva — funciona bien para equipos chicos que quieren algo de estructura
                sin el overhead completo de Scrum.
              </li>
            </ul>
            <p>
              Ninguno de los dos resuelve, por sí solo, un alcance mal definido o estimaciones
              optimistas — esos problemas son anteriores a la metodología. Ver{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                las 5 fases de un proyecto
              </Link>{" "}
              y la{" "}
              <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                matriz RACI
              </Link>{" "}
              para la parte que ninguna metodología ágil reemplaza: quién decide qué.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Se pueden combinar Scrum y Kanban?",
        answer:
          "Sí — el híbrido más común (Scrumban) usa sprints de duración fija sin los roles formales de Scrum, o un tablero Kanban con límites WIP más una retrospectiva periódica. Funciona bien en equipos chicos que quieren algo de ritmo sin el overhead completo.",
      },
      {
        question: "¿Kanban sirve para proyectos con fecha de entrega fija?",
        answer:
          "Puede, pero pierde la ventaja de reportar avance por ciclos que sí ofrece Scrum. Para proyectos con fecha dura y alcance conocido de antemano, Scrum (o incluso un enfoque en cascada) suele dar mejor visibilidad del progreso.",
      },
      {
        question: "¿Qué es el 'límite WIP' y por qué es la regla central de Kanban?",
        answer:
          "WIP (work in progress) es la cantidad de tareas en curso al mismo tiempo. Limitarlo fuerza a terminar tareas antes de empezar nuevas, lo que reduce el multitasking y acorta el tiempo real que tarda cada tarea en completarse.",
      },
    ],
  },
};
