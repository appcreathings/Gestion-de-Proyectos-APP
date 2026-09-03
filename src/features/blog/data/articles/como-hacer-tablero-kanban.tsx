import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "como-hacer-tablero-kanban",
  title: "Cómo hacer un tablero kanban (con 3 ejemplos)",
  excerpt:
    "Cómo hacer un tablero kanban desde cero en 6 pasos, con 3 ejemplos completos: equipo de contenido, equipo de software y agencia. Pared, pizarra o app.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-08-30",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "tablero-kanban",
  related: ["tablero-kanban", "kanban-limites-wip", "app-kanban"],
  seo: {
    title: "Cómo hacer un tablero kanban en 6 pasos | Hito",
    description:
      "Cómo hacer un tablero kanban paso a paso: columnas, tarjetas, límite WIP y 3 ejemplos completos (contenido, software, agencia). Físico o digital.",
    ogImageAlt: "Cómo hacer un tablero kanban: columnas, tarjetas y límite WIP.",
  },
  content: {
    eyebrow: "Organización del trabajo",
    intro: (
      <>
        <strong>En una línea:</strong> hacer un <strong>tablero kanban</strong> toma una tarde:
        define las etapas reales de tu proceso en 4 columnas, vuelca solo el trabajo comprometido
        en tarjetas con dueño, pon un límite a lo que está en curso y acuerda quién mueve qué y
        cuándo. Aquí tienes el paso a paso y tres tableros de ejemplo listos para copiar.
      </>
    ),
    sections: [
      {
        heading: "Antes de armarlo: elige el soporte",
        body: (
          <>
            <p>
              Un tablero kanban no necesita software. Necesita tres cosas: algo que muestre
              columnas, tarjetas que se puedan mover y un lugar donde el equipo lo vea. Las
              opciones, de más simple a más completo:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Pared o pizarra + post-its.</strong> Perfecta si todos comparten
                oficina. Ventaja extra: mover un post-it cuesta trabajo, así que la gente
                piensa antes de mover. Techo: se muere con el primer día remoto y no guarda
                historial.
              </li>
              <li>
                <strong>Hojas magnéticas o corcho.</strong> Variante del anterior para oficinas
                donde la pared es sagrada.
              </li>
              <li>
                <strong>App de tablero.</strong> Obligatoria si hay alguien remoto o si las
                tarjetas necesitan contexto: comentarios, adjuntos, subtareas, historial. La
                guía para elegir una, con los techos reales, está en{" "}
                <Link to="/blogs/app-kanban" className="underline underline-offset-2">
                  App kanban: cuándo un tablero alcanza
                </Link>
                .
              </li>
            </ul>
            <p>
              Si el equipo es híbrido, no hagas los dos: el tablero duplicado es el inicio de la
              mentira organizacional (“está actualizado en la pared, no en la app”). Elige uno
              y bórralo del resto de la conversación.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo hacer un tablero kanban, paso a paso",
        body: (
          <>
            <p>
              Si ya conoces la teoría —qué es un{" "}
              <Link to="/blogs/tablero-kanban" className="underline underline-offset-2">
                tablero kanban
              </Link>
              , qué columnas tiene y por qué el WIP importa— esto es la receta de ejecución:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Escribe el recorrido de una tarea típica en una frase.</strong> “Las
                piezas entran, se diseñan, el cliente aprueba, se publican.” Esa frase son tus
                columnas. Si no puedes escribirla, el problema no es el tablero: es que el
                proceso no existe todavía.
              </li>
              <li>
                <strong>Dibuja 4 columnas.</strong> Por hacer, En curso, Revisión/Empresa y
                Hecho son suficientes. Agrega una quinta solo si tu flujo tiene una etapa real y
                permanente más.
              </li>
              <li>
                <strong>Vuelca el trabajo comprometido, no los deseos.</strong> Una tarjeta por
                tarea, con verbo, resultado y responsable. El backlog de ideas va en una lista
                aparte, fuera del tablero.
              </li>
              <li>
                <strong>Pon el límite WIP en “En curso”.</strong> 1–2 tarjetas por persona que
                ejecuta. Escríbelo en la columna, visible. La lógica del número está en{" "}
                <Link to="/blogs/kanban-limites-wip" className="underline underline-offset-2">
                  Kanban WIP: qué significa el límite
                </Link>
                .
              </li>
              <li>
                <strong>Acuerda las reglas de movimiento.</strong> Cada quien mueve sus
                tarjetas cuando cambia el estado; nadie mueve la tarjeta de otro; “Hecho” tiene
                criterio explícito.
              </li>
              <li>
                <strong>Fecha de revisión a 2 semanas.</strong> El tablero 1.0 siempre está mal
                en algo: una columna de más, un límite que quedó corto. Se corrige en la
                revisión, no en el día 1.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Ejemplo 1 — Equipo de contenido (3 personas)",
        body: (
          <>
            <p>
              Un blog con dos redactores y una editora. La frase del proceso: “los temas se
              acuerdan, se redactan, se editan, se publican”.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Columna</th>
                  <th className="py-2 font-semibold">Regla</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Ideas aprobadas (por hacer)</td>
                  <td className="py-2 text-muted-foreground">
                    Máx. 10 tarjetas. Arriba, lo del próximo cierre. Ideas sin aprobar: lista
                    aparte.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Redactando (WIP: 2)</td>
                  <td className="py-2 text-muted-foreground">
                    Un artículo por redactor. La tarjeta lleva fecha de entrega a edición.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">En edición (WIP: 3)</td>
                  <td className="py-2 text-muted-foreground">
                    La editora corrige; si vuelve al autor, regresa a Redactando con comentario.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Programado</td>
                  <td className="py-2 text-muted-foreground">
                    Con fecha de publicación en el calendario del sitio.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Publicado</td>
                  <td className="py-2 text-muted-foreground">
                    Se limpia el viernes. El “hecho” es URL viva, no borrador enviado.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La columna clave es <em>En edición</em>: sin ella, los artículos esperando
              revisión parecerían “en curso” del editor, y el cuello de botella real —que
              edita menos de lo que redactan— sería invisible.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo 2 — Equipo de software (5 personas)",
        body: (
          <>
            <p>
              Un producto interno con 3 devs, 1 QA y 1 líder. La frase: “lo acordado entra al
              sprint, se desarrolla, se prueba, se despliega”.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Backlog del sprint</strong>: lo comprometido para estas 2 semanas;
                fuera del sprint, en el backlog general (cómo se poda, en{" "}
                <Link to="/blogs/que-es-un-backlog" className="underline underline-offset-2">
                  Qué es un backlog
                </Link>
                ).
              </li>
              <li>
                <strong>En desarrollo (WIP: 3–4)</strong>: un item por dev. Si la tarjeta
                necesita más de 3 días, se parte: eso suele ser una historia mal cortada (
                <Link to="/blogs/historias-de-usuario" className="underline underline-offset-2">
                  cómo cortarlas
                </Link>
                ).
              </li>
              <li>
                <strong>En QA (WIP: 4)</strong>: pruebas + arreglos. Aquí se destapan los
                “terminados” de mentira.
              </li>
              <li>
                <strong>Listo para desplegar</strong>: aprobado por QA; se sube en el deploy del
                día.
              </li>
              <li>
                <strong>Hecho</strong>: en producción y sin incidencias 24 h. Ese es el criterio
                escrito.
              </li>
            </ul>
            <p>
              Si además quieres sprints con compromiso y demo, ese marco completo es Scrum: la
              comparación honesta de cuándo conviene cada uno está en{" "}
              <Link to="/blogs/scrum-vs-kanban" className="underline underline-offset-2">
                Scrum vs Kanban
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo 3 — Agencia (8 personas, varios clientes)",
        body: (
          <>
            <p>
              Diseño y desarrollo para 6 clientes. La frase: “los briefs entran, se produce, el
              cliente aprueba, se entrega”. Aquí el tablero tiene una regla extra:{" "}
              <strong>el cliente es visible en cada tarjeta</strong>.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Encargo (por hacer)</strong>: tarjetas con prefijo de cliente
                (“NOR — landing”, “SUR — catálogo”). Ordenadas por fecha de entrega al cliente.
              </li>
              <li>
                <strong>Producción (WIP: 6 total, máx. 1 por persona)</strong>: el límite global
                expone cuántos frentes abre la agencia de verdad.
              </li>
              <li>
                <strong>Espera de cliente</strong>: la columna que salva agencias. Todo lo que
                espera aprobación vive aquí con fecha del recordatorio enviado. No es “hecho” ni
                “en curso”: es la fila del teléfono.
              </li>
              <li>
                <strong>Entregado</strong>: archivo de fuentes, factura emitida. Criterio:
                entregable + cobro, no “ya lo mandamos”.
              </li>
            </ul>
            <p>
              La columna <em>Espera de cliente</em> también cambia la conversación comercial:
              cuando el cliente pregunta “¿por qué se atrasó?”, la respuesta está en la columna
              con fechas, no en la memoria de nadie. El resto de prácticas para work-in-progress
              por disciplina están en{" "}
              <Link to="/blogs/gestion-proyectos-agencias" className="underline underline-offset-2">
                Gestión de proyectos para agencias
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Errores al armarlo (y el ajuste de las 2 semanas)",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Error típico</th>
                  <th className="py-2 font-semibold">Ajuste</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    7 columnas porque “cada paso es distinto”.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    A las 2 semanas, fusiona las que nunca tienen más de 1 tarjeta.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    “Por hacer” con 80 tarjetas.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Tope de 10–15. El resto vive en el backlog, no en el tablero.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    WIP de 8 “porque somos 8”.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Empieza en 1–2 por persona. Sube solo si hay datos de que sobra capacidad.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Tarjetas de proyecto (“Rediseño web NOR”) de 3 semanas.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Pártelas en entregables de días. Los proyectos viven encima del tablero, no
                    dentro.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El tablero y el chat cuentan cosas distintas.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Regla única: si no está en el tablero, no está hecho. Se sostiene con una
                    mirada diaria de 10 minutos.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              En la revisión de las 2 semanas hazte una sola pregunta: ¿en qué columna se
              acumula el trabajo? Esa es tu columna cuello de botella, y el tablero acaba de
              pagar su costo. Lo que sigue —medir el flujo, bajar el WIP, atacar el cuello— es
              kanban de verdad, y está en{" "}
              <Link to="/blogs/reducir-trabajo-en-curso" className="underline underline-offset-2">
                Cómo reducir el trabajo en curso
              </Link>
              .
            </p>
            <p>
              Si prefieres arrancar en digital sin crear cuentas para todo el equipo:{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              es un gestor local-first con tablero kanban, límites WIP y procesos — los datos
              viven en tu carpeta, en JSON, y no hay asientos que pagar.
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
              — arma tu tablero kanban en minutos, offline, sin cuenta ni nube.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo hacer un tablero kanban en 6 pasos",
      steps: [
        {
          name: "Escribe el recorrido de una tarea típica en una frase",
          text: "Esa frase son las columnas. Si no puedes escribirla, define primero el proceso; el tablero no inventa el flujo, lo dibuja.",
        },
        {
          name: "Dibuja 4 columnas",
          text: "Por hacer, En curso, Revisión/Espera y Hecho. Quinta columna solo si hay una etapa real y permanente más.",
        },
        {
          name: "Vuelca el trabajo comprometido en tarjetas con dueño",
          text: "Verbo + resultado + un responsable por tarjeta. Las ideas sin compromiso van a una lista aparte, no al tablero.",
        },
        {
          name: "Fija el límite WIP de ‘En curso’",
          text: "1–2 tarjetas por persona que ejecuta, escrito y visible. Cuando la columna llena, se termina antes de empezar.",
        },
        {
          name: "Acuerda las reglas de movimiento",
          text: "Cada quien mueve sus tarjetas en el momento; nadie mueve las ajenas; ‘Hecho’ tiene criterio explícito y limpieza semanal.",
        },
        {
          name: "Revisa el tablero a las 2 semanas",
          text: "Fusiona columnas muertas, ajusta el WIP con lo observado y ataca la columna donde se acumula el trabajo.",
        },
      ],
    },
    faq: [
      {
        question: "¿Cómo hacer un tablero kanban en físico?",
        answer:
          "Pared o pizarra, cinta para las 4 columnas (Por hacer, En curso, Revisión, Hecho) y post-its: uno por tarea, con verbo y responsable. Escribe el límite WIP sobre la columna ‘En curso’ y acuerda que nadie empieza algo nuevo cuando esté llena. Funciona muy bien con equipos co-ubicados; su techo es el primer día remoto.",
      },
      {
        question: "¿Qué columnas usar para empezar un tablero kanban?",
        answer:
          "Por hacer, En curso, Revisión (o Espera) y Hecho. La mayoría de los equipos necesita la columna de Revisión/Espera más de lo que cree: separa lo que ya terminó el ejecutor de lo que sigue esperando aprobación. Agrega columnas solo cuando exista una etapa real y permanente del proceso.",
      },
      {
        question: "¿Qué app usar para un tablero kanban?",
        answer:
          "Una que deje nombrar columnas, poner límite WIP visible, asignar dueño por tarjeta y exportar tus datos. Trello es la referencia clásica; si el criterio es privacidad y costo por asiento, existen opciones local-first como Hito. La comparación de cuándo una app de tablero alcanza está en App kanban.",
      },
      {
        question: "¿Cada cuánto se revisa un tablero kanban?",
        answer:
          "Mirada de equipo al iniciar el día (5–10 minutos: bloqueos, columna llena, qué termina hoy) y limpieza semanal (archivar ‘Hecho’, podar ‘Por hacer’). Además, una revisión de diseño del tablero cada 2–4 semanas: fusionar columnas muertas y ajustar el límite WIP con datos reales.",
      },
      {
        question: "¿Cómo saber si tu tablero kanban funciona?",
        answer:
          "Tres señales: el estado real se puede responder mirando el tablero (nadie pregunta ‘¿cómo va esto?’ en el chat), hay una columna clara donde se acumula el trabajo y las tarjetas de ‘En curso’ nunca superan el límite. Si el estado verdadero vive en el chat, el tablero no funciona, decora.",
      },
    ],
  },
};
