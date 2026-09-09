import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "alternativa-a-ms-project",
  title: "Alternativas a MS Project en 2026: 7 opciones según tu caso",
  excerpt:
    "Alternativas a MS Project: tabla honesta de 7 opciones con sus techos reales, cuál elegir según tu equipo y qué funciones vas a perder al salir del estándar.",
  category: "comparativas",
  categoryLabel: "Comparativas",
  publishedAt: "2026-09-07",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "hito-project-gestion-por-hitos",
  related: [
    "hito-project-gestion-por-hitos",
    "software-gestion-proyectos",
    "alternativa-a-jira",
  ],
  seo: {
    title: "Alternativas a MS Project en 2026: 7 según tu caso | Hito",
    description:
      "Alternativas a MS Project: tabla honesta de 7 opciones con techos reales, cuál según tu equipo y qué pierdes al salir (recursos, nivelación, EVM).",
    ogImageAlt: "Siete alternativas a MS Project comparadas por caso de uso.",
  },
  content: {
    eyebrow: "Comparativa de herramientas",
    intro: (
      <>
        <strong>En una línea:</strong> buscas una alternativa a MS Project por precio, curva de
        aprendizaje o porque tu equipo de 10 no necesita nivelación de recursos. Hay 7 caminos
        serios en 2026, cada uno con un techo real que conviene conocer antes de migrar, y esta
        comparativa no esconde ninguno.
      </>
    ),
    sections: [
      {
        heading: "Por qué se busca alternativa a MS Project",
        body: (
          <>
            <p>
              MS Project sigue siendo el estándar de la planificación seria —obras, PMO,
              ingeniería—. Pero el motivo por el que llegaste aquí suele ser uno de estos cuatro:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Precio y mantenimiento.</strong> Licencia por usuario más la disciplina de
                mantener el plan: el costo real es el tiempo de quien lo actualiza cada semana.
              </li>
              <li>
                <strong>Curva de aprendizaje.</strong> Es una herramienta técnica: sin formación,
                el equipo usa el 5 % de las funciones y desconfía del resto.
              </li>
              <li>
                <strong>Sobrado para tu escala.</strong> Nivelación de recursos y valor ganado no
                resuelven nada en un equipo de 6 personas con 3 proyectos medianos.
              </li>
              <li>
                <strong>Atado al escritorio.</strong> El proyecto vive en un archivo en una
                computadora con Windows; compartirlo es exportar o pagar la capa online aparte.
              </li>
            </ol>
            <p>
              La pregunta correcta no es cuál es mejor en abstracto, sino qué necesitas de verdad.
              Si tu respuesta es Gantt con recursos y EVM, revisa cómo funcionan los{" "}
              <Link to="/blogs/hito-en-ms-project" className="underline underline-offset-2">
                hitos en MS Project
              </Link>{" "}
              y probablemente te convenga quedarte. Si tu respuesta son hitos claros y
              visibilidad, sigue leyendo.
            </p>
          </>
        ),
      },
      {
        heading: "La tabla honesta: 7 opciones y su techo real",
        body: (
          <>
            <p>
              Siete caminos, siete techos. Ninguna opción lo hace todo, y la que dice hacerlo
              cuesta en otra moneda: ruido, precio o mantenimiento. Para ordenar el panorama
              general antes de elegir, la guía del{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos
              </Link>{" "}
              te ayuda a definir qué categoría buscas.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Herramienta</th>
                  <th className="py-2 pr-4 font-semibold">Ideal para</th>
                  <th className="py-2 font-semibold">Techo real</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">TeamGantt</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Agencias que comparten cronogramas con clientes.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Sin gestión de recursos avanzada ni EVM; escala mal en carteras grandes.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">GanttPro</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Pymes que quieren Gantt accesible y precio claro.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Nivelación de recursos básica; colaboración en tiempo real limitada.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">OpenProject</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipos técnicos que quieren open source con Gantt y EVM.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Necesitas servidor y quien lo mantenga; la interfaz exige paciencia.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">ProjectLibre</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Quien necesita gratis y familiar: WBS, Gantt y recursos.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Interfaz pobre y experiencia desactualizada; sin colaboración.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">ClickUp</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipos que quieren cronograma dentro de un todo-in-one.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Ruido: el Gantt se pierde entre funciones; rendimiento irregular en planes
                    grandes.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">monday.com</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipos operativos con flujos muy visuales.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Cronograma básico; el costo por asientos escala rápido.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Hito</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipos de 1–15 con procesos, checklists y datos locales.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Sin Gantt enterprise, sin nivelación de recursos ni colaboración cloud en
                    tiempo real.
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Cuál según tu caso",
        body: (
          <>
            <p>
              La misma tabla, traducida a decisiones. «Mira primero» no significa «compra», sino
              mayor probabilidad de encajar.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Tu caso</th>
                  <th className="py-2 pr-4 font-semibold">Mira primero</th>
                  <th className="py-2 font-semibold">Por qué</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Agencia creativa con cronogramas por cliente
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">TeamGantt o GanttPro</td>
                  <td className="py-2 text-muted-foreground">
                    Gantt amable para compartir con clientes sin formación previa.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Pyme de servicios con procesos repetitivos
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Hito</td>
                  <td className="py-2 text-muted-foreground">
                    Los hitos emergen de procesos y checklists, sin depender de que alguien
                    mantenga un Gantt.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Obra ligera o empresa de remodelación
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">GanttPro o Hito</td>
                  <td className="py-2 text-muted-foreground">
                    Hitos de obra con evidencia y línea de tiempo simple, sin desktop.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipo técnico que necesita EVM open source
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">OpenProject</td>
                  <td className="py-2 text-muted-foreground">
                    Gantt, WBS y valor ganado sin licencia, asumiendo el mantenimiento.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipo de desarrollo con backlog vivo
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Otra categoría: mira estas{" "}
                    <Link
                      to="/blogs/alternativa-a-jira"
                      className="underline underline-offset-2"
                    >
                      alternativas a Jira
                    </Link>
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Si el problema es el seguimiento del trabajo y no el cronograma, un Gantt no
                    es la respuesta.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipo de 1 a 5 personas sin PM dedicado
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Hito</td>
                  <td className="py-2 text-muted-foreground">
                    Sin curva de aprendizaje, sin cuenta y sin costo: el plan es la lista de
                    hitos.
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Qué vas a perder al salir de MS Project",
        body: (
          <>
            <p>
              Honestidad total: al salir pierdes funciones que las alternativas ligeras no
              replican, y conviene saberlo antes de migrar y no después del primer conflicto:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Calendarios de recursos.</strong> Turnos, vacaciones y disponibilidad por
                recurso con precisión de horas; las alternativas usan capacidades gruesas.
              </li>
              <li>
                <strong>Nivelación automática.</strong> MS Project reacomoda tareas cuando un
                recurso se sobreasigna; en las alternativas ligeras, la nivelación eres tú mirando
                el tablero.
              </li>
              <li>
                <strong>EVM nativo.</strong> El{" "}
                <Link
                  to="/blogs/valor-ganado-evm"
                  className="underline underline-offset-2"
                >
                  valor ganado (EVM)
                </Link>{" "}
                con curva S e índices de desempeño calculados; si tu contrato lo exige, quédate en
                MS Project o considera OpenProject.
              </li>
              <li>
                <strong>Rigor de dependencias.</strong> Restricciones, lead/lag y camino crítico
                recalculado al segundo; los tableros ligeros simplifican las dependencias a su
                favor.
              </li>
            </ul>
            <p>
              Si tu proyecto necesita dos o tres de esas funciones de verdad —no por costumbre—,
              ninguna alternativa ligera te va a servir. El error inverso también existe: pagar
              por nivelación de recursos con un equipo de 4 personas es comprar un camión para
              llevar las compras.
            </p>
          </>
        ),
      },
      {
        heading: "Migración en una tarde",
        body: (
          <>
            <p>
              Si tu caso es de los ligeros, salir de MS Project no es un proyecto de migración: es
              una tarde. El orden que funciona:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Exporta el plan a Excel.</strong> MS Project exporta WBS, duraciones,
                fechas y hitos a una hoja; esa hoja es tu inventario completo.
              </li>
              <li>
                <strong>Mapea WBS a entregables y hitos.</strong> Los paquetes de trabajo se
                vuelven entregables con dueño; los hitos siguen siendo hitos, ahora con el
                criterio de cumplido escrito —la misma idea de la{" "}
                <Link
                  to="/blogs/hito-project-gestion-por-hitos"
                  className="underline underline-offset-2"
                >
                  gestión por hitos
                </Link>
                —.
              </li>
              <li>
                <strong>Tira lo que nadie actualiza.</strong> Dependencias al detalle, recursos al
                25 % y restricciones cosméticas se quedan en el archivo viejo, que sirve de
                respaldo.
              </li>
              <li>
                <strong>Corre un piloto de 4 semanas.</strong> Un proyecto en paralelo: el equipo
                trabaja en la herramienta nueva; el plan viejo se congela.
              </li>
              <li>
                <strong>Decide con datos del piloto.</strong> Si a las 4 semanas los hitos se
                miran cada semana, la migración está hecha; si no, el problema nunca fue el
                software.
              </li>
            </ol>
            <p>
              Si tu escala es la de un equipo de 1 a 15 personas y lo que necesitas son hitos
              verificables más que un Gantt de recursos,{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              existe justo para eso: local-first, sin cuenta ni asientos, con procesos,
              checklists, automatizaciones y dashboard de portafolio.
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
              — marca tus hitos, comparte la carpeta y deja el Gantt enterprise para cuando lo
              necesites.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Cuál es la mejor alternativa a MS Project?",
        answer:
          "Depende de tu caso: para Gantt amable en pymes y agencias, TeamGantt o GanttPro; para open source con EVM, OpenProject; para equipos de 1 a 15 personas que trabajan por procesos, Hito. La mejor es la que cumple lo que tu proyecto exige de verdad, no lo que MS Project hace de más: parte del caso de uso, no de la lista de funciones.",
      },
      {
        question: "¿Hay alguna alternativa gratis a MS Project?",
        answer:
          "Sí: ProjectLibre y OpenProject Community son gratis y open source, con WBS, Gantt y recursos; OpenProject añade EVM a cambio de mantener un servidor. Las opciones local-first como Hito también son gratuitas sin límite de usuarios, aunque con otro enfoque: procesos, checklists e hitos en lugar de planificación de recursos.",
      },
      {
        question: "¿ProjectLibre es igual a MS Project?",
        answer:
          "Es lo más parecido en concepto —WBS, Gantt, dependencias y recursos—, pero no en experiencia: la interfaz es pobre, la curva se aprende sin manuales modernos y algunas importaciones de MS Project se rompen. Para planear solo alcanza; para trabajar en equipo, se queda corto.",
      },
      {
        question: "¿Qué pierdo si dejo MS Project?",
        answer:
          "Principalmente funciones enterprise: calendarios de recursos por hora, nivelación automática de sobreasignaciones, EVM nativo con curva S y el recalculo estricto de dependencias y camino crítico. Si usas dos o más de esas funciones de verdad, ninguna alternativa ligera te reemplaza completa.",
      },
      {
        question: "¿Qué usan los equipos pequeños en lugar de MS Project?",
        answer:
          "Un Gantt simple como GanttPro o TeamGantt cuando venden cronogramas, o un gestor local de procesos e hitos como Hito cuando el trabajo se repite por etapas. Muchos equipos de 1 a 15 personas terminan reconociendo que no necesitan Gantt: necesitan 5 a 10 hitos visibles con criterio de cumplido y un tablero.",
      },
    ],
  },
};
