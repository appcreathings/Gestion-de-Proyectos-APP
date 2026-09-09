import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "hitos-en-construccion",
  title: "Hitos en construcción: los 10 que toda obra debería marcar",
  excerpt:
    "Los hitos en construcción que toda obra debería marcar: permiso aprobado, movimiento de tierras, cimentación, estructura, cierre de techo, inspección y acta de recepción, con criterio de cumplido verificable.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-04",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "hito-project-gestion-por-hitos",
  related: [
    "hito-project-gestion-por-hitos",
    "hitos-de-un-proyecto-ejemplos",
    "cronograma-de-hitos",
  ],
  seo: {
    title: "Hitos en construcción: los 10 que toda obra marca | Hito",
    description:
      "Hitos en construcción: los 10 mojones de una obra (permiso, cimentación, estructura, cierre de techo, entrega) y cómo llevarlos sin software enterprise.",
    ogImageAlt: "Hitos de una obra: permiso, cimentación, estructura y entrega.",
  },
  content: {
    eyebrow: "Hitos en obra",
    intro: (
      <>
        <strong>En una línea:</strong> los hitos en construcción son los puntos de una obra donde
        el avance se verifica con los ojos —el permiso aprobado, la cimentación, la estructura, el
        cierre de techo, la entrega— y marcarlos en un cronograma simple vale más que cualquier
        software enterprise que nadie va a abrir parado sobre el hormigón.
      </>
    ),
    sections: [
      {
        heading: "Por qué la construcción ya es gestión por hitos",
        body: (
          <>
            <p>
              Si trabajas en obra, llevas décadas gestionando por hitos aunque nadie lo llame así:
              la obra se paga contra avance verificado, se inspecciona por etapas y se entrega
              contra un acta. Aclaración de vocabulario: aquí hablamos del hito como mojón del
              proyecto —un punto de control con fecha y criterio de cumplido—, no del hito como
              monumento.
            </p>
            <p>
              El avance de una obra se verifica con los ojos. La cimentación está vaciada o no lo
              está; el techo cierra o no cierra; la instalación eléctrica está empotrada o sigue
              expuesta. Por eso «avancé un 70 %» no significa nada en construcción, y en cambio
              «el viernes firmamos cierre de techo» lo significa todo: es verificable, compromete
              a los gremios y dispara el siguiente pago.
            </p>
            <p>
              Lo que suele faltar no es disciplina sino visibilidad: el maestro mayor lleva los
              hitos en la cabeza, el cliente pregunta por WhatsApp y el pago se aprueba de
              memoria. Un cronograma de hitos escrito y compartido convierte esa informalidad en
              un plan que todos leen igual, y es la base de la{" "}
              <Link
                to="/blogs/hito-project-gestion-por-hitos"
                className="underline underline-offset-2"
              >
                gestión de proyectos por hitos
              </Link>
              : pocos mojones, criterio verificable y un validador por cada uno.
            </p>
          </>
        ),
      },
      {
        heading: "Los 10 hitos típicos de una obra",
        body: (
          <>
            <p>
              Estos son los mojones que aparecen en casi toda obra medianamente formal. Lo
              importante no es el nombre sino la tercera columna: si el criterio de cumplido no se
              puede verificar en una visita, no es un hito.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Fase</th>
                  <th className="py-2 pr-4 font-semibold">Hito</th>
                  <th className="py-2 font-semibold">Criterio de cumplido</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Preconstrucción</td>
                  <td className="py-2 pr-4 text-muted-foreground">Permiso de obra aprobado</td>
                  <td className="py-2 text-muted-foreground">
                    Resolución publicada; se puede iniciar el movimiento de tierras.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Preparación</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Movimiento de tierras terminado
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Plataforma nivelada y replanteo verificado.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Estructura</td>
                  <td className="py-2 pr-4 text-muted-foreground">Cimentación terminada</td>
                  <td className="py-2 text-muted-foreground">
                    Zapatas y cadenas curadas; probetas de hormigón conforme.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Estructura</td>
                  <td className="py-2 pr-4 text-muted-foreground">Estructura en pie</td>
                  <td className="py-2 text-muted-foreground">
                    Losa superior vaciada; plomos y niveles verificados.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Estructura</td>
                  <td className="py-2 pr-4 text-muted-foreground">Cierre de techo</td>
                  <td className="py-2 text-muted-foreground">
                    Obra cerrada a agua; los interiores trabajan sin depender del clima.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Instalaciones</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Instalaciones gruesas terminadas
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Cañerías, electricidad y gas empotrados antes de revoques.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Acabados</td>
                  <td className="py-2 pr-4 text-muted-foreground">Acabados instalados</td>
                  <td className="py-2 text-muted-foreground">
                    Revoques, pisos, sanitarios y carpinterías colocados.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Legal</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Inspección municipal aprobada
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Acta de inspección sin observaciones.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Entrega</td>
                  <td className="py-2 pr-4 text-muted-foreground">Entrega al cliente</td>
                  <td className="py-2 text-muted-foreground">
                    Recorrido final, llaves, manuales y garantías entregados.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Cierre</td>
                  <td className="py-2 pr-4 text-muted-foreground">Acta de recepción firmada</td>
                  <td className="py-2 text-muted-foreground">
                    El cliente firma conformidad; arranca el período de garantía.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Nota que cada hito cierra una discusión: nadie discute si la estructura «está más o
              menos en pie». Ese carácter binario es lo que permite que el hito funcione como
              punto de control y de cobro a la vez. Para ver el mismo patrón en otros rubros,
              mira estos{" "}
              <Link
                to="/blogs/hitos-de-un-proyecto-ejemplos"
                className="underline underline-offset-2"
              >
                ejemplos de hitos de un proyecto
              </Link>
              , que cubren otros rubros con la misma lógica.
            </p>
          </>
        ),
      },
      {
        heading: "Hitos de pago vs hitos técnicos: no los mezcles",
        body: (
          <>
            <p>
              En una obra conviven dos familias de hitos y confundirlas es la receta clásica del
              conflicto con el cliente. El hito técnico verifica el estado físico de la obra
              —«estructura en pie: losa superior vaciada y plomos conforme»—. El hito de pago
              activa un cobro del contrato —«factura 3: 25 % contra cimentación aprobada»—. Uno
              pertenece al dueño de obra; el otro, a la administración.
            </p>
            <p>Tres reglas para que convivan sin romper la relación con el cliente:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Cada hito de pago debe apoyarse en un hito técnico: se cobra contra algo que se
                puede mirar en una visita, no contra un porcentaje que nadie puede auditar.
              </li>
              <li>
                No conviertas cada pago en hito: si todo es hito, nada es hito. Entre 5 y 10
                mojones por obra alcanzan para controlar y cobrar.
              </li>
              <li>
                Publica los hitos de pago con la misma visibilidad que los técnicos: el cliente
                que ve el avance de cerca no discute la factura.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Cómo llevar los hitos sin software enterprise",
        body: (
          <>
            <p>
              Nadie abre un planificador de recursos en plena obra. Lo que funciona es un
              cronograma de hitos simple —cómo armarlo está en esta guía del{" "}
              <Link to="/blogs/cronograma-de-hitos" className="underline underline-offset-2">
                cronograma de hitos
              </Link>
              —, vivo en una carpeta que todo el equipo pueda abrir desde el celular. El resto es
              convención:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Un solo documento de hitos</strong> con fecha, criterio de cumplido y
                responsable de validación. Si el criterio no cabe en una frase, no está claro.
              </li>
              <li>
                <strong>Un dueño de obra.</strong> Una sola persona valida si el hito se cumplió.
                El comité de hitos no existe.
              </li>
              <li>
                <strong>Fotos como evidencia.</strong> Cada hito cerrado se documenta con tres
                fotos con fecha: tu defensa ante el cliente y la inspección.
              </li>
              <li>
                <strong>Revisión semanal de 15 minutos.</strong> Qué hitos cambian de mes y qué
                gremio se ve afectado. La obra se gestiona mirando, no reuniéndose.
              </li>
            </ol>
            <p>
              El mismo patrón sirve fuera del ladrillo: cualquier trabajo por etapas con
              validación externa —los{" "}
              <Link
                to="/blogs/hito-para-estudio-juridico"
                className="underline underline-offset-2"
              >
                estudios jurídicos lo aplican a expedientes
              </Link>
              , por ejemplo— funciona igual: pocos hitos, criterio verificable, un validador y
              evidencia guardada junto al trabajo.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo: cronograma de hitos de una casa en 6 meses",
        body: (
          <>
            <p>
              Una casa de medianía, equipo pequeño, seis meses. Fíjate en el principio: cada mes
              tiene un hito dominante. Si a mitad de obra aparecen dos meses sin ningún mojón
              cerca, el proyecto se está durmiendo.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Mes</th>
                  <th className="py-2 font-semibold">Hito dominante y su verificación</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Mes 1</td>
                  <td className="py-2 text-muted-foreground">
                    Permiso aprobado y movimiento de tierras terminado: resolución publicada,
                    plataforma nivelada.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Mes 2</td>
                  <td className="py-2 text-muted-foreground">
                    Cimentación terminada: zapatas y cadenas curadas, probetas conforme.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Mes 3</td>
                  <td className="py-2 text-muted-foreground">
                    Estructura en pie: losa superior vaciada, plomo y nivel verificados.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Mes 4</td>
                  <td className="py-2 text-muted-foreground">
                    Cierre de techo e instalaciones gruesas: obra seca a agua, cañerías empotradas.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Mes 5</td>
                  <td className="py-2 text-muted-foreground">
                    Acabados instalados: pisos, sanitarios y carpinterías colocados.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Mes 6</td>
                  <td className="py-2 text-muted-foreground">
                    Inspección, entrega y acta de recepción firmada por el cliente.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Si quieres llevar los hitos de tu obra en una herramienta que vive en tu carpeta
              —JSON local, sin cuenta, sin asientos, con procesos y checklists junto al trabajo—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              está pensada para equipos de 1 a 15 personas.
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
              — marca los hitos de tu obra con criterio verificable, local-first, sin nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un hito en construcción?",
        answer:
          "Es un punto de control de la obra que se cumple o no se cumple y que se puede verificar físicamente: el permiso aprobado, la cimentación terminada, el cierre de techo, la entrega. A diferencia de una tarea, el hito no tiene duración: es el momento en que algo deja de estar pendiente y se vuelve verificable, y suele activar inspecciones o pagos.",
      },
      {
        question: "¿Cuáles son los hitos de una obra?",
        answer:
          "Los diez más comunes: permiso de obra aprobado, movimiento de tierras terminado, cimentación terminada, estructura en pie, cierre de techo, instalaciones gruesas terminadas, acabados instalados, inspección municipal aprobada, entrega al cliente y acta de recepción firmada. Cada obra agrega o quita según su escala, pero el criterio de cumplido verificable no se negocia.",
      },
      {
        question: "¿Qué es el hito de cierre de techo?",
        answer:
          "Es el momento en que la obra queda cerrada a agua: cubierta terminada, ventanales colocados y lluvia fuera. Es de los hitos más celebrados porque cambia la fase: desde ahí trabajan los gremios de interiores sin depender del clima, y en muchos contratos activa un pago de avance y el ajuste de la póliza.",
      },
      {
        question: "¿Cómo se relacionan los hitos con los pagos de avance?",
        answer:
          "Los pagos de avance se anclan a hitos técnicos verificables: anticipo contra movilización, un porcentaje contra cimentación, otro contra cierre de techo y el saldo contra acta de recepción. La regla sana es cobrar contra algo que se puede mirar en una visita, nunca contra porcentajes subjetivos de avance.",
      },
      {
        question: "¿Qué herramienta sirve para llevar los hitos de una obra?",
        answer:
          "Alcanza con un cronograma de hitos simple y compartido: fecha, criterio de cumplido, responsable de validación y evidencia fotográfica. Un documento en carpeta compartida funciona; una herramienta local-first con procesos y checklists lo hace sostenible semana a semana. Para un equipo de obra de 1 a 15 personas no hace falta un planificador enterprise.",
      },
    ],
  },
};
