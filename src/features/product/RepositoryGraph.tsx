import { useState } from "react";
import { Link } from "react-router";
import { repositories } from "../../content/product/story";
import { Visual } from "./Visual";

export function RepositoryGraph(): React.JSX.Element {
  const [selected, setSelected] = useState(0);
  const repository = repositories[selected]!;
  return <div className="repository-graph"><div><Visual name="ecosystem" /><div className="repository-nodes" role="group" aria-label="Select repository">{repositories.map((entry, index) => <button key={entry.id} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{entry.name}</button>)}</div></div><div className="repository-selection" aria-live="polite"><p>{repository.role}</p><h3>{repository.name}</h3><p>{repository.description}</p>{selected === 0 && <details><summary>Inside the core</summary><ul>{repository.folders.map(([folder, description]) => <li key={folder}><code>{folder}</code><p>{description}</p></li>)}</ul></details>}<Link className="product-link" to={`/repositories/${repository.id}`}>Explore source & integration ↗</Link></div></div>;
}
