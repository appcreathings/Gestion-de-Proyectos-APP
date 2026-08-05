import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "sprint-planning-como-hacerlo",
  title: "Sprint planning que se cumple",
  excerpt:
    "Cómo hacer un sprint planning que el equipo realmente pueda cumplir: capacidad real, poco trabajo bien cortado y un compromiso en una frase.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-01-04",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "metodologias-gestion-proyectos",
  related: [
    "que-es-scrum-equipos-pequenos",
    "como-estimar-tiempos-proyecto",
    "daily-standup-util",
  ],
  seo: {
    title: "Sprint planning que se cumple: guía práctica | Hito",
    description:
      "Cómo hacer un sprint planning que el equipo realmente pueda cumplir: capacidad real, poco trabajo bien cortado y un compromiso en una frase.",
    ogImageAlt: "Sprint planning que se cumple: capacidad, backlog y compromiso.",
  },
  content: {
    eyebrow: "Metodologías",
    intro: (
      <>
        <strong>En una línea:</strong> un sprint planning que se cumple define{" "}
        <strong>capacidad real</strong> (no deseo), elige poco, corta bien las historias y termina
        con un compromiso que el equipo puede verbalizar en una frase. Si el planning es un wishlist
        de 3 horas, el sprint ya empezó en deuda.
      </>
    ),
    sections: [
      {
        heading: "Por qué el sprint planning suele mentir",
        body: (
          <>
            <p>
              El planning falla casi siempre por las mismas tres razones — y ninguna se resuelve
              comprando otra app:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Overcommit:</strong> se mete más trabajo del que el equipo puede terminar
                en el tiempo del sprint. Se confunde “ojalá” con “podemos”.
              </li>
              <li>
                <strong>Historias mal cortadas:</strong> ítems que no caben en un sprint, sin
                criterio de terminado, o con dependencias ocultas de otra persona.
              </li>
              <li>
                <strong>Capacidad fantasma:</strong> se planifica como si todo el mundo estuviera
                100% disponible, sin vacaciones, soporte, reuniones ni trabajo no planificado.
              </li>
            </ul>
            <p>
              Un buen planning no es predecir el futuro: es hacer un compromiso honestamente
              acotado con la información de hoy. Si querés el marco completo de Scrum sin jerga de
              certificación, arrancá por{" "}
              <Link
                to="/blogs/que-es-scrum-equipos-pequenos"
                className="underline underline-offset-2"
              >
                qué es Scrum para equipos pequeños
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Preparación el día antes (el 80% del éxito)",
        body: (
          <>
            <p>
              Si el backlog llega al planning sin orden ni claridad, la reunión se convierte en
              debate de requisitos. Eso no es planning: es descubrimiento disfrazado de ceremonia.
            </p>
            <p>
              <strong>Checklist del dueño del backlog (Product Owner o equivalente):</strong>
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Top 10–15 ítems ordenados por valor, no por “lo que gritó más fuerte”.</li>
              <li>
                Cada ítem tiene un <strong>resultado esperado</strong> en una o dos oraciones (qué
                se entrega y para quién).
              </li>
              <li>
                Dependencias y bloqueos conocidos están anotados (diseño pendiente, acceso a un
                sistema, decisión del cliente).
              </li>
              <li>
                Hay un borrador de <strong>objetivo del sprint</strong>: una frase que diga por
                qué existe este sprint.
              </li>
            </ul>
            <p>
              En equipos chicos, esta prep puede ser 30 minutos la tarde anterior. Sin prep, el
              planning se alarga y el compromiso se debilita.
            </p>
          </>
        ),
      },
      {
        heading: "Capacidad real: cómo contarla sin story points mágicos",
        body: (
          <>
            <p>
              Antes de elegir trabajo, contá cuánto tiempo real tenés. Una forma simple para
              equipos de 3–10 personas:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                Días hábiles del sprint × personas disponibles = <strong>días-persona brutos</strong>.
              </li>
              <li>
                Restá lo que ya sabés que se come el calendario: feriados, vacaciones, on-call,
                soporte, reuniones fijas, demos a clientes.
              </li>
              <li>
                Aplicá un factor de realismo (muchos equipos usan 60–70% del tiempo “teórico” como
                trabajo de proyecto). Si el sprint pasado se cumplió al 50%, no planifiques al 90%
                esta vez.
              </li>
            </ol>
            <p>
              Los story points pueden ayudar a comparar tamaño relativo, pero no reemplazan la
              conversación de capacidad. Si siempre fallás las estimaciones, el problema no es el
              planning: es el método de estimación. Ver{" "}
              <Link
                to="/blogs/como-estimar-tiempos-proyecto"
                className="underline underline-offset-2"
              >
                cómo estimar tiempos de un proyecto
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Ritual de 60–90 minutos (paso a paso)",
        body: (
          <>
            <p>
              Para un sprint de 1–2 semanas en un equipo pequeño, 60–90 minutos alcanzan si el
              backlog llegó listo:
            </p>
            <ol className="list-decimal space-y-3 pl-6 text-muted-foreground">
              <li>
                <strong>Objetivo (10 min):</strong> el dueño del backlog propone el objetivo del
                sprint en una frase. El equipo lo discute hasta que todos lo puedan repetir sin
                mirar el tablero.
              </li>
              <li>
                <strong>Capacidad (5 min):</strong> se dice en voz alta cuántos “días-persona
                netos” hay. Sin ese número, todo lo demás es ilusión.
              </li>
              <li>
                <strong>Selección (30–40 min):</strong> se bajan ítems del backlog en orden hasta
                llenar la capacidad — no “hasta que se sienta ambicioso”. Se corta o se devuelve
                lo que no entra.
              </li>
              <li>
                <strong>Claridad (15–20 min):</strong> para cada ítem elegido: ¿qué es “hecho”?
                ¿quién arranca? ¿hay riesgo? Si nadie puede explicar el ítem en 30 segundos, no
                entra.
              </li>
              <li>
                <strong>Compromiso (5 min):</strong> el equipo confirma o recorta. El output no es
                una lista interminable: es objetivo + ítems + dueños tentativos.
              </li>
            </ol>
            <p>
              Si al minuto 90 todavía están debatiendo el alcance de una historia, esa historia no
              estaba lista. Sale del sprint o se parte en algo más chico.
            </p>
          </>
        ),
      },
      {
        heading: "Definition of Ready y Definition of Done (versión equipos chicos)",
        body: (
          <>
            <p>
              No hace falta un documento de 10 páginas. Dos listas cortas, visibles, bastan:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Definition of Ready (entra al sprint)</th>
                  <th className="py-2 font-semibold">Definition of Done (sale del sprint)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Resultado claro en 1–2 oraciones
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Criterios de aceptación verificables
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Sin dependencia bloqueante sin dueño
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Revisado / probado según el tipo de trabajo
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cabe en el sprint (o está cortado)
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Documentado o entregado donde el equipo lo busca
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Si un ítem no cumple Ready, no se “mete igual por esta vez”. Esa excepción es la
              semilla del sprint que no se cumple.
            </p>
          </>
        ),
      },
      {
        heading: "Señales de que el planning salió mal (y cómo arreglarlo en 48 h)",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Nadie puede decir el objetivo del sprint</strong> → reescribilo en una
                frase y pégalo arriba del tablero.
              </li>
              <li>
                <strong>El primer día ya hay 3 tareas nuevas “urgentes”</strong> → el planning
                ignoró el trabajo no planificado; recortá el sprint o protegé capacidad buffer.
              </li>
              <li>
                <strong>A mitad de sprint nadie termina nada</strong> → demasiados ítems en
                paralelo; bajá el WIP (ver{" "}
                <Link to="/blogs/kanban-limites-wip" className="underline underline-offset-2">
                  límites WIP
                </Link>
                ) y terminá antes de empezar.
              </li>
              <li>
                <strong>Al final sobra la mitad del backlog del sprint</strong> → el próximo
                planning arranca con menos ítems, no con “esta vez sí”.
              </li>
            </ul>
            <p>
              El daily es el sensor temprano: si cada mañana aparecen sorpresas de alcance, el
              planning no falló en la reunión — falló en la preparación. Profundizá en{" "}
              <Link to="/blogs/daily-standup-util" className="underline underline-offset-2">
                daily standup que no sea pérdida de tiempo
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Errores típicos (tabla rápida)",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Error</th>
                  <th className="py-2 font-semibold">Qué hacer en su lugar</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Planificar al 100% de la agenda</td>
                  <td className="py-2 text-muted-foreground">
                    Dejá buffer (reuniones, bugs, soporte)
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Meter “por las dudas” 5 ítems extra</td>
                  <td className="py-2 text-muted-foreground">
                    Backlog ordenado fuera del sprint; no en el compromiso
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Planning de 3 horas sin prep</td>
                  <td className="py-2 text-muted-foreground">
                    30 min de prep + 60–90 min de planning
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Cambiar el objetivo a mitad de sprint</td>
                  <td className="py-2 text-muted-foreground">
                    Si el mundo cambió, abortá o recortá el sprint con intención
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo correr un sprint planning en 5 pasos",
      steps: [
        {
          name: "Preparar el backlog el día anterior",
          text: "Ordená 10–15 ítems con resultado esperado, dependencias y un borrador de objetivo del sprint.",
        },
        {
          name: "Calcular capacidad real",
          text: "Días-persona netos del equipo menos vacaciones, soporte y un factor de realismo (60–70% es un punto de partida).",
        },
        {
          name: "Acordar el objetivo en una frase",
          text: "Todo el equipo debe poder repetir por qué existe este sprint sin mirar el tablero.",
        },
        {
          name: "Seleccionar solo lo que cabe",
          text: "Bajá ítems en orden de valor hasta llenar la capacidad. Lo que no entra, no entra.",
        },
        {
          name: "Confirmar Ready/Done y el compromiso",
          text: "Cada ítem con criterio de terminado y dueño tentativo. Si algo no está claro, se parte o se saca.",
        },
      ],
    },
    faq: [
      {
        question: "¿Cuánto debe durar un sprint planning?",
        answer:
          "Para sprints de 1–2 semanas en equipos pequeños, 60–90 minutos suelen alcanzar si el backlog llegó preparado. Si se alarga a 3 horas, el problema casi siempre es falta de prep o historias demasiado grandes.",
      },
      {
        question: "¿Story points u horas?",
        answer:
          "Los story points sirven para comparar tamaño relativo entre ítems. Las horas (o días-persona) sirven para chequear capacidad real. Muchos equipos usan ambos: puntos para conversar tamaño, capacidad en tiempo para no overcommitear.",
      },
      {
        question: "¿Se puede hacer sprint planning siendo una sola persona?",
        answer:
          "Sí, pero más corto: definí objetivo, listá 3–5 entregables que quepan en el tiempo y escribí qué es “hecho”. El valor del ritual es el compromiso escrito, no la ceremonia en grupo.",
      },
      {
        question: "¿Qué pasa si el sprint se cae a mitad de camino?",
        answer:
          "No arrastres todo al siguiente sprint en automático. Re-priorizá: el objetivo sigue vigente o no; qué se corta; qué se mueve. Usá la retrospectiva para ajustar capacidad y corte de historias la próxima vez.",
      },
    ],
  },
};
