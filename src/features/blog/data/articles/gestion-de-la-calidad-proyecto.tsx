import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "gestion-de-la-calidad-proyecto",
  title: "Gestión de la calidad en proyectos: criterios, checklists y una pizca de QA",
  excerpt:
    "Gestión de la calidad en proyectos: qué es (cumplir los criterios acordados, no perfección), cómo definir criterios de aceptación, qué inspección usar en cada caso y los errores clásicos.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-11",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "matriz-de-riesgos",
  related: [
    "matriz-de-riesgos",
    "definition-of-done",
    "lecciones-aprendidas-proyecto",
    "cierre-de-proyecto-checklist",
  ],
  seo: {
    title: "Gestión de la calidad en proyectos: guía práctica | Hito",
    description:
      "Gestión de la calidad en proyectos: criterios de aceptación verificables, métodos de inspección (revisión, checklist, demo, QA) y los errores que la arruinan.",
    ogImageAlt: "Ciclo de gestión de calidad: criterios, inspección temprana y defectos.",
  },
  content: {
    eyebrow: "Riesgo y calidad",
    intro: (
      <>
        <strong>En una línea:</strong> la gestión de la calidad en un proyecto es el sistema que
        garantiza que lo entregado cumple los criterios acordados — definidos antes, inspeccionados
        durante — porque la calidad que se prueba al final no es gestión: es apuesta.
      </>
    ),
    sections: [
      {
        heading: "Qué es calidad en un proyecto (y qué no es)",
        body: (
          <>
            <p>
              Calidad en un proyecto no es «quedar bonito» ni «el mejor trabajo posible»: es{" "}
              <strong>cumplir los criterios que el proyecto acordó</strong> — ni más abajo, ni
              (ojo) mucho más arriba. La definición operativa importa porque desplaza la
              conversación de lo subjetivo («¿te gusta?») a lo verificable («¿pasa estos cinco
              criterios?»). Un entregable de calidad es uno cuya aceptación no depende del ánimo
              de quien lo recibe.
            </p>
            <p>
              Y hay una segunda definición que suele faltar: la calidad tiene dos caras. La{" "}
              <strong>calidad del producto</strong> — el entregable funciona, cumple
              especificaciones — y la <strong>calidad del proceso</strong> — el trabajo se hizo
              de forma repetible, sin héroes ni suerte. La primera se ve; la segunda la produce.
              Un proyecto puede entregar algo bueno por esfuerzo heroico y seguir teniendo un
              problema de calidad de proceso: lo bueno salió, pero nadie sabe repetirlo. La
              documentación que convierte el milagro en método es la que describimos en{" "}
              <Link
                to="/blogs/como-documentar-procesos-equipos"
                className="underline underline-offset-2"
              >
                cómo documentar procesos con SOPs
              </Link>
              .
            </p>
            <p>
              Por qué le importa a un proyecto (y no solo a la fábrica): los defectos que se
              descubren tarde cuestan múltiplos. Un error de entendimiento que aparece en la
              demo del mes 3 obliga a rehacer trabajo ya pagado por el cliente; el mismo error,
              detectado en la semana 1 con una revisión de 20 minutos, costaba una conversación.
              La gestión de calidad no es el lujo de los proyectos grandes: es el seguro más
              barato disponible en los chicos.
            </p>
          </>
        ),
      },
      {
        heading: "El corazón: criterios de aceptación definidos antes",
        body: (
          <>
            <p>
              Todo el edificio de la calidad se sostiene en una práctica:{" "}
              <strong>escribir los criterios de aceptación de cada entregable antes de
              producirlo</strong>. Un criterio de aceptación es una afirmación verificable sobre
              el entregable — «la web carga en menos de 2 segundos en 4G», «el manual cubre los
              8 casos de uso del documento de requerimientos», «el logo viene en SVG, PNG y con
              versión monocromática».
            </p>
            <p>
              Lo que distingue un criterio bueno de uno malo es lo mismo que distingue un hito
              real de un mojón decorativo (la lógica de{" "}
              <Link to="/blogs/hito-vs-entregable" className="underline underline-offset-2">
                hito vs entregable
              </Link>
              ): la verificabilidad. «Que sea moderno y profesional» no es un criterio — es una
              sensación que nadie puede satisfacer con certeza. «Sigue la guía de marca v2 y
              pasa la prueba con 5 usuarios del público objetivo» sí lo es: o pasa o no pasa.
            </p>
            <p>
              Tres reglas para escribirlos bien:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Pocos y relevantes:</strong> 3–7 criterios por entregable. Una lista de
                30 requisitos es una lista de 30 excusas para discutir al final.
              </li>
              <li>
                <strong>Acordados con quien acepta:</strong> un criterio que el cliente no vio
                no es un criterio — es tu interpretación. El lugar natural para acordarlos es el
                kickoff o la definición de cada entregable.
              </li>
              <li>
                <strong>Vinculados al nivel:</strong> los criterios de una landing de $2.000 no
                son los de una plataforma de $200.000. La calidad tiene presupuesto — definir
                criterios es definir cuánta calidad se compra, que es exactamente la decisión
                que el{" "}
                <Link
                  to="/blogs/presupuesto-de-proyecto"
                  className="underline underline-offset-2"
                >
                  presupuesto
                </Link>{" "}
                debería explicitar.
              </li>
            </ul>
            <p>
              En el día a día del equipo, los criterios de aceptación se convierten en la{" "}
              <Link to="/blogs/definition-of-done" className="underline underline-offset-2">
                definition of done
              </Link>
              : el checklist que una tarea necesita tildarse para estar lista — no «terminé»
              sino «terminé y verifiqué contra lo acordado».
            </p>
          </>
        ),
      },
      {
        heading: "Inspección sin frenar: qué revisar y cuándo",
        body: (
          <>
            <p>
              El segundo componente es la inspección: verificar contra los criterios en
              momentos elegidos, no al final. Cada método tiene su lugar:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Método</th>
                  <th className="py-2 pr-4 font-semibold">Qué detecta</th>
                  <th className="py-2 pr-4 font-semibold">Cuándo aplicarlo</th>
                  <th className="py-2 font-semibold">Costo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Revisión por pares</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Errores técnicos, decisiones discutibles, puntos ciegos.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    En piezas clave, antes de que salgan del equipo.
                  </td>
                  <td className="py-2 text-muted-foreground">Bajo: una hora de otra persona.</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Checklist de salida</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Omisiones: lo obvio que se olvida bajo presión.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Antes de marcar cualquier tarea como hecha.
                  </td>
                  <td className="py-2 text-muted-foreground">Mínimo: minutos.</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Demo / avance visible</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Desalineamientos de expectativa — el error más caro.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cada 1–2 semanas o al cierre de cada fase.
                  </td>
                  <td className="py-2 text-muted-foreground">Medio: preparación corta.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">QA final / prueba integral</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Defectos de integración: piezas que andan solas y no juntas.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Al cierre, como última verificación — no como primera.
                  </td>
                  <td className="py-2 text-muted-foreground">Alto: días en proyectos serios.</td>
                </tr>
              </tbody>
            </table>
            <p>
              El patrón correcto se lee en la última columna: <strong>empujar la detección
              hacia lo temprano y lo barato</strong>. Un proyecto que descubre sus problemas en
              la columna derecha no tiene QA — tiene un sistema que fabrica sorpresas caras.
              La revisión por pares y el checklist de salida cuestan poco y absorben la mayoría
              de los defectos; la demo quincenal absorbe el desalineamiento; el QA final queda
              para lo que se le escapó a todo lo anterior.
            </p>
          </>
        ),
      },
      {
        heading: "El ciclo de calidad en 5 pasos",
        body: (
          <>
            <p>
              Uniendo criterios e inspección, el ciclo mínimo para un proyecto con clientes:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Definir criterios por entregable</strong> (3–7, verificables) en la
                planificación — no cuando el entregable ya está en vuelo.
              </li>
              <li>
                <strong>Acordarlos con quien acepta</strong> — el cliente o el área receptora
                — y dejarlos por escrito junto al entregable al que pertenecen.
              </li>
              <li>
                <strong>Inspeccionar temprano y en serie:</strong> checklist de salida en cada
                tarea, revisión de pares en las piezas críticas, demo visible cada 1–2 semanas.
              </li>
              <li>
                <strong>Registrar los defectos que aparecen</strong> — no para culpar, sino
                para clasificar: ¿error de criterio poco claro, de proceso, de ejecución? La
                lista de defectos recurrentes es el mapa de dónde está roto el sistema.
              </li>
              <li>
                <strong>Cerrar el ciclo en el final del proyecto:</strong> los defectos y sus
                causas se convierten en{" "}
                <Link
                  to="/blogs/lecciones-aprendidas-proyecto"
                  className="underline underline-offset-2"
                >
                  lecciones aprendidas
                </Link>
                , y las que se repiten se convierten en criterios por defecto y checklists del
                próximo proyecto. Ese es el punto exacto donde la calidad del proceso mejora de
                verdad.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Los 3 errores que arruinan la calidad",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>La calidad al final.</strong> «Primero terminamos y después probamos
                todo» produce el efecto peor de los dos mundos: defectos caros de corregir y
                correcciones que introducen defectos nuevos, a contrarreloj y con el cliente
                esperando. La inspección es un seguro de cuotas: barata si se paga temprano.
              </li>
              <li>
                <strong>Los criterios implícitos.</strong> «Se supone que sabías que quería
                responsive» — el supositorio de la calidad. Todo criterio que no está escrito
                y acordado vive en la cabeza de alguien y estalla en la revisión final. El
                costo de escribirlo es minutos; el de no hacerlo, semanas de re-trabajo.
              </li>
              <li>
                <strong>Cero defectos como objetivo.</strong> La calidad sin techo consume el
                presupuesto del proyecto: la última pulida absorbe las horas que el alcance
                siguiente necesitaba. Los criterios acordados son también el permiso para
                decir «esto está listo» — y avanzar. La perfección que el cliente no pagó es
                un sobrecosto silencioso, prima lejana del{" "}
                <Link to="/blogs/sobrecosto-de-proyecto" className="underline underline-offset-2">
                  sobrecosto clásico
                </Link>
                .
              </li>
            </ul>
            <p>
              Y una nota final sobre el tono: en equipos pequeños, la calidad se cuida con
              cultura más que con departamentos. Si revisar el trabajo del otro se vive como
              desconfianza, el sistema se evade; si se vive como «aquí nadie manda su trabajo a
              ciegas», se sostiene solo. Esa diferencia la marca el líder con su ejemplo —
              aceptando revisiones de su propio trabajo primero.
            </p>
            <p>
              Si quieres que los criterios de aceptación vivan como checklists junto a cada
              tarea e hito — en un archivo local de tu carpeta, sin cuenta ni nube—{" "}
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
              — criterios y checklists junto al trabajo, local-first.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es la gestión de la calidad en un proyecto?",
        answer:
          "Es el sistema que garantiza que los entregables cumplen los criterios acordados: definir criterios de aceptación antes de producir, inspeccionar durante el trabajo (revisiones, checklists, demos) y cerrar el ciclo documentando los defectos para que no se repitan. No es perfección: es cumplir lo acordado, verificado.",
      },
      {
        question: "¿Cuál es la diferencia entre calidad y control de calidad?",
        answer:
          "La gestión de la calidad es el sistema completo: definir criterios, diseñar procesos que los produzcan y prevenir defectos. El control de calidad es una parte: la inspección del resultado para verificar que cumple. Controlar sin gestionar es detectar defectos tarde; gestionar incluye que no nazcan.",
      },
      {
        question: "¿Cómo se mide la calidad de un proyecto?",
        answer:
          "Con los criterios de aceptación acordados: cuántos se cumplen y qué defectos aparecieron (cuántos, de qué tipo, en qué fase se detectaron). Métricas útiles de bolsillo: defectos encontrados por el cliente (ideal: pocos), retrabajos por entregable y criterios cumplidos a la primera.",
      },
      {
        question: "¿Qué es un criterio de aceptación?",
        answer:
          "Es una afirmación verificable sobre un entregable, acordada con quien lo recibe antes de producirlo: «la web carga en menos de 2 segundos en 4G», «el manual cubre los 8 casos de uso pactados». Convierte la aprobación de una sensación subjetiva en una verificación objetiva — o pasa o no pasa.",
      },
      {
        question: "¿Cuándo se hace el control de calidad (QA)?",
        answer:
          "En serie y temprano: checklist de salida en cada tarea, revisión por pares en piezas críticas y demo visible cada 1–2 semanas. La prueba integral final existe como última verificación de integración, no como primer filtro: la calidad que solo se prueba al final no se gestiona, se apuesta.",
      },
    ],
  },
};
