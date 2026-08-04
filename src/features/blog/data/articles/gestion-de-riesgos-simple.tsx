import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "gestion-de-riesgos-simple",
  title: "Gestión de riesgos para equipos pequeños",
  excerpt:
    "No necesitás matrices 50×50. Gestión de riesgos para equipos pequeños: cómo identificar, priorizar y mitigar en 15 minutos por semana.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-12-07",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "gestion-de-proyectos-guia-completa",
  related: ["como-estimar-tiempos-proyecto", "alcance-de-proyecto-scope-creep"],
  seo: {
    title: "Gestión de riesgos para equipos pequeños | Hito",
    description:
      "No necesitás matrices 50×50. Gestión de riesgos para equipos pequeños: cómo identificar, priorizar y mitigar en 15 minutos por semana.",
    ogImageAlt: "Gestión de riesgos simple para equipos pequeños.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> gestión de riesgos para equipos pequeños no son matrices 50×50
        ni workshops de dos días. Es una lista de 5-10 riesgos con impacto probable, una acción concreta
        para mitigar cada uno, y 15 minutos por semana para revisar si algo cambió. La mayoría de los
        proyectos que se rompen no lo hacen por una catástrofe impredecible — se rompen por un riesgo
        que nadie anotó y por lo tanto nadie monitoreó.
      </>
    ),
    sections: [
      {
        heading: "Qué es un riesgo (y qué no es)",
        body: (
          <>
            <p>
              Un <strong>riesgo</strong> es un evento incierto que, si ocurre, impacta el proyecto —
              positivamente (oportunidad) o negativamente (amenaza). No es lo mismo que un{" "}
              <em>problema</em>: un problema es algo que ya pasó; un riesgo es algo que puede pasar.
            </p>
            <p>
              <strong>Ejemplos de riesgos reales:</strong> "El cliente puede pedir cambios en el diseño
              a mitad del desarrollo" (alto impacto, alta probabilidad). "Puede haber un corte de luz en
              el server la semana del lanzamiento" (alto impacto, baja probabilidad). "El equipo de
              desarrollo puede terminar antes de tiempo" (impacto positivo, baja probabilidad).
            </p>
            <p>
              La distinción importa porque los riesgos se gestionan <em>antes</em> de que ocurran; los
              problemas se gestionan <em>después</em>. La buena gestión de riesgos reduce la cantidad de
              problemas que aparecen, no hace que desaparezcan todos.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo identificar riesgos (sin workshop)",
        body: (
          <>
            <p>
              No hace falta una sesión de lluvia de ideas formal. Pedí a cada persona del equipo que
              escriba 3-5 cosas que puedan salir mal — apuntá todo, sin filtrar. Agrupalos por categoría
              (tecnología, personas, clientes, externos) y eliminá duplicados. Con equipos de 3-5
              personas, esto no te toma más de 20 minutos.
            </p>
            <p>
              <strong>Fuente de riesgos que casi siempre se olvidan:</strong> dependencias externas
              (aprobaciones de terceros, APIs que pueden cambiar, proveedores que pueden atrasarse).
              Marcalas en la lista con una estrella — suelen ser los que más rompen proyectos.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo priorizar (impacto vs probabilidad)",
        body: (
          <>
            <p>
              Para cada riesgo, asigná dos valores del 1 al 5: <strong>impacto</strong> (qué tan malo
              sería si ocurre) y <strong>probabilidad</strong> (qué tan probable es que ocurra). El
              producto te da un puntaje (1-25). Ordená la lista por puntaje y trabajá solo el top 5-10 —
              el resto es ruido.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Riesgo</th>
                  <th className="py-2 pr-4 font-semibold">Impacto</th>
                  <th className="py-2 pr-4 font-semibold">Probabilidad</th>
                  <th className="py-2 font-semibold">Puntaje</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Cliente pide cambios de diseño a mitad</td>
                  <td className="py-2 pr-4">5</td>
                  <td className="py-2 pr-4">4</td>
                  <td className="py-2">20 ★</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Aprobación regulatoria se demora</td>
                  <td className="py-2 pr-4">5</td>
                  <td className="py-2 pr-4">3</td>
                  <td className="py-2">15 ★</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Developer se enferma semana clave</td>
                  <td className="py-2 pr-4">4</td>
                  <td className="py-2 pr-4">3</td>
                  <td className="py-2">12</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Corte de luz en server lanzamiento</td>
                  <td className="py-2 pr-4">5</td>
                  <td className="py-2 pr-4">1</td>
                  <td className="py-2">5</td>
                </tr>
              </tbody>
            </table>
            <p>
              En este ejemplo, trabajás los dos riesgos con estrella (cambio de diseño y aprobación)
              porque el puntaje te dice que son los que más riesgo real representan para el proyecto.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo mitigar (y cuándo aceptar el riesgo)",
        body: (
          <>
            <p>
              Para cada riesgo priorizado, definí una acción de mitigación concreta — no "revisar el
              riesgo periódicamente", eso no es una acción. Ejemplos:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Cliente pide cambios de diseño:</strong> mitigación = mostrar el diseño y pedir
                aprobación por escrito antes de arrancar desarrollo. Aceptación residual: queda el
                riesgo de que el cliente cambie de opinión después; esa es la parte que aceptás.
              </li>
              <li>
                <strong>Aprobación regulatoria se demora:</strong> mitigación = iniciar el trámite con
                2 meses de anticipación y asignar a alguien responsable de seguirlo semanalmente.
                Aceptación residual: puede seguir demorándose; tenés un plan B (fase 2 sin esa
                aprobación).
              </li>
              <li>
                <strong>Developer se enferma:</strong> mitigación = tener documentación actualizada del
                código y al menos otra persona familiarizada con las partes críticas. Aceptación residual:
                siempre hay riesgo de que la enfermedad coincida con una fecha clave; esa parte se acepta.
              </li>
            </ul>
            <p>
              <strong>Regla de oro:</strong> no intentás mitigar todo. Los riesgos de bajo puntaje se
              aceptan — están anotados, pero no dedicás tiempo a ellos.
            </p>
          </>
        ),
      },
      {
        heading: "Revisión semanal: 15 minutos que te ahorran semanas",
        body: (
          <>
            <p>
              Una lista de riesgos que nunca se revisa es peor que no tenerla. Cada semana, en la misma
              reunión donde repasás el estado del proyecto, dedicá 15 minutos a: (1) ¿Algún riesgo nuevo
              apareció? (2) ¿Algún riesgo priorizado cambió de probabilidad o impacto? (3) ¿Las acciones
              de mitigación se están cumpliendo?
            </p>
            <p>
              Esto conecta directo con la{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                fase de seguimiento del proyecto
              </Link>
              : el seguimiento no es solo verificar si vamos a tiempo con las tareas, también es monitorear
              si el paisaje de riesgos cambió. Un riesgo que era improbable puede volverse probable una
              semana, y si no lo revisás, te sorprende.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Cuántos riesgos hay que tener en la lista?",
        answer:
          "Entre 5 y 10 es lo ideal para equipos pequeños. Menos de 5 es muy pocó; más de 10 se vuelve inmanejable y deja de ser útil. Si tenés más de 15, priorizá más agresivamente.",
      },
      {
        question: "¿Los riesgos positivos (oportunidades) también se gestionan?",
        answer:
          "Sí, pero suelen tener menos prioridad que los riesgos negativos. Si identificás una oportunidad real (por ejemplo, un nuevo canal de marketing que aparece), la acción es aprovecharla, no mitigarla.",
      },
      {
        question: "¿Hay alguna herramienta que simplifique esto?",
        answer:
          "Una hoja de cálculo con columnas de riesgo, impacto, probabilidad, puntaje y acción de mitigación es suficiente para la mayoría de los equipos pequeños. Lo importante no es la herramienta, es la disciplina de revisarlo cada semana.",
      },
    ],
  },
};