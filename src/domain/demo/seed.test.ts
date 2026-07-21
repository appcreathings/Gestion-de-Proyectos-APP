import { describe, it, expect } from "vitest";
import { WorkspaceSchema, type Workspace } from "@/domain/schemas";
import { collectionSchema, type Collection, type DocName, type StorageAdapter } from "@/storage/StorageAdapter";
import { buildDemoData } from "./seedData";
import { seedDemo } from "./seed";

/**
 * In-memory adapter that mirrors the real adapters' write-time validation
 * (`collectionSchema[col].parse`) so a successful `seedDemo` proves every
 * demo entity is schema-valid — exactly the HU-02 acceptance criterion.
 */
function makeRecordingAdapter(): StorageAdapter & {
  col(col: Collection): Map<string, unknown>;
  doc(name: DocName): unknown;
  ws(): Workspace;
} {
  const cols = new Map<Collection, Map<string, unknown>>();
  const docs = new Map<DocName, unknown>();
  let workspace: Workspace = WorkspaceSchema.parse({});

  return {
    kind: "download",
    async init() {
      /* no-op */
    },
    isReady: () => true,
    async list(col) {
      return [...(cols.get(col)?.keys() ?? [])];
    },
    async read(col, id) {
      return cols.get(col)?.get(id);
    },
    async write<T extends { id: string }>(col: Collection, data: T): Promise<void> {
      const validated = collectionSchema[col].parse(data);
      if (!cols.has(col)) cols.set(col, new Map());
      cols.get(col)!.set(data.id, validated);
    },
    async remove(col, id) {
      cols.get(col)?.delete(id);
    },
    async readDoc<T>(name: DocName): Promise<T> {
      return docs.get(name) as T;
    },
    async writeDoc<T>(name: DocName, data: T): Promise<void> {
      docs.set(name, data);
    },
    async readWorkspace() {
      return workspace;
    },
    async writeWorkspace(ws: Workspace) {
      workspace = WorkspaceSchema.parse(ws);
    },
    async connect() {
      /* no-op */
    },
    async reconnect() {
      return true;
    },
    async changeFolder() {
      /* no-op */
    },
    getRootName: () => null,
    async exportAll() {
      return new Blob(["{}"]);
    },
    async importAll() {
      /* no-op */
    },
    async backup() {
      /* no-op */
    },
    col: (c) => cols.get(c) ?? new Map(),
    doc: (n) => docs.get(n),
    ws: () => workspace,
  } as StorageAdapter & {
    col(col: Collection): Map<string, unknown>;
    doc(name: DocName): unknown;
    ws(): Workspace;
  };
}

describe("seedDemo (Nimbus)", () => {
  it("escribe sin lanzar — toda entidad pasa la validación Zod del adapter", async () => {
    const a = makeRecordingAdapter();
    await expect(seedDemo(a)).resolves.toBeUndefined();
  });

  it("alcanza los conteos mínimos del escenario (HU-02)", async () => {
    const a = makeRecordingAdapter();
    await seedDemo(a);

    expect(a.col("products").size).toBe(1);
    expect(a.col("projects").size).toBeGreaterThanOrEqual(3);
    expect(a.col("project-types").size).toBe(2);
    expect(a.col("checklist-templates").size).toBe(2);
    expect(a.col("process-templates").size).toBe(2);
    expect(a.col("quarters").size).toBe(1);
    expect(a.col("automations").size).toBe(1);

    const people = (a.doc("people") as { people: unknown[] }).people;
    expect(people.length).toBe(4);

    const activity = (a.doc("activity") as { entries: unknown[] }).entries;
    expect(activity.length).toBeGreaterThan(0);
    const notifications = (a.doc("notifications") as { notifications: unknown[] }).notifications;
    expect(notifications.length).toBeGreaterThan(0);
  });

  it("el workspace queda con org «Nimbus»", async () => {
    const a = makeRecordingAdapter();
    await seedDemo(a);
    expect(a.ws().org.name).toBe("Nimbus");
  });

  it("el producto Nimbus tiene visión y objetivos", async () => {
    const d = buildDemoData();
    expect(d.product.name).toBe("Nimbus");
    expect(d.product.vision.length).toBeGreaterThan(0);
    expect(d.product.objectives.length).toBeGreaterThanOrEqual(2);
  });

  it("el proyecto principal cubre los 4 estados del Kanban y tiene salud no-verde", async () => {
    const d = buildDemoData();
    const release = d.projects.find((p) => p.name === "Lanzamiento v1.0")!;
    expect(release).toBeTruthy();
    expect(release.health).toBe("amber");

    const statuses = new Set(release.tasks.map((t) => t.status));
    for (const s of ["todo", "doing", "blocked", "done"] as const) {
      expect(statuses.has(s)).toBe(true);
    }
  });

  it("el proyecto principal tiene RACI poblado, hito, sprint activo, proceso con pasos y comentario+subtarea", async () => {
    const d = buildDemoData();
    const release = d.projects.find((p) => p.name === "Lanzamiento v1.0")!;

    expect(release.stakeholders.length).toBeGreaterThanOrEqual(4);
    expect(release.milestones.length).toBe(1);
    expect(release.milestones[0].name).toBe("Beta cerrada");
    expect(release.sprints.filter((s) => s.status === "active")).toHaveLength(1);

    const hasProcessWithSteps = release.areas.some((area) =>
      area.processes.some((proc) => proc.steps.length > 0),
    );
    expect(hasProcessWithSteps).toBe(true);

    const taskWithDiscussion = release.tasks.find((t) => t.comments.length > 0 && t.subtasks.length > 0);
    expect(taskWithDiscussion).toBeTruthy();
  });

  it("≥1 ítem de checklist está enlazado a una tarea (linkedTaskId)", async () => {
    const d = buildDemoData();
    const linked = d.projects.some((p) =>
      p.areas.some((a) =>
        a.checklists.some((cl) => cl.items.some((it) => it.linkedTaskId !== null)),
      ),
    );
    expect(linked).toBe(true);
  });

  it("el proyecto de growth tiene salud verde y el de onboarding está en backlog", async () => {
    const d = buildDemoData();
    const growth = d.projects.find((p) => p.name === "Growth Q3")!;
    expect(growth.health).toBe("green");
    const onboarding = d.projects.find((p) => p.name === "Rediseño onboarding")!;
    expect(onboarding.status).toBe("backlog");
  });

  it("la automatización usa el trigger checklist.completed y crea una tarea de seguimiento", async () => {
    const d = buildDemoData();
    expect(d.automations).toHaveLength(1);
    expect(d.automations[0].trigger.type).toBe("checklist.completed");
    expect(d.automations[0].actions.some((a) => a.type === "createTask")).toBe(true);
  });
});
