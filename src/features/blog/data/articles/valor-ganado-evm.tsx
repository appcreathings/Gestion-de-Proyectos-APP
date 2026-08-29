import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "valor-ganado-evm",
  title: "Valor ganado (EVM): si tu proyecto va bien, en 3 números",
  excerpt:
    "Valor ganado (EVM) sin jerga: PV, EV y AC, las fórmulas de CPI y SPI, un ejemplo numérico completo y hasta dónde vale la pena aplicarlo en equipos pequeños.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-09-13",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "presupuesto-de-proyecto",
  related: ["presupuesto-de-proyecto", "kpis-gestion-proyectos", "ruta-critica-proyecto"],
  seo: {
    title: "Valor ganado EVM: CPI, SPI y ejemplo | Hito",
    description:
      "Valor ganado (EVM) sin jerga: qué son PV, EV y AC, cómo calcular CPI y SPI, un ejemplo numérico completo y cómo usarlo en proyectos pequeños sin burocracia.",
    ogImageAlt: "Valor ganado EVM: PV, EV y AC con fórmulas de CPI y SPI y ejemplo numérico.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> el método del <strong>valor ganado</strong> (Earned Value
        Management, EVM) responde con dos números si tu proyecto llegará en fecha y en
        presupuesto: el <strong>CPI</strong> (cuánto trabajo produces por cada unidad de dinero
        gastada) y el <strong>SPI</strong> (qué tan al ritmo del plan vas). Todo el método son
        tres medidas, dos divisiones y una regla: por debajo de 1.0, algo hay que decidir.
      </>
    ),
    sections: [
      {
        heading: "La idea en una frase",
        body: (
          <>
            <p>
              Los reportes tradicionales comparan dinero contra dinero: “llevamos gastado el
              40%”. Pero gastado el 40% no dice nada sin saber <em>cuánto trabajo</em> compró ese
              gasto. Gastar 40% del presupuesto para completar 40% del trabajo es salud; gastar
              40% para completar 20% es un incendio silencioso que se descubre al final.
            </p>
            <p>
              El valor ganado corrige exactamente eso: convierte el trabajo completado en dinero
              (“valor ganado”) y lo compara contra lo planificado y lo gastado. Con esas tres
              cantidades puedes decir, a mitad de proyecto y con aritmética de primaria, si vas a
              llegar y cuánto costará llegar.
            </p>
          </>
        ),
      },
      {
        heading: "Los 3 números: PV, EV y AC",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Medida</th>
                  <th className="py-2 pr-4 font-semibold">Nombre</th>
                  <th className="py-2 font-semibold">Qué es</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">PV</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Planned Value (valor planificado)
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Cuánto dinero del plan debería estar “gastado” hoy, según lo que el plan dice
                    que ya debería estar hecho
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">EV</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Earned Value (valor ganado)
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El presupuesto de las tareas que ya están completas. Es el trabajo hecho,
                    medido en dinero
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">AC</td>
                  <td className="py-2 pr-4 text-muted-foreground">Actual Cost (costo real)</td>
                  <td className="py-2 text-muted-foreground">
                    Lo que realmente has gastado hasta hoy, sea cual sea el avance
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La clave conceptual es el EV: para calcularlo necesitas tareas cerradas, no
              percepciones. Por eso funciona mejor en proyectos donde el avance se mide por
              entregables completados (hitos, tareas del WBS) y peor donde todo está “a medias”.
            </p>
          </>
        ),
      },
      {
        heading: "Las fórmulas: CPI y SPI (y sus primos CV y SV)",
        body: (
          <>
            <p>
              Con las tres medidas salen los dos indicadores:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>CPI = EV / AC</strong> (índice de desempeño del costo). Cuánto trabajo
                compras por cada unidad gastada. 1.0 = en presupuesto; 0.8 = pagas 1 por 0.8 de
                trabajo.
              </li>
              <li>
                <strong>SPI = EV / PV</strong> (índice de desempeño del cronograma). Qué tan al
                ritmo del plan vas. 0.9 = avanzas al 90% de la velocidad planeada.
              </li>
              <li>
                <strong>CV = EV − AC</strong> (desviación de costo) y <strong>SV = EV − PV</strong>{" "}
                (desviación de cronograma), las versiones en dinero de los mismos dos diagnósticos.
              </li>
            </ul>
            <p>
              Y la proyección que más interesa: <strong>EAC = BAC / CPI</strong>, el costo total
              estimado al terminar si el proyecto sigue rindiendo como hasta ahora. BAC es el
              presupuesto total aprobado (Budget at Completion). Esta fórmula es la razón por la
              que el método existe: convierte el rendimiento actual en una fecha de llegada
              financiera.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo numérico completo",
        body: (
          <>
            <p>
              Proyecto con presupuesto total (BAC) de 40.000 y duración de 5 meses. Hoy
              termina el mes 3:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Dato</th>
                  <th className="py-2 pr-4 font-semibold">Valor</th>
                  <th className="py-2 font-semibold">De dónde sale</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">PV</td>
                  <td className="py-2 pr-4 text-muted-foreground">24.000</td>
                  <td className="py-2 text-muted-foreground">
                    El plan decía 60% del trabajo al cierre del mes 3
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">EV</td>
                  <td className="py-2 pr-4 text-muted-foreground">18.000</td>
                  <td className="py-2 text-muted-foreground">
                    Tareas completas hasta hoy: 45% del total (0.45 × 40.000)
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">AC</td>
                  <td className="py-2 pr-4 text-muted-foreground">22.000</td>
                  <td className="py-2 text-muted-foreground">Lo que se ha pagado realmente</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">SPI = 18.000 / 24.000</td>
                  <td className="py-2 pr-4 text-muted-foreground">0.75</td>
                  <td className="py-2 text-muted-foreground">
                    Avanzas al 75% del ritmo planificado: atraso real
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">CPI = 18.000 / 22.000</td>
                  <td className="py-2 pr-4 text-muted-foreground">0.82</td>
                  <td className="py-2 text-muted-foreground">
                    Por cada unidad gastada produces 0.82 de trabajo
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">EAC = 40.000 / 0.82</td>
                  <td className="py-2 pr-4 text-muted-foreground">≈ 48.900</td>
                  <td className="py-2 text-muted-foreground">
                    Si sigue así, terminará ~8.900 por encima del presupuesto (22% de sobrecosto)
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La lectura de negocio: este proyecto no va “un poco mal”, va a terminar con 22% de
              sobrecosto y un atraso proporcional al 0.75 de ritmo — y se sabe hoy, con dos
              divisiones, no al final. La lista de causas probables y salidas está en{" "}
              <Link
                to="/blogs/sobrecosto-de-proyecto"
                className="underline underline-offset-2"
              >
                sobrecosto en proyectos
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Cómo leerlo: umbrales prácticos",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>CPI y SPI ≥ 0.95:</strong> ruido normal. Seguir, sin dramatismo.
              </li>
              <li>
                <strong>Entre 0.85 y 0.95:</strong> zona de decisión. Revisar estimaciones,
                alcance y cuellos de botella este mes.
              </li>
              <li>
                <strong>Por debajo de 0.85:</strong> el plan ya no sirve tal cual. Re-baseline:
                renegociar alcance, fecha o presupuesto con datos del EAC.
              </li>
            </ul>
            <p>
              Dos advertencias honestas: el SPI pierde sentido cuando el plan ya se cambió (el
              PV nuevo redefine el ritmo), y ambos índices solo valen si el avance se reporta con
              honestidad — el método no arregla tareas “90% completas” infladas; eso lo arregla
              medir por entregables cerrados y sostenido por los{" "}
              <Link
                to="/blogs/kpis-gestion-proyectos"
                className="underline underline-offset-2"
              >
                KPIs del proyecto
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "¿Vale la pena en un equipo pequeño?",
        body: (
          <>
            <p>
              La ceremonia completa del EVM (línea base de costos, reporte mensual formal,
              análisis de varianzas) tiene sentido en proyectos grandes y auditables. En un equipo
              de 5-15 personas, la versión light cubre el 80% del valor: calcula EV por hitos
              cerrados, AC por horas reales multiplicadas por costo, y revisa CPI y EAC{" "}
              <strong>una vez al mes</strong> en el informe de estado. Dos divisiones, cinco
              minutos.
            </p>
            <p>
              Lo que no se puede saltar: el AC real (si las horas no se registran, no hay método
              que valga) y el avance por entregables cerrados. Con esas dos disciplinas, el valor
              ganado deja de ser jerga de certificación y pasa a ser el semáforo mensual más
              barato que existe para la pregunta que todo cliente hace: “¿esto cuánto va a costar
              al final?”.
            </p>
            <p>
              Y para la mitad tiempo del mismo diagnóstico, el par del CPI es la{" "}
              <Link to="/blogs/ruta-critica-proyecto" className="underline underline-offset-2">
                ruta crítica
              </Link>
              : el EVM dice cuánto atraso y sobrecosto hay; la ruta crítica dice qué tareas están
              causando el atraso.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo calcular el valor ganado de tu proyecto",
      steps: [
        {
          name: "Define el BAC y la línea base del plan",
          text: "Presupuesto total aprobado y el plan de qué % del trabajo debería estar hecho en cada corte mensual. De ahí sale el PV.",
        },
        {
          name: "Calcula el EV por entregables cerrados",
          text: "Suma el presupuesto de las tareas o hitos completados a la fecha. Nada de porcentajes a ojo: entregable cerrado = valor ganado.",
        },
        {
          name: "Obtén el AC de las horas y gastos reales",
          text: "Horas reales consumidas × costo por hora, más compras del proyecto. Sin registro de horas no hay EVM posible.",
        },
        {
          name: "Divide: CPI = EV/AC y SPI = EV/PV",
          text: "Ambos por debajo de 1.0 indican problema de costo y de ritmo respectivamente. Usa los umbrales 0.95/0.85 para decidir si es ruido o decisión.",
        },
        {
          name: "Proyecta el final con EAC = BAC/CPI",
          text: "El costo estimado al terminar si el rendimiento actual se mantiene. Compártelo en el informe mensual: es la respuesta anticipada a '¿cuánto va a costar esto al final?'.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es el valor ganado (EVM) en un proyecto?",
        answer:
          "Es un método que mide el desempeño de un proyecto comparando tres valores en dinero: lo que el plan decía que debía estar hecho (PV), lo que realmente está hecho (EV, el valor ganado) y lo que realmente se ha gastado (AC). De ahí salen los índices CPI y SPI que anticipan si el proyecto llegará en fecha y presupuesto.",
      },
      {
        question: "¿Cómo se calcula el valor ganado?",
        answer:
          "El valor ganado (EV) es la suma del presupuesto de las tareas o entregables completados a la fecha. Con él se calculan CPI = EV/AC (desempeño de costo) y SPI = EV/PV (desempeño de cronograma), y la proyección de costo final EAC = BAC/CPI.",
      },
      {
        question: "¿Qué son el CPI y el SPI en valor ganado?",
        answer:
          "CPI (EV/AC) mide eficiencia de costo: cuánto trabajo produces por unidad gastada; 0.82 significa pagar 1 por 0.82 de trabajo. SPI (EV/PV) mide ritmo contra el plan: 0.75 significa avanzar al 75% de la velocidad planificada. Ambos por debajo de 1.0 indican problema; por debajo de 0.85, que el plan debe renegociarse.",
      },
      {
        question: "¿Qué es el EAC en gestión de proyectos?",
        answer:
          "El Estimate at Completion es el costo total estimado del proyecto al terminar, calculado como BAC/CPI con el rendimiento actual. Por ejemplo, un proyecto de 40.000 con CPI 0.82 proyecta un EAC de unos 48.900: 22% de sobrecosto si nada cambia. Es la alerta temprana que permite corregir a mitad de proyecto.",
      },
      {
        question: "¿Sirve el valor ganado para proyectos pequeños?",
        answer:
          "Sí, en versión light: calcular el EV por hitos cerrados, el AC por horas reales y revisar CPI y EAC una vez al mes son dos divisiones y cinco minutos que anticipan el sobrecosto. La ceremonia formal completa (líneas base, reportes auditables) sí es excesiva para equipos pequeños.",
      },
    ],
  },
};
