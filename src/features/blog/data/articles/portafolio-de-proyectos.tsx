import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "portafolio-de-proyectos",
  title: "Portafolio de proyectos: ver varios sin perder el hilo",
  excerpt:
    "Portafolio de proyectos: qué es, cómo se diferencia de gestionar varios a la vez, las tres decisiones que resuelve y el ritual mensual de 30 minutos para priorizar con datos.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-07",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "scrumban",
  related: ["scrumban", "gestionar-varios-proyectos-a-la-vez", "dashboard-de-proyectos"],
  seo: {
    title: "Portafolio de proyectos: ver varios sin perder el hilo | Hito",
    description:
      "Portafolio de proyectos: qué es, cómo se diferencia de gestionar varios proyectos y qué vistas y rituales necesita para priorizar con datos, no con intuición.",
    ogImageAlt: "Vista de portafolio con varios proyectos, estado y capacidad.",
  },
  content: {
    eyebrow: "Control y métricas",
    intro: (
      <>
        <strong>En una línea:</strong> un portafolio de proyectos es la capa donde decides entre
        proyectos —qué avanza, quién puede hacerlo y qué se pausa— mientras cada equipo sigue
        trabajando en su tablero. Gestionar varios proyectos a la vez es sobrevivir al día; el
        portafolio es mirar el tablero completo una vez al mes.
      </>
    ),
    sections: [
      {
        heading: "Qué es un portafolio de proyectos (y en qué se diferencia de tener 6 tableros abiertos)",
        body: (
          <>
            <p>
              Tener seis tableros abiertos no es tener un portafolio: es tener seis frentes
              compitiendo por las mismas personas sin una mesa donde arbitrar. El portafolio de
              proyectos es exactamente esa mesa: una capa por encima de los tableros donde viven
              las decisiones que un tablero individual no puede tomar —cuántos proyectos caben,
              cuál va primero y cuál se detiene—.
            </p>
            <p>
              La diferencia con la sobrecarga diaria es de altitud. El día a día de los múltiples
              frentes —el cambio de contexto permanente, los bloqueos cruzados, la sensación de
              avanzar en todos y terminar en ninguno— lo trabajamos en{" "}
              <Link
                to="/blogs/gestionar-varios-proyectos-a-la-vez"
                className="underline underline-offset-2"
              >
                cómo gestionar varios proyectos a la vez
              </Link>
              ; ese post es la defensa táctica. Este es la capa de decisión: con el caos diario
              controlado, el portafolio responde la pregunta estratégica que ninguna lista de
              tareas contesta sola: ¿estamos trabajando en lo correcto, en el orden correcto, con
              la gente correcta?
            </p>
            <p>
              Un portafolio mínimo tiene tres ingredientes: una vista única con el estado de todos
              los proyectos, un criterio escrito para priorizar entre ellos y un ritual periódico
              donde esas decisiones se toman de verdad. Sin el ritual, la vista es decorativa; sin
              la vista, el ritual es opinión.
            </p>
          </>
        ),
      },
      {
        heading: "Las 3 decisiones del nivel portafolio",
        body: (
          <>
            <p>
              Todo lo que pasa en la capa de portafolio se reduce a tres decisiones. Si tu revisión
              mensual no termina tomando alguna de estas tres, fue una reunión de estado, no una
              revisión de portafolio:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Priorizar entre proyectos.</strong> Cuando dos proyectos necesitan a la
                misma persona la misma semana, alguien tiene que decidir cuál espera. En el nivel
                de proyecto esa decisión no se puede tomar: cada líder defiende lo suyo, y con
                razón. El criterio puede ser simple —valor, urgencia contractual, dependencia—,
                pero tiene que estar escrito antes del conflicto, no durante.
              </li>
              <li>
                <strong>Asignar capacidad.</strong> Decidir cuánta gente dedicada recibe cada
                proyecto y por cuánto tiempo, contra la capacidad real del equipo y no contra la
                nominal. Un portafolio que asigna el 130 % de su gente no tiene seis proyectos:
                tiene seis promesas incumplibles.
              </li>
              <li>
                <strong>Matar o pausar proyectos.</strong> La decisión que nadie toma y que el
                portafolio existe para forzar. Un proyecto zombi consume la mejor persona del
                equipo en reuniones y contexto mental. Pausarlo por escrito —con qué necesitaría
                para volver— es la decisión de mayor impacto y la menos tomada.
              </li>
            </ol>
            <p>
              Fíjate que las tres son decisiones de dirección, no de ejecución. Por eso el
              portafolio no reemplaza a los tableros: los alimenta con datos y de vuelta recibe
              órdenes.
            </p>
          </>
        ),
      },
      {
        heading: "Las vistas mínimas del portafolio",
        body: (
          <>
            <p>
              Cuatro vistas alcanzan para decidir. Más que eso y la vista deja de mirarse:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Vista</th>
                  <th className="py-2 pr-4 font-semibold">Qué muestra</th>
                  <th className="py-2 font-semibold">Pregunta que responde</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Estado semáforo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Verde, amarillo o rojo por proyecto, con criterio de color acordado y escrito.
                  </td>
                  <td className="py-2 text-muted-foreground">¿Dónde está el problema?</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Avance contra plan</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Porcentaje real contra línea base, y su tendencia de las últimas semanas.
                  </td>
                  <td className="py-2 text-muted-foreground">¿Esto va a llegar?</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Demanda contra capacidad</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Trabajo pedido por todos los proyectos contra las personas realmente
                    disponibles.
                  </td>
                  <td className="py-2 text-muted-foreground">¿Cabe todo, o hay que pausar?</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Próximas entregas</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Las fechas comprometidas de todos los proyectos en un solo calendario.
                  </td>
                  <td className="py-2 text-muted-foreground">¿Qué vence este mes?</td>
                </tr>
              </tbody>
            </table>
            <p>
              El requisito técnico de las cuatro: que se alimenten del trabajo diario, no de
              reportes manuales. Si el estado del proyecto hay que redactarlo cada mes, la vista
              miente o caduca. Las mismas vistas a nivel de un solo proyecto y cómo construirlas
              están en{" "}
              <Link to="/blogs/dashboard-de-proyectos" className="underline underline-offset-2">
                dashboard de proyectos
              </Link>
              ; el portafolio es ese tablero subido un piso.
            </p>
          </>
        ),
      },
      {
        heading: "El ritual mensual de revisión de portafolio (30 min)",
        body: (
          <>
            <p>
              La capa de decisión necesita un momento fijo. Media hora al mes, con agenda cerrada:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Estado en 5 minutos.</strong> Recorrer la vista semáforo. Solo se habla de
                lo rojo y de lo amarillo que empeoró; los verdes no consumen reunión.
              </li>
              <li>
                <strong>Desvíos en 10 minutos.</strong> Para cada proyecto fuera de plan: qué lo
                causó, si el desvío está registrado como cambio y qué decide la mesa —más plazo,
                menos alcance o más gente—.
              </li>
              <li>
                <strong>Capacidad y prioridad en 10 minutos.</strong> Mirar demanda contra
                capacidad del mes entrante y confirmar o cambiar el orden. Aquí es donde se
                reasigna gente y se aplazan proyectos que no caben.
              </li>
              <li>
                <strong>Decisiones en 5 minutos.</strong> Cerrar con las decisiones por escrito:
                qué entra, qué espera, qué se pausa y quién lo comunica. Una revisión sin registro
                de decisiones se repite como discusión el mes siguiente.
              </li>
            </ol>
            <p>
              La cadencia mensual funciona para la mayoría; con proyectos muy cortos o muy
              volátiles, quincenal. Más frecuente que eso convierte la revisión en una reunión de
              estado, y menos frecuente deja pasar los zombis.
            </p>
          </>
        ),
      },
      {
        heading: "Señales de que tu portafolio está roto",
        body: (
          <>
            <p>
              Un portafolio disfuncional avisa con patrones reconocibles. Si te reconoces en dos de
              estos, la capa de decisión no está operando:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Todo está en amarillo.</strong> Cuando el amarillo es la zona cómoda que no
                obliga a decidir, el semáforo perdió su criterio. Hay que redefinir qué significa
                cada color y volver a pintar.
              </li>
              <li>
                <strong>Nadie sabe qué pausar.</strong> Si la pregunta «si tuviéramos que dejar uno
                hoy, ¿cuál?» no tiene respuesta rápida, es porque nunca se priorizó de verdad: los
                seis proyectos son igual de importantes, que es otra forma de decir que ninguno lo
                es.
              </li>
              <li>
                <strong>Los proyectos nunca mueren.</strong> Hace un año había cuatro proyectos y
                hoy hay siete, ninguno cerrado ni pausado. Los zombis no se matan solos: solo una
                revisión explícita los retira.
              </li>
              <li>
                <strong>La capacidad es invisible.</strong> Se aceptan proyectos nuevos sin
                consultar quién los hará. El portafolio sin la vista de demanda contra capacidad es
                una lista de deseos con formato corporativo.
              </li>
            </ul>
            <p>
              El proceso diario donde cada proyecto se ejecuta —tablero, WIP, ritmos— sigue vivo en{" "}
              <Link to="/blogs/scrumban" className="underline underline-offset-2">
                ScrumBan
              </Link>
              ; el portafolio no lo cambia, solo decide arriba.
            </p>
            <p>
              Si quieres esa vista única de portafolio sin licencias por asiento —dashboard de
              portafolio sobre tableros kanban con límites WIP, datos en JSON local en tu carpeta,
              sin cuenta—{" "}
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
              — mira todos tus proyectos en una vista, local-first, sin nube.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un portafolio de proyectos?",
        answer:
          "Es la capa de decisión por encima de los tableros individuales: una vista única con el estado de todos los proyectos en marcha, un criterio para priorizar entre ellos y un ritual periódico donde se asigna capacidad y se decide qué avanza, qué espera y qué se pausa. No reemplaza la gestión de cada proyecto; decide entre proyectos.",
      },
      {
        question: "¿Cuál es la diferencia entre portafolio, programa y proyecto?",
        answer:
          "El proyecto es una entrega con fecha y alcance; el programa coordina varios proyectos relacionados entre sí porque comparten un objetivo; el portafolio agrupa todos los proyectos y programas de la organización —relacionados o no— para decidir dónde va la capacidad limitada. Un programa gestiona dependencias; un portafolio gestiona prioridad y recursos.",
      },
      {
        question: "¿Cómo priorizar proyectos en un portafolio?",
        answer:
          "Con un criterio escrito antes del conflicto: valor para el negocio, urgencia contractual o de fecha comprometida, dependencias con otros proyectos y costo de pausarlo. Se aplica en la revisión periódica comparando la demanda de todos los proyectos contra la capacidad real disponible; si no cabe, se aplaza el de menor prioridad por decisión explícita, no por desgaste.",
      },
      {
        question: "¿Qué herramientas sirven para gestionar un portafolio?",
        answer:
          "Una que ofrezca vista única de todos los proyectos con estado, avance contra plan, demanda contra capacidad y próximas entregas, alimentada del trabajo diario en lugar de reportes manuales. Las suites corporativas lo hacen con licencias por asiento pesadas; herramientas con dashboard de portafolio y kanban integrado cubren el mismo suelo para equipos de hasta 15 personas.",
      },
      {
        question: "¿Cada cuánto revisar el portafolio de proyectos?",
        answer:
          "Una vez al mes en una sesión de 30 minutos con agenda cerrada: estado, desvíos, capacidad y decisiones por escrito. Si los proyectos son muy cortos o el contexto cambia rápido, quincenal. Más seguido degenera en reunión de estado; menos seguido permite que los proyectos zombi sigan consumiendo capacidad sin que nadie los cuestione.",
      },
    ],
  },
};
