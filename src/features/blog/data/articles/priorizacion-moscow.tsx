import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "priorizacion-moscow",
  title: "Priorización MoSCoW: Must, Should, Could y Won't",
  excerpt:
    "Priorización MoSCoW: qué significa cada categoría, cómo ejecutar la sesión de 45 minutos y los tres errores que convierten el framework en una lista de deseos.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-04",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "scrumban",
  related: ["scrumban", "como-priorizar-tareas", "matriz-eisenhower"],
  seo: {
    title: "Priorización MoSCoW: Must, Should, Could y Won't | Hito",
    description:
      "Priorización MoSCoW: qué significa Must/Should/Could/Won't, cómo aplicarla en una sesión de 45 minutos y los 3 errores que la vuelven inútil.",
    ogImageAlt: "Cuatro columnas MoSCoW: Must have, Should have, Could have, Won't have.",
  },
  content: {
    eyebrow: "Prioridad y foco",
    intro: (
      <>
        <strong>En una línea:</strong> la priorización MoSCoW consiste en clasificar cada elemento
        del backlog en Must have, Should have, Could have y Won't have this time —un Must por
        necesidad, no por gusto—, dentro de un presupuesto fijo de capacidad. Hacerlo bien toma 45
        minutos; hacerlo mal, cuando todo termina siendo Must, lo convierte en papel decorativo.
      </>
    ),
    sections: [
      {
        heading: "Qué es MoSCoW (y qué significa cada categoría)",
        body: (
          <>
            <p>
              MoSCoW es un método de priorización que divide el alcance de un proyecto en cuatro
              categorías según su necesidad, no según su atractivo. Nació en el marco DSDM y lo
              adoptó el mundo ágil, pero funciona igual en un equipo de tres personas con un
              backlog de cuarenta tarjetas. Su valor no está en las siglas sino en el compromiso
              que obliga a tomar: antes de empezar, el equipo y el cliente deciden juntos qué es
              imprescindible y qué no entra esta vez.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Categoría</th>
                  <th className="py-2 pr-4 font-semibold">Qué significa</th>
                  <th className="py-2 font-semibold">La prueba rápida</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Must have</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Sin esto el entregable no funciona o no tiene sentido lanzarlo.
                  </td>
                  <td className="py-2 text-muted-foreground">¿Se cae el proyecto si falta?</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Should have</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Importante, pero con vuelta alternativa: alguien puede trabajar alrededor.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    ¿Se puede posponer una iteración sin romper nada?
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Could have</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Mejora deseable que entra solo si sobra capacidad al final.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    ¿Alguien nota su ausencia el primer día?
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Won't have (this time)</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Explícitamente fuera de esta entrega. No es un «no» definitivo: es un «todavía
                    no», por escrito.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    ¿El proyecto sobrevive sin esto en esta fecha?
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La trampa está en la cuarta categoría: mucha gente cree que MoSCoW tiene tres niveles
              de «sí» y un cajón de recados. No. Won't have es una decisión tan activa como Must
              have, y se escribe —más abajo vemos por qué. Y ojo al alcance del método: ordena el
              alcance de un proyecto, no tu semana. Para ordenar tu día sirve{" "}
              <Link to="/blogs/matriz-eisenhower" className="underline underline-offset-2">
                la matriz de Eisenhower
              </Link>
              , y para el puente entre lo urgente y lo importante,{" "}
              <Link to="/blogs/como-priorizar-tareas" className="underline underline-offset-2">
                cómo priorizar tareas
              </Link>{" "}
              sin morir en el intento.
            </p>
          </>
        ),
      },
      {
        heading: "MoSCoW vs matriz de Eisenhower: proyecto contra día a día",
        body: (
          <>
            <p>
              Son el mismo gesto mental aplicado a escalas distintas, y confundirlas hace fracasar
              a los dos métodos. Si usas Eisenhower para priorizar el alcance de un proyecto, las
              decisiones caducan al día siguiente, porque la urgencia cambia a diario y el alcance
              no debería. Si usas MoSCoW para ordenar tu martes, pierdes una hora en una ceremonia
              que no necesitabas. La diferencia, en una tabla:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Dimensión</th>
                  <th className="py-2 pr-4 font-semibold">MoSCoW</th>
                  <th className="py-2 font-semibold">Matriz de Eisenhower</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Qué ordena</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El alcance de un proyecto o una entrega.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Tu día: tareas, urgencias, interrupciones.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Pregunta central</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Qué necesita este proyecto para valer algo?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    ¿Qué es importante y urgente ahora mismo?
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Quién decide</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El equipo con el cliente, en una sesión conjunta.
                  </td>
                  <td className="py-2 text-muted-foreground">Tú, en minutos.</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Cadencia</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Una vez por proyecto o por release.
                  </td>
                  <td className="py-2 text-muted-foreground">A diario o cada semana.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Resultado</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Un alcance priorizado con presupuesto de capacidad.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Una lista de hoy dividida en cuatro cuadrantes.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Usadas juntas se refuerzan: MoSCoW define qué construyes este trimestre; Eisenhower
              decide qué tocas esta mañana. El error es hacerlas competir por el mismo espacio.
            </p>
          </>
        ),
      },
      {
        heading: "La sesión de 45 minutos, paso a paso",
        body: (
          <>
            <p>
              Una sesión de priorización MoSCoW no necesita un facilitador certificado; necesita un
              tiempo cerrado y estas cinco paradas:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Volcar el backlog (10 min).</strong> Toda petición en una lista plana y
                visible, sin discutir todavía ni una sola. Si algo está mal redactado, se anota
                como está; reescribir viene después.
              </li>
              <li>
                <strong>Votar solo los Must (15 min).</strong> Cada persona marca en silencio sus
                3–5 imprescindibles y después se comparan. Solo se debate lo disputado; el resto se
                clasifica sin ceremonia. Este es el corazón de la sesión.
              </li>
              <li>
                <strong>Fijar el presupuesto de capacidad (5 min).</strong> Regla práctica: los
                Must no deberían pasar del 60 % del esfuerzo disponible. Si el voto dice que el 90
                % es Must, la sesión se ha equivocado y hay que repetir el paso anterior con más
                honestidad.
              </li>
              <li>
                <strong>Rellenar Should y Could (10 min).</strong> Con el núcleo garantizado, el
                resto se ordena por valor y esfuerzo. Aquí entran las peticiones del jefe y del
                cliente que «no pueden esperar»: casi siempre acaban en Should.
              </li>
              <li>
                <strong>Cerrar y publicar el Won't (5 min).</strong> Se escribe qué queda fuera de
                esta entrega y se comunica a quien pidió cada cosa. Sin este paso, la sesión no
                existió: los fuera quedan flotando como expectativas.
              </li>
            </ol>
            <p>
              El resultado no es una lista bonita: es un acuerdo con fecha y con presupuesto. Si a
              la semana siguiente alguien suma alcance sin quitar nada, la sesión te da la base
              para negociar en lugar de improvisar.
            </p>
          </>
        ),
      },
      {
        heading: "Los 3 errores que la vuelven inútil",
        body: (
          <>
            <p>
              MoSCoW falla siempre por los mismos tres sitios, y los tres se detectan en la
              primera sesión:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Todo es Must.</strong> Es la muerte canónica del método. Si el 90 % del
                backlog es imprescindible, nadie priorizó: se recicló una lista de deseos con otra
                tipografía. El antídoto es el presupuesto del 60 %: es negociable, pero alguien
                tiene que defenderlo en voz alta cuando se rompe.
              </li>
              <li>
                <strong>Must mayor que la capacidad.</strong> Aunque la clasificación sea honesta,
                si el Must ya excede el tiempo y el equipo disponibles, firmaste un compromiso
                imposible el día uno. El antídoto es comparar el Must con la capacidad real antes
                de cerrar la sesión y bajar a Should lo que no quepa, ahí mismo, no en la semana
                seis.
              </li>
              <li>
                <strong>Nunca revisar el Won't.</strong> Lo que era inútil en enero puede ser
                urgente en marzo; si el documento no se reabre, pierde autoridad y todos vuelven a
                pedir por chat. El antídoto es barato: diez minutos de revisión al inicio de cada
                release o de cada mes.
              </li>
            </ol>
            <p>
              Hay una condición de fondo: la prioridad solo respeta si existe un límite de trabajo
              en curso que la haga visible. Sin él, el Must y el Could entran igual al tablero y
              la clasificación es un adorno. Si trabajas con flujo continuo en lugar de sprints, la
              combinación natural es priorizar la cola con MoSCoW y dejar que el tablero con
              límites WIP la consuma; el modelo completo está en{" "}
              <Link to="/blogs/scrumban" className="underline underline-offset-2">
                ScrumBan
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Qué hacer con el Won't have: el compromiso explícito de no hacer",
        body: (
          <>
            <p>
              El Won't have es la parte más incómoda y la más valiosa. Escribir lo que no vas a
              hacer hace tres cosas que ninguna herramienta hace sola: protege el alcance cuando
              aparecen las peticiones de mitad de proyecto, gestiona expectativas porque el cliente
              vio el «no» firmado antes de empezar, y convierte un rechazo en un aplazamiento,
              que se negocia mejor y se reabre con datos en la siguiente revisión.
            </p>
            <p>
              Por eso el Won't se publica, no se archiva. Vive junto al alcance acordado, se lee en
              el arranque y se revisa en cada release. Un proyecto serio no se mide solo por lo que
              entrega, sino por lo que resiste a agregar sin discutirlo.
            </p>
            <p>
              Si quieres sostener esta priorización en una herramienta que vive en tu carpeta
              —JSON local, sin cuenta, sin asientos, kanban con límites WIP y procesos
              documentados—{" "}
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
              — prioriza el alcance y respeta el WIP en un tablero local-first, sin nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es la priorización MoSCoW?",
        answer:
          "Es un método que clasifica los elementos de un proyecto en cuatro categorías de necesidad: Must have (imprescindible), Should have (importante con alternativa), Could have (deseable si sobra capacidad) y Won't have (explícitamente fuera de esta entrega). Su objetivo es cerrar un alcance realista antes de empezar, dentro de un presupuesto fijo de capacidad.",
      },
      {
        question: "¿Qué significa Must have, Should have, Could have y Won't have?",
        answer:
          "Must have es lo sin lo cual el entregable no funciona; Should have es importante pero tiene una vuelta alternativa temporal; Could have es una mejora que entra solo si queda capacidad; Won't have this time es lo que se declara fuera de esta iteración o release por decisión explícita, no por olvido.",
      },
      {
        question: "¿Cómo hacer una sesión de priorización MoSCoW?",
        answer:
          "En unos 45 minutos: volcar el backlog completo en una lista visible, votar en silencio los Must y debatir solo lo disputado, fijar un presupuesto de capacidad (los Must no deberían superar el 60 % del esfuerzo), rellenar Should y Could, y cerrar publicando por escrito qué queda en Won't y a quién se le comunica.",
      },
      {
        question: "¿Cuál es la diferencia entre MoSCoW y la matriz de Eisenhower?",
        answer:
          "MoSCoW prioriza el alcance de un proyecto en una sesión conjunta entre equipo y cliente, con cadencia de release; la matriz de Eisenhower ordena tu día a día según urgencia e importancia, en minutos y de forma individual. Son complementarias: una decide qué construyes este trimestre y la otra qué tocas esta mañana.",
      },
      {
        question: "¿Qué hago con lo que queda en Won't have?",
        answer:
          "Documentarlo y comunicarlo: el Won't have es un compromiso explícito de no hacer, no un cajón de recados. Se publica junto al alcance acordado, se lee en el arranque del proyecto y se revisa al inicio de cada release, porque lo que era inútil hace un mes puede ser urgente hoy.",
      },
    ],
  },
};
