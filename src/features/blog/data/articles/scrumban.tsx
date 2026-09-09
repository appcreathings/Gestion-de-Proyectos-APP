import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "scrumban",
  title: "Scrumban: mezclar Scrum y Kanban sin crear un Frankenstein",
  excerpt:
    "Scrumban explicado: qué toma de Scrum (sprints con objetivo, retrospectivas, backlog) y qué de Kanban (límites WIP, flujo pull, lead time), cómo migrar en 5 pasos y los errores del híbrido.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-04",
  readingTime: "10 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  related: ["scrum-vs-kanban", "kanban-limites-wip", "tablero-kanban"],
  seo: {
    title: "Scrumban: mezclar Scrum y Kanban sin Frankenstein | Hito",
    description:
      "Scrumban: qué es, qué toma de Scrum y qué de Kanban, cómo migrar paso a paso y los errores del híbrido. Para equipos que necesitan estructura y flujo.",
    ogImageAlt: "Tablero scrumban: sprints de Scrum con límites WIP de Kanban.",
  },
  content: {
    eyebrow: "Metodologías",
    intro: (
      <>
        <strong>En una línea:</strong> scrumban es el híbrido que toma de Scrum la estructura
        (sprints con objetivo, retrospectivas, backlog ordenado) y de Kanban el flujo (límites
        de trabajo en curso, sistema pull, métricas de ciclo). No es una moda: es la respuesta
        para equipos que necesitan cadencia y, a la vez, atienden soporte que no espera.
      </>
    ),
    sections: [
      {
        heading: "Qué es scrumban (y de dónde salió)",
        body: (
          <>
            <p>
              Scrumban nació de una frustración muy concreta: equipos que intentaban trabajar
              con Scrum y descubrían que media semana se les iba en interrupciones. Soporte,
              incidencias, mantenimiento, urgencias de clientes: trabajo legítimo que no cabe
              en la caja del sprint. El término lo popularizó Corey Ladas a finales de los
              2000 con una idea sencilla: aplicar el pensamiento lean de Kanban sobre la
              estructura que Scrum ya había instalado.
            </p>
            <p>
              La tensión que resuelve es fácil de enunciar. Scrum te da cadencia: un ritmo
              compartido, un objetivo cada pocas semanas, un momento fijo para revisar el
              proceso. Kanban te da flujo: el trabajo entra cuando hay capacidad, no cuando
              arranca una iteración, y lo que importa no es cuánto prometiste sino cuánto
              termina. La mayoría de los equipos de 2 a 15 personas no vive en un mundo puro:
              maneja proyectos con fechas y, al mismo tiempo, una cola de soporte que no
              negocia. Para ese mundo existe scrumban.
            </p>
            <p>
              Si tu duda previa es elegir entre los dos métodos puros, la comparación directa
              está en{" "}
              <Link to="/blogs/scrum-vs-kanban" className="underline underline-offset-2">
                Scrum vs Kanban: cuál usar y cuándo
              </Link>
              . Aquí asumimos que ya sabes que necesitas un poco de ambos, y vamos a la
              receta.
            </p>
          </>
        ),
      },
      {
        heading: "Qué toma de cada uno: la receta del híbrido",
        body: (
          <>
            <p>
              Scrumban no es un promedio difuso: es una combinación concreta de piezas que ya
              funcionan por separado. De Scrum conserva la estructura social —el ritmo y los
              momentos de ajuste—; de Kanban importa las reglas de flujo. Así queda la receta:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Elemento</th>
                  <th className="py-2 pr-4 font-semibold">Viene de</th>
                  <th className="py-2 font-semibold">Cómo se ve en scrumban</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Iteración con objetivo</td>
                  <td className="py-2 pr-4 text-muted-foreground">Scrum</td>
                  <td className="py-2 text-muted-foreground">
                    Sprints de 1–2 semanas con un objetivo que ordena prioridades, sin
                    compromiso de alcance cerrado a la fuerza.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Backlog único priorizado</td>
                  <td className="py-2 pr-4 text-muted-foreground">Scrum</td>
                  <td className="py-2 text-muted-foreground">
                    Una sola cola ordenada por valor y riesgo; lo urgente sube sin ceremonia.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Retrospectiva</td>
                  <td className="py-2 pr-4 text-muted-foreground">Scrum</td>
                  <td className="py-2 text-muted-foreground">
                    Cada iteración, enfocada en ajustar políticas y límites, no en culpar.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Límite WIP por columna</td>
                  <td className="py-2 pr-4 text-muted-foreground">Kanban</td>
                  <td className="py-2 text-muted-foreground">
                    Máximo de tarjetas en «En curso» por etapa: el inventario en proceso deja
                    de crecer.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Flujo pull</td>
                  <td className="py-2 pr-4 text-muted-foreground">Kanban</td>
                  <td className="py-2 text-muted-foreground">
                    Nadie toma trabajo nuevo hasta liberar espacio; la capacidad manda sobre el
                    empuje.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Métricas de flujo</td>
                  <td className="py-2 pr-4 text-muted-foreground">Kanban</td>
                  <td className="py-2 text-muted-foreground">
                    Lead time y cumplimiento: cuánto tarda el trabajo y cuánto prometido se
                    entrega.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Roles mínimos</td>
                  <td className="py-2 pr-4 text-muted-foreground">Híbrido</td>
                  <td className="py-2 text-muted-foreground">
                    Sin roles fijos de Scrum: las políticas escritas del tablero hacen de
                    árbitro.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El corazón del sistema es el tablero: columnas visibles, dueño por tarjeta y
              límites a la vista. Si el tuyo aún no existe, ármalo primero con la guía de{" "}
              <Link to="/blogs/tablero-kanban" className="underline underline-offset-2">
                cómo hacer un tablero kanban
              </Link>{" "}
              y después suma el resto.
            </p>
          </>
        ),
      },
      {
        heading: "Scrumban vs Scrum vs Kanban: la tabla comparativa",
        body: (
          <>
            <p>
              Para ver qué aporta el híbrido conviene poner los tres métodos lado a lado.
              Ninguno es «mejor»: cada uno optimiza algo distinto.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Criterio</th>
                  <th className="py-2 pr-4 font-semibold">Scrum</th>
                  <th className="py-2 pr-4 font-semibold">Kanban</th>
                  <th className="py-2 font-semibold">Scrumban</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Cadencia</td>
                  <td className="py-2 pr-4 text-muted-foreground">Sprints fijos</td>
                  <td className="py-2 pr-4 text-muted-foreground">Continua</td>
                  <td className="py-2 text-muted-foreground">
                    Iteración de ritmo con flujo continuo dentro
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Planificación</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Compromiso de alcance por sprint
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Justo a tiempo, por pull</td>
                  <td className="py-2 text-muted-foreground">
                    Objetivo de sprint + reposición por capacidad
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Urgencias a mitad de camino
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Esperan al próximo sprint
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Entran en cuanto hay espacio
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Entran solo si el WIP lo permite; el resto, encoladas
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Estimación</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Obligatoria (puntos, horas)
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Opcional</td>
                  <td className="py-2 text-muted-foreground">
                    Opcional: el lead time histórico reemplaza gran parte
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Roles</td>
                  <td className="py-2 pr-4 text-muted-foreground">Definidos (PO, SM)</td>
                  <td className="py-2 pr-4 text-muted-foreground">Opcionales</td>
                  <td className="py-2 text-muted-foreground">
                    Mínimos, con políticas escritas
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Métrica reina</td>
                  <td className="py-2 pr-4 text-muted-foreground">Velocidad</td>
                  <td className="py-2 pr-4 text-muted-foreground">Lead time</td>
                  <td className="py-2 text-muted-foreground">
                    Lead time + cumplimiento del objetivo
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Encaja mejor en</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Producto con equipo dedicado y alcance estable
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Soporte, operaciones, mantenimiento
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Equipos mixtos de proyectos + interrupciones
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Fíjate en el patrón: scrumban no inventa nada nuevo, combina. Su propuesta es
              que puedes conservar el ritmo y el aprendizaje de Scrum sin renunciar a la
              honestidad de flujo de Kanban.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo migrar de Scrum a scrumban en 5 pasos",
        body: (
          <>
            <p>
              Antes de los pasos, la duda literal que trae a mucha gente hasta aquí: sí, es
              compatible mezclar kanban y scrum; la prueba es que la mezcla tiene nombre
              propio. La migración desde Scrum puro cabe en uno o dos sprints y no necesita
              permiso de nadie externo al equipo:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Mantén el objetivo de sprint y la retrospectiva.</strong> La cadencia
                es lo mejor que Scrum le da a tu equipo: no la sueltes. Lo que cambia es el
                compromiso de alcance: el sprint tiene un objetivo que ordena prioridades, no
                una lista congelada de tarjetas.
              </li>
              <li>
                <strong>Suelta la estimación rígida.</strong> Deja de negociar puntos y usa el
                lead time histórico por tipo de trabajo. Es un número que se corrige solo y
                evita el teatro de la planificación.
              </li>
              <li>
                <strong>Impón límites WIP por columna.</strong> Empieza con «En curso» igual a
                la mitad de las personas del equipo y ajústalo con datos. Sin WIP no hay
                scrumban: hay Scrum con columnas decorativas.
              </li>
              <li>
                <strong>Explicita las políticas de cada columna.</strong> Qué debe tener una
                tarjeta para entrar, quién puede tomarla y qué la saca. Las políticas escritas
                son las que permiten meter una urgencia sin discutir cada vez de nuevo.
              </li>
              <li>
                <strong>Mide lead time y cumplimiento.</strong> Cuánto tarda cada tipo de
                trabajo y qué porcentaje del objetivo se cumplió. Con esas dos series, la
                retrospectiva deja de ser impresiones y pasa a ser ingeniería de proceso.
              </li>
            </ol>
            <p>
              El paso 3 es el que más cuesta y el que más rendimiento da: cómo poner el
              límite, qué hacer cuando «no cabe» y cómo negociarlo con el cliente están
              desarrollados en{" "}
              <Link to="/blogs/kanban-limites-wip" className="underline underline-offset-2">
                límites WIP en kanban
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Los errores que convierten el híbrido en Frankenstein",
        body: (
          <>
            <p>
              Un híbrido mal ejecutado es peor que cualquiera de los dos métodos puros: hereda
              los costos de ambos y los beneficios de ninguno. Estos son los dos Frankenstein
              más comunes:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Ceremonias sin WIP.</strong> El equipo conserva sprints, dailies y
                retrospectivas, pero «En curso» crece sin techo. Resultado: sprint infinito,
                diez tareas al 60 % y ceremonias convertidas en teatro de reporte. Si te
                suena, aclara primero qué te conviene de cada método en{" "}
                <Link to="/blogs/scrum-vs-kanban" className="underline underline-offset-2">
                  Scrum vs Kanban
                </Link>
                .
              </li>
              <li>
                <strong>WIP sin retrospectiva.</strong> El caso espejo: límites bien puestos
                que se pudren porque nadie los revisa. El WIP se sube «temporalmente» un
                martes y sigue ahí tres meses; las políticas se vuelven folclore. El límite es
                una hipótesis que la retrospectiva valida o corrige: uno sin la otra no
                funciona.
              </li>
            </ul>
            <p>
              Hay un tercer error más silencioso: mezclar vocabularios sin decidir quién
              manda. Si el orden de la cola se negocia cada mañana, no hay método: hay humor.
              La prioridad la pone el objetivo del sprint y el orden del backlog; las
              urgencias se cuelan solo por la puerta del WIP, nunca por la del favor.
            </p>
          </>
        ),
      },
      {
        heading: "Para quién es scrumban (y para quién no)",
        body: (
          <>
            <p>
              Scrumban brilla en equipos de 2 a 15 personas que viven con un pie en cada
              mundo: agencias con varios clientes, áreas internas que mantienen sistemas
              mientras construyen los nuevos, equipos de producto con SLA de soporte. También
              es la puerta de entrada más honesta para equipos que probaron Scrum y no les
              funcionó: no tienen que tirar lo aprendido, solo soltar la parte que no
              encajaba.
            </p>
            <p>
              No lo necesitas si tu contexto es puro: un equipo de producto dedicado, con
              alcance estable y stakeholders alineados, sigue mejor con Scrum completo; un
              flujo de tickets puro opera mejor con Kanban sin cadencia. El híbrido es para
              la mezcla, no para evitar decidir.
            </p>
            <p>
              Y si quieres un tablero con límites WIP de fábrica —columnas con máximo, dueño
              por tarjeta, checklists y procesos, sin cuenta ni asientos, con todo en un JSON
              local de tu carpeta—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              está pensado justamente para equipos de 1 a 15 personas.
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
              — sprints con objetivo y WIP visible, local-first, sin nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es scrumban?",
        answer:
          "Es un método de gestión que combina la estructura de Scrum (iteraciones con objetivo, retrospectiva, backlog priorizado) con las reglas de flujo de Kanban (límites de trabajo en curso, sistema pull y métricas de ciclo). La idea es conservar la cadencia y el aprendizaje periódico de Scrum sin fingir que el equipo no recibe interrupciones, y conservar el flujo continuo de Kanban sin perder el ritmo compartido.",
      },
      {
        question: "¿Se puede mezclar Kanban y Scrum?",
        answer:
          "Sí, y la mezcla tiene nombre: scrumban. Es compatible porque los dos métodos operan en capas distintas: Scrum organiza el tiempo (cuándo se planifica, cuándo se revisa, cuándo se ajusta el proceso) y Kanban organiza el flujo (cuánto trabajo puede estar en curso y cuándo se toma trabajo nuevo). Solo se vuelve un problema cuando se mezclan piezas sin reglas: ceremonias sin límites WIP, o WIP sin momentos de ajuste.",
      },
      {
        question: "¿Cuál es la diferencia entre Scrum, Kanban y scrumban?",
        answer:
          "Scrum organiza el trabajo en sprints con roles y ceremonias fijas y un alcance comprometido por iteración; Kanban gestiona un flujo continuo, sin cadencia obligatoria, con límites de trabajo en curso; scrumban combina ambos: conserva iteraciones y retrospectivas de Scrum y añade WIP explícito, flujo pull y métricas de ciclo de Kanban. En corto: Scrum prioriza el compromiso, Kanban el flujo, scrumban el equilibrio entre los dos.",
      },
      {
        question: "¿Cómo pasar de Scrum a scrumban?",
        answer:
          "En cinco pasos: mantén el objetivo de sprint y la retrospectiva, suelta la estimación obligatoria, impón límites de trabajo en curso por columna, escribe las políticas de cada columna (qué se puede tomar y qué la saca) y empieza a medir lead time y cumplimiento. La migración cabe en uno o dos sprints y no requiere permisos externos: es un cambio de reglas internas del tablero.",
      },
      {
        question: "¿Scrumban sirve para equipos pequeños?",
        answer:
          "Sí, y encaja especialmente bien en equipos de 2 a 15 personas que combinan proyectos con soporte o mantenimiento. En equipos pequeños la estructura ligera importa más: scrumban exige menos roles que Scrum y más disciplina visible que Kanban puro, que es justo lo que un equipo chico puede sostener. Con una o dos personas, el mismo modelo funciona simplificado: una cola ordenada y un límite de trabajo en curso.",
      },
    ],
  },
};
