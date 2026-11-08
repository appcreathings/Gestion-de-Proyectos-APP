import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "alternativa-a-teamwork",
  title: "Alternativas a Teamwork: cuándo la facturación por horas sobra",
  excerpt:
    "Teamwork gana en agencias que facturan horas a clientes. Alternativas reales cuando el motivo de salida es el precio por asiento, un cliente que no necesita acceso, o que no facturas por hora.",
  category: "comparativas",
  categoryLabel: "Comparativas",
  publishedAt: "2026-10-22",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "software-gestion-proyectos",
  related: ["gestion-proyectos-agencias", "alternativa-a-basecamp", "cuanto-cobrar-por-un-proyecto"],
  seo: {
    title: "Alternativas a Teamwork (2026) | Hito",
    description:
      "Alternativas a Teamwork según el motivo de salida: precio por asiento, acceso de clientes que no necesitas, o que no facturas horas a terceros.",
    ogImageAlt: "Alternativas a Teamwork por precio, facturación y control de datos.",
  },
  content: {
    eyebrow: "Comparativas",
    intro: (
      <>
        <strong>En una línea:</strong> si buscas una <strong>alternativa a Teamwork</strong>,
        casi nunca es porque falte para agencias: es porque pagas por facturación de horas y
        acceso de clientes que tu operación no usa, o porque el free se queda corto apenas
        pasas de un puñado de personas. Las <strong>alternativas a Teamwork</strong> —Basecamp,
        Trello, Asana, Hito— resuelven motivos distintos.
      </>
    ),
    sections: [
      {
        heading: "Teamwork no se abandona por débil: se abandona por el enfoque en billables",
        body: (
          <>
            <p>
              Teamwork se construyó para agencias que facturan horas a clientes: time tracking
              integrado, tasas de facturación por persona o proyecto, permisos de cliente
              limitados, plantillas de proyecto reutilizables. Para una agencia de servicios que
              vive de billable hours, es un ajuste natural. El problema aparece cuando el
              negocio no factura así.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>El free se queda corto rápido.</strong> En la foto de 2026, el plan
                gratuito de Teamwork suele limitarse a pocos usuarios y proyectos activos — para
                un estudio de tres personas con varios clientes a la vez, se nota enseguida.
              </li>
              <li>
                <strong>Pagas por facturación que no usas.</strong> Si cobrás por proyecto
                cerrado y no por hora, el motor de time tracking y tasas de facturación de
                Teamwork es presupuesto pagado de más.
              </li>
              <li>
                <strong>El acceso de clientes es una función, no un regalo.</strong> Dar acceso
                limitado a un cliente externo para ver avance suena bien, pero en los planes
                altos — justo donde vive esa función completa.
              </li>
            </ul>
            <p>
              Una <strong>alternativa a Teamwork</strong> tiene que resolver el motivo real de
              salida. El mapa general de categorías está en{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos
              </Link>
              .
            </p>
            <blockquote className="border-l-2 border-border/60 pl-4 italic">
              Los límites del free y en qué plan vive el acceso de cliente completo son una foto
              de 2026. Verifica la página de precios de Teamwork el día que decidas.
            </blockquote>
          </>
        ),
      },
      {
        heading: "Alternativas según el motivo de salida",
        body: (
          <>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              No facturas por hora: el motor de billables sobra
            </h3>
            <p>
              Basecamp es el comparable directo en espíritu — simple, coordinación con clientes,
              sin forzar facturación por hora. Comparativa de funciones y motivo de salida en{" "}
              <Link to="/blogs/alternativa-a-basecamp" className="underline underline-offset-2">
                alternativas a Basecamp
              </Link>
              . Trello, si además quieres kanban visual sin ningún motor de billing.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              El free no alcanza: sales por precio
            </h3>
            <p>
              Asana mantiene un free utilizable para equipos chicos sin forzar facturación —
              detalle en{" "}
              <Link to="/blogs/alternativa-a-asana" className="underline underline-offset-2">
                alternativas a Asana
              </Link>
              . Hito no cobra por asiento en absoluto: el proyecto es una carpeta con JSON.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              El acceso de cliente completo vive en el plan caro
            </h3>
            <p>
              Si lo único que necesitas es que el cliente vea avance sin editar nada, compartir
              un enlace de solo lectura o un informe semanal (como el que describe{" "}
              <Link to="/blogs/informe-de-estado-semanal" className="underline underline-offset-2">
                informe de estado semanal
              </Link>
              ) resuelve el 80% del caso sin pagar el plan alto de ningún SaaS.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Datos locales: sales porque el cliente no puede vivir en un SaaS
            </h3>
            <p>
              OpenProject autoalojado o Hito. Ninguno de los dos replica el time tracking
              integrado de Teamwork — si cobras por hora de verdad, necesitas ese motor en algún
              lugar, propio o de terceros.
            </p>
          </>
        ),
      },
      {
        heading: "Tabla: alternativa a Teamwork según el caso",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Si sales por…</th>
                  <th className="py-2 pr-4 font-semibold">Mira primero</th>
                  <th className="py-2 font-semibold">Cuidado con…</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">No facturas por hora</td>
                  <td className="py-2 pr-4 text-muted-foreground">Basecamp o Trello</td>
                  <td className="py-2 text-muted-foreground">
                    Si algún cliente sí requiere time tracking, revisa antes de migrar
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">El free no alcanza</td>
                  <td className="py-2 pr-4 text-muted-foreground">Asana o Hito</td>
                  <td className="py-2 text-muted-foreground">
                    Asana también cobra por asiento en planes serios
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Acceso de cliente caro</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Informe semanal compartido o enlace de solo lectura
                  </td>
                  <td className="py-2 text-muted-foreground">
                    No reemplaza acceso interactivo si el cliente lo necesita
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Datos que no pueden ir a la nube</td>
                  <td className="py-2 pr-4 text-muted-foreground">OpenProject o Hito</td>
                  <td className="py-2 text-muted-foreground">
                    Pierdes el time tracking y facturación integrados
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Teamwork te sirve y solo comparas</td>
                  <td className="py-2 pr-4 text-muted-foreground">Quédate en Teamwork</td>
                  <td className="py-2 text-muted-foreground">
                    Si facturas por hora a varios clientes, el motor ya está pago y configurado
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Dónde Teamwork sigue ganando",
        body: (
          <>
            <p>
              Hay que decirlo sin truco. Teamwork gana cuando la agencia factura horas a varios
              clientes y necesita que el tiempo registrado se convierta directamente en una
              factura, con permisos de cliente para ver avance sin tocar la configuración
              interna. Gana en plantillas de proyecto reutilizables para servicios repetibles.
            </p>
            <p>
              Si tu modelo de negocio depende de billable hours y el acceso de cliente es un
              requisito contractual, Teamwork no es un error. Es el producto para ese perfil.
              Las <strong>alternativas a Teamwork</strong> de esta página existen para el
              perfil que no factura así.
            </p>
          </>
        ),
      },
      {
        heading: "Dónde encaja Hito (sin venderlo como clon de Teamwork)",
        body: (
          <>
            <p>
              Hito no es la mejor alternativa a Teamwork para todos. No tiene time tracking
              facturable, no tiene tasas de facturación por persona ni portal de cliente. Si eso
              es lo que usabas cada día, Hito te va a parecer incompleto.
            </p>
            <p>
              Encaja si el motivo de salida es que no facturas por hora, o que los datos del
              cliente no pueden vivir en un tenant ajeno. Local-first: carpeta + JSON, sin
              cuenta, sin cobro por asiento. Kanban, SOPs, automatizaciones, sync con GitHub,
              PWA, IA opcional con tu API key. Audiencia 1–15, con clientes externos o sin
              ellos.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo salir sin perder la facturación en curso",
        body: (
          <>
            <p>
              No migres proyectos con horas ya registradas a medio facturar. Cierra esos ciclos
              de facturación en Teamwork primero, y arranca los proyectos nuevos en el destino
              elegido. Mapea plantillas de proyecto recurrentes antes de migrar, no después.
            </p>
            <p>
              Si después de un mes extrañas convertir horas en factura con un clic, nómbralo: el
              motivo de salida probablemente estaba mal diagnosticado y seguís necesitando ese
              motor, propio o de otra herramienta.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Cuánto cuesta Teamwork de verdad?",
        answer:
          "Se cobra por usuario, con un free limitado en proyectos y personas. El time tracking facturable, las tasas por persona y el acceso completo de cliente suelen vivir en planes intermedios o altos. Verifica la página de precios el día que decidas: el vendor ajusta estos límites seguido.",
      },
      {
        question: "¿Cuál es la alternativa a Teamwork más simple?",
        answer:
          "Basecamp, si el problema es que pagas por un motor de facturación que no usas: coordinación simple con clientes, precio plano, sin billables. Trello, si además quieres kanban visual puro.",
      },
      {
        question: "¿Hay alternativa a Teamwork sin cobrar por asiento?",
        answer:
          "Sí: OpenProject Community en tu propio servidor, o Hito (carpeta local, JSON, sin cuenta ni cobro por asiento). Ninguno de los dos reemplaza el time tracking facturable integrado — si cobras por hora, necesitas ese motor en algún lugar.",
      },
      {
        question: "¿Basecamp reemplaza el acceso de cliente de Teamwork?",
        answer:
          "Parcialmente. Basecamp permite invitar clientes a un proyecto con permisos limitados, pero no tiene el motor de facturación por hora ni tasas por persona de Teamwork. Si el cliente solo necesita ver avance, un informe compartido también resuelve el caso sin pagar un plan alto.",
      },
      {
        question: "¿Hito reemplaza a Teamwork?",
        answer:
          "No como clon. Reemplaza el caso “equipo de 1–15, sin facturación por hora integrada, datos en tu disco, kanban y SOPs”. No reemplaza el time tracking facturable ni el portal de cliente. Si eso es lo que usas cada día, Hito no es tu alternativa.",
      },
    ],
  },
};
