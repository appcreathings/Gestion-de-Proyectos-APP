import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "tablero-kanban",
  title: "Tablero kanban: qué es, columnas y cómo usarlo",
  excerpt:
    "Qué es un tablero kanban, qué columnas tiene, qué lleva cada tarjeta y por qué sin límite de trabajo en curso es solo una lista tumbada. Cómo usarlo desde el lunes.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-08-29",
  readingTime: "10 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  related: [
    "como-hacer-tablero-kanban",
    "que-es-un-backlog",
    "kanban-limites-wip",
    "app-kanban",
    "dependencias-entre-tareas",
  ],
  seo: {
    title: "Tablero kanban: qué es y cómo usarlo | Hito",
    description:
      "Qué es un tablero kanban, qué columnas tiene, qué va en cada tarjeta y cómo usarlo día a día. La guía práctica, sin jerga, para equipos pequeños.",
    ogImageAlt: "Tablero kanban con columnas Por hacer, En curso, Revisión y Hecho.",
  },
  content: {
    eyebrow: "Organización del trabajo",
    intro: (
      <>
        <strong>En una línea:</strong> un <strong>tablero kanban</strong> es un tablero dividido
        en columnas —por hacer, en curso, hecho— donde cada tarea es una tarjeta que se mueve de
        izquierda a derecha. Sirve para que el equipo vea el estado real del trabajo en un
        vistazo y para limitar cuántas cosas se hacen a la vez. Sin ese límite, no es kanban: es
        una lista con forma de tablero.
      </>
    ),
    sections: [
      {
        heading: "Qué es un tablero kanban",
        body: (
          <>
            <p>
              Un <strong>tablero kanban</strong> es la representación visual del trabajo de un
              equipo: columnas que son etapas del proceso y tarjetas que son tareas. La palabra
              kanban viene del japonés <em>kan</em> (visual) y <em>ban</em> (tarjeta): nació en
              las fábricas de Toyota como señal visual de “falta material”, y llegó al software
              como la forma más simple de ver flujo de trabajo.
            </p>
            <p>
              La definición operativa es esta: si puedes responder “¿qué está en curso, qué está
              bloqueado y qué está terminado?” mirando el tablero 10 segundos, es un tablero
              kanban funcionando. Si necesitas preguntar a tres personas, el tablero es un mural
              decorativo.
            </p>
            <p>
              Ojo con la frontera: el tablero es la herramienta; kanban es el método (visualizar
              el flujo, limitar el trabajo en curso, gestionar lo bloqueado). Puedes tener un
              tablero digital como Trello sin hacer kanban, y puedes hacer kanban con notas
              adhesivas en una pared. La diferencia entre “tener tablero” y “hacer kanban” está
              en el límite de trabajo en curso, que cubrimos más abajo y a fondo en{" "}
              <Link to="/blogs/kanban-limites-wip" className="underline underline-offset-2">
                Kanban WIP: qué significa el límite
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Las columnas: 4 bastan para empezar",
        body: (
          <>
            <p>
              El error clásico es diseñar el tablero como el organigrama de la empresa. Las
              columnas no son equipos ni departamentos: son etapas del recorrido de una tarea,
              de izquierda a derecha. Para un equipo pequeño, cuatro columnas alcanzan:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Columna</th>
                  <th className="py-2 pr-4 font-semibold">Qué significa</th>
                  <th className="py-2 font-semibold">Regla de salida</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Por hacer</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Trabajo ya acordado, ordenado por prioridad. Arriba lo próximo.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Alguien la toma: se mueve con su nombre puesto.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">En curso</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Se está trabajando <em>hoy</em>. Límite WIP típico: 1–2 por persona.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Está lista para que otra persona la revise.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Revisión / Espera</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El trabajo del ejecutor terminó; falta aprobación, prueba o respuesta de
                    alguien más.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El revisor o el cliente da el visto bueno.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Hecho</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Terminado según un criterio explícito, no “ya lo envié”.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Se archiva o se borra el viernes. No es un museo.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La columna que casi todos olvidan —y la que más problemas destapa— es{" "}
              <strong>Revisión / Espera</strong>. Sin ella, las tareas que esperan aprobación
              del cliente se mezclan con las que alguien está trabajando de verdad, y el “en
              curso” se infla. Si el flujo tiene una etapa real distinta (diseño → aprobación de
              cliente → publicación), agrega esa columna; si no la tienes clara, empieza con
              cuatro y ajusta en dos semanas.
            </p>
            <p>
              Cómo armar el tablero completo desde cero —pared, pizarra o app— lo dejamos paso a
              paso, con tres ejemplos por industria, en{" "}
              <Link to="/blogs/como-hacer-tablero-kanban" className="underline underline-offset-2">
                Cómo hacer un tablero kanban
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Las tarjetas: qué lleva cada una",
        body: (
          <>
            <p>
              Una tarjeta no es “una idea”: es trabajo comprometido con dueño. Una tarjeta útil
              tiene cuatro cosas:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Un verbo y un resultado</strong>: “Redactar propuesta para Cafetería
                Norte”, no “propuesta”. El verbo deja claro cuándo termina.
              </li>
              <li>
                <strong>Un solo responsable</strong>. Si tienen dos, no tiene ninguno. La
                colaboración se resuelve con subtareas o con un responsable + colaboradores.
              </li>
              <li>
                <strong>Una fecha solo cuando la hay de verdad</strong>. Fechas inventadas para
                todo hacen que ninguna importe.
              </li>
              <li>
                <strong>El criterio de “hecho”</strong> cuando el trabajo no es obvio: “aprobada
                por el cliente por escrito”, no “lista”.
              </li>
            </ul>
            <p>
              Si la tarjeta necesita tres párrafos de contexto, no es una tarjeta: es una
              historia de usuario mal cortada. El formato para partir trabajo grande en
              tarjetas que caben está en{" "}
              <Link to="/blogs/historias-de-usuario" className="underline underline-offset-2">
                Historias de usuario: formato y cómo cortarlas
              </Link>
              . Y si una tarjeta no puede empezar hasta que otra termine, es una dependencia:
              conviene marcarla, no descubrirla el jueves. Cómo hacerlo sin instalar un Gantt en{" "}
              <Link
                to="/blogs/dependencias-entre-tareas"
                className="underline underline-offset-2"
              >
                Dependencias entre tareas
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "El límite WIP: lo que convierte un tablero en kanban",
        body: (
          <>
            <p>
              Aquí está la parte que separa el tablero útil del tablero de mentira. Un límite
              WIP (work in progress) es un tope explícito de tarjetas por columna —por ejemplo,
              “En curso: máx. 4”—. Cuando la columna está llena, nadie puede empezar algo
              nuevo: tiene que terminar o ayudar a terminar.
            </p>
            <p>
              ¿Por qué importa? Porque el trabajo que empieza y no termina es el que mata la
              entrega de un equipo. Diez tarjetas “en curso” significan diez contextos abiertos,
              diez cosas al 40 % y cero cosas al 100 %. El límite convierte el tablero en un
              sistema que empuja a terminar antes que empezar. El método para fijar el número,
              con ejemplos, está en{" "}
              <Link to="/blogs/kanban-limites-wip" className="underline underline-offset-2">
                Kanban WIP
              </Link>{" "}
              y el diagnóstico de por qué tu equipo entrega poco cuando todo está empezado, en{" "}
              <Link to="/blogs/reducir-trabajo-en-curso" className="underline underline-offset-2">
                Cómo reducir el trabajo en curso
              </Link>
              .
            </p>
            <p>
              Regla práctica para arrancar: cuenta las personas que ejecutan y pon el tope de
              “En curso” en 1–2 por persona. Si suena poco, es porque nadie había hecho visible
              cuánto llevaba realmente cada uno en paralelo.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo se usa en el día a día (el ritual mínimo)",
        body: (
          <>
            <p>
              Un tablero no requiere ceremonias. Requiere tres hábitos de minutos:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Cada uno mueve sus tarjetas cuando cambian de estado</strong>, no el
                viernes a las 18. Un tablero desactualizado es peor que ninguno: mentira con
                forma de orden.
              </li>
              <li>
                <strong>Una mirada de equipo al empezar el día</strong> (5–10 minutos): qué
                está bloqueado, qué columna está llena, qué se termina hoy. Si tu daily se
                volvió un interrogatorio de status, el formato que lo arregla está en{" "}
                <Link to="/blogs/daily-standup-util" className="underline underline-offset-2">
                  Daily standup que no sea pérdida de tiempo
                </Link>
                .
              </li>
              <li>
                <strong>Limpieza semanal</strong>: “Hecho” se archiva, “Por hacer” se reordena
                y las tarjetas muertas se matan sin piedad.
              </li>
            </ol>
            <p>
              Si mantienes esos tres hábitos, el tablero reemplaza la reunión de status: el
              estado ya está publicado, la reunión solo confirma bloqueos. Cómo hacer esa
              transición completa está en{" "}
              <Link to="/blogs/reuniones-de-status-eliminar" className="underline underline-offset-2">
                Reemplazar reuniones de status por un tablero
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Tablero físico vs. tablero digital",
        body: (
          <>
            <p>
              Ninguna opción es “la correcta”. Depende de dónde vive el equipo:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold"></th>
                  <th className="py-2 pr-4 font-semibold">Físico (pared, post-its)</th>
                  <th className="py-2 font-semibold">Digital (app)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Cuándo gana</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Todos comparten oficina y el trabajo es visible de paso.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Equipo remoto o híbrido, o trabajo con historial, adjuntos y clientes.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Fortaleza</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Imposible de ignorar; mover un post-it tiene un costo físico que obliga a
                    actualizar.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Historial, comentarios, subtareas, acceso desde cualquier lugar.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Techo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Muere con el primer día remoto y no guarda historia.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    También puede ignorarse. Una app llena de columnas fantasma engaña igual que
                    una pared abandonada.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Si decides digital, no confundas la herramienta con el método: qué tiene que tener
              una app de tablero y cuándo el tablero solo no alcanza, en{" "}
              <Link to="/blogs/app-kanban" className="underline underline-offset-2">
                App kanban: cuándo un tablero alcanza
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Los 5 errores que matan un tablero kanban",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Columnas de más.</strong> Ocho columnas con nombres que nadie distingue.
                Cada columna nueva es una excusa para no mover tarjetas.
              </li>
              <li>
                <strong>Sin límite WIP.</strong> “En curso” con 15 tarjetas. No es kanban; es
                una lista horizontal que disimula la sobrecarga.
              </li>
              <li>
                <strong>El backlog infinito.</strong> “Por hacer” con 200 tarjetas es un
                cementerio, no una cola. El backlog se poda: qué es y qué no, en{" "}
                <Link to="/blogs/que-es-un-backlog" className="underline underline-offset-2">
                  Qué es un backlog
                </Link>
                .
              </li>
              <li>
                <strong>Tarjetas sin dueño.</strong> “Alguien debería revisar el copy”. Nadie es
                alguien.
              </li>
              <li>
                <strong>El tablero que no se actualiza.</strong> Si el estado real está en el
                chat y no en el tablero, el tablero perdió. Vuelve al ritual de 3 hábitos o
                bórralo.
              </li>
            </ul>
            <p>
              El tablero kanban no reemplaza todo: para flujo diario es la herramienta correcta;
              para una fecha que depende de 20 predecesoras o un presupuesto, necesitas otra
              capa encima. Esa frontera —cuándo el tablero alcanza y cuándo necesitas
              cronograma o gestión de proyectos— está en{" "}
              <Link to="/blogs/app-kanban" className="underline underline-offset-2">
                App kanban
              </Link>{" "}
              y en{" "}
              <Link
                to="/blogs/lista-tareas-vs-gestion-proyectos"
                className="underline underline-offset-2"
              >
                Lista de tareas vs gestión de proyectos
              </Link>
              .
            </p>
            <p>
              Si quieres un tablero kanban local-first —los datos en una carpeta tuya, en JSON,
              sin cuenta ni asientos, con procesos y automatizaciones—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              está pensado para equipos de 1 a 15 personas.
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
              — tablero kanban, SOPs y automatizaciones en tu propio equipo. Sin cuenta, sin
              asientos, sin nube.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo usar un tablero kanban en 5 pasos",
      steps: [
        {
          name: "Define el recorrido de una tarea en columnas",
          text: "Por hacer → En curso → Revisión → Hecho es suficiente para empezar. Las columnas son etapas del proceso, no equipos ni personas.",
        },
        {
          name: "Vuelca solo el trabajo comprometido",
          text: "Tarjetas con verbo, resultado y un responsable. El backlog infinito va a una lista aparte, no al tablero.",
        },
        {
          name: "Pon un límite WIP en ‘En curso’",
          text: "1–2 tarjetas por persona que ejecuta. Cuando la columna está llena, se termina antes de empezar. Sin esto, el tablero es una lista tumbada.",
        },
        {
          name: "Actualiza en el momento, no el viernes",
          text: "Cada quien mueve sus tarjetas cuando cambian de estado. Un tablero desactualizado miente con forma de orden.",
        },
        {
          name: "Haz una mirada de equipo diaria y limpieza semanal",
          text: "5–10 minutos: bloqueos, columna llena, qué termina hoy. El viernes: archivar ‘Hecho’ y podar ‘Por hacer’.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es un tablero kanban?",
        answer:
          "Un tablero dividido en columnas —típicamente Por hacer, En curso y Hecho— donde cada tarea es una tarjeta que avanza de izquierda a derecha conforme se trabaja. Sirve para ver el estado real del trabajo de un vistazo y, si tiene límite de trabajo en curso, para obligar al equipo a terminar antes de empezar.",
      },
      {
        question: "¿Qué columnas tiene un tablero kanban?",
        answer:
          "Las mínimas: Por hacer, En curso y Hecho. La cuarta recomendada es Revisión o Espera, para separar lo que ya terminó el ejecutor pero sigue esperando aprobación o prueba. Las columnas representan etapas del proceso; si tu flujo real tiene una etapa distinta, nómbrala tú. Más de 6–7 columnas casi siempre es señal de recortar.",
      },
      {
        question: "¿Qué diferencia hay entre un tablero kanban y un tablero scrum?",
        answer:
          "El tablero kanban es continuo: las tarjetas entran y salen sin compromiso de fecha, y el límite es el WIP por columna. El tablero scrum se vacía y se llena en cada sprint de 2 semanas con alcance cerrado. Puedes ver la comparación completa de ambos marcos en Scrum vs Kanban.",
      },
      {
        question: "¿Qué va en cada tarjeta de un tablero kanban?",
        answer:
          "Un verbo con resultado (“redactar propuesta para X”), un único responsable, fecha solo si existe de verdad y, cuando el trabajo no es obvio, el criterio de ‘hecho’. Lo que no pertenece a una tarjeta: ideas sin compromiso ni contexto de tres párrafos; eso vive en el backlog o en una historia de usuario bien cortada.",
      },
      {
        question: "¿Cuántas columnas debe tener un tablero kanban?",
        answer:
          "Entre 3 y 6 para un equipo pequeño. Cada columna extra reduce la actualización y esconde cuellos de botella. La prueba: si tienes que explicarle a alguien nuevo qué significa cada columna más de una vez, hay columnas de más.",
      },
    ],
  },
};
