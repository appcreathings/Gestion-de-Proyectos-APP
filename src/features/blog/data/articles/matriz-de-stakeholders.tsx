import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "matriz-de-stakeholders",
  title: "Matriz de stakeholders: plantilla poder-interés con ejemplo",
  excerpt:
    "La matriz de stakeholders clasifica a los interesados en 4 cuadrantes según poder e interés. Plantilla con ejemplo, cómo llenarla en 30 minutos y qué hacer con cada cuadrante.",
  category: "plantillas",
  categoryLabel: "Plantillas",
  publishedAt: "2027-08-09",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "que-son-stakeholders",
  related: ["que-son-stakeholders", "matriz-raci", "plantillas-gestion-proyectos"],
  seo: {
    title: "Matriz de stakeholders: plantilla y ejemplo | Hito",
    description:
      "Matriz de stakeholders (poder-interés): plantilla de 4 cuadrantes con ejemplo, cómo llenarla en 30 minutos y la estrategia de comunicación para cada cuadrante.",
    ogImageAlt: "Matriz de stakeholders poder-interés con los 4 cuadrantes y ejemplos.",
  },
  content: {
    eyebrow: "Plantillas",
    intro: (
      <>
        <strong>En una línea:</strong> la <strong>matriz de stakeholders</strong> ordena a los
        interesados de un proyecto en 4 cuadrantes según su <strong>poder</strong> para cambiar el
        proyecto y su <strong>interés</strong> en el resultado. El output no es el mapa, es la
        dosis de comunicación correcta para cada persona — y se llena en media hora.
      </>
    ),
    sections: [
      {
        heading: "Qué es la matriz de stakeholders (poder-interés)",
        body: (
          <>
            <p>
              Es una grilla de 2×2: en el eje horizontal va el <strong>interés</strong> (cuánto le
              importa a esa persona el resultado del proyecto) y en el vertical el{" "}
              <strong>poder</strong> o influencia (cuánto puede cambiar el alcance, la fecha o el
              presupuesto). Cada stakeholder cae en un cuadrante, y cada cuadrante trae una
              estrategia predefinida. Es la herramienta más usada para planificar la comunicación
              de interesados porque traduce una lista de nombres en decisiones concretas de quién
              recibe qué, cuándo y por dónde.
            </p>
            <p>
              Su valor no está en la precisión científica —el poder y el interés se estiman, no se
              miden— sino en forzar dos preguntas que casi nunca se hacen en el arranque: ¿quién
              puede frenarnos y no lo estamos cuidando?, ¿a quién le estamos dedicando reuniones
              que no las necesita?
            </p>
          </>
        ),
      },
      {
        heading: "Los 4 cuadrantes y qué hacer con cada uno",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Cuadrante</th>
                  <th className="py-2 pr-4 font-semibold">Quiénes caen aquí</th>
                  <th className="py-2 font-semibold">Estrategia</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    Alto poder, alto interés
                    <br />
                    <span className="text-muted-foreground">“Gestionar de cerca”</span>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Patrocinador, cliente decisivo, jefe directo del proyecto
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Participación activa: reuniones regulares, decisiones en conjunto, cero
                    sorpresas
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    Alto poder, bajo interés
                    <br />
                    <span className="text-muted-foreground">“Mantener satisfecho”</span>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Dirección que financia sin involucrarse, auditoría, compliance
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Resúmenes breves en los hitos; chequear que nada les moleste. Nunca
                    sorprenderlos
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">
                    Bajo poder, alto interés
                    <br />
                    <span className="text-muted-foreground">“Mantener informado”</span>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Equipo del proyecto, usuarios finales, operación
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Comunicación frecuente y canal abierto; su detalle detecta problemas temprano
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">
                    Bajo poder, bajo interés
                    <br />
                    <span className="text-muted-foreground">“Monitorear”</span>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Áreas periféricas, proveedores secundarios
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Aviso en los hitos grandes; revisar si alguien cambia de cuadrante
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La energía del equipo es finita: los cuadrantes de arriba consumen la mayor parte.
              El error opuesto —tratar a todos como “gestionar de cerca”— produce reuniones
              infinitas y una dirección que recibe ruido diario hasta que deja de leer.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo: implementación de un sistema en 5 stakeholders",
        body: (
          <>
            <p>
              Proyecto: implementar un sistema de gestión en una empresa mediana. Cinco
              stakeholders, cuatro cuadrantes:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Stakeholder</th>
                  <th className="py-2 pr-4 font-semibold">Poder / Interés</th>
                  <th className="py-2 font-semibold">Trato concreto</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Gerenta general (financia)</td>
                  <td className="py-2 pr-4 text-muted-foreground">Alto / Medio</td>
                  <td className="py-2 text-muted-foreground">
                    Satisfecha: resumen de 5 líneas en cada hito y una reunión mensual de 20
                    minutos
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Directora de operaciones (dueña)</td>
                  <td className="py-2 pr-4 text-muted-foreground">Alto / Alto</td>
                  <td className="py-2 text-muted-foreground">
                    De cerca: comité semanal, aprueba cambios de alcance, accede al tablero
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Jefa de contabilidad (usuaria clave)</td>
                  <td className="py-2 pr-4 text-muted-foreground">Bajo / Alto</td>
                  <td className="py-2 text-muted-foreground">
                    Informada: demo quincenal, canal directo para reportar fricciones
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Auditoría interna</td>
                  <td className="py-2 pr-4 text-muted-foreground">Alto / Bajo</td>
                  <td className="py-2 text-muted-foreground">
                    Satisfecha: entregables de cumplimiento en cada fase, sin involucrarla en lo
                    operativo
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Proveedor de capacitación</td>
                  <td className="py-2 pr-4 text-muted-foreground">Bajo / Bajo</td>
                  <td className="py-2 text-muted-foreground">
                    Monitoreado: brief en el hito de lanzamiento; revisar antes de contratar
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Nota el movimiento: la gerenta financia pero no opera, así que vive en “satisfecha”
              aunque su poder sea alto. Clasificar por cargo y no por comportamiento es el error
              más común de esta matriz.
            </p>
          </>
        ),
      },
      {
        heading: "De la matriz al plan de comunicación",
        body: (
          <>
            <p>
              La matriz termina de ser útil cuando cada fila produce una línea en el plan de
              comunicación: qué recibe, cada cuánto, por qué canal y quién la atiende. El
              cuadrante “de cerca” alimenta las reuniones semanales; “satisfecho” alimenta el{" "}
              <Link
                to="/blogs/informe-de-estado-semanal"
                className="underline underline-offset-2"
              >
                informe de estado
              </Link>
              ; “informado” alimenta demos y canales abiertos; “monitorear” alimenta avisos en
              hitos.
            </p>
            <p>
              Y para que nadie discuta de nuevo quién aprueba qué, la matriz se complementa con la{" "}
              <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                matriz RACI
              </Link>
              : la matriz de stakeholders decide la comunicación; la RACI decide los roles. Son
              herramientas distintas para la misma gente.
            </p>
          </>
        ),
      },
      {
        heading: "Errores comunes al llenarla",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Poner a todos en “gestionar de cerca”.</strong> Si todo es prioritario,
                nada lo es. Forza la pregunta: ¿a quién sacaría de esa reunión si tuviera que
                recortar?
              </li>
              <li>
                <strong>Clasificar por jerarquía, no por comportamiento.</strong> El poder de
                bloqueo no siempre coincide con el organigrama: la persona que firma el contrato
                puede pesar menos que la que no usa el sistema que entregas.
              </li>
              <li>
                <strong>Llenarla una vez y archivarla.</strong> El interés y el poder se mueven:
                quien empezó “monitoreando” puede volverse crítico cuando el proyecto toca su
                área. Se revisa en cada hito, no se enmarca.
              </li>
              <li>
                <strong>Hacerla sola el PM.</strong> El equipo detecta stakeholders invisibles
                (el usuario que nunca aparece en la lista pero decide la adopción). Se llena en
                una sesión conjunta de 30 minutos al arrancar, junto al resto de las{" "}
                <Link
                  to="/blogs/plantillas-gestion-proyectos"
                  className="underline underline-offset-2"
                >
                  plantillas del proyecto
                </Link>
                .
              </li>
            </ul>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo llenar una matriz de stakeholders en 30 minutos",
      steps: [
        {
          name: "Lista todos los stakeholders",
          text: "En una sesión con el equipo, nombra a todos los que pueden afectar el proyecto o resultan afectados. Meta: entre 8 y 15 nombres, sin filtrar por jerarquía.",
        },
        {
          name: "Estima poder e interés de cada uno",
          text: "Poder: ¿puede cambiar alcance, fecha o presupuesto con una decisión? Interés: ¿cuánto le importa el resultado? Se discute en alto/medio/bajo hasta consenso; la discusión es la mitad del valor.",
        },
        {
          name: "Ubica cada nombre en su cuadrante",
          text: "Gestionar de cerca (alto/alto), mantener satisfecho (alto/bajo), mantener informado (bajo/alto), monitorear (bajo/bajo).",
        },
        {
          name: "Convierte cada cuadrante en acciones de comunicación",
          text: "Qué recibe, cada cuánto, por qué canal y quién atiende. El cuadrante satisfecho recibe resúmenes de hito; el de cerca, reuniones semanales.",
        },
        {
          name: "Agenda la revisión en cada hito",
          text: "El poder y el interés se mueven con el proyecto. En cada hito, 10 minutos: ¿alguien cambió de cuadrante? ¿Hay un stakeholder nuevo?",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es una matriz de stakeholders?",
        answer:
          "Es una herramienta de 4 cuadrantes que clasifica a los interesados de un proyecto según su poder (capacidad de cambiar el proyecto) y su interés (cuánto les importa el resultado). Cada cuadrante define una estrategia de comunicación: gestionar de cerca, mantener satisfecho, mantener informado o monitorear.",
      },
      {
        question: "¿Cómo se hace una matriz de stakeholders?",
        answer:
          "Se listan todos los interesados (idealmente 8-15), se estima el poder y el interés de cada uno hasta consenso, se ubican en los 4 cuadrantes y se convierte cada cuadrante en acciones concretas de comunicación: qué recibe cada grupo, cada cuánto y por qué canal. Una sesión conjunta de 30 minutos al arrancar el proyecto alcanza.",
      },
      {
        question: "¿Qué es el modelo poder-interés?",
        answer:
          "Es el criterio de clasificación más usado para matrices de stakeholders: el eje vertical mide el poder de la persona para afectar el proyecto y el horizontal su interés en el resultado. El cruce define la estrategia: alto poder y alto interés se gestiona de cerca; alto poder y bajo interés se mantiene satisfecho; bajo poder y alto interés, informado; ambos bajos, se monitorea.",
      },
      {
        question: "¿Dónde pongo a alguien con alto poder e interés medio?",
        answer:
          "En el cuadrante más protector disponible: si puede cambiar el proyecto, trátalo como “gestionar de cerca” o como mínimo “mantener satisfecho”. Ante la duda entre dos cuadrantes, elige el de mayor atención; el costo de cuidar de más a un stakeholder es menor que el de descubrir tarde que podía frenarlo.",
      },
      {
        question: "¿Cada cuánto se actualiza la matriz de stakeholders?",
        answer:
          "En cada hito del proyecto, o cuando cambie algo relevante (nueva dirección, cambio de alcance, proveedor nuevo). El poder y el interés no son fijos: quien empezó siendo periférico puede volverse crítico cuando el proyecto llega a su área, y la matriz desactualizada deja de proteger.",
      },
    ],
  },
};
