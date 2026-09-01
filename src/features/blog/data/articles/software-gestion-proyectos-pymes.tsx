import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "software-gestion-proyectos-pymes",
  title: "Software de gestión de proyectos para pymes: criterios reales",
  excerpt:
    "Una pyme no necesita un PPM. Criterios de costo a 12 meses, adopción y datos de clientes para elegir software de gestión de proyectos sin inflar asientos.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2026-08-20",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "software-gestion-proyectos",
  related: [
    "software-gestion-proyectos",
    "gestion-proyectos-agencias",
    "gestion-proyectos-freelancers",
  ],
  seo: {
    title: "Software de gestión de proyectos para pymes | Hito",
    description:
      "Software de gestión de proyectos para pymes: costo real a 12 meses, curva de adopción, datos de clientes y lo que una pyme de 5–30 personas no necesita.",
    ogImageAlt: "Criterios para elegir software de gestión de proyectos en una pyme.",
  },
  content: {
    eyebrow: "Software",
    intro: (
      <>
        <strong>En una línea:</strong> el{" "}
        <strong>software de gestión de proyectos para pymes</strong> no es un PPM recortado. Es
        lo que un equipo de 5 a 30 personas adopta, paga 12 meses y usa con datos de clientes. El
        criterio no es más vistas: es costo real, curva de adopción y quién es dueño de la
        información.
      </>
    ),
    sections: [
      {
        heading: "Por qué el Excel compartido se rompe",
        body: (
          <>
            <p>
              Una pyme de 12 no empieza el año buscando software. Empieza con una hoja compartida:
              una pestaña por cliente, una columna de estado, el nombre de quien “lleva” cada fila.
              Funciona mientras una sola persona actualiza. Se rompe el viernes en que hay tres
              copias, dos fórmulas que nadie toca y un cliente cuyo nombre viajó por correo en el
              archivo.
            </p>
            <p>
              El quiebre no es falta de disciplina. Es que Excel (o Sheets) no es un flujo de
              trabajo: es una tabla. No impide que dos personas editen la misma fila, no tiene
              dueño por tarjeta, no guarda el comentario del cambio de alcance y no te dice cuántas
              cosas están “en curso” de verdad. El detalle de cuándo la hoja alcanza y cuándo no
              está en{" "}
              <Link
                to="/blogs/gestion-proyectos-excel"
                className="underline underline-offset-2"
              >
                gestión de proyectos en Excel
              </Link>
              ; acá basta el síntoma de pyme: el archivo se volvió el sistema operativo de la
              empresa y ya nadie confía en cuál es la última versión.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Tres personas editan; el dueño sigue preguntando “¿cómo va?” porque la hoja no
                responde sola.
              </li>
              <li>
                Los datos del cliente (alcance, mails, montos) viven en un archivo que se reenvía
                “para que lo veas”.
              </li>
              <li>
                El intern que armó las fórmulas se fue y nadie se anima a tocar la columna G.
              </li>
              <li>
                Hay un tablero “de prueba” en alguna app y la hoja sigue siendo la fuente de
                verdad: dos sistemas, ninguna verdad.
              </li>
            </ul>
            <p>
              Pasar a un{" "}
              <Link
                to="/blogs/software-gestion-proyectos"
                className="underline underline-offset-2"
              >
                software de gestión de proyectos
              </Link>{" "}
              no es “profesionalizarse”. Es dejar de gestionar el archivo y volver a gestionar el
              trabajo. El error típico es saltar de esa hoja a una suite pensada para 200 personas
              con SSO, 15 vistas y un precio por asiento que duele a los 12 meses.
            </p>
          </>
        ),
      },
      {
        heading: "Cuatro criterios: costo a 12 meses, curva, datos y dueño",
        body: (
          <>
            <p>
              Una demo de 20 minutos no elige herramienta. Estos cuatro criterios sí, porque se
              pueden escribir en una hoja (sí: una, de una página) antes de pagar el primer mes.
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Criterio</th>
                  <th className="py-2 pr-4 font-semibold">Qué medir a 12 meses</th>
                  <th className="py-2 font-semibold">Señal de que no encaja</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Costo a 12 meses</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Asientos × 12, más onboarding, más invitados, más el plan al que te suben
                    cuando pides un permiso extra.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Pagas 12 asientos y entran 7. El comercial, el contable y dos de obra nunca
                    abren la app.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Curva de adopción</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Días hasta que 8 de 12 actualizan el tablero sin que se lo recuerden en el
                    grupo.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Hace falta un “campeón” permanente. Si esa persona se va de vacaciones, el
                    tablero se pudre.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Datos de clientes</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Dónde viven nombres, contratos, comentarios y archivos; si puedes exportar
                    todo; qué pasa al cancelar.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El export es un CSV manco o un “contáctanos”. Los datos del cliente quedan en
                    un servidor que no elegiste.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Dueño</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Quién paga, quién configura, quién puede apagar la cuenta y llevarse el
                    archivo.
                  </td>
                  <td className="py-2 text-muted-foreground">
                    El único que sabe exportar es el vendedor de la herramienta. La pyme no es
                    dueña de su historial.
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El costo a 12 meses es el que miente menos. Una pyme de 12 a 10–15 dólares por
              asiento al mes está en 1.440–2.160 dólares al año antes de invitados, almacenamiento
              y el upgrade que llega cuando pides campos personalizados. Si cuatro personas no
              entran nunca, no es “capacidad de sobra”: es impuesto por cabeza. Una agencia de 8
              con freelancers puntuales paga ese impuesto dos veces: asientos fijos más invitados
              que duran un proyecto.
            </p>
            <p>
              Datos de clientes no es un tema de grandes empresas. En una consultora de 12, el
              tablero tiene nombres de cuentas, montos, retrasos y comentarios que no deberían
              viajar a un espacio de trabajo ajeno “porque el plan incluye IA”. Pregunta dónde
              vive el archivo, en qué formato sales y si la herramienta existe sin tu cuenta. Si
              la respuesta es vaga, el criterio de dueño ya falló.
            </p>
          </>
        ),
      },
      {
        heading: "Encaje por tipo: servicios, producto u obra ligera",
        body: (
          <>
            <p>
              El mismo equipo de 12 no necesita lo mismo si vende horas, un producto o una obra
              chica. El error es comprar “el software de gestión de proyectos” genérico y
              rellenar 15 vistas que nadie abre. Encaja por el flujo, no por el brochure.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Servicios (consultora de 12, agencia de 8).</strong> El dolor es
                portafolio: varias cuentas, gente compartida, un cliente que pide status. Hace
                falta tablero por cuenta o un tablero con etiqueta, un dueño de alcance y un
                tope de frentes. El oficio de agencia —WIP por disciplina, retainer vs.
                proyecto— está en{" "}
                <Link
                  to="/blogs/gestion-proyectos-agencias"
                  className="underline underline-offset-2"
                >
                  gestión de proyectos para agencias
                </Link>
                ; el de quien trabaja solo, en{" "}
                <Link
                  to="/blogs/gestion-proyectos-freelancers"
                  className="underline underline-offset-2"
                >
                  gestión de proyectos para freelancers
                </Link>
                . Una pyme de servicios está en el medio: ya no es una persona, todavía no es un
                PMO.
              </li>
              <li>
                <strong>Producto.</strong> Un backlog, un ritmo de entrega y pocos frentes
                abiertos alcanzan. No hace falta un PPM ni un Gantt de 40 filas si el equipo
                cabe en una mesa. Lo que sí hace falta: un lugar donde “en curso” tenga dueño y
                fecha, y donde el extra no entre por chat.
              </li>
              <li>
                <strong>Obra ligera</strong> (instalación, reforma, montaje; no un ERP de
                construcción). Proveedores, visitas a sitio y un hito de entrega. El software
                tiene que sobrevivir a gente que actualiza desde el celular y a un dueño que no
                va a hacer sprint planning. Columnas simples, responsables y una fecha que se
                vea sin abrir un informe.
              </li>
            </ul>
            <p>
              En los tres casos el techo es el mismo: 5 a 30 personas, un administrador que no
              es de IT, y clientes cuyos datos no deberían quedar rehenes de un plan anual. Si
              tu flujo no aparece en esa lista —salud regulada, 50+ personas, varios países con
              SSO— este artículo no es el tuyo: estás eligiendo otra categoría.
            </p>
          </>
        ),
      },
      {
        heading: "Lo que una pyme no necesita: SSO, PPM ni 15 vistas",
        body: (
          <>
            <p>
              El mercado vende software de empresa como si fuera el único software serio. Para
              una pyme de 12, esa seriedad es ruido. Recorta sin culpa:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>SSO / SAML / SCIM.</strong> Útil cuando hay un directorio corporativo y
                un equipo de IT. En una pyme de 12, el “directorio” es el grupo de WhatsApp y el
                mail del dueño. Pagar el plan Enterprise para un login único es teatro de
                seguridad.
              </li>
              <li>
                <strong>SOC 2, ISO y cuestionarios de 40 páginas</strong> como requisito para
                empezar. Si un cliente grande te los pide, es un proyecto comercial, no un
                requisito de tu tablero interno. No elijas la herramienta de 50+ personas “por
                si acaso el auditor aparece”.
              </li>
              <li>
                <strong>PPM (project portfolio management)</strong> con programas, portafolios y
                dependencias entre 80 iniciativas. Tú tienes 6 a 15 proyectos vivos, no una
                oficina de proyectos. Una vista de portafolio (activo / espera / próximo hito)
                no es un PPM.
              </li>
              <li>
                <strong>Quince vistas.</strong> Gantt, timeline, carga, calendario, mapa mental,
                box, carga por persona, dashboard ejecutivo. Si el equipo no las abre en 30
                días, no las estabas necesitando: las estabas comprando. Un tablero, una lista y
                un lugar para el alcance cubren a la pyme de 12.
              </li>
              <li>
                <strong>Un PMO y un administrador a tiempo completo.</strong> Si la herramienta
                exige un “ops de ClickUp” para no romperse, la curva de adopción ya perdió.
              </li>
            </ul>
            <p>
              Lo que sí necesitas cabe en una frase: tareas con dueño, un tablero que se
              actualice, alcance escrito, datos que puedes llevarte. Todo lo demás es el plan
              que el vendedor necesita vender, no el que la pyme necesita pagar 12 meses.
            </p>
          </>
        ),
      },
      {
        heading: "Adopción en 30 días (sin teatro de transformación)",
        body: (
          <>
            <p>
              El software que “vamos a implementar en el Q3” es el que nunca se usa. Una pyme de
              12 adopta en un mes o no adopta. El piloto no es un sandbox con tareas de ejemplo:
              es un proyecto real, con cliente y fecha.
            </p>
            <p>
              <strong>Semana 1.</strong> Elige un proyecto (no cinco) y tres personas: quien
              dirige, quien ejecuta, quien habla con el cliente. Columnas mínimas: por hacer /
              en curso / bloqueado / hecho. Un dueño por tarjeta. Nada de “vamos a configurar
              los dashboards”.
            </p>
            <p>
              <strong>Semana 2.</strong> Mueve lo activo de la hoja a ese tablero. La hoja queda
              como archivo, no como sistema: solo lectura, o presupuesto y cosas que sí viven
              en tabla. Si alguien actualiza las dos, no hay adopción — hay doble carga.
            </p>
            <p>
              <strong>Semana 3.</strong> Ritual corto, el mismo día: qué se entregó, qué está
              bloqueado, qué se abre la semana que viene. Si el dueño sigue preguntando estado
              por chat, el tablero no es la fuente de verdad todavía. Congela el Excel en
              público, no en un mail que nadie lee.
            </p>
            <p>
              <strong>Semana 4.</strong> Segundo proyecto, mismas reglas. Si 8 de 12 ya
              actualizan sin que se lo recuerden, escalas. Si el tablero se llenó de columnas
              que nadie usa, recorta, no “capacites más”. A los 30 días decides por escrito:
              nos quedamos, cambiamos o volvemos a la hoja con los ojos abiertos.
            </p>
            <p>
              Si después de ese mes el criterio de costo, datos y dueño te deja en un gestor
              local-first —tablero, procesos y checklists en tu equipo, sin asientos, con los
              datos en JSON que puedes copiar—,{" "}
              <a
                href="https://hito.autos/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Hito
              </a>{" "}
              está pensado para equipos de 1 a 15, no para un PMO de 50 con SSO.
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
              — gestor de proyectos local-first: kanban, SOPs y automatizaciones en tu equipo,
              IA opcional, PWA. Sin cuenta, sin asientos, sin nube.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo adoptar un software de gestión de proyectos en una pyme en 30 días",
      steps: [
        {
          name: "Semana 1: un proyecto piloto y tres personas",
          text: "Elige un proyecto real (con cliente y fecha) y tres usuarios: quien dirige, quien ejecuta y quien habla con el cliente. Columnas mínimas: por hacer, en curso, bloqueado, hecho. Un dueño por tarjeta. No configures dashboards ni 15 vistas.",
        },
        {
          name: "Semana 2: una sola fuente de verdad",
          text: "Mueve lo activo de la hoja al tablero. Deja Excel o Sheets como archivo de presupuesto o consulta, no como sistema. Si alguien actualiza las dos herramientas, el piloto ya falló.",
        },
        {
          name: "Semana 3: ritual semanal y Excel congelado",
          text: "El mismo día cada semana: qué se entregó, qué está bloqueado, qué se abre. Congela la hoja en público (solo lectura). El chat deja de ser el canal de estado.",
        },
        {
          name: "Semana 4: segundo proyecto con las mismas reglas",
          text: "Replica el tablero en un segundo frente. No inventes un proceso nuevo. Si hace falta un campeón permanente para que la gente actualice, la curva de adopción no da.",
        },
        {
          name: "Día 30: decide por escrito",
          text: "Quédate, cambia o vuelve a la hoja. Mide asientos realmente usados, si puedes exportar los datos del cliente y si 8 de 12 actualizan sin recordatorio. Esa decisión es el criterio, no la demo del mes 1.",
        },
      ],
    },
    faq: [
      {
        question: "¿Qué software de gestión de proyectos le sirve a una pyme?",
        answer:
          "El que un equipo de 5 a 30 personas adopta en 30 días, paga 12 meses sin asientos muertos y te deja llevarte los datos del cliente. No el que tiene más vistas, SSO o un PPM. Tablero con dueños, alcance escrito y un export real ganan a cualquier suite de empresa recortada.",
      },
      {
        question: "¿Cuánto cuesta un software de gestión de proyectos para una pyme de 12 personas?",
        answer:
          "En SaaS por asiento, calcula usuarios × precio mensual × 12, más invitados y el upgrade que llega cuando pides un permiso extra. A 10–15 dólares por persona, una pyme de 12 está en 1.440–2.160 dólares al año antes de asientos que nadie usa. El número que importa es ese total a 12 meses, no el precio de lista del plan de entrada.",
      },
      {
        question: "¿Una pyme necesita Asana, Jira o un PPM?",
        answer:
          "Casi nunca. Jira y los PPM están pensados para equipos grandes, flujos de ingeniería o portafolios de decenas de programas. Asana y similares encajan mejor, pero el precio por asiento y las vistas de más suelen sobrar en una pyme de 12. Empieza por el flujo real; no por el logo que un cliente grande reconoce.",
      },
      {
        question: "¿Dónde deberían vivir los datos de clientes de una pyme?",
        answer:
          "En un lugar del que seas dueño: export completo (JSON o CSV de verdad), sin rehén al cancelar, y con nombres, montos y comentarios que no alimenten un modelo ajeno sin que lo decidas. En una consultora de 12 eso no es paranoia: es el archivo de las cuentas. Pregunta el export antes de pagar el mes 1.",
      },
      {
        question: "¿Cuánto tarda adoptar un software de gestión de proyectos en una pyme?",
        answer:
          "Si no hay adopción en 30 días con un proyecto real, no va a haberla en el Q3. Un piloto de tres personas, una sola fuente de verdad y un ritual semanal bastan para saber si la curva da. Capacitación eterna y 15 vistas el primer día son la receta para volver al Excel en silencio.",
      },
    ],
  },
};
