import { useEffect, useState, type RefObject } from "react";

type ReadingProgressProps = {
  /** Ref al `<article>` cuyo avance se mide. */
  targetRef: RefObject<HTMLElement>;
};

/**
 * Barra de avance de lectura — spec 059.
 *
 * Mide el progreso sobre el `<article>`, no sobre el documento: la página
 * incluye relacionados y footer, y contarlos haría que la barra marcara ~70%
 * justo cuando el lector termina el texto.
 *
 * Arranca en 0 en el primer render (servidor y cliente por igual) y recién el
 * efecto la mueve — así el HTML prerenderizado y el de hidratación coinciden.
 */
export function ReadingProgress({ targetRef }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const el = targetRef.current;
      if (!el) return;

      const { top, height } = el.getBoundingClientRect();
      // Distancia scrolleable del artículo: su alto menos lo que cabe en
      // pantalla. Si el artículo es más corto que el viewport no hay nada que
      // medir y la barra se queda en 0.
      const scrollable = height - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }

      const ratio = -top / scrollable;
      setProgress(Math.min(100, Math.max(0, ratio * 100)));
    };

    // Coalescing por rAF: `scroll` dispara decenas de veces por segundo y
    // `getBoundingClientRect` fuerza layout.
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetRef]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-14 z-40 h-0.5 bg-transparent"
    >
      <div
        className={`h-full bg-[hsl(var(--cat-h)_60%_45%)] dark:bg-[hsl(var(--cat-h)_65%_60%)] ${
          reducedMotion ? "" : "transition-[width] duration-150 ease-out"
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
