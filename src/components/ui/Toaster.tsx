import { useToastStore, type ToastVariant } from "@/store/useToastStore";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const TOAST_ICONS: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const TOAST_CLASSES: Record<ToastVariant, string> = {
  success: "border-green-500/50 bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-100",
  error: "border-red-500/50 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100",
  info: "border-blue-500/50 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100",
};

function SingleToast({ toast }: { toast: { id: string; variant: ToastVariant; message: string } }) {
  const Icon = TOAST_ICONS[toast.variant];
  const { toast: toastActions } = useToastStore();

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 shadow-sm",
        TOAST_CLASSES[toast.variant],
      )}
    >
      <Icon className="mt-0.5 size-5 shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => toastActions.dismiss(toast.id)}
        className="shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5"
        aria-label="Cerrar"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const successToasts = toasts.filter((t) => t.variant === "success" || t.variant === "info");
  const errorToasts = toasts.filter((t) => t.variant === "error");

  return (
    <>
      {errorToasts.length > 0 && (
        <div
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="fixed right-4 top-4 z-[9999] flex w-full max-w-sm flex-col gap-2"
        >
          {errorToasts.map((toast) => (
            <SingleToast key={toast.id} toast={toast} />
          ))}
        </div>
      )}
      {successToasts.length > 0 && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="fixed right-4 top-4 z-[9999] flex w-full max-w-sm flex-col gap-2"
        >
          {successToasts.map((toast) => (
            <SingleToast key={toast.id} toast={toast} />
          ))}
        </div>
      )}
    </>
  );
}