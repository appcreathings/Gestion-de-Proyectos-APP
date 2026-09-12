import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "plan-de-contingencia",
  title: "Plan de contingencia: qué harás cuando el riesgo se haga realidad",
  excerpt:
    "El plan de contingencia es la respuesta que se escribe antes del problema: qué riesgos merecen plan B, cómo escribirlo en 5 pasos y cuánto reservar de tiempo y dinero.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-11",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "matriz-de-riesgos",
  related: [
    "matriz-de-riesgos",
    "gestion-de-riesgos-simple",
    "linea-base-proyecto",
    "proyecto-atrasado-que-hacer",
  ],
  seo: {
    title: "Plan de contingencia: qué hacer si el riesgo ocurre | Hito",
    description:
      "Plan de contingencia en proyectos: qué es, en qué se diferencia de la mitigación, qué riesgos merecen plan B, cómo escribirlo en 5 pasos y cuánta reserva dejar.",
    ogImageAlt: "Estructura de un plan de contingencia: disparador, respuesta y responsable.",
  },
  content: {
    eyebrow: "Riesgo y calidad",
    intro: (
      <>
        <strong>En una línea:</strong> el plan de contingencia es la respuesta pre-acordada a un
        riesgo — escrita antes de que ocurra, con disparador, responsable y recursos — y existe
        porque improvisar bajo presión es la forma más cara de tomar decisiones.
      </>
    ),
    sections: [
      {
        heading: "Qué es un plan de contingencia",
        body: (
          <>
            <p>
              Un plan de contingencia responde una sola pregunta: <strong>«si [este riesgo]
              ocurre, ¿qué hacemos exactamente?»</strong> — y la responde por escrito, con
              tiempo y calma, en el momento en que el riesgo todavía es una hipótesis. No es un
              documento formal de gabinete: para un equipo pequeño es un párrafo por riesgo, con
              cuatro datos que veremos abajo.
            </p>
            <p>
              El argumento no es burocrático, es económico: las decisiones tomadas en medio del
              problema son las peores y las más caras. Cuando el proveedor avisa que se atrasa
              tres semanas y lo ves a las 18:00 de un jueves, no estás en condiciones de
              negociar bien, evaluar alternativas con frialdad ni proteger el resto del plan —
              estás en modo incendio. El plan B escrito hace el trabajo ahí, donde el costo de
              pensar es mínimo: la decisión ya está tomada, falta ejecutarla.
            </p>
            <p>
              Es la tercera capa del proceso de riesgos que describimos en{" "}
              <Link
                to="/blogs/gestion-de-riesgos-simple"
                className="underline underline-offset-2"
              >
                gestión de riesgos para equipos pequeños
              </Link>
              : identificar → priorizar con la{" "}
              <Link to="/blogs/matriz-de-riesgos" className="underline underline-offset-2">
                matriz de riesgos
              </Link>{" "}
              → y a los pocos que quedan en zona roja, darles plan B. La mayoría de los riesgos
              no necesita contingencia; los que la necesitan, la necesitan mucho.
            </p>
          </>
        ),
      },
      {
        heading: "Contingencia vs mitigación vs registro",
        body: (
          <>
            <p>
              Tres palabras que se usan como sinónimos y no lo son. La confusión produce la
              trampa clásica: creer que el riesgo está «gestionado» cuando solo está
              «anotado».
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Concepto</th>
                  <th className="py-2 pr-4 font-semibold">Qué hace</th>
                  <th className="py-2 pr-4 font-semibold">Ejemplo</th>
                  <th className="py-2 font-semibold">Cuándo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    <strong>Mitigación</strong>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Reduce la probabilidad o el impacto <em>antes</em>.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Pedir el material con 2 semanas de colchón.
                  </td>
                  <td className="py-2 text-muted-foreground">Siempre que se pueda.</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    <strong>Contingencia</strong>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Responde <em>después</em>: qué se hace si igual ocurre.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    «Si se atrasa igual, compramos en el proveedor B a precio mayor.»
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Solo riesgos rojos: los que no pueden darse sin respuesta.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    <strong>Registro</strong>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Documenta: lista con calificación, dueño y respuesta.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    «R-04: retraso de proveedor · prob. media · dueño: Marta.»
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Para todos, sin excepción.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La regla de asignación: <strong>mitigar siempre que sea barato, planear
              contingencia solo donde duele, registrar todo</strong>. Un riesgo mitigado hasta
              bajar de zona roja puede no necesitar plan B; un riesgo que no se puede mitigar
              (el cliente puede quebrar, el proveedor único puede fallar) vive enteramente de
              su contingencia.
            </p>
          </>
        ),
      },
      {
        heading: "Qué riesgos merecen plan B",
        body: (
          <>
            <p>
              Escribir contingencias cuesta tiempo — el recurso que la gestión de riesgos
              pretende proteger. El filtro práctico para decidir cuáles las merecen:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Probabilidad media o alta en la matriz,</strong> y no se puede mitigar
                más sin costar demasiado: la contingencia es el segundo cinturón.
              </li>
              <li>
                <strong>Impacto que rompe la línea base</strong> — fecha, presupuesto o alcance
                — aunque la probabilidad sea baja: el evento improbable pero catastrófico se
                planea con calma o se sufre con urgencia. Es la fila roja de arriba de la
                matriz.
              </li>
              <li>
                <strong>Dependencias de terceros que no controlás:</strong> proveedores,
                aprobaciones del cliente, terceros reguladores. Casi todos los «imprevisibles»
                del proyecto son en realidad previsibles de otros.
              </li>
              <li>
                <strong>Riesgos ya materializados antes</strong> en proyectos parecidos: el
                historial del equipo es el mejor predictor. Si te pasó dos veces, la tercera no
                es sorpresa: es negligencia planificada.
              </li>
            </ul>
            <p>
              Un equipo pequeño sano suele terminar con <strong>2 a 5 planes de contingencia
              por proyecto</strong>. Si tienes 15, escribiste contingencias para riesgos verdes;
              si tienes 0, dejaste al azar todo lo que importa. Ambos extremos se corrigen con
              el filtro de arriba.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo escribirlo: los 4 datos de cada plan",
        body: (
          <>
            <p>
              Un plan de contingencia útil cabe en cuatro líneas. Plantilla con ejemplo (riesgo:
              «el desarrollador clave se va del proyecto»):
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Disparador (cuándo se activa).</strong> La condición observable que
                activa el plan, sin ambigüedad: «aviso formal de renuncia» o «dos semanas sin
                respuesta + incumplimiento de plazos internos». Un disparador vago («si las
                cosas se ponen raras») garantiza activar tarde.
              </li>
              <li>
                <strong>Respuesta (qué se hace).</strong> La secuencia concreta: «1)Congelar
                entregables en el estado actual; 2)recuperar conocimiento: repos, notas,
                sesión de grabación con el dev saliente; 3)replanificar las tareas críticas con
                el resto del equipo; 4)ofrecer al cliente replanificación de hito antes de que
                lo pida».
              </li>
              <li>
                <strong>Responsable (quién activa y ejecuta).</strong> Un nombre. «El plan se
                activa solo» es la frase que convierte cualquier contingencia en papel
                mojado: alguien tiene que tener la autoridad y la obligación de disparar.
              </li>
              <li>
                <strong>Recursos (con qué).</strong> Qué reserva consume el plan: dinero,
                tiempo del calendario, contactos, licencias. Este dato conecta con la reserva
                de contingencia de la sección siguiente — y es lo que te dice si el plan es
                ejecutable o un deseo.
              </li>
            </ol>
            <p>
              Notá la secuencia del ejemplo: protege primero lo ya hecho, transfiere el
              conocimiento que se escapa, replanifica con lo que queda y habla con el cliente
              <em> antes</em> de que la fecha se rompa. Ese orden — asegurar, transferir,
              replanificar, comunicar — sirve para casi cualquier contingencia de recursos.
            </p>
          </>
        ),
      },
      {
        heading: "La reserva de contingencia: cuánto y quién la autoriza",
        body: (
          <>
            <p>
              La contingencia de papel no sirve sin combustible. La reserva es la porción
              deliberada de tiempo y dinero que el proyecto guarda para ejecutar los planes B —
              y no es colchón de estimación: es presupuesto de riesgo, con dueño y reglas.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Cuánto.</strong> La regla de bolsillo para equipos pequeños: 10–15% del
                presupuesto de tiempo y de dinero cuando la matriz tiene riesgos medios
                concentrados; 15–25% cuando hay riesgos rojos activos. Menos del 10% con dos
                riesgos rojos no es austeridad: es decoración.
              </li>
              <li>
                <strong>Dónde vive.</strong> Fuera de las tareas. Si la reserva se reparte en
                holguras por tarea, se consume igual — pero invisible y sin control. La
                reserva única y visible respeta la{" "}
                <Link to="/blogs/linea-base-proyecto" className="underline underline-offset-2">
                  línea base del proyecto
                </Link>{" "}
                y se puede defender ante el cliente.
              </li>
              <li>
                <strong>Quién la autoriza.</strong> Una regla simple: el líder del proyecto
                autoriza consumos hasta el X% de la reserva; más que eso, se conversa con quien
                financia. La reserva sin regla de autorización se gasta en la primera urgencia
                mediana — y ya no está cuando llega el riesgo de verdad.
              </li>
              <li>
                <strong>Cuándo se libera.</strong> Al cierre, lo no consumido se devuelve o se
                reinvierte — declararlo de antemano evita que «la reserva» se convierta en el
                fondo discrecional del proyecto. Y si se consumió, el registro de por qué es
                material de{" "}
                <Link
                  to="/blogs/lecciones-aprendidas-proyecto"
                  className="underline underline-offset-2"
                >
                  lecciones aprendidas
                </Link>
                .
              </li>
            </ul>
            <p>
              Con el cliente, la conversación honesta es corta: «el presupuesto incluye una
              reserva del 12% para imprevistos gestionados; se consume contra riesgos
              identificados y con tu visibilidad». Nadie discute una reserva con reglas — todos
          discuten los sobrecostos sorpresivos, que es exactamente lo que la reserva
              evita (el detalle en{" "}
              <Link to="/blogs/sobrecosto-de-proyecto" className="underline underline-offset-2">
                sobrecosto en proyectos
              </Link>
              ).
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo completo: dos planes en una página",
        body: (
          <>
            <p>
              Así se ven dos planes de contingencia reales en el registro de riesgos de una
              agencia de 6 personas:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Dato</th>
                  <th className="py-2 pr-4 font-semibold">Riesgo A: dev clave se va</th>
                  <th className="py-2 font-semibold">
                    Riesgo B: proveedor entrega 3 semanas tarde
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Disparador</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Aviso de renuncia o 2 semanas de bajo rendimiento + faltas.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Fecha prometida vencida +48 h sin respuesta del proveedor.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Respuesta</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Congelar avance → sesión de transferencia grabada → replanificar hitos →
                    avisar al cliente con propuesta de nuevas fechas.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Activar proveedor B del directorio (cotizado en preproducción) → absorber el
                    delta con la reserva → avisar al cliente del nuevo hito.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Responsable</td>
                  <td className="py-2 pr-4 text-muted-foreground">Ana (líder de proyecto)</td>
                  <td className="py-2 pr-4 text-muted-foreground">Carlos (producción)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Recursos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    1 semana de buffer del calendario; repos y docs al día (mitigación ya en
                    curso).
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    $800 de la reserva (delta de precio del proveedor B); contacto B verificado
                    en kickoff.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Dos párrafos por riesgo que valen semanas de diferencia en la ejecución. Y
              mantenimiento: cuando un riesgo verde sube de zona en una revisión de matriz, gana
              su plan en la misma sesión — la contingencia se escribe con tiempo, que es todo el
              punto.
            </p>
            <p>
              Si quieres que los riesgos, sus disparadores y sus planes vivan junto al proyecto
              — un archivo local en tu carpeta, sin cuenta ni nube—{" "}
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
              — riesgos y planes B junto al trabajo, local-first.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un plan de contingencia?",
        answer:
          "Es la respuesta pre-acordada a un riesgo específico del proyecto, escrita antes de que ocurra: con disparador observable, secuencia de acciones, responsable que lo activa y recursos (reserva) para ejecutarlo. Convierte una crisis improvisada en un procedimiento que ya pensaste con calma.",
      },
      {
        question: "¿Cuál es la diferencia entre mitigación y contingencia?",
        answer:
          "La mitigación actúa antes para reducir la probabilidad o el impacto del riesgo (pedir con colchón, documentar, duplicar proveedores); la contingencia define qué se hace después, si el riesgo igual ocurre. Se mitigan todos los riesgos baratos de mitigar y se planea contingencia solo para los que no pueden darse sin respuesta.",
      },
      {
        question: "¿Cuánto debe ser la reserva de contingencia?",
        answer:
          "Entre el 10% y el 15% del presupuesto de tiempo y dinero con riesgos medios, y entre el 15% y el 25% con riesgos rojos activos. Vive fuera de las tareas (una bolsa única y visible, no holguras repartidas), con regla de autorización: el líder consume hasta un tope; más que eso, se consulta con quien financia.",
      },
      {
        question: "¿Todos los riesgos necesitan plan de contingencia?",
        answer:
          "No: solo los que caen en zona roja de la matriz o que romperían la línea base aunque sean improbables. Un equipo pequeño sano termina con 2 a 5 planes por proyecto. Contingencias para riesgos verdes es burocracia; cero contingencias con riesgos rojos es apostar el proyecto.",
      },
      {
        question: "¿Cómo se activa un plan de contingencia?",
        answer:
          "Cuando el disparador pactado ocurre — una condición observable y sin ambigüedad («fecha vencida +48 h sin respuesta»), no una sensación. El responsable nombrado en el plan lo activa, ejecuta la secuencia escrita y consume la reserva según la regla de autorización. Por eso el disparador se define con calma: en plena crisis, nadie discute si toca.",
      },
    ],
  },
};
