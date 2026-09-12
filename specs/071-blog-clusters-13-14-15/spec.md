# Spec 071 — Blog: 12 posts en 3 clusters nuevos (Tiempo y capacidad · Dinero y clientes · Riesgo y calidad)

## Progreso

- **Estado general: 🟩 IMPLEMENTADO (2026-09-11).** El roadmap de 107 slugs quedó completo con
  spec 070 (Fases 1–10). Este spec abre la **Fase 11**: 12 artículos nuevos en 3 clusters de 4
  (pilar + 3 satélites), definidos por huecos de cobertura del sitio (ningún slug pisa los 109
  publicados) y demanda de búsqueda estable del nicho. Patrón idéntico a specs 068/070. El blog
  pasa de 109 a **121 artículos**.
- Sin export GSC nuevo a la fecha: la selección sale de los gaps de cobertura mapeados en 068/070
  más queries de la familia ya confirmadas en exports previos (horas, precios, riesgo, cierre).
  Medir en el próximo export (4–6 semanas desde el deploy de 070). El blog pasa de 109 a
  **121 artículos** con este lote.

### Gates (2026-09-11)

- `npx tsc --noEmit` ✅
- `npx eslint src/features/blog` ✅
- `npx vitest run src/features/blog` ✅ 64/64 (anti-drift incluye los 12 slugs nuevos)
- `npm run build` ✅ — 152 rutas prerenderizadas, incluidas las 12 nuevas

---

## Los 12 posts (3 lotes)

### Lote A — Cluster 13: Tiempo y capacidad (4)

Pilar: `registro-de-horas` (featured). Satélites con `pillar: "registro-de-horas"`.

| # | Slug | `publishedAt` | Keyword primaria | Ángulo / gap |
|---|---|---|---|---|
| 1 | `registro-de-horas` **PILAR, featured** | 2026-09-09 | registro de horas / control de horas trabajadas | El blog no cubría el time tracking; feedback loop con estimación (`como-estimar-tiempos-proyecto`, PERT) |
| 2 | `planificacion-de-capacidad` | 2026-09-09 | planificación de capacidad / capacity planning | Distinto de `gestion-de-recursos-proyecto` (asignar hoy vs planear el mes); puente con `reducir-trabajo-en-curso` |
| 3 | `revision-semanal` | 2026-09-09 | revisión semanal / weekly review | Rutina personal del líder, distinta del `informe-de-estado-semanal` (reportar hacia arriba) |
| 4 | `reuniones-1a1` | 2026-09-09 | reuniones 1 a 1 / one on one | El ritual que falta en la serie de reuniones (standup, retrospectiva, status) |

### Lote B — Cluster 14: Dinero y clientes (4)

Pilar: `cuanto-cobrar-por-un-proyecto` (featured). Profundiza el Cluster 8 (dinero) hacia el
lado comercial. El satélite de pagos por hitos ata el dinero a la marca.

| # | Slug | `publishedAt` | Keyword primaria | Ángulo / gap |
|---|---|---|---|---|
| 5 | `cuanto-cobrar-por-un-proyecto` **PILAR, featured** | 2026-09-10 | cuánto cobrar por un proyecto | Pricing de proyectos: no existe en el blog (el Cluster 8 cubre costos internos, no el precio de venta) |
| 6 | `anticipos-y-pagos-por-hitos` | 2026-09-10 | pagos por hitos / anticipo de un proyecto | Ata el dinero al avance con hitos de pago — puente directo con la familia `hito` |
| 7 | `onboarding-de-clientes` | 2026-09-10 | onboarding de clientes | Las 2 primeras semanas; puente con `kickoff-de-proyecto` (una reunión vs un proceso) |
| 8 | `cliente-que-no-responde` | 2026-09-10 | cliente no responde / aprobación retrasada | Desbloquear el proyecto cuando el cliente no aprueba; puente con `proyecto-atrasado-que-hacer` |

### Lote C — Cluster 15: Riesgo y calidad (4)

Pilar: `matriz-de-riesgos` (featured). Profundiza `gestion-de-riesgos-simple` (Cluster 1) con el
vocabulario que la gente busca por separado.

| # | Slug | `publishedAt` | Keyword primaria | Ángulo / gap |
|---|---|---|---|---|
| 9 | `matriz-de-riesgos` **PILAR, featured** | 2026-09-11 | matriz de riesgos / matriz probabilidad impacto | Keyword hermana de `gestion-de-riesgos-simple`, con demanda propia; howTo |
| 10 | `plan-de-contingencia` | 2026-09-11 | plan de contingencia / plan de contingencia ejemplo | Qué se ejecuta cuando el riesgo se materializa; distinto del registro de riesgos |
| 11 | `gestion-de-la-calidad-proyecto` | 2026-09-11 | gestión de la calidad en proyectos | El blog cubre DoD (`definition-of-done`) pero no el área de calidad completa |
| 12 | `acta-de-cierre-proyecto` | 2026-09-11 | acta de cierre de proyecto | Espejo del `acta-constitucion-proyecto` (nace/muere); categoría `plantillas` |

`publishedAt`: todos ≤ 2026-09-11 (día de la sesión). Sprint de 4 URLs por día, 3 días;
`datePublished` nunca futuro (regla 069).

---

## Briefs (estructura obligatoria por post)

Convenciones compartidas (de specs 069/070): H1 con keyword; intro `<strong>En una línea:</strong>`
de 45–55 palabras con la keyword en las primeras 100; 4–7 H2; ≥1 tabla
(`className="w-full border-collapse text-sm"`); 5 FAQ (pregunta = query real, primera frase =
respuesta directa); links internos `<Link to="/blogs/<slug>" className="underline underline-offset-2">`;
Hito solo en el CTA final (o mención honesta si el criterio es local-first); 1.400–2.200 palabras;
tuteo neutro, sin voseo ni marcas de España; meta title ≤60 + `| Hito`, description ≤155.

**1. `registro-de-horas`** — H1: "Registro de horas: por qué hacerlo y cómo sin odiarlo". H2:
qué es un registro de horas (y qué no es: no es fichar); los 3 usos que sí pagan (estimar mejor,
facturar con datos, ver capacidad real → link `como-estimar-tiempos-proyecto`); el error de usarlo
como vigilancia (confianza vs control); cómo implementarlo en 5 pasos (`howTo`: definir
granularidad → elegir momento → registrar sin fricción → revisar semanal → cerrar el loop con
estimaciones); qué registrar y qué no (tabla de granularidad: proyecto/tarea/subtarea); métodos y
herramientas (tabla honesta: papel, hoja de cálculo, timer suelto, registro dentro del gestor);
del registro a la estimación (ratio real vs estimado; PERT). FAQ: qué es un registro de horas /
para qué sirve registrar horas / cuánto tiempo toma / ¿es lo mismo que fichar? / cómo hacer que el
equipo lo acepte. Related: pilar (—), `como-estimar-tiempos-proyecto`, `planificacion-de-capacidad`,
`gestion-de-recursos-proyecto`.

**2. `planificacion-de-capacidad`** — H1: "Planificación de capacidad: cuánto trabajo puede
aceptar tu equipo". H2: qué es (traducir horas disponibles a compromisos); capacidad ≠ asignación
(tabla; link `gestion-de-recursos-proyecto`); cómo calcularla en 5 pasos (`howTo`: horas brutas →
restar no-productivas → aplicar factor de foco → comparar con demanda → decidir qué NO tomar);
el factor que todos ignoran (trabajo interrumpido, reuniones, soporte); señales de sobrecarga
(tabla con semáforo); qué hacer cuando no alcanza (rechazar, encolar → `reducir-trabajo-en-curso`,
contratar). FAQ: qué es la planificación de capacidad / cómo se calcula la capacidad de un equipo /
cuál es el factor de foco / diferencia con gestión de recursos / qué hacer si la demanda supera la
capacidad. Related: pilar `registro-de-horas`, `gestion-de-recursos-proyecto`,
`reducir-trabajo-en-curso`.

**3. `revision-semanal`** — H1: "La revisión semanal: 30 minutos que ordenan tu semana". H2:
qué es (cita contigo mismo: revisar lo pasado, planear lo siguiente); revisión semanal ≠ informe
de estado (tabla; link `informe-de-estado-semanal`); la agenda de 30 minutos (`howTo` 5 pasos:
vaciar bandejas → recorrer proyectos → revisar hitos y fechas → elegir los 3 importantes →
bloquear calendario); los 3 errores (saltársela en semanas ocupadas — justo cuando más hace
falta, convertirla en plan perfecto, no anotar lo aprendido); para equipos (versión ligera
compartida; link `plan-de-trabajo`). FAQ: qué es una revisión semanal / cómo hacer una revisión
semanal / cuánto tiempo toma / diferencia con el informe semanal / ¿se puede hacer en equipo?.
Related: pilar `registro-de-horas`, `informe-de-estado-semanal`, `plan-de-trabajo`,
`matriz-eisenhower`.

**4. `reuniones-1a1`** — H1: "Reuniones 1:1 con tu equipo: la agenda mínima y los errores".
H2: qué es una 1:1 (y para qué sirve de verdad: no es un status); agenda de 30 minutos (tabla:
su semana, tus bloqueos, desarrollo, acuerdos); frecuencia y duración según el equipo; los 5
errores (cancelar siempre, convertirla en status → link `reuniones-de-status-eliminar`, hablar
solo el jefe, no anotar acuerdos, guardarla para lo malo); qué preguntar (banco de preguntas);
cuándo una 1:1 no alcanza (problemas de desempeño → feedback directo, no ritual). FAQ: qué es
una reunión 1 a 1 / cada cuánto hacerlas / qué se habla en una 1:1 / quién dirige la agenda /
diferencia con el daily. Related: pilar `registro-de-horas`, `que-hace-un-project-manager`,
`como-delegar-tareas`, `daily-standup-util`.

**5. `cuanto-cobrar-por-un-proyecto`** — H1: "Cuánto cobrar por un proyecto: 4 métodos y los
errores que te hacen perder dinero". H2: las 3 preguntas antes del precio (tu costo, el mercado,
el valor que recibe el cliente); los 4 métodos de cobro (tabla: hora, día/retainer, precio
cerrado, valor — con pros y techos); cómo calcular tu tarifa mínima (ejemplo numérico: sueldo
deseado + costos + margen + horas facturables reales); del presupuesto interno al precio
(link `presupuesto-de-proyecto` — costo ≠ precio); los 6 errores clásicos (cobrar por hora y
castigar tu mejora, descontar por miedo, precio sin hitos de pago → link
`anticipos-y-pagos-por-hitos`, no presupuestar cambios → `control-de-cambios-proyecto`,
regalar discovery, competir solo por precio). FAQ: cómo calcular cuánto cobrar por un proyecto /
qué es el precio fijo vs por hora / cuál es la tarifa mínima / ¿cuánto margen dejar? / cómo cobrar
un proyecto grande. Related: pilar (—), `presupuesto-de-proyecto`, `anticipos-y-pagos-por-hitos`,
`control-de-cambios-proyecto`.

**6. `anticipos-y-pagos-por-hitos`** — H1: "Anticipos y pagos por hitos: ata el dinero al
avance". H2: por qué el 30/70 mata proyectos (el problema de cobrar al final); qué es un pago
por hitos (cada mojón certifica valor entregado → link `hitos-de-un-proyecto-ejemplos`,
`hito-vs-entregable`); cómo estructurar el calendario de pagos (tabla ejemplo: anticipo 30–40%,
hitos intermedios, entrega final — regla: nunca dejes >20% para el final); qué hito es cobrable
(criterio verificable + aceptación del cliente); si el cliente no paga (secuencia: recordatorio,
pausa de trabajo → link `cliente-que-no-responde`, interés, retención de entregables según
contrato); propuestas y contrato (dónde queda escrito). FAQ: qué es un pago por hitos / cuánto
anticipo se pide / qué porcentaje dejar para el final / ¿qué pasa si el cliente no paga un hito?
/ se puede cobrar por hitos en servicios recurrentes. Related: pilar
`cuanto-cobrar-por-un-proyecto`, `hitos-de-un-proyecto-ejemplos`, `hito-project-gestion-por-hitos`,
`presupuesto-de-proyecto`.

**7. `onboarding-de-clientes`** — H1: "Onboarding de clientes: las dos semanas que definen el
proyecto". H2: qué es el onboarding de clientes (proceso, no reunión — distinto del kickoff →
link `kickoff-de-proyecto`); qué recolectar antes de arrancar (accesos, materiales, contactos,
criterios de aprobación → link `matriz-de-stakeholders`); la agenda de la primera semana
(`howTo` 5 pasos: kickoff → documentar expectativas → activar canales → primer entregable
rápido → ritual de revisión); los 4 errores (empezar a "producir" sin expectativas, un solo
canal de contacto, silencio entre entregas, no definir quién aprueba); onboarding y confianza
(el primer hito pequeño importa más que el plan grande → link `gestionar-proyectos-con-clientes`).
FAQ: qué es el onboarding de clientes / cuánto dura / qué incluye / diferencia con kickoff /
cómo onboardear a un cliente que ya trabajó contigo. Related: pilar
`cuanto-cobrar-por-un-proyecto`, `kickoff-de-proyecto`, `gestionar-proyectos-con-clientes`,
`acta-constitucion-proyecto`.

**8. `cliente-que-no-responde`** — H1: "El cliente no responde: cómo desbloquear el proyecto
sin quemar la relación". H2: el costo real del silencio (WIP congelado, fechas que se comen las
aprobaciones); por qué no responde (tabla de causas: no es prioridad, miedo a decidir, aprobador
invisible, mensaje poco accionable); cómo pedir que sí respondan (mensaje de una decisión: qué,
para cuándo, qué pasa si no — plantilla copiable); el protocolo de escalamiento (`howTo` 5 pasos:
canal correcto → plazo explícito → escalar al sponsor → pausa formal con aviso → cierre del
bloqueo); protegerte para la próxima (aprobaciones con fecha en el plan → link
`plan-de-comunicacion-proyecto`, cláusula de silencio positivo). FAQ: qué hacer cuando el cliente
no responde / cuánto esperar antes de escalar / cómo redactar el recordatorio / ¿puedo avanzar
sin aprobación? / cómo evitar que vuelva a pasar. Related: pilar
`cuanto-cobrar-por-un-proyecto`, `gestionar-proyectos-con-clientes`, `proyecto-atrasado-que-hacer`,
`plan-de-comunicacion-proyecto`.

**9. `matriz-de-riesgos`** — H1: "Matriz de riesgos: probabilidad e impacto, con ejemplo". H2:
qué es (mapa 2D de tus riesgos: qué mirar primero); los dos ejes (escala 1–3 vs 1–5 — por qué
3×3 alcanza en equipos pequeños); cómo armarla en 5 pasos (`howTo`: listar riesgos →
probabilidad → impacto → ubicar en la matriz → responder según la zona); qué hacer según la zona
(tabla 3×3: mitigar/monitor/aceptar/escapar → link `plan-de-contingencia`); ejemplo completo
(proyecto de 6 semanas con 8 riesgos ubicados); errores (matriz de 200 riesgos, riesgo sin
dueño, matriz que no se actualiza → link `gestion-de-riesgos-simple`). FAQ: qué es una matriz
de riesgos / cómo se hace / qué escala usar / diferencia con el registro de riesgos / cuándo
revisarla. Related: pilar (—), `gestion-de-riesgos-simple`, `plan-de-contingencia`,
`matriz-de-stakeholders`.

**10. `plan-de-contingencia`** — H1: "Plan de contingencia: qué harás cuando el riesgo se haga
realidad". H2: qué es (la respuesta pre-acordada, escrita ANTES del problema); contingencia vs
mitigación vs registro de riesgos (tabla → link `matriz-de-riesgos`); qué riesgos merecen plan B
(criterio: probabilidad alta O impacto que rompe fecha/presupuesto → link
`sobrecosto-de-proyecto`); cómo escribirlo en 5 pasos (`howTo`: disparador → respuesta →
responsable → recursos/reserva → comunicación); la reserva de contingencia (tiempo y dinero:
cuánto, quién la autoriza → link `linea-base-proyecto`); ejemplo completo (2 riesgos con plan:
key person + retraso de proveedor). FAQ: qué es un plan de contingencia / diferencia entre
mitigación y contingencia / cuánto debe ser la reserva / ¿todos los riesgos necesitan plan B? /
cómo se activa. Related: pilar `matriz-de-riesgos`, `gestion-de-riesgos-simple`,
`linea-base-proyecto`, `proyecto-atrasado-que-hacer`.

**11. `gestion-de-la-calidad-proyecto`** — H1: "Gestión de la calidad en proyectos: criterios,
checklists y una pizca de QA". H2: qué es calidad en un proyecto (cumplir los criterios
acordados, no perfección); las dos caras (calidad del producto vs calidad del proceso → link
`como-documentar-procesos-equipos`); definir criterios de aceptación (verificables, pocos, por
entregable → link `hito-vs-entregable`); cómo inspeccionar sin frenar (tabla: revisión por pares,
checklist de salida, demo, QA final — cuándo cada una); el ciclo en 5 pasos (`howTo`: definir →
acordar → inspeccionar temprano → registrar defectos → cerrar el loop en lecciones → link
`lecciones-aprendidas-proyecto`); errores (calidad al final, criterios implícitos, cero defectos
como objetivo). FAQ: qué es la gestión de la calidad / diferencia entre calidad y control de
calidad / cómo se mide la calidad / qué es un criterio de aceptación / ¿cuándo hacer QA?.
Related: pilar `matriz-de-riesgos`, `definition-of-done`, `lecciones-aprendidas-proyecto`,
`cierre-de-proyecto-checklist`.

**12. `acta-de-cierre-proyecto`** — H1: "Acta de cierre de proyecto: plantilla, ejemplo y para
qué sirve". H2: qué es (el documento que certifica el fin formal y libera a todos); para qué
sirve de verdad (evita el "proyecto zombi": cobros pendientes, soporte infinito, expectativas
nuevas sin presupuesto); qué contiene (tabla de secciones: resultados vs alcance aprobado, hitos
cumplidos → link `hito-vs-entregable`, aceptación del cliente, lecciones → link
`lecciones-aprendidas-proyecto`, pendientes/soporte, liberación de recursos); plantilla copiable
(pasos `howTo`: recopilar evidencia → comparar contra acta de constitución → link
`acta-constitucion-proyecto` → firmar aceptación → archivar); ejemplo completo (agencia, sitio
web); el cierre sin papel (checklist de cierre → link `cierre-de-proyecto-checklist`; acta mínima
de 1 página). FAQ: qué es un acta de cierre / qué contiene / quién la firma / diferencia con el
informe final / ¿es obligatoria? Related: pilar `matriz-de-riesgos`, `cierre-de-proyecto-checklist`,
`acta-constitucion-proyecto`, `lecciones-aprendidas-proyecto`. Categoría `plantillas`.

---

## Interlinking de salida (posts ya publicados — editar `related` en articles-index.ts)

| Post existente | Añadir a `related` |
|---|---|
| `como-estimar-tiempos-proyecto` | `registro-de-horas` |
| `gestion-de-recursos-proyecto` | `planificacion-de-capacidad` |
| `informe-de-estado-semanal` | `revision-semanal` |
| `que-hace-un-project-manager` | `reuniones-1a1` |
| `presupuesto-de-proyecto` | `cuanto-cobrar-por-un-proyecto`, `anticipos-y-pagos-por-hitos` |
| `kickoff-de-proyecto` | `onboarding-de-clientes` |
| `gestionar-proyectos-con-clientes` | `onboarding-de-clientes`, `cliente-que-no-responde` |
| `gestion-de-riesgos-simple` | `matriz-de-riesgos`, `plan-de-contingencia` |
| `cierre-de-proyecto-checklist` | `acta-de-cierre-proyecto` |
| `acta-constitucion-proyecto` | `acta-de-cierre-proyecto` |
| `hitos-de-un-proyecto-ejemplos` | `anticipos-y-pagos-por-hitos` |
| `definition-of-done` | `gestion-de-la-calidad-proyecto` |

`pillar`: los 8 satélites llevan `pillar` de su pilar (A: `registro-de-horas`, B:
`cuanto-cobrar-por-un-proyecto`, C: `matriz-de-riesgos`); los 3 pilares sin `pillar` propio.
Los 3 pilares van `featured: true`.

## Archivos que toca

- `src/features/blog/data/articles/<slug>.tsx` × 12 (nuevos)
- `src/features/blog/data/articles-index.ts` (12 metas + related de 12 posts existentes)
- `src/features/blog/data/articles/index.ts` (12 loaders)
- `ROADMAP_BLOG.md` (Clusters 13–15 + estados + progreso + calendario)
- Este spec (marcar lotes 🟩 al cerrar gates)

Prerender/sitemap salen de `BLOG_SLUGS`; no hace falta lista a mano.

## Verificación (gates)

- `npx tsc --noEmit`
- `npx eslint src/features/blog`
- `npx vitest run src/features/blog` (anti-drift cubre los 12 slugs nuevos)
- `npm run build` (prerender de las 12 rutas nuevas)

## Fuera de alcance

- Reescrituras de posts existentes (quick wins de snippet): medir con el próximo export GSC.
- Traducciones; landings satélite; cambios de diseño (spec 059).
