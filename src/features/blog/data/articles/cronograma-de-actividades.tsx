import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "cronograma-de-actividades",
  title: "Cronograma de actividades: ejemplo y cómo hacerlo",
  excerpt:
    "Un cronograma de actividades es la tabla de qué se hace, en qué orden y con qué dueño. Incluye un ejemplo, los 6 pasos para armarlo y cuándo el Gantt sobra.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-10-15",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "diagrama-de-gantt",
  related: [
    "diagrama-de-gantt",
    "plantilla-cronograma-proyecto",
    "cronograma-de-hitos",
    "plan-de-trabajo",
  ],
  seo: {
    title: "Cronograma de actividades: ejemplo y cómo hacerlo | Hito",
    description:
      "Cronograma de actividades: qué incluye, un ejemplo con fechas y dueños, y cómo hacerlo en 6 pasos. En qué se diferencia del diagrama de Gantt.",
    ogImageAlt: "Tabla de cronograma de actividades con fechas, dueños y dependencias.",
  },
  content: {
    eyebrow: "Planificación",
    intro: (
      <>
        <strong>En una línea:</strong> un cronograma de actividades es la lista de qué se hace,
        en qué orden, con qué fecha y con qué dueño. El diagrama de Gantt es solo el dibujo de
        esa lista. Bien hecho cabe en una tabla que el equipo cumple; mal hecho se abre el día
        del kickoff y no se vuelve a tocar.
      </>
    ),
    sections: [
      {
        heading: "Qué es un cronograma de actividades",
        body: (
          <>
            <p>
              Un cronograma de actividades ordena el trabajo en el tiempo. Cada fila es una
              actividad con inicio, fin, responsable y, si hace falta, la actividad de la que
              depende. El resultado no es un documento bonito: es el acuerdo de qué tiene que
              estar listo antes de qué.
            </p>
            <p>
              No es el plan de proyecto. El plan dice el alcance, el presupuesto y las fases.
              El cronograma dice el calendario de ese alcance. Tampoco es el{" "}
              <Link to="/blogs/plan-de-trabajo" className="underline underline-offset-2">
                plan de trabajo
              </Link>{" "}
              de la semana: ese elige lo que cabe en siete días. El cronograma mira el proyecto
              entero, aunque sea corto.
            </p>
            <p>
              Una actividad, aquí, es un trozo de trabajo con un resultado comprobable. «Diseñar»
              no es una actividad. «Entregar la home en Figma, revisada por el cliente» sí lo es.
              Si no puedes decir cuándo está terminada, no la pongas en el cronograma: la vas a
              arrastrar de semana en semana.
            </p>
          </>
        ),
      },
      {
        heading: "Qué tiene que llevar cada fila",
        body: (
          <>
            <p>Cinco columnas alcanzan. La sexta casi siempre es decoración.</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Actividad.</strong> Un resultado, no un verbo suelto. Quien lee la fila
                entiende qué se entrega.
              </li>
              <li>
                <strong>Responsable.</strong> Un nombre. Si hay dos, nadie mueve la fecha cuando
                se atrasa.
              </li>
              <li>
                <strong>Inicio y fin.</strong> Día, no «semana 3» si el proyecto dura un mes. La
                precisión tiene que coincidir con cómo estima el equipo.
              </li>
              <li>
                <strong>Depende de.</strong> Vacío si puede empezar ya. Si depende de otra fila,
                escribe cuál. Esa columna es la que el Gantt dibuja y la tabla ya contiene.
              </li>
              <li>
                <strong>Entregable.</strong> El archivo, la decisión o el hecho que prueba que la
                fila cerró.
              </li>
            </ol>
            <p>
              Duración en días, porcentaje de avance y colores de estado se pueden calcular. No
              hace falta pedirlos a mano. El porcentaje que alguien escribe «40 %» sin un
              entregable a la vista no informa: adivina.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo de cronograma de actividades",
        body: (
          <>
            <p>
              Un estudio chico lanza la web de un cliente en cuatro semanas. Este es el
              cronograma que sí se puede cumplir. No incluye «pensar la estrategia» ni
              «coordinar internamente».
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-3 font-semibold">Actividad</th>
                  <th className="py-2 pr-3 font-semibold">Quién</th>
                  <th className="py-2 pr-3 font-semibold">Fechas</th>
                  <th className="py-2 font-semibold">Depende de</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-3 text-muted-foreground">Brief cerrado y sitemap</td>
                  <td className="py-2 pr-3 text-muted-foreground">Ana</td>
                  <td className="py-2 pr-3 text-muted-foreground">6–8 oct</td>
                  <td className="py-2 text-muted-foreground">—</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-3 text-muted-foreground">Home y dos internas en Figma</td>
                  <td className="py-2 pr-3 text-muted-foreground">Luis</td>
                  <td className="py-2 pr-3 text-muted-foreground">9–15 oct</td>
                  <td className="py-2 text-muted-foreground">Brief</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-3 text-muted-foreground">Textos de esas tres páginas</td>
                  <td className="py-2 pr-3 text-muted-foreground">Ana</td>
                  <td className="py-2 pr-3 text-muted-foreground">9–14 oct</td>
                  <td className="py-2 text-muted-foreground">Brief</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-3 text-muted-foreground">Maquetado en el CMS</td>
                  <td className="py-2 pr-3 text-muted-foreground">Sol</td>
                  <td className="py-2 pr-3 text-muted-foreground">16–22 oct</td>
                  <td className="py-2 text-muted-foreground">Diseño aprobado</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-3 text-muted-foreground">Carga de textos y fotos</td>
                  <td className="py-2 pr-3 text-muted-foreground">Ana</td>
                  <td className="py-2 pr-3 text-muted-foreground">20–23 oct</td>
                  <td className="py-2 text-muted-foreground">Textos y CMS</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-3 text-muted-foreground">Revisión del cliente</td>
                  <td className="py-2 pr-3 text-muted-foreground">Ana</td>
                  <td className="py-2 pr-3 text-muted-foreground">23–27 oct</td>
                  <td className="py-2 text-muted-foreground">Carga</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 text-muted-foreground">Publicación</td>
                  <td className="py-2 pr-3 text-muted-foreground">Sol</td>
                  <td className="py-2 pr-3 text-muted-foreground">29 oct</td>
                  <td className="py-2 text-muted-foreground">Revisión cerrada</td>
                </tr>
              </tbody>
            </table>
            <p>
              El ejemplo cabe en una pantalla. Diseño y textos corren en paralelo porque los dos
              dependen solo del brief. El maquetado no empieza el 9 de octubre «para ir
              adelantando»: sin diseño aprobado, esa fila es mentira. La publicación es un día,
              no una semana, porque es un hecho y no un proceso.
            </p>
            <p>
              Si el proyecto se mide por hitos y no por cada tarea, la misma lógica está en el{" "}
              <Link to="/blogs/cronograma-de-hitos" className="underline underline-offset-2">
                cronograma de hitos
              </Link>
              . Ahí la fila no es «escribir textos»: es «textos aprobados».
            </p>
          </>
        ),
      },
      {
        heading: "Cómo hacer un cronograma de actividades",
        body: (
          <>
            <p>
              Hacerlo toma una sentada si el alcance ya está dicho. Si el alcance no está dicho,
              el cronograma no lo va a inventar: vuelve a las{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                fases del proyecto
              </Link>{" "}
              y cierra qué entra.
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Lista los entregables, no las tareas sueltas.</strong> Una web, un
                informe, una campaña, una obra. Cada entregable se parte después.
              </li>
              <li>
                <strong>Parte cada entregable en actividades que una persona puede cerrar.</strong>{" "}
                Si una fila dura más de diez días hábiles, todavía es un paquete. Pártela.
              </li>
              <li>
                <strong>Marca qué puede ir en paralelo y qué está bloqueado.</strong> Esa es la
                columna «depende de». Sin ella, todas las fechas son deseos simultáneos.
              </li>
              <li>
                <strong>Pon fechas desde el final o desde hoy, y di cuál de las dos usaste.</strong>{" "}
                Desde el final: la publicación es el 29 y caminas hacia atrás. Desde hoy: el
                brief empieza el lunes y el fin cae donde caiga. Mezclar las dos sin decirlo hace
                que el cronograma prometa una fecha que la suma de las filas no sostiene.
              </li>
              <li>
                <strong>Asigna un nombre por fila y resta su capacidad real.</strong> Ana no
                puede escribir textos y atender la revisión del otro cliente en los mismos tres
                días. Si el nombre ya está lleno, mueve la fecha. No la dejes «para ver».
              </li>
              <li>
                <strong>Publica la tabla y fija el día en que se mira.</strong> Una vez por
                semana alcanza. El cronograma que no se mira se convierte en el documento del
                kickoff.
              </li>
            </ol>
            <p>
              La{" "}
              <Link
                to="/blogs/plantilla-cronograma-proyecto"
                className="underline underline-offset-2"
              >
                plantilla de cronograma de proyecto
              </Link>{" "}
              es esa tabla, lista para copiar, cuando prefieres hitos y holgura antes que una
              barra por cada tarea.
            </p>
          </>
        ),
      },
      {
        heading: "Cronograma y diagrama de Gantt",
        body: (
          <>
            <p>
              El cronograma es la lista. El{" "}
              <Link to="/blogs/diagrama-de-gantt" className="underline underline-offset-2">
                diagrama de Gantt
              </Link>{" "}
              es la misma lista dibujada en barras. «Cronograma Gantt» en la práctica nombra las
              dos cosas juntas, y por eso la gente busca una plantilla cuando en realidad
              necesita decidir si el dibujo le hace falta.
            </p>
            <p>La barra ayuda cuando se cumplen las tres condiciones:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Hay dependencias de verdad, no solo un orden de preferencia.</li>
              <li>Alguien que no está en el día a día tiene que ver el camino largo en un vistazo.</li>
              <li>El equipo va a mover una fecha y quiere ver qué más se mueve.</li>
            </ul>
            <p>
              La barra sobra cuando el proyecto tiene menos de quince actividades, el equipo es
              de dos o tres personas y todos ven la misma tabla. Dibujar siete barras no aclara
              el ejemplo de arriba: la columna «depende de» ya lo dice. Un Gantt de doscientas
              filas que nadie actualiza es peor que la tabla, porque parece exacto.
            </p>
          </>
        ),
      },
      {
        heading: "Dónde vivir para que se use",
        body: (
          <>
            <p>
              Excel alcanza para el primer cronograma. Se rompe cuando dos personas editan la
              misma fila, cuando la dependencia está escrita en un comentario y cuando la versión
              buena es «cronograma_v7_final». Si eso ya te pasó, la tabla tiene que vivir donde
              está el resto del trabajo.
            </p>
            <p>
              Para un equipo de 1 a 15 personas que no necesita nivelar recursos ni un camino
              crítico de obra,{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              guarda actividades, dueños y fechas en una carpeta local, con tablero e hitos. No
              es un editor de Gantt. Si tu cronograma es una pared de barras y recursos al 25 %,
              esta no es la herramienta: sigue en un planificador de verdad y usa la tabla solo
              como resumen.
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
              — actividades, dueños y fechas en tu equipo, sin cuenta y sin asientos.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo hacer un cronograma de actividades",
      steps: [
        {
          name: "Lista los entregables",
          text: "Escribe los resultados del proyecto, no las tareas sueltas. Si el alcance no está cerrado, el cronograma no lo inventa.",
        },
        {
          name: "Parte cada entregable en actividades cerrables",
          text: "Cada fila necesita un responsable y un resultado comprobable. Si dura más de diez días hábiles, sigue siendo un paquete: pártela.",
        },
        {
          name: "Marca dependencias y paralelos",
          text: "Anota de qué fila depende cada actividad. Lo que no depende de nada puede empezar ya. Lo demás no tiene fecha creíble hasta que esa fila existe.",
        },
        {
          name: "Pon fechas desde el final o desde hoy",
          text: "Elige un solo sentido y dícelo. Desde la fecha de entrega caminas hacia atrás. Desde hoy, la fecha de fin es la que la suma de filas permita.",
        },
        {
          name: "Asigna un nombre y resta su capacidad",
          text: "Una persona por fila. Si esa persona ya está llena en esas fechas, mueve la actividad. No dejes la sobrecarga para verla después.",
        },
        {
          name: "Publícalo y míralo una vez por semana",
          text: "La tabla que no se revisa vuelve a ser el documento del kickoff. Un vistazo semanal basta para mover las fechas que ya no se sostienen.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es un cronograma de actividades?",
        answer:
          "Es la lista ordenada del trabajo de un proyecto: cada actividad con inicio, fin, responsable y la actividad de la que depende. El diagrama de Gantt es el dibujo de esa lista, no otro documento.",
      },
      {
        question: "¿Cómo hacer un cronograma de actividades?",
        answer:
          "Lista los entregables, pártelos en actividades que una persona puede cerrar, marca dependencias, pon fechas desde el final o desde hoy, asigna un nombre por fila y revisa la tabla una vez por semana.",
      },
      {
        question: "¿Qué diferencia hay entre cronograma y diagrama de Gantt?",
        answer:
          "El cronograma es la tabla. El Gantt son las barras de esa tabla. Conviene dibujarlo cuando hay dependencias reales y alguien de afuera necesita ver el camino largo. Con pocas filas, la columna «depende de» alcanza.",
      },
      {
        question: "¿El cronograma de actividades se hace en Excel?",
        answer:
          "Sirve para el primero. Se queda corto cuando dos personas editan la misma fila o cuando la versión buena es un archivo con otro nombre. A partir de ahí, la tabla tiene que vivir junto al resto del trabajo.",
      },
      {
        question: "¿Cuántas actividades debe tener?",
        answer:
          "Las que el equipo puede revisar cada semana. Una fila de más de diez días hábiles suele estar demasiado empaquetada. Doscientas filas que nadie actualiza informan menos que veinte filas vivas.",
      },
    ],
  },
};
