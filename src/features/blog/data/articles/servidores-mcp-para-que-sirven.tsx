import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "servidores-mcp-para-que-sirven",
  title: "Servidores MCP: para qué sirven (sin ser developer)",
  excerpt:
    "Un servidor MCP no es un chatbot. Es el adaptador que deja a un asistente de IA leer archivos, APIs o tu tablero con un protocolo común. Casos de uso reales.",
  category: "inteligencia-artificial",
  categoryLabel: "Inteligencia artificial",
  publishedAt: "2027-06-28",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "que-es-mcp",
  related: ["que-es-mcp", "como-funciona-mcp-paso-a-paso", "mcp-vs-function-calling-vs-rag"],
  seo: {
    title: "Servidores MCP: para qué sirven, sin jerga | Hito",
    description:
      "Para qué sirven los servidores MCP y qué es un mcp-handler: el adaptador que deja a un asistente leer archivos, APIs o tu tablero, sin ser developer.",
    ogImageAlt:
      "Servidores MCP: para qué sirven, casos de uso y qué es un mcp-handler.",
  },
  content: {
    eyebrow: "Inteligencia artificial",
    intro: (
      <>
        <strong>En una línea:</strong> un <strong>servidor MCP</strong> no es un chatbot ni
        un modelo — es el adaptador que deja a un asistente de IA usar tus archivos, una API
        o tu tablero con un protocolo común. Esta guía es de casos de uso: qué hacen los
        MCP servers en la práctica, qué es un mcp-handler, y cuándo tiene sentido uno local.
      </>
    ),
    sections: [
      {
        heading: "Un servidor MCP no es un chatbot",
        body: (
          <>
            <p>
              Anthropic anunció el{" "}
              <a
                href="https://www.anthropic.com/news/model-context-protocol"
                target="_blank"
                rel="noopener noreferrer"
              >
                Model Context Protocol en noviembre de 2024
              </a>
              . La analogía que se quedó es la del USB-C para la IA: un conector común, no
              una app nueva. El mapa conceptual está en{" "}
              <Link to="/blogs/que-es-mcp" className="underline underline-offset-2">
                qué es MCP
              </Link>
              ; acá importa la pieza que busca quien escribe “servidores MCP” o “mcp's”: el
              programa del lado de tus datos.
            </p>
            <p>
              El chatbot es el cliente (Claude, Cursor, un agente propio). El servidor MCP
              es lo que enchufa para leer un Drive, un repo, una base o un tablero. Sin
              servidor, el modelo solo tiene el texto que le pegas en el chat. Con servidor,
              pide acciones y datos en un formato que cualquier cliente MCP entiende. La
              especificación está en{" "}
              <a
                href="https://modelcontextprotocol.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                modelcontextprotocol.io
              </a>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Qué expone un servidor: tools, resources, prompts",
        body: (
          <>
            <p>
              Un servidor MCP no “piensa”. Expone tres tipos de capacidades. No tiene que
              ofrecer las tres:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Capacidad</th>
                  <th className="py-2 font-semibold">Para qué sirve, en la práctica</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Tools</td>
                  <td className="py-2 text-muted-foreground">
                    Acciones: crear un issue, buscar un archivo, insertar una fila. El
                    asistente las pide; el servidor las ejecuta.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Resources</td>
                  <td className="py-2 text-muted-foreground">
                    Datos para leer: un documento, el estado de un proyecto, una consulta.
                    El asistente consulta; no “hace”.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Prompts</td>
                  <td className="py-2 text-muted-foreground">
                    Plantillas listas: “arma el standup”, “resume este proyecto”. El
                    servidor aporta el texto; tú o el cliente lo usan.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Cómo se abre una sesión y se descubren esas capacidades, paso a paso, está en{" "}
              <Link
                to="/blogs/como-funciona-mcp-paso-a-paso"
                className="underline underline-offset-2"
              >
                cómo funciona MCP paso a paso
              </Link>
              . MCP no reemplaza a function calling ni a RAG: es el cable. La comparativa
              está en{" "}
              <Link
                to="/blogs/mcp-vs-function-calling-vs-rag"
                className="underline underline-offset-2"
              >
                MCP vs function calling vs RAG
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Casos de uso reales (sin ser developer)",
        body: (
          <>
            <p>
              El anuncio de Anthropic ya listaba servidores de ejemplo: Google Drive, Slack,
              GitHub, Git, Postgres y Puppeteer. Traducido a trabajo de proyectos:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Buscar en tus archivos de proyecto.</strong> “¿Dónde quedó el
                alcance del cliente B?” El servidor busca; tú no pegas tres PDFs en el chat.
              </li>
              <li>
                <strong>Crear una tarea desde una nota de reunión.</strong> El asistente lee
                la nota y pide “crea esta tarea”. El modelo no guarda nada: el servidor
                habla con el tablero.
              </li>
              <li>
                <strong>Consultar una base sin poner la clave en el prompt.</strong> Un
                servidor Postgres corre en tu entorno; las credenciales no entran al texto
                que le mandas al modelo.
              </li>
              <li>
                <strong>Revisar un sitio de staging.</strong> Un servidor como Puppeteer
                abre la página y trae lo que ve (un título roto, un 404). Check rápido, no
                un reemplazo de QA.
              </li>
              <li>
                <strong>Abrir issues en GitHub desde un standup.</strong> “Esto quedó como
                bug” se vuelve un issue creado por el servidor, no copiado a mano.
              </li>
            </ul>
            <p>
              El patrón es el mismo: el asistente decide <em>qué</em> pedir; el servidor
              sabe <em>cómo</em> hacerlo contra una herramienta real.
            </p>
          </>
        ),
      },
      {
        heading: "Qué es un mcp-handler",
        body: (
          <>
            <p>
              Si llegaste buscando “mcp-handler”, no es un producto aparte. Es el nombre
              que a veces se le da al código (o al proceso) que{" "}
              <strong>recibe el pedido y corre la herramienta</strong>.
            </p>
            <p>
              MCP habla JSON-RPC: el cliente dice “ejecuta esta tool con estos argumentos”.
              El mcp-handler escucha, valida que la tool existe, la corre y devuelve el
              resultado. Si no está corriendo, el asistente no ve tools. No necesitas
              escribir uno para usar MCP: cuando conectas un servidor en Claude Desktop o
              Cursor, el handler ya viene incluido. En uso diario, es “la parte que de
              verdad ejecuta”.
            </p>
          </>
        ),
      },
      {
        heading: "Local vs remoto: dónde viven los datos",
        body: (
          <>
            <p>
              Un servidor MCP puede correr en tu máquina o en un servicio remoto. El
              protocolo es el mismo; cambia dónde se ejecuta el handler y, con eso, dónde
              tocan los datos.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Local:</strong> el cliente lanza un proceso en tu computadora
                (stdio). Lee el disco, un tablero local, una base que solo existe ahí. Encaja
                cuando no quieres subir el workspace para que el asistente lo “conozca”.
              </li>
              <li>
                <strong>Remoto:</strong> el cliente se conecta por HTTP a un servicio
                (GitHub, Slack, un Drive). Útil cuando los datos ya viven en esa API.
              </li>
            </ul>
            <p>
              Local no es un firewall. Si el tool llama a una API, esos datos salen. Y si el
              asistente usa un modelo en la nube, el <em>resultado</em> que el servidor
              devuelve puede viajar al proveedor. El servidor local evita subir el archivo
              entero “por las dudas”; no borra qué sale en cada turno. Esa distinción está
              en{" "}
              <Link
                to="/blogs/asistente-ia-proyectos-sin-datos"
                className="underline underline-offset-2"
              >
                asistente de IA para proyectos sin entregar tus datos
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "MCP en un gestor de proyectos local",
        body: (
          <>
            <p>
              El caso más cercano a “que el asistente vea mi trabajo sin subir la empresa a
              una nube” es un gestor de proyectos local-first. El workspace vive en archivos
              en tu equipo. Un servidor MCP local es el adaptador: el asistente pregunta por
              proyectos o un resumen; el servidor lee y responde. El workspace no se
              “carga” a un producto de terceros para indexarlo.
            </p>
            <p>
              Hito encaja en ese dibujo: gestor local-first que puede exponer el workspace
              a un cliente MCP sin que el tablero viva en un servidor ajeno. El chat de la
              app no depende de MCP para funcionar; MCP es el camino hacia afuera. Cómo se
              recupera contexto sin una base vectorial externa está en{" "}
              <Link to="/blogs/rag-local-explicado" className="underline underline-offset-2">
                RAG local explicado sin jerga
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Qué no hace un servidor MCP",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>No es un modelo.</strong> No “entiende” tu empresa por sí solo:
                expone tools y datos. El razonamiento lo hace el cliente con el LLM.
              </li>
              <li>
                <strong>No es un plugin de un chat concreto.</strong> Un plugin de ChatGPT
                vive en ese producto. Un servidor MCP lo puede usar cualquier cliente del
                protocolo.
              </li>
              <li>
                <strong>No reemplaza permisos.</strong> Si puede crear issues o leer un
                Drive, quien conecte el cliente hereda esa capacidad. Elige el mínimo de
                tools.
              </li>
            </ul>
            <p>
              Si quieres el protocolo, empieza por{" "}
              <Link to="/blogs/que-es-mcp" className="underline underline-offset-2">
                qué es MCP
              </Link>
              . Si quieres enchufar el primer servidor, sigue{" "}
              <Link
                to="/blogs/como-funciona-mcp-paso-a-paso"
                className="underline underline-offset-2"
              >
                cómo funciona MCP paso a paso
              </Link>
              . Esta página es el para qué: un adaptador, no un chatbot.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Para qué sirve un servidor MCP?",
        answer:
          "Para que un asistente de IA pueda leer o usar una fuente real —archivos, una API, un tablero, GitHub, una base— con un protocolo común. El servidor no es el chatbot: es el adaptador. El cliente (Claude, Cursor, otro agente) descubre las tools y las pide; el servidor las ejecuta.",
      },
      {
        question: "¿Qué es un mcp-handler?",
        answer:
          "El mcp-handler es el código o proceso que recibe las llamadas JSON-RPC del cliente y corre la herramienta pedida (buscar un archivo, crear un issue, leer una fila). No es un producto aparte: es la parte del servidor que de verdad ejecuta. Si no está corriendo, el asistente no ve tools.",
      },
      {
        question: "¿Necesito saber programar para usar un servidor MCP?",
        answer:
          "No para usar uno ya hecho. En clientes como Claude Desktop o Cursor conectas un servidor con un bloque de configuración (comando local o URL). Programar hace falta si quieres escribir un servidor nuevo para una herramienta que todavía no tiene uno.",
      },
      {
        question: "¿Es seguro un servidor MCP?",
        answer:
          "Depende de dónde corre y qué tools expone. Un servidor local puede dejar los archivos en tu máquina, pero el resultado que le devuelve al modelo puede viajar al proveedor del LLM. Un servidor remoto habla con una API (GitHub, Slack) con los permisos que le diste. Conecta el mínimo de tools y trata cada servidor como una integración con acceso real, no como un chat inofensivo.",
      },
      {
        question: "¿En qué se diferencia de un plugin de ChatGPT?",
        answer:
          "Un plugin de ChatGPT vive dentro de ese producto y de sus reglas. Un servidor MCP habla un protocolo abierto: el mismo servidor lo puede usar Claude, Cursor u otro cliente MCP sin reescribir la integración. MCP no es un plugin; es el conector común.",
      },
    ],
  },
};
