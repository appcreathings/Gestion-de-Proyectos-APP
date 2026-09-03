import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "historias-de-usuario",
  title: "Historias de usuario: formato y cómo cortarlas",
  excerpt:
    "Qué es una historia de usuario, el formato «como X quiero Y para Z», los criterios de aceptación y cómo cortar historias grandes. Con ejemplos dentro y fuera de software.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-03",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "tablero-kanban",
  related: [
    "tablero-kanban",
    "que-es-un-backlog",
    "sprint-planning-como-hacerlo",
    "matriz-raci",
  ],
  seo: {
    title: "Historias de usuario: formato y ejemplos | Hito",
    description:
      "Historias de usuario: qué son, el formato ‘como… quiero… para…’, criterios de aceptación, cómo cortar historias grandes y el error del épico eterno. Con ejemplos.",
    ogImageAlt: "Formato de historias de usuario: como X quiero Y para Z, con criterios.",
  },
  content: {
    eyebrow: "Organización del trabajo",
    intro: (
      <>
        <strong>En una línea:</strong> una <strong>historia de usuario</strong> es un trabajo
        escrito desde quien lo va a usar —“como <em>[rol]</em> quiero <em>[necesidad]</em> para{" "}
        <em>[beneficio]</em>”—, lo bastante pequeña para terminar en pocos días y con criterios
        de aceptación que digan cuándo está hecha. No es una tarea con nombre elegante: es la
        unidad de trabajo que evita construir cosas que nadie pidió.
      </>
    ),
    sections: [
      {
        heading: "Qué es una historia de usuario",
        body: (
          <>
            <p>
              Una <strong>historia de usuario</strong> (o <em>user story</em>) es la descripción
              corta de una necesidad, contada desde la perspectiva de quien la vive, junto con el
              criterio que permite verificar que quedó resuelta. Nació en metodologías ágiles de
              software (Extreme Programming, luego Scrum), pero el formato sirve para cualquier
              equipo que entrega trabajo: producto, contenido, servicios.
            </p>
            <p>
              El formato clásico tiene tres partes, y cada una cumple una función:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Parte</th>
                  <th className="py-2 pr-4 font-semibold">Para qué sirve</th>
                  <th className="py-2 font-semibold">Ejemplo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Como [rol]</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Fija <em>quién</em> pide. Te obliga a elegir un usuario real, no “el
                    sistema” ni “todo el mundo”.
                  </td>
                  <td className="py-2 text-muted-foreground">Como coordinadora de proyectos…</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">quiero [necesidad]</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Fija <em>qué</em> necesita, en su idioma, sin dictar la solución técnica.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    …quiero ver qué tareas están bloqueadas…
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">para [beneficio]</td>
                  <td className="py-2 text-muted-foreground">
                    Fija <em>por qué</em>. Es la parte que permite decidir prioridad y descartar.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    …para desbloquear el trabajo sin preguntar en el chat.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La historia completa: “Como coordinadora de proyectos, quiero ver qué tareas están
              bloqueadas, para desbloquear el trabajo sin preguntar en el chat”. Si no puedes
              escribir la parte del <em>para</em>, la historia probablemente no vale la pena: sin
              beneficio no hay prioridad posible.
            </p>
          </>
        ),
      },
      {
        heading: "Lo que NO es una historia de usuario",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>No es una especificación.</strong> La historia es una promesa de
                conversación: el detalle se acuerda con quien pide, no se ha escrito todo de
                antemano. Si tu “historia” tiene 15 requisitos numerados, es una especificación
                con formato ágil.
              </li>
              <li>
                <strong>No es una tarea técnica.</strong> “Refactorizar el módulo de pagos” no
                tiene rol ni beneficio de usuario: es una tarea (legítima, pero otra cosa). Las
                tareas técnicas viven igual en el{" "}
                <Link to="/blogs/tablero-kanban" className="underline underline-offset-2">
                  tablero
                </Link>
                , sin fingir que alguien las pidió “como usuario”.
              </li>
              <li>
                <strong>No es un épico eterno.</strong> El épico agrupa historias grandes
                (“mejorar el onboarding”); la historia es lo que entra al trabajo y termina. El
                error clásico es un épico que lleva 6 meses “en progreso” porque nunca se cortó
                en piezas.
              </li>
            </ul>
            <p>
              Y una historia no está “hecha” cuando el código (o el diseño, o el texto) está
              listo: está hecha cuando cumple sus criterios de aceptación. Ese checklist de
              cierre compartido por todo el equipo —la <em>definition of done</em>— es el
              complemento de la historia: sin él, cada persona decide cuándo algo cuenta como
              terminado.
            </p>
          </>
        ),
      },
      {
        heading: "Criterios de aceptación: el “hecho” de cada historia",
        body: (
          <>
            <p>
              Los criterios de aceptación son las condiciones verificables que cumplen para dar
              la historia por terminada. Viven en la tarjeta, escritos antes de empezar el
              trabajo. Sin ellos, “hecho” se discute a fin de mes; con ellos, se verifica en 30
              segundos.
            </p>
            <p>
              Para la historia de arriba, por ejemplo:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Existe una vista o filtro “bloqueadas” accesible desde la pantalla principal.
              </li>
              <li>
                Cada tarjeta bloqueada muestra por qué espera (quién y desde cuándo).
              </li>
              <li>
                La coordinadora la encuentra sin pedir ayuda en menos de 30 segundos (prueba con
                2 personas reales).
              </li>
            </ul>
            <p>
              Nota el último: un criterio que se puede <em>fallar</em>. “Debe ser fácil de
              usar” no es un criterio; es una opinión. Si no sabes cómo verificarlo, no es
              criterio de aceptación.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo cortar una historia grande (5 cortes que funcionan)",
        body: (
          <>
            <p>
              La pregunta del tamaño: <strong>¿esto lo termina una persona en pocos días, con lo
              que sabe hoy?</strong> Si la respuesta es no, hay que cortar. Cinco cortes que
              casi siempre sirven, aplicados a “como cliente, quiero gestionar mi cuenta”:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Por pasos del recorrido.</strong> Crear cuenta / editar datos / cerrar
                cuenta. Cada paso es una historia.
              </li>
              <li>
                <strong>Por flujo feliz primero.</strong> Primero “crear cuenta con email”;
              después “crear cuenta con Google”, después la recuperación. El caso ideal
                entra antes que los bordes.
              </li>
              <li>
                <strong>Por reglas de negocio.</strong> “Editar datos” con validaciones
                básicas, después con las reglas fiscales del país X, después del país Y.
              </li>
              <li>
                <strong>Por variación de rol.</strong> “Ver reportes” como coordinadora primero;
                como gerente, después. Mismas piezas, usuarios distintos.
              </li>
              <li>
                <strong>Por calidad gradual.</strong> Funciona lento pero completo, después se
                optimiza. A veces el corte honesto es “versión fea que resuelve” vs. “versión
                pulida”.
              </li>
            </ol>
            <p>
              Fuera de software funcionan igual: “lanzar la campaña de diciembre” no es una
              historia; “publicar la landing de la campaña” sí, y el corte por pasos la separa
              de “configurar el email de aviso” y “preparar el reporte semanal”. Las historias
              cortas alimentan el{" "}
              <Link to="/blogs/que-es-un-backlog" className="underline underline-offset-2">
                backlog
              </Link>{" "}
              y hacen posible comprometer un sprint real (cómo se hace ese compromiso en{" "}
              <Link
                to="/blogs/sprint-planning-como-hacerlo"
                className="underline underline-offset-2"
              >
                Sprint planning que se cumple
              </Link>
              ).
            </p>
          </>
        ),
      },
      {
        heading: "Historias de usuario en equipos que no son de software",
        body: (
          <>
            <p>
              El formato “como… quiero… para…” parece jerga de developers, pero su valor —
              fijar quién pide y para qué antes de trabajar— aplica a cualquier estudio o
              agencia. Dos ejemplos:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Estudio de diseño:</strong> “Como directora de la agencia, quiero un
                resumen del estado de cada cuenta en una página, para preparar la reunión del
                lunes sin abrir 6 tableros.” Criterios: cubre las 6 cuentas, cabe en una página,
                se actualiza solo.
              </li>
              <li>
                <strong>Pyme de servicios:</strong> “Como cliente de la pyme, quiero confirmar
                por escrito la fecha de mi visita, para no estar pendiente del teléfono.”
                Criterios: confirmación automática al agendar, con opción de reprogramar desde
                el mensaje.
              </li>
            </ul>
            <p>
              En ambos casos, la historia hizo dos favores: obligó a nombrar al usuario real
              (no “el cliente” abstracto) y puso el beneficio antes del entregable. Ese mismo
              orden —quién, qué, para qué— es lo que después permite priorizar sin discutir
              gustos: los roles y las aprobaciones se ordenan aparte, con una{" "}
              <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                matriz RACI
              </Link>
              .
            </p>
            <p>
              Si quieres escribir historias y seguir su recorrido en un tablero que vive en tu
              carpeta —JSON local, sin cuenta ni asientos—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              es un gestor local-first para equipos de 1 a 15 personas.
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
              — tablero kanban, backlog y procesos en tu propio equipo. Sin nube, sin cuenta.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es una historia de usuario?",
        answer:
          "Es una descripción corta de una necesidad contada desde quien la vive —‘como [rol] quiero [necesidad] para [beneficio]’— junto con criterios de aceptación verificables. Sirve para acordar qué se va a construir antes de construirlo y para partir el trabajo en piezas que una persona termina en pocos días.",
      },
      {
        question: "¿Cuál es el formato de una historia de usuario?",
        answer:
          "‘Como [rol], quiero [necesidad], para [beneficio]’. Las tres partes tienen función: el rol fija quién pide, la necesidad describe el qué sin dictar la solución, y el beneficio justifica la prioridad. Si no puedes escribir el ‘para’, la historia no está lista para entrar al trabajo.",
      },
      {
        question: "¿Qué diferencia hay entre una historia de usuario, un épico y una tarea?",
        answer:
          "El épico agrupa: es un trabajo grande (‘mejorar el onboarding’) que se corta en varias historias. La historia es la unidad que entra al trabajo y termina en días, con criterios de aceptación. La tarea es un paso técnico o administrativo que no necesita rol ni beneficio de usuario. El error clásico es el épico eterno: meses ‘en progreso’ porque nunca se cortó.",
      },
      {
        question: "¿Qué son los criterios de aceptación de una historia?",
        answer:
          "Son las condiciones verificables que cumplen para dar la historia por terminada, escritas en la tarjeta antes de empezar. Buen criterio: se puede fallar y comprobar (‘la persona encuentra la vista en menos de 30 segundos’). Mal criterio: una opinión (‘debe ser intuitiva’). Complementan la definition of done del equipo.",
      },
      {
        question: "¿Sirven las historias de usuario fuera del software?",
        answer:
          "Sí: el formato obliga a nombrar al usuario real y el beneficio antes del entregable, lo que funciona igual en diseño, contenido o servicios. Ejemplo: ‘Como directora de la agencia, quiero un resumen de cada cuenta en una página, para preparar la reunión del lunes sin abrir 6 tableros’, con criterios medibles en la tarjeta.",
      },
    ],
  },
};
