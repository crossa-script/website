import { useState } from "react";
import { Braces, Boxes, Cpu, Network, PackageCheck, Sparkles, Waypoints } from "lucide-react";

const stages = [
  [".cra", "Typed source", Braces], ["Frontend", "Lexer, parser, linker", Waypoints], ["Semantic model", "Validated symbols and types", Sparkles], ["Typed IR", "Platform-neutral behavior", Boxes], ["Native runtime", "Scheduling, HTTP, decoding", Cpu], ["Stable ABI", "Controlled platform boundary", Network], ["Artifacts", "AAR and XCFramework", PackageCheck]
] as const;

export function ArchitectureVisualizer(): React.JSX.Element {
  const [active, setActive] = useState(0);
  return <div className="architecture" aria-label="Crossa compilation architecture"><div className="architecture__stages">{stages.map(([title, , Icon], index) => <button key={title} type="button" className={active === index ? "is-active" : ""} onFocus={() => setActive(index)} onMouseEnter={() => setActive(index)} onClick={() => setActive(index)}><Icon size={18} /><span>{title}</span><i aria-hidden="true">{index === stages.length - 1 ? "" : "↓"}</i></button>)}</div><div className="architecture__detail"><span>Stage {String(active + 1).padStart(2, "0")}</span><h3>{stages[active]?.[0]}</h3><p>{stages[active]?.[1]}</p></div></div>;
}
