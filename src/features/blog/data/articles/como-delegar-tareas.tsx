import { Link } from "react-router-dom";
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index";

export const article: BlogArticle = {
  slug: "como-delegar-tareas",
  title: "Cómo delegar y dejar de ser el cuello de botella",
  excerpt:
    "Delegar no es soltar del todo ni microgestionar: son 3 niveles según cuánto confiás en la tarea. Con RACI para que quede claro quién decide qué.",
  category: "gestion-proyectos",
  categoryLabel: "Gestión de proyectos",
  publishedAt: "2027-03-01",
  readingTime: "9 min",
  featured: false,
  author: DEFAULT_AUTHOR,
  pillar: "gestionar-varios-proyectos-a-la-vez",
  related: [
    "matriz-raci",
    "seguimiento-de-tareas-equipo",
    "gestionar-varios-proyectos-a-la-vez",
    "proyecto-atrasado-que-hacer",
  ],
  seo: {
    title: "Cómo delegar y dejar de ser el cuello de botella | Hito",
    description:
      "Delegar no es soltar del todo ni microgestionar: son 3 niveles según cuánto confiás en la tarea. Con RACI para que quede claro quién decide qué.",
    ogImageAlt: "Cómo delegar tareas y dejar de ser el cuello de botella del equipo.",
  },
  content: {
    eyebrow: "Tips y problemas reales",
    intro: (
      <>
        <strong>En una línea:</strong> si todo pasa por vos antes de avanzar, no sos indispensable
        — sos un <strong>cuello de botella</strong>. Delegar bien no es un gesto de todo o nada:
        es elegir, tarea por tarea, uno de <strong>3 niveles de autonomía</strong> y dejarlo
        explícito con una matriz RACI simple, para que nadie tenga que adivinar cuánto puede
        decidir solo.
      </>
    ),
    sections: [
      {
        heading: "Por qué no delegás (aunque sabés que deberías)",
        body: (
          <>
            <p>Las razones reales rara vez son “no confío en mi equipo”. Suelen ser más chicas:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Explicar toma más tiempo que hacerlo:</strong> cierto la primera vez, falso
                a partir de la tercera.
              </li>
              <li>
                <strong>Miedo al error visible:</strong> si sale mal y lo hiciste vos, es tu error
                privado; si sale mal y lo delegaste, se siente más expuesto.
              </li>
              <li>
                <strong>Nunca definiste qué significa “bien hecho”:</strong> sin criterio claro, es
                más fácil hacerlo vos que explicar un estándar que ni vos tenés escrito.
              </li>
              <li>
                <strong>La tarea te da identidad:</strong> a veces no delegamos porque, sin esa
                tarea, no sabemos bien qué hacer con nuestro rol.
              </li>
            </ul>
            <p>
              Ninguna de estas razones escala. Un lead que no delega se convierte, sin darse
              cuenta, en la ruta crítica de todos los proyectos a la vez.
            </p>
          </>
        ),
      },
      {
        heading: "Los 3 niveles de delegación (no es todo o nada)",
        body: (
          <>
            <p>
              El error más común es pensar que delegar es binario: “lo hago yo” o “lo hace
              cualquiera sin supervisión”. En la práctica hay tres niveles, y elegir el correcto
              por tarea es lo que hace que delegar funcione:
            </p>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-semibold">Nivel</th>
                  <th className="py-2 pr-4 font-semibold">Qué significa</th>
                  <th className="py-2 font-semibold">Cuándo usarlo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">1. Hacé y avisame</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Decide y ejecuta, informa después
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Tarea de bajo riesgo, persona con experiencia probada
                  </td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="py-2 pr-4 font-medium">2. Proponé y confirmo</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Prepara la decisión, vos aprobás antes de ejecutar
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Riesgo medio, o primera vez que la persona hace esa tarea
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">3. Hacemos juntos</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    Trabajás con la persona, no solo revisás el resultado
                  </td>
                  <td className="py-2 text-muted-foreground">
                    Tarea nueva, alto riesgo, o etapa de formación
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              El objetivo no es empezar en el nivel 1 con todo — es moverse conscientemente del
              nivel 3 al 1 a medida que la confianza y la evidencia lo justifican.
            </p>
          </>
        ),
      },
      {
        heading: "Usar RACI para que la delegación no sea ambigua",
        body: (
          <>
            <p>
              Delegar sin dejarlo por escrito genera la peor versión de la microgestión: la
              persona avanza, pero no sabe si puede decidir sola, así que te pregunta igual — y
              vos volvés a estar en el medio de todo.
            </p>
            <p>
              La{" "}
              <Link to="/blogs/matriz-raci" className="underline underline-offset-2">
                matriz RACI
              </Link>{" "}
              resuelve esto en una tabla: quién es Responsable de ejecutar, quién Aprueba, a quién
              hay que Consultar y a quién solo Informar. Delegar de verdad es sacarte a vos mismo
              del rol de Aprobador en todo lo que no lo necesite — dejarlo como Informado alcanza
              en la mayoría de las tareas de nivel 1.
            </p>
          </>
        ),
      },
      {
        heading: "Cómo elegir qué delegar primero",
        body: (
          <>
            <p>No delegues al azar. Ordená tus propias tareas en una matriz simple:</p>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Alta frecuencia + bajo riesgo:</strong> primeras candidatas — cada delegación
                acá se paga sola en semanas.
              </li>
              <li>
                <strong>Alta frecuencia + alto riesgo:</strong> delegables, pero empezá en nivel 2
                (proponé y confirmo) hasta ver un patrón consistente.
              </li>
              <li>
                <strong>Baja frecuencia + alto riesgo:</strong> las últimas en delegar — el costo de
                enseñar no se amortiza rápido y el margen de error es caro.
              </li>
            </ul>
            <p>
              Si te cuesta ver el patrón, hacé el ejercicio contrario: listá todo lo que hoy pasa
              por vos antes de avanzar. Eso, casi siempre, es tu inventario de delegación
              pendiente.
            </p>
          </>
        ),
      },
      {
        heading: "El seguimiento sin microgestión",
        body: (
          <>
            <p>
              Delegar no termina en la asignación — pero el seguimiento correcto es liviano, no
              constante. La frecuencia del check-in depende del nivel elegido, no de tu ansiedad
              del día. Desarrollamos esto en detalle en{" "}
              <Link
                to="/blogs/seguimiento-de-tareas-equipo"
                className="underline underline-offset-2"
              >
                seguimiento de tareas sin microgestionar
              </Link>
              .
            </p>
          </>
        ),
      },
      {
        heading: "Errores al delegar (y cómo se pagan)",
        body: (
          <>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Delegar la tarea, no la decisión:</strong> si seguís aprobando cada paso
                chico, delegaste el trabajo pero no la carga cognitiva — vos seguís siendo el
                cuello de botella.
              </li>
              <li>
                <strong>No definir “hecho”:</strong> sin criterio de aceptación claro, la persona
                entrega algo distinto a lo que imaginabas y ambos pierden tiempo en el ida y
                vuelta.
              </li>
              <li>
                <strong>Retomar la tarea al primer error:</strong> un error en nivel 1 o 2 es
                información para ajustar el nivel, no una razón para volver a hacerlo vos siempre.
              </li>
              <li>
                <strong>Delegar solo lo aburrido:</strong> si nunca delegás nada interesante, la
                persona no crece y la delegación se siente como descarte, no como confianza.
              </li>
            </ul>
          </>
        ),
      },
      {
        heading: "Script para delegar una responsabilidad grande",
        body: (
          <>
            <p className="rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              “Quiero que a partir de ahora vos seas Responsable de [tarea/área]. Nivel de
              autonomía: [1/2/3]. Yo quedo como [Aprobador solo de X / Consultado en Y /
              Informado]. ‘Hecho’ significa [criterio concreto]. Revisamos cómo va en [fecha], y si
              funciona subimos el nivel de autonomía la próxima vez.”
            </p>
            <p>
              Decirlo así, una vez, ahorra semanas de mensajes de “¿puedo avanzar con esto?” que
              nunca deberían haber necesitado tu aprobación.
            </p>
          </>
        ),
      },
    ],
    howTo: {
      name: "Cómo delegar tareas sin perder control",
      steps: [
        {
          name: "Listar lo que hoy pasa por vos antes de avanzar",
          text: "Ese inventario es tu lista de candidatos a delegar, ordenada por lo que más se repite.",
        },
        {
          name: "Elegir el nivel de autonomía por tarea",
          text: "Nivel 1 (hacé y avisame), 2 (proponé y confirmo) o 3 (hacemos juntos), según riesgo y experiencia de la persona.",
        },
        {
          name: "Dejarlo explícito con RACI",
          text: "Quién es Responsable, quién Aprueba, a quién Consultar e Informar. Vos salís del rol de Aprobador en todo lo de nivel 1.",
        },
        {
          name: "Definir qué significa \"hecho\"",
          text: "Un criterio de aceptación concreto evita el ida y vuelta que hace que delegar se sienta más lento que hacerlo vos mismo.",
        },
        {
          name: "Revisar y subir el nivel con evidencia",
          text: "Después de un par de entregas exitosas, subí del nivel 2 al 1. La delegación es progresiva, no un salto único.",
        },
      ],
    },
    faq: [
      {
        question: "¿Por dónde empiezo si nunca delegué nada?",
        answer:
          "Con una tarea de alta frecuencia y bajo riesgo, en nivel 2 (proponé y confirmo) las primeras veces. El objetivo es generar el primer ciclo de confianza rápido, no delegar lo más difícil primero.",
      },
      {
        question: "¿Qué hago si la persona comete un error después de delegar?",
        answer:
          "Tratalo como información, no como fracaso de la delegación: revisá si el nivel de autonomía era el correcto, si el criterio de \"hecho\" estaba claro, y ajustá — no vuelvas a hacer la tarea vos por default.",
      },
      {
        question: "¿Delegar significa que dejo de estar informado?",
        answer:
          "No. En casi toda tarea seguís como Informado en RACI, aunque no seas Responsable ni Aprobador. La diferencia es que dejás de ser el paso obligatorio para avanzar.",
      },
      {
        question: "¿Cómo delego si soy el único con el contexto completo del cliente o proyecto?",
        answer:
          "Empezá delegando partes acotadas con nivel 3 (hacemos juntos) para transferir contexto mientras se ejecuta, en vez de intentar explicarlo todo antes de soltar nada.",
      },
    ],
  },
};
