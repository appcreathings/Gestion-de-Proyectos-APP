import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "alternativa-a-jira",
  title: "Alternativas a Jira para equipos que no son de 50",
  excerpt:
    "Jira gana en issues y sprints; se vuelve caro de operar en pymes no-software. Alternativas reales para ingeniería liviana y para equipos de servicios.",
  category: "comparativas",
  categoryLabel: "Comparativas",
  publishedAt: "2026-08-23",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "software-gestion-proyectos",
  related: ["software-gestion-proyectos", "scrum-vs-kanban", "alternativa-a-asana"],
  seo: {
    title: "Alternativas a Jira para equipos chicos | Hito",
    description:
      "Alternativas a Jira para equipos que no son de 50: cuándo Jira sí vale, cuándo una pyme se ahoga y qué usar en ingeniería liviana o servicios.",
    ogImageAlt: "Alternativas a Jira para pymes y equipos que no viven de tickets.",
  },
  content: {
    eyebrow: "Comparativas",
    intro: (
      <>
        <strong>En una línea:</strong> Jira gana en issues, sprints y equipos de desarrollo. Una{" "}
        <strong>alternativa a Jira</strong> tiene sentido cuando tu pyme no-software paga
        complejidad que no usa, no cuando tienes cuarenta developers. Linear o Shortcut alivian
        ingeniería; Trello, OpenProject o Hito cubren servicios — y ninguno reemplaza Jira en un
        equipo grande de producto.
      </>
    ),
    sections: [
      {
        heading: "Jira gana en issues. Punto.",
        body: (
          <>
            <p>
              Quien publica una lista de “mejores alternativas a Jira” suele olvidar la frase
              incómoda: <strong>Jira es el estándar de issue tracking por una razón</strong>.
              Flujos, estados, tipos de incidencia, sprints, tableros, permisos, esquemas,
              integraciones con Bitbucket/GitHub, reporting de ingeniería. Un equipo de 40
              developers con QA, un release train y un auditor que pide trazabilidad no está
              “sobreherramientado”. Está en el producto que se diseñó para eso.
            </p>
            <p>
              Jira Cloud free, en la foto de 2026, suele cubrir ≤10 usuarios y un storage chico (el
              orden de 2 GB). El asiento 11 dispara plan pago. Eso no es una estafa: es el gancho
              de un producto enterprise. El costo real de Jira, de todos modos, casi nunca es la
              licencia. Es el admin, los workflows que nadie se atreve a tocar y las dos horas
              semanales que el equipo pierde en campos obligatorios.
            </p>
            <p>
              Si tu equipo es de software, planea sprints y vive en tickets, la pregunta no es
              “¿cuál es la alternativa a Jira?”. Es “¿estamos usando Scrum de verdad o teatro de
              tablero?”. Esa distinción está en{" "}
              <Link to="/blogs/scrum-vs-kanban" className="underline underline-offset-2">
                Kanban vs Scrum
              </Link>{" "}
              y en{" "}
              <Link
                to="/blogs/que-es-scrum-equipos-pequenos"
                className="underline underline-offset-2"
              >
                qué es Scrum para equipos pequeños
              </Link>
              : cambiar de tool no arregla un sprint que nadie cierra.
            </p>
          </>
        ),
      },
      {
        heading: "Dónde Jira pierde: pymes que no son de software",
        body: (
          <>
            <p>
              Jira se vuelve caro de operar cuando el “issue” no es un bug: es un entregable de
              un cliente, una tarea de un estudio, un hito de una agencia. Ahí el modelo de
              tipos, flujos y proyectos de Jira es un traje de otra profesión. La pyme paga
              asientos, paga onboarding y paga la sensación de que “hay que ser técnico para
              mover una tarjeta”.
            </p>
            <p>
              Tres señales de que Jira no es tu sistema, aunque ya lo hayas comprado:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Nadie del equipo no-dev abre Jira sin que alguien le arme el filtro.
              </li>
              <li>
                El “sprint” es una lista de tareas de la semana sin incremento de producto.
              </li>
              <li>
                Usas un flujo de 12 estados para un trabajo que en la práctica es “por hacer /
                haciendo / hecho”.
              </li>
            </ul>
            <p>
              En ese perfil, una <strong>alternativa a Jira</strong> no es un Jira más lindo. Es
              otra categoría: kanban de servicios, Gantt clásico, o un workspace local. El mapa
              de categorías (lista, kanban, Gantt, local-first) está en{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos
              </Link>
              . Si vienes de Asana y estás evaluando Jira “porque se ve más serio”, lee antes{" "}
              <Link to="/blogs/alternativa-a-asana" className="underline underline-offset-2">
                alternativas a Asana
              </Link>
              : Jira rara vez es el descenso de complejidad que esa gente busca.
            </p>
            <blockquote className="border-l-2 border-border/60 pl-4 italic">
              Techos de usuarios y storage son una foto de 2026. Atlassian los mueve. Si el
              asiento 11 es el motivo de irte, verifica el plan el día que decidas.
            </blockquote>
          </>
        ),
      },
      {
        heading: "Tabla: si tu equipo es… elige…",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Si tu equipo es…</th>
                  <th className="py-2 pr-4 font-semibold">Elige</th>
                  <th className="py-2 font-semibold">Por qué</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    20–50+ developers, QA, sprints, releases
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Jira (quédate)</td>
                  <td className="py-2 text-muted-foreground">
                    Issue tracking, permisos y reporting de ingeniería; ninguna alternativa de
                    esta lista lo clona
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    Ingeniería chica que quiere issues sin el peso de Jira
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Linear o Shortcut</td>
                  <td className="py-2 text-muted-foreground">
                    Tickets, teclado, sprints livianos; siguen siendo cloud y de pago por asiento
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    Producto + diseño que ya habla en issues, ≤10 personas
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Jira Cloud free o Linear</td>
                  <td className="py-2 text-muted-foreground">
                    El free de Jira alcanza hasta el asiento 10; Linear gana en velocidad de UI
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    Agencia, estudio o servicios: entregables, no bugs
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Trello, Hito u OpenProject</td>
                  <td className="py-2 text-muted-foreground">
                    Kanban o Gantt de trabajo de cliente; Jira aquí es disfraz
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    Pyme que quiere Gantt y work packages en su servidor
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">OpenProject</td>
                  <td className="py-2 text-muted-foreground">
                    Community gratis de licencia; pagas VPS y admin. No es Jira
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    1–15 personas, datos locales, SOPs y kanban
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Hito</td>
                  <td className="py-2 text-muted-foreground">
                    Carpeta + JSON, sin asientos; no hay sprints clase Jira ni collab cloud
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">
                    Empresa con SSO, SOC 2 y un PMO
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Jira u otra suite enterprise</td>
                  <td className="py-2 text-muted-foreground">
                    Hito y Trello no son ese checkbox; no lo finjas
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Ingeniería liviana: Linear y Shortcut (Hito no es eso)",
        body: (
          <>
            <p>
              Si el dolor es “Jira es lento, ruidoso y el equipo de 6 engineers se ahoga en
              esquemas”, el destino honesto es un issue tracker liviano:{" "}
              <strong>Linear</strong> o <strong>Shortcut</strong> (ex Clubhouse). Issues, ciclos,
              teclado, Git, una UI que no pide un admin de media jornada. Siguen siendo cloud,
              siguen cobrando por asiento, siguen pensados para producto de software. No son
              “Jira gratis”. Son Jira recortado a lo que un equipo chico de ingeniería sí usa.
            </p>
            <p>
              Hito no entra en esa fila. No tiene workflows de incidencia, no tiene sprints con
              burndown de ingeniería, no tiene tipos de issue ni esquemas de permiso de proyecto.
              Decir lo contrario sería vender un kanban local como si fuera un tracker. Si tu
              backlog es de bugs y PRs, mira Linear o Shortcut — o quédate en Jira. No migres a
              Hito “porque es más simple” y pretendas que el QA va a reportar severidad en un
              JSON local.
            </p>
          </>
        ),
      },
      {
        heading: "Equipos de servicios: Trello, OpenProject, Hito",
        body: (
          <>
            <p>
              Si el trabajo es un cliente, un expediente o una campaña —no un build de producto—
              Jira es la herramienta incorrecta. Tres destinos, tres techos:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Trello:</strong> kanban que cualquiera entiende, collab en tiempo real.
                Free ~10 tableros / 10 colaboradores. Gana en onboarding. Pierde en jerarquía,
                SOPs y privacidad (nube Atlassian, igual que Jira).
              </li>
              <li>
                <strong>OpenProject:</strong> Gantt, work packages, wiki, software libre. Community
                en tu servidor. El costo es ops, no asientos de licencia. Más “PM clásico” que
                “ticket de bug”.
              </li>
              <li>
                <strong>Hito:</strong> local-first, carpeta + JSON, sin cuenta ni cobro por
                asiento. Kanban, SOPs, automatizaciones, sync con GitHub, PWA, IA opcional con tu
                API key. Audiencia 1–15. Gana privacidad y ausencia de asientos. Pierde collab
                cloud en tiempo real, ecosistema mobile nativo, SSO y cualquier pretensión de
                issue tracking clase Jira.
              </li>
            </ul>
            <p>
              Un estudio de 6 personas que usa Jira “porque el desarrollador freelancer lo pidió”
              suele estar a un tablero de Trello o a una carpeta de Hito de distancia. Un equipo
              de 40 engineers no. Esa frase es el artículo entero.
            </p>
          </>
        ),
      },
      {
        heading: "Cuándo quedarte en Jira",
        body: (
          <>
            <p>Quédate si se cumple casi cualquiera de estas:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>El objeto de trabajo es un issue (bug, historia, incidente), no un entregable de cliente.</li>
              <li>Hay sprints reales, con incremento de producto, no “la lista de la semana”.</li>
              <li>Hay más de ~15 personas tocando el mismo sistema, con roles distintos (dev, QA, PO).</li>
              <li>Necesitas trazabilidad, esquemas de permiso o un auditor que pregunte por el flujo.</li>
              <li>SSO, SOC 2 o un IdP no son opcionales.</li>
            </ol>
            <p>
              En ese caso, “alternativa a Jira” es una búsqueda de otra gente. Cambiar a Trello
              o a Hito para un equipo de 40 developers no es valiente: es perder el sistema de
              registro. Optimiza Jira (menos campos, menos estados, un flujo) antes de migrar.
              La migración de 10.000 issues no se paga con un CSV.
            </p>
            <p>
              Hito no es la mejor alternativa a Jira para todos. No lo es para un equipo de
              ingeniería. Lo es, a veces, para el equipo de servicios que nunca debió abrir Jira
              y que ahora busca salir sin comprar otro SaaS por asiento. Esa es la honestidad que
              vale más que un ranking.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Cuál es la mejor alternativa a Jira?",
        answer:
          "Depende de si eres un equipo de software. Para ingeniería chica que quiere issues sin el peso de Jira: Linear o Shortcut. Para servicios y pymes no-dev: Trello (kanban cloud), OpenProject (Gantt autoalojado) o Hito (local-first). Para 40 developers con sprints y QA, la mejor alternativa suele ser quedarse en Jira y recortar el flujo.",
      },
      {
        question: "¿Jira o Trello: cuál le sirve a un equipo chico?",
        answer:
          "Trello si el trabajo es un flujo de tarjetas que cualquiera mueve (servicios, operaciones, un kanban de cliente). Jira si el trabajo es un issue con tipo, estado, sprint y vínculo a código. Trello no es un issue tracker; Jira no es un tablero simple. El free de Trello ronda 10 tableros y 10 colaboradores; el de Jira Cloud, ≤10 usuarios.",
      },
      {
        question: "¿Jira sirve para pymes?",
        answer:
          "Sirve para la pyme de software que ya habla en tickets y cabe en el free (≤10 usuarios) o puede pagar Standard. Se vuelve caro de operar —no solo de licenciar— en pymes no-software: agencias, estudios, operaciones. Ahí el costo es el admin y la curva, no el logo de Atlassian. Para esas pymes, Jira suele ser la herramienta incorrecta.",
      },
      {
        question: "¿Hay alternativa a Jira open source?",
        answer:
          "OpenProject Community es la respuesta seria de Gantt y work packages autoalojados: gratis de licencia, no de servidor. Hay otros trackers libres (plane, Taiga, etc.) con techos distintos de madurez. “Open source” no es “Jira sin factura”: pagas hosting, backups y a quien lo mantenga. Hito es open source (MIT) y local-first, pero no es un clon de Jira.",
      },
      {
        question: "¿Cuándo conviene quedarse en Jira?",
        answer:
          "Cuando el objeto de trabajo es un issue, hay sprints reales, hay roles (dev, QA, PO) y necesitas trazabilidad, permisos o SSO. Un equipo de 40 developers no debería migrar a Trello ni a Hito. Recorta campos y estados antes de cambiar de herramienta: el costo de migrar el historial de issues casi siempre supera el de un año más de Jira.",
      },
    ],
  },
};
