import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "reducir-trabajo-en-curso",
  title: "Por qué tu equipo entrega poco: demasiado trabajo empezado",
  excerpt:
    "Más tareas “en curso” no es más progreso — es más cambio de contexto y menos entregas. Cómo medir el WIP real y bajarlo sin frenar al equipo.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-02-22",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "gestionar-varios-proyectos-a-la-vez",
  related: [
    "kanban-limites-wip",
    "gestionar-varios-proyectos-a-la-vez",
    "reuniones-de-status-eliminar",
    "sprint-planning-como-hacerlo",
  ],
  seo: {
    title: "Por qué tu equipo entrega poco: demasiado trabajo empezado | Hito",
    description:
      "Más tareas “en curso” no es más progreso — es más cambio de contexto y menos entregas. Cómo medir el WIP real y bajarlo sin frenar al equipo.",
    ogImageAlt: "Reducir el trabajo en curso (WIP) para entregar más rápido.",
  },
  content: {
    eyebrow: "Tips y problemas reales",
    intro: (
      <>
        <strong>En una línea:</strong> un equipo que empieza 12 tareas a la vez no entrega 12
        tareas más rápido — entrega <strong>ninguna</strong> más lento, porque cada cambio de foco
        cobra un peaje invisible. Bajar el <strong>trabajo en curso (WIP)</strong> casi siempre
        aumenta la velocidad de entrega real, aunque se sienta contraintuitivo: parece que estás
        haciendo menos porque estás terminando, no empezando.
      </>
    ),
    sections: [
      {
        heading: "La paradoja: más trabajo empezado, menos entregado",
        body: (
          <>
            <p>
              Cuando un equipo se siente lento, el reflejo es abrir más frentes: “si esto está
              trabado, empecemos otra cosa mientras se destraba”. El resultado casi siempre es lo
              opuesto a lo buscado:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Todo está “en curso”, nada está “hecho”.</li>
              <li>El tiempo de ciclo (de empezar a terminar una tarea) se alarga para todos.</li>
              <li>
                Cada tarea nueva compite por la misma atención, así que ninguna avanza a la
                velocidad que tendría sola.
              </li>
              <li>La sensación de progreso baja aunque las horas trabajadas sean las mismas.</li>
            </ul>
            <p>
              Es la misma lógica que en{" "}
              <Link to="/blogs/kanban-limites-wip" className="underline underline-offset-2">
                los límites WIP de Kanban
              </Link>{" "}
              — pero acá no hablamos de una columna de un tablero, sino de la capacidad real del
              equipo o la persona.
            </p>
          </>
        ),
      },
      {
        heading: "El costo real del cambio de contexto",
        body: (
          <>
            <p>
              Cada vez que alguien pasa de la tarea A a la tarea B, no retoma donde quedó de forma
              instantánea: reconstruye contexto (qué faltaba, qué decisión estaba pendiente, dónde
              quedó el código o el documento). Con pocas tareas en curso ese costo es chico. Con
              muchas, se acumula:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Tareas en curso por persona</th>
                  <th className="py-2 font-semibold">Efecto típico</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">1</td>
                  <td className="py-2 text-muted-foreground">Foco completo, menor tiempo de ciclo</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">2-3</td>
                  <td className="py-2 text-muted-foreground">
                    Manejable si hay bloqueos naturales de espera entre ellas
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">4+</td>
                  <td className="py-2 text-muted-foreground">
                    El cambio de contexto empieza a comerse más tiempo que el trabajo mismo
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              No es un número mágico universal — depende del tipo de trabajo — pero la tendencia
              es consistente en casi cualquier equipo.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo medir cuánto WIP tenés hoy",
        body: (
          <>
            <p>No hace falta instrumentación compleja. Tres preguntas simples ya diagnostican:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                Contá cuántas tarjetas están en “En curso” (o equivalente) por persona, ahora
                mismo.
              </li>
              <li>
                Preguntá a cada persona: “¿en cuántas de estas estuviste trabajando hoy de verdad?”
                — la diferencia con el conteo anterior es el WIP fantasma.
              </li>
              <li>
                Medí cuánto tiempo pasa, en promedio, desde que una tarjeta entra a “En curso”
                hasta que sale a “Hecho”. Si ese número crece sin que las tareas sean más grandes,
                el WIP es la causa más probable.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Límites que sí funcionan (por persona y por equipo)",
        body: (
          <>
            <p>Reglas prácticas, no teóricas:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Por persona:</strong> 1-2 tareas activas en foco profundo. Una tercera solo
                si está genuinamente bloqueada esperando a otra persona.
              </li>
              <li>
                <strong>Por columna del tablero:</strong> un límite explícito visible en la columna
                “En curso”, no una convención tácita que nadie respeta.
              </li>
              <li>
                <strong>Por portafolio:</strong> si gestionás varios proyectos, el mismo principio
                aplica un nivel arriba — ver{" "}
                <Link
                  to="/blogs/gestionar-varios-proyectos-a-la-vez"
                  className="underline underline-offset-2"
                >
                  cómo gestionar varios proyectos a la vez
                </Link>
                .
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Qué hacer cuando el límite frena a alguien",
        body: (
          <>
            <p>
              El punto de un límite WIP no es prohibir trabajar — es hacer visible el bloqueo en
              vez de esconderlo detrás de “trabajo alternativo”. Cuando alguien choca contra el
              límite:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Primero, ayudá a <strong>terminar</strong> algo de lo que ya está en curso, no a
                empezar algo nuevo.
              </li>
              <li>
                Si de verdad no hay nada para avanzar, esa persona debería estar destrabando a
                otro, no abriendo un tercer frente propio.
              </li>
              <li>
                Si esto pasa seguido, el límite está bien puesto y el problema real es de
                dependencias mal secuenciadas — revisá el orden de trabajo, no el límite.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Cuando reducir reuniones libera más capacidad que cualquier límite",
        body: (
          <>
            <p>
              El WIP no es solo de tareas de producto — también de reuniones que fragmentan el
              día. Si el calendario de una persona tiene 6 bloques de 30 minutos entre reuniones,
              su “capacidad disponible” en el tablero es una ficción. Antes de pedirle que baje su
              WIP de tareas, revisá si el WIP de{" "}
              <Link
                to="/blogs/reuniones-de-status-eliminar"
                className="underline underline-offset-2"
              >
                reuniones de status
              </Link>{" "}
              es el verdadero cuello de botella.
            </p>
          </>
        ),
      },
      {
        heading: "Plan de 2 semanas para bajar el WIP sin frenar al equipo",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Semana 1 — medir:</strong> contá el WIP real por persona y el tiempo de
                ciclo actual. No cambies nada todavía.
              </li>
              <li>
                <strong>Semana 1 — poner el límite visible:</strong> agregá el número al tablero,
                aunque al principio se incumpla.
              </li>
              <li>
                <strong>Semana 2 — priorizar terminar sobre empezar:</strong> regla explícita: nadie
                toma tarea nueva si está por debajo del límite gracias a una que ya podría cerrar.
              </li>
              <li>
                <strong>Semana 2 — revisar el tiempo de ciclo:</strong> comparalo con la semana 1.
                Si bajó, el límite está funcionando; si no, revisá si el límite es realista para el
                tipo de trabajo.
              </li>
            </ol>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo bajar el trabajo en curso (WIP) de un equipo",
      steps: [
        {
          name: "Medir el WIP real",
          text: "Contá tareas activas por persona y el tiempo de ciclo promedio antes de cambiar nada.",
        },
        {
          name: "Poner un límite visible",
          text: "Un número explícito en el tablero, no una convención implícita. 1-2 en foco profundo por persona como punto de partida.",
        },
        {
          name: "Priorizar terminar sobre empezar",
          text: "Nadie toma tarea nueva mientras haya algo cerca de cerrar. El límite gana frente al impulso de \"mientras tanto\".",
        },
        {
          name: "Sacar el WIP fantasma de reuniones",
          text: "Un calendario fragmentado reduce la capacidad real tanto como demasiadas tareas abiertas.",
        },
        {
          name: "Comparar el tiempo de ciclo después de dos semanas",
          text: "Si bajó, el límite es correcto. Si no, ajustalo al tipo de trabajo real del equipo.",
        },
      ],
    },
    faq: [
      {
        question: "¿Bajar el WIP significa que el equipo produce menos?",
        answer:
          "Al contrario: casi siempre entrega más, porque cada tarea pasa menos tiempo esperando turno de atención. Lo que baja es el número de cosas empezadas a la vez, no el trabajo terminado.",
      },
      {
        question: "¿Cuál es un buen límite WIP para empezar?",
        answer:
          "1-2 tareas activas en foco profundo por persona es un punto de partida razonable para la mayoría de roles de ejecución. Ajustalo según el tipo de trabajo: tareas muy cortas toleran algo más de paralelismo que tareas largas y complejas.",
      },
      {
        question: "¿Qué hago si el equipo se resiste al límite?",
        answer:
          "Mostrales el tiempo de ciclo antes y después de dos semanas de prueba. La resistencia suele bajar cuando ven en números que menos tareas abiertas significa entregas más rápidas, no menos trabajo.",
      },
      {
        question: "¿El límite WIP aplica también a proyectos, no solo a tareas?",
        answer:
          "Sí. El mismo principio de foco escala a nivel portafolio: menos proyectos activos a la vez suele significar hitos más predecibles para todos.",
      },
    ],
  },
};
