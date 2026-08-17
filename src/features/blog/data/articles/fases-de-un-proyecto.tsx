import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "fases-de-un-proyecto",
  title: "Fases de un proyecto: las 5 etapas, con ejemplos",
  excerpt:
    "Inicio, planificación, ejecución, seguimiento y cierre: las 5 fases de cualquier proyecto explicadas con un ejemplo real, sin depender de una metodología específica.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-10-19",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "gestion-de-proyectos-guia-completa",
  related: [
    "como-estimar-tiempos-proyecto",
    "alcance-de-proyecto-scope-creep",
    "objetivos-proyecto-smart-okr",
  ],
  seo: {
    title: "Fases de un proyecto: las 5 etapas, con ejemplos | Hito",
    description:
      "Las fases de un proyecto (y cada etapa de un proyecto): inicio, planificación, ejecución, seguimiento y cierre, con un ejemplo real.",
    ogImageAlt: "Las 5 fases de un proyecto explicadas con ejemplos.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> las fases de un proyecto son cinco — inicio, planificación,
        ejecución, seguimiento y cierre — en ese orden, sin importar si usas Scrum, cascada o una
        hoja de cálculo. Fusionar dos fases sin querer (por ejemplo, empezar a ejecutar sin haber
        planificado) es la causa más común de atrasos. Acá van las cinco, con un ejemplo real de
        principio a fin: renovar el sitio web de una empresa pequeña.
      </>
    ),
    sections: [
      {
        heading: "Fase 1 — Inicio: ¿vale la pena hacer esto?",
        body: (
          <>
            <p>
              El inicio responde una sola pregunta: <strong>¿por qué hacemos este proyecto y qué
              pasa si no lo hacemos?</strong> Suena obvio, pero es la fase que más se salta —
              equipos enteros arrancan a trabajar en algo sin que nadie haya escrito para qué
              sirve, y descubren a mitad de camino que dos áreas tenían expectativas distintas.
            </p>
            <p>
              <strong>Ejemplo:</strong> el sitio web actual tiene 4 años, no se ve bien en
              celular y el equipo de ventas se queja de que no genera contactos. El objetivo del
              proyecto: un sitio nuevo, responsive, que duplique los formularios completados en 3
              meses. Esa frase — objetivo + métrica + plazo — es todo lo que necesita el inicio
              de un proyecto chico. Para escribirlo con criterio, ver{" "}
              <Link
                to="/blogs/objetivos-proyecto-smart-okr"
                className="underline underline-offset-2"
              >
                objetivos SMART y OKR
              </Link>
              . En proyectos grandes se formaliza en un <em>acta de constitución</em>, pero el
              contenido mínimo es el mismo.
            </p>
            <p>
              <strong>Señal de que esta fase está incompleta:</strong> si le preguntas a dos
              personas del equipo "¿para qué estamos haciendo esto?" y responden cosas distintas,
              todavía no terminó el inicio.
            </p>
          </>
        ),
      },
      {
        heading: "Fase 2 — Planificación: qué, en qué orden, con qué",
        body: (
          <>
            <p>
              La planificación traduce el objetivo en trabajo concreto: qué entregables hay, en
              qué orden se hacen, quién los hace y cuánto tiempo toman. Es la fase donde se
              cometen la mayoría de los errores caros, porque es la más fácil de acortar bajo
              presión ("ya planificamos suficiente, empecemos") y la más cara de haber saltado
              cuando el proyecto ya está en marcha.
            </p>
            <p>
              <strong>Ejemplo (sitio web):</strong> entregables grandes — diseño de las 5
              páginas principales, contenido de cada una, desarrollo, migración de dominio, QA en
              3 navegadores. Orden: el contenido tiene que estar antes de diseñar (diseñar sin
              contenido real produce maquetas que hay que rehacer). Responsables: uno por
              entregable. Estimación de cada bloque — ver{" "}
              <Link to="/blogs/como-estimar-tiempos-proyecto" className="underline underline-offset-2">
                cómo estimar tiempos sin fallar siempre
              </Link>
              .
            </p>
            <p>
              Esta fase también define el <strong>alcance</strong>: qué entra en este proyecto y
              qué no (¿el blog se migra ahora o después? ¿el e-commerce es parte de esto?). Sin
              esa línea escrita, el alcance crece solo durante la ejecución — ver{" "}
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
        heading: "Fase 3 — Ejecución: el trabajo real",
        body: (
          <>
            <p>
              Acá es donde efectivamente se escribe el contenido, se diseña, se programa. Es la
              fase más larga y la más visible, pero paradójicamente la que menos decisiones de
              gestión requiere si las dos fases anteriores se hicieron bien — el trabajo de
              ejecución consiste en que cada responsable haga lo suyo en el orden ya definido.
            </p>
            <p>
              El error común en esta fase no es de gestión sino de comunicación: nadie actualiza
              el estado real de su parte hasta que alguien pregunta. La solución no es más
              reuniones — es que actualizar el estado sea tan rápido que cueste menos que
              ignorarlo (mover una tarjeta de columna, tildar un ítem). Cuanta más fricción tenga
              actualizar el tablero, menos se actualiza, y sin esa información la fase de
              seguimiento no tiene con qué trabajar.
            </p>
          </>
        ),
      },
      {
        heading: "Fase 4 — Seguimiento: ¿vamos a tiempo?",
        body: (
          <>
            <p>
              El seguimiento corre en paralelo a la ejecución, no después. Su trabajo es comparar
              lo planificado contra lo real y decidir qué hacer con la diferencia: ¿es un atraso
              menor que se absorbe solo, o hay que reasignar recursos, mover la fecha o cortar
              alcance?
            </p>
            <p>
              <strong>Ejemplo:</strong> a mitad del proyecto, el contenido de 2 de las 5 páginas
              todavía no está listo porque el responsable de marketing se sumó tarde a otro
              proyecto. El seguimiento detecta esto <em>antes</em> de la fecha de entrega — no el
              día de la fecha de entrega — y da tiempo a decidir: ¿reasignar el contenido a otra
              persona, o mover el lanzamiento una semana? Esa decisión a tiempo es la diferencia
              entre un atraso de días y uno de semanas.
            </p>
            <p>
              El seguimiento necesita una cadencia fija (semanal suele alcanzar para proyectos
              chicos) y una sola fuente de verdad — no un estado distinto en cada chat.
            </p>
          </>
        ),
      },
      {
        heading: "Fase 5 — Cierre: entregar y aprender",
        body: (
          <>
            <p>
              El cierre es la fase que casi nadie hace bien, porque para cuando llega el
              entregable ya está en producción y el equipo pasó mentalmente al siguiente
              proyecto. Cerrar bien significa tres cosas: confirmar que el entregable cumple lo
              que se prometió en el inicio, documentar qué quedó pendiente (siempre queda algo) y
              anotar 2-3 aprendizajes concretos para el próximo proyecto.
            </p>
            <p>
              <strong>Ejemplo:</strong> el sitio se lanzó, los formularios se duplicaron en 6
              semanas (no en 3 como se esperaba — la estimación falló, y ese es exactamente el
              tipo de aprendizaje que vale la pena anotar). El aprendizaje concreto: la próxima
              vez, estimar el contenido con margen, porque fue el cuello de botella real.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Cuáles son las fases de un proyecto?",
        answer:
          "Las fases de un proyecto son cinco: inicio (para qué se hace), planificación (qué, en qué orden y con qué), ejecución (el trabajo real), seguimiento (comparar lo planificado contra lo real) y cierre (entregar y anotar aprendizajes). El orden no cambia si usas Scrum, cascada o una hoja de cálculo.",
      },
      {
        question: "¿Qué es una etapa de un proyecto?",
        answer:
          "Etapa de un proyecto y fase de un proyecto se usan como sinónimos: cada bloque con un objetivo distinto (definir, planear, ejecutar, controlar, cerrar). Si fusionas dos etapas —por ejemplo, ejecutar sin haber planificado— el atraso suele aparecer más adelante, no al inicio.",
      },
      {
        question: "¿Cuáles son las fases del proyecto?",
        answer:
          "Las fases del proyecto son las mismas cinco, aplicadas a ese trabajo concreto: inicio, planificación, ejecución, seguimiento y cierre. Lo que cambia de un proyecto a otro no es la lista, sino cuánto tiempo y formalidad necesita cada fase.",
      },
    ],
    howTo: {
      name: "Las 5 fases de un proyecto",
      steps: [
        { name: "Inicio", text: "Definir el objetivo, la métrica de éxito y el plazo en una frase." },
        {
          name: "Planificación",
          text: "Listar entregables, orden, responsables, estimaciones y alcance por escrito.",
        },
        { name: "Ejecución", text: "Cada responsable hace su parte en el orden ya definido." },
        {
          name: "Seguimiento",
          text: "Comparar lo planificado contra lo real, con cadencia fija, y actuar sobre la diferencia a tiempo.",
        },
        {
          name: "Cierre",
          text: "Confirmar el entregable contra el objetivo inicial, documentar pendientes y anotar aprendizajes.",
        },
      ],
    },
  },
};
