import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "informe-de-estado-semanal",
  title: "Informe de estado semanal en 5 líneas",
  excerpt:
    "Un informe de estado de proyecto no necesita una reunión ni un PowerPoint. Cinco líneas, una vez por semana, y el tablero ya no hace falta explicarlo.",
  category: "plantillas",
  categoryLabel: "Plantillas",
  publishedAt: "2027-05-03",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "plantillas-gestion-proyectos",
  related: [
    "plantillas-gestion-proyectos",
    "reuniones-de-status-eliminar",
    "seguimiento-de-tareas-equipo",
  ],
  seo: {
    title: "Informe de estado semanal de proyecto en 5 líneas | Hito",
    description:
      "Cómo escribir un informe de estado de proyecto en 5 líneas, una vez por semana, y dejar de usar la reunión de status para repetir el tablero.",
    ogImageAlt: "Plantilla de informe de estado semanal de proyecto en 5 líneas.",
  },
  content: {
    eyebrow: "Plantillas",
    intro: (
      <>
        <strong>En una línea:</strong> un <strong>informe de estado de proyecto</strong> no es un
        PowerPoint ni una reunión: son cinco líneas, una vez por semana, que dicen si vamos bien,
        qué se cerró, qué está trabado, qué viene y qué decisión necesitas. El tablero muestra las
        tarjetas; este texto muestra el juicio. Si lo escribes cada viernes, la reunión de status
        deja de tener material.
      </>
    ),
    sections: [
      {
        heading: "El informe de estado de proyecto que reemplaza la reunión",
        body: (
          <>
            <p>
              La reunión de status sobrevive porque alguien tiene que “contar cómo va”. El problema
              no es la información: es el formato. Diez personas escuchan a cada una repetir lo que
              ya está en el tablero, y las únicas frases útiles —un bloqueo, una fecha en riesgo,
              un “necesito que legal firme”— se diluyen entre turnos.
            </p>
            <p>
              Un informe de estado semanal de 5 líneas da vuelta el flujo: primero se lee, después
              se habla solo si hay algo que decidir. Es el mismo reemplazo que describe{" "}
              <Link
                to="/blogs/reuniones-de-status-eliminar"
                className="underline underline-offset-2"
              >
                cómo eliminar las reuniones de status
              </Link>
              : el tablero cubre “en qué está cada tarjeta”; el informe cubre “qué debería
              preocuparte esta semana”, en 90 segundos.
            </p>
          </>
        ),
      },
      {
        heading: "La plantilla: 5 líneas, ni una más",
        body: (
          <>
            <p>
              Copia este orden y no lo improvises. El valor está en que todos saben dónde mirar:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Línea</th>
                  <th className="py-2 pr-4 font-semibold">Qué va</th>
                  <th className="py-2 font-semibold">Límite</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">1. Semáforo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Verde / amarillo / rojo + una frase que justifique el color
                  </td>
                  <td className="py-2 text-muted-foreground">1 oración</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">2. Cerrado esta semana</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Entregables terminados y aceptados, no “casi listo”
                  </td>
                  <td className="py-2 text-muted-foreground">2–4 ítems</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">3. En curso</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Lo que está vivo, y si está trabado: por quién o por qué
                  </td>
                  <td className="py-2 text-muted-foreground">2–4 ítems</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">4. Próxima semana</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El foco, no la lista completa del backlog
                  </td>
                  <td className="py-2 text-muted-foreground">1–3 ítems</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">5. Pedidos / decisiones</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Qué necesitas, de quién, y qué pasa si no llega
                  </td>
                  <td className="py-2 text-muted-foreground">0–3 pedidos</td>
                </tr>
              </tbody>
            </table>
            <p>
              Si una línea queda vacía, escríbela igual: “Pedidos: ninguno”. El vacío es
              información. Un informe que omite la línea 5 obliga al lector a adivinar si no hay
              bloqueos o si te los olvidaste.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo lleno: un sitio web que ya va tarde",
        body: (
          <>
            <p>
              Proyecto: rediseño y lanzamiento de la tienda. Fecha original: 15 de mayo. Hoy es
              viernes 8. El copy de checkout está en legal desde el martes y los pagos no cierran
              sin ese texto. Así se ve el informe, no un discurso:
            </p>
            <p className="rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <strong>Semáforo:</strong> amarillo — el 15 se mueve al 22 si legal no suelta el copy
              de checkout esta semana.
              <br />
              <strong>Cerrado:</strong> home y listado de productos en staging; formulario de
              contacto con validación; redirecciones 301 de las 12 URLs viejas.
              <br />
              <strong>En curso:</strong> copy de checkout trabado en legal (espera desde el mar.
              5); integración de pagos al ~70%, bloqueada por el mismo copy; carga de 40 SKU sin
              empezar.
              <br />
              <strong>Próxima semana:</strong> destrabar copy, terminar pagos, QA de checkout,
              cargar catálogo.
              <br />
              <strong>Pedidos:</strong> Legal — ¿el disclaimer de envíos sale antes del miércoles?
              Si no, recortamos envíos internacionales del MVP y mantenemos el 15.
            </p>
            <p>
              Tres cosas que este texto hace y un status oral casi nunca: pone fecha concreta al
              riesgo, nombra al dueño del bloqueo, y ofrece un recorte si la decisión no llega. Eso
              es lo que un{" "}
              <Link
                to="/blogs/proyecto-atrasado-que-hacer"
                className="underline underline-offset-2"
              >
                proyecto atrasado
              </Link>{" "}
              necesita antes de pedir más plazo: un diagnóstico en una pantalla, no una reunión
              para “alinearnos”.
            </p>
          </>
        ),
      },
      {
        heading: "El ritual de los 10 minutos",
        body: (
          <>
            <p>
              El informe se pudre cuando lo escribes de memoria el viernes a las 18:00. El ritual
              es corto y siempre igual:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                Abre el tablero, no el chat. Filtra lo movido a “hecho” esta semana y lo que sigue
                en “en curso”.
              </li>
              <li>
                Pregúntate una sola cosa para el semáforo: ¿la fecha comprometida sigue en pie sin
                milagro? Sí = verde. Sí, pero con un “si” = amarillo. No = rojo.
              </li>
              <li>
                De “en curso”, marca qué está trabado. Si no está trabado, no lo expliques: nómbralo
                y listo.
              </li>
              <li>
                Escribe los pedidos como tickets a una persona, no como quejas al aire (“necesitamos
                más claridad” no es un pedido).
              </li>
              <li>
                Envíalo al mismo canal, el mismo día, a la misma hora. Viernes 16:00 o lunes 9:00 —
                da igual, siempre igual.
              </li>
            </ol>
            <p>
              Si tardas más de 10 minutos, estás redactando para quedar bien. Recorta adjetivos.
              El{" "}
              <Link
                to="/blogs/seguimiento-de-tareas-equipo"
                className="underline underline-offset-2"
              >
                seguimiento de tareas
              </Link>{" "}
              vive en el tablero; el informe no lo sustituye.
            </p>
          </>
        ),
      },
      {
        heading: "Qué no poner (aunque dé ganas)",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>La lista de todas las tarjetas.</strong> Eso ya está en el tablero. Si el
                lector necesita el detalle, que abra el tablero — no lo copies.
              </li>
              <li>
                <strong>Horas trabajadas.</strong> “Juan cargó 32 horas” no dice si el hito vive.
                El informe habla de resultados y riesgos, no de esfuerzo.
              </li>
              <li>
                <strong>Justificaciones largas.</strong> “Estuvimos muy ocupados con el otro
                cliente” es contexto para una conversación, no para la línea 1. El semáforo no
                pide disculpas: pide una frase de impacto.
              </li>
              <li>
                <strong>Capturas de un Gantt ilegible.</strong> Si hace falta un adjunto para
                entender el estado, el estado no está escrito.
              </li>
              <li>
                <strong>Un “todo bien” en verde cuando hay un bloqueo de 5 días.</strong> Mentir el
                color quema el instrumento: la segunda vez que pongas verde, nadie lo cree.
              </li>
            </ul>
            <p>
              Una regla práctica: si una frase no cambia lo que el lector va a hacer el lunes, no
              entra. Hay más plantillas de este tipo en{" "}
              <Link
                to="/blogs/plantillas-gestion-proyectos"
                className="underline underline-offset-2"
              >
                plantillas de gestión de proyectos
              </Link>
              ; esta es la más chica a propósito.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo circularlo sin volver a la reunión",
        body: (
          <>
            <p>
              El informe falla cuando “hay que presentarlo”. Si alguien lo lee en voz alta el lunes
              mientras el resto mira el mismo párrafo, reconstruiste la reunión con más pasos.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Un canal, no tres.</strong> El mismo hilo o el mismo doc cada semana. Quien
                llegue tarde no debería buscar en el correo, Slack y un PDF.
              </li>
              <li>
                <strong>Lectura asíncrona por default.</strong> 24 horas para comentarios en el
                hilo. Si nadie marca un pedido, no hay reunión.
              </li>
              <li>
                <strong>Reunión solo con agenda de decisiones.</strong> “Punto 5: legal, sí o no
                al disclaimer antes del miércoles”. Quince minutos, no un tour del tablero.
              </li>
              <li>
                <strong>Un dueño por proyecto.</strong> No un informe por persona: eso fragmenta
                el status otra vez.
              </li>
            </ul>
            <p>
              Si el sponsor no lee, no alargues el texto: acórtalo y pregunta en la línea 5 qué
              necesita para decidir.
            </p>
          </>
        ),
      },
      {
        heading: "Semáforo amarillo o rojo: qué cambia",
        body: (
          <>
            <p>
              Verde se escribe y se archiva. Amarillo y rojo tienen trabajo extra, siempre el
              mismo:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Amarillo:</strong> nombra la condición que lo vuelve verde o rojo (“si
                legal responde el miércoles, seguimos al 15”). Sin esa condición, es un amarillo
                eterno — el color más inútil.
              </li>
              <li>
                <strong>Rojo:</strong> no pidas plazo en la línea 1. Di el impacto, el recorte
                posible y la decisión que necesitas. El pedido de fecha nueva, si hace falta, va
                después de haber ofrecido un recorte — el mismo orden que en el playbook de
                atraso.
              </li>
            </ul>
            <p>
              En el ejemplo del sitio, el amarillo ya trae el plan B (sacar envíos
              internacionales). Un rojo se vería así: “Rojo — el 15 no se cumple; sin copy no hay
              pagos. Opciones: (a) lanzar el 22 con checkout local, (b) lanzar el 15 sin pago en
              línea y cobrar por transferencia.” El informe no reemplaza la decisión; la deja
              lista para tomarla.
            </p>
            <p>
              Empieza el viernes que viene con las 5 líneas. El primero queda flojo; el tercero
              ya te ahorra el “¿cómo vamos?”. Si un mes después sigues leyéndolo en voz alta, el
              formato no es el problema: es el hábito de no leer. Si quieres que esas 5 líneas
              vivan junto al tablero y no en un doc suelto,{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                Hito
              </a>{" "}
              guarda proyectos y checklists en local, sin cuenta ni nube.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo escribir un informe de estado semanal en 5 líneas",
      steps: [
        {
          name: "Abrir el tablero, no la bandeja",
          text: "Filtra lo cerrado esta semana y lo que sigue en curso. El informe se escribe contra hechos del tablero, no contra recuerdos del chat.",
        },
        {
          name: "Elegir el semáforo con una frase",
          text: "Verde si la fecha comprometida sigue en pie; amarillo si depende de un \"si\"; rojo si ya no se cumple. Una oración que justifique el color, sin disculpas.",
        },
        {
          name: "Listar lo cerrado y lo trabado",
          text: "En cerrado, solo lo terminado y aceptado. En curso, nombra el bloqueo (quién o qué) cuando existe; no expliques lo que fluye.",
        },
        {
          name: "Escribir el foco de la próxima semana y los pedidos",
          text: "1–3 ítems de foco, no el backlog. Pedidos con dueño, fecha y consecuencia si no llegan. Si no hay pedidos, escríbelo: ninguno.",
        },
        {
          name: "Enviarlo al mismo canal y no presentarlo",
          text: "Mismo día, misma hora, mismo hilo. 24 horas para comentarios. Reunión solo si un pedido de la línea 5 necesita decisión en vivo.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es un informe de estado de proyecto?",
        answer:
          "Es un resumen corto, periódico, de si el proyecto va según lo comprometido, qué se cerró, qué está trabado, qué sigue y qué decisión hace falta. No es un acta, no es un Gantt y no es una lista de horas: es el juicio de quien lleva el proyecto, en un formato que se lee en un minuto.",
      },
      {
        question: "¿Cuántas líneas debería tener un informe de estado semanal?",
        answer:
          "Cinco: semáforo, cerrado, en curso, próxima semana y pedidos. Si te lleva más de 150 palabras, estás copiando el tablero. Recorta adjetivos y deja hechos, bloqueos y decisiones.",
      },
      {
        question: "¿El informe semanal reemplaza la reunión de status?",
        answer:
          "Sí, reemplaza la parte de reporte. La reunión solo queda para decisiones o bloqueos entre personas que no se resuelven por escrito. Si cada lunes lees el mismo texto en voz alta, no ahorraste nada.",
      },
      {
        question: "¿Quién escribe el informe si hay varios frentes?",
        answer:
          "Un dueño por proyecto, no un informe por persona. Varios reportes individuales vuelven a fragmentar el status. Si alguien necesita dar detalle de su parte, que actualice el tablero, no que agregue un sexto párrafo.",
      },
      {
        question: "¿Con qué frecuencia se envía si el proyecto es chico?",
        answer:
          "Una vez por semana alcanza para casi cualquier proyecto de semanas o meses. Diario solo tiene sentido en una crisis de días (un corte, un lanzamiento esta semana). Quincenal se atrasa: los bloqueos de 10 días llegan cuando ya no hay margen.",
      },
    ],
  },
};
