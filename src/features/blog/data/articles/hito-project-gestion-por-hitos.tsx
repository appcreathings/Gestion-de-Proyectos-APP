import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
  slug: "hito-project-gestion-por-hitos",
  title: "Hito Project: cómo gestionar proyectos avanzando por hitos",
  excerpt:
    "Gestionar por hitos es avanzar con puntos de control claros. Conocé la filosofía del Hito Project: proyectos locales, hitos verificables y cero dependencia de la nube.",
  category: "productividad",
  categoryLabel: "Productividad",
  publishedAt: "2026-07-07",
  readingTime: "7 min",
  featured: true,
  seo: {
    title: "Hito Project: gestión de proyectos por hitos, sin nube — Hito",
    description:
      "Gestionar por hitos es avanzar con puntos de control claros. Conocé la filosofía del Hito Project: proyectos locales, hitos verificables y cero dependencia de la nube.",
    ogImageAlt: "Filosofía Hito Project: gestión por hitos.",
  },
  content: {
    eyebrow: "Productividad",
    intro: (
      <>
        El nombre no es casualidad. <strong>Hito</strong> viene de la idea de que los proyectos
        no se miden por la cantidad de tareas abiertas, sino por los puntos de control que se
        van superando. Un hito es un mojón en el camino: te dice dónde estabas, dónde estás y
        cuánto falta. La filosofía del <strong>Hito Project</strong> lleva esa idea al extremo:
        gestionar todo el proyecto como una sucesión de hitos verificables, con documentación
        viva y control total sobre tus datos. Sin nube, sin suscripciones, sin depender de que
        un servidor tercero esté online para que tu equipo funcione.
      </>
    ),
    sections: [
      {
        heading: "Qué es el Hito Project",
        body: (
          <>
            <p>
              El Hito Project es una forma de entender la gestión de proyectos donde el{" "}
              <strong>hito</strong> es la unidad central de progreso. No es una metodología
              cerrada con certificaciones y manuales de 400 páginas. Es un principio simple: si
              no puedes verificar que avanzaste, no avanzaste.
            </p>
            <p>
              Esta filosofía se materializa en una herramienta concreta: la app Hito, un gestor
              de proyectos local-first donde cada proyecto se organiza en áreas, procesos y
              checklists. Los hitos no se configuran aparte: emergen cuando un proceso se
              completa, cuando un checklist se marca como terminado, cuando un área entrega su
              resultado.
            </p>
          </>
        ),
      },
      {
        heading: "Por qué gestionar por hitos funciona",
        body: (
          <>
            <p>
              La gestión tradicional de proyectos suele caer en dos extremos: o microgestión de
              tareas (que agota al equipo y al líder) o planificación abstracta de alto nivel
              (que nadie entiende cuando abre el Excel). Gestionar por hitos ofrece un punto
              medio:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Claridad:</strong> todo el equipo sabe qué se necesita para "llegar al
                siguiente mojón". No hay ambigüedad sobre qué significa avanzar.
              </li>
              <li>
                <strong>Momentum:</strong> cada hito completado es una victoria visible. Eso
                genera inercia positiva, no la sensación de correr en una rueda de hámster.
              </li>
              <li>
                <strong>Puntos de control sin microgestión:</strong> no necesitas preguntar
                "¿cómo vas?" cada dos horas. El hito te dice si se llegó o no.
              </li>
            </ol>
            <p>
              Para equipos pequeños y medianos, esto es especialmente valioso: no tienes un PM
              dedicado ni herramientas enterprise. Necesitas algo simple que funcione y que no
              te esclavice.
            </p>
          </>
        ),
      },
      {
        heading: "Los 4 principios del Hito Project",
        body: (
          <>
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold text-foreground">1. Hitos verificables</dt>
                <dd className="text-muted-foreground">
                  Cada punto de control debe poder confirmarse objetivamente. No alcanza con
                  "creo que ya está". O se puede verificar, o no es un hito.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">2. Progreso visible</dt>
                <dd className="text-muted-foreground">
                  El estado del proyecto debe ser legible en un vistazo. Si necesitas tres
                  reuniones para saber dónde estás, la herramienta no te está ayudando.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">3. Documentación viva</dt>
                <dd className="text-muted-foreground">
                  Los procesos y checklists no son archivos muertos en una wiki: están al lado
                  del trabajo, se actualizan con el proyecto y se usan de verdad.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">4. Control local</dt>
                <dd className="text-muted-foreground">
                  Tus datos viven en archivos que tú controlas. No en servidores de terceros, no
                  en planes premium, no en exportaciones parciales. Si mañana quieres migrar,
                  tus datos ya están en un formato abierto.
                </dd>
              </div>
            </dl>
          </>
        ),
      },
      {
        heading: "Cómo aplicar esta filosofía con Hito",
        body: (
          <>
            <p>
              La app Hito está construida sobre una jerarquía que hace que los hitos emerjan de
              forma natural:{" "}
              <strong>Producto → Proyecto → Área → Proceso / Checklist → Tarea</strong>. Cada
              nivel responde a una pregunta distinta y cada uno aporta su propio punto de
              control.
            </p>
            <p>
              Cuando un área completa su checklist, eso es un hito. Cuando un proceso se ejecuta
              y se marca como terminado, eso es otro hito. No necesitas configurar un módulo de
              "milestones" aparte: la estructura del proyecto ya te los da.
            </p>
            <p>
              Además, como todo es local-first, puedes versionar tus proyectos con Git,
              compartir la carpeta del equipo por los medios que ya usan y trabajar sin
              internet. La filosofía del Hito Project no es solo un concepto: es la arquitectura
              de la herramienta.
            </p>
          </>
        ),
      },
      {
        heading: "Hito Project vs gestión tradicional",
        body: (
          <>
            <p>
              La gestión tradicional de proyectos suele venir atada a herramientas pesadas:
              Jira, Asana, Monday, ClickUp. Son poderosas, pero también complejas, caras y
              dependientes de la nube. El Hito Project propone otra cosa:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Sin microgestión:</strong> no necesitas registrar cada minuto de
                trabajo. Los hitos marcan el progreso, no las horas facturadas.
              </li>
              <li>
                <strong>Sin dependencias de nube:</strong> tus datos son archivos JSON en tu
                equipo. No dependes del uptime de un tercero ni de que renueven una integración.
              </li>
              <li>
                <strong>Sin suscripciones:</strong> no hay plan premium, no hay límite de
                usuarios, no hay features bloqueadas. Es MIT, es todo, siempre.
              </li>
              <li>
                <strong>Sin fricción de onboarding:</strong> no hay que crear cuenta, verificar
                email ni configurar un workspace en la nube. Abres la app y empiezas a trabajar.
              </li>
            </ul>
            <p>
              Esto no significa que el Hito Project sea para todos. Si tu equipo tiene 50
              personas y necesita SSO, audit logs distribuidos y compliance SOC2, hay
              herramientas mejores para eso. Pero si eres un equipo de 1 a 15 personas que
              valora la claridad, la privacidad y el control, esta filosofía está pensada para
              ti.
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
                  ¿Hito Project es una metodología o una herramienta?
                </dt>
                <dd className="text-muted-foreground">
                  Es ambos. La filosofía de gestionar por hitos es el principio; la app Hito es
                  la implementación concreta. Puedes aplicar el principio con cualquier
                  herramienta, pero Hito está diseñada desde cero para que sea natural.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">
                  ¿Puedo usar Hito sin internet?
                </dt>
                <dd className="text-muted-foreground">
                  Sí. Es una PWA local-first: funciona completamente offline. Los datos se
                  guardan en archivos locales y el asistente de IA es opcional (requiere tu
                  propia API key).
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">
                  ¿Cómo comparto proyectos con mi equipo?
                </dt>
                <dd className="text-muted-foreground">
                  Como compartes cualquier carpeta: Git, Dropbox, Drive, red local. Cada persona
                  abre la misma carpeta desde su app. No hay servidores de por medio.
                </dd>
              </div>
            </dl>
          </>
        ),
      },
    ],
  },
};
