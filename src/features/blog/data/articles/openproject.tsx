import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "openproject",
  title: "OpenProject: qué es y cuándo usarlo",
  excerpt:
    "OpenProject es un gestor de código abierto con Gantt, tableros y costos. Cuándo conviene la edición Community, qué exige el servidor y frente a qué no compite.",
  category: "comparativas",
  categoryLabel: "Comparativas",
  publishedAt: "2026-10-15",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "alternativa-a-ms-project",
  related: [
    "alternativa-a-ms-project",
    "microsoft-project-para-que-sirve",
    "gestion-proyectos-sin-nube",
    "software-gestion-proyectos",
  ],
  seo: {
    title: "OpenProject: qué es y cuándo usarlo | Hito",
    description:
      "Qué es OpenProject, qué trae la edición Community y cuándo conviene frente a Microsoft Project o un gestor local. Sin servidor, no arranca.",
    ogImageAlt: "OpenProject como gestor de proyectos de código abierto, con Gantt y tableros.",
  },
  content: {
    eyebrow: "Comparativas",
    intro: (
      <>
        <strong>En una línea:</strong> OpenProject es un gestor de proyectos de código abierto:
        paquetes de trabajo, Gantt, tableros y costos, en un servidor que tú administras o en su
        nube de pago. Sirve cuando el equipo quiere ese alcance sin una licencia cerrada. No
        sirve si nadie va a mantener ese servidor ni a actualizar el plan.
      </>
    ),
    sections: [
      {
        heading: "Qué es OpenProject",
        body: (
          <>
            <p>
              OpenProject es un software de gestión de proyectos de código abierto. La unidad de
              trabajo es el paquete de trabajo: una tarea, un hito, una fase o un entregable, con
              fechas, responsable y relaciones. Encima de eso arma el Gantt, los tableros, la
              hoja de ruta, la wiki, el tiempo y los costos.
            </p>
            <p>
              Lo mantiene OpenProject GmbH. El código de la edición comunitaria se puede
              revisar, instalar y modificar. Eso no significa que sea un archivo que abres y ya.
              Alguien tiene que instalarlo, actualizarlo y hacer copias. «OpenProject online» es
              la nube que ellos operan, y esa nube se paga. No es la edición Community con otro
              nombre.
            </p>
            <p>
              Si llegaste aquí desde{" "}
              <Link to="/blogs/microsoft-project-para-que-sirve" className="underline underline-offset-2">
                para qué sirve Microsoft Project
              </Link>
              , el parecido es el plan: dependencias, fechas y una vista de barras. La diferencia
              es quién es dueño del programa y dónde está la base de datos.
            </p>
          </>
        ),
      },
      {
        heading: "Community, empresa y nube",
        body: (
          <>
            <p>
              Los nombres cambian de un año a otro. La distinción que importa no cambia.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-3 font-semibold">Edición</th>
                  <th className="py-2 pr-3 font-semibold">Qué pagas</th>
                  <th className="py-2 font-semibold">Qué te llevas</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-3 text-muted-foreground">Community</td>
                  <td className="py-2 pr-3 text-muted-foreground">
                    El software, no. El servidor, el tiempo de quien lo instala y las copias, sí.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Paquetes de trabajo, Gantt, tableros, wiki, tiempo y costos en un servidor
                    tuyo.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-3 text-muted-foreground">Enterprise</td>
                  <td className="py-2 pr-3 text-muted-foreground">
                    Licencia, además del servidor si lo sigues hospedando tú.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Funciones de empresa y soporte. El detalle de cada función está en su tabla
                    de precios, que conviene leer el día que decides.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 text-muted-foreground">Nube</td>
                  <td className="py-2 pr-3 text-muted-foreground">
                    Suscripción. Ellos operan el servidor.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Lo mismo, sin instalar. Los datos viven en su infraestructura, no en tu
                    oficina.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              «Gratis» aplica al software Community. No aplica al conjunto. Un equipo que no
              tiene quién actualice el servidor no tiene OpenProject gratis: tiene un proyecto
              de sistemas sin dueño.
            </p>
          </>
        ),
      },
      {
        heading: "Cuándo te conviene",
        body: (
          <>
            <p>Entra en la lista corta si se cumplen estas tres cosas a la vez:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Necesitas Gantt, paquetes de trabajo y una vista de tablero en el mismo
                producto.
              </li>
              <li>
                Quieres código abierto, o al menos poder irte llevándote los datos sin una
                licencia cerrada.
              </li>
              <li>
                Hay alguien —interno o un proveedor— que va a instalar, actualizar y respaldar
                el servidor. O aceptas pagar la nube.
              </li>
            </ul>
            <p>
              Es una buena pieza en organizaciones que ya operan sus propias herramientas, en
              equipos de proyecto que reportan tiempos y costos, y cuando{" "}
              <Link to="/blogs/alternativa-a-ms-project" className="underline underline-offset-2">
                dejar MS Project
              </Link>{" "}
              no puede significar perder el plan con dependencias.
            </p>
            <p>No es la primera opción si:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>El equipo son unas pocas personas y nadie quiere administrar un servidor.</li>
              <li>El trabajo de la semana cabe en un tablero y una lista de hitos.</li>
              <li>
                La condición es que los datos no salgan de los computadores del equipo ni pasen
                por una cuenta.
              </li>
              <li>
                Buscas «abrirlo y usarlo hoy», sin Docker, sin dominio y sin copia de seguridad
                que diseñar.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "OpenProject, Microsoft Project y un gestor local",
        body: (
          <>
            <p>
              Los tres responden preguntas distintas. Ponerlos en la misma tabla evita elegir
              por el folleto.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-3 font-semibold"></th>
                  <th className="py-2 pr-3 font-semibold">OpenProject</th>
                  <th className="py-2 pr-3 font-semibold">Microsoft Project</th>
                  <th className="py-2 font-semibold">Hito</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-3 text-muted-foreground">Dónde están los datos</td>
                  <td className="py-2 pr-3 text-muted-foreground">Servidor tuyo o nube de ellos</td>
                  <td className="py-2 pr-3 text-muted-foreground">Archivo .mpp o nube de Microsoft</td>
                  <td className="py-2 text-muted-foreground">Carpeta en el equipo</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-3 text-muted-foreground">Gantt y dependencias</td>
                  <td className="py-2 pr-3 text-muted-foreground">Sí, en el producto</td>
                  <td className="py-2 pr-3 text-muted-foreground">Es el centro del producto</td>
                  <td className="py-2 text-muted-foreground">No es un editor de Gantt</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-3 text-muted-foreground">Tablero e hitos</td>
                  <td className="py-2 pr-3 text-muted-foreground">Sí</td>
                  <td className="py-2 pr-3 text-muted-foreground">Según la versión</td>
                  <td className="py-2 text-muted-foreground">Sí, es el centro</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-3 text-muted-foreground">Precio de entrada</td>
                  <td className="py-2 pr-3 text-muted-foreground">
                    Software Community sin licencia; el servidor sale aparte
                  </td>
                  <td className="py-2 pr-3 text-muted-foreground">Licencia</td>
                  <td className="py-2 text-muted-foreground">Gratis, sin asientos</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 text-muted-foreground">Quién lo opera</td>
                  <td className="py-2 pr-3 text-muted-foreground">Tú, o la nube de pago</td>
                  <td className="py-2 pr-3 text-muted-foreground">Quien mantiene el plan</td>
                  <td className="py-2 text-muted-foreground">Quien tiene la carpeta</td>
                </tr>
              </tbody>
            </table>
            <p>
              OpenProject gana cuando quieres un planificador abierto y puedes operarlo.
              Microsoft Project gana cuando el entregable es el .mpp y la ruta crítica con
              recursos. Hito gana cuando el equipo no quiere servidor ni cuenta, y el trabajo es
              un tablero, procesos e hitos. Ninguno de los tres hace bien el trabajo de los
              otros dos.
            </p>
            <p>
              La guía más amplia de herramientas, sin quedarse en estas tres, está en{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos
              </Link>
              . Si la condición de partida es no subir el trabajo a una nube, el marco está en{" "}
              <Link
                to="/blogs/gestion-proyectos-sin-nube"
                className="underline underline-offset-2"
              >
                gestión de proyectos sin nube
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Cómo probarlo sin adoptar un servidor de por vida",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Elige un solo proyecto real, de menos de treinta paquetes.</strong> Un
                proyecto de ejemplo no enseña si el equipo va a cargar las horas.
              </li>
              <li>
                <strong>Define quién actualiza el servidor antes de instalar.</strong> Si ese
                nombre no existe, para la prueba y mira la nube de pago o cambia de herramienta.
              </li>
              <li>
                <strong>Carga paquetes, dependencias y un tablero.</strong> Si a las dos semanas
                solo se usa el tablero, no estás usando OpenProject: estás usando un kanban con
                un Gantt vacío al lado.
              </li>
              <li>
                <strong>Exporta los datos el día 14.</strong> Si no puedes irte con el trabajo en
                una hoja, el código abierto no te dio la salida que creías tener.
              </li>
            </ol>
            <p>
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              no es la versión liviana de OpenProject. No tiene Gantt de recursos, ni costos, ni
              un servidor que administrar. Es el otro lado de la tabla: una carpeta local para
              equipos de 1 a 15 personas.
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
              — si lo que buscabas era no instalar nada. Si buscabas OpenProject, instálalo: esta
              página no lo reemplaza.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo probar OpenProject en dos semanas",
      steps: [
        {
          name: "Elige un proyecto real y corto",
          text: "Menos de treinta paquetes de trabajo. Un proyecto de ejemplo no dice si el equipo va a mantener el plan.",
        },
        {
          name: "Nombra a quien administra el servidor",
          text: "Si nadie actualiza ni respalda, no tienes la edición Community gratis: tienes un sistema sin dueño. En ese caso, mira la nube de pago o cambia de herramienta.",
        },
        {
          name: "Carga paquetes, dependencias y un tablero",
          text: "A las dos semanas, si solo se usa el tablero, el Gantt está de adorno. Eso también es un resultado: no necesitas OpenProject.",
        },
        {
          name: "Exporta el trabajo el día 14",
          text: "Si no puedes salir con los datos en una hoja, el código abierto no te dio la puerta de salida que esperabas.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es OpenProject?",
        answer:
          "Es un gestor de proyectos de código abierto. Organiza el trabajo en paquetes, con Gantt, tableros, wiki, tiempo y costos. Se instala en un servidor propio o se usa en la nube de pago de OpenProject.",
      },
      {
        question: "¿OpenProject es gratis?",
        answer:
          "La edición Community no cobra licencia. El servidor, el tiempo de quien lo instala y las copias de seguridad sí cuestan. La nube y la edición de empresa se pagan. Gratis es el software, no el conjunto.",
      },
      {
        question: "¿OpenProject reemplaza a Microsoft Project?",
        answer:
          "Reemplaza el plan con dependencias y el Gantt cuando el equipo puede operar un servidor o pagar la nube. No reemplaza el archivo .mpp si el cliente te lo exige, ni la nivelación de recursos al detalle del Project de escritorio.",
      },
      {
        question: "¿Hace falta un servidor?",
        answer:
          "Sí, salvo que pagues la nube, en cuyo caso el servidor lo operan ellos. No es un programa de escritorio ni un archivo en una carpeta.",
      },
      {
        question: "¿Para qué equipo no conviene?",
        answer:
          "Para un equipo chico que no quiere administrar un servidor, que no necesita Gantt de recursos y que quiere los datos en su propio computador. Ahí un gestor local alcanza y OpenProject sobra.",
      },
    ],
  },
};
