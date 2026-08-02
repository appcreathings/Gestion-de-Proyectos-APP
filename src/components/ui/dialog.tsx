import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

type DialogSize = "sm" | "md" | "lg" | "full";

const DIALOG_SIZE: Record<DialogSize, string> = {
  sm: "sm:max-h-[70vh] md:max-w-md",
  md: "sm:max-h-[85vh] md:max-w-2xl",
  lg: "sm:max-h-[90vh] md:max-w-4xl",
  full: "sm:h-[99vh] md:h-[99vh] lg:h-[99vh] md:max-w-5xl",
} as const;

interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: DialogSize;
  /** Texto anunciado como descripción del diálogo. Si el diseño no quiere
   *  texto visible bajo el título, se renderiza `sr-only` — pero existe. */
  description?: string;
  /** Declaración explícita de que este diálogo no necesita descripción
   *  (p. ej. un menú de comandos que ya se autoexplica). Sin esto NI
   *  `description`, el componente lo trata como un olvido, no una decisión. */
  descriptionless?: true;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, size = "md", description, descriptionless, ...props }, ref) => {
  const hasVisibleDescription = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === DialogDescription,
  );

  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 flex w-full flex-col overflow-hidden border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          // Móvil (< sm): hoja inferior, max-h-99vh. sm:+ la base no impone
          // altura — cada `size` decide su max-h / h, y `full` reproduce el
          // comportamiento anterior (CA-03.1, CA-03.4).
          "bottom-0 left-0 right-0 top-auto max-h-[99vh] rounded-t-xl sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl",
          DIALOG_SIZE[size],
          className,
        )}
        {...props}
        // `descriptionless` es la declaración explícita de "este diálogo no
        // necesita descripción": fuerza `aria-describedby={undefined}` para que
        // Radix no emita su aviso de Missing Description (CA-04.3). Sin esto NI
        // `description` NI una <DialogDescription> visible, el aviso se deja
        // aparecer a propósito — es la señal de que alguien olvidó decidir.
        {...(descriptionless ? { "aria-describedby": undefined } : {})}
      >
        {children}
        {description && !hasVisibleDescription && (
          <DialogDescription className="sr-only">{description}</DialogDescription>
        )}
        {/* Sin `description` ni `descriptionless` ni <DialogDescription> visible:
            NO se añade nada a propósito. El aviso `Missing Description` de Radix
            es la señal de desarrollo de que alguien olvidó decidir (CA-04.3). */}
        <DialogPrimitive.Close className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring sm:right-4 sm:top-4">
          <X className="size-4" />
          <span className="sr-only">Cerrar</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
DialogContent.displayName = "DialogContent";

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex shrink-0 flex-col space-y-2.5 border-b px-5 py-5 sm:px-8 sm:py-6", className)} {...props} />;
}

function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex min-h-0 flex-auto flex-col gap-5 overflow-y-auto p-5 sm:gap-6 sm:p-8", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex shrink-0 flex-col-reverse gap-3 border-t px-5 py-5 sm:flex-row sm:justify-end sm:px-8 sm:py-6", className)}
      {...props}
    />
  );
}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  type DialogSize,
  DIALOG_SIZE,
};