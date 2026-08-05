import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "retrospectivas-formatos",
  title: "Retrospectivas: 5 formatos y cómo elegir",
  excerpt:
    "Una retro sin 1–2 acciones con dueño y fecha es teatro. Cinco formatos prácticos y cómo elegir el correcto en 30 segundos.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-01-18",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "metodologias-gestion-proyectos",
  related: [
    "sprint-planning-como-hacerlo",
    "que-es-scrum-equipos-pequenos",
    "scrum-vs-kanban",
  ],
  seo: {
    title: "Retrospectivas: 5 formatos y cómo elegir | Hito",
    description:
      "Una retro sin 1–2 acciones con dueño y fecha es teatro. Cinco formatos prácticos y cómo elegir el correcto en 30 segundos.",
    ogImageAlt: "Formatos de retrospectiva de sprint: Start/Stop, 4Ls, Sailboat y más.",
  },
  content: {
    eyebrow: "Metodologías",
    intro: (
      <>
        <strong>En una línea:</strong> una retrospectiva sirve si termina con{" "}
        <strong>máximo 1–2 acciones</strong>, cada una con dueño y fecha — no con un mural de
        post-its que nadie vuelve a mirar. El formato es solo la excusa para conversar con
        estructura; el resultado es el cambio de proceso del próximo ciclo.
      </>
    ),
    sections: [
      {
        heading: "Para qué sirve una retro (y para qué no)",
        body: (
          <>
            <p>
              <strong>Sirve para:</strong> mejorar cómo trabajamos (flujo, comunicación,
              herramientas, hábitos), no para reescribir el producto entero ni para echar culpas.
            </p>
            <p>
              <strong>No sirve para:</strong> performance review individual, status al
              stakeholder, ni “desahogo sin cierre”. Si alguien necesita un feedback personal, es
              otra conversación, en otro momento.
            </p>
            <p>
              En el ciclo de{" "}
              <Link
                to="/blogs/que-es-scrum-equipos-pequenos"
                className="underline underline-offset-2"
              >
                Scrum
              </Link>
              , la retro cierra el sprint: planning → ejecución → review → retrospectiva. En
              Kanban no hay sprint, pero sí conviene un ritual periódico (cada 1–2 semanas) con
              la misma regla de acciones concretas.
            </p>
          </>
        ),
      },
      {
        heading: "Regla de oro: máximo 2 acciones, dueño y fecha",
        body: (
          <>
            <p>
              Equipos entusiastas salen de la retro con 12 mejoras. A la semana no hicieron
              ninguna. Mejor:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Elegí las <strong>1 o 2</strong> acciones de mayor impacto y menor esfuerzo.
              </li>
              <li>
                Cada acción tiene <strong>un dueño</strong> (una persona, no “el equipo”).
              </li>
              <li>
                Cada acción tiene <strong>fecha de check</strong> (el próximo planning o la
                próxima retro).
              </li>
              <li>
                La retro siguiente <strong>empieza</strong> revisando si se hicieron — si no, no
                sumes más deuda de mejoras.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Los 5 formatos (cuándo usar cada uno)",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Formato</th>
                  <th className="py-2 pr-4 font-semibold">Cuándo</th>
                  <th className="py-2 font-semibold">Cómo se corre (resumen)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Start / Stop / Continue</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Default; equipos nuevos en retros
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Tres columnas: qué empezar, qué parar, qué seguir. Votación rápida.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Mad / Sad / Glad</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Post-conflicto, burnout o sprint emocional
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Qué enojó, qué entristeció, qué alegró. Cuidado con el blame.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">4Ls</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Aprendizaje, onboarding, sprint de descubrimiento
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Liked, Learned, Lacked, Longed for.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Sailboat</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Visión a medio plazo + riesgos
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Viento (impulso), anclas (frenos), rocas (riesgos), isla (meta).
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Timeline</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Sprint caótico o post-incidente
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Línea de tiempo del ciclo; picos de energía y caídas.
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Cómo elegir en 30 segundos",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                ¿Es la primera retro del equipo o hace meses que no hacen? →{" "}
                <strong>Start / Stop / Continue</strong>.
              </li>
              <li>
                ¿Hubo roce, cansancio o un sprint “pesado” emocionalmente? →{" "}
                <strong>Mad / Sad / Glad</strong> (con facilitación cuidadosa).
              </li>
              <li>
                ¿Entró gente nueva o el foco fue aprender? → <strong>4Ls</strong>.
              </li>
              <li>
                ¿Están planificando un trimestre o un lanzamiento grande? →{" "}
                <strong>Sailboat</strong>.
              </li>
              <li>
                ¿El sprint fue un incendio y nadie entiende qué pasó? →{" "}
                <strong>Timeline</strong>.
              </li>
            </ol>
            <p>
              Rotá formatos cada tanto: el mismo ritual 20 sprints seguidos adormece al equipo.
            </p>
          </>
        ),
      },
      {
        heading: "Facilitación en equipos chicos (sin coach)",
        body: (
          <>
            <p>Agenda de 30–45 minutos que funciona:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Check-in (3 min):</strong> una palabra de cómo llega cada uno.
              </li>
              <li>
                <strong>Recuerdo de acciones anteriores (5 min):</strong> ¿se hicieron? ¿qué
                aprendimos?
              </li>
              <li>
                <strong>Generación silenciosa (8 min):</strong> cada uno escribe en el formato
                elegido antes de hablar (evita el anclaje al primero que habla).
              </li>
              <li>
                <strong>Agrupar y votar (10 min):</strong> temas, no monólogos.
              </li>
              <li>
                <strong>Acciones (10 min):</strong> 1–2, dueño, fecha. Listo.
              </li>
            </ol>
            <p>
              El facilitador protege el tiempo y el tono. No tiene que ser un Scrum Master
              certificado — puede rotar. Si el{" "}
              <Link
                to="/blogs/sprint-planning-como-hacerlo"
                className="underline underline-offset-2"
              >
                planning
              </Link>{" "}
              y el{" "}
              <Link to="/blogs/daily-standup-util" className="underline underline-offset-2">
                daily
              </Link>{" "}
              ya están sanos, la retro suele ser más corta y más concreta.
            </p>
          </>
        ),
      },
      {
        heading: "Qué hacer con las acciones la semana siguiente",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Las acciones de proceso viven en el mismo tablero que el trabajo (columna
                “Mejoras” o etiquetas), no en un doc huérfano.
              </li>
              <li>
                Si una acción es grande, partila o no la aceptes: una retro no es un segundo
                backlog de producto.
              </li>
              <li>
                En el próximo planning, reservá capacidad explícita si la mejora come tiempo real
                (por ejemplo, “limpiar el backlog 1 h”).
              </li>
            </ul>
            <p>
              Si siempre elegís Scrum o Kanban y la retro no mejora el flujo, el problema puede
              ser la metodología o el WIP — no el formato de la reunión. Ver{" "}
              <Link to="/blogs/scrum-vs-kanban" className="underline underline-offset-2">
                Scrum vs Kanban
              </Link>
              .
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo correr una retrospectiva en 5 pasos",
      steps: [
        {
          name: "Elegir el formato según el momento del equipo",
          text: "Start/Stop/Continue por defecto; Mad/Sad/Glad si hubo roce; 4Ls si hubo aprendizaje; Sailboat para visión; Timeline si el ciclo fue caótico.",
        },
        {
          name: "Revisar acciones de la retro anterior",
          text: "Si no se hicieron, no sumes más deuda: cerrá o reformulá antes de inventar doce mejoras nuevas.",
        },
        {
          name: "Generar ideas en silencio y luego agrupar",
          text: "Cada persona escribe primero; después se comparten y se agrupan temas para evitar monólogos.",
        },
        {
          name: "Votar y elegir 1–2 acciones",
          text: "Priorizá impacto y esfuerzo realista. Cada acción con un dueño (una persona) y una fecha de check.",
        },
        {
          name: "Poner las acciones donde se trabaja",
          text: "En el tablero o la lista del equipo, no en un documento que nadie vuelve a abrir.",
        },
      ],
    },
    faq: [
      {
        question: "¿Cada cuánto hacer retrospectivas si no usamos sprints?",
        answer:
          "Cada 1–2 semanas o al cerrar un hito grande. La cadencia importa más que el nombre “sprint”. Sin cadencia, los problemas se normalizan y nunca se nombran.",
      },
      {
        question: "¿La retro tiene que incluir al cliente o al jefe?",
        answer:
          "Por defecto, no. Es un espacio del equipo que hace el trabajo. Si hay un stakeholder de confianza y el tema lo requiere, puede entrar a una parte — no a todo el desahogo.",
      },
      {
        question: "¿Qué hago si solo hay quejas y ninguna acción viable?",
        answer:
          "Pedí que cada queja se reformule como “qué cambiaríamos nosotros”. Si el bloqueo es externo (presupuesto, otra área), la acción puede ser escalar con un dueño y un mensaje concreto, no “que alguien lo arregle”.",
      },
      {
        question: "¿Cuánto debe durar?",
        answer:
          "30–45 minutos en equipos de hasta ~8 personas. Si se va a 90 minutos, sobra teatro o faltan votos y cierre de acciones.",
      },
    ],
  },
};
