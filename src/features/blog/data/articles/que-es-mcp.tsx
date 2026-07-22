import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
  slug: "que-es-mcp",
  title: "Qué es MCP (Model Context Protocol): guía simple y honesta",
  excerpt:
    "MCP explicado sin hype: qué es, para qué sirve y en qué se diferencia de function calling y RAG. Con un ejemplo real.",
  category: "inteligencia-artificial",
  categoryLabel: "Inteligencia artificial",
  publishedAt: "2026-08-10",
  readingTime: "9 min",
  featured: false,
  seo: {
    title: "Qué es MCP (Model Context Protocol): la guía simple y honesta — Hito",
    description:
      "MCP explicado sin hype: qué es, para qué sirve y en qué se diferencia de function calling y RAG. Con un ejemplo real.",
    ogImageAlt: "Qué es MCP (Model Context Protocol).",
  },
  content: {
    eyebrow: "Inteligencia artificial",
    intro: (
      <>
        <strong>En una línea:</strong> MCP (Model Context Protocol) es un estándar abierto
        creado por Anthropic en 2024 para que los LLMs se conecten a fuentes externas (archivos,
        bases de datos, APIs, apps) con un formato común. Se lo describe como el "USB-C de la
        IA": cualquier cliente (Claude, Cursor, IDEs) puede hablar con cualquier servidor MCP
        usando el mismo protocolo. No reemplaza a function calling ni a RAG; los complementa.
      </>
    ),
    sections: [
      {
        heading: "¿De dónde viene MCP?",
        body: (
          <>
            <p>
              MCP fue anunciado por{" "}
              <a
                href="https://www.anthropic.com/news/model-context-protocol"
                target="_blank"
                rel="noopener noreferrer"
              >
                Anthropic en noviembre de 2024
              </a>{" "}
              como un estándar abierto para conectar modelos de lenguaje con fuentes de datos
              externas. La especificación es pública y está en{" "}
              <a
                href="https://modelcontextprotocol.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                modelcontextprotocol.io
              </a>
              .
            </p>
            <p>
              Desde su lanzamiento fue adoptado por un ecosistema creciente: Claude Desktop,
              Cursor, Zed, Sourcegraph, Replit, Cline y muchos otros clientes y servidores
              comunitarios. Hoy existen cientos de servidores MCP públicos (para GitHub, Slack,
              Postgres, Google Drive, Jira, etc.).
            </p>
          </>
        ),
      },
      {
        heading: 'El "USB-C de la IA": ¿qué problema resuelve?',
        body: (
          <>
            <p>
              Antes de MCP, cada integración entre un LLM y una herramienta era un desarrollo
              custom. Si querías que Claude leyera tu GitHub, había que escribir código
              específico. Si querías que Cursor leyera tu Postgres, otro código distinto. Cada
              cliente × cada herramienta = una integración diferente.
            </p>
            <p>MCP estandariza eso con dos piezas:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Servidor MCP:</strong> programa que expone capacidades (tools, recursos,
                prompts) en un formato común.
              </li>
              <li>
                <strong>Cliente MCP:</strong> cualquier aplicación con un LLM (Claude, Cursor,
                tu propio agente) que sabe cómo hablar con servidores MCP.
              </li>
            </ul>
            <p>
              Es exactamente la metáfora del USB-C: cualquier dispositivo con puerto USB-C se
              conecta con cualquier cable USB-C. Cualquier cliente MCP se conecta con cualquier
              servidor MCP.
            </p>
            <blockquote className="border-l-2 border-border/60 pl-4 italic">
              💡 La diferencia clave con las integraciones custom: el cliente no necesita saber
              nada específico del servidor. Descubre sus capacidades al vuelo. Un cliente puede
              conectarse a un servidor MCP que se creó después que él, sin actualizar nada.
            </blockquote>
          </>
        ),
      },
      {
        heading: "MCP vs Function Calling vs RAG",
        body: (
          <>
            <p>
              Esta es la tabla que más gente busca. Los tres conceptos se confunden todo el
              tiempo porque los tres conectan LLMs con datos externos, pero resuelven problemas
              distintos.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold"></th>
                  <th className="py-2 pr-4 font-semibold">Function Calling</th>
                  <th className="py-2 pr-4 font-semibold">RAG</th>
                  <th className="py-2 font-semibold">MCP</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Qué es</td>
                  <td className="py-2 pr-4">
                    Capacidad del LLM de invocar funciones predefinidas en respuesta a un prompt
                  </td>
                  <td className="py-2 pr-4">
                    Técnica para recuperar documentos relevantes e inyectarlos en el contexto
                    del prompt
                  </td>
                  <td className="py-2">
                    Protocolo estándar para que LLMs se conecten a fuentes externas
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Qué resuelve</td>
                  <td className="py-2 pr-4">
                    ¿Cómo hace el LLM para <em>hacer</em> cosas (crear tarea, leer DB, enviar
                    email)?
                  </td>
                  <td className="py-2 pr-4">
                    ¿Cómo hace el LLM para <em>saber</em> cosas que no estaban en su
                    entrenamiento?
                  </td>
                  <td className="py-2">
                    ¿Cómo se estandariza la conexión LLM ↔ fuente de datos?
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Nivel</td>
                  <td className="py-2 pr-4">Capacidad del modelo</td>
                  <td className="py-2 pr-4">Patrón de arquitectura</td>
                  <td className="py-2">Protocolo de interoperabilidad</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Ejemplo</td>
                  <td className="py-2 pr-4">
                    "Llama a <code>create_task(title='x')</code> cuando el usuario pida crear
                    una tarea"
                  </td>
                  <td className="py-2 pr-4">
                    "Antes de responder, busca los 5 documentos más parecidos a la pregunta e
                    inclúyelos en el prompt"
                  </td>
                  <td className="py-2">
                    "Cualquier agente puede leer mi GitHub si expongo un servidor MCP"
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">¿Reemplaza a los otros?</td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2">No</td>
                </tr>
              </tbody>
            </table>
            <p>
              Los tres son <strong>complementarios</strong>, no excluyentes. Un buen agente
              moderno combina los tres.
            </p>
          </>
        ),
      },
      {
        heading: "Anatomía de MCP: servers, clients y transports",
        body: (
          <>
            <p>Para entender MCP en concreto, hace falta conocer tres piezas:</p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Servidor MCP
            </h3>
            <p>Programa que expone capacidades en formato estándar. Típicamente expone:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Tools:</strong> funciones que el LLM puede invocar (ej.{" "}
                <code>create_issue</code>, <code>search_emails</code>,{" "}
                <code>get_repo_status</code>).
              </li>
              <li>
                <strong>Resources:</strong> datos que el LLM puede leer (ej. contenido de un
                archivo, registro de una DB).
              </li>
              <li>
                <strong>Prompts:</strong> plantillas de prompt predefinidas.
              </li>
            </ul>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Cliente MCP
            </h3>
            <p>
              Aplicación con un LLM que sabe hablar el protocolo. Descubre las capacidades del
              servidor al conectarse y las ofrece al modelo. Ejemplos: Claude Desktop, Cursor,
              Cline, o tu propio agente custom.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Transport
            </h3>
            <p>Cómo se comunican cliente y servidor por la red. Los dos principales:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>stdio:</strong> el servidor es un proceso que el cliente lanza y con el
                que habla por entrada/salida estándar. Útil para servidores locales (ej. uno que
                lee archivos de tu máquina).
              </li>
              <li>
                <strong>HTTP + SSE / Streamable HTTP:</strong> el servidor es un servicio remoto
                al que el cliente se conecta por HTTP. Útil para servidores compartidos o en la
                nube.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Un ejemplo concreto: cómo usa MCP Hito",
        body: (
          <>
            <p>
              Para que no quede en teoría, veamos cómo se implementa en{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                Hito
              </a>
              , un gestor de proyectos local-first con asistente IA. Hito combina{" "}
              <strong>las tres tecnologías</strong> que vimos arriba, cada una en su papel.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              1. Function calling nativo (lo que usa el asistente dentro de la app)
            </h3>
            <p>
              El asistente IA de Hito, dentro de la aplicación,{" "}
              <strong>no usa MCP para funcionar</strong>. Usa function calling nativo de Gemini
              sobre unas 40 herramientas (tools) custom, definidas con schemas Zod y convertidas
              a <code>FunctionDeclaration</code> de Gemini. Algunas de esas tools son:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <code>create_task</code>, <code>update_task</code>, <code>list_tasks</code> —
                manejo de tareas.
              </li>
              <li>
                <code>get_project</code>, <code>list_projects</code>,{" "}
                <code>summarize_project_health</code> — lectura de proyectos.
              </li>
              <li>
                <code>add_area</code>, <code>update_area</code> — gestión de áreas.
              </li>
              <li>
                <code>create_checklist_template</code>, <code>apply_type_to_project</code> —
                operaciones compuestas.
              </li>
              <li>
                <code>semantic_search</code> — búsqueda semántica (esta tool dispara el RAG que
                veremos abajo).
              </li>
            </ul>
            <p>
              El propio código llama a esta capa "estilo MCP" (MCP-style) porque replica las
              ideas de MCP (tools con schemas, separación read/write), pero no usa el SDK
              oficial de MCP. Es una implementación directa sobre Gemini.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              2. RAG local (para contexto semántico)
            </h3>
            <p>
              Cuando activas el asistente y tu workspace está indexado, antes de cada turno se
              ejecuta una búsqueda semántica sobre tus proyectos, tareas, checklists y personas.
              Los 5 resultados más relevantes se inyectan en el prompt para darle contexto al
              modelo.
            </p>
            <p>Implementación verificada en el repo:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Embeddings:</strong> generados con <code>gemini-embedding-001</code> (de
                Google).
              </li>
              <li>
                <strong>Vector store:</strong> no hay base de datos vectorial externa. Los
                embeddings se guardan en <strong>IndexedDB del navegador</strong>.
              </li>
              <li>
                <strong>Similitud:</strong> cosine similarity calculada en JavaScript puro, en
                el cliente. Búsqueda lineal, sin ANN.
              </li>
              <li>
                <strong>Indexación:</strong> manual, la dispara el usuario desde Ajustes.
              </li>
            </ul>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              3. Servidor MCP oficial (para interoperabilidad externa)
            </h3>
            <p>
              Además de la capa interna, Hito expone un <strong>servidor MCP real</strong>{" "}
              usando el SDK oficial <code>@modelcontextprotocol/sdk</code> con transporte stdio.
              Es decir: cualquier cliente MCP externo (Claude Desktop, Cursor, etc.) puede
              conectarse a Hito y leer su workspace como si fuera otra fuente de datos.
            </p>
            <p>
              El servidor MCP standalone hoy es{" "}
              <strong>read-only con fixtures de ejemplo</strong>. No es el camino que usa el
              chat de la app; está pensado para que terceros integren Hito en sus propios
              agentes en el futuro.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Por qué esta separación importa
            </h3>
            <p>La distinción no es académica. Tiene consecuencias prácticas:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Dentro de la app</strong>, function calling directo es más simple y
                rápido que levantar un servidor MCP. No hay overhead de protocolo.
              </li>
              <li>
                <strong>Hacia afuera</strong>, MCP permite que otros agentes (Claude, Cursor, lo
                que sea) lean tus proyectos de Hito sin que Hito tenga que integrarse con cada
                uno.
              </li>
              <li>
                <strong>RAG</strong> agrega entendimiento semántico que ni function calling ni
                MCP dan por sí solos.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Una nota honesta sobre privacidad",
        body: (
          <>
            <p>
              Hito es local-first: tus proyectos viven en archivos <code>.json</code> en tu
              equipo, sin backend. Pero cuando interactúas con el asistente IA, el contenido
              relevante de tu workspace viaja a la API de Gemini (Google) — incluyendo el system
              prompt con el índice de tus proyectos, los resultados del RAG semántico y las
              respuestas de las tools de lectura que el modelo invoque.
            </p>
            <p>
              Tú traes tu propia API key de Google AI Studio, así que controlas qué modelo usas.
              Pero si trabajas con datos extremadamente sensibles, puedes simplemente no activar
              el asistente: el resto de Hito funciona 100% local, sin que un solo byte salga de
              tu equipo.
            </p>
            <p>
              Esta precisión importa más que cualquier claim exagerado de marketing. Si tu caso
              de uso no tolera que los datos viajen a Google, no actives el asistente. Si lo
              tolera, el asistente es muy útil.
            </p>
          </>
        ),
      },
      {
        heading: "¿Te debería importar MCP?",
        body: (
          <>
            <p>Depende de tu perfil:</p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Perfil</th>
                  <th className="py-2 font-semibold">¿MCP te importa?</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    Desarrollador que construye agentes / integra LLMs
                  </td>
                  <td className="py-2">
                    Sí, mucho. MCP es el estándar emergente para no escribir integraciones
                    custom para cada herramienta.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Usuario final de productos con IA</td>
                  <td className="py-2">
                    Indirectamente. MCP hace que las herramientas que usas sean más
                    interoperables, pero no vas a tocar el protocolo directamente.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">
                    Equipo que evalúa herramientas con IA
                  </td>
                  <td className="py-2">
                    Poco. Lo que te importa es qué puede hacer el asistente y qué pasa con tus
                    datos, no el protocolo subyacente.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La pregunta correcta para la mayoría no es "¿uso MCP?" sino "¿las herramientas que
              uso se integran bien con mi stack?". MCP es una respuesta técnica a esa pregunta,
              no la pregunta misma.
            </p>
          </>
        ),
      },
      {
        heading: "Conclusión",
        body: (
          <>
            <p>
              MCP es un protocolo de interoperabilidad que resuelve un problema real (cómo se
              conectan los LLMs con fuentes externas sin integraciones custom de a una). No es
              magia, no reemplaza a function calling ni a RAG, y no te va a cambiar la vida como
              usuario final. Pero para quien construye agentes, es probable que se convierta en
              el estándar por defecto en los próximos años.
            </p>
            <p>
              Si quieres ver cómo se combinan las tres tecnologías — function calling, RAG local
              y un servidor MCP — en un gestor de proyectos real y open source,{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                prueba Hito
              </a>
              . Sin cuenta, sin nube (para el storage), y con un asistente IA que tú controlas
              con tu propia API key.
            </p>
          </>
        ),
      },
    ],
  },
};
