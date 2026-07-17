import { Link } from "react-router-dom";
import type { DocModule } from "../types";

export const DOC_MODULES: DocModule[] = [
  {
    slug: "primeros-pasos",
    title: "Primeros pasos",
    excerpt:
      "Elige tu carpeta local, instala la PWA y crea tu primer producto y proyecto en menos de un minuto.",
    group: "empezar",
    seo: {
      title: "Primeros pasos con Hito — Documentación",
      description:
        "Cómo elegir tu carpeta de datos, instalar Hito como app (PWA) y crear tu primer producto y proyecto.",
      ogImageAlt: "Primeros pasos en Hito.",
    },
    content: {
      eyebrow: "Primeros pasos",
      intro: (
        <>
          Hito es <strong>local-first</strong>: no hay cuenta, no hay servidor. Tus datos viven en
          archivos <code>.json</code> dentro de una carpeta que eliges vos mismo en tu equipo. Estos
          son los tres pasos para empezar a usarlo.
        </>
      ),
      sections: [
        {
          heading: "1. Elige tu carpeta de trabajo",
          body: (
            <>
              <p>
                Al abrir Hito por primera vez, el navegador te pide elegir una carpeta (vacía o ya
                usada por Hito). Esto usa la <strong>File System Access API</strong>, disponible en
                Chrome y Edge. Cada vez que abras la app, se reconecta a la misma carpeta sin volver a
                preguntarte, salvo que revoques el permiso desde el navegador.
              </p>
              <p>
                Podés versionar esa carpeta con Git, respaldarla en Dropbox o compartirla por red
                local — es texto plano, no un formato propietario.
              </p>
            </>
          ),
        },
        {
          heading: "2. Instala la PWA (opcional pero recomendado)",
          body: (
            <p>
              Desde el ícono de instalación en la barra de direcciones (o el menú del navegador)
              podés instalar Hito como aplicación. Así abre en su propia ventana, sin barra de
              navegación, y sigue funcionando offline una vez cargada.
            </p>
          ),
        },
        {
          heading: "3. Crea tu primer producto y proyecto",
          body: (
            <p>
              Un <strong>Producto</strong> agrupa proyectos relacionados (por ejemplo, una línea de
              negocio o una app). Dentro de un producto creás <strong>Proyectos</strong>, y dentro de
              cada proyecto, <strong>Áreas</strong> con sus procesos, checklists y tareas. Si elegís un
              <strong> Tipo de Proyecto</strong> al crearlo, Hito genera automáticamente sus áreas,
              procesos y checklists a partir de la plantilla asociada.
            </p>
          ),
        },
        {
          heading: "Si tu navegador no soporta el modo carpeta",
          body: (
            <p>
              Firefox y Safari no implementan la File System Access API todavía. Hito cae
              automáticamente a un modo de <strong>descarga/carga manual</strong>: tus datos se
              guardan en IndexedDB del navegador y podés exportar/importar el archivo `.json` a mano
              cuando quieras respaldarlo o moverlo a otro equipo.
            </p>
          ),
        },
      ],
    },
  },
  {
    slug: "productos-y-proyectos",
    title: "Productos y proyectos",
    excerpt:
      "La jerarquía Producto → Proyecto → Área, estado, prioridad y cómo asignar responsables (RACI).",
    group: "organizar",
    seo: {
      title: "Productos y proyectos en Hito — Documentación",
      description:
        "Cómo organizar Productos, Proyectos y Áreas en Hito, y cómo asignar responsables con RACI.",
    },
    content: {
      eyebrow: "Organizar tu trabajo",
      intro: (
        <>
          Toda la información en Hito cuelga de una jerarquía simple:{" "}
          <strong>Producto → Proyecto → Área → (Proceso, Checklist) → Tarea</strong>. Esta guía cubre
          los dos primeros niveles.
        </>
      ),
      sections: [
        {
          heading: "Productos",
          body: (
            <p>
              Un producto es el contenedor más alto: una línea de negocio, una app o una iniciativa
              con varios proyectos adentro. Desde la página de Productos ves cuántos proyectos tiene
              cada uno, con un link directo a la lista filtrada.
            </p>
          ),
        },
        {
          heading: "Proyectos: estado, prioridad y tipo",
          body: (
            <>
              <p>
                Cada proyecto tiene un estado (activo, pausado, completado, etc.) y una prioridad.
                Si lo creás a partir de un <strong>Tipo de Proyecto</strong> de la Biblioteca, Hito
                instancia automáticamente sus áreas, procesos y checklists asociados — no partís de
                cero.
              </p>
              <p>
                El formulario de creación tiene un modo simple por defecto; el toggle "Más opciones"
                muestra los campos avanzados (tipo, prioridad, responsables) cuando los necesitás.
              </p>
            </>
          ),
        },
        {
          heading: "Áreas",
          body: (
            <p>
              Dentro de un proyecto, las áreas dividen el trabajo por frente (por ejemplo, Diseño,
              Desarrollo, Marketing). Cada área agrupa sus propios procesos (SOPs) y checklists — ver
              la guía de <Link to="/docs/procesos-y-checklists">Procesos y checklists</Link>.
            </p>
          ),
        },
        {
          heading: "RACI: quién es responsable de qué",
          body: (
            <p>
              Proyectos y áreas admiten asignar personas con roles RACI (Responsable, Aprobador,
              Consultado, Informado) mediante el selector de personas múltiple. Antes tenés que dar de
              alta a las personas en <Link to="/docs/ajustes-y-datos">Ajustes</Link>.
            </p>
          ),
        },
      ],
    },
  },
  {
    slug: "procesos-y-checklists",
    title: "Procesos y checklists",
    excerpt:
      "Documenta procedimientos (SOPs) por área y convierte cualquier ítem de checklist en una tarea con un clic.",
    group: "organizar",
    seo: {
      title: "Procesos y checklists (SOPs) en Hito — Documentación",
      description:
        "Cómo documentar procesos y checklists por área en Hito, y cómo convertir un ítem en tarea.",
    },
    content: {
      eyebrow: "Organizar tu trabajo",
      intro: (
        <>
          Documentar procesos no es una función secundaria en Hito: es el corazón del producto. Cada{" "}
          <strong>Área</strong> puede tener sus propios <strong>Procesos</strong> (procedimientos
          escritos, tipo SOP) y <strong>Checklists</strong> (listas accionables de ítems).
        </>
      ),
      sections: [
        {
          heading: "Procesos: el “cómo se hace” de tu equipo",
          body: (
            <p>
              Un proceso documenta un procedimiento paso a paso — por ejemplo, "Cómo publicar una
              release" o "Onboarding de un cliente nuevo". Vive dentro de un área y queda visible para
              cualquiera que abra ese proyecto.
            </p>
          ),
        },
        {
          heading: "Checklists e ítems",
          body: (
            <p>
              Un checklist es una lista de ítems que se marcan como hechos. Cada área muestra un
              contador de ítems completados/totales sin necesidad de expandir nada.
            </p>
          ),
        },
        {
          heading: "De plantilla a instancia",
          body: (
            <p>
              En vez de escribir cada proceso o checklist desde cero, podés aplicar una plantilla ya
              creada en la Biblioteca (ver <Link to="/docs/tipos-y-plantillas">Tipos y plantillas</Link>)
              directamente a un área existente con el botón "Plantilla" en la tarjeta del área.
            </p>
          ),
        },
        {
          heading: "Convertir un ítem en tarea",
          body: (
            <p>
              Cualquier ítem de un checklist puede convertirse en una tarea real del Kanban con un
              clic ("Convertir en tarea"), quedando vinculado de vuelta al ítem de origen. Útil cuando
              un paso del checklist necesita seguimiento propio (fecha, responsable, comentarios).
            </p>
          ),
        },
      ],
    },
  },
  {
    slug: "tareas-y-kanban",
    title: "Tareas y Kanban",
    excerpt:
      "Arrastra tarjetas entre columnas, comenta, archiva y abre el detalle completo de cualquier tarea.",
    group: "organizar",
    seo: {
      title: "Tareas y Kanban en Hito — Documentación",
      description:
        "Cómo usar el tablero Kanban de Hito: arrastrar y soltar, comentarios, archivado y el drawer de detalle.",
    },
    content: {
      eyebrow: "Organizar tu trabajo",
      intro: (
        <>
          Cada proyecto tiene su propio tablero <strong>Kanban</strong>. Las tareas se organizan por
          estado en columnas y podés reordenarlas o moverlas de columna arrastrándolas.
        </>
      ),
      sections: [
        {
          heading: "Arrastrar y soltar",
          body: (
            <>
              <p>
                En escritorio, arrastrar una tarjeta reordena dentro de la columna o la mueve a otra
                columna con vista previa en vivo mientras arrastrás.
              </p>
              <p>
                En pantallas táctiles, arrastrar solo reordena dentro de la misma columna — para
                cambiar de estado usá los botones de flecha de la tarjeta, así no compite con el
                scroll horizontal del tablero en mobile.
              </p>
            </>
          ),
        },
        {
          heading: "Detalle de la tarea",
          body: (
            <p>
              Al abrir una tarjeta se despliega un panel de detalle con descripción, fecha, prioridad,
              responsable, <strong>comentarios</strong>, <strong>subtareas</strong> y la opción de{" "}
              <strong>archivar</strong> la tarea sin borrarla (las tareas archivadas dejan de contarse
              en el tablero pero quedan en el historial).
            </p>
          ),
        },
        {
          heading: "Filtrar por área",
          body: (
            <p>
              El contador de tareas de cada área en la pestaña de Áreas es un link directo al Kanban
              filtrado por esa área (<code>{"?tab=tasks&area=<id>"}</code>), con un chip para quitar
              el filtro.
            </p>
          ),
        },
      ],
    },
  },
  {
    slug: "sprints-y-trimestres",
    title: "Trimestres",
    excerpt:
      "Agrupa proyectos por trimestre y sigue el progreso agregado de cada período.",
    group: "organizar",
    seo: {
      title: "Trimestres en Hito — Documentación",
      description: "Cómo agrupar proyectos por trimestre en Hito y ver el progreso agregado por período.",
    },
    content: {
      eyebrow: "Organizar tu trabajo",
      intro: (
        <>
          La sección <strong>Trimestres</strong> agrupa proyectos por período (por ejemplo, Q3 2026)
          para seguir el avance del conjunto, no solo de un proyecto individual.
        </>
      ),
      sections: [
        {
          heading: "Crear un trimestre",
          body: (
            <p>
              Definí un rango de fechas y asociá los proyectos que corresponden a ese período. Cada
              trimestre muestra su estado (planificado, en curso, cerrado) y un rollup del progreso de
              los proyectos que contiene.
            </p>
          ),
        },
        {
          heading: "Progreso agregado",
          body: (
            <p>
              El rollup combina la salud (rojo/ámbar/verde) de cada proyecto del trimestre en una
              sola vista, útil para reportar avance sin entrar proyecto por proyecto.
            </p>
          ),
        },
      ],
    },
  },
  {
    slug: "mis-tareas-y-daily",
    title: "Mis tareas y Daily Standup",
    excerpt:
      "Tu vista personal de tareas cruzando todos los proyectos, y un resumen diario de vencimientos.",
    group: "organizar",
    seo: {
      title: "Mis tareas y Daily Standup en Hito — Documentación",
      description:
        "Cómo usar la vista personal de tareas y el resumen diario (Daily Standup) en Hito.",
    },
    content: {
      eyebrow: "Organizar tu trabajo",
      intro: (
        <>
          Dos vistas que cruzan información de <strong>todos</strong> tus proyectos a la vez, en vez
          de mostrar un proyecto a la vez como el Kanban.
        </>
      ),
      sections: [
        {
          heading: "Mis tareas",
          body: (
            <p>
              Lista todas las tareas de todos los proyectos, filtrable por persona y por estado. Útil
              para que cada integrante del equipo vea su propia carga de trabajo sin tener que abrir
              proyecto por proyecto. Cada tarea abre el mismo panel de detalle que en el Kanban.
            </p>
          ),
        },
        {
          heading: "Daily Standup",
          body: (
            <p>
              Resumen pensado para el ritual diario: tareas vencidas y próximas a vencer, agrupadas
              por prioridad, de todos los proyectos activos (las tareas archivadas no aparecen). Pensado
              para revisar en un minuto qué necesita atención hoy.
            </p>
          ),
        },
      ],
    },
  },
  {
    slug: "tipos-y-plantillas",
    title: "Tipos y plantillas",
    excerpt:
      "La Biblioteca: Tipos de Proyecto y Plantillas de checklist/proceso reutilizables, listas para instanciar.",
    group: "plantillas-ia",
    seo: {
      title: "Tipos y plantillas (Biblioteca) en Hito — Documentación",
      description:
        "Cómo crear y reutilizar Tipos de Proyecto y Plantillas de checklist/proceso en la Biblioteca de Hito.",
    },
    content: {
      eyebrow: "Plantillas, automatización e IA",
      intro: (
        <>
          La <strong>Biblioteca</strong> es donde vive todo lo reutilizable: Plantillas de checklist,
          Plantillas de proceso y Tipos de Proyecto. Definirlas una vez y reutilizarlas es el corazón
          del producto, no una función secundaria.
        </>
      ),
      sections: [
        {
          heading: "Plantillas de checklist y de proceso",
          body: (
            <p>
              Una plantilla define la estructura (ítems de un checklist, o los pasos de un proceso)
              de forma independiente de cualquier proyecto concreto. Se edita una sola vez en la
              Biblioteca.
            </p>
          ),
        },
        {
          heading: "Tipos de Proyecto",
          body: (
            <p>
              Un Tipo de Proyecto asocia un conjunto de áreas con sus plantillas de proceso y
              checklist. Al crear un proyecto y elegir ese tipo, Hito instancia automáticamente todas
              esas áreas, procesos y checklists — el proyecto arranca con su estructura lista en vez
              de una página en blanco.
            </p>
          ),
        },
        {
          heading: "Aplicar una plantilla a un área ya existente",
          body: (
            <p>
              Si el proyecto ya existe y querés sumarle un proceso o checklist de la Biblioteca sin
              recrear el proyecto entero, usá el botón "Plantilla" en la tarjeta del área — completa
              solo las áreas a las que les falta ese contenido, sin duplicar lo que ya tienen.
            </p>
          ),
        },
      ],
    },
  },
  {
    slug: "automatizaciones-y-flujos",
    title: "Automatizaciones y Flujos",
    excerpt:
      "Builder visual para conectar HubSpot, Google Sheets, Email y webhooks con triggers, plantillas y reintentos automáticos.",
    group: "plantillas-ia",
    seo: {
      title: "Automatizaciones y Flujos en Hito — Documentación",
      description:
        "Cómo crear Flujos en Hito: triggers por webhook/sondeo/evento, integraciones con HubSpot, Sheets y Email, y reintentos automáticos.",
    },
    content: {
      eyebrow: "Plantillas, automatización e IA",
      intro: (
        <>
          <strong>Flujos</strong> es el módulo de automatización de Hito: un builder visual tipo
          Zapier/Make, pero corriendo enteramente en tu navegador. Conecta un disparador con una o
          varias acciones, sin escribir código.
        </>
      ),
      sections: [
        {
          heading: "Disparadores (triggers)",
          body: (
            <p>
              Un flujo arranca por un <strong>webhook entrante</strong> (una URL que recibe datos de
              otro sistema), un <strong>sondeo periódico</strong> (poll — por ejemplo, revisar
              contactos nuevos en HubSpot cada cierto tiempo) o un <strong>evento interno</strong> de
              Hito (por ejemplo, cuando una tarea cambia de estado).
            </p>
          ),
        },
        {
          heading: "Integraciones soportadas",
          body: (
            <p>
              HubSpot y Google Sheets (lectura/escritura de datos), Email (envío) y{" "}
              <strong>webhooks salientes</strong> — estos últimos firman el payload con HMAC para que
              el sistema receptor pueda verificar que el webhook realmente viene de tu flujo. Cada
              conexión guarda sus credenciales cifradas (ver{" "}
              <Link to="/docs/ajustes-y-datos">Ajustes y datos</Link>).
            </p>
          ),
        },
        {
          heading: "Plantillas y validación antes de activar",
          body: (
            <p>
              Hay plantillas de flujo listas para usar como punto de partida (siempre se crean
              inactivas). Antes de activar un flujo, Hito valida que tenga todo lo necesario
              (conexión elegida, campos completos) — un flujo con problemas se guarda inactivo por
              defecto en vez de arrancar a fallar en silencio.
            </p>
          ),
        },
        {
          heading: "Reintentos y manejo de errores",
          body: (
            <p>
              Las acciones de webhook/email reintentan automáticamente ante fallas transitorias (de
              red o errores de servidor 5xx), con backoff. Cada ejecución queda registrada en el
              historial de corridas, con el detalle de qué pasó paso a paso.
            </p>
          ),
        },
      ],
    },
  },
  {
    slug: "asistente-ia",
    title: "Asistente IA",
    excerpt:
      "Chat con Gemini que puede leer y escribir datos de tu workspace, con búsqueda semántica y fallback automático de modelos.",
    group: "plantillas-ia",
    seo: {
      title: "Asistente IA en Hito — Documentación",
      description:
        "Cómo conectar y usar el asistente IA de Hito (Gemini): tools de lectura/escritura, búsqueda semántica (RAG) y fallback de modelos.",
    },
    content: {
      eyebrow: "Plantillas, automatización e IA",
      intro: (
        <>
          Hito incluye un asistente conversacional que puede consultar y modificar tus datos —
          productos, proyectos, tareas, plantillas — usando tu propia API key de Gemini. La clave se
          guarda solo en tu navegador, nunca en tu carpeta de datos exportable.
        </>
      ),
      sections: [
        {
          heading: "Conectar tu API key",
          body: (
            <p>
              En <strong>Ajustes → Asistente IA</strong>, pegá tu API key de Google AI Studio y
              elegí un modelo. El panel de chat se abre desde cualquier pantalla con{" "}
              <kbd>Ctrl/Cmd+J</kbd>.
            </p>
          ),
        },
        {
          heading: "Qué puede hacer el asistente",
          body: (
            <p>
              Tiene un set de herramientas de lectura (consultar productos, proyectos, tareas,
              personas, plantillas, automatizaciones) y de escritura (crear/editar tareas, checklists,
              áreas, personas, y más). Las escrituras pueden pedir tu confirmación antes de aplicarse,
              según cómo lo configures.
            </p>
          ),
        },
        {
          heading: "Búsqueda semántica (RAG)",
          body: (
            <p>
              Activando la búsqueda semántica en Ajustes, Hito indexa tu contenido localmente para que
              el asistente encuentre información relevante por significado (no solo por coincidencia
              exacta de texto) antes de responder. El estado del índice (actualizado, parcial,
              indexando) se ve en la misma tarjeta de Ajustes.
            </p>
          ),
        },
        {
          heading: "Fallback automático de modelos",
          body: (
            <p>
              Si el modelo elegido falla o alcanza un límite de uso, el asistente reintenta
              automáticamente con un modelo alternativo en vez de cortar la conversación.
            </p>
          ),
        },
      ],
    },
  },
  {
    slug: "dashboard-y-portafolio",
    title: "Dashboard y portafolio",
    excerpt:
      "La vista general: salud de cada proyecto (semáforo), proyectos estancados y vencidos de un vistazo.",
    group: "seguimiento",
    seo: {
      title: "Dashboard de portafolio en Hito — Documentación",
      description:
        "Cómo leer el dashboard de portafolio de Hito: salud de proyectos, estancados y vencidos.",
    },
    content: {
      eyebrow: "Seguimiento y configuración",
      intro: (
        <>
          El Dashboard es la vista de nivel portafolio: en vez de entrar proyecto por proyecto, ves de
          un vistazo el estado general de todo lo que tenés en marcha.
        </>
      ),
      sections: [
        {
          heading: "Salud del proyecto (semáforo)",
          body: (
            <p>
              Cada proyecto tiene una salud calculada — <strong>rojo</strong>,{" "}
              <strong>ámbar</strong> o <strong>verde</strong> — según sus tareas vencidas, próximas a
              vencer y su progreso. El dashboard agrupa el conteo por color y por proyecto individual.
            </p>
          ),
        },
        {
          heading: "Proyectos estancados",
          body: (
            <p>
              Un contador aparte identifica proyectos sin actividad reciente, para detectar qué se
              quedó sin avanzar antes de que se vuelva un problema.
            </p>
          ),
        },
      ],
    },
  },
  {
    slug: "notificaciones",
    title: "Notificaciones",
    excerpt:
      "Recordatorios automáticos por fecha, con acceso directo a la tarea o al ítem que los generó.",
    group: "seguimiento",
    seo: {
      title: "Notificaciones en Hito — Documentación",
      description: "Cómo funcionan los recordatorios y notificaciones por fecha en Hito.",
    },
    content: {
      eyebrow: "Seguimiento y configuración",
      intro: (
        <>
          Hito revisa fechas de tareas y checklists cada vez que abrís la app (o cuando la ventana
          recupera el foco) y genera notificaciones cuando algo vence o está por vencer.
        </>
      ),
      sections: [
        {
          heading: "Cuándo se generan",
          body: (
            <p>
              La evaluación corre al abrir la app y al volver a la pestaña — no hace falta un
              servidor corriendo en segundo plano, porque todo pasa en tu navegador mientras la app
              está abierta.
            </p>
          ),
        },
        {
          heading: "Deep-links",
          body: (
            <p>
              Cada notificación te lleva directo a la tarea, checklist o área correspondiente
              (con el tab y el foco correctos), en vez de dejarte que la busques manualmente.
            </p>
          ),
        },
      ],
    },
  },
  {
    slug: "ajustes-y-datos",
    title: "Ajustes y datos",
    excerpt:
      "Personas, exportar/importar tus datos por colección, seguridad de las conexiones y privacidad.",
    group: "seguimiento",
    seo: {
      title: "Ajustes y datos en Hito — Documentación",
      description:
        "Cómo gestionar personas, exportar/importar datos y proteger las conexiones de integraciones en Hito.",
    },
    content: {
      eyebrow: "Seguimiento y configuración",
      intro: (
        <>
          Todo lo que no es "trabajo en curso" vive en Ajustes: quién forma parte del equipo, cómo
          entran y salen tus datos, y cómo se protegen las credenciales de tus integraciones.
        </>
      ),
      sections: [
        {
          heading: "Personas",
          body: (
            <p>
              Das de alta a las personas de tu equipo una sola vez; después las asignás como
              responsables (RACI) en proyectos, áreas y tareas desde cualquier selector de persona de
              la app.
            </p>
          ),
        },
        {
          heading: "Exportar e importar por colección",
          body: (
            <p>
              Además del respaldo completo de tu carpeta, podés exportar o importar una colección
              puntual (productos, proyectos, plantillas, flujos, personas, etc.) como un archivo{" "}
              <code>.json</code> independiente — útil para mover solo una parte de tus datos o hacer
              un respaldo puntual antes de un cambio grande.
            </p>
          ),
        },
        {
          heading: "Seguridad de las conexiones (vault)",
          body: (
            <p>
              Las credenciales de integraciones (HubSpot, Sheets, Email) se cifran con una passphrase
              que elegís vos. Podés elegir si esa clave se recuerda solo en la sesión actual, entre
              sesiones, o si preferís volver a escribirla cada vez (el modo más seguro). Un bloqueo
              automático protege el vault si dejás la app abierta e inactiva.
            </p>
          ),
        },
        {
          heading: "Privacidad",
          body: (
            <p>
              Hito no envía tus datos a ningún servidor propio. La única comunicación externa
              opcional es hacia Gemini, y solo cuando usás el asistente IA con tu propia API key. No
              hay analytics de terceros.
            </p>
          ),
        },
      ],
    },
  },
];

export function getModuleBySlug(slug: string): DocModule | undefined {
  return DOC_MODULES.find((m) => m.slug === slug);
}
