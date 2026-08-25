import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "gestion-proyectos-freelancers",
  title: "Gestión de proyectos para freelancers",
  excerpt:
    "Un freelancer no necesita un PMO. Necesita alcance cerrado, un canal con el cliente y un tope de trabajo en curso. El sistema mínimo que evita el caos.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-06-14",
  readingTime: "10 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  related: [
    "gestionar-varios-proyectos-a-la-vez",
    "gestionar-proyectos-con-clientes",
    "plantillas-gestion-proyectos",
    "gestion-de-proyectos-guia-completa",
  ],
  seo: {
    title: "Gestión de proyectos para freelancers | Hito",
    description:
      "Gestión de proyectos para freelancers: alcance escrito, un canal con el cliente y un tope de WIP. El sistema mínimo para varios clientes sin caos.",
    ogImageAlt:
      "Gestión de proyectos para freelancers: alcance, canal único y tope de WIP.",
  },
  content: {
    eyebrow: "Por rol",
    intro: (
      <>
        <strong>En una línea:</strong> la{" "}
        <strong>gestión de proyectos para freelancers</strong> no es un PMO en miniatura — es
        alcance cerrado por escrito, un canal con cada cliente y un tope de trabajo en curso.
        Sin esas tres piezas, varios clientes a la vez se vuelven scope creep no cobrado, un
        estado que nunca se comunica y el ciclo de saturación y sequía.
      </>
    ),
    sections: [
      {
        heading: "El caos freelance no es falta de app",
        body: (
          <>
            <p>
              El dolor se parece aunque cambie el oficio: tres clientes “activos”, un cuarto
              que pide “una cosa rápida”, ningún hábito de status y un alcance que se estira
              porque nombrar el costo se siente agresivo. No es falta de disciplina: es un
              sistema que nunca se escribió.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Cada cliente cree que es tu única prioridad — y el silencio se lo confirma.</li>
              <li>El extra entra por WhatsApp, se hace “esta vez” y no se factura.</li>
              <li>No hay ritual de estado: el cliente pregunta, tú improvisas.</li>
              <li>En demanda aceptas todo; en sequía no hay pipeline porque estabas ejecutando.</li>
            </ul>
            <p>
              Un freelancer no necesita la{" "}
              <Link
                to="/blogs/gestion-de-proyectos-guia-completa"
                className="underline underline-offset-2"
              >
                guía completa de gestión de proyectos
              </Link>{" "}
              para armar un departamento. Necesita un sistema mínimo que proteja alcance,
              atención y cobro.
            </p>
          </>
        ),
      },
      {
        heading: "Alcance escrito: kickoff y charter lite",
        body: (
          <>
            <p>
              El scope creep no cobrado es el impuesto silencioso del freelance. Se combate con
              una línea escrita entre lo que entra y lo que no, acordada <em>antes</em> de
              ejecutar. El detalle está en{" "}
              <Link
                to="/blogs/alcance-de-proyecto-scope-creep"
                className="underline underline-offset-2"
              >
                alcance de proyecto y scope creep
              </Link>
              ; acá basta un charter lite de una página:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-muted-foreground">
              <li>Objetivo en una frase: qué queda listo cuando el proyecto termina.</li>
              <li>Qué entra — entregables concretos, no “acompañamiento”.</li>
              <li>Qué no entra — la lista que más dinero ahorra.</li>
              <li>Canal único y frecuencia de status.</li>
              <li>Quién aprueba del lado del cliente (una persona, no “el equipo”).</li>
              <li>Qué pasa si algo cambia: costo, fecha o recorte, nombrado de antemano.</li>
            </ol>
            <p>
              El kickoff puede durar 20 minutos; esos seis puntos se confirman por escrito en
              el canal principal. Change request, cuello de botella del cliente y cierre:{" "}
              <Link
                to="/blogs/gestionar-proyectos-con-clientes"
                className="underline underline-offset-2"
              >
                proyectos con clientes externos
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Un tablero por cliente, o uno con etiqueta",
        body: (
          <>
            <p>
              Hay dos diseños que funcionan. El error es no elegir ninguno y dejar pedidos
              sueltos en notas, mails y chats.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Un tablero por cliente</strong> si hay confidencialidad, ritmos distintos
                o un cliente que mira el tablero. Cada frente tiene su alcance y su canal.
              </li>
              <li>
                <strong>Un tablero con etiqueta de cliente</strong> si trabajas solo y el dolor
                es no ver el portafolio. El filtro por cliente reemplaza los 6 tableros que no
                vas a mantener.
              </li>
            </ul>
            <p>
              En ambos casos hace falta una vista de portafolio (activo / espera / próximo
              hito). Sin ella, gestionar varios clientes es reaccionar al último mensaje.
              Cómo se arma está en{" "}
              <Link
                to="/blogs/gestionar-varios-proyectos-a-la-vez"
                className="underline underline-offset-2"
              >
                gestionar varios proyectos a la vez
              </Link>
              . Kickoff, status y cierre convienen como plantilla —{" "}
              <Link
                to="/blogs/plantillas-gestion-proyectos"
                className="underline underline-offset-2"
              >
                plantillas de gestión de proyectos
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Tope de WIP: dos clientes activos",
        body: (
          <>
            <p>
              La capacidad de un freelancer es una sola cola de atención. Un tercer frente
              “activo” no suma ingresos: alarga los dos primeros. El tope práctico:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>2 clientes en foco profundo</strong> esta semana (reciben bloques de
                medio día, no 12 saltos de 20 minutos).
              </li>
              <li>
                El resto queda en <strong>espera, mantenimiento o propuesta</strong> — explícito,
                no “un ratito cada día”.
              </li>
              <li>
                <strong>Regla de entrada:</strong> no se abre un cliente nuevo sin cerrar, pausar
                o recortar otro.
              </li>
            </ul>
            <p>
              Es un límite de WIP a nivel portafolio, no solo de tarjetas. Por qué bajarlo
              acelera la entrega:{" "}
              <Link
                to="/blogs/reducir-trabajo-en-curso"
                className="underline underline-offset-2"
              >
                reducir el trabajo en curso
              </Link>
              . Si hay más demanda que capacidad, prioriza con un criterio escrito (
              <Link to="/blogs/como-priorizar-tareas" className="underline underline-offset-2">
                cómo priorizar tareas
              </Link>
              ) en vez de decir que sí al que escribe primero.
            </p>
          </>
        ),
      },
      {
        heading: "Status semanal de 5 líneas",
        body: (
          <>
            <p>
              El hábito que más confianza compra: un status corto, el mismo día cada semana,
              aunque “no haya novedades”. Cinco líneas alcanzan:
            </p>
            <p className="rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              1) Qué se entregó esta semana. 2) Qué está en curso. 3) Qué está bloqueado y de
              quién depende. 4) Próximo hito y fecha. 5) Una decisión o riesgo que el cliente
              tiene que ver.
            </p>
            <p>
              Ese texto reemplaza la llamada de “cómo vamos” y deja historial. El formato
              largo está en{" "}
              <Link
                to="/blogs/informe-de-estado-semanal"
                className="underline underline-offset-2"
              >
                informe de estado semanal en 5 líneas
              </Link>
              . Se manda aunque la semana haya sido corta: el silencio se lee como atraso.
            </p>
          </>
        ),
      },
      {
        heading: "Sistema mínimo en una tarde",
        body: (
          <>
            <p>
              No diseñes un proceso de agencia. En una tarde puedes dejar el sistema corriendo:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Pieza</th>
                  <th className="py-2 font-semibold">Qué queda listo hoy</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Inventario</td>
                  <td className="py-2 text-muted-foreground">
                    Clientes: activo, en espera, propuesta. Máximo 2 activos.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Tablero</td>
                  <td className="py-2 text-muted-foreground">
                    Por cliente o uno con etiqueta. Por hacer / en curso / bloqueado / hecho.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Charter lite</td>
                  <td className="py-2 text-muted-foreground">
                    Una página: entra / no entra / canal / aprobador.
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">Canal</td>
                  <td className="py-2 text-muted-foreground">
                    Un hilo por cliente. Todo cambio de alcance se confirma ahí.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Ritual</td>
                  <td className="py-2 text-muted-foreground">
                    30 min el mismo día: status de 5 líneas + revisar el tope de WIP.
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        heading: "Errores que reabren el caos",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>“Una cosa rápida”</strong> de un tercer cliente sin pausar otro: es un
                frente activo con otro nombre.
              </li>
              <li>
                <strong>Absorber el cambio en silencio</strong> para “cuidar la relación”: se
                cuida nombrando el trade-off, no regalando horas.
              </li>
              <li>
                <strong>Saltarse el status</strong> las semanas tranquilas: el hábito se rompe
                justo cuando más lo vas a necesitar.
              </li>
              <li>
                <strong>Una herramienta distinta por cliente</strong> sin vista de portafolio.
              </li>
            </ul>
            <p>
              El sistema mínimo no te hace un PM de empresa. Te hace un freelancer que cierra
              alcance, cobra lo extra y no tiene seis frentes a medias.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Sistema mínimo freelance en una tarde",
      steps: [
        {
          name: "Inventariar clientes y fijar 2 activos",
          text: "Lista activos, en espera y propuestas. Elige máximo 2 en foco profundo esta semana; el resto queda explícitamente en espera.",
        },
        {
          name: "Armar el tablero",
          text: "Un tablero por cliente o uno solo con etiqueta de cliente. Columnas mínimas: por hacer, en curso, bloqueado, hecho.",
        },
        {
          name: "Escribir el charter lite",
          text: "Una página por cliente activo: objetivo, qué entra, qué no entra, canal, quién aprueba y qué pasa si algo cambia.",
        },
        {
          name: "Definir el canal único",
          text: "Todo pedido que cambia alcance o fecha se confirma en ese canal, aunque haya nacido en una llamada o un mensaje suelto.",
        },
        {
          name: "Agendar el status de 5 líneas",
          text: "El mismo día cada semana: qué se entregó, qué sigue, qué está bloqueado, próximo hito y un riesgo o decisión. Sin excepción.",
        },
      ],
    },
    faq: [
      {
        question: "¿Un freelancer necesita un software de gestión de proyectos?",
        answer:
          "Necesita un sistema, no una suite. Alcance escrito, un canal por cliente, un tope de 2 frentes activos y un status semanal caben en un tablero simple. La app es secundaria: sin esas cuatro piezas, cualquier herramienta se llena de tarjetas y el caos sigue.",
      },
      {
        question: "¿Cuántos clientes activos debería tener un freelancer?",
        answer:
          "Dos en foco profundo es el tope que suele funcionar. Puedes tener más en espera, mantenimiento o propuesta, pero si tres clientes reciben bloques de trabajo la misma semana, estás pagando cambio de contexto y alargando las entregas de los tres.",
      },
      {
        question: "¿Cómo digo que no a un cambio de alcance sin perder al cliente?",
        answer:
          "No digas \"no\": nombra el trade-off. \"Podemos sumarlo; implica mover la fecha X días o sacar Y de este ciclo\". Casi siempre el cliente prioriza cuando ve el costo. Confírmalo por escrito en el canal principal antes de empezar a trabajar en el extra.",
      },
      {
        question: "¿Mejor un tablero por cliente o uno solo?",
        answer:
          "Uno por cliente si hay confidencialidad o el cliente mira el tablero. Uno solo con etiqueta si trabajas solo y el dolor es no ver el portafolio. Lo que no funciona es no elegir y dejar pedidos repartidos entre chat, mail y notas.",
      },
      {
        question: "¿Qué pongo en el informe de estado semanal?",
        answer:
          "Cinco líneas: qué se entregó, qué está en curso, qué está bloqueado y de quién depende, el próximo hito con fecha, y una decisión o riesgo. Se manda el mismo día cada semana, también cuando \"no hay novedades\".",
      },
    ],
  },
};
