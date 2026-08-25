import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "acta-constitucion-proyecto",
  title: "Acta de constitución de proyecto (project charter): plantilla",
  excerpt:
    "El project charter autoriza el proyecto y da autoridad a quien lo dirige. Plantilla corta, qué no meter, y cómo se diferencia del plan.",
  category: "plantillas",
  categoryLabel: "Plantillas",
  publishedAt: "2027-04-26",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "plantillas-gestion-proyectos",
  related: [
    "plantillas-gestion-proyectos",
    "plantilla-plan-de-proyecto",
    "alcance-de-proyecto-scope-creep",
  ],
  seo: {
    title: "Acta de constitución de proyecto (project charter) | Hito",
    description:
      "El acta de constitución de proyecto (project charter) autoriza el trabajo y da autoridad a quien lo dirige. Plantilla de una página y qué no meter.",
    ogImageAlt:
      "Acta de constitución de proyecto (project charter): plantilla corta y diferencia con el plan.",
  },
  content: {
    eyebrow: "Plantillas",
    intro: (
      <>
        <strong>En una línea:</strong> el <strong>acta de constitución de proyecto</strong>{" "}
        (<strong>project charter</strong>) es el documento que autoriza el trabajo y da
        autoridad a quien lo dirige para usar tiempo, dinero y personas. Cabe en una página. No
        es el plan: el acta dice “esto existe y fulano dirige”; el plan dice cómo se ejecuta.
      </>
    ),
    sections: [
      {
        heading: "Qué es un project charter, en lenguaje simple",
        body: (
          <>
            <p>
              PMI define el project charter como el documento que autoriza formalmente el
              proyecto y da al director de proyecto la autoridad para aplicar recursos. En un
              equipo de 4, eso se traduce a algo más simple: alguien con poder (el sponsor) deja
              por escrito que el proyecto existe, para qué, con qué tope, y quién puede decidir
              sobre el día a día.
            </p>
            <p>
              Sin acta, el trabajo arranca igual — y ahí está el problema. A la semana tres
              aparecen dos lecturas distintas del objetivo, el “director” no puede decir que no
              a un pedido, y el presupuesto era un rumor. El acta no evita el conflicto: lo hace
              discutible con un texto, no con recuerdos.
            </p>
            <p>
              Es la primera de las{" "}
              <Link
                to="/blogs/plantillas-gestion-proyectos"
                className="underline underline-offset-2"
              >
                plantillas de gestión de proyectos
              </Link>{" "}
              que sí se usan, y vive en la fase de{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                inicio
              </Link>
              . El resto (plan, WBS, cronograma) viene después, cuando ya hay mandato.
            </p>
          </>
        ),
      },
      {
        heading: "Qué incluye un acta de constitución de proyecto",
        body: (
          <>
            <p>
              Nueve campos. Si uno no aplica, no lo inventes. El acta gana por ser corta y
              firmada, no por parecer un manual.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Campo</th>
                  <th className="py-2 pr-4 font-semibold">Pregunta que responde</th>
                  <th className="py-2 font-semibold">Ejemplo corto</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Justificación</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Por qué ahora, y qué pasa si no se hace?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Soporte pierde 6 h/semana armando PDFs a mano
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Objetivos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Qué resultado, medible, en qué plazo?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Exportar a PDF en un clic, live en 4 semanas
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Alcance alto nivel</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Qué entra y qué queda afuera, sin desglosar tareas?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    PDF de informe; fuera: Word, Excel, marca blanca
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Entregables</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Qué cosas se pueden aceptar al final?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Feature en producción, guía de 1 página, QA
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Hitos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Cuáles son las 3–5 fechas que importan?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Kickoff, prototipo, beta interna, live
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Presupuesto estimado</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Cuál es el tope, aunque sea en horas?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    ~160 h internas; cero gasto extra
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Sponsor y quien dirige</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Quién autoriza, y quién manda el día a día?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Sponsor: head de producto. Dirige: PM del squad
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Restricciones</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Qué no se puede cambiar aunque se quiera?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    No hay contrataciones; hay que usar el stack actual
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Supuestos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Qué estamos dando por cierto para que esto cierre?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Legal revisa el footer del PDF en ≤3 días
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Los objetivos se escriben como resultado, no como actividad. “Trabajar en exportar
              PDF” no es un objetivo; “live en 4 semanas, un clic, 0 P0” sí. Si necesitas el
              formato, usa{" "}
              <Link
                to="/blogs/objetivos-proyecto-smart-okr"
                className="underline underline-offset-2"
              >
                objetivos SMART
              </Link>
              : el acta no pide un ensayo, pide una frase que se pueda verificar.
            </p>
          </>
        ),
      },
      {
        heading: "Acta vs plan: autorización vs ejecución",
        body: (
          <>
            <p>
              El acta y el{" "}
              <Link
                to="/blogs/plantilla-plan-de-proyecto"
                className="underline underline-offset-2"
              >
                plan de proyecto
              </Link>{" "}
              se pisan si los escribes el mismo día con el mismo nivel de detalle. Distínguelos
              así:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Acta = autorización de una página.</strong> Existe el proyecto, hay
                sponsor, hay quien dirige, hay tope, hay alcance alto nivel. Casi no se edita.
                Cambiar el acta es cambiar el mandato.
              </li>
              <li>
                <strong>Plan = cómo se ejecuta.</strong> Entregables desglosados, hitos
                operativos, roles, riesgos con mitigación, comunicación semanal, criterios de
                “terminado”. Se actualiza si el alcance cambia de verdad.
              </li>
            </ul>
            <p>
              El alcance del acta es de alto nivel a propósito. El detalle (y las exclusiones
              finas que frenan el{" "}
              <Link
                to="/blogs/alcance-de-proyecto-scope-creep"
                className="underline underline-offset-2"
              >
                scope creep
              </Link>
              ) va en el plan. Si metes la WBS dentro del acta, nadie la firma: se volvió un
              documento de planificación disfrazado.
            </p>
          </>
        ),
      },
      {
        heading: "Qué no meter en el acta",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Lista de tareas o WBS. Eso es planificación, no autorización.</li>
              <li>Gantt. El acta lleva 3–5 hitos, no dependencias de cada subtarea.</li>
              <li>Matriz RACI completa. Nombra sponsor y quien dirige; el resto va al plan.</li>
              <li>Plan de comunicaciones. El kickoff y un canal bastan para arrancar.</li>
              <li>
                Justificación de 4 párrafos con historia de la empresa. Dos frases: el dolor y
                el costo de no hacerlo.
              </li>
            </ul>
            <p>
              Si el acta supera una página, casi seguro mezclaste plan. Recorta: cada campo en
              1–3 líneas. El sponsor tiene que poder leerla en el teléfono y decir “ok” o “no”.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo lleno: exportar a PDF en un squad de 4",
        body: (
          <>
            <p>
              Producto, diseño, dos de ingeniería. Feature pedido por soporte. Acta que se puede
              pegar en el canal:
            </p>
            <p className="rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <strong>Proyecto.</strong> Exportar informe a PDF.
              <br />
              <strong>Justificación.</strong> Soporte arma el PDF a mano (~6 h/semana). Si no se
              hace, esa carga crece con cada cliente nuevo.
              <br />
              <strong>Objetivo.</strong> Un clic a PDF del informe actual, live en 4 semanas, 0
              bugs P0 en la primera semana.
              <br />
              <strong>Alcance.</strong> PDF del informe que ya existe, con logo y fecha. Fuera:
              Word, Excel, marca blanca, programar envíos.
              <br />
              <strong>Entregables.</strong> Feature en producción, guía de 1 página para
              soporte, QA en staging.
              <br />
              <strong>Hitos.</strong> Kickoff 5-may · prototipo 12-may · beta interna 19-may ·
              live 2-jun.
              <br />
              <strong>Presupuesto.</strong> ~160 h internas. Cero gasto extra.
              <br />
              <strong>Sponsor / dirige.</strong> Head de producto autoriza. PM del squad dirige.
              <br />
              <strong>Restricciones.</strong> Stack actual; sin contrataciones; no se rediseña el
              informe.
              <br />
              <strong>Supuestos.</strong> Legal revisa el footer en ≤3 días hábiles. Soporte
              prueba la beta en 48 h.
            </p>
            <p>
              Una diseñadora freelance puede usar la misma plantilla: el sponsor es el cliente,
              quien dirige eres tú, el presupuesto es el fee, y el “ok” del mail de arranque
              hace de firma. Un sprint de agencia: el brief firmado puede ser el acta si tiene
              estos campos; si no los tiene, no es un brief — es una conversación.
            </p>
          </>
        ),
      },
      {
        heading: "Del acta al kickoff (sin reescribirla)",
        body: (
          <>
            <p>
              El{" "}
              <Link to="/blogs/kickoff-de-proyecto" className="underline underline-offset-2">
                kickoff
              </Link>{" "}
              no reemplaza el acta: la usa. Agenda mínima: leer justificación y alcance, confirmar
              supuestos, nombrar quién aprueba cambios, y arrancar. Si en el kickoff descubres
              que el sponsor no está de acuerdo con las exclusiones, el acta todavía no existe —
              aunque el doc esté en Drive.
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Envía el acta 24 h antes. Nadie debería verla por primera vez en la reunión.</li>
              <li>Pide un “ok” explícito del sponsor (mensaje cuenta; el silencio no).</li>
              <li>En el kickoff, discute supuestos y restricciones, no el color del logo.</li>
              <li>
                Si cambia el mandato (objetivo, tope, exclusiones grandes), actualiza el acta y
                vuelve a pedir el ok. El resto de cambios va al plan.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Si nadie la firma, no es un acta",
        body: (
          <>
            <p>
              Un doc llamado “project charter” sin sponsor y sin ok es un borrador. No da
              autoridad a nadie. En un equipo interno, la firma es un mensaje: “autorizo este
              alcance y este tope; dirige [nombre]”. En un freelance, es el mail que dice “ok,
              arrancamos” sobre esa página, no sobre un hilo de ideas sueltas.
            </p>
            <p>
              Si el sponsor no responde, no empieces “un poquito”. Espera o baja el alcance a un
              spike de 2 días con tope escrito. Arrancar sin mandato es exactamente lo que el
              acta existe para evitar.
            </p>
            <p>
              El acta cabe en un mensaje. Si usas Hito, déjala en el proyecto; si no, un doc de
              una página alcanza. Lo que no alcanza es no tenerla.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo redactar un acta de constitución de proyecto",
      steps: [
        {
          name: "Escribe la justificación en dos frases",
          text: "El dolor actual y el costo de no hacer nada. Si no puedes decir qué pasa si no se hace, todavía no hay proyecto: hay una idea.",
        },
        {
          name: "Baja el objetivo a algo verificable",
          text: "Resultado + plazo (+ métrica si existe). \"Live en 4 semanas, un clic, 0 P0\" se puede aceptar. \"Mejorar el informe\" no.",
        },
        {
          name: "Define alcance alto nivel y exclusiones",
          text: "Qué entra y qué queda afuera, sin lista de tareas. Las exclusiones son lo que más tarde evita que el charter se convierta en un cheque en blanco.",
        },
        {
          name: "Lista entregables, 3–5 hitos y un tope de presupuesto",
          text: "Entregables aceptables, fechas que importan, y dinero u horas. El detalle de tareas y el Gantt no van acá.",
        },
        {
          name: "Nombra sponsor y quien dirige",
          text: "Una persona autoriza (sponsor); una persona manda el día a día. Dos sponsors es lo mismo que cero. Quien dirige necesita ese nombre por escrito para poder decir que no.",
        },
        {
          name: "Anota restricciones y supuestos",
          text: "Lo que no se puede cambiar (stack, headcount, fecha impuesta) y lo que das por cierto (tiempos de revisión, disponibilidad). Si un supuesto falla, el acta se revisa.",
        },
        {
          name: "Pide el ok y úsala en el kickoff",
          text: "Un mensaje explícito del sponsor cuenta como firma. Envía el acta antes del kickoff, léela ahí, y no reescribas el plan encima. Sin ok, no arranques.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es un acta de constitución de proyecto o project charter?",
        answer:
          "Es el documento que autoriza formalmente el proyecto y da autoridad a quien lo dirige para usar recursos. En la práctica: una página con justificación, objetivos, alcance alto nivel, entregables, hitos, presupuesto, sponsor, restricciones y supuestos.",
      },
      {
        question: "¿Quién firma el acta?",
        answer:
          "El sponsor: quien tiene poder de autorizar presupuesto y prioridad. Quien dirige el proyecto la redacta, pero no se “autoautoriza”. En un freelance, el cliente es el sponsor; un “ok, arrancamos” sobre el texto cuenta como firma.",
      },
      {
        question: "¿En qué se diferencia del plan de proyecto?",
        answer:
          "El acta autoriza (mandato de una página); el plan dice cómo se ejecuta (entregables, roles, riesgos, comunicación). El acta casi no se edita; el plan se actualiza si cambian alcance, hitos o presupuesto.",
      },
      {
        question: "¿Hace falta un acta en un proyecto interno de dos semanas?",
        answer:
          "Sí, en versión mínima: por qué, qué entra y qué no, quién decide, tope de horas, fecha de live. Sin eso, un “spike” de dos semanas se convierte en un frente eterno porque nadie autorizó el cierre.",
      },
      {
        question: "¿Qué pasa si el sponsor no responde?",
        answer:
          "No arranques el proyecto completo. Espera el ok o recorta a un spike de 1–2 días con tope escrito. Un silencio no es autorización, y ejecutar sin mandato deja a quien dirige sin poder para rechazar pedidos.",
      },
      {
        question: "¿El kickoff reemplaza al acta?",
        answer:
          "No. El kickoff es la reunión que usa el acta. Si el contenido no está escrito antes, el kickoff se vuelve una lluvia de ideas y cada persona se lleva una versión distinta de lo autorizado.",
      },
    ],
  },
};
