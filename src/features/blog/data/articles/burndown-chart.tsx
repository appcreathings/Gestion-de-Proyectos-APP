import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "burndown-chart",
  title: "Burndown chart: qué es y cómo leerlo (sin jerga)",
  excerpt:
    "Cómo leer un burndown chart en 10 segundos: línea ideal vs. real, los 4 patrones que delatan un sprint en problemas, y cuándo un burnup cuenta mejor la historia.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-07-19",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "kpis-gestion-proyectos",
  related: ["kpis-gestion-proyectos", "kanban-limites-wip", "sprint-planning-como-hacerlo"],
  seo: {
    title: "Burndown chart: qué es y cómo leerlo | Hito",
    description:
      "Qué es un burndown chart, cómo leerlo en 10 segundos (línea ideal vs. real), los patrones que delatan problemas y cuándo un burnup es mejor opción.",
    ogImageAlt: "Burndown chart con línea ideal y línea real divergiendo a mitad de sprint.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> un <strong>burndown chart</strong> es la gráfica que cruza
        el trabajo restante de un sprint contra los días que quedan. La línea ideal baja recta
        hasta cero; la real cuenta la verdad. Si la real va por encima de la ideal, el sprint no
        va a cerrar todo lo comprometido — y lo dice a mitad de sprint, no el último día.
      </>
    ),
    sections: [
      {
        heading: "Qué es un burndown chart",
        body: (
          <>
            <p>
              El burndown nació en Scrum como la gráfica mínima de un sprint: en el eje vertical
              va la cantidad de trabajo restante (puntos, horas o número de tareas), en el eje
              horizontal los días del sprint. Cada vez que el equipo termina algo, la línea baja.
              Al final del sprint debería tocar cero.
            </p>
            <p>
              Tiene dos líneas: la <strong>ideal</strong>, recta, que asume quemado constante
              desde el total inicial hasta cero; y la <strong>real</strong>, que se dibuja con lo
              que el equipo termina cada día. Toda la lectura está en comparar las dos: la
              distancia vertical entre ellas es el trabajo que, al ritmo actual, no llegará.
            </p>
            <p>
              Su gracia es que reemplaza la pregunta “¿cómo van?” —que todos responden con un
              optimismo educado— por un dato que se actualiza solo: cuánto queda y a qué ritmo
              baja. Es uno de los pocos KPIs que cumplen la prueba de decisión: si la línea real
              se separa de la ideal, hoy toca recortar alcance del sprint, no el viernes.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo leerlo: los 4 patrones que importan",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Patrón de la línea real</th>
                  <th className="py-2 font-semibold">Lo que significa</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Paralela y por debajo de la ideal</td>
                  <td className="py-2 text-muted-foreground">
                    El sprint va sobrado: el equipo quema más rápido de lo planeado. Oportunidad
                    de sumar un ítem del backlog, no de relajarse dos días.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Paralela y por encima de la ideal</td>
                  <td className="py-2 text-muted-foreground">
                    Va a faltar alcance: a este ritmo, un pedazo del compromiso no cierra. Decidir
                    ya qué se saca del sprint o qué ayuda se suma.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Plana varios días y luego cae en escalón</td>
                  <td className="py-2 text-muted-foreground">
                    Hay tareas grandes abiertas que nadie termina: WIP alto. Partirlas o poner un
                    tope de trabajo en curso (el mismo remedio de los{" "}
                    <Link
                      to="/blogs/kanban-limites-wip"
                      className="underline underline-offset-2"
                    >
                      límites WIP en Kanban
                    </Link>
                    ).
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Sube a mitad de sprint</td>
                  <td className="py-2 text-muted-foreground">
                    Entró alcance nuevo sin avisar. No es malo por definición, pero debe ser una
                    decisión: algo entra, algo sale.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El patrón más común y más peligroso es el escalón final: línea plana toda la semana
              y caída el último día, cuando “se terminó todo”. Eso no es velocidad, es
              inventario: tareas que estaban 90% y se cerraron en lote. Si tu burndown siempre es
              un acantilado, las tareas son demasiado grandes o el equipo solo reporta al final.
            </p>
          </>
        ),
      },
      {
        heading: "Burndown vs. burnup: cuándo cambia la gráfica",
        body: (
          <>
            <p>
              El burndown solo dibuja lo que falta. Su primo, el <strong>burnup chart</strong>,
              dibuja dos líneas: trabajo terminado (que sube) y alcance total (que también puede
              subir si entra alcance). La diferencia importa cuando el alcance cambia durante el
              sprint: en un burndown clásico, un ítem añadido hace subir la línea real y parece
              “burn-up” confuso; en el burnup, la línea de alcance sube y queda explícito que el
              compromiso creció.
            </p>
            <p>
              Regla práctica: burndown para sprints estables donde el alcance no se toca; burnup
              cuando el alcance cambia (proyectos con cliente, soporte mezclado con desarrollo) o
              para graficar proyectos completos, donde el alcance casi nunca es fijo.
            </p>
          </>
        ),
      },
      {
        heading: "Los 3 errores que arruinan un burndown",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Mezclar unidades.</strong> Empezar el sprint midiendo puntos y terminar
                midiendo horas (o al revés) rompe la escala. Elige una unidad y no la cambies a
                mitad de sprint.
              </li>
              <li>
                <strong>Actualizar al final.</strong> Si las tareas solo se cierran el viernes,
                el gráfico no anticipa nada: es una foto de la autopsia. Actualizar el tablero al
                cerrar cada tarea es lo que hace útil al burndown.
              </li>
              <li>
                <strong>Tratarlo como nota de examen.</strong> El burndown no evalúa al equipo,
                anuncia el futuro del sprint. Usarlo para señalar culpables garantiza que la
                gente deje de mover el tablero con honestidad, y entonces la gráfica sí se
                rompe: miente.
              </li>
            </ul>
            <p>
              Y una limitación que conviene aceptar: el burndown dice <em>cuánto</em> falta, no{" "}
              <em>qué</em> falta. Si el ítem más riesgoso es el último de la fila, la línea puede
              verse cómoda y el sprint seguir en peligro. Por eso conviene leerlo junto al
              ordenamiento que sale del{" "}
              <Link
                to="/blogs/sprint-planning-como-hacerlo"
                className="underline underline-offset-2"
              >
                sprint planning
              </Link>
              : los riesgos primero.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo armarlo sin herramientas especiales",
        body: (
          <>
            <p>
              Un burndown cabe en una hoja de cálculo: columna de días del sprint, columna de
              trabajo restante (total del sprint menos lo terminado acumulado cada día) y una
              gráfica de líneas con la serie ideal al lado. Cinco minutos de armado, treinta
              segundos de actualización diaria.
            </p>
            <p>
              Para el seguimiento semanal del proyecto completo (más allá del sprint), el
              burndown se combina con los demás indicadores del{" "}
              <Link
                to="/blogs/kpis-gestion-proyectos"
                className="underline underline-offset-2"
              >
                tablero de KPIs del proyecto
              </Link>
              : la línea dice si el sprint cierra; la fecha proyectada de fin y el presupuesto
              dicen si el proyecto llega.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo armar un burndown chart en 4 pasos",
      steps: [
        {
          name: "Define el total inicial y la unidad",
          text: "Suma el trabajo comprometido del sprint (puntos u horas, una sola unidad) y anótalo como el punto de partida del día 1.",
        },
        {
          name: "Dibuja la línea ideal",
          text: "Une el total inicial con cero en el último día. Es la referencia de quemado constante contra la que se compara la realidad.",
        },
        {
          name: "Actualiza el restante cada día",
          text: "Cada día anota el total menos lo terminado acumulado. La honestidad del dato vale más que la herramienta: se actualiza al cerrar tareas, no el viernes.",
        },
        {
          name: "Lee la brecha a mitad de sprint",
          text: "Si la línea real va por encima de la ideal, decide hoy: recortar alcance, partir tareas grandes o sumar ayuda. El valor del burndown está en la decisión anticipada, no en el dibujo.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es un burndown chart?",
        answer:
          "Es una gráfica que muestra el trabajo restante de un sprint o proyecto contra el tiempo disponible. La línea ideal baja recta hasta cero y la línea real se dibuja con lo que el equipo termina cada día; la distancia entre ambas anticipa si el compromiso se cumplirá.",
      },
      {
        question: "¿Cómo se lee un burndown chart?",
        answer:
          "Comparando la línea real contra la ideal: por debajo de la ideal, el sprint va holgado; por encima, va a faltar alcance y toca decidir recortes o ayuda; una línea plana varios días delata tareas grandes abiertas; un salto hacia arriba significa que entró alcance nuevo.",
      },
      {
        question: "¿Qué significa la línea ideal en un burndown?",
        answer:
          "Es la trayectoria teórica de quemado constante: parte del total de trabajo comprometido y baja recta hasta cero el último día. No es una meta de cumplimiento sino la referencia visual para saber si el ritmo real alcanza.",
      },
      {
        question: "¿Cuál es la diferencia entre burndown y burnup chart?",
        answer:
          "El burndown dibuja una sola línea: lo que falta. El burnup dibuja dos: trabajo terminado (sube) y alcance total (que también puede subir si entran ítems). El burnup es mejor cuando el alcance cambia durante el sprint, porque hace explícito el cambio en lugar de mezclarlo con el avance.",
      },
      {
        question: "¿Para qué sirve el burndown chart en Scrum?",
        answer:
          "Para que el equipo y el Scrum Master vean a mitad de sprint si el compromiso cabe, sin depender de percepciones. Si la línea real se separa de la ideal, la decisión (recortar, partir tareas, sumar ayuda) se toma a mitad de sprint y no el último día, cuando ya no hay margen.",
      },
    ],
  },
};
