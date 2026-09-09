import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "tareas-recurrentes",
  title: "Tareas recurrentes: recurrencia vs plantilla vs SOP",
  excerpt:
    "Tareas recurrentes: cuándo usar una recurrencia, una plantilla o un SOP, cómo elegir la periodicidad sin fabricar ruido y cuándo matar la repetición.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-07",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "tablero-kanban",
  related: [
    "tablero-kanban",
    "como-documentar-procesos-equipos",
    "plan-de-trabajo",
  ],
  seo: {
    title: "Tareas recurrentes: recurrencia vs plantilla vs SOP | Hito",
    description:
      "Tareas recurrentes: cuándo usar una recurrencia, una plantilla o un SOP, cómo elegir la periodicidad sin fabricar ruido y cuándo matar la repetición.",
    ogImageAlt: "Tareas recurrentes en un tablero: recurrencia, plantilla y SOP.",
  },
  content: {
    eyebrow: "Procesos",
    intro: (
      <>
        <strong>En una línea:</strong> las tareas recurrentes son el trabajo que vuelve
        —facturar, publicar, hacer onboarding— y hay tres formas de manejarlas: recurrencia,
        plantilla y SOP. Elegir mal fabrica ruido: calendarios llenos de recordatorios que
        nadie hace y procesos que nadie consulta. La clave es casar la herramienta con la
        cadencia real.
      </>
    ),
    sections: [
      {
        heading: "El problema: lo repetitivo inunda el backlog (o desaparece)",
        body: (
          <>
            <p>
              En casi todo equipo hay un estrato de trabajo que vuelve: facturar cada mes, dar
              de alta a cada cliente nuevo, publicar el contenido de cada semana. Ese estrato
              se gestiona mal de dos formas opuestas e igual de caras. La primera: desaparece
              del sistema y depende de la memoria de alguien —y el mes que esa persona se va,
              la facturación se va con ella—. La segunda: todo se convierte en recurrencia y
              el backlog se llena de recordatorios que nadie atiende.
            </p>
            <p>
              El costo del primer error es un incidente; el del segundo, ruido crónico:
              tarjetas vencidas acumuladas que enseñan al equipo a ignorar el tablero. La
              pregunta correcta no es «¿cómo registro esta tarea repetitiva?» sino «¿qué tipo
              de repetición es esta?». Y hay tres tipos.
            </p>
          </>
        ),
      },
      {
        heading: "Recurrencia, plantilla y SOP: tres herramientas distintas",
        body: (
          <>
            <p>
              La recurrencia repite por calendario, la plantilla repite por evento y el SOP
              documenta el cómo. Se eligen mal porque en la herramienta de turno las tres
              parecen lo mismo: una lista de tareas. La diferencia está en qué dispara la
              repetición y en cuánta variación tiene el trabajo:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Enfoque</th>
                  <th className="py-2 pr-4 font-semibold">Qué es</th>
                  <th className="py-2 pr-4 font-semibold">Cuándo usarlo</th>
                  <th className="py-2 font-semibold">Ejemplo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Recurrencia</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    La tarea se crea sola cada cierto tiempo, se hace y se cierra.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Trabajo corto, igual cada vez, disparado por fecha.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Facturación mensual: el 1.º de cada mes, sin variación.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Plantilla</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Un paquete de tareas predefinido que se instancia cuando ocurre un evento.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Misma secuencia siempre, disparada por un suceso, no por el calendario.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Onboarding de cliente: 9 pasos desde que firma el contrato.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">SOP</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El documento que explica cómo se hace el trabajo, paso a paso.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El trabajo varía, lo ejecutan personas distintas o se quiere traspasar.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Publicación de blog: brief, borrador, revisión, SEO, publicación.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El SOP es el único de los tres que transfiere conocimiento, y por eso es la pieza
              que convierte trabajo de especialista en trabajo de equipo. Cómo escribirlo para
              que la gente lo use de verdad —y no otro documento que nadie abre— está en{" "}
              <Link
                to="/blogs/como-documentar-procesos-equipos"
                className="underline underline-offset-2"
              >
                cómo documentar procesos de un equipo
              </Link>
              .
            </p>
            <p>
              La prueba rápida: si la tarea siempre es igual y dura minutos, recurrencia. Si
              cambia el día pero no los pasos, plantilla. Si cambian los pasos según quién lo
              haga, SOP —y probablemente también plantilla, con el SOP enlazado dentro.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo elegir la periodicidad (cadencia real contra cadencia deseada)",
        body: (
          <>
            <p>
              El error más común al crear una recurrencia no es la herramienta sino la
              frecuencia: se programa la cadencia deseada —«facturaríamos idealmente cada
              semana»— en lugar de la real. A las tres semanas hay dos recurrencias vencidas,
              y cada vencida ignorada erosiona la credibilidad de todo el tablero: el equipo
              aprende que las fechas del sistema son sugerencias.
            </p>
            <p>
              La regla honesta: empieza por la cadencia que hoy cumples de verdad, aunque te
              parezca poca, y aprieta solo cuando lleves un mes cumpliéndola. Si quieres pasar
              de facturación mensual a quincenal, primero demuestra que la mensual entra como
              reloj. La cadencia deseada es un objetivo de mejora, no una configuración.
            </p>
            <p>
              Señal de cadencia mal puesta: la recurrencia se cierra tarde siempre, o se
              cierra «en blanco» —marcada como hecha sin revisar nada—. Ninguna de las dos es
              un problema de disciplina: es el calendario pidiendo un ajuste.
            </p>
          </>
        ),
      },
      {
        heading: "Automatizar sin nube: reglas, no robots",
        body: (
          <>
            <p>
              Automatizar lo repetitivo no exige integraciones complejas ni suscripciones: una
              regla de tres piezas cubre la mayoría de los casos. Disparador: «cuando una
              tarjeta entra a la columna Cliente firmado». Condición: «si el tipo de proyecto
              es web». Acción: «crear las 9 tareas de onboarding con dueño y fecha».
            </p>
            <p>
              Esa estructura —trigger, condición, acción— reemplaza a la recurrencia en los
              casos donde el disparador real es un evento y no una fecha: la plantilla de
              onboarding no debería crear tareas cada lunes, sino en el momento en que algo
              cambia de columna. Bien puesta la regla, la automatización no ahorra tecleo:
              ahorra la memoria que falla.
            </p>
            <p>
              Lo que todavía no conviene automatizar: lo que cambia de forma cada vez y lo que
              se hace menos de una vez al mes. Automatizar un proceso inmaduro solo consigue
              que el error se repita con puntualidad perfecta.
            </p>
          </>
        ),
      },
      {
        heading: "Cuándo matar una tarea recurrente",
        body: (
          <>
            <p>
              Una recurrencia no es un contrato vitalicio. Estas señales dicen que toca
              retirarla:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Tres tandas seguidas cerradas sin revisar nada.</strong> El check de
                inercia es el síntoma clásico: se marca para que deje de sonar.
              </li>
              <li>
                <strong>Nadie sabe para qué existe.</strong> Si preguntas en el equipo y la
                respuesta es «siempre se hizo», ya no es un proceso: es una tradición.
              </li>
              <li>
                <strong>El evento que la originó ya no ocurre.</strong> El cliente cambió, el
                reporte se canceló, la plataforma migró.
              </li>
              <li>
                <strong>Vive fuera del tablero.</strong> Si la gente la apunta en otro lado
                para no verla en el sistema, la recurrencia ya perdió la batalla.
              </li>
            </ul>
            <p>
              La revisión trimestral de recurrencias toma 15 minutos: recorre la lista, mata
              las muertas, ajusta las cadencias que se cerraron tarde siempre y pregunta por
              cada una la pregunta incómoda: «¿si dejáramos de hacerla, pasaría algo?». Lo que
              sobreviva a esa pregunta merece seguir en el calendario.
            </p>
            <p>
              Si quieres manejar lo repetitivo en una herramienta local-first —checklists y
              SOPs junto al tablero, automatizaciones con reglas simples, tus datos en tu
              propia carpeta en JSON y sin cuenta—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              está hecho para equipos de 1 a 15 personas.
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
              — recurrencias, plantillas y SOPs en tu carpeta, sin nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué son las tareas recurrentes?",
        answer:
          "Son las tareas que se repiten con una cadencia conocida —facturar cada mes, publicar cada semana, revisar métricas cada lunes— y que por lo mismo conviene gestionar de forma sistemática en lugar de depender de la memoria. No toda repetición se resuelve igual: según el caso encaja una recurrencia por calendario, una plantilla por evento o un SOP documentado.",
      },
      {
        question: "¿Cuándo usar una plantilla en vez de una tarea recurrente?",
        answer:
          "Cuando la repetición la dispara un evento y no una fecha: la plantilla encaja si los pasos son siempre los mismos pero el momento depende de que algo ocurra —un cliente firma, se cierra una venta—. La recurrencia, en cambio, encaja cuando el calendario manda: el 1.º de cada mes toca facturar, llueva o no.",
      },
      {
        question: "¿Qué es un SOP y cuándo conviene?",
        answer:
          "Un SOP es el documento que explica cómo se hace un proceso paso a paso, con el nivel de detalle que necesita quien no lo ha hecho nunca. Conviene cuando el trabajo varía, lo ejecutan personas distintas o quieres poder traspasarlo; es la pieza que convierte el conocimiento de un especialista en capacidad de todo el equipo.",
      },
      {
        question: "¿Cómo automatizar tareas repetitivas?",
        answer:
          "Con reglas simples de tres piezas: disparador (cuando pasa X), condición (si se cumple Y) y acción (crear Z con dueño y fecha). Por ejemplo: cuando una tarjeta entra a la columna «Cliente firmado», crear las tareas de onboarding. No hace falta nube ni integraciones complejas: la automatización que importa no ahorra tecleo, ahorra la memoria que falla.",
      },
      {
        question: "¿Cada cuánto revisar las tareas recurrentes?",
        answer:
          "Una revisión ligera cada semana —mirar qué quedó vencida y por qué— y una revisión de fondo cada trimestre, donde se matan las recurrencias muertas, se ajustan las cadencias que siempre se cierran tarde y se cuestiona si cada proceso sigue teniendo sentido. Sin el cierre trimestral, el calendario se llena de tradiciones.",
      },
    ],
  },
};
