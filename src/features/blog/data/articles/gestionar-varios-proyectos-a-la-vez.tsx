import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "gestionar-varios-proyectos-a-la-vez",
  title: "Cómo gestionar varios proyectos a la vez",
  excerpt:
    "No es multitasking heroico: es un portafolio personal con capacidad compartida, WIP entre proyectos y un ritmo semanal que evita el caos.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-02-01",
  readingTime: "13 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  related: [
    "proyecto-atrasado-que-hacer",
    "como-priorizar-tareas",
    "organizar-proyectos-tareas-jerarquia",
    "kanban-limites-wip",
  ],
  seo: {
    title: "Cómo gestionar varios proyectos a la vez | Hito",
    description:
      "No es multitasking heroico: es un portafolio personal con capacidad compartida, WIP entre proyectos y un ritmo semanal que evita el caos.",
    ogImageAlt: "Gestionar varios proyectos a la vez: portafolio, WIP y ritmo semanal.",
  },
  content: {
    eyebrow: "Tips y problemas reales",
    intro: (
      <>
        <strong>En una línea:</strong> gestionar varios proyectos a la vez no es hacer todo al
        mismo tiempo — es tratar tu trabajo como un <strong>portafolio</strong>: una sola
        capacidad, pocos frentes abiertos, un ritmo semanal de decisión y un sistema donde
        siempre sabés qué es “lo de hoy” sin mentirte. El caos casi nunca es “falta de app”; es
        exceso de trabajo empezado y cero criterio de atención.
      </>
    ),
    sections: [
      {
        heading: "Por qué “varios proyectos” se siente como caos",
        body: (
          <>
            <p>Si sos freelancer, agencia chica o lead en un equipo de 1–15, el dolor se parece:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Cada cliente cree que es tu única prioridad.</li>
              <li>Empezás el día en un tablero y terminás apagando incendios en otro.</li>
              <li>Ningún proyecto está “rojo”, pero todos se mueven lento.</li>
              <li>Las reuniones de status multiplican el contexto switching.</li>
            </ul>
            <p>
              El problema de fondo es de <strong>sistemas de atención</strong>, no de motivación.
              Sin un mapa de portafolio y un límite de frentes abiertos, tu cerebro (y tu equipo)
              pagan el peaje de cambiar de contexto cada hora.
            </p>
          </>
        ),
      },
      {
        heading: "Mapa: un portafolio, no 12 tableros sueltos",
        body: (
          <>
            <p>
              Antes de optimizar cada proyecto, listá el portafolio en una sola vista:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Proyecto</th>
                  <th className="py-2 pr-4 font-semibold">Estado</th>
                  <th className="py-2 pr-4 font-semibold">Próximo hito</th>
                  <th className="py-2 font-semibold">Dueño</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Cliente A — sitio</td>
                  <td className="py-2 pr-4 text-muted-foreground">En curso</td>
                  <td className="py-2 pr-4 text-muted-foreground">Demo viernes</td>
                  <td className="py-2 text-muted-foreground">Vos</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Producto interno</td>
                  <td className="py-2 pr-4 text-muted-foreground">En curso</td>
                  <td className="py-2 pr-4 text-muted-foreground">Beta v0.3</td>
                  <td className="py-2 text-muted-foreground">Lead técnico</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Propuesta Cliente C</td>
                  <td className="py-2 pr-4 text-muted-foreground">En espera</td>
                  <td className="py-2 pr-4 text-muted-foreground">Respuesta lunes</td>
                  <td className="py-2 text-muted-foreground">Comercial</td>
                </tr>
              </tbody>
            </table>
            <p>
              La jerarquía importa: producto → proyecto → área/proceso → tarea. Si todo es “una
              tarjeta suelta”, el portafolio se vuelve un cajón. Ver{" "}
              <Link
                to="/blogs/organizar-proyectos-tareas-jerarquia"
                className="underline underline-offset-2"
              >
                cómo organizar proyectos y tareas
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Capacidad compartida: una sola cola de atención",
        body: (
          <>
            <p>
              Tenés una sola cantidad de horas-persona. Repartirlas “un poco a cada proyecto
              todos los días” suele ser lo peor: pagás el costo de cambio de contexto y no
              terminás nada.
            </p>
            <p>
              <strong>Reglas prácticas:</strong>
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Definí <strong>proyectos activos</strong> (reciben foco esta semana) vs{" "}
                <strong>en espera / mantenimiento</strong>.
              </li>
              <li>
                Para personas, preferí <strong>bloques de medio día o día</strong> por proyecto,
                no 12 saltos de 25 minutos.
              </li>
              <li>
                Priorizá con un criterio explícito (urgencia × impacto, o MoSCoW a nivel
                portafolio). Guía en{" "}
                <Link to="/blogs/como-priorizar-tareas" className="underline underline-offset-2">
                  cómo priorizar tareas
                </Link>
                .
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "WIP entre proyectos (no solo dentro de un tablero)",
        body: (
          <>
            <p>
              Los{" "}
              <Link to="/blogs/kanban-limites-wip" className="underline underline-offset-2">
                límites WIP
              </Link>{" "}
              no son solo para columnas “En curso” de un kanban. A nivel portafolio:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Límite de proyectos activos por persona:</strong> 1–2 en foco profundo; 3
                como máximo en la mayoría de roles de ejecución.
              </li>
              <li>
                <strong>Límite de proyectos “rojos” en el equipo:</strong> si todo es urgente,
                nada lo es — hay que bajar el semáforo de alguno.
              </li>
              <li>
                <strong>Regla de entrada:</strong> no se abre un proyecto nuevo sin cerrar,
                pausar o reasignar otro.
              </li>
            </ul>
            <p>
              Cuando un proyecto se atrasa, no “sumes horas mágicas”: usá un playbook de crisis
              (ver{" "}
              <Link
                to="/blogs/proyecto-atrasado-que-hacer"
                className="underline underline-offset-2"
              >
                tu proyecto va atrasado: 6 movimientos
              </Link>
              ) antes de contagiar el resto del portafolio.
            </p>
          </>
        ),
      },
      {
        heading: "Ritmos: semanal de portafolio + daily (o asíncrono) por frente",
        body: (
          <>
            <p>
              <strong>Ritual semanal de portafolio (30–45 min):</strong>
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Actualizar estado y próximo hito de cada proyecto activo.</li>
              <li>Elegir los 1–3 frentes de la semana (el resto queda en mantenimiento).</li>
              <li>Asignar capacidad gruesa (quién / cuánto).</li>
              <li>Listar riesgos que pueden tumbar un hito.</li>
            </ol>
            <p>
              <strong>Ritmo diario:</strong> un daily corto por equipo o asíncrono por tablero —
              no un daily por cada cliente. El daily de portafolio (si existe) es de 10 minutos:
              solo bloqueos entre proyectos. Detalle en{" "}
              <Link to="/blogs/daily-standup-util" className="underline underline-offset-2">
                daily standup útil
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Señales de sobrecarga (y qué cortar primero)",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Señal</th>
                  <th className="py-2 font-semibold">Primer corte</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Todo está “en curso”, nada se entrega</td>
                  <td className="py-2 text-muted-foreground">
                    Congelar proyectos en espera; terminar 1 antes de tocar 3
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Reuniones de status &gt; trabajo</td>
                  <td className="py-2 text-muted-foreground">
                    <Link
                      to="/blogs/reuniones-de-status-eliminar"
                      className="underline underline-offset-2"
                    >
                      Un tablero compartido + update escrito semanal
                    </Link>
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Vos sos el cuello de botella de todos</td>
                  <td className="py-2 text-muted-foreground">
                    <Link
                      to="/blogs/como-delegar-tareas"
                      className="underline underline-offset-2"
                    >
                      Delegar decisiones RACI
                    </Link>
                    ; sacar tu nombre de Aprobador eterno
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Los hitos se mueven en silencio</td>
                  <td className="py-2 text-muted-foreground">
                    Ritual semanal + comunicación de atraso con plan
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Para riesgos que cruzan proyectos, un checklist simple semanal alcanza — ver{" "}
              <Link
                to="/blogs/gestion-de-riesgos-simple"
                className="underline underline-offset-2"
              >
                gestión de riesgos para equipos pequeños
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Sistema mínimo en 1 hora",
        body: (
          <>
            <p>Si hoy estás en caos, no diseñes el PMBOK. Hacé esto en una sesión:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Listá todos los proyectos (activos, en espera, ideas).</li>
              <li>Elegí máximo 3 activos para los próximos 7 días.</li>
              <li>Para cada activo: próximo hito + dueño + “qué es hecho”.</li>
              <li>Definí tu WIP personal (ej. 2 proyectos en foco profundo).</li>
              <li>Agendá el ritual semanal de 30 minutos en el calendario.</li>
            </ol>
          </>
        ),
      },
      {
        heading: "Errores que multiplican el caos",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Una herramienta distinta por cliente</strong> sin una vista de
                portafolio — el contexto se fragmenta.
              </li>
              <li>
                <strong>“Todo es urgente”</strong> — sin priorización de portafolio, el día lo
                decide el último mensaje de WhatsApp.
              </li>
              <li>
                <strong>Nunca cerrar proyectos</strong> — el zombie project come atención
                administrativa.
              </li>
              <li>
                <strong>Planificar al 100% de la agenda</strong> — no hay colchón para el
                incendio que sí va a llegar.
              </li>
            </ul>
            <p>
              Si necesitás el mapa completo de fases, roles y métodos, el hub de fundamentos
              está en{" "}
              <Link
                to="/blogs/gestion-de-proyectos-guia-completa"
                className="underline underline-offset-2"
              >
                la guía completa de gestión de proyectos
              </Link>
              .
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo armar un sistema multi-proyecto en 1 hora",
      steps: [
        {
          name: "Inventariar el portafolio",
          text: "Listá proyectos activos, en espera e ideas. Si no cabe en una página, está demasiado difuso.",
        },
        {
          name: "Elegir como máximo 3 frentes activos",
          text: "El resto queda en mantenimiento o pausa explícita. Sin esta decisión, no hay sistema.",
        },
        {
          name: "Definir hito y dueño por proyecto activo",
          text: "Próximo resultado visible, fecha tentativa y una persona responsable del avance.",
        },
        {
          name: "Fijar un límite WIP entre proyectos",
          text: "Por persona: 1–2 en foco profundo. No se abre un proyecto nuevo sin cerrar o pausar otro.",
        },
        {
          name: "Agendar el ritual semanal de portafolio",
          text: "30–45 minutos para actualizar estados, reasignar capacidad y bajar riesgos antes de que exploten.",
        },
      ],
    },
    faq: [
      {
        question: "¿Cuántos proyectos puede manejar una persona a la vez?",
        answer:
          "En roles de ejecución profunda, 1–2 en foco y como mucho 3 con uno en mantenimiento. Más de eso suele ser ilusión de progreso: hay movimiento, no entrega.",
      },
      {
        question: "¿Un tablero por proyecto o uno solo?",
        answer:
          "Ambos niveles: tableros (o listas) por proyecto para el detalle, y una vista de portafolio para decidir atención. Sin la vista superior, cada tablero te grita con la misma urgencia.",
      },
      {
        question: "¿Cómo digo que no a un proyecto nuevo?",
        answer:
          "Con el portafolio a la vista: “Para entrar X, hay que pausar o retrasar Y”. Sin trade-off explícito, el “sí” es un no disfrazado a todo lo demás.",
      },
      {
        question: "¿Sirve el mismo sistema para freelancers y equipos de 10?",
        answer:
          "Sí en la lógica (portafolio, WIP, ritual semanal). Cambia la ceremonia: solo, es una lista personal; en equipo, hay dueños y un check semanal compartido.",
      },
    ],
  },
};
