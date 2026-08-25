import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "plantillas-gestion-proyectos",
  title: "Las 8 plantillas de gestión de proyectos que sí se usan",
  excerpt:
    "Ocho plantillas que un equipo pequeño realmente llena: plan, acta, informe, RACI, riesgos, kickoff, WBS y cronograma. Cuáles saltarte.",
  category: "plantillas",
  categoryLabel: "Plantillas",
  publishedAt: "2027-04-12",
  readingTime: "12 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  related: [
    "plantilla-plan-de-proyecto",
    "acta-constitucion-proyecto",
    "informe-de-estado-semanal",
    "gestion-proyectos-excel",
    "herramientas-gestion-proyectos-gratis",
  ],
  seo: {
    title: "8 plantillas de gestión de proyectos que sí se usan | Hito",
    description:
      "Ocho plantillas de gestión de proyectos que un equipo pequeño sí llena: plan, acta, WBS, cronograma, RACI, informe, riesgos y cierre. Cuáles saltar.",
    ogImageAlt:
      "Ocho plantillas de gestión de proyectos que un equipo pequeño sí llena, y cuáles saltarse.",
  },
  content: {
    eyebrow: "Plantillas",
    intro: (
      <>
        <strong>En una línea:</strong> las <strong>plantillas de gestión de proyectos</strong> que
        un equipo pequeño realmente llena son ocho — acta, plan, WBS, cronograma, RACI, informe
        semanal, riesgos y cierre — no las 11 o 16 que ves en packs de Excel. El resto termina en
        una carpeta que nadie abre. Acá va cuáles sí, cuáles saltarte, y la señal de que una
        plantilla ya se volvió cementerio.
      </>
    ),
    sections: [
      {
        heading: "Por qué 16 plantillas terminan en una carpeta vacía",
        body: (
          <>
            <p>
              Los packs de plantillas (Someka, HubSpot, Asana, ProjectManager) venden cobertura:
              comunicaciones, calidad, adquisiciones, interesados, lecciones aprendidas, change
              request. Un PMO de 40 personas las usa. Un equipo de producto de 4, una diseñadora
              freelance o un sprint de agencia de dos semanas, no. Llenar un documento que nadie
              va a releer es trabajo inventado.
            </p>
            <p>
              La regla práctica: una plantilla existe si alguien la abre otra vez después de
              crearla. Si solo se “completa para el archivo”, no es gestión — es teatro. Las ocho
              de abajo pasan esa prueba en equipos chicos. El resto se puede absorber en un
              párrafo dentro del{" "}
              <Link
                to="/blogs/plantilla-plan-de-proyecto"
                className="underline underline-offset-2"
              >
                plan de proyecto
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Las 8 plantillas de gestión de proyectos que sí se llenan",
        body: (
          <>
            <p>
              Estas ocho cubren las{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                5 fases de un proyecto
              </Link>{" "}
              sin duplicarse. Si una no se usa, la fila de la derecha te dice por qué.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Plantilla</th>
                  <th className="py-2 pr-4 font-semibold">Cuándo usarla</th>
                  <th className="py-2 font-semibold">Señal de que no la estás usando</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    <Link
                      to="/blogs/acta-constitucion-proyecto"
                      className="underline underline-offset-2"
                    >
                      Acta de constitución
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Antes de gastar tiempo o presupuesto; autoriza el proyecto
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El sponsor no podría decir qué autorizó, ni quién dirige
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Plan de proyecto</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Después del acta, antes de ejecutar; una página alcanza
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Nadie puede decir qué está fuera de alcance
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    <Link
                      to="/blogs/wbs-estructura-desglose-trabajo"
                      className="underline underline-offset-2"
                    >
                      WBS
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cuando el plan no cabe en la cabeza: desglose de entregables
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Las tareas aparecen como “hacer el proyecto”
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    <Link
                      to="/blogs/plantilla-cronograma-proyecto"
                      className="underline underline-offset-2"
                    >
                      Cronograma
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cuando hay fechas y dependencias; hitos, no un Gantt de 40 páginas
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Las fechas viven en el chat y cada quien tiene las suyas
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                      Matriz RACI
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Más de 3 personas, o un cliente que aprueba
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Dos personas creen que aprueban lo mismo, o ninguna
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    <Link
                      to="/blogs/informe-de-estado-semanal"
                      className="underline underline-offset-2"
                    >
                      Informe de estado semanal
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cada semana de ejecución; 8–12 líneas, no una reunión de 45 min
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El status es una llamada porque nadie escribió nada
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Registro de riesgos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Desde el plan; 5–10 riesgos, revisión de 15 min por semana
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Los problemas “sorprenden” al equipo
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">
                    <Link
                      to="/blogs/cierre-de-proyecto-checklist"
                      className="underline underline-offset-2"
                    >
                      Checklist de cierre
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    La última semana, no “cuando haya tiempo”
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El proyecto queda “en curso” fantasma en el portafolio
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El{" "}
              <Link to="/blogs/kickoff-de-proyecto" className="underline underline-offset-2">
                kickoff
              </Link>{" "}
              no es la novena plantilla: es la reunión que usa el acta. Si ya tienes un acta de
              una página, el kickoff es leerla en voz alta, acordar supuestos y arrancar. No hace
              falta un “deck de kickoff” aparte que copia lo mismo con otra tipografía.
            </p>
          </>
        ),
      },
      {
        heading: "Cuáles saltarte (y no te va a pasar nada)",
        body: (
          <>
            <p>
              Saltarte una plantilla no es amateur: es no producir un documento que nadie va a
              mantener. En un equipo de 5, estas casi nunca se llenan de verdad:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Plan de comunicaciones de 8 páginas.</strong> Un párrafo en el plan
                (“update viernes en el canal; el cliente recibe el informe semanal”) alcanza.
              </li>
              <li>
                <strong>Registro de interesados con 20 columnas.</strong> Si caben en una mano,
                nómbralos en el acta. La matriz de poder/interés es para programas, no para un
                sprint.
              </li>
              <li>
                <strong>Plan de calidad, de adquisiciones, de recursos.</strong> Si QA es una
                persona y no hay proveedores, no hay documento: hay una checklist de “terminado”.
              </li>
              <li>
                <strong>Change request de 4 páginas.</strong> Para frenar{" "}
                <Link
                  to="/blogs/alcance-de-proyecto-scope-creep"
                  className="underline underline-offset-2"
                >
                  scope creep
                </Link>
                , basta un acuerdo de una línea: todo pedido fuera de alcance se evalúa aparte,
                con costo y fecha.
              </li>
              <li>
                <strong>Formulario de lecciones aprendidas de 12 campos.</strong> Tres preguntas
                de cierre valen más que un template que nadie completa.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Cuándo una plantilla se convierte en cementerio",
        body: (
          <>
            <p>
              Las plantillas no mueren el día que las creas: mueren el día que dejan de
              actualizarse y nadie se atreve a borrarlas. Señales claras:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Nadie la tocó en tres semanas y el proyecto sigue vivo.</li>
              <li>Solo la llena quien “hace de PM”; el resto del equipo no sabe que existe.</li>
              <li>Llenarla tarda más que el trabajo que describe.</li>
              <li>Duplica lo que el tablero ya muestra (tareas, dueños, fechas).</li>
              <li>
                Se copió de un PMO o de PMI y tiene 14 secciones, 11 vacías. Las vacías son la
                prueba.
              </li>
            </ul>
            <p>
              Cuando ves esas señales, no “revivas” la plantilla con una reunión. Recórtala a lo
              que sí se usa, o elimínala y deja el dato en el plan o en el informe semanal. Un
              cementerio de docs enseña al equipo que documentar es teatro.
            </p>
          </>
        ),
      },
      {
        heading: "Cuántas plantillas según el tamaño del equipo",
        body: (
          <>
            <p>
              No hace falta las ocho siempre. El set mínimo cambia con el tamaño y el plazo:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Diseñadora freelance, un cliente:</strong> acta (o la propuesta firmada
                hace de acta), plan de una página, cronograma de hitos. Salta WBS y RACI: hay una
                sola persona haciendo el trabajo.
              </li>
              <li>
                <strong>Sprint de agencia de 1–2 semanas:</strong> acta corta + kickoff, tablero,
                informe al cliente el viernes. WBS y Gantt son overhead. El cierre es una
                checklist de 10 minutos.
              </li>
              <li>
                <strong>Equipo de producto de 4:</strong> las ocho, en versión liviana. La WBS
                puede ser la lista de épicas; el cronograma, hitos y no un Gantt; los riesgos, 5
                filas — ver{" "}
                <Link
                  to="/blogs/gestion-de-riesgos-simple"
                  className="underline underline-offset-2"
                >
                  gestión de riesgos para equipos pequeños
                </Link>
                .
              </li>
            </ul>
            <p>
              Un equipo de 5 que intenta llenar 16 templates no está más profesional: está más
              ocupado. Empieza por acta + plan + informe semanal. Agrega RACI cuando aparezca la
              primera pelea de “pensé que tú lo aprobabas”.
            </p>
          </>
        ),
      },
      {
        heading: "Plantilla vs software (y Excel)",
        body: (
          <>
            <p>
              Una plantilla es un documento que llenas. El software es donde el trabajo se mueve.
              Confundirlos es la receta para tener un Gantt en Excel, un tablero en otra app y el
              status en un hilo de chat: tres fuentes, ninguna verdadera.
            </p>
            <p>
              Excel sirve para el set de ocho mientras una persona lo edita y se exporta a PDF
              para el cliente. Deja de servir cuando tres personas lo editan a la vez o cuando el
              cronograma vive desconectado de las tareas. Si tu operación hoy es una hoja, parte
              de{" "}
              <Link
                to="/blogs/gestion-proyectos-excel"
                className="underline underline-offset-2"
              >
                gestión de proyectos en Excel
              </Link>{" "}
              y no migres “porque sí”: migra cuando la hoja se volvió el cuello de botella.
            </p>
            <p className="rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              Regla: si la plantilla no cambia una decisión esta semana, no la mantengas. El
              software no arregla un documento que nadie lee.
            </p>
          </>
        ),
      },
      {
        heading: "El orden: de acta a cierre",
        body: (
          <>
            <p>
              Llenar las ocho en cualquier orden produce documentos que se contradicen. El orden
              sigue las fases, no el gusto de quien armó el pack de Excel:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Acta</strong> en el inicio: autoriza, nombra sponsor y quien dirige.
              </li>
              <li>
                <strong>Plan</strong> en la planificación: alcance, entregables, hitos, roles,
                presupuesto, riesgos, comunicación, criterios de éxito.
              </li>
              <li>
                <strong>WBS + cronograma + RACI</strong> solo si el plan de una página se queda
                corto. No los inventes “porque el template los trae”.
              </li>
              <li>
                <strong>Kickoff</strong> con el acta (y el plan si ya existe). Arranca la
                ejecución.
              </li>
              <li>
                <strong>Informe semanal + registro de riesgos</strong> durante el seguimiento.
              </li>
              <li>
                <strong>Checklist de cierre</strong> en la última semana: entregables, accesos,
                facturación, retro.
              </li>
            </ol>
            <p>
              Si quieres tener el acta, el plan y el informe junto a las tareas —no en una
              carpeta de Drive que nadie abre—, Hito las deja en el mismo proyecto. El trabajo de
              verdad sigue siendo llenarlas.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo armar el set mínimo de plantillas",
      steps: [
        {
          name: "Empieza por el acta",
          text: "Una página: por qué existe el proyecto, quién autoriza, quién dirige, alcance alto nivel y presupuesto grosero. Sin acta, el resto es trabajo sin mandato.",
        },
        {
          name: "Baja el plan a una página",
          text: "Propósito, alcance (qué sí y qué no), entregables, hitos, roles, riesgos, comunicación y criterios de éxito. Si no cabe en una página, todavía está demasiado granular.",
        },
        {
          name: "Agrega WBS y cronograma solo si hace falta",
          text: "Si el plan ya se puede ejecutar, no desgloses por deporte. Usa WBS cuando las tareas aparecen como \"hacer el proyecto\" y cronograma cuando las fechas viven en el chat.",
        },
        {
          name: "RACI si hay más de tres personas o un cliente que aprueba",
          text: "Una sola A por entregable. Con un freelance y un cliente, el contrato ya hace de RACI.",
        },
        {
          name: "Informe semanal y riesgos en ejecución",
          text: "Ocho a doce líneas cada viernes, y 5–10 riesgos revisados 15 minutos por semana. Eso reemplaza la reunión de status de 45 minutos.",
        },
        {
          name: "Cierra con checklist, no con silencio",
          text: "Entregables aceptados, accesos revocados, último hito facturado, retro de tres preguntas, proyecto marcado como cerrado.",
        },
      ],
    },
    faq: [
      {
        question: "¿Cuáles son las plantillas de gestión de proyectos más habituales?",
        answer:
          "Las más habituales que un equipo pequeño sí llena son ocho: acta de constitución, plan de proyecto, WBS, cronograma, matriz RACI, informe de estado semanal, registro de riesgos y checklist de cierre. Packs de 11–16 agregan comunicaciones, calidad y adquisiciones, que en equipos chicos suelen quedar vacíos.",
      },
      {
        question: "¿Hace falta descargar Excel para usar estas plantillas?",
        answer:
          "No. Una página en un doc, un tablero o un mensaje largo alcanzan si el equipo las vuelve a abrir. Excel es cómodo para tablas (RACI, riesgos, cronograma de hitos), no es un requisito.",
      },
      {
        question: "¿Cuántas plantillas necesita un equipo de 5?",
        answer:
          "Tres de arranque: acta, plan de una página e informe semanal. Suma RACI cuando hay ambigüedad de aprobación, riesgos cuando los problemas “sorprenden”, y cierre en la última semana. Las ocho completas son el techo, no el punto de partida.",
      },
      {
        question: "¿Plantilla o software: qué conviene?",
        answer:
          "La plantilla define qué se escribe; el software es donde se mueve el trabajo. Empieza por las plantillas mínimas aunque vivas en Excel o en un doc. Cambia de herramienta cuando tres personas editan el mismo archivo o cuando el cronograma se desconecta de las tareas.",
      },
      {
        question: "¿El kickoff cuenta como plantilla?",
        answer:
          "No. El kickoff es la reunión que usa el acta de constitución. Un deck aparte que copia el acta suele ser un noveno documento que nadie mantiene. Si el acta cabe en una página, léela en el kickoff y arranca.",
      },
      {
        question: "¿Hay que usar las 8 en un proyecto de dos semanas?",
        answer:
          "No. En un sprint corto bastan acta (o brief firmado), tablero con dueños y un informe al cliente al final de cada semana. WBS, Gantt y RACI de 12 filas son overhead si el equipo cabe en una mesa.",
      },
    ],
  },
};
