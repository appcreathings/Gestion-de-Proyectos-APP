import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "programa-organizar-tareas",
  title: "Programa para organizar tareas: 7 criterios que importan",
  excerpt:
    "Un programa para organizar tareas se elige por captura, dueño, fecha y visibilidad — no por el recuento de vistas. Siete criterios y cómo aplicarlos hoy.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-08-28",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "software-gestion-proyectos",
  related: [
    "software-gestion-proyectos",
    "app-gestion-tareas",
    "como-elegir-software-gestion-proyectos",
  ],
  seo: {
    title: "Programa para organizar tareas: 7 criterios | Hito",
    description:
      "Programa para organizar tareas: 7 criterios que importan (captura, dueño, fecha, tablero, techos, datos, costo) sin rankings comprados.",
    ogImageAlt: "Siete criterios para elegir un programa para organizar tareas.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> un <strong>programa para organizar tareas</strong> se
        elige por siete criterios —captura, dueño, fecha, tablero o lista, techos, dónde viven
        los datos y costo a 12 meses—, no por el recuento de vistas. Si buscas “programa” y no
        “SaaS”, lo que te importa es que el trabajo quepa sin comprarte un ranking.
      </>
    ),
    sections: [
      {
        heading: "No buscas un ranking: buscas un programa que organice",
        body: (
          <>
            <p>
              Quien escribe “programa para organizar tareas” casi nunca está comparando suites
              empresariales. Está en un taller, un estudio, una oficina de seis personas o en su
              propia computadora, y quiere algo que se abra, capture el trabajo y no se lleve
              los datos. “Programa” aquí significa herramienta que usas, no plataforma que te
              usa.
            </p>
            <p>
              Los listicles de “las 15 mejores apps 2026” no contestan esa búsqueda. Ordenan
              logos, recuentan vistas y empujan el producto de quien paga la posición. Tú
              necesitas otra pregunta: ¿este programa deja entrar una tarea en diez segundos,
              con un dueño y una fecha, sin que en noventa días se acabe el plan o se vaya el
              archivo a un servidor que no controlas?
            </p>
            <p>
              Eso se parece más a elegir un destornillador que a elegir un “sistema operativo
              del trabajo”. Si más adelante el objeto deja de ser la tarea y pasa a ser un
              proyecto con alcance y dependencias, el mapa está en{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos
              </Link>
              . Aquí el recorte es más chico: organizar tareas, con criterios que puedes
              aplicar esta tarde.
            </p>
          </>
        ),
      },
      {
        heading: "Los 7 criterios que importan",
        body: (
          <>
            <p>
              Puntúa cada criterio 0 (no lo hace), 1 (lo hace con fricción) o 2 (lo hace sin
              pensarlo). Suma. No hace falta una hoja sofisticada: siete números y una
              decisión. El detalle de captura, dueño y tablero —el umbral entre lista y equipo—
              está en{" "}
              <Link to="/blogs/app-gestion-tareas" className="underline underline-offset-2">
                app de gestión de tareas
              </Link>
              ; esta tabla es el filtro de compra, no la guía de uso.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Criterio</th>
                  <th className="py-2 pr-4 font-semibold">Pregunta que responde</th>
                  <th className="py-2 font-semibold">Cómo medirlo en 5 minutos</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Captura</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Puedo anotar una tarea en diez segundos, sin un formulario de once
                    campos?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Cronómetro. Crea tres ítems reales (“llamar a López”, “enviar factura”,
                    “revisar plano”). Si tardas más de un minuto en el primero, puntúa 0.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Dueño</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Queda un nombre, no un grupo ni un “sin asignar” eterno?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Asigna las tres tareas a personas distintas. Si el campo no existe o solo
                    admite “equipo”, 0.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Fecha</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Se ve lo que vence esta semana sin exportar a un calendario ajeno?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Pon vencimiento a las tres y filtra “esta semana”. Si no hay filtro ni
                    vista, 0.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Tablero o lista</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Puedo ver el mismo trabajo como lista y como tablero sin duplicarlo?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Mueve cinco ítems entre columnas o entre vistas. Si hay que copiarlos a
                    otro lado, 0.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Techos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Qué se acaba primero: asientos, tableros, automatizaciones o espacio?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Lee el plan gratuito o el más barato. Anota el primer límite que tu equipo
                    va a pegar en 90 días.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Dónde viven los datos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Carpeta en tu equipo, servidor propio o nube del proveedor?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Intenta exportar o localizar el archivo. Si “exportar” es un PDF truncado
                    o no existe, el dato no es tuyo.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Costo a 12 meses</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    ¿Cuánto sale de verdad con la gente que ya tienes, no con el precio de
                    lista de un asiento?
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Asientos × 12, más mínimo de plan, más el extra que desbloquea
                    automatizaciones o invitados. El número anual, no el mensual.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Un 10 o más, con techos y datos en 1 o 2, es candidato. Un 12 con techos en 0 es
              una trampa de 90 días: entra fácil y te empuja a pagar cuando el equipo ya
              depende. Un 8 brillante en vistas y pobre en captura no organiza nada: organiza
              la demostración.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo aplicarlos en 30 minutos",
        body: (
          <>
            <p>
              No pruebes ocho programas. Prueba dos, con trabajo real, en media hora. El
              checklist largo de compra de suites está en{" "}
              <Link
                to="/blogs/como-elegir-software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                cómo elegir software de gestión de proyectos
              </Link>
              ; este recorte cabe en un café.
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Minutos 0–5: elige dos, no diez.</strong> Uno que ya usa alguien del
                equipo y uno que cumpla tu restricción dura (datos locales, sin asientos, o
                precio cerrado). El resto de la lista se descarta hoy.
              </li>
              <li>
                <strong>Minutos 5–20: carga trabajo de verdad.</strong> Cinco tareas de esta
                semana, con dueño y fecha, más una recurrente (el informe del viernes, la
                factura del 5). No uses “tarea de prueba 1”. El programa se juzga con el
                trabajo que ya tienes, no con el tutorial.
              </li>
              <li>
                <strong>Minutos 20–25: techos y datos.</strong> Lee el plan y ubica el archivo
                o el botón de exportar. Anota el primer límite y si el export es un archivo
                útil o un PDF de marketing.
              </li>
              <li>
                <strong>Minutos 25–30: costo a 12 meses y suma.</strong> Multiplica asientos
                (o el mínimo de plan) por doce. Puntúa los siete criterios. Elige el que sume
                más <em>sin</em> un 0 en captura ni en datos, salvo que los datos no te
                importen — y entonces dilo en voz alta.
              </li>
            </ol>
            <p>
              Si al minuto 20 sigues configurando campos personalizados, ese programa perdió
              captura. Ciérralo. La media hora es el techo de la prueba, no el piso.
            </p>
          </>
        ),
      },
      {
        heading: "Lo que no entra en la tabla",
        body: (
          <>
            <p>
              Hay criterios que los rankings hinchan y que no predicen si vas a organizar
              tareas la semana que viene:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>El recuento de vistas.</strong> Gantt, carga, mapa mental, “todo
                vista”. Si el trabajo es una cola de tareas, una lista y un tablero alcanzan.
                Las demás se pagan en atención.
              </li>
              <li>
                <strong>La IA de la ficha de producto.</strong> Un resumen automático de una
                tarjeta vacía no organiza. Si hay asistente, que sea opcional y con tu clave,
                no un motivo de compra.
              </li>
              <li>
                <strong>“El mejor de 2026”.</strong> Esa frase no es un criterio. Es un anuncio
                con fecha.
              </li>
              <li>
                <strong>El color del tablero y el marketplace.</strong> Stickers no asignan
                dueño. Un plugin de clima no cierra la factura del 5.
              </li>
            </ul>
            <p>
              Puedes amar una interfaz y aun así puntuarla 6. El programa que organizó el
              trabajo es el que sumó en captura, dueño y fecha, aunque sea más feo en la
              captura de pantalla.
            </p>
          </>
        ),
      },
      {
        heading: "Un caso: seis personas y el Gantt que nadie abre",
        body: (
          <>
            <p>
              Un taller de comunicación, seis personas, tres clientes a la vez. Eligieron un
              programa porque el ranking destacaba el Gantt y las “200 automatizaciones”.
              Pagaron ocho asientos (el plan mínimo). La captura era un formulario de siete
              campos, así que las tareas reales siguieron en WhatsApp. El Gantt se abrió en
              la capacitación y no se volvió a tocar. A los cuatro meses el techo de
              automatizaciones del plan barato se acabó y el export era un CSV incompleto.
            </p>
            <p>
              Con la tabla, ese programa habría sacado 2 en captura, 2 en dueño, 1 en fecha, 2
              en tablero, 0 en techos, 0 en datos y 0 en costo a 12 meses: 7, con tres ceros
              caros. Un programa más chato —lista + tablero, dueño, fecha, archivo exportable,
              precio cerrado o local— habría ganado sin debate. No porque fuera “mejor
              software”. Porque organizaba tareas.
            </p>
            <p>
              La lección no es “nunca Gantt”. Es: no compres la vista que no vas a mantener, ni
              el asiento que no vas a usar, ni el dato que no puedes llevarte. Los siete
              criterios caben en media hora; un ranking no te las ahorra.
            </p>
            <p>
              Si tu restricción dura es que los datos vivan en una carpeta tuya, sin cuenta ni
              asientos,{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                Hito
              </a>{" "}
              es un programa local-first: JSON en tu disco, kanban, checklists y
              automatizaciones, para 1–15 personas, con IA opcional usando tu API key. Puntúalo
              con la misma tabla, no con esta frase.
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
      name: "Cómo aplicar los 7 criterios en 30 minutos",
      steps: [
        {
          name: "Quédate con dos programas, no con diez",
          text: "Uno que ya use alguien del equipo y uno que cumpla tu restricción dura (datos, asientos o precio). Descarta el resto hoy.",
        },
        {
          name: "Carga cinco tareas reales con dueño y fecha",
          text: "Más una recurrente. Cronometra la captura. Si el primer ítem tarda más de un minuto, ese programa ya perdió el criterio de captura.",
        },
        {
          name: "Revisa techos y dónde viven los datos",
          text: "Lee el plan más barato: asientos, tableros, automatizaciones, espacio. Intenta exportar. Anota el primer límite de 90 días y si el archivo de salida es útil.",
        },
        {
          name: "Calcula el costo a 12 meses y suma",
          text: "Asientos o mínimo de plan × 12. Puntúa 0–2 cada criterio. Elige el que sume más sin un 0 en captura ni en datos, salvo que los datos no te importen y lo hayas decidido explícitamente.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué es un programa para organizar tareas?",
        answer:
          "Es una herramienta para capturar, asignar y seguir ítems de trabajo —lista o tablero— sin que el estado viva en el chat. Quien busca “programa” suele querer algo que se abre y se usa, no una suite vendida como SaaS.",
      },
      {
        question: "¿Cuáles son los criterios para elegir un programa de tareas?",
        answer:
          "Siete: captura, dueño, fecha, tablero o lista, techos del plan, dónde viven los datos y costo real a 12 meses. El recuento de vistas, la IA de marketing y los rankings con fecha no predicen si vas a organizar el trabajo.",
      },
      {
        question: "¿Programa, app y software de tareas son lo mismo?",
        answer:
          "En la práctica, sí: buscan organizar ítems. Cambia el lenguaje de quien busca. “Programa” suele ser un equipo chico o una persona que no habla de SaaS; “software de gestión de proyectos” aparece cuando el objeto ya es un proyecto con alcance.",
      },
      {
        question: "¿Importa dónde viven los datos al organizar tareas?",
        answer:
          "Sí, el día que quieras salir. Si el export es un PDF truncado o no existe, el trabajo quedó en el proveedor. Una carpeta, un servidor propio o un archivo útil valen más que una vista que no puedes llevarte.",
      },
      {
        question: "¿Cómo calcular el costo a 12 meses de un programa de tareas?",
        answer:
          "Multiplica asientos (o el mínimo de plan) por doce y suma lo que desbloquea automatizaciones, invitados o espacio. El precio de un asiento en la ficha miente; el anual con tu plantilla real no.",
      },
    ],
  },
};
