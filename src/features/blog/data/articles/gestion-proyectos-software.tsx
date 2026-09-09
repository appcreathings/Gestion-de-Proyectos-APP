import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "gestion-proyectos-software",
  title: "Gestión de proyectos de software: la guía sin humo",
  excerpt:
    "Gestión de proyectos de software: qué la hace distinta, el proceso mínimo que funciona en equipos de 2 a 15 personas y las métricas de flujo que sí predicen entrega.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-06",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "scrumban",
  related: ["scrumban", "software-gestion-proyectos", "alternativa-a-jira"],
  seo: {
    title: "Gestión de proyectos de software: guía sin humo | Hito",
    description:
      "Gestión de proyectos de software: qué la hace distinta, el proceso mínimo (backlog, sprints, releases, QA) y las métricas que sí importan. Sin clonar Jira.",
    ogImageAlt: "Ciclo de gestión de proyectos de software: backlog, sprint, release, QA.",
  },
  content: {
    eyebrow: "Por industria",
    intro: (
      <>
        <strong>En una línea:</strong> gestionar proyectos de software es planificar trabajo
        invisible que cambia de forma mientras lo construyes —por eso el proceso mínimo es backlog,
        sprints cortos, releases y QA, y las métricas que importan miden flujo (lead time,
        throughput), no horas ni story points por persona.
      </>
    ),
    sections: [
      {
        heading: "Qué hace distinto al software: intangible, cambiante y con deuda",
        body: (
          <>
            <p>
              La gestión de proyectos de software no es la gestión de proyectos «de siempre» con
              otra jerga. Tres propiedades del software rompen los métodos clásicos y explican casi
              todos los desastres de estimación que has vivido:
            </p>
            <p>
              <strong>El avance es invisible.</strong> En una obra ves el segundo piso; en
              software, un 80 % puede significar que falta la parte difícil. Los porcentajes de
              avance en software son opiniones con formato de número, y por eso el progreso se mide
              en software funcionando, no en tareas cerradas ni en horas quemadas.
            </p>
            <p>
              <strong>El alcance cambia mientras se construye.</strong> Al ver el producto, el
              cliente entiende mejor lo que quiere y pide cambios; es parte del proceso, no una
              traición. Un método que trata cada cambio como una excepción burocrática termina
              ignorado. La gestión aquí consiste en canalizar el cambio con reglas —control de
              cambios y re-priorización del backlog—, no en prohibirlo.
            </p>
            <p>
              <strong>Existe la deuda técnica.</strong> Ninguna otra industria entrega el proyecto
              «un poco torcido» para cumplir la fecha y sigue cargando el defecto años después. En
              software sí, y esa deuda invisible frena cada entrega futura. Un plan que no reserva
              tiempo para pagarla se ralentiza mes a mes sin motivo aparente. Si gestionas varios
              frentes técnicos a la vez, la organización por dominios que proponemos en{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software y gestión de proyectos
              </Link>{" "}
              complementa lo que ves aquí.
            </p>
          </>
        ),
      },
      {
        heading: "El ciclo mínimo: backlog, sprint, release, QA y retro",
        body: (
          <>
            <p>
              Para equipos de 2 a 15 personas, el proceso que funciona es deliberadamente corto.
              Cinco etapas, cada una con una cadencia y un resultado observable:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Etapa</th>
                  <th className="py-2 pr-4 font-semibold">Qué pasa</th>
                  <th className="py-2 pr-4 font-semibold">Cadencia</th>
                  <th className="py-2 font-semibold">Resultado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Backlog</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Capturar, priorizar y estimar grueso lo que hay que construir.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Continua</td>
                  <td className="py-2 text-muted-foreground">Una cola ordenada por prioridad.</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Sprint</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Construir en trozos cortos con un objetivo único.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">1–2 semanas</td>
                  <td className="py-2 text-muted-foreground">Un incremento demostrable.</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">QA</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Probar cada cambio antes de integrarlo a la rama principal.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Por cambio</td>
                  <td className="py-2 text-muted-foreground">Menos bugs llegan a producción.</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Release</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Publicar a usuarios reales lo acumulado.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Cada 1–4 semanas</td>
                  <td className="py-2 text-muted-foreground">Valor entregado y medible.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Retro</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Ajustar el propio proceso con lo aprendido.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Por sprint</td>
                  <td className="py-2 text-muted-foreground">Una mejora aplicada, no cinco.</td>
                </tr>
              </tbody>
            </table>
            <p>
              Dos reglas que sostienen el ciclo: nada entra al sprint sin prioridad del backlog, y
              nada sale del sprint sin QA. Si el equipo trabaja con flujo continuo en lugar de
              sprints cerrados —habitual en soporte y producto maduro—, la variante kanban con
              límites de trabajo en curso cumple la misma función; el modelo híbrido está
              desarrollado en{" "}
              <Link to="/blogs/scrumban" className="underline underline-offset-2">
                ScrumBan
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Roles sin inflar el equipo: no necesitas un PM dedicado",
        body: (
          <>
            <p>
              En un equipo de dos a quince personas, crear un puesto de project manager dedicado
              suele añadir un nodo de reportes, no capacidad de entrega. Lo que el proceso necesita
              son tres funciones, y las tres pueden convivir en personas que además construyen:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Quien prioriza.</strong> Decide el orden del backlog y responde dudas de
                alcance en horas, no en semanas. Es la función de product owner y suele ser el
                fundador, el lead técnico o el cliente interno.
              </li>
              <li>
                <strong>Quien facilita.</strong> Sostiene el ritmo: el tablero al día, los
                bloqueos visibles, la retro en fecha. Es un rol rotativo y de medio tiempo, no un
                cargo.
              </li>
              <li>
                <strong>Quien asegura calidad.</strong> QA puede ser compartido, pero tiene que
                existir explícitamente: cada cambio se prueba antes de integrarse, sin excepciones
                «porque era chico».
              </li>
            </ul>
            <p>
              El síntoma de que faltan funciones no es el desorden visible; es la pregunta que
              nadie responde rápido: qué se construye primero y por qué. Si esa respuesta tarda más
              de un día, el problema es de priorización, no de personal. Un project manager formal
              se justifica cuando coordinas varios equipos o clientes simultáneos con
              interdependencias —y en ese caso su trabajo es gestionar el portafolio, no pasar
              lista de tareas—.
            </p>
          </>
        ),
      },
      {
        heading: "Las métricas que sí importan en proyectos de software",
        body: (
          <>
            <p>
              Las métricas que predicen si un proyecto de software llegará son de flujo, porque
              miden el trabajo terminado y no la actividad:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Lead time.</strong> Días desde que una tarea se compromete hasta que está
                en producción. Es la métrica de las promesas: con ella puedes decir «esto llega en
                dos semanas» con datos en la mano.
              </li>
              <li>
                <strong>Throughput.</strong> Tareas terminadas por semana. Te permite proyectar
                fechas con el historial real del equipo en lugar de con su optimismo.
              </li>
              <li>
                <strong>Bugs en producción.</strong> Los defectos que escaparon del QA. Si crecen
                release tras release, el problema no es de testing sino de alcance y prisa.
              </li>
              <li>
                <strong>Trabajo en curso.</strong> Cuántas cosas hay abiertas a la vez. Es la
                causa subyacente de casi todo: lead time largo y bugs suelen ser síntomas de WIP
                desbordado.
              </li>
            </ul>
            <p>
              Lo que no medir: story points por persona, horas registradas contra estimadas y
              ocupación al 100 %. Comparar puntos entre personas corrompe las estimaciones en un
              sprint, las horas quemadas no dicen nada del valor producido y un equipo ocupado no
              es un equipo que entrega. Estas métricas de flujo, además, son las que alimentan
              cualquier dashboard serio del proyecto sin que nadie tenga que rellenarlas a mano.
            </p>
          </>
        ),
      },
      {
        heading: "Herramientas: no necesitas un clon de Jira",
        body: (
          <>
            <p>
              El error clásico de un equipo que crece es copiar el stack de una empresa de mil
              personas: flujos de trabajo de doce estados, campos obligatorios, ceremonias en
              cascada. El costo no es la licencia sino la fricción: cuando actualizar una
              tarjeta toma dos minutos de formularios, el tablero miente porque nadie lo actualiza.
            </p>
            <p>
              Lo que un equipo de 2 a 15 necesita caben en una lista corta: un tablero con límites
              de trabajo en curso, un backlog priorizable, checklists y procesos documentados para
              lo repetible, sincronización con el repositorio —que en software es donde de verdad
              vive el avance— y una vista de estado que no haya que armar a mano. Las opciones con
              menos complejidad que un corporativo están comparadas en{" "}
              <Link to="/blogs/alternativa-a-jira" className="underline underline-offset-2">
                alternativas a Jira
              </Link>
              .
            </p>
            <p>
              Si quieres exactamente eso —kanban con límites WIP, GitHub sync, checklists y
              automatizaciones, datos en JSON local en tu carpeta, sin cuenta ni asientos—{" "}
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
              — gestión de software local-first con GitHub sync, sin nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es la gestión de proyectos de software?",
        answer:
          "Es la disciplina de planificar, priorizar y entregar productos de software: mantener un backlog ordenado, construir en ciclos cortos con QA, publicar releases frecuentes y medir flujo. Se diferencia de otras industrias porque el avance es invisible, el alcance cambia durante la construcción y el código hereda deuda técnica que frena entregas futuras.",
      },
      {
        question: "¿En qué se diferencia de la gestión de proyectos tradicional?",
        answer:
          "La gestión tradicional fija alcance, fecha y costo al inicio y trata los cambios como excepciones; en software el cambio es parte del proceso, el avance se mide en software funcionando y no en porcentajes, y el plan se ajusta cada ciclo con datos de flujo. Aplicar cascada estricta a software suele terminar en entregas tardías de algo que ya no sirve.",
      },
      {
        question: "¿Qué metodología usar en un proyecto de software?",
        answer:
          "Para equipos de 2 a 15 personas, un proceso mínimo: backlog priorizado, sprints de 1 a 2 semanas o kanban con límites WIP si el trabajo es de flujo continuo, QA antes de integrar cada cambio, releases cada 1 a 4 semanas y una retro por ciclo. Scrum, kanban o el híbrido ScrumBan cumplen; la ceremonia importa menos que las tres reglas: prioridad única, WIP limitado y QA sin excepciones.",
      },
      {
        question: "¿Qué métricas importan en proyectos de software?",
        answer:
          "Las de flujo: lead time (días desde compromiso hasta producción), throughput (tareas terminadas por semana), bugs en producción y trabajo en curso simultáneo. Con esas cuatro proyectas fechas con historial real y detectas desviaciones temprano. No sirven las horas contra estimación ni los story points por persona: miden actividad, no entrega.",
      },
      {
        question: "¿Necesito un project manager en mi equipo de software?",
        answer:
          "No como cargo dedicado en equipos de menos de 15 personas; necesitas las funciones, no el puesto: alguien que priorice el backlog y responda dudas de alcance rápido, un facilitador rotativo del tablero y QA explícito. Un PM formal se justifica cuando coordinas varios equipos o clientes con dependencias entre sí.",
      },
    ],
  },
};
