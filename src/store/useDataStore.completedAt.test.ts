import { describe, it, expect, vi, beforeEach } from "vitest";

// Mismos mocks que useDataStore.runFlowNow.test.ts + adapter en memoria (spec 077 D5).
vi.mock("@/store/useFlowStore", () => ({
  useFlowStore: { getState: vi.fn() },
}));
vi.mock("@/flows/engine", () => ({
  runFlowEngine: vi.fn(),
  pollTriggerKey: () => "k",
}));
vi.mock("@/flows/manual-run", () => ({ fetchPollSampleForFlow: vi.fn() }));
vi.mock("@/storage/integration-db", () => ({
  integrationDb: { syncLogs: { add: vi.fn().mockResolvedValue(undefined) } },
}));

const write = vi.fn().mockResolvedValue(undefined);
vi.mock("@/store/useAppStore", () => ({
  useAppStore: {
    getState: vi.fn(() => ({
      adapter: {
        write,
        writeDoc: vi.fn().mockResolvedValue(undefined),
        removeBlobTree: vi.fn().mockResolvedValue(undefined),
      },
      workspace: null,
      setWriteError: vi.fn(),
      clearWriteError: vi.fn(),
      setWriting: vi.fn(),
    })),
  },
}));

const { useDataStore } = await import("@/store/useDataStore");
const { useFlowStore } = await import("@/store/useFlowStore");
const { runFlowEngine } = await import("@/flows/engine");
const { newProject, newTask } = await import("@/domain/factories");

function projectWith(status: "todo" | "doing" | "done") {
  const p = newProject("P");
  const t = newTask("T");
  t.status = status;
  return { ...p, tasks: [t] };
}

const stored = () => useDataStore.getState().projects[0].tasks[0];
const lastWritten = () => write.mock.calls.at(-1)![1].tasks[0];

describe("persistProject stamps completions (spec 077 D5)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDataStore.setState({ projects: [] });
  });

  it("saveProject stamps a task moved to done", async () => {
    const p = projectWith("todo");
    await useDataStore.getState().createProject(p);
    await useDataStore.getState().mutateProject(p.id, (x) => ({
      ...x,
      tasks: x.tasks.map((t) => ({ ...t, status: "done" as const })),
    }));
    expect(typeof stored().completedAt).toBe("string");
    expect(stored().completedAtEstimated).toBe(false);
    expect(typeof lastWritten().completedAt).toBe("string");
  });

  it("reopening clears completedAt", async () => {
    const p = projectWith("todo");
    await useDataStore.getState().createProject(p);
    const setStatus = (status: "done" | "doing") => (x: typeof p) => ({
      ...x,
      tasks: x.tasks.map((t) => ({ ...t, status })),
    });
    await useDataStore.getState().mutateProject(p.id, setStatus("done"));
    expect(stored().completedAt).not.toBeNull();
    await useDataStore.getState().mutateProject(p.id, setStatus("doing"));
    expect(stored().completedAt).toBeNull();
    expect(lastWritten().completedAt).toBeNull();
  });

  it("flow results are stamped too (HU-08)", async () => {
    const p = projectWith("todo");
    await useDataStore.getState().createProject(p);
    const closed = { ...p, tasks: p.tasks.map((t) => ({ ...t, status: "done" as const })) };

    const flow = {
      id: "f1",
      schemaVersion: 8,
      name: "F",
      enabled: true,
      trigger: { type: "event" as const, event: "task.statusChanged" as const },
      logic: { conditions: [], mapping: [] },
      outputs: [],
      lastRunAt: null,
      runCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    vi.mocked(useFlowStore.getState).mockReturnValue({
      flows: [flow],
      incrementRunCount: vi.fn(),
      recordRuns: vi.fn(),
    } as never);
    vi.mocked(runFlowEngine).mockResolvedValue({
      changedProjects: [closed],
      newProjects: [],
      newPeople: [],
      updatedPeople: [],
      notifications: [],
      outboundDeliveries: [],
      emailDeliveries: [],
      executedFlowIds: ["f1"],
      errors: [],
      traces: {},
    });

    await useDataStore.getState().runFlowNow("f1", {
      syntheticEvent: { type: "task.added", projectId: p.id, taskId: p.tasks[0].id },
    });

    expect(typeof stored().completedAt).toBe("string");
    expect(typeof lastWritten().completedAt).toBe("string");
  });
  it("a stale pre-close copy does not erase the close date (F1)", async () => {
    const p = projectWith("todo");
    await useDataStore.getState().createProject(p);
    const preClose = p.tasks[0];
    await useDataStore.getState().mutateProject(p.id, (x) => ({
      ...x,
      tasks: x.tasks.map((t) => ({ ...t, status: "done" as const })),
    }));
    const firstStamp = stored().completedAt;
    expect(typeof firstStamp).toBe("string");
    // Copia vieja del cajón: anterior al cierre, pero ya con status done.
    await useDataStore.getState().mutateProject(p.id, (x) => ({
      ...x,
      tasks: [{ ...preClose, status: "done" as const, actualHours: 3 }],
    }));
    expect(stored().actualHours).toBe(3);
    expect(stored().completedAt).toBe(firstStamp);
    expect(lastWritten().completedAt).toBe(firstStamp);
  });

  it("saveProject with trustIncomingCompletions keeps an incoming close date (F2)", async () => {
    const p = projectWith("todo");
    await useDataStore.getState().createProject(p);
    const remoteClose = "2026-01-02T10:00:00.000Z";
    const pulled = {
      ...p,
      tasks: p.tasks.map((t) => ({
        ...t,
        status: "done" as const,
        completedAt: remoteClose,
        completedAtEstimated: false,
      })),
    };
    await useDataStore.getState().saveProject(pulled, { trustIncomingCompletions: true });
    expect(stored().completedAt).toBe(remoteClose);
    // Última escritura de ESTE proyecto (el mock de flujos del test anterior
    // sigue activo y puede escribir otro proyecto después).
    const own = write.mock.calls.filter((c) => c[1].id === p.id).at(-1)!;
    expect(own[1].tasks[0].completedAt).toBe(remoteClose);
  });
});
