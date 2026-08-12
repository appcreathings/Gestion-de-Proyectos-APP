# Spec 052 — Export de informe de estado (proyecto / portafolio)

> Estado: **IMPLEMENTADO** (2026-08-11).
> Feature dir: `specs/052-export-informe-estado/` · Fecha: 2026-08-11
> Roadmap: `export-status-pack` en `src/features/releases/data/roadmap.ts` («Sacar un informe sin abrir Hito»).
> Antecede: dashboard M5 (`computePortfolio`), Overview de proyecto, tools IA
> (`projectSummary` / `summarize_project_health`), export JSON de workspace (Settings).
> Baseline al empezar: **1096 tests en 109 archivos**, `SCHEMA_VERSION` **19**, sin deps de PDF.
> Principios: **I** local-first (todo en el cliente), **IV** formatos abiertos (Markdown es el
> documento), **V** simplicidad (sin backend de reporting).

## 1. Contexto

Hoy Hito concentra la verdad del trabajo en la app: el **Dashboard** arma un corte de
portafolio (`computePortfolio` en [portfolio.ts](src/features/dashboard/portfolio.ts)), el
**Overview** del proyecto muestra avance de checklists/tareas
([OverviewTab.tsx](src/features/projects/components/OverviewTab.tsx)), y el asistente puede
resumir salud vía `summarize_project_health` ([compositTools.ts](src/ai/tools/compositTools.ts)).

Lo que **no** existe es un artefacto que el PM pueda **mandar por mail** a un cliente o un CEO
que no va a instalar Hito ni abrir un JSON de backup:

| Capacidad actual | Qué sirve | Qué no alcanza |
|------------------|-----------|----------------|
| `adapter.exportAll()` / colección | Backup técnico, migrar workspace | Ruido interno, no es informe |
| Dashboard en pantalla | Decisión del PM | Requiere app abierta |
| Chat IA “resumí el proyecto” | Texto conversacional | No es archivo estable ni PDF |
| Descripción Markdown del proyecto | Contexto | No incluye vencidos ni % por área |

El roadmap lo nombra explícitamente:

> *Export de resumen de proyecto o portfolio a Markdown/PDF: estado, tareas vencidas, avance
> por área. Para el cliente o el CEO que no va a instalar la app.*  
> (`export-status-pack`, horizon `next`)

### 1.1 Qué reutilizamos (no reinventar)

- Agregaciones puras: `projectChecklistProgress`, `projectTaskProgress`, `areaProgress`,
  `daysUntil`, `effectiveHealth`, `collectDatedEntities`, `computePortfolio`.
- Etiquetas humanas: `projectStatusLabel`, `healthLabel`, `priorityLabel`, `taskStatusLabel`.
- Patrón de descarga: `Blob` + `<a download>` (Settings / `CollectionTransferCard`).
- `PageHeader.actions` ya admite botones en detalle de proyecto y dashboard.

### 1.2 Qué no es esta spec

- Envío automático por email / webhook / flujo programado que adjunte el informe (puede
  componerse después con 051 + output webhook/email).
- Informe multi-tenant, branding white-label por cliente, firmas digitales.
- Export de anexos binarios dentro del PDF (solo metadatos/conteo si aplica).
- Reemplazar el backup JSON del workspace.

## 2. Objetivo

Que desde **un proyecto** o desde el **portafolio (Dashboard)** el usuario genere en un clic
un **informe de estado legible fuera de Hito**, en **Markdown** (formato canónico) y en
**PDF** (para quien “solo abre PDFs”), con: estado/salud, vencidos, avance por área y un
corte de tareas relevantes — sin subir datos a ningún servidor.

## 3. Decisiones fijadas (no re-preguntar al implementar)

1. **Markdown es la fuente de verdad del contenido.** El PDF se deriva de la misma vista de
   datos (mismo modelo de informe), no es un segundo informe escrito a mano. Alineado a la
   marca: *formatos abiertos* ([BRAND_GUIDE.md](../../BRAND_GUIDE.md) §2).
2. **Sin backend y sin cuentas.** Todo se calcula y descarga en el navegador.
3. **PDF sin servicio cloud.** v1 usa **vista imprimible + “Guardar como PDF” del navegador**
   (cero dependencias nuevas). Si más adelante se exige un `.pdf` binario en un solo clic sin
   diálogo de impresión, se evalúa una lib (`jspdf` / similar) en un follow-up — no bloquea
   esta spec.
4. **Dos alcances:** `project` (un proyecto) y `portfolio` (todos los proyectos abiertos del
   workspace, mismo criterio que el dashboard: excluye `done`/`archived` del núcleo de riesgo,
   pero lista conteos globales).
5. **Snapshot en el momento del export.** Fecha/hora local en el encabezado; no se versiona
   historial de informes en storage.
6. **Sin schema bump.** No se persiste nada nuevo en el dominio.
7. **Privacidad por defecto en el artefacto:** el informe **no** incluye emails de personas,
   IDs internos, secretos, ni rutas de archivos. Nombres de personas sí (assignee / owner)
   porque el CEO/cliente suele necesitar “quién”. Toggle opcional v1: **“Incluir nombres de
   personas”** (default **on**); si off, solo roles genéricos (“Sin asignar” / omitir columna).
8. **Tareas archivadas:** fuera del informe (igual que el kanban operativo), salvo conteo
   opcional “N archivadas” en pie de sección de tareas.
9. **Idioma del informe: español** (labels de dominio ya en ES).
10. **Entradas de UI:** botón en `ProjectDetailPage` y en `DashboardPage` (no enterrado solo
    en Ajustes).

## 4. Historias de usuario y criterios de aceptación

### HU-01 — Exportar informe de un proyecto (Markdown)

Como PM, quiero bajar un `.md` del proyecto que estoy mirando para pegarlo en Notion, mail o
Git del cliente.

- **CA-01.1** En el detalle del proyecto hay una acción visible **“Exportar informe”** (menú o
  botón en `PageHeader.actions`).
- **CA-01.2** Al elegir **Markdown**, se descarga un archivo
  `hito-informe-<slug-proyecto>-<YYYY-MM-DD>.md`.
- **CA-01.3** El Markdown incluye al menos:
  - Título + fecha de generación
  - Estado, salud, prioridad, fechas (inicio/fin si existen), % checklists y % tareas
  - **Avance por área** (nombre, % , completada sí/no)
  - **Vencidos** (tareas e ítems de checklist con fecha &lt; hoy, no hechos)
  - **Por vencer** (dentro de `settings.dueSoonDays`)
  - Tareas abiertas relevantes: blocked + doing + todo con due (cap razonable, ver design)
- **CA-01.4** No aparecen UUIDs crudos ni emails.
- **CA-01.5** Proyecto sin áreas/tareas: el informe se genera igual, con secciones vacías
  honestas (“Sin tareas vencidas”).

### HU-02 — Exportar informe de portafolio (Markdown)

Como PM o founder, quiero un corte del portafolio para el CEO semanal sin capturas de pantalla.

- **CA-02.1** En el Dashboard hay **“Exportar informe de portafolio”**.
- **CA-02.2** El Markdown incluye: totales (proyectos, activos, avance medio), desglose por
  salud y por estado, vencidos globales, estancados, rollup por producto (reusa la semántica de
  `computePortfolio`), y una tabla/lista corta por proyecto abierto (nombre, estado, salud, %).
- **CA-02.3** Nombre de archivo `hito-informe-portafolio-<YYYY-MM-DD>.md`.

### HU-03 — PDF para quien no abre Markdown

Como PM, el cliente solo quiere un PDF.

- **CA-03.1** Desde el mismo flujo de export (proyecto o portafolio) puedo elegir **PDF** /
  **Vista imprimible**.
- **CA-03.2** Se abre una vista limpia (ventana o ruta de solo lectura) con el mismo contenido
  del informe, estilos de impresión, y el usuario puede **Imprimir → Guardar como PDF**.
- **CA-03.3** La vista no muestra chrome de la app (sidebar, assistant, botones de edición) en
  el medio impreso (`@media print` / documento dedicado).
- **CA-03.4** No se envían datos a ningún servidor para generar el PDF.

### HU-04 — Confianza y control

- **CA-04.1** Antes o en el menú de export, el usuario ve qué alcance se exporta (“Este
  proyecto” / “Portafolio completo”).
- **CA-04.2** Opción **Incluir nombres de personas** (default on); al desactivarla, el MD/PDF
  no muestra nombres de owner/assignee.
- **CA-04.3** Feedback inmediato: descarga arranca o la vista se abre; si falla (popup
  bloqueado, etc.), mensaje accionable en toast.
- **CA-04.4** El contenido del informe es **determinista** dados los mismos datos y la misma
  fecha `now` (testeable en unidad sobre el builder Markdown).

## 5. Contenido del informe (contrato de secciones)

### 5.1 Proyecto

```
# Informe de estado — {nombre}
Generado: {fecha local} · Hito

## Resumen
- Estado / Salud / Prioridad
- Fechas · Owner (si includePeople)
- Avance checklists · Avance tareas

## Avance por área
| Área | Avance | Estado |
...

## Vencidos
...

## Por vencer (≤ N días)
...

## Tareas en curso y bloqueadas
...

## Notas
{descripción del proyecto, si hay — texto plano o MD ya sanitizado a texto}
```

### 5.2 Portafolio

```
# Informe de portafolio
Generado: …

## Cifras
## Salud y estado
## Por producto
## Vencidos / Por vencer / Estancados
## Proyectos abiertos (tabla)
```

Detalle de campos y caps en [`design.md`](./design.md).

## 6. Roadmap de implementación

| Fase | Entrega |
|------|---------|
| **0** | Modelo puro `StatusReport` + builders proyecto/portafolio + `toMarkdown` + tests |
| **1** | Download `.md` + menú en ProjectDetail + Dashboard |
| **2** | Vista imprimible / PDF via print CSS + toggle personas |
| **3** | Cierre: copy, toast, roadmap link, Progreso |

## 7. Fuera de alcance (documentado)

- PDF binario one-click sin diálogo del SO (follow-up opcional con lib).
- Programar el envío del informe (email/Make) — 033/051.
- Personalización de plantilla (logo del cliente, secciones on/off avanzadas) — v2.
- Incluir comentarios de tareas o historial de actividad completo.
- i18n inglés del informe.

## 8. Archivos clave (previsto)

| Área | Archivos |
|------|----------|
| Dominio puro | **nuevo** `src/domain/reports/*` o `src/features/reports/*` (puro, sin React) |
| UI | `ProjectDetailPage`, `DashboardPage`, **nuevo** dialog/menú export, print view |
| Reuso | `compute.ts`, `portfolio.ts`, `labels.ts`, `health.ts`, `dates.ts` |
| Download helper | pequeño util compartido si no existe (`downloadBlob`) |

## 9. Verificación

1. `npm run typecheck && npm run lint && npm test && npm run build`.
2. Tests del builder: snapshot o contains de secciones; sin UUIDs; toggle personas; caps de listas.
3. Smoke: export MD de proyecto demo; export portafolio; abrir print y verificar sin sidebar.
4. Actualizar `Progreso`; marcar roadmap `export-status-pack` al shippear; `graphify update .`.

## 10. Progreso

- **Estado general: ✅ Implementado (2026-08-11).**
- **Código:** `src/features/reports/` — `statusReport`, markdown, HTML print, `ExportReportMenu`.
  Botones en `ProjectDetailPage` y `DashboardPage`. `src/lib/download.ts`.
- **Sin schema bump.** Markdown canónico; PDF vía print del navegador.
- **Tests:** 6 unitarios del builder/MD/HTML (+ suite completa en verde).
