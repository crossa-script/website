import { ArrowRight, ArrowUpRight, BookOpen, Boxes, Braces, Check, ChevronRight, Code2, Cpu, Download, Github, Layers3, Terminal } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import { CodePreview } from "../../features/code-preview/CodePreview";
import { ArchitectureVisualizer } from "../../features/architecture-visualizer/ArchitectureVisualizer";
import { BenchmarkExplorer } from "../../features/benchmarks/BenchmarkExplorer";

const requestCode = `model Post(
    id: Int,
    title: String
)

@AsyncAfter
fun getPosts(): List<Post> {
    re CrossaRequest {
        url: "https://jsonplaceholder.typicode.com/posts",
        method: GET
    }
}`;

const kotlinCode = `PostsRepository().getPosts { state ->
    when (state) {
        is CrossaState.Success -> state.data
        is CrossaState.Failed -> throw state.error
        CrossaState.Cancelled -> Unit
    }
}`;

const swiftCode = `let posts = try await
    CrossaFunctions.fetchPosts(runtime: runtime)

for post in posts {
    print(post.title)
}`;

const languageSamples = [
  { label: "Function", value: `fun add(a: Int, b: Int): Int {\n    re a + b\n}` },
  { label: "Model", value: `model User(\n    id: Int,\n    name: String\n)` },
  { label: "Request", value: `@AsyncAfter\nfun getUser(id: Int): User {\n    re CrossaRequest {\n        url: "https://api.example.com/users/#id"\n        method: GET\n    }\n}` },
  { label: "Import", value: `import #models.cra#\n\nprint(getPosts())` }
] as const;

function SectionEyebrow({ children }: { readonly children: React.ReactNode }): React.JSX.Element { return <p className="eyebrow">{children}</p>; }

function Reveal({ children, className }: { readonly children: React.ReactNode; readonly className?: string }): React.JSX.Element {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>{children}</motion.div>;
}

export function Component(): React.JSX.Element {
  return <>
    <section className="hero"><div className="shell hero-grid"><div className="hero-copy"><SectionEyebrow><span className="pulse" /> Crossa V0 · compiler and native runtime</SectionEyebrow><h1>Define it once.<br /><em>Ship native clients.</em></h1><p>Crossa turns typed <code>.cra</code> programs into Android and iOS APIs over a shared C++ execution path—without rebuilding client infrastructure on each platform.</p><div className="hero-actions"><Link className="button button--primary" to="/docs/getting-started">Get started <ArrowRight size={17} /></Link><Link className="button button--secondary" to="/docs">Read the docs</Link></div><a className="text-link" href="https://github.com/crossa-script/Crossa" target="_blank" rel="noreferrer"><Github size={16} /> View Crossa on GitHub <ArrowUpRight size={15} /></a></div><Reveal className="hero-visual"><div className="visual-chrome"><span /><span /><span /><b>native request pipeline</b></div><div className="hero-pipeline"><div className="pipeline-code"><div className="code-label"><Braces size={15} /> posts.cra</div><pre>{requestCode}</pre></div><div className="pipeline-flow" aria-label="Compilation flow"><span>CRA</span><i>↓</i><span>IR</span><i>↓</i><span>C++</span></div><div className="pipeline-output"><div className="output-tabs"><b>Android</b><span>iOS</span></div><pre>{kotlinCode}</pre><div className="output-chip"><Check size={14} /> Native-backed result view</div></div></div></Reveal></div><div className="shell hero-status"><span><Check size={16} /> C++ frontend and typed IR</span><span><Check size={16} /> Native HTTP/JSON runtime</span><span><Check size={16} /> Android AAR + iOS XCFramework</span><Link to="/docs">What is in progress? <ChevronRight size={15} /></Link></div></section>

    <section id="product" className="section"><div className="shell"><Reveal><SectionEyebrow>How Crossa works</SectionEyebrow><div className="section-heading"><h2>One semantic path.<br /><span>Two platform outputs.</span></h2><p>Source is parsed once by the C++ frontend. The generated platform layer stays thin while request execution, scheduling, decoding, and result ownership remain native.</p></div></Reveal><ArchitectureVisualizer /></div></section>

    <section className="section section--raised"><div className="shell native-grid"><Reveal><SectionEyebrow>Native by design</SectionEyebrow><h2>Keep the critical path where it belongs.</h2><p className="section-lede">Crossa is designed so Kotlin and Swift integrate with the runtime rather than recreate compiler, transport, parser, or scheduler work.</p><Link className="text-link" to="/docs/runtime/architecture">Read runtime architecture <ArrowRight size={16} /></Link></Reveal><div className="differentiators"><Reveal className="differentiator differentiator--large"><Cpu size={22} /><h3>C++ hot path</h3><p>Transport, response buffers, decoding, native models, errors, and scheduling remain in the runtime.</p><div className="signal-lines"><i /><i /><i /></div></Reveal><Reveal className="differentiator"><Boxes size={20} /><h3>Compile-time specialization</h3><p>Known source semantics lower into typed executable plans.</p></Reveal><Reveal className="differentiator"><Layers3 size={20} /><h3>Thin boundaries</h3><p>Platform APIs expose results without a second implementation.</p></Reveal><Reveal className="differentiator differentiator--wide"><Code2 size={20} /><div><h3>Shared semantics</h3><p>Android and iOS consume the same compiler and runtime behavior through a controlled ABI.</p></div></Reveal></div></div></section>

    <section className="section"><div className="shell language-grid"><Reveal><SectionEyebrow>The language</SectionEyebrow><h2>Small enough to stay deliberate.</h2><p>Crossa language is for typed models, functions, configuration, execution policy, and native requests. It is not a general-purpose language.</p><ul className="check-list"><li><Check size={16} /> Explicit types and a focused surface</li><li><Check size={16} /> Linked <code>.cra</code> import graphs</li><li><Check size={16} /> <code>@AsyncAfter</code> terminal states</li></ul><Link className="button button--secondary" to="/docs/language">Explore the language <ArrowRight size={16} /></Link></Reveal><Reveal><div className="language-panel"><div className="language-panel__header"><span>Language surface</span><span>CRA V0</span></div><CodePreview tabs={languageSamples.map((sample) => ({ label: sample.label, language: "cra", value: sample.value }))} /><div className="language-panel__footer"><span><span className="dot dot--violet" /> Semantic analysis</span><span>typed IR</span></div></div></Reveal></div></section>

    <section className="section platform-section"><div className="shell"><Reveal><SectionEyebrow>Generated platform artifacts</SectionEyebrow><div className="section-heading"><h2>Built for Android.<br />Prepared for iOS.</h2><p>Each output keeps Crossa’s native request pipeline intact while presenting an ergonomic integration surface for its platform.</p></div></Reveal><div className="platform-grid"><Reveal className="platform-card platform-card--android"><span className="platform-mark">A</span><div><h3>Android</h3><p><code>.cra</code> → generated Kotlin API → JNI → Crossa runtime → AAR</p><pre>{kotlinCode}</pre><Link to="/docs/android">Android documentation <ArrowRight size={16} /></Link></div></Reveal><Reveal className="platform-card platform-card--ios"><span className="platform-mark">i</span><div><h3>iOS</h3><p><code>.cra</code> → generated Swift API → stable native bridge → runtime → XCFramework</p><pre>{swiftCode}</pre><Link to="/docs/ios">iOS documentation <ArrowRight size={16} /></Link></div></Reveal></div></div></section>

    <section className="section section--raised"><div className="shell"><Reveal><SectionEyebrow>Retained V0 observations</SectionEyebrow><div className="section-heading"><h2>Evidence, not a benchmark claim.</h2><p>Release-artifact snapshots from the Android and iOS example apps. The explorer preserves their remote endpoint and emulator/simulator context.</p></div></Reveal><Reveal><BenchmarkExplorer /></Reveal><Link className="text-link benchmark-link" to="/docs/benchmarks">Read benchmark methodology <ArrowRight size={16} /></Link></div></section>

    <section className="section"><div className="shell workflow-grid"><Reveal><div><SectionEyebrow>CLI workflow</SectionEyebrow><h2>Verify, generate, integrate.</h2><p>The CLI’s explicit commands keep the path inspectable. Use <code>doctor</code> to inspect local prerequisites without modifying the machine.</p><Link className="button button--secondary" to="/docs/cli">CLI reference <Terminal size={16} /></Link></div></Reveal><Reveal><div className="terminal"><div className="terminal__bar"><span /><span /><span /><b>crossa</b></div><p><span>$</span> crossa doctor</p><p className="success">✓ Crossa installation</p><p className="success">✓ Android / iOS toolchain checks</p><p><span>$</span> crossa generate-build android ./project <i>--output ./build/android</i></p><p className="muted">Generated Android Gradle library project</p></div></Reveal></div></section>

    <section className="section docs-entry"><div className="shell"><Reveal><SectionEyebrow>Documentation map</SectionEyebrow><h2>Use the right starting point.</h2></Reveal><div className="entry-grid"><Link to="/docs/getting-started"><Download size={20} /><span><b>Getting started</b><small>Install, validate, write, generate.</small></span><ArrowRight size={17} /></Link><Link to="/docs/language"><Braces size={20} /><span><b>Language</b><small>Syntax and semantic foundations.</small></span><ArrowRight size={17} /></Link><Link to="/docs/runtime"><Cpu size={20} /><span><b>Runtime</b><small>Native execution and ownership.</small></span><ArrowRight size={17} /></Link><Link to="/docs/architecture"><BookOpen size={20} /><span><b>Architecture</b><small>Frontend, IR, ABI, artifacts.</small></span><ArrowRight size={17} /></Link></div></div></section>

    <section className="section final-cta"><div className="shell"><Reveal><div className="final-cta__inner"><div><SectionEyebrow>Crossa ecosystem</SectionEyebrow><h2>See the compiler, artifacts, and consumer examples together.</h2></div><div><Link className="button button--primary" to="/repositories">Explore repositories <ArrowRight size={17} /></Link><a className="text-link" href="https://github.com/crossa-script/Crossa" target="_blank" rel="noreferrer"><Github size={16} /> Open GitHub <ArrowUpRight size={15} /></a></div></div></Reveal></div></section>
  </>;
}
