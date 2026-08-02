import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export interface Toast {
  id: string;
  variant: ToastVariant;
  message: string;
  key?: string;
}

export interface ToastState {
  toasts: Toast[];
}

const TOAST_LIMIT = 3;
const AUTO_DISMISS_MS = 4000;

function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function enqueueToast(state: ToastState, toast: Omit<Toast, "id">): ToastState {
  const { toasts } = state;
  const newToast: Toast = { ...toast, id: generateId() };

  let nextToasts: Toast[];

  if (toast.key) {
    const existingIndex = toasts.findIndex((t) => t.key === toast.key);
    if (existingIndex !== -1) {
      nextToasts = toasts.map((t, i) => (i === existingIndex ? newToast : t));
    } else {
      nextToasts = [...toasts, newToast];
    }
  } else {
    nextToasts = [...toasts, newToast];
  }

  if (nextToasts.length > TOAST_LIMIT) {
    const nonErrorIndex = nextToasts.findIndex((t) => t.variant !== "error");
    if (nonErrorIndex !== -1) {
      nextToasts = nextToasts.filter((_, i) => i !== nonErrorIndex);
    }
  }

  return { toasts: nextToasts };
}

export function dismissToast(state: ToastState, id: string): ToastState {
  return { toasts: state.toasts.filter((t) => t.id !== id) };
}

interface ToastStore extends ToastState {
  toast: {
    success: (message: string, key?: string) => void;
    error: (message: string, key?: string) => void;
    info: (message: string, key?: string) => void;
    dismiss: (id: string) => void;
  };
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  toast: {
    success: (message, key) => {
      const state = get();
      const next = enqueueToast(state, { variant: "success", message, key });
      set(next);
      setTimeout(() => {
        const newId = next.toasts[next.toasts.length - 1]?.id;
        if (newId) get().toast.dismiss(newId);
      }, AUTO_DISMISS_MS);
    },

    error: (message, key) => {
      const state = get();
      const next = enqueueToast(state, { variant: "error", message, key });
      set(next);
    },

    info: (message, key) => {
      const state = get();
      const next = enqueueToast(state, { variant: "info", message, key });
      set(next);
      setTimeout(() => {
        const newId = next.toasts[next.toasts.length - 1]?.id;
        if (newId) get().toast.dismiss(newId);
      }, AUTO_DISMISS_MS);
    },

    dismiss: (id) => {
      const state = get();
      const next = dismissToast(state, id);
      set(next);
    },
  },
}));