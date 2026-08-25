import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "herramientas-gestion-proyectos-gratis",
  title: "Herramientas gratis de gestión de proyectos (con límites reales)",
  excerpt:
    "“Gratis” casi nunca es gratis de verdad. Comparativa honesta de herramientas de gestión de proyectos gratis: qué incluye el plan free, dónde te empujan a pagar, y cuándo conviene local-first.",
  category: "plantillas",
  categoryLabel: "Plantillas",
  publishedAt: "2027-05-17",
  readingTime: "11 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "plantillas-gestion-proyectos",
  related: [
    "plantillas-gestion-proyectos",
    "hito-vs-trello",
    "alternativas-a-notion",
    "hito-vs-clickup",
  ],
  seo: {
    title: "Herramientas gratis de gestión de proyectos | Hito",
    description:
      "Herramientas gratis de gestión de proyectos con límites reales: Trello, Asana, ClickUp, Jira, Notion, OpenProject, Excel y local-first.",
    ogImageAlt:
      "Comparativa de herramientas gratis de gestión de proyectos y los límites del plan free.",
  },
  content: {
    eyebrow: "Plantillas",
    intro: (
      <>
        <strong>En una línea:</strong> las <strong>herramientas gratis de gestión de proyectos</strong>{" "}
        casi nunca son gratis de verdad: el plan free cubre el tablero chico y te empuja a pagar
        cuando aparecen usuarios, tableros, storage o historial. Esta comparativa nombra esos
        techos (Trello, Asana, ClickUp, Jira, Notion, OpenProject, Excel/Sheets y una opción
        local-first), no un ranking inventado.
      </>
    ),
    sections: [
      {
        heading: "“Gratis” casi nunca es gratis de verdad",
        body: (
          <>
            <p>
              Los listicles de “mejores tools 2026” suelen abrir con el producto de quien publica.
              El dato que falta es el mismo en todos: qué se acaba primero en el plan free. No es
              el logo. Es tableros, asientos, megas o bloques.
            </p>
            <p>
              Tres modelos se mezclan bajo la misma palabra:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Freemium cloud:</strong> usas el servidor de otro. El free es un gancho
                (Trello, Asana, ClickUp, Jira Cloud, Notion).
              </li>
              <li>
                <strong>Open source autoalojado:</strong> el software no se cobra; pagas servidor,
                tiempo y mantenimiento (OpenProject Community).
              </li>
              <li>
                <strong>Local-first / hoja de cálculo:</strong> no hay plan que vencer, pero hay
                techos de colaboración o de flujo. Excel/Sheets y apps que viven en tu disco.
              </li>
            </ul>
            <p>
              Los límites de abajo son una foto de 2026. Los vendors los mueven: Asana llegó a
              ofrecer 10–15 usuarios en free y después recortó a 2. Trata cada cifra como techo
              actual, no como contrato eterno. Si un límite es el motivo de elegir, verifica la
              página de precios el día que decidas.
            </p>
          </>
        ),
      },
      {
        heading: "Tabla: herramientas gratis de gestión de proyectos y sus techos",
        body: (
          <>
            <p>
              Ideal para, techo del plan gratis, y dónde viven los datos. Sin puntajes de
              reseña:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Herramienta</th>
                  <th className="py-2 pr-4 font-semibold">Ideal para</th>
                  <th className="py-2 pr-4 font-semibold">Límite del plan gratis</th>
                  <th className="py-2 font-semibold">Datos dónde viven</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Trello</td>
                  <td className="py-2 pr-4 text-muted-foreground">Kanban simple, un equipo chico</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    10 tableros y 10 colaboradores por workspace; adjuntos 10 MB; ~250
                    automatizaciones/mes
                  </td>
                  <td className="py-2 text-muted-foreground">Nube Atlassian</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Asana</td>
                  <td className="py-2 pr-4 text-muted-foreground">Listas y tareas entre 2 personas</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    2 usuarios en 2026 (antes 10–15 según el año); sin dependencias ni
                    cronograma en free
                  </td>
                  <td className="py-2 text-muted-foreground">Nube Asana</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">ClickUp</td>
                  <td className="py-2 pr-4 text-muted-foreground">Probar una suite con muchas vistas</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ~60 MB de storage, 5 spaces; Gantt y campos custom recortados; IA de pago
                  </td>
                  <td className="py-2 text-muted-foreground">Nube ClickUp</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Jira Cloud</td>
                  <td className="py-2 pr-4 text-muted-foreground">Issues y sprints, equipo ≤ 10</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    10 usuarios; 2 GB; el usuario 11 dispara plan pago
                  </td>
                  <td className="py-2 text-muted-foreground">Nube Atlassian</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Notion</td>
                  <td className="py-2 pr-4 text-muted-foreground">Wiki + tareas, uso individual</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Bloques ilimitados si hay 1 miembro; ~1.000 bloques con 2+; 10 invitados; 5
                    MB por archivo
                  </td>
                  <td className="py-2 text-muted-foreground">Nube Notion</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">OpenProject</td>
                  <td className="py-2 pr-4 text-muted-foreground">Gantt clásico, autoalojado</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Community gratis en tu servidor; el cloud y el Enterprise se pagan
                  </td>
                  <td className="py-2 text-muted-foreground">Tu servidor (o su cloud)</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Excel / Sheets</td>
                  <td className="py-2 pr-4 text-muted-foreground">Un dueño, listas y presupuesto</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Sheets es gratis con cuenta Google; Excel de escritorio suele ir con 365 de
                    pago
                  </td>
                  <td className="py-2 text-muted-foreground">Disco, Drive o OneDrive</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Hito</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipo chico que quiere local-first y checklists
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Gratis, sin techo de tableros ni storage; no hay collab en tiempo real en la
                    nube ni ecosistema mobile-first
                  </td>
                  <td className="py-2 text-muted-foreground">Tu equipo (archivos locales)</td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Suites cloud: Trello, Asana, ClickUp y Jira",
        body: (
          <>
            <p>
              <strong>Trello</strong> sigue siendo el kanban más fácil de enseñar. El free te deja
              tarjetas ilimitadas, pero el workspace se acaba en 10 tableros y 10 colaboradores.
              Un estudio con 6 clientes y un tablero de operaciones llega al techo sin ser
              “grande”. Comparativa más larga en{" "}
              <Link to="/blogs/hito-vs-trello" className="underline underline-offset-2">
                Hito vs Trello
              </Link>
              : Trello gana en collab en tiempo real e integraciones; el free no es un plan para
              portafolio.
            </p>
            <p>
              <strong>Asana</strong> recortó el free hasta dejarlo casi personal: 2 usuarios en
              2026. Cronograma, dependencias y campos custom viven en los planes pagos. Si el
              artículo de 2022 que encontraste dice “hasta 15”, está desactualizado. Para un dúo
              que comparte listas, alcanza; para un equipo de 5, el free es un trial disfrazado.
            </p>
            <p>
              <strong>ClickUp</strong> mete muchas vistas en el “Free Forever”, y el storage de ~60
              MB es el empujón real: adjuntos, capturas y docs lo gastan. La IA no viene en el
              gancho, va como add-on. Más detalle en{" "}
              <Link to="/blogs/hito-vs-clickup" className="underline underline-offset-2">
                Hito vs ClickUp
              </Link>
              . Si necesitas Gantt + whiteboards + 15 vistas y el presupuesto existe, ClickUp no
              es el villano — el villano es tratar 60 MB como “para siempre”.
            </p>
            <p>
              <strong>Jira Cloud</strong> free: 10 usuarios, 2 GB, proyectos e issues ilimitados.
              Es honesto para un equipo de desarrollo chico que ya habla en issues. El día 11 no
              es un aviso suave: es upgrade. Jira no es “gratis para la empresa”; es gratis hasta
              el asiento 10.
            </p>
          </>
        ),
      },
      {
        heading: "Notion: bloques, invitados y el techo de equipo",
        body: (
          <>
            <p>
              Notion no nació como gestor de proyectos; se usa como uno. El mito del tope de 1.000
              bloques sigue circulando mal: en 2026, un workspace de un solo miembro tiene bloques
              ilimitados. El tope de ~1.000 aparece cuando hay dos o más miembros en el plan free.
              También: 10 invitados, 5 MB por archivo, historial de 7 días.
            </p>
            <p>
              Eso define el caso: wiki personal + tablero casero, sí. Equipo que carga briefs,
              PDFs y bases compartidas, no. El día que sumas al segundo miembro “para que edite de
              verdad”, el free deja de ser wiki y pasa a ser un contador de bloques. Otras
              opciones, con el mismo criterio de privacidad y precio, en{" "}
              <Link to="/blogs/alternativas-a-notion" className="underline underline-offset-2">
                alternativas a Notion
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Open source y hojas: OpenProject, Excel, Sheets",
        body: (
          <>
            <p>
              <strong>OpenProject</strong> Community es software libre que instalas tú. Gantt,
              work packages, wiki. El precio es cero de licencia y no-cero de servidor, backups y
              actualizaciones. Si no quieres administrar un stack, su cloud se paga: “open source”
              no significa “alguien te lo hostea gratis”. Para un equipo que ya tiene un VPS y le
              gusta el Gantt clásico, es de las pocas opciones serias sin freemium de asientos.
            </p>
            <p>
              <strong>Excel y Google Sheets</strong> son la herramienta gratis más usada, y la más
              mal clasificada. Sheets es gratis con cuenta Google y colabora en tiempo real. Excel
              de escritorio, en la práctica, viaja con Microsoft 365. Alcanzan para un dueño y un
              presupuesto; fallan como sistema de flujo. El desglose de cuándo sí y cuándo no está
              en{" "}
              <Link
                to="/blogs/gestion-proyectos-excel"
                className="underline underline-offset-2"
              >
                gestión de proyectos en Excel
              </Link>
              . Ponerlos en esta lista es honesto: mucha gente no necesita más. Ponerlos como
              “Gantt profesional gratis” no lo es.
            </p>
          </>
        ),
      },
      {
        heading: "Local-first: qué ganas y qué no",
        body: (
          <>
            <p>
              Un tercer camino: el proyecto vive en tu disco, sin backend del vendor.{" "}
              <strong>Hito</strong> entra acá, no como ganador de la tabla — como la fila que no
              te cobra asiento. Es local-first y offline, con proyectos, procesos y checklists.
              La IA, si la activas, usa tu propia API key; también hay MCP. No hay nube de Hito
              donde “subir el workspace”.
            </p>
            <p>Eso tiene costos, y conviene decirlos en la misma línea que las virtudes:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>No hay colaboración en tiempo real tipo Trello/Sheets en la nube.</li>
              <li>No hay ecosistema mobile-first ni marketplace de Power-Ups.</li>
              <li>
                El sync entre personas, si existe, lo armas tú (archivos, git, carpeta
                compartida), no un servidor que resuelve el conflicto por ti.
              </li>
            </ul>
            <p>
              Si tu requisito es cinco personas moviendo tarjetas a la vez desde el celular, esta
              fila no es la tuya. Si tu requisito es que el cliente no viva en un SaaS, y el
              equipo es chico, el plan free de las suites cloud es el que no encaja.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo elegir sin probar ocho tools",
        body: (
          <>
            <p>Una sola pregunta, en este orden:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>¿Cuántas personas editan el mismo tablero cada día?</strong> Una: Excel,
                Notion individual o local-first. Dos: Sheets o Asana free. Más de diez en Jira:
                ya no es free.
              </li>
              <li>
                <strong>¿Los datos pueden vivir en un servidor ajeno?</strong> Si no, descarta el
                bloque cloud entero y elige OpenProject autoalojado o local-first.
              </li>
              <li>
                <strong>¿El techo que vas a tocar primero es tableros, asientos o storage?</strong>{" "}
                Trello = tableros/colaboradores. Jira/Asana = asientos. ClickUp = megas. Notion =
                el segundo miembro.
              </li>
              <li>
                <strong>¿Necesitas Gantt con dependencias o un kanban con WIP?</strong> Gantt serio
                → OpenProject o un pago. Kanban simple → Trello o un tablero local. Lista y
                presupuesto → la hoja.
              </li>
            </ol>
            <p>
              No elijas por el recuento de vistas. Elige por el primer límite que tu equipo va a
              pegar en 90 días. Hay más plantillas de proceso, independientes de la tool, en{" "}
              <Link
                to="/blogs/plantillas-gestion-proyectos"
                className="underline underline-offset-2"
              >
                plantillas de gestión de proyectos
              </Link>
              : un informe semanal de 5 líneas sirve más que un plan “Unlimited” que nadie
              actualiza.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Cuál es la mejor herramienta gratis de gestión de proyectos?",
        answer:
          "No hay una: depende del primer límite que vas a tocar. Trello si el kanban es simple y cabes en 10 tableros; Jira si ya trabajas en issues y son ≤10 personas; Sheets si hay un dueño o un dúo; OpenProject si quieres Gantt en tu servidor; local-first si los datos no pueden salir de tu equipo.",
      },
      {
        question: "¿Trello sigue siendo gratis en 2026?",
        answer:
          "Sí, con techo: 10 tableros y 10 colaboradores por workspace, adjuntos de 10 MB y automatizaciones limitadas. Tarjetas ilimitadas no compensan un portafolio que necesita el tablero 11.",
      },
      {
        question: "¿Asana gratis admite un equipo de 5?",
        answer:
          "No en 2026: el plan Personal quedó en 2 usuarios. Un equipo de 5 entra en plan pago. Guías viejas que hablan de 10 o 15 asientos describen un free que ya no existe.",
      },
      {
        question: "¿ClickUp Free Forever alcanza para un equipo real?",
        answer:
          "Alcanza para probar vistas y tareas livianas. El storage de unos 60 MB se acaba con adjuntos, y la IA va aparte. Un equipo que carga capturas y docs va a pagar; no es un defecto oculto, es el diseño del gancho.",
      },
      {
        question: "¿OpenProject es gratis de verdad?",
        answer:
          "La edición Community es gratis de licencia si la alojas tú: pagas servidor, backups y tiempo. El cloud del proyecto y las funciones Enterprise se cobran. “Open source” no es “hosting cero”.",
      },
      {
        question: "¿Una app local-first reemplaza a Trello o ClickUp?",
        answer:
          "No como clon. Reemplaza el caso “equipo chico, datos en tu disco, checklists y procesos, sin asientos que vencer”. No reemplaza collab en tiempo real en la nube ni un ecosistema mobile con integraciones nativas.",
      },
    ],
  },
};
