import { useState } from "react";
import { Link } from "react-router";
import { PageTransition } from "../../components/ui/PageTransition";
import { CodeBlock } from "../../components/ui/CodeBlock";
import { SourceExplorer } from "../../features/product/SourceExplorer";
import { PlatformOutputs } from "../../features/product/PlatformOutputs";
import { Visual } from "../../features/product/Visual";
import { projectFiles } from "../../content/product/story";

const examples = [
  { title: "Basic function", description: "An explicit Int result. The frontend checks both inputs and the return expression.", source: "fun add(a: Int, b: Int): Int {\n    re a + b\n}\n\nprint(add(1, 2))", semantics: "Int × Int → Int", output: "Run with crossa run, or generate pure Kotlin with crossa generate kotlin.", docs: "/docs/quick-start" },
  { title: "Models", description: "A typed response contract that becomes native model storage and generated platform views.", source: projectFiles[0]!.value, semantics: "Post → userId: Int / id: Int / title: String / body: String", output: "Generated Post models expose native-backed fields to Kotlin and Swift.", docs: "/docs/language/models" },
  { title: "Multi-file project", description: "One import graph connects models, operations and a repository. Configuration sets project-wide policy.", source: "", semantics: "Post.cra → postRequests.cra → postsRepository.cra", output: "The linked project supplies operations and models to each platform artifact.", docs: "/docs/language/imports" },
  { title: "Network request", description: "The native request is validated against the function’s declared result before platform generation.", source: projectFiles[1]!.value, semantics: "AsyncAfter → GET /posts → List<Post>", output: "Native completion becomes Success, Failed or Cancelled. Both platform APIs retain those semantics.", docs: "/docs/networking" },
  { title: "Android integration", description: "A generated Kotlin callback sits over JNI and the shared runtime.", source: "", semantics: "AAR → Kotlin → JNI → native execution", output: "Retain the operation for cancellation and release native-backed lists after use.", docs: "/docs/android" },
  { title: "iOS integration", description: "Swift async APIs bridge native completion through the stable C ABI.", source: "", semantics: "XCFramework → Swift → C ABI → native execution", output: "The runtime has explicit ownership. Model and list values retain their native result owner.", docs: "/docs/ios" }
] as const;
export function Component(): React.JSX.Element {
  const [selected, setSelected] = useState(0);
  const example = examples[selected]!;
  return <PageTransition className="product-page"><header className="product-intro product-wide"><p className="chapter">A guided source explorer</p><h1>Write the behavior.<br /><span>See where it goes.</span></h1><p>Follow real Crossa syntax from source to understood semantics, generated artifacts and application calls.</p></header><section className="product-wide examples-explorer"><nav aria-label="Choose an example">{examples.map((entry, index) => <button key={entry.title} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{entry.title}</button>)}</nav><article><h2>{example.title}</h2><p>{example.description}</p>{selected === 2 ? <SourceExplorer /> : selected >= 4 ? <PlatformOutputs platform={selected === 4 ? "android" : "ios"} /> : <CodeBlock language="cra">{example.source}</CodeBlock>}<div className="understood-semantics"><span>What Crossa understands</span><pre>{example.semantics}</pre><span>What reaches your app</span><p>{example.output}</p></div>{selected < 4 && <Visual name={selected === 0 ? "pipeline" : "ecosystem"} />}<Link className="product-link" to={example.docs}>Read the complete contract ↗</Link></article></section></PageTransition>;
}
