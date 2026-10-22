import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "alternativa-a-todoist",
  title: "Alternativas a Todoist para cuando el equipo ya no es una sola persona",
  excerpt:
    "Todoist gana en productividad personal. Alternativas reales cuando el motivo de salida es que necesitas kanban de equipo, dependencias entre tareas, o colaborar con clientes.",
  category: "comparativas",
  categoryLabel: "Comparativas",
  publishedAt: "2026-10-22",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "software-gestion-proyectos",
  related: [
    "gestion-proyectos-freelancers",
    "lista-tareas-vs-gestion-proyectos",
    "app-gestion-tareas",
  ],
  seo: {
    title: "Alternativas a Todoist (2026) | Hito",
    description:
      "Alternativas a Todoist cuando el equipo creció: kanban de equipo, dependencias entre tareas, colaboración con clientes externos. Sin perder la simplicidad que hizo bueno a Todoist.",
    ogImageAlt: "Alternativas a Todoist por colaboración de equipo y estructura de proyecto.",
  },
  content: {
    eyebrow: "Comparativas",
    intro: (
      <>
        <strong>En una línea:</strong> si buscas una <strong>alternativa a Todoist</strong>, casi
        nunca es porque la app personal esté mal: es porque dejaste de ser una sola persona
        organizando su día y pasaste a coordinar un equipo o clientes, algo para lo que Todoist
        nunca se diseñó. Las <strong>alternativas a Todoist</strong> —Trello, Asana, Hito—
        resuelven ese salto.
      </>
    ),
    sections: [
      {
        heading: "Todoist no se abandona por malo: se abandona por crecer",
        body: (
          <>
            <p>
              Todoist es, probablemente, la mejor app de productividad personal del mercado:
              lenguaje natural para fechas, karma como gamificación suave, filtros potentes,
              rápida en cualquier plataforma. El problema no es Todoist — es que un freelancer
              que crece a un equipo de tres necesita algo que Todoist no intentó ser nunca.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>No hay kanban de equipo real.</strong> Todoist organiza por proyectos y
                secciones, no por un tablero visual donde varias personas mueven tarjetas entre
                estados compartidos.
              </li>
              <li>
                <strong>No modela dependencias entre tareas.</strong> Si una tarea de otra
                persona bloquea la tuya, Todoist no lo representa — lo llevas en la cabeza o en
                un comentario.
              </li>
              <li>
                <strong>La colaboración es básica a propósito.</strong> Compartir un proyecto y
                asignar tareas funciona para dos o tres personas coordinando lo simple; no está
                pensado para un cliente externo revisando avance o para permisos granulares.
              </li>
            </ul>
            <p>
              Una <strong>alternativa a Todoist</strong> para equipo tiene que agregar
              estructura sin matar la velocidad que hizo bueno a Todoist para uso individual. El
              mapa general de categorías está en{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos
              </Link>
              ; el contraste conceptual entre lista de tareas y gestión de proyectos está en{" "}
              <Link
                to="/blogs/lista-tareas-vs-gestion-proyectos"
                className="underline underline-offset-2"
              >
                lista de tareas vs gestión de proyectos
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Alternativas según el motivo de salida",
        body: (
          <>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Necesitas kanban de equipo
            </h3>
            <p>
              Trello es el salto natural: mantiene la velocidad de Todoist, agrega un tablero
              visual compartido. Onboarding de minutos, sin curva de aprendizaje empresarial.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Necesitas dependencias entre tareas
            </h3>
            <p>
              Asana modela dependencias con claridad y mantiene un free utilizable para equipos
              chicos — detalle en{" "}
              <Link to="/blogs/alternativa-a-asana" className="underline underline-offset-2">
                alternativas a Asana
              </Link>
              . Si además necesitas ruta crítica real, eso ya es terreno de Gantt — ver{" "}
              <Link to="/blogs/ruta-critica-proyecto" className="underline underline-offset-2">
                ruta crítica de proyecto
              </Link>
              .
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Necesitas colaborar con clientes externos
            </h3>
            <p>
              Basecamp o Trello con un tablero compartido cubren el caso de cliente viendo
              avance sin pagar un portal empresarial. Para freelancers que recién suman su
              primer cliente recurrente, el salto de solo-personal a colaborativo-simple es el
              que importa, no el salto a una suite completa.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              Datos locales: sales porque el proyecto no puede vivir en un SaaS ajeno
            </h3>
            <p>
              Hito: kanban, SOPs y automatizaciones en archivos locales, PWA, sync con GitHub,
              IA opcional con tu API key. No reemplaza la app móvil pulida de Todoist para
              listas puramente personales — para eso, Todoist sigue siendo mejor en lo suyo.
            </p>
          </>
        ),
      },
      {
        heading: "Tabla: alternativa a Todoist según el caso",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Si sales por…</th>
                  <th className="py-2 pr-4 font-semibold">Mira primero</th>
                  <th className="py-2 font-semibold">Cuidado con…</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Necesitas kanban de equipo</td>
                  <td className="py-2 pr-4 text-muted-foreground">Trello</td>
                  <td className="py-2 text-muted-foreground">
                    Cobra por colaborador pasado cierto techo
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Dependencias entre tareas</td>
                  <td className="py-2 pr-4 text-muted-foreground">Asana</td>
                  <td className="py-2 text-muted-foreground">
                    Free limitado a 2 asientos en planes serios
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Colaborar con clientes</td>
                  <td className="py-2 pr-4 text-muted-foreground">Basecamp o Trello</td>
                  <td className="py-2 text-muted-foreground">
                    Ninguno reemplaza la velocidad de captura móvil de Todoist
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Datos que no pueden ir a la nube</td>
                  <td className="py-2 pr-4 text-muted-foreground">Hito</td>
                  <td className="py-2 text-muted-foreground">
                    Más estructura que una lista de tareas pura
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Todoist te sirve y solo comparas</td>
                  <td className="py-2 pr-4 text-muted-foreground">Quédate en Todoist</td>
                  <td className="py-2 text-muted-foreground">
                    Si sigues siendo una sola persona, no necesitas más estructura
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Dónde Todoist sigue ganando",
        body: (
          <>
            <p>
              Hay que decirlo sin truco. Todoist gana para una persona que organiza su propio
              día: captura rápida, lenguaje natural para fechas, apps nativas rápidas en todas
              las plataformas, y un sistema de productividad personal que no te pide pensar en
              equipos ni clientes.
            </p>
            <p>
              Si sigues siendo una sola persona o dos coordinando lo simple, Todoist no es un
              error — es, probablemente, lo mejor que puedes usar para eso. Las{" "}
              <strong>alternativas a Todoist</strong> de esta página existen para el momento en
              que dejás de ser esa una persona.
            </p>
          </>
        ),
      },
      {
        heading: "Dónde encaja Hito (sin venderlo como clon de Todoist)",
        body: (
          <>
            <p>
              Hito no es la mejor alternativa a Todoist para productividad personal pura. No
              tiene lenguaje natural para fechas, no tiene karma ni la velocidad de captura
              móvil de una app nativa pulida durante años. Si eso es lo que usabas cada día,
              Hito te va a parecer más pesado para esa tarea puntual.
            </p>
            <p>
              Encaja cuando el motivo de salida es que ya no eres una persona sola: necesitas
              kanban compartido, SOPs de equipo, o que el cliente vea avance sin vivir en un
              SaaS ajeno. Local-first: carpeta + JSON, sin cuenta, sin cobro por asiento.
              Audiencia 1–15.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo salir sin perder la captura rápida",
        body: (
          <>
            <p>
              No migres tus listas personales de “algún día” a un sistema de equipo — eso sigue
              siendo tuyo, no del proyecto. Migra solo lo que de verdad involucra a otra persona
              o a un cliente: eso es lo que necesita estructura compartida.
            </p>
            <p>
              Si después de dos semanas extrañas anotar “comprar leche mañana” en el mismo lugar
              que el proyecto del cliente, probablemente no necesitabas migrar eso — y está bien
              seguir usando Todoist en paralelo para lo puramente personal.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Cuánto cuesta Todoist de verdad?",
        answer:
          "Tiene un free funcional para uso personal con límites de proyectos activos y colaboradores; el plan Pro sube esos techos y agrega recordatorios y filtros avanzados. Es barato comparado con cualquier suite de equipo — porque no compite en esa categoría. Verifica la página de precios el día que decidas.",
      },
      {
        question: "¿Cuál es la alternativa a Todoist para equipos chicos?",
        answer:
          "Trello, si lo que necesitas es kanban visual compartido sin perder velocidad de uso. Asana, si necesitas además dependencias entre tareas de distintas personas.",
      },
      {
        question: "¿Hay alternativa a Todoist sin cobrar por colaborador?",
        answer:
          "Sí: Hito (carpeta local, JSON, sin cuenta ni cobro por asiento) para proyectos de equipo chico. Trello y Asana tienen free utilizable pero empiezan a cobrar por asiento pasado cierto número de personas.",
      },
      {
        question: "¿Trello o Asana reemplazan la velocidad de Todoist?",
        answer:
          "No para uso puramente personal. Ambos están optimizados para colaboración, no para capturar una tarea en tres segundos con lenguaje natural. Si el uso es mixto, muchos siguen usando Todoist para lo personal y otra herramienta para lo de equipo.",
      },
      {
        question: "¿Hito reemplaza a Todoist?",
        answer:
          "No como clon de productividad personal. Reemplaza el caso “el proyecto ya involucra a otra persona o a un cliente, datos en tu disco, kanban y SOPs”. No reemplaza la captura rápida ni el lenguaje natural de fechas de Todoist para tu lista personal.",
      },
    ],
  },
};
