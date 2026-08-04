import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

/**
 * Tope de caja del diálogo.
 * - sm: confirmaciones y avisos cortos — crece con el contenido, sin min-h ni
 *   ancho de formulario (si no, "¿Descartar?" se ve con un mar de vacío).
 * - md/lg: formularios de entidad; confort de trabajo similar a xl (flows).
 * - xl: config de nodos en el canvas.
 * - full: altura fija al viewport.
 */
const DIALOG_SIZE: Record<DialogSize, string> = {
  // h-auto: el alto sigue al contenido (crítico en confirms sin DialogBody).
  sm: "h-auto max-h-[70vh] sm:max-w-md",
  md: "sm:min-h-[68vh] sm:max-h-[88vh] sm:w-[calc(100vw-3rem)] md:max-w-5xl",
  lg: "sm:min-h-[72vh] sm:max-h-[90vh] sm:w-[calc(100vw-2rem)] md:max-w-6xl",
  xl: "sm:min-h-[68vh] sm:max-h-[88vh] sm:w-[calc(100vw-3rem)] md:max-w-5xl",
  full: "sm:h-[99vh] md:h-[99vh] lg:h-[99vh] sm:w-[calc(100vw-1rem)] md:max-w-[min(96rem,calc(100vw-1rem))]",
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
          // Móvil (< sm): hoja inferior (bottom-0 + left/right 0).
          // Desktop (sm+): centrado. CRÍTICO: resetear bottom/right — si
          // quedan `bottom-0`+`top-1/2` (o `right-0`+`left-1/2`), CSS calcula
          // la caja por anclajes opuestos y el diálogo queda ~50vh de alto
          // con un mar de vacío (p. ej. ConfirmDialog "¿Descartar?").
          "bottom-0 left-0 right-0 top-auto max-h-[99vh] rounded-t-xl sm:bottom-auto sm:right-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl",
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
  // Chrome compacto: cede alto al body (formularios densos / config de flujos).
  return (
    <div
      className={cn("flex shrink-0 flex-col space-y-1 border-b px-4 py-3 sm:px-6 sm:py-3", className)}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // flex-1 + min-h-0: en paneles xl/lg de altura fija el body llena el
        // hueco entre header y footer y scrollea ahí (no se achica el panel).
        "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:gap-5 sm:px-6 sm:py-5",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col-reverse gap-2 border-t px-4 py-3 sm:flex-row sm:justify-end sm:px-6 sm:py-3",
        className,
      )}
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