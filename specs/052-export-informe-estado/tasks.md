# Tasks 052 — Export de informe de estado

Checklist de implementación de la spec 052 (`export-status-pack`).  
Estado inicial: **ninguna tarea ejecutada** (solo documentado).  
Baseline: **1096 tests / 109 archivos**, `SCHEMA_VERSION = 19` (sin bump).  
Numeración **T5200+**. Cada tarea ancla a `design.md`.  
Cierre de fase: `typecheck` + `lint` + `test` (+ `build` al final).

---

## Fase 0 — Modelo puro y Markdown (sin UI)

- [ ] **T5200** — **nuevo** `src/domain/reports/statusReport.ts`: tipos `StatusReport`,
  `StatusReportOptions`, `buildProjectReport`, `buildPortfolioReport`. Reusa `compute.ts`,
  `collectDatedEntities`, `effectiveHealth`, `computePortfolio` (portafolio), labels ES.
  (design §1–§2)
- [ ] **T5201** — Caps: `listCap` default 25; overdue/dueSoon/focusTasks/openProjects truncan con
  contador de restantes en el modelo (`truncatedNote` o campo `omittedCount` por lista).
- [ ] **T5202** — **nuevo** `src/domain/reports/statusReportMarkdown.ts`: `reportToMarkdown`,
  helpers de tabla/bullets, `reportFilename` + `slugify`. (design §3)
- [ ] **T5203** — Tests Vitest (node):
  - proyecto con área, tarea vencida, ítem por vencer, tarea archivada excluida;
  - `includePeople: false` sin nombres;
  - portfolio alinea `totals.open` / overdue count con `computePortfolio` sobre el mismo fixture;
  - markdown contiene `## Avance por área` y **no** contiene UUIDs del fixture;
  - filename slug sin acentos.
- [ ] **Checkpoint 0:** tests verdes; ningún cambio visible en la app.

---

## Fase 1 — Descarga Markdown en UI

- [ ] **T5210** — **nuevo** `src/lib/download.ts`: `downloadBlob` / `downloadText`. (design §5.2)
- [ ] **T5211** — **nuevo** `src/features/reports/ExportReportMenu.tsx` (nombre flexible): props
  `scope: "project" | "portfolio"` + `projectId?`; lee store; switch “Incluir nombres”; acción
  **Descargar Markdown**. (design §5.1)
- [ ] **T5212** — `ProjectDetailPage`: montar menú en `PageHeader.actions` junto a editar/borrar.
  (CA-01.1)
- [ ] **T5213** — `DashboardPage`: montar menú cuando hay proyectos; label “Exportar informe de
  portafolio”. (CA-02.1)
- [ ] **T5214** — Toasts de éxito / error básico. (CA-04.3)
- [ ] **Checkpoint 1:** smoke — descargar MD de un proyecto demo y del dashboard; abrir el
  archivo y verificar secciones.

---

## Fase 2 — Vista imprimible / PDF

- [ ] **T5220** — **nuevo** `src/domain/reports/statusReportHtml.ts`: `reportToPrintableHtml`
  con CSS inline, `escapeHtml` en todos los campos de usuario, `@page` margins. (design §4)
- [ ] **T5221** — En `ExportReportMenu`: acción **PDF / Imprimir** → `window.open` + write +
  `print()`; si popup null → toast accionable (CA-03.4, design §5.3).
- [ ] **T5222** — Test de escape HTML (título con `<script>` no se ejecuta / queda escapado) y
  presencia de estilos print.
- [ ] **Checkpoint 2:** smoke — print preview sin sidebar; “Guardar como PDF” del navegador
  produce un PDF legible.

---

## Fase 3 — Cierre y producto

- [ ] **T5230** — Copy del menú: “Descargá y enviá al cliente o al CEO — no sube nada a la
  nube.” Verificar CA-04.1 (alcance explícito en el menú).
- [ ] **T5231** — (Opcional) Refactor Settings/`CollectionTransferCard` a `downloadBlob` — solo
  si el diff es chico; no bloquear cierre.
- [ ] **T5232** — **Cierre:** `npm run typecheck && npm run lint && npm test && npm run build`.
  Actualizar `spec.md → §10 Progreso` (archivos, tests, fecha).
- [ ] **T5233** — Roadmap: `export-status-pack` → `shipped` (o nota en description “spec 052”)
  al cerrar implementación; entrada breve en `gestor-proyectos-app.md` si aplica.
- [ ] **T5234** — `graphify update .`
- [ ] **Checkpoint final:**
  1. MD proyecto: estado, áreas, vencidos.
  2. MD portafolio: cifras + lista de abiertos.
  3. PDF print de ambos.
  4. Toggle personas off → sin nombres en el archivo.

---

## Fuera de esta checklist (follow-ups)

- PDF binario one-click (`jspdf` / etc.).
- Acción de Flujo “adjuntar informe” / email semanal.
- Plantillas de secciones on/off y logo del cliente.

---

## Notas para el agente implementador

- No añadir dependencias npm en v1.
- No persistir informes en el workspace.
- No copiar lógica de fechas del dashboard: **importar** `computePortfolio` / `collectDatedEntities`.
- Vitest es entorno `node`: no asumir `document` en tests del domain.
- Mantener español en labels del artefacto.
