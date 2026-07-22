import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
  slug: "gestion-proyectos-sin-nube",
  title: "Gestión de proyectos sin nube: por qué la soberanía de datos es una ventaja",
  excerpt:
    "Descubre por qué cada vez más equipos eligen un gestor de proyectos sin nube. Control total, privacidad real y datos que siempre puedes migrar.",
  category: "privacidad",
  categoryLabel: "Privacidad",
  publishedAt: "2026-07-05",
  readingTime: "7 min",
  featured: true,
  seo: {
    title: "Gestión de proyectos sin nube: soberanía de datos como ventaja — Hito",
    description:
      "¿Por qué usar un gestor de proyectos sin nube? Ventajas de local-first: privacidad, control total, sin suscripciones y datos siempre migrables.",
    ogImageAlt: "Gestión de proyectos local-first sin nube.",
  },
  content: {
    eyebrow: "Privacidad",
    intro: (
      <>
        Durante años aceptamos que gestionar proyectos significa subir todo a la nube de algún
        proveedor. Aceptamos los límites del plan gratuito, las exportaciones parciales y los
        términos de servicio que cambian cada semestre. Pero lo que menos hablamos es de lo que
        cedemos a cambio: el control de nuestros propios datos. La buena noticia es que existe
        una alternativa concreta: un <strong>gestor de proyectos sin nube</strong>, también
        llamado local-first.
      </>
    ),
    sections: [
      {
        heading: "¿Qué es un gestor de proyectos sin nube?",
        body: (
          <>
            <p>
              Un gestor de proyectos sin nube es una herramienta donde tus datos nunca se envían
              a servidores de terceros. En lugar de una base de datos remota, tus proyectos,
              tareas, procesos y checklists viven en archivos locales —por ejemplo, archivos{" "}
              <code>.json</code> dentro de una carpeta que tú eliges en tu equipo.
            </p>
            <p>
              Eso no significa que no puedas compartir el trabajo. Puedes usar Git, Dropbox, una
              red local o cualquier medio que ya utilices. La diferencia es que tú decides dónde
              y cómo se sincronizan los datos, no un tercero.
            </p>
          </>
        ),
      },
      {
        heading: 'El costo oculto del SaaS "gratis"',
        body: (
          <>
            <p>
              Las herramientas de productividad no son caritativas. Cuando un servicio no te
              cobra directamente, tu atención, tus patrones de uso y, cada vez más, tus
              contenidos son el producto. No se trata de conspiraciones: se trata de modelos de
              negocio. Y cuando esos datos incluyen estrategias de producto, conversaciones con
              clientes o procesos internos, el costo real puede ser muy alto.
            </p>
            <p>
              La soberanía de los datos no significa rechazar toda la nube. Significa decidir
              conscientemente qué información vive dónde, bajo qué condiciones y quién puede
              acceder a ella. Un gestor de proyectos local te devuelve esa decisión.
            </p>
          </>
        ),
      },
      {
        heading: "5 ventajas de un gestor de proyectos local-first",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Privacidad real:</strong> tus datos nunca salen de tu dispositivo a
                menos que tú lo decidas.
              </li>
              <li>
                <strong>Control total:</strong> puedes abrir, editar, versionar y respaldar tus
                archivos con cualquier herramienta.
              </li>
              <li>
                <strong>Sin suscripciones ocultas:</strong> no hay límites de usuarios,
                proyectos o funciones premium.
              </li>
              <li>
                <strong>Funciona offline:</strong> una PWA local-first sigue operando sin
                internet.
              </li>
              <li>
                <strong>Migrabilidad garantizada:</strong> si mañana cambias de herramienta, tus
                datos ya están en un formato abierto.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Local-first como decisión de gobierno",
        body: (
          <>
            <p>
              Trabajar con datos locales no es un retroceso tecnológico. Es una decisión de
              arquitectura que devuelve el control al usuario. Tus proyectos viven en archivos
              que puedes abrir, versionar, respaldar y migrar. No dependes del uptime de un
              tercero ni de una política de exportación que puede cambiar mañana.
            </p>
            <p>
              Para equipos pequeños y medianos, esto también es una ventaja práctica: la carpeta
              de trabajo puede compartirse por los medios que ya usan, desde Git hasta una red
              local, sin agregar nuevas cuentas ni permisos externos.
            </p>
          </>
        ),
      },
      {
        heading: "La confianza como diferenciador comercial",
        body: (
          <>
            <p>
              En sectores como el legal, el contable, la consultoría o cualquier área que maneje
              información sensible, "usamos una herramienta en la nube" deja de ser una
              respuesta suficiente. Poder decir "nuestros datos nunca salen de nuestra
              infraestructura" se convierte en un diferenciador comercial real.
            </p>
            <p>
              Hito nace de esa premisa: una herramienta de gestión que funciona offline, guarda
              todo en archivos legibles y te permite trabajar sin renunciar al control. Si
              buscas una alternativa a Notion o una alternativa a Trello sin depender de la
              nube, el modelo local-first es la respuesta más honesta.
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
                  ¿Un gestor de proyectos sin nube funciona para equipos?
                </dt>
                <dd className="text-muted-foreground">
                  Sí. Como los datos son archivos, puedes compartir la carpeta por Git, Dropbox,
                  Drive o red local. Cada persona abre la misma carpeta desde su app.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">
                  ¿Qué pasa si pierdo mi dispositivo?
                </dt>
                <dd className="text-muted-foreground">
                  Deberías incluir la carpeta en tu backup habitual. Al ser archivos JSON
                  abiertos, se respaldan como cualquier carpeta de trabajo.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">¿Es más lento que la nube?</dt>
                <dd className="text-muted-foreground">
                  No. La lectura y escritura son locales, así que incluso sin internet la app
                  responde al instante.
                </dd>
              </div>
            </dl>
          </>
        ),
      },
    ],
  },
};
