import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "diagrama-de-gantt",
  title: "Diagrama de Gantt: qué es, cómo hacerlo y cuándo sobra",
  excerpt:
    "Qué es un diagrama de Gantt, cómo hacerlo paso a paso con o sin Excel, y el error de las 200 barras que esconde la ruta crítica. Cuándo ayuda y cuándo estorba.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-07-12",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "kpis-gestion-proyectos",
  related: ["kpis-gestion-proyectos", "ruta-critica-proyecto", "plantilla-cronograma-proyecto"],
  seo: {
    title: "Diagrama de Gantt: qué es y cómo hacerlo | Hito",
    description:
      "Qué es un diagrama de Gantt, cómo hacerlo paso a paso (con o sin Excel) y cuándo ayuda de verdad. El error de las 200 barras y cómo evitarlo.",
    ogImageAlt: "Diagrama de Gantt simplificado con hitos, dependencias y ruta crítica.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> un <strong>diagrama de Gantt</strong> es la gráfica de
        barras horizontales que muestra qué tarea ocurre cuándo, en qué orden y de qué depende.
        Bien hecho es una foto del plan que cualquiera lee en un minuto; mal hecho es una pared de
        200 barras que nadie actualiza y que esconde justo lo importante.
      </>
    ),
    sections: [
      {
        heading: "Qué es un diagrama de Gantt (y qué no es)",
        body: (
          <>
            <p>
              Henry Gantt lo popularizó alrededor de 1910 para planificar producción, y sigue
              siendo la misma idea: el tiempo corre de izquierda a derecha, cada tarea es una
              barra cuya posición y largo indican cuándo empieza y cuánto dura, y las flechas o
              alineaciones entre barras muestran dependencias. Los rombos son hitos: momentos que
              se aceptan, no trabajo que se ejecuta.
            </p>
            <p>
              Lo que no es: el plan. El plan son las decisiones (alcance, hitos, dueños,
              dependencias, holgura). El Gantt es la visualización de esas decisiones, igual que
              el mapa no es el viaje. Por eso un proyecto puede funcionar sin Gantt, pero no sin
              cronograma: la tabla de hitos y dependencias es el insumo, y el diagrama es solo su
              dibujo.
            </p>
          </>
        ),
      },
      {
        heading: "Las 5 piezas que todo Gantt necesita",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Barras o filas:</strong> una por tarea o paquete de trabajo que salió del{" "}
                <Link
                  to="/blogs/wbs-estructura-desglose-trabajo"
                  className="underline underline-offset-2"
                >
                  WBS
                </Link>
                . Si una barra no existe en el WBS, o es gestión (no va) o es alcance nuevo.
              </li>
              <li>
                <strong>Duración y fechas:</strong> cuándo empieza, cuánto dura. Estimada en el
                mismo grano en que trabaja el equipo; el Gantt no mejora una mala estimación, solo
                la dibuja.
              </li>
              <li>
                <strong>Dependencias:</strong> qué barra no puede empezar hasta que otra termine.
                Sin dependencias el Gantt es una lista pintada de colores.
              </li>
              <li>
                <strong>Hitos:</strong> rombos con fecha y dueño para los resultados que se
                aceptan formalmente.
              </li>
              <li>
                <strong>La ruta crítica resaltada:</strong> el camino de tareas sin holgura. Si tu
                Gantt no distingue esa ruta, muestra 100 barras con la misma importancia visual, y
                eso es exactamente lo contrario de dirigir.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Cómo hacer un diagrama de Gantt en 5 pasos",
        body: (
          <>
            <p>
              El orden importa: el diagrama se dibuja al final, no al principio. Primero las
              decisiones, después la gráfica.
            </p>
          </>
        ),
      },
      {
        heading: "Gantt en Excel, en plantilla o en software",
        body: (
          <>
            <p>
              Tres caminos, según el tamaño del proyecto y cuánto cambie el plan:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Opción</th>
                  <th className="py-2 pr-4 font-semibold">Cuándo alcanza</th>
                  <th className="py-2 font-semibold">Límite</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Hoja de cálculo con barras condicionales</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Proyectos cortos, pocas dependencias, un responsable del archivo
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Actualizarla a mano se vuelve el trabajo; muere en la semana 3
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    <Link
                      to="/blogs/plantilla-cronograma-proyecto"
                      className="underline underline-offset-2"
                    >
                      Plantilla de cronograma por hitos
                    </Link>{" "}
                    (con o sin dibujo)
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipos chicos: hitos, dueños, dependencias y holgura en una tabla
                  </td>
                  <td className="py-2 text-muted-foreground">
                    No dibuja barras: si necesitas ver el calendario, dibújalo aparte
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Software de gestión de proyectos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Muchas dependencias, varios proyectos compartiendo gente, cambios frecuentes
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Invita a la sobre-precision: barras al día exacto que nadie cree
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La regla práctica: elige la herramienta por la frecuencia de cambio, no por la
              estética. Un plan que cambia cada semana necesita software; uno que cambia cada mes
              vive feliz en una tabla.
            </p>
          </>
        ),
      },
      {
        heading: "El error de las 200 barras (y la ruta crítica escondida)",
        body: (
          <>
            <p>
              El Gantt clásico de consulta (licitaciones, construcción, tesis) descompone el
              proyecto en cientos de actividades y las pinta todas iguales. Tres problemas en
              cadena: nadie lo lee completo, nadie lo actualiza, y cuando se actualiza a medias
              miente con autoridad visual. Un gráfico desactualizado da peor información que no
              tener gráfico, porque se ve oficial.
            </p>
            <p>
              El antídoto es agrupar y resaltar: una barra por paquete del WBS (no por actividad),
              y la{" "}
              <Link to="/blogs/ruta-critica-proyecto" className="underline underline-offset-2">
                ruta crítica
              </Link>{" "}
              marcada en color distinto. Ese camino —las tareas sin holgura cuya cadena decide la
              fecha final— es lo único que el comité de proyecto necesita mirar cada semana. Si tu
              Gantt no la muestra, el gráfico tiene información pero no jerarquía.
            </p>
            <p>
              Y una precisión honesta: si el equipo estima en semanas, no pongas barras al día.
              La precisión del dibujo nunca puede superar la precisión de las estimaciones que lo
              alimentan.
            </p>
          </>
        ),
      },
      {
        heading: "Cuándo un Gantt ayuda y cuándo estorba",
        body: (
          <>
            <p>
              <strong>Ayuda</strong> cuando hay dependencias fuertes entre partes (proveedores,
              aprobaciones, construcción), cuando varios proyectos comparten gente y necesitas ver
              choques de calendario, y cuando el cliente espera una vista del plan. En esos casos
              la barra comunica en segundos lo que un párrafo no logra.
            </p>
            <p>
              <strong>Estorba</strong> cuando el trabajo es exploratorio (el plan cambia cada
              semana), cuando el equipo ya opera por sprints con su propio tablero, o cuando el
              Gantt se convierte en el documento que hay que “mantener” en vez de en la foto del
              plan que ya está en la tabla. En proyectos con cliente, la vista semanal que de
              verdad usa el cliente suele ser el{" "}
              <Link
                to="/blogs/informe-de-estado-semanal"
                className="underline underline-offset-2"
              >
                informe de estado
              </Link>
              , no el gráfico.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo hacer un diagrama de Gantt",
      steps: [
        {
          name: "Lista las tareas desde el WBS",
          text: "Una fila por paquete o entregable, no por actividad menor. Cada barra debe existir primero en el WBS; si no, es alcance nuevo.",
        },
        {
          name: "Estima duración y define dependencias",
          text: "Duración en el grano que trabaja el equipo (días o semanas). Marca qué barra no puede empezar hasta que otra termine.",
        },
        {
          name: "Calcula holguras y marca la ruta crítica",
          text: "La cadena de tareas con holgura cero decide la fecha final. Resáltala con color distinto: es lo que se revisa cada semana.",
        },
        {
          name: "Agrega hitos como rombos con dueño",
          text: "Los hitos son resultados que se aceptan, no tareas. Cada uno con fecha objetivo y una persona que responde por él.",
        },
        {
          name: "Dibuja y programa la actualización",
          text: "Pinta las barras con la herramienta elegida y define quién actualiza el avance y con qué cadencia. Un Gantt sin cadencia de actualización es decoración.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es un diagrama de Gantt?",
        answer:
          "Es una gráfica de barras horizontales que muestra las tareas de un proyecto en el tiempo: cada barra representa una tarea con su fecha de inicio y duración, las conexiones entre barras muestran dependencias y los rombos marcan hitos. Su valor está en hacer visible el orden y la ruta crítica del plan.",
      },
      {
        question: "¿Para qué sirve un diagrama de Gantt?",
        answer:
          "Para tres cosas: comunicar el plan en una imagen que cualquiera lee, detectar choques de calendario cuando varias tareas o proyectos comparten gente, y seguir semanalmente la ruta crítica (la cadena de tareas sin holgura que decide la fecha de entrega).",
      },
      {
        question: "¿Cómo se hace un diagrama de Gantt en Excel?",
        answer:
          "Se arma una tabla con tarea, inicio y duración; luego un gráfico de barras apiladas donde la primera serie (inicio) se pinta de forma invisible y la segunda (duración) queda como la barra visible. Sirve para proyectos cortos, aunque mantenerlo a mano se vuelve pesado: si el plan cambia cada semana, mejor un software que lo redibuje solo.",
      },
      {
        question: "¿Cuál es la diferencia entre un Gantt y un cronograma?",
        answer:
          "El cronograma es el plan de cuándo ocurren los hitos, con dueños, dependencias y holgura (típicamente una tabla). El Gantt es una visualización opcional de ese mismo cronograma. Puedes dirigir un proyecto con la tabla sin dibujar nunca el gráfico, pero no al revés.",
      },
      {
        question: "¿Qué es la ruta crítica en un diagrama de Gantt?",
        answer:
          "Es la cadena de tareas con holgura cero: si cualquiera de ellas se atrasa, se atrasa la fecha final del proyecto. En un Gantt bien hecho se resalta con color distinto, porque es la única secuencia que requiere seguimiento semanal estricto.",
      },
    ],
  },
};
