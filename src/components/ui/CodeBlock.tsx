import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  readonly language?: string;
  readonly children: string;
}

export function CodeBlock({ language = "text", children }: CodeBlockProps): React.JSX.Element {
  return (
    <div className="code-block">
      <div className="code-block__bar"><span>{language}</span><CopyButton value={children} /></div>
      <pre><code>{children}</code></pre>
    </div>
  );
}
