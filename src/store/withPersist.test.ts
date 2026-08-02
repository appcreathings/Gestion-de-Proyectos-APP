import { describe, it, expect, vi, beforeEach } from "vitest";
import { withPersist } from "@/store/withPersist";
import { useAppStore } from "@/store/useAppStore";
import { useToastStore } from "@/store/useToastStore";

describe("withPersist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({ writeStatus: "synced", lastWriteError: null, lastFailedOperation: null });
  });

  it("applies next state and persists successfully", async () => {
    const applyState = vi.fn();
    const persist = vi.fn().mockResolvedValue(undefined);
    const prevState = { value: "old" };
    const nextState = { value: "new" };

    await withPersist(prevState, nextState, applyState, persist);

    expect(applyState).toHaveBeenCalledWith(nextState);
    expect(persist).toHaveBeenCalledWith(nextState);
    expect(useAppStore.getState().writeStatus).toBe("synced");
    expect(useAppStore.getState().lastWriteError).toBeNull();
  });

  it("reverts to previous state on persist failure", async () => {
    const applyState = vi.fn();
    const persist = vi.fn().mockRejectedValue(new Error("Disk full"));
    const prevState = { value: "old" };
    const nextState = { value: "new" };

    await expect(withPersist(prevState, nextState, applyState, persist)).rejects.toThrow("Disk full");

    expect(applyState).toHaveBeenLastCalledWith(prevState);
    expect(persist).toHaveBeenCalledWith(nextState);
    expect(useAppStore.getState().writeStatus).toBe("error");
    expect(useAppStore.getState().lastWriteError).toBe("Disk full");
  });

  it("shows error toast on persist failure", async () => {
    const toastErrorSpy = vi.spyOn(useToastStore.getState().toast, "error");
    const applyState = vi.fn();
    const persist = vi.fn().mockRejectedValue(new Error("Permission denied"));
    const prevState = { value: "old" };
    const nextState = { value: "new" };

    await expect(withPersist(prevState, nextState, applyState, persist)).rejects.toThrow();

    expect(toastErrorSpy).toHaveBeenCalledWith("No se pudo guardar: Permission denied");
    toastErrorSpy.mockRestore();
  });

  it("shows special error toast when automations were already triggered", async () => {
    const toastErrorSpy = vi.spyOn(useToastStore.getState().toast, "error");
    const applyState = vi.fn();
    const persist = vi.fn().mockRejectedValue(new Error("Network error"));
    const prevState = { value: "old" };
    const nextState = { value: "new" };

    await expect(
      withPersist(prevState, nextState, applyState, persist, {
        alreadyTriggeredAutomations: true,
      }),
    ).rejects.toThrow();

    expect(toastErrorSpy).toHaveBeenCalledWith(
      "No se pudo guardar: Network error. El flujo ya se ejecutó; el cambio en pantalla no se pudo guardar.",
    );
    toastErrorSpy.mockRestore();
  });

  it("clears previous error on successful persist", async () => {
    useAppStore.setState({ writeStatus: "error", lastWriteError: "Previous error" });
    const applyState = vi.fn();
    const persist = vi.fn().mockResolvedValue(undefined);
    const prevState = { value: "old" };
    const nextState = { value: "new" };

    await withPersist(prevState, nextState, applyState, persist);

    expect(useAppStore.getState().writeStatus).toBe("synced");
    expect(useAppStore.getState().lastWriteError).toBeNull();
  });

  it("handles non-Error errors", async () => {
    const toastErrorSpy = vi.spyOn(useToastStore.getState().toast, "error");
    const applyState = vi.fn();
    const persist = vi.fn().mockRejectedValue("String error");
    const prevState = { value: "old" };
    const nextState = { value: "new" };

    await expect(withPersist(prevState, nextState, applyState, persist)).rejects.toBe("String error");

    expect(toastErrorSpy).toHaveBeenCalledWith("No se pudo guardar: String error");
    expect(useAppStore.getState().lastWriteError).toBe("String error");
    toastErrorSpy.mockRestore();
  });
});