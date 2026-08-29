import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "kpis-gestion-proyectos",
  title: "KPIs de gestión de proyectos: los que sí importan",
  excerpt:
    "La fecha proyectada de fin, el WIP y la desviación de presupuesto cambian decisiones. Los KPIs que caben en un informe semanal y los que solo decoran.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-07-05",
  readingTime: "10 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  related: ["diagrama-de-gantt", "burndown-chart", "valor-ganado-evm", "informe-de-estado-semanal"],
  seo: {
    title: "KPIs de gestión de proyectos: los que importan | Hito",
    description:
      "KPIs de gestión de proyectos que sí cambian decisiones: fecha proyectada de fin, WIP, desviación de costo y alcance. Los 8 indicadores del informe semanal.",
    ogImageAlt:
      "Los 8 KPIs de gestión de proyectos que caben en un informe semanal, en una tabla.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> un <strong>KPI de gestión de proyectos</strong> solo sirve
        si su valor cambia una decisión esta semana. La fecha proyectada de fin, el trabajo en
        curso y la desviación de costo pasan esa prueba; el porcentaje completo y la cantidad de
        reuniones, no. Ocho indicadores alcanzan para dirigir casi cualquier proyecto pequeño.
      </>
    ),
    sections: [
      {
        heading: "Un KPI que no cambia una decisión es decoración",
        body: (
          <>
            <p>
              La definición de libro dice que un KPI (indicador clave de desempeño) mide qué tan
              bien va algo respecto a un objetivo. La definición práctica es más exigente: si el
              número puede ser verde o rojo y en los dos casos harías exactamente lo mismo, no es
              un KPI. Es decoración de dashboard.
            </p>
            <p>
              Antes de agregar un indicador, pregúntale al número: ¿quién lo mira, cada cuánto, y
              qué hace distinto si sube o baja? “Horas registradas” no pasa la prueba. “Fecha
              proyectada de fin” sí: si se mueve una semana más allá del compromiso, alguien tiene
              que decidir hoy si recortar alcance, sumar ayuda o renegociar la fecha.
            </p>
            <p>
              La otra división útil es entre indicadores de resultado (atraso, desviación de
              presupuesto: cuentan una historia que ya ocurrió) e indicadores de proceso (WIP,
              bloqueos: anuncian la historia que está por ocurrir). Un tablero sano tiene más de
              los segundos y menos de los primeros, porque los resultados son consecuencias.
            </p>
          </>
        ),
      },
      {
        heading: "Los 8 KPIs que caben en un informe semanal",
        body: (
          <>
            <p>
              Estos ocho caben en una pantalla y se actualizan en menos de una hora. Cada uno
              lleva la decisión que dispara: si nadie actúa al leerlo, sobra.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">KPI</th>
                  <th className="py-2 pr-4 font-semibold">Qué mide</th>
                  <th className="py-2 font-semibold">Decisión que dispara</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Fecha proyectada de fin</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cuándo termina el proyecto con lo que hoy sabes
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Si se aleja del compromiso: recortar alcance, sumar recursos o mover la fecha
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Avance vs. tiempo consumido</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    % del trabajo hecho contra % del calendario quemado
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Brecha creciente = replanificar antes de que sea un atraso
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Desviación de presupuesto</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Gastado contra presupuestado a la fecha
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Si quema más rápido de lo que avanza, frenar o renegociar
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Cambios de alcance</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Solicitudes aprobadas y su impacto en fecha/costo
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Acumulan sin precio ={" "}
                    <Link
                      to="/blogs/alcance-de-proyecto-scope-creep"
                      className="underline underline-offset-2"
                    >
                      scope creep
                    </Link>{" "}
                    en camino
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Trabajo en curso (WIP)</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cuántas cosas empezó y no terminó el equipo
                  </td>
                  <td className="py-2 text-muted-foreground">
                    WIP alto: parar arranques, terminar lo abierto
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Bloqueos de más de 48 horas</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Tareas paradas esperando alguien o algo externo
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Escalar hoy, no en la reunión del viernes
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Riesgo principal</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El evento que más dañaría el proyecto y su estado
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Si cambió de color, activar el plan de respuesta
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Aceptación de hitos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Hitos entregados que el cliente aceptó sin reparos
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Reparos repetidos = problema de expectativas, no de entrega
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Fíjate en lo que falta: no hay “horas trabajadas”, ni “cantidad de tareas
              creadas”, ni “porcentaje completo”. Los dos primeros miden actividad; el tercero es
              el número más mentiroso del seguimiento, porque todos redondean hacia arriba.
            </p>
          </>
        ),
      },
      {
        heading: "Si solo puedes mirar dos números: CPI y SPI",
        body: (
          <>
            <p>
              El método del valor ganado condensa tiempo y dinero en dos ratios: el{" "}
              <strong>SPI</strong> (avance real contra avance planificado) y el{" "}
              <strong>CPI</strong> (valor del trabajo hecho contra lo que costó hacerlo). Debajo
              de 1.0 en cualquiera de los dos, el proyecto está consumiendo más de lo que produce.
            </p>
            <p>
              No necesitas la ceremonia completa del método para usar la idea: dos divisiones al
              mes te dicen si el proyecto se puede terminar en fecha y en presupuesto con el
              rendimiento actual. En{" "}
              <Link
                to="/blogs/valor-ganado-evm"
                className="underline underline-offset-2"
              >
                valor ganado (EVM) explicado sin jerga
              </Link>{" "}
              está el cálculo completo con un ejemplo numérico.
            </p>
          </>
        ),
      },
      {
        heading: "KPIs de proceso: los tres que anuncian el futuro",
        body: (
          <>
            <p>
              Si el equipo trabaja con sprints o con un tablero, tres indicadores de proceso
              valen más que cualquier porcentaje: <strong>lead time</strong> (cuánto tarda una
              tarea desde que empieza hasta que termina), <strong>throughput</strong> (cuántas
              terminan por semana) y <strong>WIP</strong>. Con esos tres puedes proyectar la fecha
              de fin sin pedirle porcentajes a nadie.
            </p>
            <p>
              El <Link to="/blogs/burndown-chart" className="underline underline-offset-2">
                burndown chart
              </Link>{" "}
              no es más que la gráfica de dos de ellos: trabajo restante contra días del sprint.
              Y el WIP, con un límite explícito, es el mejor predictor de si el equipo entregará
              o solo moverá tarjetas. Si el WIP crece y el throughput no, el problema no es de
              esfuerzo: hay demasiadas cosas empezadas a la vez, como pasa cuando se pierde el
              control de los{" "}
              <Link to="/blogs/kanban-limites-wip" className="underline underline-offset-2">
                límites WIP en Kanban
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Cómo presentarlos: cinco líneas, no un dashboard",
        body: (
          <>
            <p>
              Un informe semanal con los ocho KPIs cabe en cinco líneas: qué avanzó, qué se
              atrasa, qué está bloqueado, cuánto llevamos gastado frente al presupuesto y cuál es
              la decisión que necesitamos. La plantilla está en el{" "}
              <Link
                to="/blogs/informe-de-estado-semanal"
                className="underline underline-offset-2"
              >
                informe de estado semanal
              </Link>
              , y el gráfico opcional es un{" "}
              <Link to="/blogs/diagrama-de-gantt" className="underline underline-offset-2">
                diagrama de Gantt
              </Link>{" "}
              que muestre solo la ruta crítica.
            </p>
            <p>
              La regla de presentación: cada KPI va acompañado de su decisión pendiente o del
              texto “sin cambios”. Un número sin veredicto obliga al lector a interpretar, y la
              mayoría no interpretará: asumirá que está bien.
            </p>
          </>
        ),
      },
      {
        heading: "Dos errores que arruinan cualquier tablero de KPIs",
        body: (
          <>
            <p>
              <strong>Medir todo.</strong> Un tablero de 30 métricas es lo mismo que ninguno:
              nadie sabe cuál importa. Si mañana se reduce a 3 y nadie extraña las otras 27,
              confirma que sobraban. Empieza con la fecha proyectada, el presupuesto y el WIP;
              agrega el resto solo cuando una decisión concreta lo pida.
            </p>
            <p>
              <strong>Premiar la métrica en vez del resultado.</strong> Si premias “tareas
              cerradas”, el equipo parte el trabajo en pedazos fáciles. Si premias “% completo”,
              todos reportan 90% eterno. Toda métrica se deforma cuando se vuelve objetivo; el
              antídoto es revisarla junto con el resultado que intenta predecir (¿llegó a fecha?
              ¿dentro del presupuesto?) y ajustar el tablero cuando deja de servir.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un KPI en gestión de proyectos?",
        answer:
          "Un KPI (indicador clave de desempeño) es una medida que muestra si el proyecto avanza hacia su objetivo y que, al cambiar, dispara una decisión concreta: replanificar, recortar alcance, escalar un bloqueo o renegociar fecha y presupuesto. Si su valor no cambia ninguna decisión, no es un KPI.",
      },
      {
        question: "¿Cuáles son los KPIs más importantes de un proyecto?",
        answer:
          "Los cinco que casi ningún proyecto puede omitir: fecha proyectada de fin, avance contra tiempo consumido, desviación de presupuesto, trabajo en curso (WIP) y bloqueos de más de 48 horas. En proyectos con cliente se suman los cambios de alcance aprobados y la aceptación de hitos.",
      },
      {
        question: "¿Qué son el CPI y el SPI de un proyecto?",
        answer:
          "Son los dos ratios del método de valor ganado. El SPI compara el avance real contra el planificado (por debajo de 1.0, el proyecto va atrasado). El CPI compara el valor del trabajo realizado contra su costo real (por debajo de 1.0, cada unidad de dinero invertida está produciendo menos trabajo del esperado).",
      },
      {
        question: "¿Cuántos KPIs debe tener un proyecto?",
        answer:
          "Entre 5 y 8 alcanzan para la mayoría de los proyectos pequeños y medianos. Un tablero más grande deja de leerse y diluye las señales; empieza con fecha proyectada, presupuesto y WIP, y agrega indicadores solo cuando una decisión concreta los necesite.",
      },
      {
        question: "¿Cuál es la diferencia entre un KPI y una métrica?",
        answer:
          "Toda métrica es una medida, pero un KPI es la métrica vinculada al resultado crítico del proyecto y a una decisión. “Tareas creadas por semana” es una métrica; “fecha proyectada de fin” es un KPI, porque si se aleja del compromiso alguien debe actuar de inmediato.",
      },
    ],
  },
};
