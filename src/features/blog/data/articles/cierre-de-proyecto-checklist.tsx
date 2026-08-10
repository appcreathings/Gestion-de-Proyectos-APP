import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "cierre-de-proyecto-checklist",
  title: "Cierre de proyecto: el checklist que casi nadie hace",
  excerpt:
    "La mayoría de los proyectos no cierran, se apagan: el equipo pasa al siguiente sin archivar, sin retro y sin cobrar el último hito. Checklist de cierre real.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-03-15",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "gestionar-varios-proyectos-a-la-vez",
  related: [
    "fases-de-un-proyecto",
    "retrospectivas-formatos",
    "gestion-de-proyectos-guia-completa",
    "gestion-de-riesgos-simple",
  ],
  seo: {
    title: "Cierre de proyecto: el checklist que casi nadie hace | Hito",
    description:
      "La mayoría de los proyectos no cierran, se apagan: el equipo pasa al siguiente sin archivar, sin retro y sin cobrar el último hito. Checklist de cierre real.",
    ogImageAlt: "Checklist de cierre de proyecto: lo que casi nadie hace al final.",
  },
  content: {
    eyebrow: "Tips y problemas reales",
    intro: (
      <>
        <strong>En una línea:</strong> la mayoría de los proyectos no <strong>cierran</strong>,
        simplemente se apagan — el equipo se muda de a poco al siguiente frente sin archivar
        nada, sin retro y a veces sin cobrar el último hito. Cerrar bien toma menos de una tarde y
        evita tres costos silenciosos: trabajo repetido, aprendizaje perdido y facturación
        colgada.
      </>
    ),
    sections: [
      {
        heading: "Por qué los proyectos “terminan” sin cerrar",
        body: (
          <>
            <p>
              La fase de cierre es la única de las{" "}
              <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                5 fases de un proyecto
              </Link>{" "}
              que no tiene un entregable urgente empujándola. Nadie reclama el cierre como
              reclama un retraso en la ejecución — así que compite en prioridad contra el
              siguiente proyecto que ya tiene fecha, y pierde.
            </p>
            <p>El costo aparece después, cuando ya es más caro resolverlo:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Nadie recuerda por qué se tomó una decisión clave, seis meses después.</li>
              <li>El acceso a una cuenta o repositorio queda abierto sin necesidad.</li>
              <li>El último hito de facturación se factura tarde, o nunca.</li>
              <li>El equipo repite un error que la retro habría evitado.</li>
            </ul>
          </>
        ),
      },
      {
        heading: "El checklist de cierre",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Área</th>
                  <th className="py-2 font-semibold">Qué verificar</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Entregables</td>
                  <td className="py-2 text-muted-foreground">
                    Todo lo comprometido está entregado y aceptado formalmente, no solo “enviado”
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Aprobaciones</td>
                  <td className="py-2 text-muted-foreground">
                    Firma o confirmación explícita del cliente/stakeholder de que el proyecto se
                    dio por terminado
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Facturación</td>
                  <td className="py-2 text-muted-foreground">
                    Último hito facturado y cobrado; sin pagos pendientes sin fecha
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Documentación</td>
                  <td className="py-2 text-muted-foreground">
                    Decisiones clave y su porqué quedan escritas, no solo en la memoria del equipo
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Accesos</td>
                  <td className="py-2 text-muted-foreground">
                    Revocar accesos temporales que ya no hacen falta (repos, herramientas, cuentas
                    compartidas)
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Personas</td>
                  <td className="py-2 text-muted-foreground">
                    Liberadas formalmente para el siguiente proyecto, no “a medias” en dos a la vez
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Archivo</td>
                  <td className="py-2 text-muted-foreground">
                    El proyecto se mueve a un estado “cerrado” claro, no queda como “en curso”
                    fantasma en el portafolio
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "La retrospectiva de cierre (distinta de la de sprint)",
        body: (
          <>
            <p>
              Si el equipo ya usa{" "}
              <Link to="/blogs/retrospectivas-formatos" className="underline underline-offset-2">
                retrospectivas
              </Link>{" "}
              de sprint, la de cierre de proyecto no es más de lo mismo a otra escala: mira el
              proyecto completo, no una iteración. Tres preguntas alcanzan:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>¿Qué entregamos que valió la pena, más allá de si llegó a tiempo?</li>
              <li>¿Qué decisión temprana nos hubiera ahorrado más tiempo si la sabíamos antes?</li>
              <li>
                ¿Qué del proceso repetiríamos igual en el próximo proyecto, y qué cambiaríamos?
              </li>
            </ol>
            <p>
              Documentá las respuestas en un lugar donde el próximo proyecto similar las
              encuentre — si quedan solo en la cabeza de quien estuvo, el aprendizaje se pierde con
              la rotación del equipo.
            </p>
          </>
        ),
      },
      {
        heading: "Archivar y liberar recursos",
        body: (
          <>
            <p>
              Un proyecto “cerrado” de palabra pero “en curso” en el tablero sigue consumiendo
              atención administrativa: aparece en reportes, confunde el conteo de portafolio activo
              y a veces sigue recibiendo pedidos tardíos de cambios menores. Cerrarlo formalmente
              en el sistema —no solo en la conversación— es lo que realmente libera capacidad para
              el siguiente frente.
            </p>
          </>
        ),
      },
      {
        heading: "Comunicar el cierre (interno y con el cliente)",
        body: (
          <>
            <p>
              Un mensaje de cierre corto, a ambas puntas, evita ambigüedad sobre si el proyecto
              sigue “técnicamente abierto”:
            </p>
            <p className="rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              “Damos por cerrado [proyecto] al [fecha]. Entregables: [lista]. Pendientes fuera de
              alcance quedan en [backlog/próximo proyecto]. Cualquier pedido nuevo a partir de hoy
              se evalúa como proyecto o mejora aparte.”
            </p>
            <p>
              Esa última línea es la que más ahorra fricción: sin ella, el cierre se diluye con
              pedidos “chiquitos” que reabren el proyecto de facto sin nunca decidirlo
              explícitamente.
            </p>
          </>
        ),
      },
      {
        heading: "Qué pasa si el proyecto se cierra “a medias”",
        body: (
          <>
            <p>
              No todo cierre es un éxito completo — a veces se cierra con alcance recortado o
              insatisfacción parcial del cliente. Igual conviene cerrarlo formalmente en vez de
              dejarlo indefinido:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Documentá explícitamente qué quedó afuera y por qué — protege al equipo de que se
                interprete como olvido en vez de decisión.
              </li>
              <li>
                Si hubo riesgos que se materializaron, dejalo anotado como insumo para el próximo
                proyecto — ver{" "}
                <Link
                  to="/blogs/gestion-de-riesgos-simple"
                  className="underline underline-offset-2"
                >
                  gestión de riesgos para equipos pequeños
                </Link>
                .
              </li>
              <li>
                Separá el cierre administrativo (facturación, accesos) del cierre emocional del
                equipo — el primero no debería esperar al segundo.
              </li>
            </ul>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo cerrar un proyecto correctamente",
      steps: [
        {
          name: "Verificar entregables y aprobación formal",
          text: "Confirmá que todo lo comprometido está entregado y que hay una aceptación explícita, no un silencio interpretado como \"ok\".",
        },
        {
          name: "Cerrar la facturación",
          text: "Último hito facturado y cobrado, o con fecha concreta de cobro. No dejarlo \"para después\".",
        },
        {
          name: "Hacer la retrospectiva de cierre",
          text: "Tres preguntas: qué valió la pena, qué decisión temprana hubiera ahorrado tiempo, qué repetiríamos igual.",
        },
        {
          name: "Revocar accesos y documentar decisiones clave",
          text: "Cerrá cuentas y repos temporales; dejá por escrito el porqué de las decisiones grandes.",
        },
        {
          name: "Comunicar el cierre formal y archivar",
          text: "Mensaje corto a equipo y cliente, y mover el proyecto a estado \"cerrado\" real en el sistema, no solo de palabra.",
        },
      ],
    },
    faq: [
      {
        question: "¿Cuánto tiempo debería llevar cerrar un proyecto chico?",
        answer:
          "Con el checklist a mano, entre 1 y 3 horas para un proyecto chico o mediano. El costo real no es el tiempo del cierre, es el de no hacerlo y pagarlo después en confusión o facturación olvidada.",
      },
      {
        question: "¿Hace falta cierre formal en proyectos internos, sin cliente externo?",
        answer:
          "Sí, aunque más liviano: la parte de facturación desaparece, pero documentación, retro y liberación de accesos y personas siguen aplicando igual.",
      },
      {
        question: "¿Qué hago si el cliente no responde para dar la aprobación final?",
        answer:
          "Definí una fecha límite razonable en el mensaje de cierre (\"si no hay objeciones antes del [fecha], damos el proyecto por cerrado\") en vez de dejarlo indefinidamente abierto esperando una respuesta.",
      },
      {
        question: "¿La retrospectiva de cierre reemplaza a las retrospectivas de sprint?",
        answer:
          "No, son complementarias: la de sprint ajusta el proceso semana a semana; la de cierre mira el proyecto completo y alimenta decisiones para el próximo proyecto similar, no para la próxima iteración.",
      },
    ],
  },
};
