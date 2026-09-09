import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "hitos-en-metodologias-agiles",
  title: "¿Los proyectos ágiles tienen hitos? Sí: estos son los que cuentan",
  excerpt:
    "Hitos en metodologías ágiles: el MVP, las releases y el onboarding como hitos reales (el fin de sprint no lo es), y cómo marcarlos sin traicionar la iteración.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-05",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "hito-project-gestion-por-hitos",
  related: [
    "hito-project-gestion-por-hitos",
    "scrumban",
    "historias-de-usuario",
  ],
  seo: {
    title: "¿Hitos en Scrum y Agile? Sí: estos son los que cuentan | Hito",
    description:
      "Hitos en metodologías ágiles: MVP, releases y onboarding como hitos reales (el fin de sprint no lo es), y cómo marcarlos sin traicionar la iteración.",
    ogImageAlt: "Roadmap ágil con hitos: MVP, release y onboarding entre sprints.",
  },
  content: {
    eyebrow: "Hitos ágiles",
    intro: (
      <>
        <strong>En una línea:</strong> los hitos en Scrum y en agile existen y cuentan: el MVP,
        cada release a producción, el onboarding de un cliente grande o el cierre de quarter son
        puntos de control reales. El fin de sprint no lo es: eso es cadencia, no compromiso.
        Negarlos no los elimina: solo los esconde en un Excel.
      </>
    ),
    sections: [
      {
        heading: "La objeción ágil: los hitos huelen a cascada",
        body: (
          <>
            <p>
              Pregunta en cualquier retrospectiva si quieren volver a los hitos y vas a escuchar
              la objeción: los hitos huelen a cascada —fechas fijas, Big Design Up Front, un
              gerente actualizando el plan mientras el equipo trabaja—. Es una objeción con
              historia: muchos equipos salieron de culturas donde el milestone era un arma para
              presionar, no un punto de control para decidir.
            </p>
            <p>
              Pero la objeción es falsa en la práctica, porque las cosas que requieren hitos no
              desaparecen por iterar: el cliente necesita una fecha de lanzamiento para su
              campaña; el contrato tiene entregables con fecha; el equipo comercial promete el
              onboarding para el día que firmó; el quarter cierra el 31 de marzo con o sin tu
              release. Negar los hitos no los elimina: solo los manda al Excel del gerente, fuera
              de la vista del equipo que tiene que cumplirlos.
            </p>
            <p>
              La salida no es elegir entre sprint y hito, sino distinguir qué es cada cosa: el
              sprint organiza el trabajo interno; el hito compromete un resultado verificable
              hacia afuera. Son capas distintas del mismo plan, y la{" "}
              <Link
                to="/blogs/hito-project-gestion-por-hitos"
                className="underline underline-offset-2"
              >
                gestión por hitos verificables
              </Link>{" "}
              convive perfectamente con la iteración cuando cada capa respeta su lugar.
            </p>
          </>
        ),
      },
      {
        heading: "Los hitos que sí existen en agile",
        body: (
          <>
            <p>
              Estos son los mojones reales de un producto ágil, con la razón por la que cuentan
              aunque tu proceso no use la palabra «hito» ni una sola vez:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Hito</th>
                  <th className="py-2 pr-4 font-semibold">Qué verifica</th>
                  <th className="py-2 font-semibold">Por qué cuenta</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    MVP o primera versión usable
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Que existe algo en manos de usuarios reales.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Es el primer compromiso externo del producto; se define con alcance, no con
                    fechas.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Release a producción</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Que lo construido llega de verdad a los clientes.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Cada despliegue mayor es un mojón de mercado, no de equipo.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Onboarding de un cliente grande
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Que el producto soporta un caso de pago real.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Suele ser compromiso contractual, con fecha y criterio de aceptación.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Cierre de quarter o época</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Que la época cerró con sus objetivos.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Punto natural de control del roadmap: se revisa, se reordena y se
                    recompromete.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Y la aclaración que más discusiones ahorra: el fin de sprint <strong>no</strong> es
              un hito. Es cadencia: un ritmo que termina siempre, se logre el objetivo o no. Un
              hito es un punto de control que puede fallar y que, por eso, se gestiona con
              anticipación; el fin de sprint no puede fallar, porque pasa igual. Si cada viernes
              es un hito, ningún viernes es un punto de control. Lo que el sprint aporta es otra
              cosa: el sprint goal, que el equipo acuerda en el{" "}
              <Link
                to="/blogs/sprint-planning-como-hacerlo"
                className="underline underline-offset-2"
              >
                sprint planning
              </Link>{" "}
              y vive dentro del equipo.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo marcarlos sin traicionar la iteración",
        body: (
          <>
            <p>
              Una regla separa el hito sano del hito cascada: el hito es un compromiso verificable
              hacia afuera —cliente, mercado, otra área—, nunca una fecha inventada hacia adentro
              para presionar al equipo. «MVP en manos de 20 usuarios piloto el 15 de octubre» es
              un hito; «terminar el módulo de facturación el 15 de octubre» es una fecha
              disfrazada de compromiso.
            </p>
            <p>
              El alcance del hito se define con{" "}
              <Link
                to="/blogs/historias-de-usuario"
                className="underline underline-offset-2"
              >
                historias de usuario
              </Link>{" "}
              y sus criterios de aceptación: el hito se cumple cuando esas historias están hechas
              según su criterio, no cuando el calendario lo dice. Así la fecha es consecuencia del
              alcance acordado, y no al revés.
            </p>
            <p>
              Tampoco el hito cambia el cómo: el equipo sigue entregando en incrementos, sigue su
              ritmo y renegocia alcance dentro de la época. Lo único que fija el hito es el
              momento y el criterio de una verificación externa. Y hay una diferencia de
              comportamiento clave: cuando un hito está en riesgo, la iteración lo discute a la
              vista de todos; en cascada, el riesgo se esconde en el plan hasta que explota.
            </p>
          </>
        ),
      },
      {
        heading: "Dónde caben los hitos según el método",
        body: (
          <>
            <p>
              <strong>En Scrum</strong>, los hitos viven a nivel de release y de quarter; el
              sprint aporta el goal interno. El product owner alimenta el roadmap de hitos y el
              equipo los defiende construyendo incrementos sprint a sprint. Ninguna ceremonia
              nueva: los hitos son contenido del backlog, no una capa de gestión aparte.
            </p>
            <p>
              <strong>En Kanban</strong> pasa lo contrario que muchos creen: al no haber
              iteraciones, los hitos son aún más necesarios, porque son los únicos puntos de
              control que quedan. Entregas a producción, cierres de servicio, compromisos con
              clientes: el flujo continuo no reemplaza el punto de control; lo vuelve más visible
              porque todo lo demás está siempre en movimiento.
            </p>
            <p>
              <strong>En el híbrido</strong>, muchos equipos trabajan con cadencia de sprint pero
              comprometen hitos por quarter —scrumban en los hechos—. Si ese es tu caso, conviene
              saber qué se gana y qué se pierde con el{" "}
              <Link to="/blogs/scrumban" className="underline underline-offset-2">
                scrumban
              </Link>{" "}
              antes de mezclar ceremonias, porque el híbrido mal hecho hereda los vicios de los
              dos mundos.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo: roadmap de 2 quarters con 5 hitos",
        body: (
          <>
            <p>
              Un producto B2B mediano, dos quarters, cinco hitos. Ninguno dice «terminar epics»:
              todos se verifican hacia afuera, y ninguno coincide con el fin de un sprint.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Quarter</th>
                  <th className="py-2 pr-4 font-semibold">Hito</th>
                  <th className="py-2 font-semibold">Verificación</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Q1</td>
                  <td className="py-2 pr-4 text-muted-foreground">MVP en producción</td>
                  <td className="py-2 text-muted-foreground">
                    20 usuarios piloto activos con el flujo principal completo.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Q1</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Primer cliente de pago onboarded
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Contrato firmado, datos migrados y primera facturación emitida.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Q2</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Release 2.0 con integraciones
                  </td>
                  <td className="py-2 text-muted-foreground">
                    API pública documentada y 3 integraciones en uso real.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Q2</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Certificación de seguridad
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Auditoría externa aprobada: informe sin hallazgos críticos.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Q2</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Expansión del cliente ancla
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Contrato anual renovado con módulos adicionales.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Si quieres marcar estos hitos en una herramienta que vive en tu carpeta —JSON local,
              sin cuenta, sin asientos, kanban con límites WIP y procesos junto al trabajo—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              está pensada para equipos de 1 a 15 personas.
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
              — marca hitos verificables sin traicionar tu iteración, local-first, sin nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un hito en Scrum?",
        answer:
          "Es un punto de control verificable hacia afuera, como el MVP, una release a producción o el onboarding de un cliente grande; el fin de un sprint no lo es. Scrum no define hitos propios: los aporta el roadmap de producto, y el equipo los cumple construyendo por incrementos dentro de cada sprint.",
      },
      {
        question: "¿El fin de un sprint es un hito?",
        answer:
          "No: es cadencia. El sprint termina siempre, se cumpliera o no el objetivo, así que no funciona como punto de control —un hito, en cambio, puede fallar y por eso se gestiona—. Lo que el sprint aporta es el sprint goal, un compromiso interno del equipo, distinto de un hito que compromete un resultado verificable hacia el cliente o el mercado.",
      },
      {
        question: "¿Cómo se llaman los hitos en metodologías ágiles?",
        answer:
          "Se siguen llamando hitos o milestones, y suelen materializarse como releases, versiones, lanzamientos o cierres de quarter en el roadmap de producto. Las herramientas los nombran distinto —GitHub los llama milestones, Jira usa versiones, otros roadmaps hablan de objectives—, pero el concepto es el mismo: un compromiso verificable con fecha o época.",
      },
      {
        question: "¿Qué es un milestone en un roadmap de producto?",
        answer:
          "Es un compromiso verificable del producto hacia afuera: la primera versión usable, un lanzamiento, un cliente grande onboarded, una certificación. Se define con criterio de cumplido —cómo se sabe que se logró— y con una época o fecha, y ordena el roadmap sin dictar el trabajo interno de cada sprint.",
      },
      {
        question: "¿Cuál es la diferencia entre un hito y el sprint goal?",
        answer:
          "El sprint goal es el compromiso interno de una iteración: lo acuerda el equipo y solo lo verifica el equipo. El hito es un compromiso externo: lo verifican el cliente, el mercado u otra área. Un sprint puede fallar su goal sin romper nada externo; un hito que falla se nota afuera, y por eso se gestiona con anticipación.",
      },
    ],
  },
};
