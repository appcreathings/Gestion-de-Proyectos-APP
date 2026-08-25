import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "como-funciona-mcp-paso-a-paso",
  title: "Cómo funciona MCP paso a paso: sesión e Introducing MCP",
  excerpt:
    "Cómo funciona MCP en la práctica: qué es una sesión MCP, qué cubrió Introducing MCP y qué puede hacer un servidor (tools, resources, prompts).",
  category: "inteligencia-artificial",
  categoryLabel: "Inteligencia artificial",
  publishedAt: "2027-03-29",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "que-es-mcp",
  related: ["que-es-mcp", "mcp-vs-function-calling-vs-rag", "servidores-mcp-para-que-sirven"],
  seo: {
    title: "MCP paso a paso: sesión e Introducing MCP | Hito",
    description:
      "Cómo funciona MCP paso a paso: qué es una sesión MCP, qué cubre Introducing MCP y qué puede hacer (tools, resources, prompts).",
    ogImageAlt: "Cómo funciona MCP paso a paso: sesión, Introducing MCP y capabilities.",
  },
  content: {
    eyebrow: "Inteligencia artificial",
    intro: (
      <>
        <strong>En una línea:</strong> MCP no es una app ni un modelo — es el protocolo con el
        que un cliente (Claude, Cursor, tu propio agente) abre una <strong>sesión MCP</strong>{" "}
        con un servidor, descubre qué puede hacer y le pide tools, resources o prompts. Esta
        guía es el procedimiento: de Introducing MCP a una sesión que realmente responde.
      </>
    ),
    sections: [
      {
        heading: "Introducing MCP: de qué se trata, en la práctica",
        body: (
          <>
            <p>
              En noviembre de 2024 Anthropic publicó{" "}
              <a
                href="https://www.anthropic.com/news/model-context-protocol"
                target="_blank"
                rel="noopener noreferrer"
              >
                Introducing the Model Context Protocol
              </a>
              . El anuncio no vendía un producto: proponía un estándar abierto para que cualquier
              modelo se conecte a archivos, bases de datos o APIs sin una integración a medida
              por cada par cliente–herramienta.
            </p>
            <p>
              Si llegaste acá buscando “Introducing MCP”, esto es lo que importa del anuncio
              cuando ya pasaste la definición: el protocolo existe para que un cliente descubra
              capacidades al vuelo. No hace falta actualizar el cliente cada vez que alguien
              publica un servidor nuevo. El resto de esta guía es cómo se ve eso, paso a paso.
              El mapa conceptual está en{" "}
              <Link to="/blogs/que-es-mcp" className="underline underline-offset-2">
                qué es MCP
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Qué es una sesión MCP",
        body: (
          <>
            <p>
              Una <strong>sesión MCP</strong> es la conversación viva entre un cliente y un
              servidor mientras están conectados. No es un chat con el usuario: es el canal del
              protocolo. Mientras la sesión está abierta, el cliente puede listar tools, invocar
              una, leer un resource o pedir un prompt plantilla.
            </p>
            <p>La sesión tiene tres momentos claros:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Initialize:</strong> el cliente dice qué versión del protocolo habla y
                qué capabilities ofrece. El servidor responde con las suyas.
              </li>
              <li>
                <strong>Initialized:</strong> el cliente confirma. A partir de ahí la sesión está
                lista para pedidos reales.
              </li>
              <li>
                <strong>Uso y cierre:</strong> se listan e invocan primitives. La sesión termina
                cuando se cierra el proceso (stdio) o la conexión HTTP.
              </li>
            </ol>
            <p>
              Si el initialize falla (versión incompatible, servidor que no arranca, permisos),
              no hay sesión. Todo lo que ves después —tools que “no aparecen”, timeouts, un
              cliente que “no ve” el servidor— casi siempre se diagnostica acá.
            </p>
          </>
        ),
      },
      {
        heading: "Qué puede hacer MCP (tools, resources, prompts)",
        body: (
          <>
            <p>
              La pregunta “mcp can / qué puede hacer MCP” se responde con tres primitives. Un
              servidor no tiene que exponer las tres:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Primitive</th>
                  <th className="py-2 font-semibold">Qué puede hacer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Tools</td>
                  <td className="py-2 text-muted-foreground">
                    Acciones: crear un issue, buscar un correo, leer el estado de un repo. El
                    modelo las invoca con argumentos.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Resources</td>
                  <td className="py-2 text-muted-foreground">
                    Datos que se leen: un archivo, una fila de base de datos, un documento. El
                    modelo no “hace”; consulta.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Prompts</td>
                  <td className="py-2 text-muted-foreground">
                    Plantillas listas: “resume este proyecto”, “arma un standup”. El servidor
                    aporta el texto; el cliente lo ofrece al usuario o al modelo.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              MCP no reemplaza a function calling ni a RAG: es el cable con el que el cliente
              descubre y usa esas capacidades. La comparativa está en{" "}
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
        heading: "Paso a paso: de cero a una sesión que responde",
        body: (
          <>
            <ol className="list-decimal space-y-3 pl-6 text-muted-foreground">
              <li>
                <strong>Elige un cliente MCP.</strong> Claude Desktop, Cursor, Cline o un agente
                propio que hable el protocolo. Sin cliente no hay quién abra la sesión.
              </li>
              <li>
                <strong>Elige un servidor.</strong> Uno local (lee archivos de tu máquina) o uno
                remoto (GitHub, Slack, una API). En stdio el cliente lanza el proceso; en HTTP se
                conecta a una URL.
              </li>
              <li>
                <strong>Configura la conexión.</strong> En Claude Desktop es un bloque en{" "}
                <code>claude_desktop_config.json</code> (comando + args, o URL). En Cursor, la
                pantalla de MCP servers. El detalle cambia; la idea no: el cliente tiene que
                saber cómo arrancar o a dónde hablar.
              </li>
              <li>
                <strong>Abre la sesión.</strong> El cliente envía <code>initialize</code>, recibe
                capabilities y manda <code>notifications/initialized</code>. Si ves el servidor
                “conectado” o “ready”, esa ronda ya ocurrió.
              </li>
              <li>
                <strong>Descubre qué puede hacer.</strong> El cliente pide la lista de tools,
                resources y prompts. Eso es lo que el modelo “ve” cuando le pides algo.
              </li>
              <li>
                <strong>Invoca un tool o lee un resource.</strong> Un pedido real: “lista mis
                issues abiertos”, “lee este archivo”. Si esto falla y el initialize no, el
                problema está en permisos, argumentos o el propio servidor — no en la sesión.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Qué se ve (y qué no) durante la sesión",
        body: (
          <>
            <p>
              El usuario ve un asistente que “puede” leer un repo o crear una tarea. Por debajo,
              el cliente está traduciendo eso a mensajes MCP. Tres matices que evitan
              expectativas rotas:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>El modelo no “es” MCP.</strong> El modelo decide qué tool pedir; el
                cliente habla el protocolo; el servidor ejecuta. Si el modelo alucina un tool que
                no existe, la sesión está bien — el inventario no.
              </li>
              <li>
                <strong>Una sesión ≠ una conversación eterna.</strong> Reiniciar el cliente o el
                servidor abre otra sesión. El estado (archivos abiertos, auth) vive en el
                servidor o en tu disco, no en el protocolo.
              </li>
              <li>
                <strong>Local no significa invisible.</strong> Un servidor stdio corre en tu
                máquina, pero si el tool llama a una API externa, esos datos salen. El protocolo
                no es un firewall.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Errores frecuentes al abrir la primera sesión",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>El servidor no arranca.</strong> Path mal puesto, Node/Python que el
                cliente no encuentra, o un comando que funciona en tu terminal y no en el
                proceso que lanza Claude o Cursor.
              </li>
              <li>
                <strong>Initialize incompatible.</strong> Cliente y servidor no acuerdan versión
                del protocolo. Actualiza el SDK del servidor o el cliente.
              </li>
              <li>
                <strong>La sesión abre y no hay tools.</strong> El servidor está conectado pero
                no expone primitives, o el cliente no las pidió. Revisa los logs del servidor,
                no solo el semáforo verde del cliente.
              </li>
              <li>
                <strong>Funciona en un cliente y no en otro.</strong> Misma config, distinto
                transporte o distinto soporte de capabilities. MCP es estándar; las
                implementaciones no son idénticas.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Conclusión",
        body: (
          <>
            <p>
              Introducing MCP prometió un USB-C para la IA. En la práctica eso es una sesión:
              initialize, descubrir primitives, invocar. Si entiendes esos tres momentos, el
              resto (JSON de config, logs, un segundo servidor) es mecánica.
            </p>
            <p>
              Si quieres ver un gestor de proyectos que combina function calling adentro,{" "}
              <Link to="/blogs/rag-local-explicado" className="underline underline-offset-2">
                RAG local
              </Link>{" "}
              para contexto y un servidor MCP hacia afuera,{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                prueba Hito
              </a>
              . Sin cuenta y con tu propia API key.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo abrir una sesión MCP y usarla",
      steps: [
        {
          name: "Elegir un cliente MCP",
          text: "Claude Desktop, Cursor, Cline o un agente propio que hable el protocolo.",
        },
        {
          name: "Elegir e instalar un servidor",
          text: "Un servidor local (stdio) o remoto (HTTP) que exponga tools, resources o prompts.",
        },
        {
          name: "Configurar la conexión",
          text: "Indicarle al cliente cómo lanzar el proceso o a qué URL conectarse.",
        },
        {
          name: "Inicializar la sesión",
          text: "El cliente envía initialize, el servidor responde con sus capabilities y el cliente confirma con initialized.",
        },
        {
          name: "Descubrir e invocar primitives",
          text: "Listar tools, resources y prompts; invocar un tool o leer un resource con un pedido real.",
        },
        {
          name: "Cerrar o reiniciar la sesión",
          text: "Al cerrar el cliente o el proceso del servidor, la sesión termina. El estado persistente queda en el servidor o en tu disco.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es una sesión MCP?",
        answer:
          "Es el canal abierto entre un cliente y un servidor MCP después del initialize. Mientras dura, el cliente puede listar e invocar tools, leer resources y pedir prompts. No es el chat con el usuario: es la conversación del protocolo.",
      },
      {
        question: "¿Qué es Introducing MCP?",
        answer:
          "Introducing the Model Context Protocol es el anuncio de Anthropic de noviembre de 2024 que presentó MCP como estándar abierto. No es un producto aparte: es el texto que lanzó el protocolo que usan Claude, Cursor y cientos de servidores hoy.",
      },
      {
        question: "¿Qué puede hacer MCP?",
        answer:
          "Un servidor MCP puede exponer tools (acciones), resources (datos para leer) y prompts (plantillas). Lo que 'mcp can' hace en tu caso depende de ese servidor concreto: GitHub, archivos locales, un gestor de proyectos, etc.",
      },
    ],
  },
};
