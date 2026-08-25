import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "gestion-proyectos-excel",
  title: "Gestión de proyectos en Excel: cuándo alcanza y cuándo no",
  excerpt:
    "Excel alcanza para un proyecto chico con un dueño. Deja de alcanzar cuando hay dependencias, varias personas actualizando, o el archivo se vuelve la fuente de verdad.",
  category: "plantillas",
  categoryLabel: "Plantillas",
  publishedAt: "2027-05-10",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "plantillas-gestion-proyectos",
  related: [
    "plantillas-gestion-proyectos",
    "herramientas-gestion-proyectos-gratis",
    "gestionar-varios-proyectos-a-la-vez",
  ],
  seo: {
    title: "Gestión de proyectos en Excel: cuándo sí y cuándo no | Hito",
    description:
      "Gestión de proyectos en Excel: cuándo una hoja alcanza (un dueño, un proyecto) y cuándo falla (versiones, dependencias, WIP, varios editores).",
    ogImageAlt: "Gestión de proyectos en Excel: cuándo sí alcanza y cuándo ya no.",
  },
  content: {
    eyebrow: "Plantillas",
    intro: (
      <>
        <strong>En una línea:</strong> la <strong>gestión de proyectos en Excel</strong> alcanza
        cuando hay un dueño, un archivo y un proyecto que cabe en la cabeza de esa persona. Deja
        de alcanzar cuando el .xlsx se vuelve la fuente de verdad, hay dependencias reales, o tres
        personas lo editan “un ratito”. No necesitas un Gantt de 40 columnas para enterarte: las
        señales aparecen antes de que las fórmulas se rompan.
      </>
    ),
    sections: [
      {
        heading: "Cuándo la gestión de proyectos en Excel sí alcanza",
        body: (
          <>
            <p>
              Excel (o Google Sheets) es una herramienta de cálculo que también puede listar
              trabajo. Eso basta en un conjunto chico de casos, y negarlo es snobismo de software:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Un proyecto con un dueño que actualiza él mismo: freelance, internamente “Juan
                lleva el lanzamiento”.
              </li>
              <li>
                Listas cortas (menos de ~80 filas) sin dependencias fuertes entre sí.
              </li>
              <li>
                Un presupuesto simple: plan vs. real, unas categorías, un TOTAL.
              </li>
              <li>
                Una{" "}
                <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                  matriz RACI
                </Link>{" "}
                de una página, que se arma una vez y se consulta.
              </li>
              <li>
                Un informe puntual para alguien que solo abre Excel: el sponsor que quiere ver
                fechas en una grilla, no en un tablero.
              </li>
            </ul>
            <p>
              En esos casos la hoja gana porque ya está abierta. El error no es usarla: es seguir
              usándola cuando el archivo se convirtió en el sistema operativo del equipo.
            </p>
          </>
        ),
      },
      {
        heading: "Lo que la gente arma: Gantt, kanban, RACI y presupuesto",
        body: (
          <>
            <p>
              Casi todos los tutoriales de “gestión de proyectos excel” venden las mismas cuatro
              construcciones. Sirven distinto:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Lista de tareas + fechas.</strong> Columnas: tarea, dueño, inicio, fin,
                estado, % . Es lo más honesto que puedes hacer en una hoja. El % a mano miente
                pronto; el estado (no iniciado / en curso / hecho) miente menos.
              </li>
              <li>
                <strong>Gantt con barras condicionales.</strong> Una fecha de inicio, una duración,
                y celdas que se pintan si caen en el rango. Se ve bien en una captura. No calcula
                holgura ni mueve solos los sucesores cuando una tarea se atrasa.
              </li>
              <li>
                <strong>Kanban en columnas.</strong> Cada columna es un estado; cada fila, una
                tarjeta. Funciona para ti solo. En Sheets, dos personas moviendo la misma fila es
                un choque; en un .xlsx enviado por correo, es un fantasma.
              </li>
              <li>
                <strong>RACI y presupuesto.</strong> Acá Excel es fuerte. Una grilla de letras y
                una hoja de SUMIF no necesitan un motor de flujo. El techo aparece cuando el RACI
                vive en un archivo distinto al de las tareas y nadie lo abre.
              </li>
            </ul>
            <p>
              Puedes copiar cualquiera de esas grillas desde{" "}
              <Link
                to="/blogs/plantillas-gestion-proyectos"
                className="underline underline-offset-2"
              >
                plantillas de gestión de proyectos
              </Link>
              . La plantilla no decide si Excel te alcanza: lo decide quién la toca y cada cuánto.
            </p>
          </>
        ),
      },
      {
        heading: "Señales de que ya te quedó chico",
        body: (
          <>
            <p>
              No esperes a que el archivo pese 12 MB. Estas señales bastan para cambiar de
              herramienta — o, al menos, para dejar de pretender que la hoja es el sistema:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Señal</th>
                  <th className="py-2 pr-4 font-semibold">Qué está pasando</th>
                  <th className="py-2 font-semibold">Qué se rompe</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Hay v3, v7 y “final_REAL”</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Nadie sabe cuál es la fuente de verdad
                  </td>
                  <td className="py-2 text-muted-foreground">Decisiones sobre datos viejos</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Tres personas lo editan</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Escritura concurrente sin historial útil de comentarios
                  </td>
                  <td className="py-2 text-muted-foreground">Sobrescrituras y filas huérfanas</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">15 filas en “en curso”</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    No hay límite WIP: la hoja no frena el arranque
                  </td>
                  <td className="py-2 text-muted-foreground">Nada termina, todo “avanza”</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Las fechas no se mueven solas</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Hay dependencias, pero el Gantt es pintura
                  </td>
                  <td className="py-2 text-muted-foreground">La fecha de entrega es decorativa</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Solo una persona toca las fórmulas</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El archivo es un sistema con un único administrador
                  </td>
                  <td className="py-2 text-muted-foreground">Cuello de botella y vacaciones = caos</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">El chat es el verdadero log</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Comentarios en celdas se pierden; el porqué vive en WhatsApp
                  </td>
                  <td className="py-2 text-muted-foreground">Nadie reconstruye una decisión</td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Los cinco modos de fallo",
        body: (
          <>
            <p>
              No es que Excel “no sirva para proyectos”. Es que falla de formas predecibles cuando
              lo usas como si fuera un gestor:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Infierno de versiones.</strong> Adjunto de correo + OneDrive + “te lo
                mandé anoche”. Cada copia es una verdad. Sheets reduce esto, no lo elimina: pestañas
                duplicadas y filtros personales hacen el mismo daño.
              </li>
              <li>
                <strong>Sin límites WIP.</strong> Una columna “En curso” acepta infinitas filas. El
                equipo empieza más de lo que termina. Un tablero con{" "}
                <Link to="/blogs/kanban-limites-wip" className="underline underline-offset-2">
                  límite WIP
                </Link>{" "}
                te frena; una hoja no.
              </li>
              <li>
                <strong>Sin historial de conversación útil.</strong> Los comentarios de celda no
                son un hilo de tarea. A los tres meses no sabes por qué la fecha del hito 3 saltó
                dos semanas.
              </li>
              <li>
                <strong>Una persona como cuello de botella.</strong> María entiende el BUSCARV, el
                formato condicional y qué pestaña no hay que tocar. Si María está enferma, el
                sistema está enfermo.
              </li>
              <li>
                <strong>Fórmulas que se rompen en silencio.</strong> Insertas una fila, el rango
                del SUM no la incluye, el semáforo sigue verde. Excel no te avisa que el modelo
                dejó de modelar.
              </li>
            </ol>
            <p>
              Estos fallos se agravan cuando gestionas{" "}
              <Link
                to="/blogs/gestionar-varios-proyectos-a-la-vez"
                className="underline underline-offset-2"
              >
                varios proyectos a la vez
              </Link>
              : un archivo por proyecto, o una mega-hoja con 12 pestañas, son dos maneras de
              perder el portafolio. Excel no tiene “capacidad compartida”; tiene celdas.
            </p>
          </>
        ),
      },
      {
        heading: "Gantt y ruta crítica: el techo real",
        body: (
          <>
            <p>
              Un Gantt en Excel es un gráfico de barras apiladas o una franja de celdas pintadas.
              Muestra un plan. No es un motor de calendario. La diferencia se nota el día en que
              una tarea de 3 días se atrasa y deberías ver qué más se mueve.
            </p>
            <p>
              La{" "}
              <Link to="/blogs/ruta-critica-proyecto" className="underline underline-offset-2">
                ruta crítica
              </Link>{" "}
              pide predecesoras, duraciones y recálculo. En Excel puedes simularlo con una columna
              de “sucesor” y algo de max() entre fechas. Lo haces una vez, con 12 tareas, y
              funciona. Con 60 tareas, dos caminos paralelos y un recurso compartido, el modelo se
              vuelve un segundo proyecto: mantener la hoja.
            </p>
            <p>
              Si el valor del Gantt es “el cliente quiere ver barras”, genéralo para esa reunión y
              tira la copia. Si el valor es “saber qué no se puede atrasar”, no lo busques en
              formato condicional.
            </p>
          </>
        ),
      },
      {
        heading: "Kanban en una hoja (y por qué no hay WIP)",
        body: (
          <>
            <p>
              El kanban-en-sheets se ve así: columnas Por hacer / En curso / Hecho, o una sola
              lista con una columna Estado y un filtro. Para una persona, es un tablero pobre y
              suficiente. Para un equipo, faltan tres cosas que no son “vistas bonitas”:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Un límite visible de trabajo en curso que impida arrastrar la fila 16.</li>
              <li>Un dueño claro por tarjeta sin pelearse por la misma celda.</li>
              <li>Un rastro de cuándo salió de “en curso”, no un color que alguien pintó a mano.</li>
            </ul>
            <p>
              Puedes fingir el límite WIP con un CONTAR.SI en rojo cuando hay más de 3 filas en
              curso. Nadie lo respeta porque la hoja no bloquea el movimiento: solo se pone
              colorada, como el semáforo que aprendiste a ignorar. El método no vive en la
              herramienta, pero la herramienta puede hacer más fácil incumplirlo.
            </p>
          </>
        ),
      },
      {
        heading: "Qué hacer cuando dejas Excel",
        body: (
          <>
            <p>
              No migres “todo”. Migra lo que la hoja ya no sostiene:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                Deja en Excel (o Sheets) presupuesto, RACI estático y exportaciones puntuales para
                quien solo abre hojas.
              </li>
              <li>
                Mueve tareas, estados, comentarios y dueños a un tablero con un solo lugar de
                verdad. Una herramienta dedicada —de las{" "}
                <Link
                  to="/blogs/herramientas-gestion-proyectos-gratis"
                  className="underline underline-offset-2"
                >
                  herramientas gratis de gestión de proyectos
                </Link>
                , o una de pago— existe para eso, no para reemplazar tu SUMIF.
              </li>
              <li>
                Congela el .xlsx viejo como archivo, no como sistema. Un “solo lectura” explícito
                evita que alguien siga cargando horas ahí dos meses después.
              </li>
            </ol>
            <p>
              La prueba de que era momento: si esta semana perdiste más de media hora
              reconstruyendo “cuál es la última versión” o explicando una fórmula, ya no estás
              gestionando el proyecto — estás gestionando el archivo.
            </p>
            <p>
              Cuando la hoja te quede chica, el siguiente paso es un gestor de proyectos, no un
              Excel más sofisticado. Un archivo con más pestañas no arregla versiones, WIP ni
              comentarios. Si quieres un tablero local-first (no una hoja disfrazada),{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                Hito
              </a>{" "}
              es esa categoría: proyectos y checklists en tu equipo, sin pretender ser Excel.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Se puede hacer gestión de proyectos en Excel de forma seria?",
        answer:
          "Sí, si hay un dueño, un proyecto y una lista que esa persona actualiza. Deja de ser serio cuando el archivo es la fuente de verdad de varias personas, hay dependencias que deberían recalcularse, o el historial de decisiones vive en el chat y no en la hoja.",
      },
      {
        question: "¿Excel o Google Sheets para un proyecto chico?",
        answer:
          "Sheets gana si más de una persona edita: hay una sola copia y un historial de versiones. Excel de escritorio gana si ya vives en Microsoft 365 y el archivo no viaja por correo. Ninguno de los dos reemplaza un tablero cuando hay flujo de trabajo real.",
      },
      {
        question: "¿Un Gantt en Excel sirve para la ruta crítica?",
        answer:
          "No como motor: sirve como dibujo del plan. La ruta crítica necesita predecesoras y recálculo cuando algo se atrasa; el formato condicional no mueve las fechas sucesoras. Úsalo para una captura, no para dirigir el proyecto.",
      },
      {
        question: "¿Cómo sé que llegó el momento de dejar Excel?",
        answer:
          "Cuando aparece más de una versión, más de un editor habitual, más de ~10 ítems en curso a la vez, o una sola persona entiende las fórmulas. Una sola de esas señales ya justifica un tablero; dos juntas, casi siempre.",
      },
      {
        question: "¿Qué dejo en Excel después de migrar las tareas?",
        answer:
          "Presupuesto, matrices estáticas (RACI, riesgos en una tabla simple) y reportes que un stakeholder solo abre en hoja de cálculo. Las tareas, dueños, estados y comentarios salen del .xlsx para no duplicar la verdad.",
      },
    ],
  },
};
