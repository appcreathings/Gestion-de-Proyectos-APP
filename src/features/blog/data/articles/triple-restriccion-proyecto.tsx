import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "triple-restriccion-proyecto",
  title: "Triple restricción: alcance, tiempo y costo",
  excerpt:
    "Triple restricción del proyecto: alcance, tiempo y costo con la calidad al centro —cómo usar el triángulo de hierro para negociar cambios y decidir qué cede cuando algo se mueve.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-08",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "scrumban",
  related: ["scrumban", "presupuesto-de-proyecto", "alcance-de-proyecto-scope-creep"],
  seo: {
    title: "Triple restricción: alcance, tiempo y costo | Hito",
    description:
      "Triple restricción del proyecto (alcance, tiempo, costo y la calidad al centro): cómo usarla para negociar cambios y decidir qué cede cuando algo se mueve.",
    ogImageAlt: "Triángulo de hierro: alcance, tiempo y costo con calidad al centro.",
  },
  content: {
    eyebrow: "Fundamentos",
    intro: (
      <>
        <strong>En una línea:</strong> la triple restricción dice que todo proyecto negocia tres
        recursos finitos —alcance, tiempo y costo— y que mover uno obliga a mover otro: si el
        cliente pide más alcance, pagará con más tiempo o más presupuesto, o la calidad pagará la
        diferencia. Es la herramienta más simple para negociar cambios sin improvisar.
      </>
    ),
    sections: [
      {
        heading: "Qué es la triple restricción: tres recursos finitos",
        body: (
          <>
            <p>
              Todo proyecto vive bajo la misma condición: puede hacer cualquier cosa, pero no todo
              a la vez. La triple restricción —también llamada triángulo de hierro del proyecto—
              nombra esa condición con tres variables que se limitan entre sí:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Alcance:</strong> qué incluye el entregable, con qué funciones y con qué
                nivel de detalle.
              </li>
              <li>
                <strong>Tiempo:</strong> la fecha o el plazo en que debe estar terminado.
              </li>
              <li>
                <strong>Costo:</strong> el presupuesto, que en proyectos de servicios es sobre todo
                gente y sus horas.
              </li>
            </ul>
            <p>
              Ninguna de las tres es negociable sola. Que el alcance sea «inflexible» no lo
              protege: solo significa que el costo o el plazo absorberán cada cambio sin que nadie
              lo decida. El valor del modelo no es teórico —nadie dibuja triángulos en la vida
              real—: es que convierte cada pedido nuevo en una pregunta explícita de qué cede,
              antes de que lo cedido sea la confianza del cliente.
            </p>
            <p>
              Por eso la triple restricción es el primer diagrama que conviene enseñar a un cliente
              en el arranque del proyecto: cuando el cambio llegue —y va a llegar—, ambos ya
              comparten el vocabulario para negociarlo sin que suene a excusa.
            </p>
          </>
        ),
      },
      {
        heading: "El triángulo explicado sin teoría: si aprietas un vértice, otro cede",
        body: (
          <>
            <p>
              La mecánica es de física de todos los días: el área del triángulo es el proyecto, y
              no hay magia que la agrande. Ejemplos que reconocerás:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Aprietas el tiempo.</strong> Fecha antes de lo previsto: o recortas alcance
                —lanzas una versión más simple— o subes el costo —más gente, horas extra,
                proveedores—. «Trabajar más duro» no es un vértice: es gastar calidad sin decirla.
              </li>
              <li>
                <strong>Ensanchar el alcance.</strong> El cliente suma una función: o se mueve la
                fecha, o sube el presupuesto, o algo del alcance original baja de prioridad para
                hacer lugar. Sumar sin quitar es aceptar entregar tarde y callado.
              </li>
              <li>
                <strong>Recortar el costo.</strong> Menos presupuesto con el mismo alcance y la
                misma fecha solo funciona si el equipo tenía holgura; si no la tenía, el costo se
                recupera en calidad, con intereses.
              </li>
            </ul>
            <p>
              El error habitual es creer que el equipo puede absorber el cambio «apretando». Lo que
              absorbe el equipo es su propio margen, y ese margen ya estaba asignado a algo:
              pruebas, revisión, documentación, descanso. Cuando se agota, el vértice que cede
              aparece solo, y no es el que elegiste.
            </p>
          </>
        ),
      },
      {
        heading: "La calidad al centro (o la cuarta restricción)",
        body: (
          <>
            <p>
              En el modelo clásico, la calidad ocupa el centro del triángulo: no es un vértice que
              puedas mover directamente, sino el resultado de cómo equilibras los otros tres. Por
              eso es la variable favorita de los proyectos mal llevados: cuando nadie decide qué
              cede, cede la calidad, porque es la única que no protesta en la reunión.
            </p>
            <p>
              Hay dos formas de tratarla. La primera es asumirla como cuarta restricción explícita
              —alcance, tiempo, costo y calidad, con tres fijadas y una libre—; útil cuando el
              estándar mínimo es innegociable, como en software médico, financiero o cualquier
              cosa que maneje datos de usuarios. La segunda es dejarla al centro y vigilar que no la estén usando
              como válvula de escape silenciosa: si las pruebas se acortan, la revisión se salta y
              la documentación se aplaza en cada sprint, tu triángulo ya está apretando la calidad
              sin haberlo decidido.
            </p>
            <p>
              La señal de alarma es siempre la misma: los tres vértices fijos y una fecha que se
              mantiene. Alguien está pagando, y casi nunca es el presupuesto.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo usarla para negociar: frases exactas",
        body: (
          <>
            <p>
              La triple restricción brilla en la conversación de cambio. La estructura de la frase
              es siempre «te puedo dar X si movemos Y»: nunca un «no» seco, nunca un «sí»
              suicida. Cuatro escenarios, con la frase lista:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Escenario</th>
                  <th className="py-2 pr-4 font-semibold">Qué cede</th>
                  <th className="py-2 font-semibold">La frase</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">El cliente pide antes</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Alcance: versión mínima primero.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    «Podemos adelantar la fecha si lanzamos la versión mínima; el resto entra en la
                    segunda entrega tres semanas después.»
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">El cliente pide más</td>
                  <td className="py-2 pr-4 text-muted-foreground">Tiempo o costo, a elegir.</td>
                  <td className="py-2 text-muted-foreground">
                    «Esa funcionalidad suma tres semanas o un recurso al equipo; te dejo elegir
                    cuál de las dos pagamos.»
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Recortan el presupuesto</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Alcance o tiempo, explícitamente.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    «Con este presupuesto mantengo el alcance si el plazo se mueve un mes, o
                    mantengo la fecha si recortamos el módulo de reportes. ¿Cuál prefieres?»
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Piden todo a la vez</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Calidad: y ahí te niegas a comprometerla.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    «Puedo hacer las tres cosas en esa fecha, pero saldrá sin pulir y con
                    retrabajo; prefiero no comprometerlo así y bajar una de las tres.»
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Fíjate en el patrón: cada frase nombra el vértice que se mueve y ofrece la opción
              como decisión del cliente. Negociar así no debilita tu posición: la profesionaliza,
              porque dejas de ser el proveedor que «siempre pone problemas» y pasas a ser el que
              muestra el tablero completo.
            </p>
          </>
        ),
      },
      {
        heading: "Línea base y control de cambios: donde el triángulo se hace oficial",
        body: (
          <>
            <p>
              El triángulo solo sirve si sus lados están medidos. Esa medida es la línea base: el
              alcance, el calendario y el presupuesto aprobados contra los cuales se compara todo
              lo que pasa después. Sin línea base no hay desvío posible —no puedes desviarte de
              nada que nunca quedó escrito—, y sin desvío no hay negociación: solo sorpresa.
            </p>
            <p>
              El presupuesto es el lado que más discusiones evita cuando está explícito: qué
              incluye, qué no, y qué pasa cuando se agota. El armado lado a lado con el triángulo
              está en{" "}
              <Link to="/blogs/presupuesto-de-proyecto" className="underline underline-offset-2">
                presupuesto de proyecto
              </Link>
              .               El alcance es el lado que más se degrada silenciosamente, petición a petición; el
              mecanismo para frenarlo está en{" "}
              <Link
                to="/blogs/alcance-de-proyecto-scope-creep"
                className="underline underline-offset-2"
              >
                scope creep
              </Link>
              . Y cuando el equipo trabaja por ciclos en lugar de cascada, el triángulo no
              desaparece: se re-negocia cada sprint en la priorización, con el tablero como fuente
              de verdad; ese modelo está en{" "}
              <Link to="/blogs/scrumban" className="underline underline-offset-2">
                ScrumBan
              </Link>
              .
            </p>
            <p>
              La regla operativa que une todo: ningún cambio se acepta por chat. Cambiar un
              vértice exige registrar qué se mueve, quién lo aprueba y cuándo se re-baselinea. Un
              cambio conversacional es un cambio que pagará el equipo.
            </p>
          </>
        ),
      },
      {
        heading: "El error de creer que el equipo puede apretar los tres",
        body: (
          <>
            <p>
              La versión más dañina del triángulo es la que escucha: «fecha fija, alcance fijo,
              presupuesto fijo, el equipo que se arregle». Los equipos se arreglan, sí. Lo hacen
              trabajando horas extra, saltándose pruebas, entregando código que nadie más puede
              mantener y quemando a la mejor persona del equipo. El proyecto «cumple» y factura un
              costo que nadie ve en la curva S: rotación, bugs en producción, deuda técnica y la
              siguiente estimación inflada por desconfianza.
            </p>
            <p>
              Si los tres vértices están verdaderamente fijos, el proyecto ya está definido: es un
              proyecto donde la calidad es la variable libre. Dicho en el arranque, es honesto y
              gestionable. Negado, es la receta estándar del burnout y del proyecto que se entrega
              tarde igual, solo que con el equipo destruido en el intento.
            </p>
            <p>
              Si quieres sostener el triángulo con datos —alcance congelado en checklists y
              procesos, avance visible en el tablero, presupuesto y carga a la vista, todo en JSON
              local en tu carpeta, sin cuenta ni asientos—{" "}
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
              — controla alcance, plazo y costo desde un tablero local-first, sin nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es la triple restricción de un proyecto?",
        answer:
          "Es el modelo que representa todo proyecto como el equilibrio entre tres recursos finitos: alcance, tiempo y costo. Mover uno obliga a ajustar al menos otro, y si nadie decide cuál cede, cede la calidad. Se usa sobre todo como herramienta de negociación: cada pedido nuevo se traduce en la pregunta explícita de qué vértice se mueve para pagarlo.",
      },
      {
        question: "¿Cuáles son las tres restricciones del proyecto?",
        answer:
          "Alcance (qué incluye el entregable), tiempo (la fecha o plazo de entrega) y costo (el presupuesto, mayormente gente y horas). Se representan como los lados de un triángulo, llamado triángulo de hierro porque no se pueden estirar dos sin aflojar el tercero.",
      },
      {
        question: "¿Qué pasa con la calidad en el triángulo de hierro?",
        answer:
          "Ocupa el centro del triángulo: no es un vértice que se negocie directamente, sino el resultado de cómo se equilibran alcance, tiempo y costo. Por eso, cuando los tres lados están fijos y nadie decide qué cede, la calidad es la variable de escape silenciosa: menos pruebas, menos revisión y más retrabajo después.",
      },
      {
        question: "¿Cómo usar la triple restricción para negociar con el cliente?",
        answer:
          "Con la estructura «te puedo dar X si movemos Y»: ante cada pedido, se nombra explícitamente qué vértice se mueve y se ofrece la elección. Si pide más alcance, se ofrece entre más tiempo o más presupuesto; si adelanta la fecha, se recorta alcance en una primera entrega; si recorta presupuesto, se ajusta alcance o plazo. Nunca un no seco ni un sí sin contraparte.",
      },
      {
        question: "¿Es posible cumplir alcance, plazo y costo siempre?",
        answer:
          "No: fijar los tres vértices a la vez significa que la calidad es la variable libre, se diga o no. Los equipos la absorben con horas extra, pruebas recortadas y deuda técnica, y el costo reaparece como rotación, bugs y estimaciones infladas. La gestión madura no promete los tres fijos: negocia explícitamente cuál se mueve en cada cambio.",
      },
    ],
  },
};
