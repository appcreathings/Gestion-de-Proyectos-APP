import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "kanban-limites-wip",
  title: "Kanban en la práctica: límites WIP",
  excerpt:
    "El principio de límites WIP (Work In Progress) es lo que hace que Kanban funcione: no podés empezar algo nuevo antes de terminar algo viejo. Cómo definirlo y por qué importa.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-12-28",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "metodologias-gestion-proyectos",
  related: ["scrum-vs-kanban", "que-es-scrum-equipos-pequenos", "reducir-trabajo-en-curso"],
  seo: {
    title: "Kanban en la práctica: límites WIP | Hito",
    description:
      "El principio de límites WIP (Work In Progress) es lo que hace que Kanban funcione: no podés empezar algo nuevo antes de terminar algo viejo. Cómo definirlo y por qué importa.",
    ogImageAlt: "Kanban en la práctica: límites WIP explicados.",
  },
  content: {
    eyebrow: "Metodologías",
    intro: (
      <>
        <strong>En una línea:</strong> Kanban funciona porque tiene un principio simple:{" "}
        <strong>no podés tener más de X tareas en curso a la vez</strong>. Eso es el límite WIP (Work In
        Progress). Si el límite es 3 y ya tenés 3 tareas en "En curso", no podés mover una cuarta desde
        "Por hacer" hasta que una de las tres pase a "Hecho". El límite fuerza a terminar antes de
        empezar — y eso es lo que reduce el tiempo que tarda una tarea en ir del inicio al fin.
      </>
    ),
    sections: [
      {
        heading: "Qué es el límite WIP (y por qué sin eso, Kanban no es Kanban)",
        body: (
          <>
            <p>
              Kanban tiene tres principios básicos: visualizar el trabajo, limitar el trabajo en curso,
              y gestionar el flujo. El segundo es el que lo diferencia de un tablero cualquiera. Un
              tablero donde tenés 15 tareas en "En curso" y no hay límite no es Kanban — es una lista de
              tareas desordenada.
            </p>
            <p>
              <strong>El problema sin límite WIP:</strong> cuando no hay límite, el equipo tiende a
              empezar muchas tareas y terminar pocas. El resultado es un montón de trabajo a medio hacer
              y nada que se entregue. El límite WIP corrige esto invirtiendo el incentivo: no podés
              empezar algo nuevo hasta terminar algo viejo, así que terminás más rápido.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo definir el límite WIP correcto",
        body: (
          <>
            <p>
              El límite WIP no se inventa — se calcula en base a tu equipo. Dos formas simples:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Método del tamaño del equipo:</strong> límite WIP = número de personas en el
                equipo. Si son 4 personas, límite WIP = 4. Es un punto de partida, no una regla fija.
              </li>
              <li>
                <strong>Método del flujo actual:</strong> mirá tu tablero actual y contá cuántas tareas
                hay en "En curso". Si hay 8 y el equipo está bloqueado, bajalo a 6 y medí el resultado.
                Ajustá hasta que el flujo mejore.
              </li>
            </ul>
            <p>
              <strong>Regla de oro:</strong> el límite WIP debe ser lo suficientemente bajo como para
              forzar al equipo a terminar, pero lo suficientemente alto como para que no sea una fuente
              de bloqueo constante. Si siempre estás chocando contra el límite, es muy bajo. Si nunca lo
              tocás, es muy alto.
            </p>
          </>
        ),
      },
      {
        heading: "Límites WIP por columna (no solo global)",
        body: (
          <>
            <p>
              Kanban avanzado usa límites WIP por columna, no solo un límite global para "En curso".
              Por ejemplo:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Columna</th>
                  <th className="py-2 font-semibold">Límite WIP</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Por hacer</td>
                  <td className="py-2">Sin límite</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">En curso</td>
                  <td className="py-2">3</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Testing</td>
                  <td className="py-2">2</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Hecho</td>
                  <td className="py-2">Sin límite</td>
                </tr>
              </tbody>
            </table>
            <p>
              En este ejemplo, si hay 2 tareas en "Testing", no se puede mover una tercera hasta que una
              pase a "Hecho". Esto evita que Testing se convierta en un cuello de botella donde las
              tareas se acumulan sin avanzar.
            </p>
          </>
        ),
      },
      {
        heading: "Qué hacer cuando chocás contra el límite WIP",
        body: (
          <>
            <p>
              Si el límite WIP es 3 y ya tenés 3 tareas en "En curso", llegás una nueva tarea y no
              podés moverla a "En curso". ¿Qué hacés?
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Priorizá:</strong> ¿alguna de las 3 tareas actuales puede esperar? Si sí, movela a
                "Por hacer" y entra la nueva.
              </li>
              <li>
                <strong>Terminá algo:</strong> la respuesta correcta en Kanban es terminar una de las 3
                tareas actuales, no arrancar una cuarta.
              </li>
              <li>
                <strong>Ajustá el límite:</strong> si esto pasa seguido, quizás el límite es muy bajo.
                Aumentalo a 4 y medí el impacto en el flujo.
              </li>
            </ol>
            <p>
              La tentación es "por esta vez hago una excepción". No la hagas. El límite WIP pierde valor
              si tiene excepciones constantes.
            </p>
          </>
        ),
      },
      {
        heading: "Kanban y Scrum: ¿son incompatibles?",
        body: (
          <>
            <p>
              No. Muchos equipos usan Scrum para el ritmo (sprints) y Kanban para el flujo interno (tablero
              con límites WIP dentro del sprint). El límite WIP protege el sprint: si el límite es 3 y
              hay 3 tareas en curso, el equipo no empieza una cuarta aunque esté en el backlog del sprint,
              lo que aumenta la probabilidad de completar el compromiso. Ver{" "}
              <Link to="/blogs/scrum-vs-kanban" className="underline underline-offset-2">
                Scrum vs Kanban
              </Link>{" "}
              para más detalles.
            </p>
          </>
        ),
      },
      {
        heading: "Límites WIP y carga de trabajo del equipo",
        body: (
          <>
            <p>
              Los límites WIP exponen cuándo el equipo está sobrecargado. Si siempre estás chocando
              contra el límite WIP y no hay manera de terminarlo más rápido, el problema no es el límite
              — es que el equipo tiene demasiado trabajo. Ver{" "}
              <Link to="/blogs/reducir-trabajo-en-curso" className="underline underline-offset-2">
                por qué tu equipo entrega poco: demasiado trabajo empezado
              </Link>
              {" "}para profundizar en este tema.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿El límite WIP tiene que ser el mismo para todas las columnas?",
        answer:
          "No. De hecho, suele ser mejor tener límites distintos según el flujo de tu equipo. Por ejemplo, Testing puede tener un límite más bajo que Desarrollo si testing suele ser el cuello de botella.",
      },
      {
        question: "¿Qué pasa si el cliente pide algo urgente y el límite WIP ya está lleno?",
        answer:
          "Si es verdaderamente urgente, el cliente puede aprobar romper el límite WIP por una vez — pero eso se registra como una excepción, no como norma. Si esto pasa seguido, el límite está mal definido o el equipo está sobrecargado.",
      },
      {
        question: "¿Kanban funciona sin límites WIP?",
        answer:
          "Kanban sin límites WIP es solo un tablero. El límite es el principio que crea el comportamiento correcto (terminar antes de empezar). Sin límite, Kanban es menos efectivo que Scrum o Waterfall.",
      },
    ],
  },
};