import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "matriz-raci",
  title: "Matriz RACI: qué es, ejemplo y diferencia con RASCI",
  excerpt:
    "La matriz RACI aclara quién hace, quién aprueba y quién solo necesita estar informado. Cómo construirla paso a paso, con un ejemplo completo y errores comunes.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-11-02",
  readingTime: "8 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "gestion-de-proyectos-guia-completa",
  related: ["como-estimar-tiempos-proyecto", "alcance-de-proyecto-scope-creep"],
  seo: {
    title: "Matriz RACI: qué es, ejemplo y diferencia con RASCI | Hito",
    description:
      "Qué es una matriz RACI, con un ejemplo completo. También cubre la matriz RASCI y cómo armarla paso a paso con roles claros.",
    ogImageAlt: "Matriz RACI: responsable, aprobador, consultado e informado.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> la matriz RACI es un acrónimo de cuatro roles —{" "}
        <strong>R</strong>esponsable, <strong>A</strong>probador, <strong>C</strong>onsultado e{" "}
        <strong>I</strong>nformado— que se asignan a cada decisión o entregable grande de un
        proyecto, en una tabla simple. Resuelve el problema más común de coordinación: dos
        personas creyendo que aprueban lo mismo, o ninguna. Se arma en 15-20 minutos y evita
        semanas de fricción.
      </>
    ),
    sections: [
      {
        heading: "Los 4 roles, uno por uno",
        body: (
          <>
            <ul className="list-disc space-y-3 pl-6 text-muted-foreground">
              <li>
                <strong>Responsable (Responsible):</strong> quien hace el trabajo. Puede haber
                varios responsables en una tarea grande, pero cada sub-parte tiene un único
                responsable claro.
              </li>
              <li>
                <strong>Aprobador (Accountable):</strong> quien tiene la decisión final y rinde
                cuentas por el resultado. <strong>Regla dura: solo puede haber uno por
                entregable.</strong> Dos aprobadores es la receta exacta para que nadie apruebe
                nada a tiempo. En un cambio de{" "}
                <Link
                  to="/blogs/alcance-de-proyecto-scope-creep"
                  className="underline underline-offset-2"
                >
                  alcance de proyecto
                </Link>
                , esta es la persona que dice sí o no.
              </li>
              <li>
                <strong>Consultado (Consulted):</strong> a quien hay que preguntarle{" "}
                <em>antes</em> de decidir, porque tiene información o experiencia relevante. La
                comunicación es en ambas direcciones (se le pregunta, y responde).
              </li>
              <li>
                <strong>Informado (Informed):</strong> a quien hay que avisarle{" "}
                <em>después</em> de decidir, porque el resultado lo afecta. La comunicación es en
                una sola dirección — no opina, se entera.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Ejemplo completo: lanzamiento de un producto",
        body: (
          <>
            <p>
              Una matriz RACI real para el lanzamiento de una nueva funcionalidad, con 4
              entregables grandes:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Entregable</th>
                  <th className="py-2 pr-4 font-semibold">Producto</th>
                  <th className="py-2 pr-4 font-semibold">Ingeniería</th>
                  <th className="py-2 pr-4 font-semibold">Diseño</th>
                  <th className="py-2 font-semibold">Marketing</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Especificación funcional</td>
                  <td className="py-2 pr-4">R / A</td>
                  <td className="py-2 pr-4">C</td>
                  <td className="py-2 pr-4">C</td>
                  <td className="py-2">I</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Desarrollo</td>
                  <td className="py-2 pr-4">C</td>
                  <td className="py-2 pr-4">R / A</td>
                  <td className="py-2 pr-4">C</td>
                  <td className="py-2">I</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Diseño de interfaz</td>
                  <td className="py-2 pr-4">C</td>
                  <td className="py-2 pr-4">C</td>
                  <td className="py-2 pr-4">R / A</td>
                  <td className="py-2">I</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Anuncio de lanzamiento</td>
                  <td className="py-2 pr-4">C</td>
                  <td className="py-2 pr-4">I</td>
                  <td className="py-2 pr-4">C</td>
                  <td className="py-2">R / A</td>
                </tr>
              </tbody>
            </table>
            <p>
              Léela así: para el "Desarrollo", Ingeniería hace el trabajo y aprueba cuándo está
              listo (R/A); Producto opina antes de que se cierre (C); Marketing solo se entera
              cuando termina (I). Esta única tabla reemplaza semanas de "pensé que tú lo ibas a
              aprobar".
            </p>
          </>
        ),
      },
      {
        heading: "Cómo armarla, paso a paso",
        body: (
          <>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>
                Lista los <strong>entregables o decisiones grandes</strong> del proyecto (entre 5
                y 15 — si tienes 40, estás siendo demasiado granular).
              </li>
              <li>Lista las personas o áreas involucradas como columnas.</li>
              <li>
                Para cada celda, asigna una letra. Regla de oro:{" "}
                <strong>una sola A por fila</strong>, nunca cero, nunca dos.
              </li>
              <li>
                Revisa que nadie tenga demasiadas A: si una persona aprueba todo, es un cuello de
                botella disfrazado de matriz RACI.
              </li>
              <li>
                Compártela con todo el equipo <em>antes</em> de arrancar la ejecución, no
                después de la primera confusión.
              </li>
            </ol>
          </>
        ),
      },
      {
        heading: "Errores comunes al usar RACI",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Dos Aprobadores en la misma fila.</strong> Es el error más frecuente y el
                que más rompe la utilidad de la herramienta — vuelve a crear la ambigüedad que
                RACI existe para eliminar.
              </li>
              <li>
                <strong>Demasiados Consultados.</strong> Si 6 personas son "C" en cada decisión,
                cada aprobación se convierte en una reunión. Reserva el rol de Consultado para
                quien de verdad aporta información que puede cambiar la decisión.
              </li>
              <li>
                <strong>Hacerla y nunca más mirarla.</strong> Una matriz RACI que vive en un
                documento olvidado no sirve — tiene que estar donde el equipo ya mira todos los
                días, junto al{" "}
                <Link to="/blogs/fases-de-un-proyecto" className="underline underline-offset-2">
                  plan del proyecto
                </Link>
                .
              </li>
            </ul>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es una matriz RACI?",
        answer:
          "Una matriz RACI es una tabla que asigna, por cada entregable o decisión grande, quién hace el trabajo (Responsible), quién aprueba (Accountable), a quién se consulta antes (Consulted) y a quién se informa después (Informed). Resuelve el caso de dos personas creyendo que aprueban lo mismo, o de nadie haciéndolo.",
      },
      {
        question: "¿Matriz RACI ejemplo: cómo se ve?",
        answer:
          "Se ve como una grilla: filas = entregables (especificación, desarrollo, diseño, anuncio) y columnas = roles o áreas (Producto, Ingeniería, Diseño, Marketing). Cada celda lleva una letra. En el ejemplo de este artículo, Ingeniería es R/A del desarrollo y Marketing solo queda informado (I).",
      },
      {
        question: "¿Qué es la matriz RASCI?",
        answer:
          "RASCI es la variante de RACI que agrega una S de Support (soporte): alguien que ayuda a ejecutar pero no es el responsable principal. Úsala si en tu equipo hay roles de apoyo que no encajan bien como Consultado ni como Responsable; si no, RACI de cuatro letras suele alcanzar.",
      },
      {
        question: "¿Puede haber más de un Responsable en la misma fila?",
        answer:
          "Sí, varias personas pueden compartir el trabajo (R). Lo que no puede haber es más de un Aprobador (A): la decisión final debe recaer en una sola persona para que la matriz cumpla su función.",
      },
      {
        question: "¿RACI sirve para proyectos chicos con 3 personas?",
        answer:
          "Sirve, pero se puede simplificar: con equipos muy pequeños suele bastar con marcar quién aprueba cada entregable grande, sin necesidad de completar las cuatro columnas para cada tarea menor.",
      },
      {
        question: "¿En qué se diferencia de un organigrama?",
        answer:
          "El organigrama muestra jerarquía general de la empresa; la matriz RACI muestra responsabilidades específicas por entregable dentro de un proyecto puntual. Una misma persona puede ser Aprobador en un entregable y solo Consultado en otro del mismo proyecto.",
      },
    ],
  },
};
