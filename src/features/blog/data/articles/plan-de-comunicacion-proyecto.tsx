import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "plan-de-comunicacion-proyecto",
  title: "Plan de comunicación de un proyecto (que sí se usa)",
  excerpt:
    "Un plan de comunicación de un proyecto que sí se usa: matriz de audiencia, mensaje, canal y frecuencia, plantilla de una página y los errores que lo convierten en papel muerto.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-08",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "scrumban",
  related: [
    "scrumban",
    "que-son-stakeholders",
    "informe-de-estado-semanal",
  ],
  seo: {
    title: "Plan de comunicación de un proyecto (que sí se usa) | Hito",
    description:
      "Plan de comunicación de un proyecto: matriz audiencia-mensaje-canal-frecuencia, plantilla mínima y los errores que lo convierten en documento muerto.",
    ogImageAlt:
      "Matriz de plan de comunicación: audiencia, mensaje, canal y frecuencia.",
  },
  content: {
    eyebrow: "Stakeholders",
    intro: (
      <>
        <strong>En una línea:</strong> un plan de comunicación de un proyecto que se usa cabe
        en una página —quién recibe qué mensaje, por qué canal y con qué frecuencia, con
        responsable por audiencia—. Aquí tienes la matriz mínima con ejemplo, la plantilla
        copiable y los errores que convierten el plan en papel muerto.
      </>
    ),
    sections: [
      {
        heading: "El problema: comunicar de más y de menos a la vez",
        body: (
          <>
            <p>
              En la mayoría de los proyectos ocurren las dos cosas a la vez: el equipo está
              saturado de notificaciones, pings y reuniones que no necesita, mientras el
              cliente y la dirección operan a ciegas hasta que alguien grita. No es un problema
              de volumen sino de dirección: la comunicación sobra donde no sirve y falta donde
              decide.
            </p>
            <p>
              La causa casi nunca es mala voluntad: es ausencia de acuerdo. Cada persona
              comunica como le resulta natural —el líder por chat, el cliente por correo, la
              dirección solo cuando hay problema— y el resultado es ruido para unos y silencio
              para otros. El plan de comunicación es precisamente ese acuerdo: quién recibe
              qué, por dónde y cuándo, decidido una vez en vez de negociado cada semana. Y su
              punto de partida tiene nombre técnico: los{" "}
              <Link
                to="/blogs/que-son-stakeholders"
                className="underline underline-offset-2"
              >
                stakeholders del proyecto
              </Link>
              , que no son «todos», sino las personas concretas que algo ganan o pierden con
              el resultado.
            </p>
          </>
        ),
      },
      {
        heading: "La matriz mínima: audiencia × mensaje × canal × frecuencia × responsable",
        body: (
          <>
            <p>
              El corazón del plan es una tabla de cinco columnas. Si una fila no se puede
              llenar completa, esa comunicación no debería existir. Ejemplo con las cuatro
              audiencias típicas:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Audiencia</th>
                  <th className="py-2 pr-4 font-semibold">Qué necesita saber</th>
                  <th className="py-2 pr-4 font-semibold">Canal</th>
                  <th className="py-2 pr-4 font-semibold">Frecuencia</th>
                  <th className="py-2 font-semibold">Responsable</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Cliente</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Avance contra hitos y riesgos con impacto en fechas.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Correo: resumen con semáforo.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Semanal</td>
                  <td className="py-2 text-muted-foreground">Líder del proyecto</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Dirección</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Estado global, desvíos y decisiones que necesita tomar.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Reunión corta o dashboard.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Quincenal</td>
                  <td className="py-2 text-muted-foreground">Líder del proyecto</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Equipo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Prioridades de la semana, bloqueos y cambios.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Tablero actualizado + daily de 10 min.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Diaria</td>
                  <td className="py-2 text-muted-foreground">Cada dueño de tarea</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Proveedores</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Dependencias y fechas comprometidas.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Correo + checklist compartido.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Semanal o quincenal
                  </td>
                  <td className="py-2 text-muted-foreground">Responsable de compras</td>
                </tr>
              </tbody>
            </table>
            <p>
              Tres reglas para que la matriz funcione. El mensaje se define por lo que la
              audiencia debe decidir o hacer, no por lo que te gusta contar. El canal es único
              y acordado por fila: el estado del proyecto no se pregunta por chat si vive en el
              correo del viernes. Y cada fila tiene un responsable con nombre; las
              comunicaciones «de la gente» no las hace nadie.
            </p>
          </>
        ),
      },
      {
        heading: "La plantilla de una página (copiable)",
        body: (
          <>
            <p>El plan completo, listo para copiar, son cinco bloques:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Encabezado:</strong> proyecto, responsable del plan y fecha de la
                última actualización.
              </li>
              <li>
                <strong>Matriz de comunicación:</strong> la tabla de la sección anterior, una
                fila por audiencia.
              </li>
              <li>
                <strong>Regla de escalado:</strong> qué evento dispara comunicación
                extraordinaria —hito en riesgo, desvío mayor a X, bloqueo de más de Y días— y
                a quién se avisa primero.
              </li>
              <li>
                <strong>Calendario semanal:</strong> qué se envía cada día —lunes
                prioridades, viernes informe— para que nadie dependa de la memoria.
              </li>
              <li>
                <strong>Dónde vive:</strong> la ubicación exacta del documento y del informe
                semanal. Un plan sin ubicación conocida es un plan perdido.
              </li>
            </ol>
            <p>
              Una página en total. Si al escribirlo se te va a dos, no pasa nada: significa
              que tienes dos planes, y solo uno se va a usar.
            </p>
            <p>
              Un ejemplo de la regla de escalado en acción, porque es el bloque que más se
              redacta mal: «si el hito de diseño corre riesgo de atrasarse más de 3 días, el
              responsable avisa al líder ese mismo día por mensaje directo; el líder decide si
              entra en el informe del viernes o se comunica al cliente de inmediato». Fíjate
              que define el evento (riesgo mayor a 3 días), el canal (mensaje directo, no el
              grupo), el plazo (ese mismo día) y la ruta de decisión. Con eso, la mayoría de
              las malas sorpresas se desactivan en 24 horas en lugar de descubrirse en el
              informe semanal, cuando ya no hay nada que hacer.
            </p>
          </>
        ),
      },
      {
        heading: "El informe semanal como espina dorsal",
        body: (
          <>
            <p>
              De todo el plan, el artefacto que sostiene el 80 % de la comunicación es el
              informe de estado semanal: el mismo formato, el mismo día, a las mismas
              personas. Ese ritmo fijo hace tres cosas que ninguna reunión logra: elimina la
              pregunta «¿cómo va?», deja rastro escrito para cuando alguien «no se enteró» y
              convierte la comunicación en un hábito que sobrevive a las semanas caóticas.
            </p>
            <p>
              La estructura mínima —avance, riesgos, decisiones pendientes— y los errores de
              redacción que lo vuelven invisible están armados en{" "}
              <Link
                to="/blogs/informe-de-estado-semanal"
                className="underline underline-offset-2"
              >
                cómo hacer un informe de estado semanal
              </Link>
              . Con ese informe rodando, el resto del plan son complementos: la matriz define
              quién lo recibe y la regla de escalado cubre lo que no puede esperar al viernes.
            </p>
            <p>
              Las demás filas de la matriz funcionan igual de pequeñas. La comunicación con el
              equipo no es un correo adicional: es el tablero actualizado en el momento más una
              daily de 10 minutos de pie, donde lo único que se resuelve son bloqueos. La
              comunicación con dirección se apoya en la reunión corta quincenal con una sola
              pregunta como agenda: ¿qué necesitas decidir? Si alguna fila de tu plan exige
              producir un documento nuevo cada semana, sospecha de ella: casi siempre puede
              alimentarse de lo que ya existe —el tablero, el informe, el backlog— en lugar de
              sumar otro artefacto que mantener.
            </p>
          </>
        ),
      },
      {
        heading: "Los 3 errores que convierten el plan en papel muerto",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>El plan de 20 páginas.</strong> Glosarios, diagramas de flujo,
                políticas de redacción. Nadie lo consulta y su sola existencia desacredita el
                concepto. Si no cabe en una página, no es un plan: es un tratado.
              </li>
              <li>
                <strong>Un canal único para todo.</strong> El grupo de chat como único medio:
                urgencias mezcladas con estado, decisiones enterradas en scroll infinito. La
                matriz existe precisamente para separar flujos; si todo va por el mismo
                conducto, el plan es decorativo.
              </li>
              <li>
                <strong>Sin responsable por audiencia.</strong> Filas sin nombre. «Se
                informará al cliente semanalmente» es un deseo; «Ana envía el resumen los
                viernes» es un plan. Sin dueño, la comunicación del proyecto es la primera
                víctima de cualquier semana difícil.
              </li>
            </ul>
            <p>
              Y si quieres que el estado viva donde el trabajo ocurre —tablero con límites WIP
              que se actualiza en el momento, automatizaciones para los recordatorios,
              dashboard de portafolio para dirección y todo en un JSON local de tu carpeta, sin
              cuenta ni asientos—{" "}
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
              — el estado de tus proyectos, local-first y sin nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un plan de comunicación de un proyecto?",
        answer:
          "Es el acuerdo que define qué se comunica, a quién, por qué canal, con qué frecuencia y con qué responsable. Cabe en una página y su prueba de calidad es simple: si cada stakeholder sabe cuándo va a recibir información y por dónde, el plan funciona; si la información viaja por intuición e interrupciones, no existe.",
      },
      {
        question: "¿Qué debe incluir un plan de comunicación?",
        answer:
          "Cuatro piezas: la matriz de comunicación (audiencia, mensaje, canal, frecuencia y responsable por audiencia), la regla de escalado (qué evento dispara comunicación extraordinaria y a quién se avisa), el calendario resultante (qué se envía cada día de la semana) y dónde vive el documento. Todo lo demás —glosarios, diagramas, políticas— es opcional y suele sobrar.",
      },
      {
        question: "¿Cómo hacer una matriz de comunicación?",
        answer:
          "Listando primero las audiencias del proyecto (cliente, dirección, equipo, proveedores) y definiendo para cada una qué necesita saber de verdad, por qué canal lo va a recibir, con qué frecuencia y quién es el responsable de enviarlo. Una audiencia por fila, una decisión por columna: si una celda no se puede llenar, esa audiencia no necesita esa comunicación.",
      },
      {
        question: "¿Con qué frecuencia se comunica el estado de un proyecto?",
        answer:
          "Depende de la audiencia: el equipo necesita ritmo diario o casi diario (tablero actualizado y una daily corta); el cliente, un resumen semanal o quincenal contra hitos; la dirección, algo quincenal o mensual centrado en desvíos y decisiones. El informe de estado semanal es la frecuencia por defecto que funciona en la mayoría de los proyectos.",
      },
      {
        question: "¿Quién es el responsable de la comunicación del proyecto?",
        answer:
          "El líder o responsable del proyecto es dueño del plan y de las comunicaciones hacia cliente y dirección; los responsables de cada frente comunican hacia proveedores y dependencias; y el equipo sostiene la comunicación interna actualizando el tablero en el momento. Responsable no significa redactar todo: significa que nadie se queda sin saber si algo va mal.",
      },
    ],
  },
};
