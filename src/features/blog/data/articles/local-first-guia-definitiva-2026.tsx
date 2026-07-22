import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
  slug: "local-first-guia-definitiva-2026",
  title: "Local-first: la guía definitiva (2026)",
  excerpt:
    "Descubre qué es el software local-first, cómo se diferencia de la nube y qué herramientas puedes usar hoy. Guía honesta con ejemplos reales.",
  category: "privacidad",
  categoryLabel: "Privacidad",
  publishedAt: "2026-08-17",
  readingTime: "10 min",
  featured: false,
  seo: {
    title: "Local-first: qué es y cómo funciona en 2026 — Hito",
    description:
      "Descubre qué es el software local-first, cómo se diferencia de la nube y qué herramientas puedes usar hoy. Guía honesta con ejemplos reales.",
    ogImageAlt: "Guía definitiva de software local-first en 2026.",
  },
  content: {
    eyebrow: "Privacidad",
    intro: (
      <>
        <strong>En una línea:</strong> el software <em>local-first</em> guarda tus datos en tu
        dispositivo, no en un servidor. Funciona sin internet, no necesita cuenta y tú eres
        dueño de lo que creas. Pero no es magia: tiene trade-offs reales que conviene entender
        antes de migrar.
      </>
    ),
    sections: [
      {
        heading: "¿Qué es local-first?",
        body: (
          <>
            <p>
              El término nació en 2019, cuando el laboratorio de investigación{" "}
              <strong>Ink &amp; Switch</strong> publicó un ensayo fundacional titulado{" "}
              <em>"Local-first software: You own your data, in spite of the cloud"</em>. Los
              autores — incluyendo a Martin Kleppmann, investigador de la Universidad de
              Cambridge — propusieron un conjunto de principios para software colaborativo donde{" "}
              <strong>el dispositivo del usuario es la fuente de verdad</strong>, no un servidor
              remoto.
            </p>
            <p>Los 7 principios del ensayo original (resumidos):</p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">#</th>
                  <th className="py-2 pr-4 font-semibold">Principio</th>
                  <th className="py-2 font-semibold">Qué significa</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">1</td>
                  <td className="py-2 pr-4 font-medium">Tus datos están en tu dispositivo</td>
                  <td className="py-2">
                    El archivo real vive localmente, no es una caché de la nube
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">2</td>
                  <td className="py-2 pr-4 font-medium">Funciona offline, sin advertencias</td>
                  <td className="py-2">No necesitas conexión para leer, escribir o editar</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">3</td>
                  <td className="py-2 pr-4 font-medium">Permanencia local</td>
                  <td className="py-2">Si la empresa cierra, tus datos siguen en tu disco</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">4</td>
                  <td className="py-2 pr-4 font-medium">Sin vendor lock-in</td>
                  <td className="py-2">
                    Los datos están en formatos abiertos o legibles, no atrapados en un servidor
                    propietario
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">5</td>
                  <td className="py-2 pr-4 font-medium">Colaboración cuando la hay</td>
                  <td className="py-2">
                    Si quieres sincronización, es opcional — no obligatoria ni centralizada
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">6</td>
                  <td className="py-2 pr-4 font-medium">Rendimiento instantáneo</td>
                  <td className="py-2">
                    Leer y escribir en disco local es más rápido que hacer roundtrips a un
                    servidor
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">7</td>
                  <td className="py-2 pr-4 font-medium">Facilidad de uso</td>
                  <td className="py-2">
                    La experiencia no debería ser peor que la de una app de nube
                  </td>
                </tr>
              </tbody>
            </table>
            <blockquote className="border-l-2 border-border/60 pl-4 italic">
              <strong>Fuente:</strong> Ink &amp; Switch,{" "}
              <em>"Local-first software: You own your data, in spite of the cloud"</em> (2019).
              Disponible en{" "}
              <a
                href="https://www.inkandswitch.com/essay/local-first/"
                target="_blank"
                rel="noopener noreferrer"
              >
                inkandswitch.com/essay/local-first
              </a>
              .
            </blockquote>
            <p>
              La idea no es nueva — los documentos de escritorio siempre fueron locales. Lo que
              cambió es que ahora existe la tecnología para tener{" "}
              <strong>software colaborativo que también es local</strong>. Eso incluye CRDTs
              (tipos de datos replicados sin conflictos), sync engines y APIs modernas de acceso
              al filesystem del navegador.
            </p>
          </>
        ),
      },
      {
        heading: "Local-first vs cloud-first vs offline-first",
        body: (
          <>
            <p>
              Estos tres términos suenan parecidos pero describen arquitecturas distintas. Esta
              es la diferencia:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Aspecto</th>
                  <th className="py-2 pr-4 font-semibold">Cloud-first</th>
                  <th className="py-2 pr-4 font-semibold">Offline-first</th>
                  <th className="py-2 font-semibold">Local-first</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Fuente de verdad</td>
                  <td className="py-2 pr-4">El servidor</td>
                  <td className="py-2 pr-4">El servidor (caché local temporal)</td>
                  <td className="py-2">Tu dispositivo</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Sin internet</td>
                  <td className="py-2 pr-4">No funciona</td>
                  <td className="py-2 pr-4">Funciona parcialmente (caché)</td>
                  <td className="py-2">Funciona completo</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Si la empresa cierra</td>
                  <td className="py-2 pr-4">Pierdes todo</td>
                  <td className="py-2 pr-4">Pierdes todo (sin servidor)</td>
                  <td className="py-2">Tus datos siguen</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Colaboración</td>
                  <td className="py-2 pr-4">Nativa (tiempo real)</td>
                  <td className="py-2 pr-4">Se sincroniza al reconectar</td>
                  <td className="py-2">Opcional, sin servidor central</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Cuenta requerida</td>
                  <td className="py-2 pr-4">Sí</td>
                  <td className="py-2 pr-4">Sí</td>
                  <td className="py-2">No</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Ejemplo típico</td>
                  <td className="py-2 pr-4">Google Docs, Trello, Notion</td>
                  <td className="py-2 pr-4">Progresivas web apps con service worker</td>
                  <td className="py-2">Obsidian, Joplin, Hito</td>
                </tr>
              </tbody>
            </table>
            <p>
              La diferencia clave:{" "}
              <strong>offline-first sigue teniendo un servidor como dueño de los datos</strong>.
              El modo offline es una caché temporal. En cambio, local-first invierte la
              relación: el servidor (si existe) es un espejo, no el original.
            </p>
          </>
        ),
      },
      {
        heading: "El estado del movimiento en 2026",
        body: (
          <>
            <p>
              Siete años después del ensayo de Ink &amp; Switch, el local-first pasó de ser una
              idea académica a un ecosistema con herramientas reales, conferencias dedicadas y
              librerías maduras.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Señales de adopción
            </h3>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>FOSDEM 2026</strong> incluye un devroom completo dedicado a local-first,
                CRDTs y sync engines — un espacio que compite con temas como Rust y WebAssembly.
              </li>
              <li>
                <strong>Smashing Magazine</strong> publicó en mayo 2026 un artículo sobre la
                arquitectura local-first en desarrollo web, con una perspectiva honesta:
                funciona, pero tiene{" "}
                <a
                  href="https://www.smashingmagazine.com/2026/05/architecture-local-first-web-development/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  trade-offs reales
                </a>{" "}
                que la mayoría de tutoriales ignoran.
              </li>
              <li>
                Librerías como <strong>Automerge</strong> y <strong>Yjs</strong> son estables y
                se usan en producción en herramientas como Notion (internamente), Logseq y Zed.
              </li>
              <li>
                Múltiples sync engines compiten por ser el <em>"Firebase de local-first"</em> —
                algunos open source (PowerSync, Electric), otros propietarios.
              </li>
            </ul>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Lo que todavía duele
            </h3>
            <p>La comunidad es honesta sobre los problemas:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Colaboración en tiempo real es difícil.</strong> Los CRDTs resuelven
                conflictos de edición, pero la experiencia de ver a otro cursor moverse en
                tiempo real es más compleja que con un servidor central.
              </li>
              <li>
                <strong>Mobile tiene limitaciones.</strong> La File System Access API de Chrome
                no funciona en iOS Safari. Las apps nativas lo resuelven mejor que las PWAs.
              </li>
              <li>
                <strong>Backup sigue siendo tu responsabilidad.</strong> Si tu disco se rompe y
                no tenías un backup, los datos se pierden. La nube resolvía esto "gratis".
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Herramientas local-first que existen hoy",
        body: (
          <>
            <p>No es un concepto teórico. Hay herramientas de producción que funcionan así:</p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Herramienta</th>
                  <th className="py-2 pr-4 font-semibold">Tipo</th>
                  <th className="py-2 pr-4 font-semibold">Local-first real?</th>
                  <th className="py-2 font-semibold">Nota</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Hito</td>
                  <td className="py-2 pr-4">Gestión de proyectos</td>
                  <td className="py-2 pr-4">✅ Sí</td>
                  <td className="py-2">JSON local, sin backend, PWA offline</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Obsidian</td>
                  <td className="py-2 pr-4">Notas / knowledge base</td>
                  <td className="py-2 pr-4">✅ Sí</td>
                  <td className="py-2">Archivos Markdown en disco, plugins opcionales</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Anytype</td>
                  <td className="py-2 pr-4">Todo (notion-like)</td>
                  <td className="py-2 pr-4">⚠️ Parcial</td>
                  <td className="py-2">
                    Local-first pero <em>source-available</em>, no open source
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Logseq</td>
                  <td className="py-2 pr-4">Notas outliner</td>
                  <td className="py-2 pr-4">✅ Sí</td>
                  <td className="py-2">Archivos org-mode local, sync opcional</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Joplin</td>
                  <td className="py-2 pr-4">Notas</td>
                  <td className="py-2 pr-4">✅ Sí</td>
                  <td className="py-2">Open source, sync opcional via DropBox/WebDAV</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">AppFlowy</td>
                  <td className="py-2 pr-4">Notion-like</td>
                  <td className="py-2 pr-4">✅ Sí</td>
                  <td className="py-2">Open source (AGPLv3), Flutter nativo</td>
                </tr>
              </tbody>
            </table>
            <p>
              La mayoría comparte un patrón: guardan tus datos en archivos legibles en tu disco,
              ofrecen sync opcional (sin obligar) y no requieren cuenta para usarlos.
            </p>
            <p>
              Si quieres ver comparativas más detalladas de algunas de estas herramientas,
              tenemos posts sobre{" "}
              <a
                href="https://hito.autos/blogs/alternativas-a-notion"
                target="_blank"
                rel="noopener noreferrer"
              >
                alternativas a Notion
              </a>{" "}
              y{" "}
              <a
                href="https://hito.autos/blogs/hito-vs-trello"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hito vs Trello
              </a>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Trade-offs honestos: lo que local-first NO resuelve",
        body: (
          <>
            <p>
              Antes de emocionarte (y nosotros somos un proyecto local-first, así que nos
              emociona), hay que ser honesto sobre lo que <strong>no</strong> funciona bien:
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Lo que se pierde
            </h3>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Colaboración en tiempo real fluida.</strong> Si tu equipo necesita
                editar el mismo documento simultáneamente y ver cambios al instante, un servidor
                central (Google Docs, Notion) lo hace mejor hoy. Las herramientas local-first
                están mejorando, pero todavía no es su punto fuerte.
              </li>
              <li>
                <strong>Setup inicial.</strong> En una app de nube, entras, creas cuenta y
                listo. En local-first, necesitas elegir dónde guardar tus archivos, configurar
                sync si quieres colaboración, y planificar backups. Es más fricción inicial.
              </li>
              <li>
                <strong>Múltiples dispositivos sin sync.</strong> Si trabajas en la PC de la
                oficina y la laptop de casa sin ningún mecanismo de sincronización, vas a tener
                versiones desactualizadas. La solución típica es usar Dropbox, Google Drive o
                Git — pero eso agrega complejidad.
              </li>
              <li>
                <strong>IA asistida requiere enviar datos.</strong> Esto vale la pena destacarlo
                porque es un punto de confusión. Si usas un asistente de IA integrado (como el
                de Hito), tus datos se envían al modelo de IA (en nuestro caso, Gemini, con tu
                propia API key). El storage sigue siendo local, pero la IA necesita ver tus
                datos para ayudarte. Es un trade-off consciente: puedes simplemente no activar
                el asistente si tus datos son extremadamente sensibles. Si quieres entender cómo
                funciona esto a nivel técnico, tienes nuestro post sobre{" "}
                <a
                  href="https://hito.autos/blogs/que-es-mcp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Qué es MCP
                </a>
                .
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Cómo funciona Hito como caso real",
        body: (
          <>
            <p>
              Para que no sea todo teoría, acá va cómo se ve local-first en la práctica con
              Hito:
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Arquitectura de almacenamiento
            </h3>
            <p>Hito usa dos adaptadores de almacenamiento, dependiendo de tu navegador:</p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Adaptador</th>
                  <th className="py-2 pr-4 font-semibold">Navegador</th>
                  <th className="py-2 font-semibold">Cómo funciona</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">FileSystemAdapter</td>
                  <td className="py-2 pr-4">Chrome, Edge, Brave</td>
                  <td className="py-2">
                    Usa la File System Access API para leer y escribir archivos JSON
                    directamente en la carpeta que elegiste. Persiste el acceso entre sesiones
                    usando IndexedDB.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">DownloadAdapter</td>
                  <td className="py-2 pr-4">Firefox, Safari, móvil</td>
                  <td className="py-2">
                    Como fallback, descarga archivos JSON individuales y pide que subas archivos
                    cuando quieres cargar. Más manual pero funcional.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              En ambos casos, cada entidad (proyecto, tarea, persona, etc.) es un archivo{" "}
              <code>.json</code> separado y legible. No hay una base de datos propietaria ni un
              servidor al que consultar.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Offline
            </h3>
            <p>
              Hito es una <strong>Progressive Web App (PWA)</strong> con service worker. Eso
              significa que la aplicación se instala en tu navegador y funciona sin conexión.
              Tus datos están en disco, no en la nube, así que no necesitas internet para crear
              tareas, mover tarjetas en el kanban o editar procesos.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Sync (opcional)
            </h3>
            <p>
              No hay servidor de sync. Si quieres compartir tu workspace con el equipo, pones la
              carpeta en Dropbox, Google Drive o Git, y cada persona abre esa misma carpeta con
              Hito. Es sync a nivel de archivos, no a nivel de registros — simple, transparente
              y sin intermediarios.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              IA (opcional)
            </h3>
            <p>
              El asistente usa Gemini con tu propia API key. Si lo activas, envía datos de tu
              workspace a Google para generar respuestas. Si no lo activas, Hito nunca se
              comunica con ningún servidor externo.
            </p>
          </>
        ),
      },
      {
        heading: "¿Te conviene local-first?",
        body: (
          <>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Sí, si:
            </h3>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Manejas datos sensibles:</strong> información legal, médica, financiera
                o de clientes que no debería estar en un servidor de terceros.
              </li>
              <li>
                <strong>Quieres control total sobre tus datos:</strong> no te gusta que una
                empresa pueda cerrar tu cuenta, cambiar los precios o perder tus datos por un
                breach.
              </li>
              <li>
                <strong>Trabajas solo o en equipos pequeños-medianos:</strong> la fricción de
                sync no es tan grande.
              </li>
              <li>
                <strong>Valoras el offline:</strong> viajas mucho, trabajas en lugares con mala
                conexión o simplemente no quieres depender del WiFi.
              </li>
              <li>
                <strong>Te interesa el open source:</strong> poder auditar el código que maneja
                tus datos.
              </li>
            </ul>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Probablemente no, si:
            </h3>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Colaboración en tiempo real es crítica:</strong> tu equipo edita
                documentos simultáneamente y necesita ver cambios al instante (Google Docs sigue
                siendo mejor para eso).
              </li>
              <li>
                <strong>No quieres pensar en backups:</strong> si no tienes un hábito de
                respaldar tus archivos, la nube te da un safety net que local-first no tiene por
                defecto.
              </li>
              <li>
                <strong>Tu equipo es grande y distribuido:</strong> sin una estrategia de sync
                clara, vas a tener problemas de versiones.
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
              El software local-first no es una vuelta al pasado ni una utopía anti-nube. Es un
              punto intermedio:{" "}
              <strong>
                tus datos viven en tu dispositivo, pero puedes elegir si y cómo sincronizarlos
              </strong>
              . En 2026 ya hay herramientas maduras que lo implementan bien, y el ecosistema
              sigue creciendo (FOSDEM, librerías estables, nuevas apps).
            </p>
            <p>
              El trade-off es real: ganas privacidad, control y offline, pero pierdes algo de la
              fluidez colaborativa de las apps de nube. Para muchos equipos — especialmente los
              que manejan datos sensibles — el intercambio vale la pena.
            </p>
            <p>
              Si quieres probar cómo se siente,{" "}
              <a href="https://hito.autos" target="_blank" rel="noopener noreferrer">
                Hito es gratis, open source y no necesita cuenta
              </a>
              . Eliges una carpeta, creas tu primer proyecto y listo. Tus datos quedan ahí, en
              tu disco, sin intermediarios.
            </p>
            <p>
              <strong>Sobre Hito:</strong> Gestión de proyectos, procesos y checklists 100%
              local-first. Open source (MIT), sin nube, sin cuenta, sin suscripción.{" "}
              <a href="https://hito.autos" target="_blank" rel="noopener noreferrer">
                <strong>Pruébalo gratis →</strong>
              </a>
            </p>
          </>
        ),
      },
    ],
  },
};
