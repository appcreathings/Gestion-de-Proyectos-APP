import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
  slug: "hito-para-estudio-juridico",
  title: "Cómo configurar Hito para un estudio jurídico",
  excerpt:
    "Guía práctica para organizar expedientes, clientes y tareas de un estudio jurídico en Hito, sin nube ni cuentas externas.",
  category: "implementacion",
  categoryLabel: "Implementación",
  publishedAt: "2026-10-05",
  readingTime: "11 min",
  featured: false,
  seo: {
    title: "Cómo configurar Hito para un estudio jurídico | Hito",
    description:
      "Guía práctica para organizar expedientes, clientes y tareas de un estudio jurídico en Hito, sin nube ni cuentas externas.",
    ogImageAlt:
      "Configurar Hito para un estudio jurídico: expedientes, clientes y colaboración.",
  },
  content: {
    eyebrow: "Implementación",
    intro: (
      <>
        <strong>En una línea:</strong> configurar Hito para un estudio jurídico implica tres
        decisiones: mapear tus áreas de práctica y expedientes al modelo producto → proyecto →
        área de Hito, decidir si aíslas cada cliente en su propia carpeta de trabajo, y definir
        cómo va a colaborar el equipo sin depender de una nube. Esta guía cubre las tres, con el
        detalle práctico de cada una.
      </>
    ),
    sections: [
      {
        heading: "Cómo mapear tu estructura real al modelo de Hito",
        body: (
          <>
            <p>
              En un estudio jurídico, la confidencialidad no es un checkbox de compliance — es
              secreto profesional. Eso descarta de entrada cualquier herramienta que guarde tus
              expedientes en el servidor de otra empresa, sin importar cuántas certificaciones
              tenga. Hito resuelve esto por arquitectura: no hay servidor, no hay cuenta, tus
              datos son archivos en tu equipo.
            </p>
            <p>
              Hito organiza todo en una jerarquía: <strong>producto → proyecto → área</strong>,
              con procesos (SOPs), checklists y tareas colgando de cada área. Para un estudio
              jurídico, la traducción más natural es:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Producto:</strong> tu estudio, o un área de práctica si el estudio es
                multidisciplinario (por ejemplo, "Derecho Corporativo" y "Derecho Laboral" como
                dos productos separados).
              </li>
              <li>
                <strong>Proyecto:</strong> cada expediente o caso activo. Un cliente con dos
                causas distintas tiene dos proyectos, no uno.
              </li>
              <li>
                <strong>Área:</strong> las fases del caso (por ejemplo, "Instrucción",
                "Audiencias", "Cierre"), cada una con sus propios procesos, checklists y tareas.
              </li>
            </ul>
            <p>
              Esta estructura te da algo que una lista plana de tareas no da: cuando abres un
              expediente, ves de un vistazo en qué fase está, qué falta y quién es responsable —
              sin depender de la memoria de una sola persona del equipo.
            </p>
          </>
        ),
      },
      {
        heading: "Separación de casos por cliente: el patrón recomendado",
        body: (
          <>
            <p>
              Aquí hay un matiz importante en el que preferimos ser honestos en lugar de
              prometer de más:{" "}
              <strong>
                hoy Hito no tiene una función para exportar un solo expediente de forma aislada.
              </strong>{" "}
              El export de Ajustes genera un archivo <code>.json</code> con todo el workspace,
              no un archivo separado por cliente.
            </p>
            <p>
              Para un estudio que necesita aislamiento real entre clientes (por ejemplo, si un
              cliente pide que su información nunca comparta espacio físico con la de otro), la
              forma correcta de lograrlo con lo que Hito ofrece hoy es{" "}
              <strong>usar una carpeta de trabajo distinta por cliente</strong>. Hito te permite
              conectar y cambiar de carpeta libremente, así que el flujo es:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                Crea una carpeta en tu disco (o en tu sistema de backups) por cada cliente.
              </li>
              <li>Conecta Hito a esa carpeta cuando trabajes en ese cliente específico.</li>
              <li>
                Al cerrar el caso, archivas la carpeta completa (junto con todo su historial, si
                la versionaste con Git) y queda aislada del resto.
              </li>
            </ol>
            <p>
              Es más manual que un botón de "exportar este cliente", pero es un patrón real,
              verificado y que no depende de ninguna feature que no exista. Si tu estudio maneja
              pocos clientes muy sensibles a la vez, esta separación física es, de hecho, más
              segura que cualquier exportación automática.
            </p>
            <p>
              Para estudios con muchos clientes activos simultáneamente donde la separación
              total no es un requisito duro, un solo workspace con un proyecto por expediente
              (como describimos arriba) es más simple de operar en el día a día.
            </p>
          </>
        ),
      },
      {
        heading: "Documenta el proceso de apertura de expediente",
        body: (
          <>
            <p>
              Uno de los procesos que más se beneficia de estar documentado como SOP es la
              apertura de un expediente nuevo: qué documentos pedir, qué conflictos de interés
              verificar, cuándo notificar al cliente. Si ya tienes un{" "}
              <a
                href="https://hito.autos/blogs/plantillas-sop-descargables"
                target="_blank"
                rel="noopener noreferrer"
              >
                proceso de onboarding de cliente
              </a>{" "}
              importado en tu Biblioteca, es la base perfecta para adaptarlo a la apertura de un
              caso: agrega los pasos específicos de tu jurisdicción y aplícalo a cada expediente
              nuevo para no depender de que alguien "se acuerde" de todos los pasos.
            </p>
          </>
        ),
      },
      {
        heading: "Colaboración entre profesionales del estudio",
        body: (
          <>
            <p>
              Si son varios abogados trabajando sobre los mismos expedientes, necesitas que
              todos vean la misma carpeta. Las opciones, de más simple a más robusta:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Dropbox o Google Drive:</strong> cada persona conecta Hito a la misma
                carpeta sincronizada. Simple, sin configuración técnica.
              </li>
              <li>
                <strong>Git:</strong> si el estudio tiene perfil técnico o quiere{" "}
                <a
                  href="https://hito.autos/blogs/versionar-proyectos-con-git"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  historial auditable de cada cambio
                </a>
                , versionar la carpeta con Git te da un registro completo de quién cambió qué y
                cuándo — útil si alguna vez necesitas reconstruir la cronología de un
                expediente.
              </li>
            </ul>
            <p>
              Ninguna de las dos requiere que el estudio dependa de un servidor externo para
              colaborar.
            </p>
          </>
        ),
      },
      {
        heading: "El asistente de IA: cuándo activarlo y cuándo no",
        body: (
          <>
            <p>
              Hito incluye un asistente de IA opcional. Es genuinamente útil para resumir el
              estado de un expediente o buscar información dentro de tu workspace — pero hay que
              ser honestos sobre el trade-off: cuando lo activas, el contenido relevante de tu
              workspace viaja a la API de Gemini con tu propia API key.
            </p>
            <p>
              Para un estudio jurídico, la recomendación es simple: si el contenido de un
              expediente es extremadamente sensible (por ejemplo, información cubierta por
              secreto profesional estricto), no actives el asistente ni la búsqueda semántica
              para ese workspace en particular. El resto de Hito —kanban, checklists, procesos—
              funciona 100% local sin necesidad de la IA. Puedes reservar el asistente para
              workspaces administrativos (gestión interna del estudio, no expedientes de
              clientes) si prefieres no arriesgar nada.
            </p>
          </>
        ),
      },
      {
        heading: "Backup y archivo al cerrar un caso",
        body: (
          <>
            <p>Cuando cierras un expediente, dos cosas razonables para hacer:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Exporta el workspace completo</strong> desde Ajustes (genera un archivo{" "}
                <code>{'"hito-{fecha}.json"'}</code> con todo tu workspace) como respaldo
                adicional, sabiendo que es un backup del workspace entero, no solo de ese
                cliente.
              </li>
              <li>
                <strong>Archiva la carpeta física</strong> del cliente (si usaste el patrón de
                una carpeta por cliente) en tu sistema de backups o almacenamiento frío, tal
                como harías con cualquier expediente físico.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Checklist de arranque en 15 minutos",
        body: (
          <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
            <li>Decide si vas a usar un workspace único o una carpeta por cliente.</li>
            <li>Crea tu primer producto (estudio o área de práctica).</li>
            <li>
              Da de alta tu primer expediente como proyecto, con sus áreas (fases del caso).
            </li>
            <li>
              Importa o crea el proceso de apertura de expediente como plantilla reutilizable.
            </li>
            <li>
              Decide si vas a activar el asistente de IA para este workspace, o dejarlo apagado.
            </li>
            <li>
              Si trabajan varios abogados, define el método de colaboración (Dropbox, Drive o
              Git).
            </li>
          </ol>
        ),
      },
      {
        heading: "Conclusión",
        body: (
          <>
            <p>
              Un estudio jurídico no necesita la herramienta con más features — necesita una que
              no ponga en riesgo el secreto profesional y que ordene expedientes de forma clara.
              Hito resuelve lo primero por arquitectura (sin servidor, sin cuenta) y lo segundo
              con una jerarquía simple de producto, proyecto y área. El resto son decisiones
              tuyas: cuánto aislar cada cliente, cómo colabora el equipo y cuándo vale la pena
              activar la IA.
            </p>
            <p>
              👉{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                <strong>Prueba Hito gratis</strong>
              </a>{" "}
              — gestor de proyectos, procesos y checklists 100% local-first, open source (MIT).
              Sin cuenta, sin nube, sin suscripción.
            </p>
          </>
        ),
      },
    ],
  },
};
