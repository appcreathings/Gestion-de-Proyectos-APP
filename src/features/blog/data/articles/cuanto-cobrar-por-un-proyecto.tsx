import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "cuanto-cobrar-por-un-proyecto",
  title: "Cuánto cobrar por un proyecto: 4 métodos y los errores que te hacen perder dinero",
  excerpt:
    "Cuánto cobrar por un proyecto: los 4 métodos de pricing con sus techos, el cálculo de tu tarifa mínima paso a paso y los 6 errores clásicos que se comen tu margen.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-10",
  readingTime: "10 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  related: [
    "presupuesto-de-proyecto",
    "anticipos-y-pagos-por-hitos",
    "control-de-cambios-proyecto",
  ],
  seo: {
    title: "Cuánto cobrar por un proyecto: métodos y errores | Hito",
    description:
      "Cuánto cobrar por un proyecto: los 4 métodos (hora, día, precio cerrado, valor), cómo calcular tu tarifa mínima con ejemplo numérico y los 6 errores de pricing.",
    ogImageAlt: "Cuatro métodos de pricing de proyectos comparados con sus pros y techos.",
  },
  content: {
    eyebrow: "Dinero y clientes",
    intro: (
      <>
        <strong>En una línea:</strong> cuánto cobrar por un proyecto se responde cruzando tres
        números — tu costo real, el precio del mercado y el valor que recibe el cliente — y el
        método que elijas para cobrarlo (hora, día, precio cerrado o valor) determina quién
        absorbe el riesgo del desvío.
      </>
    ),
    sections: [
      {
        heading: "Las 3 preguntas antes del precio",
        body: (
          <>
            <p>
              Casi todos los problemas de pricing vienen de responder la pregunta «¿cuánto
              cobro?» con una sola variable. Son tres, y el precio sano vive donde se cruzan:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>¿Cuánto te cuesta a vos?</strong> Es tu piso: las horas que lleva el
                trabajo valoradas a tu costo real (sueldo + cargas + gastos fijos prorrateados).
                Cobrar debajo del costo no es competitivo, es financiar al cliente. El cálculo
                detallado está en{" "}
                <Link
                  to="/blogs/presupuesto-de-proyecto"
                  className="underline underline-offset-2"
                >
                  cómo armar el presupuesto de un proyecto
                </Link>
                .
              </li>
              <li>
                <strong>¿Cuánto cobra el mercado?</strong> Es tu referencia: qué cobran otros con
                tu perfil, en tu región, para ese tipo de proyecto. No es tu precio, es el rango
                dentro del cual tu precio necesita una explicación (si estás muy por debajo,
                el cliente desconfía; muy por encima, necesita justificación de valor).
              </li>
              <li>
                <strong>¿Cuánto vale para el cliente?</strong> Es tu techo: si el rediseño de la
                tienda online desbloquea $50.000 de ventas anuales, cobrar $8.000 no es
                «generoso» — es dejar dinero sobre la mesa. El valor que recibe el cliente es el
                único límite superior real del precio.
              </li>
            </ul>
            <p>
              La intuición de la mayoría es anclarse solo en la primera pregunta (mis horas × mi
              tarifa). Es la receta más común para cobrar poco de forma indefinida, porque el
              costo mira hacia adentro y el precio se negocia hacia afuera.
            </p>
          </>
        ),
      },
      {
        heading: "Los 4 métodos de cobro, con sus techos",
        body: (
          <>
            <p>
              Además de la cifra, tienes que elegir el <strong>método</strong>: la regla que
              define qué pasa cuando el trabajo toma más de lo esperado. Esta es la decisión con
              más consecuencias de todo el pricing:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Método</th>
                  <th className="py-2 pr-4 font-semibold">Pros</th>
                  <th className="py-2 pr-4 font-semibold">Techos</th>
                  <th className="py-2 font-semibold">Ideal cuando…</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Por hora</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Simple; el desvío lo paga el cliente; transparente.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Castiga tu mejora (cuanto mejor sos, cobrás menos); invita a microauditar
                    tus horas.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Alcance indefinido: consultoría, mantenimiento, soporte.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Por día / retainer mensual
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Ingresos predecibles; menos contabilidad de horas; el cliente compra
                    disponibilidad.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Requiere disciplina de frontera (qué entra en la bolsa mensual).
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Relación continua: acompañamiento, evolución, operación.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Precio cerrado</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El cliente compra tranquilidad; tu eficiencia se convierte en margen; fácil
                    de decidir para el cliente.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El riesgo del desvío pasa a ser tuyo; exige alcance escrito y control de
                    cambios.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Alcance bien definido: entregables claros y acotados.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Por valor</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El margen más alto; alinea tu incentivo con el resultado del cliente.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Difícil de defender sin historial; exige medir el impacto, no las horas.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Impacto medible y confianza: proyectos ligados a facturación o ahorro.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La evolución natural de una freelance o estudio pequeño: arrancar por hora (porque
              no sabes estimar todavía), pasar a precio cerrado cuando tus estimaciones mejoran,
              y explorar valor cuando tienes casos de impacto demostrable. El método por hora es
              una etapa, no un destino — y el precio cerrado solo es sano con las dos patas que
              veremos en los errores: alcance escrito y{" "}
              <Link
                to="/blogs/control-de-cambios-proyecto"
                className="underline underline-offset-2"
              >
                control de cambios
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "El cálculo de tu tarifa mínima, con números",
        body: (
          <>
            <p>
              Antes de discutir métodos, necesitas el número que no puedes cruzar: tu tarifa
              mínima por hora. El cálculo toma 10 minutos y una sola hoja:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Sueldo deseado anual.</strong> Lo que quieres ganar tú, no lo que ganas
                ahora. Ejemplo: $36.000.
              </li>
              <li>
                <strong>Costos fijos anuales del negocio.</strong> Software, equipo,
                contabilidad, seguros, coworking, impuestos estimados. Ejemplo: $14.000.
              </li>
              <li>
                <strong>Horas facturables reales.</strong> Aquí está el error de casi todos:
                nadie factura 40 horas por semana. Entre ventas, administración, formación y
                los huecos entre proyectos, un profesional independiente factura el 50–60% de
                su jornada. 46 semanas × 35 h facturables = ~1.600 horas/año.
              </li>
              <li>
                <strong>División.</strong> ($36.000 + $14.000) ÷ 1.600 h = <strong>$31/hora
                mínima</strong>.
              </li>
              <li>
                <strong>Margen objetivo.</strong> La tarifa mínima cubre; no genera colchón.
                Súmale 20–30%: tu tarifa de venta razonable ronda <strong>$38–40/hora</strong>.
              </li>
            </ol>
            <p>
              Con la tarifa en mano, un proyecto de precio cerrado es una multiplicación:
              horas estimadas × tarifa + reserva para el imprevisto (10–15%) = tu precio. Y ojo
              con la estimación: si tu historial dice que estimás 20% abajo (como a casi
              todos), corregilo antes de multiplicar — el{" "}
              <Link
                to="/blogs/formula-tiempo-esperado-pert"
                className="underline underline-offset-2"
              >
                tiempo esperado de PERT
              </Link>{" "}
              existe exactamente para eso.
            </p>
          </>
        ),
      },
      {
        heading: "Los 6 errores clásicos de pricing",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Cobrar por hora y castigar tu propia mejora.</strong> El trabajo que te
                tomaba 20 horas y ahora te toma 8 no debería costar 60% menos al cliente: el
                valor entregado es el mismo. Si mejoraste, sube el precio cerrado — o quedará
                atrapado en el método por hora.
              </li>
              <li>
                <strong>Descontar por miedo.</strong> El descuento espontáneo al presentar la
                propuesta enseña dos cosas malas: que tu primer precio era mentira, y que el
                cliente siempre puede apretar más. Si vas a dar algo, condicionalo (menos
                alcance, más plazo de pago) — nunca precio puro sin contrapartida.
              </li>
              <li>
                <strong>Precio cerrado sin hitos de pago.</strong> Cobrar el 100% al final
                convierte tu flujo de caja en una apuesta. La estructura sana — anticipo +
                pagos por avance — está detallada en{" "}
                <Link
                  to="/blogs/anticipos-y-pagos-por-hitos"
                  className="underline underline-offset-2"
                >
                  anticipos y pagos por hitos
                </Link>
                .
              </li>
              <li>
                <strong>Presupuestar sin mecanismo de cambios.</strong> El precio cerrado sin
                control de cambios no es valentía: es regalar el scope creep. Toda modificación
                de alcance lleva su ticket de costo y plazo, por amable que sea el cliente.
              </li>
              <li>
                <strong>Regalar el discovery.</strong> «Mandame una propuesta detallada con el
                plan completo» es una solicitud de trabajo gratuito cuando llega antes del
                contrato. La propuesta necesita un alcance conversado — no una consultoría sin
                facturar. Precio detallado tras un kickoff pagado o con costo simbólico.
              </li>
              <li>
                <strong>Competir solo por precio.</strong> Si tu única diferencia es ser el más
                barato, alguien siempre será más barato. Los clientes que eligen por precio se
                van por precio — y los proyectos baratos consumen la misma capacidad que los
                buenos (el costo de oportunidad de la{" "}
                <Link
                  to="/blogs/planificacion-de-capacidad"
                  className="underline underline-offset-2"
                >
                  capacidad de tu equipo
                </Link>
                ).
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Del presupuesto interno al precio de venta",
        body: (
          <>
            <p>
              La última pieza conceptual: <strong>el costo no es el precio</strong>. El
              presupuesto interno (horas × costos + gastos directos) es tu herramienta de
              decisión — dice si el proyecto es rentable y dónde está el riesgo. El precio de
              venta es una herramienta de negociación — se construye desde el valor para el
              cliente y se defiende con estructura: alcance escrito, hitos de pago, control de
              cambios.
            </p>
            <p>
              La secuencia completa de un proyecto sano queda así: estimación con historial →
              presupuesto interno con reserva → precio de venta con margen → contrato con
              anticipos y hitos → ejecución con control de cambios → cierre. Cada eslabón tiene
              su artículo en este blog, y si quieres que el presupuesto, los hitos de pago y las
              tareas vivan en el mismo archivo local de tu carpeta — sin cuenta ni nube—{" "}
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
              — presupuestos, hitos y proyectos en un solo lugar, local-first.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Cómo calculo cuánto cobrar por un proyecto?",
        answer:
          "Cruzando tres variables: tu costo real (tarifa mínima: sueldo + gastos fijos ÷ horas facturables reales, que son el 50–60% de la jornada), el rango del mercado para tu perfil, y el valor que el proyecto genera para el cliente. El precio se fija desde el valor, se defiende con estructura y nunca baja del costo.",
      },
      {
        question: "¿Es mejor cobrar por hora o precio cerrado?",
        answer:
          "Depende del alcance. Por hora: cuando el alcance es indefinido (consultoría, soporte) — el desvío lo paga el cliente. Precio cerrado: cuando el alcance está bien definido — tu eficiencia se convierte en margen, pero exige alcance escrito y control de cambios, porque el riesgo del desvío pasa a ser tuyo.",
      },
      {
        question: "¿Cuál es mi tarifa mínima por hora?",
        answer:
          "Sueldo anual deseado más costos fijos del negocio, dividido entre tus horas facturables reales del año. Las facturables no son la jornada completa: entre ventas, administración y huecos entre proyectos, un independiente factura el 50–60% de su tiempo. A ese resultado súmale un margen del 20–30% para pasar de cubrir a ganar.",
      },
      {
        question: "¿Cuánto margen debería dejar en un proyecto?",
        answer:
          "Entre el 20% y el 30% sobre tu costo total es un rango sano para servicios profesionales: cubre imprevistos, semanas sin ventas y la mejora del negocio. Por debajo del 10%, cualquier desvío de estimación convierte el proyecto en pérdida — y los desvíos del 20% son la norma, no la excepción.",
      },
      {
        question: "¿Cómo se cobra un proyecto grande?",
        answer:
          "Dividido en pagos por hitos: un anticipo del 30–40% para arrancar, pagos intermedios atados a entregables verificables y un cierre del 20% máximo a la aceptación final. Así tu flujo de caja sigue el avance del trabajo y el riesgo de cliente moroso queda acotado a la última fracción.",
      },
    ],
  },
};
