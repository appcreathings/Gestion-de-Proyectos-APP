import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "gestion-proyectos-agencias",
  title: "Gestión de proyectos para agencias y estudios",
  excerpt:
    "Una agencia no falla por falta de talento: falla por demasiados proyectos abiertos, kickoffs flojos y un solo PM como cuello de botella. Cómo ordenarlo.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-06-21",
  readingTime: "11 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  related: [
    "gestionar-varios-proyectos-a-la-vez",
    "gestion-proyectos-freelancers",
    "metodologias-gestion-proyectos",
    "plantillas-gestion-proyectos",
  ],
  seo: {
    title: "Gestión de proyectos para agencias y estudios | Hito",
    description:
      "Gestión de proyectos agencias y estudios: WIP por disciplina, RACI por cuenta y una vista semanal de portafolio. Cómo ordenar kickoffs y status.",
    ogImageAlt:
      "Gestión de proyectos para agencias: WIP por disciplina, RACI y portafolio semanal.",
  },
  content: {
    eyebrow: "Por rol",
    intro: (
      <>
        <strong>En una línea:</strong> la{" "}
        <strong>gestión de proyectos agencias</strong> y estudios no se rompe por falta de
        talento — se rompe porque hay demasiados frentes abiertos, kickoffs que no cierran
        alcance y un solo PM como cuello de botella. El arreglo es operativo: Kanban con WIP
        por disciplina, RACI por cuenta y un status escrito que reemplace la reunión interna.
      </>
    ),
    sections: [
      {
        heading: "El talento no es el cuello de botella",
        body: (
          <>
            <p>
              El trabajo cruza cuentas: el mismo diseñador está en tres marcas, el copy escribe
              para un retainer y un lanzamiento, y el PM es quien “sabe cómo va todo”. El caos
              se siente como falta de gente. Casi nunca lo es.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Diseñadores y developers compartidos entre cuentas, sin tope de frentes.</li>
              <li>Slack, mail y WhatsApp como backlog paralelo al tablero.</li>
              <li>Kickoff que arranca “y vamos viendo”: el alcance se negocia en la semana 6.</li>
              <li>Un PM que aprueba por todos: si se enferma, el estudio se detiene.</li>
            </ul>
            <p>
              Un freelancer resuelve esto con un tope personal de 2 clientes — ver{" "}
              <Link
                to="/blogs/gestion-proyectos-freelancers"
                className="underline underline-offset-2"
              >
                gestión de proyectos para freelancers
              </Link>
              . Una agencia tiene el mismo problema a escala de equipo: capacidad compartida,
              no heroísmo de un PM. El mapa de portafolio está en{" "}
              <Link
                to="/blogs/gestionar-varios-proyectos-a-la-vez"
                className="underline underline-offset-2"
              >
                cómo gestionar varios proyectos a la vez
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Utilización vs entrega",
        body: (
          <>
            <p>
              El indicador que más distorsiona un estudio es la utilización: “si nadie está
              idle, vamos bien”. Utilización alta con muchos frentes abiertos es lo contrario
              de entregar. Cada persona paga cambio de contexto; cada cuenta espera; nada
              cierra. Dos números importan más que las horas vendidas:{" "}
              <strong>frentes activos por persona</strong> (1–2 en foco profundo) y{" "}
              <strong>tiempo hasta el próximo entregable visible</strong> por cuenta.
            </p>
            <p>
              Si un diseñador salta entre cinco cuentas el mismo día, la utilización se ve
              perfecta y la entrega, lenta. Bloques de medio día ganan a 12 tickets de 25
              minutos. Cómo bajar el trabajo empezado está en{" "}
              <Link
                to="/blogs/reducir-trabajo-en-curso"
                className="underline underline-offset-2"
              >
                reducir el trabajo en curso
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Retainers y proyectos no son el mismo flujo",
        body: (
          <>
            <p>
              Mezclar retainer y proyecto en la misma cola es cómo el trabajo recurrente se
              come al trabajo con fecha. El retainer llega continuo; el proyecto tiene hito.
              Si compiten sin regla, gana el que grita.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Capacidad reservada</strong> para el retainer (un bloque fijo) y
                capacidad aparte para proyectos. Si el retainer se desborda, es change
                request, no un “rato extra”.
              </li>
              <li>
                <strong>Cola visible:</strong> lo que no está en el tablero no se trabaja,
                aunque haya llegado por Slack.
              </li>
              <li>
                Un proyecto no se “cuela” en horas de retainer: o recorta el retainer de esa
                semana, o mueve la fecha del proyecto.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Kanban + WIP por disciplina",
        body: (
          <>
            <p>
              Scrum con sprints rígidos encaja mal cuando las cuentas no comparten ritmo.
              Kanban con WIP por disciplina (diseño, contenido, desarrollo, PM) encaja mejor:
              flujo continuo, tope por tipo de trabajo, no “un sprint para todas las marcas”.
              Comparativa en{" "}
              <Link to="/blogs/scrum-vs-kanban" className="underline underline-offset-2">
                Kanban vs Scrum
              </Link>
              ; el menú más amplio, en{" "}
              <Link
                to="/blogs/metodologias-gestion-proyectos"
                className="underline underline-offset-2"
              >
                metodologías de gestión de proyectos
              </Link>
              .
            </p>
            <p>
              El WIP por disciplina protege a las personas compartidas: si diseño tiene
              límite 2, la tercera cuenta espera aunque el comercial haya prometido “esta
              semana”. Cómo se fija el número está en{" "}
              <Link to="/blogs/kanban-limites-wip" className="underline underline-offset-2">
                Kanban y límites WIP
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "RACI por cuenta y kickoff que sí cierra",
        body: (
          <>
            <p>
              El PM como único aprobador es un cuello de botella disfrazado de control. Por
              cada cuenta, una{" "}
              <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                matriz RACI
              </Link>{" "}
              mínima: quién ejecuta, quién aprueba (cliente), a quién se consulta. El PM no
              puede ser Aprobador de todo. Cómo soltar eso está en{" "}
              <Link to="/blogs/como-delegar-tareas" className="underline underline-offset-2">
                cómo delegar y dejar de ser el cuello de botella
              </Link>
              .
            </p>
            <p>
              El kickoff no es una bienvenida: cierra alcance dentro/fuera, canal, aprobador
              del cliente, WIP comprometido y fecha del primer entregable. Si no queda
              escrito, el proyecto ya empezó mal. Una plantilla evita improvisar — ver{" "}
              <Link
                to="/blogs/plantillas-gestion-proyectos"
                className="underline underline-offset-2"
              >
                plantillas de gestión de proyectos
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Vista semanal de portafolio, no otra reunión de status",
        body: (
          <>
            <p>
              El status interno de 45 minutos por cuenta no informa: recita el tablero. Lo
              que sí hace falta es una <strong>vista semanal de portafolio</strong> (estado,
              hito, capacidad por disciplina, riesgos) y un <strong>status escrito</strong>{" "}
              por cuenta, que también se le puede mandar al cliente.
            </p>
            <p>
              Cómo migrar de la reunión al tablero está en{" "}
              <Link
                to="/blogs/reuniones-de-status-eliminar"
                className="underline underline-offset-2"
              >
                reemplazar reuniones de status por un tablero
              </Link>
              . El mismo patrón aplica a estudios especializados: un estudio jurídico
              separa clientes, expedientes y tareas desde el día uno — ver{" "}
              <Link
                to="/blogs/hito-para-estudio-juridico"
                className="underline underline-offset-2"
              >
                cómo configurar Hito para un estudio jurídico
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Síntoma → práctica",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Síntoma</th>
                  <th className="py-2 font-semibold">Práctica</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    Doce proyectos “en curso”, ninguno cierra
                  </td>
                  <td className="py-2 text-muted-foreground">
                    WIP por disciplina; no se abre cuenta nueva sin pausar otra
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    El diseñador salta entre 5 cuentas al día
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Bloques de medio día; máximo 2 frentes en foco
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Slack es el backlog</td>
                  <td className="py-2 text-muted-foreground">
                    Canal único por cuenta; lo que no está en el tablero no se trabaja
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    El PM es el único que sabe el estado
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Status escrito + RACI; el PM deja de ser Aprobador eterno
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    Kickoff = “arrancamos y vemos”
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Plantilla de kickoff: entra / no entra / canal / aprobador / primer hito
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">
                    El retainer se come a los proyectos
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Capacidad reservada por flujo; el desborde es change request
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué metodología le sirve a una agencia?",
        answer:
          "En la mayoría de agencias y estudios, Kanban con límites WIP por disciplina encaja mejor que Scrum con sprints iguales para todas las cuentas. Scrum sirve cuando un equipo estable trabaja un solo producto con ritmo compartido. Si las cuentas no comparten calendario, el sprint se vuelve teatro.",
      },
      {
        question: "¿Cómo evitar que el PM sea el cuello de botella?",
        answer:
          "Saca al PM del rol de Aprobador eterno. RACI por cuenta, status escrito que cualquiera puede leer, y decisiones que el responsable de la disciplina puede tomar sin pasar por una persona. Si el PM se enferma y el estudio se detiene, el sistema está mal diseñado.",
      },
      {
        question: "¿Cómo manejar diseñadores que trabajan en varias cuentas?",
        answer:
          "Tope de 2 frentes en foco y bloques de medio día, no 12 saltos. El WIP se mide por persona y disciplina, no por \"cuántas cuentas tiene el estudio\". La tercera cuenta espera o se reasigna; no se \"encaja un rato\".",
      },
      {
        question: "¿Retainers y proyectos van en el mismo tablero?",
        answer:
          "Pueden convivir en la misma herramienta, no en la misma cola. Reserva capacidad para el retainer y capacidad aparte para proyectos. Si un pedido de retainer se desborda, es un change request: recorta el retainer de esa semana o mueve la fecha del proyecto.",
      },
      {
        question: "¿Hace falta una reunión de status interna cada semana?",
        answer:
          "No una por cuenta. Hace falta una vista semanal de portafolio (estado, hito, capacidad, riesgos) y un status escrito. La reunión que recita el tablero se puede eliminar; la que decide qué pausar, no.",
      },
    ],
  },
};
