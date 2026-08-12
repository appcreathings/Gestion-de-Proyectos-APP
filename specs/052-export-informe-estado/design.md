# Design 052 — Export de informe de estado

Diseño técnico de la spec 052. Anclado al código post-050/051-planning:
agregaciones en `domain/compute`, `features/dashboard/portfolio`, labels, sin libs PDF.

Principio rector: **un modelo de informe puro → dos renderers (Markdown string, HTML
imprimible)**. La UI solo elige alcance, opciones y dispara descarga/ventana.

---

## 0. Mapa de archivos (previsto)

| Área | Archivos | Naturaleza |
|------|----------|------------|
| Modelo + MD | **nuevo** `src/domain/reports/statusReport.ts` (+ test) | Tipos + `buildProjectReport` / `buildPortfolioReport` |
| Markdown | **nuevo** `src/domain/reports/statusReportMarkdown.ts` (+ test) | `reportToMarkdown(report): string` |
| HTML print | **nuevo** `src/domain/reports/statusReportHtml.ts` (+ test opcional) | `reportToPrintableHtml(report): string` |
| Download | **nuevo** `src/lib/download.ts` (o reusar si se extrae) | `downloadText(filename, text, mime)` |
| UI proyecto | `ProjectDetailPage.tsx` + **nuevo** `ExportReportMenu.tsx` | Menú MD / PDF |
| UI portafolio | `DashboardPage.tsx` | Misma pieza con `scope: portfolio` |
| Print shell | **nuevo** ruta opcional o `window.open` + `document.write` | Sin sidebar |

**Sin** cambios de schema, migraciones, storage adapter, ni motor de flujos.

**Ubicación `domain/reports` vs `features/reports`:** el builder es puro y reutilizable por
IA/MCP en el futuro → **`src/domain/reports/`**. La UI vive en `features/reports/` o junto a
projects/dashboard.

---

## 1. Modelo de informe (`StatusReport`)

```ts
export type ReportScope = "project" | "portfolio";

export interface StatusReportOptions {
  /** Default true — CA-04.2 */
  includePeople: boolean;
  /** Fecha de corte (inyectable en tests). */
  now: Date;
  /** Días “por vencer” — de workspace.settings.dueSoonDays */
  dueSoonDays: number;
  /** Cap de filas en listas largas (default 25). */
  listCap?: number;
}

export interface ReportDueItem {
  kind: "task" | "checklistItem" | "project";
  label: string;
  dueDate: string; // YYYY-MM-DD
  daysUntil: number; // negativo = vencido
  projectName?: string; // solo portfolio
  areaName?: string;
  assigneeName?: string | null; // si includePeople
}

export interface ReportAreaRow {
  name: string;
  progressPct: number;
  completed: boolean;
  taskOpen: number;
  taskDone: number;
}

export interface ReportTaskRow {
  title: string;
  status: "todo" | "doing" | "blocked" | "done";
  priority: string; // label ES
  dueDate: string | null;
  areaName: string | null;
  assigneeName?: string | null;
}

export interface ProjectStatusReport {
  scope: "project";
  generatedAt: string; // ISO o locale string estable
  title: string;
  statusLabel: string;
  healthLabel: string;
  priorityLabel: string;
  startDate: string | null;
  dueDate: string | null;
  ownerName: string | null;
  checklist: { done: number; total: number; pct: number };
  tasks: { done: number; total: number; pct: number; archivedCount: number };
  areas: ReportAreaRow[];
  overdue: ReportDueItem[];
  dueSoon: ReportDueItem[];
  focusTasks: ReportTaskRow[]; // blocked, doing, todo con due — ver §2.3
  descriptionPlain: string; // descripción sin HTML peligroso; MD strip simple
}

export interface PortfolioStatusReport {
  scope: "portfolio";
  generatedAt: string;
  title: string; // "Informe de portafolio" + orgName?
  totals: {
    projects: number;
    open: number;
    avgProgress: number;
  };
  byStatus: { label: string; count: number }[];
  byHealth: { label: string; count: number }[];
  byProduct: { name: string; total: number; avgProgress: number; healthSummary: string }[];
  overdue: ReportDueItem[];
  dueSoon: ReportDueItem[];
  stalled: { name: string; statusLabel: string; healthLabel: string; updatedAt: string }[];
  openProjects: {
    name: string;
    statusLabel: string;
    healthLabel: string;
    checklistPct: number;
    taskPct: number;
    dueDate: string | null;
  }[];
}

export type StatusReport = ProjectStatusReport | PortfolioStatusReport;
```

### 1.1 Inputs del builder

```ts
buildProjectReport(
  project: Project,
  deps: {
    people: Person[];
    settings: Pick<Settings, "dueSoonDays" | "deriveHealth" | "stalledAfterDays">;
    productName?: string | null;
  },
  options: StatusReportOptions,
): ProjectStatusReport

buildPortfolioReport(
  projects: Project[],
  products: Product[],
  people: Person[],
  settings: Settings,
  options: StatusReportOptions,
  orgName?: string,
): PortfolioStatusReport
```

Portafolio: **reutilizar** `computePortfolio(projects, products, settings, options.now, people)`
para overdue/dueSoon/stalled/byStatus/byHealth/byProduct/avgProgress. Mapear `DueRow` →
`ReportDueItem` con nombre de proyecto resuelto. No duplicar la lógica de fechas.

Proyecto: **no** llamar a todo `computePortfolio`; usar `collectDatedEntities(project)` +
`daysUntil` + `areaProgress` + `effectiveHealth`.

---

## 2. Reglas de contenido

### 2.1 Vencidos / por vencer

Misma semántica que el dashboard / temporal:

- Fuente: `collectDatedEntities` (proyecto, tareas no `done`, ítems de checklist no `done`).
- `daysUntil < 0` → overdue; `0 ≤ d ≤ dueSoonDays` → dueSoon.
- Orden: más vencido primero (ascendente por `daysUntil`).
- Cap: `listCap` (25); si hay más, nota al pie: `_…y N más_`.

### 2.2 Avance por área

Para cada `project.areas` (orden del array del proyecto):

- `areaProgress(a).pct`
- `completed: a.completed`
- conteo de tareas del área no archivadas: open vs done

### 2.3 `focusTasks` (proyecto)

Incluir tareas con `!archived` y `status ∈ {blocked, doing}` **más** `status === "todo"` con
`dueDate != null`, orden:

1. blocked
2. doing  
3. todo (por dueDate asc)

Cap `listCap`. El resto no se lista (el % total ya está en resumen).

### 2.4 Descripción

`project.description` puede ser Markdown rico (spec 044). Para el informe:

- Función `plainTextFromDescription(md: string): string` mínima: strip de fences/simple tags si
  los hubiera, o pasar tal cual como bloque MD en el export Markdown (preferido: **incluir como
  subsección Markdown** sin re-parsear, truncada a ~2000 chars). En HTML print: render con el
  mismo `Markdown` component **o** preformateado escapado — decisión: **en MD export se pega el
  fragmento; en HTML se escapa a texto** para no arrastrar HTML inseguro a `document.write`.

### 2.5 Personas

```ts
function personLabel(people, id, includePeople): string | null {
  if (!includePeople || !id) return null;
  return people.find(p => p.id === id)?.name ?? "Persona eliminada";
}
```

Nunca `email`.

### 2.6 Labels

Siempre pasar por `projectStatusLabel`, `healthLabel`, `priorityLabel`, `taskStatusLabel` —
una sola fuente (como 038 con providers).

---

## 3. Markdown (`reportToMarkdown`)

Helpers locales (no hace falta librería):

```ts
function h1(s: string) { return `# ${s}\n`; }
function bullet(k: string, v: string) { return `- **${k}:** ${v}`; }
function table(headers: string[], rows: string[][]): string
```

Escapar celdas de tabla (`|` → `\|`). No generar HTML dentro del MD.

Encabezado fijo:

```md
# Informe de estado — Acme Rollout
Generado: 11 ago 2026, 18:40 (hora local) · Hito

> Snapshot exportado desde Hito. No se actualiza solo.
```

Fecha legible: `Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" })`.

Nombre de archivo:

```ts
function reportFilename(report: StatusReport, ext: "md" | "html"): string {
  const day = options.now.toISOString().slice(0, 10);
  if (report.scope === "portfolio") return `hito-informe-portafolio-${day}.${ext}`;
  return `hito-informe-${slugify(report.title)}-${day}.${ext}`;
}
```

`slugify`: minúsculas, sin acentos, `[a-z0-9]+` unidos por `-`, max 40 chars.

---

## 4. PDF / vista imprimible

### 4.1 Decisión: print del navegador (v1)

```
Usuario elige "PDF / Imprimir"
  → build report
  → html = reportToPrintableHtml(report)  // documento completo <!DOCTYPE html>…
  → const w = window.open("", "_blank", "noopener,noreferrer")
  → si !w → toast "Permití ventanas emergentes para generar el PDF"
  → w.document.write(html); w.document.close();
  → w.focus(); w.print();  // el usuario elige "Guardar como PDF"
```

**Alternativa** si popups son fricción: ruta React `/app/reports/print?…` no sirve sin
persistir el report (query no puede llevar todo el body). Mejor:

- **Blob URL** de HTML: `URL.createObjectURL(new Blob([html], { type: "text/html" }))` y
  `window.open(url)` — a veces más amigable; o
- **Dialog fullscreen** dentro de la app con `window.print()` y `@media print` que oculte
  `#root` chrome… frágil con el layout actual.

**Decisión preferida:** Blob URL (`URL.createObjectURL`) + `window.open(url)` de HTML
autocontenido (CSS inline en `<style>`). **No** usar `noopener` en el tercer argumento de
`window.open` — en Chromium suele devolver `null` y el PDF queda muerto. El HTML dispara
`print()` al cargar y además muestra un botón “Imprimir / Guardar como PDF” por si el
diálogo automático se bloquea. Sin React en la ventana de print.

### 4.2 CSS mínimo del HTML

- Fuente sistema, max-width 720px, márgenes print `@page { margin: 1.5cm }`
- Tablas con borde simple
- `h1/h2` legibles
- Marca discreta al pie: “Generado con Hito — local-first”

### 4.3 Por qué no jspdf en v1

- Suma peso al bundle y tipografía/RTL/markdown son mediocres.
- El brand no vende “PDF mágico”; vende datos en formatos abiertos.
- Print-to-PDF es universal en Chromium/Firefox/Safari del usuario.

Follow-up documentado: one-click `.pdf` binario si la demanda lo exige.

---

## 5. UI

### 5.1 Componente `ExportReportButton`

```tsx
// props
type Props =
  | { scope: "project"; projectId: string }
  | { scope: "portfolio" };

// Usa useDataStore + useAppStore.settings
// Dropdown:
//   □ Incluir nombres de personas  (switch, default true)
//   → Descargar Markdown
//   → Abrir PDF / imprimir
```

Patrón visual: `DropdownMenu` (ya en attachments) o botón + `DropdownMenu` en
`PageHeader.actions`.

**ProjectDetailPage:** junto a Editar / Eliminar.

**DashboardPage:** en `PageHeader` actions a la derecha del título “Portafolio” (solo si
`projects.length > 0`).

### 5.2 Download helper

```ts
// src/lib/download.ts
export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadText(filename: string, text: string, mime = "text/markdown;charset=utf-8") {
  downloadBlob(filename, new Blob([text], { type: mime }));
}
```

Opcional: refactorizar Settings/`CollectionTransferCard` para usarlo (nice-to-have, no
bloqueante).

### 5.3 Toasts

- Éxito MD: “Informe descargado”.
- Popup bloqueado: “No se pudo abrir la vista de impresión. Permití ventanas emergentes o
  usá Descargar Markdown.”
- Sin settings hidratados: no renderizar el botón.

---

## 6. Tests

| Módulo | Casos |
|--------|--------|
| `buildProjectReport` | áreas con %; overdue task; dueSoon item; archived task no entra a focusTasks; includePeople off omite nombres |
| `buildPortfolioReport` | alinea totales con `computePortfolio` sobre fixture; stalled list |
| `reportToMarkdown` | contiene headings; no contiene UUID de fixture; tabla de áreas; nota “y N más” si cap |
| `slugify` / filename | acentos, espacios |
| `reportToPrintableHtml` | escapa `<` en títulos; contiene `@media print` |

Fixtures: reutilizar factories `newProject` / seed parcial; **no** depender de jsdom para el
builder (entorno node de Vitest). `downloadBlob` / `window.open` se mockean solo si hay test
de UI; la UI puede quedar en smoke manual si no hay RTL en el repo.

---

## 7. Seguridad y privacidad

- El HTML de print **escapa** todo texto de usuario (`escapeHtml`) antes de interpolar.
- No incluir `encryptedSecret`, connection strings, ni paths de `attachments/`.
- El blob se queda en el dispositivo del usuario (mismo modelo que export JSON).

---

## 8. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Popup blocker en PDF | Toast + MD siempre disponible |
| Informes enormes (1000 tareas) | `listCap` + nota de truncado |
| Descripción HTML/MD rota el HTML print | escape + truncado |
| Divergencia dashboard vs informe | portfolio builder **llama** `computePortfolio` |
| Usuario espera envío por mail | Copy: “Descargá y enviá vos” en el menú |

---

## 9. Secuencia

Ver `tasks.md`. Orden: modelo puro → markdown → download UI → print HTML → polish.
