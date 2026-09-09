import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "plan-de-trabajo",
  title: "Plan de trabajo: cómo hacer el operativo de la semana",
  excerpt:
    "Plan de trabajo: el operativo de la semana en 6 bloques y 4 pasos. Qué incluye, en qué se diferencia del plan de proyecto y del backlog, y los errores que lo vuelven papel mojado.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-05",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "tablero-kanban",
  related: [
    "tablero-kanban",
    "plantilla-plan-de-proyecto",
    "sprint-planning-como-hacerlo",
  ],
  seo: {
    title: "Plan de trabajo: cómo hacer el operativo de la semana | Hito",
    description:
      "Cómo hacer un plan de trabajo semanal: qué incluye, plantilla de 6 bloques y la diferencia con el plan de proyecto y el backlog. Para equipos pequeños.",
    ogImageAlt: "Plan de trabajo semanal con objetivos, tareas y responsables.",
  },
  content: {
    eyebrow: "Organización del trabajo",
    intro: (
      <>
        <strong>En una línea:</strong> un plan de trabajo es el operativo de la semana —qué se
        entrega, quién tiene cada tarea y qué capacidad real hay—, no un documento formal. Bien
        hecho cabe en una página, se publica el lunes y se revisa el viernes; mal hecho, es una
        lista de deseos que nadie mira.
      </>
    ),
    sections: [
      {
        heading: "Qué es un plan de trabajo (y qué no es)",
        body: (
          <>
            <p>
              Un plan de trabajo es el operativo de una semana: qué se va a entregar, qué
              tareas lo hacen posible, quién tiene cada una y con qué capacidad real se cuenta.
              Vive en una página que se publica el lunes y se revisa el viernes. Su unidad de
              tiempo es la semana porque es el plazo donde las personas todavía pueden sostener
              compromisos sin necesitar una bola de cristal.
            </p>
            <p>
              No es el plan de proyecto: ese es el documento formal con fases, presupuesto,
              alcance y fechas de todo el ciclo de vida, que se escribe una vez y se actualiza
              pocas. Si lo que necesitas es eso, tienes la{" "}
              <Link
                to="/blogs/plantilla-plan-de-proyecto"
                className="underline underline-offset-2"
              >
                plantilla de plan de proyecto
              </Link>{" "}
              lista para copiar. Tampoco es el backlog: el plan no contiene todo lo pendiente,
              solo lo que esta semana se compromete. Es el puente entre ambos: del universo de
              trabajo pendiente, elige el pedazo que cabe en siete días.
            </p>
          </>
        ),
      },
      {
        heading: "Los 6 bloques que sí importan",
        body: (
          <>
            <p>
              Un plan de trabajo que funciona tiene seis bloques y ninguno más. Si falta
              alguno, el plan se rompe de una forma predecible: sin objetivo, la semana se
              dispersa; sin capacidad, se sobrepromete; sin dueños, nadie empieza. Este es el
              esqueleto:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Objetivo de la semana.</strong> Una frase que responde «si solo
                logramos una cosa, ¿cuál es?». Es la brújula para decidir qué se recorta cuando
                la semana se estrecha.
              </li>
              <li>
                <strong>Entregas comprometidas.</strong> Lo que sale de la semana con fecha y
                destinatario. No son tareas: son resultados que alguien está esperando.
              </li>
              <li>
                <strong>Tareas con dueño.</strong> Cada tarea con un nombre —uno solo— y su
                tamaño estimado. Si ninguna persona figura, no es un plan: es una lista de
                deseos.
              </li>
              <li>
                <strong>Capacidad real.</strong> Las horas disponibles para trabajo nuevo,
                descontando reuniones, soporte y ausencias. Planificar contra la capacidad
                nominal fabrica sobrecarga con la mejor intención.
              </li>
              <li>
                <strong>Riesgos y bloqueos.</strong> Lo que puede frenar la semana y qué se
                hace si pasa. Un riesgo sin plan B es solo una preocupación anotada.
              </li>
              <li>
                <strong>Revisión del viernes.</strong> Un bloque de 15 minutos para mirar qué
                entró, qué no y por qué. Es lo que convierte el plan en un hábito que aprende,
                no en un papel que se olvida.
              </li>
            </ol>
            <p>
              Así se ve completo, con el ejemplo de una agencia de cinco personas:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Bloque</th>
                  <th className="py-2 font-semibold">Ejemplo (semana del 14 al 18)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Objetivo de la semana</td>
                  <td className="py-2 text-muted-foreground">
                    Cerrar la landing del cliente A y arrancar la migración del cliente B.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Entregas comprometidas</td>
                  <td className="py-2 text-muted-foreground">
                    Propuesta del cliente C enviada (mar 15) · Landing publicada (jue 17).
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Tareas con dueño</td>
                  <td className="py-2 text-muted-foreground">
                    12 tareas: Ana (diseño, 5), Luis (copy, 3), tú (revisión y clientes, 4).
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Capacidad real</td>
                  <td className="py-2 text-muted-foreground">
                    26 h disponibles para trabajo nuevo; Ana fuera mié–jue.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Riesgos y bloqueos</td>
                  <td className="py-2 text-muted-foreground">
                    Textos del cliente A sin llegar: si no están el martes, se recorta a dos
                    secciones.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Revisión del viernes</td>
                  <td className="py-2 text-muted-foreground">
                    Vie 16:00, 15 minutos, todo el equipo.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Fíjate en lo que la tabla no tiene: 40 tareas, microtareas de 15 minutos ni
              asignación por horas exactas. El plan de trabajo se queda en el nivel de detalle
              que un equipo puede sostener cada semana; el detalle fino vive en cada tarea, no
              en el plan.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo hacerlo en 4 pasos",
        body: (
          <>
            <p>
              Hacer el plan de la semana toma menos de 40 minutos si sigues esta secuencia:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Revisa el tablero (10 min).</strong> Qué quedó pendiente de la semana
                pasada, qué está a medias y qué se bloqueó. El{" "}
                <Link to="/blogs/tablero-kanban" className="underline underline-offset-2">
                  tablero kanban
                </Link>{" "}
                es la fuente de la verdad: el plan parte de lo que hay, no de lo que te
                gustaría que hubiera.
              </li>
              <li>
                <strong>Compromete (10 min).</strong> Elige el objetivo, las entregas y las
                tareas que caben en la capacidad real. La prueba de honestidad: si alguien suma
                más de lo que puede hacer, algo vuelve a la cola —a la vista, no al olvido—.
              </li>
              <li>
                <strong>Publica (5 min).</strong> El plan se escribe donde todo el equipo lo
                vea y pueda consultarlo cualquier día, no en un mensaje de chat que muere al
                hacer scroll. Publicado significa comprometido.
              </li>
              <li>
                <strong>Revisa el viernes (15 min).</strong> Qué entró, qué no y por qué; los
                bloqueos se convierten en riesgos de la semana siguiente. Este cierre es lo que
                mejora el plan de la próxima: la fiabilidad se mide, no se supone.
              </li>
            </ol>
            <p>
              Si tu equipo trabaja por sprints, reconocerás el mecanismo: es el mismo músculo a
              escala semanal. La variante completa, con objetivo de sprint y reparto por
              capacidad, está en{" "}
              <Link
                to="/blogs/sprint-planning-como-hacerlo"
                className="underline underline-offset-2"
              >
                cómo hacer un sprint planning
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Plan de trabajo, backlog y cronograma: quién es quién",
        body: (
          <>
            <p>
              Las tres herramientas conviven en cualquier equipo y responden preguntas
              distintas. Confundirlas produce planes eternos o backlogs con fechas inventadas:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Herramienta</th>
                  <th className="py-2 pr-4 font-semibold">Qué contiene</th>
                  <th className="py-2 pr-4 font-semibold">Horizonte</th>
                  <th className="py-2 font-semibold">Quién la usa</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Plan de trabajo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Lo comprometido de una semana: entregas, tareas con dueño, capacidad y
                    riesgos.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">1 semana</td>
                  <td className="py-2 text-muted-foreground">El equipo, todos los días.</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Backlog</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Todo el trabajo pendiente, ordenado por prioridad y sin fecha en su
                    mayoría.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Indefinido</td>
                  <td className="py-2 text-muted-foreground">
                    Quien planifica, al elegir qué entra.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Cronograma</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Fases, hitos y fechas comprometidas del proyecto completo.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Semanas o meses</td>
                  <td className="py-2 text-muted-foreground">
                    Quien coordina, al negociar plazos.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              No compiten: el cronograma dice que la fase dos cierra el 30, el backlog ordena
              todo lo que hay que hacer para llegar, y el plan de trabajo decide qué pedazo
              concreto de ese backlog se ejecuta esta semana. Cuando alguien te pide «el plan»,
              pregunta a qué nivel se refiere: casi siempre quieren el semanal.
            </p>
          </>
        ),
      },
      {
        heading: "Los tres errores que matan un plan semanal",
        body: (
          <>
            <p>
              El plan de trabajo fracasa siempre por las mismas tres vías, y las tres se
              corrigen en el diseño del plan, no en la disciplina del equipo:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>El plan de 40 tareas.</strong> Si cabe todo, no compromete nada. Un
                plan semanal sano tiene 1 objetivo, entre 2 y 4 entregas y de 10 a 15 tareas
                con dueño para un equipo pequeño. El resto es backlog, y está bien que lo sea.
              </li>
              <li>
                <strong>Planificar sin capacidad.</strong> Un plan que ignora ausencias,
                reuniones y soporte no es optimista: es mentiroso. La capacidad real se
                calcula antes de comprometer, no después de fallar.
              </li>
              <li>
                <strong>El plan que nadie vuelve a mirar.</strong> Si el plan no se consulta a
                mitad de semana ni se revisa el viernes, fue teatro: un documento para «sentirse
                organizados». El valor no está en escribirlo, está en usarlo para decidir cuando
                algo se sale del guion —y algo siempre se sale—.
              </li>
            </ul>
            <p>
              Si quieres que el plan, el tablero y la revisión del viernes vivan en el mismo
              lugar —una herramienta local-first, con tus datos en tu propia carpeta en JSON,
              sin cuenta ni nube—{" "}
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
              — planifica la semana con dueños y capacidad real, sin depender de la nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un plan de trabajo?",
        answer:
          "Es el operativo de una semana: el documento corto que fija qué se entrega, qué tareas lo hacen posible, quién tiene cada una, con qué capacidad real se cuenta y qué riesgos pueden frenar la semana. Se publica el lunes, se consulta cada día y se revisa el viernes; no es el plan de proyecto formal ni el backlog completo.",
      },
      {
        question: "¿Cómo hacer un plan de trabajo paso a paso?",
        answer:
          "En cuatro pasos: revisa el tablero para partir de lo que quedó pendiente, compromete el objetivo y las tareas que caben en la capacidad real, publica el plan donde todo el equipo lo vea y revísalo el viernes para medir qué entró y qué no. La rutina completa toma menos de 40 minutos a la semana.",
      },
      {
        question: "¿Qué debe incluir un plan de trabajo?",
        answer:
          "Seis bloques: objetivo de la semana, entregas comprometidas con fecha, tareas con un dueño cada una, capacidad real disponible (descontando reuniones y ausencias), riesgos y bloqueos con su plan B, y una revisión de cierre el viernes. Si el plan crece a 40 tareas o a detalle por horas, dejó de ser útil.",
      },
      {
        question: "¿Cuál es la diferencia entre plan de trabajo y plan de proyecto?",
        answer:
          "El horizonte y el propósito: el plan de proyecto es el documento formal de todo el ciclo —alcance, fases, presupuesto y fechas— y se escribe una vez con actualizaciones puntuales, mientras que el plan de trabajo es el operativo de una semana y se reescribe cada lunes. Uno define el camino completo; el otro decide los pasos de esta semana.",
      },
      {
        question: "¿Cuánto dura un plan de trabajo?",
        answer:
          "La duración estándar es una semana, porque es el plazo donde las personas aún pueden sostener compromisos realistas. Hay equipos que lo estiran a dos semanas o lo acortan a un día en periodos de crisis; lo importante no es el largo sino el ritual completo: publicar al empezar y revisar al cerrar.",
      },
    ],
  },
};
