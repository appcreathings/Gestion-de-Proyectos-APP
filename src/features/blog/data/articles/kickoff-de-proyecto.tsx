import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "kickoff-de-proyecto",
  title: "Kickoff de proyecto: agenda, plantilla y errores",
  excerpt:
    "El kickoff no es un discurso de lanzamiento. Es la reunión donde se confirma alcance, roles y la primera semana. Agenda de 45 minutos y plantilla.",
  category: "plantillas",
  categoryLabel: "Plantillas",
  publishedAt: "2027-05-24",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "plantillas-gestion-proyectos",
  related: ["plantillas-gestion-proyectos", "acta-constitucion-proyecto", "fases-de-un-proyecto"],
  seo: {
    title: "Kickoff de proyecto: agenda y plantilla | Hito",
    description:
      "Kickoff de proyecto: agenda de 45 minutos, plantilla y errores. La reunión de kickoff confirma alcance, roles y la primera semana.",
    ogImageAlt: "Agenda de kickoff de proyecto de 45 minutos, con plantilla.",
  },
  content: {
    eyebrow: "Plantillas",
    intro: (
      <>
        <strong>En una línea:</strong> un <strong>kickoff de proyecto</strong> no es un discurso de
        lanzamiento ni 90 minutos de diapositivas: es la reunión corta donde el equipo confirma
        alcance, roles y las tareas de la primera semana. Si sales sin dueño por decisión y sin
        trabajo para los próximos cinco días, no hubo kickoff — hubo un anuncio.
      </>
    ),
    sections: [
      {
        heading: "Qué es un kickoff de proyecto (y qué no es)",
        body: (
          <>
            <p>
              El kickoff de proyecto —también reunión de kickoff o <em>project kickoff</em>— cierra
              el inicio y abre la planificación. No crea el proyecto: lo pone en marcha con quien
              va a ejecutarlo. El{" "}
              <Link to="/blogs/acta-constitucion-proyecto" className="underline underline-offset-2">
                acta de constitución
              </Link>{" "}
              responde “por qué existe esto”; el kickoff responde “¿estamos de acuerdo, quién hace
              qué, y qué pasa esta semana?”.
            </p>
            <p>
              En las{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                5 fases de un proyecto
              </Link>
              , vive en el borde entre inicio y planificación. Si todavía no hay objetivo, métrica
              y exclusiones, no es momento de kickoff: es momento de escribir el acta. Si el
              equipo ya ejecuta sin esa reunión, el kickoff llegó tarde y sirve igual — ahora
              también repara malentendidos que ya empezaron a costar.
            </p>
          </>
        ),
      },
      {
        heading: "Antes de la reunión: el pre-read",
        body: (
          <>
            <p>
              La reunión de kickoff no es el lugar para leer el charter en voz alta. Envía el acta
              —o un one-pager con objetivo, alcance, fuera de alcance, hitos y riesgos— al menos
              48 horas antes. Pide una sola cosa: que cada invitado llegue con una duda o una
              objeción, no con un “lo leo en la reunión”.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Objetivo en una frase, con métrica y plazo.</li>
              <li>Qué entra en el alcance y, explícitamente, qué no.</li>
              <li>Roles tentativos (la RACI se confirma en la sala).</li>
              <li>Los 3–5 hitos que importan, no las 40 tareas.</li>
              <li>Los 3 riesgos más caros que ya se ven venir.</li>
            </ul>
            <p>
              Si no hay acta, no improvises un kickoff de dos horas para “ponerlo en común”.
              Escribe el one-pager, envíalo, y recién entonces reúne a la gente. Sin el mismo
              texto, cada persona trae una película distinta.
            </p>
          </>
        ),
      },
      {
        heading: "Agenda de 45 minutos",
        body: (
          <>
            <p>
              45 minutos es el techo útil para un equipo chico o mediano. Cada bloque termina en
              una decisión, no en un “quedó interesante”:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Bloque</th>
                  <th className="py-2 pr-4 font-semibold">Min</th>
                  <th className="py-2 font-semibold">Qué se decide</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Propósito</td>
                  <td className="py-2 pr-4 text-muted-foreground">5</td>
                  <td className="py-2 text-muted-foreground">
                    Por qué existe el proyecto y cómo se sabrá que funcionó
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Alcance y fuera de alcance</td>
                  <td className="py-2 pr-4 text-muted-foreground">10</td>
                  <td className="py-2 text-muted-foreground">
                    Qué entra, qué queda afuera, y qué pedido típico no está incluido
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Roles (RACI)</td>
                  <td className="py-2 pr-4 text-muted-foreground">10</td>
                  <td className="py-2 text-muted-foreground">
                    Quién hace, quién aprueba, a quién se consulta y a quién se informa
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Hitos</td>
                  <td className="py-2 pr-4 text-muted-foreground">10</td>
                  <td className="py-2 text-muted-foreground">
                    Los puntos de control de las próximas semanas, con fecha tentativa
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Riesgos y logística</td>
                  <td className="py-2 pr-4 text-muted-foreground">10</td>
                  <td className="py-2 text-muted-foreground">
                    Los 3 riesgos más caros, canal de comunicación y cadencia
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El bloque de alcance se come el tiempo si lo dejas abierto: llega con exclusiones
              escritas y pide objeciones, no lluvia de ideas. El de roles se resuelve más rápido
              con una{" "}
              <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                matriz RACI
              </Link>{" "}
              de 5–8 entregables. El de hitos no es un cronograma completo: son los puntos donde
              alguien va a poder decir “esto está, o no está”.
            </p>
          </>
        ),
      },
      {
        heading: "Quién entra a la sala (y quién no)",
        body: (
          <>
            <p>
              Invita a quien decide, a quien hace el trabajo de las primeras semanas y a quien
              puede bloquear el proyecto si se entera tarde. Eso rara vez son 20 personas. Un
              kickoff con audiencia grande se vuelve presentación; uno con las personas
              equivocadas hay que repetirlo.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Sí:</strong> sponsor o cliente que aprueba alcance, responsable de
                ejecución y dueños de los primeros entregables.
              </li>
              <li>
                <strong>No:</strong> “por si acaso” de cada área, ni quien solo necesita el
                anuncio (eso es Informed de la RACI, no un asiento).
              </li>
            </ul>
            <p>
              Con cliente externo la lista se achica más: no presentes a toda la agencia, alinea
              con quien del otro lado aprueba. Cómo ordenar canal y change request está en{" "}
              <Link
                to="/blogs/gestionar-proyectos-con-clientes"
                className="underline underline-offset-2"
              >
                gestionar proyectos con clientes
              </Link>
              . Si esa persona no puede venir, reprograma o corre una versión corta con ella y
              replica las decisiones al resto.
            </p>
          </>
        ),
      },
      {
        heading: "Lo que tiene que salir: decisions log y primera semana",
        body: (
          <>
            <p>
              Un kickoff sin output es una conversación cara. Dos artefactos alcanzan, y ambos se
              escriben durante la reunión, no “después cuando haya tiempo”:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Log de decisiones.</strong> Cada decisión en una línea: qué se decidió,
                quién es el dueño, qué queda abierto. Un área no es un dueño.
              </li>
              <li>
                <strong>Tareas de la primera semana.</strong> Cinco a diez ítems con dueño y
                fecha. El{" "}
                <Link to="/blogs/plantilla-plan-de-proyecto" className="underline underline-offset-2">
                  plan de proyecto
                </Link>{" "}
                se completa en los días siguientes, no en la sala.
              </li>
            </ol>
            <p>
              Envía ambos el mismo día, a quienes estuvieron y a los Informed que no vinieron. Si
              el log tarda 48 horas, cada persona ya empezó a trabajar con la versión que recuerde.
            </p>
          </>
        ),
      },
      {
        heading: "Errores que convierten el kickoff en teatro",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>90 minutos de diapositivas.</strong> Si el bloque de contexto dura más
                que el de decisiones, estás presentando. El pre-read ya dijo eso: usa el tiempo
                para objeciones y dueños.
              </li>
              <li>
                <strong>Nadie es dueño de la decisión.</strong> “Quedó que lo vemos” no es una
                decisión. Cada fila del log necesita un nombre, no un área.
              </li>
              <li>
                <strong>Invitar a 20 personas.</strong> Cada asiento extra baja la probabilidad
                de decir “esto no entra”. El conflicto se muda al chat privado.
              </li>
            </ul>
            <p>
              Un cuarto error, más silencioso: tratar el kickoff como acto de motivación. El
              equipo no necesita que le recuerden que el proyecto “es importante”. Necesita saber
              qué no va a hacer, quién aprueba y qué hay que entregar el viernes.
            </p>
          </>
        ),
      },
      {
        heading: "Después del kickoff: qué queda escrito",
        body: (
          <>
            <p>
              El mismo día, actualiza el acta con lo que cambió en la sala (siempre cambia algo)
              y guarda el log junto al plan. Las tareas de la primera semana entran al tablero
              con dueño. Recién ahí el proyecto dejó de ser un documento y pasó a ser trabajo.
            </p>
            <p>
              Si apareció alcance nuevo, anótalo como cambio y decide si entra ahora, después o
              nunca. El kickoff es el momento más barato para decir que no. Esta agenda es una de
              las{" "}
              <Link
                to="/blogs/plantillas-gestion-proyectos"
                className="underline underline-offset-2"
              >
                8 plantillas de gestión de proyectos
              </Link>{" "}
              que sí se usan.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo correr un kickoff de proyecto de 45 minutos",
      steps: [
        {
          name: "Enviar el pre-read 48 horas antes",
          text: "Acta o one-pager con objetivo, alcance, exclusiones, hitos y 3 riesgos. Cada invitado llega con una duda, no a leer el documento en la sala.",
        },
        {
          name: "Armar la agenda y la lista corta de invitados",
          text: "45 minutos en cinco bloques. Invita a quien decide, a quien hace el trabajo de la primera semana y a quien puede bloquear el proyecto.",
        },
        {
          name: "Correr la reunión bloque por bloque",
          text: "Una persona facilita el tiempo y otra escribe el log en vivo. Cada bloque termina en una decisión.",
        },
        {
          name: "Cerrar el log de decisiones en la sala",
          text: "Qué se decidió, quién es el dueño, qué queda abierto y para cuándo. Un área no es un dueño.",
        },
        {
          name: "Salir con las tareas de la primera semana",
          text: "Cinco a diez ítems con dueño y fecha, enviados el mismo día junto al log.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es un kickoff de proyecto?",
        answer:
          "Un kickoff de proyecto es la reunión donde el equipo confirma alcance, roles y las tareas de la primera semana. No es un discurso de lanzamiento ni el momento de escribir el acta: el acta se lee antes; el kickoff decide y arranca el trabajo.",
      },
      {
        question: "¿Cuánto debe durar una reunión de kickoff?",
        answer:
          "45 minutos alcanzan para un equipo chico o mediano si hay pre-read. Si necesitas 90 minutos, casi siempre estás presentando contexto que debió ir en el documento, o hay demasiada gente en la sala.",
      },
      {
        question: "¿Quién debería asistir al project kickoff?",
        answer:
          "Quien decide el alcance, quien ejecuta las primeras semanas y quien puede bloquear el proyecto si se entera tarde. Rara vez hacen falta más de 6–8 personas; el resto queda informado por el log del mismo día.",
      },
      {
        question: "¿Hace falta kickoff si el equipo ya se conoce?",
        answer:
          "Sí. El kickoff no existe para que la gente se salude: existe para confirmar alcance, dueños y la primera semana de ese proyecto concreto. Equipos que se conocen igual arrancan con películas distintas si no lo dicen en voz alta.",
      },
      {
        question: "¿El kickoff reemplaza al acta de constitución?",
        answer:
          "No. El acta (o project charter) se escribe antes y se envía como pre-read; el kickoff la confirma, resuelve ambigüedades y produce el log de decisiones más las tareas de la primera semana.",
      },
    ],
  },
};
