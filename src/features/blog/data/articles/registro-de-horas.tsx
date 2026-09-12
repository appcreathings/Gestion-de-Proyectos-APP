import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "registro-de-horas",
  title: "Registro de horas: por qué hacerlo y cómo sin odiarlo",
  excerpt:
    "El registro de horas bien usado no es vigilancia: es la materia prima para estimar mejor, facturar con datos y ver la capacidad real de tu equipo. Cómo implementarlo en 5 pasos.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-09",
  readingTime: "9 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  related: [
    "como-estimar-tiempos-proyecto",
    "planificacion-de-capacidad",
    "gestion-de-recursos-proyecto",
  ],
  seo: {
    title: "Registro de horas: cómo hacerlo sin odiarlo | Hito",
    description:
      "Registro de horas: para qué sirve de verdad (estimar, facturar, capacidad), cómo implementarlo en 5 pasos y qué granularidad elegir sin volverse loco.",
    ogImageAlt: "Registro de horas semanal de un equipo de proyecto.",
  },
  content: {
    eyebrow: "Tiempo y capacidad",
    intro: (
      <>
        <strong>En una línea:</strong> un registro de horas es la cuenta de cuánto tiempo real
        lleva el trabajo de tu equipo — y su valor no está en el control, sino en que convierte
        las estimaciones en datos, las facturas en evidencia y la capacidad en un número que se
        puede defender.
      </>
    ),
    sections: [
      {
        heading: "Qué es un registro de horas (y qué no es)",
        body: (
          <>
            <p>
              Un registro de horas es la práctica de anotar, con alguna regularidad, cuánto
              tiempo dedicó cada persona a cada proyecto o tarea. Eso es todo: un historial de
              tiempo real por proyecto, por persona y por semana. No es una nave espacial: es
              una tabla con tres columnas —quién, en qué y cuánto— sostenida en el tiempo.
            </p>
            <p>
              Tampoco es <strong>fichar</strong>. Fichar responde «¿estás trabajando ahora?»;
              el registro de horas responde «¿cuánto costó este proyecto?». La diferencia no es
              semántica: el primero mira la persona y el presente; el segundo mira el trabajo y
              el pasado inmediato. Un freelance que anota 3,5 horas en el rediseño de una landing
              no está reportando asistencia: está produciendo el dato que le va a permitir
              presupuestar la próxima landing sin adivinar. Esta distinción, además, conecta con
              la idea de medir el proyecto por logros y no por presencia que describimos en{" "}
              <Link
                to="/blogs/hito-project-gestion-por-hitos"
                className="underline underline-offset-2"
              >
                la gestión de proyectos por hitos
              </Link>
              : lo que importa no es la silla ocupada, sino qué produjo el tiempo invertido.
            </p>
          </>
        ),
      },
      {
        heading: "Los 3 usos que sí pagan el costo de registrar",
        body: (
          <>
            <p>
              Registrar horas cuesta algo: unos minutos por semana por persona y una pizca de
              disciplina. Para que ese costo valga la pena, el registro tiene que alimentar al
              menos una de estas tres cosas:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Estimar mejor.</strong> El uso más rentable. Cuando el cliente pregunta
                «¿cuánto lleva una web institucional?», la respuesta honesta no sale de la
                intuición: sale de los últimos tres proyectos parecidos. El equipo que registra
                horas conoce su propio ratio de desvío —aquello que estimó en 20 horas y tomó 28
                no se repite—. Cómo convertir ese dato en estimaciones está en{" "}
                <Link
                  to="/blogs/como-estimar-tiempos-proyecto"
                  className="underline underline-offset-2"
                >
                  cómo estimar tiempos sin fallar siempre
                </Link>
                .
              </li>
              <li>
                <strong>Facturar con evidencia.</strong> Si cobras por hora o por adelantado con
                ajustes posteriores, el registro es tu factura respaldada: «fueron 46 horas en el
                mes, así distribuidas». Y si cobras precio cerrado, es el detector de proyectos
                que consumen más de lo que facturan — los que silenciosamente te quitan margen.
              </li>
              <li>
                <strong>Ver la capacidad real.</strong> Las horas registradas del último trimestre
                dicen cuánto trabajo absorbible tiene tu equipo, no cuánto te gustaría que
                absorbiera. Ese número es la base de{" "}
                <Link
                  to="/blogs/planificacion-de-capacidad"
                  className="underline underline-offset-2"
                >
                  la planificación de capacidad
                </Link>
                : sin datos, planear capacidad es desear.
              </li>
            </ul>
            <p>
              Si tu registro no alimenta ninguna de las tres, vas a abandonarlo en un mes — y
              tendrás razón. Un registro que nadie consulta es burocracia con hoja de cálculo.
            </p>
          </>
        ),
      },
      {
        heading: "El error que mata el registro: usarlo como vigilancia",
        body: (
          <>
            <p>
              La mayoría de los registros de horas mueren por la misma razón: el equipo percibe
              que el dato se usa <em>contra</em> ellos. Si la primera pregunta al ver horas bajas
              es «¿qué hiciste el martes de 2 a 4?», el sistema deja de ser medición y pasa a ser
              sospecha. Y la respuesta racional del equipo es registrar lo que el jefe quiere
              leer — con lo cual el dato deja de servir incluso para los tres usos buenos.
            </p>
            <p>
              La regla práctica: <strong>el registro mira el trabajo, nunca a la persona</strong>.
              Se usa para comparar estimación contra realidad, proyectos rentables contra
              proyectos agujero, semanas con demasiadas interrupciones. No se usa para evaluar
              desempeño individual ni para justificar reproches por hora. Si como líder necesitas
              saber qué hace cada persona, para eso están{" "}
              <Link to="/blogs/reuniones-1a1" className="underline underline-offset-2">
                las reuniones 1:1
              </Link>{" "}
              y el tablero — no la planilla.
            </p>
            <p>
              Un detalle que ayuda a vender la idea internamente: que el primero en registrar y
              el primero en usar los datos seas tú. Nada legitima más el registro que el propio
              líder mostrando sus horas del mes y el desvío de sus propias estimaciones.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo implementarlo en 5 pasos",
        body: (
          <>
            <p>
              La implementación importa más que la herramienta. Este es el camino corto, probado
              en equipos de 1 a 15 personas:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Define la granularidad antes de empezar.</strong> La pregunta clave: ¿a
                qué nivel se registra? Proyecto, tarea o subtarea. La respuesta corta para la
                mayoría: proyecto + tarea grande. Más fino que eso y el registro se vuelve un
                trabajo de tiempo completo (ver tabla abajo).
              </li>
              <li>
                <strong>Fija el momento, no la voluntad.</strong> Los registros que dependen de
                memoria y buena voluntad fallan. Funciona mejor un ritual fijo: 5 minutos al
                cerrar el día, o 15 minutos los viernes para la semana completa. La reconstrucción
                semanal suena imprecisa pero en la práctica la gente recuerda su semana con
                sorprendente precisión cuando el trabajo tiene forma de proyectos.
              </li>
              <li>
                <strong>Quita toda fricción.</strong> Donde ya está el trabajo, se registra: el
                mismo gestor donde viven las tareas, no una herramienta aparte que exige otro
                login. Cada click extra es una deserción futura.
              </li>
              <li>
                <strong>Revísalo semanalmente — con pregunta de uso.</strong> 10 minutos: ¿qué
                proyecto se comió más horas de las esperadas? ¿Hay tareas que siempre toman más
                de lo estimado? El registro sin lectura semanal es un cajón.
              </li>
              <li>
                <strong>Cierra el loop con las estimaciones.</strong> Una vez al mes, compara:
                ¿estimaste 100 horas y registraste 130? Ajusta el factor para el próximo
                presupuesto. Aquí es donde el registro paga su renta:{" "}
                <Link
                  to="/blogs/formula-tiempo-esperado-pert"
                  className="underline underline-offset-2"
                >
                  PERT y un buen registro
                </Link>{" "}
                juntos convierten la estimación en un proceso con memoria.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Qué registrar y qué no: la granularidad correcta",
        body: (
          <>
            <p>
              El error más común del primer mes no es la pereza: es el perfeccionismo. Registrar
              cada subtarea de 15 minutos produce planillas bellas e inservibles, porque el costo
              de mantenerlas supera cualquier uso. La granularidad se elige por el uso que le
              vas a dar:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Granularidad</th>
                  <th className="py-2 pr-4 font-semibold">Sirve para</th>
                  <th className="py-2 font-semibold">Riesgo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Solo por proyecto</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Rentabilidad por cliente y capacidad global.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    No detecta qué tipo de tarea desvía.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Proyecto + tarea grande
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Estimar proyectos parecidos; detectar fases problemáticas.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Ninguno grave — el punto dulce para la mayoría.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Por subtarea (15–30 min)</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Facturación por hora muy detallada; auditoría.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Costo de registro alto; datos que nadie lee.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Timer encendido/apagado todo el día
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Métricas personales de foco; freelancers que facturan por hora exacta.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Ansiedad de reloj; se olvida encenderlo y el dato se corrompe.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Y qué <strong>no</strong> registrar: horas de reflexión informal, pausas de café,
              el tiempo de leer noticias del rubro. El registro mide trabajo asignable a un
              proyecto; lo demás es vida. Si el registro aspira a capturar cada minuto, miente
              por diseño — porque nadie lo cumple.
            </p>
          </>
        ),
      },
      {
        heading: "Métodos y herramientas, con honestidad",
        body: (
          <>
            <p>
              No necesitas software especializado para empezar. Necesitas consistencia. Las
              opciones reales, con sus techos:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Método</th>
                  <th className="py-2 pr-4 font-semibold">Ideal para</th>
                  <th className="py-2 font-semibold">Techo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Papel o cuaderno</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Un freelance; probar el hábito un mes.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Sin totales ni comparaciones: todo es manual.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Hoja de cálculo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipos de 2–5; granularidad fija y estable.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Se abandona; los datos viven lejos del trabajo.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Registro dentro del gestor de tareas
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    La mayoría de los equipos pequeños: donde está la tarea, va la hora.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Depende de que el gestor lo ofrezca sin fricción.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Apps dedicadas de time tracking
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Facturación por hora a volumen; clientes que exigen desglose.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Otra suscripción, otro login, datos en la nube de terceros.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El criterio de elección que recomendamos es el mismo que defiende este sitio: que
              el registro viva <strong>junto al trabajo y bajo tu control</strong>. Si las horas
              quedan en una nube de terceros separada de las tareas, vas a terminar con dos
              verdades que no se cruzan. En{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              el registro de horas vive al lado de cada tarea, en un archivo JSON local de tu
              propia carpeta — sin cuenta, sin nube, y exportable cuando quieras.
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
              — registra horas por tarea donde ya vive tu trabajo, local-first y sin suscripción.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un registro de horas?",
        answer:
          "Es la práctica de anotar cuánto tiempo real dedicó cada persona a cada proyecto o tarea, normalmente con corte semanal. Produce un historial de horas por proyecto que sirve para estimar, facturar y planear capacidad — no para controlar asistencia.",
      },
      {
        question: "¿Para qué sirve registrar las horas de trabajo?",
        answer:
          "Para tres cosas concretas: estimar mejor (comparar tiempo real contra estimado), facturar con evidencia (desglose defendible por proyecto) y conocer la capacidad real del equipo. Si el registro no alimenta ninguna de esas tres, no se sostiene en el tiempo.",
      },
      {
        question: "¿Cuánto tiempo toma llevar un registro de horas?",
        answer:
          "Entre 5 y 15 minutos por persona por semana si la granularidad es proyecto + tarea grande. Los registros que exigen captura en tiempo real de cada subtarea consumen mucho más y suelen abandonarse en el primer mes.",
      },
      {
        question: "¿Es lo mismo un registro de horas que fichar?",
        answer:
          "No. Fichar marca asistencia («¿estás trabajando ahora?») y mira a la persona en el presente; el registro de horas mide inversión de tiempo por proyecto («¿cuánto costó este trabajo?») y mira al trabajo en el pasado. Confundirlos es la razón número uno por la que los equipos rechazan el registro.",
      },
      {
        question: "¿Cómo lograr que el equipo acepte registrar horas?",
        answer:
          "Tres reglas: explicar para qué se usará y cumplirlo (estimar y facturar, nunca vigilar), que el registro viva donde ya están las tareas sin fricción extra, y que el líder registre y comparta sus propios datos primero. El registro sobrevive cuando todos ven el beneficio, no el control.",
      },
    ],
  },
};
