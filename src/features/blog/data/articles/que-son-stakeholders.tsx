import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "que-son-stakeholders",
  title: "Stakeholders: qué son y cómo gestionarlos en un proyecto",
  excerpt:
    "Un stakeholder es cualquiera que puede decir “no” a tu proyecto o lo que este afecta. Quiénes son, ejemplos internos y externos, y cómo gestionarlos por interés e influencia.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-08-02",
  readingTime: "10 min",
  featured: true,
  author: DEFAULT_AUTHOR,
  related: ["matriz-de-stakeholders", "matriz-raci", "gestionar-proyectos-con-clientes"],
  seo: {
    title: "Stakeholders: qué son y cómo gestionarlos | Hito",
    description:
      "Qué es un stakeholder, ejemplos internos y externos, diferencia con shareholders y cómo gestionar cada tipo según su interés e influencia en el proyecto.",
    ogImageAlt: "Tipos de stakeholders de un proyecto: internos, externos y su nivel de influencia.",
  },
  content: {
    eyebrow: "Gestión de proyectos",
    intro: (
      <>
        <strong>En una línea:</strong> los <strong>stakeholders</strong> (o interesados) de un
        proyecto son todas las personas u organizaciones que pueden afectarlo o que resultan
        afectadas por él: desde el cliente y el equipo hasta el área legal que puede frenar todo
        con un email. Gestionar un proyecto sin mapearlos es construir de espaldas a quien tiene
        el poder de decir “no”.
      </>
    ),
    sections: [
      {
        heading: "Qué es un stakeholder, sin jerga",
        body: (
          <>
            <p>
              La definición formal habla de “individuos u organizaciones que pueden afectar o ser
              afectados por el proyecto”. La definición práctica: <strong>todo aquel que puede
              decir “no”</strong> (aprobando, frenando, recortando presupuesto o boicoteando en
              silencio) y todo aquel sobre quien el resultado recae. Si una persona cumple
              cualquiera de las dos condiciones, es stakeholder, y sus expectativas no gestionadas
              se convertirán en riesgos.
            </p>
            <p>
              El error clásico es reducirlos al cliente y al jefe. En cada proyecto hay una capa
              más amplia: quien firma el presupuesto, quien lo audita después, los usuarios que
              vivirán con el resultado, el proveedor cuya entrega bloquea la ruta crítica, el área
              que debe adoptar lo que se construye. Ninguno aparece en el organigrama del
              proyecto; todos pueden mover su fecha final.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplos: stakeholders internos y externos",
        body: (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Tipo</th>
                  <th className="py-2 pr-4 font-semibold">Quiénes suelen ser</th>
                  <th className="py-2 font-semibold">Qué pueden hacerle al proyecto</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Internos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    El patrocinador (sponsor), la dirección, el equipo del proyecto, áreas de
                    apoyo: legal, finanzas, TI, operaciones
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Aprobar o cortar presupuesto, exigir requisitos tardíos, reasignar a la
                    persona clave, retrasar la aprobación legal
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Externos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Cliente y usuarios finales, proveedores y contratistas, reguladores, socios
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Aceptar o rechazar entregables, demorar aprobaciones, incumplir entregas,
                    imponer requisitos regulatorios
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              La prueba para saber si alguien es stakeholder no es su cargo sino su poder: “¿esta
              persona puede, con una decisión suya, cambiar el alcance, la fecha o el
              presupuesto?” y “¿le afecta el resultado?”. Si alguna respuesta es sí, entra al
              mapa, aunque nunca asista a una reunión.
            </p>
          </>
        ),
      },
      {
        heading: "Stakeholders vs. shareholders: no son lo mismo",
        body: (
          <>
            <p>
              Se confunden por el parecido de la palabra, pero la diferencia es simple: los{" "}
              <strong>shareholders</strong> son los dueños de acciones de una empresa; los{" "}
              <strong>stakeholders</strong> son todos los interesados, incluidos los shareholders.
              Un proyecto puede tener un solo stakeholder que sea shareholder (el dueño que financia)
              y veinte que no lo son: el cliente, el equipo, los usuarios, el regulador.
            </p>
            <p>
              ¿Por qué importa la distinción? Porque cada tipo se convence distinto. Al
              shareholder se le habla de retorno y riesgo; al usuario, de cómo le cambia el día a
              día; al regulador, de cumplimiento. Tratar a todos como accionistas es el modo más
              rápido de perder a los que no se mueven con números.
            </p>
          </>
        ),
      },
      {
        heading: "Los 4 tipos según interés e influencia",
        body: (
          <>
            <p>
              No todos los stakeholders merecen la misma dosis de atención, y repartirla pareja es
              agotar al equipo. El corte clásico cruza dos variables: <strong>influencia</strong>{" "}
              (poder para cambiar el proyecto) e <strong>interés</strong> (cuánto le importa el
              resultado). De ese cruce salen cuatro cuadrantes:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Alta influencia, alto interés:</strong> se gestionan de cerca.
                Participación activa, trato directo, sin sorpresas.
              </li>
              <li>
                <strong>Alta influencia, bajo interés:</strong> se mantienen satisfechos.
                Información breve y a tiempo; no molestar, nunca sorprender.
              </li>
              <li>
                <strong>Baja influencia, alto interés:</strong> se mantienen informados. El equipo
                y los usuarios suelen vivir aquí: comunicación frecuente y canal abierto.
              </li>
              <li>
                <strong>Baja influencia, bajo interés:</strong> se monitorean. Un aviso en los
                hitos alcanza; invertir ahí roba horas de los otros cuadrantes.
              </li>
            </ul>
            <p>
              La herramienta que convierte estos cuadrantes en un mapa accionable (con ejemplo y
              plantilla) es la{" "}
              <Link
                to="/blogs/matriz-de-stakeholders"
                className="underline underline-offset-2"
              >
                matriz de stakeholders poder-interés
              </Link>
              . Se llena en 30 minutos y es el insumo del plan de comunicación del proyecto.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo gestionarlos: expectativas, roles y canales",
        body: (
          <>
            <p>
              Gestionar stakeholders no es agradarlos: es que sus expectativas coincidan con lo
              que el proyecto va a entregar. Tres piezas cumplen casi todo el trabajo:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Expectativas escritas desde el arranque:</strong> el kickoff y el acta
                confirman qué se entrega, qué no, y quién decide qué. La reunión de{" "}
                <Link
                  to="/blogs/kickoff-de-proyecto"
                  className="underline underline-offset-2"
                >
                  kickoff
                </Link>{" "}
                es el momento de alinear a los cuadrantes altos con el plan.
              </li>
              <li>
                <strong>Roles sin ambigüedad:</strong> quién aprueba, quién es responsable de
                ejecutar, a quién se consulta. La{" "}
                <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                  matriz RACI
                </Link>{" "}
                evita el stakeholder que se entera tarde de algo que debió aprobar, y el que
                aprueba cosas que no le tocan.
              </li>
              <li>
                <strong>Canales por tipo:</strong> informe breve para los satisfechos, reunión
                directa para los de alta influencia, tablero abierto para los interesados. Un solo
                canal para todos no satisface a nadie.
              </li>
            </ul>
            <p>
              En proyectos con clientes externos, esta gestión es la diferencia entre un cliente
              que firma hitos y uno que reaparece cada tres semanas con pedidos nuevos; el
              detalle está en cómo estructurar{" "}
              <Link
                to="/blogs/gestionar-proyectos-con-clientes"
                className="underline underline-offset-2"
              >
                proyectos con clientes
              </Link>{" "}
              desde el primer día.
            </p>
          </>
        ),
      },
      {
        heading: "Las señales de que los estás ignorando",
        body: (
          <>
            <p>
              Los stakeholders no gestionados no desaparecen: cambian de canal. Aparecen señales
              reconocibles: aprobaciones que tardan cada vez más (alguien se enteró tarde), un
              director que irrumpe pidiendo “ver el proyecto” sin contexto (estaba en el cuadrante
              satisfecho y nadie lo alimentaba), requisitos nuevos a mitad de camino (una
              expectativa nunca se escribió), o usuarios que boicotean la adopción al final
              (nadie les comunicó qué cambia para ellos).
            </p>
            <p>
              El antídoto cuesta menos que el remedio: mapear stakeholders en el arranque,
              clasificarlos por interés e influencia, y dar a cada cuadrante la dosis correcta de
              comunicación. Un proyecto promedio tiene entre 8 y 15 stakeholders reales; media
              hora de mapa evita la mayoría de las sorpresas de los meses siguientes.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué es un stakeholder?",
        answer:
          "Un stakeholder (o interesado) es cualquier persona u organización que puede afectar un proyecto o que resulta afectada por su resultado: cliente, equipo, patrocinador, proveedores, usuarios, áreas de apoyo o reguladores. La prueba práctica: si puede cambiar el alcance, la fecha o el presupuesto, o si el resultado le afecta, es stakeholder.",
      },
      {
        question: "¿Cuáles son ejemplos de stakeholders internos y externos?",
        answer:
          "Internos: el patrocinador, la dirección, el equipo del proyecto y áreas de apoyo como legal, finanzas u operaciones. Externos: el cliente, los usuarios finales, proveedores, contratistas, socios y reguladores. Un mismo proyecto suele tener entre 8 y 15 stakeholders reales de ambos tipos.",
      },
      {
        question: "¿Cuál es la diferencia entre stakeholders y shareholders?",
        answer:
          "Los shareholders son los accionistas o dueños de una empresa. Los stakeholders son todos los interesados en el proyecto, incluidos los shareholders. Se distinguen porque cada tipo se convence distinto: al accionista con retorno y riesgo, al usuario con su día a día, al regulador con cumplimiento.",
      },
      {
        question: "¿Quiénes son los stakeholders de un proyecto?",
        answer:
          "Dependen del proyecto, pero casi siempre incluyen: el patrocinador que financia, el cliente que acepta, los usuarios que usarán el resultado, el equipo que lo ejecuta, los proveedores cuyas entregas bloquean, y las áreas que deben aprobar o adoptar (legal, finanzas, TI, operaciones).",
      },
      {
        question: "¿Cómo se gestionan los stakeholders de un proyecto?",
        answer:
          "En tres pasos: mapearlos por nivel de influencia e interés (matriz poder-interés), asignar a cada cuadrante la dosis de comunicación correcta (gestionar de cerca, mantener satisfecho, informar, monitorear) y dejar roles claros con una matriz RACI para evitar aprobaciones tardías o duplicadas.",
      },
    ],
  },
};
