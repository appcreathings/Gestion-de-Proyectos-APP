import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/paths";

/**
 * Sticky CTA that appears once the user has scrolled past the Hero.
 * Dismissable per-session (state in-memory, no localStorage: must not
 * outlive a session per brand guide — privacy by default).
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => {
      // El sentinel marca el final del bloque superior de la página. Antes esto
      // era `querySelector("section")`, que asumía el Hero de la landing: en un
      // post de blog el primer `<section>` es la primera sección del artículo,
      // así que el CTA aparecía en un punto arbitrario del texto. El fallback
      // conserva el comportamiento viejo donde todavía no hay sentinel.
      const anchor =
        document.querySelector("[data-cta-sentinel]") ?? document.querySelector("section");
      const anchorBottom = anchor ? anchor.getBoundingClientRect().bottom : 0;
      setVisible(anchorBottom < 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  if (dismissed) return null;
  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Llamada a la acción"
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pointer-events-none"
    >
      <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/95 px-2 py-1.5 shadow-lg backdrop-blur-md">
        <Link to={ROUTES.dashboard}>
          <Button size="sm" className="h-8 gap-2 px-3 text-sm">
            Abrir Hito
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Cerrar"
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
