import { Link } from "react-router";
import androidImage from "../../assets/visuals/android-benchmark-results.png";
import iosImage from "../../assets/visuals/ios-benchmark-scores.svg";

export function RealApps({ platform }: { readonly platform?: "android" | "ios" }): React.JSX.Element {
  return <div className={`real-apps ${platform ? "real-apps--single" : ""}`}>{(["android", "ios"] as const).filter((item) => !platform || item === platform).map((item) => <figure key={item}><div className="device-frame"><img src={item === "android" ? androidImage : iosImage} width="430" height={item === "android" ? 905 : 932} loading="lazy" decoding="async" alt={`${item === "android" ? "Android Jetpack Compose" : "iOS SwiftUI"} benchmark score screen comparing native client libraries.`} /></div><figcaption><strong>{item === "android" ? "Android / Jetpack Compose" : "iOS / SwiftUI"}</strong><p>Latest score screenshot from the Android emulator; iOS score-only preview.</p><Link className="product-link" to={`/repositories/${item}-example`}>Inspect the example ↗</Link></figcaption></figure>)}</div>;
}
