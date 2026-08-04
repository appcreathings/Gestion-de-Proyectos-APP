import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "objetivos-proyecto-smart-okr",
  title: "Objetivos de proyecto: SMART, OKR y cuándo cada uno",
  excerpt:
    "¿Objetivos SMART u OKR? Depende del tipo de proyecto y el horizonte de tiempo. Cuál elegir, con ejemplos y por qué mezclarlos suele ser el error.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-11-30",
  readingTime: "11 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "gestion-de-proyectos-guia-completa",
  related: ["como-estimar-tiempos-proyecto", "fases-de-un-proyecto"],
  seo: {
    title: "Objetivos de proyecto: SMART, OKR y cuándo cada uno | Hito",
    description:
      "¿Objetivos SMART u OKR? Depende del tipo de proyecto y el horizonte de tiempo. Cuál elegir, con ejemplos y por qué mezclarlos suele ser el error.",
    ogImageAlt: "Objetivos de proyecto: SMART vs OKR.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> los objetivos <strong>SMART</strong> (Específicos, Medibles,
        Alcanzables, Relevantes, con Tiempo) son para proyectos con fecha de entrega clara y alcance
        definido (migraciones, desarrollos, lanzamientos). Los <strong>OKR</strong> (Objetivos y
        Resultados Clave) son para objetivos de crecimiento o transformación que no tienen un final
        claro, pero sí una dirección y métricas de progreso. Mezclar los dos es el error más común:
        intentar hacer OKR en un proyecto que necesita SMART, o viceversa.
      </>
    ),
    sections: [
      {
        heading: "SMART: cuando hay que entregar algo en una fecha",
        body: (
          <>
            <p>
              SMART es un acrónimo que te obliga a escribir un objetivo que, al leerlo, ya no queda
              margen para la ambigüedad:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>S — Específico:</strong> el objetivo describe un resultado concreto, no un
                deseo. "Mejorar la performance" no es específico; "Reducir el tiempo de carga a menos
                de 2 segundos" sí.
              </li>
              <li>
                <strong>M — Medible:</strong> hay un número que, cuando se alcanza, dice "terminamos".
                Sin métrica, no hay criterio de terminado.
              </li>
              <li>
                <strong>A — Alcanzable:</strong> el objetivo es difícil pero realista, dado el equipo
                y los recursos. "Duplicar el tráfico en un mes" es irrelevante si no hay presupuesto de
                marketing.
              </li>
              <li>
                <strong>R — Relevante:</strong> conecta con un objetivo más amplio del negocio o del
                cliente. Si lo logramos, ¿algo mejora?
              </li>
              <li>
                <strong>T — con Tiempo:</strong> tiene una fecha límite explícita. Sin fecha, un
                objetivo es solo un deseo eterno.
              </li>
            </ul>
            <p>
              <strong>Ejemplo SMART:</strong> "Lanzar la versión móvil de la app antes del 15 de
              diciembre, con las 5 funcionalidades principales testeadas y aprobadas por QA." Específico
              (versión móvil, 5 funcionalidades), medible (está o no está), alcanzable (sabemos que el
              equipo puede hacerlo), relevante (la app se usa 60% desde móvil) y con tiempo (15 de
              diciembre).
            </p>
          </>
        ),
      },
      {
        heading: "OKR: cuando hay que crecer o cambiar, no solo entregar",
        body: (
          <>
            <p>
              OKR (Objetivos y Resultados Clave) fue popularizado por Intel y Google. El formato es simple:
              un <strong>Objetivo</strong> (dirección, cualitativo) con 3-5 <strong>Resultados Clave</strong>{" "}
              (métricas cuantitativas que miden progreso hacia el objetivo). A diferencia de SMART, un
              OKR no necesariamente tiene una fecha de "terminado" — se evalúa cada trimestre y se ajusta
              según lo que se aprendió.
            </p>
            <p>
              <strong>Ejemplo OKR:</strong> Objetivo: "Convertirnos en la herramienta de gestión de
              proyectos de referencia para startups SaaS en LatAm". Resultados Clave: (1) Aumentar el
              tráfico de SEO en 50%; (2) Duplicar el número de leads cualificados; (3) Lograr 10
              testimonios de clientes en LatAm. Este objetivo no "termina" — se revisa cada trimestre, se
              miden los resultados clave y se ajusta la estrategia.
            </p>
            <p>
              La diferencia fundamental: SMART es para <strong>proyectos</strong> (algo que se termina);
              OKR es para <strong>iniciativas de crecimiento</strong> (algo que se sostiene y evoluciona).
            </p>
          </>
        ),
      },
      {
        heading: "Cuándo usar cada uno (con ejemplos)",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Usá SMART si</th>
                  <th className="py-2 font-semibold">Usá OKR si</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4">El proyecto tiene una fecha de entrega clara</td>
                  <td className="py-2">El objetivo es de crecimiento o transformación, no un entregable único</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4">El alcance es relativamente estable</td>
                  <td className="py-2">El alcance puede ajustarse según lo que se aprende en el camino</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4">Hay un cliente externo esperando un resultado</td>
                  <td className="py-2">El stakeholder es interno y acepta iterar sobre el objetivo</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">La métrica de éxito es binaria (se entregó o no)</td>
                  <td className="py-2">La métrica de éxito es de progreso (cercanía al objetivo)</td>
                </tr>
              </tbody>
            </table>
            <p>
              <strong>Ejemplos:</strong> migrar de CRM = SMART; mejorar la satisfacción del cliente =
              OKR. Lanzar una nueva funcionalidad = SMART; posicionarse como líder en un mercado = OKR.
            </p>
          </>
        ),
      },
      {
        heading: "Por qué mezclarlos es un error",
        body: (
          <>
            <p>
              El error más común es intentar hacer OKR en un proyecto que necesita SMART (por ejemplo,
              una migración con fecha inamovible). El OKR permite cambiar el objetivo sobre la marcha,
              pero la migración tiene un deadline que no se mueve. Terminás con el peor de ambos mundos:
              un objetivo que debería ser rígido se vuelve flexible, y el equipo pierde sentido de urgencia.
            </p>
            <p>
              El error inverso es menos común pero también existe: forzar SMART en un objetivo que es
              inherentemente de crecimiento (por ejemplo, "Duplicar el número de usuarios antes del 31 de
              diciembre"). Si el mercado no responde como esperabas, tu objetivo SMART fracasa aunque tu
              estrategia fuera correcta — OKR permitiría ajustar el resultado clave sin cambiar la
              dirección.
            </p>
          </>
        ),
      },
      {
        heading: "Objetivos y fase de inicio del proyecto",
        body: (
          <>
            <p>
              Definir el objetivo correcto — SMART u OKR — es parte fundamental de la{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                fase de inicio de un proyecto
              </Link>
              . Saltar este paso y arrancar directamente a planificar tareas es garantizar atrasos: si el
              objetivo es ambiguo, el alcance crecerá sin control y las prioridades cambiarán a mitad de
              camino.
            </p>
            <p>
              Y la estimación de tiempos que hagas después dependerá de este objetivo: una estimación
              para un objetivo SMART (un entregable específico) es muy distinta de una para un OKR (un
              objetivo de crecimiento). Ver{" "}
              <Link
                to="/blogs/como-estimar-tiempos-proyecto"
                className="underline underline-offset-2"
              >
                cómo estimar tiempos sin fallar siempre
              </Link>{" "}
              para conectar ambas partes.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Puedo usar SMART y OKR en el mismo proyecto?",
        answer:
          "Solo si el proyecto tiene capas: un objetivo SMART para el entregable principal y objetivos OKR para iniciativas de crecimiento que corren en paralelo. Por ejemplo, lanzar una funcionalidad (SMART) mientras se trabaja en posicionamiento de marca (OKR). Lo que no conviene es mezclarlos en el mismo objetivo.",
      },
      {
        question: "¿Los OKR siempre tienen que ser trimestrales?",
        answer:
          "Es la práctica más común, pero no es una regla rígida. Lo importante es que el periodo sea lo suficientemente corto para revisar y ajustar, y lo suficientemente largo para que los resultados clave se puedan medir.",
      },
      {
        question: "¿Qué pasa si no alcanzo un Resultado Clave de un OKR?",
        answer:
          "Es parte del proceso. Los OKR no son promesas inquebrantables como los objetivos SMART; son direcciones con métricas. Si no alcanzaste el 70% de un resultado clave, la pregunta es ¿por qué? ¿fue el objetivo demasiado ambicioso? ¿la estrategia incorrecta? Esa respuesta vale más que el número en sí.",
      },
    ],
  },
};