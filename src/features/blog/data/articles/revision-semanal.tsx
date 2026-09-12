import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "revision-semanal",
  title: "La revisión semanal: 30 minutos que ordenan tu semana",
  excerpt:
    "La revisión semanal es la cita de 30 minutos contigo mismo que evita que la semana te maneje a ti: agenda de 5 pasos, diferencia con el informe de estado y los 3 errores clásicos.",
  category: "productividad",
  categoryLabel: "Productividad",
  publishedAt: "2026-09-09",
  readingTime: "7 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "registro-de-horas",
  related: ["registro-de-horas", "informe-de-estado-semanal", "plan-de-trabajo", "matriz-eisenhower"],
  seo: {
    title: "Revisión semanal: 30 minutos que ordenan tu semana | Hito",
    description:
      "Cómo hacer una revisión semanal en 30 minutos: la agenda de 5 pasos, en qué se diferencia del informe de estado y los errores que la hacen abandonar.",
    ogImageAlt: "Agenda de revisión semanal: proyectos, fechas y prioridades de la semana.",
  },
  content: {
    eyebrow: "Tiempo y capacidad",
    intro: (
      <>
        <strong>En una línea:</strong> la revisión semanal es una cita fija de 30 minutos contigo
        mismo para cerrar la semana que pasó y abrir la que viene con decisiones — sin ella,
        tu agenda la escriben las urgencias de los demás.
      </>
    ),
    sections: [
      {
        heading: "Qué es una revisión semanal",
        body: (
          <>
            <p>
              Es un bloque fijo en tu calendario — 30 minutos, mismo día, misma hora, viernes a
              última hora o lunes temprano — donde haces tres cosas: mirar lo que pasó, revisar
              el estado real de tus proyectos y decidir qué importa en la semana que entra. No
              es producir nada: es <strong>decidir</strong>. El output completo son tres
              prioridades claras y un calendario levemente menos mentiroso que el que tenías.
            </p>
            <p>
              El concepto viene de la escuela de productividad personal (el weekly review de
              GTD lo popularizó), pero en gestión de proyectos tiene un giro específico: la
              revisión no solo ordena tu bandeja — verifica que el trabajo avance hacia sus{" "}
              <Link
                to="/blogs/hitos-de-un-proyecto-ejemplos"
                className="underline underline-offset-2"
              >
                hitos
              </Link>{" "}
              y detecta temprano lo que se está atascando. Es el mismo espíritu de mirar el
              tablero en lugar de preguntar uno por uno, pero aplicado a tu propia semana.
            </p>
            <p>
              Lo que hace valiosa la rutina es su posición: ni tan seguido que sea ruido (para
              eso está el{" "}
              <Link to="/blogs/daily-standup-util" className="underline underline-offset-2">
                daily
              </Link>
              ), ni tan espaciado que llegue tarde. Semanal es el ritmo al que se mueven la
              mayoría de las decisiones de un proyecto pequeño: aprobaciones, presupuestos,
              fechas de cliente.
            </p>
          </>
        ),
      },
      {
        heading: "Revisión semanal ≠ informe de estado",
        body: (
          <>
            <p>
              Se confunden porque comparten la palabra «semanal» y el gesto de mirar atrás, pero
              sirven a públicos distintos:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Criterio</th>
                  <th className="py-2 pr-4 font-semibold">Revisión semanal</th>
                  <th className="py-2 font-semibold">Informe de estado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Audiencia</td>
                  <td className="py-2 pr-4 text-muted-foreground">Vos.</td>
                  <td className="py-2 text-muted-foreground">Cliente o dirección.</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Dirección</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Hacia adentro: ordenar tu propio trabajo.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Hacia afuera: informar avance y riesgos.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Formato</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Notas sucias, calendario, tablero abierto.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Documento o mensaje estructurado y compartible.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Output</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    3 prioridades y decisiones tomadas.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Confianza y visibilidad en quien financia.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El orden natural es revisar primero y redactar después: si tus informes toman
              demasiado, casi siempre es porque redactas sin haber revisado — y estás pensando
              el contenido a la vez que lo formalizas. La estructura de 5 líneas que proponemos
              en{" "}
              <Link
                to="/blogs/informe-de-estado-semanal"
                className="underline underline-offset-2"
              >
                el informe de estado semanal
              </Link>{" "}
              sale sola cuando la revisión ya se hizo.
            </p>
          </>
        ),
      },
      {
        heading: "La agenda de 30 minutos, en 5 pasos",
        body: (
          <>
            <p>
              La revisión necesita agenda fija o se convierte en intención. Esta secuencia
              alcanza con media hora:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Vaciar las bandejas (5 min).</strong> Correo, mensajes, notas sueltas:
                todo lo que sea acción se convierte en tarea en tu sistema; el resto se archiva.
                El objetivo no es responder todo — es que nada vivo viva en la bandeja.
              </li>
              <li>
                <strong>Recorrer los proyectos (10 min).</strong> Abre cada proyecto activo y
                pregúntate: ¿qué avanzó esta semana? ¿Qué está atascado y por qué? ¿Hay alguna
                aprobación o respuesta que se esté demorando? Si gestionas varios a la vez, esta
                es exactamente la vista de{" "}
                <Link
                  to="/blogs/gestionar-varios-proyectos-a-la-vez"
                  className="underline underline-offset-2"
                >
                  portafolio
                </Link>{" "}
                que te evita descubrir atascos con dos semanas de retraso.
              </li>
              <li>
                <strong>Revisar fechas y hitos (5 min).</strong> ¿Qué hito cae en los próximos
                10 días hábiles? ¿Está en camino o hay que mover algo hoy? Las fechas no se
                caen de golpe: se caen en silencio durante tres semanas mientras nadie mira.
              </li>
              <li>
                <strong>Elegir los 3 importantes (5 min).</strong> De todo lo que podrías hacer
                la semana que viene, nombra tres cosas que — si se cumplen — harían que la semana
                fuera exitosa. Si no caben tres, no cabe ninguna: ahí está la trampa de lo
                urgente que describe la{" "}
                <Link to="/blogs/matriz-eisenhower" className="underline underline-offset-2">
                  matriz de Eisenhower
                </Link>
                .
              </li>
              <li>
                <strong>Bloquear el calendario (5 min).</strong> Cada prioridad se convierte en
                bloques de trabajo con hora. Una prioridad sin bloque es un deseo. Aquí es
                donde la revisión se convierte en{" "}
                <Link to="/blogs/plan-de-trabajo" className="underline underline-offset-2">
                  plan de trabajo
                </Link>{" "}
                de la semana.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Los 3 errores que matan la revisión",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Saltarla en las semanas ocupadas.</strong> Es exactamente al revés: la
                semana caótica es la que más necesita la revisión, porque es cuando las
                urgencias ya reemplazaron tus decisiones. Cancelar la revisión cuando hay
                Demasiado Qué Hacer es como tirar el mapa cuando se desvía el camino. Si 30
                minutos no caben, hazla en 15 — pero hazla.
              </li>
              <li>
                <strong>Convertirla en plan perfecto.</strong> La revisión no es redactar el
                plan ideal de la semana: es tomar las 5 decisiones más obvias con la info que
                hay. Si te toma más de 45 minutos, estás planificando demasiado fino — el detalle
                de cada día se decide cada día.
              </li>
              <li>
                <strong>No anotar lo aprendido.</strong> Una línea por semana basta: «el
                presupuesto del proyecto X se pasó porque el cliente tardó 5 días en aprobar».
                Doce líneas al año son un patrón visible; sin ellas, cada semana se aprende de
                cero y el mismo problema vuelve de disfraz nuevo. Es la versión individual de{" "}
                <Link
                  to="/blogs/lecciones-aprendidas-proyecto"
                  className="underline underline-offset-2"
                >
                  las lecciones aprendidas
                </Link>
                .
              </li>
            </ul>
            <p>
              Un detalle final de implementación: ancla la cita a algo que ya existe (el viernes
              antes de cerrar, el domingo a la noche, el lunes con el café) y protégela como
              protegerías una reunión con tu mejor cliente. Porque lo es: la tienes con la persona
              que administra tu tiempo.
            </p>
          </>
        ),
      },
      {
        heading: "La versión para equipos: 15 minutos compartidos",
        body: (
          <>
            <p>
              La revisión semanal no tiene que ser solitaria. En equipos pequeños funciona una
              variante compartida de 15 minutos — distinta del daily (que es operativo y diario)
              y del status (que es hacia arriba): el equipo recorre juntos los proyectos activos,
              cada uno nombra su prioridad número uno de la semana y se explicitan los bloqueos
              que dependen de otros.
            </p>
            <p>
              El beneficio no es el plan compartido — es el alineamiento silencioso: todos
              saben qué es lo importante esta semana sin que nadie tenga que preguntarlo. Si tu
              equipo hace esta versión, el{" "}
              <Link to="/blogs/plan-de-trabajo" className="underline underline-offset-2">
                plan de trabajo semanal
              </Link>{" "}
              deja de ser un documento que nadie mira y pasa a ser el acta de esa conversación.
            </p>
            <p>
              Y si quieres que el recorrido de proyectos, las fechas de hitos y las prioridades
              vivan en el mismo lugar donde está el trabajo — un tablero local, en tu carpeta,
              sin cuenta ni nube—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              te da esa vista de portafolio para equipos de 1 a 15 personas.
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
              — tu revisión semanal con el tablero ya abierto, local-first y sin fricción.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es una revisión semanal?",
        answer:
          "Es un bloque fijo de 30 minutos en el que cierras la semana que pasó (vacías bandejas, recorres proyectos, revisas fechas) y decides las tres prioridades de la semana que entra. Es una cita de decisión contigo mismo, no una sesión de planificación detallada.",
      },
      {
        question: "¿Cómo hago una revisión semanal?",
        answer:
          "En 5 pasos: vaciar las bandejas de entrada, recorrer cada proyecto activo preguntando qué avanzó y qué está atascado, revisar hitos y fechas de los próximos 10 días, elegir las 3 prioridades de la semana y bloquearlas en el calendario con hora. Mismo día y hora cada semana.",
      },
      {
        question: "¿Cuánto tiempo toma una revisión semanal?",
        answer:
          "30 minutos es el estándar para una persona con varios proyectos activos; 15 minutos alcanza en semanas tranquilas o si recién empiezas. Si te está tomando más de 45, estás planificando con demasiado detalle: el día a día se decide cada día.",
      },
      {
        question: "¿Cuál es la diferencia entre revisión semanal e informe de estado?",
        answer:
          "La revisión es para ti: ordena tus decisiones y prioridades, con notas sucias. El informe es para el cliente o dirección: comunica avance, con formato compartible. El orden natural es revisar primero (pensar) y redactar el informe después (contar), no al revés.",
      },
      {
        question: "¿Se puede hacer la revisión semanal en equipo?",
        answer:
          "Sí: una versión de 15 minutos donde cada persona nombra su prioridad número uno y los bloqueos que dependen de otros. No reemplaza al daily (que es operativo y diario) ni al informe de estado (que es hacia arriba): su beneficio es que todos saben qué es lo importante de la semana sin preguntarlo.",
      },
    ],
  },
};
