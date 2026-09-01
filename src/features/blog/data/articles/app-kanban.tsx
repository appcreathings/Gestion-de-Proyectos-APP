import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "app-kanban",
  title: "App kanban: cuándo un tablero alcanza (y cuándo no)",
  excerpt:
    "Una app kanban resuelve flujo visual. No resuelve presupuesto, ruta crítica ni 40 personas. Cuándo el tablero alcanza y cuándo hace falta otra capa.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-08-29",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "software-gestion-proyectos",
  related: ["software-gestion-proyectos", "scrum-vs-kanban", "kanban-limites-wip"],
  seo: {
    title: "App kanban: cuándo el tablero alcanza | Hito",
    description:
      "App kanban: qué tiene que tener un tablero digital, cuándo alcanza para el equipo y cuándo hace falta Gantt, sprints o gestión de proyectos completa.",
    ogImageAlt: "App kanban: tablero digital con columnas, tarjetas y límite WIP.",
  },
  content: {
    eyebrow: "Software",
    intro: (
      <>
        <strong>En una línea:</strong> una <strong>app kanban</strong> (o un{" "}
        <strong>tablero kanban online</strong>) alcanza cuando el trabajo es flujo visual:
        tarjetas, columnas y un límite de trabajo en curso. No alcanza cuando necesitas Gantt,
        sprints cerrados o un presupuesto. Elige la herramienta por esa frontera, no por cuántas
        vistas promete el plan.
      </>
    ),
    sections: [
      {
        heading: "Una app kanban es un tablero, no un PMO",
        body: (
          <>
            <p>
              La gente busca “app kanban” y le venden un software de gestión de proyectos con
              tablero incluido. No es lo mismo. Una app kanban resuelve una pregunta: ¿dónde está
              cada tarjeta y cuántas hay en curso? Un PMO resuelve otras: presupuesto, ruta
              crítica, portafolio, 40 personas. Si mezclas las dos compras, pagas la segunda para
              usar la primera.
            </p>
            <p>
              Un <strong>tablero kanban online</strong> es columnas + tarjetas + (si es kanban de
              verdad) un tope de trabajo en curso. Trello enseñó esa forma; el resto del mercado
              le sumó vistas. El método —por qué el límite WIP hace que el tablero funcione—
              está en{" "}
              <Link to="/blogs/kanban-limites-wip" className="underline underline-offset-2">
                Kanban WIP: qué significa el límite
              </Link>
              . El marco —cuándo Kanban y cuándo Scrum— está en{" "}
              <Link to="/blogs/scrum-vs-kanban" className="underline underline-offset-2">
                Kanban vs Scrum
              </Link>
              . Este artículo es la capa de herramienta: cuándo el tablero alcanza y cuándo
              tienes que elegir otra cosa.
            </p>
            <p>
              Cómo armar las columnas —cuántas, con qué nombres, dónde va el límite— es el
              diseño del tablero, no la elección de la app. Es un segundo paso: primero decides
              si un tablero te basta; después lo diseñas. Acá nos quedamos en la herramienta.
            </p>
          </>
        ),
      },
      {
        heading: "Cuándo un tablero kanban online alcanza",
        body: (
          <>
            <p>
              El tablero alcanza cuando el trabajo es un flujo que se ve. Una agencia de 8 con
              piezas que entran y salen, una pyme de 12 que reparte entregables, un equipo de
              soporte que no puede cerrar un sprint de dos semanas: columnas, dueño por tarjeta
              y un tope de “en curso” bastan. No hace falta un Gantt para ver que diseño tiene
              tres frentes y copy tiene uno.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                El trabajo llega continuo, no en un compromiso cerrado cada 14 días.
              </li>
              <li>
                El cuello de botella se ve en una columna (revisión, espera de cliente, “en
                curso” hinchado).
              </li>
              <li>
                El equipo cabe en una mesa o en una llamada: 1 a 15 personas, no 40 con PMO.
              </li>
              <li>
                La pregunta del lunes es “qué está en curso y qué está bloqueado”, no “cuál es
                la ruta crítica del mes 6”.
              </li>
            </ul>
            <p>
              Si eso describe tu semana, una app kanban es la herramienta correcta. El resto de
              criterios (asientos, datos, dueño) es el mismo que para cualquier{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos
              </Link>
              : no pagues 15 vistas para usar tres columnas.
            </p>
          </>
        ),
      },
      {
        heading: "Señales de que el tablero alcanza (y de que no)",
        body: (
          <>
            <p>
              La frontera no es “equipos ágiles vs. equipos serios”. Es esta tabla. Léela con un
              proyecto real encima, no con el brochure.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">El tablero alcanza</th>
                  <th className="py-2 font-semibold">El tablero no alcanza</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Quieres ver flujo: por hacer → en curso → hecho, con dueño en cada tarjeta.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Necesitas saber qué tarea no se puede atrasar (ruta crítica) o un calendario
                    de barras para un cliente que pide Gantt.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    El trabajo entra continuo (cuentas, soporte, operación). Un sprint cerrado
                    sería teatro.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El equipo se compromete a un lote cada 2–4 semanas, con demo y alcance
                    congelado. Eso pide sprints, no solo columnas.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    El dolor es demasiado trabajo empezado. Un límite WIP en la columna “en
                    curso” lo ataca.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El dolor es dinero: horas cobradas vs. horas gastadas, sobrecosto, un
                    presupuesto que el tablero no muestra.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    El equipo es de 8 o 12. Todos pueden abrir el mismo tablero y entenderlo en
                    10 segundos.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Hay 40 personas o más, portafolio de programas, SSO y un PMO. El tablero se
                    vuelve un mural que nadie mantiene.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El status cabe en “qué hay en cada columna”. Una reunión que recita el
                    tablero sobra.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Hay dependencias duras entre 30 tareas, proveedores con holgura y una fecha
                    de obra que se recalcula. El tablero no es un motor de fechas.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Una agencia de 8 casi siempre cae a la izquierda: flujo, WIP, status visual. Una
              pyme de 12 que instala o construye a veces cae a la derecha el día que el cliente
              pide barras y la fecha depende de un proveedor. Ahí el tablero no es inútil: deja
              de ser suficiente. Conservas el kanban para el flujo diario y sumas otra capa
              (cronograma, presupuesto), no 15 vistas “por si acaso”.
            </p>
          </>
        ),
      },
      {
        heading: "Qué tiene que tener la app (y qué sobra)",
        body: (
          <>
            <p>
              Si ya decidiste que un tablero alcanza, la app se elige por cuatro piezas. Todo lo
              demás es el plan de pago.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Columnas que puedes nombrar tú</strong>, no un flujo fijo de “sprint
                backlog”. Kanban no es Scrum con stickers.
              </li>
              <li>
                <strong>Límite WIP visible</strong> en las columnas intermedias. Sin eso, es una
                lista tumbada. La app no tiene que ser policía; tiene que hacer evidente el
                tope.
              </li>
              <li>
                <strong>Dueño por tarjeta y una fecha</strong> cuando hace falta. El tablero
                vacío de responsables es un mural.
              </li>
              <li>
                <strong>Datos que puedes llevarte</strong> y un costo que no explota a los 8 o 12
                asientos. Invitados, adjuntos y “el campo extra va en el plan Business” son el
                techo real.
              </li>
            </ul>
            <p>
              Sobra, para este trabajo: mapa mental, carga por persona al estilo PPM, 12 tipos
              de vista, automatizaciones que nadie va a mantener y un Gantt que la app ofrece
              “porque el plan lo incluye”. Si el Gantt es el entregable del cliente, genéralo
              para esa reunión; no elijas la app kanban por esa captura. La comparativa concreta
              con el tablero más famoso está en{" "}
              <Link to="/blogs/hito-vs-trello" className="underline underline-offset-2">
                Hito vs Trello
              </Link>
              : misma forma visual, techos distintos (asientos, nube, lo que puedes exportar).
            </p>
          </>
        ),
      },
      {
        heading: "Kanban, Scrum y Gantt: no elijas el marco por la app",
        body: (
          <>
            <p>
              Tres confusiones caras:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>“Usamos Trello, entonces hacemos Kanban.”</strong> Sin límite WIP, haces
                una lista horizontal. La app no instala el método.
              </li>
              <li>
                <strong>“La app tiene sprints, entonces hacemos Scrum.”</strong> Scrum es
                compromiso cerrado, roles y un ritmo. Un campo “sprint” no es un sprint. Si el
                trabajo de la agencia de 8 no comparte calendario, el sprint es teatro; el
                tablero continuo es honesto.
              </li>
              <li>
                <strong>“Si no hay Gantt, no hay gestión de proyectos.”</strong> El Gantt es una
                vista de fechas, no la gestión. Para flujo diario, el tablero gana. Para una
                fecha que depende de 20 predecesoras, el Gantt (o un cronograma de verdad) gana.
                No son rivales: son capas. Elige la app por la capa que usas 4 días de 5.
              </li>
            </ul>
            <p>
              La regla corta: si la semana se ve en columnas, compra (o instala) una app kanban.
              Si la semana se ve en un compromiso de sprint, no elijas kanban y le pongas
              fechas a la fuerza. Si la semana se ve en barras y holguras, el tablero no va a
              recálcularte la ruta crítica por más bonito que sea el drag-and-drop.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo elegir una app kanban en 4 pasos",
        body: (
          <>
            <p>
              No hagas una matriz de 40 funciones. Haz un piloto con trabajo real.
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                Describe el flujo de esta semana en una frase: “las piezas entran, se diseñan,
                el cliente aprueba, se publican”. Esa frase son tus columnas. Si no puedes
                decirla, todavía no estás eligiendo app: estás eligiendo proceso.
              </li>
              <li>
                Marca la frontera de la tabla de arriba. Si ya necesitas presupuesto, sprints
                cerrados o Gantt como motor, no busques “la mejor app kanban”: busca otra
                categoría y, si acaso, un tablero como vista.
              </li>
              <li>
                Prueba 14 días con un proyecto real (una cuenta de la agencia de 8, un
                entregable de la pyme de 12). Tareas de ejemplo no mienten menos: mienten más.
              </li>
              <li>
                Revisa techos el día 14: asientos que pagarías a 12 meses, si el WIP se ve, si
                sales con un export, si 6 de 8 actualizan sin campeón. Eso elige la app. El
                color de las tarjetas, no.
              </li>
            </ol>
            <p>
              Si el tablero alcanza y quieres uno local-first —JSON en tu equipo, sin asientos,
              kanban + procesos, IA opcional, PWA—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              está pensado para 1 a 15 personas, no para un PMO con SSO.
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
              — gestor de proyectos local-first: tablero kanban, SOPs y automatizaciones en tu
              equipo. Sin cuenta, sin asientos, sin nube.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo elegir una app kanban en 4 pasos",
      steps: [
        {
          name: "Describe el flujo real, no las vistas del brochure",
          text: "Una frase con las etapas de esta semana. Esa frase son las columnas. Si no puedes decirla, todavía no estás eligiendo herramienta: estás eligiendo proceso.",
        },
        {
          name: "Marca si el tablero alcanza o si ya hace falta otra capa",
          text: "Si el dolor es flujo y WIP, una app kanban basta. Si el dolor es ruta crítica, sprints cerrados o presupuesto, no elijas kanban por el drag-and-drop: te faltará la otra capa.",
        },
        {
          name: "Prueba 14 días con trabajo real",
          text: "Un proyecto o una cuenta de verdad, no tarjetas de ejemplo. Tres columnas de más que nadie usa son la señal de recortar, no de ‘capacitar’.",
        },
        {
          name: "Revisa techos el día 14",
          text: "Asientos a 12 meses, límite WIP visible, export de los datos, cuántas personas actualizan sin que se lo recuerden. Eso elige la app; el número de vistas, no.",
        },
      ],
    },
    faq: [
      {
        question: "¿Cuál es la mejor app kanban?",
        answer:
          "La que te deja nombrar columnas, ver un límite de trabajo en curso, asignar dueño y llevarte los datos, sin un impuesto por asiento que duela a los 8 o 12 usuarios. No hay una ‘mejor’ universal: Trello enseña la forma; otras ganan en techos (precio, nube, export). Elige por el flujo de esta semana y por lo que pasa a los 12 meses, no por el número de vistas.",
      },
      {
        question: "¿Kanban y Trello son lo mismo?",
        answer:
          "No. Trello es una app de tablero. Kanban es un método: visualizar, limitar el trabajo en curso y gestionar el flujo. Puedes hacer kanban en Trello si respetas el WIP, y puedes usar Trello como una lista tumbada sin ser kanban. La app no instala el método.",
      },
      {
        question: "¿Una app kanban sirve para equipos, no solo para una persona?",
        answer:
          "Sí: es el caso natural de una agencia de 8 o una pyme de 12 con trabajo continuo. El tablero comparte dueños y el tope de ‘en curso’ protege a las personas compartidas. Deja de servir cuando el equipo es un PMO de 40, hay portafolio de programas o el cliente pide un motor de fechas, no un mural.",
      },
      {
        question: "¿Cuándo no alcanza un tablero kanban?",
        answer:
          "Cuando necesitas Gantt o ruta crítica como motor (no como dibujo), sprints con compromiso cerrado, o un presupuesto que el tablero no muestra. También cuando el equipo pasa de 40 personas y el mural no se mantiene. Conserva el kanban para el flujo diario y suma la capa que falta; no compres 15 vistas por si acaso.",
      },
      {
        question: "¿Qué tiene que tener un tablero kanban online?",
        answer:
          "Columnas que nombra el equipo, tarjetas con dueño, un límite WIP visible en las columnas intermedias y un export real. Calendario, colores y stickers son opcionales. Sin el tope de trabajo en curso, es una lista en horizontal, no un tablero kanban.",
      },
    ],
  },
};
