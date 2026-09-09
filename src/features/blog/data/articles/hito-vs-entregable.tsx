import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "hito-vs-entregable",
  title: "Hito vs entregable: la diferencia que evita planes inflados",
  excerpt:
    "La diferencia entre hito y entregable con tabla comparativa y ejemplos: el entregable es la cosa que se entrega; el hito, el punto de control que certifica que fue aceptada.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-08",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "hito-project-gestion-por-hitos",
  related: [
    "hito-project-gestion-por-hitos",
    "que-es-un-hito-gestion-proyectos",
    "wbs-estructura-desglose-trabajo",
  ],
  seo: {
    title: "Hito vs entregable: diferencia clara, con ejemplos | Hito",
    description:
      "Hito vs entregable: qué es cada uno, tabla comparativa con la tarea, cómo se relacionan (entregable → hito de aceptación) y errores comunes de planificación.",
    ogImageAlt: "Comparación de hito, entregable y tarea con ejemplos.",
  },
  content: {
    eyebrow: "Hitos",
    intro: (
      <>
        <strong>En una línea:</strong> la diferencia entre hito y entregable es simple: el
        entregable es lo que produces y se puede verificar; el hito es el punto de control sin
        duración que marca que ese entregable fue aceptado. Confundirlos infla los planes con
        mojones que nadie puede avanzar.
      </>
    ),
    sections: [
      {
        heading: "Dos definiciones, dos líneas cada una",
        body: (
          <>
            <p>
              <strong>Entregable</strong> es el resultado verificable que el proyecto produce y
              entrega a alguien: un logo, un manual de marca, un sistema funcionando, un informe.
              Tiene contenido: se puede guardar, abrir, revisar y rechazar.
            </p>
            <p>
              <strong>Hito</strong> es el punto de control sin duración que marca que algo se
              logró: una aprobación, una entrega realizada, un cierre. No tiene contenido: tiene
              fecha, criterio y evidencia. Un ejemplo en una línea para fijar los tres niveles:
              «manual de marca» es el entregable (la cosa); «manual entregado y validado por el
              cliente» es el hito (el momento); «redactar la sección de usos incorrectos del
              logo» es la tarea (el trabajo). Si tu plan nombra las tres cosas distintas,
              funciona; si usa una sola palabra para las tres, va a doler. La definición
              extendida del hito —tipos, criterios y la confusión con las tareas— está en{" "}
              <Link
                to="/blogs/que-es-un-hito-gestion-proyectos"
                className="underline underline-offset-2"
              >
                qué es un hito en la gestión de proyectos
              </Link>
              . Con estas dos definiciones sobre la mesa, la comparación se ve sola.
            </p>
          </>
        ),
      },
      {
        heading: "Tabla comparativa: hito, entregable y tarea",
        body: (
          <>
            <p>
              Tercera pieza del triángulo: la tarea, que es el trabajo que produce el
              entregable. Las tres, cara a cara:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Criterio</th>
                  <th className="py-2 pr-4 font-semibold">Hito</th>
                  <th className="py-2 pr-4 font-semibold">Entregable</th>
                  <th className="py-2 font-semibold">Tarea</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Qué es</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Punto de control que marca un logro.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Resultado verificable que se entrega.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Trabajo que consume tiempo y recursos.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Duración</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cero: ocurre en un instante.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    No aplica: es una cosa, no un lapso.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Horas o días, con responsable propio.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Ejemplo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    «Logo aprobado por el cliente».
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El archivo del logo final en todos los formatos.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    «Diseñar tres variantes de logo».
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Quién lo valida</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Quien confirma el criterio: cliente o responsable.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Quien lo recibe, lo revisa y lo acepta.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El propio equipo que lo ejecuta.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La frase que lo resume todo: <strong>la tarea produce el entregable, y el hito
              certifica que el entregable fue aceptado</strong>. Tres conceptos, una sola cadena.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo se relacionan: del entregable al hito de aceptación",
        body: (
          <>
            <p>
              En un plan bien armado, cada entregable relevante termina en un{" "}
              <strong>hito de aceptación</strong>: el momento formal en que quien recibe confirma
              que cumple lo pactado. Ese emparejamiento evita los dos extremos tóxicos:
              entregables que se acumulan sin que nadie los valide, y hitos que se marcan sin que
              exista la cosa entregada detrás.
            </p>
            <p>
              Esta es también la lógica del WBS: la estructura de desglose del trabajo despliega
              el proyecto en entregables, y de cada entregable cuelgan los paquetes de trabajo
              que lo producen. Cómo armarla paso a paso está en{" "}
              <Link
                to="/blogs/wbs-estructura-desglose-trabajo"
                className="underline underline-offset-2"
              >
                la WBS (estructura de desglose del trabajo)
              </Link>
              . Los hitos luego se cuelgan de esa estructura como cerraduras: una por rama
              relevante, cada una esperando su entregable.
            </p>
            <p>
              Y conecta con la idea de avanzar de mojón en mojón que describimos en{" "}
              <Link
                to="/blogs/hito-project-gestion-por-hitos"
                className="underline underline-offset-2"
              >
                la gestión de proyectos por hitos
              </Link>
              : el proyecto no avanza cuando las tareas se mueven, sino cuando los entregables se
              aceptan.
            </p>
          </>
        ),
      },
      {
        heading: "Los dos errores clásicos (y cómo suenan)",
        body: (
          <>
            <p>
              Confundir los tres niveles no es un problema teórico: produce planes concretamente
              malos. Estos son los dos errores que aparecen una y otra vez:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Planificar entregables como hitos.</strong> Si tu cronograma dice
                «manual de marca» como mojón, el plan miente: un manual no ocurre en un instante,
                se produce durante semanas. El resultado es un plan sin duración visible, donde
                nadie sabe cuánto trabajo hay detrás de cada rombo. El fix: el entregable vive en
                el WBS como paquete de trabajo con sus tareas, y el hito es su aceptación.
              </li>
              <li>
                <strong>Hitos sin entregable asociado.</strong> «Fase 1 completada» sin nada que
                entregar ni validar es un mojón decorativo: no hay criterio, no hay evidencia y
                no hay consecuencias si no se cumple. El fix: si no puedes nombrar el entregable
                que el hito certifica, el hito sobra — y si no puedes nombrar el criterio,
                todavía no está definido.
              </li>
            </ul>
            <p>
              El segundo error es el más traicionero, porque los mojones decorativos se ven bien
              en las presentaciones: cinco fases, cinco rombos, todo prolijo. El problema llega
              cuando hay que decidir: sin entregable asociado, «fase 1 completada» se puede
              declarar cumplida un viernes sin que nada en el proyecto haya cambiado de verdad, y
              nadie puede objetar porque no hay criterio contra el cual objetar.
            </p>
            <p>
              Una prueba rápida para tu plan: recorre cada hito y pregúntate qué entregable
              certifica y quién lo validó. Si alguna respuesta es un encogimiento de hombros, ya
              sabes qué arreglar primero.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo extremo a extremo: un rediseño de marca",
        body: (
          <>
            <p>
              Veamos la cadena completa —tarea, entregable, hito— en un proyecto de identidad de
              marca de seis semanas:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Entregables:</strong> tres variantes de logo, el logo final en todos los
                formatos, el manual de marca y el sitio web publicado.
              </li>
              <li>
                <strong>Tareas:</strong> investigar competidores, bocetar, vectorizar, redactar
                el manual, maquetar la web, publicar. Cada una con duración y responsable.
              </li>
              <li>
                <strong>Hitos:</strong> propuesta creativa aprobada (semana 2), entrega del
                manual de marca (semana 4), aceptación final del sistema completo (semana 6).
              </li>
            </ul>
            <p>
              Cada hito certifica entregables concretos: la propuesta aprobada certifica las
              variantes, la entrega certifica el manual, la aceptación final certifica el
              conjunto. Si el cliente pregunta por qué van en la semana 5 y el manual no está, el
              plan muestra exactamente qué entregable se atrasó y qué hito arrastra. Más
              mojones por industria y por fase están en{" "}
              <Link
                to="/blogs/hitos-de-un-proyecto-ejemplos"
                className="underline underline-offset-2"
              >
                los hitos de un proyecto con ejemplos
              </Link>
              .
            </p>
            <p>
              Si quieres que los hitos y entregables vivan en la misma herramienta —checklists y
              SOPs al lado del trabajo, hitos que emergen de la estructura Producto → Proyecto →
              Área → Proceso/Checklist → Tarea, todo en JSON local en tu carpeta, sin cuenta ni
              asientos—{" "}
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
              — hitos verificables y entregables documentados, local-first y sin nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un entregable en un proyecto?",
        answer:
          "Es el resultado verificable que el proyecto produce y entrega a alguien: un documento, un diseño, un sistema funcionando. Se define por su contenido y su criterio de aceptación, no por su fecha; se puede guardar, revisar, rechazar y corregir hasta que el receptor lo acepta.",
      },
      {
        question: "¿Cuál es la diferencia entre un hito y un entregable?",
        answer:
          "El entregable es la cosa que se entrega y se puede verificar; el hito es el instante sin duración en que se certifica que esa cosa quedó lograda y aceptada. El logo es el entregable; «logo aprobado por el cliente» es el hito que lo valida.",
      },
      {
        question: "¿Un hito puede tener duración?",
        answer:
          "En la teoría clásica de proyectos, no: un hito es un punto de control de duración cero. Algunas herramientas permiten hitos con duración para revisiones o informes que ocupan tiempo real, pero entonces conviene dejar claro que el logro se verifica al final de ese lapso, no durante.",
      },
      {
        question: "¿El entregable final es un hito?",
        answer:
          "No: el entregable final es la cosa —el sistema, la obra, el manual—; el hito es su aceptación formal, como la firma de conformidad del cliente. Un proyecto termina cuando el entregable final se entrega y su hito de aceptación se cumple con evidencia, no antes.",
      },
      {
        question: "¿Cuál es la diferencia entre hito y tarea?",
        answer:
          "La tarea es trabajo con duración, responsable y esfuerzo; el hito es un punto de control sin duración que marca que algo se logró. «Diseñar tres variantes de logo» es una tarea; «propuesta aprobada» es el hito que esas tareas hacen posible.",
      },
    ],
  },
};
