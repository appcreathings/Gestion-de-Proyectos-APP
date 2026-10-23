import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "pmbok-7-guia-en-espanol",
  title: "PMBOK 7 explicado: principios, dominios y qué cambió respecto al PMBOK 6",
  excerpt:
    "El PMBOK 7 dejó de ser una lista de procesos y pasó a principios y dominios de desempeño: qué es el PMBOK, los 12 principios, los 8 dominios, diferencias con la 6.ª edición, qué pasó con la 8.ª y cómo usarlo en un equipo pequeño.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-10-23",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "metodologias-gestion-proyectos",
  related: [
    "metodologias-gestion-proyectos",
    "waterfall-vs-agile",
    "fases-de-un-proyecto",
    "triple-restriccion-proyecto",
  ],
  seo: {
    title: "PMBOK 7 explicado: principios y dominios, en español | Hito",
    description:
      "PMBOK 7 explicado en español: qué es la guía del PMI, los 12 principios, los 8 dominios de desempeño, diferencias con el PMBOK 6, qué trae la 8.ª edición y cómo aplicarlo.",
    ogImageAlt: "Principios y dominios de desempeño del PMBOK 7 frente a los procesos del PMBOK 6.",
  },
  content: {
    eyebrow: "Metodologías",
    intro: (
      <>
        <strong>En una línea:</strong> el PMBOK es la guía del Project Management Institute (PMI)
        con las prácticas de referencia de la dirección de proyectos; su 7.ª edición cambió el
        enfoque de «procesos que seguir» a «principios que aplicar y resultados que lograr».
      </>
    ),
    sections: [
      {
        heading: "Qué es el PMBOK (y qué no es)",
        body: (
          <>
            <p>
              PMBOK significa <em>Project Management Body of Knowledge</em>: el cuerpo de
              conocimiento de la dirección de proyectos. La «Guía del PMBOK» es el documento que
              el PMI publica para describirlo. Tres aclaraciones que evitan confusiones
              frecuentes:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>No es una metodología.</strong> Es una guía de buenas prácticas. Scrum,
                Kanban o cascada son enfoques de trabajo; el PMBOK describe cómo pensar y
                organizar la dirección de proyectos con cualquiera de ellos. Para comparar
                enfoques, mira{" "}
                <Link
                  to="/blogs/metodologias-gestion-proyectos"
                  className="underline underline-offset-2"
                >
                  metodologías de gestión de proyectos
                </Link>
                .
              </li>
              <li>
                <strong>No es una certificación.</strong> La certificación del PMI más conocida
                es la PMP, que se obtiene aprobando un examen. El examen se basa en un esquema
                de contenido propio del PMI; la guía es una fuente de estudio, no el temario
                exacto.
              </li>
              <li>
                <strong>No es una ley.</strong> Es referencia. La propia guía insiste en
                adaptarla al contexto del proyecto.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Qué cambió del PMBOK 6 al PMBOK 7",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Aspecto</th>
                  <th className="py-2 pr-4 font-semibold">PMBOK 6 (2017)</th>
                  <th className="py-2 font-semibold">PMBOK 7 (2021)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Estructura</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    5 grupos de procesos y 10 áreas de conocimiento
                  </td>
                  <td className="py-2 text-muted-foreground">
                    12 principios y 8 dominios de desempeño
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Foco</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Procesos, entradas, herramientas y salidas
                  </td>
                  <td className="py-2 text-muted-foreground">Resultados y valor entregado</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Enfoque</td>
                  <td className="py-2 pr-4 text-muted-foreground">Predictivo, con nota ágil</td>
                  <td className="py-2 text-muted-foreground">
                    Predictivo, ágil o híbrido, a medida
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Estilo</td>
                  <td className="py-2 pr-4 text-muted-foreground">Prescriptivo</td>
                  <td className="py-2 text-muted-foreground">Basado en adaptación</td>
                </tr>
              </tbody>
            </table>
            <p>
              Dicho de forma simple: el PMBOK 6 te decía «ejecuta estos procesos»; el PMBOK 7 te
              dice «estos son los principios, estos son los resultados que importan y tú eliges
              el método que los logra».
            </p>
          </>
        ),
      },
      {
        heading: "Los 12 principios del PMBOK 7",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Ser un administrador diligente, respetuoso y cuidadoso.</li>
              <li>Crear un entorno colaborativo de equipo.</li>
              <li>Involucrar eficazmente a los interesados.</li>
              <li>Enfocarse en el valor.</li>
              <li>Reconocer, evaluar y responder a las interacciones del sistema.</li>
              <li>Demostrar comportamientos de liderazgo.</li>
              <li>Adaptar el enfoque según el contexto.</li>
              <li>Incorporar la calidad en los procesos y entregables.</li>
              <li>Navegar la complejidad.</li>
              <li>Optimizar las respuestas a los riesgos.</li>
              <li>Adoptar la adaptabilidad y la resiliencia.</li>
              <li>Permitir el cambio para alcanzar el estado futuro previsto.</li>
            </ol>
            <p>
              La redacción exacta en español varía entre traducciones, pero la idea es la
              misma. Varios principios se traducen en prácticas que ya conoces: la calidad (ver{" "}
              <Link
                to="/blogs/gestion-de-la-calidad-proyecto"
                className="underline underline-offset-2"
              >
                gestión de la calidad
              </Link>
              ), los interesados (ver{" "}
              <Link to="/blogs/que-son-stakeholders" className="underline underline-offset-2">
                qué son los stakeholders
              </Link>
              ) y el riesgo (ver{" "}
              <Link to="/blogs/gestion-de-riesgos-simple" className="underline underline-offset-2">
                gestión de riesgos
              </Link>
              ).
            </p>
          </>
        ),
      },
      {
        heading: "Los 8 dominios de desempeño",
        body: (
          <>
            <p>
              Son áreas de actividad que, juntas, producen los resultados del proyecto. No son
              fases ni se ejecutan en orden: funcionan en paralelo durante todo el proyecto.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Interesados:</strong> identificar, entender y comprometer a las
                personas afectadas.
              </li>
              <li>
                <strong>Equipo:</strong> construir y liderar el equipo que entrega.
              </li>
              <li>
                <strong>Enfoque de desarrollo y ciclo de vida:</strong> elegir cómo se entrega
                (predictivo, ágil, híbrido) y en qué fases.
              </li>
              <li>
                <strong>Planificación:</strong> organizar el trabajo, el tiempo y los costos.
              </li>
              <li>
                <strong>Trabajo del proyecto:</strong> ejecutar procesos, gestionar recursos y
                aprender continuamente.
              </li>
              <li>
                <strong>Entrega:</strong> asegurar que el alcance y la calidad producen el valor
                esperado.
              </li>
              <li>
                <strong>Medición:</strong> definir indicadores y usarlos para decidir.
              </li>
              <li>
                <strong>Incertidumbre:</strong> gestionar riesgo, ambigüedad y complejidad.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "¿Y el PMBOK 8?",
        body: (
          <>
            <p>
              El PMI publicó la 8.ª edición de la Guía del PMBOK a finales de 2025. Según las
              reseñas de academias de preparación al PMP, condensa los principios a seis, reduce
              los dominios de desempeño a siete y recupera un conjunto de procesos
              organizados por áreas de enfoque, ahora con más peso en inteligencia artificial,
              sostenibilidad y oficinas de proyectos (PMO). Esos datos provienen de fuentes
              secundarias, así que si vas a estudiar para el examen o a citar la guía, verifica
              los detalles en el texto oficial del PMI.
            </p>
            <p>
              Para quien dirige proyectos sin buscar la certificación, la conclusión práctica no
              cambia: las ideas centrales (valor, adaptación al contexto, principios antes que
              recetas) se mantienen entre ediciones. Entender la 7.ª sigue siendo la mejor base
              para leer la 8.ª.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo usar el PMBOK en un equipo pequeño",
        body: (
          <>
            <p>
              Un equipo de 5 personas no necesita aplicar la guía completa. Lo que sí funciona
              es tomar sus ideas más útiles y descartar el peso:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Adapta, no copies.</strong> El principio de adaptación es el más
                aplicable: elige solo lo que el proyecto necesita (un{" "}
                <Link
                  to="/blogs/acta-constitucion-proyecto"
                  className="underline underline-offset-2"
                >
                  acta de constitución
                </Link>{" "}
                breve basta para un proyecto pequeño).
              </li>
              <li>
                <strong>Empieza por el valor.</strong> Antes del cronograma, escribe qué
                resultado debe tener el proyecto y para quién.
              </li>
              <li>
                <strong>Elige el enfoque conscientemente.</strong> Cascada para alcance estable,
                ágil para alcance cambiante, híbrido para lo intermedio. Ver{" "}
                <Link to="/blogs/waterfall-vs-agile" className="underline underline-offset-2">
                  Waterfall vs Agile
                </Link>
                .
              </li>
              <li>
                <strong>Mide pocas cosas.</strong> Dos o tres indicadores que cambian decisiones,
                no un tablero de veinte.
              </li>
              <li>
                <strong>Gestiona la incertidumbre.</strong> Un registro corto de riesgos revisado
                cada semana rinde más que un plan perfecto.
              </li>
            </ol>
            <p>
              Si buscas una herramienta para planificar y seguir proyectos con estas ideas, con
              datos en tu propia carpeta y sin cuenta,{" "}
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
              — gestión de proyectos práctica, local-first.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es el PMBOK?",
        answer:
          "Es el cuerpo de conocimiento de la dirección de proyectos del Project Management Institute (PMI). La Guía del PMBOK es el documento que describe esas prácticas de referencia. No es una metodología ni una certificación.",
      },
      {
        question: "¿Cuál es la diferencia entre el PMBOK 6 y el PMBOK 7?",
        answer:
          "El PMBOK 6 se organizaba en 5 grupos de procesos y 10 áreas de conocimiento, con foco en procesos y entregables. El PMBOK 7 se organiza en 12 principios y 8 dominios de desempeño, con foco en resultados y valor, y reconoce enfoques predictivos, ágiles e híbridos.",
      },
      {
        question: "¿Cuáles son los dominios de desempeño del PMBOK 7?",
        answer:
          "Interesados, equipo, enfoque de desarrollo y ciclo de vida, planificación, trabajo del proyecto, entrega, medición e incertidumbre. Se desarrollan en paralelo durante todo el proyecto, no en secuencia.",
      },
      {
        question: "¿PMBOK y PMP son lo mismo?",
        answer:
          "No. El PMBOK es una guía de conocimiento; la PMP es una certificación profesional del PMI que se obtiene aprobando un examen. La guía sirve como fuente de estudio, pero el examen se basa en un esquema de contenido propio.",
      },
      {
        question: "¿Hay una 8.ª edición del PMBOK?",
        answer:
          "Sí. El PMI publicó la 8.ª edición a finales de 2025. Según fuentes de preparación al PMP, reduce los principios a seis y los dominios a siete y recupera procesos por áreas de enfoque. Conviene confirmar los detalles en el texto oficial del PMI.",
      },
    ],
  },
};
