import type { BlogArticle } from "../../types";

export const article: BlogArticle = {
  slug: "hito-vs-clickup",
  title: "Hito vs ClickUp: comparativa honesta",
  excerpt:
    "ClickUp es más completo, pero no es gratis de verdad ni es local-first. Comparativa honesta de precio, IA y privacidad para elegir bien.",
  category: "comparativas",
  categoryLabel: "Comparativas",
  publishedAt: "2026-08-31",
  readingTime: "14 min",
  featured: false,
  seo: {
    title: "Hito vs ClickUp: comparativa honesta (2026) | Hito",
    description:
      "ClickUp es más completo, pero no es gratis de verdad ni es local-first. Comparativa honesta de precio, IA y privacidad para elegir bien.",
    ogImageAlt: "Comparativa honesta Hito vs ClickUp 2026.",
  },
  content: {
    eyebrow: "Comparativas",
    intro: (
      <>
        <strong>En una línea:</strong> ClickUp es más completo que Hito — más vistas, más
        integraciones nativas y una IA (Brain) mucho más avanzada. Pero esa profundidad tiene
        precio: el plan gratis de ClickUp limita el storage a 60MB, y la IA es un add-on aparte
        desde 9 USD/usuario/mes. Hito es la alternativa cuando lo que buscas es privacidad real
        (todo local, sin backend), un modelo gratis sin límites y una IA opcional que tú
        controlas con tu propia API key. No es un reemplazo directo — es la opción correcta para
        un perfil distinto.
      </>
    ),
    sections: [
      {
        heading: "La respuesta rápida",
        body: (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left">
                <th className="py-2 pr-4 font-semibold">Si tu prioridad es…</th>
                <th className="py-2 font-semibold">Elige</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">
                  Profundidad de features (Gantt, whiteboards, +15 vistas)
                </td>
                <td className="py-2">ClickUp</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">
                  Privacidad total y datos que nunca salen de tu equipo
                </td>
                <td className="py-2 font-semibold">Hito</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">Un plan gratis sin límite de almacenamiento</td>
                <td className="py-2 font-semibold">Hito</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">
                  IA con memoria persistente, múltiples modelos y agentes
                </td>
                <td className="py-2">ClickUp</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">
                  IA opcional, con tu propia API key, sin costo de licencia
                </td>
                <td className="py-2 font-semibold">Hito</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">
                  Integraciones nativas con cientos de apps (Slack, Jira, Salesforce…)
                </td>
                <td className="py-2">ClickUp</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">
                  Certificaciones enterprise (SOC 2, HIPAA, SAML SSO)
                </td>
                <td className="py-2">ClickUp</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4">
                  Equipos chicos o sensibles a datos (legal, salud, consultoría)
                </td>
                <td className="py-2 font-semibold">Hito</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Onboarding con documentación y comunidad masivas</td>
                <td className="py-2">ClickUp</td>
              </tr>
            </tbody>
          </table>
        ),
      },
      {
        heading: "Tabla comparativa completa",
        body: (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left">
                <th className="py-2 pr-4 font-semibold">Característica</th>
                <th className="py-2 pr-4 font-semibold">Hito</th>
                <th className="py-2 font-semibold">ClickUp</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">Modelo de datos</td>
                <td className="py-2 pr-4">Local-first (archivos JSON en tu equipo)</td>
                <td className="py-2">Cloud-first (servidores de ClickUp)</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">Plan gratis</td>
                <td className="py-2 pr-4">Gratis para siempre, sin límites</td>
                <td className="py-2">
                  "Free Forever": 60MB de storage, 5 spaces, límites en custom fields y Gantt
                </td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">Plan de pago</td>
                <td className="py-2 pr-4">No existe — todo el producto es gratis</td>
                <td className="py-2">
                  Unlimited $7/usuario/mes · Business $12/usuario/mes · Enterprise a medida
                </td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">IA</td>
                <td className="py-2 pr-4">
                  Asistente con function calling + RAG local (Gemini, tu API key)
                </td>
                <td className="py-2">
                  ClickUp Brain: add-on aparte, $9/usuario/mes (Brain AI) o $28/usuario/mes
                  (Everything AI)
                </td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">Vistas</td>
                <td className="py-2 pr-4">Kanban, checklists, procesos/SOPs</td>
                <td className="py-2">
                  +15 vistas: Gantt, whiteboards, mind maps, timeline, workload, dashboards
                </td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">Integraciones nativas</td>
                <td className="py-2 pr-4">
                  HubSpot, Google Sheets, webhooks entrantes/salientes
                </td>
                <td className="py-2">
                  Cientos: Slack, Jira, Salesforce, Google Drive, HubSpot, Zapier y más
                </td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">Automatizaciones</td>
                <td className="py-2 pr-4">
                  Constructor visual de flujos (canvas), sin límite de uso
                </td>
                <td className="py-2">
                  100/mes en Free, 5.000/mes en Business, 250.000/mes en Enterprise
                </td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">Cuenta requerida</td>
                <td className="py-2 pr-4">No</td>
                <td className="py-2">Sí</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">Funciona offline</td>
                <td className="py-2 pr-4">Sí, nativo (PWA)</td>
                <td className="py-2">Limitado</td>
              </tr>
              <tr className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">Código abierto</td>
                <td className="py-2 pr-4">Sí (MIT)</td>
                <td className="py-2">No</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Certificaciones compliance</td>
                <td className="py-2 pr-4">No aplica (no hay servidor que certificar)</td>
                <td className="py-2">SOC 2, ISO 27001, GDPR, HIPAA</td>
              </tr>
            </tbody>
          </table>
        ),
      },
      {
        heading: "Dónde gana ClickUp",
        body: (
          <>
            <p>
              Hay que decirlo con claridad: si necesitas una plataforma "todo en uno" con la
              máxima profundidad de features, ClickUp gana en casi cualquier comparación directa
              de funcionalidad.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              1. Profundidad de producto
            </h3>
            <p>
              ClickUp tiene más de 15 vistas (Gantt, whiteboards, mind maps, workload,
              timeline), dashboards avanzados y reporting de sprints. Hito cubre kanban,
              checklists y procesos/SOPs — suficiente para gestión de proyectos y equipos, pero
              no compite en amplitud con una suite que lleva más de una década construyendo
              features.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              2. Ecosistema de integraciones
            </h3>
            <p>
              ClickUp se integra nativamente con cientos de herramientas: Slack, Jira,
              Salesforce, Google Drive, HubSpot, y su propio marketplace. Hito hoy tiene
              integraciones nativas con HubSpot y Google Sheets, más webhooks genéricos que te
              permiten conectar con Zapier o Make — funcional, pero mucho más acotado.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              3. ClickUp Brain: la IA más ambiciosa de las dos
            </h3>
            <p>
              ClickUp relanzó su IA como{" "}
              <a href="https://clickup.com/brain" target="_blank" rel="noopener noreferrer">
                "Brain 2"
              </a>{" "}
              en junio de 2026, con memoria persistente (recuerda cómo escribes un reporte y lo
              replica), ruteo automático entre modelos (Claude, GPT, Gemini según la tarea) y
              "Super Agents" que aparecen como usuarios reales en el workspace, asignables y
              programables. Es, en términos de capacidad bruta, más avanzada que el asistente de
              Hito.
            </p>
            <p>
              El costo de esa potencia: es un add-on separado del plan base, desde 9
              USD/usuario/mes (Brain AI) hasta 28 USD/usuario/mes (Everything AI, con notetaker,
              generación de imágenes y agentes completos). Y tus datos viajan a los servidores
              de ClickUp y a los proveedores de modelos que ellos eligen enrutar.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              4. Compliance de nivel enterprise
            </h3>
            <p>
              SOC 2, ISO 27001, GDPR y HIPAA compliant, con SAML SSO, SCIM y audit log en el
              plan Enterprise. Para organizaciones grandes con requisitos formales de auditoría
              de un proveedor cloud, esto es un checkbox que Hito no ofrece — porque, al no
              haber servidor, no hay nada que certificar de esa forma.
            </p>
          </>
        ),
      },
      {
        heading: "Dónde gana Hito",
        body: (
          <>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              1. El plan gratis es gratis de verdad
            </h3>
            <p>
              Esta es la diferencia más concreta y menos discutible. El{" "}
              <a href="https://clickup.com/pricing" target="_blank" rel="noopener noreferrer">
                "Free Forever" de ClickUp
              </a>{" "}
              te da 60MB de storage — una cifra que un equipo real agota rápido con adjuntos,
              imágenes y documentos. Pasar a Unlimited ($7/usuario/mes) o Business
              ($12/usuario/mes) es casi inevitable en cuanto el equipo crece.
            </p>
            <p>
              Hito no tiene ese techo. Es open source (MIT), gratis para siempre, sin límite de
              storage, sin límite de usuarios y sin ningún plan superior esperando en la
              esquina.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              2. Privacidad: sin servidor que auditar
            </h3>
            <p>
              ClickUp resuelve el compliance con certificaciones sobre su propia infraestructura
              cloud (SOC 2, HIPAA). Hito resuelve la misma preocupación de forma distinta: no
              hay servidor al que conectarse. Tus proyectos son archivos <code>.json</code> en
              tu equipo —{" "}
              <a
                href="https://hito.autos/blogs/local-first-guia-definitiva-2026"
                target="_blank"
                rel="noopener noreferrer"
              >
                local-first
              </a>{" "}
              por diseño, no por certificación externa.
            </p>
            <p>
              Para estudios jurídicos, consultoras o equipos de salud, esto cambia la pregunta
              de "¿confío en las certificaciones de este proveedor?" a "no hay proveedor que
              necesite mi confianza".
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              3. IA opcional, sin costo de licencia
            </h3>
            <p>
              El asistente de Hito usa function calling nativo sobre unas 40 herramientas con
              Gemini, más{" "}
              <a
                href="https://hito.autos/blogs/que-es-mcp"
                target="_blank"
                rel="noopener noreferrer"
              >
                RAG local
              </a>{" "}
              sobre tu workspace. Tú traes tu propia API key de Google AI Studio, así que pagas
              directamente el uso de la API — sin el margen de un add-on de 9 a 28 USD por
              usuario que cobra ClickUp encima del costo del modelo. Y si no quieres activar el
              asistente, el resto de Hito funciona 100% local, sin que un solo byte salga de tu
              equipo.
            </p>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              4. Simplicidad para equipos chicos
            </h3>
            <p>
              ClickUp está diseñado para escalar a organizaciones grandes con estructuras
              complejas. Esa misma potencia puede ser fricción para un equipo de 3 a 15 personas
              que solo necesita proyectos, checklists y procesos claros, sin configurar 15
              vistas distintas.
            </p>
          </>
        ),
      },
      {
        heading: "¿Cuál elegir según tu caso?",
        body: (
          <>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              🎯 Elige ClickUp si…
            </h3>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                Necesitas la mayor profundidad de features posible: Gantt, whiteboards,
                dashboards avanzados, reporting de sprints.
              </li>
              <li>
                Tu organización requiere certificaciones formales (SOC 2, HIPAA, SAML SSO) sobre
                la infraestructura del proveedor.
              </li>
              <li>
                Quieres la IA más potente disponible hoy en gestión de proyectos, y el costo del
                add-on no es un problema.
              </li>
              <li>
                Tu flujo depende de integraciones nativas con un stack amplio (Slack, Jira,
                Salesforce).
              </li>
            </ul>
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              🎯 Elige Hito si…
            </h3>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                La privacidad no es negociable y prefieres que no exista un servidor con tus
                datos, en lugar de confiar en las certificaciones de uno.
              </li>
              <li>
                Quieres un plan gratis que sea gratis de verdad, sin límite de storage ni de
                usuarios.
              </li>
              <li>
                Tu equipo es chico o mediano y no necesita la profundidad completa de una suite
                enterprise.
              </li>
              <li>
                Prefieres pagar tú directamente el uso de la IA (tu API key) en lugar de un
                add-on con margen.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Conclusión",
        body: (
          <>
            <p>
              ClickUp y Hito no están resolviendo el mismo problema. ClickUp apuesta por ser la
              suite más completa del mercado, con el precio y la complejidad que eso conlleva.
              Hito apuesta por privacidad real y un modelo gratis sin letra pequeña, a cambio de
              menos profundidad de producto.
            </p>
            <p>
              Si tu prioridad es la privacidad, el costo real a largo plazo o simplemente no
              depender de un servidor ajeno, vale la pena probar Hito. Si necesitas la suite más
              completa del mercado y el presupuesto lo permite, ClickUp sigue siendo una opción
              sólida.
            </p>
            <p>
              <strong>La mejor forma de decidir es probarlo.</strong> Hito se instala en
              segundos, no requiere cuenta y tus proyectos se guardan en tu equipo, sin límites
              de storage ni de usuarios.
            </p>
            <p>
              👉{" "}
              <a href="https://hito.autos/" target="_blank" rel="noopener noreferrer">
                <strong>Prueba Hito gratis</strong>
              </a>{" "}
              — gestor de proyectos, procesos y checklists 100% local-first, open source (MIT).
              Sin cuenta, sin nube, sin suscripción.
            </p>
          </>
        ),
      },
    ],
  },
};
