import { Link } from "react-router";
import { CodeBlock } from "../../components/ui/CodeBlock";
import { kotlinUsage, swiftUsage } from "../../content/product/story";
import { Visual } from "./Visual";

export function PlatformOutputs({ platform }: { readonly platform?: "android" | "ios" }): React.JSX.Element {
  return <div className={`platform-outputs ${platform ? "platform-outputs--single" : ""}`}>{(["android", "ios"] as const).filter((entry) => !platform || entry === platform).map((entry) => <article key={entry}><Visual name={entry} /><h3>{entry === "android" ? "Kotlin calls. C++ executes." : "Swift calls. C++ executes."}</h3><CodeBlock language={entry === "android" ? "kotlin" : "swift"}>{entry === "android" ? kotlinUsage : swiftUsage}</CodeBlock><p>{entry === "android" ? "Generated callbacks deliver Success, Failed or Cancelled. Release native result views after use; retain the operation to cancel work." : "The generated async API bridges native completion. Model and list values retain their native result owner."} Dispatch UI changes on your platform’s main thread.</p><Link className="product-link" to={`/docs/${entry}`}>Read {entry === "android" ? "Android" : "iOS"} integration ↗</Link></article>)}</div>;
}
