import { emptyWorkspace } from "@/domain/schemas";
import type { StorageAdapter } from "@/storage";
import { buildDemoData } from "./seedData";

/**
 * Seed the Nimbus demo workspace into the given adapter (spec 030 §5).
 *
 * Writes every collection via `adapter.write` and aggregated docs via
 * `adapter.writeDoc` — the same primitives `useDataStore` uses, so the demo
 * hydrates exactly like user-created data. `hydrate()` reads from
 * `adapter.list`/`read` (not from `workspace.index`), so populating the
 * denormalized index is unnecessary.
 */
export async function seedDemo(adapter: StorageAdapter): Promise<void> {
  const d = buildDemoData();

  // Workspace first: org name "Nimbus" for a cohesive demo identity.
  const ws = { ...emptyWorkspace(), org: { name: d.orgName } };
  await adapter.writeWorkspace(ws);

  await adapter.write("products", d.product);
  await adapter.write("quarters", d.quarter);
  for (const t of d.projectTypes) await adapter.write("project-types", t);
  for (const t of d.checklistTemplates) await adapter.write("checklist-templates", t);
  for (const t of d.processTemplates) await adapter.write("process-templates", t);
  for (const p of d.projects) await adapter.write("projects", p);
  for (const a of d.automations) await adapter.write("automations", a);

  await adapter.writeDoc("people", { schemaVersion: d.product.schemaVersion, people: d.people });
  await adapter.writeDoc("notifications", {
    schemaVersion: d.product.schemaVersion,
    notifications: d.notifications,
  });
  await adapter.writeDoc("activity", { schemaVersion: d.product.schemaVersion, entries: d.activity });
}
