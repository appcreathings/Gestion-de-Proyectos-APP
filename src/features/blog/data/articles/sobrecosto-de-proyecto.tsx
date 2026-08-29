import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "sobrecosto-de-proyecto",
  title: "Sobrecosto en proyectos: 7 causas y cómo frenarlo",
  excerpt:
    "Por qué se dispara el costo de un proyecto: 7 causas reales (estimación optimista, scope creep, indirectos ocultos) y el control mensual que lo detecta antes de que sea irreversible.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-09-20",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "presupuesto-de-proyecto",
  related: ["presupuesto-de-proyecto", "alcance-de-proyecto-scope-creep", "proyecto-atrasado-que-hacer"],
  seo: {
    title: "Sobrecosto en proyectos: causas y solución | Hito",
    description:
      "Por qué se dispara el costo de un proyecto: 7 causas reales y cómo detectar el sobrecosto a tiempo con control mensual, umbrales de cambio y contingencia.",
    ogImageAlt: "Sobrecosto en proyectos: causas frecuentes y control mensual de costos.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> el <strong>sobrecosto de un proyecto</strong> casi nunca es
        un evento: es una secuencia de pequeños excesos que nadie midió a tiempo — dos semanas de
        retrabajo aquí, un cambio de alcance “gratis” allá. Se detecta en el primer tercio con dos
        números (gasto vs. avance) y se frena con decisiones, no con promesas de esfuerzo.
      </>
    ),
    sections: [
      {
        heading: "La señal temprana que casi todos ignoran",
        body: (
          <>
            <p>
              El sobrecosto se anuncia mucho antes de que el dinero se agote: ocurre cuando el
              proyecto consume presupuesto más rápido de lo que produce trabajo. Un proyecto que
              lleva gastado el 40% con el 25% del trabajo completado ya está en sobrecosto — tenga
              o no dinero todavía en la cuenta. La comparación mensual de gasto contra avance es
              toda la detección que se necesita; formalizada es el CPI del{" "}
              <Link to="/blogs/valor-ganado-evm" className="underline underline-offset-2">
                valor ganado
              </Link>
              : por debajo de 1.0, cada unidad gastada está comprando menos de lo presupuestado.
            </p>
            <p>
              La razón por la que los proyectos igual se descubre tarde: el gasto se revisa en
              contabilidad (mes vencido) y el avance se revisa en operaciones (semanal), y casi
              nadie cruza las dos. Ese cruce, una vez al mes en el{" "}
              <Link
                to="/blogs/informe-de-estado-semanal"
                className="underline underline-offset-2"
              >
                informe de estado
              </Link>
              , es el detector de humo más barato que existe.
            </p>
          </>
        ),
      },
      {
        heading: "Las 7 causas del sobrecosto (con su antídoto)",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Causa</th>
                  <th className="py-2 pr-4 font-semibold">Cómo se ve</th>
                  <th className="py-2 font-semibold">Antídoto</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">1. Estimación optimista</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El CPI cae desde el primer mes sin que pase nada anómalo
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Estimar contra proyectos pasados, no contra el deseo; contingencia real
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">2. Scope creep</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Avance lento, sin incidentes: el equipo absorbe pedidos “chicos” sin precio
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Todo cambio pasa por decisión con impacto en fecha/dinero (
                    <Link
                      to="/blogs/alcance-de-proyecto-scope-creep"
                      className="underline underline-offset-2"
                    >
                      cómo frenar el scope creep
                    </Link>
                    )
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">3. Retrabajo por calidad</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    La misma pieza se “termina” dos o tres veces
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Criterios de aceptación escritos antes de construir; revisión temprana
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">4. Indirectos sin asignar</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cada proyecto “cierra bien” y la empresa pierde en el agregado
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Tasa de indirectos en cada presupuesto (
                    <Link
                      to="/blogs/costos-directos-e-indirectos"
                      className="underline underline-offset-2"
                    >
                      directos vs. indirectos
                    </Link>
                    )
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">5. Cuellos de botella</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Tareas en cola frente a una persona o área saturada
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Nivelar carga, secuencia en vez de acumular WIP
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">6. Recursos y licencias olvidados</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Compras de última hora: ambientes, licencias, herramientas
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Checklist de recursos en el arranque, no cuando hacen falta
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">7. Aprobaciones eternas del cliente</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El equipo “espera” semanas facturables sin producir
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Plazo de aprobación en el contrato, con silencio = aprobado
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Las causas 1 y 2 explican la mayoría de los casos. Y tienen algo en común: no son
              accidentes, son decisiones — o la falta de ellas.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo detectarlo a tiempo: el control mensual",
        body: (
          <>
            <p>
              Tres preguntas al mes, en este orden, respondidas con datos y no con sensaciones:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>¿Cuánto trabajo compramos con lo gastado?</strong> CPI = valor del trabajo
                hecho / gasto real. Debajo de 0.95, revisar causas; debajo de 0.85, decidir.
              </li>
              <li>
                <strong>¿Cómo termina el proyecto con este rendimiento?</strong> EAC = presupuesto
                total / CPI. Ese número proyectado es la conversación con dirección o cliente —
                antes de que ocurra, no después.
              </li>
              <li>
                <strong>¿Cuánta contingencia queda contra cuánto proyecto falta?</strong> Si la
                reserva va gastada a la mitad del camino, el sobrecosto ya está confirmado; solo
                falta verlo en la cuenta.
              </li>
            </ul>
            <p>
              La disciplina que sostiene todo: registrar las horas reales. Sin AC honesto no hay
              CPI, y sin CPI la detección pasa a ser “cuando la factura no cierra”, que es
              detectar la autopsia.
            </p>
          </>
        ),
      },
      {
        heading: "Qué hacer cuando el sobrecosto ya está",
        body: (
          <>
            <p>
              Si el CPI ya cayó y el EAC proyecta un final por encima del presupuesto, hay tres
              movimientos ordenados por cuál intentar primero:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Recortar alcance no esencial.</strong> La palanca más limpia: qué parte
                del 20% del alcance que casi nadie usa puede salir sin dañar el objetivo. Se
                decide con el cliente o el patrocinador, con datos del valor de cada entrega.
              </li>
              <li>
                <strong>Re-baseline honesto.</strong> Ajustar el presupuesto formalmente al EAC
                realista, documentando qué lo causó. Duele una vez, en lugar de mentir cada mes.
                Es el mismo tratamiento de fondo que un atraso:{" "}
                <Link
                  to="/blogs/proyecto-atrasado-que-hacer"
                  className="underline underline-offset-2"
                >
                  los movimientos de un proyecto atrasado
                </Link>{" "}
                aplican casi idénticos.
              </li>
              <li>
                <strong>Apretar al equipo.</strong> La opción popular y la que peor termina: el
                exceso de presión produce más retrabajo, que produce más sobrecosto. Se acepta
                como último recurso puntual, no como plan.
              </li>
            </ul>
            <p>
              Lo que no se debe hacer: absorbir el exceso en silencio y esperarlo “compensar con
              las últimas fases”. La compensación milagrosa existe casi exclusivamente en los
              informes de los proyectos que después perdieron dinero.
            </p>
          </>
        ),
      },
      {
        heading: "Prevención: 3 reglas que evitan la mayoría de los casos",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Ningún cambio de alcance sin precio.</strong> Cada pedido nuevo recibe su
                impacto escrito en fecha y dinero antes de aprobarse. Los cambios gratis son la
                materia prima del sobrecosto.
              </li>
              <li>
                <strong>Contingencia aparte y con registro.</strong> La reserva no se mezcla con
                los costos y cada retiro se anota con su causa. Es el “cinturón de seguridad”
                presupuesto, no un colchón de comodidad.
              </li>
              <li>
                <strong>Cruce mensual gasto-avance.</strong> Una vez al mes, 15 minutos: CPI y
                EAC en el informe. La mayoría de los proyectos que quiebran no carecían de
                información: carecían del cruce.
              </li>
            </ul>
            <p>
              El presupuesto, el control y las salidas descritos aquí parten de la misma base: un{" "}
              <Link
                to="/blogs/presupuesto-de-proyecto"
                className="underline underline-offset-2"
              >
                presupuesto bien armado
              </Link>{" "}
              con directos, indirectos y contingencia separados. El sobrecosto se evita antes de
              firmar, no después de facturar.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es el sobrecosto de un proyecto?",
        answer:
          "Es el exceso del costo real sobre el presupuesto aprobado. Se detecta mucho antes de agotar el dinero: cuando el proyecto consume presupuesto más rápido de lo que produce trabajo (CPI por debajo de 1.0 en el método de valor ganado), ya hay sobrecosto en formación.",
      },
      {
        question: "¿Cuáles son las causas más comunes del sobrecosto?",
        answer:
          "Siete causas explican casi todos los casos: estimación optimista, scope creep (cambios de alcance sin precio), retrabajo por falta de criterios de aceptación, indirectos sin asignar, cuellos de botella de recursos, compras olvidadas de última hora y aprobaciones del cliente que se eternizan.",
      },
      {
        question: "¿Cómo se calcula la desviación de costos de un proyecto?",
        answer:
          "La desviación absoluta es gasto real menos valor del trabajo completado (AC − EV, o CV en valor ganado). La relativa es el CPI: EV/AC; por ejemplo 0.80 significa que por cada unidad gastada se produjo 0.80 de trabajo, un 25% de sobrecosto en el rendimiento. El costo final proyectado es EAC = BAC/CPI.",
      },
      {
        question: "¿Qué hacer cuando un proyecto ya está en sobrecosto?",
        answer:
          "En orden: recortar el alcance no esencial con acuerdo del cliente, re-baselinear el presupuesto al costo realista documentando las causas, y evitar como plan principal la presión extra sobre el equipo, que suele generar más retrabajo y agravar el exceso. Absorberlo en silencio esperando compensarlo después es el peor camino.",
      },
      {
        question: "¿Cómo prevenir el sobrecosto en un proyecto?",
        answer:
          "Tres reglas cubren la mayoría de los casos: ningún cambio de alcance se aprueba sin su impacto escrito en fecha y dinero; contingencia administrada aparte con registro de cada uso; y un cruce mensual de gasto contra avance (CPI y EAC) en el informe de estado para detectar el exceso en el primer tercio del proyecto.",
      },
    ],
  },
};
