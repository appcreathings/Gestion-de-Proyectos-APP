import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
  slug: "como-priorizar-tareas",
  title: "Cómo priorizar tareas: 4 métodos con ejemplos",
  excerpt:
    "4 métodos para priorizar tareas —Eisenhower, MoSCoW, RICE e Ivy Lee— con ejemplos y cómo aplicarlos hoy, en cualquier herramienta.",
  category: "productividad",
  categoryLabel: "Productividad",
  publishedAt: "2026-09-14",
  readingTime: "10 min",
  featured: false,
  seo: {
    title: "Cómo priorizar tareas: 4 métodos con ejemplos | Hito",
    description:
      "4 métodos para priorizar tareas —Eisenhower, MoSCoW, RICE e Ivy Lee— con ejemplos y cómo aplicarlos hoy, en cualquier herramienta.",
    ogImageAlt: "Cómo priorizar tareas con 4 métodos: Eisenhower, MoSCoW, RICE e Ivy Lee.",
  },
  content: {
    eyebrow: "Productividad",
    intro: (
      <>
        <strong>En una línea:</strong> no existe un método universal para priorizar. La{" "}
        <strong>Matriz de Eisenhower</strong> separa lo urgente de lo importante para el día a
        día, <strong>MoSCoW</strong> clasifica requisitos cuando el alcance de un proyecto está
        fijo, <strong>RICE Score</strong> puntúa iniciativas quitando la subjetividad, y el{" "}
        <strong>método Ivy Lee</strong> fuerza un orden estricto de las tareas más importantes
        del día. Esta guía explica los cuatro, con ejemplos, y cuándo conviene cada uno.
      </>
    ),
    sections: [
      {
        heading: 'El problema: "todo es urgente" no es una prioridad',
        body: (
          <>
            <p>
              Cuando alguien dice que todo en su lista es urgente, en realidad está diciendo que
              no tiene un criterio para decidir. Sin un método, la priorización termina
              dependiendo de quién gritó más fuerte último, o de qué tarea es más fácil de
              tachar rápido — no de qué mueve realmente la aguja.
            </p>
            <p>
              Los cuatro métodos de este post resuelven ese problema desde ángulos distintos:
              dos están pensados para el día a día individual (Eisenhower, Ivy Lee) y dos para
              decisiones de equipo o producto (MoSCoW, RICE). Elegir el método correcto según tu
              situación es la mitad del trabajo.
            </p>
          </>
        ),
      },
      {
        heading: "Método 1: Matriz de Eisenhower",
        body: (
          <>
            <p>
              Atribuida al expresidente estadounidense Dwight D. Eisenhower (popularizada
              después por Stephen Covey en <em>Los 7 hábitos de la gente altamente efectiva</em>
              ), este método separa las tareas en cuatro cuadrantes según dos ejes:{" "}
              <strong>urgencia</strong> e <strong>importancia</strong>.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold"></th>
                  <th className="py-2 pr-4 font-semibold">Urgente</th>
                  <th className="py-2 font-semibold">No urgente</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Importante</td>
                  <td className="py-2 pr-4">Hacer ahora</td>
                  <td className="py-2 pr-4">Planificar cuándo hacerlo</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">No importante</td>
                  <td className="py-2 pr-4">Delegar</td>
                  <td className="py-2">Eliminar</td>
                </tr>
              </tbody>
            </table>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Urgente + importante:</strong> una crisis de cliente, un bug en
                producción. Se hace de inmediato.
              </li>
              <li>
                <strong>Importante, no urgente:</strong> planificación estratégica, aprender una
                habilidad nueva. Se agenda, no se improvisa.
              </li>
              <li>
                <strong>Urgente, no importante:</strong> la mayoría de las interrupciones y
                reuniones de "solo 5 minutos". Se delega si es posible.
              </li>
              <li>
                <strong>Ni urgente ni importante:</strong> distracciones. Se elimina de la
                lista.
              </li>
            </ul>
            <p>
              <strong>Cuándo usarlo:</strong> para el día a día individual, cuando necesitas
              decidir rápido si algo merece tu atención ahora mismo o puede esperar. Es el
              método más simple de los cuatro y el más fácil de enseñarle a un equipo completo.
            </p>
          </>
        ),
      },
      {
        heading: "Método 2: MoSCoW",
        body: (
          <>
            <p>
              MoSCoW es un acrónimo de{" "}
              <strong>Must have, Should have, Could have, Won't have</strong> (this time). Nació
              en el contexto de desarrollo de software con alcance fijo y tiempo limitado, y hoy
              se usa en cualquier proyecto donde hay que decidir qué entra en una entrega y qué
              no.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Must have:</strong> sin esto, el proyecto falla o no tiene sentido
                entregarlo.
              </li>
              <li>
                <strong>Should have:</strong> importante, pero el proyecto sobrevive sin ello en
                esta iteración.
              </li>
              <li>
                <strong>Could have:</strong> deseable, se hace si sobra tiempo.
              </li>
              <li>
                <strong>Won't have (por ahora):</strong> explícitamente fuera de esta entrega —
                no es un "no" definitivo, es un "no ahora".
              </li>
            </ul>
            <p>
              <strong>Cuándo usarlo:</strong> cuando estás definiendo el alcance de un proyecto
              o sprint y necesitas que todo el equipo (y el cliente) esté de acuerdo en qué es
              innegociable y qué es negociable. Es especialmente útil para evitar el "scope
              creep" — que todo se vuelva "must have" a último momento.
            </p>
          </>
        ),
      },
      {
        heading: "Método 3: RICE Score",
        body: (
          <>
            <p>
              RICE es un método cuantitativo, popularizado por el equipo de producto de
              Intercom, que le pone un número a cada iniciativa para reducir la subjetividad al
              priorizar un backlog. Se calcula así:
            </p>
            <p>
              <strong>RICE = (Reach × Impact × Confidence) / Effort</strong>
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Reach (alcance):</strong> a cuántas personas o casos afecta en un
                período (ej. usuarios por trimestre).
              </li>
              <li>
                <strong>Impact (impacto):</strong> cuánto mueve el objetivo, en una escala
                simple (ej. 3 = alto, 2 = medio, 1 = bajo, 0,5 = mínimo).
              </li>
              <li>
                <strong>Confidence (confianza):</strong> qué tan seguro estás de tus
                estimaciones de Reach e Impact, como porcentaje (100%, 80%, 50%).
              </li>
              <li>
                <strong>Effort (esfuerzo):</strong> cuánto trabajo requiere, en persona-mes o
                cualquier unidad consistente.
              </li>
            </ul>
            <p>
              Cuanto más alto el número resultante, más arriba va en el backlog. La ventaja de
              RICE es que obliga a poner números donde antes había solo intuición — y a discutir
              los números, no las opiniones.
            </p>
            <p>
              <strong>Cuándo usarlo:</strong> cuando tienes un backlog de iniciativas de
              producto o proyectos candidatos y necesitas un criterio defendible para explicar
              por qué algo va antes que otra cosa, especialmente frente a stakeholders.
            </p>
          </>
        ),
      },
      {
        heading: "Método 4: Método Ivy Lee",
        body: (
          <>
            <p>
              Este es el más antiguo de los cuatro — data de 1918, cuando el consultor Ivy Lee
              se lo propuso al presidente de Bethlehem Steel. La regla es deliberadamente
              simple:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                Al final del día, escribe las 6 tareas más importantes que tienes que hacer
                mañana.
              </li>
              <li>Ordénalas por importancia real, de la 1 a la 6.</li>
              <li>
                Al día siguiente, trabaja solo en la tarea 1 hasta terminarla antes de pasar a
                la 2.
              </li>
              <li>Lo que quede sin terminar pasa a la lista del día siguiente.</li>
            </ol>
            <p>
              No hay cuadrantes ni fórmulas — la disciplina está en el límite de 6 tareas y en
              no saltar de una a otra sin terminar la anterior.
            </p>
            <p>
              <strong>Cuándo usarlo:</strong> cuando el problema no es decidir qué es importante
              (ya lo sabes) sino ejecutar sin dispersarte. Es el método más efectivo para el día
              a día individual cuando la lista de tareas es interminable y la tentación de
              saltar entre ellas es alta.
            </p>
          </>
        ),
      },
      {
        heading: "¿Qué método usar según tu situación?",
        body: (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left">
                <th className="py-2 pr-4 font-semibold">Tu situación</th>
                <th className="py-2 font-semibold">Método recomendado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">
                  Necesitas decidir rápido si algo merece tu atención ahora
                </td>
                <td className="py-2 font-semibold">Matriz de Eisenhower</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">
                  Estás definiendo el alcance de un proyecto o sprint con el equipo
                </td>
                <td className="py-2 font-semibold">MoSCoW</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">
                  Tienes un backlog de iniciativas y necesitas un criterio numérico defendible
                </td>
                <td className="py-2 font-semibold">RICE Score</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">
                  Sabes qué es importante pero te dispersas al ejecutar
                </td>
                <td className="py-2 font-semibold">Método Ivy Lee</td>
              </tr>
            </tbody>
          </table>
        ),
      },
      {
        heading: "Cómo aplicar estos métodos en Hito",
        body: (
          <>
            <p>
              Ninguno de estos cuatro métodos requiere una herramienta específica — funcionan
              igual en papel, en una hoja de cálculo o en cualquier gestor de proyectos. Si ya
              tienes{" "}
              <a
                href="https://hito.autos/blogs/plantillas-sop-descargables"
                target="_blank"
                rel="noopener noreferrer"
              >
                procesos documentados con plantillas de SOP
              </a>
              , priorizar es el paso siguiente: primero decides qué proceso aplicar, después en
              qué orden. Esto es lo que aporta Hito en concreto, con honestidad sobre lo que
              hace la app y lo que decides tú:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Campo de prioridad nativo:</strong> cada tarea y cada proyecto en Hito
                tiene un campo de prioridad con cuatro valores (Baja, Media, Alta, Crítica). Es
                el lugar natural para reflejar el resultado de tu clasificación de Eisenhower o
                de MoSCoW una vez que ya decidiste — no calcula la prioridad por ti, la
                registra.
              </li>
              <li>
                <strong>Tags para clasificaciones propias:</strong> si usas MoSCoW, puedes usar
                tags como <code>must</code>, <code>should</code>, <code>could</code> en lugar de
                (o además de) el campo de prioridad, para no perder la categoría exacta del
                método.
              </li>
              <li>
                <strong>Orden manual en el kanban:</strong> las tarjetas se reordenan
                arrastrando (drag-and-drop), como en el{" "}
                <a
                  href="https://hito.autos/blogs/hito-vs-trello"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  kanban que comparamos con el de Trello
                </a>
                . Esto es exactamente lo que necesitas para aplicar Ivy Lee: ordenar tus 6
                tareas del día de la 1 a la 6 dentro de una columna.
              </li>
              <li>
                <strong>Lo que Hito no hace:</strong> no hay un campo o vista que calcule un
                RICE Score automáticamente, ni una vista nativa de matriz 2×2 de Eisenhower. Si
                usas RICE, probablemente quieras calcular el número aparte (en la descripción de
                la tarea o en una hoja de cálculo) y luego reflejar el resultado con el campo de
                prioridad o el orden de las tarjetas.
              </li>
            </ul>
            <p>
              En otras palabras: el método lo eliges y lo calculas tú; Hito te da los campos
              (prioridad, tags, orden de tarjetas) para que ese criterio quede reflejado y
              visible para todo el equipo, sin depender de memoria ni de una hoja de cálculo
              aparte.
            </p>
          </>
        ),
      },
      {
        heading: "Conclusión",
        body: (
          <>
            <p>
              Priorizar bien no es encontrar la app correcta — es elegir el criterio correcto
              para tu situación. Usa la Matriz de Eisenhower para decisiones del día a día,
              MoSCoW cuando definas el alcance de un proyecto con tu equipo, RICE cuando
              necesites un número defendible para un backlog, e Ivy Lee cuando el problema sea
              ejecutar sin dispersarte.
            </p>
            <p>
              Elige el método que mejor encaje con lo que tienes enfrente esta semana y aplícalo
              en tu próximo proyecto. Si buscas dónde reflejar esas prioridades sin depender de
              una hoja de cálculo aparte, Hito tiene el campo de prioridad, tags y un kanban
              ordenable listos para usar —{" "}
              <a
                href="https://hito.autos/blogs/local-first-guia-definitiva-2026"
                target="_blank"
                rel="noopener noreferrer"
              >
                gratis y con tus datos en tu propio equipo
              </a>
              .
            </p>
            <p>
              👉{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                <strong>Prueba Hito gratis</strong>
              </a>{" "}
              — gestor de proyectos, procesos y checklists 100% local-first, open source (MIT).
              Sin cuenta, sin nube, sin suscripción.
            </p>
          </>
        ),
      },
    ],
  },
};
