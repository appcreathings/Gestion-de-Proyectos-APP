import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "plantilla-para-documentar-procesos",
  title: "Plantilla para documentar procesos (Word y Excel): ficha lista para copiar",
  excerpt:
    "Una ficha de proceso de una página para copiar en Word o Excel: los 10 campos que importan, ejemplo completo, inventario de procesos en tabla y cuándo esa plantilla se te queda corta.",
  category: "plantillas",
  categoryLabel: "Plantillas",
  publishedAt: "2026-10-23",
  readingTime: "7 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "manual-de-procesos-y-procedimientos",
  related: [
    "manual-de-procesos-y-procedimientos",
    "como-documentar-procesos-equipos",
    "procedimiento-operativo-estandarizado-sop",
    "plantillas-gestion-proyectos",
  ],
  seo: {
    title: "Plantilla para documentar procesos en Word y Excel | Hito",
    description:
      "Plantilla para documentar procesos en Word y Excel: ficha de proceso de una página con 10 campos, ejemplo completo, inventario de procesos y cuándo cambiar de herramienta.",
    ogImageAlt: "Ficha de proceso con diez campos para documentar procesos en Word o Excel.",
  },
  content: {
    eyebrow: "Documentación de procesos",
    intro: (
      <>
        <strong>En una línea:</strong> una buena plantilla para documentar procesos cabe en una
        página, tiene siempre los mismos campos y se llena en 20 minutos — copia la de este
        artículo en Word o Excel y empieza por el proceso que más dolor te causa.
      </>
    ),
    sections: [
      {
        heading: "La ficha de proceso: 10 campos que alcanzan",
        body: (
          <>
            <p>
              Hay plantillas de 40 campos que nadie termina de llenar. Esta tiene diez, y cada
              uno responde una pregunta que alguien se va a hacer el día que el proceso falle.
              Copia el bloque tal cual en un documento de Word o en una hoja de Excel (una
              columna por campo para el inventario, una página por ficha para el detalle):
            </p>
            <pre className="whitespace-pre-wrap rounded-md border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
              {`FICHA DE PROCESO
1. Nombre del proceso:
2. Código y versión:            (ej. COM-01 · v1.0 · 2026-10-23)
3. Responsable (dueño):
4. Objetivo:                    (una frase: para qué existe)
5. Cuándo se activa:            (qué evento lo inicia)
6. Entradas:                    (qué necesita para empezar)
7. Pasos:                       (numerados; quién hace cada uno)
8. Salidas / entregable:        (qué produce al terminar)
9. Controles y registros:       (qué se verifica y qué evidencia queda)
10. Indicador y revisión:       (cómo sabemos que funciona · próxima revisión)`}
            </pre>
            <p>
              Los campos 5, 6 y 8 son los que más se omiten y los que más ayudan: dicen cuándo
              empieza el proceso, con qué se arranca y cómo se sabe que terminó. Sin ellos, la
              ficha es una lista de pasos sin contexto.
            </p>
          </>
        ),
      },
      {
        heading: "Ejemplo llenado: onboarding de un cliente nuevo",
        body: (
          <>
            <p className="rounded-md border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
              <strong>1. Nombre:</strong> Incorporación de cliente nuevo
              <br />
              <strong>2. Código y versión:</strong> COM-03 · v1.2 · 2026-10-23
              <br />
              <strong>3. Responsable:</strong> Líder de cuentas
              <br />
              <strong>4. Objetivo:</strong> que el cliente arranque con acuerdos claros y acceso a
              todo lo necesario en menos de 5 días hábiles.
              <br />
              <strong>5. Se activa:</strong> propuesta aceptada y primer pago recibido.
              <br />
              <strong>6. Entradas:</strong> propuesta firmada, datos de contacto, datos de
              facturación.
              <br />
              <strong>7. Pasos:</strong> (1) Crear el cliente y el proyecto — Cuentas. (2)
              Enviar correo de bienvenida con calendario — Cuentas. (3) Agendar el kickoff —
              Cuentas. (4) Pedir accesos y materiales con fecha límite — Líder de proyecto. (5)
              Registrar acuerdos de comunicación — Líder de proyecto.
              <br />
              <strong>8. Salidas:</strong> proyecto creado, kickoff agendado, accesos recibidos.
              <br />
              <strong>9. Controles y registros:</strong> checklist de incorporación completo;
              correo de bienvenida archivado en el proyecto.
              <br />
              <strong>10. Indicador y revisión:</strong> días hasta el kickoff (meta: ≤ 5).
              Revisión: abril 2027.
            </p>
            <p>
              Fíjate en que cada paso tiene un nombre al lado. Un paso sin responsable es un
              paso que nadie hace. Para profundizar en esta parte del trabajo con clientes, mira{" "}
              <Link
                to="/blogs/onboarding-de-clientes"
                className="underline underline-offset-2"
              >
                onboarding de clientes
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Versión Excel: el inventario de procesos",
        body: (
          <>
            <p>
              Excel brilla para una cosa que Word hace mal: tener todos los procesos en una sola
              vista. Una hoja de inventario con estas columnas te dice en un minuto qué está
              documentado, qué no y qué está vencido:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Código</th>
                  <th className="py-2 pr-4 font-semibold">Proceso</th>
                  <th className="py-2 pr-4 font-semibold">Responsable</th>
                  <th className="py-2 pr-4 font-semibold">Versión</th>
                  <th className="py-2 font-semibold">Próxima revisión</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">COM-01</td>
                  <td className="py-2 pr-4 text-muted-foreground">Atención de consultas</td>
                  <td className="py-2 pr-4 text-muted-foreground">Dirección</td>
                  <td className="py-2 pr-4 text-muted-foreground">v1.0</td>
                  <td className="py-2 text-muted-foreground">2027-04</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 text-muted-foreground">COM-03</td>
                  <td className="py-2 pr-4 text-muted-foreground">Incorporación de cliente</td>
                  <td className="py-2 pr-4 text-muted-foreground">Líder de cuentas</td>
                  <td className="py-2 pr-4 text-muted-foreground">v1.2</td>
                  <td className="py-2 text-muted-foreground">2027-04</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">ADM-02</td>
                  <td className="py-2 pr-4 text-muted-foreground">Facturación mensual</td>
                  <td className="py-2 pr-4 text-muted-foreground">Administración</td>
                  <td className="py-2 pr-4 text-muted-foreground">v2.0</td>
                  <td className="py-2 text-muted-foreground">2026-12</td>
                </tr>
              </tbody>
            </table>
            <p>
              Añade formato condicional a «Próxima revisión» para que se pinte de rojo cuando la
              fecha pase. Es el mecanismo más barato para que la documentación no envejezca sin
              que nadie se entere. Si ya gestionas tus proyectos en hojas de cálculo, mira
              hasta dónde llega eso en{" "}
              <Link
                to="/blogs/gestion-proyectos-excel"
                className="underline underline-offset-2"
              >
                gestión de proyectos en Excel
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Word, Excel o herramienta: cuándo usar cada uno",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Word (o Google Docs):</strong> la ficha de cada proceso. Cómodo de
                escribir, imprimir y firmar. Su punto débil es la versión: el documento
                «final_v3_ok» circula por correo y nadie sabe cuál manda.
              </li>
              <li>
                <strong>Excel (o Sheets):</strong> el inventario y los registros. Excelente para
                listas y seguimiento de revisiones. Su punto débil es el texto largo y los
                pasos con condiciones.
              </li>
              <li>
                <strong>Una herramienta que una el proceso con el trabajo:</strong> cuando el
                procedimiento debe convertirse en una checklist que se ejecuta en cada
                proyecto. Ahí Word y Excel dejan de alcanzar, porque la ficha queda lejos de la
                tarea.
              </li>
            </ul>
            <p>
              La regla práctica: empieza con Word y Excel (cero fricción), y cuando notes que el
              equipo abre la ficha una vez y después repite el proceso de memoria, pasa la ficha
              a checklist ejecutable. Eso es lo que{" "}
              <Link
                to="/blogs/como-documentar-procesos-equipos"
                className="underline underline-offset-2"
              >
                documentar procesos con SOPs y checklists
              </Link>{" "}
              resuelve, y se conecta con el{" "}
              <Link
                to="/blogs/manual-de-procesos-y-procedimientos"
                className="underline underline-offset-2"
              >
                manual de procesos
              </Link>{" "}
              de toda la empresa.
            </p>
          </>
        ),
      },
      {
        heading: "Checklist de calidad de una ficha",
        body: (
          <>
            <p>Antes de dar por buena una ficha, verifica estas cinco cosas:</p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Cada paso empieza con un verbo y tiene un responsable con nombre o rol.</li>
              <li>Se sabe cuándo empieza y cuándo termina el proceso.</li>
              <li>Cabe en una página; si no, hay dos procesos mezclados.</li>
              <li>Alguien que no conoce la tarea la ejecutó siguiendo solo la ficha.</li>
              <li>Tiene versión, fecha y dueño de la próxima revisión.</li>
            </ol>
            <p>
              Si quieres que cada ficha se convierta en una plantilla de checklist asociada a
              tus proyectos, guardada en archivos locales y sin cuenta,{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              está pensado para eso.
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
              — de la ficha al checklist ejecutable, local-first.
            </p>
          </>
        ),
      },
    ],
    faq: [
      {
        question: "¿Qué debe tener una plantilla para documentar procesos?",
        answer:
          "Como mínimo: nombre, código y versión, responsable, objetivo, cuándo se activa, entradas, pasos numerados con responsable, salidas, controles y registros, e indicador con fecha de revisión. Diez campos en una página son suficientes para casi cualquier proceso.",
      },
      {
        question: "¿Es mejor documentar procesos en Word o en Excel?",
        answer:
          "Word sirve para la ficha detallada de cada proceso; Excel sirve para el inventario de todos los procesos con su versión y fecha de revisión. Se complementan. Cuando el procedimiento debe ejecutarse como checklist en cada proyecto, conviene una herramienta que enlace el proceso con las tareas.",
      },
      {
        question: "¿Cuánto debe medir la documentación de un proceso?",
        answer:
          "Una página por proceso. Si no cabe, probablemente hay dos procesos mezclados o estás metiendo instrucciones de herramienta que deberían ir en un documento aparte.",
      },
      {
        question: "¿Cada cuánto hay que actualizar la documentación de procesos?",
        answer:
          "Fija una revisión cada 6 o 12 meses y además cada vez que el proceso falle o cambie una herramienta. La fecha de próxima revisión debe estar en la propia ficha y con un responsable.",
      },
    ],
  },
};
