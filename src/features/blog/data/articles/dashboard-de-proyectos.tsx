import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "dashboard-de-proyectos",
  title: "Dashboard de proyectos: la vista, no los 40 KPIs",
  excerpt:
    "Dashboard de proyectos: qué debe mostrar un tablero de control real, las cinco vistas mínimas y cómo mantenerlo sin convertirlo en un trabajo manual más.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-05",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "scrumban",
  related: ["scrumban", "kpis-gestion-proyectos", "portafolio-de-proyectos"],
  seo: {
    title: "Dashboard de proyectos: la vista, no los 40 KPIs | Hito",
    description:
      "Dashboard de proyectos: qué debe mostrar un tablero de control (y qué sobra), las 5 vistas mínimas y cómo armarlo sin convertirlo en un trabajo más.",
    ogImageAlt: "Dashboard de proyectos con avance, riesgo y próximas entregas.",
  },
  content: {
    eyebrow: "Control y métricas",
    intro: (
      <>
        <strong>En una línea:</strong> un dashboard de proyectos es una vista de datos que ya
        existen en tu gestión —avance, entregas, riesgos y carga—, no un proyecto de BI ni 40
        gráficos. Si mantenerlo te toma más de cinco minutos al día, no es un tablero de control:
        es otro reporte que alimentas a mano.
      </>
    ),
    sections: [
      {
        heading: "Qué es un dashboard de proyectos (y qué no)",
        body: (
          <>
            <p>
              Un dashboard de proyectos es una superficie donde mirar, en una pantalla y en menos
              de un minuto, el estado real de lo que tienes en marcha. Eso es todo. No es un
              sistema que genera datos: los toma de donde ya viven —el tablero, las fechas, los
              bloqueos— y los pone a la vista. La distinción importa porque el 90 % de los
              dashboards fallidos mueren por lo contrario: se construyen como un proyecto paralelo
              que exige alimentar datos que nadie anota.
            </p>
            <p>
              Tampoco es lo mismo que un KPI. El KPI es el indicador: una métrica con objetivo y
              umbral, tipo lead time menor de cinco días. El dashboard es la ventana donde miras
              ese y otros indicadores juntos. Primero defines qué medir —la selección de
              indicadores con sus umbrales está en{" "}
              <Link to="/blogs/kpis-gestion-proyectos" className="underline underline-offset-2">
                KPIs de gestión de proyectos
              </Link>
              — y después decides dónde mirarlos. Si haces el dashboard antes que los KPI, te
              quedas con gráficos bonitos sin dueño ni objetivo.
            </p>
            <p>
              La prueba de fuego es simple: si el tablero responde «¿cómo vamos?» sin que nadie
              tenga que preparar nada, es un dashboard. Si responder requiere una reunión previa o
              exportar planillas, es un reporte disfrazado.
            </p>
          </>
        ),
      },
      {
        heading: "Las 5 vistas mínimas de un tablero de control",
        body: (
          <>
            <p>
              No necesitas más que esto. Cinco vistas que responden las cinco preguntas que un
              responsable de proyectos se hace cada mañana:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Vista</th>
                  <th className="py-2 pr-4 font-semibold">Qué responde</th>
                  <th className="py-2 font-semibold">Señal de alarma</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Avance por proyecto</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Cada proyecto avanza según lo planificado?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El mismo porcentaje lleva dos semanas quieto.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Próximas entregas</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Qué vence en los próximos 30 días?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Hay entregas en el calendario sin dueño nombrado.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Riesgos y bloqueos abiertos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Qué puede frenar todo esta semana?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Un bloqueo lleva más de dos semanas abierto sin movimiento.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Carga del equipo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Quién está sobre su capacidad real?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El mismo nombre triplica la media de tarjetas en curso.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Desvíos contra el plan</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Se movió alcance, fecha o presupuesto sin registrar?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El desvío existe, pero nadie lo anotó como cambio.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Con estas cinco vistas cubres avance, futuro, riesgo, capacidad y control de cambios.
              Cualquier gráfico adicional tiene que ganarse su lugar respondiendo una pregunta que
              alguien haga de verdad cada semana. Si nadie la hace, sobra.
            </p>
          </>
        ),
      },
      {
        heading: "Qué SOBRA en un dashboard de proyectos",
        body: (
          <>
            <p>
              El exceso es la razón número uno por la que los tableros de control mueren en tres
              meses. Estos son los sospechosos habituales:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Cuarenta gráficos para todo.</strong> Si el dashboard tiene más widgets que
                proyectos, nadie lo mira. La regla es una pantalla, un minuto, una respuesta.
              </li>
              <li>
                <strong>Métricas sin dueño.</strong> Un indicador que nadie tiene obligación de
                mover ni de explicar no es información: es decoración. Cada vista necesita un
                nombre al lado.
              </li>
              <li>
                <strong>Vanity metrics.</strong> Tareas creadas, horas registradas, mensajes
                enviados: crecen siempre y no predicen entrega. Solo importan las métricas que
                cambian cuando el proyecto se desvía.
              </li>
              <li>
                <strong>Semáforos sin criterio.</strong> Verde, amarillo y rojo acordados por
                corazonada significan que todos los proyectos estarán en amarillo para no
                incomodar. El color necesita definición escrita: rojo es fecha en riesgo o
                bloqueo de más de una semana, no «algo de tensión».
              </li>
            </ul>
            <p>
              Y el síntoma definitivo: si el dashboard solo se abre cuando alguien de arriba pide
              números, no es un tablero de control, es un trámite. El buen dashboard se mira solo,
              porque está en la pantalla del equipo, no en un archivo que se envía.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo armarlo en una tarde",
        body: (
          <>
            <p>
              Armado como vista de datos existentes, un dashboard útil sale en una tarde. El
              orden:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Define la fuente única.</strong> Un solo lugar donde vive el trabajo: el
                tablero del equipo. Si el trabajo está en el tablero y el «estado» está en una
                planilla aparte, ya perdiste: dos fuentes nunca coinciden.
              </li>
              <li>
                <strong>Actualiza en el momento, no por reporte.</strong> La regla cultural que
                sostiene todo: quien mueve una tarjeta, actualiza su estado ahí mismo. Sin esta
                regla, cualquier dashboard miente en cuestión de días.
              </li>
              <li>
                <strong>Empieza con las cinco vistas.</strong> Avance, entregas, riesgos, carga y
                desvíos. Nada más el primer mes; lo que falte aparecerá solo, pedido por alguien
                que lo necesita de verdad.
              </li>
              <li>
                <strong>Si un dato hay que pedirlo, no va.</strong> Cada campo que exige
                preguntarle a alguien es un campo que estará vacío. Un dashboard se alimenta de lo
                que la gestión ya produce: estados, fechas, bloqueos y dueños.
              </li>
              <li>
                <strong>Automatiza el resto.</strong> Lo que se puede calcular —conteos,
                porcentajes, fechas límite— se calcula solo. Ningún número del tablero debería
                escribirse dos veces.
              </li>
            </ol>
            <p>
              El cambio real no es técnico sino de hábito: el dashboard deja de ser un entregable
              semanal y pasa a ser el subproducto del trabajo bien anotado. Cuando el tablero se
              actualiza en el momento, el dashboard ya está listo siempre; para ese modelo pull
              donde el tablero reemplaza a los reportes, mira{" "}
              <Link to="/blogs/scrumban" className="underline underline-offset-2">
                ScrumBan
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Dashboard personal vs dashboard de portafolio",
        body: (
          <>
            <p>
              Son dos alturas distintas y conviene no mezclarlas. El dashboard de un proyecto
              responde «¿cómo va este trabajo?»: su avance, sus bloqueos, su próxima entrega. El
              dashboard de portafolio sube un nivel y responde «¿cómo van todos y dónde pongo a la
              gente?»:               estado de cada proyecto, demanda contra capacidad y qué decisiones tomar.
              Si intentas que un solo tablero haga las dos cosas, termina gigante y neutro: demasiado
              detalle para decidir, demasiado resumen para ejecutar.
            </p>
            <p>
              La regla práctica: el equipo mira su dashboard de proyecto a diario; la dirección
              mira el de portafolio una vez al mes, en la revisión donde se prioriza y se pausa.
              La capa de decisión —qué entra, qué se detiene, quién se mueve— está desarrollada
              en{" "}
              <Link to="/blogs/portafolio-de-proyectos" className="underline underline-offset-2">
                portafolio de proyectos
              </Link>
              .
            </p>
            <p>
              Si quieres este tipo de tablero sin pagar licencias por asiento —con dashboard de
              portafolio, kanban con límites WIP y datos que viven en tu carpeta en JSON local, sin
              cuenta—{" "}
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
              — el dashboard se arma solo sobre tu tablero, local-first, sin nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un dashboard de proyectos?",
        answer:
          "Es una vista que reúne, en una sola pantalla, el estado real de tus proyectos: avance, próximas entregas, riesgos abiertos, carga del equipo y desvíos contra el plan. No genera datos propios: los toma del tablero donde el equipo ya trabaja y los pone a la vista para responder «¿cómo vamos?» en menos de un minuto.",
      },
      {
        question: "¿Qué debe incluir un tablero de control de proyectos?",
        answer:
          "Cinco vistas mínimas: avance por proyecto contra el plan, próximas entregas de los próximos 30 días, riesgos y bloqueos abiertos, carga de cada persona contra su capacidad real y desvíos de alcance, fecha o presupuesto registrados. Con esas cinco cubres pasado, futuro, riesgo y capacidad; todo lo demás tiene que justificarse por separado.",
      },
      {
        question: "¿Cuál es la diferencia entre un KPI y un dashboard?",
        answer:
          "El KPI es el indicador: una métrica con objetivo y umbral, por ejemplo lead time menor de cinco días. El dashboard es la vista donde miras varios indicadores juntos. Primero defines los KPIs y después el dashboard que los muestra; al revés, terminas con gráficos bonitos sin objetivo ni dueño.",
      },
      {
        question: "¿Cómo hacer un dashboard de proyectos sin herramientas caras?",
        answer:
          "Partiendo de la fuente única: el tablero donde el equipo ya anota su trabajo. Si cada tarea tiene estado, dueño, fecha y bloqueos visibles, las cinco vistas se calculan sobre esos datos sin planillas aparte. Herramientas con kanban y métricas integradas lo resuelven; lo que encarece un dashboard no es la app, es alimentar dos fuentes distintas.",
      },
      {
        question: "¿Cada cuánto se actualiza un dashboard de proyectos?",
        answer:
          "En el momento, no por ciclos. El modelo que funciona es que el estado se actualice cuando el trabajo cambia de columna, de dueño o de fecha, de modo que el dashboard esté siempre listo sin nadie que lo prepare. Si el tablero se actualiza una vez por semana en una reunión de reportes, el dashboard muestra la semana pasada, no el proyecto.",
      },
    ],
  },
};
