import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "que-es-un-backlog",
  title: "Qué es un backlog (y qué no es)",
  excerpt:
    "Qué es un backlog de trabajo: la cola ordenada por prioridad de todo lo que falta hacer. Tipos (product, sprint, kanban), qué entra y qué no, y cómo podarlo.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-08-31",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "tablero-kanban",
  related: [
    "tablero-kanban",
    "historias-de-usuario",
    "sprint-planning-como-hacerlo",
    "lista-tareas-vs-gestion-proyectos",
  ],
  seo: {
    title: "Qué es un backlog (y qué no es) | Hito",
    description:
      "Qué es un backlog: la cola priorizada de trabajo pendiente. Product backlog vs sprint backlog, qué entra y qué no, y cómo evitar el backlog cementerio.",
    ogImageAlt: "Qué es un backlog: cola priorizada frente a caja de ideas sin orden.",
  },
  content: {
    eyebrow: "Organización del trabajo",
    intro: (
      <>
        <strong>En una línea:</strong> un <strong>backlog</strong> es la cola de trabajo
        pendiente de un equipo, ordenada por prioridad: lo que falta hacer, con lo más importante
        arriba. No es una caja de ideas ni un archivo de “para algún día”; es una lista viva que
        se poda. Si tu backlog crece sin límite y nadie lo revisa, dejó de ser un backlog.
      </>
    ),
    sections: [
      {
        heading: "Qué es un backlog",
        body: (
          <>
            <p>
              Un <strong>backlog</strong> (en español, “lista de pendientes” o “trabajo en cola”)
              es el conjunto de trabajos que un equipo sabe que tiene que hacer y todavía no
              hace, ordenado del más al menos importante. La palabra viene de Scrum —donde el{" "}
              <em>product backlog</em> es el inventario priorizado de lo que el producto
              necesita— pero el concepto sirve para cualquier equipo: agencias, contenido,
              operaciones.
            </p>
            <p>
              Las dos propiedades que hacen que una lista de pendientes sea un backlog:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Está ordenado por prioridad, no por fecha de llegada.</strong> Lo de
                arriba es lo próximo que entra; lo de abajo espera su turno. No hay tres cosas
                “urgentes” empatadas.
              </li>
              <li>
                <strong>Se revisa y se poda.</strong> Cada semana o cada sprint, alguien quita lo
                que ya no importa, reordena y afina lo que está por entrar. Un backlog que solo
                crece no es una cola: es un cementerio con orden alfabético.
              </li>
            </ul>
            <p>
              El complemento del backlog es el tablero: el backlog dice{" "}
              <em>qué va a entrar</em>; el{" "}
              <Link to="/blogs/tablero-kanban" className="underline underline-offset-2">
                tablero kanban
              </Link>{" "}
              dice <em>qué está pasando ahora</em>. Son capas distintas del mismo sistema.
            </p>
          </>
        ),
      },
      {
        heading: "Los 3 backlogs que verás en la práctica",
        body: (
          <>
            <p>
              “Backlog” no es una sola cosa. Según el marco, la palabra nombra colas distintas:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Backlog</th>
                  <th className="py-2 pr-4 font-semibold">Qué contiene</th>
                  <th className="py-2 font-semibold">Quién lo ordena</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Product backlog</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Todo lo que el producto podría necesitar: funcionalidades, mejoras, deudas.
                    Horizonte de meses.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El product owner (o quien decida producto en tu equipo).
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Sprint backlog</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El subconjunto comprometido para un sprint de 1–4 semanas. No crece durante
                    el sprint.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El equipo, en el sprint planning (cómo se hace ese compromiso en{" "}
                    <Link
                      to="/blogs/sprint-planning-como-hacerlo"
                      className="underline underline-offset-2"
                    >
                      Sprint planning que se cumple
                    </Link>
                    ).
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Backlog del tablero (kanban)</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    La columna “Por hacer”: las tarjetas listas para entrar, ordenadas. Sin
                    sprints: entra cuando el WIP lo permite.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El equipo, en la revisión semanal del tablero.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              En equipos pequeños, el product backlog y el backlog del tablero suelen ser el
              mismo: la columna “Por hacer” con un tope de 10–15 tarjetas y el resto en una
              lista aparte. Está bien. Lo que no está bien es que la columna tenga 90 tarjetas
              “por si acaso”.
            </p>
          </>
        ),
      },
      {
        heading: "Qué entra en un backlog (y qué no)",
        body: (
          <>
            <p>
              El filtro tiene una pregunta: <strong>¿esto va a entrar al trabajo de las
              próximas 4–6 semanas si nada cambia?</strong>
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Entra:</strong> trabajo ya acordado con cliente o con producto,
                historias suficientemente concretas para estimar, deudas técnicas o de proceso
                ya reconocidas, mejoras con dueño que las pide.
              </li>
              <li>
                <strong>No entra (todavía):</strong> ideas sin discutir, “estarías bueno hacer
                X”, bugs sin reproducir, deseos de stakeholders que nadie priorizó. Eso vive en
                una lista de ideas separada —un notebook, un tablero de “estanqueidad”, lo que
                sea— y sube al backlog solo cuando alguien responde la pregunta de arriba.
              </li>
            </ul>
            <p>
              Y una cosa que nunca debe estar en un backlog: <strong>trabajo comprometido y en
              curso</strong>. Eso es tarjetas del tablero, no cola. La diferencia entre lista de
              tareas personal y backlog de equipo (que incluye plazos, dependencias y alcance)
              está en{" "}
              <Link
                to="/blogs/lista-tareas-vs-gestion-proyectos"
                className="underline underline-offset-2"
              >
                Lista de tareas vs gestión de proyectos
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Cómo se mantiene: el refinement en 30 minutos",
        body: (
          <>
            <p>
              En Scrum la ceremonia se llama <em>refinement</em> (o <em>grooming</em>) y no
              necesita más de 30 minutos semanales en un equipo pequeño. Tres actividades, en
              este orden:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Podar.</strong> Recorrer de abajo hacia arriba y eliminar sin drama lo
                que ya no se va a hacer. Si te da pena, muévelo a la lista de ideas; no lo dejes
                en la cola.
              </li>
              <li>
                <strong>Afinar lo que está por entrar.</strong> Los primeros 5–10 items: partir
                lo grande en piezas de días (el formato para cortar trabajo está en{" "}
                <Link to="/blogs/historias-de-usuario" className="underline underline-offset-2">
                  Historias de usuario
                </Link>
                ), aclarar criterios de “hecho”, adjuntar lo que falta para poder empezar.
              </li>
              <li>
                <strong>Reordenar.</strong> Subir lo que el cliente o el negocio movió; bajar lo
                que sonó urgente y dejó de serlo.
              </li>
            </ol>
            <p>
              El objetivo no es un backlog “completo”: es un backlog <em>confiable en su
              parte superior</em>. Nadie sabe qué hay en la posición 47 y nadie lo necesita; lo
              que sí necesita el equipo es que lo de arriba esté listo cuando el WIP abra
              espacio.
            </p>
          </>
        ),
      },
      {
        heading: "Los 4 síntomas del backlog enfermo",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Crece más rápido de lo que sale trabajo.</strong> La cola es un
                inventario; inventario que no rota es una promesa muerta. Regla: si un item
                lleva 2 meses sin moverse, se elimina o se reescribe.
              </li>
              <li>
                <strong>Nadie sabe quién ordena.</strong> Sin un dueño de prioridades, todo es
                “importante” y el equipo termina eligiendo por el orden que resulta cómodo.
              </li>
              <li>
                <strong>Tiene items de 3 semanas.</strong> “Rediseñar toda la web” no es un item
                de backlog; es un proyecto con varias historias dentro.
              </li>
              <li>
                <strong>Se usa como archivo.</strong> Si los items se guardan “para no perder
                la idea”, esa es la función de una lista de ideas, no de una cola de trabajo.
              </li>
            </ul>
            <p>
              Un backlog sano es corto donde importa: 10–20 items en la zona activa, orden real
              y un dueño. El resto del sistema —cómo entra el trabajo al tablero y a qué ritmo
              sale— es flujo kanban, y está en{" "}
              <Link to="/blogs/tablero-kanban" className="underline underline-offset-2">
                Tablero kanban: qué es y cómo usarlo
              </Link>
              .
            </p>
            <p>
              Si gestionas el backlog en una herramienta y quieres que viva en tu carpeta —JSON
              local, sin cuenta ni asientos, con tablero y procesos—{" "}
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
              — backlog, tablero kanban y procesos en tu propio equipo. Sin nube, sin cuenta.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un backlog?",
        answer:
          "Es la cola de trabajo pendiente de un equipo, ordenada por prioridad: lo que se sabe que hay que hacer y todavía no se hace, con lo más importante arriba. Se revisa y se poda de forma continua; si una lista de pendientes crece sin límite y nadie la ordena, es un archivo, no un backlog.",
      },
      {
        question: "¿Cuál es la diferencia entre product backlog y sprint backlog?",
        answer:
          "El product backlog contiene todo lo que el producto podría necesitar a meses vista, ordenado por valor. El sprint backlog es solo el subconjunto que el equipo se compromete a completar en un sprint de 1–4 semanas, y no crece durante el sprint. Uno es el inventario completo; el otro, el compromiso de la semana.",
      },
      {
        question: "¿Un backlog es lo mismo que una lista de tareas?",
        answer:
          "No exactamente. Una lista de tareas es captura: lo que se te ocurre, sin orden comprometido. Un backlog está priorizado por alguien con autoridad, se poda y alimenta el trabajo entrante de un equipo. La diferencia práctica entre lista personal y gestión de proyectos (dependencias, alcance, varios dueños) está en Lista de tareas vs gestión de proyectos.",
      },
      {
        question: "¿Quién mantiene el backlog?",
        answer:
          "En Scrum, el product owner ordena y el equipo afina en las sesiones de refinement. En un equipo pequeño sin roles formales: una sola persona dueña de prioridades (el líder, el fundador, el PM) y el equipo completo en una revisión semanal de 30 minutos. Lo que no funciona es el backlog de todos: sin dueño, no hay prioridad.",
      },
      {
        question: "¿Cuánto debe medir un backlog?",
        answer:
          "Su zona activa: 10–20 items listos y ordenados; el resto puede ser una lista larga y difusa sin problema. Lo que importa es que la parte superior sea confiable: los primeros items tienen que estar listos para entrar al tablero cuando el WIP abra espacio. Si hay 200 items, podar es lo primero.",
      },
    ],
  },
};
