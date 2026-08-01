import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "gestion-de-proyectos-guia-completa",
  title: "Gestión de proyectos: la guía completa y práctica",
  excerpt:
    "Qué es la gestión de proyectos, sus fases, roles y métodos — explicado sin jerga, con ejemplos que podés aplicar hoy mismo, uses la herramienta que uses.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-10-12",
  readingTime: "12 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  related: [
    "fases-de-un-proyecto",
    "como-estimar-tiempos-proyecto",
    "matriz-raci",
    "alcance-de-proyecto-scope-creep",
    "scrum-vs-kanban",
  ],
  seo: {
    title: "Gestión de proyectos: la guía completa y práctica | Hito",
    description:
      "Qué es la gestión de proyectos, sus fases, roles y métodos explicados sin jerga, con ejemplos aplicables hoy mismo con cualquier herramienta.",
    ogImageAlt: "Guía completa de gestión de proyectos: fases, roles y métodos.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> gestionar un proyecto es llevarlo de una idea a un
        resultado concreto, dentro de un tiempo y un presupuesto, con la menor cantidad de
        sorpresas posible. No hace falta un título ni un software caro para hacerlo bien: hacen
        falta cinco fases claras, roles definidos y un método de seguimiento que tu equipo
        realmente use. Esta guía cubre las dos — la teoría mínima indispensable y la práctica —
        y enlaza a artículos más profundos sobre cada tema.
      </>
    ),
    sections: [
      {
        heading: "Qué es la gestión de proyectos (sin la definición de manual)",
        body: (
          <>
            <p>
              La definición de manual dice que la gestión de proyectos es "la aplicación de
              conocimientos, habilidades, herramientas y técnicas a las actividades del proyecto
              para cumplir sus requisitos". Es correcta y no ayuda a nadie que la lea por primera
              vez.
            </p>
            <p>
              En la práctica, gestionar un proyecto es responder tres preguntas todo el tiempo:{" "}
              <strong>¿qué falta para terminar?</strong>, <strong>¿quién lo está haciendo?</strong>{" "}
              y <strong>¿estamos a tiempo?</strong> Todo el aparato de metodologías, plantillas y
              software existe para responder esas tres preguntas más rápido y con menos
              reuniones. Si tu proceso actual —por informal que sea— responde las tres sin
              esfuerzo, ya estás gestionando proyectos correctamente. Si no, esta guía te da el
              mínimo necesario para llegar ahí.
            </p>
            <p>
              Un proyecto se diferencia de una tarea recurrente (una operación) en que tiene{" "}
              <strong>principio, fin y un resultado único</strong>. Facturar cada mes no es un
              proyecto; migrar de sistema de facturación, sí. Esa distinción importa porque las
              tareas recurrentes se gestionan con checklists y las tareas de proyecto se
              gestionan con hitos — confundir ambas es la razón número uno por la que un tablero
              se vuelve un cementerio de tarjetas que nadie cierra.
            </p>
          </>
        ),
      },
      {
        heading: "Las 5 fases de todo proyecto",
        body: (
          <>
            <p>
              Sin importar la metodología, todo proyecto atraviesa cinco fases. Podés fusionarlas
              o repetirlas en ciclos cortos (eso es exactamente lo que hace Scrum), pero no podés
              saltarte ninguna sin pagar el costo después.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Fase</th>
                  <th className="py-2 font-semibold">Pregunta que responde</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">1. Inicio</td>
                  <td className="py-2">¿Vale la pena hacer esto?</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">2. Planificación</td>
                  <td className="py-2">¿Qué hay que hacer, en qué orden y con qué recursos?</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">3. Ejecución</td>
                  <td className="py-2">¿Quién hace cada cosa, hoy?</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">4. Seguimiento</td>
                  <td className="py-2">¿Vamos a tiempo? ¿Qué cambió?</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">5. Cierre</td>
                  <td className="py-2">¿Qué entregamos y qué aprendimos?</td>
                </tr>
              </tbody>
            </table>
            <p>
              La mayoría de los proyectos que se atrasan no fallan en la ejecución — fallan
              porque se saltaron la fase 1 (nadie definió si valía la pena) o la fase 2 (nadie
              definió el orden real de las tareas). Ver el desarrollo completo de cada fase, con
              ejemplos, en{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                las 5 fases de un proyecto
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Roles: quién hace, quién aprueba, quién solo necesita saber",
        body: (
          <>
            <p>
              El motivo más común de fricción en un proyecto no es técnico: es que dos personas
              creen que son responsables de la misma decisión, o que nadie cree serlo. Una matriz{" "}
              <strong>RACI</strong> (Responsable, Aprobador, Consultado, Informado) resuelve esto
              en una tabla de diez minutos: por cada entregable, quién lo hace, quién lo aprueba,
              a quién hay que consultar antes y a quién solo avisar después.
            </p>
            <p>
              No hace falta usarla en cada tarea — reservala para las 5-10 decisiones grandes de
              un proyecto (qué se entrega, cuándo se lanza, quién aprueba el presupuesto). Guía
              completa con plantilla en{" "}
              <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                matriz RACI: qué es y cómo armarla
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Metodologías: Waterfall, Agile y todo lo de en medio",
        body: (
          <>
            <p>
              Existen dos familias de metodología. <strong>Waterfall (cascada)</strong> planifica
              todo el proyecto antes de empezar y ejecuta en un solo tramo lineal: bueno cuando el
              alcance es fijo y conocido (construcción, cumplimiento regulatorio, migraciones con
              fecha dura). <strong>Agile</strong> (Scrum, Kanban) planifica en ciclos cortos y
              ajusta sobre la marcha: mejor cuando el alcance puede cambiar según lo que se
              aprende en el camino (producto, software, marketing).
            </p>
            <p>
              La pregunta que decide cuál usar no es "¿qué está de moda?" sino:{" "}
              <strong>¿sé hoy exactamente qué hay que entregar, o lo voy a descubrir en el
              camino?</strong> Si la respuesta es "lo sé", cascada. Si es "lo voy a descubrir",
              Agile. Comparativa completa, con tabla y ejemplos de cada uno, en{" "}
              <Link to="/blogs/scrum-vs-kanban" className="underline underline-offset-2">
                Scrum vs Kanban
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Herramientas: qué necesitás de verdad",
        body: (
          <>
            <p>
              Antes de evaluar software, tres cosas que cualquier sistema de gestión de proyectos
              —desde una hoja de Excel hasta un ERP— tiene que resolver:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Una única fuente de verdad</strong> del estado de cada tarea, visible para
                todo el equipo sin pedirle a nadie un update por chat.
              </li>
              <li>
                <strong>Trazabilidad</strong>: poder ver quién cambió qué y cuándo, sin depender
                de la memoria de alguien.
              </li>
              <li>
                <strong>Bajo costo de mantenimiento</strong>: si actualizar el tablero toma más
                esfuerzo que hacer el trabajo, el equipo deja de actualizarlo y el tablero miente.
              </li>
            </ul>
            <p>
              Un Kanban simple con columnas <em>Por hacer / En curso / Hecho</em> cumple los tres
              puntos para la mayoría de los equipos pequeños. La complejidad adicional (sprints,
              automatizaciones, dependencias entre tareas) se agrega cuando el dolor de no
              tenerla es mayor que el costo de aprenderla — no antes.
            </p>
          </>
        ),
      },
      {
        heading: "Los 3 errores que arruinan más proyectos que cualquier metodología",
        body: (
          <>
            <p>
              Después de años viendo proyectos fallar, la causa raíz casi nunca es "elegimos mal
              la metodología". Suele ser una de estas tres:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Alcance que crece sin que nadie lo apruebe</strong> — el clásico "ya que
                estamos, agreguemos esto también". Ver{" "}
                <Link
                  to="/blogs/alcance-de-proyecto-scope-creep"
                  className="underline underline-offset-2"
                >
                  cómo definir el alcance y frenar el scope creep
                </Link>
                .
              </li>
              <li>
                <strong>Estimaciones optimistas por defecto</strong> — nadie estima a propósito
                mal, pero casi todos subestiman por sesgo. Ver{" "}
                <Link
                  to="/blogs/como-estimar-tiempos-proyecto"
                  className="underline underline-offset-2"
                >
                  cómo estimar tiempos sin fallar siempre
                </Link>
                .
              </li>
              <li>
                <strong>Nadie es dueño de la decisión</strong> — dos personas creen que aprueban
                lo mismo, o ninguna. Se resuelve con la matriz RACI mencionada arriba.
              </li>
            </ol>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo arrancar un proyecto nuevo en 5 pasos",
      steps: [
        {
          name: "Definir el resultado en una frase",
          text: "Antes de crear una sola tarea, escribí qué se entrega y para quién. Si no cabe en una frase, el proyecto todavía no está listo para arrancar.",
        },
        {
          name: "Listar los entregables grandes",
          text: "Entre 3 y 8 bloques grandes de trabajo (no tareas de un día). Cada uno se vuelve, más adelante, un grupo de tareas.",
        },
        {
          name: "Asignar un responsable por entregable",
          text: "Una persona por entregable, no un equipo. Si dos personas comparten la responsabilidad, en la práctica no la tiene nadie.",
        },
        {
          name: "Poner una fecha límite a cada entregable",
          text: "No a cada tarea individual — eso genera microgestión. Una fecha por entregable grande es suficiente para detectar atrasos a tiempo.",
        },
        {
          name: "Elegir dónde vive el seguimiento",
          text: "Un tablero, una hoja o una app — lo que importa es que sea el único lugar que se consulta para saber el estado real, no uno de varios.",
        },
      ],
    },
  },
};
