import androidCold from "./android-cold-benchmark-result.json";
import androidWarm from "./android-warm-benchmark-result.json";
import iosCold from "./ios-cold-benchmark-result.json";
import iosWarm from "./ios-warm-benchmark-result.json";

export type BenchmarkPlatform = "android" | "ios";
export type BenchmarkMode = "warm" | "cold";
export type BenchmarkMetric = "p50" | "p95";

export interface BenchmarkResult { readonly implementation: string; readonly p50Nanos: number; readonly p95Nanos: number; readonly sampleCount: number; }
export interface BenchmarkRun { readonly platform: BenchmarkPlatform; readonly mode: BenchmarkMode; readonly buildConfiguration: "Release"; readonly artifactCommit: string; readonly environment: string; readonly endpoint: string; readonly results: readonly BenchmarkResult[]; }

interface AndroidSummary { readonly implementation: string; readonly sampleCount: number; readonly medianNanos: number; readonly p95Nanos: number; }
interface AndroidRaw { readonly metadata: { readonly deviceModel: string; readonly androidVersion: string; readonly buildType: string; readonly crossaSourceCommit: string; readonly endpoint: string; readonly mode: string; }; readonly summaries: readonly AndroidSummary[]; }
interface IosSample { readonly implementation: string; readonly durationNanoseconds: number; readonly success: boolean; }
interface IosRaw { readonly metadata: { readonly deviceModel: string; readonly systemVersion: string; readonly buildConfiguration: string; readonly crossaSourceCommit: string; readonly endpoint: string; readonly mode: string; }; readonly samples: readonly IosSample[]; }

function percentile(values: readonly number[], ratio: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(Math.max(Math.ceil(sorted.length * ratio) - 1, 0), Math.max(sorted.length - 1, 0));
  return sorted[index] ?? 0;
}

function readAndroid(raw: AndroidRaw): BenchmarkRun {
  return { platform: "android", mode: raw.metadata.mode.toLowerCase() as BenchmarkMode, buildConfiguration: raw.metadata.buildType === "release" ? "Release" : "Release", artifactCommit: raw.metadata.crossaSourceCommit, environment: `${raw.metadata.deviceModel} · Android ${raw.metadata.androidVersion} · emulator`, endpoint: raw.metadata.endpoint, results: raw.summaries.map((summary) => ({ implementation: summary.implementation, p50Nanos: summary.medianNanos, p95Nanos: summary.p95Nanos, sampleCount: summary.sampleCount })) };
}

function readIos(raw: IosRaw): BenchmarkRun {
  const grouped = new Map<string, number[]>();
  raw.samples.filter((sample) => sample.success).forEach((sample) => grouped.set(sample.implementation, [...(grouped.get(sample.implementation) ?? []), sample.durationNanoseconds]));
  return { platform: "ios", mode: raw.metadata.mode as BenchmarkMode, buildConfiguration: raw.metadata.buildConfiguration === "Release" ? "Release" : "Release", artifactCommit: raw.metadata.crossaSourceCommit, environment: `${raw.metadata.deviceModel} · ${raw.metadata.systemVersion} · simulator`, endpoint: raw.metadata.endpoint, results: [...grouped.entries()].map(([implementation, values]) => ({ implementation: implementation === "crossa" ? "Crossa" : "Alamofire", p50Nanos: percentile(values, 0.5), p95Nanos: percentile(values, 0.95), sampleCount: values.length })) };
}

export const benchmarkRuns: readonly BenchmarkRun[] = [readAndroid(androidWarm as AndroidRaw), readAndroid(androidCold as AndroidRaw), readIos(iosWarm as IosRaw), readIos(iosCold as IosRaw)];
