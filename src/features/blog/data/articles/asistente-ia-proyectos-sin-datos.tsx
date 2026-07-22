import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
  slug: "asistente-ia-proyectos-sin-datos",
  title: "Asistente de IA para proyectos: cómo usarlo sin entrenar modelos con tus datos",
  excerpt:
    "La IA puede acelerar la gestión de proyectos, pero no debería costar tu confidencialidad. Cómo usar un asistente de IA sin entregar tus datos.",
  category: "inteligencia-artificial",
  categoryLabel: "Inteligencia artificial",
  publishedAt: "2026-07-05",
  readingTime: "7 min",
  featured: true,
  seo: {
    title: "Asistente de IA para proyectos sin sacrificar privacidad — Hito",
    description:
      "Cómo usar un asistente de IA para proyectos manteniendo tus datos locales. Guía para usar IA privada sin entrenar modelos con tu información.",
    ogImageAlt: "Asistente de IA privado para gestión de proyectos.",
  },
  content: {
    eyebrow: "Inteligencia artificial",
    intro: (
      <>
        La promesa de los asistentes de IA es tentadora: preguntarle a una máquina el estado de
        tus proyectos, pedirle que resuma tareas bloqueadas o que sugiera el próximo paso. Pero
        detrás de esa comodidad hay una pregunta incómoda: ¿dónde quedan tus datos cuando se los
        cuentas? Si quieres usar un <strong>asistente de IA para proyectos</strong> sin
        convertirte en el producto, necesitas entender cómo se procesa la información.
      </>
    ),
    sections: [
      {
        heading: "No toda la nube de IA es igual",
        body: (
          <>
            <p>
              Algunas plataformas usan tus conversaciones para mejorar sus modelos. Otras
              guardan tus prompts durante años. Y muchas veces las políticas de privacidad son
              lo suficientemente amplias como para que no sepas realmente qué pasa con la
              información de tus clientes, tu estrategia o tus procesos internos.
            </p>
            <p>
              No se trata de no usar IA. Se trata de usarla de forma que tú decidas qué
              compartes, cuándo y bajo qué términos.
            </p>
          </>
        ),
      },
      {
        heading: "¿Cómo funciona un asistente de IA privado?",
        body: (
          <>
            <p>Un asistente de IA privado para proyectos sigue tres principios:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Tus datos no se mueven:</strong> el asistente lee tu espacio de trabajo
                local, no una copia en la nube.
              </li>
              <li>
                <strong>Tú controlas la clave:</strong> usas tu propia API key del proveedor del
                modelo, configurada solo en tu navegador.
              </li>
              <li>
                <strong>Las llamadas son directas:</strong> tu navegador habla con la API del
                modelo; la app de gestión no intercepta ni almacena conversaciones.
              </li>
            </ol>
            <p>
              Así, el asistente puede responder "¿qué tareas vencen esta semana?" o "¿qué SOP le
              falta al área legal?" sin que toda tu base de datos viaje a un servidor externo.
            </p>
          </>
        ),
      },
      {
        heading: "La clave es tuya",
        body: (
          <>
            <p>
              Una forma de mantener el control es usar tu propia API key con un modelo que
              respete tus configuraciones. Así, la conversación va directamente entre tu
              navegador y el proveedor del modelo, sin pasar por servidores de la herramienta de
              gestión. La app no ve tus preguntas ni sus respuestas.
            </p>
            <p>
              Además, si la clave se guarda solo en tu navegador y nunca en la carpeta de
              trabajo, ni siquiera queda expuesta si alguien copia tus archivos.
            </p>
          </>
        ),
      },
      {
        heading: "IA con contexto, sin sacrificar privacidad",
        body: (
          <>
            <p>
              El verdadero valor de un asistente en una herramienta de gestión no está en
              responder preguntas genéricas, sino en entender el contexto de tus proyectos. Para
              eso, el asistente necesita leer tus datos. La pregunta es: ¿los lee en tu máquina
              y los envía selectivamente, o los sube todos a la nube para procesarlos?
            </p>
            <p>
              Hito elige el primer camino. El asistente tiene acceso a tu espacio de trabajo
              local y usa herramientas específicas para responder, sin mover tu base de datos
              completa a ningún servidor. Tú decides si activarlo, con qué modelo y cuándo
              desactivarlo.
            </p>
          </>
        ),
      },
      {
        heading: "Preguntas frecuentes",
        body: (
          <>
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold text-foreground">
                  ¿Mis datos entrenan el modelo de IA?
                </dt>
                <dd className="text-muted-foreground">
                  Depende del proveedor y de tu configuración. Usar tu propia API key con
                  opciones de privacidad desactivadas reduce el riesgo, pero siempre revisa los
                  términos del modelo.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">
                  ¿Puedo usar el asistente sin internet?
                </dt>
                <dd className="text-muted-foreground">
                  No. El modelo vive en la nube del proveedor. Pero tus datos se quedan locales;
                  solo viajan los fragmentos necesarios para responder tu pregunta.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">
                  ¿Es seguro guardar la API key en el navegador?
                </dt>
                <dd className="text-muted-foreground">
                  Más seguro que guardarla en archivos compartidos. La clave queda en IndexedDB
                  local de tu navegador y no se exporta con los proyectos.
                </dd>
              </div>
            </dl>
          </>
        ),
      },
    ],
  },
};
