import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
  slug: "organizar-proyectos-tareas-jerarquia",
  title: "Cómo organizar proyectos y tareas: una jerarquía simple para equipos",
  excerpt:
    "No necesitas más apps: necesitas una estructura clara. Descubre una jerarquía práctica para organizar proyectos, áreas, procesos y tareas.",
  category: "productividad",
  categoryLabel: "Productividad",
  publishedAt: "2026-07-05",
  readingTime: "7 min",
  featured: false,
  seo: {
    title: "Cómo organizar proyectos y tareas: jerarquía práctica — Hito",
    description:
      "Aprendé a organizar proyectos y tareas con una jerarquía clara. Producto, proyecto, área, proceso y tarea: cómo estructurar el trabajo de tu equipo.",
    ogImageAlt: "Jerarquía para organizar proyectos y tareas.",
  },
  content: {
    eyebrow: "Productividad",
    intro: (
      <>
        La mayoría de los equipos no tienen un problema de falta de herramientas: tienen un
        problema de falta de estructura. Tienen tareas en una app, documentos en otra, objetivos
        en una tercera y conversaciones en una cuarta. El resultado es fragmentación, no
        productividad. La solución no siempre es agregar más software: a veces es definir mejor
        cómo se relacionan las piezas. Acá va una jerarquía simple para{" "}
        <strong>organizar proyectos y tareas</strong> sin perder claridad.
      </>
    ),
    sections: [
      {
        heading: "Una jerarquía que piensa en capas",
        body: (
          <>
            <p>
              Piensa tu trabajo en cinco niveles: <strong>Producto</strong> (el paraguas
              estratégico), <strong>Proyecto</strong> (un esfuerzo concreto con inicio y fin),{" "}
              <strong>Área</strong> (una dimensión del proyecto, como diseño o legal),{" "}
              <strong>Proceso</strong> (cómo se hace algo en esa área) e{" "}
              <strong>Ítem de trabajo</strong> (la tarea ejecutable).
            </p>
            <p>
              Esta jerarquía no es burocracia: es una forma de saber siempre dónde va cada cosa.
              Cuando aparece una tarea, su lugar indica su contexto, su prioridad y su
              responsable.
            </p>
          </>
        ),
      },
      {
        heading: "Cada nivel tiene su propia pregunta",
        body: (
          <>
            <p>
              El producto responde "¿hacia dónde vamos?". El proyecto responde "¿qué entregamos
              ahora?". El área responde "¿quién y cómo lo hace?". El proceso responde "¿cómo se
              hace bien?". Y la tarea responde "¿qué hago hoy?".
            </p>
            <p>
              Si mezclas esos niveles, terminas con reuniones de producto que discuten tareas, o
              con tareas sueltas que no se sabe a qué proyecto pertenecen. La claridad empieza
              por separar bien esas conversaciones.
            </p>
          </>
        ),
      },
      {
        heading: "De la estructura a la acción",
        body: (
          <>
            <p>
              Una buena jerarquía no solo organiza: acelera. Cuando sabes dónde vive cada
              decisión, no pierdes tiempo buscando. Cuando un proyecto está enfermo, puedes ver
              en qué nivel falla: ¿falta estrategia, recursos, documentación o ejecución?
            </p>
            <p>
              Hito está construido sobre esa jerarquía: Producto → Proyecto → Área → Proceso /
              Checklist → Tarea. No es un accidente del diseño: es la convicción de que
              organizar bien es trabajar menos.
            </p>
          </>
        ),
      },
      {
        heading: "Checklists como puente entre proceso y tarea",
        body: (
          <>
            <p>
              La jerarquía no es solo teórica. Un checklist convierte un proceso abstracto en
              acciones concretas. Por ejemplo, el proceso "Publicar release" se traduce en un
              checklist con ítems como "Correr tests", "Actualizar changelog" y "Desplegar a
              producción". Cada ítem puede convertirse en una tarea del Kanban si es necesario.
            </p>
            <p>
              Así, la documentación y la ejecución no viven en mundos separados. El mismo
              proceso que guía a un nuevo integrante sirve para controlar la calidad antes de
              entregar.
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
                <dt className="font-semibold text-foreground">
                  ¿Cuántos niveles necesita un equipo pequeño?
                </dt>
                <dd className="text-muted-foreground">
                  Los cinco básicos suelen ser suficientes. Lo importante no es la cantidad,
                  sino que cada cosa tenga un lugar claro.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">
                  ¿Qué pasa si un proyecto no pertenece a un producto?
                </dt>
                <dd className="text-muted-foreground">
                  Puedes tener proyectos sueltos, pero conviene agruparlos bajo un producto
                  ficticio o interno para mantener la jerarquía.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">
                  ¿Cómo evitar que la jerarquía se vuelva burocracia?
                </dt>
                <dd className="text-muted-foreground">
                  Revisala cada mes. Si un nivel no aporta claridad, simplificalo. La jerarquía
                  debe servir al equipo, no al revés.
                </dd>
              </div>
            </dl>
          </>
        ),
      },
    ],
  },
};
