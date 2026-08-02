import * as React from "react";

export interface ClickableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Se activa con clic, Enter o Espacio. Si es `undefined`, la tarjeta se
   *  renderiza como un `<div>` plano (sin rol ni foco) — útil para estados
   *  visuales no interactivos como el ghost de un arrastre. */
  onActivate?: () => void;
}

/** Reemplaza el patrón `<div onClick>` inaccesible por teclado. Añade
 *  `role="button"` + `tabIndex={0}` + manejo de Enter/Espacio, reutilizando el
 *  anillo de foco definido en `index.css` (`[role="button"]:focus-visible`).
 *
 *  La guarda `e.target !== e.currentTarget` evita el doble disparo cuando un
 *  control interno (checkbox, menú, botón) ya gestionó la tecla (R5, CA-05.1). */
export const ClickableCard = React.forwardRef<HTMLDivElement, ClickableCardProps>(
  function ClickableCard({ onActivate, onKeyDown, onClick, children, ...props }, ref) {
    const interactive = Boolean(onActivate);
    return (
      <div
        ref={ref}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onClick={interactive ? onActivate : onClick}
        onKeyDown={
          interactive
            ? (e) => {
                // Un control interno (button/input) ya maneja su propia tecla.
                if (e.target !== e.currentTarget) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onActivate!();
                }
                onKeyDown?.(e);
              }
            : onKeyDown
        }
        {...props}
      >
        {children}
      </div>
    );
  },
);
