import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "planificacion-de-capacidad",
  title: "Planificación de capacidad: cuánto trabajo puede aceptar tu equipo",
  excerpt:
    "Planificación de capacidad: cómo convertir las horas reales de tu equipo en compromisos que se cumplen, con el cálculo de 5 pasos y el factor de foco que todos ignoran.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-09",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "registro-de-horas",
  related: ["registro-de-horas", "gestion-de-recursos-proyecto", "reducir-trabajo-en-curso"],
  seo: {
    title: "Planificación de capacidad: cuánto puede tu equipo | Hito",
    description:
      "Planificación de capacidad: qué es, cómo calcular la capacidad real de tu equipo en 5 pasos, el factor de foco y qué hacer cuando la demanda supera la capacidad.",
    ogImageAlt: "Cálculo de capacidad de equipo: horas disponibles contra demanda de proyectos.",
  },
  content: {
    eyebrow: "Tiempo y capacidad",
    intro: (
      <>
        <strong>En una línea:</strong> la planificación de capacidad es responder con números
        cuánto trabajo puede aceptar tu equipo en un periodo — antes de comprometerlo — y es la
        diferencia entre un mes planeado y un mes de emergencias encadenadas.
      </>
    ),
    sections: [
      {
        heading: "Qué es planificar capacidad (y por qué casi nadie lo hace)",
        body: (
          <>
            <p>
              Planificar capacidad es traducir las horas disponibles de tu equipo en compromisos
              que caben en esas horas. Suena obvio, y sin embargo la mayoría de los equipos
              pequeños hace lo contrario: acepta proyectos, los suma al calendario y descubre la
              sobrecarga cuando ya hay fechas incumplidas sobre la mesa. La capacidad se
              descubre, en lugar de decidirse.
            </p>
            <p>
              La razón por la que no se hace no es pereza: es que el número asusta. Calcular
              capacidad significa enfrentar que un equipo de 4 personas no tiene 640 horas al
              mes para proyectos — tiene muchas menos — y que dos de los tres compromisos que ya
              aceptaste no caben. Pero ese malestar de una tarde es infinitamente más barato que
              el malestar sostenido de un equipo crónicamente sobrepasado, que termina en fechas
              rotas y en la rotación silenciosa de la gente buena. Si ya registras horas, el
              cálculo está a mitad de camino:{" "}
              <Link to="/blogs/registro-de-horas" className="underline underline-offset-2">
                el registro de horas
              </Link>{" "}
              te da el insumo, la planificación de capacidad es la decisión que tomas con él.
            </p>
          </>
        ),
      },
      {
        heading: "Capacidad ≠ asignación",
        body: (
          <>
            <p>
              Son dos preguntas distintas que se suelen confundir, y la confusión produce
              decisiones malas en ambos lados:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Criterio</th>
                  <th className="py-2 pr-4 font-semibold">Planificación de capacidad</th>
                  <th className="py-2 font-semibold">Asignación de recursos</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Pregunta</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Cuánto trabajo puede aceptar el equipo?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    ¿Quién hace cada tarea concreta?
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Horizonte</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Meses o trimestres: decisiones de toma o deja.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Esta semana: tareas específicas con responsable.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Nivel</td>
                  <td className="py-2 pr-4 text-muted-foreground">Equipo completo.</td>
                  <td className="py-2 text-muted-foreground">Persona por persona.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Falla cuando…</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Se acepta más de lo que cabe (sobrecarga estructural).
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Hay capacidad pero la carga queda mal repartida.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El orden importa: primero decides si el trabajo cabe (capacidad), después repartes
              quién lo hace (asignación — para eso está{" "}
              <Link
                to="/blogs/gestion-de-recursos-proyecto"
                className="underline underline-offset-2"
              >
                la gestión de recursos
              </Link>
              ). Hacerlo al revés — asignar tareas y rezar — es como llenar una valija sin saber
              a dónde viajas.
            </p>
          </>
        ),
      },
      {
        heading: "El cálculo en 5 pasos",
        body: (
          <>
            <p>
              Este es el cálculo mínimo que alcanza para equipos de 1 a 15 personas. Toma una
              tarde la primera vez y 20 minutos en las revisiones mensuales:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Horas brutas.</strong> Personas × horas de la jornada × semanas del
                periodo. Ejemplo: 4 personas × 40 h × 4 semanas = 640 horas. Este número miente,
                y lo sabemos — por eso hay pasos 2 y 3.
              </li>
              <li>
                <strong>Resta lo no productivo.</strong> Vacaciones, licencias, ausencias previstas
                y el tiempo que ya está comprometido en soporte, reuniones fijas y administración.
                En equipos de servicios, este bloque suele ser del 20–30%. Quedan, digamos, 480.
              </li>
              <li>
                <strong>Aplica el factor de foco.</strong> Nadie produce 8 horas de trabajo
                profundo por día: entre interrupciones, cambios de contexto y comunicaciones, la
                capacidad real de trabajo concentrado suele estar entre el 60% y el 80% de lo que
                queda. Es el factor que todos ignoran y el que explica la mayoría de los planes
                optimistas (ver sección siguiente). 480 × 0,7 = 336 horas reales.
              </li>
              <li>
                <strong>Compara con la demanda.</strong> Súmale las horas estimadas de los
                proyectos en curso y de los que piensas aceptar. Si la demanda pasa de 336, algo
                no cabe: no es pesimismo, es aritmética.
              </li>
              <li>
                <strong>Decide qué NO tomar.</strong> Este es el paso que da valor: la
                planificación de capacidad no sirve para llenar el 100% — sirve para elegir
                conscientemente qué entra, qué se encola y qué se rechaza. El hueco deliberado
                (10–15%) es tu amortiguador contra lo inevitable.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "El factor de foco: la variable que todos ignoran",
        body: (
          <>
            <p>
              Si planearas con las horas brutas, un equipo de 4 «tendría» 640 horas al mes. La
              realidad de la mayoría de los equipos de servicios ronda las 300–350 horas de
              trabajo aprovechable. ¿Dónde se fue el resto? En el trabajo invisible que nadie
              presupuesta: reuniones que se multiplican, soporte que interrumpe, cambios de
              contexto entre proyectos que cuestan 15–20 minutos de recalentamiento cada uno,
              y la gestión misma del trabajo (que es trabajo, aunque no esté en el presupuesto).
            </p>
            <p>
              El factor de foco no es un adorno estadístico: es la corrección que hace que el
              plan sobreviva al contacto con la semana real. Si tus registros históricos de{" "}
              <Link to="/blogs/registro-de-horas" className="underline underline-offset-2">
                horas registradas
              </Link>{" "}
              muestran que el equipo completa 320 horas de proyecto por mes, no planees con 400
              porque el calendario «da». El calendario siempre da; la gente no.
            </p>
            <p>
              Un efecto secundario valioso: cuando los interruptores crónicos se vuelven visibles
              en el factor, también se vuelve visible su costo. Reducir reuniones innecesarias o
              concentrar soporte en franjas horarias (en lugar de responder al vuelo) sube la
              capacidad sin contratar a nadie — la misma lógica de proteger el trabajo en curso
              que aplicamos en{" "}
              <Link
                to="/blogs/reducir-trabajo-en-curso"
                className="underline underline-offset-2"
              >
                por qué tu equipo entrega poco
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Señales de sobrecarga: el semáforo",
        body: (
          <>
            <p>
              No siempre vas a tener el cálculo al día. Estas señales — ordenadas de leve a
              grave — indican que la demanda ya pasó la capacidad:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Nivel</th>
                  <th className="py-2 pr-4 font-semibold">Señal</th>
                  <th className="py-2 font-semibold">Qué hacer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">🟢 Sano</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Fechas se cumplen; hay holgura para lo imprevisto.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Mantén el amortiguador del 10–15%; no lo gastes.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">🟡 Al límite</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Todo se cumple pero sin aire; un imprevisto rompe el mes.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Congela nuevos compromisos; recorta alcance del propio mes.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">🟠 Sobrecarga</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Horas extra recurrentes; calidad empieza a resentirse.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Renegocia fechas o alcance de{" "}
                    <Link
                      to="/blogs/proyecto-atrasado-que-hacer"
                      className="underline underline-offset-2"
                    >
                      proyectos atrasados
                    </Link>
                    ; detén la entrada de trabajo nuevo.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">🔴 Crónica</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Atrasos encadenados, errores tontos, gente que renuncia.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Decisión estructural: menos compromisos, más gente o modelo distinto.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El error clásico es tratar los niveles 🟠 y 🔴 con heroísmo individual — «aguanta
              este mes» — cuando son problemas de decisión, no de esfuerzo. La sobrecarga
              sostenida no se resuelve con más horas: se responde aceptando menos, encolando el
              resto o incorporando capacidad, en ese orden de preferencia.
            </p>
          </>
        ),
      },
      {
        heading: "Qué hacer cuando la demanda supera la capacidad",
        body: (
          <>
            <p>
              Es la mejor noticia posible que esto te pase de forma visible: significa que
              vendes más de lo que puedes entregar, y la solución es una decisión de negocio, no
              un milagro operativo. Las opciones, en orden:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Subir precios.</strong> Si no cabe todo, deja entrar el trabajo mejor
                pagado. Es la única opción que no aumenta costo estructural.
              </li>
              <li>
                <strong>Encolar con fechas.</strong> «Arrancamos tu proyecto el día 15» es una
                respuesta profesional si la fecha es real — y ahora la puedes calcular.
              </li>
              <li>
                <strong>Rechazar con criterio.</strong> Los proyectos mal pagados o mal encajados
                ocupan la capacidad que necesitan los buenos.
              </li>
              <li>
                <strong>Contratar (o subcontratar) al final.</strong> Cuando las tres anteriores
                se agotan de forma sostenida, la capacidad nueva se paga sola. Contratar para
                tapar una sobrecarga puntual, en cambio, es la receta del endeudamiento de
                nómina.
              </li>
            </ul>
            <p>
              Si quieres que la capacidad, las horas y los compromisos vivan en un mismo lugar —
              tareas con registro de horas, hitos y dashboard por proyecto, todo en un archivo
              local de tu carpeta sin cuenta ni nube—{" "}
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
              — horas, capacidad y proyectos en un solo archivo local.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es la planificación de capacidad?",
        answer:
          "Es el proceso de calcular cuánto trabajo puede aceptar realmente un equipo en un periodo, convirtiendo las horas disponibles (menos ausencias, soporte e interrupciones) en un límite de compromisos. Se decide antes de aceptar el trabajo, no después de sobrecargarse.",
      },
      {
        question: "¿Cómo se calcula la capacidad de un equipo?",
        answer:
          "En 5 pasos: horas brutas (personas × jornada × semanas), restar lo no productivo (vacaciones, reuniones fijas, soporte), aplicar un factor de foco del 60–80%, comparar contra la demanda estimada y decidir conscientemente qué no entra. Un equipo de 4 personas no tiene 640 horas útiles al mes: suele tener 300–350.",
      },
      {
        question: "¿Qué es el factor de foco?",
        answer:
          "Es el porcentaje de horas disponibles que se convierte en trabajo concentrado real, una vez descontadas interrupciones, cambios de contexto y comunicaciones. Suele estar entre el 60% y el 80%. Ignorarlo es la causa más común de planes que fracasan en la primera semana.",
      },
      {
        question: "¿Cuál es la diferencia entre planificación de capacidad y gestión de recursos?",
        answer:
          "La capacidad responde «¿cuánto trabajo cabe?» a nivel del equipo completo y con horizonte de meses; la gestión de recursos responde «¿quién hace cada tarea?» a nivel de persona y semana. Primero se decide si el trabajo cabe, después se reparte.",
      },
      {
        question: "¿Qué hacer cuando la demanda supera la capacidad?",
        answer:
          "En este orden: subir precios para dejar entrar solo el mejor trabajo, encolar proyectos nuevos con fechas reales, rechazar los que encajan mal y — solo si la sobrecarga es sostenida — contratar o subcontratar. Tratarla con horas extra la convierte en un problema crónico.",
      },
    ],
  },
};
