import { useState } from "react";
import { Link, useParams } from "react-router";
import { PageTransition } from "../../components/ui/PageTransition";
import { repositories } from "../../content/product/story";
import { RepositoryGraph } from "../../features/product/RepositoryGraph";
import { Visual } from "../../features/product/Visual";
import { PlatformOutputs } from "../../features/product/PlatformOutputs";
import { RealApps } from "../../features/product/RealApps";
import { BenchmarkExplorer } from "../../features/benchmarks/BenchmarkExplorer";
import { Component as NotFound } from "../not-found/route";

function SourceTree({ repository }: { readonly repository: typeof repositories[number] }): React.JSX.Element {
  const [selected, setSelected] = useState(0);
  const folder = repository.folders[selected]!;
  return <div className="source-tree"><nav aria-label="Repository folders">{repository.folders.map(([path], index) => <button type="button" key={path} aria-pressed={selected === index} onClick={() => setSelected(index)}><span>↳</span> {path}</button>)}</nav><div aria-live="polite"><p>Source map</p><h3>{folder[0]}</h3><p>{folder[1]}</p><a className="product-link" href={`https://github.com/crossa-script/${repository.id === "crossa" ? "Crossa" : repository.id}/tree/main/${folder[0]}`} target="_blank" rel="noreferrer">Browse folder on GitHub ↗</a></div></div>;
}

export function Component(): React.JSX.Element {
  const { repository: id } = useParams();
  const repository = repositories.find((entry) => entry.id === id);
  if (id && !repository) return <NotFound />;
  if (!repository) return <PageTransition className="product-page"><header className="product-intro product-wide"><p className="chapter">The Crossa ecosystem</p><h1>Follow the source.<br /><span>Through to the app.</span></h1><p>Explore how the compiler and runtime connect to real Android and iOS consumers. Select a repository to inspect its role.</p></header><section className="product-wide product-section"><RepositoryGraph /></section><section className="product-wide product-finish"><h2>Read it. Build it. Trace it.</h2><Link className="product-link" to="/docs/getting-started">Start with the toolchain ↗</Link></section></PageTransition>;
  const platform = repository.id === "android-example" ? "android" : repository.id === "ios-example" ? "ios" : undefined;
  return <PageTransition className="product-page"><header className="product-intro product-wide"><Link className="product-link" to="/repositories">← Ecosystem</Link><p className="chapter">{repository.role}</p><h1>{repository.name}</h1><p>{repository.description}</p><a className="button button--secondary" href={`https://github.com/crossa-script/${repository.id === "crossa" ? "Crossa" : repository.id}`} target="_blank" rel="noreferrer">Open repository ↗</a></header><section className="product-wide repository-overview">{platform ? <><RealApps platform={platform} /><div><h2>The integration path.</h2><p className="integration-path">{repository.role}</p><Visual name={platform} /></div></> : <><div><h2>Source becomes<br />native behavior.</h2><p>The frontend links and validates the project before generators create platform surfaces. The runtime owns operation execution; the bindings own the boundary.</p></div><Visual name="pipeline" /></>}</section><section className="product-section product-wide"><h2>Find the implementation.</h2><SourceTree key={repository.id} repository={repository} /></section>{platform ? <><section className="product-section product-wide"><PlatformOutputs platform={platform} /></section><section className="product-section product-wide"><h2>Retained Release evidence.</h2><BenchmarkExplorer key={platform} initialPlatform={platform} /><Link className="product-link" to="/benchmarks">Inspect raw samples and provenance ↗</Link></section></> : <section className="product-section product-wide"><h2>Inside the native boundary.</h2><Visual name="runtime" /><Link className="product-link" to="/docs/runtime/architecture">Read the runtime contract ↗</Link></section>}</PageTransition>;
}
