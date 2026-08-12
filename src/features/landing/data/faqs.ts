/**
 * Single source of truth for the FAQ content — consumed by the visible
 * accordion (Faq.tsx) and the FAQPage JSON-LD (LandingPage.tsx). Keeping
 * these in one place avoids the schema drifting from what's actually
 * rendered on the page, which is a Google structured-data requirement.
 */
export const FAQS = [
  {
    q: "¿Mis datos están seguros en Hito?",
    a: "Sí. Hito es local-first: tus datos nunca se envían a ningún servidor. Viven en archivos .json dentro de una carpeta que tú eliges en tu equipo. No hay backend, no hay nube, no hay terceros con acceso. Incluso si usas la PWA offline, los datos se guardan localmente.",
  },
  {
    q: "¿Puedo compartir la carpeta con mi equipo?",
    a: "Sí. Como los datos son archivos .json en una carpeta local, puedes compartirla por red, Dropbox, Google Drive, Git o cualquier medio que ya uses. Cada persona abre la misma carpeta desde su Hito. No hay límite de usuarios simultáneos.",
  },
  {
    q: "¿Hito funciona sin internet?",
    a: "Sí. Hito es una PWA (Progressive Web App) que funciona completamente offline. Una vez instalada, puedes gestionar proyectos, procesos y tareas sin conexión. Los datos se sincronizan cuando vuelves a estar online si compartes la carpeta por un servicio en la nube.",
  },
  {
    q: "¿Hito es realmente gratis?",
    a: "Sí, 100% gratuito y open source bajo licencia MIT. No hay planes pagos, ni suscripciones, ni límites ocultos. Puedes usarlo para proyectos personales, profesionales o comerciales sin restricciones. El código es público y puedes auditarlo, modificarlo o redistribuirlo.",
  },
  {
    q: "¿Qué diferencia a Hito de Trello, Notion o ClickUp?",
    a: "La diferencia fundamental es la privacidad y el control de datos. Trello, Notion y ClickUp guardan tus datos en sus servidores. Hito es local-first: tus datos viven en tu equipo, son archivos .json legibles y versionables con Git. No necesitas cuenta, no hay límite de usuarios, funcionas offline, y si mañana quieres migrar, tus datos ya están en un formato estándar.",
  },
  {
    q: "¿Cómo funciona el asistente de IA sin comprometer mi privacidad?",
    a: "El asistente usa Gemini (de Google) para entender tus preguntas y gestionar proyectos, pero con arquitectura MCP + RAG local. Tu API key se guarda en IndexedDB de tu navegador, nunca en el workspace exportable. Los embeddings se generan y almacenan localmente. El modelo solo recibe el contexto semántico de tu consulta específica, no todo tu workspace. Puedes desactivar el asistente o el RAG en cualquier momento desde la configuración.",
  },
  {
    q: "¿Qué es MCP y cómo lo usa el asistente?",
    a: "MCP (Model Context Protocol) es un estándar para que modelos de IA interactúen con herramientas externas. En Hito, el asistente expone +20 herramientas MCP (get_project, create_task, mutate_project, etc.) con esquemas Zod validados. Esto permite al modelo leer y escribir datos reales de tu workspace de forma controlada. Las escrituras siempre requieren tu confirmación explícita.",
  },
  {
    q: "¿Qué pasa si pierdo la carpeta donde tengo los datos?",
    a: "Como los datos son archivos .json comunes, deberías incluir la carpeta en tu sistema de backups habitual. Puedes usar Git para versionarlos, Dropbox/Google Drive para tener copia en la nube, o simplemente copiar la carpeta a un disco externo. Hito también permite exportar toda la base de datos como un archivo .zip.",
  },
  {
    q: "¿Qué formato tienen los datos? ¿Puedo leerlos con otra herramienta?",
    a: "Cada proyecto y producto es un archivo .json con una estructura clara y validada con esquemas Zod. Puedes abrirlos con cualquier editor de texto, procesarlos con scripts, o versionarlos con Git. No hay bases de datos binarias ni formatos propietarios.",
  },
  {
    q: "¿Necesito crear una cuenta o registrarme?",
    a: "No. Hito no tiene sistema de cuentas. Abres la app, eliges una carpeta en tu equipo, y empiezas a trabajar. No pedimos email, nombre ni ningún dato personal. Tu identidad es la carpeta que eliges.",
  },
  {
    q: "¿Puedo sincronizar mis proyectos con GitHub?",
    a: "Sí. Desde Integraciones conectas la GitHub App, vinculas proyectos a un repositorio y eliges el nivel de sincronización: ligera, media o completa. En completa se suben también recursos (PDF, imágenes, documentos…), excepto videos y archivos muy grandes. Los datos van a .hito/ en tu repo; no se crean Issues. Puedes abrir el repositorio desde Hito con un botón.",
  },
];
