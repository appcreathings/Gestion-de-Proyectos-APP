import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "software-de-gestion-por-hitos",
  title: "Software de gestión por hitos: qué debe tener y 6 opciones",
  excerpt:
    "Software de gestión por hitos: los 4 requisitos que debe cumplir (fecha, criterio verificable, estado visible, línea de tiempo), una tabla honesta de 6 opciones y los errores al elegir.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-06",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "hito-project-gestion-por-hitos",
  related: [
    "hito-project-gestion-por-hitos",
    "software-gestion-proyectos",
    "hito-en-ms-project",
  ],
  seo: {
    title: "Software de gestión por hitos: qué debe tener y 6 opciones | Hito",
    description:
      "Software de gestión por hitos: los 4 requisitos (fecha, criterio, estado, línea de tiempo), tabla honesta de 6 opciones y los errores al elegir.",
    ogImageAlt: "Comparativa de software de gestión por hitos: seis opciones y sus techos.",
  },
  content: {
    eyebrow: "Software de hitos",
    intro: (
      <>
        <strong>En una línea:</strong> el software de gestión por hitos necesita cuatro cosas
        —fecha, criterio de cumplido verificable, estado visible y línea de tiempo— y casi ninguna
        opción las ofrece juntas. Aquí tienes los requisitos, una tabla honesta de 6 opciones con
        sus techos y los dos errores al elegir.
      </>
    ),
    sections: [
      {
        heading: "Qué necesita una herramienta de hitos: 4 requisitos",
        body: (
          <>
            <p>
              Antes de comparar marcas, define qué estás comprando. Una herramienta de gestión por
              hitos tiene que cumplir cuatro requisitos; si falla alguno, estás llevando tareas
              con fechas, no hitos:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Fecha o época comprometida.</strong> El hito vive en el calendario —o al
                menos en un mes o quarter— y se ve cuando miras el plan, sin abrir la tarjeta.
              </li>
              <li>
                <strong>Criterio de cumplido verificable.</strong> «Landing publicada y primer
                cobro procesado» es un hito; «módulo de pagos al 80 %» es un deseo con porcentaje.
              </li>
              <li>
                <strong>Estado visible de un vistazo.</strong> Pendiente, en riesgo, logrado: el
                estado del hito se lee sin abrir reuniones ni encadenar filtros de seis pasos.
              </li>
              <li>
                <strong>Vista de línea de tiempo.</strong> No hace falta un Gantt quirúrgico; hace
                falta ver los mojones en el tiempo y detectar el hueco de tres meses sin ninguno.
              </li>
            </ol>
            <p>
              Con ese filtro, casi cualquier herramienta honesta sirve; el problema es que la
              mayoría resuelve primero el tablero de tareas y los hitos quedan como un campo
              opcional que nadie llena. Si todavía estás definiendo qué tipo de herramienta
              necesitas, la guía general del{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos
              </Link>{" "}
              te ayuda a separar categorías antes de comparar marcas.
            </p>
          </>
        ),
      },
      {
        heading: "Tabla honesta: 6 opciones y su techo",
        body: (
          <>
            <p>
              Ninguna opción gana en todo y ninguna sirve para cualquier equipo; fíjate más en la
              columna del techo que en la de funciones. Y si tu caso es planificación seria de
              obra o PMO, esta tabla te corta el camino: revisa cómo funcionan los{" "}
              <Link to="/blogs/hito-en-ms-project" className="underline underline-offset-2">
                hitos en MS Project
              </Link>{" "}
              y evalúa si de verdad necesitas esa maquinaria.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Herramienta</th>
                  <th className="py-2 pr-4 font-semibold">Ideal para</th>
                  <th className="py-2 font-semibold">Techo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">MS Project</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Obras y PMO con planificación de recursos seria.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Precio alto, curva técnica y un plan que en equipos chicos nadie mantiene al
                    día.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">TeamGantt</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Agencias que comparten Gantt con clientes.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Sin gestión de recursos avanzada; el hito depende de que alguien alimente el
                    Gantt.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">GanttPro</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Pymes que quieren Gantt amable a precio razonable.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Colaboración en tiempo real limitada; hitos ligados al diagrama, no a
                    procesos.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">ClickUp</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipos que ya viven en un todo-in-one.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Ruido: los milestones se pierden entre docenas de funciones y automatizaciones.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Asana</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipos que piensan por metas y portfolios.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Línea de tiempo débil sin el plan caro; el milestone termina siendo un campo
                    más.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Hito</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipos de 1–15 que quieren hitos verificables y datos en su carpeta.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Sin Gantt enterprise ni colaboración en la nube en tiempo real.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Fíjate en los techos, no en las funciones: los cuatro primeros te dibujan un Gantt
              muy decente, pero ninguno te instala la disciplina de hitos —criterio de cumplido,
              un validador, revisión semanal—, porque esa disciplina es proceso, no software.
            </p>
          </>
        ),
      },
      {
        heading: "Por qué el software enterprise sobra en equipos de 1–15",
        body: (
          <>
            <p>
              Las funciones que justifican el precio de un planificador enterprise —nivelación de
              recursos, valor ganado, SSO, auditoría centralizada— resuelven problemas que tu
              equipo de 8 personas no tiene. Tu problema es otro y es más simple: que los hitos
              existan, tengan criterio de cumplido y alguien los mire cada semana.
            </p>
            <p>
              El costo real de estas herramientas no es la licencia: es el mantenimiento del plan.
              Alguien tiene que actualizar dependencias, duraciones y porcentajes para que el
              Gantt diga la verdad, y en un equipo pequeño ese alguien eres tú. En cuanto la
              actualización se atrasa dos semanas, el plan muere y los hitos mueren con él.
            </p>
            <p>
              Lo que sostiene la gestión por hitos en equipos chicos es la estructura: pocos
              hitos, criterio verificable, un validador por hito y visibilidad total. El estado
              visible suele ser, en los hechos, un{" "}
              <Link to="/blogs/app-kanban" className="underline underline-offset-2">
                tablero kanban
              </Link>{" "}
              donde la columna del final es el mojón. Eso cabe en una herramienta local y ligera
              —o en un documento—; lo que no cabe es en la memoria del lead técnico.
            </p>
          </>
        ),
      },
      {
        heading: "Checklist de prueba: 15 minutos con tu proyecto real",
        body: (
          <>
            <p>
              No pruebes herramientas con el proyecto demo de la página principal: en los demos
              todo es hermoso. Pruébala con tus 5 próximos hitos reales y cronometra 15 minutos:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Carga tus 5 hitos reales con criterio de cumplido.</strong> Si no puedes
                redactar el criterio de alguno, ese no es un hito: es una tarea disfrazada, y
                ninguna herramienta lo va a arreglar.
              </li>
              <li>
                <strong>Ponles mes o quarter y mira la línea de tiempo.</strong> ¿Detectas el
                hueco o la congestión de mojones en un vistazo, sin hacer zoom?
              </li>
              <li>
                <strong>Marca uno como logrado y otro en riesgo.</strong> ¿El estado se nota sin
                entrar a la tarjeta, o hay que abrir tres paneles para saber dónde estás?
              </li>
              <li>
                <strong>Comparte la vista con tu equipo o tu cliente.</strong> ¿Entienden dónde
                está el proyecto sin que tú lo expliques en una llamada?
              </li>
              <li>
                <strong>Revisa qué pasa sin internet y quién controla los datos.</strong> ¿La
                herramienta trabaja local o todo vive en una cuenta que dejas de poder abrir el
                día que no pagas?
              </li>
            </ol>
            <p>
              Si falla el punto 2 o el 4, no sirve para gestionar por hitos, por más bonito que
              sea su tablero de tareas.
            </p>
          </>
        ),
      },
      {
        heading: "Los 2 errores al elegir",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Comprar un Gantt cuando el problema es disciplina de hitos.</strong> Si
                tus hitos no tienen criterio de cumplido ni validador, un Gantt caro solo los va a
                dibujar mejor. Primero la disciplina —5 a 10 mojones, criterio verificable, un
                dueño, revisión semanal—, después la herramienta.
              </li>
              <li>
                <strong>Elegir por número de funciones.</strong> La función 47 no la va a usar
                nadie de tu equipo. Cada función extra es ruido entre el equipo y el único dato
                que importa esta semana: ¿el próximo hito está en riesgo o no?
              </li>
            </ul>
            <p>
              Y una advertencia que va en los dos sentidos: si tu operación no puede depender de
              una suscripción activa, una herramienta que deja de abrirse cuando dejas de pagar es
              un riesgo operativo, no un ahorro. Si en cambio necesitas nivelación de recursos y
              EVM, ninguna herramienta ligera de esta tabla te va a alcanzar y estás buscando en
              la categoría equivocada.
            </p>
            <p>
              Si quieres una app de hitos que viva en tu carpeta —JSON local, sin cuenta, sin
              asientos, kanban con límites WIP y checklists junto al trabajo—{" "}
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
              — hitos verificables con procesos y tablero, local-first, gratis.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué software sirve para gestionar por hitos?",
        answer:
          "Cualquiera que cumpla los cuatro requisitos: fecha o época, criterio de cumplido verificable, estado visible de un vistazo y una vista de línea de tiempo. MS Project y GanttPro lo hacen desde el Gantt; Asana y ClickUp desde las tareas; Hito desde procesos y checklists. En todos los casos el software es lo de menos: sin criterio de cumplido, ninguna herramienta gestiona hitos.",
      },
      {
        question: "¿Excel alcanza para llevar los hitos de un proyecto?",
        answer:
          "Para 3–5 hitos y un proyecto a la vez, sí: columnas de hito, criterio de cumplido, fecha, estado y responsable. Deja de alcanzar cuando el estado en tiempo real importa —nadie actualiza el archivo—, cuando hay varios proyectos en paralelo o cuando necesitas evidencia como fotos y checklists viviendo junto al hito.",
      },
      {
        question: "¿Trello tiene hitos o milestones?",
        answer:
          "No de forma nativa: Trello trabaja con listas y tarjetas, y los equipos simulan hitos con una lista «Hecho» o una tarjeta por hito. Funciona para uno o dos proyectos, pero el hito no tiene fecha propia en una línea de tiempo ni estado de riesgo: se sostiene con la disciplina del equipo, no con la herramienta.",
      },
      {
        question: "¿Qué es la app Hito?",
        answer:
          "Un gestor de proyectos local-first para equipos de 1 a 15 personas: los proyectos viven en archivos JSON en tu carpeta, sin cuenta ni asientos, y los hitos emergen de procesos y checklists que se completan. Incluye kanban con límites WIP, automatizaciones, sincronización con GitHub, dashboard de portafolio, IA opcional con tu propia API key y es gratis bajo licencia MIT.",
      },
      {
        question: "¿Cuánto cuesta un software de gestión por hitos?",
        answer:
          "Depende de la familia: los Gantt amables rondan los 10–25 USD por usuario al mes; las suite enterprise pasan los 50 USD por usuario; las open source son gratis pero exigen servidor propio; y las opciones local-first como Hito son gratis sin límite de usuarios. El costo oculto de casi todas es el mantenimiento del plan, no la licencia.",
      },
    ],
  },
};
