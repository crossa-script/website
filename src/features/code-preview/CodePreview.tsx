import { useState } from "react";
import { CodeBlock } from "../../components/ui/CodeBlock";

interface CodeTab { readonly label: string; readonly language: string; readonly value: string; }
interface CodePreviewProps { readonly tabs: readonly CodeTab[]; }

export function CodePreview({ tabs }: CodePreviewProps): React.JSX.Element {
  const [active, setActive] = useState(0);
  const current = tabs[active] ?? tabs[0];
  if (!current) return <></>;
  return <div className="code-preview"><div className="code-preview__tabs" role="tablist" aria-label="Code languages">{tabs.map((tab, index) => <button key={tab.label} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)}>{tab.label}</button>)}</div><CodeBlock language={current.language}>{current.value}</CodeBlock></div>;
}
