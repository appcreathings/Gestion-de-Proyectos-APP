import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "control-de-cambios-proyecto",
  title: "Control de cambios en un proyecto: el proceso, no el drama",
  excerpt:
    "Control de cambios: el proceso de 5 pasos para gestionar un change request sin drama —registrar, impactar, decidir, actualizar la línea base y comunicar— y el formulario mínimo que lo hace posible.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-06",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "scrumban",
  related: [
    "scrumban",
    "alcance-de-proyecto-scope-creep",
    "linea-base-proyecto",
  ],
  seo: {
    title:
      "Control de cambios en un proyecto: el proceso, no el drama | Hito",
    description:
      "Control de cambios: el proceso de 5 pasos para gestionar change requests sin drama, el formulario mínimo y cómo proteger alcance, plazo y presupuesto.",
    ogImageAlt:
      "Flujo de control de cambios: solicitud, análisis, decisión, plan, comunicación.",
  },
  content: {
    eyebrow: "Alcance y cambios",
    intro: (
      <>
        <strong>En una línea:</strong> el control de cambios es el proceso de cinco pasos
        —registrar, impactar, decidir, actualizar la línea base y comunicar— que convierte
        cada change request en una decisión informada en lugar de una pelea. Aquí tienes el
        flujo completo, el formulario mínimo y la regla de quién decide según el impacto.
      </>
    ),
    sections: [
      {
        heading: "Por qué los cambios matan proyectos (y por qué no son el enemigo)",
        body: (
          <>
            <p>
              Nadie abandona un proyecto por un solo cambio gigante: lo pierden por veinte
              cambios chicos que nadie discutió. La pantalla extra que «es una línea de
              código», el reporte que «solo falta agregarle una columna», el plazo que «se
              estira una semanita nada más». Cada uno parece gratis en el momento; acumulados,
              son el desvío que nadie autorizó. Ese fenómeno tiene nombre y mecánica propias:
              el{" "}
              <Link
                to="/blogs/alcance-de-proyecto-scope-creep"
                className="underline underline-offset-2"
              >
                scope creep
              </Link>
              .
            </p>
            <p>
              El control de cambios es el antídoto, y conviene entender bien qué es: no una
              valla para decir que no, sino un mostrador donde cada cambio se registra, se le
              pone precio en alcance, plazo y costo, y alguien con autoridad decide con la
              información en la mano. Los proyectos que dicen que no a todo funcionan tan mal
              como los que dicen que sí a todo: lo que protege el proyecto no es la negativa,
              es la decisión consciente.
            </p>
          </>
        ),
      },
      {
        heading: "El proceso de 5 pasos (y la salida concreta de cada uno)",
        body: (
          <>
            <p>
              El proceso completo cabe en una tabla. Ningún paso es opcional, pero todos
              pueden ser ligeros:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Paso</th>
                  <th className="py-2 pr-4 font-semibold">Qué se hace</th>
                  <th className="py-2 font-semibold">Salida concreta</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">1. Registrar</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    La solicitud entra por el formulario único, sin excepciones.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Change request con folio, fecha y solicitante.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">2. Impactar</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Se estima el efecto en alcance, plazo y costo.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Nota de impacto de tres líneas, con números.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">3. Decidir</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El dueño según el impacto aprueba, rechaza o aplaza.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Decisión fechada y con nombre responsable.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">4. Actualizar</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Si se aprueba, la línea base se ajusta formalmente.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Nueva versión de la{" "}
                    <Link
                      to="/blogs/linea-base-proyecto"
                      className="underline underline-offset-2"
                    >
                      línea base
                    </Link>{" "}
                    con fecha.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">5. Comunicar</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    La decisión llega a todos los afectados, no solo a quien la pidió.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Cambio visible para el equipo y el cliente.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El paso que los equipos se saltan casi siempre es el cuarto, y es el que guarda
              la coherencia: si el alcance cambia y la línea base no, en tres semanas el plan
              oficial y la realidad son documentos distintos y nadie puede decir si vas bien o
              mal.
            </p>
            <p>
              Un recorrido completo, para aterrizarlo: el cliente pide el jueves que el
              reporte también salga en PDF. Se registra con folio el mismo día. El impacto
              tarda una hora: son 4 horas de trabajo, no toca la fecha de entrega, cabe en la
              reserva. El líder aprueba el viernes, la base no cambia (el plazo no se movió) y
              el lunes el equipo ya lo ve en el tablero. Total: tres días, cero drama, cero
              trabajo invisible. El mismo cambio sin proceso viaja por chat, lo toma quien
              estaba libre, lo hace en su fin de semana y nadie lo vuelve a mencionar —ni para
              agradecer ni para cobrarlo—.
            </p>
          </>
        ),
      },
      {
        heading: "El formulario mínimo de change request (6 campos, copiable)",
        body: (
          <>
            <p>
              El formulario es la parte que decide si el proceso vive o muere: si pide más de
              lo necesario, la gente deja de llenarlo y los cambios vuelven a viajar por el
              pasillo. Seis campos bastan:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Identificación:</strong> folio, fecha y quién pide el cambio.
              </li>
              <li>
                <strong>Descripción:</strong> qué cambia, en una o dos frases sin adjetivos.
              </li>
              <li>
                <strong>Motivo:</strong> por qué se pide —qué problema resuelve o qué riesgo
                evita—.
              </li>
              <li>
                <strong>Impacto:</strong> efecto estimado en alcance, plazo y costo, con
                números.
              </li>
              <li>
                <strong>Recomendación:</strong> opciones del responsable del proyecto con su
                sugerencia.
              </li>
              <li>
                <strong>Decisión:</strong> aprobado, rechazado o aplazado; quién, cuándo y a
                quién se comunicó.
              </li>
            </ol>
            <p>
              Copia esos seis campos a un documento o a una plantilla de tarjeta y tienes el
              proceso funcionando. El campo de recomendación es el que más se subestima:
              presentar opciones con precio —«lo hacemos este mes y movemos X», «lo hacemos el
              mes que viene», «no lo hacemos»— convierte la reunión de decisión en una
              elección y no en una discusión.
            </p>
          </>
        ),
      },
      {
        heading: "Quién decide: umbrales según el impacto",
        body: (
          <>
            <p>
              El error clásico es enviar todo al cliente o dejar decidir todo al equipo. La
              regla que funciona es un umbral escrito antes del primer cambio:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Dentro del margen del líder.</strong> Cambios que caben en la reserva
                del propio proyecto —unas horas de trabajo, sin tocar fechas comprometidas—.
                Aprueba el responsable del proyecto y se informa, no se consulta.
              </li>
              <li>
                <strong>Fuera del margen.</strong> Todo lo que toca precio, fecha de entrega o
                alcance acordado. Aprueba el cliente o la dirección según el contrato interno,
                con la nota de impacto delante.
              </li>
              <li>
                <strong>Recurrentes.</strong> Si el mismo tipo de cambio se aprueba tres
                veces, deja de ser un cambio y pasa a ser alcance: se incorpora y se ajusta la
                base una sola vez.
              </li>
            </ul>
            <p>
              Lo importante del umbral no es el número sino la existencia: cuando todo el
              mundo sabe de antemano quién decide qué, el proceso no depende de ánimos ni de
              jerarquías del día. Y el solicitante gana algo valioso: saber antes de pedir si
              su cambio es de mostrarador chico o de mesa grande.
            </p>
          </>
        ),
      },
      {
        heading: "Cambiar no es fallar: el control protege, no frena",
        body: (
          <>
            <p>
              Los equipos malos con el control de cambios suelen tener la misma idea de fondo:
              que decir «ese cambio va por el proceso» es una forma elegante de decir que no.
              Es al revés. Un proceso sano es el que permite decir que sí —con su precio en
              fecha o en presupuesto— sin castigar al equipo con trabajo invisible. Lo
              contrario es el sí barato: se acepta todo, se descuenta de los fines de semana
              y del alcance real, y el agotamiento hace el control de calidad.
            </p>
            <p>
              Piénsalo desde el otro lado de la mesa: el cliente que pide un cambio no está
              atacando el proyecto, está ajustando lo que necesita. Lo que destruye la
              relación no es un «sí, con este costo», ni un «no, porque rompería X», sino el
              «sí, claro» silencioso que después llega como retraso sorpresa. El proceso da un
              tercer camino que el improviso no tiene: negociar opciones. Y cada cambio
              aprobado y cobrado correctamente deja de ser una amenaza y pasa a ser parte
              legítima del negocio.
            </p>
            <p>
              Si trabajas por iteraciones, además, el proceso se simplifica solo: los cambios
              que no urgen pueden esperar al próximo sprint, y el tablero con límites WIP te
              impide meterlos empujando lo que ya estaba en curso. Ese modelo de cadencia con
              flujo está desarrollado en{" "}
              <Link to="/blogs/scrumban" className="underline underline-offset-2">
                scrumban: mezclar Scrum y Kanban
              </Link>
              .
            </p>
            <p>
              Y si quieres manejar los cambios como tarjetas con dueño —tablero con límites
              WIP, checklists para el análisis de impacto y todo en un JSON local de tu
              carpeta, sin cuenta ni asientos—{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              está pensado para equipos de 1 a 15 personas.
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
              — cada cambio, registrado y decidido donde el equipo trabaja.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es el control de cambios en un proyecto?",
        answer:
          "Es el proceso con el que un proyecto decide de forma ordenada qué cambios se aceptan, cuáles se rechazan y cuáles se aplazan, midiendo antes su impacto en alcance, plazo y costo. No es una valla burocrática: es el mecanismo que impide que las decisiones pequeñas no tomadas se conviertan en un desvío grande que nadie autorizó.",
      },
      {
        question: "¿Cómo se gestiona un change request?",
        answer:
          "En cinco pasos: registrar la solicitud con un formulario mínimo, analizar su impacto en alcance, plazo y costo, decidir con el dueño correspondiente según el tamaño del impacto, actualizar la línea base si se aprueba y comunicar la decisión a quienes afecta. Sin registro no hay historial, y sin comunicación la aprobación se olvida a las dos semanas.",
      },
      {
        question: "¿Qué debe incluir una solicitud de cambio?",
        answer:
          "Seis campos bastan: identificación (folio, fecha y quién la pide), descripción del cambio y su motivo, impacto estimado en alcance, plazo y costo, opciones o recomendación, decisión tomada con fecha, y a quién se comunicó. Si el formulario pide más que eso, la gente deja de llenarlo y el proceso muere de papeleo.",
      },
      {
        question: "¿Quién aprueba los cambios en un proyecto?",
        answer:
          "El dueño según el tamaño del impacto: el líder del proyecto aprueba los cambios que caben en su margen de maniobra (horas dentro de la reserva, sin mover fechas comprometidas); el cliente o la dirección aprueba lo que toca precio, fecha de entrega o alcance acordado. La regla que importa es que exista un umbral escrito antes del primer cambio.",
      },
      {
        question: "¿Cuál es la diferencia entre control de cambios y scope creep?",
        answer:
          "El control de cambios es el proceso formal: cada modificación se registra, se impacta y se decide conscientemente. El scope creep es lo que pasa sin ese proceso: pequeñas adiciones que nadie discute porque parecen gratuitas y que, acumuladas, desvían el proyecto. La diferencia no está en el tipo de cambio sino en la existencia de una decisión explícita con dueño.",
      },
    ],
  },
};
