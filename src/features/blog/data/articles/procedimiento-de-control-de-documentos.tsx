import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "procedimiento-de-control-de-documentos",
  title: "Procedimiento de control de documentos: qué debe incluir y ejemplo",
  excerpt:
    "El control de documentos garantiza que todos usen la versión vigente: qué es, los 7 elementos del procedimiento, codificación, listado maestro con ejemplo y los errores que lo hacen fallar.",
  category: "procesos",
  categoryLabel: "Procesos",
  publishedAt: "2026-10-23",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "manual-de-procesos-y-procedimientos",
  related: [
    "manual-de-procesos-y-procedimientos",
    "gestion-de-la-calidad-proyecto",
    "control-de-cambios-proyecto",
    "versionar-proyectos-con-git",
  ],
  seo: {
    title: "Procedimiento de control de documentos: ejemplo | Hito",
    description:
      "Procedimiento de control de documentos: qué es, los 7 elementos que debe incluir, cómo codificar y versionar, listado maestro de documentos con ejemplo y errores comunes.",
    ogImageAlt: "Listado maestro de documentos con código, versión y fecha de revisión.",
  },
  content: {
    eyebrow: "Documentación de procesos",
    intro: (
      <>
        <strong>En una línea:</strong> el procedimiento de control de documentos define cómo se
        crean, revisan, aprueban, distribuyen y retiran los documentos de la organización para
        que nadie trabaje con una versión vencida.
      </>
    ),
    sections: [
      {
        heading: "Qué es el control de documentos y qué problema resuelve",
        body: (
          <>
            <p>
              Cualquier equipo que documenta procesos termina enfrentando el mismo problema: hay
              tres versiones del mismo documento, nadie sabe cuál manda y alguien ejecuta un
              procedimiento que se cambió hace seis meses. El control de documentos es el
              conjunto de reglas que evita eso: quién puede crear o modificar un documento,
              cómo se aprueba, cómo se identifica la versión vigente y qué se hace con las
              versiones anteriores.
            </p>
            <p>
              No es un invento exclusivo de las certificaciones. Las normas de gestión de la
              calidad, como ISO 9001, exigen controlar la «información documentada» (la
              versión 2015 de la norma ya no habla de «procedimiento documentado obligatorio»,
              pero sí pide asegurar que esa información esté disponible, protegida y
              actualizada). Con o sin auditor, la necesidad es práctica: si lo escrito no
              coincide con lo vigente, el documento es peor que no tener ninguno.
            </p>
            <p>
              Conviene distinguir dos cosas que se confunden: un <strong>documento</strong> se
              crea, se actualiza y tiene versiones (un SOP, una política, una plantilla); un{" "}
              <strong>registro</strong> es evidencia de algo que ocurrió y no se modifica (una
              factura, un acta firmada, un formulario lleno). Los documentos se controlan por
              versión; los registros se controlan por conservación.
            </p>
          </>
        ),
      },
      {
        heading: "Los 7 elementos del procedimiento",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Propósito y alcance.</strong> Qué documentos cubre (procedimientos,
                formatos, políticas) y a qué áreas aplica.
              </li>
              <li>
                <strong>Codificación.</strong> Un código único por documento, que indique área
                y tipo (por ejemplo, ADM-PR-02: administración, procedimiento, número 02).
              </li>
              <li>
                <strong>Elaboración y revisión.</strong> Quién redacta, quién revisa el
                contenido técnico y qué se verifica antes de aprobar.
              </li>
              <li>
                <strong>Aprobación.</strong> Quién tiene autoridad para dejar un documento
                vigente. Una persona, no «el comité» sin nombre.
              </li>
              <li>
                <strong>Distribución y acceso.</strong> Dónde está la versión vigente y quién
                puede consultarla. Idealmente en un único lugar.
              </li>
              <li>
                <strong>Cambios y versionado.</strong> Cómo se solicita un cambio, cómo se
                numera la versión y cómo se registra qué cambió. Se parece mucho al{" "}
                <Link
                  to="/blogs/control-de-cambios-proyecto"
                  className="underline underline-offset-2"
                >
                  control de cambios de un proyecto
                </Link>
                , aplicado a documentos.
              </li>
              <li>
                <strong>Obsoletos y conservación.</strong> Qué pasa con las versiones
                anteriores (se retiran de uso, se archivan con marca «obsoleto») y cuánto
                tiempo se conservan los registros.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Codificación y versionado que no se rompen",
        body: (
          <>
            <p>
              Un esquema simple sobrevive años; uno elaborado se abandona en un mes. Una forma
              que funciona en equipos pequeños:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Código:</strong> ÁREA-TIPO-NÚMERO, por ejemplo COM-PR-03 (comercial,
                procedimiento, 03) o ADM-FO-01 (administración, formato, 01).
              </li>
              <li>
                <strong>Versión:</strong> número entero para cambios que alteran cómo se
                trabaja (v2, v3) y decimal para correcciones menores (v2.1). Evita versiones
                como «final_v3_definitivo».
              </li>
              <li>
                <strong>Fecha:</strong> fecha de aprobación y fecha de próxima revisión dentro
                del propio documento, en el encabezado.
              </li>
              <li>
                <strong>Historial:</strong> una tabla al final con versión, fecha, qué cambió y
                quién aprobó.
              </li>
            </ul>
            <p>
              Los equipos técnicos tienen una ventaja: si los documentos son archivos de texto,
              el historial de versiones puede delegarse al control de versiones, como se
              explica en{" "}
              <Link
                to="/blogs/versionar-proyectos-con-git"
                className="underline underline-offset-2"
              >
                versionar proyectos con Git
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "El listado maestro de documentos",
        body: (
          <>
            <p>
              Es la pieza central del control: una tabla que lista cada documento, su versión
              vigente y dónde está. Sin ella, el procedimiento es teoría; con ella, cualquiera
              puede responder en 10 segundos «¿esta es la versión vigente?». Se le llama también
              «lista maestra» o «listado maestro de documentos y registros».
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Código</th>
                  <th className="py-2 pr-4 font-semibold">Documento</th>
                  <th className="py-2 pr-4 font-semibold">Versión</th>
                  <th className="py-2 pr-4 font-semibold">Aprobó</th>
                  <th className="py-2 font-semibold">Próx. revisión</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">ADM-PR-02</td>
                  <td className="py-2 pr-4 text-muted-foreground">Facturación mensual</td>
                  <td className="py-2 pr-4 text-muted-foreground">v2.0</td>
                  <td className="py-2 pr-4 text-muted-foreground">Dirección</td>
                  <td className="py-2 text-muted-foreground">2027-10</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">COM-PR-03</td>
                  <td className="py-2 pr-4 text-muted-foreground">Alta de cliente nuevo</td>
                  <td className="py-2 pr-4 text-muted-foreground">v1.2</td>
                  <td className="py-2 pr-4 text-muted-foreground">Dirección</td>
                  <td className="py-2 text-muted-foreground">2027-04</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">ADM-FO-01</td>
                  <td className="py-2 pr-4 text-muted-foreground">Formato de solicitud de compra</td>
                  <td className="py-2 pr-4 text-muted-foreground">v1.0</td>
                  <td className="py-2 pr-4 text-muted-foreground">Administración</td>
                  <td className="py-2 text-muted-foreground">2027-01</td>
                </tr>
              </tbody>
            </table>
            <p>
              Una persona es dueña del listado (no «todos»). Actualizarlo es parte de cerrar
              cualquier cambio de documento: el cambio no está terminado hasta que el listado
              lo refleja.
            </p>
          </>
        ),
      },
      {
        heading: "Modelo de procedimiento: texto base",
        body: (
          <>
            <pre className="whitespace-pre-wrap rounded-md border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
              {`PROCEDIMIENTO DE CONTROL DE DOCUMENTOS · SGC-PR-01 · v1.0
1. Propósito: asegurar que se use siempre la versión vigente de cada documento.
2. Alcance: procedimientos, formatos y políticas de todas las áreas.
3. Responsable: coordinador de calidad (dueño del listado maestro).
4. Creación o cambio: cualquier persona solicita el cambio al dueño del
   documento; este redacta, el coordinador revisa y Dirección aprueba.
5. Identificación: código ÁREA-TIPO-NÚMERO, versión y fecha en el encabezado.
6. Distribución: la versión vigente vive solo en la carpeta "Vigentes".
   Las copias impresas se consideran no controladas.
7. Obsoletos: al aprobar una versión nueva, la anterior se mueve a
   "Obsoletos" con la marca correspondiente.
8. Registros: se conservan 5 años en la carpeta del proceso.
9. Revisión: cada documento se revisa al menos cada 12 meses.`}
            </pre>
            <p>
              Ajusta plazos, nombres de carpeta y responsables a tu organización. Lo importante
              es que sea corto, que lo cumplas y que se enlace con el resto del{" "}
              <Link
                to="/blogs/manual-de-procesos-y-procedimientos"
                className="underline underline-offset-2"
              >
                manual de procesos y procedimientos
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Errores comunes",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Varias ubicaciones.</strong> Si la versión vigente puede estar en el
                correo, el escritorio y la nube, no hay control. Un solo lugar de consulta.
              </li>
              <li>
                <strong>Copias impresas sin marca.</strong> Lo impreso envejece. Márcalo como
                «copia no controlada» y consulta siempre la versión digital.
              </li>
              <li>
                <strong>Listado maestro desactualizado.</strong> Un listado que no se actualiza
                es peor que no tenerlo: da falsa seguridad.
              </li>
              <li>
                <strong>Burocracia desproporcionada.</strong> Cinco firmas para corregir una
                errata mata la actualización. Define cambios menores con aprobación ligera.
              </li>
              <li>
                <strong>No retirar obsoletos.</strong> El documento viejo sigue circulando
                porque nadie lo quitó. Retirar es parte del procedimiento, no un extra.
              </li>
            </ul>
            <p>
              Si quieres que tus procedimientos vivan en archivos locales, con su versión y
              ligados a las tareas que los usan, sin cuenta ni nube,{" "}
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
              — documentación versionada y a mano, local-first.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un procedimiento de control de documentos?",
        answer:
          "Es el conjunto de reglas que define cómo se crean, revisan, aprueban, distribuyen, modifican y retiran los documentos de una organización, para garantizar que todos usen siempre la versión vigente.",
      },
      {
        question: "¿Qué debe incluir un procedimiento de control de documentos?",
        answer:
          "Propósito y alcance, codificación, elaboración y revisión, aprobación, distribución y acceso, control de cambios y versiones, y tratamiento de obsoletos y conservación de registros. Se complementa con un listado maestro de documentos.",
      },
      {
        question: "¿Qué es el listado maestro de documentos?",
        answer:
          "Es una tabla que enumera todos los documentos de la organización con su código, nombre, versión vigente, responsable que aprobó y fecha de próxima revisión. Permite saber en segundos cuál es la versión vigente de cualquier documento.",
      },
      {
        question: "¿Cuál es la diferencia entre documento y registro?",
        answer:
          "Un documento se crea y se actualiza, y por eso se controla por versión (un SOP, una plantilla). Un registro es evidencia de algo que ya ocurrió y no se modifica (una factura, un acta firmada), y por eso se controla por conservación y acceso.",
      },
      {
        question: "¿ISO 9001 exige un procedimiento de control de documentos?",
        answer:
          "La versión 2015 de ISO 9001 no exige un procedimiento documentado específico, pero sí requiere controlar la información documentada: identificarla, aprobarla, asegurar que esté disponible y actualizada, y protegerla. Muchas organizaciones mantienen igualmente el procedimiento porque ordena esa tarea.",
      },
    ],
  },
};
