import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "gestionar-proyectos-con-clientes",
  title: "Proyectos con clientes externos",
  excerpt:
    "Un cliente externo no es un stakeholder más: cambia el costo del cambio de alcance, el canal de comunicación y quién tiene la última palabra. Cómo ordenarlo.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-03-22",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "gestionar-varios-proyectos-a-la-vez",
  related: [
    "gestionar-varios-proyectos-a-la-vez",
    "matriz-raci",
    "alcance-de-proyecto-scope-creep",
    "hito-para-estudio-juridico",
  ],
  seo: {
    title: "Proyectos con clientes externos | Hito",
    description:
      "Un cliente externo no es un stakeholder más: cambia el costo del cambio de alcance, el canal de comunicación y quién tiene la última palabra. Cómo ordenarlo.",
    ogImageAlt: "Gestionar proyectos con clientes externos: alcance, canal y RACI.",
  },
  content: {
    eyebrow: "Tips y problemas reales",
    intro: (
      <>
        <strong>En una línea:</strong> gestionar un proyecto con un <strong>cliente externo</strong>{" "}
        no es lo mismo que gestionar uno interno con un stakeholder más — el costo de cada cambio
        de alcance es dinero real, la comunicación necesita un canal único de verdad, y la
        confianza se construye (o se rompe) en la forma en que se manejan los primeros pedidos
        fuera de lo acordado. El sistema que evita el caos es simple: expectativas claras desde el
        kickoff, un canal, y un proceso explícito para cambios.
      </>
    ),
    sections: [
      {
        heading: "Qué cambia cuando hay un cliente externo",
        body: (
          <>
            <p>
              Con un stakeholder interno, un cambio de alcance mal manejado genera fricción. Con un
              cliente externo, genera además un problema comercial: horas no presupuestadas,
              expectativa de gratuidad (“esto es chiquito, ¿no?”) y, si se repite, una relación que
              se erosiona antes de terminar el proyecto.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>El cliente no ve tu portafolio — no sabe que compite con otros proyectos.</li>
              <li>
                Cada pedido fuera de alcance tiene un costo real que hay que nombrar, no absorber
                en silencio.
              </li>
              <li>
                La relación sobrevive a la entrega: un cierre prolijo o desprolijo define si hay
                próximo proyecto.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Alinear expectativas desde el kickoff",
        body: (
          <>
            <p>
              La mayoría de los conflictos con clientes no nacen de un error de ejecución — nacen
              de una expectativa que nunca se dijo en voz alta. Un kickoff de 30 minutos que cubra
              estos cuatro puntos evita la mitad de los problemas del proyecto:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Qué entra en el alcance y, explícitamente, qué no entra.</li>
              <li>Cómo y cuándo se comunica el avance (canal, frecuencia).</li>
              <li>Quién del lado del cliente aprueba qué (para no juntar cinco “síes” distintos).</li>
              <li>Qué pasa si algo cambia — el proceso de change request, acordado antes de necesitarlo.</li>
            </ol>
          </>
        ),
      },
      {
        heading: "Comunicación: un canal único de verdad",
        body: (
          <>
            <p>
              El error más común es dejar que la comunicación con el cliente se disperse entre
              WhatsApp, email y llamadas sueltas. Cada canal nuevo es una versión distinta de la
              verdad, y el pedido que llegó por WhatsApp “urgente” termina saltando la fila sin
              pasar por el proceso acordado.
            </p>
            <p>
              Definí un canal principal (puede ser tan simple como un email con hilo por proyecto,
              o un tablero compartido) y una regla: todo pedido que cambia alcance o fecha se
              confirma ahí, aunque haya surgido en una llamada. Esto no es burocracia — es lo que
              te permite tener un historial cuando, meses después, alguien pregunta “¿esto lo
              pedimos nosotros o fue idea de ustedes?”.
            </p>
          </>
        ),
      },
      {
        heading: "Cambios de alcance con cliente: el change request",
        body: (
          <>
            <p>
              Todo cliente va a pedir algo fuera de lo acordado en algún momento — no es una señal
              de mal cliente, es normal. Lo que define si se vuelve un problema es si hay un
              proceso para absorberlo. Ver el detalle completo en{" "}
              <Link
                to="/blogs/alcance-de-proyecto-scope-creep"
                className="underline underline-offset-2"
              >
                alcance de proyecto y scope creep
              </Link>
              . Con cliente externo, sumá siempre estos dos pasos:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Nombrar el trade-off en la misma respuesta: “Podemos sumarlo — implica X días más o
                sacar Y de este ciclo. ¿Cuál preferís?”.
              </li>
              <li>
                Confirmarlo por escrito en el canal principal antes de empezar a trabajar en el
                cambio, no después.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "RACI con el cliente adentro",
        body: (
          <>
            <p>
              Una{" "}
              <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                matriz RACI
              </Link>{" "}
              con el cliente como fila explícita resuelve el problema más caro de los proyectos
              externos: dos personas del lado del cliente dando aprobaciones distintas. Definí,
              antes de empezar, quién del cliente es el único Aprobador real — no “el equipo” en
              general, una persona.
            </p>
          </>
        ),
      },
      {
        heading: "Cuando el cliente es el cuello de botella",
        body: (
          <>
            <p>
              A veces el atraso no es tuyo: es una aprobación que no llega, un contenido que no
              entregan, un acceso que no dan. Tratalo con el mismo rigor que un bloqueo interno:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Documentá la fecha en que se pidió y el impacto en el cronograma si no llega a
                tiempo — no lo absorbas en silencio como si fuera tu atraso.
              </li>
              <li>
                Comunicá el impacto apenas se vuelve real, no en la fecha de entrega: “Sin el
                contenido X, el hito del [fecha] se mueve a [nueva fecha]”.
              </li>
              <li>
                Si se repite, es una conversación sobre el proceso, no un reclamo puntual — proponé
                un cambio concreto (ej. plazo de respuesta acordado para aprobaciones).
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Cierre y relación post-proyecto",
        body: (
          <>
            <p>
              Con cliente externo, el cierre importa doblemente: define si hay un próximo proyecto.
              Cerrá con aprobación formal, factura al día y un mensaje corto que dé opción a seguir
              trabajando juntos sin presión — “quedamos disponibles para lo que necesiten a
              futuro” alcanza. Si el proyecto es de un rubro con expedientes o casos recurrentes
              (por ejemplo, un estudio jurídico), vale la pena un sistema que ya separe clientes,
              proyectos y tareas desde el día uno — ver{" "}
              <Link
                to="/blogs/hito-para-estudio-juridico"
                className="underline underline-offset-2"
              >
                cómo configurar Hito para un estudio jurídico
              </Link>{" "}
              como ejemplo aplicado.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo gestionar un proyecto con cliente externo",
      steps: [
        {
          name: "Kickoff de expectativas",
          text: "Alcance dentro/fuera, canal de comunicación, quién aprueba del lado del cliente, y proceso de cambios — los cuatro, antes de empezar a ejecutar.",
        },
        {
          name: "Definir un canal único de verdad",
          text: "Todo pedido que cambia alcance o fecha se confirma ahí, incluso si surgió en una llamada o un mensaje suelto.",
        },
        {
          name: "Nombrar el trade-off en cada change request",
          text: "Cada pedido fuera de alcance se responde con impacto en tiempo o alcance, confirmado por escrito antes de empezar a trabajar en él.",
        },
        {
          name: "Un solo Aprobador del lado del cliente",
          text: "RACI explícito con el cliente adentro evita recibir dos aprobaciones distintas para la misma decisión.",
        },
        {
          name: "Cerrar formalmente con aprobación y factura al día",
          text: "El cierre prolijo, más que la ejecución perfecta, es lo que suele definir si hay un próximo proyecto con ese cliente.",
        },
      ],
    },
    faq: [
      {
        question: "¿Cómo digo que no a un pedido sin dañar la relación con el cliente?",
        answer:
          "No digas \"no\" — nombrá el trade-off: \"Podemos sumarlo, implica mover la fecha X días o sacar algo de este ciclo\". Casi siempre el cliente decide solo cuando ve el costo real, en vez de sentir un rechazo.",
      },
      {
        question: "¿Qué hago si el cliente pide todo por WhatsApp y se resiste al canal formal?",
        answer:
          "Respondé en el canal formal aunque el pedido haya llegado por WhatsApp: \"Te confirmo por [canal] para que quede registrado\". En unas semanas el cliente adopta el hábito porque es donde recibe la respuesta.",
      },
      {
        question: "¿Sirve tener un solo Aprobador si en la empresa cliente deciden en comité?",
        answer:
          "Sí — el Aprobador único no decide solo, es la persona responsable de traer una respuesta consolidada del comité. Sin ese rol, cada miembro del comité te da su opinión por separado y ninguna es definitiva.",
      },
      {
        question: "¿Cómo evito que el scope creep con cliente se vuelva constante?",
        answer:
          "El proceso de change request explícito, acordado desde el kickoff, es lo que lo frena: cuando cada pedido fuera de alcance tiene un costo visible y nombrado, el cliente empieza a priorizar en vez de pedir todo \"ya que estamos\".",
      },
    ],
  },
};
