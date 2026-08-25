import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "wbs-estructura-desglose-trabajo",
  title: "WBS: estructura de desglose de trabajo, con ejemplo",
  excerpt:
    "El WBS parte el proyecto en entregables, no en tareas sueltas. Cómo armarlo en una tarde, hasta qué nivel bajar, y un ejemplo completo.",
  category: "plantillas",
  categoryLabel: "Plantillas",
  publishedAt: "2027-05-31",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "plantillas-gestion-proyectos",
  related: [
    "plantillas-gestion-proyectos",
    "plantilla-plan-de-proyecto",
    "alcance-de-proyecto-scope-creep",
  ],
  seo: {
    title: "WBS: estructura de desglose de trabajo con ejemplo | Hito",
    description:
      "WBS (estructura de desglose de trabajo): cómo armarlo en una tarde, hasta qué nivel bajar, y un ejemplo completo de 3 niveles.",
    ogImageAlt: "WBS: estructura de desglose de trabajo con ejemplo de 3 niveles.",
  },
  content: {
    eyebrow: "Plantillas",
    intro: (
      <>
        <strong>En una línea:</strong> un <strong>WBS</strong> (Work Breakdown Structure, o{" "}
        <strong>estructura de desglose de trabajo</strong>, EDT) parte el proyecto en
        entregables, no en tareas sueltas: responde <em>qué</em> se entrega, no <em>cuándo</em>.
        Se arma en una tarde si paras en el nivel en que un dueño estima el paquete en días, no
        en meses.
      </>
    ),
    sections: [
      {
        heading: "Qué es un WBS (y por qué no es una lista de tareas)",
        body: (
          <>
            <p>
              El WBS —estructura de desglose de trabajo, a veces EDT— es un árbol de entregables.
              El nivel 1 es el proyecto. El nivel 2 son los bloques grandes que, juntos,{" "}
              <em>son</em> el proyecto. El nivel 3 son paquetes que una persona puede estimar y
              terminar. Cada caja es un resultado, no una actividad: “UI de las 5 páginas”, no
              “diseñar”.
            </p>
            <p>
              Una lista de tareas mezcla “escribir copy”, “reunión con el cliente” y “homepage”
              en el mismo nivel, y nadie sabe si el proyecto está 40% o 80% hecho. Un WBS te
              deja decir: de cinco entregables de nivel 2, tres están cerrados y dos no. También
              es la forma más honesta de escribir el{" "}
              <Link
                to="/blogs/alcance-de-proyecto-scope-creep"
                className="underline underline-offset-2"
              >
                alcance del proyecto
              </Link>
              : si un pedido no aparece como rama, no está en el proyecto.
            </p>
          </>
        ),
      },
      {
        heading: "Tres reglas que evitan un WBS inútil",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Orientado a entregables.</strong> Cada nodo se puede mostrar o aceptar.
                Si el nombre es un verbo (“investigar”, “coordinar”), reescríbelo como resultado.
              </li>
              <li>
                <strong>Regla del 100%.</strong> Los hijos de un nodo suman todo el trabajo de
                ese nodo, y nada más. Si “Diseño” no incluye los wireframes, está incompleto. Si
                incluye “reuniones semanales”, mezcla gestión con entregable.
              </li>
              <li>
                <strong>Parar cuando un dueño estima en días.</strong> Un paquete de “un
                trimestre” es un subproyecto. Uno de “40 minutos” es una tarea. El corte
                práctico: una persona, en días — no en meses, no en horas.
              </li>
            </ol>
            <p>
              La regla del 100% es la que más se viola. Equipos dejan afuera el contenido porque
              “eso lo hace marketing”, o el QA porque “se hace sobre la marcha”. Si el proyecto
              no existe sin eso, va en el árbol.
            </p>
          </>
        ),
      },
      {
        heading: "WBS vs lista de tareas vs cronograma",
        body: (
          <>
            <p>Tres artefactos se confunden porque todos “parten el trabajo”:</p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Artefacto</th>
                  <th className="py-2 pr-4 font-semibold">Pregunta</th>
                  <th className="py-2 font-semibold">Unidad</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">WBS / EDT</td>
                  <td className="py-2 pr-4 text-muted-foreground">¿Qué se entrega?</td>
                  <td className="py-2 text-muted-foreground">Entregables y paquetes</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Lista de tareas</td>
                  <td className="py-2 pr-4 text-muted-foreground">¿Qué hay que hacer?</td>
                  <td className="py-2 text-muted-foreground">Actividades, a menudo sin árbol</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Cronograma / Gantt</td>
                  <td className="py-2 pr-4 text-muted-foreground">¿Cuándo, y en qué orden?</td>
                  <td className="py-2 text-muted-foreground">Fechas, dependencias y holgura</td>
                </tr>
              </tbody>
            </table>
            <p>
              El WBS es el <em>qué</em>. El{" "}
              <Link
                to="/blogs/plantilla-cronograma-proyecto"
                className="underline underline-offset-2"
              >
                cronograma de proyecto
              </Link>{" "}
              es el <em>cuándo</em>. Si empiezas por el Gantt, fechas trabajo que todavía no
              nombraste. La{" "}
              <Link to="/blogs/ruta-critica-proyecto" className="underline underline-offset-2">
                ruta crítica
              </Link>{" "}
              se calcula sobre el cronograma, no sobre el WBS — pero sin WBS no hay
              dependencias honestas.
            </p>
          </>
        ),
      },
      {
        heading: "Hasta qué nivel bajar",
        body: (
          <>
            <p>
              Tres niveles alcanzan para un proyecto de semanas o pocos meses. Más de cuatro
              suele ser microgestión:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Nivel</th>
                  <th className="py-2 pr-4 font-semibold">Qué es</th>
                  <th className="py-2 font-semibold">Señal de que está bien</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">1</td>
                  <td className="py-2 pr-4 text-muted-foreground">El proyecto completo</td>
                  <td className="py-2 text-muted-foreground">
                    Un nombre que un sponsor reconocería
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">2</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Entregables grandes (5–8)
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Juntos son el 100%; ninguno es una tarea
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">3</td>
                  <td className="py-2 pr-4 text-muted-foreground">Paquetes de trabajo</td>
                  <td className="py-2 text-muted-foreground">
                    Un dueño estima cada uno en días, no en meses
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              No bajes “porque el software tiene sub-tareas”: bajas porque un humano no puede
              estimar el nodo tal como está.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo: rediseño de un sitio web, 3 niveles",
        body: (
          <>
            <p>
              Un sitio de empresa pequeña, 5 páginas, sin e-commerce. El WBS no incluye
              “standups” ni “elegir herramienta”. Incluye lo que el cliente puede aceptar:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>1.0 Rediseño del sitio</strong>
              </li>
              <li>
                <strong>1.1 Investigación</strong> — auditoría del sitio, entrevistas a 5
                usuarios, brief de contenido
              </li>
              <li>
                <strong>1.2 Diseño</strong> — arquitectura de información, wireframes de 5
                páginas, UI de páginas clave
              </li>
              <li>
                <strong>1.3 Contenido</strong> — textos de las 5 páginas, imágenes y assets
              </li>
              <li>
                <strong>1.4 Desarrollo</strong> — front de las 5 páginas, formularios y
                analytics, QA en 3 navegadores
              </li>
              <li>
                <strong>1.5 Lanzamiento</strong> — migración de dominio, checklist de go-live,
                comunicación interna
              </li>
            </ul>
            <p>
              “Contenido” es hermano de “diseño”, no una subtarea: si el copy no tiene dueño,
              el diseño se rehace cuando el texto llega tarde. Eso es lo que el WBS hace
              visible antes de{" "}
              <Link to="/blogs/como-estimar-tiempos-proyecto" className="underline underline-offset-2">
                estimar tiempos
              </Link>
              . Un lanzamiento de producto usa la misma forma con otras ramas. El árbol
              cambia; las tres reglas no.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo armarlo en una tarde",
        body: (
          <>
            <p>No necesitas software de WBS. Una hoja o un documento con indentación alcanzan:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                Escribe el entregable final como 1.0. Si no puedes nombrarlo, todavía no hay
                alcance.
              </li>
              <li>
                Lista 5–8 entregables de nivel 2 que, juntos, sean el 100%. Lo que falte,
                súbelo; lo que sobre, sácalo.
              </li>
              <li>
                Parte cada nivel 2 en paquetes de nivel 3, con un dueño. Si dos personas lo
                “comparten”, pártelo.
              </li>
              <li>
                Revisa la regla del 100% de abajo hacia arriba. Recién entonces pasa al
                cronograma.
              </li>
            </ol>
            <p>
              Dos horas suelen alcanzar si está quien puede validar exclusiones. El WBS que se
              arma sin esa persona se reescribe a la semana.
            </p>
          </>
        ),
      },
      {
        heading: "Errores comunes",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>WBS de tareas.</strong> “Llamar al hosting”, “revisar con legal”.
                Reescríbelos como resultados, o sácalos: son actividades que cuelgan de un
                paquete.
              </li>
              <li>
                <strong>Demasiado profundo o demasiado plano.</strong> Cinco niveles para seis
                semanas es microgestión; un solo nivel con 40 ítems es una lista, no un WBS.
              </li>
              <li>
                <strong>Armarlo y no usarlo.</strong> El WBS alimenta el{" "}
                <Link to="/blogs/plantilla-plan-de-proyecto" className="underline underline-offset-2">
                  plan de proyecto
                </Link>{" "}
                y el cronograma. Si vive en un slide del kickoff, era un ejercicio.
              </li>
            </ul>
            <p>
              Cuando entra un cambio de alcance, el primer movimiento es decidir en qué rama
              entra. El WBS es una de las{" "}
              <Link
                to="/blogs/plantillas-gestion-proyectos"
                className="underline underline-offset-2"
              >
                8 plantillas de gestión de proyectos
              </Link>{" "}
              que sí se usan: nombra el trabajo antes de fecharlo.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo armar un WBS en una tarde",
      steps: [
        {
          name: "Nombrar el entregable final como nivel 1",
          text: "Una frase que el sponsor reconocería. Si no puedes nombrarlo, todavía no hay alcance.",
        },
        {
          name: "Partir en 5–8 entregables de nivel 2",
          text: "Juntos son el 100% del proyecto y nada más. Cada uno es un resultado, no una actividad.",
        },
        {
          name: "Bajar un nivel hasta paquetes estimables",
          text: "Nivel 3: un dueño por paquete, estimable en días y no en meses.",
        },
        {
          name: "Aplicar la regla del 100% de abajo hacia arriba",
          text: "Los hijos cubren al padre; no hay trabajo huérfano ni reuniones disfrazadas de entregable.",
        },
        {
          name: "Recién entonces pasar al cronograma",
          text: "El WBS es el qué; las fechas y la ruta crítica vienen después, sobre estos paquetes.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es un WBS o estructura de desglose de trabajo?",
        answer:
          "Un WBS (Work Breakdown Structure, o EDT) es un árbol de entregables que parte el proyecto en resultados, no en tareas sueltas. El nivel 1 es el proyecto; los niveles siguientes son bloques y paquetes que, juntos, cubren el 100% del trabajo.",
      },
      {
        question: "¿Hasta qué nivel hay que desglosar el WBS?",
        answer:
          "Hasta que un dueño pueda estimar cada paquete en días, no en meses. Para un proyecto de semanas o pocos meses, tres niveles suelen alcanzar; más de cuatro casi siempre es microgestión.",
      },
      {
        question: "¿El WBS y el cronograma son lo mismo?",
        answer:
          "No. El WBS responde qué se entrega; el cronograma (o Gantt) responde cuándo y en qué orden. Fechar antes de nombrar los entregables produce barras que nadie puede estimar.",
      },
      {
        question: "¿Qué significa la regla del 100%?",
        answer:
          "Que los hijos de un nodo suman todo el trabajo de ese nodo y nada más. Si falta el contenido o el QA porque “lo hace otra área”, el WBS está incompleto; si incluye las reuniones semanales, está mezclando gestión con entregable.",
      },
      {
        question: "¿Sirve un WBS en un proyecto ágil?",
        answer:
          "Sí, en el nivel de entregables. El WBS no te obliga a cascada: nombra lo que se va a poder aceptar. Las historias viven debajo de los paquetes, no en lugar del árbol.",
      },
    ],
  },
};
