import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
  slug: "versionar-proyectos-con-git",
  title: "Cómo versionar proyectos con Git",
  excerpt:
    "Aprende a poner tu gestor de proyectos bajo control de versiones con Git: historial real, diffs legibles y cero dependencia de un servidor ajeno.",
  category: "privacidad",
  categoryLabel: "Privacidad",
  publishedAt: "2026-08-24",
  readingTime: "8 min",
  featured: false,
  seo: {
    title: "Cómo versionar proyectos con Git: guía paso a paso — Hito",
    description:
      "Aprende a poner tu gestor de proyectos bajo control de versiones con Git: historial real, diffs legibles y cero dependencia de un servidor ajeno.",
    ogImageAlt: "Versionar proyectos con Git.",
  },
  content: {
    eyebrow: "Privacidad",
    intro: (
      <>
        <strong>En una línea:</strong> puedes versionar tus proyectos con Git si la herramienta
        que usas guarda los datos como archivos, no como filas ocultas en la base de datos de un
        servidor ajeno. En Hito, cada proyecto, tarea y proceso es un archivo <code>.json</code>{" "}
        plano en tu carpeta, así que poner tu workspace bajo Git es literalmente{" "}
        <code>git init</code> y un primer commit. Esta guía te muestra los pasos exactos.
      </>
    ),
    sections: [
      {
        heading: "El problema: el historial no es tuyo",
        body: (
          <>
            <p>
              Trello, Notion y ClickUp tienen un "historial de actividad", pero es un historial
              que <strong>ellos</strong> controlan. Vive en su servidor, en su formato, con la
              retención que decidan. Si mañana cambian los términos, limitan el historial a los
              últimos 30 días en el plan gratis, o simplemente cierran el servicio, tu historial
              de cambios desaparece con ellos.
            </p>
            <p>
              Para equipos técnicos esto es un problema conocido — porque ya resolvieron
              exactamente el mismo problema con el código hace años. La respuesta se llama{" "}
              <a href="https://git-scm.com/about" target="_blank" rel="noopener noreferrer">
                Git
              </a>
              : un sistema de control de versiones distribuido donde el historial vive en tu
              propio disco, no en un servidor de terceros.
            </p>
            <p>
              La pregunta que este post responde es simple:{" "}
              <strong>¿se puede aplicar la misma lógica a la gestión de proyectos?</strong> Sí,
              pero solo si la herramienta lo permite a nivel de arquitectura.
            </p>
          </>
        ),
      },
      {
        heading: "Por qué esto es posible en Hito (y no en la mayoría de herramientas)",
        body: (
          <>
            <p>
              Esto no es una integración de Hito con Git. No hay un botón "conectar a GitHub"
              dentro de la app, y es importante ser honestos al respecto. Lo que sí existe es
              una arquitectura de storage que hace que Git funcione de forma natural, sin ningún
              trabajo extra:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Hito guarda tu workspace como una carpeta de archivos <code>.json</code> planos,
                no en una base de datos propietaria.
              </li>
              <li>
                Cada entidad es su propio archivo: cada proyecto vive en{" "}
                <code>projects/{"{id}"}.json</code>, cada checklist en{" "}
                <code>checklist-templates/{"{id}"}.json</code>, y así con cada colección
                (productos, tipos de proyecto, procesos, automatizaciones, trimestres).
              </li>
              <li>
                Hay un <code>workspace.json</code> en la raíz con la configuración general.
              </li>
              <li>
                Todo esto se valida con esquemas antes de guardarse, así que los archivos son
                consistentes y legibles con cualquier editor de texto.
              </li>
            </ul>
            <p>
              En otras palabras: Git no es una feature que Hito construyó. Es una consecuencia
              directa de ser{" "}
              <a
                href="https://hito.autos/blogs/local-first-guia-definitiva-2026"
                target="_blank"
                rel="noopener noreferrer"
              >
                local-first
              </a>{" "}
              — tus datos ya están en un formato que cualquier herramienta de versionado puede
              leer. Puedes verificarlo tú mismo: el{" "}
              <a
                href="https://github.com/appcreathings/Gestion-de-Proyectos-APP"
                target="_blank"
                rel="noopener noreferrer"
              >
                código de Hito es público y auditable en GitHub
              </a>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Cómo versionar tu carpeta de Hito con Git",
        body: (
          <>
            <p>
              Estos son los pasos reales, usando comandos estándar de Git — no hace falta
              ninguna herramienta adicional.
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Conecta Hito a una carpeta local.</strong> Si usas Chrome, Edge o Brave,
                Hito te deja elegir la carpeta directamente desde el navegador (File System
                Access API). Si usas Firefox o Safari, exporta/importa archivos manualmente. En
                ambos casos, termina existiendo una carpeta real en tu disco.
              </li>
              <li>
                <strong>Abre una terminal en esa carpeta e inicializa el repositorio:</strong>
                <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-sm">
                  <code>cd /ruta/a/tu/workspace-hito{"\n"}git init</code>
                </pre>
              </li>
              <li>
                <strong>
                  Crea un <code>.gitignore</code>
                </strong>{" "}
                para excluir lo que no aporta al historial (ver sección siguiente).
              </li>
              <li>
                <strong>Haz tu primer commit:</strong>
                <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-sm">
                  <code>git add .{"\n"}git commit -m "Estado inicial del workspace"</code>
                </pre>
                Este commit es tu línea base. A partir de acá, cada cambio que hagas en Hito
                —crear una tarea, mover una tarjeta, editar un proceso— queda disponible para
                que lo confirmes con <code>git add</code> y <code>git commit</code> cuando
                quieras.
              </li>
              <li>
                <strong>Revisa cambios antes de confirmarlos:</strong>
                <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-sm">
                  <code>git status{"\n"}git diff</code>
                </pre>
                Como cada tarea es un archivo JSON individual, <code>git diff</code> te muestra
                exactamente qué campo cambió — el <code>status</code> de una tarea, un
                comentario nuevo, una fecha de vencimiento— igual que verías el diff de una
                línea de código.
              </li>
              <li>
                <strong>Consulta el historial completo cuando lo necesites:</strong>
                <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-sm">
                  <code>git log --oneline -- projects/</code>
                </pre>
                Esto te da un historial real, con autor, fecha y mensaje de cada cambio — algo
                que ninguna app cloud te da con este nivel de detalle y control.
              </li>
              <li>
                <strong>Marca hitos importantes con tags</strong> (por ejemplo, el cierre de un
                sprint o la entrega a un cliente):
                <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-sm">
                  <code>git tag -a cierre-q1-2026 -m "Cierre de proyectos Q1"</code>
                </pre>
              </li>
              <li>
                <strong>Comparte el repositorio con tu equipo</strong> si quieres colaboración
                con historial compartido: puedes usar un remoto privado (GitHub, GitLab, Gitea
                autoalojado) y trabajar con <code>git pull</code> / <code>git push</code> como
                con cualquier repo de código. Si no quieres un servidor remoto, una carpeta
                compartida por red también funciona — el historial de Git vive dentro de la
                propia carpeta.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Qué excluir del .gitignore",
        body: (
          <>
            <p>
              Un <code>.gitignore</code> razonable para un workspace de Hito:
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-sm">
              <code>.backups/</code>
            </pre>
            <p>
              Hito crea automáticamente una carpeta <code>.backups/</code> con snapshots previos
              a migraciones de esquema (por ejemplo, cuando actualizas de versión y el formato
              de un archivo cambia). Una vez que tienes Git llevando el historial real, esos
              snapshots automáticos son redundantes — Git ya te permite volver a cualquier
              estado anterior con más precisión. Esta es una recomendación práctica nuestra, no
              un requisito de Hito: si prefieres conservar ambos, no pasa nada.
            </p>
          </>
        ),
      },
      {
        heading: "Merge conflicts: cuándo pasan y cómo evitarlos",
        body: (
          <>
            <p>
              Si dos personas usan la misma carpeta sin coordinarse, pueden pasar conflictos de
              merge — como con cualquier repo de Git. La buena noticia es que la arquitectura de
              "un archivo por entidad" reduce mucho el riesgo: si tú editas la tarea A y tu
              compañero edita la tarea B, son dos archivos distintos y Git los combina sin
              problema.
            </p>
            <p>
              El conflicto real aparece cuando{" "}
              <strong>dos personas editan la misma tarea o el mismo proceso</strong> en paralelo
              sin sincronizar. Ahí sí vas a tener que resolver el conflicto manualmente, igual
              que harías con un archivo de código. Para equipos que editan mucho en simultáneo
              sobre las mismas entidades, un sync en tiempo real (Dropbox, Google Drive) evita
              esta fricción mejor que Git.
            </p>
          </>
        ),
      },
      {
        heading: "Git vs Dropbox/Drive: cuándo usar cada uno",
        body: (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left">
                <th className="py-2 pr-4 font-semibold">Necesitas…</th>
                <th className="py-2 font-semibold">Usa</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">Historial real, auditable, con diffs y autoría</td>
                <td className="py-2 font-semibold">Git</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">Volver a cualquier estado anterior con precisión</td>
                <td className="py-2 font-semibold">Git</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">Colaboración simultánea sin pensar en conflictos</td>
                <td className="py-2 font-semibold">Dropbox / Google Drive</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">
                  Onboarding sin conocimientos técnicos en el equipo
                </td>
                <td className="py-2 font-semibold">Dropbox / Google Drive</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">Auditoría de cambios para compliance</td>
                <td className="py-2 font-semibold">Git</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Simplicidad máxima, cero fricción</td>
                <td className="py-2 font-semibold">Dropbox / Google Drive</td>
              </tr>
            </tbody>
          </table>
        ),
      },
      {
        heading: "Conclusión",
        body: (
          <>
            <p>
              Versionar proyectos con Git deja de ser una idea exótica en cuanto la herramienta
              que usas guarda tus datos como archivos abiertos. En Hito no hace falta ninguna
              integración especial: tu workspace ya es una carpeta de JSON planos, así que{" "}
              <code>git init</code> y un primer commit son suficientes para empezar a tener el
              mismo control de versiones que ya usas en tu código.
            </p>
            <p>
              Si quieres probarlo, instala Hito, conecta una carpeta y corre los ocho pasos de
              esta guía — vas a tener historial real de tus proyectos en menos de cinco minutos.
            </p>
            <p>
              <strong>Sobre Hito:</strong> Gestión de proyectos, procesos y checklists 100%
              local-first. Open source (MIT), sin nube, sin cuenta, sin suscripción.{" "}
              <a href="https://hito.autos" target="_blank" rel="noopener noreferrer">
                <strong>Pruébalo gratis →</strong>
              </a>
            </p>
          </>
        ),
      },
    ],
  },
};
