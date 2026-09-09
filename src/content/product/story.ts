import sourceFiles from "./source-files.json";

export const verifiedRelease = "v0.0.13";
export const verifiedCommit = "38e31ae42426be76c34d14ca1ec229a323a979ad";
export const projectFiles = sourceFiles;
export const pipeline = [
  { title: ".cra source", detail: "A linked project of models, requests and configuration.", code: "import #postRequests.cra#\n\n@AsyncAfter\nfun getPosts(): List<Post> {\n    re fetchPosts()\n}" },
  { title: "Parse + validate", detail: "The C++ frontend resolves imports, checks types and validates execution policy before generating platform code.", code: "Project\n├─ Import → postRequests.cra\n└─ Function → getPosts\n   ├─ Annotation → AsyncAfter\n   └─ Return type → List<Post>" },
  { title: "Typed IR", detail: "Crossa understands the request before it generates platform code. This is a simplified view of the compiled semantics.", code: "getPosts()\n├─ Policy: AsyncAfter\n├─ Result: List<Post>\n└─ NativeRequest\n   ├─ GET\n   └─ /posts" },
  { title: "Native runtime", detail: "Compiled operations execute through one C++ implementation of scheduling, transport, decoding and result ownership.", code: "Schedule → Encode → HTTP\n                       ↓\nNative models ← Typed decode\n                       ↓\nSuccess · Failed · Cancelled" },
  { title: "Platform APIs", detail: "Platform generators package thin Kotlin and Swift surfaces over shared native execution. Your application UI stays platform-owned.", code: "Android AAR\n  Kotlin → JNI → C++\n\niOS XCFramework\n  Swift → stable C ABI → C++" }
] as const;
export const runtimeParts = ["Scheduler", "Request encoding", "Networking", "Response buffer", "Typed decode", "Native models", "Errors", "Lifecycle + cancellation"] as const;
export const kotlinUsage = `val operation = PostsRepository().getPosts { state ->
    when (state) {
        is CrossaState.Success -> state.data.use { posts ->
            println(posts.size)
        }
        is CrossaState.Failed -> println(state.error)
        CrossaState.Cancelled -> Unit
    }
}`;
export const swiftUsage = `let runtime = CrossaRuntime()
let posts = try await
    CrossaFunctions.fetchPosts(runtime: runtime)

for post in posts {
    print(post.title)
}`;
export const repositories = [
  { id: "crossa", name: "Crossa Core", role: "Compiler + native runtime", description: "The C++ frontend, typed IR, native engine, bindings and CLI define the shared execution contract.", folders: [ ["src/compiler", "Source loading, parsing, semantic checks, IR and generators."], ["src/runtime", "Operation execution, scheduler, native models and lifecycle."], ["src/network", "Request encoding, libcurl transport and schema-aware response decoding."], ["src/bindings", "Android JNI, iOS and the shared stable ABI."], ["src/packaging", "Android Gradle and iOS framework project generation."], ["src/cli", "Validation, generation, doctor and interactive entry points."] ] },
  { id: "android-example", name: "Android Example", role: "AAR → Gradle → Kotlin → JNI → C++", description: "A Jetpack Compose benchmark app consumes the Release AAR and compares Crossa with Retrofit + OkHttp and Ktor.", folders: [["crossa/", "The four-file model, request, repository and configuration project."], ["app/libs/", "Release AAR and its artifact manifest."], ["app/src/main/java/com/crossa/androiddemo/", "Compose UI, platform clients and benchmark harness."], ["benchmark-results/", "Retained warm and cold Release measurements."], ["scripts/", "Generation and build integration."]] },
  { id: "ios-example", name: "iOS Example", role: "XCFramework → SwiftPM → Swift → C ABI → C++", description: "A SwiftUI consumer uses a local binary package and compares the Release XCFramework with Alamofire.", folders: [["crossa/", "Shared Post model and request definitions."], ["CrossaPackage/", "Local SwiftPM binary integration."], ["CrossaBinary/", "Installed artifact and manifest."], ["CrossaIOSExample/", "SwiftUI presentation, clients and benchmark harness."], ["benchmark-results/", "Retained warm and cold Release observations."]] }
] as const;
