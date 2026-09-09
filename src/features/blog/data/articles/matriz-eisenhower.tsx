import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "matriz-eisenhower",
  title: "Matriz de Eisenhower: urgente vs importante, en la práctica",
  excerpt:
    "Matriz de Eisenhower: los 4 cuadrantes con ejemplos reales, cómo decidir qué eliminar o delegar y la trampa de vivir en lo urgente. Guía práctica para equipos.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-06",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "tablero-kanban",
  related: ["tablero-kanban", "como-priorizar-tareas", "priorizacion-moscow"],
  seo: {
    title: "Matriz de Eisenhower: urgente vs importante, en la práctica | Hito",
    description:
      "Matriz de Eisenhower: los 4 cuadrantes con ejemplos reales, cómo decidir qué eliminar o delegar y la trampa de vivir en lo urgente. Guía práctica.",
    ogImageAlt:
      "Matriz de Eisenhower con cuatro cuadrantes: hacer, planificar, delegar, eliminar.",
  },
  content: {
    eyebrow: "Prioridad y foco",
    intro: (
      <>
        <strong>En una línea:</strong> la matriz de Eisenhower cruza lo urgente con lo
        importante para decidir qué hacer, qué planificar, qué delegar y qué eliminar. Urgente
        es lo que apura el plazo de otro; importante es lo que acerca tu objetivo. El problema
        no es clasificar: es que lo urgente se coma lo importante.
      </>
    ),
    sections: [
      {
        heading: "Urgente e importante no son lo mismo (y la diferencia decide tu día)",
        body: (
          <>
            <p>
              La matriz de Eisenhower es una cuadrícula de 2×2 que cruza dos preguntas: ¿esto
              apura?, ¿esto importa? Lo <strong>urgente</strong> tiene un plazo ajeno —lo puso
              otro: un cliente, una fecha, un teléfono que suena— y castiga no hacerlo ahora.
              Lo <strong>importante</strong> sirve a un objetivo propio —lo elegiste tú— y
              castiga no hacerlo nunca. Los dos ejes producen cuatro cuadrantes y cada uno
              exige una acción distinta: hacer, planificar, delegar o eliminar.
            </p>
            <p>
              La matriz no ordena tareas: ordena decisiones. Su valor no está en el dibujo sino
              en la pregunta incómoda que introduce: ¿esto es urgente porque de verdad apura o
              porque alguien lo dejó madurar tarde? Gran parte de lo urgente de tu semana fue
              importante hace dos semanas, cuando todavía daba tiempo a hacerlo sin sobresalto.
            </p>
          </>
        ),
      },
      {
        heading: "Los 4 cuadrantes, con ejemplos de una semana real",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Cuadrante</th>
                  <th className="py-2 pr-4 font-semibold">Ejemplo típico</th>
                  <th className="py-2 font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Q1 · Urgente e importante
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El checkout está caído con ventas en juego; el cliente amenaza con
                    cancelar mañana.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Hacerlo ahora, tú: es tu crisis y tu prioridad.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Q2 · No urgente e importante
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Rediseñar el proceso de onboarding; escribir la propuesta del próximo
                    trimestre.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Planificarlo: bloque propio en el calendario, sin interrupciones.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Q3 · Urgente y no importante
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    La reunión a la que te invitan «por si acaso»; el mensaje que exige
                    respuesta ya.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Delegarlo, recortarlo o resolverlo por escrito en dos líneas.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Q4 · No urgente y no importante
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    La reunión de status que nadie lee; revisar las métricas por quinta vez en
                    el día.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Eliminarlo sin anuncio ni culpa.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Fíjate en los ejemplos del Q1: son crisis reales, no deberes apurados. La matriz
              pierde toda utilidad cuando el Q1 se convierte en el cajón de «todo lo que dejé
              para después»: eso no es urgencia, es procrastinación con fecha de vencimiento.
            </p>
            <p>
              El cuadrante donde se gana la semana es el Q2. Ninguna crisis nace en el Q1:
              todas maduran en el Q2 y caen al Q1 el día que dejan de poder esperar. El
              mantenimiento del servidor que se hace cada mes es Q2; el mismo mantenimiento el
              día que el servidor se cae, es Q1 con el doble de costo y la mitad de opciones.
            </p>
          </>
        ),
      },
      {
        heading: "La trampa de lo urgente: por qué el Q1 se come el Q2",
        body: (
          <>
            <p>
              Lo urgente tiene una ventaja injusta: grita. Trae fecha, remitente y
              consecuencias inmediatas, mientras lo importante susurra a largo plazo. El
              cerebro prefiere apagar incendios —cada urgencia resuelta da una descarga corta
              de logro— y por eso una semana entera puede pasar en el Q1 con la sensación de
              trabajo intenso y cero avance en lo que de verdad mueve el negocio.
            </p>
            <p>
              La defensa práctica son los bloques protegidos: dos turnos de 90 minutos a la
              semana —martes y jueves a primera hora funcionan bien— reservados en exclusiva
              para Q2, con las notificaciones fuera. No es un capricho de productividad: es el
              precio de entrada para dejar de fabricar tus propias crisis. La métrica honesta
              del viernes no es cuántas urgencias resolviste, sino cuánto Q2 entró.
            </p>
            <p>
              Para que el Q2 no se disuelva, necesita forma de tarea: entra al{" "}
              <Link to="/blogs/tablero-kanban" className="underline underline-offset-2">
                tablero
              </Link>{" "}
              como tarjeta con dueño y límite de trabajo en curso, igual que el resto. Lo que
              no existe en el tablero no sobrevive a la urgencia de turno.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo usarla en equipo: el rito del lunes en 10 minutos",
        body: (
          <>
            <p>
              En equipo, la matriz sirve como ritual de clasificación, no como póster. Al abrir
              la semana, el backlog se pasa por los dos ejes en 10 minutos: cada tarjeta recibe
              cuadrante y acción. Lo Q1 entra con prioridad y WIP ajustado, lo Q2 reserva sus
              bloques, lo Q3 busca dueño —no siempre eres tú— y lo Q4 se saca del tablero.
            </p>
            <p>
              La clasificación por cuadrantes es el filtro grueso; cuando el Q2 acumula más de
              lo que cabe en la semana, hace falta un criterio fino para elegir dentro del
              cuadrante. Ese segundo pase —impacto frente a esfuerzo, coste del retraso— está
              en{" "}
              <Link
                to="/blogs/como-priorizar-tareas"
                className="underline underline-offset-2"
              >
                cómo priorizar tareas
              </Link>
              .
            </p>
            <p>
              Y si la planificación es más larga —un trimestre, un lanzamiento— conviene
              combinarla con la{" "}
              <Link
                to="/blogs/priorizacion-moscow"
                className="underline underline-offset-2"
              >
                priorización MoSCoW
              </Link>
              : la matriz decide qué merece existir hoy; MoSCoW decide qué entra en el
              compromiso.
            </p>
          </>
        ),
      },
      {
        heading: "Qué hacer con el Q3 y el Q4 (delegar y eliminar sin culpa)",
        body: (
          <>
            <p>
              El Q3 es urgente para alguien, pero no importante para tu objetivo. La respuesta
              no es hacerlo rápido: es preguntar quién debería hacerlo. Delegar una tarea Q3 no
              es desentenderse, es distribuirla donde sí suma —y a menudo es la excusa perfecta
              para dar autonomía y entrenar a alguien—. Lo que nadie puede hacer por ti se
              recorta: hay Q3 que se responde en dos líneas de correo y deja de existir.
            </p>
            <p>
              El Q4 pide una decisión más incómoda: cancelar. La reunión de status que nadie
              lee, el reporte que se hace por inercia, la revisión mensual que nadie consulta.
              Eliminar sin culpa tiene una regla: si al quitarlo nadie lo nota en dos semanas,
              no era necesario. Ningún equipo se ha hundido por cancelar demasiadas reuniones
              Q4; varios se han hundido por sostenerlas.
            </p>
            <p>
              Y si quieres clasificar sin depender de servidores —un tablero local-first, con
              tus datos en tu propia carpeta en JSON, sin cuenta ni nube—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              está hecho para equipos de 1 a 15 personas.
            </p>
            <p>
              👉{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                <strong>Prueba Hito gratis</strong>
              </a>{" "}
              — prioriza en tu tablero con WIP visible, offline y sin registro.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es la matriz de Eisenhower?",
        answer:
          "Es una herramienta de priorización que cruza dos ejes —urgente e importante— para clasificar cualquier tarea en cuatro cuadrantes, cada uno con su acción: hacer ahora, planificar, delegar o eliminar. Su aporte central es separar lo que apura por plazo ajeno de lo que sirve a un objetivo propio, porque las dos cosas suelen disfrazarse la una de la otra.",
      },
      {
        question: "¿Cuáles son los 4 cuadrantes de la matriz de Eisenhower?",
        answer:
          "Q1: urgente e importante —hacer ahora—, donde viven las crisis y los plazos inmediatos. Q2: no urgente e importante —planificar—, el trabajo que previene futuras crisis. Q3: urgente y no importante —delegar o recortar—, lo que apura a otro pero no mueve tu objetivo. Q4: no urgente y no importante —eliminar—, la reunión de inercia y el reporte que nadie lee.",
      },
      {
        question: "¿Qué va primero, lo urgente o lo importante?",
        answer:
          "Va primero lo que es las dos cosas: el Q1, urgente e importante, se hace ahora. Pero la pregunta correcta es qué recibe tu mejor hora del día, y ahí la respuesta es lo importante: si llenas tu agenda solo de urgencias, terminas la semana sin crisis pendientes y sin avance real. Lo urgente se atiende; lo importante se agenda.",
      },
      {
        question: "¿Cómo usar la matriz de Eisenhower en un equipo?",
        answer:
          "Como ritual breve de clasificación: al abrir la semana, el equipo recorre el backlog y asigna cuadrante y acción a cada tarjeta en unos 10 minutos —Q1 entra con prioridad, Q2 reserva sus bloques de foco, Q3 busca otro dueño y Q4 se descarta—. Funciona si es un hábito semanal; falla si queda reducido a un póster en la pared.",
      },
      {
        question: "¿La matriz de Eisenhower sirve para proyectos?",
        answer:
          "Sí, sobre todo para decidir qué entra en cada semana del proyecto y qué se deja morir. Dentro de un plan con fechas comprometidas, los cuadrantes separan el fuego del avance: lo Q1 se atiende en el día y lo Q2 recibe bloques protegidos cada semana. Para priorizar el alcance completo de un proyecto conviene complementarla con un método por lotes como MoSCoW.",
      },
    ],
  },
};
