import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "app-gestion-tareas",
  title: "App de gestión de tareas: lo que tiene que tener (y lo que sobra)",
  excerpt:
    "Una app de gestión de tareas no es una lista infinita. Las 8 funciones que importan, cuándo la lista personal se queda chica y cuándo pasar a gestión de proyectos.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-08-19",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "software-gestion-proyectos",
  related: [
    "software-gestion-proyectos",
    "como-priorizar-tareas",
    "seguimiento-de-tareas-equipo",
    "lista-tareas-vs-gestion-proyectos",
  ],
  seo: {
    title: "App de gestión de tareas: lo que sí importa | Hito",
    description:
      "App de gestión de tareas: 8 funciones que importan (captura, responsable, tablero, recurrencia), cuándo se queda chica y cuándo pasar a gestión de proyectos.",
    ogImageAlt: "App de gestión de tareas: funciones que importan frente a las que sobran.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> una <strong>app de gestión de tareas</strong> no es un
        ranking de listas personales: es el umbral entre tachar ítems solo y coordinar trabajo
        con otras personas. Si tu herramienta no asigna, no muestra estado ni deja ver bloqueos,
        sigues en una lista — aunque tenga notificaciones y un logo nuevo.
      </>
    ),
    sections: [
      {
        heading: "Lista vs app de equipo",
        body: (
          <>
            <p>
              Una lista personal resuelve un problema: no olvidar. La escribes tú, la ordenas tú,
              la tachas tú. Puede vivir en notas, en un cuaderno o en un gestor de tareas de una
              sola persona. El día en que entra una segunda persona, el problema cambia: ya no es
              memoria, es coordinación. Ahí es donde una lista se hace pasar por{" "}
              <strong>aplicación para organizar tareas</strong> y empieza a fallar.
            </p>
            <p>
              El umbral no es “más de 20 ítems”. Es cuando una tarea tiene que responder tres
              preguntas a la vez: <em>quién la hace</em>, <em>en qué estado está</em> y{" "}
              <em>qué la bloquea</em>. Si tu herramienta no puede mostrar esas tres cosas sin que
              alguien escriba un mensaje, no es una app de equipo: es una lista con testigos.
            </p>
            <p>
              Ejemplo concreto. Marina lleva su día en una nota: llamar al proveedor, enviar la
              factura, revisar el plano. Funciona. El lunes entra Julián y copian la misma nota a
              un documento compartido. A las 11 nadie sabe si la factura salió. A las 16 los dos
              llamaron al proveedor. A las 18 Marina pregunta por chat “¿lo viste?”. Eso no es
              falta de disciplina: es una lista usada como tablero.
            </p>
            <p>
              Tampoco es un concurso de logos. Un gestor de tareas personal (la categoría de las
              listas con recordatorio) sigue siendo la herramienta correcta si trabajas solo y el
              trabajo no tiene dueños ajenos. El error es comprar “la mejor app 2026” cuando lo
              que cambió no es tu gusto: cambió el número de personas que tocan el mismo ítem.
            </p>
          </>
        ),
      },
      {
        heading: "8 funciones que sí importan",
        body: (
          <>
            <p>
              Las funciones que venden las fichas de producto —temas, stickers, mil vistas, IA que
              resume lo que nadie escribió— no deciden si el trabajo avanza. Estas ocho sí. Si
              faltan dos o más, la app se siente completa y opera como un bloc de notas caro.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Función</th>
                  <th className="py-2 pr-4 font-semibold">Qué resuelve</th>
                  <th className="py-2 font-semibold">Señal de que falta</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Captura</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Meter una tarea en diez segundos, sin formulario de once campos.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    La idea queda en el chat “para cargarla después” y no se carga.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Fecha</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Un compromiso visible, no un “cuando pueda” eterno.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Todo vence el viernes o no vence nunca.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Responsable</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Un nombre. No “el equipo”, no tres personas “en copia”.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    La misma tarjeta la “van a mirar” tres y no la mueve nadie.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Subtareas</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Partir un entregable en pasos que se pueden cerrar.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Tarjetas abiertas dos semanas que en realidad eran cinco trabajos.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Tablero</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Ver el flujo (por hacer / en curso / hecho), no solo una pila.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Nadie puede decir qué está en curso sin leer 80 líneas.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Filtros</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Ver lo mío, lo de esta semana, lo de este cliente.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Scroll infinito y “ctrl+F” como método de trabajo.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Recurrencia</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Lo que se repite (factura del 5, backup, informe) no se reescribe.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Cada mes alguien olvida el mismo ítem y lo vuelve a tipear.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Visibilidad</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El estado se consulta en el tablero, no se pide por mensaje.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El canal de “¿cómo vas?” es el WhatsApp del mediodía.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Captura y fecha bastan para una persona. Responsable, tablero y visibilidad son el
              salto a equipo. Subtareas y filtros aparecen cuando la lista crece. Recurrencia es
              la que evita que el trabajo rutinario se coma la memoria. Si tu app tiene las ocho
              pero nadie las usa, el problema ya no es la herramienta: es que no hay un criterio
              para{" "}
              <Link to="/blogs/como-priorizar-tareas" className="underline underline-offset-2">
                priorizar tareas
              </Link>{" "}
              ni un acuerdo de qué significa “en curso”.
            </p>
          </>
        ),
      },
      {
        heading: "Tipos: personal, equipo y proyecto",
        body: (
          <>
            <p>
              No todas las apps de tareas resuelven el mismo trabajo. Mezclar los tres tipos es
              cómo terminas pagando un “sistema operativo del trabajo” para tachar “llamar al
              dentista”.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Personal.</strong> Un dueño. Lista + fecha + recurrencia. El orden lo
                pones tú (hoy, esta semana, alguna vez). Si trabajas solo —freelance con un
                cliente a la vez, o el lado privado de tu día— esta capa alcanza. Un tablero de
                tres columnas ayuda, pero no es obligatorio.
              </li>
              <li>
                <strong>Equipo.</strong> Varios dueños sobre el mismo conjunto de ítems.
                Aparecen responsable, tablero, filtros y visibilidad. El valor ya no es
                recordarte a ti: es que Julián vea lo de Julián y Marina no tenga que preguntar.
                Aquí vive el{" "}
                <Link
                  to="/blogs/seguimiento-de-tareas-equipo"
                  className="underline underline-offset-2"
                >
                  seguimiento de tareas de equipo
                </Link>{" "}
                sin convertir el chat en un reporte.
              </li>
              <li>
                <strong>Proyecto.</strong> Hay un resultado con fecha, más de un flujo (diseño,
                implementación, revisión) y, casi siempre, un cliente o un presupuesto. Las
                tareas siguen existiendo, pero ya no son el sistema: cuelgan de un alcance, de
                dependencias y de un dueño del conjunto. Eso ya no es un gestor de tareas: es
                gestión de proyectos.
              </li>
            </ul>
            <p>
              Un estudio de cuatro personas que entrega tres sitios a la vez no tiene un problema
              de “lista desordenada”. Tiene tres proyectos. Meterlos en una sola cola de 120
              ítems, aunque cada uno tenga checkbox, es usar la capa incorrecta. La app de tareas
              puede seguir siendo el día a día; el paraguas tiene que ser otra.
            </p>
          </>
        ),
      },
      {
        heading: "Señales de que tu app se quedó chica",
        body: (
          <>
            <p>
              La app no avisa cuando se quedó chica. Lo hacen los hábitos que inventas alrededor.
              Si reconoces dos o más de estas, no necesitas “usar mejor la tool”: necesitas subir
              de capa o cambiar de tipo.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Más de tres personas editan la misma lista</strong> y el estado real
                vive en un hilo de chat, no en la tarjeta.
              </li>
              <li>
                <strong>Las tareas no tienen un responsable</strong> o el responsable es un
                grupo. “Equipo”, “todos”, “marketing” no son dueños.
              </li>
              <li>
                <strong>Preguntas “¿cómo vas?” más de una vez al día</strong> por el mismo ítem,
                porque la lista no muestra bloqueo ni avance.
              </li>
              <li>
                <strong>Hay más de diez ítems “en curso”</strong> y esta semana no se cerró
                casi ninguno. La captura funciona; el flujo, no.
              </li>
              <li>
                <strong>Reescribes a mano lo que debería ser recurrente</strong> (cierre de mes,
                reporte al cliente, backup) y se olvida cada tanto.
              </li>
              <li>
                <strong>Pagas asientos o un plan “Pro”</strong> para desbloquear vistas que
                nadie abre, mientras el trabajo sigue en una hoja o en mensajes.
              </li>
            </ul>
            <p>
              Una sola señal puede ser un mal mes. Dos juntas, de forma estable, significan que
              el umbral personal/equipo ya se cruzó y la herramienta no se enteró. Tres, y estás
              gestionando la app en vez del trabajo.
            </p>
          </>
        ),
      },
      {
        heading: "Cuándo pasar a gestión de proyectos",
        body: (
          <>
            <p>
              Pasar de capa no es “comprar más software”. Es admitir que el objeto de gestión ya
              no es la tarea: es un resultado con fecha, varias personas y, a menudo, alguien
              externo que pregunta. La guía de{" "}
              <Link
                to="/blogs/lista-tareas-vs-gestion-proyectos"
                className="underline underline-offset-2"
              >
                lista de tareas vs gestión de proyectos
              </Link>{" "}
              entra en esa frontera con más detalle; aquí basta la regla práctica.
            </p>
            <p>Sube a gestión de proyectos cuando ocurra al menos una de estas:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Hay una fecha de entrega del <em>conjunto</em>, no de cada ítem (el sitio, el
                informe, la mudanza de oficina).
              </li>
              <li>
                Hay dependencias: B no puede empezar hasta que A cierre, y eso no cabe en una
                subtarea.
              </li>
              <li>
                Hay presupuesto, cliente o un alcance que alguien puede inflar sin que la lista
                se entere.
              </li>
              <li>
                Hay más de un flujo en paralelo (diseño + textos + desarrollo, o legal +
                operaciones) y una sola cola los aplasta.
              </li>
            </ul>
            <p>
              Lo que no justifica el salto: querer un Gantt porque se ve en un artículo, o
              copiar el stack de una empresa de 200 personas. Un equipo de seis puede vivir años
              en un tablero de tareas si el trabajo es flujo continuo (soporte, contenido,
              operaciones). El salto es por la forma del trabajo, no por el recuento de
              funciones. Si estás eligiendo herramienta y no capa, vuelve al{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos
              </Link>
              : primero el tipo de problema, después el producto.
            </p>
            <p>
              Si el umbral que ya cruzaste es el de equipo —dueños, tablero, visibilidad— y
              quieres eso en una carpeta local, sin cuenta ni asientos,{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                Hito
              </a>{" "}
              es un gestor local-first: kanban, checklists y automatizaciones en JSON en tu
              disco, para 1–15 personas, con IA opcional usando tu propia API key. No es una
              lista personal disfrazada ni un “sistema operativo del trabajo”.
            </p>
            <p>
              👉{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                <strong>Prueba Hito gratis</strong>
              </a>{" "}
              — sin cuenta, sin nube, sin asientos.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo saber si tu app de tareas ya no alcanza",
      steps: [
        {
          name: "Cuenta quién edita la misma lista",
          text: "Anota cuántas personas tocan los mismos ítems en una semana. Una persona: la lista personal sigue siendo la capa correcta. Tres o más: ya no es un problema de memoria, es de coordinación.",
        },
        {
          name: "Marca dueño y fecha en una muestra",
          text: "Toma las 20 tareas abiertas y marca cuáles no tienen un responsable único o una fecha. Si más de la mitad fallan, la app no está haciendo de app de equipo aunque el logo lo prometa.",
        },
        {
          name: "Cuenta los “¿cómo vas?” de la semana",
          text: "Si el estado se pide por chat más de una vez al día por el mismo ítem, falta visibilidad: la herramienta no muestra bloqueo ni avance, y el canal real es el mensaje.",
        },
        {
          name: "Elige capa, no marca",
          text: "Con dos o más señales estables, sube de capa: app de equipo (dueño, tablero, visibilidad) o gestión de proyectos (alcance, dependencias, fecha del conjunto). Cambiar de logo sin cambiar de capa no arregla el umbral.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es una app de gestión de tareas?",
        answer:
          "Es una herramienta para capturar, asignar y seguir ítems de trabajo. Una lista personal alcanza si hay un solo dueño; una app de equipo añade responsable, tablero y visibilidad para que el estado no viva en el chat.",
      },
      {
        question: "¿En qué se diferencia una lista de una app de equipo?",
        answer:
          "La lista resuelve no olvidar. La app de equipo resuelve coordinación: quién hace qué, en qué estado está y qué la bloquea, sin preguntar. Si esas tres preguntas salen por WhatsApp, sigues en una lista aunque la tool tenga notificaciones.",
      },
      {
        question: "¿Cuáles son las funciones que sí importan en un gestor de tareas?",
        answer:
          "Ocho: captura rápida, fecha, responsable, subtareas, tablero, filtros, recurrencia y visibilidad. Temas, stickers y el recuento de vistas no deciden si el trabajo avanza.",
      },
      {
        question: "¿Cuándo se queda chica una app de tareas?",
        answer:
          "Cuando más de tres personas editan la misma lista, las tareas no tienen dueño, el estado se pide por chat, hay demasiado trabajo en curso o pagas un plan por vistas que nadie usa. Dos de esas señales de forma estable ya justifican subir de capa.",
      },
      {
        question: "¿Cuándo pasar de gestión de tareas a gestión de proyectos?",
        answer:
          "Cuando el objeto deja de ser el ítem y pasa a ser un resultado con fecha, dependencias, presupuesto o cliente, o varios flujos en paralelo. El salto es por la forma del trabajo, no por querer un Gantt.",
      },
    ],
  },
};
