import { useState } from "react";

export function CliWorkflow(): React.JSX.Element {
  const [platform, setPlatform] = useState<"android" | "ios">("android");
  const commands = [ ["Inspect the toolchain", "crossa doctor"], ["Validate the linked source", "crossa check ./crossa/postsRepository.cra"], [platform === "android" ? "Generate the Gradle library project" : "Generate and archive the framework", `crossa generate-build ${platform} ./crossa --output ./build/${platform}`], ...(platform === "android" ? [["Assemble the Release library", "cd ./build/android && ./gradlew :library:assembleRelease"]] : []), ["Integrate the artifact", platform === "android" ? "crossa-generated-release.aar" : "build/ios/release/Crossa.xcframework"] ];
  return <div className="cli-workflow"><div className="product-toggle" role="group" aria-label="CLI platform">{(["android", "ios"] as const).map((item) => <button type="button" key={item} aria-pressed={platform === item} onClick={() => setPlatform(item)}>{item === "android" ? "Android" : "iOS"}</button>)}</div><ol>{commands.map(([label, command]) => <li key={label}><span>{label}</span><pre>{command}</pre></li>)}</ol></div>;
}
