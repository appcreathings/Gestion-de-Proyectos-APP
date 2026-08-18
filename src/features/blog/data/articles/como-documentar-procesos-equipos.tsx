import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
  slug: "como-documentar-procesos-equipos",
  title: "Cómo documentar un proceso: SOPs y checklists para equipos",
  excerpt:
    "Aprende a escribir SOPs y checklists que tu equipo realmente use. Sin wikis abandonados ni manuales que nadie lee.",
  category: "procesos",
  categoryLabel: "Procesos",
  publishedAt: "2026-08-02",
  readingTime: "7 min",
  featured: false,
  related: ["organizar-proyectos-tareas-jerarquia", "cierre-de-proyecto-checklist"],
  seo: {
    title: "Cómo documentar un proceso: SOPs y checklists | Hito",
    description:
      "Cómo documentar un proceso y documentar procesos en equipos pequeños: SOPs útiles, checklists reutilizables y documentación que sí se usa.",
    ogImageAlt: "Documentación de procesos con SOPs y checklists.",
  },
  content: {
    eyebrow: "Procesos",
    intro: (
      <>
        Todos los equipos quieren "mejorar los procesos". Pocos logran que esos procesos se
        lean. La documentación muere en carpetas olvidadas, en wikis que nadie actualiza o en
        checklists que se completan por inercia. El problema no suele ser el formato: es la
        distancia entre el proceso documentado y el trabajo real. Esta guía te muestra cómo
        documentar un proceso —y documentar procesos— que tu equipo sí use.
      </>
    ),
    sections: [
      {
        heading: "Empieza por el dolor, no por el procedimiento",
        body: (
          <>
            <p>
              La mejor documentación responde a una pregunta concreta: "¿cómo hacemos X cuando
              pasa Y?". Si no hay una situación recurrente que cause fricción, cualquier SOP
              será teatro. Antes de escribir, identifica los tres errores que más se repiten o
              las tres tareas que más le cuestan a alguien nuevo.
            </p>
            <p>
              Un SOP no es un manual universitario: es una respuesta a un problema específico.
              Cuanto más cerca esté de ese problema, más probabilidades tiene de usarse.
            </p>
          </>
        ),
      },
      {
        heading: "SOP vs checklist: ¿cuándo usar cada uno?",
        body: (
          <>
            <p>
              Aunque se confunden, no son lo mismo. Un <strong>SOP</strong> explica{" "}
              <em>cómo</em> se hace algo: el paso a paso, los criterios de decisión, los
              responsables. Un <strong>checklist</strong> sirve para <em>verificar</em> que nada
              se olvidó antes de entregar.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>SOP:</strong> "Cómo publicar una nueva versión del producto".
              </li>
              <li>
                <strong>Checklist:</strong> "Antes de publicar, revisar tests, changelog y
                backup".
              </li>
            </ul>
            <p>
              En equipos pequeños, ambos se usan juntos: el SOP entrena, el checklist asegura
              calidad.
            </p>
          </>
        ),
      },
      {
        heading: "Conecta el proceso al proyecto",
        body: (
          <>
            <p>
              La documentación vive mejor cuando está al lado del trabajo. En lugar de un wiki
              separado, los SOPs deberían estar en el contexto del proyecto, del área o de la
              tarea a la que aplican. Así, cuando alguien llega a una etapa, la guía está a un
              clic, no a tres búsquedas. Esa misma lógica —el proceso junto al trabajo, no en un
              wiki suelto— es la de{" "}
              <Link
                to="/blogs/organizar-proyectos-tareas-jerarquia"
                className="underline underline-offset-2"
              >
                organizar proyectos y tareas en jerarquía
              </Link>
              .
            </p>
            <p>
              En Hito, cada área de un proyecto puede tener sus propios procesos y checklists.
              No es documentación genérica: es la documentación de este proyecto, en este
              momento.
            </p>
          </>
        ),
      },
      {
        heading: "Hazlo revisable o no lo hagas",
        body: (
          <>
            <p>
              Un proceso que no se actualiza es peor que ningún proceso: da instrucciones
              incorrectas con autoridad. Por eso conviene usar formatos que el equipo pueda
              editar sin ceremonia. Markdown, JSON legible o checklists versionables hacen que
              actualizar sea tan fácil como consultar.
            </p>
            <p>
              La documentación no es un monumento: es un instrumento vivo. Si tu equipo no la
              puede mejorar en minutos, terminará siendo ignorada.
            </p>
          </>
        ),
      },
      {
        heading: "Plantillas de checklist: documentar una vez, usar siempre",
        body: (
          <>
            <p>
              Las tareas repetitivas son el mejor lugar para empezar. Si todos los meses haces
              un lanzamiento, una reunión de retro o una auditoría de seguridad, convierte esos
              pasos en una plantilla de checklist. Así no tienes que recordar qué preguntar ni
              qué revisar: la plantilla lo hace por ti.
            </p>
            <p>
              En Hito, las plantillas de checklist se guardan en la biblioteca y se aplican a
              cualquier área de un proyecto con un clic. Es la forma más rápida de estandarizar
              calidad sin burocracia.
            </p>
          </>
        ),
      },
      {
        heading: "Preguntas frecuentes",
        body: (
          <>
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold text-foreground">¿Cuánto debe medir un SOP?</dt>
                <dd className="text-muted-foreground">
                  Lo suficiente para que alguien nuevo lo entienda. De uno a tres minutos de
                  lectura es ideal. Si es más largo, divídelo en subtareas.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">
                  ¿Quién debe escribir los SOPs?
                </dt>
                <dd className="text-muted-foreground">
                  La persona que mejor conoce el proceso. Luego otro miembro del equipo debería
                  poder ejecutarlo solo con el SOP.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">
                  ¿Con qué frecuencia actualizarlos?
                </dt>
                <dd className="text-muted-foreground">
                  Cada vez que el proceso cambie. Si un SOP lleva más de seis meses sin
                  revisión, es probable que esté desactualizado.
                </dd>
              </div>
            </dl>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Cómo documentar un proceso?",
        answer:
          "Empieza por el dolor concreto (el error que se repite), no por el manual completo. Escribe los pasos, los criterios de decisión y quién es responsable. Si alguien nuevo no puede ejecutarlo en unos minutos de lectura, todavía no está documentado: está resumido en tu cabeza.",
      },
      {
        question: "¿Qué es documentar un proceso?",
        answer:
          "Es dejar por escrito cómo se hace un trabajo recurrente para que no dependa de quien lo recuerde. Un SOP explica el cómo; un checklist verifica que no falte nada al entregar. Los dos se complementan.",
      },
      {
        question: "¿Cómo documentar procesos en un equipo pequeño?",
        answer:
          "Prioriza los tres que más fricción generan y déjalos al lado del trabajo, no en un wiki abandonado. En equipos chicos gana la documentación corta, editable y revisada cada vez que el proceso cambia.",
      },
    ],
  },
};
