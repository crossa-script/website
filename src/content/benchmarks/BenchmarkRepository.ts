import androidCold from "./android-cold-benchmark-result.json";
import androidWarm from "./android-warm-benchmark-result.json";
import iosCold from "./ios-cold-benchmark-result.json";
import iosWarm from "./ios-warm-benchmark-result.json";

export type BenchmarkPlatform = "android" | "ios";
export type BenchmarkMode = "warm" | "cold";
export type BenchmarkMetric = "p50" | "p95" | "mean";
export interface BenchmarkSample { readonly iteration: number; readonly nanos: number; readonly success: boolean; }
export interface BenchmarkResult { readonly implementation: string; readonly p50Nanos: number; readonly p95Nanos: number; readonly meanNanos: number; readonly sampleCount: number; readonly failureCount: number; readonly samples: readonly BenchmarkSample[]; }
export interface BenchmarkRun { readonly platform: BenchmarkPlatform; readonly mode: BenchmarkMode; readonly buildConfiguration: string; readonly artifactCommit: string; readonly artifactHash: string; readonly environment: string; readonly architecture: string; readonly endpoint: string; readonly warmups: number; readonly measured: number; readonly results: readonly BenchmarkResult[]; }

function quantile(values: readonly number[], ratio: number): number {
  return values[Math.floor((values.length - 1) * ratio)] ?? 0;
}
function summarize(samples: readonly { implementation: string; iteration: number; nanos: number; success: boolean }[]): readonly BenchmarkResult[] {
  return [...new Set(samples.map((sample) => sample.implementation))].map((implementation) => {
    const series = samples.filter((sample) => sample.implementation === implementation);
    const values = series.filter((sample) => sample.success).map((sample) => sample.nanos).sort((a, b) => a - b);
    return { implementation, samples: series, sampleCount: values.length, failureCount: series.length - values.length, p50Nanos: quantile(values, 0.5), p95Nanos: quantile(values, 0.95), meanNanos: values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0 };
  });
}
function readAndroid(raw: typeof androidWarm): BenchmarkRun {
  const metadata = raw.metadata;
  return { platform: "android", mode: metadata.mode.toLowerCase() === "warm" ? "warm" : "cold", buildConfiguration: metadata.buildType, artifactCommit: metadata.crossaSourceCommit, artifactHash: metadata.crossaArtifactSha256, environment: `${metadata.deviceModel} · Android ${metadata.androidVersion} · emulator`, architecture: metadata.abi, endpoint: metadata.endpoint, warmups: metadata.warmupIterations, measured: metadata.measuredIterations, results: summarize(raw.samples.map((sample) => ({ ...sample, nanos: sample.durationNanos }))) };
}
function readIos(raw: typeof iosWarm): BenchmarkRun {
  const metadata = raw.metadata;
  return { platform: "ios", mode: metadata.mode === "warm" ? "warm" : "cold", buildConfiguration: metadata.buildConfiguration, artifactCommit: metadata.crossaSourceCommit, artifactHash: metadata.crossaArtifactChecksum, environment: `${metadata.deviceModel} · ${metadata.systemVersion} · simulator`, architecture: metadata.architecture, endpoint: metadata.endpoint, warmups: metadata.warmupIterations, measured: metadata.measuredIterations, results: summarize(raw.samples.map((sample) => ({ ...sample, implementation: sample.implementation === "crossa" ? "Crossa" : sample.implementation === "alamofire" ? "Alamofire" : sample.implementation, nanos: sample.durationNanoseconds }))) };
}
export const benchmarkRuns: readonly BenchmarkRun[] = [readAndroid(androidWarm), readAndroid(androidCold), readIos(iosWarm), readIos(iosCold)];
export function metricValue(result: BenchmarkResult, metric: BenchmarkMetric): number { return metric === "p50" ? result.p50Nanos : metric === "p95" ? result.p95Nanos : result.meanNanos; }
export function formatMilliseconds(nanos: number): string { return `${(nanos / 1_000_000).toFixed(2)} ms`; }
