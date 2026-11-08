import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "procedimiento-operativo-estandarizado-sop",
  title: "Procedimiento operativo estandarizado (SOP): qué es, estructura y ejemplo",
  excerpt:
    "Un SOP documenta cómo se hace una tarea para que el resultado no dependa de quién la haga: qué es, diferencias con manual y checklist, estructura, ejemplo completo y cuándo no vale la pena escribir uno.",
  category: "procesos",
  categoryLabel: "Procesos",
  publishedAt: "2026-10-23",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "manual-de-procesos-y-procedimientos",
  related: [
    "manual-de-procesos-y-procedimientos",
    "como-documentar-procesos-equipos",
    "plantilla-para-documentar-procesos",
    "tareas-recurrentes",
  ],
  seo: {
    title: "Procedimiento operativo estandarizado (SOP): ejemplo | Hito",
    description:
      "Procedimiento operativo estandarizado (SOP): qué es, diferencia con manual y checklist, estructura de 8 secciones, ejemplo completo y errores que lo vuelven inútil.",
    ogImageAlt: "Estructura de un SOP con propósito, alcance, pasos y registros.",
  },
  content: {
    eyebrow: "Documentación de procesos",
    intro: (
      <>
        <strong>En una línea:</strong> un procedimiento operativo estandarizado (SOP, por sus
        siglas en inglés) es la descripción escrita, paso a paso, de cómo se ejecuta una tarea
        concreta para que el resultado sea el mismo sin importar quién la haga.
      </>
    ),
    sections: [
      {
        heading: "Qué es un SOP",
        body: (
          <>
            <p>
              SOP viene de <em>Standard Operating Procedure</em>; en español se dice
              «procedimiento operativo estandarizado» (o «normalizado», o simplemente
              «procedimiento operativo»). Es un documento corto que responde a tres preguntas:
              qué se hace, en qué orden y quién lo hace. Su valor no está en la formalidad sino
              en que convierte conocimiento tácito — lo que «sabe» la persona que lleva años en
              el puesto — en algo que puede leer otra persona.
            </p>
            <p>
              Nacieron en industrias donde el error cuesta caro (manufactura, salud, alimentos,
              laboratorios), pero sirven igual en una agencia, un estudio contable o una tienda:
              donde una tarea se repite y el error se paga en tiempo, dinero o clientes.
            </p>
          </>
        ),
      },
      {
        heading: "SOP, manual, checklist e instrucción: no son lo mismo",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Documento</th>
                  <th className="py-2 pr-4 font-semibold">Qué es</th>
                  <th className="py-2 font-semibold">Úsalo cuando</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">SOP</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cómo se ejecuta una tarea, con pasos y responsables.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Hay que enseñar o estandarizar una tarea repetida.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Checklist</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Lista para verificar que nada se olvidó.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El equipo ya sabe hacer la tarea y solo falla por descuido.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Instrucción de trabajo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Detalle de un paso en una herramienta concreta.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Un paso del SOP es difícil de ejecutar sin capturas o campos exactos.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Manual de procesos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El conjunto de procesos y SOPs de la organización.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Quieres ver cómo opera todo el negocio. Ver{" "}
                    <Link
                      to="/blogs/manual-de-procesos-y-procedimientos"
                      className="underline underline-offset-2"
                    >
                      manual de procesos y procedimientos
                    </Link>
                    .
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Un buen sistema usa los tres: el SOP enseña la tarea, el checklist la verifica en
              cada ejecución y la instrucción de trabajo aclara el paso que se complica.
            </p>
          </>
        ),
      },
      {
        heading: "Estructura de un SOP en 8 secciones",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Título, código y versión.</strong> Para encontrarlo y saber si es el
                vigente.
              </li>
              <li>
                <strong>Propósito.</strong> Una frase: por qué existe este SOP.
              </li>
              <li>
                <strong>Alcance.</strong> Cuándo aplica y cuándo no (esto último evita
                aplicarlo donde no corresponde).
              </li>
              <li>
                <strong>Responsables.</strong> Quién ejecuta, quién revisa y quién aprueba.
              </li>
              <li>
                <strong>Materiales y accesos.</strong> Qué hay que tener a mano antes de
                empezar.
              </li>
              <li>
                <strong>Pasos.</strong> Numerados, cada uno con verbo en imperativo. Una acción
                por paso.
              </li>
              <li>
                <strong>Controles y registros.</strong> Qué se verifica y qué evidencia queda
                (un formulario, un correo, un estado en el tablero).
              </li>
              <li>
                <strong>Historial de cambios.</strong> Fecha, qué cambió, quién lo aprobó.
              </li>
            </ol>
            <p>
              Con la ficha de{" "}
              <Link
                to="/blogs/plantilla-para-documentar-procesos"
                className="underline underline-offset-2"
              >
                plantilla para documentar procesos
              </Link>{" "}
              tienes estos campos listos para copiar.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo: SOP de facturación mensual",
        body: (
          <>
            <p className="rounded-md border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
              <strong>SOP ADM-02 · Facturación mensual · v2.0</strong>
              <br />
              <strong>Propósito:</strong> emitir todas las facturas del mes sin omisiones ni
              duplicados.
              <br />
              <strong>Alcance:</strong> clientes con contrato recurrente. No aplica a proyectos
              con facturación por hitos.
              <br />
              <strong>Responsables:</strong> ejecuta Administración; revisa Dirección.
              <br />
              <strong>Pasos:</strong>
              <br />
              1. Exportar el registro de horas del mes cerrado (día 1 hábil).
              <br />
              2. Cruzar horas con el contrato de cada cliente.
              <br />
              3. Preparar el borrador de cada factura y marcar excepciones.
              <br />
              4. Enviar los borradores a Dirección para revisión (día 2 hábil).
              <br />
              5. Emitir las facturas aprobadas y enviarlas al cliente.
              <br />
              6. Registrar fecha de emisión y vencimiento en el control de cobranza.
              <br />
              <strong>Controles y registros:</strong> total facturado igual a horas × tarifa
              pactada; copia de cada factura en la carpeta del cliente.
              <br />
              <strong>Historial:</strong> v2.0 (2026-10-23) — se añade el cruce con contrato.
            </p>
            <p>
              Son seis pasos y una página. Cada paso se puede convertir en un elemento de
              checklist para ejecutarlo mes a mes; y si el proceso se repite cada mes, es el
              caso clásico de{" "}
              <Link to="/blogs/tareas-recurrentes" className="underline underline-offset-2">
                tarea recurrente
              </Link>{" "}
              con checklist de plantilla. El insumo del paso 1 sale de un buen{" "}
              <Link to="/blogs/registro-de-horas" className="underline underline-offset-2">
                registro de horas
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Errores que vuelven inútil un SOP",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Describir el ideal y no la realidad.</strong> Si el SOP dice una cosa y
                el equipo hace otra, nadie lo consulta. Escribe lo que de verdad se hace, y
                solo después mejóralo.
              </li>
              <li>
                <strong>Pasos con varias acciones.</strong> «Revisar y enviar el informe» son
                dos pasos; mezclarlos esconde dónde falla.
              </li>
              <li>
                <strong>Sin responsable.</strong> «Se envía la factura» no dice quién. Pon un
                nombre o un rol.
              </li>
              <li>
                <strong>Lenguaje de manual universitario.</strong> Frases cortas, verbo
                primero. Si hace falta leerlo dos veces, está mal escrito.
              </li>
              <li>
                <strong>Nunca se prueba.</strong> Pide a alguien que no conoce la tarea que la
                ejecute con el SOP. Cada pregunta que haga es un hueco del documento.
              </li>
              <li>
                <strong>No se revisa.</strong> Un SOP de hace tres años describe herramientas
                que ya no usan. Fecha de revisión y dueño, siempre.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Cuándo no escribir un SOP",
        body: (
          <>
            <p>
              No todo merece un SOP. No lo escribas para tareas que ocurren una vez al año y
              cambian cada vez, para decisiones que requieren criterio (ahí sirve un criterio
              con ejemplos, no un paso a paso) ni para cosas que nadie ha logrado hacer bien
              todavía — primero aprende a hacerlo, después documéntalo. Y no empieces por la
              tarea más aburrida del índice: empieza por la que más errores cuesta o la que solo
              sabe hacer una persona.
            </p>
            <p>
              Para ligar cada SOP a las tareas y proyectos donde se usa, con archivos en tu
              propia carpeta y sin cuenta,{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              convierte tus procedimientos en checklists reutilizables.
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
              — SOPs que se ejecutan, local-first.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un procedimiento operativo estandarizado?",
        answer:
          "Es un documento que describe paso a paso cómo se ejecuta una tarea concreta, quién la hace y qué se verifica, para que el resultado sea consistente sin importar quién la realice. Se conoce por sus siglas en inglés, SOP.",
      },
      {
        question: "¿Qué diferencia hay entre un SOP y un checklist?",
        answer:
          "El SOP explica cómo se hace la tarea; el checklist solo verifica que nada se olvidó. Se usa el SOP para enseñar o estandarizar, y el checklist cuando el equipo ya conoce la tarea y necesita no omitir pasos.",
      },
      {
        question: "¿Qué debe incluir un SOP?",
        answer:
          "Título con código y versión, propósito, alcance, responsables, materiales y accesos, pasos numerados, controles y registros, e historial de cambios.",
      },
      {
        question: "¿Cuántos pasos debe tener un SOP?",
        answer:
          "No hay un número fijo, pero si supera unos 10–12 pasos conviene dividirlo en dos procedimientos o mover los detalles de herramienta a instrucciones de trabajo aparte. Un SOP útil cabe en una o dos páginas.",
      },
      {
        question: "¿Cada cuánto se actualiza un SOP?",
        answer:
          "Al menos cada 6–12 meses y cada vez que cambie una herramienta o el proceso falle. La fecha de próxima revisión y el responsable deben estar escritos en el propio SOP.",
      },
    ],
  },
};
