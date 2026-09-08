import { lazy, Suspense, useEffect, useRef, useState } from "react";
const BenchmarkExplorer = lazy(() => import("../benchmarks/BenchmarkExplorer").then((module) => ({ default: module.BenchmarkExplorer })));

export function DeferredEvidence(): React.JSX.Element {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) { setVisible(true); observer.disconnect(); } }, { rootMargin: "300px" }); if (root.current) observer.observe(root.current); return () => observer.disconnect(); }, []);
  return <div className="deferred-evidence" ref={root}>{visible ? <Suspense fallback={<p>Loading retained benchmark observations…</p>}><BenchmarkExplorer /></Suspense> : <p>Retained Android and iOS Release observations.</p>}</div>;
}
