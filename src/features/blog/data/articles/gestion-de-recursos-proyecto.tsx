import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "gestion-de-recursos-proyecto",
  title: "Gestión de recursos en proyectos: asignar sin sobrecargar",
  excerpt:
    "Gestión de recursos en proyectos: tipos de recursos, cómo asignar según capacidad real (no nominal) y las señales de que tu equipo está sobrecargado antes de que explote.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-08-16",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "que-son-stakeholders",
  related: ["que-son-stakeholders", "como-delegar-tareas", "reducir-trabajo-en-curso"],
  seo: {
    title: "Gestión de recursos en proyectos | Hito",
    description:
      "Gestión de recursos en proyectos: tipos de recursos, cómo asignar por capacidad real y no nominal, y las señales tempranas de sobrecarga del equipo.",
    ogImageAlt: "Planificación de recursos: capacidad real del equipo contra asignaciones del proyecto.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> la <strong>gestión de recursos en proyectos</strong> es
        asegurar que las personas, el tiempo, el dinero y las herramientas estén donde el proyecto
        los necesita, en la cantidad que realmente pueden dar. El error más común no es faltar
        recursos: es asignar sobre una capacidad nominal que nadie tiene — y descubrirlo cuando ya
        hay tres proyectos atrasados.
      </>
    ),
    sections: [
      {
        heading: "Qué significa “recursos” en un proyecto",
        body: (
          <>
            <p>
              En gestión de proyectos, recursos son los insumos que el trabajo consume. Cuatro
              tipos cubren casi todo:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Humanos:</strong> las personas y sus horas disponibles con la habilidad
                correcta. El recurso más caro, el menos elástico y el que decide la fecha.
              </li>
              <li>
                <strong>Financieros:</strong> el presupuesto que paga todo lo demás. Se planifica
                junto a los tiempos porque el costo es tiempo multiplicado por tarifa.
              </li>
              <li>
                <strong>Materiales y equipos:</strong> licencias, servidores, máquinas, espacios.
                Suele ser el más fácil de prever y el que sorprende cuando falta (la licencia que
                nadie presupuestó).
              </li>
              <li>
                <strong>De tiempo:</strong> el resultado de los otros tres. No se compra ni se
                estira: la fecha de fin es una consecuencia de la capacidad, no un deseo.
              </li>
            </ul>
            <p>
              De los cuatro, el humano es el que exige más cuidado, porque compite entre
              proyectos: la persona clave del proyecto A es la misma del proyecto B, y ninguna de
              las dos planificaciones la vio completa.
            </p>
          </>
        ),
      },
      {
        heading: "Capacidad nominal vs. capacidad real",
        body: (
          <>
            <p>
              La planificación de recursos falla en la aritmética, no en la intención. La{" "}
              <strong>capacidad nominal</strong> dice: 5 personas × 40 horas = 200 horas por
              semana. La <strong>capacidad real</strong> descuenta todo lo que también consume
              esas horas: reuniones, soporte, correo, vacaciones, enfermo, capacitación, y la
              fricción de cambiar de contexto entre tareas. En equipos de oficina, la capacidad
              real de trabajo enfocado ronda el 60-70% de la nominal; quien planifica al 100%
              está presupuestando horas que no existen.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Concepto</th>
                  <th className="py-2 font-semibold">Cómo se calcula</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Capacidad nominal</td>
                  <td className="py-2 text-muted-foreground">
                    Personas × horas de jornada. Sirve para el presupuesto de nómina, no para el
                    plan
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Capacidad real</td>
                  <td className="py-2 text-muted-foreground">
                    Nominal − (reuniones + soporte + ausencias + switching). Es la única que
                    responde “¿cuándo termina esto?”
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Capacidad asignable</td>
                  <td className="py-2 text-muted-foreground">
                    Real − 20% de reserva para lo imprevisto. Planificar sin reserva es
                    comprometer la primera sorpresa a la fecha de entrega
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Un equipo de 5 a 40 horas semanales no tiene 200 horas asignables: tiene algo más
              cercano a 100-120. Ese número, incómodo pero real, es el que sostiene un{" "}
              <Link
                to="/blogs/plantilla-cronograma-proyecto"
                className="underline underline-offset-2"
              >
                cronograma que se cumple
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Cómo asignar: 4 reglas que evitan la sobrecarga",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Un dueño por entrega.</strong> Dos responsables de lo mismo es cero.
                La{" "}
                <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                  matriz RACI
                </Link>{" "}
                resuelve quién responde y quién solo apoya antes de que se asignen horas.
              </li>
              <li>
                <strong>Trabajo en curso con tope.</strong> Cada persona con 1-2 cosas abiertas,
                no 7. La sobrecarga no aparece por falta de horas sino por exceso de cosas
                empezadas a la vez — el síntoma de fondo del{" "}
                <Link
                  to="/blogs/reducir-trabajo-en-curso"
                  className="underline underline-offset-2"
                >
                  WIP alto
                </Link>
                .
              </li>
              <li>
                <strong>Reserva del 20%.</strong> El imprevisto no se negocia con la capacidad:
                se reserva. Si no se usó, se devuelve al final; si se planificó sin él, se pagó
                en atraso.
              </li>
              <li>
                <strong>Delegar por capacidad, no por disponibilidad aparente.</strong> Que
                alguien tenga la agenda vacía de reuniones no significa que tenga margen; puede
                estar con la tarea más pesada del sprint. El detalle de cómo delegar sin volver a
                cargar al mismo de siempre está en{" "}
                <Link to="/blogs/como-delegar-tareas" className="underline underline-offset-2">
                  cómo delegar tareas
                </Link>
                .
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Señales de sobrecarga (antes de que sea crisis)",
        body: (
          <>
            <p>
              La sobrecarga se anuncia con semanas de anticipación, pero sus señales se confunden
              con compromiso: horas extra voluntarias, gente que “anda ocupada” en todo,
              estimaciones que suben sin explicación. Las señales objetivas son otras:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                El lead time de las tareas crece semana a semana con el mismo equipo: la fila
                frente al cuello de botella se está estirando.
              </li>
              <li>
                La misma persona aparece asignada en 2+ proyectos y en ambos planifica como si
                fuera la única.
              </li>
              <li>
                Las tareas “en revisión” esperan más que las “en progreso”: el revisor es el
                recurso saturado.
              </li>
              <li>
                La calidad baja primero (más re-trabajo, más bugs), antes de que baje la
                velocidad: el re-trabajo consume la capacidad que quedaba y acelera el círculo.
              </li>
            </ul>
            <p>
              Cuando varias señales coinciden, el remedio no es motivar: es quitar trabajo en
              curso o sumar capacidad. Seguir apretando produce lo contrario de lo que promete.
            </p>
          </>
        ),
      },
      {
        heading: "Cuando dos proyectos pelean por el mismo recurso",
        body: (
          <>
            <p>
              El conflicto de recursos es el conflicto de portafolio más común: dos gerentes,
              una misma persona clave. Tres salidas ordenadas, de mejor a peor: secuenciar (el
              proyecto B recibe a esa persona cuando el A la libera, con fecha explícita),
              partir su asignación con porcentajes protegidos y visibles para ambos, o subir la
              decisión al nivel donde se eligieron los proyectos. Peor salida: que compita en
              silencio y gane quien grite más fuerte.
            </p>
            <p>
              Una hoja simple resuelve el 80% del problema: filas por persona, columnas por
              semana, celdas con proyecto y porcentaje de asignación. Si una fila suma más de
              100%, la sobrecarga es visible antes de comprometerla. Es la vista que ningún
              equipo debería planificar sin tener, y vive junto a los{" "}
              <Link
                to="/blogs/kpis-gestion-proyectos"
                className="underline underline-offset-2"
              >
                KPIs del proyecto
              </Link>{" "}
              en el seguimiento semanal.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo planificar la capacidad del equipo en 4 pasos",
      steps: [
        {
          name: "Calcula la capacidad real por persona",
          text: "Horas de jornada menos reuniones fijas, soporte, ausencias previstas y un 20% de reserva. Anota el número por semana; olvídate de la capacidad nominal.",
        },
        {
          name: "Cruza con las necesidades del proyecto",
          text: "Toma las entregas del cronograma y estima las horas por habilidad. Donde la necesidad supera la capacidad real está el cuello de botella, y aparece antes de empezar.",
        },
        {
          name: "Asigna con dueño único y tope de WIP",
          text: "Una persona responsable por entrega y máximo 1-2 tareas abiertas por persona. Asignaciones al 100% desde el día uno no son un plan, son una apuesta.",
        },
        {
          name: "Revisa la fila semanalmente",
          text: "Actualiza la hoja de capacidad cada semana: si una fila supera el 100%, mueve trabajo, secuencia o escala. La sobrecarga se corrige en la planificación, no con horas extra.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es la gestión de recursos en un proyecto?",
        answer:
          "Es planificar, asignar y monitorear los insumos que el proyecto consume —personas, dinero, materiales y tiempo— para que estén disponibles en el momento y cantidad necesarios, sin sobrecargar al equipo ni dejar el presupuesto a la deriva.",
      },
      {
        question: "¿Cuáles son los tipos de recursos en gestión de proyectos?",
        answer:
          "Cuatro: humanos (las personas y sus horas con la habilidad correcta), financieros (el presupuesto), materiales y equipos (licencias, máquinas, espacios), y de tiempo (la consecuencia de los otros tres). El recurso humano es el más complejo porque compite entre proyectos simultáneos.",
      },
      {
        question: "¿Cómo se hace la asignación de recursos en un proyecto?",
        answer:
          "Calculando primero la capacidad real de cada persona (no la nominal: descuenta reuniones, soporte y ausencias), cruzándola con las horas que pide el cronograma, asignando con dueño único y tope de trabajo en curso, y dejando una reserva del 20% para imprevistos. Se revisa semanalmente.",
      },
      {
        question: "¿Qué es la sobrecarga de un equipo y cómo se detecta?",
        answer:
          "Ocurre cuando las asignaciones superan la capacidad real del equipo. Se detecta por señales objetivas: lead time creciente, tareas en revisión que esperan más que las en progreso, la misma persona en varios proyectos a la vez y calidad en declive. La cura es quitar trabajo en curso o sumar capacidad, no apretar más.",
      },
      {
        question: "¿Cómo repartir recursos entre dos proyectos que compiten?",
        answer:
          "En orden de preferencia: secuenciar el acceso al recurso con fechas explícitas, partir la asignación en porcentajes protegidos y visibles para ambos proyectos, o escalar la decisión al nivel donde se priorizó el portafolio. La peor opción es dejar que compita en silencio: gana quien insiste más, no lo que más importa.",
      },
    ],
  },
};
