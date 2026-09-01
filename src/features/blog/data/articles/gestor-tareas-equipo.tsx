import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "gestor-tareas-equipo",
  title: "Gestor de tareas para equipos: de la lista compartida al tablero",
  excerpt:
    "Un gestor de tareas para equipos no es un Excel con nombres. Asignación, WIP, visibilidad y el daily que deja de ser un interrogatorio.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-08-27",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "software-gestion-proyectos",
  related: [
    "software-gestion-proyectos",
    "como-delegar-tareas",
    "seguimiento-de-tareas-equipo",
    "app-gestion-tareas",
  ],
  seo: {
    title: "Gestor de tareas para equipos | Hito",
    description:
      "Gestor de tareas para equipos: cómo pasar de la lista compartida al tablero con asignación, límites WIP y visibilidad sin microgestionar.",
    ogImageAlt: "Gestor de tareas para equipos: de la lista compartida al tablero kanban.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> un <strong>gestor de tareas para equipos</strong> no es un
        Excel con nombres en una columna. Sirve si asigna dueños, limita el trabajo en curso y
        muestra bloqueos sin que tengas que preguntar. El daily deja de ser un interrogatorio
        cuando el tablero ya contestó lo que ayer se resolvió.
      </>
    ),
    sections: [
      {
        heading: "Por qué la lista compartida explota",
        body: (
          <>
            <p>
              Una lista funciona mientras una persona es dueña de la verdad. El día en que cinco
              personas editan las mismas 80 filas, la lista no “se desordena”: se vuelve un
              documento de consenso que nadie lee. Cada quien interpreta “en curso” a su manera,
              el responsable es “el equipo” y el estado real viaja por un hilo de chat.
            </p>
            <p>
              Ejemplo. Un estudio de cinco personas lleva el trabajo en una hoja: columna Tarea,
              columna Quién, columna Estado. En tres meses el Estado tiene nueve valores
              (“ok”, “casi”, “esperando a Ana”, “revisión 2”, “lo veo mañana”). El daily del
              lunes dura 35 minutos porque cada persona recita su pedazo de la hoja. Nadie miente;
              la herramienta no tiene forma de mostrar flujo, tope ni bloqueo. Solo filas.
            </p>
            <p>
              Eso no se arregla con más columnas. Se arregla cambiando el objeto: de “lista que
              todos miramos” a “tablero donde cada tarjeta tiene un dueño, un estado y un lugar
              en el flujo”. Si todavía estás eligiendo entre lista y app, el umbral está en{" "}
              <Link to="/blogs/app-gestion-tareas" className="underline underline-offset-2">
                app de gestión de tareas
              </Link>
              . Este post asume que ya cruzaste ese umbral y el problema es el equipo, no el
              checkbox.
            </p>
          </>
        ),
      },
      {
        heading: "Qué tiene que hacer un gestor de equipo",
        body: (
          <>
            <p>
              Un gestor de tareas para equipos no necesita cincuenta vistas. Necesita tres
              operaciones que una lista no puede fingir bien: asignar, limitar el trabajo en
              curso y hacer visibles los bloqueos. El resto (filtros, etiquetas, fechas) apoya;
              sin estas tres, el daily vuelve a ser un interrogatorio.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Capacidad</th>
                  <th className="py-2 pr-4 font-semibold">Qué significa en la práctica</th>
                  <th className="py-2 font-semibold">Si falta</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Asignar un dueño</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Un nombre por tarjeta. Quien aparece es quien mueve el estado, no quien
                    “está al tanto”.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Nadie arranca, o arrancan dos. Delegar se queda en un hábito sin rastro —
                    distinto de{" "}
                    <Link
                      to="/blogs/como-delegar-tareas"
                      className="underline underline-offset-2"
                    >
                      cómo delegar
                    </Link>
                    , que es la conversación; esto es el campo que la deja visible.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Limitar el WIP</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Un tope de tarjetas en curso por persona o por columna. Terminar antes de
                    empezar otra.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Veinte “en curso” y cero entregas. El tablero es una lista horizontal. Ver{" "}
                    <Link
                      to="/blogs/kanban-limites-wip"
                      className="underline underline-offset-2"
                    >
                      límites WIP en Kanban
                    </Link>
                    .
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Ver bloqueos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Un estado o etiqueta que no es “en curso”: falta un insumo, una decisión o
                    otra persona.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El daily descubre el viernes que algo está trabado desde el martes.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Estados que dicen algo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Pocas columnas: por hacer, en curso, bloqueado, hecho. Opcional: en
                    revisión, si realmente hay un cuello.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Nueve columnas que son eufemismos de “todavía no”.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Visibilidad sin pedirla</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cualquiera consulta el tablero y entiende el estado. El chat no es el
                    sistema.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El seguimiento vuelve a ser “¿cómo vas?” —el tema de{" "}
                    <Link
                      to="/blogs/seguimiento-de-tareas-equipo"
                      className="underline underline-offset-2"
                    >
                      seguimiento sin microgestionar
                    </Link>
                    —, porque la herramienta no sostiene el pull.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Si tu herramienta hace las cinco, el gestor ya está. Si hace dashboards, IA y
              calendarios pero no asigna ni muestra bloqueos, tienes un catálogo, no un gestor
              de equipo.
            </p>
          </>
        ),
      },
      {
        heading: "De la lista al tablero en una semana",
        body: (
          <>
            <p>
              No migres “todo el histórico”. Migra lo que está vivo. Una semana alcanza para
              dejar de recitar la hoja.
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Lunes — congelar.</strong> La lista deja de crecer en columnas. Lo
                abierto se copia tal cual a tarjetas; lo cerrado de hace más de dos semanas se
                archiva. Si no vas a tocarlo este mes, no viaja.
              </li>
              <li>
                <strong>Martes — un dueño o se baja.</strong> Cada tarjeta recibe un nombre. Si
                no hay dueño al final del día, se mueve a un estacionamiento (“sin dueño”) o se
                descarta. “Todos” deja de ser un valor válido.
              </li>
              <li>
                <strong>Miércoles — cuatro columnas.</strong> Por hacer / en curso / bloqueado /
                hecho. Las columnas extra de la hoja (revisión 1, revisión 2, “lo veo mañana”)
                se convierten en etiqueta o se eliminan. Si “revisión” es un cuello real,
                entonces sí: una quinta columna con tope.
              </li>
              <li>
                <strong>Jueves — tope de WIP.</strong> Empieza por personas del equipo, o
                personas + 1. Cinco personas → 5 o 6 tarjetas en “en curso”. El resto vuelve a
                “por hacer”. Duele un día; el viernes ya se ve el flujo.
              </li>
              <li>
                <strong>Viernes — daily frente al tablero.</strong> Doce minutos. No se recita
                la lista: se miran bloqueos, se nombra quién necesita a quién, se decide qué no
                se empieza. Si alguien narra su día, se corta con “eso ya está en la tarjeta”.
              </li>
            </ol>
            <p>
              El viernes no tiene que ser perfecto. Tiene que ser irreversible: la hoja queda
              como archivo, el tablero es el lugar de verdad. Quien cargue una fila nueva en el
              Excel está trabajando en un museo.
            </p>
          </>
        ),
      },
      {
        heading: "El daily sin microgestión",
        body: (
          <>
            <p>
              El daily se pudre cuando el gestor no hace su trabajo. Si el dueño, el WIP y el
              bloqueo no están a la vista, la reunión se convierte en el único lugar donde
              existe la verdad — y entonces sí parece un interrogatorio: cada persona rinde
              cuentas porque el tablero no las rinde por ella.
            </p>
            <p>
              Con el gestor en su sitio, el daily tiene tres preguntas y ninguna es “¿cómo
              vas?”:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>¿Qué está bloqueado y quién puede destrabarlo hoy?</strong> Si no hay
                bloqueos, el daily puede durar seis minutos.
              </li>
              <li>
                <strong>¿Quién necesita a quién en las próximas horas?</strong> Coordinación,
                no reporte. “Necesito el copy de Ana antes de las 14” es una frase de daily;
                “ayer avancé en el banner” no lo es.
              </li>
              <li>
                <strong>¿Qué no vamos a empezar?</strong> El WIP se defiende aquí. Si ya hay
                tope, la respuesta es explícita: esa tarjeta espera.
              </li>
            </ul>
            <p>
              Lo que no entra: narrar el día, corregir el método de una tarea ya asignada, ni
              usar la ronda para enterarte de estados que el tablero ya muestra. Eso último es
              seguimiento mal hecho, no un daily. El hábito de no preguntar lo que ya está
              visible se entrena aparte; el gestor solo lo hace posible.
            </p>
            <p>
              Si el equipo es de dos y se sientan juntos, el daily puede ser asíncrono: un
              comentario en las tarjetas bloqueadas a las 9:30. El formato sigue al tamaño. Lo
              que no cambia es la regla: el tablero habla primero, las personas hablan de lo
              que el tablero no puede resolver.
            </p>
          </>
        ),
      },
      {
        heading: "Errores: todo el mundo owner, columnas infinitas",
        body: (
          <>
            <p>
              Los dos errores que vuelven a convertir el tablero en lista son siempre los
              mismos, y se disfrazan de “organización”.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Todo el mundo es owner.</strong> Tres nombres en una tarjeta es cero
                dueños. Si el trabajo es de verdad compartido, parte en dos tarjetas o nombra
                un responsable y un colaborador. El campo de asignación no es una lista de
                invitados.
              </li>
              <li>
                <strong>Columnas infinitas.</strong> “Esperando a Juan”, “revisión 1”,
                “revisión 2”, “casi listo”, “listo pero no enviado”. Cada una es un estado que
                nadie cierra. Si el flujo tiene un cuello real (por ejemplo, aprobación legal),
                una columna con WIP de 1 o 2. El resto son etiquetas o son “bloqueado”.
              </li>
              <li>
                <strong>WIP decorativo.</strong> El número está escrito en el título de la
                columna y el equipo lo ignora “por esta vez”. Un tope que se viola todos los
                días es una etiqueta, no un límite.
              </li>
              <li>
                <strong>Recrear la lista en cada daily.</strong> Si hay que proyectar un
                documento aparte para “ver cómo vamos”, el tablero no es la fuente de verdad.
                Arregla el tablero; no agregues un segundo artefacto.
              </li>
              <li>
                <strong>Copiar el sistema de una empresa de 80.</strong> Cuarenta tipos de
                vista, campos obligatorios y un flujo de 12 columnas para cinco personas. El
                gestor se vuelve el trabajo.
              </li>
            </ul>
            <p>
              Un gestor de tareas para equipos es un tablero con dueños, un tope y bloqueos a
              la vista. Si estás eligiendo herramienta y no hábito, vuelve al{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos
              </Link>
              : primero el flujo real, después el producto. Si el equipo es chico y quieres
              ese tablero en una carpeta local —sin cuenta, sin asientos, kanban y
              checklists—,{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                Hito
              </a>{" "}
              está pensado para 1–15 personas: JSON en tu disco, automatizaciones y IA opcional
              con tu API key. No es una lista compartida con colores.
            </p>
            <p>
              👉{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                <strong>Prueba Hito gratis</strong>
              </a>{" "}
              — sin cuenta, sin nube, sin asientos.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un gestor de tareas para equipos?",
        answer:
          "Es una herramienta donde cada ítem tiene un dueño, un estado en un flujo y un bloqueo visible. No es una lista compartida con una columna de nombres: sirve si asigna, limita el trabajo en curso y evita que el estado viva en el chat.",
      },
      {
        question: "¿Por qué falla una lista compartida en un equipo?",
        answer:
          "Porque la lista no muestra flujo ni tope. Varias personas editan las mismas filas, “en curso” significa cosas distintas y el daily se vuelve un recitado. El problema no es la disciplina: es el objeto (filas) usado como tablero.",
      },
      {
        question: "¿Qué tiene que hacer un gestor de equipo además de listar tareas?",
        answer:
          "Asignar un dueño por tarjeta, limitar el WIP, mostrar bloqueos, usar pocos estados reales y dejar que cualquiera consulte el tablero sin preguntar. Sin eso, el daily es un interrogatorio.",
      },
      {
        question: "¿Cómo pasar de la lista al tablero en una semana?",
        answer:
          "Lunes: copiar lo vivo y archivar lo viejo. Martes: un dueño por tarjeta. Miércoles: cuatro columnas. Jueves: tope de WIP. Viernes: daily de doce minutos frente al tablero. La lista queda como archivo.",
      },
      {
        question: "¿Cómo hacer un daily de equipo sin microgestionar?",
        answer:
          "Tres preguntas: qué está bloqueado, quién necesita a quién y qué no se empieza. No se recita el día ni se pide el estado que el tablero ya muestra. Si hay que preguntar “¿cómo vas?”, falta visibilidad en el gestor, no una reunión más larga.",
      },
    ],
  },
};
