import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "acta-de-cierre-proyecto",
  title: "Acta de cierre de proyecto: plantilla, ejemplo y para qué sirve",
  excerpt:
    "El acta de cierre certifica el fin formal del proyecto y evita el proyecto zombi: qué contiene, plantilla de 7 secciones, ejemplo completo y cómo firmarla sin papeleo eterno.",
  category: "plantillas",
  categoryLabel: "Plantillas",
  publishedAt: "2026-09-11",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "matriz-de-riesgos",
  related: [
    "matriz-de-riesgos",
    "cierre-de-proyecto-checklist",
    "acta-constitucion-proyecto",
    "lecciones-aprendidas-proyecto",
  ],
  seo: {
    title: "Acta de cierre de proyecto: plantilla y ejemplo | Hito",
    description:
      "Acta de cierre de proyecto: qué es, las 7 secciones que contiene, plantilla copiable con ejemplo, quién la firma y cómo evita el proyecto zombi.",
    ogImageAlt: "Plantilla de acta de cierre de proyecto con sus siete secciones.",
  },
  content: {
    eyebrow: "Riesgo y calidad",
    intro: (
      <>
        <strong>En una línea:</strong> el acta de cierre es el documento de una página que certifica
        que el proyecto terminó — qué se entregó, qué se aceptó, qué queda pendiente y qué queda
        fuera — y existe para que el fin del proyecto sea un hecho, no una despedida informal.
      </>
    ),
    sections: [
      {
        heading: "Qué es un acta de cierre (y el problema que resuelve)",
        body: (
          <>
            <p>
              El acta de cierre de proyecto es el documento breve que registra formalmente que
              el proyecto terminó: qué se entregó contra qué se acordó, que el cliente acepta
              el resultado, qué pendientes quedan (y quién los asume) y que las obligaciones de
              ambas partes quedan saldadas. Firmado, cierra el capítulo; sin firmar, el
              proyecto queda técnicamente abierto para siempre.
            </p>
            <p>
              El problema que resuelve tiene nombre: el <strong>proyecto zombi</strong>. Es ese
              trabajo que «ya terminó» pero al que nadie le dio el último beep: el cliente pide
              «un ajustecito» tres meses después y no hay documento que diga que eso es un
              proyecto nuevo con presupuesto propio; el pago final flota porque nadie firmó la
              aceptación; tu equipo sigue atendiendo dudas «del proyecto» porque nadie definió
              que terminó. Sin cierre formal, todos los supuestos quedan a favor de la parte
              con mejor memoria — y nunca es la tuya.
            </p>
            <p>
              El acta de cierre es el espejo del{" "}
              <Link
                to="/blogs/acta-constitucion-proyecto"
                className="underline underline-offset-2"
              >
                acta de constitución
              </Link>
              : aquella abre el proyecto declarando qué es y quién decide; esta lo cierra
              declarando qué fue y quién acepta. Los proyectos que nacen con acta y mueren sin
              ella pierden en la última curva todo lo que disciplinaron en la primera.
            </p>
          </>
        ),
      },
      {
        heading: "Qué contiene: las 7 secciones",
        body: (
          <>
            <p>
              El acta de cierre útil cabe en una página. Siete secciones, ni una más:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Sección</th>
                  <th className="py-2 pr-4 font-semibold">Qué registra</th>
                  <th className="py-2 font-semibold">Qué evita</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">1. Identificación</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Proyecto, cliente, fechas de inicio y cierre, responsable.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    La ambigüedad de «¿qué proyecto era este?».
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">2. Alcance cumplido</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Entregables finales contra el alcance aprobado (incluye cambios aprobados
                    en el camino —{" "}
                    <Link
                      to="/blogs/control-de-cambios-proyecto"
                      className="underline underline-offset-2"
                    >
                      control de cambios
                    </Link>
                    ).
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El «esto nunca lo entregaron» de los recuerdos selectivos.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">3. Hitos cumplidos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Los mojones del plan con su fecha real — la{" "}
                    <Link
                      to="/blogs/hito-vs-entregable"
                      className="underline underline-offset-2"
                    >
                      evidencia de avance
                    </Link>
                    .
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Discutir si el avance fue «real» o «declarado».
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">4. Aceptación</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    La conformidad explícita del cliente con los entregables.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El pago final retenido por «nadie aceptó formalmente».
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">5. Pendientes y soporte</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Qué queda abierto, quién lo asume, con qué presupuesto y hasta cuándo dura
                    el soporte post-entrega.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El soporte infinito gratis — el zombi por excelencia.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">6. Estado económico</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Facturado, cobrado, por facturar. Última factura emitida al cierre.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Descubrir a los 4 meses que falta cobrar un hito.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">7. Lecciones</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Las 3–5{" "}
                    <Link
                      to="/blogs/lecciones-aprendidas-proyecto"
                      className="underline underline-offset-2"
                    >
                      lecciones aprendidas
                    </Link>{" "}
                    del proyecto, en dos líneas cada una.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Volver a pagar el mismo error en el próximo proyecto.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Quién la firma: por el lado del cliente, quien tiene autoridad de aceptación (el
              mismo que firmó el acta de constitución o el sponsor del{" "}
              <Link
                to="/blogs/matriz-de-stakeholders"
                className="underline underline-offset-2"
              >
                mapa de stakeholders
              </Link>
              ); por el tuyo, el líder del proyecto. Si el cliente no firma documentos — hay
              muchos — el correo de conformidad explícita («confirmo que recibo y acepto los
              entregables del proyecto X») cumple la misma función legal y práctica.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo cerrar en 5 pasos",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Recopilar la evidencia (30 min).</strong> Lista de entregables finales,
                hitos con fechas, facturas emitidas y cambios aprobados. Todo esto ya existe —
                el acta no produce información nueva, la consolida. Si tu checklist de{" "}
                <Link
                  to="/blogs/cierre-de-proyecto-checklist"
                  className="underline underline-offset-2"
                >
                  cierre de proyecto
                </Link>{" "}
                está al día, este paso ya está hecho.
              </li>
              <li>
                <strong>Comparar contra el acta de constitución.</strong> Lo prometido contra lo
                entregado, línea por línea. Diferencias esperables: cambios aprobados (se
                anotan con su acta) y diferencias no aprobadas (se resuelven antes de firmar —
                o se anotan como pendientes con dueño).
              </li>
              <li>
                <strong>Redactar el acta (20 min).</strong> Las 7 secciones de la tabla,
                lenguaje plano, sin adjetivos. Los pendientes con nombre, fecha y presupuesto —
                «quedará pendiente» es la frase prohibida del acta de cierre.
              </li>
              <li>
                <strong>Reunión de cierre con el cliente (30 min).</strong> Se recorre el acta,
                se levantan dudas en vivo, se firma (o llega la conformidad por correo). La
                reunión también es el momento natural del último hito de pago — el que quedó
                atado a la aceptación formal en el{" "}
                <Link
                  to="/blogs/anticipos-y-pagos-por-hitos"
                  className="underline underline-offset-2"
                >
                  calendario de pagos
                </Link>
                .
              </li>
              <li>
                <strong>Archivar y comunicar.</strong> El acta junto al resto del expediente
                del proyecto (accesibles durante el plazo de garantía), y una línea al equipo:
                «proyecto X cerrado formalmente el [fecha]; soporte hasta [fecha]». El cierre
                que no se comunica al equipo no libera a nadie.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Ejemplo completo: sitio web para una clínica",
        body: (
          <>
            <p>
              Así se ve el acta mínima de una página, con contenido real de un proyecto de
              agencia de 4 personas:
            </p>
            <p className="rounded-md border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
              <strong>Acta de cierre — Proyecto Web Clínica Vitalis</strong>
              <br />
              Cliente: Clínica Vitalis S.A. · Inicio: 2026-06-15 · Cierre: 2026-09-11 · Líder:
              A. Rossi.
              <br />
              <strong>Alcance entregado:</strong> sitio institucional (7 secciones), portal de
              turnos, panel de contenidos y capacitación al personal. Incluye cambio aprobado
              CP-02 (versión en portugués). Pendiente no aprobado: ninguno.
              <br />
              <strong>Hitos cumplidos:</strong> plan aprobado (17/06), beta funcional
              (24/07), portal de turnos en producción (21/08), entrega final y capacitación
              (11/09).
              <br />
              <strong>Aceptación:</strong> el cliente declara conforme con los entregables
              según criterios del plan y cambia aprobados. — Dr. M. Quirós, 2026-09-11.
              <br />
              <strong>Pendientes:</strong> 2 ajustes menores de contenido (cliente los carga en
              el panel; soporte de dudas hasta 2026-10-11 incluido en contrato; mantenimiento
              mensual opcional desde 2026-11-01, $200/mes).
              <br />
              <strong>Estado económico:</strong> 100% facturado; última factura al hito de
              aceptación, a cobrar a 15 días.
              <br />
              <strong>Lecciones:</strong> el cambio CP-02 debió presupuestarse en el kickoff
              (idiomas); el portal de turnos requirió 20% más horas de estimación — ajustar
              factor en proyectos con integración a sistemas externos.
            </p>
            <p>
              Una página. Toma 20 minutos redactarla, y vale por las tres cosas que hace a la
              vez: libera al equipo, habilita el último cobro y blinda el futuro contra los
              «ajustecitos» eternos. Ese es todo el negocio del acta de cierre.
            </p>
          </>
        ),
      },
      {
        heading: "¿Es obligatoria? El cierre sin papel",
        body: (
          <>
            <p>
              En la gestión de proyectos formal (PMI y similares), el cierre documentado es
              parte del ciclo de vida — sin él, el proyecto no está «cerrado» técnicamente. En
              un equipo de 4 personas con un cliente de barrio, esa formalidad puede sonar a
              aduana. La versión mínima honesta:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Todo proyecto con cliente externo merece acta</strong> — aunque sea de
                media página, aunque la firma sea un «conforme» por correo. Es el documento
                que cobija el último pago y define el fin del soporte.
              </li>
              <li>
                <strong>Los proyectos internos</strong> pueden cerrar con el checklist de
                cierre + una nota de 5 líneas con las lecciones — lo que no se puede es no
                cerrar en absoluto: el proyecto interno sin cierre compite por recursos eternamente
                con proyectos vivos, y esa es la forma más común de sobrecarga invisible (
                <Link
                  to="/blogs/planificacion-de-capacidad"
                  className="underline underline-offset-2"
                >
                  capacidad
                </Link>{" "}
                que nadie reclama).
              </li>
              <li>
                <strong>El cierre es también un ritual de equipo:</strong> celebrar el fin,
                mencionar lo aprendido y liberar formalmente a las personas. Saltárselo quema
                al equipo de a poco — nadie se desconecta de un proyecto que nunca termina de
                morir.
              </li>
            </ul>
            <p>
              Y cuando el cierre se vuelve rutina, se vuelve barato: el acta se redacta en
              minutos porque la evidencia ya vive ordenada junto al proyecto. Si quieres que
              los hitos cumplidos, los entregables y los cambios aprobados queden registrados
              en un archivo local de tu carpeta — sin cuenta ni nube—{" "}
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
              — cierra proyectos con evidencia completa, local-first.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un acta de cierre de proyecto?",
        answer:
          "Es el documento breve que certifica formalmente el fin del proyecto: qué se entregó contra el alcance aprobado, qué hitos se cumplieron, la aceptación explícita del cliente, los pendientes con dueño, el estado económico y las lecciones aprendidas. Es el espejo del acta de constitución: una abre, la otra cierra.",
      },
      {
        question: "¿Qué contiene un acta de cierre?",
        answer:
          "Siete secciones en una página: identificación del proyecto, alcance cumplido (incluidos cambios aprobados), hitos cumplidos con fechas, aceptación del cliente, pendientes y soporte (con responsable y vencimiento), estado económico (facturado y por facturar) y 3–5 lecciones aprendidas.",
      },
      {
        question: "¿Quién firma el acta de cierre?",
        answer:
          "Por el cliente, quien tiene autoridad de aceptación — el mismo sponsor que firmó el acta de constitución. Por el equipo, el líder del proyecto. Si el cliente no firma documentos, un correo de conformidad explícita («confirmo que recibo y acepto los entregables») cumple la misma función.",
      },
      {
        question: "¿Cuál es la diferencia entre acta de cierre e informe final?",
        answer:
          "El informe final narra: cuenta cómo fue el proyecto, con métricas y detalle. El acta de cierre declara y blinda: certifica que terminó, que se aceptó y qué queda pendiente, con valor legal y administrativo. El acta es obligatoria para cerrar; el informe es valioso para aprender y suele alimentar la sección de lecciones del acta.",
      },
      {
        question: "¿Es obligatoria el acta de cierre?",
        answer:
          "En la gestión formal, sí: el proyecto no está cerrado sin cierre documentado. En equipos pequeños, la versión mínima razonable es: acta de una página para todo proyecto con cliente externo (cobija el último pago y define el fin del soporte) y nota de lecciones para los internos. Lo que no es razonable es no cerrar: el proyecto sin cierre compite por recursos para siempre.",
      },
    ],
  },
};
