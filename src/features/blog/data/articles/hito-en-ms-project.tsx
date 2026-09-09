import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "hito-en-ms-project",
  title: "Hito en MS Project: qué es y cómo crearlo paso a paso",
  excerpt:
    "Qué es un hito en MS Project (duración cero, rombo en el Gantt), cómo crearlo en 6 pasos, el truco del «Marcar como hito» y los límites de la herramienta para equipos pequeños.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-07",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "hito-project-gestion-por-hitos",
  related: [
    "hito-project-gestion-por-hitos",
    "diagrama-de-hitos",
    "alternativa-a-ms-project",
  ],
  seo: {
    title: "Hito en MS Project: qué es y cómo crearlo paso a paso | Hito",
    description:
      "Hito en MS Project: qué es (duración cero, símbolo rombo), cómo crearlo y marcarlo en 6 pasos, hitos periódicos y límites de la herramienta.",
    ogImageAlt:
      "Hito con símbolo de rombo en el diagrama de Gantt de MS Project.",
  },
  content: {
    eyebrow: "Hitos",
    intro: (
      <>
        <strong>En una línea:</strong> un hito en MS Project (Microsoft Project) es una tarea de
        duración cero que aparece como un rombo en el Gantt y marca un punto de control: algo se
        logró o se aprobó. Aquí tienes cómo crearlo paso a paso, el truco del rombo y sus
        límites.
      </>
    ),
    howTo: {
      name: "Cómo crear un hito en MS Project",
      steps: [
        {
          name: "Ubica la fila donde va el hito",
          text: "El hito se coloca en el punto exacto donde el proyecto cambia de estado: al final de la fase que cierra o justo después de la tarea que lo hace verificable.",
        },
        {
          name: "Inserta la tarea y nómbrala como el hito",
          text: "Escribe el hito como una tarea más, con un nombre que declare el logro: «Aprobación del cliente», no «reunión» ni «fase 1».",
        },
        {
          name: "Pon la duración en 0 días",
          text: "Escribe 0d en la columna Duración. La tarea se convierte en hito y el diagrama de Gantt muestra el rombo negro. Si la tarea necesita duración, marca la casilla «Marcar como hito» en Información de la tarea.",
        },
        {
          name: "Fija la fecha restringiéndola o ligándola",
          text: "Usa la restricción «Debe empezar el...» (doble clic en la tarea → Información de la tarea → pestaña Avanzadas) o enlaza el hito a su antecesor para que la fecha salga de las dependencias reales del plan.",
        },
        {
          name: "Enlaza el hito con la tarea que lo hace verificable",
          text: "Crea la dependencia (fin a inicio) entre la tarea que produce la evidencia y el hito: así el rombo se mueve solo si el plan cambia, sin fechas huérfanas.",
        },
        {
          name: "Repite para los hitos periódicos",
          text: "Para hitos que se repiten —informe mensual, comité de seguimiento—, créalos como tareas recurrentes o duplica el hito con la restricción de fecha correspondiente en cada ciclo.",
        },
      ],
    },
    sections: [
      {
        heading: "Qué es un hito en MS Project (Microsoft Project)",
        body: (
          <>
            <p>
              Un <strong>hito en MS Project (Microsoft Project)</strong> es una tarea de
              duración cero: un instante en el plan que marca que algo se logró —una aprobación,
              una entrega, un arranque—. En el diagrama de Gantt se dibuja como un{" "}
              <strong>rombo negro</strong>, y esa es su gracia: donde las tareas pintan barras
              que duran días, Project reserva el rombo para los puntos de control que no consumen
              trabajo. Y una aclaración por si llegaste por otra ruta: aquí hablamos de hitos de
              proyecto, no del hito histórico.
            </p>
            <p>
              Conceptualmente es el mismo hito de siempre: sin duración, con criterio y con
              evidencia. Project solo le da una representación concreta en el plan. La vista de
              solo mojones —sin barras, para mostrar al cliente— tiene su propio artículo en{" "}
              <Link to="/blogs/diagrama-de-hitos" className="underline underline-offset-2">
                el diagrama de hitos
              </Link>
              ; aquí vamos a la mecánica concreta de la herramienta.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo crear un hito en MS Project, paso a paso",
        body: (
          <>
            <p>El procedimiento completo, en seis pasos:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Ubica la fila donde va el hito.</strong> Colócalo en el punto exacto
                donde el proyecto cambia de estado: al final de la fase que cierra o justo
                después de la tarea que produce la evidencia del logro.
              </li>
              <li>
                <strong>Inserta la tarea y nómbrala como el hito.</strong> Escribe el hito como
                una tarea más, con un nombre que declare el logro: «Aprobación del cliente»,
                «Plan firmado», «Beta publicada». Si el nombre no declara un logro, el rombo no
                sirve.
              </li>
              <li>
                <strong>Pon la duración en 0 días.</strong> Escribe 0d en la columna Duración:
                la tarea se convierte en hito y el Gantt muestra el rombo. Si necesitas que tenga
                duración, marca la casilla «Marcar como hito» en Información de la tarea (doble
                clic sobre la fila).
              </li>
              <li>
                <strong>Fija la fecha restringiéndola o ligándola.</strong> Usa la restricción
                «Debe empezar el...» —doble clic en la tarea → Información de la tarea →
                Avanzadas— cuando la fecha venga del cliente o de un contrato, o enlaza el hito a
                su antecesor para que la fecha salga de las dependencias reales.
              </li>
              <li>
                <strong>Enlaza el hito con la tarea que lo hace verificable.</strong> Crea la
                dependencia fin a inicio entre la tarea que produce la evidencia y el hito. Así,
                si el plan se mueve, el rombo se mueve con él y no quedan fechas huérfanas.
              </li>
              <li>
                <strong>Repite para los hitos periódicos.</strong> Un informe mensual o un comité
                de seguimiento son hitos que se repiten: créalos como tareas recurrentes o
                duplica el hito en cada ciclo con su restricción de fecha, y el plan queda
                salpicado de rombos en los puntos de control.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Hito de duración cero vs hito con duración",
        body: (
          <>
            <p>
              Project permite dos formas de marcar un hito, y conviene saber cuándo usar cada
              una. La segunda es un truco, no la norma:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Criterio</th>
                  <th className="py-2 pr-4 font-semibold">Duración 0 días</th>
                  <th className="py-2 font-semibold">
                    Tarea con «Marcar como hito»
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Símbolo en el Gantt</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Rombo negro puro, sin barra.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Rombo con barra: muestra también su duración.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Uso típico</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Aprobaciones, entregas, arranques y cierres: el uso canónico.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Revisiones o informes que ocupan tiempo real y cuyo cierre es el punto de
                    control.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Riesgo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Ninguno: es la forma que Project espera.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Se confunde con tarea si el equipo no conoce la convención del rombo con
                    barra.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Mi recomendación: duración cero por defecto, y la casilla «Marcar como hito» solo
              cuando el punto de control necesite un lapso —una semana de pruebas de aceptación,
              por ejemplo— y quieras ver ese lapso en el plan.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo: un plan con 4 hitos y sus dependencias",
        body: (
          <>
            <p>
              Un proyecto de implementación de un CRM con cuatro rombos. La columna clave es la
              dependencia: es lo que hace que el plan se audite a sí mismo.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Hito</th>
                  <th className="py-2 pr-4 font-semibold">Se verifica cuando</th>
                  <th className="py-2 font-semibold">Depende de</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Kickoff</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Acta firmada y equipo con accesos al sistema.
                  </td>
                  <td className="py-2 text-muted-foreground">—</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Plan aprobado</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Alcance, cronograma y presupuesto firmados.
                  </td>
                  <td className="py-2 text-muted-foreground">Kickoff</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Migración de datos validada
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Conteo de registros cuadrado al 100 % contra el sistema antiguo.
                  </td>
                  <td className="py-2 text-muted-foreground">Plan aprobado</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Aceptación final</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cliente firma la conformidad del go-live.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Migración de datos validada
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Esa cadena de dependencias es justo la que alimenta la{" "}
              <Link
                to="/blogs/ruta-critica-proyecto"
                className="underline underline-offset-2"
              >
                ruta crítica del proyecto
              </Link>
              : si la migración se atrasa una semana, Project recalcula y la aceptación final se
              atrasa una semana. El plan deja de ser un dibujo y empieza a razonar.
            </p>
          </>
        ),
      },
      {
        heading: "Los límites de MS Project para equipos pequeños",
        body: (
          <>
            <p>
              Para lo que fue diseñado —planificación pesada de recursos en proyectos grandes—,
              Project es excelente. Pero para un equipo pequeño que solo necesita marcar hitos y
              avanzar, hay tres límites prácticos:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Precio por licencia.</strong> Se paga suscripción por usuario y mes, y
                para que un equipo de cinco lo use de verdad suelen hacer falta varias licencias:
                un costo anual considerable para marcar rombos y barras.
              </li>
              <li>
                <strong>Curva de aprendizaje.</strong> Restricciones, tipos de tarea, líneas
                base, calendarios: Project es potente precisamente porque expone conceptos que
                exigen estudio formal. Para cuatro mojones, es mucha maquinaria.
              </li>
              <li>
                <strong>Escritorio y Windows.</strong> La versión completa es de escritorio y
                Windows; la versión web es más limitada y ata el plan a la nube de Microsoft,
                justo lo que muchos equipos pequeños quieren evitar.
              </li>
            </ul>
            <p>
              Si tu equipo es de 1 a 15 personas y necesitas hitos, tareas y visibilidad sin esa
              maquinaria, vale la pena mirar una{" "}
              <Link
                to="/blogs/alternativa-a-ms-project"
                className="underline underline-offset-2"
              >
                alternativa a MS Project
              </Link>{" "}
              más ligera. Y si quieres que los hitos emerjan solos de la estructura del trabajo
              —Producto → Proyecto → Área → Proceso/Checklist → Tarea, sin módulo de milestones
              que configurar—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              lo hace con JSON local, sin cuenta ni suscripciones, y con IA opcional si aportas
              tu propia API key.
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
              — los puntos de control sin la curva de aprendizaje, local-first y offline.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un hito en MS Project?",
        answer:
          "Una tarea de duración cero que marca un punto de control: algo se logró o se aprobó en un instante. En el diagrama de Gantt se muestra como un rombo negro. Sirve para anclar aprobaciones, entregas y cierres del plan sin consumir trabajo ni recursos del equipo.",
      },
      {
        question: "¿Cómo se crea un hito en MS Project paso a paso?",
        answer:
          "Inserta una tarea con nombre de logro («Aprobación del cliente»), ponle duración 0 días —o marca la casilla «Marcar como hito» si necesita duración—, fija su fecha con una restricción «Debe empezar el...» o ligándola a su antecesor, enlázala con la tarea que la hace verificable y repite el esquema con tareas recurrentes para hitos periódicos.",
      },
      {
        question: "¿Por qué un hito tiene duración cero?",
        answer:
          "Porque un hito no es trabajo: es el instante en que se confirma un logro. La tarea «elaborar el plan» dura días; «plan aprobado» ocurre en un momento y con evidencia. La duración cero obliga a esa disciplina y evita que los puntos de control absorban esfuerzo real del equipo.",
      },
      {
        question: "¿Cómo se pone el símbolo de hito (rombo) en Project?",
        answer:
          "El rombo aparece automáticamente cuando la duración de la tarea es 0 días, o cuando activas la casilla «Marcar como hito» en Información de la tarea (doble clic sobre la fila). Si no lo ves, revisa que la columna Duración esté en 0d y que estés en la vista del diagrama de Gantt con barras.",
      },
      {
        question:
          "¿Cuál es la diferencia entre un hito y una tarea resumen en Project?",
        answer:
          "La tarea resumen agrupa un bloque de tareas y su barra dura lo que dura el bloque; sirve para organizar el plan en fases. El hito es un instante de control sin duración. Un plan serio usa las dos: resúmenes para las fases y rombos de aprobación marcando los logros dentro y al final de cada fase.",
      },
    ],
  },
};
