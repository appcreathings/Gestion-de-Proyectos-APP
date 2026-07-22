import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
  slug: "rag-local-explicado",
  title: "RAG local explicado sin jerga",
  excerpt:
    "Qué es RAG, qué lo hace 'local' y cómo lo implementa Hito de verdad: qué se indexa, dónde vive y qué viaja a un servidor externo.",
  category: "inteligencia-artificial",
  categoryLabel: "Inteligencia artificial",
  publishedAt: "2026-09-28",
  readingTime: "10 min",
  featured: false,
  seo: {
    title: "RAG local explicado sin jerga | Hito",
    description:
      "Qué es RAG, qué lo hace 'local' y cómo lo implementa Hito de verdad: qué se indexa, dónde vive y qué viaja a un servidor externo.",
    ogImageAlt: "RAG local explicado sin jerga: búsqueda semántica en tu dispositivo.",
  },
  content: {
    eyebrow: "Inteligencia artificial",
    intro: (
      <>
        <strong>En una línea:</strong> RAG (Retrieval-Augmented Generation) es la técnica que le
        da a un asistente de IA acceso a tus datos privados —proyectos, tareas, notas— sin que
        el modelo haya sido entrenado con ellos: antes de responder, busca lo más relevante y lo
        agrega a la pregunta. "RAG local" significa que ese índice de búsqueda vive en tu
        dispositivo, no en la base de datos vectorial de un tercero. Con un matiz importante que
        vamos a explicar sin vueltas: local es el índice, no necesariamente cada paso del
        proceso.
      </>
    ),
    sections: [
      {
        heading: "El problema que resuelve RAG",
        body: (
          <>
            <p>
              Un modelo de IA como Gemini o Claude fue entrenado con una foto fija de internet
              hasta cierta fecha. No sabe nada de tu proyecto "Rediseño Q3" ni de la tarea que
              creaste ayer — porque esa información no existía cuando se entrenó, y
              probablemente nunca debería haber sido pública.
            </p>
            <p>
              La solución obvia sería escribir todo el contexto en cada pregunta ("aquí están
              mis 40 proyectos, ahora responde"), pero eso no escala: hay un límite de cuánto
              texto le puedes dar a un modelo de una sola vez, y la mayor parte sería
              irrelevante para la pregunta puntual. RAG resuelve exactamente ese problema: en
              lugar de mandar todo, busca solo lo relevante y se lo pasa al modelo justo antes
              de que responda.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo funciona RAG, paso a paso",
        body: (
          <>
            <p>
              Sin jerga, esto es lo que pasa cada vez que le preguntas algo a un asistente con
              RAG:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Tus datos se convierten en números.</strong> Cada pieza de información
                (una tarea, una nota, un proyecto) se transforma en una lista de números que
                representa su significado — esto se llama <em>embedding</em>. Dos textos con
                significados parecidos generan listas de números parecidas, aunque usen palabras
                distintas.
              </li>
              <li>
                <strong>Esos números se guardan en un índice buscable.</strong> Este índice es
                lo que se consulta más adelante, en lugar de releer todo el texto original cada
                vez.
              </li>
              <li>
                <strong>
                  Cuando haces una pregunta, tu pregunta también se convierte en números
                </strong>
                , usando el mismo proceso.
              </li>
              <li>
                <strong>Se comparan los números de tu pregunta con los del índice</strong> para
                encontrar las piezas de información más parecidas en significado — no
                necesariamente las que comparten las mismas palabras.
              </li>
              <li>
                <strong>Los resultados más relevantes se agregan a tu pregunta</strong> antes de
                mandársela al modelo, que ahora sí tiene el contexto necesario para responder
                con precisión sobre tus datos.
              </li>
            </ol>
            <p>
              Todo esto pasa en segundos, sin que lo veas — el asistente simplemente "sabe" de
              qué le estás hablando.
            </p>
          </>
        ),
      },
      {
        heading: "Qué hace 'local' al RAG",
        body: (
          <>
            <p>
              La diferencia entre un RAG genérico y un <strong>RAG local</strong> está en el
              paso 2: dónde vive ese índice de números.
            </p>
            <p>
              En la mayoría de las implementaciones empresariales de RAG, el índice vive en una
              base de datos vectorial especializada en la nube (Pinecone, Weaviate, y
              similares), gestionada por un proveedor externo. Es rápida y escala bien, pero
              implica que tu índice de búsqueda —una representación de todo tu contenido— vive
              en el servidor de otra empresa.
            </p>
            <p>
              En un RAG local, ese índice vive en tu propio dispositivo. No hay una base de
              datos vectorial externa que mantener ni a la que confiarle una copia de tu
              información indexada.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo lo implementa Hito, en concreto",
        body: (
          <>
            <p>
              Para que esto no quede en teoría, así es como funciona el RAG de Hito, verificado
              directamente contra el código:
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Qué se indexa
            </h3>
            <p>
              Cuando activas la búsqueda semántica, Hito recorre tu workspace y convierte en
              texto descriptivo cada: producto, proyecto, tarea, área, ítem de checklist,
              persona, plantilla de checklist, plantilla de proceso, tipo de proyecto y
              automatización. Por ejemplo, una tarea se convierte en algo como{" "}
              <code>"Tarea: Revisar contrato — Descripción: pendiente de firma legal"</code>{" "}
              antes de generar su embedding.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Cómo se generan los embeddings
            </h3>
            <p>
              Cada uno de esos textos se envía al modelo <code>gemini-embedding-001</code> de
              Google, que devuelve la lista de números correspondiente. La indexación es{" "}
              <strong>incremental</strong>: si una tarea no cambió desde la última vez que se
              indexó, Hito no vuelve a pedir su embedding — ahorra llamadas a la API y hace que
              reindexar sea rápido después de la primera vez.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Dónde vive el índice
            </h3>
            <p>
              Los embeddings resultantes se guardan en <strong>IndexedDB</strong>, la base de
              datos incorporada en tu navegador — no en un servidor de Hito (que no existe) ni
              en una base de datos vectorial de terceros.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Cómo se busca
            </h3>
            <p>
              Cuando preguntas algo, tu pregunta se convierte en su propio embedding y se
              compara contra todos los guardados usando <strong>similitud coseno</strong>,
              calculada a mano en JavaScript puro, sin ninguna librería externa de búsqueda
              vectorial. Es una búsqueda lineal (recorre todos los embeddings uno por uno), no
              una estructura optimizada tipo ANN — funciona bien para el volumen de datos de un
              workspace personal o de equipo chico, pero no es la arquitectura de un buscador a
              escala de miles de millones de documentos.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Cómo se activa
            </h3>
            <p>
              Todo esto se controla desde Ajustes: hay un interruptor para activar RAG, un
              estado visible (sin datos, indexando, actualizado, parcial, error), una barra de
              progreso y botones para cancelar o borrar el índice completo. No pasa nada en
              segundo plano sin que lo actives explícitamente.
            </p>
          </>
        ),
      },
      {
        heading: "La aclaración honesta que no podemos saltarnos",
        body: (
          <>
            <p>
              "RAG local" describe dónde vive el índice ya calculado — no que absolutamente nada
              toque un servidor externo en todo el proceso. Para generar cada embedding, el
              texto de tu tarea o proyecto se envía a la API de Google (
              <code>embedContent</code>) con tu propia API key. Es el mismo viaje de datos que
              ya existe cuando usas el chat del asistente,{" "}
              <a
                href="https://hito.autos/blogs/que-es-mcp"
                target="_blank"
                rel="noopener noreferrer"
              >
                explicado en detalle en nuestro post sobre MCP
              </a>
              .
            </p>
            <p>
              Lo que sí es enteramente local: el índice resultante (las listas de números y a
              qué entidad corresponden) vive únicamente en tu navegador, y la búsqueda posterior
              —comparar tu pregunta contra ese índice— ocurre completamente en tu máquina, sin
              ninguna llamada de red adicional. Si nunca activas el asistente ni el RAG, ninguno
              de tus datos sale de tu equipo.
            </p>
          </>
        ),
      },
      {
        heading: "RAG local vs RAG en la nube",
        body: (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left">
                <th className="py-2 pr-4 font-semibold"></th>
                <th className="py-2 pr-4 font-semibold">RAG local (Hito)</th>
                <th className="py-2 font-semibold">RAG en la nube (típico enterprise)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">Dónde vive el índice</td>
                <td className="py-2 pr-4">IndexedDB, en tu navegador</td>
                <td className="py-2">
                  Base de datos vectorial gestionada (Pinecone, Weaviate…)
                </td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">Quién administra el índice</td>
                <td className="py-2 pr-4">Nadie — es un archivo de tu navegador</td>
                <td className="py-2">Un proveedor externo</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">Búsqueda</td>
                <td className="py-2 pr-4">Cosine similarity en JS, lineal</td>
                <td className="py-2">Búsqueda vectorial optimizada (ANN), a escala</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">Generación de embeddings</td>
                <td className="py-2 pr-4">Vía API de Gemini, con tu propia key</td>
                <td className="py-2">Vía API del proveedor de IA elegido por la empresa</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">Escala recomendada</td>
                <td className="py-2 pr-4">Workspace personal o de equipo chico</td>
                <td className="py-2">Miles a millones de documentos</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Costo de licencia adicional</td>
                <td className="py-2 pr-4">Ninguno</td>
                <td className="py-2">Suele ser un servicio de pago aparte</td>
              </tr>
            </tbody>
          </table>
        ),
      },
      {
        heading: "Conclusión",
        body: (
          <>
            <p>
              RAG no es magia: es buscar lo relevante antes de responder, en lugar de intentar
              que el modelo lo sepa todo de memoria. Que sea "local" cambia una cosa importante
              — dónde vive el índice resultante y quién lo administra — sin cambiar el hecho de
              que generar embeddings requiere, hoy, una llamada a una API externa.
            </p>
            <p>
              Si quieres ver esto funcionando sobre tus propios datos, activa la búsqueda
              semántica en Ajustes y prueba a{" "}
              <a
                href="https://hito.autos/blogs/prompts-gestion-proyectos-ia"
                target="_blank"
                rel="noopener noreferrer"
              >
                pedirle al asistente
              </a>{" "}
              que busque algo que escribiste hace semanas sin usar las palabras exactas — vas a
              notar la diferencia entre buscar por palabra clave y buscar por significado.
            </p>
            <p>
              👉{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                <strong>Prueba Hito gratis</strong>
              </a>{" "}
              — gestor de proyectos, procesos y checklists 100% local-first, con un asistente de
              IA y RAG opcionales que tú controlas con tu propia API key.
            </p>
          </>
        ),
      },
    ],
  },
};
