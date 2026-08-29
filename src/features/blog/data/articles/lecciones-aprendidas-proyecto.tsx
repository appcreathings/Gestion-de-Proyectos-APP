import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "lecciones-aprendidas-proyecto",
  title: "Lecciones aprendidas de un proyecto: formato y ejemplo",
  excerpt:
    "La mayoría de las lecciones aprendidas mueren en un documento que nadie abre. Formato de 4 columnas, reunión de 45 minutos y el truco para que el siguiente proyecto las use.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-07-26",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "kpis-gestion-proyectos",
  related: ["kpis-gestion-proyectos", "cierre-de-proyecto-checklist", "retrospectivas-formatos"],
  seo: {
    title: "Lecciones aprendidas de un proyecto | Hito",
    description:
      "Cómo documentar lecciones aprendidas de un proyecto: reunión de 45 minutos, formato de 4 columnas con ejemplos y cómo hacer que el siguiente proyecto las lea.",
    ogImageAlt: "Formato de lecciones aprendidas de un proyecto en tabla de 4 columnas.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> las <strong>lecciones aprendidas de un proyecto</strong>{" "}
        no son un documento, son decisiones escritas para el siguiente proyecto. Si el formato no
        fuerza un “qué haremos distinto” con dueño y fecha, terminan en un PDF que describe el
        pasado y nadie vuelve a abrir.
      </>
    ),
    sections: [
      {
        heading: "Por qué la mayoría de las lecciones aprendidas mueren",
        body: (
          <>
            <p>
              El ritual típico: el proyecto termina, alguien agenda una reunión de lecciones
              aprendidas, el equipo enumera “qué salió bien y qué salió mal”, un asistente lo
              escribe en un documento… y ahí queda. El siguiente proyecto arranca sin abrirlo,
              repite los mismos errores y genera el mismo documento. El problema no es la
              reunión: es que el output no tiene forma de decisión.
            </p>
            <p>
              Tres fallas repetidas: se documentan <em>observaciones</em> (“hubo poca
              comunicación”) en vez de <em>acciones</em> (“el estatus saldrá por escrito los
              lunes, dueño: PM”); no tienen dueño (y lo de nadie es de nadie); y viven en un
              archivo al que el siguiente proyecto nunca llega porque no está en su camino
              natural de trabajo.
            </p>
            <p>
              Las lecciones que sí se usan tienen otra anatomía: pocas (5 a 10, no 40), cada una
              con una acción concreta para el futuro, y un lugar obligatorio donde el próximo
              proyecto las encontrará: el kickoff.
            </p>
          </>
        ),
      },
      {
        heading: "El formato de 4 columnas que sí se usa",
        body: (
          <>
            <p>
              Una lección aprendida útil cabe en una fila con cuatro columnas. Si no puedes
              llenar la cuarta, la lección todavía no está madura:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Columna</th>
                  <th className="py-2 font-semibold">Qué contiene</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Hecho (no opinión)</td>
                  <td className="py-2 text-muted-foreground">
                    Qué pasó, con datos: “el QA empezó en la semana 6, después de dev”
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Efecto</td>
                  <td className="py-2 text-muted-foreground">
                    Cuánto costó: días, dinero, retrabajo. Sin número, la lección no compite con
                    lo urgente
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Qué haremos distinto</td>
                  <td className="py-2 text-muted-foreground">
                    La acción, redactada en futuro, aplicable al próximo proyecto
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Dueño y dónde vive</td>
                  <td className="py-2 text-muted-foreground">
                    Quién la ejecuta (rol) y en qué plantilla o proceso se instala
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Ejemplo completo, bien redactado:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Hecho:</strong> las aprobaciones del cliente tardaron en promedio 9 días;
                el plan suponía 2.
              </li>
              <li>
                <strong>Efecto:</strong> 5 semanas de atraso en la ruta crítica y 2 iteraciones
                muertas.
              </li>
              <li>
                <strong>Qué haremos distinto:</strong> el cronograma incluirá un plazo de
                aprobación contractual (5 días hábiles) y el silencio pasados esos días aprueba
                por defecto.
              </li>
              <li>
                <strong>Dueño y dónde vive:</strong> el PM, en la plantilla de plan de proyecto y
                en el contrato tipo.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Cuándo hacer la sesión (no siempre al final)",
        body: (
          <>
            <p>
              El cierre es el momento canónico —en muchos equipos es un punto fijo del{" "}
              <Link
                to="/blogs/cierre-de-proyecto-checklist"
                className="underline underline-offset-2"
              >
                checklist de cierre de proyecto
              </Link>
              — pero tiene un defecto: a seis meses de distancia, el equipo recuerda el último
              mes y borra el resto. Para proyectos largos funcionan mejor dos sesiones cortas: una
              intermedia (a mitad o al cerrar una fase grande) y la final, más breve porque la
              intermedia ya dejó la mitad escrita.
            </p>
            <p>
              También hay un momento no negociable: después de un incidente serio (semanas de
              retrabajo, un cliente que casi se va). Ahí la sesión no espera al cierre: se hace
              en los 5 días siguientes, mientras los detalles están frescos.
            </p>
            <p>
              Para equipos que trabajan por sprints, la lección aprendida no reemplaza la
              retrospectiva: la retrospectiva ajusta el proceso del próximo sprint (y sus{" "}
              <Link
                to="/blogs/retrospectivas-formatos"
                className="underline underline-offset-2"
              >
                formatos
              </Link>{" "}
              son ideales para eso); las lecciones aprendidas destilan, al cierre, lo que el
              próximo <em>proyecto</em> entero debe hacer distinto.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo correr la sesión en 45 minutos",
        body: (
          <>
            <p>
              Con el formato de 4 columnas, la sesión no necesita dinámicas: necesita tiempo
              acotado y un moderador que no sea quien dirigió el proyecto (para que las críticas
              fluyan). El objetivo declarado no es “analizar qué pasó” sino salir con 5-10 filas
              llenas.
            </p>
          </>
        ),
      },
      {
        heading: "El truco: las lecciones viven en el kickoff",
        body: (
          <>
            <p>
              Ningún documento de lecciones se lee por voluntad propia. La única forma confiable
              de que el siguiente proyecto las use es hacerlas parte de su arranque: la agenda
              del{" "}
              <Link to="/blogs/kickoff-de-proyecto" className="underline underline-offset-2">
                kickoff de proyecto
              </Link>{" "}
              incluye 10 minutos de “lecciones del último proyecto similar”, con las 3 filas más
              relevantes leídas en voz alta y convertidas en ajustes del plan frente al cliente.
            </p>
            <p>
              Así la lección cambia de estatus: deja de ser historia y pasa a ser restricción del
              nuevo plan (el plazo de aprobación, el buffer de QA, el canal único con el cliente).
              Y el ciclo se cierra: cuando este proyecto termine, sus propias lecciones entrarán
              al mismo carril.
            </p>
            <p>
              Para mantener la vista de conjunto —si el proyecto está aprendiendo de verdad o solo
              acumulando documentos— conviene revisar estas filas junto al resto de los{" "}
              <Link
                to="/blogs/kpis-gestion-proyectos"
                className="underline underline-offset-2"
              >
                KPIs del proyecto
              </Link>{" "}
              en el cierre: las lecciones con efecto medido son las que valen.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo hacer una sesión de lecciones aprendidas",
      steps: [
        {
          name: "Agenda 45 minutos con datos pre-cargados",
          text: "Antes de la sesión, el PM prepara la línea de tiempo, el presupuesto original vs. real y los hitos incumplidos. Sin datos la sesión se vuelve opiniones.",
        },
        {
          name: "Recorre hechos, no culpas",
          text: "El moderador lista los hechos relevantes (atrasos, retrabajos, aciertos). Regla explícita: se describen eventos y efectos, no personas.",
        },
        {
          name: "Llena la tabla de 4 columnas",
          text: "Para cada hecho importante: efecto en días o dinero, qué haremos distinto, dueño y dónde se instala la acción. Máximo 10 filas.",
        },
        {
          name: "Prioriza las 3 lecciones con mayor efecto",
          text: "Elige las tres filas que más costo explicarían si se repitieran. Esas viajarán al kickoff del siguiente proyecto.",
        },
        {
          name: "Instala las acciones en plantillas y procesos",
          text: "Cada acción se agrega a la plantilla correspondiente (plan, contrato, checklist). Una lección que no cambia una plantilla o un proceso no existe.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué son las lecciones aprendidas de un proyecto?",
        answer:
          "Son las conclusiones documentadas de un proyecto, expresadas como decisiones para el futuro: qué pasó (con datos), cuánto costó, qué se hará distinto y quién es responsable de instalar ese cambio. No son un relato del proyecto sino insumos del siguiente.",
      },
      {
        question: "¿Cómo se redacta una lección aprendida?",
        answer:
          "En cuatro campos: el hecho con datos (“las aprobaciones tardaron 9 días contra 2 planificados”), el efecto medible (“5 semanas de atraso”), la acción futura (“plazo de aprobación contractual de 5 días con aprobación por silencio”) y el dueño con el lugar donde vive la acción (plantilla, contrato o proceso).",
      },
      {
        question: "¿Cuándo se hace la reunión de lecciones aprendidas?",
        answer:
          "Como mínimo en el cierre del proyecto. En proyectos largos conviene una sesión intermedia a mitad o al cerrar una fase, porque la memoria del equipo se acorta. Después de un incidente grave, la sesión corre en los 5 días siguientes sin esperar al cierre.",
      },
      {
        question: "¿Cuál es la diferencia entre retrospectiva y lecciones aprendidas?",
        answer:
          "La retrospectiva es de equipo y de corto ciclo: ajusta el proceso para el próximo sprint o semana. Las lecciones aprendidas son de proyecto: destilan al cierre lo que el próximo proyecto completo debe hacer distinto, y sus acciones se instalan en plantillas y contratos, no solo en hábitos del equipo.",
      },
      {
        question: "¿Cómo hacer que las lecciones aprendidas realmente se usen?",
        answer:
          "Tres condiciones: pocas filas (5-10) con efecto medido, cada una con dueño y acción concreta, y un punto obligatorio donde el siguiente proyecto las encuentre: 10 minutos de lecciones en el kickoff, convertidas en ajustes del plan. Un documento que nadie abre en el arranque no es una lección, es un archivo.",
      },
    ],
  },
};
