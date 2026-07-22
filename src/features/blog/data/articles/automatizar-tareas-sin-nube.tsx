import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
  slug: "automatizar-tareas-sin-nube",
  title: "Cómo automatizar tareas sin nube: reglas locales para tu equipo",
  excerpt:
    "Las automatizaciones no tienen por qué depender de servicios externos. Aprendé a crear reglas locales trigger→condición→acción que funcionan offline.",
  category: "automatizacion",
  categoryLabel: "Automatización",
  publishedAt: "2026-07-05",
  readingTime: "7 min",
  featured: false,
  seo: {
    title: "Cómo automatizar tareas sin nube: reglas locales — Hito",
    description:
      "Guía para automatizar tareas sin depender de la nube. Cómo crear reglas trigger-condición-acción locales, offline y bajo tu control.",
    ogImageAlt: "Automatización de tareas sin nube.",
  },
  content: {
    eyebrow: "Automatización",
    intro: (
      <>
        Las automatizaciones más populares funcionan en la nube: cuando pasa algo en una app, se
        dispara una acción en otra. Son poderosas, pero también frágiles. Dependen de que ambas
        apps estén online, de que la integración siga soportada y de que tus datos viajen por
        servidores que no controlas. Para muchos equipos, eso es más riesgo del que parece.
        Existe otra forma: <strong>automatizar tareas sin nube</strong>, con reglas que se
        ejecutan sobre tus propios archivos.
      </>
    ),
    sections: [
      {
        heading: "Reglas locales, beneficios reales",
        body: (
          <>
            <p>
              Una automatización local se ejecuta sobre tus archivos, en tu navegador, sin
              enviar nada afuera. Cuando una tarea cambia de estado, se puede mover a otra
              columna, asignar una plantilla, generar una notificación o actualizar una fecha.
              Todo dentro de tu carpeta.
            </p>
            <p>
              La ventaja no es solo la privacidad: es la simplicidad. No hace falta conectar
              APIs, pagar por integraciones premium ni depender de que un servicio de terceros
              no cambie de precio.
            </p>
          </>
        ),
      },
      {
        heading: "El modelo trigger → condición → acción",
        body: (
          <>
            <p>
              La mayoría de las automatizaciones se pueden expresar con tres partes: un{" "}
              <strong>trigger</strong> (qué las dispara), una <strong>condición</strong> (cuándo
              aplican) y una <strong>acción</strong> (qué hacen). Por ejemplo: cuando una tarea
              pasa a "En progreso" (trigger), si no tiene fecha límite (condición), asignarle
              una plantilla de revisión (acción).
            </p>
            <p>
              Este modelo es suficientemente simple para que cualquiera lo entienda y
              suficientemente potente para automatizar gran parte de la rutina de un equipo.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplos prácticos de automatización local",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Completar checklist:</strong> cuando un área termina su checklist,
                marcar el proyecto como "listo para revisión".
              </li>
              <li>
                <strong>Crear proyecto desde tipo:</strong> al crear un proyecto desde un tipo,
                generar automáticamente las áreas, procesos y checklists por defecto.
              </li>
              <li>
                <strong>Recordatorios por fecha:</strong> si una tarea está por vencer, crear
                una notificación de alerta al abrir la app.
              </li>
              <li>
                <strong>Plantillas automáticas:</strong> al añadir un área "Legal" a un
                proyecto, aplicar el checklist de revisión contractural.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Funciona aunque se corte internet",
        body: (
          <>
            <p>
              En un mundo híbrido de trabajo, no siempre hay conexión confiable. Las
              automatizaciones locales no se detienen porque el Wi-Fi falló: se ejecutan cuando
              usas la app, y se aplican a tus archivos locales.
            </p>
            <p>
              Eso hace que sean ideales para profesionales que viajan, consultores en sitio del
              cliente o equipos que simplemente no quieren depender de la conectividad para que
              sus procesos funcionen.
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
                  ¿Las reglas locales consumen recursos de mi máquina?
                </dt>
                <dd className="text-muted-foreground">
                  Mínimos. Las reglas se evalúan sobre JSON locales y solo cuando disparas un
                  evento relevante.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">
                  ¿Pueden dos personas ejecutar las mismas reglas sobre la misma carpeta?
                </dt>
                <dd className="text-muted-foreground">
                  Sí. Cada persona ejecuta las reglas en su instancia local sobre los mismos
                  archivos compartidos.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">¿Necesito saber programar?</dt>
                <dd className="text-muted-foreground">
                  No. El modelo trigger-condición-acción está pensado para ser configurado sin
                  código.
                </dd>
              </div>
            </dl>
          </>
        ),
      },
    ],
  },
};
