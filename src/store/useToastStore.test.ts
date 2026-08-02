import { describe, it, expect } from "vitest";
import { enqueueToast, dismissToast, type ToastState } from "@/store/useToastStore";

describe("useToastStore pure functions", () => {
  describe("enqueueToast", () => {
    it("adds a toast to empty state", () => {
      const state: ToastState = { toasts: [] };
      const next = enqueueToast(state, { variant: "success", message: "Test" });
      expect(next.toasts).toHaveLength(1);
      expect(next.toasts[0]).toMatchObject({
        variant: "success",
        message: "Test",
      });
      expect(next.toasts[0].id).toMatch(/^toast-\d+-[a-z0-9]+$/);
    });

    it("replaces toast with same key", () => {
      const state: ToastState = {
        toasts: [
          { id: "toast-1", variant: "success", message: "Old", key: "test-key" },
        ],
      };
      const next = enqueueToast(state, {
        variant: "error",
        message: "New",
        key: "test-key",
      });
      expect(next.toasts).toHaveLength(1);
      expect(next.toasts[0].message).toBe("New");
      expect(next.toasts[0].variant).toBe("error");
    });

    it("appends toast with different key", () => {
      const state: ToastState = {
        toasts: [
          { id: "toast-1", variant: "success", message: "First", key: "key-1" },
        ],
      };
      const next = enqueueToast(state, {
        variant: "success",
        message: "Second",
        key: "key-2",
      });
      expect(next.toasts).toHaveLength(2);
      expect(next.toasts[1].message).toBe("Second");
    });

    it("keeps error toast when over limit", () => {
      const state: ToastState = {
        toasts: [
          { id: "toast-1", variant: "success", message: "First" },
          { id: "toast-2", variant: "success", message: "Second" },
          { id: "toast-3", variant: "error", message: "Error" },
        ],
      };
      const next = enqueueToast(state, { variant: "info", message: "Fourth" });
      expect(next.toasts).toHaveLength(3);
      const errorToast = next.toasts.find((t) => t.variant === "error");
      expect(errorToast).toBeDefined();
      expect(errorToast?.message).toBe("Error");
    });

    it("removes oldest non-error when at limit", () => {
      const state: ToastState = {
        toasts: [
          { id: "toast-1", variant: "success", message: "First" },
          { id: "toast-2", variant: "info", message: "Second" },
          { id: "toast-3", variant: "success", message: "Third" },
        ],
      };
      const next = enqueueToast(state, { variant: "success", message: "Fourth" });
      expect(next.toasts).toHaveLength(3);
      expect(next.toasts[0].message).not.toBe("First");
    });

    it("handles all toast variants", () => {
      const state: ToastState = { toasts: [] };
      const successNext = enqueueToast(state, { variant: "success", message: "Success" });
      const errorNext = enqueueToast(successNext, { variant: "error", message: "Error" });
      const infoNext = enqueueToast(errorNext, { variant: "info", message: "Info" });

      expect(infoNext.toasts).toHaveLength(3);
      expect(infoNext.toasts[0].variant).toBe("success");
      expect(infoNext.toasts[1].variant).toBe("error");
      expect(infoNext.toasts[2].variant).toBe("info");
    });
  });

  describe("dismissToast", () => {
    it("removes toast by id", () => {
      const state: ToastState = {
        toasts: [
          { id: "toast-1", variant: "success", message: "First" },
          { id: "toast-2", variant: "error", message: "Second" },
          { id: "toast-3", variant: "info", message: "Third" },
        ],
      };
      const next = dismissToast(state, "toast-2");
      expect(next.toasts).toHaveLength(2);
      expect(next.toasts.find((t) => t.id === "toast-2")).toBeUndefined();
    });

    it("returns unchanged state when id not found", () => {
      const state: ToastState = {
        toasts: [{ id: "toast-1", variant: "success", message: "First" }],
      };
      const next = dismissToast(state, "toast-999");
      expect(next.toasts).toHaveLength(1);
      expect(next.toasts[0].id).toBe("toast-1");
    });

    it("handles empty state", () => {
      const state: ToastState = { toasts: [] };
      const next = dismissToast(state, "toast-1");
      expect(next.toasts).toHaveLength(0);
    });
  });
});