import { ArrowRight, Braces, Smartphone } from "lucide-react";
import { Link } from "react-router";
import { CodePreview } from "../../features/code-preview/CodePreview";
import { PageTransition } from "../../components/ui/PageTransition";

const examples = [
  { title: "Pure function", description: "A small typed function that can be validated or executed with the CLI.", docs: "/docs/quick-start", tabs: [{ label: "CRA", language: "cra", value: `fun add(a: Int, b: Int): Int {\n    re a + b\n}\n\nprint(add(1, 2))` }] },
  { title: "Model", description: "A public model declaration used by typed request results.", docs: "/docs/language/models", tabs: [{ label: "CRA", language: "cra", value: `model Post(\n    userId: Int,\n    id: Int,\n    title: String,\n    body: String\n)` }] },
  { title: "Imported async request", description: "The checked-in import example resolves a repository function through a linked source graph.", docs: "/docs/language/imports", tabs: [{ label: "CRA", language: "cra", value: `import #postRequests.cra#\n\n@AsyncAfter\nfun getPosts(): List<Post> {\n    re fetchPosts()\n}` }, { label: "Android usage", language: "kotlin", value: `val operation = PostsRepository().getPosts { state ->\n    if (state is CrossaState.Success) {\n        val posts = state.data\n    }\n}` }, { label: "iOS usage", language: "swift", value: `let posts = try await\n    CrossaFunctions.fetchPosts(runtime: runtime)` }] }
] as const;

export function Component(): React.JSX.Element { return <PageTransition className="examples-page"><section className="shell page-intro"><p className="eyebrow">Verified source patterns</p><h1>Examples from the current Crossa language and consumers.</h1><p>Each sample follows the current language foundation or the checked-in Android/iOS integration code. They are not illustrative alternate APIs.</p></section><section className="shell examples-grid">{examples.map((example, index) => <article className="example-card" key={example.title}><div className="example-card__heading"><span>{index === 2 ? <Smartphone size={19} /> : <Braces size={19} />}</span><div><h2>{example.title}</h2><p>{example.description}</p></div></div><CodePreview tabs={example.tabs} /><Link to={example.docs}>Read related documentation <ArrowRight size={16} /></Link></article>)}</section></PageTransition>; }
