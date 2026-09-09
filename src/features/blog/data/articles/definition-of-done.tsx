import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "definition-of-done",
  title: "Definition of done: el checklist que cierra el trabajo",
  excerpt:
    "Definition of done: la lista compartida que declara una tarea terminada de verdad. Qué la diferencia del DoR y de los criterios de aceptación, y un checklist de 8 ítems copiable.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-04",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "tablero-kanban",
  related: ["tablero-kanban", "historias-de-usuario", "que-es-un-backlog"],
  seo: {
    title: "Definition of done: el checklist que cierra el trabajo | Hito",
    description:
      "Definition of done: qué es, diferencia con DoR y con los criterios de aceptación, y un checklist DoD copiable para tu equipo. Deja de reabrir trabajo «terminado».",
    ogImageAlt: "Checklist de definition of done marcado en un tablero.",
  },
  content: {
    eyebrow: "Organización del trabajo",
    intro: (
      <>
        <strong>En una línea:</strong> el definition of done es el checklist compartido que
        define cuándo una tarea está terminada de verdad —revisada, verificada y entregada—,
        no «casi lista». Sin definición de hecho, cada persona aplica su propio estándar y el
        trabajo reabierto se convierte en la norma silenciosa que nadie discute.
      </>
    ),
    sections: [
      {
        heading: "Qué es el definition of done (y por qué «creo que ya está» no basta)",
        body: (
          <>
            <p>
              El definition of done (DoD, o definición de hecho) es la lista de condiciones que
              todo trabajo debe cumplir antes de que el equipo lo marque como terminado:
              revisado por otra persona, verificado que funciona, documentado si hace falta y
              entregado donde deba estar. Es un acuerdo de calidad, no un trámite. Su función es
              reemplazar la pregunta subjetiva «¿ya está?» por una verificable: «¿cumple la
              lista?».
            </p>
            <p>
              Sin DoD, cada miembro aplica su propio estándar. Para uno, terminado significa que
              el código compila; para otro, que pasó revisión y está en producción. Las dos
              versiones son sinceras y por eso el problema es sistémico, no de actitud: la
              mayoría de los re-trabajos de un equipo vienen de esa definición ambigua, no de
              gente descuidada. El clásico «casi listo» es la señal de alerta: casi listo no es
              un estado, es una ausencia de criterio.
            </p>
            <p>
              En la práctica, el DoD vive pegado al tablero: en un{" "}
              <Link to="/blogs/tablero-kanban" className="underline underline-offset-2">
                tablero kanban
              </Link>{" "}
              bien montado, una tarjeta solo cruza a Hecho si cumple la lista completa. Si no la
              cumple, no está en Hecho con una nota disculpándose: está en su columna honesta,
              que suele ser En revisión. Esa frontera visible es lo que convierte el acuerdo en
              hábito.
            </p>
          </>
        ),
      },
      {
        heading: "DoD, DoR y criterios de aceptación: tres cosas distintas",
        body: (
          <>
            <p>
              Se confunden todo el tiempo porque las tres herramientas hablan de «cuándo», pero
              cada una opera en un momento distinto del ciclo de una tarea: antes de entrar
              (DoR), al cerrar (DoD) y sobre el resultado concreto (criterios de aceptación).
              Esta tabla lo ordena:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Aspecto</th>
                  <th className="py-2 pr-4 font-semibold">Definition of done</th>
                  <th className="py-2 pr-4 font-semibold">Definition of ready</th>
                  <th className="py-2 font-semibold">Criterios de aceptación</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Responde a</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Cuándo está terminado?
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Cuándo puede empezar?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    ¿Qué debe ocurrir en esta tarea concreta?
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Alcance</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Uno por equipo, igual para todo el trabajo
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Uno por equipo, para lo que entra a la semana
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Uno por historia o tarea, cambia en cada una
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Quién lo escribe</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El equipo, juntos, con revisión periódica
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El equipo con quien pide el trabajo
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Quien define la historia o la tarea
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Naturaleza</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Estándar de calidad de salida
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Filtro de calidad de entrada
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Especificación del resultado esperado
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Ejemplo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    «Revisado por una segunda persona y desplegado»
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    «Con criterios definidos y diseño adjunto»
                  </td>
                  <td className="py-2 text-muted-foreground">
                    «El formulario valida email y muestra el error en línea»
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Regla mnemotécnica: el DoR es el control de calidad de entrada, los criterios de
              aceptación son el contrato del resultado y el DoD es el estándar de salida que
              aplica a todo. Si tu equipo solo puede tener uno hoy, elige el DoD: es el que
              evita reabrir trabajo.
            </p>
          </>
        ),
      },
      {
        heading: "Un DoD de 8 ítems copiable para equipo pequeño",
        body: (
          <>
            <p>
              Un DoD útil cabe en una pantalla y cada ítem se verifica en minutos. Este es un
              punto de partida para un equipo de 1 a 15 personas; recórtalo a tu contexto:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Cumple los criterios de aceptación.</strong> El resultado es el que se
                pidió, no una versión aproximada. En una{" "}
                <Link to="/blogs/historias-de-usuario" className="underline underline-offset-2">
                  historia de usuario
                </Link>{" "}
                esos criterios ya están escritos: basta cotejar.
              </li>
              <li>
                <strong>Pasó una segunda mirada.</strong> Revisión de código, de diseño o de
                texto por otra persona —o por ti mismo con un día de distancia si trabajas
                solo—.
              </li>
              <li>
                <strong>Fue verificado funcionando.</strong> Pruebas en verde o verificación
                manual del flujo completo, no «en mi computadora funciona».
              </li>
              <li>
                <strong>Está en el entorno real.</strong> Desplegado, publicado o entregado
                donde lo va a usar la gente, no en una carpeta local.
              </li>
              <li>
                <strong>La documentación quedó al día.</strong> Notas, instrucciones o material
                de apoyo actualizados si el cambio los afecta.
              </li>
              <li>
                <strong>No deja cabos sueltos.</strong> Subtareas cerradas o devueltas al{" "}
                <Link to="/blogs/que-es-un-backlog" className="underline underline-offset-2">
                  backlog
                </Link>{" "}
                con contexto, no olvidadas.
              </li>
              <li>
                <strong>La tarjeta quedó al día.</strong> Movida a su columna final, con un
                comentario de cierre si aporta contexto.
              </li>
              <li>
                <strong>Quien pidió puede verificarla en 2 minutos.</strong> Si el cliente o el
                compañero necesita media hora para comprobar que está hecho, falta algo.
              </li>
            </ol>
            <p>
              Ocho ítems, no treinta. Si alguno no aplica a un tipo de trabajo, ese tipo de
              trabajo tiene otro DoD —y eso ya es una señal de que tienes dos flujos, no un
              ítem de menos.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo construir tu DoD en 30 minutos",
        body: (
          <>
            <p>
              No necesitas un taller con post-its: necesitas tus fracasos recientes. El mejor
              DoD no se inventa, se extrae de los trabajos que se reabrieron:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Lista los últimos 3 trabajos «terminados» que volvieron</strong> (5
                min). Correcciones de cliente, bugs aparecidos al día siguiente, entregas
                rehechas. Ese material es oro: es tu DoD implícito fallando.
              </li>
              <li>
                <strong>Anota qué faltaba exactamente en cada uno</strong> (10 min). No «faltó
                calidad», sino «nadie lo probó en móvil», «no pasó revisión», «el cliente no
                recibió instrucciones».
              </li>
              <li>
                <strong>Convierte cada falta en una condición verificable</strong> (10 min).
                «Probar en móvil antes de marcar como hecho», no «cuidar la calidad». Si no
                puedes verificarlo en un minuto, no entra a la lista.
              </li>
              <li>
                <strong>Publícalo junto al tablero y acuérdenlo</strong> (5 min). La regla
                operativa es una: lo que no cumple el DoD no cruza a Hecho. Sin excepciones
                «solo esta vez», porque esta vez es todas las veces.
              </li>
            </ol>
            <p>
              Revísalo una vez al trimestre, o cuando se repita un tipo de re-trabajo nuevo: si
              algo vuelve a reabrirse, la lista tenía un hueco, y el hueco se convierte en
              ítem. El DoD es un documento vivo, corto por diseño.
            </p>
          </>
        ),
      },
      {
        heading: "Los errores que matan un DoD",
        body: (
          <>
            <p>
              Un definition of done no falla por falta de ítems, sino por exceso o por mal uso.
              Los tres patrones que lo destruyen:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>El DoD de 30 ítems.</strong> Cuando todo es obligatorio, nada lo es: el
                equipo empieza a marcar casillas en falso y el checklist deja de significar
                algo. Si tu lista no cabe en una pantalla, es una lista de deseos.
              </li>
              <li>
                <strong>Un DoD distinto por persona.</strong> «Para mí terminado es esto, para
                ti aquello» es exactamente el problema que el DoD existe para resolver. El
                estándar es del equipo; las diferencias se discuten, no se aplican en silencio.
              </li>
              <li>
                <strong>Confundirlo con el definition of ready.</strong> Si el checklist llena
                de condiciones la entrada en lugar de la salida, el efecto es bloquear el
                trabajo nuevo en vez de evitar re-trabajo. El DoD gobierna la salida; el resto
                son criterios de aceptación o filtros de entrada.
              </li>
              <li>
                <strong>Usarlo como herramienta de control.</strong> El DoD no existe para
                auditar personas, sino para proteger el resultado. En cuanto se usa para
                señalar culpables, el equipo aprende a esconder lo incompleto: el efecto
                contrario al buscado.
              </li>
            </ul>
            <p>
              Si quieres un DoD que viva donde ocurre el trabajo —un tablero con límites WIP,
              checklists y procesos, guardado en tu propia carpeta en JSON local, sin cuenta ni
              nube—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              está pensado para equipos de 1 a 15 personas.
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
              — define tu checklist de cierre y deja de reabrir trabajo terminado.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es el definition of done?",
        answer:
          "Es la lista de condiciones que el equipo exige a todo trabajo antes de marcarlo como terminado: revisado, verificado, documentado y entregado donde deba estar. Funciona como un estándar de calidad compartido que reemplaza el criterio subjetivo de cada persona por un checklist verificable, y su objetivo práctico es que el trabajo «terminado» no vuelva a reabrirse.",
      },
      {
        question: "¿Cuál es la diferencia entre DoD y DoR?",
        answer:
          "El DoR gobierna la entrada y el DoD la salida: el definition of ready define cuándo una tarea está lista para empezar (con criterios, diseño y contexto), mientras que el definition of done define cuándo está terminada de verdad (revisada, verificada y entregada). Un buen DoR evita empezar a ciegas; un buen DoD evita cerrar a medias.",
      },
      {
        question: "¿Qué diferencia hay entre definition of done y criterios de aceptación?",
        answer:
          "Los criterios de aceptación son específicos de una tarea concreta y describen el resultado esperado; el definition of done es general y aplica igual a todo el trabajo del equipo. Una tarjeta cumple el DoD cuando supera el estándar de salida del equipo, y cumple sus criterios de aceptación cuando produce lo que se pidió: se necesitan las dos cosas para cerrarla.",
      },
      {
        question: "¿Quién define el definition of done?",
        answer:
          "El equipo, en conjunto, no el líder por decreto: el DoD solo funciona si quien ejecuta participó en escribirlo. Se redacta en una sesión corta a partir de los últimos re-trabajos y se revisa de vez en cuando; cualquier miembro puede proponer añadir o quitar ítems cuando aparece un tipo nuevo de error.",
      },
      {
        question: "¿El definition of done cambia con el tiempo?",
        answer:
          "Sí, y debe hacerlo: madura con el equipo. Al principio suele tener 3 o 4 ítems y crece cuando aparecen re-trabajos nuevos; también se recorta cuando un ítem dejó de aportar o el contexto cambió. Con una revisión trimestral basta: es un documento vivo, corto por diseño, no un manual que se congela.",
      },
    ],
  },
};
