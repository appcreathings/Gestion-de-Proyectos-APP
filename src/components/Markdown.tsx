import ReactMarkdown, { type Components } from "react-markdown";

/** Abre los enlaces externos en una pestaña nueva sin leaking `window.opener`. */
const components: Components = {
  // `node` llega desde react-markdown v9; lo descartamos para no spreadearlo
  // al DOM (React warns sobre atributos desconocidos).
  a: ({ node: _node, href, title, children, ...props }) => (
    <a
      {...props}
      href={href}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

/** Renders markdown with prose-like styling using design tokens. */
export function Markdown({ children }: { children: string }) {
  if (!children.trim()) {
    return <p className="text-sm italic text-muted-foreground">Sin contenido.</p>;
  }
  return (
    <div className="space-y-3 text-sm leading-relaxed [&>*:first-child]:mt-0 [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_em]:italic [&_h1]:mt-4 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_strong]:font-semibold">
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  );
}
