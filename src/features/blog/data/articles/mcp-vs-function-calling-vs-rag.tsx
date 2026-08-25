import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "mcp-vs-function-calling-vs-rag",
  title: "MCP vs function calling vs RAG: cuándo usar cada uno",
  excerpt:
    "MCP, function calling y RAG no son tres alternativas: son tres capas. Qué problema resuelve cada una, cómo se combinan y cuándo no necesitas las tres.",
  category: "inteligencia-artificial",
  categoryLabel: "Inteligencia artificial",
  publishedAt: "2027-04-05",
  readingTime: "11 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "que-es-mcp",
  related: ["que-es-mcp", "como-funciona-mcp-paso-a-paso", "servidores-mcp-para-que-sirven"],
  seo: {
    title: "MCP vs function calling vs RAG: cuándo usar cada uno | Hito",
    description:
      "MCP vs function calling vs RAG: qué problema resuelve cada uno, cómo se combinan y cuándo no necesitas los tres. Con tabla y ejemplo.",
    ogImageAlt: "MCP vs function calling vs RAG: tres capas, no tres alternativas.",
  },
  content: {
    eyebrow: "Inteligencia artificial",
    intro: (
      <>
        <strong>En una línea:</strong> <strong>function calling</strong> es cómo el modelo pide
        que se ejecute una acción, <strong>RAG</strong> es cómo recupera texto que no memorizó, y{" "}
        <strong>MCP</strong> es el protocolo con el que un cliente descubre y usa fuentes
        externas sin una integración a medida. No eliges uno y tiras los otros: eliges qué capa
        te falta.
      </>
    ),
    sections: [
      {
        heading: "La confusión: tres capas, no tres alternativas",
        body: (
          <>
            <p>
              Se buscan juntas porque las tres conectan un LLM con el mundo. Se confunden porque
              los demos las mezclan. La pregunta útil no es “¿cuál gana?” sino “¿en qué capa
              está mi problema?”.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Si el modelo no puede <em>hacer</em> nada (crear una tarea, consultar una API) →
                te falta <strong>function calling</strong> (o tools equivalentes).
              </li>
              <li>
                Si no <em>sabe</em> lo que está en tus documentos o proyectos → te falta{" "}
                <strong>RAG</strong>.
              </li>
              <li>
                Si cada herramienta nueva te obliga a escribir otra integración → te falta{" "}
                <strong>MCP</strong>.
              </li>
            </ul>
            <p>
              El pilar{" "}
              <Link to="/blogs/que-es-mcp" className="underline underline-offset-2">
                qué es MCP
              </Link>{" "}
              roza esta tabla. Acá la desglosamos con límites honestos.
            </p>
          </>
        ),
      },
      {
        heading: "Function calling: el modelo pide que ocurra algo",
        body: (
          <>
            <p>
              Function calling (o tool use) es una capacidad del modelo: frente a un prompt,
              puede devolver “llama a <code>create_task(title=…)</code>” en vez de solo texto.
              El runtime de tu app ejecuta esa función y le devuelve el resultado al modelo.
            </p>
            <p>
              <strong>Qué resuelve:</strong> acciones. Crear, actualizar, listar, enviar.{" "}
              <strong>Qué no resuelve:</strong> cómo se descubren esas funciones si mañana
              aparece otra app, ni cómo recuperar un documento largo que no cabe en el schema
              de una función.
            </p>
            <p>
              Puedes tener function calling excelente sin MCP (un set fijo de tools en tu app)
              y sin RAG (el modelo solo ve lo que le pasas en el prompt). Es el caso más común
              en productos con asistente propio.
            </p>
          </>
        ),
      },
      {
        heading: "RAG: el modelo lee lo que no memorizó",
        body: (
          <>
            <p>
              RAG (Retrieval-Augmented Generation) busca trozos relevantes en un índice y los
              inyecta en el prompt antes de que el modelo responda. No “entrena” el modelo con
              tus datos: le pasa contexto a tiempo.
            </p>
            <p>
              <strong>Qué resuelve:</strong> conocimiento que cambia o que es privado.{" "}
              <strong>Qué no resuelve:</strong> ejecutar una acción. Recuperar el párrafo de un
              contrato no crea la tarea de revisión.
            </p>
            <p>
              “RAG local” añade una restricción: el índice vive en tu dispositivo, no en la
              base vectorial de un tercero. Cómo se ve eso en la práctica está en{" "}
              <Link to="/blogs/rag-local-explicado" className="underline underline-offset-2">
                RAG local explicado
              </Link>
              . Spoiler útil: local suele ser el índice, no necesariamente cada llamada al
              modelo.
            </p>
          </>
        ),
      },
      {
        heading: "MCP: el cable estándar, no el cerebro",
        body: (
          <>
            <p>
              MCP no es un modelo ni una técnica de recuperación. Es un protocolo: cliente y
              servidor hablan el mismo idioma para listar e invocar tools, leer resources y
              servir prompts. El cliente descubre capabilities al abrir la{" "}
              <Link
                to="/blogs/como-funciona-mcp-paso-a-paso"
                className="underline underline-offset-2"
              >
                sesión MCP
              </Link>
              ; no las tiene fijadas en el código.
            </p>
            <p>
              <strong>Qué resuelve:</strong> interoperabilidad. Un servidor que escribiste hoy
              puede hablar con un cliente que no existía cuando lo publicaste.{" "}
              <strong>Qué no resuelve:</strong> por sí solo, ni la calidad de las respuestas ni
              la búsqueda semántica. Un servidor MCP puede <em>exponer</em> un tool que por
              debajo hace RAG; MCP no es el RAG.
            </p>
          </>
        ),
      },
      {
        heading: "Tabla: lado a lado",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold"></th>
                  <th className="py-2 pr-4 font-semibold">Function calling</th>
                  <th className="py-2 pr-4 font-semibold">RAG</th>
                  <th className="py-2 font-semibold">MCP</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Nivel</td>
                  <td className="py-2 pr-4 text-muted-foreground">Capacidad del modelo</td>
                  <td className="py-2 pr-4 text-muted-foreground">Patrón de arquitectura</td>
                  <td className="py-2 text-muted-foreground">Protocolo entre apps</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Pregunta que responde</td>
                  <td className="py-2 pr-4 text-muted-foreground">¿Cómo hace cosas?</td>
                  <td className="py-2 pr-4 text-muted-foreground">¿Cómo sabe cosas nuevas?</td>
                  <td className="py-2 text-muted-foreground">
                    ¿Cómo se conecta a cualquier fuente?
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Lo escribes tú</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Schemas de funciones + runtime
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Índice, embeddings, inyección al prompt
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Servidor y/o cliente que hablan el estándar
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Reemplaza a los otros</td>
                  <td className="py-2 pr-4 text-muted-foreground">No</td>
                  <td className="py-2 pr-4 text-muted-foreground">No</td>
                  <td className="py-2 text-muted-foreground">No</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Cuándo alcanza solo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    App cerrada, set fijo de acciones
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Solo preguntas sobre documentos
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Quieres que terceros usen tu fuente
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Cómo se combinan (el caso normal)",
        body: (
          <>
            <p>Un agente decente en 2026 suele verse así:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                El usuario pregunta. Un paso de <strong>RAG</strong> trae los 5 trozos más
                parecidos de su workspace.
              </li>
              <li>
                El modelo, con ese contexto, decide si responde en texto o si necesita una
                acción → <strong>function calling</strong>.
              </li>
              <li>
                Si la acción o el dato viven en otra app, el cliente habla con esa app por{" "}
                <strong>MCP</strong> en vez de un conector exclusivo.
              </li>
            </ol>
            <p>
              MCP puede transportar un tool cuyo cuerpo <em>es</em> function calling interno, o
              un resource cuyo contenido salió de un índice RAG. Las capas se apilan; no se
              votan.
            </p>
          </>
        ),
      },
      {
        heading: "Cuándo no necesitas las tres",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Chat sobre un PDF único:</strong> pega el texto o haz RAG simple. MCP
                sobra.
              </li>
              <li>
                <strong>Asistente dentro de una sola app, con 20 tools fijas:</strong> function
                calling nativo. MCP hacia adentro suele ser más protocolo que valor — el
                protocolo brilla hacia <em>afuera</em>.
              </li>
              <li>
                <strong>Quieres que Claude o Cursor lean tu producto:</strong> ahí sí un
                servidor MCP. Function calling solo dentro de tu UI no les sirve a ellos.
              </li>
              <li>
                <strong>Tus datos no pueden salir de la máquina:</strong> el índice puede ser
                local (RAG local), pero si el modelo es una API, el contexto recuperado viaja.
                Ninguna de las tres capas te salva de esa frase si no la lees completa.
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
              Function calling hace. RAG sabe. MCP conecta. Si alguien te vende una de las tres
              como reemplazo de las otras, está vendiendo un demo, no una arquitectura.
            </p>
            <p>
              En{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                Hito
              </a>{" "}
              el asistente dentro de la app usa function calling nativo, el contexto semántico
              sale de un RAG con índice en el navegador, y el servidor MCP existe para que
              clientes externos lean el workspace. Tres capas, tres papeles. Sin cuenta, con tu
              propia API key.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿MCP reemplaza a function calling?",
        answer:
          "No. MCP es el protocolo para descubrir y llamar tools; function calling es cómo el modelo decide invocar una función. Un cliente MCP suele usar function calling (o tool use) por debajo para que el modelo elija el tool.",
      },
      {
        question: "¿MCP reemplaza a RAG?",
        answer:
          "No. RAG recupera texto relevante y lo pone en el prompt. MCP puede exponer un resource o un tool que haga esa búsqueda, pero el protocolo no indexa ni calcula similitud por ti.",
      },
      {
        question: "¿Cuál de los tres debería implementar primero?",
        answer:
          "Si tu usuario necesita que el asistente haga cosas dentro de tu producto, function calling. Si necesita que recuerde sus documentos, RAG. Si necesitas que otras apps (Claude, Cursor) hablen con tu producto, MCP. Empieza por el hueco que ya te duele.",
      },
    ],
  },
};
