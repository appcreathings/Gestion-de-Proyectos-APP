import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "proyecto-atrasado-que-hacer",
  title: "Tu proyecto va atrasado: 6 movimientos antes de pedir plazo",
  excerpt:
    "Playbook de crisis: diagnosticar, congelar alcance, recortar, liberar la ruta crítica y comunicar con datos — antes de pedir más tiempo.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-02-08",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "gestionar-varios-proyectos-a-la-vez",
  related: [
    "gestionar-varios-proyectos-a-la-vez",
    "ruta-critica-proyecto",
    "alcance-de-proyecto-scope-creep",
    "como-estimar-tiempos-proyecto",
  ],
  seo: {
    title: "Tu proyecto va atrasado: 6 movimientos antes de pedir plazo | Hito",
    description:
      "Playbook de crisis: diagnosticar, congelar alcance, recortar, liberar la ruta crítica y comunicar con datos — antes de pedir más tiempo.",
    ogImageAlt: "Proyecto atrasado: 6 movimientos antes de pedir más plazo.",
  },
  content: {
    eyebrow: "Tips y problemas reales",
    intro: (
      <>
        <strong>En una línea:</strong> si el proyecto va atrasado, no empieces por pedir más
        plazo ni por “echar más horas” en silencio. Hacé estos{" "}
        <strong>6 movimientos en orden</strong>: diagnosticar, congelar alcance, recortar o
        resecuenciar, liberar la ruta crítica, comunicar con datos y —solo si hace falta—
        negociar fecha con un plan B. Pedir tiempo sin haber hecho 1–5 es pedir confianza sin
        haberla ganado.
      </>
    ),
    sections: [
      {
        heading: "1. Diagnosticar: ¿es alcance, capacidad, bloqueo o estimación?",
        body: (
          <>
            <p>
              Antes de mover el plan, nombrá la causa dominante. Si mezclás todas, la “solución”
              será ruido:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Causa</th>
                  <th className="py-2 pr-4 font-semibold">Señal</th>
                  <th className="py-2 font-semibold">Primera respuesta</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Alcance</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Entraron pedidos sin trade-off
                  </td>
                  <td className="py-2 text-muted-foreground">Scope freeze + recorte</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Capacidad</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Menos gente/tiempo del planificado
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Bajar carga o reasignar del portafolio
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Bloqueo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Esperando a un tercero o decisión
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Escalar dueño + fecha de desbloqueo
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Estimación</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El trabajo real es más grande
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Reestimar lo que queda, no reescribir el pasado
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Si el atraso es de estimación crónica, el fix de fondo está en{" "}
              <Link
                to="/blogs/como-estimar-tiempos-proyecto"
                className="underline underline-offset-2"
              >
                cómo estimar tiempos
              </Link>
              — pero hoy necesitás un plan de recuperación, no un post-mortem eterno.
            </p>
          </>
        ),
      },
      {
        heading: "2. Congelar el alcance (scope freeze temporal)",
        body: (
          <>
            <p>
              Mientras el proyecto está rojo,{" "}
              <strong>no entran features nuevas</strong> salvo que saquen otra del
              compromiso. Decilo en una frase compartida con el equipo y el stakeholder:
            </p>
            <p className="rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              “Hasta el hito del [fecha], solo trabajamos en [lista A]. Todo lo demás va a
              backlog post-hito o reemplaza algo de A con aprobación explícita.”
            </p>
            <p>
              Sin freeze, el scope creep se come el rescate. Detalle en{" "}
              <Link
                to="/blogs/alcance-de-proyecto-scope-creep"
                className="underline underline-offset-2"
              >
                alcance de proyecto y scope creep
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "3. Recortar o resecuenciar: qué sale del “debe” al “después”",
        body: (
          <>
            <p>
              Tres palancas (en este orden de preferencia cuando el valor del hito lo permite):
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Recortar alcance:</strong> “debe” → “después del hito”.
              </li>
              <li>
                <strong>Resecuenciar:</strong> entregar un núcleo usable antes; el resto en una
                segunda ola.
              </li>
              <li>
                <strong>Bajar calidad cosmético (no calidad estructural):</strong> menos polish,
                mismos criterios de “funciona y es seguro”. Nunca recortes testing crítico para
                “llegar”.
              </li>
            </ol>
            <p>
              Si gestionás varios frentes, el recorte puede ser de{" "}
              <em>otro</em> proyecto para liberar capacidad — ver el pilar{" "}
              <Link
                to="/blogs/gestionar-varios-proyectos-a-la-vez"
                className="underline underline-offset-2"
              >
                cómo gestionar varios proyectos a la vez
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "4. Liberar la ruta crítica",
        body: (
          <>
            <p>
              No todas las tareas atrasadas mueven la fecha de entrega. Identificá la{" "}
              <Link
                to="/blogs/ruta-critica-proyecto"
                className="underline underline-offset-2"
              >
                ruta crítica
              </Link>
              : la cadena de dependencias que define el fin del proyecto.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Poné a la gente más capaz (o más disponible) en la ruta crítica.</li>
              <li>Sacá de su plato el trabajo que no mueve la fecha.</li>
              <li>Atacá bloqueos de la ruta crítica primero, no los más ruidosos.</li>
              <li>Evitá WIP alto: terminar un eslabón crítico vale más que empezar tres.</li>
            </ul>
          </>
        ),
      },
      {
        heading: "5. Comunicar con datos (no con culpa)",
        body: (
          <>
            <p>
              Un mensaje útil al stakeholder tiene cuatro bloques, en este orden:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Hecho:</strong> “Estamos X días / % detrás del plan del hito Y.”
              </li>
              <li>
                <strong>Causa en una línea:</strong> alcance / capacidad / bloqueo / estimación
                (sin novela).
              </li>
              <li>
                <strong>Qué ya hicimos:</strong> freeze, recortes, reasignaciones.
              </li>
              <li>
                <strong>Opciones con trade-off:</strong> A) misma fecha, menos alcance; B) mismo
                alcance, nueva fecha; C) más capacidad (si existe).
              </li>
            </ol>
            <p className="rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              Plantilla corta: “El hito del 20 queda en riesgo. Causa principal: [Z]. Ya
              congelamos alcance y sacamos [ítems]. Opciones: (1) entregar núcleo el 20 sin
              [feature]; (2) entregar completo el 27; (3) sumar [recurso] y mantener fecha. ¿Cuál
              preferís?”
            </p>
          </>
        ),
      },
      {
        heading: "6. Pedir plazo solo si 1–5 no alcanzan — con plan B",
        body: (
          <>
            <p>
              Pedir tiempo es legítimo cuando el trabajo restante, con alcance ya recortado y
              ruta crítica desbloqueada, <strong>sigue sin caber</strong>. Entonces:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Nueva fecha basada en reestimación de lo que queda (no en optimismo).</li>
              <li>Hitos intermedios visibles (no un “nuevo fin” a 3 meses sin checkpoints).</li>
              <li>Qué se protege y qué queda explícitamente afuera.</li>
              <li>Riesgos residuales y cómo se miran cada semana.</li>
            </ul>
          </>
        ),
      },
      {
        heading: "Qué no hacer (aunque dé alivio corto)",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Esconder el atraso</strong> hasta la semana del release.
              </li>
              <li>
                <strong>Horas heroicas</strong> como plan principal — agotan al equipo y no
                arreglan un alcance imposible.
              </li>
              <li>
                <strong>Abrir otro proyecto</strong> “para distraer” o quedar bien con otro
                cliente mientras este se hunde.
              </li>
              <li>
                <strong>Culpar en público</strong> a una persona: el diagnóstico es del sistema
                (alcance, capacidad, proceso).
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Prevención mínima para el próximo ciclo",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Buffer de capacidad en el plan (no al 100%).</li>
              <li>Definition of Ready antes de comprometer (ver sprint planning si usás sprints).</li>
              <li>Check de ruta crítica semanal en proyectos con fecha dura.</li>
              <li>Portafolio con límite de frentes activos — un atraso no debería nacer de tener 8 “prioridades 1”.</li>
            </ul>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo reaccionar cuando el proyecto va atrasado",
      steps: [
        {
          name: "Diagnosticar la causa dominante",
          text: "Alcance, capacidad, bloqueo o estimación. Elegí una causa principal para no mezclar remedios.",
        },
        {
          name: "Congelar el alcance",
          text: "Nada nuevo entra sin sacar algo del compromiso. Comunicá el freeze al equipo y al stakeholder.",
        },
        {
          name: "Recortar o resecuenciar el “debe”",
          text: "Mové ítems a “después del hito” o entregá un núcleo usable primero.",
        },
        {
          name: "Concentrar gente y atención en la ruta crítica",
          text: "Liberá a quien está en la cadena que mueve la fecha; pausá trabajo que no la mueve.",
        },
        {
          name: "Comunicar opciones con trade-off",
          text: "Hecho + causa + acciones ya tomadas + opciones (alcance, fecha o capacidad). Pedí plazo solo si aún no alcanza.",
        },
      ],
    },
    faq: [
      {
        question: "¿Cuándo es demasiado tarde para recuperar el hito?",
        answer:
          "Cuando, con alcance mínimo viable y ruta crítica desbloqueada, la reestimación honesta sigue superando la fecha y no hay capacidad extra. Ahí el movimiento correcto es renegociar, no fingir.",
      },
      {
        question: "¿Debo avisar al cliente en el primer día de atraso?",
        answer:
          "Avisá cuando el riesgo al hito es real y tenés al menos un diagnóstico y una opción — no hace falta esperar a tener el plan perfecto, pero tampoco mandes pánico sin datos. Mejor un aviso temprano con opciones que un silencio largo.",
      },
      {
        question: "¿Qué hago si el stakeholder no acepta recortar alcance ni mover fecha?",
        answer:
          "Pedí la tercera palanca: más capacidad o menos trabajo en paralelo de otros proyectos. Si las tres se niegan, documentá el riesgo por escrito: el “no” a las palancas es un “sí” al atraso.",
      },
      {
        question: "¿Sirve este playbook si soy el único en el proyecto?",
        answer:
          "Sí. Congelás alcance, recortás el “debe”, te enfocás en la cadena crítica y te comunicás con el cliente con las mismas cuatro partes del mensaje. El orden no cambia por ser uno solo.",
      },
    ],
  },
};
