import { useState } from "react";
import { benchmarkRuns, type BenchmarkMetric, type BenchmarkMode, type BenchmarkPlatform } from "../../content/benchmarks/BenchmarkRepository";

function formatMilliseconds(nanos: number): string { return `${(nanos / 1_000_000).toFixed(2)} ms`; }

export function BenchmarkExplorer(): React.JSX.Element {
  const [platform, setPlatform] = useState<BenchmarkPlatform>("android");
  const [mode, setMode] = useState<BenchmarkMode>("warm");
  const [metric, setMetric] = useState<BenchmarkMetric>("p50");
  const run = benchmarkRuns.find((item) => item.platform === platform && item.mode === mode) ?? benchmarkRuns[0];
  if (!run) return <p>Benchmark snapshot unavailable.</p>;
  const max = Math.max(...run.results.map((result) => metric === "p50" ? result.p50Nanos : result.p95Nanos), 1);
  return <section className="benchmark-explorer" aria-label="Benchmark explorer"><div className="benchmark-controls"><fieldset><legend>Platform</legend>{(["android", "ios"] as const).map((item) => <button className={platform === item ? "is-active" : ""} key={item} type="button" onClick={() => setPlatform(item)}>{item}</button>)}</fieldset><fieldset><legend>Mode</legend>{(["warm", "cold"] as const).map((item) => <button className={mode === item ? "is-active" : ""} key={item} type="button" onClick={() => setMode(item)}>{item}</button>)}</fieldset><fieldset><legend>Metric</legend>{(["p50", "p95"] as const).map((item) => <button className={metric === item ? "is-active" : ""} key={item} type="button" onClick={() => setMetric(item)}>{item}</button>)}</fieldset></div><div className="benchmark-chart">{run.results.map((result) => { const value = metric === "p50" ? result.p50Nanos : result.p95Nanos; return <div className="benchmark-row" key={result.implementation}><div><strong>{result.implementation}</strong><span>{formatMilliseconds(value)}</span></div><div className="benchmark-track"><i style={{ width: `${Math.max((value / max) * 100, 4)}%` }} /></div><small>{result.sampleCount} successful samples</small></div>; })}</div><div className="benchmark-metadata"><span><b>Release</b> artifact</span><span>{run.environment}</span><span>{run.endpoint}</span><span>commit {run.artifactCommit.slice(0, 7)}</span></div><p className="benchmark-disclosure">Development validation result from an emulator/simulator and a remote network endpoint. It is not a physical-device performance guarantee.</p></section>;
}
