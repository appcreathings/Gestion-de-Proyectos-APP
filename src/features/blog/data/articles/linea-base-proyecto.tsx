import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "linea-base-proyecto",
  title: "Línea base de un proyecto: alcance, cronograma y costo",
  excerpt:
    "La línea base de un proyecto es la versión congelada del plan aprobado: alcance, cronograma y costo. Cómo fijarla sin burocracia, medir desvíos contra ella y cuándo re-baselinear.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-07",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "scrumban",
  related: [
    "scrumban",
    "presupuesto-de-proyecto",
    "plantilla-cronograma-proyecto",
  ],
  seo: {
    title: "Línea base de un proyecto: alcance, cronograma y costo | Hito",
    description:
      "Línea base de un proyecto: qué es, sus 3 componentes (alcance, cronograma, costo), cómo fijarla y usarla para medir desvíos sin burocracia.",
    ogImageAlt:
      "Línea base del proyecto comparada con el avance real en tres ejes.",
  },
  content: {
    eyebrow: "Planificación",
    intro: (
      <>
        <strong>En una línea:</strong> la línea base de un proyecto es la foto congelada de tu
        plan aprobado —alcance, cronograma y costo— contra la que mides cada desvío. Sin ella,
        «vamos bien» es una opinión; con ella, es un dato. Aquí tienes cómo fijarla sin
        burocracia y usarla de verdad.
      </>
    ),
    sections: [
      {
        heading: "Qué es una línea base (y qué no es)",
        body: (
          <>
            <p>
              Una línea base es la versión congelada del plan aprobado: los entregables
              acordados, las fechas comprometidas y el presupuesto autorizado, guardados como
              referencia inmutable. Su única función es responder una pregunta con datos:
              ¿vamos según lo acordado o no? Sin esa foto congelada, «vamos bien» siempre será
              la opinión de quien hable más fuerte en la reunión.
            </p>
            <p>
              Lo que no es: no es el plan de trabajo editable que el equipo actualiza a diario,
              ni el Gantt decorativo que se imprime para el kickoff, ni la carpeta de versiones
              «plan-FINAL-v3-este-sí». La línea base no se toca para reflejar la realidad: la
              realidad se compara contra ella. Esa distinción es la que separa un proyecto
              gobernado de uno que improvisa con hojas de cálculo y buena voluntad.
            </p>
          </>
        ),
      },
      {
        heading: "Los 3 componentes: alcance, cronograma y costo",
        body: (
          <>
            <p>
              La línea base no es una sola: son tres referencias congeladas el mismo día,
              porque un cambio en una casi siempre arrastra a las otras dos:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Componente</th>
                  <th className="py-2 pr-4 font-semibold">Qué congela</th>
                  <th className="py-2 font-semibold">Contra qué se mide</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Línea base de alcance
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Entregables acordados y criterios de aceptación.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Lista cerrada: qué entró y qué no; cada adición es un cambio.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Línea base de cronograma
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Fechas de hitos y entregas con sus dependencias.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Avance planificado contra avance real, hito por hito.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Línea base de costo
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Presupuesto aprobado y su distribución en el tiempo.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Gastado y comprometido contra lo planificado a esa altura.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La de costo merece una mención: no basta con el total aprobado, importa cómo se
              distribuye en el tiempo, porque el desvío solo es visible si sabes cuánto
              deberías haber gastado a la altura del mes 2. Cómo armar esa distribución y
              vigilarla está en{" "}
              <Link
                to="/blogs/presupuesto-de-proyecto"
                className="underline underline-offset-2"
              >
                presupuesto de un proyecto
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Cómo fijarla sin burocracia (4 decisiones)",
        body: (
          <>
            <p>
              Fijar la línea base suena a trámite de oficina de proyectos, pero son cuatro
              decisiones:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Aprueba el plan antes de congelarlo.</strong> La base se fija cuando
                alcance, cronograma y presupuesto tienen acuerdo explícito de quien financia
                el proyecto. Congelar un borrador solo garantiza un re-baseline inmediato.
              </li>
              <li>
                <strong>Guárdala como versión fechada e inmutable.</strong> Una copia que
                nadie edita, con fecha y responsable. Tres documentos, no treinta.
              </li>
              <li>
                <strong>Declara que los cambios solo entran vía control de cambios.</strong>{" "}
                La base se ajusta cuando un cambio se aprueba, nunca para «actualizarla»
                porque el plan se quedó corto. El mecanismo completo está en{" "}
                <Link
                  to="/blogs/control-de-cambios-proyecto"
                  className="underline underline-offset-2"
                >
                  control de cambios en un proyecto
                </Link>
                .
              </li>
              <li>
                <strong>Deja una sola versión vigente y visible.</strong> Todo el equipo debe
                poder ver cuál es la referencia sin preguntar; dos versiones circulando
                equivalen a ninguna.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Cómo medir desvíos contra la base (ejemplo numérico)",
        body: (
          <>
            <p>
              Con la base congelada, el seguimiento es aritmética simple. Ejemplo de
              cronograma: el hito «módulo de facturación terminado» estaba planificado al día
              30 y se cerró al día 36. Desvío: +6 días. Si el proyecto dura 90, hablas de un
              20 % de desvío en ese hito y puedes hacer la única pregunta relevante: ¿se
              recupera en la cadena o se arrastra hasta la entrega final?
            </p>
            <p>
              Ejemplo de costo: a la altura del mes 2, la base decía 100.000 y el proyecto
              lleva comprometidos 112.000. Desvío: +12 %. La pregunta no es «¿por qué gastamos
              más?» sino «¿los 12.000 extra compraron alcance aprobado o alcance filtrado?»:
              la primera respuesta es gestión; la segunda, una fuga que hay que tapar. Para un
              proyecto chico, con esos dos números por semana —días y dinero contra la base—
              tienes el 80 % del control, sin métricas exóticas ni software especializado.
            </p>
            <p>
              El de alcance se mide distinto, y casi todos lo ignoran: no se trata de
              porcentaje completado sino de lista cerrada. Si la base congelaba 12 entregables y
              hoy hay 14 sobre la mesa, el desvío no es de avance, es de frontera: dos
              entregables entraron y nadie los pagó en tiempo ni en dinero. Ese conteo —cuántos
              de los congelados están hechos y cuántos extras se colaron— es la conversación
              más incómoda y más rentable que una línea base te permite tener.
            </p>
          </>
        ),
      },
      {
        heading: "Cuándo re-baselinear (y por qué no cada semana)",
        body: (
          <>
            <p>
              Re-baselinear es reemplazar la base vigente por una nueva versión oficial. Se
              hace pocas veces y con dos motivos legítimos: un cambio mayor aprobado
              formalmente que mueve el plan de punta a punta, o el cierre de una fase que
              cambia la escala de lo que queda. Cada re-baseline se documenta con fecha, motivo
              y la versión anterior archivada: el valor histórico de la base es justamente
              poder explicar el desvío acumulado.
            </p>
            <p>
              Lo que no se hace es re-baselinear cada semana «para que el plan refleje la
              realidad». Una base que se actualiza al ritmo del desvío no mide nada: borra la
              evidencia y convierte cualquier proyecto en puntual. Si la tentación es alta, el
              problema no es la base sino que el plan nunca fue viable, y eso se corrige con
              un re-baseline único, argumentado y comunicado, no con ajustes silenciosos.
            </p>
            <p>
              Una regla práctica para saber si el re-baseline es legítimo: solo procede cuando
              el desvío viene de una decisión, no de una acumulación. «El cliente aprobó mover
              la entrega por su reorganización interna» es un motivo; «nos atrasamos tres
              semanas así que actualizo las fechas» es un borrón. La prueba inversa también
              sirve: si los proyectos de tu portafolio nunca registran desvíos pero siempre
              llegan tarde, lo que está fallando no es el planificar, es el medir contra algo
              estable.
            </p>
          </>
        ),
      },
      {
        heading: "Si no tienes ninguna, empieza hoy con el cronograma",
        body: (
          <>
            <p>
              Si tu proyecto ya corre sin base, no intentes reconstruir las tres componentes
              de golpe: empieza por la más barata. Congela hoy las fechas de los hitos que
              quedan y el presupuesto total restante. Son dos números, caben en media página,
              y desde mañana ya puedes decir «el hito va 4 días tarde» en vez de «va algo
              justo». El alcance congelado puede esperar una semana; la disciplina de
              comparar, no.
            </p>
            <p>
              Dos ayudas inmediatas. Para armar el cronograma que vas a congelar, parte de una
              plantilla con hitos y dependencias: la tienes en{" "}
              <Link
                to="/blogs/plantilla-cronograma-proyecto"
                className="underline underline-offset-2"
              >
                plantilla de cronograma de proyecto
              </Link>
              . Y si trabajas por iteraciones, la línea base viva son los objetivos de sprint:
              cada iteración compromete un alcance pequeño y se mide contra él; ese modelo de
              cadencia y flujo está desarrollado en{" "}
              <Link to="/blogs/scrumban" className="underline underline-offset-2">
                scrumban
              </Link>
              .
            </p>
            <p>
              Y si quieres congelar la base y seguir el avance en la misma herramienta
              —dashboard de portafolio para ver todos tus proyectos, sincronización con GitHub
              y todo en un JSON local de tu carpeta, sin cuenta ni asientos—{" "}
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
              — tu línea base y tu avance, local-first, sin nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es la línea base de un proyecto?",
        answer:
          "Es la versión congelada del plan aprobado: el conjunto de alcance, cronograma y costo contra el que se mide el desempeño real. No es un documento decorativo: es la referencia que convierte la pregunta «¿vamos bien?» en un dato verificable en lugar de una opinión del momento.",
      },
      {
        question: "¿Cuáles son los componentes de la línea base?",
        answer:
          "Tres: la línea base de alcance (los entregables acordados y sus criterios de aceptación), la de cronograma (fechas de hitos y entregas con sus dependencias) y la de costo (el presupuesto aprobado y su distribución en el tiempo). Las tres se congelan juntas en el mismo momento, porque un cambio en una casi siempre arrastra a las otras.",
      },
      {
        question: "¿Cuándo se fija la línea base de un proyecto?",
        answer:
          "Al cerrar la planificación, cuando el alcance está acordado, el cronograma es viable y el presupuesto está aprobado: en ese momento el plan pasa a versión congelada e inmutable. Fijarla antes de ese acuerdo solo garantiza re-baselines inmediatos; fijarla nunca es lo mismo que medir contra ella.",
      },
      {
        question: "¿Qué es un re-baseline y cuándo hacerse?",
        answer:
          "Es reemplazar la línea base vigente por una nueva versión oficial del plan, normalmente porque un cambio mayor fue aprobado por control de cambios o porque una fase terminó y lo que queda cambió de escala. Se hace pocas veces y con motivo documentado; cada re-baseline debe conservar la versión anterior para poder explicar el desvío histórico.",
      },
      {
        question: "¿Cómo se mide el desvío contra la línea base?",
        answer:
          "Comparando el valor real contra el planificado en cada componente: en cronograma, fecha real menos fecha base de cada hito; en costo, lo gastado o comprometido menos lo planeado a esa altura; en alcance, entregables aprobados contra los congelados. Con esos dos números por semana ya tienes el 80 % del control, sin métricas complejas.",
      },
    ],
  },
};
