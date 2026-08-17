import { Hash } from "lucide-react";

type SectionAnchorProps = {
  id: string;
  heading: string;
};

/**
 * Enlace permanente a una sección — spec 059. Oculto hasta que el heading
 * recibe hover o el propio ancla recibe foco de teclado, para no ensuciar la
 * lectura pero seguir siendo alcanzable sin mouse.
 *
 * Es un `<a href="#id">` de verdad, no un botón con JS: funciona sin
 * hidratar y el navegador se encarga del scroll (con el `scroll-margin-top`
 * de `index.css` compensando el nav fijo).
 */
export function SectionAnchor({ id, heading }: SectionAnchorProps) {
  return (
    <a
      href={`#${id}`}
      aria-label={`Enlace a la sección «${heading}»`}
      className="ml-2 inline-flex align-middle text-muted-foreground/50 opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
    >
      <Hash className="size-4" aria-hidden />
    </a>
  );
}
