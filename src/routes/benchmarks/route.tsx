import { ArrowRight, Info } from "lucide-react";
import { Link } from "react-router";
import { PageTransition } from "../../components/ui/PageTransition";
import { BenchmarkExplorer } from "../../features/benchmarks/BenchmarkExplorer";

export function Component(): React.JSX.Element { return <PageTransition className="benchmark-page"><section className="shell page-intro"><p className="eyebrow">Release artifact snapshots</p><h1>Observed development runs, presented with their context.</h1><p>The Android and iOS examples record raw results against a remote JSONPlaceholder endpoint. These are emulator/simulator observations, not physical-device performance guarantees.</p></section><section className="shell"><BenchmarkExplorer /><div className="benchmark-note"><Info size={20} /><div><b>How to read this page</b><p>Warmups are excluded, measured rounds rotate implementation order, and remote network time is included. The retention goal is traceability, not a product speed claim.</p></div></div><Link className="text-link" to="/docs/benchmarks">Read the benchmark documentation <ArrowRight size={16} /></Link></section></PageTransition>; }
