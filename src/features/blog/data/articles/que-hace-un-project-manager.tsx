import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "que-hace-un-project-manager",
  title: "Qué hace un project manager: el rol, sin humo",
  excerpt:
    "Qué hace un project manager día a día: responsabilidades reales, qué NO es su trabajo, cómo se diferencia de un product manager o scrum master y cuándo lo necesita un equipo.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-08-23",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "que-son-stakeholders",
  related: ["que-son-stakeholders", "gestion-proyectos-agencias", "metodologias-gestion-proyectos"],
  seo: {
    title: "Qué hace un project manager (sin humo) | Hito",
    description:
      "Qué hace un project manager día a día: responsabilidades reales, qué no es su trabajo, diferencias con product manager y scrum master, y cuándo contratar uno.",
    ogImageAlt: "Qué hace un project manager: responsabilidades, día a día y límites del rol.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> un <strong>project manager</strong> (PM) es la persona que
        hace que un proyecto llegue —a la fecha, al presupuesto y al alcance acordado— sin que el
        equipo se incendie en el intento. No hace el trabajo del proyecto: hace posible que quienes
        lo hacen avancen sin choques, sin bloqueos y sin sorpresas para nadie.
      </>
    ),
    sections: [
      {
        heading: "El rol en una frase y en la práctica",
        body: (
          <>
            <p>
              La definición formal: planificar, ejecutar y cerrar el proyecto cumpliendo alcance,
              tiempo y costo. La práctica se ve distinta al día a día, y es menos glamorosa de lo
              que imaginan: el PM es quien descubre el martes que dos tareas dependían de la
              misma persona, quien consigue la decisión que lleva 6 días bloqueada, quien le dice
              al cliente “eso entra, pero algo tiene que salir” y quien sabe en todo momento si el
              proyecto llega, sin preguntarle a nadie cómo van.
            </p>
            <p>
              Su variable de gestión son tres equilibrios: <strong>alcance</strong> (qué se
              entrega), <strong>fecha</strong> (cuándo) y <strong>presupuesto</strong> (con
              cuánto). Mover uno mueve los otros, y el trabajo del PM es hacer visible ese
              intercambio cuando alguien pide “solo un cambio chico”. Por eso el rol existe en
              proyectos con fecha y presupuesto definidos —y por eso no siempre hace falta.
            </p>
          </>
        ),
      },
      {
        heading: "El día a día real de un project manager",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Sostener el plan vivo:</strong> actualizar el cronograma, detectar
                dependencias rotas y recalcular la fecha proyectada cuando la realidad cambia
                (cambia siempre).
              </li>
              <li>
                <strong>Quitar bloqueos:</strong> escalar la aprobación que lleva días esperando,
                conseguir el acceso, la decisión o el dato que frena a alguien del equipo.
              </li>
              <li>
                <strong>Comunicar por niveles:</strong> un informe breve para dirección, detalle
                útil para el equipo, expectativas alineadas con el cliente. La mayoría de los
                problemas “de gestión” son problemas de comunicación mal dosificada.
              </li>
              <li>
                <strong>Administrar los cambios de alcance:</strong> recibir el pedido, estimar
                su costo real en fecha y dinero, y someterlo a decisión explícita — nunca
                absorberlo en silencio.
              </li>
              <li>
                <strong>Vigilar riesgo y presupuesto:</strong> saber cuál es el riesgo top del
                mes y si el gasto va al ritmo del avance; reaccionar en la semana en que se
                desvía, no al final.
              </li>
              <li>
                <strong>Cuidar a los interesados:</strong> mapear quién puede frenar el proyecto
                y dar a cada uno la dosis correcta de atención, empezando por los de mayor
                influencia ({" "}
                <Link
                  to="/blogs/que-son-stakeholders"
                  className="underline underline-offset-2"
                >
                  gestión de stakeholders
                </Link>
                ).
              </li>
            </ul>
            <p>
              Nada de esto es “decir a los demás qué hacer”. En proyectos sanos, el PM decide
              poco sobre el trabajo en sí y mucho sobre el orden, la información y las
              decisiones alrededor del trabajo.
            </p>
          </>
        ),
      },
      {
        heading: "Lo que NO es trabajo de un project manager",
        body: (
          <>
            <p>
              El rol se degrada cuando se confunde con otras cosas. Un PM no es:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>La secretaría del proyecto:</strong> agendar reuniones y pasar acta es
                logística que cualquiera hace; el valor del PM está en el contenido de esas
                reuniones, no en el calendario.
              </li>
              <li>
                <strong>El jefe técnico del equipo:</strong> no revisa código, no diseña, no
                decide soluciones. Si el PM sabe más del oficio que el equipo, igual su trabajo es
                remover obstáculos, no sustituir criterios.
              </li>
              <li>
                <strong>El que “motiva” con presión:</strong> apretar al equipo atrasado produce
                más retrabajo, no más avance. El PM atrasado necesita decidir alcance, no subir el
                volumen.
              </li>
              <li>
                <strong>Un resource humano al que se le asigna todo:</strong> cuando el PM
                termina haciendo la mitad de las tareas del proyecto, dejó de dirigir el proyecto
                y el proyecto se quedó sin conductor.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "PM, product manager, scrum master y PMO: quién es quién",
        body: (
          <>
            <p>
              Cuatro roles que se confunden porque todos “coordinan”, pero responden preguntas
              distintas:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Rol</th>
                  <th className="py-2 pr-4 font-semibold">Responde a</th>
                  <th className="py-2 font-semibold">Su variable central</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Project manager</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Cómo llega este proyecto a tiempo, costo y alcance?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    La ejecución de un esfuerzo con inicio y fin definidos
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Product manager</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Qué vale la pena construir y para quién?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El valor del producto en el tiempo (sin fecha de cierre)
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Scrum master</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Cómo hace el equipo para que el proceso ágil funcione?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    La salud del proceso y del equipo, no del cronograma
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">PMO</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Cómo se gestionan bien todos los proyectos de la organización?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Estándares, métodos y visibilidad del portafolio
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              En empresas pequeñas una persona cubre dos de estos roles (el PM que también hace
              de product owner es común); lo importante es saber qué sombrero lleva puesto en
              cada decisión. Y si el equipo trabaja por sprints, el PM y el scrum master
              conviven mejor cuando el proceso está claro: los artefactos de{" "}
              <Link
                to="/blogs/metodologias-gestion-proyectos"
                className="underline underline-offset-2"
              >
                cada metodología
              </Link>{" "}
              definen quién decide qué.
            </p>
          </>
        ),
      },
      {
        heading: "El rol según la industria (no es el mismo)",
        body: (
          <>
            <p>
              “Project manager” pesa distinto según dónde esté parado. En{" "}
              <strong>construcción</strong>, el PM vive de cronogramas con cientos de
              dependencias, contratos y subcontratistas; su semana se juega en la ruta crítica y
              en compras. En <strong>agencias y estudios</strong>, el PM es más coordinador de
              clientes y equipo creativo: sostiene el alcance contra el pedido eterno de “una
              cosa más”, y su herramienta de fondo es el WIP limitado por disciplina (el detalle
              en{" "}
              <Link
                to="/blogs/gestion-proyectos-agencias"
                className="underline underline-offset-2"
              >
                gestión de proyectos para agencias
              </Link>
              ). En <strong>producto digital</strong>, suele rozar el product management: el
              proyecto termina y el producto sigue, así que la frontera la marca si hay fecha de
              cierre o no.
            </p>
            <p>
              Lo que no cambia entre industrias: el PM responde por que exista un plan creíble,
              que la información fluya a cada nivel con el detalle justo, y que las decisiones de
              alcance se paguen con una decisión visible de fecha o presupuesto.
            </p>
          </>
        ),
      },
      {
        heading: "¿Tu equipo necesita un project manager?",
        body: (
          <>
            <p>
              Las señales de que falta un PM (o de que alguien ya lo está siendo sin el título):
              nadie sabe con certeza la fecha real de entrega; los bloqueos se resuelven por
              coincidencia (“lo hablé con Juan en el pasillo”); el cliente se entera de los
              atrasos antes que la dirección; y cada persona tiene su propia lista de prioridades
              contradictorias.
            </p>
            <p>
              Y la contracara: en equipos muy pequeños con proyectos cortos, un PM dedicado
              sobra —el rol lo reparten la disciplina y las plantillas (plan, cronograma,
              informe). Antes de contratar, un equipo puede cubrir el 70% del rol con{" "}
              <Link
                to="/blogs/plantillas-gestion-proyectos"
                className="underline underline-offset-2"
              >
                las plantillas básicas
              </Link>{" "}
              y una cadencia semanal estricta. Contratar PM tiene sentido cuando los proyectos ya
              son varios, comparten gente y las fechas se empiezan a prometer sin respaldo.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué hace un project manager?",
        answer:
          "Hace que un proyecto llegue a la fecha, al presupuesto y al alcance acordado: sostiene el plan vivo, quita bloqueos al equipo, administra los cambios de alcance, comunica a cada nivel la información justa y vigila riesgos y gastos. No hace el trabajo del proyecto ni dirige técnicamente al equipo: hace posible que el trabajo avance.",
      },
      {
        question: "¿Qué habilidades necesita un project manager?",
        answer:
          "Tres grupos: organización (planificación, priorización, seguimiento de dependencias), comunicación (informes por nivel, negociación de alcance, manejo de expectativas) y criterio (saber cuándo escalar, cuándo aceptar un cambio y qué sacrificio pide cada decisión de fecha o costo).",
      },
      {
        question: "¿Cuál es la diferencia entre project manager y product manager?",
        answer:
          "El project manager responde por la ejecución de un esfuerzo con inicio y fin: que llegue a tiempo, costo y alcance. El product manager responde por qué construir y para quién, gestionando el valor del producto sin fecha de cierre. Uno coordina el cómo y el cuándo; el otro decide el qué y el porqué.",
      },
      {
        question: "¿Cuál es la diferencia entre project manager y scrum master?",
        answer:
          "El scrum master cuida que el proceso ágil funcione y que el equipo pueda trabajar sin impedimentos; no gestiona cronograma ni presupuesto. El project manager responde por la entrega completa del proyecto. En equipos pequeños puede ser la misma persona, cambiando de sombrero según la decisión que toque.",
      },
      {
        question: "¿Cuándo necesita un equipo contratar un project manager?",
        answer:
          "Cuando los proyectos son varios y comparten personas, las fechas se prometen sin respaldo, los bloqueos se resuelven por casualidad y los clientes se enteran de los atrasos antes que la dirección. En equipos chicos con proyectos cortos, el rol se puede cubrir con plantillas básicas y una cadencia semanal estricta antes de contratar.",
      },
    ],
  },
};
