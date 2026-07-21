/**
 * In-memory construction of the "Nimbus" demo workspace (spec 030 §5).
 *
 * Every entity is built with the real domain factories (`newProduct`,
 * `newProject`, …) and `instantiateProjectFromType`, so the demo travels the
 * exact same code path a user takes when creating content by hand. IDs are
 * fixed `demo-*` constants: the seed guard guarantees single-seed, fixed IDs
 * make cross-references trivial and never collide with uuid-based real data.
 */
import { nowIso, uuid } from "@/lib/utils";
import { instantiateProjectFromType } from "@/domain/instantiate";
import {
  newAutomation,
  newChecklist,
  newChecklistTemplate,
  newItem,
  newProcessTemplate,
  newProduct,
  newProject,
  newProjectType,
  newQuarter,
  newTask,
} from "@/domain/factories";
import { SCHEMA_VERSION } from "@/domain/schemas/common";
import type {
  ActivityEntry,
  AutomationRule,
  ChecklistTemplate,
  Notification,
  Person,
  ProcessTemplate,
  Product,
  Project,
  ProjectType,
  Quarter,
} from "@/domain/schemas";

const ID = {
  product: "demo-product-nimbus",
  quarter: "demo-quarter-q3-2026",
  ana: "demo-person-ana",
  beto: "demo-person-beto",
  carla: "demo-person-carla",
  diego: "demo-person-diego",
  typeRelease: "demo-type-release",
  typeGrowth: "demo-type-growth",
  clDefRelease: "demo-cltpl-definicion-release",
  clQaRelease: "demo-cltpl-qa-release",
  procReleaseNotes: "demo-proctpl-release-notes",
  procDeploy: "demo-proctpl-deploy",
  projRelease: "demo-project-lanzamiento-v1",
  projGrowth: "demo-project-growth-q3",
  projOnboarding: "demo-project-redesign-onboarding",
  automation: "demo-auto-checklist-followup",
} as const;

export interface DemoBundle {
  orgName: string;
  people: Person[];
  product: Product;
  quarter: Quarter;
  projectTypes: ProjectType[];
  checklistTemplates: ChecklistTemplate[];
  processTemplates: ProcessTemplate[];
  projects: Project[];
  automations: AutomationRule[];
  notifications: Notification[];
  activity: ActivityEntry[];
}

export function buildDemoData(): DemoBundle {
  const ts = () => nowIso();

  /* ---------- People (RACI cast) ---------- */
  const people: Person[] = [
    { ...mkPerson(ID.ana, "Ana Ríos"), roleTitle: "Product Manager" },
    { ...mkPerson(ID.beto, "Beto Cueva"), roleTitle: "Tech Lead" },
    { ...mkPerson(ID.carla, "Carla Soto"), roleTitle: "Marketing Lead" },
    { ...mkPerson(ID.diego, "Diego Ferro"), roleTitle: "Diseño de Producto" },
  ];

  /* ---------- Templates (Biblioteca) ---------- */
  const clDefRelease = mkChecklistTemplate(ID.clDefRelease, "Definición de release", [
    "Alcance y objetivos del release definidos",
    "Fecha objetivo alineada con el trimestre",
    "Stakeholders informados",
  ]);
  const clQaRelease = mkChecklistTemplate(ID.clQaRelease, "QA de release", [
    "Smoke test en staging",
    "Regresión de áreas críticas",
    "Aprobación de seguridad",
  ]);
  const procReleaseNotes = mkProcessTemplate(
    ID.procReleaseNotes,
    "SOP: Publicar release notes",
    "Pasos para redactar y publicar las notas de cada release.",
    ["Recopilar cambios desde el último release", "Redactar notas en lenguaje de usuario", "Publicar en el centro de ayuda"],
  );
  const procDeploy = mkProcessTemplate(
    ID.procDeploy,
    "SOP: Deploy a producción",
    "Checklist de despliegue seguro a producción.",
    ["Crear etiqueta de versión", "Desplegar a producción", "Verificar métricas y salud post-deploy"],
  );

  /* ---------- Project types ---------- */
  const typeRelease = mkProjectType(ID.typeRelease, "Release", "Entrega de una nueva versión del producto.", [
    {
      name: "Producto",
      icon: "package",
      checklistTemplateIds: [ID.clDefRelease],
      processTemplateIds: [ID.procReleaseNotes],
    },
    {
      name: "Ingeniería",
      icon: "code",
      checklistTemplateIds: [ID.clQaRelease],
      processTemplateIds: [ID.procDeploy],
    },
    { name: "Marketing", icon: "megaphone", checklistTemplateIds: [], processTemplateIds: [ID.procReleaseNotes] },
  ]);
  const typeGrowth = mkProjectType(ID.typeGrowth, "Experimento de growth", "Hipótesis medible de adquisición/activación.", [
    { name: "Adquisición", icon: "trending-up", checklistTemplateIds: [], processTemplateIds: [] },
  ]);

  /* ---------- Product + Quarter ---------- */
  const product = mkProduct();
  const quarter = mkQuarter();

  /* ---------- Project 1: Lanzamiento v1.0 (Release) ---------- */
  const release = instantiateProjectFromType(
    typeRelease,
    "Lanzamiento v1.0",
    ID.product,
    [clDefRelease, clQaRelease],
    [procReleaseNotes, procDeploy],
  );
  release.id = ID.projRelease;
  release.quarterId = ID.quarter;
  release.description =
    "Primera versión pública de Nimbus: onboarding, facturación y el tablero Kanban listo para clientes beta.";
  release.health = "amber"; // semáforo no-verde para el Dashboard
  release.startDate = "2026-07-01";
  release.dueDate = "2026-08-31";
  release.ownerId = ID.ana;
  release.stakeholders = [
    { personId: ID.ana, role: "accountable" },
    { personId: ID.beto, role: "responsible" },
    { personId: ID.carla, role: "consulted" },
    { personId: ID.diego, role: "informed" },
  ];
  enrichRelease(release);

  /* ---------- Project 2: Growth Q3 (Experimento) ---------- */
  const growth = instantiateProjectFromType(
    typeGrowth,
    "Growth Q3",
    ID.product,
    [],
    [],
  );
  growth.id = ID.projGrowth;
  growth.quarterId = ID.quarter;
  growth.typeId = ID.typeGrowth;
  growth.description = "Experimentos de activación: A/B en el onboarding y programa de referidos.";
  growth.health = "green";
  growth.startDate = "2026-07-07";
  growth.dueDate = "2026-09-30";
  growth.ownerId = ID.carla;
  growth.stakeholders = [
    { personId: ID.carla, role: "responsible" },
    { personId: ID.ana, role: "accountable" },
  ];
  enrichGrowth(growth);

  /* ---------- Project 3: Rediseño onboarding (backlog) ---------- */
  const onboarding = newProject("Rediseño onboarding", ID.product);
  onboarding.id = ID.projOnboarding;
  onboarding.status = "backlog";
  onboarding.description = "Investigación y propuesta para reducir la fricción en los primeros 3 pasos.";
  onboarding.tags = ["investigación"];
  onboarding.ownerId = ID.diego;

  const projects = [release, growth, onboarding];

  /* ---------- Automation ---------- */
  const automation = newAutomation("Tras checklist completada → crear tarea de seguimiento");
  automation.id = ID.automation;
  automation.scope = { kind: "global" };
  automation.trigger = { type: "checklist.completed" };
  automation.actions = [
    { type: "createTask", title: "Hacer seguimiento del checklist completado", priority: "medium" },
  ];

  /* ---------- Notifications + Activity ---------- */
  const notifications: Notification[] = [
    {
      id: uuid(),
      type: "task.statusChanged",
      severity: "warning",
      message: "La tarea «Integrar pasarela de pago» está bloqueada",
      entityRef: { kind: "task", projectId: ID.projRelease },
      read: false,
      createdAt: ts(),
    },
    {
      id: uuid(),
      type: "checklist.completed",
      severity: "info",
      message: "Checklist «Definición de release» completada",
      entityRef: { kind: "checklist", projectId: ID.projRelease },
      read: false,
      createdAt: ts(),
    },
    {
      id: uuid(),
      type: "project.statusChanged",
      severity: "info",
      message: "«Rediseño onboarding» entró en backlog",
      entityRef: { kind: "project", projectId: ID.projOnboarding },
      read: true,
      createdAt: ts(),
    },
  ];
  const activity: ActivityEntry[] = [
    {
      id: uuid(),
      at: ts(),
      projectId: ID.projRelease,
      type: "task.statusChanged",
      message: "Beto movió «Integrar pasarela de pago» a bloqueado",
      entityRef: { kind: "task", projectId: ID.projRelease },
    },
    {
      id: uuid(),
      at: ts(),
      projectId: ID.projRelease,
      type: "checklist.completed",
      message: "Ana completó «Definición de release»",
      entityRef: { kind: "checklist", projectId: ID.projRelease },
    },
    {
      id: uuid(),
      at: ts(),
      projectId: ID.projGrowth,
      type: "task.added",
      message: "Carla añadió la tarea «Lanzar A/B de email de bienvenida»",
      entityRef: { kind: "task", projectId: ID.projGrowth },
    },
  ];

  return {
    orgName: "Nimbus",
    people,
    product,
    quarter,
    projectTypes: [typeRelease, typeGrowth],
    checklistTemplates: [clDefRelease, clQaRelease],
    processTemplates: [procReleaseNotes, procDeploy],
    projects,
    automations: [automation],
    notifications,
    activity,
  };
}

/* ===================== project enrichment ===================== */

/** Kanban (todo/doing/blocked/done), milestone, sprint, linked checklist item, comments/subtasks. */
function enrichRelease(p: Project): void {
  const ingenieria = p.areas.find((a) => a.name === "Ingeniería")!;
  const marketing = p.areas.find((a) => a.name === "Marketing")!;

  const sprintId = uuid();
  p.sprints = [
    {
      id: sprintId,
      name: "Sprint 12",
      goal: "Cerrar el flujo de facturación y dejar el onboarding estable.",
      startDate: "2026-07-07",
      endDate: "2026-07-18",
      status: "active",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];

  const kanban = [
    task("Diseñar flujo de facturación", ingenieria.id, "done", ID.diego, "high", sprintId),
    task("Implementar endpoint de suscripción", ingenieria.id, "done", ID.beto, "high", sprintId),
    task("Integrar pasarela de pago", ingenieria.id, "blocked", ID.beto, "critical", sprintId),
    task("Panel de métricas de uso", ingenieria.id, "doing", ID.beto, "medium", sprintId),
    task("Notificaciones de factura por email", ingenieria.id, "doing", ID.carla, "medium", null),
    task("Tests E2E del onboarding", ingenieria.id, "todo", ID.beto, "medium", null),
    task("Rate limiting en API pública", ingenieria.id, "todo", ID.beto, "low", null),
    task("Copys del estado vacío", marketing.id, "todo", ID.carla, "low", null),
  ];

  // Comments + subtasks on a representative task, so the detail view looks alive.
  const blocked = kanban.find((t) => t.status === "blocked")!;
  blocked.description = "La pasarela devuelve 401 en sandbox. Esperando credenciales de producción.";
  blocked.comments = [
    {
      id: uuid(),
      authorId: ID.beto,
      text: "Estoy esperando que ops me pase las llaves de producción.",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: uuid(),
      authorId: ID.ana,
      text: "Mientras tanto, ¿podemos avanzar con el mock para no frenar QA?",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];
  blocked.subtasks = [
    { id: uuid(), title: "Solicitar credenciales de producción", done: true, createdAt: nowIso(), updatedAt: nowIso() },
    { id: uuid(), title: "Implementar manejo de webhooks de la pasarela", done: false, createdAt: nowIso(), updatedAt: nowIso() },
  ];

  p.tasks = kanban;

  // Milestone «Beta cerrada» referencing the done tasks.
  const doneIds = kanban.filter((t) => t.status === "done").map((t) => t.id);
  p.milestones = [
    { id: uuid(), name: "Beta cerrada", dueDate: "2026-08-15", taskIds: doneIds, done: false },
  ];

  // Link a QA checklist item to a concrete task (HU-02: ≥1 item con linkedTaskId).
  const qaChecklist = ingenieria.checklists.find((c) => c.name === "QA de release");
  if (qaChecklist && qaChecklist.items.length > 0) {
    qaChecklist.items[0].linkedTaskId = kanban.find((t) => t.title.startsWith("Tests E2E"))!.id;
  }
}

function enrichGrowth(p: Project): void {
  const adq = p.areas.find((a) => a.name === "Adquisición")!;
  const tasks = [
    task("Lanzar A/B de email de bienvenida", adq.id, "doing", ID.carla, "high", null),
    task("Configurar programa de referidos", adq.id, "todo", ID.carla, "medium", null),
    task("Medir activación semanal (cohorte)", adq.id, "todo", ID.ana, "medium", null),
  ];
  // Checklist de experimento añadida manualmente (no es template global).
  const expCl = newChecklist("Checklist de experimento");
  expCl.items = [
    newItem("Hipótesis escrita y medible", true),
    newItem("Métrica principal e hips secundarias definidas", true),
    newItem("Tamaño muestral calculado"),
    newItem("Criterio de éxito/fallo definido"),
  ];
  adq.checklists = [expCl];
  p.tasks = tasks;
}

/* ===================== factory wrappers ===================== */

function mkPerson(id: string, name: string): Person {
  const p: Person = { id, name, email: "", roleTitle: "", createdAt: nowIso(), updatedAt: nowIso() };
  return p;
}

function mkChecklistTemplate(id: string, name: string, texts: string[]): ChecklistTemplate {
  const tpl = newChecklistTemplate(name);
  tpl.id = id;
  tpl.category = "Release";
  tpl.items = texts.map((text) => ({ id: uuid(), text, required: false }));
  return tpl;
}

function mkProcessTemplate(
  id: string,
  name: string,
  description: string,
  stepTexts: string[],
): ProcessTemplate {
  const tpl = newProcessTemplate(name);
  tpl.id = id;
  tpl.description = description;
  tpl.category = "Ingeniería";
  tpl.steps = stepTexts.map((text) => ({ id: uuid(), text, details: "" }));
  return tpl;
}

function mkProjectType(
  id: string,
  name: string,
  description: string,
  defaultAreas: ProjectType["defaultAreas"],
): ProjectType {
  const t = newProjectType(name);
  t.id = id;
  t.description = description;
  t.defaultAreas = defaultAreas;
  return t;
}

function mkProduct(): Product {
  const p = newProduct("Nimbus");
  p.id = ID.product;
  p.vision = "El tablero de proyectos que los equipos pequeños disfrutan usar.";
  p.description = "SaaS de gestión de proyectos local-first para equipos de producto de hasta 20 personas.";
  p.ownerId = ID.ana;
  p.objectives = [
    { id: uuid(), text: "Cerrar 10 clientes beta en Q3", target: "10", done: false },
    { id: uuid(), text: "NPS de onboarding ≥ 40", target: "40", done: false },
    { id: uuid(), text: "Facturación activa en producción", target: "", done: false },
  ];
  return p;
}

function mkQuarter(): Quarter {
  const q = newQuarter("Q3 2026");
  q.id = ID.quarter;
  q.goal = "Validar monetización y dejar el producto listo para abrir el beta pública.";
  q.startDate = "2026-07-01";
  q.endDate = "2026-09-30";
  q.status = "active";
  return q;
}

function task(
  title: string,
  areaId: string,
  status: "todo" | "doing" | "blocked" | "done",
  assigneeId: string,
  priority: "low" | "medium" | "high" | "critical",
  sprintId: string | null,
): Project["tasks"][number] {
  const t = newTask(title, areaId);
  t.status = status;
  t.assigneeId = assigneeId;
  t.priority = priority;
  t.sprintId = sprintId;
  t.summary = title.slice(0, 140);
  return t;
}

export const DEMO_SCHEMA_VERSION = SCHEMA_VERSION;
