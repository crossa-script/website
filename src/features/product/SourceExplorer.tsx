import { useId, useState } from "react";
import { CodeBlock } from "../../components/ui/CodeBlock";
import { projectFiles } from "../../content/product/story";

export function SourceExplorer(): React.JSX.Element {
  const [active, setActive] = useState(0);
  const id = useId();
  const current = projectFiles[active]!;
  return <div className="source-explorer"><div className="source-explorer__bar"><span>android-example / crossa</span><span>4 source files</span></div><div className="source-tabs" role="tablist" aria-label="Crossa project files">{projectFiles.map((file, index) => <button type="button" key={file.label} id={`${id}-tab-${index}`} role="tab" aria-selected={active === index} aria-controls={`${id}-panel`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => { const next = event.key === "ArrowRight" ? (active + 1) % projectFiles.length : event.key === "ArrowLeft" ? (active + projectFiles.length - 1) % projectFiles.length : event.key === "Home" ? 0 : event.key === "End" ? projectFiles.length - 1 : null; if (next !== null) { event.preventDefault(); setActive(next); document.getElementById(`${id}-tab-${next}`)?.focus(); } }}>{file.label}</button>)}</div><div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} tabIndex={0}><CodeBlock language="cra">{current.value}</CodeBlock><p className="source-caption">{current.description}</p></div></div>;
}
