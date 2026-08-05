import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "daily-standup-util",
  title: "Daily standup que no sea pérdida de tiempo",
  excerpt:
    "El daily no es un status report al jefe: es coordinación de bloqueos en 15 minutos. Formato que funciona y cuándo hacerlo asíncrono.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-01-11",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "metodologias-gestion-proyectos",
  related: [
    "sprint-planning-como-hacerlo",
    "que-es-scrum-equipos-pequenos",
    "scrum-vs-kanban",
  ],
  seo: {
    title: "Daily standup que no sea pérdida de tiempo | Hito",
    description:
      "El daily no es un status report al jefe: es coordinación de bloqueos en 15 minutos. Formato que funciona y cuándo hacerlo asíncrono.",
    ogImageAlt: "Daily standup útil: 15 minutos y foco en bloqueos.",
  },
  content: {
    eyebrow: "Metodologías",
    intro: (
      <>
        <strong>En una línea:</strong> un daily útil dura 15 minutos, se centra en{" "}
        <strong>bloqueos y coordinación</strong>, y no es un reporte al jefe. Si cada persona
        narra su día completo y nadie se desbloquea, no tenés un standup: tenés una mini-reunión
        de status que come el mejor momento del día.
      </>
    ),
    sections: [
      {
        heading: "El daily se rompe cuando se convierte en reporte",
        body: (
          <>
            <p>
              El standup nació en equipos que necesitan sincronizarse rápido: qué se mueve, qué
              se traba, quién necesita a quién. Se rompe cuando:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Cada persona habla 5 minutos “por si acaso”.</li>
              <li>Solo le hablan al manager y el resto mira el techo.</li>
              <li>Se resuelven problemas técnicos en vivo (eso es otra reunión).</li>
              <li>No hay tablero o lista visible: todo es memoria y narrativa.</li>
            </ul>
            <p>
              En{" "}
              <Link
                to="/blogs/que-es-scrum-equipos-pequenos"
                className="underline underline-offset-2"
              >
                Scrum para equipos pequeños
              </Link>
              , el daily es una de las pocas ceremonias que valen la pena — si se usa para lo
              que es. Si tu equipo ya se coordina todo el día en el mismo espacio y no hay
              bloqueos, podés bajar la frecuencia o pasar a asíncrono.
            </p>
          </>
        ),
      },
      {
        heading: "Las 3 preguntas (y por qué la tercera es la que importa)",
        body: (
          <>
            <p>La versión clásica sigue siendo útil si se toma en serio:</p>
            <ol className="list-decimal space-y-3 pl-6 text-muted-foreground">
              <li>
                <strong>¿Qué avanzé desde el último standup?</strong> Una o dos oraciones. No
                es un diary.
              </li>
              <li>
                <strong>¿Qué voy a hacer hoy?</strong> Concreto: un resultado, no “trabajar en
                el proyecto”.
              </li>
              <li>
                <strong>¿Qué me bloquea o me puede bloquear?</strong> Acá está el valor. Un
                bloqueo sin dueño es trabajo invisible.
              </li>
            </ol>
            <p>
              Variante más afilada para equipos maduros: saltar (1) si el tablero ya lo muestra,
              y dedicar el tiempo a (2) y (3) + “¿a quién necesito hoy?”.
            </p>
          </>
        ),
      },
      {
        heading: "Formato que funciona en equipos de 3–10",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Duración:</strong> 15 minutos reloj. Si se pasa, el facilitador corta y
                agenda un follow-up de 2–3 personas.
              </li>
              <li>
                <strong>De pie o con cámara on y tablero compartido:</strong> el punto no es el
                ritual físico, es la urgencia leve de no alargarse.
              </li>
              <li>
                <strong>Orden por persona o por ítem en curso:</strong> en tableros con WIP
                visible, ir columna “En curso” suele ser más útil que monólogos por persona. Ver{" "}
                <Link to="/blogs/kanban-limites-wip" className="underline underline-offset-2">
                  límites WIP
                </Link>
                .
              </li>
              <li>
                <strong>Parking lot:</strong> cualquier debate de más de 60 segundos se anota y
                se resuelve después, solo con quien hace falta.
              </li>
            </ul>
            <p>
              Si venís de un{" "}
              <Link
                to="/blogs/sprint-planning-como-hacerlo"
                className="underline underline-offset-2"
              >
                sprint planning
              </Link>{" "}
              honesto, el daily debería sorprender poco: confirma el plan y expone fricción, no
              reescribe el sprint cada mañana.
            </p>
          </>
        ),
      },
      {
        heading: "Asíncrono: cuándo y cómo",
        body: (
          <>
            <p>El daily asíncrono funciona cuando:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Hay husos horarios o jornadas muy desfasadas.</li>
              <li>El equipo es muy chico (2–3) y el chat ya es denso.</li>
              <li>El standup síncrono se volvió teatro sin bloqueos reales.</li>
            </ul>
            <p>
              <strong>Formato mínimo asíncrono (antes de las 10:30 de cada uno):</strong>
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Actualizar el tablero (estado real, no “en progreso eterno”).</li>
              <li>
                Mensaje corto: foco de hoy + bloqueo (o “sin bloqueos”) + mención a quien
                necesitás.
              </li>
              <li>
                Quien facilita revisa bloqueos en los primeros 30 minutos de su jornada y
                agenda 1:1 si hace falta.
              </li>
            </ol>
            <p>
              Si los bloqueos se acumulan sin respuesta, el asíncrono falló: volvé a un slot
              síncrono de 10–15 minutos o mejorá el canal de escalado.
            </p>
          </>
        ),
      },
      {
        heading: "Roles: quién facilita, quién se calla",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Facilitador (rota o fijo):</strong> arranca a horario, corta debates,
                anota parking lot, cierra a los 15.
              </li>
              <li>
                <strong>Manager / lead:</strong> escucha más de lo que habla. Si convierte el
                daily en control de productividad, el equipo se cierra y el standup muere.
              </li>
              <li>
                <strong>Cada persona:</strong> habla de su trabajo y de cómo impacta al resto,
                no de su currículum del día.
              </li>
            </ul>
            <p>
              En equipos que mezclan Scrum y flujo continuo, el daily sigue siendo útil: el
              ritmo puede ser Kanban y la sincronización, diaria. Comparativa en{" "}
              <Link to="/blogs/scrum-vs-kanban" className="underline underline-offset-2">
                Scrum vs Kanban
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Señales de que hay que matar o rediseñar el daily",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Señal</th>
                  <th className="py-2 font-semibold">Qué probar</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Siempre se va a 30+ minutos</td>
                  <td className="py-2 text-muted-foreground">
                    Reloj visible + parking lot estricto
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Nadie menciona bloqueos nunca</td>
                  <td className="py-2 text-muted-foreground">
                    Preguntar “¿qué te puede trabar hoy?” o ir por el tablero
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Solo habla el lead</td>
                  <td className="py-2 text-muted-foreground">
                    El lead deja de moderar contenido; solo tiempo
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">El equipo ya se sincroniza solo</td>
                  <td className="py-2 text-muted-foreground">
                    Bajar a 3×/semana o asíncrono con tablero
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Mini-checklist post-standup",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Cada bloqueo tiene dueño o fecha de desbloqueo.</li>
              <li>Los follow-ups de 2–3 personas están agendados (no “después vemos”).</li>
              <li>El tablero refleja la realidad de hoy, no la del planning ideal.</li>
              <li>Nadie salió con una tarea nueva “urgente” sin sacar otra del foco.</li>
            </ul>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Hace falta daily si somos dos personas?",
        answer:
          "No necesariamente un meeting formal. Un check de 5 minutos o un mensaje asíncrono con foco y bloqueos suele alcanzar. El daily gana valor cuando hay tres o más hilos de trabajo que se pisan.",
      },
      {
        question: "¿Cómo hacerlo en remoto sin que sea Zoom eterno?",
        answer:
          "Misma regla de 15 minutos, cámara y tablero compartido, y parking lot estricto. Si no hay bloqueos dos días seguidos, probá asíncrono tres días y síncrono dos.",
      },
      {
        question: "¿Kanban sin sprints necesita daily?",
        answer:
          "No por dogma, sí si el flujo se traba o hay muchas manos en el mismo tablero. En Kanban puro el daily se parece más a “revisar el flujo y los cuellos de botella” que a las tres preguntas clásicas.",
      },
      {
        question: "¿El daily reemplaza el informe de estado al cliente?",
        answer:
          "No. El daily es interno. El cliente recibe un resumen semanal o un tablero compartido con el nivel de detalle que acordaron — no el monólogo diario del equipo.",
      },
    ],
  },
};
