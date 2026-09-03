import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "asignar-tareas-equipo",
  title: "Cómo asignar tareas en un equipo sin crear cuellos de botella",
  excerpt:
    "Cómo asignar tareas en un equipo: un dueño por tarea, capacidad real (no nominal), el límite de trabajo en curso y el criterio de cuándo no asignar la fecha.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-02",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "tablero-kanban",
  related: [
    "tablero-kanban",
    "como-delegar-tareas",
    "gestion-de-recursos-proyecto",
    "seguimiento-de-tareas-equipo",
  ],
  seo: {
    title: "Cómo asignar tareas en un equipo sin cuellos de botella | Hito",
    description:
      "Asignación de tareas en equipos: un responsable por tarjeta, capacidad real, WIP visible y seguimiento pull. Los errores que crean cuellos de botella.",
    ogImageAlt: "Asignación de tareas en equipo: un dueño por tarjeta y WIP visible.",
  },
  content: {
    eyebrow: "Organización del trabajo",
    intro: (
      <>
        <strong>En una línea:</strong> asignar tareas bien es un mecanismo de cuatro reglas —un
        solo responsable por tarea, capacidad real en lugar de nominal, un límite visible de
        trabajo en curso y fechas solo donde existe un compromiso—. La mala asignación no se
        nota el día que asignas; se nota dos semanas después, cuando todo está al 60 % y nadie
        termina nada.
      </>
    ),
    sections: [
      {
        heading: "Asignar no es delegar (y confundirlas cuesta caro)",
        body: (
          <>
            <p>
              Primera aclaración, porque mezclarlas rompe equipos: <strong>delegar</strong> es
              transferir la responsabilidad de un resultado —con el nivel de autonomía
              acordado—, y es un hábito de liderazgo. <strong>Asignar</strong> es el mecanismo
              operativo: poner un trabajo concreto en manos de una persona concreta con el
              contexto para ejecutarlo. Delegas “el newsletter de agosto”; asignas “escribir el
              borrador del newsletter para el jueves”.
            </p>
            <p>
              Por eso un equipo puede tener una asignación perfecta y aun así un líder que no
              delega: si cada decisión pasa por él, el tablero está lleno de tarjetas suyas y el
              cuello de botella tiene nombre. Los 3 niveles de delegación y cómo soltar sin
              perder control están en{" "}
              <Link to="/blogs/como-delegar-tareas" className="underline underline-offset-2">
                Cómo delegar y dejar de ser el cuello de botella
              </Link>
              . Aquí nos quedamos en el mecanismo.
            </p>
          </>
        ),
      },
      {
        heading: "Las 4 reglas de la asignación que no crea cuellos de botella",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Un responsable por tarea.</strong> Si dos personas son responsables, no
                lo es ninguna. La colaboración se modela con subtareas con dueño cada una, o con
                un responsable + colaboradores. La tarjeta “equipo de diseño” no tiene dueño:
                tiene una excusa.
              </li>
              <li>
                <strong>Capacidad real, no nominal.</strong>                 Ana no tiene 40 horas para tareas
                nuevas: tiene las horas que quedan después del trabajo comprometido, reuniones
                y soporte. Asignar contra capacidad nominal es fabricar sobrecarga con la mejor
                intención. La gestión de capacidad completa —cómo medirla y
                detectar la sobrecarga antes de que explote— está en{" "}
                <Link
                  to="/blogs/gestion-de-recursos-proyecto"
                  className="underline underline-offset-2"
                >
                  Gestión de recursos en proyectos
                </Link>
                .
              </li>
              <li>
                <strong>Respeta el límite de trabajo en curso.</strong> Si el{" "}
                <Link to="/blogs/tablero-kanban" className="underline underline-offset-2">
                  tablero
                </Link>{" "}
                dice “En curso: máx. 2 por persona”, asignar una tercera no es planificar: es
                acumular. La cola honesta es “Por hacer”, ordenada; el trabajo nuevo entra
                cuando algo termina.
              </li>
              <li>
                <strong>Fecha solo donde hay compromiso real.</strong> Fechas inventadas para
                todo fabrican falsa urgencia y anestesian las verdaderas. La fecha va cuando hay
                entrega al cliente, dependencia de otra tarea o cierre de semana comprometido.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Los síntomas de una mala asignación (y el ajuste)",
        body: (
          <>
            <p>
              La asignación falla en silencio. Estos son los patrones que aparecen a las dos
              semanas, con su corrección:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Síntoma</th>
                  <th className="py-2 font-semibold">Ajuste</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Todo pasa por la misma persona (el líder “ayuda” en todo).
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Cuenta tarjetas por dueño. Si el líder tiene 3× la media, deja de asignarse
                    ejecución y delega el resultado.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Tarjetas sin dueño “para que alguien las tome”.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Regla: nadie empieza sin poner su nombre. En el reparto del lunes se
                    nombran todas.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    El especialista tiene 8 tarjetas porque solo él sabe.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Asigna una tarea de traspaso: documentar el proceso (
                    <Link
                      to="/blogs/como-documentar-procesos-equipos"
                      className="underline underline-offset-2"
                    >
                      SOP
                    </Link>
                    ) para poder repartir la próxima.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Tareas asignadas “para la semana que viene” que ya están en curso de
                    mentira.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Deben vivir en “Por hacer” del tablero, no en “En curso”. El WIP solo
                    cuenta trabajo activo.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Todos preguntan “¿qué me toca?” cada mañana.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    La asignación no está publicada. Asigna en el tablero, no en el chat: la
                    cola visible reemplaza al despachador.
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "El ritual: repartir el lunes, ajustar el jueves",
        body: (
          <>
            <p>
              La asignación no necesita ceremonia; necesita dos momentos:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Reparto del lunes (10 min).</strong> Mirar “Por hacer” ordenado por
                prioridad, la capacidad real de cada quien y lo bloqueado. Cada persona sale con
                sus 1–2 tareas de la semana nombradas. Lo que no cabe, espera en la cola; no se
                reparte “por si sobra tiempo”.
              </li>
              <li>
                <strong>Ajuste a mitad de semana.</strong> Si algo se bloquea o alguien termina
                antes, se mueve trabajo de la cola —no se crea trabajo nuevo—. Este es el
                momento en que la asignación protege al equipo en vez de aturdirlo.
              </li>
            </ol>
            <p>
              El complemento de asignar bien es no tener que preguntar cómo va: si el tablero se
              actualiza en el momento, el seguimiento se hace mirando, no interrogando. Ese
              modelo pull —y cómo dejar de pedir reportes— está en{" "}
              <Link to="/blogs/seguimiento-de-tareas-equipo" className="underline underline-offset-2">
                Seguimiento de tareas sin microgestionar
              </Link>
              .
            </p>
            <p>
              Si quieres asignar y seguir el trabajo en una herramienta que vive en tu carpeta
              —JSON local, sin cuenta, sin asientos, tablero con límites WIP y procesos—{" "}
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
              — asigna tareas con dueño y WIP visible, local-first, sin nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Cómo asignar tareas en un equipo de forma efectiva?",
        answer:
          "Con cuatro reglas: un solo responsable por tarea, capacidad real (no nominal) de cada persona, respeto al límite de trabajo en curso del tablero y fechas solo donde hay un compromiso real. Se materializa en un reparto semanal de 10 minutos sobre el tablero, con ajuste a mitad de semana moviendo trabajo de la cola, no creándolo.",
      },
      {
        question: "¿Qué pasa si una tarea tiene dos responsables?",
        answer:
          "Que no tiene ninguno: cada uno asume que el otro avanza. Si el trabajo necesita dos personas, divídelo en subtareas con dueño cada una, o nombra un responsable y deja a los demás como colaboradores. La regla es la misma en cualquier herramienta: una tarjeta, un nombre.",
      },
      {
        question: "¿Cómo equilibrar la carga de trabajo entre el equipo?",
        answer:
          "Primero hazla visible: cuenta tarjetas en curso por persona y compárala con la capacidad real de cada quien (horas menos reuniones y soporte). Si el mismo nombre duplica a la media semana tras semana, deja de asignarle ejecución y ataca la causa: suele ser que nadie más sabe hacer ese trabajo, y el fix es documentar y traspasar.",
      },
      {
        question: "¿Cuál es la diferencia entre asignar y delegar tareas?",
        answer:
          "Asignar es el mecanismo: poner una tarea concreta en manos de una persona con contexto y plazo. Delegar es el hábito de liderazgo: transferir la responsabilidad de un resultado con el nivel de autonomía acordado. Un equipo puede estar bien asignado y aun así tener un líder que no delega, con todas las decisiones pasando por él.",
      },
      {
        question: "¿Qué herramienta sirve para asignar tareas a un equipo?",
        answer:
          "Una que muestre dueño por tarjeta, orden de prioridad en la cola y un límite de trabajo en curso visible: un tablero kanban compartido cumple. Lo importante no es la app sino la convención: nadie empieza sin nombre, y lo asignado se publica en el tablero, no en el chat.",
      },
    ],
  },
};
