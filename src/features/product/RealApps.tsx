import { Link } from "react-router";
import androidImage from "../../assets/visuals/android-example.svg";
import iosImage from "../../assets/visuals/ios-example-430.webp";
import iosLarge from "../../assets/visuals/ios-example-860.webp";
import iosAvif from "../../assets/visuals/ios-example-430.avif";
import iosAvifLarge from "../../assets/visuals/ios-example-860.avif";

export function RealApps({ platform }: { readonly platform?: "android" | "ios" }): React.JSX.Element {
  return <div className={`real-apps ${platform ? "real-apps--single" : ""}`}>{(["android", "ios"] as const).filter((item) => !platform || item === platform).map((item) => <figure key={item}><div className="device-frame">{item === "android" ? <img src={androidImage} width="430" height="932" loading="lazy" decoding="async" alt="Source-based illustration of the Android Compose benchmark screen, showing the current Run action, warmup and measured-round configuration." /> : <picture><source type="image/avif" srcSet={`${iosAvif} 430w, ${iosAvifLarge} 860w`} sizes="(max-width: 720px) 80vw, 340px" /><source type="image/webp" srcSet={`${iosImage} 430w, ${iosLarge} 860w`} sizes="(max-width: 720px) 80vw, 340px" /><img src={iosImage} width="1290" height="2796" loading="lazy" decoding="async" alt="Actual Crossa SwiftUI simulator capture showing the Release XCFramework cold run and eight measured rounds." /></picture>}</div><figcaption><strong>{item === "android" ? "Android / Jetpack Compose" : "iOS / SwiftUI"}</strong><p>{item === "android" ? "UI illustration from the current source. Crossa, Retrofit + OkHttp and Ktor consumers." : "Actual simulator capture, September 8, 2026. Crossa and Alamofire consumers."}</p><Link className="product-link" to={`/repositories/${item}-example`}>Inspect the example ↗</Link></figcaption></figure>)}</div>;
}
