import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "cronograma-de-hitos",
  title: "Cronograma de hitos: plantilla y ejemplo práctico",
  excerpt:
    "Qué columnas lleva un cronograma de hitos, una plantilla copiable con ejemplo de agencia de diseño y la diferencia con el cronograma de actividades y el diagrama de hitos.",
  category: "plantillas",
  categoryLabel: "Plantillas",
  publishedAt: "2026-09-06",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "hito-project-gestion-por-hitos",
  related: [
    "hito-project-gestion-por-hitos",
    "plantilla-cronograma-proyecto",
    "diagrama-de-hitos",
  ],
  seo: {
    title: "Cronograma de hitos: plantilla y ejemplo práctico | Hito",
    description:
      "Cronograma de hitos: qué es, qué columnas lleva, plantilla copiable con ejemplo y diferencia con el cronograma de actividades y el diagrama de hitos.",
    ogImageAlt:
      "Tabla de cronograma de hitos con fechas, responsables y criterios.",
  },
  content: {
    eyebrow: "Hitos",
    intro: (
      <>
        <strong>En una línea:</strong> el cronograma de hitos es la tabla del calendario mínimo:
        cada mojón del proyecto con su fecha, su responsable y el criterio que define que está
        cumplido. Abajo tienes qué columnas lleva, una plantilla copiable con ejemplo y cuándo
        conviene usar hitos en vez de tareas.
      </>
    ),
    sections: [
      {
        heading: "Qué es un cronograma de hitos",
        body: (
          <>
            <p>
              Un <strong>cronograma de hitos</strong> es la tabla del calendario mínimo de tu
              proyecto: una fila por cada mojón, con su fecha comprometida, su responsable y el
              criterio que define que está cumplido. No lista actividades: lista los puntos de
              control en los que el proyecto cambia de estado, en el orden en que deben
              superarse.
            </p>
            <p>
              Es el documento con el que respondes la pregunta que todo cliente hace —«¿qué
              falta y cuándo?»— sin abrir el plan detallado. Y es también el compromiso contra el
              que se mide el desvío: si el hito «plan aprobado» estaba en la semana 2 y llegó en
              la 4, el cronograma te lo muestra sin discusión ni memoria selectiva. Es la versión
              operativa de la{" "}
              <Link
                to="/blogs/hito-project-gestion-por-hitos"
                className="underline underline-offset-2"
              >
                gestión de proyectos por hitos
              </Link>
              : el proyecto avanzando de mojón en mojón, con fechas que se pueden auditar.
            </p>
          </>
        ),
      },
      {
        heading:
          "Cronograma de hitos vs cronograma de actividades vs diagrama de hitos",
        body: (
          <>
            <p>
              Los tres términos se mezclan a diario, pero nombran tres cosas distintas. La forma
              más rápida de separarlos:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Aspecto</th>
                  <th className="py-2 pr-4 font-semibold">Cronograma de hitos</th>
                  <th className="py-2 pr-4 font-semibold">
                    Cronograma de actividades
                  </th>
                  <th className="py-2 font-semibold">Diagrama de hitos</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Qué lista</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Puntos de control con fecha, dueño y criterio.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Todas las tareas, con duración y secuencia.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Los mismos hitos, dibujados en línea de tiempo.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Nivel de detalle</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Medio: solo mojones con compromiso.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Alto: cada tarea del proyecto.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Mínimo: mojones sobre una escala.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Se actualiza</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cuando un hito cambia de estado o de fecha.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    A diario, tarea por tarea.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Casi nunca; es la vista de comunicación.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Para qué sirve</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Comprometer fechas y medir el desvío.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Ejecutar el día a día del equipo.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Explicar el plan de un vistazo.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              En la práctica, el cronograma de actividades es el motor y el de hitos es el
              tablero: el motor puede tener 80 tareas, pero el tablero es lo que miras y lo que
              firmas. La plantilla completa del motor está en{" "}
              <Link
                to="/blogs/plantilla-cronograma-proyecto"
                className="underline underline-offset-2"
              >
                la plantilla de cronograma de proyecto
              </Link>
              , y la versión dibujada de los mojones, en{" "}
              <Link to="/blogs/diagrama-de-hitos" className="underline underline-offset-2">
                el diagrama de hitos
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Qué columnas debe llevar",
        body: (
          <>
            <p>Seis columnas bastan. Más que eso y la tabla deja de mantenerse:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Hito.</strong> El nombre declara el logro, no la actividad: «propuesta
                aprobada», no «hacer la propuesta».
              </li>
              <li>
                <strong>Fecha.</strong> La comprometida, no la ideal. Si cambia, cambia con
                aviso (más abajo te digo cómo manejarlo).
              </li>
              <li>
                <strong>Responsable.</strong> Una persona con nombre y apellido que responde por
                que el hito sea verificable a tiempo. «El equipo» no es un responsable.
              </li>
              <li>
                <strong>Criterio de cumplido.</strong> La evidencia objetiva: una firma, un
                acta, un sistema en producción. Esta columna es la que evita el 90 % de las
                discusiones.
              </li>
              <li>
                <strong>Dependencias.</strong> Qué debe pasar antes. Si no hay ninguna, el hito
                se puede fechar con libertad; si las hay, la fecha hereda su riesgo.
              </li>
              <li>
                <strong>Estado.</strong> Pendiente, en riesgo, cumplido — y la fecha real del
                día en que se cumple, para tener el histórico.
              </li>
            </ul>
            <p>
              Si te ves tentado a añadir columnas de porcentaje de avance, resiste: los hitos no
              avanzan al 47 %, se cumplen o no. El avance vive en las tareas, no en los mojones.
            </p>
          </>
        ),
      },
      {
        heading: "Plantilla copiable con ejemplo",
        body: (
          <>
            <p>
              Copia esta estructura tal cual. El ejemplo es el proyecto de rediseño de marca de
              una agencia de diseño, con seis hitos:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Hito</th>
                  <th className="py-2 pr-4 font-semibold">Fecha</th>
                  <th className="py-2 pr-4 font-semibold">Responsable</th>
                  <th className="py-2 font-semibold">Criterio de cumplido</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Kickoff</td>
                  <td className="py-2 pr-4 text-muted-foreground">3 mar</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Directora de proyecto
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Acta enviada y aceptada por el cliente.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Propuesta creativa aprobada
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">17 mar</td>
                  <td className="py-2 pr-4 text-muted-foreground">Directora creativa</td>
                  <td className="py-2 text-muted-foreground">
                    Cliente firma el concepto por correo.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Diseño final entregado
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">7 abr</td>
                  <td className="py-2 pr-4 text-muted-foreground">Diseñadora líder</td>
                  <td className="py-2 text-muted-foreground">
                    Archivos fuente cargados en el repositorio del proyecto.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Manual de marca entregado
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">14 abr</td>
                  <td className="py-2 pr-4 text-muted-foreground">Diseñadora líder</td>
                  <td className="py-2 text-muted-foreground">
                    PDF y fuentes entregados y validados por el cliente.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Sitio web publicado</td>
                  <td className="py-2 pr-4 text-muted-foreground">28 abr</td>
                  <td className="py-2 pr-4 text-muted-foreground">Desarrollador</td>
                  <td className="py-2 text-muted-foreground">
                    Sitio en producción con el dominio del cliente.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">Aceptación final</td>
                  <td className="py-2 pr-4 text-muted-foreground">5 may</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Directora de proyecto
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Conformidad firmada y factura emitida.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Así de simple. Si un hito no cabe en una fila, no es un hito todavía: es una fase
              que hay que destilar. Y si una fase no tiene ningún hito en el cronograma,
              pregúntate qué evidencia va a producir para saber que terminó.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo mantenerlo vivo (y que no muera en la semana 3)",
        body: (
          <>
            <p>
              La mayoría de los cronogramas no fallan al crearlos: fallan al mantenerlos. Tres
              hábitos evitan que el tuyo se convierta en un PDF caducado:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Revisión semanal de 10 minutos.</strong> Una vez por semana, mirar el
                estado de cada hito y su fecha: qué se cumplió, qué está en riesgo, qué necesita
                decisión. Diez minutos de tabla valen más que una hora de reunión de estado.
              </li>
              <li>
                <strong>Solo el dueño actualiza su hito.</strong> El responsable de cada mojón es
                quien marca su estado y su fecha real. Así el cronograma no depende de que una
                persona transcriba lo que otros le cuentan, y la información llega sin filtro.
              </li>
              <li>
                <strong>Los cambios de fecha se anuncian, no se arrastran.</strong> Mover una
                fecha en silencio convierte el cronograma en ficción: el cambio se comunica al
                cliente o al jefe de proyecto, se registra y queda la razón. Si los cambios
                empiezan a ser frecuentes, el problema ya no es el cronograma sino el alcance, y
                ahí hace falta un mecanismo formal de control de cambios del proyecto.
              </li>
            </ol>
            <p>
              Si quieres que el cronograma viva donde el equipo trabaja —JSON local en tu
              carpeta, sin cuenta ni asientos, kanban con límites WIP para el día a día y GitHub
              sync para el código—{" "}
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
              — lleva el cronograma de hitos de tus proyectos sin nube, con todo guardado en tu
              carpeta.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un cronograma de hitos?",
        answer:
          "Es la tabla del calendario mínimo de un proyecto: una fila por cada mojón, con su fecha comprometida, su responsable y el criterio que define que está cumplido. No lista actividades sino los puntos de control en los que el proyecto cambia de estado, y sirve para comprometer fechas y medir el desvío.",
      },
      {
        question: "¿Cómo se hace un cronograma de hitos?",
        answer:
          "Primero elige entre 4 y 8 hitos verificables, luego arma una tabla con seis columnas: hito, fecha, responsable, criterio de cumplido, dependencias y estado. Féchalos según dependencias reales —no deseos— y revisa la tabla una vez por semana con actualización por el dueño de cada mojón.",
      },
      {
        question:
          "¿Qué diferencia hay entre cronograma de hitos y cronograma de actividades?",
        answer:
          "El nivel de detalle y el uso. El cronograma de hitos lista solo los puntos de control con su compromiso de fecha; el de actividades lista todas las tareas con duración y secuencia para ejecutar el día a día. Uno es el tablero que se mira y se firma; el otro, el motor que lo hace posible.",
      },
      {
        question: "¿Qué columnas debe llevar un cronograma de hitos?",
        answer:
          "Seis: hito (con nombre que declare el logro), fecha comprometida, responsable con nombre, criterio de cumplido (la evidencia objetiva), dependencias y estado. Con esa estructura basta; añadir columnas de porcentaje de avance suele ser señal de que se están listando tareas disfrazadas de hitos.",
      },
      {
        question: "¿Cuándo usar hitos y cuándo tareas en el cronograma?",
        answer:
          "Hitos para los compromisos: aprobaciones, entregas y cierres que cambian el estado del proyecto y que se comunican al cliente. Tareas para el trabajo interno que produce esos logros, que vive mejor en el plan detallado o el tablero del equipo. Si algo tiene duración y esfuerzo, es tarea; si se cumple en un instante con evidencia, es hito.",
      },
    ],
  },
};
