import {
  WorkspaceSchema,
  emptyWorkspace,
  type Workspace,
} from "@/domain/schemas";
import { migrateRecord, type MigrationKind } from "@/domain/migrations";
import { idbGet, idbSet } from "./idb";
import {
  collectionSchema,
  emptyDoc,
  type Collection,
  type DocName,
  type StorageAdapter,
} from "./StorageAdapter";
import { assertSafeAttachmentPath } from "@/domain/attachments/paths";

/**
 * Fallback for non-Chromium browsers (Firefox/Safari): keeps everything in
 * IndexedDB and offers export/import to .json. Same contract as FileSystemAdapter
 * so the UI is unchanged (constitución, principio VI).
 */
const KEY = (s: string) => `download:${s}`;
const BLOB_KEY = (path: string) => `download:blob:${path}`;
const BLOB_INDEX = "download:blob-index";

export class DownloadAdapter implements StorageAdapter {
  readonly kind = "download" as const;
  private ready = false;
  private migrationBackupDone = false;

  isReady(): boolean {
    return this.ready;
  }

  getRootName(): string | null {
    return null;
  }

  async changeFolder(): Promise<void> {
    throw new Error("changeFolder no soportado en el modo descarga");
  }

  /** Migrate a read record up to the current schema version, snapshotting once first. */
  private async migrateOnRead<T extends Record<string, unknown>>(
    kind: MigrationKind,
    raw: unknown,
  ): Promise<{ value: T; migrated: boolean }> {
    const { value, migrated } = migrateRecord(kind, raw as Record<string, unknown>);
    if (migrated && !this.migrationBackupDone) {
      this.migrationBackupDone = true;
      await this.backup().catch(() => undefined);
    }
    return { value: value as T, migrated };
  }

  async init(): Promise<void> {
    const ws = await idbGet<Workspace>(KEY("workspace"));
    if (!ws) await idbSet(KEY("workspace"), emptyWorkspace());
    this.ready = true;
  }

  async connect(): Promise<void> {
    await this.init();
  }

  async reconnect(): Promise<boolean> {
    await this.init();
    return true;
  }

  async readWorkspace(): Promise<Workspace> {
    const ws = (await idbGet<Workspace>(KEY("workspace"))) ?? emptyWorkspace();
    const { value, migrated } = await this.migrateOnRead("workspace", ws);
    if (migrated) await idbSet(KEY("workspace"), value);
    return WorkspaceSchema.parse(value);
  }

  async writeWorkspace(ws: Workspace): Promise<void> {
    await idbSet(KEY("workspace"), WorkspaceSchema.parse(ws));
  }

  async list(col: Collection): Promise<string[]> {
    return (await idbGet<string[]>(KEY(`list:${col}`))) ?? [];
  }

  async read<T>(col: Collection, id: string): Promise<T> {
    const data = await idbGet<unknown>(KEY(`${col}:${id}`));
    const { value, migrated } = await this.migrateOnRead(col, data);
    if (migrated) await idbSet(KEY(`${col}:${id}`), value);
    return collectionSchema[col].parse(value) as T;
  }

  async write<T extends { id: string }>(col: Collection, data: T): Promise<void> {
    const validated = collectionSchema[col].parse(data);
    await idbSet(KEY(`${col}:${data.id}`), validated);
    const ids = await this.list(col);
    if (!ids.includes(data.id)) await idbSet(KEY(`list:${col}`), [...ids, data.id]);
  }

  async remove(col: Collection, id: string): Promise<void> {
    const ids = await this.list(col);
    await idbSet(
      KEY(`list:${col}`),
      ids.filter((x) => x !== id),
    );
    await idbSet(KEY(`${col}:${id}`), undefined);
  }

  async readDoc<T>(name: DocName): Promise<T> {
    const raw = await idbGet<Record<string, unknown>>(KEY(`doc:${name}`));
    if (raw == null) return emptyDoc(name) as T;
    const { value, migrated } = await this.migrateOnRead<Record<string, unknown>>(name, raw);
    if (migrated) await idbSet(KEY(`doc:${name}`), value);
    return value as T;
  }

  async writeDoc<T>(name: DocName, data: T): Promise<void> {
    await idbSet(KEY(`doc:${name}`), data);
  }

  async writeBlob(relativePath: string, data: Blob | ArrayBuffer | Uint8Array): Promise<void> {
    assertSafeAttachmentPath(relativePath);
    // Siempre Blob: al releer desde IDB hace falta instancia real para
    // createObjectURL y para que <video>/<audio> vean un type usable.
    const blob =
      data instanceof Blob
        ? data
        : data instanceof Uint8Array
          ? new Blob([data.slice()])
          : new Blob([new Uint8Array(data)]);
    await idbSet(BLOB_KEY(relativePath), blob);
    const index = await idbGet<string[]>(BLOB_INDEX) ?? [];
    if (!index.includes(relativePath)) {
      await idbSet(BLOB_INDEX, [...index, relativePath]);
    }
  }

  async readBlob(relativePath: string): Promise<Blob> {
    assertSafeAttachmentPath(relativePath);
    const data = await idbGet<unknown>(BLOB_KEY(relativePath));
    if (data == null) throw new Error(`Blob no encontrado: ${relativePath}`);
    if (data instanceof Blob) return data;
    if (data instanceof ArrayBuffer) return new Blob([new Uint8Array(data)]);
    if (ArrayBuffer.isView(data)) {
      const view = data as ArrayBufferView;
      return new Blob([
        new Uint8Array(view.buffer, view.byteOffset, view.byteLength).slice(),
      ]);
    }
    throw new Error(`Blob inválido: ${relativePath}`);
  }

  async removeBlob(relativePath: string): Promise<void> {
    assertSafeAttachmentPath(relativePath);
    await idbSet(BLOB_KEY(relativePath), undefined);
    const index = await idbGet<string[]>(BLOB_INDEX) ?? [];
    await idbSet(BLOB_INDEX, index.filter((p) => p !== relativePath));
  }

  async removeBlobTree(relativePrefix: string): Promise<void> {
    assertSafeAttachmentPath(relativePrefix);
    const index = await idbGet<string[]>(BLOB_INDEX) ?? [];
    const toRemove = index.filter((p) => p.startsWith(relativePrefix));
    for (const path of toRemove) {
      await idbSet(BLOB_KEY(path), undefined);
    }
    await idbSet(BLOB_INDEX, index.filter((p) => !p.startsWith(relativePrefix)));
  }

  async exportAll(): Promise<Blob> {
    const bundle: Record<string, unknown> = {
      workspace: await this.readWorkspace(),
    };
    const cols: Collection[] = [
      "products",
      "projects",
      "project-types",
      "checklist-templates",
      "process-templates",
      "automations",
      "quarters",
    ];
    for (const col of cols) {
      const ids = await this.list(col);
      bundle[col] = await Promise.all(ids.map((id) => this.read(col, id)));
    }
    bundle.people = await this.readDoc("people");
    bundle.notifications = await this.readDoc("notifications");
    bundle.activity = await this.readDoc("activity");
    // Mismo fix que en FileSystemAdapter (spec 024 §F14): el export general
    // no incluía los Flujos modernos, solo la colección legacy `automations`.
    bundle.flows = await this.readDoc("flows");
    bundle["flow-runs"] = await this.readDoc("flow-runs");
    return new Blob([JSON.stringify(bundle, null, 2)], {
      type: "application/json",
    });
  }

  async importAll(blob: Blob): Promise<void> {
    const bundle = JSON.parse(await blob.text()) as Record<string, unknown>;
    if (bundle.workspace) await this.writeWorkspace(bundle.workspace as Workspace);
    const cols: Collection[] = [
      "products",
      "projects",
      "project-types",
      "checklist-templates",
      "process-templates",
      "automations",
      "quarters",
    ];
    for (const col of cols) {
      const items = (bundle[col] as { id: string }[]) ?? [];
      for (const item of items) await this.write(col, item);
    }
    if (bundle.people) await this.writeDoc("people", bundle.people);
    if (bundle.notifications)
      await this.writeDoc("notifications", bundle.notifications);
    if (bundle.activity) await this.writeDoc("activity", bundle.activity);
    if (bundle.flows) await this.writeDoc("flows", bundle.flows);
    if (bundle["flow-runs"]) await this.writeDoc("flow-runs", bundle["flow-runs"]);
  }

  async backup(): Promise<void> {
    await idbSet(KEY(`backup:${Date.now()}`), await (await this.exportAll()).text());
  }
}
