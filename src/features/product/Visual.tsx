import pipelineMobile from "../../assets/visuals/pipeline-mobile.svg";
import runtimeMobile from "../../assets/visuals/runtime-mobile.svg";
import ecosystemMobile from "../../assets/visuals/ecosystem-mobile.svg";
import duplicationMobile from "../../assets/visuals/duplication-mobile.svg";
import pipelineAsset from "../../assets/visuals/pipeline.svg";
import duplicationAsset from "../../assets/visuals/duplication.svg";
import runtimeAsset from "../../assets/visuals/runtime.svg";
import androidAsset from "../../assets/visuals/android-artifact.svg";
import iosAsset from "../../assets/visuals/ios-artifact.svg";
import ecosystemAsset from "../../assets/visuals/ecosystem.svg";
import brokenAsset from "../../assets/visuals/broken-pipeline.svg";

const visuals = {
  pipeline: { src: pipelineAsset, width: 640, height: 630, alt: ".cra source is parsed and validated into typed IR. Generated Android AAR and iOS XCFramework APIs call the shared C++ runtime." },
  duplication: { src: duplicationAsset, width: 800, height: 360, alt: "Separate Android and iOS transport, serialization, models and error mapping become one Crossa definition and native execution path." },
  runtime: { src: runtimeAsset, width: 800, height: 450, alt: "One native runtime contains the scheduler, request encoder, network transport, response buffer, typed decoder, native models, errors and lifecycle." },
  android: { src: androidAsset, width: 540, height: 380, alt: "Android Release AAR contains generated Kotlin APIs, JNI and libcrossa_runtime.so for arm64-v8a." },
  ios: { src: iosAsset, width: 540, height: 380, alt: "Crossa.xcframework contains Swift APIs, the stable C ABI and C++ runtime in ARM64 device and simulator slices." },
  ecosystem: { src: ecosystemAsset, width: 800, height: 370, alt: "Crossa Core produces artifacts consumed by the Android and iOS example repositories, which retain integration and benchmark evidence." },
  broken: { src: brokenAsset, width: 600, height: 180, alt: "A broken connection between CRA source and a missing artifact." }
} as const;

export function Visual({ name, eager = false, className = "" }: { readonly name: keyof typeof visuals; readonly eager?: boolean; readonly className?: string }): React.JSX.Element {
  if (name === "pipeline" || name === "runtime" || name === "ecosystem") { const mobile = name === "pipeline" ? pipelineMobile : name === "runtime" ? runtimeMobile : ecosystemMobile; const height = name === "pipeline" ? 575 : name === "runtime" ? 550 : 420; return <picture className={`responsive-visual responsive-visual--${name}`}><source media="(max-width: 720px)" srcSet={mobile} width="360" height={height} /><img {...visuals[name]} className="product-visual" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" /></picture>; }
  if (name === "duplication") return <picture className="duplication-visual"><source media="(max-width: 720px)" srcSet={duplicationMobile} width="360" height="490" /><img {...visuals[name]} className="product-visual" loading="lazy" decoding="async" /></picture>;
  return <img {...visuals[name]} className={`product-visual ${className}`} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding="async" />;
}
