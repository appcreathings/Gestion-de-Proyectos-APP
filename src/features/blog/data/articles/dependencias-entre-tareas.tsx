import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "dependencias-entre-tareas",
  title: "Dependencias entre tareas, sin jerga de Gantt",
  excerpt:
    "Qué son las dependencias entre tareas y los 4 tipos (FS, SS, FF, SF) explicados con ejemplos. Cómo marcarlas en un tablero y cuándo necesitas un Gantt de verdad.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-01",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "tablero-kanban",
  related: [
    "tablero-kanban",
    "diagrama-de-gantt",
    "ruta-critica-proyecto",
    "plantilla-cronograma-proyecto",
  ],
  seo: {
    title: "Dependencias entre tareas: tipos y ejemplos | Hito",
    description:
      "Dependencias entre tareas: qué son, los 4 tipos (fin-inicio, inicio-inicio, fin-fin, inicio-fin) con ejemplos, cómo gestionarlas sin Gantt y cuándo sí necesitas uno.",
    ogImageAlt: "Dependencias entre tareas: tipos FS, SS, FF y SF con ejemplos simples.",
  },
  content: {
    eyebrow: "Organización del trabajo",
    intro: (
      <>
        <strong>En una línea:</strong> hay <strong>dependencia entre tareas</strong> cuando una
        no puede empezar (o terminar) hasta que otra empieza (o termina). “El texto se publica
        después de que legal lo apruebe” es una dependencia; ignorarla es la diferencia entre un
        cronograma que se cumple y uno que se rehace cada semana. Aquí están los 4 tipos, en
        lenguaje llano, y cómo gestionarlos sin instalar un Gantt.
      </>
    ),
    sections: [
      {
        heading: "Qué es una dependencia entre tareas",
        body: (
          <>
            <p>
              Una <strong>dependencia entre tareas</strong> es una relación de orden: el trabajo
              de una tarea necesita que otra haya avanzado (o terminado) primero. No es una
              preferencia de organización: es una restricción del mundo real. El pedido no se
              envía antes de estar embalado; la campaña no arranca sin creativos aprobados; el
              deploy no ocurre antes de las pruebas.
            </p>
            <p>
              Se distingue de otros vínculos que se confunden con ella:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Dependencia ≠ prioridad.</strong> La prioridad dice qué va primero
                aunque podría ir después; la dependencia dice qué{" "}
                <em>no puede</em> ir después, aunque quieras.
              </li>
              <li>
                <strong>Dependencia ≠ misma persona.</strong> Que dos tareas las haga Ana no las
                vincula; que la segunda use el resultado de la primera, sí.
              </li>
              <li>
                <strong>Dependencia ≠ bloqueo.</strong> El bloqueo es el estado en el que se
                convierte una tarea cuando su dependencia no avanza. En un tablero, el bloqueo
                se marca; la dependencia se declara.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Los 4 tipos de dependencias (con ejemplos)",
        body: (
          <>
            <p>
              La jerga formal usa iniciales en inglés: FS, SS, FF, SF. La traducción útil es
              esta:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Tipo</th>
                  <th className="py-2 pr-4 font-semibold">En llano</th>
                  <th className="py-2 font-semibold">Ejemplo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Fin → Inicio (FS)</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    B no puede empezar hasta que A termine.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Publicar el post solo después de que legal lo apruebe.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Inicio → Inicio (SS)</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    B no puede empezar hasta que A empiece (pueden avanzar en paralelo).
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Traducir el manual apenas empieza a escribirse la versión original.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Fin → Fin (FF)</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    B no puede terminar hasta que A termine.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    La puesta a punto del local termina el mismo día que la obra gruesa.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Inicio → Fin (SF)</td>
                  <td className="py-2 text-muted-foreground">
                    B no puede terminar hasta que A empiece. Rara en la práctica; típica en
                    traspasos.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El proveedor nuevo no cierra la transición hasta que el viejo arranca la
                    operación.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              En la vida real, el 90 % de las dependencias que gestiona un equipo pequeño son
              del primer tipo (fin → inicio), algunas del segundo y casi ninguna de los otros
              dos. No necesitas dominar la taxonomía: necesitas detectar cuándo existe una
              relación de orden y nombrarla.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo detectar las dependencias antes de que te muerdan",
        body: (
          <>
            <p>
              Las dependencias no se “configuran”: se descubren con dos preguntas al armar el
              plan o llenar el tablero:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>¿Esta tarea necesita un resultado de otra?</strong> Si B consume lo que
                produce A (un diseño, una aprobación, un dato), hay dependencia FS.
              </li>
              <li>
                <strong>¿Esta tarea necesita una respuesta de alguien fuera del equipo?</strong>{" "}
                Cliente que aprueba, legal que revisa, proveedor que entrega. Esas son las que
                más atrasan proyectos pequeños, porque el reloj de otra persona define el tuyo.
              </li>
            </ol>
            <p>
              Cuando encuentres una, anótala en la tarjeta —“espera aprobación de X”, “requiere
              entrega de Y”— con la fecha límite de la respuesta si la hay. Eso convierte una
              sorpresa futura en un compromiso presente: si X no responde, el atraso ya es
              visible el día que empieza, no el día de la entrega.
            </p>
            <p>
              Si encadenas 15 dependencias y la fecha final depende de una cadena crítica, ya
              estás en territorio de análisis de ruta crítica: qué tareas no pueden atrasarse
              ni un día, en{" "}
              <Link to="/blogs/ruta-critica-proyecto" className="underline underline-offset-2">
                Ruta crítica de un proyecto
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Cómo gestionarlas en un tablero (sin Gantt)",
        body: (
          <>
            <p>
              Para la mayoría del trabajo diario de un equipo pequeño, el{" "}
              <Link to="/blogs/tablero-kanban" className="underline underline-offset-2">
                tablero kanban
              </Link>{" "}
              basta con tres convenciones:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Orden de columnas = orden de proceso.</strong> La secuencia real del
                trabajo (diseño → aprobación → publicación) ya codifica las dependencias
                frecuentes. Una tarjeta solo avanza a la derecha.
              </li>
              <li>
                <strong>Etiqueta de espera.</strong> Una marca visible (“bloqueada”, “espera
                cliente”, “espera legal”) en la tarjeta que no puede avanzar. El bloqueo se ve
                sin preguntar.
              </li>
              <li>
                <strong>La tarjeta dependiente entra al tablero cuando su predecesora está
                cerca de terminar.</strong> No antes: una tarjeta “en curso” esperando a otra es
                WIP de mentira (por qué eso mata la entrega, en{" "}
                <Link to="/blogs/reducir-trabajo-en-curso" className="underline underline-offset-2">
                  Cómo reducir el trabajo en curso
                </Link>
                ).
              </li>
            </ul>
            <p>
              Lo que el tablero no hace es recalcular fechas. Si mueves la aprobación de legal
              una semana, el tablero no te dice cuántos días come eso del resto del plan. Esa
              aritmética es el territorio de un cronograma.
            </p>
          </>
        ),
      },
      {
        heading: "Cuándo necesitas un cronograma (y el Gantt deja de ser adorno)",
        body: (
          <>
            <p>
              El tablero gana para el flujo diario; el cronograma gana cuando se cumplen dos
              condiciones: muchas dependencias encadenadas y una fecha de entrega comprometida
              con alguien de afuera. Señales concretas:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                La fecha final depende de 10+ tareas encadenadas, no de 2–3.
              </li>
              <li>
                Hay proveedores o aprobaciones externas con holgura que hay que calcular, no
                adivinar.
              </li>
              <li>
                El cliente pide ver el plan: barras, hitos y fechas, no un tablero.
              </li>
              <li>
                Cada cambio (“el proveedor se atrasa una semana”) obliga a recontar el resto a
                mano.
              </li>
            </ul>
            <p>
              Ahí conviene armar un cronograma liviano —hitos y dependencias, no 200 barras— y
              dejar el tablero para la operación diaria. El formato y la plantilla están en{" "}
              <Link
                to="/blogs/plantilla-cronograma-proyecto"
                className="underline underline-offset-2"
              >
                Plantilla de cronograma de proyecto
              </Link>{" "}
              y la vista visual de barras, con cuándo ayuda y cuándo estorba, en{" "}
              <Link to="/blogs/diagrama-de-gantt" className="underline underline-offset-2">
                Diagrama de Gantt: qué es y cómo hacerlo
              </Link>
              .
            </p>
            <p>
              En{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              gestionas el flujo en tablero kanban con etiquetas de bloqueo y los hitos y
              dependencias del proyecto quedan documentados junto al trabajo — todo local, en tu
              carpeta, sin cuenta.
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
              — tablero, procesos y automatizaciones local-first para equipos de 1 a 15 personas.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué son las dependencias entre tareas?",
        answer:
          "Son relaciones de orden entre tareas: una no puede empezar o terminar hasta que otra empiece o termine. Ejemplo típico: el envío de una campaña (B) depende de la aprobación de los creativos (A). Detectarlas antes de planear evita cronogramas que se reescriben cada semana.",
      },
      {
        question: "¿Qué tipos de dependencias existen?",
        answer:
          "Cuatro: fin-inicio (B empieza cuando A termina, la más común), inicio-inicio (B empieza cuando A empieza y avanzan en paralelo), fin-fin (B termina cuando A termina) e inicio-fin (B termina cuando A empieza, típica de traspasos). En equipos pequeños, casi todo es fin-inicio.",
      },
      {
        question: "¿Qué es una dependencia FS?",
        answer:
          "FS (finish-to-start, fin-inicio) es la dependencia donde la tarea sucesora no puede empezar hasta que la predecesora termine. Es el caso por defecto: el texto se publica después de la aprobación, el deploy después de las pruebas. Si solo vas a modelar un tipo, modela este.",
      },
      {
        question: "¿Cómo marcar dependencias en un tablero kanban?",
        answer:
          "Tres convenciones: columnas que reflejen el orden real del proceso, una etiqueta visible de espera (‘bloqueada’, ‘espera cliente’) en la tarjeta que no avanza, y la regla de no poner en curso una tarjeta cuya predecesora no está por terminar. El tablero muestra el bloqueo; no recalcula fechas: para eso sirve un cronograma.",
      },
      {
        question: "¿Cuándo necesito un Gantt para las dependencias?",
        answer:
          "Cuando la fecha de entrega comprometida depende de una cadena larga (10+ tareas encadenadas), hay aprobaciones o proveedores externos con holguras a calcular, o cada cambio obliga a recontar el plan a mano. Para el flujo diario de un equipo pequeño, el tablero basta; el cronograma con barras es la segunda capa, no la primera.",
      },
    ],
  },
};
