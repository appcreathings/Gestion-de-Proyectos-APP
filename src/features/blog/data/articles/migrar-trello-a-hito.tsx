import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
  slug: "migrar-trello-a-hito",
  title: "Cómo migrar de Trello a Hito (guía honesta, paso a paso)",
  excerpt:
    "Guía honesta para migrar de Trello a Hito: tabla de mapeo verificada, paso a paso y qué hacer con los datos sin equivalente directo. Sin promesas falsas.",
  category: "implementacion",
  categoryLabel: "Implementación",
  publishedAt: "2026-08-03",
  readingTime: "9 min",
  featured: false,
  seo: {
    title: "Cómo migrar de Trello a Hito (guía honesta, paso a paso) — Hito",
    description:
      "Guía honesta para migrar de Trello a Hito: tabla de mapeo verificada, paso a paso y qué hacer con los datos sin equivalente directo. Sin promesas falsas.",
    ogImageAlt: "Migración de Trello a Hito paso a paso.",
  },
  content: {
    eyebrow: "Implementación",
    intro: (
      <>
        <strong>En una línea:</strong> Hito no tiene import automático desde Trello (todavía).
        La migración es manual: exportas tu board de Trello como JSON de referencia y lo
        reconstruyes en Hito aprovechando su modelo de datos más estructurado. Aquí está el
        mapeo campo a campo y el paso a paso.
      </>
    ),
    sections: [
      {
        heading: "Antes de empezar: no hay botón mágico (aún)",
        body: (
          <>
            <p>
              Si has llegado hasta aquí, probablemente ya te has decidido por Hito (quizás desde
              nuestra comparativa{" "}
              <a
                href="https://hito.autos/blogs/hito-vs-trello"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hito vs Trello
              </a>{" "}
              o desde el post de{" "}
              <a
                href="https://hito.autos/blogs/alternativas-a-notion"
                target="_blank"
                rel="noopener noreferrer"
              >
                alternativas a Notion
              </a>
              ). Ahora viene la parte práctica: ¿cómo llevo mis boards de Trello sin perder
              datos?
            </p>
            <p>
              Vamos a ser honestos desde el primer segundo para que no pierdas tiempo buscando
              algo que no existe.
            </p>
            <p>
              Hito <strong>no tiene función nativa de import desde Trello</strong>. Lo decimos
              claro porque preferimos que lo sepas antes de empezar, y no después de media hora
              buscando en menús.
            </p>
            <p>
              ¿Por qué no existe? Principalmente porque el modelo de datos de Hito es más
              estructurado que el de Trello. Trello esencialmente tiene boards → listas →
              tarjetas, con libertad total. Hito tiene productos → proyectos → áreas → procesos
              (SOPs), checklists y tareas con estados y prioridades fijas. Un mapeo automático
              tendría que adivinar mucho: ¿esta lista de Trello es un estado o un área? ¿estos
              miembros son personas o roles? Esas decisiones las tomas mejor tú, que conoces tu
              board.
            </p>
            <p>
              La buena noticia: la migración manual es una{" "}
              <strong>oportunidad para limpiar y reorganizar</strong> boards que probablemente
              acumularon basura con los años. Y la tabla de mapeo de abajo hace el trabajo
              predecible.
            </p>
          </>
        ),
      },
      {
        heading: "Paso 0: exporta tu board de Trello",
        body: (
          <>
            <p>
              Antes de tocar Hito, genera una referencia exportable de tu board de Trello. Este
              paso es de Trello, no de Hito:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Abre el board en Trello.</li>
              <li>
                Menú (⋯) → <strong>Print, export, and share</strong>.
              </li>
              <li>
                Elige <strong>Export as JSON</strong> (no el CSV de pagos; el JSON trae todo:
                cards, labels, checklists, members, comments).
              </li>
            </ol>
            <p>
              Guarda el archivo <code>.json</code>. Lo vas a usar como guía visual mientras
              reconstruyes el board en Hito.
            </p>
            <blockquote className="border-l-2 border-border/60 pl-4 italic">
              ℹ️ Solo el propietario del board o un admin puede exportar el JSON completo. Si no
              ves la opción, pedile permisos al owner.
            </blockquote>
          </>
        ),
      },
      {
        heading: "La tabla de mapeo: cada elemento de Trello → su equivalente en Hito",
        body: (
          <>
            <p>
              Este es el corazón de la migración. Lo verificamos contra el modelo de datos
              actual de Hito:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">En Trello</th>
                  <th className="py-2 pr-4 font-semibold">En Hito</th>
                  <th className="py-2 font-semibold">Notas</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Board</td>
                  <td className="py-2 pr-4">Proyecto</td>
                  <td className="py-2">
                    Un board = un proyecto. Si tienes varios boards relacionados, agrúpalos bajo
                    un mismo Producto.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">List</td>
                  <td className="py-2 pr-4">Task.status</td>
                  <td className="py-2">
                    Trello permite listas libres; Hito tiene <strong>4 estados fijos</strong>:{" "}
                    <code>todo</code>, <code>doing</code>, <code>blocked</code>,{" "}
                    <code>done</code>. Mapea tus listas al estado más cercano.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Card</td>
                  <td className="py-2 pr-4">Task</td>
                  <td className="py-2">Migra título y descripción.</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Due date</td>
                  <td className="py-2 pr-4">Task.dueDate</td>
                  <td className="py-2">
                    En Hito es fecha (<code>YYYY-MM-DD</code>), sin hora.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Label</td>
                  <td className="py-2 pr-4">Task.tags</td>
                  <td className="py-2">En Hito son strings libres (sin color propio).</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Checklist (dentro de card)</td>
                  <td className="py-2 pr-4">
                    ChecklistItem en un Checklist bajo un Área, <strong>o</strong> Subtask
                    dentro de la Task
                  </td>
                  <td className="py-2">Dos opciones según cómo quieras modelarlo.</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Member</td>
                  <td className="py-2 pr-4">Person + Task.assigneeId</td>
                  <td className="py-2">En Hito creas personas y las asignas por id.</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Comment</td>
                  <td className="py-2 pr-4">Task.comments</td>
                  <td className="py-2">Compatibles.</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Attachment</td>
                  <td className="py-2 pr-4">Sin equivalente directo</td>
                  <td className="py-2">
                    No soportado en el schema actual. Alternativa: deja el link en la
                    descripción de la tarea.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Custom fields</td>
                  <td className="py-2 pr-4">Sin equivalente directo</td>
                  <td className="py-2">
                    Alternativa: usa <code>tags</code> o registra el dato en la descripción.
                  </td>
                </tr>
              </tbody>
            </table>
            <blockquote className="border-l-2 border-border/60 pl-4 italic">
              <strong>Resumen de qué se pierde o hay que adaptar:</strong> attachments y custom
              fields. Todo lo demás tiene mapeo directo.
            </blockquote>
          </>
        ),
      },
      {
        heading: "Paso a paso de la migración",
        body: (
          <>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Paso 1 — Abre Hito y elige dónde guardar tus datos
            </h3>
            <p>
              Instala Hito desde{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                hito.autos
              </a>
              . En el primer arranque, te va a pedir una carpeta local donde guardar el
              workspace. Esa carpeta va a contener archivos <code>.json</code> legibles — uno
              por cada entidad (proyectos, tareas, checklists, etc.).
            </p>
            <blockquote className="border-l-2 border-border/60 pl-4 italic">
              💡 Elige una carpeta de Dropbox, Google Drive o un repo Git si quieres sincronizar
              o versionar después. Tus datos siguen siendo locales; la sincronización la
              controlas tú.
            </blockquote>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Paso 2 — Crea un Producto (opcional) y un Proyecto
            </h3>
            <p>
              Si tu board de Trello pertenece a una línea de trabajo más amplia (un cliente, un
              producto, un área de negocio), crea primero un <strong>Producto</strong> que
              agrupe varios proyectos. Si migras un único board, puedes saltarte el producto y
              crear directamente el <strong>Proyecto</strong> con el nombre de tu board.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Paso 3 — Define tus Áreas dentro del Proyecto
            </h3>
            <p>
              Las áreas son agrupaciones dentro de un proyecto (ej. "Diseño", "Backend",
              "Reuniones", "Inbox"). Mapean naturalmente con las listas "temáticas" de Trello —
              esas que no son estados sino categorías.
            </p>
            <p>
              Si tu board de Trello usaba listas solo como estados (Por hacer / En progreso /
              Hecho), puedes dejar un área única o crear áreas por tipo de trabajo.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Paso 4 — Migra las tarjetas como Tareas
            </h3>
            <p>
              Para cada tarjeta de tu board de Trello (puedes verlas en el JSON exportado), crea
              una <strong>Tarea</strong> en Hito con:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <code>title</code>: el nombre de la tarjeta.
              </li>
              <li>
                <code>description</code>: el contenido de la tarjeta.
              </li>
              <li>
                <code>status</code>: el estado correspondiente a la lista original (
                <code>todo</code>, <code>doing</code>, <code>blocked</code>, <code>done</code>).
              </li>
              <li>
                <code>dueDate</code>: si la tarjeta tenía fecha límite, en formato{" "}
                <code>YYYY-MM-DD</code>.
              </li>
              <li>
                <code>tags</code>: las labels de Trello, como strings.
              </li>
              <li>
                <code>assigneeId</code>: si había miembros, crea primero las{" "}
                <strong>Personas</strong> en Hito y asígnalas por id.
              </li>
            </ul>
            <p>
              Es trabajo manual, sí. Pero si tu board tiene menos de 100 tarjetas, son 30–60
              minutos de reconstrucción enfocada.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Paso 5 — Migra los checklists
            </h3>
            <p>
              Trello permite checklists dentro de tarjetas. En Hito tienes dos lugares donde
              ponerlos:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Subtasks dentro de la propia tarea</strong> — si el checklist es parte
                del trabajo de esa tarea específica.
              </li>
              <li>
                <strong>Checklist bajo un Área</strong> — si el checklist es un proceso
                recurrente (ej. "Checklist de deploy", "Revisión QA").
              </li>
            </ul>
            <p>
              Elige según el caso. Para checklists de tipo "pasos de esta tarjeta", subtasks es
              lo más natural.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Paso 6 — Haz un respaldo con exportAll
            </h3>
            <p>
              Una vez que terminaste la migración, usa la función de{" "}
              <strong>export JSON nativa de Hito</strong> (disponible en la app) para generar un
              backup completo de tu workspace. Este JSON sí es producido por Hito, así que vas a
              poder importarlo de vuelta cuando quieras restaurar o mover el workspace a otra
              máquina.
            </p>
            <p>
              Hacer este respaldo después de migrar te da una red de seguridad: si algo se rompe
              o quieres volver a este punto, tienes un snapshot limpio.
            </p>
          </>
        ),
      },
      {
        heading: "Trucos para no perder datos",
        body: (
          <>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              ¿Qué hago con los attachments?
            </h3>
            <p>El schema actual de Hito no soporta attachments. Tres opciones:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Linkealos en la descripción</strong> de la tarea (URL al documento en
                Drive, Notion, Figma, etc.).
              </li>
              <li>
                <strong>Centralizalos en una carpeta compartida</strong> y referenciala en una
                tarea pinned.
              </li>
              <li>
                <strong>Espera</strong> — los attachments están en consideración para futuras
                versiones del modelo.
              </li>
            </ol>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              ¿Qué hago con los custom fields?
            </h3>
            <p>
              Los custom fields de Trello (Business Class) tampoco tienen equivalente directo.
              Opciones:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                Migra los valores importantes a <code>tags</code>.
              </li>
              <li>
                Si eran datos estructurados (fecha, número), regístralos en la descripción.
              </li>
              <li>
                Si eran campos críticos de proceso, considera modelarlos como un{" "}
                <strong>Proceso/SOP</strong> con pasos formales.
              </li>
            </ol>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              ¿Y los miembros de varios equipos?
            </h3>
            <p>
              En Hito, las personas se modelan con la entidad <strong>Person</strong> y se
              asignan a tareas con <code>assigneeId</code>. Si tu board tenía 5 miembros, crea
              esas 5 personas en Hito y asígnalas a las tareas correspondientes. Para equipos
              grandes, esto se convierte en la parte más tediosa — pero se hace una sola vez.
            </p>
          </>
        ),
      },
      {
        heading: "Una vez migrado: respalda, sincroniza, versiona",
        body: (
          <>
            <p>
              Hito guarda todo como archivos <code>.json</code> legibles en la carpeta que
              elegiste. Esto te da tres superpoderes que Trello no tenía:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Backup manual</strong> con el export JSON nativo.
              </li>
              <li>
                <strong>Sincronización</strong> vía Dropbox, Google Drive o cualquier servicio
                que sincronice carpetas.
              </li>
              <li>
                <strong>Versionado</strong> con Git: como cada entidad es un archivo{" "}
                <code>.json</code> de texto, puedes inicializar un repo en esa carpeta y tener
                historial completo de cambios en tus proyectos. Una guía dedicada a esto viene
                próximamente.
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
              Migrar de Trello a Hito no es instantáneo, pero es predecible. Sin import
              automático, el trabajo manual te obliga a tomar decisiones que un mapeo automático
              habría tomado mal: qué es un área, qué es un estado, qué checklists son procesos
              recurrentes. El resultado suele ser un workspace más limpio y mejor organizado que
              el board original.
            </p>
            <p>
              La tabla de mapeo y los seis pasos de arriba son todo lo que necesitas. Y una vez
              migrado, el modelo local-first te devuelve control del almacenamiento: backups
              cuando quieras, sincronización donde quieras, y proyectos que viven en tu equipo
              (sin backend; el asistente IA es opcional y tú controlas la API key).
            </p>
            <p>¿Listo para empezar?</p>
            <p>
              👉{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                <strong>Prueba Hito gratis</strong>
              </a>{" "}
              — gestor de proyectos, procesos y checklists 100% local-first, open source (MIT).
              Sin cuenta, sin nube, sin suscripción.
            </p>
          </>
        ),
      },
    ],
  },
};
