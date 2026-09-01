import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "software-gestion-proyectos",
  title: "Software de gestión de proyectos: cómo elegir uno que sí uses",
  excerpt:
    "Qué es un software de gestión de proyectos, qué tiene que hacer de verdad y cómo elegir entre lista, kanban, Gantt y local-first sin comprar vistas que nadie abre.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-08-18",
  readingTime: "12 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  related: [
    "app-gestion-tareas",
    "como-elegir-software-gestion-proyectos",
    "herramientas-gestion-proyectos-gratis",
    "alternativa-a-asana",
  ],
  seo: {
    title: "Software de gestión de proyectos: cómo elegir | Hito",
    description:
      "Software de gestión de proyectos: qué es, qué debe hacer y cómo elegir entre Asana, Trello, Jira, ClickUp y opciones local-first sin comprar vistas de más.",
    ogImageAlt:
      "Comparativa de software de gestión de proyectos: lista, kanban, Gantt y local-first.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> un <strong>software de gestión de proyectos</strong> no es
        el que tiene más vistas: es el que el equipo actualiza la semana que viene. Esta guía
        cubre qué es, qué debe hacer de verdad y cómo elegir entre lista, kanban, Gantt y
        local-first sin comprar un techo que vas a pegar a los 90 días.
      </>
    ),
    sections: [
      {
        heading: "Qué es un software de gestión de proyectos",
        body: (
          <>
            <p>
              Un software de gestión de proyectos es el lugar donde el trabajo tiene dueño, estado
              y fecha, y donde el equipo ve el avance sin preguntar “¿cómo vas?”. No es un chat
              con hilos ni una hoja con colores: es el sistema que convierte “hay que entregar el
              sitio” en tareas, responsables y un flujo que alguien puede leer un martes a las
              10.
            </p>
            <p>
              Cubre tres capas que la gente mezcla. La captura personal (“llámalo al cliente”)
              cabe en una{" "}
              <Link to="/blogs/app-gestion-tareas" className="underline underline-offset-2">
                app de gestión de tareas
              </Link>
              . El proyecto suma alcance, plazos y varios dueños. El portafolio suma varios
              proyectos a la vez. El software sirve cuando deja de ser una lista de recuerdos y
              pasa a ser la fuente de verdad del trabajo en curso.
            </p>
            <p>
              Un freelance con 3 clientes puede vivir meses en una lista. Una agencia de 8, con
              briefs, revisiones y un tablero de operaciones, ya no: el chat no dice quién tiene
              la pelota ni qué está bloqueado. El software no “hace la gestión” por ti. Te obliga
              a nombrar el trabajo y a moverlo.
            </p>
          </>
        ),
      },
      {
        heading:
          "Qué tiene que hacer de verdad: tareas, tablero, plazos, responsables y visibilidad",
        body: (
          <>
            <p>
              Antes de mirar rankings, escribe lo que el equipo necesita para trabajar la semana
              que viene. Cinco funciones alcanzan; el resto es opcional hasta que el dolor lo
              pida.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Tareas.</strong> Capturar, partir y cerrar. Si no cabe en una tarjeta con
                un verbo (“enviar el informe de avance”), no es una tarea: es un deseo.
              </li>
              <li>
                <strong>Tablero.</strong> Columnas que copian el flujo real (por hacer, en curso,
                espera de cliente, hecho), no las columnas del tutorial del vendor.
              </li>
              <li>
                <strong>Plazos.</strong> Una fecha que alguien ve sin abrir un hilo. No hace falta
                un cronograma de 40 filas el primer mes.
              </li>
              <li>
                <strong>Responsables.</strong> Un dueño por tarjeta. “El equipo” no es un
                responsable: es una forma de que nadie la mueva.
              </li>
              <li>
                <strong>Visibilidad.</strong> Que un lead mire el tablero y sepa qué está trabado,
                sin una reunión de status de 45 minutos.
              </li>
            </ul>
            <p>
              Lo que no tiene que hacer el primer día: quince vistas, un Gantt con dependencias,
              SSO ni un marketplace. Eso se compra cuando el flujo ya se actualiza solo. Si el
              equipo no mueve tarjetas, el diagrama más caro es un dibujo. Prueba corta: si
              mañana entra un pedido, ¿dónde se escribe, quién queda de dueño y cómo se entera
              el resto? Si la respuesta es el grupo de WhatsApp, todavía no tienes software.
              Tienes un chat.
            </p>
          </>
        ),
      },
      {
        heading:
          "Tipos de software de gestión de proyectos: lista, kanban, Gantt, all-in-one y local-first",
        body: (
          <>
            <p>
              El tipo define el techo, no el logo. Elige el más chico que cubra el flujo; subir de
              tipo es barato en tiempo, bajar es una migración.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Lista.</strong> Una cola con dueño y fecha. Sirve al freelance con 3
                clientes y poco solapamiento. Se rompe cuando hay estados (“espera de cliente”) o
                más de un editor habitual.
              </li>
              <li>
                <strong>Kanban.</strong> Columnas y tarjetas. Es el tipo que más equipos chicos
                terminan usando, porque el flujo se ve. Trello es el ejemplo más citado; el
                desglose de techos y collab está en{" "}
                <Link to="/blogs/hito-vs-trello" className="underline underline-offset-2">
                  Hito vs Trello
                </Link>
                .
              </li>
              <li>
                <strong>Gantt.</strong> Barras, dependencias, fecha de fin. Sirve cuando el atraso
                de una tarea mueve el resto (obra ligera, un lanzamiento con proveedores). No
                sirve para “ver el trabajo de hoy”: para eso el tablero gana.
              </li>
              <li>
                <strong>All-in-one.</strong> Docs, chat, metas, whiteboards y 15 vistas en un
                solo login. ClickUp es el caso tipo. Gana si el presupuesto existe y el equipo va
                a configurar; pierde si nadie administra el workspace. Más detalle en{" "}
                <Link to="/blogs/hito-vs-clickup" className="underline underline-offset-2">
                  Hito vs ClickUp
                </Link>
                .
              </li>
              <li>
                <strong>Local-first.</strong> El proyecto vive en tu disco (carpeta, archivos),
                no en el servidor del vendor. No hay asiento que vencer ni un plan free que se
                estrecha. Tampoco hay collab en tiempo real tipo nube ni un ecosistema mobile de
                Power-Ups. Es un tipo, no un premio.
              </li>
            </ul>
            <p>
              Excel y Sheets no son un sexto tipo de software de gestión: son una hoja que a
              veces alcanza. Cuándo sí y cuándo el .xlsx se vuelve el sistema operativo del
              equipo está en{" "}
              <Link to="/blogs/gestion-proyectos-excel" className="underline underline-offset-2">
                gestión de proyectos en Excel
              </Link>
              . Si tu flujo ya pide estados, comentarios y varios editores, la hoja no “se
              configura mejor”: se cambia de capa.
            </p>
          </>
        ),
      },
      {
        heading: "Tabla: 8 herramientas de software de gestión de proyectos en 2026",
        body: (
          <>
            <p>
              Sin puntajes ni “mejor del año”. Ideal para, y el techo que vas a pegar primero. Los
              vendors mueven cifras: trata cada número como foto de 2026, no como contrato. El
              detalle de planes free está en{" "}
              <Link
                to="/blogs/herramientas-gestion-proyectos-gratis"
                className="underline underline-offset-2"
              >
                herramientas gratis de gestión de proyectos
              </Link>
              .
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Herramienta</th>
                  <th className="py-2 pr-4 font-semibold">Ideal para</th>
                  <th className="py-2 font-semibold">Techo real</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Asana</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Listas y tareas entre pocas personas, con dueño y fecha claros
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Free = 2 usuarios en 2026 (antes 10–15). Cronograma y dependencias van al
                    plan pago
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Trello</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Kanban simple, un equipo chico que mueve tarjetas
                  </td>
                  <td className="py-2 text-muted-foreground">
                    10 tableros y 10 colaboradores por workspace; adjuntos 10 MB
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">monday.com</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Tableros visuales tipo “work OS” cuando hay presupuesto por asiento
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Mínimo 3 asientos pagos; las automatizaciones empujan al plan Pro
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">ClickUp</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipo que va a usar muchas vistas (lista, tablero, Gantt, docs)
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Free ~60 MB de storage; Gantt y campos custom recortados; IA de pago
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Jira</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Issues, sprints y desarrollo; equipos que ya hablan en tickets
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Free ≤ 10 usuarios; el 11 dispara plan pago. No es la tool de una pyme de
                    servicios
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Notion</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Wiki + tareas en un solo espacio, sobre todo uso individual
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El segundo miembro en free suele pagar (tope de bloques); 5 MB por archivo
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">OpenProject</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Gantt clásico autoalojado, equipos que ya tienen servidor
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Community gratis en tu servidor; cloud y Enterprise se pagan. El costo es
                    ops, no licencia
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Hito</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipo de 1–15 que quiere local-first, kanban y checklists sin asientos
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Sin techo de tableros ni storage de vendor; no hay collab cloud en tiempo
                    real ni SSO/SOC2. No reemplaza Jira grande ni ClickUp de 15 vistas
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Lee la tabla por el techo, no por la marca. Una agencia de 8 con un tablero de
              operaciones y uno por cliente llega a los 10 tableros de Trello sin ser “grande”.
              Un dúo que suma a la asistente choca el free de Asana el primer mes. Un estudio
              que carga PDFs gasta 60 MB de ClickUp en una semana de capturas. Jira gana en
              issues; monday.com, en tableros de colores con piso de 3 asientos pagos.
              OpenProject gana el Gantt en tu servidor, si alguien lo parchea. Ninguna fila es
              el ganador universal.
            </p>
          </>
        ),
      },
      {
        heading: "Errores al elegir software de gestión de proyectos",
        body: (
          <>
            <p>
              El error caro no es elegir “mal”: es elegir por una demo y descubrir el techo a los
              90 días, cuando ya hay 200 tarjetas y el equipo se negó a volver a Excel.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Comprar vistas.</strong> El vendor enseña Gantt, carga de trabajo,
                metas y un calendario de colores. El equipo iba a usar un tablero de cuatro
                columnas. Pagas la suite; usas la lista. El recuento de vistas no predice
                adopción.
              </li>
              <li>
                <strong>Ignorar techos a 90 días.</strong> Asana free = 2 usuarios. Trello = 10
                tableros. ClickUp ~60 MB. Jira free ≤ 10. monday.com, mínimo 3 asientos pagos.
                Notion, el segundo miembro suele dejar de ser free. Pregunta qué vas a tocar
                primero —asientos, tableros o storage— no qué logo queda mejor en la home.
              </li>
              <li>
                <strong>No mapear el flujo.</strong> Copiar las columnas del template (“Backlog /
                Sprint / Done”) cuando tu agencia trabaja “Brief → Producción → Revisión
                cliente → Entrega” produce un tablero que nadie reconoce. El software no inventa
                el proceso; lo refleja. Si el flujo no está escrito, cualquier tool se siente
                “confusa”.
              </li>
            </ul>
            <p>
              Un cuarto error: elegir para la empresa de 50 con SSO y SOC2, no para las 8 que
              tienes. El software enterprise no te hace enterprise. Te hace un workspace que
              nadie administra.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo adoptar un software de gestión de proyectos en 14 días",
        body: (
          <>
            <p>
              No migres el archivo histórico. Elige un proyecto real —un cliente, un lanzamiento,
              las operaciones de la quincena— y recorre este calendario. El checklist largo, con
              techos y precio a 12 meses, está en{" "}
              <Link
                to="/blogs/como-elegir-software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                cómo elegir un software de gestión de proyectos
              </Link>
              .
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Días 1–2.</strong> Escribe el flujo en una servilleta: 4–6 columnas con
                nombres que el equipo ya usa. “Espera de cliente” vale más que “Blocked”.
              </li>
              <li>
                <strong>Días 3–5.</strong> Un tablero, un proyecto, las tarjetas de esa semana.
                Nada de importar 2019. Si el tablero no se entiende en diez minutos, las
                columnas están mal, no la gente.
              </li>
              <li>
                <strong>Días 6–10.</strong> Todo el trabajo de ese proyecto entra ahí. El chat
                deja de ser el backlog. El dueño de cada tarjeta es una persona, no “el equipo”.
              </li>
              <li>
                <strong>Días 11–14.</strong> Un informe de 8 líneas salido del tablero, no de
                memoria. Si nadie actualizó, el software no falló: el hábito no nació. Decide
                entonces —seguir, cambiar de tipo o volver a la lista— no a los seis meses.
              </li>
            </ol>
            <p>
              Si a los 14 días el tablero es más honesto que el chat, quédate. Si el equipo
              sigue preguntando “¿en qué quedó lo de Martín?”, todavía no tienes un sistema.
              Tienes una cuenta.
            </p>
            <p>
              Cuando el criterio es que los datos del cliente se queden en disco —no en el
              servidor del vendor—, local-first entra en la conversación.{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                Hito
              </a>{" "}
              es esa opción: carpeta + JSON, sin cuenta ni asiento, kanban, checklists, flujos y
              una PWA que funciona offline. No es el ganador de la tabla. No reemplaza Jira en
              un equipo de ingeniería grande ni ClickUp si necesitas quince vistas y Brain. Está
              pensado para 1–15 personas, no para 50, SSO ni SOC2.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo elegir software de gestión de proyectos en 5 pasos",
      steps: [
        {
          name: "Escribe el flujo real",
          text: "Anota 4–6 estados que el trabajo ya recorre (brief, en curso, espera de cliente, hecho). Si no cabe en esa lista, todavía no estás eligiendo software: estás eligiendo un deseo de proceso.",
        },
        {
          name: "Elige el tipo mínimo",
          text: "Lista si hay un dueño y poco solapamiento; kanban si hay estados y varios editores; Gantt si las dependencias mueven la fecha de fin; all-in-one solo si alguien va a administrar el workspace; local-first si los datos no pueden salir del equipo.",
        },
        {
          name: "Verifica los techos a 90 días",
          text: "Cuenta personas que editan, tableros que vas a abrir y adjuntos que vas a cargar. Cruza eso con el plan free o el piso de asientos: Asana 2 usuarios, Trello 10 tableros, ClickUp ~60 MB, Jira 10, monday.com 3 asientos pagos.",
        },
        {
          name: "Calcula el precio a 12 meses",
          text: "Asientos × 12, más add-ons (IA, automatizaciones, storage). El plan mensual miente: el número que importa es lo que vas a pagar si el equipo no se achica.",
        },
        {
          name: "Prueba 14 días con trabajo real",
          text: "Un proyecto, un tablero, sin Excel en paralelo. Si el tablero es más honesto que el chat al día 14, quédate. Si nadie lo actualiza, cambia de tipo o de hábito, no de logo.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es un software de gestión de proyectos?",
        answer:
          "Es el sistema donde el trabajo de un proyecto tiene dueño, estado y fecha, y el equipo ve el avance sin preguntar en el chat. No reemplaza la gestión: obliga a nombrar tareas, plazos y responsables en un solo lugar.",
      },
      {
        question: "¿Cuál es el mejor software de gestión de proyectos?",
        answer:
          "No hay uno: el mejor es el que el equipo actualiza la semana que viene y cuyo techo no vas a pegar a los 90 días. Trello si el kanban es simple y cabes en 10 tableros; Jira si ya trabajas en issues y son ≤10; ClickUp si vas a pagar por muchas vistas; local-first si los datos no pueden salir de tu disco.",
      },
      {
        question: "¿Software de gestión de proyectos gratis o de pago?",
        answer:
          "Gratis alcanza para un dúo o un tablero chico; el pago aparece cuando sumas asientos, tableros, storage o historial. Asana free queda en 2 usuarios, Trello en 10 tableros, ClickUp en ~60 MB y Jira en 10 personas: el free es un gancho, no un plan de portafolio.",
      },
      {
        question: "¿Cuál es la diferencia entre un software de gestión de proyectos y Excel?",
        answer:
          "Excel lista y calcula; el software de gestión mueve trabajo con estados, dueños y un historial que no depende de “cuál es la última versión”. La hoja alcanza con un dueño y un proyecto; se rompe con varios editores, dependencias o un .xlsx que viaja por correo.",
      },
      {
        question: "¿Qué software de gestión de proyectos conviene para equipos pequeños?",
        answer:
          "El más chico que cubra flujo, dueño y visibilidad: kanban para una agencia de 8, lista o tablero simple para un freelance con 3 clientes. Evita suites enterprise, SSO y 15 vistas hasta que el tablero se actualice solo; el techo de asientos o storage importa más que el logo.",
      },
    ],
  },
};
