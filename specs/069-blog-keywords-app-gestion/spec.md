# Spec 069 — Blog: 32 posts para posicionar keywords de app de gestión de tareas y proyectos

## Progreso

- **Estado general: 🟩 FASE 1 IMPLEMENTADA (2026-08-31).** Continúa `ROADMAP_BLOG.md`
  (specs 040, 058 y 068: 68 artículos; este spec suma 32). Abre **3 clusters nuevos** (9–11)
  para capturar las búsquedas de quien está eligiendo o aprendiendo a usar **una app de
  gestión de tareas y proyectos**.
- **Fase 1 (Cluster 9, 11 artículos):** 🟩 implementada y lista para publicar (calendario
  2026-08-18 → 2026-08-29, siempre ≤ hoy).
- **Fase 2 (Cluster 10, 11 artículos):** 🟨 lote 1 implementado (2026-09-03): slugs 12–17
  (`tablero-kanban` pilar + 5 satélites). Faltan slugs 18–22 (`definition-of-done` →
  `calendario-de-proyecto`), se generan cuando el usuario lo pida.
- **Fase 3 (Cluster 11, 10 artículos):** ⬜ documentada; se genera cuando el usuario lo pida.

Fuente de datos: export GSC `hito.autos` del 2026-08-31
(`d:\Downloads\hito.autos-Performance-on-Search-2026-08-31\`), búsqueda Web, últimos 3 meses
(serie diaria 2026-07-04 → 2026-08-29). CSVs usados: Consultas, Páginas, Países, Dispositivos,
Filtros, Gráfico. `Aparición en búsquedas.csv` vino vacío (solo cabecera).

---

## Diagnóstico GSC (baseline 2026-08-31)

### Panorama

| Métrica | Valor |
|---|---|
| Impresiones (páginas) | ~2.470 |
| Clics (páginas) | **8** (home 3 + 5 posts con 1 clic) |
| CTR medio | **~0,32 %** |
| Posición media (desktop) | 29,34 |
| Posición media (móvil) | 16,32 |

El patrón no cambió desde spec 058: hay indexación e impresiones, casi no hay clics. El
problema dominante sigue siendo **posición + snippet**, no “falta de páginas”. Aun así, el
export revela un **hueco de cobertura comercial**: las queries que sí mueven gente hacia una
app (software de gestión de proyectos, app de gestión de tareas, alternativa a Asana/Monday/Jira)
casi no aparecen. El sitio rankea por definiciones de PM (hito, fases, RACI, MCP), no por
intención de herramienta.

### 1. Lo que funciona (duplicarlo)

| Página / Query | Impresiones | Clics | Posición | Lectura |
|---|---|---|---|---|
| `/blogs/que-es-un-hito-gestion-proyectos` | 718 | 1 | 13,41 | Tema ganador: definición de hito |
| Query `hito` | 164 | 0 | 11,85 | Marca cerca de página 1, CTR 0 |
| Query `que es un hito` / `que es hito` | 98 + 83 | 0 | 13,11 / 10,53 | Snippet no convence |
| `/blogs/fases-de-un-proyecto` | 374 | 1 | 38,05 | Volumen alto, posición enterrada |
| Home `hito.autos/` | 245 | 3 | 14,49 | Única URL con CTR usable |
| `/blogs/hito-project-gestion-por-hitos` | 154 | 0 | 14,26 | Branded + concepto, sin clic |
| `/blogs/que-es-mcp` | 135 | 1 | 37,58 | Diferenciador de producto, pos 30+ |
| `/blogs/como-priorizar-tareas` | 108 | 0 | 47,48 | Intención de app de tareas, pos 47 |

**Conclusión:** el pilar ganador de *tráfico actual* sigue siendo **“qué es un hito” + fases**.
El pilar ganador de *negocio* (gente que busca una app) está casi vacío. Este spec ataca el
segundo sin abandonar el primero.

### 2. Quick wins (posición 8–15, CTR 0)

| Query | Impresiones | Posición | Problema |
|---|---|---|---|
| `hito` | 164 | 11,85 | Title/meta de home no gana el clic de marca |
| `que es hito` | 83 | 10,53 | Compite con hito histórico |
| `que es un hito` | 98 | 13,11 | Snippet genérico vs. featured |
| `hito que es` | 24 | 13,25 | Misma página, misma meta |
| `hito app` | 9 | 12,11 | Intención de producto: no hay H1 “hito app” |
| `ejemplos de hitos` | 5 | 9 | FAQ/H2 de ejemplos poco visible |
| `marcar un hito` | 4 | 10 | Verbo de producto sin cobertura |
| `hito software` | 2 | **1,5** | Ya está en #1; 0 clics = title |

> Patrón clave: cerca de página 1 en marca y definición, el clic no ocurre. Es title/meta/snippet,
> no un artículo nuevo. Fuera de este spec (Track A residual de 058); se lista para no olvidarlo.

### 3. Lo que está enterrado (pos 50+)

| Query / Página | Impresiones | Posición | Oportunidad |
|---|---|---|---|
| `scope creep` → `alcance-de-proyecto-scope-creep` | 42 / 62 | 78 / 70 | Reescritura 058 aún no perforó |
| `kanban vs scrum` → `scrum-vs-kanban` | 15 / 58 | 91 / 75 | Título invertido; cluster Kanban flojo |
| `proyectos multiples` | 25 | 60 | Pilar existe; falta satélites de tool |
| `priorización de tareas` | 24+23 | 56 | Puente natural a “app de tareas” |
| `matriz raci` | 8 | 87 | Plantilla existe; autoridad baja |
| `model context protocol` | 14 | 79 | Satélites MCP no alcanzan |
| `scrumban` / `mezclar kanban y scrum` | 1+1 | 92 / 33 | **Gap de cobertura** (Fase 3) |
| `formula de tiempo esperado` | 1 | 33 | **Gap PERT** (Fase 3) |

**Conclusión:** spec 058 mejoró on-page y aún no se ve en GSC (normal a 1–6 semanas). Este spec
no reescribe esos posts: suma **clusters nuevos** que Google aún no asocia al dominio.

### 4. Mercado e idiomas

#### Por país (top)

| País | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| España | 2 | 600 | 0,33 % | 35,39 |
| México | 2 | 497 | 0,40 % | 29,93 |
| Estados Unidos | 0 | 198 | 0 % | 29,69 |
| Perú | 0 | 183 | 0 % | 23,23 |
| Argentina | 0 | 120 | 0 % | 15,57 |
| Colombia | **3** | 106 | **2,83 %** | 17,42 |
| Chile | 0 | 106 | 0 % | 15,51 |
| Ecuador | 0 | 104 | 0 % | 8,56 |

Mercado dominante en volumen: **España + México**. Mejor CTR: **Colombia**. Redacción:
**español latino neutro, tuteo (tú)**, sin voseo ni marcas de España — misma regla de 040/058/068.

#### Por dispositivo

| Dispositivo | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| Ordenador | 7 | 1.676 | 0,42 % | 29,34 |
| Móviles | 1 | 727 | 0,14 % | 16,32 |
| Tablet | 0 | 8 | 0 % | 11,62 |

Desktop concentra clics. Móvil rankea *mejor* (pos 16) y convierte peor: titles largos o poco
específicos en SERP móvil.

### 5. Notas técnicas

1. **CTR sistemático < 1 %.** Cualquier post nuevo de este spec nace con meta title ≤ 60,
   description ≤ 155 y bloque “En una línea:” de 45–55 palabras.
2. **No hay canibalización www/http** visible en Páginas.csv. URLs canónicas `https://hito.autos/blogs/<slug>`.
3. **Queries `qué es un hito histórico`** (5+1 impr) contaminan el cluster de marca. Los posts
   nuevos de producto deben decir “hito de proyecto / app / software”, no solo “hito”.
4. **`/app`, `/app/products`, `/app/automations`** reciben impresiones (33+16+11) en pos ~35–39.
   No son blog; no se tocan aquí.
5. **Páginas SEO ya existentes** (`/alternativa-trello`, `/alternativa-notion`,
   `/gestor-proyectos-offline`): no duplicar como posts. Los posts nuevos enlazan a esas URLs
   cuando el CTA es transaccional.
6. **Featured snippet** abierto en queries `qué es` / `cómo` / `alternativa a`. Cada post de
   este spec abre con respuesta autocontenida.

---

## Por qué 32 posts nuevos (y no más reescrituras)

El blog ya cubre 8 clusters informacionales de PM (fundamentos, metodologías, problemas reales,
plantillas, roles, KPIs, stakeholders, dinero). Quien busca **una app** no aterriza ahí:

| Intención de quien busca una app | ¿Cubierto hoy? |
|---|---|
| “software de gestión de proyectos” / “programa de gestión de proyectos” | No (solo “herramientas gratis” y Excel) |
| “app de gestión de tareas” / “gestor de tareas” | No |
| “alternativa a Asana / Monday / Jira” | No (sí Trello, ClickUp, Notion) |
| “cómo elegir un software de gestión de proyectos” | No |
| “tablero kanban” / “cómo hacer un tablero kanban” | Parcial (WIP, Scrum vs Kanban; no el tablero) |
| “backlog”, “historias de usuario”, “definition of done” | No |
| “dependencias entre tareas”, “asignar tareas” | No |
| “scrumban”, “PERT / fórmula de tiempo esperado” | Queries GSC sin URL propia |

Tres pilares, no más. Cada fase cierra un cluster completo (pilar + satélites interlinkeados)
antes de abrir el siguiente.

---

## Los 3 pilares

| Pilar | Esfuerzo | Fase | Encaje |
|---|---|---|---|
| **9. Software y apps de gestión** | 70 % | 1 | Intención comercial: el buscador quiere una herramienta. Mayor valor de negocio. |
| **10. Organizar el trabajo diario** | 20 % | 2 | Intención informacional de uso: tablero, backlog, dependencias. Convierte después. |
| **11. Control operativo e híbridos** | 10 % | 3 | Rescate GSC (scrumban, PERT) + autoridad PM que Google aún no asocia al dominio. |

### Scoring (Impacto 40 + Fit 30 + Búsqueda 20 + Recursos 10)

| # | Post | Impacto | Fit | Búsqueda | Recursos | Total | Fase |
|---|---|---|---|---|---|---|---|
| 1 | software-gestion-proyectos (pilar) | 9 | 10 | 9 | 8 | **9,2** | 1 |
| 2 | app-gestion-tareas | 9 | 10 | 8 | 8 | **9,0** | 1 |
| 3 | alternativa-a-asana | 8 | 9 | 9 | 7 | **8,4** | 1 |
| 4 | alternativa-a-monday | 8 | 9 | 8 | 7 | **8,2** | 1 |
| 5 | alternativa-a-jira | 8 | 8 | 8 | 7 | **7,9** | 1 |
| 6 | software-gestion-proyectos-pymes | 8 | 10 | 7 | 8 | **8,3** | 1 |
| 7 | como-elegir-software-gestion-proyectos | 8 | 9 | 7 | 8 | **8,1** | 1 |
| 8 | lista-tareas-vs-gestion-proyectos | 7 | 9 | 7 | 9 | **7,7** | 1 |
| 9 | gestor-tareas-equipo | 8 | 10 | 7 | 8 | **8,3** | 1 |
| 10 | programa-organizar-tareas | 7 | 9 | 7 | 8 | **7,6** | 1 |
| 11 | app-kanban | 8 | 9 | 8 | 8 | **8,3** | 1 |
| 12–22 | Cluster 10 (tablero → calendario) | 6–8 | 8–10 | 6–8 | 8 | 7–8 | 2 |
| 23–32 | Cluster 11 (scrumban → triple restricción) | 5–8 | 7–9 | 5–8 | 8 | 6–8 | 3 |

---

## Cluster 9 — Software y apps de gestión (Fase 1 · 11 posts)

*Pilar: `software-gestion-proyectos`. Categoría mayoritaria `gestion-proyectos`; las 3
alternativas van a `comparativas`.*

Cadencia: un día por post, todos **antes de la fecha virtual de publicación** (hoy = 2026-08-31).
`datePublished` en el futuro hace que Google trate el schema como sospechoso. Nunca usar fechas
posteriores a la fecha de deploy.

| # | Slug | `publishedAt` | Keyword primaria | Tipo | Categoría |
|---|---|---|---|---|---|
| 1 | `software-gestion-proyectos` **PILAR, featured** | 2026-08-18 | software de gestión de proyectos | Guía / listicle honesta | gestion-proyectos |
| 2 | `app-gestion-tareas` | 2026-08-19 | app de gestión de tareas | Guía | gestion-proyectos |
| 3 | `software-gestion-proyectos-pymes` | 2026-08-20 | software de gestión de proyectos para pymes | Guía | gestion-proyectos |
| 4 | `alternativa-a-asana` | 2026-08-21 | alternativa a asana | Comparativa | comparativas |
| 5 | `alternativa-a-monday` | 2026-08-22 | alternativa a monday | Comparativa | comparativas |
| 6 | `alternativa-a-jira` | 2026-08-23 | alternativa a jira | Comparativa | comparativas |
| 7 | `como-elegir-software-gestion-proyectos` | 2026-08-25 | cómo elegir software de gestión de proyectos | How-to | gestion-proyectos |
| 8 | `lista-tareas-vs-gestion-proyectos` | 2026-08-26 | lista de tareas vs gestión de proyectos | Comparativa conceptual | gestion-proyectos |
| 9 | `gestor-tareas-equipo` | 2026-08-27 | gestor de tareas para equipos | Guía | gestion-proyectos |
| 10 | `programa-organizar-tareas` | 2026-08-28 | programa para organizar tareas | Guía de criterios | gestion-proyectos |
| 11 | `app-kanban` | 2026-08-29 | app kanban | Guía | gestion-proyectos |

### Estructuras Fase 1 (obligatorias)

Cada post: H1 con keyword, intro “En una línea:” 45–55 palabras, 4–7 H2, ≥1 tabla, 5 FAQ
(schema), ≥2 `Link` internos, CTA final. Longitud 1.400–2.200 palabras. Tuteo neutro.

**Hito en el cuerpo:** informacionales = Hito solo en el CTA (o una mención honesta si el
criterio es local-first). Comparativas = tabla honesta; Hito no gana todas las filas.

#### 1. `software-gestion-proyectos` (pilar)

- **H1:** Software de gestión de proyectos: cómo elegir uno que sí uses
- **Snippet:** qué es, para qué sirve, y que “el mejor” es el que el equipo actualiza la semana
  que viene — no el que tiene más vistas.
- **H2:** Qué es un software de gestión de proyectos · Qué debe hacer (tareas, tablero, plazos,
  responsables, visibilidad) · Tipos (lista, kanban, Gantt, all-in-one, local-first) · Tabla de
  8 herramientas 2026 (Asana, Trello, Monday, ClickUp, Jira, Notion, OpenProject, Hito) con
  “ideal para” y techo · Errores al elegir · Cómo adoptarlo en 14 días.
- **FAQ:** qué es un software de gestión de proyectos; cuál es el mejor; gratis vs pago;
  diferencia con Excel; para equipos pequeños.
- **Interlinking:** `herramientas-gestion-proyectos-gratis`, `gestion-proyectos-excel`,
  `hito-vs-trello`, `hito-vs-clickup`, satélites de este cluster.
- **howTo:** “Cómo elegir software de gestión de proyectos en 5 pasos” (teaser del post #7).

#### 2. `app-gestion-tareas`

- **H1:** App de gestión de tareas: lo que tiene que tener (y lo que sobra)
- **Ángulo:** no es un ranking de Todoist. Es el umbral entre lista personal y app de equipo.
- **H2:** Lista vs app de equipo · 8 funciones que sí importan (captura, fecha, responsable,
  subtareas, tablero, filtros, recurrencia, visibilidad) · Tabla de tipos (personal / equipo /
  proyecto) · Señales de que tu app se quedó chica · Cuándo pasar a gestión de proyectos.
- **Keywords secundarias:** gestor de tareas, aplicación para organizar tareas, to-do list equipo.
- **Interlinking:** pilar, `como-priorizar-tareas`, `seguimiento-de-tareas-equipo`, `lista-tareas-vs-gestion-proyectos`.

#### 3. `software-gestion-proyectos-pymes`

- **H1:** Software de gestión de proyectos para pymes: criterios reales
- **Ángulo:** pyme 5–30 personas, no enterprise. Precio por asiento, adopción, datos de clientes.
- **H2:** Por qué el Excel compartido se rompe · Criterios (costo 12 meses, curva, datos, dueño)
  · Tabla “pyme de servicios / producto / obra ligera” · Lo que una pyme no necesita (SSO, PPM)
  · Plan de adopción de 30 días.
- **Interlinking:** pilar, `gestion-proyectos-agencias`, `gestion-proyectos-freelancers`.

#### 4. `alternativa-a-asana`

- **H1:** Alternativas a Asana en 2026 (con techos reales)
- **Ángulo:** por qué se busca alternativa (precio por usuario, 2 asientos en free, complejidad)
  + tabla ClickUp, Monday, Trello, Notion, Jira, Hito, OpenProject. Hito gana privacidad/precio
  local; pierde collab cloud y apps nativas.
- **No canibalizar:** `hito-vs-trello`, `hito-vs-clickup`, `alternativas-a-notion`. Enlazarlos.
- **Interlinking:** pilar, esas tres, `/alternativa-trello` como CTA opcional.

#### 5. `alternativa-a-monday`

- **H1:** Alternativas a monday.com: cuándo dejar los tableros de colores
- **Ángulo:** mínimo 3 asientos pagos, automatizaciones que empujan al plan Pro, “work OS”
  que nadie configura. Alternativas por motivo de salida (precio, simplicidad, datos, ingeniería).

#### 6. `alternativa-a-jira`

- **H1:** Alternativas a Jira para equipos que no son de 50
- **Ángulo:** Jira gana en issues/sprints/dev; pierde en pymes no-software. Linear/Shortcut
  para ingeniería liviana; Trello/Hito/OpenProject para el resto. No fingir que Hito reemplaza
  Jira en un equipo de desarrollo grande.

#### 7. `como-elegir-software-gestion-proyectos`

- **H1:** Cómo elegir un software de gestión de proyectos (checklist)
- **howTo** de 6 pasos: mapear el flujo real → 1 tablero piloto → techos a 90 días → datos →
  precio 12 meses → prueba de 14 días con trabajo real.
- **Tabla de descarte** por señal (“si el dolor es adjuntos, no elijas por vistas”).

#### 8. `lista-tareas-vs-gestion-proyectos`

- **H1:** Lista de tareas vs gestión de proyectos: cuándo cada una
- **Tabla:** captura personal, equipo con plazos, proyecto con alcance/presupuesto. Todoist no
  es un fallo; es otra capa. El salto se justifica con 4 señales (dependencias, varios dueños,
  cliente, presupuesto).

#### 9. `gestor-tareas-equipo`

- **H1:** Gestor de tareas para equipos: de la lista compartida al tablero
- **Ángulo:** asignación, WIP, visibilidad, daily. Enlaza `como-delegar-tareas` y
  `seguimiento-de-tareas-equipo`.

#### 10. `programa-organizar-tareas`

- **H1:** Programa para organizar tareas: 7 criterios que importan
- **Ángulo:** “programa” es la query de quien no habla “software SaaS”. Criterios en tabla,
  sin ranking comprado.

#### 11. `app-kanban`

- **H1:** App kanban: cuándo un tablero alcanza (y cuándo no)
- **Puente a Fase 2:** teaser de `tablero-kanban`. Diferenciar de `kanban-limites-wip` (ese
  post es el método; este es la herramienta).
- **Interlinking:** `scrum-vs-kanban`, `kanban-limites-wip`, pilar.

### Interlinking de salida (posts ya publicados)

Al implementar Fase 1, actualizar `related` (no reescribir cuerpo salvo 1 `Link` natural):

| Post existente | Añadir a `related` |
|---|---|
| `herramientas-gestion-proyectos-gratis` | `software-gestion-proyectos` |
| `hito-vs-trello` | `alternativa-a-asana` |
| `hito-vs-clickup` | `software-gestion-proyectos` |
| `alternativas-a-notion` | `alternativa-a-asana` |
| `gestion-proyectos-excel` | `software-gestion-proyectos` |
| `como-priorizar-tareas` | `app-gestion-tareas` |

---

## Cluster 10 — Organizar el trabajo diario (Fase 2 · 11 posts)

*Pilar: `tablero-kanban`. No implementar hasta que Fase 1 esté publicada o el usuario lo pida.*

Estos posts posicionan las keywords de **uso** de una app de tareas/proyectos: el tablero, el
backlog, las dependencias, la asignación. Son el puente entre “busco una tool” (Fase 1) y
“ya tengo tablero y no fluye”.

| # | Slug | `publishedAt` | Keyword primaria | Notas |
|---|---|---|---|---|
| 12 | `tablero-kanban` **PILAR, featured** | ≤ día de deploy | tablero kanban / qué es un tablero kanban | Columnas, tarjetas, WIP. Distinct de `kanban-limites-wip`. howTo 5 pasos. |
| 13 | `como-hacer-tablero-kanban` | ≤ día de deploy | cómo hacer un tablero kanban | howTo. 3 ejemplos: contenido, software, agencia. |
| 14 | `que-es-un-backlog` | ≤ día de deploy | backlog / qué es un backlog | Product backlog vs sprint vs kanban ready. No es “caja de ideas”. |
| 15 | `dependencias-entre-tareas` | ≤ día de deploy | dependencias entre tareas | FS/SS en lenguaje llano. Cuándo el Gantt sí sirve (`diagrama-de-gantt`). |
| 16 | `asignar-tareas-equipo` | ≤ día de deploy | asignar tareas / asignación de tareas | Distinct de `como-delegar-tareas` (ese es el hábito; este es el mecanismo). |
| 17 | `historias-de-usuario` | ≤ día de deploy | historias de usuario / user story | Formato, criterios de corte, error de “epics eternos”. |
| 18 | `definition-of-done` | ≤ día de deploy | definition of done / definición de hecho | DoD vs DoR. Checklist copiable. |
| 19 | `plan-de-trabajo` | ≤ día de deploy | plan de trabajo / cómo hacer un plan de trabajo | Distinct de `plantilla-plan-de-proyecto` (ese es el documento formal). Este es el plan operativo semanal. |
| 20 | `matriz-eisenhower` | ≤ día de deploy | matriz eisenhower / matriz de eisenhower | Satélite de `como-priorizar-tareas`. 4 cuadrantes + trampa de lo urgente. |
| 21 | `tareas-recurrentes` | ≤ día de deploy | tareas recurrentes / tareas repetitivas | Recurrencia vs plantilla vs SOP (`como-documentar-procesos-equipos`). |
| 22 | `calendario-de-proyecto` | ≤ día de deploy | calendario de proyecto | Distinct de Gantt y de cronograma: vista día/semana del equipo. |

### Prompt de ejecución Fase 2 (copiar y pegar)

```
Lee specs/069-blog-keywords-app-gestion/spec.md, sección Cluster 10.
Implementa los 11 artículos (slugs 12–22) con el mismo patrón de spec 040/058/068/069 Fase 1:
data/articles/<slug>.tsx + entrada en articles-index.ts + loader en articles/index.ts.
Español latino neutro, tuteo, intro "En una línea:", FAQ 5, howTo en los procedurales,
Hito solo en CTA salvo que el criterio sea local-first. Interlinking al pilar
tablero-kanban y a posts de Fase 1 / clusters previos listados en el spec.
Actualiza ROADMAP_BLOG.md (Cluster 10 a 🟩) y related de kanban-limites-wip,
scrum-vs-kanban, como-priorizar-tareas, plantilla-plan-de-proyecto, diagrama-de-gantt.
publishedAt de cada post ≤ fecha de deploy (nunca futuro; escalonar días hacia atrás desde hoy).
Gates: typecheck, eslint src/features/blog, vitest src/features/blog, build/prerender.
No implementes Fase 3.
```

---

## Cluster 11 — Control operativo e híbridos (Fase 3 · 10 posts)

*Pilar: `scrumban`. Rescata queries GSC sin URL propia y cierra autoridad de operación.*

| # | Slug | `publishedAt` | Keyword primaria | Señal GSC / gap |
|---|---|---|---|---|
| 23 | `scrumban` **PILAR, featured** | ≤ día de deploy | scrumban / mezclar kanban y scrum | `scrumban` pos 92; `es compatible mezclar kanban y scrum` pos 33 |
| 24 | `formula-tiempo-esperado-pert` | ≤ día de deploy | fórmula de tiempo esperado / PERT | `formula de tiempo esperado` pos 33. Satélite de `como-estimar-tiempos-proyecto`. |
| 25 | `control-de-cambios-proyecto` | ≤ día de deploy | control de cambios / change request | Puente de `alcance-de-proyecto-scope-creep` (detectar) → proceso. |
| 26 | `linea-base-proyecto` | ≤ día de deploy | línea base / baseline de proyecto | Alcance + cronograma + costo. Enlaza presupuesto y cronograma. |
| 27 | `plan-de-comunicacion-proyecto` | ≤ día de deploy | plan de comunicación de un proyecto | Satélite de stakeholders / informe semanal. |
| 28 | `priorizacion-moscow` | ≤ día de deploy | MoSCoW / priorización moscow | Satélite de `como-priorizar-tareas`. Must/Should/Could/Won't. |
| 29 | `dashboard-de-proyectos` | ≤ día de deploy | dashboard de proyectos / tablero de control | Distinct de `kpis-gestion-proyectos` (indicadores vs. vista). |
| 30 | `gestion-proyectos-software` | ≤ día de deploy | gestión de proyectos de software | Por industria. No clonar Jira. Enlaza `alternativa-a-jira`. |
| 31 | `portafolio-de-proyectos` | ≤ día de deploy | portafolio de proyectos / gestión de portafolio | Puente de `gestionar-varios-proyectos-a-la-vez`. |
| 32 | `triple-restriccion-proyecto` | ≤ día de deploy | triple restricción / triángulo de hierro | Alcance-tiempo-costo. Cierre de autoridad del cluster dinero + fases. |

### Prompt de ejecución Fase 3

```
Lee specs/069-blog-keywords-app-gestion/spec.md, sección Cluster 11.
Implementa los 10 artículos (slugs 23–32) con el patrón de Fase 1/2.
Usa las queries GSC literales en FAQ de scrumban y PERT.
Interlinking a scrum-vs-kanban, kanban-limites-wip, como-estimar-tiempos-proyecto,
alcance-de-proyecto-scope-creep, kpis-gestion-proyectos, presupuesto-de-proyecto.
Actualiza ROADMAP_BLOG.md (Cluster 11 a 🟩). No reabras Fase 1 ni 2 salvo related.
publishedAt de cada post ≤ fecha de deploy (nunca futuro).
Gates iguales a Fase 1.
```

---

## Estilo de redacción (todas las fases)

Copia de specs 040/058/068, no de `BRAND_GUIDE.md` (ese documento pide voseo; el blog ya se
normalizó a tuteo porque GSC es España + México + Latam):

- **Tuteo neutro** (tú/tu/tus): “elige”, “puedes”, “crea”. Nunca voseo.
- Evitar marcas de España: “ordenador” → “computadora”; “os/vuestro” → “ustedes/su”.
- Intro: `<strong>En una línea:</strong>` + keyword en negrita en las primeras 100 palabras.
- Tablas con `className="w-full border-collapse text-sm"`.
- Links: `<Link to="/blogs/<slug>" className="underline underline-offset-2">`.
- FAQ: pregunta con la redacción de la query real; primera frase = respuesta directa, sin link.
- Comparativas: honestas. Hito no gana collab cloud, SSO, Gantt enterprise ni app nativa móvil.
- **`publishedAt` nunca en el futuro.** Google lee `datePublished` del JSON-LD. Si la fecha es
  posterior a la fecha virtual de crawl, el artículo parece fabricado. Al implementar, escalonar
  días hacia atrás desde el día de deploy (≤ hoy). No reutilizar la cadencia 2027 de specs 058/068.

### Producto (hechos, no marketing)

Hito es local-first (carpeta + JSON), sin cuenta, sin asientos, kanban, checklists/SOPs,
automatizaciones, flujos, GitHub sync, dashboard de portafolio, asistente IA con MCP/RAG
opcional (API key del usuario), PWA offline. Audiencia 1–15 personas. **No** es para >50,
SSO, SOC2. No reemplaza Jira en ingeniería grande ni ClickUp en “15 vistas + Brain”.

---

## Archivos que toca Fase 1

- `src/features/blog/data/articles/<slug>.tsx` × 11 (nuevos)
- `src/features/blog/data/articles-index.ts` (11 metas + related de 6 posts existentes)
- `src/features/blog/data/articles/index.ts` (11 loaders)
- `ROADMAP_BLOG.md` (clusters 9–11, progreso, calendario)
- Este spec (marcar Fase 1 🟩 al cerrar gates)

Prerender/sitemap salen de `BLOG_SLUGS`; no hace falta lista a mano.

## Verificación (gates) — Fase 1 2026-08-31

- `npx tsc --noEmit` ✅
- `npx eslint src/features/blog` ✅
- `npx vitest run src/features/blog` ✅ 64/64 (anti-drift incluye los 11 slugs nuevos)
- `npm run build` ✅ — 110 rutas prerenderizadas, incluidas las 11 de Cluster 9

## Criterios de aceptación Fase 1

- 11 artículos en el patrón de 3 archivos; test anti-drift verde.
- Pilar `software-gestion-proyectos` con `featured: true` y sin `pillar`.
- 10 satélites con `pillar: "software-gestion-proyectos"`.
- Cadencia 2026-08-18 → 2026-08-29 (todos ≤ 2026-08-31).
- `ROADMAP_BLOG.md` actualizado: Cluster 9 🟩, Clusters 10–11 ⬜, prompts de retoma.

## Fuera de alcance

- Reescritura Track A de spec 058 (titles de hito/fases/RACI). Medir en 4–6 semanas.
- Traducción a otros idiomas.
- Nuevas landing SEO (`/alternativa-asana` etc.): este spec es blog, no páginas satélite.
- Cambios de diseño del blog (spec 059).
- Fases 2 y 3: solo documentadas.

## Cómo retomar

> “Ejecuta la Fase 2 del spec 069” → usar el prompt de Cluster 10.
> “Ejecuta la Fase 3 del spec 069” → usar el prompt de Cluster 11.
> “Publiqué el post N, actualiza ESTADO” → marcar en este spec y en `ROADMAP_BLOG.md`.

### KPIs a 30/90 días (vs baseline de este diagnóstico)

| Métrica | Baseline ago-2026 | Objetivo 30 días | Objetivo 90 días |
|---|---|---|---|
| Clics / 3 meses | 8 | 15 | 40 |
| CTR | 0,32 % | ≥ 0,8 % | ≥ 1,5 % |
| Queries comerciales (`software de gestión…`, `app de gestión de tareas`, `alternativa a asana`) | ~0 impr | aparecer en GSC | pos ≤ 30 |
| `que es un hito` | pos 13, CTR 0 | pos ≤ 8, CTR > 1 % | snippet |

---

## Historial

| Fecha | Cambio |
|---|---|
| 2026-08-31 | Creación. Diagnóstico GSC 2026-08-31. 32 posts / 3 fases. Implementación Fase 1. |
| 2026-08-31 | `publishedAt` de Cluster 9 pasado de 2027-09/12 a 2026-08-18…29 (≤ fecha virtual). |
