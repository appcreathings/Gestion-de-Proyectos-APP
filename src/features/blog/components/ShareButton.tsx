import { useEffect, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

type ShareButtonProps = {
  title: string;
  /** URL absoluta a compartir. */
  url: string;
  className?: string;
};

/**
 * Compartir sin terceros — spec 059. `navigator.share` en móvil, copiar al
 * portapapeles en escritorio. Cero SDK, cero iframes, cero pixeles: la guía de
 * marca prohíbe scripts de terceros y los botones sociales embebidos son
 * justamente eso.
 *
 * La detección de capacidades vive en `useEffect` a propósito: `navigator` no
 * existe durante el prerender, y decidir el markup en render provocaría un
 * hydration mismatch. El primer render (servidor y cliente) es siempre el mismo
 * botón; recién después el efecto lo oculta si el navegador no puede hacer nada.
 */
export function ShareButton({ title, url, className }: ShareButtonProps) {
  const [supported, setSupported] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSupported(
      typeof navigator !== "undefined" &&
        (typeof navigator.share === "function" ||
          typeof navigator.clipboard?.writeText === "function"),
    );
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  if (!supported) return null;

  const handleShare = async () => {
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // El usuario canceló el diálogo nativo, o el portapapeles está bloqueado
      // por permisos. Ninguno de los dos es un error que valga interrumpir la
      // lectura: el enlace sigue estando en la barra de direcciones.
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      aria-label={copied ? "Enlace copiado" : "Compartir este artículo"}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:border-border hover:text-foreground ${className ?? ""}`}
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-success" aria-hidden />
          ¡Copiado!
        </>
      ) : (
        <>
          <Share2 className="size-3.5 sm:hidden" aria-hidden />
          <Link2 className="hidden size-3.5 sm:block" aria-hidden />
          Compartir
        </>
      )}
    </button>
  );
}
