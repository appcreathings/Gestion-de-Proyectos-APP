import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "como-estimar-tiempos-proyecto",
  title: "Cómo estimar tiempos de un proyecto sin fallar siempre",
  excerpt:
    "3 técnicas de estimación —por analogía, PERT y Planning Poker— y por qué casi siempre subestimamos. Con ejemplos para tu próximo proyecto.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-10-26",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "gestion-de-proyectos-guia-completa",
  related: ["fases-de-un-proyecto", "matriz-raci"],
  seo: {
    title: "Cómo estimar tiempos de un proyecto sin fallar siempre | Hito",
    description:
      "3 técnicas de estimación de tiempos —analogía, PERT y Planning Poker— y por qué casi siempre subestimamos. Con ejemplos prácticos.",
    ogImageAlt: "Cómo estimar tiempos de un proyecto: 3 técnicas con ejemplos.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> nadie estima mal a propósito — subestimamos por un sesgo
        cognitivo real (el "sesgo de planificación") que hace que imaginemos el escenario ideal
        en vez del típico. Tres técnicas ayudan a corregirlo: estimar <strong>por analogía</strong>{" "}
        contra trabajo pasado, la fórmula <strong>PERT</strong> que promedia tres escenarios, y{" "}
        <strong>Planning Poker</strong> para que la estimación no dependa de una sola persona
        optimista. Ninguna es perfecta, pero las tres son mejores que "a ojo".
      </>
    ),
    sections: [
      {
        heading: "Por qué subestimamos siempre (y no es por optimismo ingenuo)",
        body: (
          <>
            <p>
              El <strong>sesgo de planificación</strong> (planning fallacy), documentado por
              Daniel Kahneman y Amos Tversky, describe algo muy específico: cuando estimamos
              nuestro propio trabajo, imaginamos el camino sin obstáculos — sin la reunión que se
              alarga, sin el bug inesperado, sin la dependencia externa que se atrasa. Cuando
              estimamos el trabajo de <em>otra persona</em> o un proyecto ajeno, en cambio, somos
              mucho más realistas porque no tenemos el mismo optimismo sobre nuestra propia
              ejecución.
            </p>
            <p>
              Esto explica por qué "estimá con cuidado" no funciona como consejo: el problema no
              es falta de cuidado, es un sesgo estructural. Lo que sí funciona es cambiar el{" "}
              <em>método</em> de estimación para que no dependa de imaginar el escenario ideal.
              Las tres técnicas siguientes hacen exactamente eso.
            </p>
          </>
        ),
      },
      {
        heading: "Técnica 1: estimación por analogía",
        body: (
          <>
            <p>
              La forma más simple y subestimada: buscar una tarea parecida que ya se hizo antes y
              usar su tiempo real (no el estimado) como base. "La última migración de base de
              datos parecida tomó 3 semanas" es un dato mucho más confiable que cualquier cálculo
              teórico, porque ya incluye los obstáculos reales que aparecieron la vez anterior.
            </p>
            <p>
              <strong>Cómo aplicarla:</strong> antes de estimar una tarea nueva, preguntá "¿hicimos
              algo parecido antes? ¿cuánto tardó realmente?" Si la respuesta es "sí, pero esta vez
              va a ser más rápido porque ya aprendimos" — desconfiá: esa frase es exactamente el
              sesgo de planificación hablando.
            </p>
          </>
        ),
      },
      {
        heading: "Técnica 2: estimación PERT (tres escenarios)",
        body: (
          <>
            <p>
              PERT (Program Evaluation and Review Technique) pide tres números en vez de uno:
              tiempo <strong>optimista</strong> (todo sale perfecto), tiempo{" "}
              <strong>pesimista</strong> (varias cosas salen mal) y tiempo{" "}
              <strong>más probable</strong> (el escenario típico). La fórmula pondera el
              escenario más probable:
            </p>
            <p className="rounded-lg bg-muted/40 p-4 font-mono text-sm">
              Estimación = (Optimista + 4 × Más probable + Pesimista) / 6
            </p>
            <p>
              <strong>Ejemplo:</strong> escribir el contenido de una página web. Optimista: 2
              días. Más probable: 4 días. Pesimista: 8 días (el cliente pide dos rondas de
              cambios). Estimación PERT: (2 + 4×4 + 8) / 6 = <strong>4,3 días</strong>. El
              beneficio no es el número exacto — es que forzar el escenario pesimista hace visible
              un riesgo (las rondas de cambios) que una estimación de un solo número habría
              ignorado.
            </p>
          </>
        ),
      },
      {
        heading: "Técnica 3: Planning Poker (para que no decida una sola persona)",
        body: (
          <>
            <p>
              Nacida en equipos Scrum, pero útil en cualquier equipo: cada persona estima en
              privado (con cartas de una baraja tipo Fibonacci: 1, 2, 3, 5, 8, 13…) y todos
              revelan al mismo tiempo. Si hay consenso, listo. Si hay una diferencia grande —
              alguien dice 2 y otra persona dice 13 — esa diferencia es información valiosa: casi
              siempre significa que una de las dos personas sabe algo que la otra no (un riesgo
              oculto, o una simplificación posible).
            </p>
            <p>
              <strong>Por qué funciona mejor que preguntarle a una sola persona:</strong> evita
              que la estimación quede anclada al número que dice primero la persona con más
              jerarquía o más confianza — un sesgo social además del cognitivo. No hace falta
              cartas físicas: cualquier ronda donde todos escriben su número antes de verlo el de
              los demás logra el mismo efecto.
            </p>
          </>
        ),
      },
      {
        heading: "Un margen que sí funciona: el búfer, no el optimismo",
        body: (
          <>
            <p>
              Después de estimar con cualquiera de las tres técnicas, agregá un{" "}
              <strong>búfer explícito</strong> — no "por las dudas metamos un día más" escondido
              en cada tarea, sino un bloque de tiempo visible al final del proyecto (10-20% del
              total suele alcanzar) que absorbe los imprevistos que ya sabés que van a pasar
              aunque no sepas cuáles. Es la diferencia entre negar la incertidumbre y
              planificarla.
            </p>
            <p>
              Esto conecta directo con la fase de planificación del proyecto completo — ver{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                las 5 fases de un proyecto
              </Link>{" "}
              — y con quién tiene que aprobar ese búfer antes de comprometer una fecha con el
              cliente, que suele ser una decisión para la{" "}
              <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                matriz RACI
              </Link>{" "}
              del proyecto.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Por qué siempre subestimamos, aunque tengamos experiencia?",
        answer:
          "Por el sesgo de planificación: al estimar nuestro propio trabajo imaginamos el escenario sin obstáculos. La experiencia ayuda a estimar el trabajo de otros con más realismo, pero el sesgo sobre el propio trabajo persiste incluso en profesionales muy experimentados.",
      },
      {
        question: "¿Cuál de las tres técnicas conviene usar primero?",
        answer:
          "Analogía si ya hiciste algo parecido antes — es la más rápida y confiable. PERT cuando la tarea es nueva y querés forzar el escenario pesimista para detectar riesgos. Planning Poker cuando estimás en equipo y querés evitar que una sola persona ancle el número.",
      },
      {
        question: "¿Cuánto búfer hay que agregar a una estimación?",
        answer:
          "Entre 10% y 20% del tiempo total estimado suele alcanzar para proyectos de complejidad media. Proyectos con muchas dependencias externas (aprobaciones de terceros, integraciones) necesitan más margen que proyectos donde el equipo controla todo el trabajo.",
      },
    ],
  },
};
