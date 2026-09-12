import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "cliente-que-no-responde",
  title: "El cliente no responde: cómo desbloquear el proyecto sin quemar la relación",
  excerpt:
    "Cuando el cliente no responde, el proyecto se congela y las fechas se comen las aprobaciones: por qué callan, la plantilla de mensaje que sí funciona y el protocolo de escalamiento en 5 pasos.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-10",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "cuanto-cobrar-por-un-proyecto",
  related: [
    "cuanto-cobrar-por-un-proyecto",
    "gestionar-proyectos-con-clientes",
    "proyecto-atrasado-que-hacer",
    "plan-de-comunicacion-proyecto",
  ],
  seo: {
    title: "Cliente que no responde: cómo desbloquear el proyecto | Hito",
    description:
      "El cliente no responde: por qué callan los clientes, cómo redactar un recordatorio que sí funciona y el protocolo de escalamiento en 5 pasos sin quemar la relación.",
    ogImageAlt: "Protocolo de escalamiento ante la falta de respuesta de un cliente.",
  },
  content: {
    eyebrow: "Dinero y clientes",
    intro: (
      <>
        <strong>En una línea:</strong> cuando el cliente no responde, el proyecto no se pausa — se
        pudre en silencio — y la salida no es insistir más, sino cambiar la pregunta: de «¿me
        leíste?» a una decisión concreta con fecha y consecuencia.
      </>
    ),
    sections: [
      {
        heading: "El costo real del silencio",
        body: (
          <>
            <p>
              «El cliente no me contesta» suena a molestia menor y es, en realidad, uno de los
              riesgos más caros de los proyectos con clientes externos. El costo llega por tres
              frentes:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Trabajo congelado que sigue ocupando cabeza y calendario.</strong> La
                tarea que espera aprobación no desaparece del tablero: vive en la lista de
                todos, se recuerda en cada daily y consume atención. Es WIP estéril — el mismo
                fenómeno que hace lento a un equipo cuando tiene{" "}
                <Link
                  to="/blogs/reducir-trabajo-en-curso"
                  className="underline underline-offset-2"
                >
                  demasiado trabajo empezado
                </Link>
                , con la diferencia de que acá nadie puede avanzarlo.
              </li>
              <li>
                <strong>Fechas que se comen las aprobaciones.</strong> Diez días de silencio no
                atrasan el proyecto diez días: lo atrasan diez días más lo que tarde en
                reencarrilarse el equipo al volver. Las fechas pactadas rara vez sobreviven a
                un silencio de dos semanas — y después llega la conversación incómoda de
                renegociar el plazo, donde el silencio previo pesa en tu contra.
              </li>
              <li>
                <strong>Pagos atados a aprobaciones.</strong> Si el hito de pago depende de una
                aceptación que nadie da, el silencio también congela tu facturación. No es
                casualidad que el{" "}
                <Link
                  to="/blogs/anticipos-y-pagos-por-hitos"
                  className="underline underline-offset-2"
                >
                  calendario de pagos por hitos
                </Link>{" "}
                siempre incluya plazo de aprobación tácita.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Por qué no responde: 4 causas y su antídoto",
        body: (
          <>
            <p>
              «No responde» casi nunca significa «no le importa». Diagnosticar la causa cambia
              la respuesta:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Causa</th>
                  <th className="py-2 pr-4 font-semibold">Señal</th>
                  <th className="py-2 font-semibold">Antídoto</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">No es su prioridad</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Responde lo urgente de su día, lo tuyo flota semanas.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Consecuencia con fecha: «si no hay respuesta al viernes, pausamos».
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Miedo a decidir</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    «Lo veo y te digo» eterno; le piden opinión a otros.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Reducir la decisión: opción recomendada + alternativa, no pregunta abierta.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Aprobador invisible</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Tu contacto dice «lo consulto internamente» y nadie más aparece.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Pedir acceso directo al decisor (
                    <Link
                      to="/blogs/matriz-de-stakeholders"
                      className="underline underline-offset-2"
                    >
                      mapa de stakeholders
                    </Link>{" "}
                    desde el kickoff).
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Mensaje no accionable</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Tus correos largos terminan en «¿qué piensas?» sin una pregunta única.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Una decisión por mensaje: qué, para cuándo, qué pasa si no.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La cuarta causa es la más incómoda porque es la única que es culpa tuya — y la
              más frecuente. Los correos de cinco párrafos con tres preguntas anidadas no se
              responden porque exigen un esfuerzo de redacción que el día del cliente no tiene.
            </p>
          </>
        ),
      },
      {
        heading: "El mensaje que sí funciona (plantilla)",
        body: (
          <>
            <p>
              El recordatorio que desbloquea tiene una estructura fija:{" "}
              <strong>una decisión, una fecha, una consecuencia</strong>. Nada de «¿viste mi
              correo anterior?», que solo agrega culpa sin agregar información. La plantilla:
            </p>
            <p className="rounded-md border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
              «Hola [nombre]: para seguir con [proyecto] necesitamos una decisión sobre{" "}
              <strong>[una cosa concreta]</strong>.<br />
              <strong>Opción recomendada:</strong> [A], porque [una razón].<br />
              <strong>Si no respondés antes del [día]:</strong> [avanzamos con A / pausamos el
              trabajo hasta tu respuesta], según lo acordado.<br />
              Cualquier duda, 15 minutos de llamada hoy o mañana y lo resolvemos.»
            </p>
            <p>
              Tres detalles que hacen que funcione. Primero:{" "}
              <strong>la opción recomendada</strong> convierte una pregunta abierta («¿qué
              color?» — trabajo) en una confirmación («¿va A?» — dos segundos). Segundo:{" "}
              <strong>la consecuencia no es amenaza, es agenda</strong> — está en el contrato o
              en el acuerdo de trabajo, y decirla con anticipación es profesionalismo, no
              ultimátum. Tercero: <strong>la puerta de salida barata</strong> (la llamada corta)
              le da al cliente indeciso un camino de bajo costo para destrabarse salvando la
              cara.
            </p>
          </>
        ),
      },
      {
        heading: "El protocolo de escalamiento en 5 pasos",
        body: (
          <>
            <p>
              Cuando el mensaje bien hecho tampoco funciona, necesitas un procedimiento
              predecible — no un estado de ánimo. Estos son los pasos, con tiempos de
              referencia:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Verificar el canal (día 0).</strong> ¿El mensaje llegó al lugar correcto?
                ¿La persona está de vacaciones que tú no sabías? Un mensaje a otro canal o a
                un colega del cliente lo confirma antes de escalar cualquier cosa.
              </li>
              <li>
                <strong>Recordatorio con plazo explícito (día 3–5).</strong> La plantilla de la
                sección anterior, enviada por el canal del proyecto con copia a tu contacto.
                Queda escrito que pediste y cuándo.
              </li>
              <li>
                <strong>Escalar al sponsor (día 7–10).</strong> En proyectos con clientes, el
                escalamiento no es traición: es el diseño correcto. Un mensaje seco y
                sin drama al patrocinador del proyecto: «el proyecto X está detenido esperando
                [decisión] desde el [fecha]; para cumplir la fecha del [hito] necesitamos
                respuesta antes del [día]». Casi siempre el sponsor responde en horas — al
                sponsor no le pagan para ignorar.
              </li>
              <li>
                <strong>Pausa formal con aviso (día 10–15).</strong> «El proyecto X queda en
                pausa por falta de aprobación desde el [fecha]; reprogramamos hitos al retomar».
                Es el paso que la mayoría evita por miedo y que es el más sano: pausar{" "}
                <em>avisando</em> protege las dos partes, congela expectativas de fecha y suele
                destrabar en 48 horas lo que llevaba semanas atascado. Detallamos el movimiento
                en{" "}
                <Link
                  to="/blogs/proyecto-atrasado-que-hacer"
                  className="underline underline-offset-2"
                >
                  qué hacer con un proyecto atrasado
                </Link>
                .
              </li>
              <li>
                <strong>Cerrar el bloqueo y reprogramar (al volver).</strong> Cuando llega la
                respuesta, las fechas no se recomponen solas: los hitos que dependían del plazo
                perdido se mueven explícitamente, con el cliente de acuerdo por escrito. El
                silencio del cliente nunca debe pagarlo tu calendario.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Protegerte para el próximo proyecto",
        body: (
          <>
            <p>
              El cliente que no responde es parcialmente un problema del contrato anterior:
              algo dejó que el silencio fuera gratis. Tres candados para la próxima:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Aprobaciones con fecha en el plan.</strong> Cada aprobación del cliente
                es una tarea con responsable (del lado del cliente) y fecha, visible en el mismo
                tablero que el resto. Lo que está en el plan se cumple más que lo que está en un
                correo — para eso sirve el{" "}
                <Link
                  to="/blogs/plan-de-comunicacion-proyecto"
                  className="underline underline-offset-2"
                >
                  plan de comunicación
                </Link>
                .
              </li>
              <li>
                <strong>Cláusula de silencio positivo.</strong> «Las entregas parciales se
                consideran aceptadas si no hay observaciones en 5 días hábiles.» Es la cláusula
                que evita que una omisión bloquee hitos y pagos; la usan los contratos
                profesionales desde hace décadas.
              </li>
              <li>
                <strong>Regla de pausa automática.</strong> «Si el proyecto se detiene más de X
                días esperando insumos o aprobaciones del cliente, las fechas se reprograman y
                el tiempo detenido se factura si excede Y.» No se activa casi nunca — y por eso
                mismo funciona: hace que el silencio tenga precio.
              </li>
            </ul>
            <p>
              Y un cambio de marco para cerrar: el cliente que responde tarde no es tu enemigo —
              es un stakeholder ocupado cuyo costo de responderte estás obligado a bajar. Mensajes
              de una decisión, canales únicos y rituales fijos no son burocracia: son la diferencia
              entre perseguir respuestas y cosecharlas. Si quieres que las aprobaciones del cliente
              vivan como tareas con fecha en el mismo tablero del proyecto — un archivo local en tu
              carpeta, sin cuenta ni nube—{" "}
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
              — aprobaciones con fecha y proyecto visible, local-first.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué hacer cuando el cliente no responde?",
        answer:
          "No insistir con el mismo mensaje: cambiar la pregunta por una decisión. Enviar un recordatorio con una sola decisión concreta, opción recomendada, fecha límite y consecuencia anunciada («si no hay respuesta al viernes, pausamos»). Si tampoco funciona, escalar al sponsor del proyecto y — como último recurso sano — pausar formalmente avisando.",
      },
      {
        question: "¿Cuánto hay que esperar antes de escalar?",
        answer:
          "Como referencia: recordatorio con plazo a los 3–5 días, escalamiento al sponsor a los 7–10 y pausa formal entre el día 10 y 15. Depende del ritmo del proyecto: en una semana crítica, las mismas etapas se comprimen a días. Lo importante no es el número sino que cada paso quede escrito y tenga consecuencia anunciada.",
      },
      {
        question: "¿Cómo redacto un recordatorio que sí funcione?",
        answer:
          "Con la estructura decisión + fecha + consecuencia: una sola decisión concreta, una opción recomendada con su razón («avanzamos con A, porque X»), el plazo («antes del viernes») y qué pasa si no hay respuesta. Nada de «¿viste mi correo anterior?»: la culpa no desbloquea, la agenda sí.",
      },
      {
        question: "¿Puedo avanzar sin la aprobación del cliente?",
        answer:
          "Solo si el contrato o el acuerdo lo prevé — por ejemplo con una cláusula de silencio positivo (aprobación tácita a los 5 días hábiles) o si la decisión era de detalle y tú tienes el criterio acordado. Avanzar sobre decisiones de alcance o dinero sin aprobación convierte tu iniciativa en un sobrecosto que nadie pidió.",
      },
      {
        question: "¿Cómo evitar que el cliente vuelva a dejar de responder?",
        answer:
          "Tres candados desde el kickoff: aprobaciones como tareas con fecha y responsable (del lado del cliente) en el mismo tablero del proyecto, cláusula de silencio positivo en el contrato, y regla de pausa automática si el proyecto se detiene más de X días esperando insumos. El silencio deja de ser gratis.",
      },
    ],
  },
};
