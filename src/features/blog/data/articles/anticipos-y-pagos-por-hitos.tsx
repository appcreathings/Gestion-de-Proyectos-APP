import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "anticipos-y-pagos-por-hitos",
  title: "Anticipos y pagos por hitos: ata el dinero al avance",
  excerpt:
    "Los pagos por hitos convierten el calendario de cobros en el calendario de avances: cuánto anticipo pedir, cómo estructurar los porcentajes y qué hacer cuando un pago no llega.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-10",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "cuanto-cobrar-por-un-proyecto",
  related: [
    "cuanto-cobrar-por-un-proyecto",
    "hitos-de-un-proyecto-ejemplos",
    "hito-project-gestion-por-hitos",
    "presupuesto-de-proyecto",
  ],
  seo: {
    title: "Pagos por hitos y anticipos: el dinero y el avance | Hito",
    description:
      "Pagos por hitos: cuánto anticipo pedir, cómo repartir porcentajes por avance, qué hito es cobrable y qué hacer cuando el cliente no paga. Con tabla de ejemplo.",
    ogImageAlt: "Calendario de pagos por hitos: anticipo, avances intermedios y entrega final.",
  },
  content: {
    eyebrow: "Dinero y clientes",
    intro: (
      <>
        <strong>En una línea:</strong> el pago por hitos reparte el cobro del proyecto en momentos
        verificables de avance — un anticipo para arrancar y pagos atados a entregables aceptados —
        de modo que tu flujo de caja crezca con el proyecto y no después de él.
      </>
    ),
    sections: [
      {
        heading: "Por qué el 100% al final mata proyectos",
        body: (
          <>
            <p>
              La estructura de pago más común entre equipos pequeños es también la más
              peligrosa: «te pago todo cuando termines». Parece amable y a veces es la única
              forma de cerrar la venta, pero tiene tres problemas estructurales:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Financias el proyecto vos.</strong> Durante toda la ejecución, el costo
                de tu tiempo y tu equipo lo pone tu bolsillo. En proyectos de dos o tres meses,
                eso es un crédito sin interés que le das al cliente — y los créditos sin
                interés se dan solo a quien más conviene, no a quien pide más.
              </li>
              <li>
                <strong>Tu incentivo y el del cliente se desalinean al final.</strong> Llega el
                cierre, y el proyecto que tú necesitas terminar es el que el cliente ya
                obtuvo. Los 90 días de «lo miramos la semana que viene» viven exactamente ahí.
              </li>
              <li>
                <strong>El riesgo total se acumula en el último día.</strong> Un cliente que
                entra en problemas de caja en el mes 3 no debe un pago parcial: te debe todo.
                Es la diferencia entre un impago molesto y un impago que quita el año.
              </li>
            </ul>
            <p>
              El pago por hitos corrige los tres a la vez, porque hace algo muy simple:{" "}
              <strong>ata el dinero al avance real</strong>, con los mismos mojones que ya
              estructuran el proyecto. La lógica es la misma que describimos en{" "}
              <Link
                to="/blogs/hito-project-gestion-por-hitos"
                className="underline underline-offset-2"
              >
                la gestión por hitos
              </Link>
              : el proyecto avanza cuando algo verificable se completa — y si algo verificable
              se completó, algo de dinero debe haberse cobrado.
            </p>
          </>
        ),
      },
      {
        heading: "Qué es un pago por hitos (y qué hito es cobrable)",
        body: (
          <>
            <p>
              Un pago por hitos es un tramo del precio total que se factura cuando un hito del
              proyecto se cumple — no cuando «va avanzado» ni cuando «ya casi». La palabra clave
              es la misma que diferencia un hito real de una tarea: verificación. La distinción
              completa está en{" "}
              <Link to="/blogs/hito-vs-entregable" className="underline underline-offset-2">
                hito vs entregable
              </Link>
              , pero la versión de bolsillo es: el entregable es la cosa que se produce; el
              hito es el instante en que se certifica que fue aceptada.
            </p>
            <p>
              Un hito es cobrable cuando cumple tres condiciones:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Tiene criterio verificable.</strong> «Diseño aprobado por el cliente»,
                no «avance del diseño». Si la aprobación depende de un ánimo, el pago también.
              </li>
              <li>
                <strong>Certifica valor recibido.</strong> El cliente debe poder ver y usar lo
                que paga: un prototipo navegable, un módulo en producción, un informe entregado.
              </li>
              <li>
                <strong>Tiene fecha y responsable de aprobación.</strong> Quién valida y en
                cuántos días de corrida. Sin esto, el hito cobrable se convierte en el proyecto
                zombi de la sección final.
              </li>
            </ul>
            <p>
              Si tu plan no tiene hitos con esas propiedades, el primer trabajo no es el
              calendario de pagos: es el plan. La lista de mojones típicos por fase está en{" "}
              <Link
                to="/blogs/hitos-de-un-proyecto-ejemplos"
                className="underline underline-offset-2"
              >
                hitos de un proyecto con ejemplos
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Cómo estructurar el calendario: porcentajes y reglas",
        body: (
          <>
            <p>
              No hay fórmula única, pero sí un patrón que funciona en la mayoría de los
              proyectos de servicios. Ejemplo para un proyecto de $10.000 a tres meses:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Momento</th>
                  <th className="py-2 pr-4 font-semibold">%</th>
                  <th className="py-2 pr-4 font-semibold">Criterio de cobro</th>
                  <th className="py-2 font-semibold">Por qué ahí</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Anticipo (al firmar)</td>
                  <td className="py-2 pr-4 text-muted-foreground">30–40% · $3.500</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Firma del contrato / acta de inicio.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Financia el arranque y filtra clientes no serios.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Hito intermedio 1</td>
                  <td className="py-2 pr-4 text-muted-foreground">25–30% · $3.000</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Plan aprobado / diseño aceptado (mes 1).
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Cobra cuando el cliente ya vio y validó algo concreto.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Hito intermedio 2</td>
                  <td className="py-2 pr-4 text-muted-foreground">20–25% · $2.500</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Beta funcional / entrega parcial (mes 2).
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Tu costo acumulado ya está mayormente cubierto.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Cierre final</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ≤20% · $1.000
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Entrega final y aceptación formal.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Suficiente para que el cliente cuide el cierre; poco para arruinarte.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Las tres reglas que sostienen cualquier variante:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Nunca dejes más del 20% para el final.</strong> Es el máximo que puedes
                arriesgar a que la relación se enfríe en el último tramo — y a la vez es
                suficiente palanca para que el cierre se agilice.
              </li>
              <li>
                <strong>El anticipo no es negociable por debajo del 30% en clientes nuevos.</strong>
                Un cliente que no acepta anticipar un tercio te está diciendo algo sobre los
                siguientes tres meses. Escuchalo temprano.
              </li>
              <li>
                <strong>Cada hito de pago tiene plazo de aprobación.</strong> «Aceptado
                tácitamente si no hay observaciones en 5 días hábiles» es la cláusula que evita
                que una aprobación infinita congele tu cobro (la usamos también al hablar de{" "}
                <Link to="/blogs/cliente-que-no-responde" className="underline underline-offset-2">
                  clientes que no responden
                </Link>
                ).
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Dónde queda escrito: propuesta y contrato",
        body: (
          <>
            <p>
              El calendario de pagos solo protege si está en el documento que ambas partes
              firman. Tres lugares, en orden de formalidad creciente:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>La propuesta comercial</strong> lo anuncia: monto total, anticipo y
                número de hitos. Es la primera vez que el cliente ve la estructura — y donde
                conviene explicar el porqué en una línea: «el cobro sigue el avance aprobado
                del proyecto».
              </li>
              <li>
                <strong>El contrato o acuerdo de servicios</strong> lo detalla: porcentajes,
                criterios de cada hito, plazo de aprobación tácita, moneda, interés por mora
                (típico: 1–2% mensual) y qué pasa con los entregables si se interrumpe el
                proyecto.
              </li>
              <li>
                <strong>El plan de proyecto</strong> lo vuelve operativo: cada hito de pago
                aparece junto a su hito de trabajo, con fecha esperada. Así nadie discute qué
                falta para facturar — se mira el mismo tablero que muestra el avance.
              </li>
            </ul>
            <p>
              En equipos pequeños, propuesta + acuerdo de una página alcanzan; lo importante no
              es el grosor del papel sino que los criterios de cobro sean tan verificables como
              los criterios de avance. La simetría perfecta es el{" "}
              <Link
                to="/blogs/acta-de-cierre-proyecto"
                className="underline underline-offset-2"
              >
                acta de cierre
              </Link>
              : el último pago se factura con el mismo documento que certifica que el proyecto
              terminó.
            </p>
          </>
        ),
      },
      {
        heading: "Si el pago no llega: la secuencia",
        body: (
          <>
            <p>
              Un hito vencido no es una emergencia — es un procedimiento. La secuencia que
              funciona sin quemar la relación:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Recordatorio amable (día 1 del vencimiento).</strong> Asume despiste:
                «te dejo la factura del hito X que venció ayer». La mayoría de los retrasos
                mueren aquí.
              </li>
              <li>
                <strong>Recordatorio con plazo (día 7).</strong> Formal pero seco: fecha
                concreta y consecuencia anunciada. Sin tono de amenaza — con agenda.
              </li>
              <li>
                <strong>Pausa de trabajo anunciada (día 15).</strong> «Si no recibimos el pago
                del hito X antes del viernes, pausamos el proyecto y lo retomamos el día
                siguiente al pago». Pausar <em>avisando</em> es profesional; seguir trabajando
                gratis no lo es.
              </li>
              <li>
                <strong>Interés de mora y escalamiento (día 30+).</strong> Aplica la cláusula
                del contrato; si el monto es relevante, en este punto ya conviene hablar con el
                sponsor o área de finanzas del cliente, no con tu contacto operativo.
              </li>
              <li>
                <strong>Retención de entregables finales.</strong> Si el contrato lo prevé,
                el último tramo no se entrega hasta el último pago — es exactamente para esto
                que dejamos el 20% final, y no más.
              </li>
            </ol>
            <p>
              La regla de oro detrás de toda la secuencia: <strong>nunca acumules trabajo
              sin cobrar más allá del hito siguiente</strong>. Si el hito 2 no paga, no se
              arranca el tramo 3 — la pausa protege a las dos partes, y casi siempre acelera
              el pago mejor que cualquier email enojado.
            </p>
            <p>
              Si quieres que cada hito de pago viva junto a su hito de trabajo, con criterio,
              fecha y estado visibles en un tablero local de tu carpeta — sin cuenta ni
              nube—{" "}
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
              — hitos de trabajo y de pago en el mismo tablero, local-first.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un pago por hitos?",
        answer:
          "Es una estructura de cobro que reparte el precio del proyecto en tramos que se facturan cuando hitos verificables se completan y aceptan: un anticipo al firmar, pagos intermedios atados a entregables aprobados y un cierre menor a la entrega final. El dinero sigue el avance real, no el calendario.",
      },
      {
        question: "¿Cuánto anticipo se pide por un proyecto?",
        answer:
          "Entre el 30% y el 40% para clientes nuevos; puede bajar con clientes de confianza e historial. El anticipo financia el arranque, filtra clientes no serios y cubre tus primeros costos. Por debajo del 30% con alguien nuevo, el riesgo de impago empieza a ser tuyo casi por completo.",
      },
      {
        question: "¿Qué porcentaje se deja para el pago final?",
        answer:
          "Como máximo el 20%. Es suficiente palanca para que el cliente cuide el cierre y responda las aprobaciones finales, y lo bastante poco para que un retraso no estrangule tu caja. Dejar 50% o más para el final concentra todo el riesgo del proyecto en su último día.",
      },
      {
        question: "¿Qué pasa si el cliente no paga un hito?",
        answer:
          "Una secuencia en cinco pasos: recordatorio amable al vencer, recordatorio con plazo a la semana, pausa de trabajo anunciada a los 15 días, interés de mora y escalamiento a los 30, y retención de entregables finales si el contrato lo prevé. Lo esencial: no seguir acumulando trabajo sin cobrar más allá del hito vencido.",
      },
      {
        question: "¿Se pueden cobrar por hitos los servicios recurrentes?",
        answer:
          "Los recurrentes funcionan mejor con retainer mensual (una bolsa fija por mes), pero los hitos aplican a la parte proyectizable: la migración inicial, la implementación de una mejora grande. La combinación típica es retainer para la operación y pagos por hitos para los proyectos dentro de esa relación.",
      },
    ],
  },
};
