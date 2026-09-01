import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "como-elegir-software-gestion-proyectos",
  title: "Cómo elegir un software de gestión de proyectos (checklist)",
  excerpt:
    "Checklist de 6 pasos para elegir software de gestión de proyectos: mapear el flujo real, un tablero piloto, techos a 90 días, datos, precio a 12 meses y prueba con trabajo de verdad.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-08-25",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "software-gestion-proyectos",
  related: [
    "software-gestion-proyectos",
    "software-gestion-proyectos-pymes",
    "herramientas-gestion-proyectos-gratis",
  ],
  seo: {
    title: "Cómo elegir software de gestión de proyectos | Hito",
    description:
      "Cómo elegir un software de gestión de proyectos en 6 pasos: flujo real, piloto, techos a 90 días, datos, costo a 12 meses y prueba con trabajo real.",
    ogImageAlt: "Checklist de 6 pasos para elegir software de gestión de proyectos.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong>{" "}
        <strong>cómo elegir un software de gestión de proyectos</strong> no es comparar
        rankings: es mapear tu flujo, probar un tablero piloto y calcular techos y precio a 12
        meses. Esta checklist de 6 pasos descarta por señal concreta —adjuntos, asientos,
        datos— no por el recuento de vistas que nadie abre.
      </>
    ),
    sections: [
      {
        heading:
          "Cómo elegir un software de gestión de proyectos sin partir por el ranking",
        body: (
          <>
            <p>
              El listicle de “mejores tools 2026” ordena por logo, no por el techo que vas a
              pegar. Elegir así produce una cuenta que el equipo abandona a las tres semanas, o
              un upgrade que no estaba en el presupuesto. El criterio útil es otro: qué dolor
              tienes hoy y qué límite te va a frenar a los 90 días.
            </p>
            <p>
              Esta guía es el how-to. El mapa de tipos (lista, kanban, Gantt, all-in-one,
              local-first) y la tabla de ocho herramientas está en el pilar{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos
              </Link>
              . Acá no se vuelve a puntuar marcas. Se arma un filtro de seis pasos que puedes
              correr con una agencia de 8 o con un freelance de 3 clientes.
            </p>
            <p>
              Si todavía no sabes si necesitas un proyecto o te alcanza una lista, para y lee{" "}
              <Link
                to="/blogs/lista-tareas-vs-gestion-proyectos"
                className="underline underline-offset-2"
              >
                lista de tareas vs gestión de proyectos
              </Link>
              . Elegir software de proyectos para una cola personal es el error inverso: pagas
              asientos para tachar “llamar al cliente”.
            </p>
          </>
        ),
      },
      {
        heading: "Paso 1: mapea el flujo real, no el de la demo",
        body: (
          <>
            <p>
              Antes de crear la cuenta, escribe cómo viaja el trabajo hoy. Cuatro a seis
              estados, con los nombres que el equipo ya usa. Si no cabe en una servilleta, el
              problema no es la tool: es que el proceso vive en la cabeza de una persona.
            </p>
            <p>
              Una agencia de 8 suele verse así: Brief → Producción → Revisión interna → Revisión
              cliente → Entrega. Un freelance con 3 clientes: Inbox → Haciendo → Espera de
              cliente → Cobrado. Un equipo de producto chico: Backlog listo → En curso → Code
              review → Hecho. Copia eso, no las columnas “New / In progress / Done” del
              template.
            </p>
            <p>
              Marca también quién edita el tablero cada día (no quién “tiene acceso”). El
              número de editores predice el techo de asientos. El número de clientes o líneas
              de trabajo predice el techo de tableros. El tipo de archivo que adjuntas (PDF de
              20 MB, capturas, briefs) predice el techo de storage. Sin esos tres números, la
              demo es teatro.
            </p>
          </>
        ),
      },
      {
        heading: "Paso 2: un tablero piloto, no ocho herramientas a la vez",
        body: (
          <>
            <p>
              Elige un proyecto real —un cliente, un lanzamiento, las operaciones de dos
              semanas— y ábrelo en una sola tool. Probar Asana, Trello y ClickUp en paralelo
              con el mismo backlog no informa: cansa, y gana la interfaz más linda, no la que
              el equipo actualiza.
            </p>
            <p>
              El piloto tiene reglas. Un tablero. Las columnas del paso 1. Dueño por tarjeta.
              Nada de importar el archivo de 2019. Si en diez minutos un diseñador no entiende
              dónde poner una corrección del cliente, las columnas están mal. Si entiende y no
              mueve, el hábito está mal. Son diagnósticos distintos; no los mezcles.
            </p>
            <p>
              Cierra el Excel (o la lista) de ese proyecto mientras dura el piloto. Dos fuentes
              de verdad garantizan que la tool “no se usa”. El resto del portafolio puede
              seguir donde está: el piloto no es una migración.
            </p>
          </>
        ),
      },
      {
        heading:
          "Tabla de descarte: si el dolor es adjuntos, no elijas por número de vistas",
        body: (
          <>
            <p>
              Cada fila es una señal de salida, no un ranking. Cruza tu dolor con el techo que
              importa; ignora el recuento de features. Los números de planes free, actualizados
              a 2026, están en{" "}
              <Link
                to="/blogs/herramientas-gestion-proyectos-gratis"
                className="underline underline-offset-2"
              >
                herramientas gratis de gestión de proyectos
              </Link>
              .
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Si el dolor es…</th>
                  <th className="py-2 pr-4 font-semibold">No elijas por…</th>
                  <th className="py-2 font-semibold">Mira esto</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Adjuntos, PDFs, capturas</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Número de vistas o un Gantt de demo
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Storage: ClickUp free ~60 MB; Trello 10 MB por adjunto; Notion 5 MB por
                    archivo
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Varias personas editando</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El logo o “gratis para siempre”
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Asientos: Asana free = 2; Jira free ≤ 10; monday.com mínimo 3 pagos
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Muchos clientes o líneas de trabajo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Tarjetas ilimitadas en un solo tablero
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Techo de tableros: Trello 10 por workspace; ClickUp recorta spaces en free
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Datos de clientes que no pueden salir</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Integraciones o un marketplace
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Dónde viven los datos: nube del vendor, tu servidor, o archivos en disco
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Precio que se come el margen</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El plan mensual “desde X USD”
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Asientos × 12 + add-ons (IA, automatizaciones, storage)
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">El equipo no actualiza nada</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Una suite all-in-one “para crecer”
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Curva: un tablero de 4 columnas gana a 15 vistas que nadie configura
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Dependencias que mueven la fecha de fin</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Un kanban porque “es más ágil”
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Gantt real (OpenProject u otro con predecesoras), no barras pintadas en
                    Excel
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Ejemplo: una agencia de 8 que se queja de “no hay visibilidad” y elige ClickUp
              por las 15 vistas, cuando el dolor real son PDFs de clientes. A la tercera semana
              el storage free se acabó y el tablero sigue sin dueños. El dolor era adjuntos y
              hábito, no vistas.
            </p>
          </>
        ),
      },
      {
        heading: "Pasos 3 a 5: techos a 90 días, dónde viven los datos y precio a 12 meses",
        body: (
          <>
            <p>
              Con el flujo escrito y el piloto en marcha, haz tres cuentas antes de enamorar al
              equipo de la interfaz. Las pymes tropiezan acá más que en la demo; el desglose
              por tamaño está en{" "}
              <Link
                to="/blogs/software-gestion-proyectos-pymes"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos para pymes
              </Link>
              .
            </p>
            <p>
              <strong>Techos a 90 días.</strong> Proyecta personas que editan, tableros que vas
              a abrir y megas que vas a subir si el piloto se multiplica por los proyectos del
              trimestre. Si a los 90 días eres 5 editores, Asana free ya no existe. Si eres 12
              tableros, Trello free tampoco. Si cargas briefs en PDF, 60 MB no son “para
              siempre”.
            </p>
            <p>
              <strong>Dónde viven los datos.</strong> Nube del vendor, tu servidor o disco
              local. Si el cliente es un estudio jurídico, una clínica o cualquiera que no
              quiere el expediente en un SaaS, el bloque cloud entero sale de la shortlist —
              aunque la demo sea impecable. Open source autoalojado implica ops: backups,
              parches, alguien que responde cuando se cae. Local-first implica que el sync
              entre personas lo armas tú, no un servidor que resuelve el conflicto.
            </p>
            <p>
              <strong>Precio a 12 meses.</strong> Asientos × 12, más IA, más storage, más el
              piso de asientos (monday.com no te vende “uno para probar”). Un equipo de 8 a 12
              USD/usuario/mes no cuesta 12 USD: cuesta 1.152 USD al año, antes de add-ons. Si
              ese número duele, no “empezamos en free y vemos”: el free es el gancho cuyo techo
              ya calculaste.
            </p>
          </>
        ),
      },
      {
        heading: "Paso 6: prueba de 14 días con trabajo real",
        body: (
          <>
            <p>
              El piloto del paso 2 se convierte en la prueba: catorce días del proyecto real,
              sin Excel en paralelo, con el flujo del paso 1. El chat deja de ser el backlog de
              ese cliente. Cada tarjeta tiene un dueño. Al final de cada día, el tablero tiene
              que mentir menos que el grupo de WhatsApp.
            </p>
            <p>
              Tres preguntas el día 14, por escrito:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                ¿Alguien más que quien lo configuró actualizó el tablero sin que se lo pidieran?
              </li>
              <li>
                ¿El techo (asientos, tableros, storage) sigue holgado si multiplicas por 90
                días?
              </li>
              <li>
                ¿Salió un informe de 8 líneas del tablero, o hubo que reconstruir el avance de
                memoria?
              </li>
            </ul>
            <p>
              Si las tres son sí, quédate. Si la primera es no, el problema es hábito o
              columnas, no la marca: no cambies de tool todavía. Si la segunda es no, cambia de
              plan o de tipo antes de cargar el resto del portafolio. Si la tercera es no, el
              tablero no es la fuente de verdad y el piloto falló.
            </p>
            <p>
              Cuando el filtro de datos del paso 4 dice “en disco, sin cuenta ni asiento”,{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                Hito
              </a>{" "}
              entra como opción local-first: carpeta + JSON, kanban, checklists y PWA offline,
              con IA opcional usando tu API key. No gana collab en la nube, ni SSO, ni un Jira
              de ingeniería grande, ni las 15 vistas de ClickUp. Está pensado para 1–15
              personas. Si ese no es tu caso, la checklist de arriba sigue valiendo con otra
              fila de la tabla.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo elegir un software de gestión de proyectos en 6 pasos",
      steps: [
        {
          name: "Mapea el flujo real",
          text: "Escribe 4–6 estados con los nombres que el equipo ya usa (brief, producción, espera de cliente, entrega). Cuenta quién edita cada día, cuántos tableros vas a necesitar y qué adjuntos cargas.",
        },
        {
          name: "Abre un tablero piloto",
          text: "Un proyecto real, una sola herramienta, las columnas del paso 1. No importes el archivo histórico y no pruebes ocho tools en paralelo. Cierra el Excel de ese proyecto mientras dura el piloto.",
        },
        {
          name: "Verifica los techos a 90 días",
          text: "Multiplica editores, tableros y storage del piloto por el trimestre. Cruza el resultado con el plan: Asana free = 2 usuarios, Trello = 10 tableros, ClickUp ~60 MB, Jira ≤ 10, monday.com mínimo 3 asientos pagos.",
        },
        {
          name: "Decide dónde viven los datos",
          text: "Nube del vendor, tu servidor o disco local. Si el expediente del cliente no puede salir del equipo, descarta el bloque cloud aunque la demo guste. Autoalojado implica ops; local-first implica que el sync lo armas tú.",
        },
        {
          name: "Calcula el precio a 12 meses",
          text: "Asientos × 12, más add-ons de IA, automatizaciones y storage. El plan “desde X USD al mes” miente: el número que importa es lo que pagas si el equipo no se achica.",
        },
        {
          name: "Prueba 14 días con trabajo real",
          text: "Todo el trabajo de ese proyecto entra en el tablero, con dueño por tarjeta. El día 14 pregunta si alguien más actualizó, si el techo sigue holgado y si el informe sale del tablero. Tres sí: quédate. Si no, cambia de tipo o de hábito, no de logo.",
        },
      ],
    },
    faq: [
      {
        question: "¿Cómo elegir un software de gestión de proyectos?",
        answer:
          "Mapea el flujo real, prueba un tablero piloto, revisa techos a 90 días, decide dónde viven los datos, calcula asientos × 12 y corre 14 días con trabajo de verdad. El ranking de vistas no predice adopción ni el primer límite que vas a pegar.",
      },
      {
        question: "¿Qué criterios usar para elegir software de gestión de proyectos?",
        answer:
          "Cinco: el flujo que ya usas, cuántas personas editan, el techo de tableros o storage a 90 días, si los datos pueden vivir en un servidor ajeno, y el costo a 12 meses. Un sexto, opcional: Gantt con dependencias solo si el atraso de una tarea mueve la fecha de fin.",
      },
      {
        question: "¿Cuánto tiempo hay que probar un software de gestión de proyectos?",
        answer:
          "Catorce días con un proyecto real y sin Excel en paralelo. Menos no alcanza para ver si alguien más que quien lo configuró actualiza el tablero; más de un mes suele ser una migración disfrazada, no una prueba.",
      },
      {
        question: "¿Cómo calcular el precio real de un software de gestión de proyectos?",
        answer:
          "Multiplica asientos por 12 meses y suma add-ons (IA, automatizaciones, storage) y el piso de asientos del vendor. Un equipo de 8 a 12 USD/usuario/mes son 1.152 USD al año antes de extras; el plan mensual “desde X” no es ese número.",
      },
      {
        question: "¿Qué techos del plan gratis debo revisar antes de elegir?",
        answer:
          "Asientos, tableros y storage: Asana free queda en 2 usuarios, Trello en 10 tableros, ClickUp en ~60 MB, Jira en 10 personas y monday.com no tiene free usable (mínimo 3 asientos pagos). Elige por el techo que vas a tocar primero, no por el que suena más lejos.",
      },
    ],
  },
};
