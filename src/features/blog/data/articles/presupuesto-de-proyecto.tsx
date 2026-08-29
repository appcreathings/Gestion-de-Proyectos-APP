import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "presupuesto-de-proyecto",
  title: "Presupuesto de un proyecto: cómo armarlo y controlarlo",
  excerpt:
    "Cómo hacer el presupuesto de un proyecto paso a paso: costos directos e indirectos, reserva de contingencia, margen y el control mensual que detecta el sobrecosto a tiempo.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-08-30",
  readingTime: "11 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  related: ["costos-directos-e-indirectos", "valor-ganado-evm", "como-estimar-tiempos-proyecto"],
  seo: {
    title: "Presupuesto de un proyecto: guía y ejemplo | Hito",
    description:
      "Cómo hacer el presupuesto de un proyecto paso a paso: costos directos e indirectos, contingencia y margen, con ejemplo completo y control mensual anti-sobrecosto.",
    ogImageAlt:
      "Estructura del presupuesto de un proyecto: costos directos, indirectos, contingencia y margen.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> el <strong>presupuesto de un proyecto</strong> es la
        traducción del plan a dinero: cuánto costará cada pieza de trabajo, cuánto se reserva
        para lo imprevisto y cuánto margen debe quedar. Se arma una vez y se controla cada mes —
        porque un presupuesto que no se compara contra el gasto real no es un presupuesto, es una
        oferta con fecha de caducidad.
      </>
    ),
    sections: [
      {
        heading: "Por qué el tiempo es dinero (literalmente)",
        body: (
          <>
            <p>
              En la mayoría de los proyectos de servicios y conocimiento, el 70-90% del costo son
              horas de personas. Eso significa que el presupuesto y el cronograma son la misma
              información en dos unidades: cada semana de atraso es facturación extra o margen
              quemado. Por eso el presupuesto serio no se arma desde “cuánto crees que cuesta”,
              sino desde el plan de trabajo: qué entregas, quién las hace, cuántas horas
              requieren.
            </p>
            <p>
              De ahí la regla de oro: <strong>primero el alcance y las estimaciones, después el
              número</strong>. Un presupuesto sin{" "}
              <Link
                to="/blogs/plantilla-plan-de-proyecto"
                className="underline underline-offset-2"
              >
                plan de proyecto
              </Link>{" "}
              detrás es un precio adivinado, y el proyecto lo pagará al final con sobrecosto o al
              frente con una mala impresión.
            </p>
          </>
        ),
      },
      {
        heading: "La anatomía del presupuesto: 4 bloques",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Bloque</th>
                  <th className="py-2 pr-4 font-semibold">Qué incluye</th>
                  <th className="py-2 font-semibold">Cómo se calcula</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Costos directos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Horas del equipo asignado, freelances contratados para el proyecto, licencias
                    y materiales que existen solo por él
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Estimación de horas × costo/hora + compras específicas
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Costos indirectos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    La porción de oficina, administración, software corporativo y dirección que
                    sostiene al proyecto
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Tasa sobre horas directas (ej. 15-25%) según la estructura real de la empresa
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Reserva de contingencia</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Dinero para los imprevistos que sí van a pasar, aunque no se sabe cuáles
                  </td>
                  <td className="py-2 text-muted-foreground">
                    10-15% en proyectos conocidos; 20-30% en proyectos nuevos o con muchas
                    incertidumbres
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Margen</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Lo que la empresa gana si todo sale según lo planificado
                  </td>
                  <td className="py-2 text-muted-foreground">
                    % sobre costos totales, definido por el negocio — nunca negativo
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El detalle de qué es directo y qué es indirecto (y por qué confundirlos revienta
              márgenes) lo desarrolla{" "}
              <Link
                to="/blogs/costos-directos-e-indirectos"
                className="underline underline-offset-2"
              >
                costos directos e indirectos con ejemplos
              </Link>
              . Aquí basta la regla: si un costo existe solo porque existe este proyecto, es
              directo; si el proyecto lo comparte con todo lo demás de la empresa, es indirecto.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo armarlo paso a paso",
        body: (
          <>
            <p>
              El orden importa porque cada paso alimenta el siguiente. Este procedimiento cabe en
              una tarde para un proyecto mediano:
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo completo: implementación de un sistema",
        body: (
          <>
            <p>
              Proyecto: implementar un sistema de gestión en una empresa mediana, 10 semanas, 3
              personas del equipo más un freelance para migración de datos. Con tarifas de
              referencia neutras (usa las tuyas):
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Concepto</th>
                  <th className="py-2 pr-4 font-semibold">Cálculo</th>
                  <th className="py-2 font-semibold">Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Horas internas</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    1.050 horas × 30/hora
                  </td>
                  <td className="py-2 text-muted-foreground">31.500</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Freelance (migración)</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    160 horas × 25/hora
                  </td>
                  <td className="py-2 text-muted-foreground">4.000</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Licencias del proyecto</td>
                  <td className="py-2 pr-4 text-muted-foreground">Ambiente de pruebas, 10 semanas</td>
                  <td className="py-2 text-muted-foreground">1.500</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Subtotal directos</td>
                  <td className="py-2 pr-4 text-muted-foreground"></td>
                  <td className="py-2 text-muted-foreground">37.000</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Indirectos (20%)</td>
                  <td className="py-2 pr-4 text-muted-foreground">Sobre horas directas</td>
                  <td className="py-2 text-muted-foreground">7.400</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Contingencia (15%)</td>
                  <td className="py-2 pr-4 text-muted-foreground">Proyecto nuevo, riesgo medio</td>
                  <td className="py-2 text-muted-foreground">5.550</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Costo total presupuestado</td>
                  <td className="py-2 pr-4 text-muted-foreground"></td>
                  <td className="py-2 text-muted-foreground">49.950</td>
                </tr>
              </tbody>
            </table>
            <p>
              Sobre ese costo el negocio decide el margen. Y a partir de aquí empieza la segunda
              mitad del trabajo: el control.
            </p>
          </>
        ),
      },
      {
        heading: "El control mensual que detecta el sobrecosto a tiempo",
        body: (
          <>
            <p>
              Un presupuesto se controla con una pregunta al mes: <strong>¿el trabajo consumido
              corresponde al dinero gastado?</strong> Si el proyecto lleva 40% del presupuesto y
              ha completado 40% del trabajo, va bien; si gastó 40% y completó 25%, cada unidad de
              trabajo está costando más de lo presupuestado, y eso no se corrige solo.
            </p>
            <p>
              La versión formal de esa comparación es el método del{" "}
              <Link to="/blogs/valor-ganado-evm" className="underline underline-offset-2">
                valor ganado (EVM)
              </Link>
              : con tres números (presupuesto, valor del trabajo hecho y gasto real) calcula el
              CPI —cuánto produces por cada unidad gastada— y proyecta el costo final si sigue el
              rendimiento actual. Basta revisarlo una vez al mes en el{" "}
              <Link
                to="/blogs/informe-de-estado-semanal"
                className="underline underline-offset-2"
              >
                informe de estado
              </Link>
              .
            </p>
            <p>
              Dos umbrales prácticos: un cambio de alcance no se aprueba sin su impacto en
              dinero escrito, y la reserva de contingencia no se toca sin registrar en qué. Cuando
              la contingencia lleva gastada la mitad antes de la mitad del proyecto, ya hay
              sobrecosto — no “mala suerte”, sobrecosto.
            </p>
          </>
        ),
      },
      {
        heading: "Los 4 errores que reventan presupuestos",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Confundir presupuesto con precio de venta.</strong> El presupuesto
                calcula costos; el precio agrega margen y negociación. Amarrar el precio primero
                y “ver qué cabe” después es la receta clásica del margen negativo.
              </li>
              <li>
                <strong>Estimaciones optimistas sin registro.</strong> El sesgo de planificación
                aplica a todos; el antídoto es comparar contra proyectos pasados (cuánto se
                desviaron realmente) y multiplicar. La{" "}
                <Link
                  to="/blogs/como-estimar-tiempos-proyecto"
                  className="underline underline-offset-2"
                >
                  estimación de tiempos
                </Link>{" "}
                es la mitad del presupuesto.
              </li>
              <li>
                <strong>Olvidar los indirectos.</strong> Cada hora de proyecto consume oficina,
                administración y software que nadie factura al cliente. Sin la tasa de
                indirectos, cada proyecto “rentable” erosiona la empresa.
              </li>
              <li>
                <strong>Poner contingencia 0 “para ser competitivos”.</strong> El imprevisto no
                pregunta si hay reserva: la primera sorpresa se convierte en pérdida o en
                conversación incómoda. Mejor precio con reserva que precio sin ella.
              </li>
            </ul>
            <p>
              Y cuando el sobrecosto ya está instalado, lo que define el desenlace es la
              velocidad de reacción: detectarlo con el control mensual y actuar —{" "}
              <Link
                to="/blogs/sobrecosto-de-proyecto"
                className="underline underline-offset-2"
              >
                estas son las causas y las salidas
              </Link>
              .
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo armar el presupuesto de un proyecto",
      steps: [
        {
          name: "Parte del alcance y del plan de trabajo",
          text: "Lista las entregas del proyecto y las horas estimadas por rol. Sin plan no hay presupuesto: hay adivinación.",
        },
        {
          name: "Calcula los costos directos",
          text: "Horas estimadas × costo/hora de cada rol, más freelances, licencias y materiales que existen solo por este proyecto.",
        },
        {
          name: "Aplica la tasa de indirectos",
          text: "Suma el porcentaje que tu estructura real consume por hora de proyecto (oficina, administración, software). Si no la conoces, calcúlala una vez con las cuentas del último año.",
        },
        {
          name: "Reserva la contingencia",
          text: "Entre 10% y 30% del subtotal según el riesgo: proyectos repetidos y conocidos por abajo, proyectos nuevos con incertidumbre por arriba. Registra cada uso.",
        },
        {
          name: "Agenda el control mensual",
          text: "Una vez al mes compara gasto real contra trabajo completado (idealmente con el CPI del valor ganado). El sobrecosto se frena cuando se detecta en el primer tercio, no al final.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es el presupuesto de un proyecto?",
        answer:
          "Es la traducción del plan de trabajo a dinero: la suma de los costos directos (horas, freelances, licencias), los costos indirectos asignados, la reserva de contingencia para imprevistos y el margen del negocio. Es también la referencia contra la que se controla el gasto durante toda la ejecución.",
      },
      {
        question: "¿Cómo se hace un presupuesto de proyecto paso a paso?",
        answer:
          "Cinco pasos: estimar las horas por rol desde el plan de trabajo, calcular los costos directos (horas × costo por hora más compras específicas), aplicar la tasa de indirectos, reservar contingencia (10-30% según riesgo) y definir el margen. Después, control mensual comparando gasto contra avance.",
      },
      {
        question: "¿Qué incluye el presupuesto de un proyecto?",
        answer:
          "Cuatro bloques: costos directos (horas del equipo asignado, freelance contratado, licencias y materiales del proyecto), costos indirectos (la porción de estructura que sostiene al proyecto), reserva de contingencia para imprevistos, y margen. Los dos últimos se calculan como porcentaje sobre los costos.",
      },
      {
        question: "¿Cuánta contingencia debe tener un presupuesto?",
        answer:
          "Entre 10% y 15% en proyectos similares a otros que ya hiciste, y entre 20% y 30% en proyectos nuevos, con tecnología desconocida o muchas dependencias externas. La contingencia se administra aparte y cada uso se registra; si lleva gastada la mitad antes de la mitad del proyecto, hay sobrecosto.",
      },
      {
        question: "¿Cuál es la diferencia entre presupuesto y cotización?",
        answer:
          "El presupuesto interno calcula lo que el proyecto te costará a ti (costos + contingencia) y sirve para controlarlo. La cotización u oferta es el precio que le comunicas al cliente: costos más margen, y a veces menos, según negociación. Confundirlos lleva a vender al costo o a presupuestar con el precio ya amarrado.",
      },
    ],
  },
};
