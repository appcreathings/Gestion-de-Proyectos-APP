import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "plantilla-plan-de-proyecto",
  title: "Plantilla de plan de proyecto y cómo llenarla",
  excerpt:
    "Un plan de proyecto no es un Gantt de 40 páginas. Qué secciones llenar, en qué orden, y un ejemplo corto que cabe en una página.",
  category: "plantillas",
  categoryLabel: "Plantillas",
  publishedAt: "2027-04-19",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "plantillas-gestion-proyectos",
  related: [
    "plantillas-gestion-proyectos",
    "acta-constitucion-proyecto",
    "fases-de-un-proyecto",
  ],
  seo: {
    title: "Plantilla de plan de proyecto: cómo llenarla | Hito",
    description:
      "Plantilla de plan de proyecto: qué secciones llenar, en qué orden, y un ejemplo de una página. Qué dejar en blanco y cómo se diferencia del acta.",
    ogImageAlt:
      "Plantilla de plan de proyecto con las secciones que sí se llenan y un ejemplo de una página.",
  },
  content: {
    eyebrow: "Plantillas",
    intro: (
      <>
        <strong>En una línea:</strong> una <strong>plantilla de plan de proyecto</strong> no es un
        Gantt de 40 páginas: es una página (a veces dos) que dice qué se entrega, qué no, quién
        decide, cuándo son los hitos y cómo se va a saber que terminó. Se llena después del acta,
        antes de ejecutar, y se deja en blanco todo lo que no cambia una decisión esta semana.
      </>
    ),
    sections: [
      {
        heading: "Un plan de proyecto no es un Gantt de 40 páginas",
        body: (
          <>
            <p>
              El plan responde cómo se ejecuta lo que el acta ya autorizó. Si el documento no
              cabe en una reunión de 20 minutos, no es un plan: es un archivo que nadie va a
              releer. Un equipo de producto de 4, una diseñadora freelance o un sprint de
              agencia necesitan el mismo esqueleto; lo que cambia es el nivel de detalle.
            </p>
            <p>
              Esta plantilla es una de las{" "}
              <Link
                to="/blogs/plantillas-gestion-proyectos"
                className="underline underline-offset-2"
              >
                8 plantillas de gestión de proyectos
              </Link>{" "}
              que un equipo pequeño sí llena. El resto del pack (calidad, adquisiciones,
              comunicaciones de 8 páginas) se absorbe acá en un párrafo, o se salta.
            </p>
          </>
        ),
      },
      {
        heading: "Plan vs acta de constitución",
        body: (
          <>
            <p>
              Se confunden porque ambas hablan de alcance y de dinero. No hacen el mismo trabajo:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                El{" "}
                <Link
                  to="/blogs/acta-constitucion-proyecto"
                  className="underline underline-offset-2"
                >
                  acta de constitución (project charter)
                </Link>{" "}
                autoriza el proyecto y da autoridad a quien lo dirige. Una página, firmada por el
                sponsor, escrita en el{" "}
                <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                  inicio
                </Link>
                .
              </li>
              <li>
                El plan dice cómo se ejecuta: entregables, hitos, roles, riesgos, comunicación,
                criterios de “terminado”. Se escribe en la planificación y se actualiza si el
                alcance cambia de verdad — no cada vez que se mueve una tarea.
              </li>
            </ul>
            <p>
              Si solo tienes tiempo para un documento, escribe el acta. Ejecutar sin autorización
              es más caro que ejecutar con un plan corto. Si tienes los dos, no copies el acta
              dentro del plan: enlázala y baja al detalle operativo.
            </p>
          </>
        ),
      },
      {
        heading: "Las secciones de la plantilla de plan de proyecto",
        body: (
          <>
            <p>
              Nueve bloques. Si no tienes nada que decir en uno, déjalo vacío — un título sin
              contenido es peor que no tenerlo.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Sección</th>
                  <th className="py-2 pr-4 font-semibold">Qué llenar</th>
                  <th className="py-2 font-semibold">Qué no meter</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Propósito</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Por qué existe, en 2–3 frases, con el resultado buscado
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Historia de la empresa ni “visión a 5 años”
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Alcance</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Qué sí entra y, igual de importante, qué no
                  </td>
                  <td className="py-2 text-muted-foreground">
                    “Todo lo que se pueda” — eso no es alcance
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Entregables</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cosas concretas que se pueden aceptar (no actividades)
                  </td>
                  <td className="py-2 text-muted-foreground">
                    La lista de 80 tareas del tablero
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Cronograma de hitos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    4–8 fechas que importan, no cada subtarea
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Un Gantt que nadie mantiene
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Roles</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Quién dirige, quién aprueba, quién ejecuta
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Organigrama de la empresa
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Presupuesto</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Tope, de dónde sale, y qué queda afuera
                  </td>
                  <td className="py-2 text-muted-foreground">
                    12 pestañas de costos si el tope cabe en una línea
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Riesgos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    3–5 amenazas con una acción concreta cada una
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Matriz 5×5 vacía “por si acaso”
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Comunicación</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Dónde se actualiza, con qué frecuencia, a quién
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Matriz de 12 stakeholders
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Criterios de éxito</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cómo se sabrá que terminó, con número o fecha
                  </td>
                  <td className="py-2 text-muted-foreground">
                    “Que quede lindo” o “que el cliente esté feliz”
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "En qué orden llenarla",
        body: (
          <>
            <p>
              El orden importa porque las secciones de abajo dependen de las de arriba. Llenar el
              cronograma antes del alcance es cómo se inventan fechas que no se pueden cumplir.
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                Propósito y criterios de éxito. Si no puedes medir el final, no planifiques el
                medio. Sirve el criterio de{" "}
                <Link
                  to="/blogs/objetivos-proyecto-smart-okr"
                  className="underline underline-offset-2"
                >
                  objetivos SMART
                </Link>
                .
              </li>
              <li>
                Alcance: qué sí, qué no. Es el antídoto al{" "}
                <Link
                  to="/blogs/alcance-de-proyecto-scope-creep"
                  className="underline underline-offset-2"
                >
                  scope creep
                </Link>
                .
              </li>
              <li>Entregables (cosas aceptables) y después hitos (fechas de esas cosas).</li>
              <li>
                Roles. Si hay más de tres personas o un cliente que aprueba, baja esto a una{" "}
                <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                  matriz RACI
                </Link>{" "}
                y deja acá solo el resumen.
              </li>
              <li>
                Presupuesto y 3–5 riesgos con mitigación. No una lista de 20 miedos.
              </li>
              <li>
                Comunicación: un canal, una frecuencia, un destinatario del informe. Un párrafo.
              </li>
            </ol>
            <p>
              Las fechas de los hitos se estiman con lo que ya sabes, no con deseo. Si siempre se
              cortan, usa las técnicas de{" "}
              <Link
                to="/blogs/como-estimar-tiempos-proyecto"
                className="underline underline-offset-2"
              >
                estimar tiempos de un proyecto
              </Link>
              . El{" "}
              <Link
                to="/blogs/plantilla-cronograma-proyecto"
                className="underline underline-offset-2"
              >
                cronograma
              </Link>{" "}
              detallado, si hace falta, vive aparte y apunta a estos hitos — no al revés.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo lleno: rediseño de una landing",
        body: (
          <>
            <p>
              Equipo de producto de 4 (PM, diseño, front, marketing). Tres semanas. Así se ve un
              plan que cabe en una página:
            </p>
            <p className="rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <strong>Propósito.</strong> Subir la conversión visita → prueba de 2,1% a 3,0% a 30
              días del live.
              <br />
              <strong>Alcance.</strong> Nueva landing de precios (desktop + mobile), 3 planes, FAQ,
              CTA a registro. Fuera: blog, checkout, versión en inglés, A/B test.
              <br />
              <strong>Entregables.</strong> Wireframes, copy, implementación, QA, go-live.
              <br />
              <strong>Hitos.</strong> Kickoff (día 1) · diseño aprobado (día 7) · staging (día 14)
              · live (día 21).
              <br />
              <strong>Roles.</strong> PM aprueba alcance. Diseño es R/A de UI. Front es R/A de
              implementación. Marketing: copy y anuncio. Legal es C del copy de planes.
              <br />
              <strong>Presupuesto.</strong> Tiempo interno (~120 h). Cero gasto extra.
              <br />
              <strong>Riesgos.</strong> Legal pide cambios tarde → revisión el día 5. Conversión no
              sube → se mide 30 días y se itera como proyecto aparte (A/B quedó fuera).
              <br />
              <strong>Comunicación.</strong> Update viernes, 15 min, en el canal del proyecto. Sin
              reunión extra.
              <br />
              <strong>Éxito.</strong> Live el día 21, 0 bugs P0, conversión medida a 30 días.
            </p>
            <p>
              Eso es un plan. No hay Gantt, no hay “plan de calidad”, no hay diccionario WBS. Si
              el viernes el diseño no está aprobado, el plan ya te dice qué hito se rompió — no
              hace falta un documento de 40 páginas para verlo.
            </p>
          </>
        ),
      },
      {
        heading: "Qué dejar en blanco",
        body: (
          <>
            <p>
              Dejar secciones vacías no es descuido: es no fingir un proceso que no tienes. En un
              sprint de agencia de diez días, “plan de adquisiciones” y “matriz de interesados”
              están bien vacíos. En un freelance con un solo cliente, RACI se reduce a “tú
              apruebas, yo entrego”.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>No copies nombres de sección PMI si no tienes contenido.</li>
              <li>No desgloses tareas acá: eso es el tablero, no el plan.</li>
              <li>
                No actualices el plan cada vez que se mueve una tarjeta. Actualízalo cuando cambia
                alcance, fecha de un hito o presupuesto.
              </li>
              <li>
                No escribas comunicación si ya hay un canal y un informe semanal: nómbralos, nada
                más.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Errores que matan el plan",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Escribirlo y no volverlo a abrir.</strong> Si a la semana dos nadie lo
                usó para decir que no a un pedido, es un cementerio. Recórtalo o elimínalo.
              </li>
              <li>
                <strong>Confundirlo con el acta.</strong> El plan no autoriza: ejecuta. Sin
                sponsor y sin “ok” inicial, el plan más lindo sigue siendo trabajo sin mandato.
              </li>
              <li>
                <strong>Meter el Gantt adentro.</strong> El cronograma detallado se pudre más
                rápido que el resto. Deja hitos acá; el detalle, aparte.
              </li>
              <li>
                <strong>Criterios de éxito vagos.</strong> “Mejorar la landing” no se puede
                cerrar. “Live el día 21 y conversión medida a 30 días” sí.
              </li>
            </ul>
            <p>
              Un plan de una página en un doc compartido sirve si el equipo lo abre. Hito puede
              dejarlo al lado de las tareas; la herramienta no reemplaza las nueve secciones ni
              el hábito de decir que no con el alcance escrito.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo llenar una plantilla de plan de proyecto",
      steps: [
        {
          name: "Abre las nueve secciones vacías",
          text: "Propósito, alcance, entregables, cronograma de hitos, roles, presupuesto, riesgos, comunicación y criterios de éxito. No agregues más bloques \"por si el template los trae\".",
        },
        {
          name: "Escribe propósito y criterios de éxito primero",
          text: "Dos o tres frases de por qué existe, y cómo se sabrá que terminó (número, fecha o entregable aceptado). Sin esto, el resto es lista de deseos.",
        },
        {
          name: "Recorta el alcance: qué sí y qué no",
          text: "Lista exclusiones explícitas. Si alguien podría asumir que entra y no entra, escríbelo. Esa lista es lo que más tarde te ahorra scope creep.",
        },
        {
          name: "Lista entregables y después hitos",
          text: "Entregables son cosas aceptables (wireframes, staging, go-live), no actividades. Los hitos son 4–8 fechas de esas cosas, no cada subtarea.",
        },
        {
          name: "Asigna roles (o enlaza un RACI)",
          text: "Quién dirige, quién aprueba cada entregable grande, quién ejecuta. Una sola persona aprueba cada cosa. Si hay más de tres personas, baja el detalle a una matriz RACI.",
        },
        {
          name: "Anota presupuesto y 3–5 riesgos",
          text: "Tope de dinero o de horas, y amenazas con una acción concreta cada una. No una matriz vacía ni veinte miedos sin dueño.",
        },
        {
          name: "Cierra comunicación, comparte y congela la v1",
          text: "Un canal, una frecuencia, un destinatario. Compártelo con el equipo y el sponsor antes de ejecutar. A partir de ahí, solo se toca si cambian alcance, hito o presupuesto.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es una plantilla de plan de proyecto?",
        answer:
          "Es un documento corto —idealmente una página— con propósito, alcance, entregables, hitos, roles, presupuesto, riesgos, comunicación y criterios de éxito. Sirve para ejecutar lo que el acta ya autorizó, no para reemplazar el tablero de tareas.",
      },
      {
        question: "¿Cuánto debe medir un plan de proyecto?",
        answer:
          "Una página, dos como techo, en un equipo pequeño. Si no cabe en una reunión de 20 minutos, está demasiado granular: las tareas viven en el tablero, no en el plan.",
      },
      {
        question: "¿En qué se diferencia el plan del acta de constitución?",
        answer:
          "El acta autoriza el proyecto y da autoridad a quien lo dirige; el plan dice cómo se ejecuta. El acta se firma al inicio y casi no se toca; el plan se actualiza si cambian alcance, hitos o presupuesto.",
      },
      {
        question: "¿Hay que llenar todas las secciones?",
        answer:
          "No. Si no hay proveedores, no inventes un plan de adquisiciones. Si hay un solo cliente, comunicación es un párrafo. Un título vacío enseña que documentar es teatro: bórralo.",
      },
      {
        question: "¿El Gantt reemplaza al plan?",
        answer:
          "No. El Gantt (o el cronograma de hitos) cubre fechas y dependencias. El plan cubre además alcance, exclusiones, roles, riesgos y criterios de éxito. Un Gantt sin alcance escrito es un calendario de trabajo que nadie acordó.",
      },
      {
        question: "¿Quién escribe el plan?",
        answer:
          "Quien dirige el proyecto lo redacta; el sponsor lo valida. El equipo aporta alcance, estimaciones y riesgos. Si lo escribe una sola persona en una oficina y el resto lo ve el día del kickoff, suele nacer muerto.",
      },
    ],
  },
};
