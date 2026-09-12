import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "onboarding-de-clientes",
  title: "Onboarding de clientes: las dos semanas que definen el proyecto",
  excerpt:
    "El onboarding de clientes es el proceso que convierte una firma en un proyecto que arranca bien: qué recolectar antes de empezar, la agenda de la primera semana y los 4 errores clásicos.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-10",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "cuanto-cobrar-por-un-proyecto",
  related: [
    "cuanto-cobrar-por-un-proyecto",
    "kickoff-de-proyecto",
    "gestionar-proyectos-con-clientes",
    "acta-constitucion-proyecto",
  ],
  seo: {
    title: "Onboarding de clientes: las 2 primeras semanas | Hito",
    description:
      "Onboarding de clientes en proyectos: qué es, qué recolectar antes de arrancar, la agenda de la primera semana en 5 pasos y los errores que cuestan meses.",
    ogImageAlt: "Checklist de onboarding de cliente para el inicio de un proyecto.",
  },
  content: {
    eyebrow: "Dinero y clientes",
    intro: (
      <>
        <strong>En una línea:</strong> el onboarding de clientes es el proceso con el que pasas de
        la firma al proyecto en marcha — expectativas documentadas, accesos, canales y un primer
        entregable rápido — y las dos semanas que invierte en él determinan las dos que el
        proyecto no va a poder recuperar después.
      </>
    ),
    sections: [
      {
        heading: "Qué es el onboarding de clientes (y en qué se diferencia del kickoff)",
        body: (
          <>
            <p>
              El onboarding de clientes es el conjunto de pasos que llevan de «firmamos» a
              «trabajamos con fluidez»: reunir lo que falta, documentar qué espera el cliente,
              activar los canales de trabajo y producir el primer resultado visible. Es un{" "}
              <strong>proceso</strong> — dura días o semanas — no una reunión.
            </p>
            <p>
              Por eso no es lo mismo que el{" "}
              <Link to="/blogs/kickoff-de-proyecto" className="underline underline-offset-2">
                kickoff
              </Link>
              : el kickoff es la reunión inaugural donde se presentan objetivos, plan y equipo;
              el onboarding es todo lo que rodea a esa reunión para que tenga consecuencias. El
              kickoff sin onboarding es esa primera reunión bonita después de la cual nadie sabe
              dónde están los accesos al servidor ni quién aprueba los diseños. La relación
              entre ambos es la misma que entre una{' '}
              <Link
                to="/blogs/acta-constitucion-proyecto"
                className="underline underline-offset-2"
              >
                acta de constitución
              </Link>{" "}
              y la planificación que la vuelve operativa.
            </p>
            <p>
              Por qué importa tanto el inicio: los primeros quince días fijan el patrón de
              trabajo — quién pregunta, quién responde, cuánto tarda una aprobación, qué se
              considera «listo». Ese patrón, una vez instalado, es casi imposible de renegociar
              en el mes 3. Los proyectos con clientes que se vuelven eternos casi nunca se
              torcieron a mitad de camino: se torcieron en la semana 2.
            </p>
          </>
        ),
      },
      {
        heading: "Qué recolectar antes de escribir la primera línea",
        body: (
          <>
            <p>
              La causa número uno de semanas perdidas no es el trabajo difícil: es el trabajo
              bloqueado por algo que no se pidió a tiempo. El checklist mínimo de arranque:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Categoría</th>
                  <th className="py-2 pr-4 font-semibold">Qué pedir</th>
                  <th className="py-2 font-semibold">Si falta, se rompe…</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Accesos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Servidores, dominios, cuentas, repositorios, herramientas donde haya que
                    entrar.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Todo: es el bloqueo más tonto y más común.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Materiales</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Branding, contenidos, datos, documentación previa, accesos a sistemas
                    existentes.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Los primeros entregables — «te lo mando mañana» × 5.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Personas</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Mapa de contactos: quién decide, quién aprueba, quién opera el día a día (
                    <Link
                      to="/blogs/matriz-de-stakeholders"
                      className="underline underline-offset-2"
                    >
                      matriz de stakeholders
                    </Link>{" "}
                    en miniatura).
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Las aprobaciones — el proyecto se atasca en el mes 2.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Criterios</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Qué significa «bien hecho» para el cliente, ejemplos que le gustan y que no,
                    restricciones legales o de marca.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    La calidad — vueltas infinitas de «no es lo que imaginaba».
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El truco operativo: mandar este pedido <strong>en una sola comunicación,
              estructurada, con fecha límite</strong> en el momento de la firma — no pedir cada
              cosa cuando se necesita. Un cliente que recibe cuatro pedidos dispersos en dos
              semanas responde a dos; el que recibe un checklist numerado antes del kickoff
              llega al kickoff con todo.
            </p>
          </>
        ),
      },
      {
        heading: "La agenda de la primera semana, en 5 pasos",
        body: (
          <>
            <p>
              Con el material arriba, la primera semana sigue una secuencia que puedes copiar
              tal cual:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Kickoff (día 1–2).</strong> Presentación de plan, hitos, equipo y canales.
                El output no es la reunión: es el documento con expectativas acordadas —
                objetivos, alcance, roles y fechas de los primeros hitos. Si tu cliente es
                formal, ese documento es el{" "}
                <Link
                  to="/blogs/acta-constitucion-proyecto"
                  className="underline underline-offset-2"
                >
                  acta de constitución
                </Link>
                ; si es informal, un correo de «esto es lo que acordamos» alcanza.
              </li>
              <li>
                <strong>Documentar las expectativas (día 1–3).</strong> En tus palabras, por
                escrito: qué va a recibir el cliente, cuándo, con qué criterios de aceptación.
                Las expectativas que no se escriben se convierten en recuerdos selectivos — y
                siempre hay dos versiones: la del presupuesto y la del entusiasmo.
              </li>
              <li>
                <strong>Activar canales (día 2–3).</strong> Un solo lugar para las conversaciones
                del proyecto, un solo tablero de tareas visible para el cliente, y la regla de
                oro dicha en voz alta: las decisiones por escrito, las urgencias por el canal
                pactado.
              </li>
              <li>
                <strong>Primer entregable rápido (día 3–5).</strong> Algo pequeño, visible y
                fácil de acertar: el plan en su formato, una pantalla, el primer capítulo de
                contenidos. Su función no es avanzar el proyecto — es calibrar el feedback del
                cliente con stakes bajos, antes de descubrir sus gustos en el entregable caro.
              </li>
              <li>
                <strong>Ritual de revisión (fin de semana 1).</strong> La primera revisión
                semanal con el cliente: 15–30 minutos, mismo día cada semana desde ahora. Fijar
                el ritual en la semana 1 cuesta una invitación; fijarlo en el mes 2 cuesta una
                negociación.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Los 4 errores que cobran meses",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Empezar a producir sin expectativas escritas.</strong> El entusiasmo del
                arranque invita a «ir avanzando» antes de documentar qué se espera. Resultado:
                dos semanas de trabajo que el cliente recibe con «ah, yo pensaba otra cosa». La
                producción sin expectativas no es velocidad: es apuestas.
              </li>
              <li>
                <strong>Aceptar mil canales de contacto.</strong> WhatsApp del gerente, correo
                de la asistente, llamadas a tu celular… cada canal extra multiplica los lugares
                donde una decisión puede perderse. En{" "}
                <Link
                  to="/blogs/gestionar-proyectos-con-clientes"
                  className="underline underline-offset-2"
                >
                  proyectos con clientes externos
                </Link>{" "}
                lo detallamos: un canal de verdad, con respaldo escrito de lo decidido.
              </li>
              <li>
                <strong>Desaparecer entre entregas.</strong> Del «te mando el avance el lunes»
                al «aquí está todo» pasan tres semanas de silencio que el cliente vive como
                abandono — y que en la próxima factura se convierte en desconfianza. La
                comunicación regular corta vale más que la entrega brillante tardía.
              </li>
              <li>
                <strong>No definir quién aprueba.</strong> El cliente colectivo — «mandáselo al
                equipo y nos avisan» — es la receta del feedback contradictorio y de las
                aprobaciones infinitas. Un nombre por tipo de decisión, desde la primera semana.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Onboarding y confianza: el primer hito pequeño",
        body: (
          <>
            <p>
              Hay una razón psicológica por la que el onboarding bien hecho paga tanto: la
              confianza en un proyecto se construye temprano y con cosas pequeñas. Un primer
              entregable puntual, correcto y fácil de evaluar vale más que un plan maestro
              brillante — porque el cliente todavía no puede evaluar tu maestría, pero sí
              puede evaluar si llegaste a tiempo y si entendió lo que pedía.
            </p>
            <p>
              Por eso el plan de onboarding ideal incluye, además de los accesos y canales, un{" "}
              <strong>primer hito pequeño y verificable en los primeros 10 días</strong>: algo
              que el cliente pueda aceptar formalmente y que le enseñe cómo es trabajar con
              vos. Ese hito también enseña al cliente su propio rol — que aprobar tiene fecha,
              que el feedback se da en el canal del proyecto — que es la mitad invisible de
              todo onboarding: <strong>onboardear al cliente es también enseñarle a ser
              cliente</strong>.
            </p>
            <p>
              Si quieres que ese primer hito, sus criterios de aceptación y el tablero visible
              del proyecto vivan en un solo archivo local de tu carpeta — sin cuenta, sin nube,
              sin fricción para el cliente—{" "}
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
              — onboarding, hitos y tablero en un solo lugar, local-first.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es el onboarding de clientes?",
        answer:
          "Es el proceso que lleva del contrato firmado al proyecto en marcha: recolectar accesos y materiales, documentar expectativas, activar canales de comunicación y producir un primer entregable rápido. Dura días o semanas — es un proceso, no la reunión de kickoff.",
      },
      {
        question: "¿Cuánto dura un onboarding de clientes?",
        answer:
          "Entre una y dos semanas para proyectos de servicios estándar: el pedido de materiales se hace al firmar, el kickoff cae en los primeros dos días y el primer hito verificable se acepta antes del día 10. Proyectos grandes pueden extenderlo, pero nunca a costa del primer entregable rápido.",
      },
      {
        question: "¿Qué incluye un onboarding de clientes?",
        answer:
          "Cuatro bloques: accesos (servidores, cuentas, herramientas), materiales (branding, contenidos, datos), personas (quién decide, quién aprueba, quién opera) y criterios (qué significa «bien hecho» para el cliente, con ejemplos). Todo se pide de una vez, en un checklist con fecha límite, en el momento de la firma.",
      },
      {
        question: "¿Cuál es la diferencia entre onboarding y kickoff?",
        answer:
          "El kickoff es la reunión inaugural: objetivos, plan, equipo, canales. El onboarding es el proceso alrededor: lo que se pide antes, lo que se documenta después y el primer entregable que calibra el feedback. El kickoff es un paso del onboarding — la reunión no sustituye al proceso.",
      },
      {
        question: "¿Cómo se onboardea a un cliente que ya trabajó contigo?",
        answer:
          "Versión abreviada: sin presentación de canales ni reglas conocidas, pero con las tres piezas que nunca se omiten — pedido único de materiales actualizados, expectativas escritas del nuevo proyecto (porque cada proyecto es distinto) y primer hito pequeño en 10 días. La confianza previa acelera el onboarding; no lo elimina.",
      },
    ],
  },
};
