import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "alcance-de-proyecto-scope-creep",
  title: "Alcance de proyecto: definirlo y evitar el scope creep",
  excerpt:
    "Qué es el alcance de un proyecto, cómo documentarlo y las 4 señales de scope creep antes de que se coma tu cronograma.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-11-16",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "gestion-de-proyectos-guia-completa",
  related: ["fases-de-un-proyecto", "matriz-raci"],
  seo: {
    title: "Alcance de proyecto: definirlo y evitar el scope creep | Hito",
    description:
      "Qué es el alcance de un proyecto, cómo documentarlo y las 4 señales de scope creep antes de que se coma tu cronograma.",
    ogImageAlt: "Alcance de proyecto y cómo evitar el scope creep.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> el alcance de un proyecto es la línea escrita entre lo que
        se entrega y lo que no. El <strong>scope creep</strong> (crecimiento de alcance) pasa
        cuando esa línea se corre de a poco, sin que nadie la apruebe formalmente — "ya que
        estamos, agreguemos esto también" repetido diez veces. No se combate diciendo que no a
        todo: se combate teniendo la línea escrita y un camino claro para cambiarla a propósito.
      </>
    ),
    sections: [
      {
        heading: "Qué es el alcance (y por qué “todo lo que se pueda” no es un alcance)",
        body: (
          <>
            <p>
              El alcance de un proyecto define qué se entrega, con qué características, y —
              igual de importante— qué <strong>no</strong> se entrega. Un alcance bien escrito
              tiene tres partes: los entregables concretos, los criterios de "terminado" para
              cada uno, y una lista explícita de exclusiones (lo que alguien podría asumir que
              está incluido pero no lo está).
            </p>
            <p>
              <strong>Ejemplo de alcance débil:</strong> "Renovar el sitio web." Admite cualquier
              interpretación — ¿incluye el blog? ¿el checkout? ¿la versión en inglés?{" "}
              <strong>Ejemplo de alcance fuerte:</strong> "Rediseñar las 5 páginas principales del
              sitio (inicio, producto, precios, sobre nosotros, contacto), responsive, en español.
              No incluye: blog, checkout, versión en inglés — quedan para una fase 2 a definir
              después del lanzamiento."
            </p>
          </>
        ),
      },
      {
        heading: "Las 4 señales de scope creep",
        body: (
          <>
            <ol className="list-decimal space-y-3 pl-6 text-muted-foreground">
              <li>
                <strong>"Ya que estamos" se dice más de una vez por semana.</strong> Cada "ya que
                estamos, agreguemos X" es un cambio de alcance disfrazado de comentario casual. Uno
                aislado es normal; varios por semana es la señal más clara de que el alcance ya se
                está corriendo sin control.
              </li>
              <li>
                <strong>Nadie recuerda haber aprobado un pedido nuevo.</strong> Si un entregable
                apareció en el tablero y nadie puede decir quién lo pidió ni cuándo se aprobó
                agregarlo, entró por scope creep, no por un proceso de cambio real.
              </li>
              <li>
                <strong>La fecha de entrega no se movió a pesar de que el trabajo creció.</strong>{" "}
                Es matemáticamente imposible que el alcance crezca y la fecha y el equipo se
                mantengan iguales sin sacrificar calidad. Si nadie ajustó la fecha, algo se está
                rompiendo en silencio.
              </li>
              <li>
                <strong>Las estimaciones originales dejaron de tener sentido.</strong> Cuando el
                equipo ya no puede decir "vamos a tiempo" porque el alcance contra el que se
                estimó ya no es el alcance real, perdiste la capacidad de medir progreso.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Cómo prevenirlo sin volverte el que siempre dice que no",
        body: (
          <>
            <p>
              El objetivo no es rechazar todo pedido nuevo — a veces un cambio de alcance es
              exactamente lo correcto. El objetivo es que <strong>todo cambio pase por una
              decisión visible</strong>, no que entre por la puerta de atrás.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Documentá el alcance original</strong> en un lugar que todo el equipo
                pueda consultar — no en la cabeza de una sola persona.
              </li>
              <li>
                <strong>Definí quién aprueba cambios de alcance</strong> antes de que aparezca el
                primer pedido — esa persona es el "Aprobador" de la{" "}
                <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                  matriz RACI
                </Link>{" "}
                del proyecto, no cualquiera que lo pida con suficiente insistencia.
              </li>
              <li>
                <strong>Cuando llegue un pedido nuevo, hacé visible el trade-off:</strong> "Podemos
                agregar esto, pero corre la fecha 1 semana o sacamos otra cosa del alcance
                actual." Ese único paso convierte el scope creep invisible en una decisión
                consciente — casi siempre cambia la conversación.
              </li>
              <li>
                <strong>Reservá una "fase 2" explícita</strong> para todo lo bueno que surja
                durante el proyecto pero no estaba en el alcance original. Le da un lugar al
                pedido sin comprometer la entrega actual.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Alcance y estimación van de la mano",
        body: (
          <>
            <p>
              Un alcance que crece sin ajustar la estimación es la forma más común de que un
              proyecto "bien estimado" termine atrasado — no porque la estimación estuviera mal,
              sino porque estimó un alcance distinto al que finalmente se entregó. Ver{" "}
              <Link
                to="/blogs/como-estimar-tiempos-proyecto"
                className="underline underline-offset-2"
              >
                cómo estimar tiempos sin fallar siempre
              </Link>{" "}
              para la otra mitad de este problema.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿El scope creep siempre es malo?",
        answer:
          "No necesariamente — a veces un cambio de alcance es la decisión correcta porque cambió el contexto del negocio. Lo problemático no es cambiar el alcance, es que cambie sin que nadie lo apruebe ni ajuste la fecha o los recursos en consecuencia.",
      },
      {
        question: "¿Cómo se documenta el alcance en un proyecto chico?",
        answer:
          "No hace falta un documento formal extenso: una lista corta de qué se entrega, los criterios de 'terminado' y una lista explícita de qué queda afuera, compartida con todo el equipo, es suficiente para la mayoría de los proyectos pequeños.",
      },
      {
        question: "¿Quién debería aprobar los cambios de alcance?",
        answer:
          "Una sola persona designada de antemano — el mismo criterio que la matriz RACI aplica al rol de Aprobador. Si dos personas pueden aprobar cambios de alcance por separado, el alcance terminará creciendo sin coordinación.",
      },
    ],
  },
};
