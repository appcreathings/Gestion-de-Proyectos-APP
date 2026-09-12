import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "matriz-de-riesgos",
  title: "Matriz de riesgos: probabilidad e impacto, con ejemplo",
  excerpt:
    "La matriz de riesgos ordena tus riesgos por probabilidad e impacto para que sepas qué mirar primero: cómo armarla en 5 pasos, qué hacer en cada zona y un ejemplo completo.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-09-11",
  readingTime: "9 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  related: [
    "gestion-de-riesgos-simple",
    "plan-de-contingencia",
    "matriz-de-stakeholders",
  ],
  seo: {
    title: "Matriz de riesgos: probabilidad e impacto | Hito",
    description:
      "Matriz de riesgos: qué es, cómo armarla en 5 pasos, qué escala usar (3×3 o 5×5), qué hacer en cada zona y un ejemplo completo con proyecto real.",
    ogImageAlt: "Matriz de riesgos 3x3 con riesgos ubicados por probabilidad e impacto.",
  },
  content: {
    eyebrow: "Riesgo y calidad",
    intro: (
      <>
        <strong>En una línea:</strong> la matriz de riesgos es el mapa 2D —probabilidad contra
        impacto— que ordena tus riesgos por urgencia, y su valor no está en dibujarla sino en la
        pregunta que responde: ¿qué riesgo merece tu atención esta semana?
      </>
    ),
    sections: [
      {
        heading: "Qué es una matriz de riesgos",
        body: (
          <>
            <p>
              Una matriz de riesgos es una cuadrícula donde cada riesgo del proyecto se ubica
              según dos preguntas: ¿qué tan probable es que ocurra? (eje horizontal) y ¿qué tan
              caro duele si ocurre? (eje vertical). El cruce de ambas produce zonas — rojo,
              amarillo, verde — que te dicen dónde poner la energía limitada que tienes para
              gestionar riesgos.
            </p>
            <p>
              Es la herramienta visual del proceso de gestión de riesgos: la lista de riesgos y
              sus respuestas la describimos en{" "}
              <Link
                to="/blogs/gestion-de-riesgos-simple"
                className="underline underline-offset-2"
              >
                gestión de riesgos para equipos pequeños
              </Link>
              ; la matriz es el paso siguiente, el que convierte esa lista en prioridad. Su
              prima conceptual es la{" "}
              <Link
                to="/blogs/matriz-de-stakeholders"
                className="underline underline-offset-2"
              >
                matriz de stakeholders
              </Link>{" "}
              (poder × interés): misma lógica de dos ejes para decidir a quién mirar primero.
            </p>
            <p>
              Por qué funciona: sin matriz, todos los riesgos gritan igual y se gestiona el que
              más asusta — que no siempre es el que más daña. Con matriz, un riesgo improbable
              pero catastrófico y uno frecuente pero chico dejan de competir por el mismo
              espacio mental: cada uno tiene su zona y su respuesta.
            </p>
          </>
        ),
      },
      {
        heading: "Los dos ejes: qué escala usar",
        body: (
          <>
            <p>
              La pregunta práctica más común: ¿escala de 1 a 3, de 1 a 5, o porcentajes? La
              respuesta para equipos de 1 a 15 personas es rotunda: <strong>3×3 alcanza, y
              mejor</strong>.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Escala</th>
                  <th className="py-2 pr-4 font-semibold">Cuándo usarla</th>
                  <th className="py-2 font-semibold">Trampa</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    3 niveles (bajo/medio/alto)
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    La mayoría de los equipos pequeños. Discusiones de segundos, zonas claras.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Ninguna grave: menos precisión, pero la precisión falsa no hace falta.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">5 niveles (1–5)</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Proyectos grandes o regulados donde el riesgo se reporta a comités.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Debates infinitos entre «3» y «4» que no cambian ninguna decisión.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Numéricas exactas (% de probabilidad, $ de impacto)
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cuando hay datos reales: incidentes históricos, seguros, contratos.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Precisión de mentira: el 37% de probabilidad salió de la intuición igual.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Definiciones de bolsillo para el 3×3, acordadas en equipo para que «alto» signifique
              lo mismo para todos: <strong>probabilidad</strong> — baja: poco común en proyectos
              como el tuyo; media: ya lo viste pasar; alta: lo esperas casi con seguridad.
              <strong> Impacto</strong> — bajo: molesta y se absorbe; medio: mueve fecha o
              presupuesto hasta un 10%; alto: rompe la fecha, el presupuesto o la relación con el
              cliente.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo armarla en 5 pasos",
        body: (
          <>
            <p>
              La matriz se arma en una sesión de 45–60 minutos al inicio del proyecto y se
              revisa en cada hito relevante:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Listar los riesgos (15 min).</strong> En equipo, sin filtro: cada uno
                nombra lo que puede salir mal. Técnicas que ayudan: recorrer las fases del
                proyecto una por una, y preguntar «¿qué tiene que pasar para que este proyecto
                fracase?». Meta realista: 8–15 riesgos. Si salen 50, hay que fusionar antes de
                seguir.
              </li>
              <li>
                <strong>Calificar probabilidad.</strong> Riesgo por riesgo: baja, media o alta.
                En desacuerdo, toma la valoración más pesimista — barato hasta que se demuestre
                lo contrario.
              </li>
              <li>
                <strong>Calificar impacto.</strong> Misma escala, contra la regla del 10% de
                fecha/presupuesto. El impacto se califica contra el proyecto, no contra el ánimo
                del que lo sufre.
              </li>
              <li>
                <strong>Ubicarlos en la matriz.</strong> Cada riesgo cae en una de las 9 celdas.
                La zona la define el producto de ambos ejes (ver tabla de la próxima sección).
              </li>
              <li>
                <strong>Responder según la zona y asignar dueño.</strong> Cada riesgo rojo y
                amarillo lleva un dueño — una persona, no «el equipo» — y una decisión: mitigar,
                plan B, aceptar o evitar (
                <Link to="/blogs/plan-de-contingencia" className="underline underline-offset-2">
                  plan de contingencia
                </Link>{" "}
                para los que merecen plan B). Los verdes se anotan y se dejan en paz.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Qué hacer según la zona",
        body: (
          <>
            <p>
              La matriz 3×3 con su lectura por celda — esta tabla es la matriz, literalmente:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Impacto ↓ / Probabilidad →</th>
                  <th className="py-2 pr-4 font-semibold">Baja</th>
                  <th className="py-2 pr-4 font-semibold">Media</th>
                  <th className="py-2 font-semibold">Alta</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    <strong>Alto</strong>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    🟡 Plan B escrito y reserva; revisar en cada hito.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    🔴 Mitigar ahora; dueño y plan de contingencia obligatorios.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    🔴 Evitar o rediseñar: si casi seguro duele mucho, sacá la causa del plan.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    <strong>Medio</strong>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    🟢 Aceptar y anotar; sin gasto de gestión.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    🟡 Mitigar barato; revisar semanalmente.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    🔴 Mitigar en serio: frecuente y visible, se come el proyecto de a poco.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">
                    <strong>Bajo</strong>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    🟢 Aceptar; ni siquiera lo mires.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    🟢 Aceptar; se absorbe solo.
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    🟡 Estandarizar: si pasa seguido y molesta poco, el fix es un proceso.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La lectura vertical importa tanto como la horizontal: la fila de impacto alto es
              donde vive el dinero — aunque sean improbables, los riesgos de esa fila son los
              únicos que justifican reservas de tiempo y presupuesto por adelantado. La columna
              de probabilidad alta, en cambio, casi nunca necesita planes elaborados: necesita{" "}
              <strong>procesos</strong> — lo que pasa siempre se resuelve cambiando el sistema,
              no vigilándolo.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo completo: proyecto web de 6 semanas",
        body: (
          <>
            <p>
              Un estudio de 5 personas desarrolla una web para un cliente externo. Los 8 riesgos
              identificados en la sesión inicial, ya ubicados:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Riesgo</th>
                  <th className="py-2 pr-4 font-semibold">Prob.</th>
                  <th className="py-2 pr-4 font-semibold">Impacto</th>
                  <th className="py-2 pr-4 font-semibold">Zona</th>
                  <th className="py-2 font-semibold">Respuesta y dueño</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cliente demora aprobaciones
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Alta</td>
                  <td className="py-2 pr-4 text-muted-foreground">Medio</td>
                  <td className="py-2 pr-4 text-muted-foreground">🔴</td>
                  <td className="py-2 text-muted-foreground">
                    Aprobaciones con fecha y silencio positivo en contrato — Ana.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cambios de alcance continuos
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Alta</td>
                  <td className="py-2 pr-4 text-muted-foreground">Alto</td>
                  <td className="py-2 pr-4 text-muted-foreground">🔴</td>
                  <td className="py-2 text-muted-foreground">
                    Control de cambios formal desde el kickoff — Ana.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    Se va el único dev que conoce el stack
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Baja</td>
                  <td className="py-2 pr-4 text-muted-foreground">Alto</td>
                  <td className="py-2 pr-4 text-muted-foreground">🟡</td>
                  <td className="py-2 text-muted-foreground">
                    Pair sessions + documentación del módulo — Carlos.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">
                    El proveedor de fotos entrega tarde
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">Media</td>
                  <td className="py-2 pr-4 text-muted-foreground">Medio</td>
                  <td className="py-2 pr-4 text-muted-foreground">🟡</td>
                  <td className="py-2 text-muted-foreground">
                    Pedido con 2 semanas de colchón + banco libre como plan B — Marta.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground" colSpan={5}>
                    … y 4 riesgos verdes (caída del hosting, gripe en el equipo, conflicto de
                    agenda con otro proyecto, retraso del dominio) — anotados, sin gestión
                    activa.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Nótese lo que la matriz hizo: de 8 riesgos, solo 2 consumen gestión activa esta
              semana. Las respuestas de los dos rojos están atadas a mecanismos contractuales
              (fechas de aprobación, control de cambios) — no a vigilancia — y cada riesgo
              tiene nombre propio de dueño. Esa es la diferencia entre una matriz que vive en
              una carpeta y una que administra el proyecto.
            </p>
          </>
        ),
      },
      {
        heading: "Los 3 errores que la vuelven decorativa",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>La matriz de 200 riesgos.</strong> Cuando todo es riesgo, nada es
                riesgo. La sesión de identificación es un embudo, no un museo: 8–15 riesgos
                bien calificados gestionan más que 200 catalogados. Lo demás es fusionar o
                soltar.
              </li>
              <li>
                <strong>Riesgo sin dueño.</strong> «El equipo está atento» no es una respuesta.
                Si no hay un nombre junto al riesgo, no hay riesgo gestionado: hay una
                preocupación compartida que nadie resolverá. Regla: sin dueño, no entra en la
                matriz.
              </li>
              <li>
                <strong>La matriz congelada.</strong> La que se armó en el kickoff y no se tocó
                más describe los miedos de la semana 1, no el proyecto real. Se revisa en cada
                hito y cada vez que el plan cambia — son 10 minutos: ¿subió de zona alguno?
                ¿se materializó uno? ¿hay que anotar lo aprendido en{" "}
                <Link
                  to="/blogs/lecciones-aprendidas-proyecto"
                  className="underline underline-offset-2"
                >
                  lecciones aprendidas
                </Link>
                ?
              </li>
            </ul>
            <p>
              Si quieres que los riesgos con su zona, dueño y estado vivan junto al proyecto
              que amenazan — en un tablero local de tu carpeta, sin cuenta ni nube—{" "}
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
              — riesgos, hitos y tareas en el mismo tablero, local-first.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es una matriz de riesgos?",
        answer:
          "Es una cuadrícula de dos ejes — probabilidad de que el riesgo ocurra contra impacto si ocurre — donde se ubican los riesgos de un proyecto para priorizarlos. Produce zonas (roja, amarilla, verde) que indican qué riesgos necesitan gestión activa, cuáles solo plan B y cuáles se aceptan.",
      },
      {
        question: "¿Cómo se hace una matriz de riesgos?",
        answer:
          "En 5 pasos: listar 8–15 riesgos en equipo (recorriendo las fases del proyecto), calificar la probabilidad de cada uno, calificar el impacto contra reglas acordadas (por ejemplo: mueve fecha o presupuesto un 10% = medio), ubicarlos en la cuadrícula y responder según la zona con un dueño por riesgo. Toma una hora al inicio y 10 minutos por revisión.",
      },
      {
        question: "¿Qué escala conviene usar: 3×3 o 5×5?",
        answer:
          "Para equipos pequeños, 3×3 (bajo/medio/alto en cada eje): produce discusiones de segundos y zonas claras. La 5×5 aporta precisión que casi nunca cambia decisiones y genera debates eternos entre un 3 y un 4. Las escalas numéricas exactas solo valen cuando hay datos históricos reales detrás.",
      },
      {
        question: "¿Cuál es la diferencia entre matriz y registro de riesgos?",
        answer:
          "El registro de riesgos es la lista completa: cada riesgo con su descripción, calificación, respuesta y dueño. La matriz es la vista priorizada del registro: ubica esos mismos riesgos en el mapa probabilidad-impacto. Se usan juntos — el registro guarda el detalle, la matriz decide dónde mirar.",
      },
      {
        question: "¿Cada cuánto se revisa la matriz de riesgos?",
        answer:
          "En cada hito relevante del proyecto y cada vez que el plan cambia: ¿algún riesgo subió de zona, se materializó alguno, hay que activar un plan de contingencia? Son 10 minutos de revisión. La matriz que no se revisa documenta los miedos de la semana 1, no los riesgos reales del proyecto.",
      },
    ],
  },
};
