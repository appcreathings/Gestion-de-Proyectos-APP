import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

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
  // GFM tables (remark-gfm): scroll horizontal + bordes legibles en el chat.
  table: ({ node: _node, children, ...props }) => (
    <div className="my-2 max-w-full overflow-x-auto rounded-md border border-border">
      <table {...props} className="w-full min-w-[12rem] border-collapse text-left text-xs">
        {children}
      </table>
    </div>
  ),
  thead: ({ node: _node, children, ...props }) => (
    <thead {...props} className="bg-muted/60">
      {children}
    </thead>
  ),
  th: ({ node: _node, children, ...props }) => (
    <th
      {...props}
      className="border-b border-border px-2.5 py-1.5 font-semibold text-foreground"
    >
      {children}
    </th>
  ),
  td: ({ node: _node, children, ...props }) => (
    <td {...props} className="border-b border-border/70 px-2.5 py-1.5 align-top">
      {children}
    </td>
  ),
  tr: ({ node: _node, children, ...props }) => (
    <tr {...props} className="even:bg-muted/30">
      {children}
    </tr>
  ),
};

/** Renders markdown with prose-like styling using design tokens. */
export function Markdown({ children }: { children: string }) {
  if (!children.trim()) {
    return <p className="text-sm italic text-muted-foreground">Sin contenido.</p>;
  }
  return (
    <div className="space-y-3 text-sm leading-relaxed [&>*:first-child]:mt-0 [&_a]:text-primary [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_em]:italic [&_h1]:mt-4 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_strong]:font-semibold">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
