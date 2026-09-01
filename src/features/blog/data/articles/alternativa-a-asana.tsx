import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "alternativa-a-asana",
  title: "Alternativas a Asana en 2026 (con techos reales)",
  excerpt:
    "Por qué se busca una alternativa a Asana (precio por usuario, free de 2 asientos) y qué encaja según el motivo: ClickUp, Monday, Trello, Notion, Jira, OpenProject o local-first.",
  category: "comparativas",
  categoryLabel: "Comparativas",
  publishedAt: "2026-08-21",
  readingTime: "11 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "software-gestion-proyectos",
  related: [
    "software-gestion-proyectos",
    "hito-vs-clickup",
    "hito-vs-trello",
    "alternativas-a-notion",
  ],
  seo: {
    title: "Alternativas a Asana en 2026 | Hito",
    description:
      "Alternativas a Asana con techos reales: ClickUp, Monday, Trello, Notion, Jira, OpenProject y local-first. Elige por el motivo de salida, no por el ranking.",
    ogImageAlt: "Tabla de alternativas a Asana según precio, simplicidad y privacidad.",
  },
  content: {
    eyebrow: "Comparativas",
    intro: (
      <>
        <strong>En una línea:</strong> una <strong>alternativa a Asana</strong> tiene sentido si
        el precio por usuario se te fue de las manos, el plan gratis quedó en 2 asientos o la
        herramienta se volvió más compleja que tu flujo. ClickUp, monday.com, Trello, Notion,
        Jira, OpenProject y Hito cubren motivos distintos: ninguna es la mejor para todos.
      </>
    ),
    sections: [
      {
        heading: "Por qué se busca una alternativa a Asana",
        body: (
          <>
            <p>
              Asana sigue siendo un gestor sólido de listas, proyectos y responsabilidades. El
              problema no es que “haya dejado de funcionar”: es que el costo y la superficie del
              producto ya no coinciden con lo que un equipo de 1 a 15 personas necesita cada
              semana. Quien busca <strong>alternativas a Asana</strong> casi nunca pide un clon
              con otro logo. Pide salir de un techo concreto.
            </p>
            <p>Los tres motivos que más se repiten:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Precio por usuario.</strong> Cada asiento se cobra. Sumar a la persona
                que “solo mira el tablero” deja de ser un detalle y se vuelve línea de
                presupuesto. El modelo encaja en una empresa que ya pagaba suites; duele en un
                estudio, una agencia chica o un dúo freelancer-cliente.
              </li>
              <li>
                <strong>El free de 2 asientos.</strong> El plan Personal de Asana, en la foto de
                2026, admite 2 usuarios. Guías viejas que hablan de 10 o 15 asientos gratis
                describen un producto que ya no existe. Un equipo de 5 no “prueba Asana gratis”:
                entra directo a plan pago.
              </li>
              <li>
                <strong>Complejidad.</strong> Portafolios, reglas, campos, cronograma,
                workload… Asana puede mucho. Un equipo que solo necesitaba “quién hace qué esta
                semana” termina administrando la herramienta en vez del trabajo.
              </li>
            </ul>
            <p>
              Este artículo no elige un ganador único. Elige por motivo de salida. El mapa más
              amplio de categorías (lista, kanban, Gantt, local-first) está en{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos
              </Link>
              : acá solo se responde “me quiero ir de Asana, ¿hacia dónde?”.
            </p>
            <blockquote className="border-l-2 border-border/60 pl-4 italic">
              Techos y precios son una foto de 2026, no un contrato eterno. Los vendors los
              mueven. Si un límite es el motivo de la migración, verifica la página de precios el
              día que decidas.
            </blockquote>
          </>
        ),
      },
      {
        heading: "Tabla: alternativas a Asana según el motivo",
        body: (
          <>
            <p>
              Siete caminos frecuentes. La columna útil no es “mejor tool”: es “mejor si…” y
              “cuidado con…”.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Herramienta</th>
                  <th className="py-2 pr-4 font-semibold">Mejor si…</th>
                  <th className="py-2 font-semibold">Cuidado con…</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">ClickUp</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Quieres más vistas (Gantt, workload, dashboards) y un “todo en uno” cloud
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Free ~60 MB de storage; Brain IA extra ~9 USD/usuario; curva de adopción alta
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">monday.com</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Te gusta el tablero visual, CRM liviano y un work OS para no-técnicos
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Mínimo frecuente de 3 asientos en planes pagos; las automatizaciones empujan
                    al Pro
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Trello</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Necesitas kanban simple y colaboración en tiempo real que cualquiera entiende
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Free ~10 tableros / 10 colaboradores; no es jerarquía de proyectos ni SOP
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Notion</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Quieres wiki + bases + tareas en un solo documento, sobre todo en solitario
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El segundo miembro suele activar techos (bloques, historial); no es un PM
                    nativo
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Jira</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Tu equipo ya habla en issues, sprints y flujos de ingeniería
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Free típico ≤10 usuarios; pesado y caro de operar si no eres de software
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">OpenProject</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Quieres Gantt clásico, work packages y software libre en tu servidor
                  </td>
                  <td className="py-2 text-muted-foreground">
                    “Gratis” es la licencia: pagas VPS, backups y tiempo de admin
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Hito</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipo de 1–15 que quiere kanban, SOPs y datos locales (carpeta + JSON), sin
                    asientos
                  </td>
                  <td className="py-2 text-muted-foreground">
                    No hay collab cloud en tiempo real, ni SSO, ni 15 vistas, ni app nativa de
                    ecosistema mobile
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Precio por usuario y el free de 2 asientos",
        body: (
          <>
            <p>
              Asana cobra por cabeza. Eso es honesto para una empresa que ya presupuestó SaaS; es
              el motivo de salida más limpio para un equipo chico. No hace falta odiar el
              producto: basta con que el asiento 3, 6 u 8 cueste más que el valor que esas
              personas extraen del tablero.
            </p>
            <p>
              El plan Personal (gratis) quedó en <strong>2 usuarios</strong>. Si alguien te pasa
              un artículo de 2022 que dice “hasta 10” o “hasta 15”, está desactualizado. Un dúo
              que comparte listas puede vivir ahí. Un equipo de 4 no. Cronograma, dependencias y
              buena parte de los campos custom viven en los planes pagos: el free no es Asana
              “completo con techo”, es Asana recortado.
            </p>
            <p>
              Si el motivo es solo “pagar menos por las mismas 15 vistas”, ClickUp o monday.com
              pueden ser el siguiente SaaS — no una salida del modelo por asiento. ClickUp Free
              se acaba en ~60 MB de storage y la IA (Brain) va aparte, del orden de 9
              USD/usuario. monday.com, en la práctica, suele exigir un mínimo de 3 asientos
              pagos, y las automatizaciones serias empujan al Pro. La comparativa larga de
              profundidad vs. techos está en{" "}
              <Link to="/blogs/hito-vs-clickup" className="underline underline-offset-2">
                Hito vs ClickUp
              </Link>
              : ClickUp gana en vistas e integraciones; Hito no es un clon de esa suite.
            </p>
            <p>
              Si el motivo es “dejar de pagar por cabeza”, hay que salir del modelo SaaS de
              asientos: OpenProject autoalojado (pagas servidor) o una app local-first sin
              licencia por usuario. Mezclar las dos preguntas —más features vs. menos asientos—
              produce migraciones que a los 90 días se sienten iguales.
            </p>
          </>
        ),
      },
      {
        heading: "Cuando Asana es más herramienta que flujo",
        body: (
          <>
            <p>
              El segundo motivo de salida no es la factura: es el ruido. Asana puede modelar
              portafolios, reglas, cargas y cronogramas. Un equipo de servicios que mueve 20
              tareas a la semana no necesita esa superficie. La acaba usando mal o no usándola, y
              entonces “tenemos Asana” significa “tenemos un cementerio de proyectos sin
              actualizar”.
            </p>
            <p>
              Ahí Trello suele ganar por simplicidad: un tablero, listas, tarjetas, collab en
              tiempo real. El free, en 2026, anda cerca de 10 tableros y 10 colaboradores por
              workspace. No es un portafolio de 12 clientes. El detalle de qué gana Trello
              (collab, onboarding, Power-Ups) y qué no (privacidad, jerarquía, SOPs) está en{" "}
              <Link to="/blogs/hito-vs-trello" className="underline underline-offset-2">
                Hito vs Trello
              </Link>
              , no acá. Si solo quieres un kanban cloud que cualquiera entiende en diez minutos,
              también está la landing{" "}
              <Link to="/alternativa-trello" className="underline underline-offset-2">
                alternativa a Trello
              </Link>
              .
            </p>
            <p>
              Notion es la otra salida “simple” que no lo es. Wiki + bases + tablero en un
              documento. Excelente en solitario. El segundo miembro, en planes altos, suele
              activar el cobro o el techo de bloques. Notion no nació como gestor de proyectos:
              se usa como uno. Otras opciones con el mismo criterio de wiki vs. tareas están en{" "}
              <Link to="/blogs/alternativas-a-notion" className="underline underline-offset-2">
                alternativas a Notion
              </Link>
              .
            </p>
            <p>
              Jira es la salida equivocada para la mayoría de quienes se quejan de complejidad en
              Asana. Jira gana en issues, sprints y equipos de desarrollo; pierde en pymes
              no-software. Si tu dolor es “Asana tiene demasiadas palancas”, Jira no las reduce.
            </p>
          </>
        ),
      },
      {
        heading: "Dónde encaja Hito (y dónde no)",
        body: (
          <>
            <p>
              Hito no es “la mejor alternativa a Asana para todos”. Es la fila local-first de la
              tabla: proyectos en una carpeta, archivos JSON, sin cuenta y sin cobro por asiento.
              Kanban, SOPs, automatizaciones, sync con GitHub, PWA, IA opcional con tu propia API
              key. Audiencia honesta: 1 a 15 personas que pueden vivir sin un cursor compartido en
              la nube.
            </p>
            <p>Gana, con claridad, en tres cosas:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Privacidad y soberanía.</strong> Los datos no viven en un tenant de
                Asana. Viven en tu disco. Si el cliente no puede ir a un SaaS, este es el
                argumento, no el recuento de vistas.
              </li>
              <li>
                <strong>Sin asientos.</strong> Sumar a la quinta persona no abre una línea de
                facturación. Tampoco hay un free de 2 usuarios disfrazado de trial.
              </li>
              <li>
                <strong>JSON local + Git.</strong> El workspace es portable. Puedes versionarlo,
                copiarlo, respaldarlo. No dependes de un export que el vendor recorte mañana.
              </li>
            </ul>
            <p>Pierde, también con claridad, donde Asana (y casi todo SaaS) gana:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Colaboración cloud en tiempo real: no hay “tres cursores en la misma tarjeta”
                como en Asana o Trello.
              </li>
              <li>Ecosistema mobile nativo y marketplace de integraciones.</li>
              <li>SSO, SOC 2, SCIM: no hay servidor de Hito que certificar para un auditor.</li>
              <li>
                Las ~15 vistas de una suite (Gantt, workload, whiteboards, dashboards). Hito
                cubre kanban, checklists y procesos; no una plataforma enterprise.
              </li>
              <li>Issue tracking clase Jira: estados, workflows y sprints de ingeniería.</li>
            </ul>
            <p>
              Si eres 50 personas con SSO y un PMO, quédate en Asana o muévete a otra suite cloud.
              Si eres 6 y el brief del cliente no puede vivir en un SaaS, Hito entra en la
              shortlist. No al revés.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo elegir (y cómo migrar sin teatro)",
        body: (
          <>
            <p>Una pregunta, en este orden:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>¿El dolor es factura, techo de 2 asientos, o complejidad?</strong> Tres
                dolores, tres familias de destino. No uses la misma herramienta para los tres.
              </li>
              <li>
                <strong>¿Cuántas personas editan el mismo tablero el mismo día?</strong> Si la
                respuesta es “muchas, a la vez, desde el celular”, un SaaS con collab en tiempo
                real sigue siendo el modelo correcto.
              </li>
              <li>
                <strong>¿Los datos pueden vivir en un servidor ajeno?</strong> Si no, descarta el
                bloque cloud y mira OpenProject autoalojado o local-first.
              </li>
              <li>
                <strong>¿Necesitas 15 vistas o un flujo que se actualice?</strong> Asana se abandona
                más por tableros muertos que por falta de Gantt.
              </li>
            </ol>
            <p>
              Migrar no es un botón. Exporta CSV / JSON desde Asana, mapea proyectos → tableros
              o carpetas, tareas → tarjetas, responsables → un campo que tu destino sí tenga.
              Comentarios largos, pruebas, reglas y campos custom casi nunca viajan enteros.
              Haz un piloto de un proyecto vivo dos semanas antes de apagar Asana. Si a los 14
              días el equipo sigue preguntando “¿dónde quedó eso?”, el destino estaba mal
              elegido — no “la migración salió mal”.
            </p>
            <p>
              No hay una <strong>alternativa a Asana</strong> ganadora para todos. Hay un motivo
              de salida y un techo que vas a tocar a los 90 días. Elige por eso, no por un ranking
              de logos.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Cuál es la mejor alternativa a Asana?",
        answer:
          "No hay una sola. ClickUp si quieres más vistas en la nube; Trello si quieres kanban simple; monday.com si te gusta el work OS visual; Jira si ya trabajas en issues; OpenProject si quieres Gantt en tu servidor; Hito si el equipo es chico y los datos no pueden salir de tu disco. Elige por el motivo de salida (precio, techo de 2 asientos, complejidad, privacidad), no por un ranking.",
      },
      {
        question: "¿Asana o ClickUp: cuál conviene al salir de Asana?",
        answer:
          "ClickUp gana en recuento de vistas, integraciones y una IA más ambiciosa (Brain, de pago). No es más barato por magia: el Free se acaba en ~60 MB y el asiento se sigue cobrando. Si dejas Asana porque te ahogó la complejidad, ClickUp puede repetir el patrón. Si dejas Asana porque quieres una suite todavía más ancha y el presupuesto existe, ClickUp es el candidato obvio.",
      },
      {
        question: "¿Asana sigue siendo gratis en 2026?",
        answer:
          "Sí, con un techo duro: el plan Personal admite 2 usuarios. Cronograma, dependencias y buena parte de los campos custom viven en planes pagos. Un equipo de 5 no entra en el free. Artículos que hablan de 10 o 15 asientos gratis describen un Asana que ya no existe.",
      },
      {
        question: "¿Cómo migrar de Asana a otra herramienta?",
        answer:
          "Exporta proyectos y tareas (CSV o el export que ofrezca Asana), mapea a tableros o carpetas del destino, y acepta que comentarios, reglas y campos custom casi nunca viajan enteros. Haz un piloto de un proyecto vivo dos semanas. No apagues Asana el mismo día del export: el costo real de migrar es reentrenar el hábito, no copiar filas.",
      },
      {
        question: "¿Qué alternativa a Asana encaja en un equipo pequeño?",
        answer:
          "Depende de si el equipo edita a la vez en la nube. Trello si el kanban cloud basta y cabes en ~10 tableros; Notion si es wiki personal más que PM; Hito si son 1–15 personas, quieren SOPs y kanban sin asientos, y aceptan no tener collab en tiempo real ni SSO. Asana pago sigue siendo válido si el collab cloud y el modelo de tareas te sirven y la factura no duele.",
      },
    ],
  },
};
