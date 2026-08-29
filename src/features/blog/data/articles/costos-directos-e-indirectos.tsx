import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "costos-directos-e-indirectos",
  title: "Costos directos e indirectos de un proyecto (con ejemplos)",
  excerpt:
    "Qué son los costos directos e indirectos en un proyecto, cómo clasificarlos con una pregunta simple, ejemplos reales y por qué equivocarse revienta el margen.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-09-06",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "presupuesto-de-proyecto",
  related: ["presupuesto-de-proyecto", "sobrecosto-de-proyecto", "plantilla-plan-de-proyecto"],
  seo: {
    title: "Costos directos e indirectos: ejemplos | Hito",
    description:
      "Costos directos e indirectos en un proyecto: qué son, cómo clasificarlos con una pregunta simple, ejemplos reales y el efecto de confundirlos en tu margen.",
    ogImageAlt: "Tabla de costos directos e indirectos de un proyecto con ejemplos.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> los <strong>costos directos</strong> de un proyecto son los
        que existen solo porque existe ese proyecto (las horas del equipo asignado, la licencia
        que se contrató para él); los <strong>indirectos</strong> son los que el proyecto comparte
        con toda la empresa (oficina, administración, software corporativo). Clasificarlos mal no
        es un problema contable: es la forma más silenciosa de vender al costo.
      </>
    ),
    sections: [
      {
        heading: "La pregunta que clasifica cualquier costo",
        body: (
          <>
            <p>
              No necesitas un manual de contabilidad: basta una pregunta —{" "}
              <strong>“¿este costo desaparecería si el proyecto se cancelara mañana?”</strong> Si
              la respuesta es sí, es directo. Si el costo sigue ahí (la oficina, la nómina de
              administración, el software que usa toda la empresa), es indirecto.
            </p>
            <p>
              Las horas del desarrollador asignado: si el proyecto muere, se reasigna a otro
              proyecto o se libera — costo directo. La licencia de diseño contratada solo para
              este proyecto: directa. La licencia anual que ya tenía la empresa: indirecta. El
              freelance contratado para migrar datos: directo. La persona de contabilidad que
              factura ese contrato: indirecta.
            </p>
            <p>
              Hay casos borrosos y está bien: la clasificación es una decisión práctica, no una
              verdad física. Lo importante es aplicar la misma regla en todos los proyectos para
              que los números sean comparables entre sí.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplos lado a lado",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Costo</th>
                  <th className="py-2 pr-4 font-semibold">Tipo</th>
                  <th className="py-2 font-semibold">Por qué</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Horas del equipo asignado</td>
                  <td className="py-2 pr-4 text-muted-foreground">Directo</td>
                  <td className="py-2 text-muted-foreground">
                    Solo se consumen mientras el proyecto vive
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Freelance contratado para el proyecto</td>
                  <td className="py-2 pr-4 text-muted-foreground">Directo</td>
                  <td className="py-2 text-muted-foreground">
                    Existe por y para ese contrato
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Licencias y materiales del proyecto</td>
                  <td className="py-2 pr-4 text-muted-foreground">Directo</td>
                  <td className="py-2 text-muted-foreground">
                    Se compran para él y mueren con él
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Viajes y pruebas específicas</td>
                  <td className="py-2 pr-4 text-muted-foreground">Directo</td>
                  <td className="py-2 text-muted-foreground">
                    Sin proyecto, no hay viaje ni pruebas
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Oficina y servicios</td>
                  <td className="py-2 pr-4 text-muted-foreground">Indirecto</td>
                  <td className="py-2 text-muted-foreground">
                    Sigue igual con o sin proyecto
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Administración, RRHH, contabilidad</td>
                  <td className="py-2 pr-4 text-muted-foreground">Indirecto</td>
                  <td className="py-2 text-muted-foreground">
                    Sostienen toda la empresa, no un proyecto
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Software corporativo (correo, ERP)</td>
                  <td className="py-2 pr-4 text-muted-foreground">Indirecto</td>
                  <td className="py-2 text-muted-foreground">
                    Se paga igual aunque no haya proyectos activos
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Dirección y gerencia general</td>
                  <td className="py-2 pr-4 text-muted-foreground">Indirecto</td>
                  <td className="py-2 text-muted-foreground">
                    Supervisa el portafolio completo, no este esfuerzo
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El punto donde todos fallan: el <strong>software que el equipo usa en el
              proyecto</strong>. Si se contrató solo para él, es directo; si era la licencia
              anual que ya existía, es indirecto (y entra por la tasa). No es lo mismo, y la
              diferencia se paga en margen.
            </p>
          </>
        ),
      },
      {
        heading: "Por qué importa: el margen fantasma",
        body: (
          <>
            <p>
              Imagina un proyecto facturado en 20.000 con costos directos de 14.000. Si ese es
              todo el análisis, parece rentable: 30% de margen. Pero si la empresa gasta cada mes
              en estructura (oficina, administración, software) el equivalente al 20% de sus
              horas de proyecto, el costo real del proyecto es 14.000 + 2.800 = 16.800, y el
              margen real baja a 16%. Sin la tasa de indirectos, cada proyecto puede verse
              rentable en el papel mientras la empresa pierde dinero en el agregado:{" "}
              <strong>margen fantasma</strong>.
            </p>
            <p>
              Por eso ningún{" "}
              <Link
                to="/blogs/presupuesto-de-proyecto"
                className="underline underline-offset-2"
              >
                presupuesto de proyecto
              </Link>{" "}
              se considera completo sin su línea de indirectos. Y por eso dos proyectos con el
              mismo precio y los mismos directos pueden tener rentabilidades distintas: el que
              quema más horas de estructura cuesta más de lo que su factura sugiere.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo repartir los indirectos (sin ser contador)",
        body: (
          <>
            <p>
              El método simple y suficientemente honesto: <strong>tasa sobre horas directas</strong>.
              Se toman los gastos indirectos del último año (o del promedio de los últimos 12
              meses), se dividen entre las horas de proyecto facturadas del mismo periodo, y esa
              tasa — típicamente entre 15% y 30% del costo directo — se aplica a cada presupuesto.
            </p>
            <p>
              Ejemplo: si la empresa gastó 60.000 en estructura el último año y facturó 3.000
              horas de proyecto, la tasa es 20/hora. Un proyecto con 500 horas directas carga
              10.000 de indirectos. No es preciso al centavo; es proporcional y comparable entre
              proyectos, que es lo que la toma de decisiones necesita.
            </p>
            <p>
              Métodos más finos (costeo por actividades, reparto por área) existen y tienen
              sentido en empresas grandes. Para equipos pequeños, la tasa simple actualizada una
              vez al año es mejor que ningún reparto — infinitamente mejor.
            </p>
          </>
        ),
      },
      {
        heading: "Dónde se usa cada tipo durante el proyecto",
        body: (
          <>
            <p>
              La clasificación no termina en el presupuesto: guía el control. Los{" "}
              <strong>directos</strong> se monitorean semanalmente, porque responden a la
              ejecución: horas consumidas vs. avance (si consumen más rápido que el avance, hay{" "}
              <Link
                to="/blogs/sobrecosto-de-proyecto"
                className="underline underline-offset-2"
              >
                sobrecosto
              </Link>{" "}
              en formación). Los <strong>indirectos</strong> se revisan por año: su palanca no es
              el proyecto sino la estructura (una tasa que sube año a año es señal de que la
              empresa está creciendo más lento que su gasto fijo).
            </p>
            <p>
              Y en la planificación, cada tipo vive en su documento: los directos van en la línea
              de recursos del{" "}
              <Link
                to="/blogs/plantilla-plan-de-proyecto"
                className="underline underline-offset-2"
              >
                plan de proyecto
              </Link>
              ; la tasa de indirectos, en las políticas de precios de la empresa. Mezclarlos en un
              solo bloque “gastos” es como empieza la opacidad de costos.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué son los costos directos de un proyecto?",
        answer:
          "Son los que existen solo porque existe ese proyecto: las horas del equipo asignado, el freelance contratado para él, las licencias y materiales comprados específicamente, los viajes y pruebas propias. La prueba: si el proyecto se cancelara mañana, ese costo desaparecería.",
      },
      {
        question: "¿Qué son los costos indirectos de un proyecto?",
        answer:
          "Son los gastos de estructura que el proyecto comparte con toda la empresa y que seguirían existiendo sin él: oficina y servicios, administración, RRHH, contabilidad, software corporativo y dirección general. Se asignan al proyecto mediante una tasa, típicamente como porcentaje de los costos directos.",
      },
      {
        question: "¿Cuál es la diferencia entre costo directo e indirecto?",
        answer:
          "El costo directo es atribuible a un único proyecto y muere con él; el indirecto sostiene toda la operación y se reparte entre todos los proyectos. La diferencia importa en el precio: un presupuesto que ignora los indirectos muestra un margen fantasma — parece rentable por proyecto mientras la empresa pierde en el agregado.",
      },
      {
        question: "¿Cómo se calculan los costos indirectos de un proyecto?",
        answer:
          "Con la tasa sobre horas directas: gastos indirectos del último año divididos entre las horas de proyecto del mismo periodo. Esa tasa (por ejemplo 20/hora, equivalente a un 15-30% del costo directo) se aplica a cada presupuesto según sus horas. Se actualiza una vez al año.",
      },
      {
        question: "¿Las horas del equipo son costo directo o indirecto?",
        answer:
          "Las horas de las personas asignadas al proyecto son costo directo. Las horas de administración, RRHH o dirección que no trabajan en el proyecto son indirectas y entran por la tasa. El matiz: la licencia o herramienta que ya existía en la empresa es indirecta aunque el equipo la use para el proyecto; la que se contrató solo para el proyecto, directa.",
      },
    ],
  },
};
