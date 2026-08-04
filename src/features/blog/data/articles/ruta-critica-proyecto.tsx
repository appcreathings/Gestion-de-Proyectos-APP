import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "ruta-critica-proyecto",
  title: "Ruta crítica: qué tareas no se pueden atrasar",
  excerpt:
    "La ruta crítica identifica qué tareas determinan la fecha de entrega de tu proyecto. Cómo calcularla, por qué importa y qué hacer cuando se mueve.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-11-23",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "gestion-de-proyectos-guia-completa",
  related: ["como-estimar-tiempos-proyecto", "fases-de-un-proyecto"],
  seo: {
    title: "Ruta crítica: qué tareas no se pueden atrasar | Hito",
    description:
      "La ruta crítica identifica qué tareas determinan la fecha de entrega. Cómo calcularla, por qué importa y qué hacer cuando se mueve.",
    ogImageAlt: "Ruta crítica del proyecto: tareas que no pueden atrasarse.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> la ruta crítica de un proyecto es el camino más largo de tareas
        conectadas desde el inicio hasta la entrega — cualquier atraso en este camino retrasa todo el
        proyecto. Las tareas que no están en la ruta crítica pueden atrasarse sin mover la fecha
        de entrega (tienen <em>holgura</em>). Conocer cuál es cuál permite priorizar dónde poner
        atención y cuándo mover recursos para proteger el cronograma.
      </>
    ),
    sections: [
      {
        heading: "Qué es la ruta crítica (sin jerga)",
        body: (
          <>
            <p>
              Imaginá un proyecto como un mapa de tareas conectadas: algunas dependen de otras, algunas
              pueden correrse en paralelo. La ruta crítica es el camino que, si lo seguís desde el
              principio hasta el final sumando los tiempos de cada tarea, da el tiempo más largo de todo
              el proyecto.
            </p>
            <p>
              <strong>Por qué importa:</strong> si una tarea de la ruta crítica se atrasa un día, el
              proyecto completo se atrasa un día. Si una tarea que no está en la ruta crítica se atrasa,
              el proyecto puede seguir a tiempo — esa tarea tenía <em>holgura</em> (margen) para moverse
              sin afectar la fecha final.
            </p>
            <p>
              La ruta crítica cambia durante el proyecto: una tarea que no era crítica puede volverse
              crítica si se consume su holgura, y viceversa. Por eso no se calcula una sola vez — se
              revisa cada vez que hay un cambio significativo en el cronograma.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo identificar la ruta crítica (ejemplo práctico)",
        body: (
          <>
            <p>
              Tomemos un proyecto simple: lanzar un landing page. Tiene 6 tareas con duraciones y
              dependencias:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Tarea</th>
                  <th className="py-2 pr-4 font-semibold">Duración</th>
                  <th className="py-2 font-semibold">Depende de</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">A. Diseño</td>
                  <td className="py-2 pr-4">3 días</td>
                  <td className="py-2">—</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">B. Copy</td>
                  <td className="py-2 pr-4">2 días</td>
                  <td className="py-2">—</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">C. Desarrollo</td>
                  <td className="py-2 pr-4">5 días</td>
                  <td className="py-2">A y B</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">D. Testing</td>
                  <td className="py-2 pr-4">2 días</td>
                  <td className="py-2">C</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">E. Análisis de métricas</td>
                  <td className="py-2 pr-4">3 días</td>
                  <td className="py-2">B</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">F. Optimización de conversión</td>
                  <td className="py-2 pr-4">4 días</td>
                  <td className="py-2">E</td>
                </tr>
              </tbody>
            </table>
            <p>
              <strong>Caminos posibles:</strong> A→C→D = 3+5+2 = <strong>10 días</strong> (crítico) ·
              B→C→D = 2+5+2 = 9 días (holgura 1) · B→E→F = 2+3+4 = 9 días (holgura 1).
            </p>
            <p>
              La ruta crítica es <strong>A→C→D</strong>: diseño, desarrollo y testing. Si el diseño se
              atrasa 2 días, el proyecto se atrasa 2 días. Pero si el copy (B) se atrasa 1 día, el
              proyecto sigue a tiempo — tenía 1 día de holgura que se consume pero no rompe el cronograma.
            </p>
          </>
        ),
      },
      {
        heading: "Qué hacer cuando la ruta crítica se mueve",
        body: (
          <>
            <p>
              Una tarea crítica se atrasó inevitablemente. Ahora tenés tres opciones clásicas:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Recortar alcance:</strong> sacar algo no esencial del camino crítico para ganar
                tiempo. Ver{" "}
                <Link
                  to="/blogs/alcance-de-proyecto-scope-creep"
                  className="underline underline-offset-2"
                >
                  cómo definir el alcance y evitar el scope creep
                </Link>
                .
              </li>
              <li>
                <strong>Agregar recursos:</strong> poner más gente en una tarea crítica (con cuidado —
                agregar gente a un proyecto atrasado a veces lo atrasa más, por costo de comunicación).
              </li>
              <li>
                <strong>Mover la fecha:</strong> aceptar el atraso y comunicarlo antes de que sea una
                sorpresa para el cliente o stakeholder.
              </li>
            </ul>
            <p>
              Lo que <strong>no</strong> conviene: ignorar el atraso en la ruta crítica y pensar que se
              compensará después. Las holguras de las otras tareas no son para "rescatar" la ruta crítica
              — se agotan rápido y crean una cadena de atrasos.
            </p>
          </>
        ),
      },
      {
        heading: "Ruta crítica y estimación van de la mano",
        body: (
          <>
            <p>
              Si tus estimaciones de tiempo son optimistas por defecto, tu cálculo de ruta crítica va a
              ser igualmente optimista — y vas a tener más sorpresas de atrasos que advertencias. Ver{" "}
              <Link
                to="/blogs/como-estimar-tiempos-proyecto"
                className="underline underline-offset-2"
              >
                cómo estimar tiempos sin fallar siempre
              </Link>{" "}
              para corregir el sesgo de planificación antes de calcular la ruta crítica.
            </p>
            <p>
              Esto conecta directamente con la{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                fase de planificación del proyecto
              </Link>
              : calcular la ruta crítica no es un ejercicio teórico, es la herramienta que te dice en
              qué tareas enfocarte durante la fase de seguimiento.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Una tarea puede estar en más de una ruta crítica?",
        answer:
          "Sí, si es parte de dos caminos independientes que son igual de largos. Es raro pero puede pasar. En ese caso, esa tarea es doblemente crítica.",
      },
      {
        question: "¿Siempre conviene priorizar las tareas críticas?",
        answer:
          "Casi siempre. Pero si una tarea no crítica ya se atrasó y está consumiendo su holgura, puede volverse crítica de repente. Por eso se revisa la ruta crítica después de cada cambio relevante.",
      },
      {
        question: "¿Hay software para calcular la ruta crítica?",
        answer:
          "Sí, la mayoría de herramientas de gestión de proyectos (MS Project, Asana, ClickUp) la calculan automáticamente. Pero para proyectos chicos, un cálculo manual con papel y lápiz es más rápido y obliga a pensar en las dependencias.",
      },
    ],
  },
};