import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "lista-tareas-vs-gestion-proyectos",
  title: "Lista de tareas vs gestión de proyectos: cuándo cada una",
  excerpt:
    "Una lista de tareas no es un fracaso de gestión de proyectos: es otra capa. Cuatro señales de que ya necesitas proyectos, dependencias y un dueño de alcance.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-08-26",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "software-gestion-proyectos",
  related: [
    "software-gestion-proyectos",
    "app-gestion-tareas",
    "gestion-de-proyectos-guia-completa",
  ],
  seo: {
    title: "Lista de tareas vs gestión de proyectos | Hito",
    description:
      "Lista de tareas vs gestión de proyectos: cuándo alcanza el to-do y cuándo hacen falta alcance, dependencias, varios dueños y presupuesto.",
    ogImageAlt: "Tabla: lista de tareas frente a gestión de proyectos y cuándo saltar de capa.",
  },
  content: {
    eyebrow: "Software",
    intro: (
      <>
        <strong>En una línea:</strong>{" "}
        <strong>lista de tareas vs gestión de proyectos</strong> no es un veredicto: son capas.
        Todoist no fracasó; deja de alcanzar cuando hay dependencias, varios dueños, un cliente
        externo o un presupuesto. Si aparecen esas cuatro señales, el salto a proyecto no es
        snobismo: es el mínimo para no perder alcance.
      </>
    ),
    sections: [
      {
        heading: "La lista no es un fracaso: es otra capa",
        body: (
          <>
            <p>
              El consejo que más daño hace: “deja el to-do y pásate a un software de proyectos”.
              Una lista de tareas hace un trabajo que un proyecto no hace mejor: capturar, no
              olvidar, cerrar lo de hoy. Todoist, Reminders o una lista en el cuaderno no son un
              PMO a medias. Son la capa de captura. El error es usarlos como si fueran la capa
              de alcance, dependencias y presupuesto.
            </p>
            <p>
              En una pyme de 12, las dos capas conviven. El diseñador tiene su lista personal
              del día; el proyecto del cliente tiene alcance, fecha y un dueño. Mezclarlas es
              cómo un lanzamiento se convierte en 80 ítems sin orden y un “¿y el presupuesto?”
              que nadie puede responder. Separarlas es cómo la lista sigue siendo útil el día
              que el proyecto se pone serio.
            </p>
            <p>
              Qué tiene que hacer una{" "}
              <Link to="/blogs/app-gestion-tareas" className="underline underline-offset-2">
                app de gestión de tareas
              </Link>{" "}
              (captura, responsable, recurrencia) es un problema distinto al de elegir{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos
              </Link>
              . Acá la pregunta es más simple: ¿en qué capa estás, y cuándo el salto está
              justificado?
            </p>
          </>
        ),
      },
      {
        heading: "Cuatro señales de que el salto ya está justificado",
        body: (
          <>
            <p>
              No saltes porque “los equipos serios usan proyectos”. Salta cuando aparece una de
              estas cuatro señales. Una sola ya duele; dos juntas, casi siempre.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Dependencias.</strong> B no puede empezar hasta que A termine, y C
                espera a las dos. En una lista eso es un comentario (“esperar a María”). En un
                proyecto es una relación: si A se atrasa, la fecha de entrega se mueve. Cuando
                el “esperar a” aparece tres veces en la misma semana, ya no es una lista.
              </li>
              <li>
                <strong>Varios dueños.</strong> La lista personal tiene un dueño: tú. En cuanto
                hay tres personas que tienen que terminar cosas distintas para el mismo
                resultado, alguien tiene que ver el conjunto. Una lista compartida con nombres
                entre paréntesis no es varios dueños: es un chat disfrazado de to-do.
              </li>
              <li>
                <strong>Cliente externo.</strong> Hay que informar estado, cerrar alcance y
                nombrar el extra. El cliente no vive en tu Todoist. Una agencia de 8 con tres
                cuentas activas que “se gestionan por lista” descubre el scope creep cuando el
                cliente pregunta por un entregable que nunca estuvo escrito. El detalle de esa
                línea está en{" "}
                <Link
                  to="/blogs/alcance-de-proyecto-scope-creep"
                  className="underline underline-offset-2"
                >
                  alcance de proyecto y scope creep
                </Link>
                .
              </li>
              <li>
                <strong>Presupuesto.</strong> Horas, dinero o ambos. Una lista dice “hecho” o
                “pendiente”. No dice si el hecho cabía en lo cobrado. Si alguien pregunta “¿cuánto
                nos queda de este cliente?” y la respuesta es abrir el mail, ya saliste de la
                capa de tareas.
              </li>
            </ul>
            <p>
              Una pyme de 12 suele pegar las cuatro a la vez: un trabajo interno (varios dueños),
              un cliente que espera (externo), un proveedor que entrega antes (dependencia) y un
              monto cerrado (presupuesto). Seguir en lista no es humildad: es no tener dónde
              anotar esas cuatro cosas.
            </p>
          </>
        ),
      },
      {
        heading: "Tres capas: captura personal, equipo con plazos, proyecto",
        body: (
          <>
            <p>
              No son tres herramientas obligatorias. Son tres preguntas. La tabla evita el salto
              prematuro y el salto tardío.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Capa</th>
                  <th className="py-2 pr-4 font-semibold">Para qué sirve</th>
                  <th className="py-2 pr-4 font-semibold">Qué tiene</th>
                  <th className="py-2 font-semibold">Cuándo se rompe</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Captura personal</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    No olvidar. Cerrar el día. Sacar de la cabeza.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Inbox, fecha, listas, a veces recurrencia. Un solo dueño: tú.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Aparece un segundo dueño, o el ítem es en realidad un resultado con fecha
                    para otra persona.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Equipo con plazos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Coordinar quién hace qué y para cuándo, sin un alcance formal.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Asignación, fechas, visibilidad compartida. Una lista o un tablero simple.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Hay dependencias, un cliente que pide status, o hay que defender un
                    presupuesto.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">
                    Proyecto con alcance y presupuesto
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Entregar un resultado con fecha, dueño de alcance y un costo que se puede
                    mirar.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Alcance escrito, dependencias, hitos, presupuesto, un dueño del conjunto.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Tratarlo otra vez como lista: 80 ítems, cero línea de “qué no entra”.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La capa del medio es la que más confunde. Un tablero compartido con plazos ya no
              es captura personal, y todavía no es gestión de proyectos. Sirve para el trabajo
              recurrente de un equipo de 8 que se reparte tickets. Deja de servir el día que
              esos tickets son, en realidad, un sitio web con fecha de lanzamiento y un monto
              cerrado.
            </p>
            <p>
              La{" "}
              <Link
                to="/blogs/gestion-de-proyectos-guia-completa"
                className="underline underline-offset-2"
              >
                guía completa de gestión de proyectos
              </Link>{" "}
              cubre fases, roles y métodos de esa tercera capa. No la necesitas para tu lista
              del martes. La necesitas cuando el martes tiene un cliente, una dependencia y un
              número.
            </p>
          </>
        ),
      },
      {
        heading: "Qué ganas (y qué pierdes) al pasar a proyecto",
        body: (
          <>
            <p>
              El salto tiene costo. Si no lo nombras, vuelves a la lista a la semana porque “era
              más rápido”.
            </p>
            <p>
              <strong>Ganas</strong> una línea de alcance, un lugar para las dependencias, un
              dueño del conjunto y una respuesta a “cuánto queda” que no es rebuscar en el chat.
              Ganas también un cierre: un proyecto termina; una lista no. En una agencia de 8,
              eso es la diferencia entre cobrar el último hito y dejar la cuenta abierta “por
              si sale algo”.
            </p>
            <p>
              <strong>Pierdes</strong> la fricción cero de tachar una línea. Un proyecto pide
              nombrar qué entra, qué no, quién aprueba. Los primeros días se sienten lentos. Si
              el trabajo era de verdad captura personal —comprar, llamar, enviar un mail— esa
              fricción no se paga sola. Por eso la señal importa: no conviertas el supermercado
              en un project charter.
            </p>
            <p>
              Una regla práctica en una pyme de 12: la lista personal sigue existiendo. El
              proyecto no la reemplaza; le quita lo que no le pertenecía. Lo que es “hoy, mío,
              sin dependencia” se queda en el to-do. Lo que es “nosotros, con fecha, para un
              cliente o con un monto” se va al proyecto.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo saltar de capa sin tirar el to-do",
        body: (
          <>
            <p>
              No migres 400 ítems. Migra el resultado que ya tiene las cuatro señales.
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                Elige un trabajo que ya tenga cliente, o varios dueños, o un monto — no el inbox
                entero.
              </li>
              <li>
                Escribe en media página qué entra, qué no entra y quién es dueño del alcance.
                Sin eso, el “proyecto” es una lista con otro nombre.
              </li>
              <li>
                Pasa solo las tareas de ese resultado. El resto de la lista personal se queda
                donde está.
              </li>
              <li>
                Nombra las dependencias en voz alta: “esto no empieza hasta que aquello
                termine”. Si no puedes decirlo, todavía era una lista.
              </li>
              <li>
                Deja el to-do para lo de hoy. Si en dos semanas el proyecto se volvió otra lista
                larga, el alcance no se escribió: no es culpa de la herramienta.
              </li>
            </ol>
            <p>
              Excel entra en esta conversación como atajo falso: una hoja con nombres y fechas
              parece “equipo con plazos” y se siente como proyecto. Es una tabla. Cuando hay
              más de un editor y el archivo es la fuente de verdad, tienes el peor de los dos
              mundos: ni la captura rápida ni el flujo de un proyecto. Una app de tareas o un
              tablero gana a la hoja en dueños y estados; un proyecto gana a ambos cuando
              aparecen las cuatro señales.
            </p>
            <p>
              Si el salto ya está justificado y quieres un gestor local-first —proyectos y
              listas en tu equipo, sin asientos, con los datos en JSON—,{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              cubre las dos capas sin obligarte a tirar el to-do.
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
              — gestor de proyectos local-first: kanban, SOPs y automatizaciones en tu equipo,
              IA opcional, PWA. Sin cuenta, sin asientos, sin nube.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo decidir si pasas de lista de tareas a gestión de proyectos",
      steps: [
        {
          name: "Revisa las cuatro señales",
          text: "Dependencias, varios dueños, cliente externo, presupuesto. Una sola ya justifica mirar la capa de proyecto; dos juntas, casi siempre el salto.",
        },
        {
          name: "No migres el inbox: elige un resultado",
          text: "Un trabajo con fecha y un ‘qué queda listo’, no las 400 líneas del to-do. La lista personal sigue existiendo para lo de hoy.",
        },
        {
          name: "Escribe alcance en media página",
          text: "Qué entra, qué no entra, quién es dueño. Sin esa línea, el proyecto es una lista con otro nombre y el scope creep entra por chat.",
        },
        {
          name: "Nombra las dependencias y el presupuesto",
          text: "Si no puedes decir ‘B espera a A’ ni ‘esto cabe en X horas o X dinero’, todavía no es un proyecto: sigue en la capa de equipo con plazos.",
        },
      ],
    },
    faq: [
      {
        question: "¿Cuándo pasar de una lista de tareas a un proyecto?",
        answer:
          "Cuando aparecen dependencias, varios dueños, un cliente externo o un presupuesto. Una de esas cuatro señales ya duele; dos juntas justifican el salto. Todoist (o cualquier to-do) no fracasó: dejó de ser la capa correcta para ese trabajo.",
      },
      {
        question: "¿Cuál es la diferencia entre una lista de tareas y un kanban?",
        answer:
          "La lista es una cola de ítems (hoy, míos, tachables). Un kanban es flujo: columnas, tarjetas y, si es kanban de verdad, un límite de trabajo en curso. Puedes tener un kanban personal que sigue siendo captura, no gestión de proyectos. El proyecto aparece cuando hay alcance, dependencias y un dueño del conjunto.",
      },
      {
        question: "¿Excel sirve como gestión de proyectos o es una lista?",
        answer:
          "Excel es una tabla. Para un dueño y un proyecto chico puede fingir lista o plan. Deja de servir cuando hay varios editores, dependencias que deberían recalcularse o el archivo se vuelve la fuente de verdad. Ahí una app de tareas gana en dueños y estados; un proyecto gana cuando hay alcance y presupuesto.",
      },
      {
        question: "¿Puedo seguir usando Todoist si el equipo ya tiene proyectos?",
        answer:
          "Sí. La lista personal no se tira: se queda con lo de hoy, sin dependencia ni cliente. El proyecto se lleva el resultado compartido (alcance, dueños, fecha, monto). Mezclar las dos capas en un solo to-do es cómo un lanzamiento se convierte en 80 ítems sin orden.",
      },
      {
        question: "¿Una lista compartida con nombres ya es gestión de proyectos?",
        answer:
          "No: es la capa de equipo con plazos. Sirve para coordinar quién hace qué y para cuándo. Se vuelve proyecto cuando alguien tiene que defender alcance, dependencias o presupuesto — no cuando le pones el nombre del compañero entre paréntesis.",
      },
    ],
  },
};
