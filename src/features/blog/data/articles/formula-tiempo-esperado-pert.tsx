import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "formula-tiempo-esperado-pert",
  title: "Fórmula de tiempo esperado (PERT): estimar sin adivinar",
  excerpt:
    "La fórmula de tiempo esperado del PERT: TE = (O + 4M + P) / 6, con ejemplo numérico paso a paso, desviación estándar y cuándo conviene usarla (y cuándo es humo).",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-05",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "scrumban",
  related: [
    "scrumban",
    "como-estimar-tiempos-proyecto",
    "ruta-critica-proyecto",
  ],
  seo: {
    title: "Fórmula de tiempo esperado (PERT): estimar sin adivinar | Hito",
    description:
      "Fórmula de tiempo esperado del PERT: (O + 4M + P) / 6, con ejemplo numérico, desviación estándar y cuándo conviene usarla (y cuándo es humo).",
    ogImageAlt:
      "Fórmula PERT: tiempo esperado con estimación optimista, más probable y pesimista.",
  },
  content: {
    eyebrow: "Estimación",
    intro: (
      <>
        <strong>En una línea:</strong> la fórmula de tiempo esperado del PERT —TE = (O + 4M +
        P) / 6— convierte tres estimaciones (optimista, más probable y pesimista) en una fecha
        defendible con matemática en vez de optimismo. Aquí tienes el cálculo completo, la
        desviación estándar y cuándo conviene usarla de verdad (y cuándo es humo).
      </>
    ),
    sections: [
      {
        heading: "El problema de estimar con un solo número",
        body: (
          <>
            <p>
              Cuando le preguntas a alguien cuánto tarda una tarea, la respuesta es un número.
              Ese número arrastra dos sesgos conocidos: el optimismo (subestimamos lo que no
              hemos hecho antes) y el anclaje (la primera cifra mencionada contamina todas las
              demás). El resultado lo conoces: proyectos que «siempre» salen tarde aunque cada
              estimación individual sonaba razonable.
            </p>
            <p>
              La respuesta defensiva típica es inflar: «dilo por el doble». Pero el colchón
              tiene sus propios problemas: se nota, se negocia, y en tareas con riesgo real ni
              el doble alcanza. La tercera vía es la que formalizó el PERT en los años
              cincuenta para el programa Polaris: en vez de un número, pedir tres escenarios y
              combinarlos con una fórmula. El costo es pedir dos datos más; el beneficio es
              que la incertidumbre deja de estar escondida en el colchón y se vuelve visible.
            </p>
          </>
        ),
      },
      {
        heading: "La fórmula: TE = (O + 4M + P) / 6, término a término",
        body: (
          <>
            <p>
              La fórmula de tiempo esperado del PERT es:{" "}
              <strong>TE = (O + 4M + P) / 6</strong>. Donde <strong>O</strong> es la estimación
              optimista (todo sale bien a la primera), <strong>M</strong> es la más probable
              (una semana normal, interrupciones incluidas) y <strong>P</strong> es la
              pesimista (el escenario malo realista, no la catástrofe).
            </p>
            <p>
              El 4 que multiplica a M es el corazón del modelo: pesa cuatro veces el escenario
              típico porque, en la distribución que asume el PERT, es el que más se repite;
              los extremos corrigen por exceso de confianza y por riesgo. El 6 es solo la suma
              de los pesos (1 + 4 + 1). Nada más y nada menos: el resultado es un promedio
              ponderado donde lo probable manda y los extremos ajustan.
            </p>
            <p>
              La fórmula tiene una compañera que casi nadie usa y es la más útil: la
              desviación estándar, <strong>σ = (P − O) / 6</strong>. Mide la incertidumbre de
              la tarea: una σ pequeña dice que los tres escenarios coinciden y la estimación
              es firme; una σ grande avisa de que la tarea puede irse en cualquier dirección y
              merece atención antes que las demás.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo numérico completo: de la fórmula al calendario",
        body: (
          <>
            <p>
              Toma una tarea con O = 2 días, M = 4 días y P = 10 días (rehacer una pantalla que
              toca un módulo viejo, por ejemplo). El tiempo esperado es:
            </p>
            <p>
              TE = (2 + 4 × 4 + 10) / 6 = 28 / 6 ≈ <strong>4,67 días</strong>. Y su desviación
              estándar: σ = (10 − 2) / 6 ≈ <strong>1,33 días</strong>. Esa σ es alta a
              propósito: la brecha entre 2 y 10 días delata que nadie sabe bien cuánto duele el
              módulo viejo, y eso ya es información accionable. Ahora el mismo cálculo sobre un
              paquete de tres tareas:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Tarea</th>
                  <th className="py-2 pr-4 font-semibold">O</th>
                  <th className="py-2 pr-4 font-semibold">M</th>
                  <th className="py-2 pr-4 font-semibold">P</th>
                  <th className="py-2 pr-4 font-semibold">TE (días)</th>
                  <th className="py-2 font-semibold">σ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Rehacer pantalla de login
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">2</td>
                  <td className="py-2 pr-4 text-muted-foreground">4</td>
                  <td className="py-2 pr-4 text-muted-foreground">10</td>
                  <td className="py-2 pr-4 text-muted-foreground">4,67</td>
                  <td className="py-2 text-muted-foreground">1,33</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Migrar tabla de clientes</td>
                  <td className="py-2 pr-4 text-muted-foreground">1</td>
                  <td className="py-2 pr-4 text-muted-foreground">2</td>
                  <td className="py-2 pr-4 text-muted-foreground">3</td>
                  <td className="py-2 pr-4 text-muted-foreground">2,00</td>
                  <td className="py-2 text-muted-foreground">0,33</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">Integrar API de pagos</td>
                  <td className="py-2 pr-4 text-muted-foreground">3</td>
                  <td className="py-2 pr-4 text-muted-foreground">5</td>
                  <td className="py-2 pr-4 text-muted-foreground">9</td>
                  <td className="py-2 pr-4 text-muted-foreground">5,33</td>
                  <td className="py-2 text-muted-foreground">1,00</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-semibold">Total del paquete</td>
                  <td className="py-2 pr-4 text-muted-foreground">—</td>
                  <td className="py-2 pr-4 text-muted-foreground">—</td>
                  <td className="py-2 pr-4 text-muted-foreground">—</td>
                  <td className="py-2 pr-4 font-semibold">12,00</td>
                  <td className="py-2 font-semibold">1,70 (combinada)</td>
                </tr>
              </tbody>
            </table>
            <p>
              Dos detalles que evitan errores comunes. Primero: los TE sí se suman —el paquete
              espera 12 días—, pero las σ no: la incertidumbre del conjunto se calcula con
              raíz de la suma de cuadrados, √(1,33² + 0,33² + 1²) ≈ 1,7, así que un rango
              honesto para comprometerse es «12 días, con margen razonable de ±2». Segundo: si
              una sola tarea domina la σ total, esa es la que hay que partir en pedazos o
              investigar primero.
            </p>
          </>
        ),
      },
      {
        heading: "Cuándo sí usarla y cuándo es humo",
        body: (
          <>
            <p>
              La fórmula rinde donde la incertidumbre es real y el compromiso es externo:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Tareas de alto riesgo</strong>, las que tienen σ grande por definición:
                usar PERT solo en ellas es el mejor retorno por minuto invertido.
              </li>
              <li>
                <strong>Hitos con compromiso externo:</strong> una fecha prometida a un cliente
                o a la dirección merece más que una corazonada; el TE con su rango da algo que
                se puede defender en una reunión.
              </li>
              <li>
                <strong>Decisiones de comprar o posponer:</strong> si el TE de la alternativa
                interna duplica el plazo del proveedor, la discusión cambia de tema antes de
                gastar un peso.
              </li>
            </ul>
            <p>
              Y es humo cuando se aplica por disciplina en lugar de por utilidad. Estimar todo
              el backlog con tres escenarios cuesta más de lo que aporta: en tareas rutinarias
              tu histórico ya es mejor estimador que la fórmula. También es humo sin materia
              prima: si nadie puede distinguir razonablemente O, M y P, el resultado con dos
              decimales es precisión de mentira. Y si tu equipo ya trabaja por flujo —por
              ejemplo con{" "}
              <Link to="/blogs/scrumban" className="underline underline-offset-2">
                scrumban
              </Link>{" "}
              y su lead time histórico—, gran parte de la estimación simplemente deja de ser
              necesaria: el sistema predice por ti.
            </p>
          </>
        ),
      },
      {
        heading: "PERT y ruta crítica: la pareja original",
        body: (
          <>
            <p>
              En su versión completa, el PERT nunca fue solo la fórmula: era la fórmula más la
              red. Cada actividad tiene su tiempo esperado; las actividades se encadenan con
              sus dependencias; y la cadena más larga de la red —la ruta crítica— define la
              duración del proyecto. El margen (slack) de cada tarea indica cuánto puede
              retrasarse sin mover la fecha final.
            </p>
            <p>
              Para un proyecto chico eso se traduce en algo muy simple: calcula el TE de tus
              tareas, ponlas en orden de dependencia y mira qué cadena suma más. Esa cadena es
              donde cualquier σ grande se paga con días de retraso, así que es ahí donde
              conviene bajar incertidumbre primero. El método paso a paso, con o sin PERT, está
              en{" "}
              <Link to="/blogs/ruta-critica-proyecto" className="underline underline-offset-2">
                cómo calcular la ruta crítica de un proyecto
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Cómo estimar O, M y P sin engañarte",
        body: (
          <>
            <p>La fórmula es honesta solo si sus entradas lo son. Cuatro reglas:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Define las anclas por escrito.</strong> O significa «todo sale bien a
                la primera», M «una semana normal con interrupciones» y P «el mal escenario
                realista». Sin definición compartida, cada quien cotiza en su propio idioma y
                la fórmula hereda el ruido.
              </li>
              <li>
                <strong>Pídelas por separado y sin verlas entre sí.</strong> Si anuncias la más
                probable primero, las otras dos orbitan alrededor; si anuncias el deadline,
                las tres orbitan a su alrededor. Orden sugerido: O, luego P, y M al final.
              </li>
              <li>
                <strong>Ancla con histórico, no con memoria.</strong> Cuánto tardaron las
                últimas tres tareas parecidas vale más que la sensación de quien la hizo. El
                sistema completo para construir ese histórico está en{" "}
                <Link
                  to="/blogs/como-estimar-tiempos-proyecto"
                  className="underline underline-offset-2"
                >
                  cómo estimar tiempos de un proyecto
                </Link>
                .
              </li>
              <li>
                <strong>Cierra el ciclo.</strong> Anota el TE antes de empezar y la duración
                real al terminar. Sin comparación posterior el equipo nunca calibra, y las σ
                de tu proyecto no aprenden de su propio historial.
              </li>
            </ol>
            <p>
              Y si quieres registrar estimaciones, checklists y cierre de cada tarea en una
              herramienta que vive en tu carpeta —JSON local, sin cuenta ni asientos, con
              checklists y procesos para repetir lo que ya te salió bien—{" "}
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
              — estima con anclas, ejecuta con checklists, todo local-first.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Cuál es la fórmula de tiempo esperado?",
        answer:
          "TE = (O + 4M + P) / 6, donde O es la estimación optimista, M la más probable y P la pesimista. La más probable pesa cuatro veces porque el escenario típico es el que más se repite, y los extremos corrigen por optimismo y por riesgo. El resultado es una duración ponderada, más realista que un número único sacado a la ligera.",
      },
      {
        question: "¿Qué es el PERT y para qué sirve?",
        answer:
          "PERT (Program Evaluation and Review Technique) es una técnica de planificación desarrollada a fines de los años cincuenta para proyectos con alta incertidumbre. Sirve para dos cosas: calcular la duración esperada de cada actividad a partir de tres escenarios, y encadenar esas duraciones en una red de dependencias para obtener la ruta crítica y la fecha más probable del proyecto completo.",
      },
      {
        question: "¿Cómo se calcula la desviación estándar en PERT?",
        answer:
          "Con σ = (P − O) / 6: el rango entre el escenario pesimista y el optimista dividido por seis. Indica cuánta incertidumbre tiene la estimación: una σ pequeña significa que los tres escenarios coinciden y la tarea es predecible; una σ grande avisa de que la tarea puede irse en cualquier dirección y conviene atacarla primero o partirla en pedazos.",
      },
      {
        question: "¿Qué son las estimaciones optimista, más probable y pesimista?",
        answer:
          "Tres escenarios definidos por convención: la optimista (O) es la duración si todo sale bien a la primera; la más probable (M) es lo que ocurriría en una semana normal, con interrupciones incluidas; la pesimista (P) es el escenario malo realista, no la catástrofe. Pedir las tres por separado obliga a pensar en riesgos y evita el número único defensivo inflado con colchón.",
      },
      {
        question: "¿Cuándo no conviene usar PERT?",
        answer:
          "Cuando la tarea es rutinaria y tienes histórico suficiente: el dato real vence a la fórmula. Tampoco conviene aplicarla a todo el backlog por puro rigor, porque el costo de pedir tres números por tarea no se paga en trabajo pequeño y conocido. Y si nadie puede distinguir razonablemente O, M y P, la precisión decimal del resultado es humo con dos decimales.",
      },
    ],
  },
};
