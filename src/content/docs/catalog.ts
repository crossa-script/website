export type DocumentationSection = "start" | "concepts" | "language" | "networking" | "android" | "ios" | "cli" | "architecture" | "reference" | "troubleshooting";

export interface DocumentationDefinition {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly section: DocumentationSection;
  readonly order: number;
  readonly sourceRepository: "crossa" | "android-example" | "ios-example";
  readonly sourcePaths: readonly string[];
  readonly verifiedCommit: string;
  readonly keywords: readonly string[];
  readonly related: readonly string[];
  readonly content: string;
}

const commit = "8c362e1";
const core = ["README.md", "ARCHITECTURE.md", "docs/language/language-foundation.md"] as const;
const network = ["docs/features/networking.md", "src/compiler/semantic/SemanticAnalyzer.cpp", "src/runtime/RuntimeConfiguration.cpp", "src/network/NetworkPolicy.cpp"] as const;
const post = "```cra\nmodel Post(\n    userId: Int,\n    id: Int,\n    title: String,\n    body: String\n)\n```";
const request = "```cra\n@AsyncAfter\nfun fetchPosts(): List<Post> {\n    re CrossaRequest {\n        url: \"/posts\",\n        method: GET\n    }\n}\n```";

function doc(
  slug: string, title: string, description: string, section: DocumentationSection, order: number,
  sourcePaths: readonly string[], content: string, keywords: readonly string[] = [], related: readonly string[] = [],
  sourceRepository: DocumentationDefinition["sourceRepository"] = "crossa",
): DocumentationDefinition {
  return { slug, title, description, section, order, sourceRepository, sourcePaths, verifiedCommit: commit, content, keywords, related };
}

export const documentationCatalog = [
  doc("/docs", "Documentation", "Verified Crossa V0 language, runtime, networking, artifact, and CLI documentation.", "start", 0, core, `# Crossa documentation
Crossa is a C++20 compiler and native runtime for typed \`.cra\` projects. It validates source once, creates typed intermediate representation (IR), then executes native work or produces platform artifacts. This site is curated against Crossa commit \`${commit}\`; the core repository remains the authority.

## Start here

| Goal | Documentation |
| --- | --- |
| Understand the product and compiler | [Introduction](/docs/getting-started/introduction) |
| Build a project end-to-end | [Your first project](/docs/getting-started/first-project) |
| Learn the .cra language | [Language](/docs/language/overview) |
| Make an HTTP request | [CrossaRequest](/docs/networking/crossa-request) |
| Configure retries, TLS, auth | [config.cra](/docs/networking/configuration) |
| Generate an Android AAR | [Android](/docs/android/integration) |
| Generate an iOS XCFramework | [iOS](/docs/ios/integration) |

## Current V0 scope

Crossa supports typed functions, models, lists, JSON, conditionals, native requests, a bounded scheduler, Android AAR generation, and iOS XCFramework generation. It is not a general-purpose language, a platform networking wrapper, or a server framework. Incremental delivery to Android/iOS is not a stable stream ABI yet: \`downloadStreaming\` records transfer metrics while the current decoder retains a bounded response buffer.`, ["quick start", "CrossaRequest", "AAR", "XCFramework"], ["/docs/getting-started/introduction", "/docs/getting-started/first-project", "/docs/reference/glossary"]),
  doc("/docs/getting-started/introduction", "Introduction", "How .cra source becomes a native operation and Kotlin or Swift API.", "start", 10, core, `# Introduction
Crossa lets mobile teams describe shared typed behavior in \`.cra\` files while C++ owns the hot path: request construction, transport, retries, buffering, JSON decoding, scheduling, cancellation, errors, and native model/list storage. Kotlin and Swift expose generated wrappers over that single implementation.

## Why Crossa uses a compiler

Sharing endpoint strings alone does not share type validation, retry rules, error behavior, or response decoding. Crossa compiles source once and keeps the language frontend platform-neutral. Android and iOS do not implement their own parser or semantic rules, so an imported model, request field, or annotation has one meaning.

## End-to-end flow

\`\`\`text
.cra → Source Loader → Lexer → Parser / AST → Project Linker
     → Semantic Analysis → Typed IR → Native Generation → C++ Runtime
     → Stable ABI → Kotlin / Swift
\`\`\`

The loader finds source units; lexer/parser construct syntax; linker resolves the project import graph; semantic analysis resolves symbols/types and rejects invalid requests/configuration; IR is the typed platform-neutral representation; native generation embeds operations. The runtime then owns execution. The ABI exposes opaque handles, not C++ classes, to generated Kotlin/JNI and Swift wrappers.

## What Crossa is not

It does not replace app architecture, UI, lifecycle policy, dependency injection, secure credential storage, or platform-thread decisions. An artifact is project-specific—not a universal Crossa SDK. A platform callback does not re-execute the \`.cra\` body; it receives a terminal result already produced by the native runtime.`, ["compiler", "IR", "native runtime", "ABI"], ["/docs/concepts/compiler-pipeline", "/docs/concepts/generated-apis", "/docs/architecture/stable-abi"]),
  doc("/docs/getting-started/first-project", "Your first Crossa project", "From config.cra and models to Android/iOS generated artifacts.", "start", 20, ["docs/language/language-foundation.md", "docs/platform/android.md", "docs/platform/ios.md"], `# Your first Crossa project
This cohesive project uses configuration, a model, an import, and one asynchronous native request.

## 1. Create the project

\`\`\`text
posts/
├── config.cra
├── Post.cra
└── PostsApi.cra
\`\`\`

### config.cra

\`\`\`cra
config {
    baseUrl: "https://jsonplaceholder.typicode.com",
    timeoutRequest: 15000,
    commonHeaders: { Accept: "application/json" }
}
\`\`\`

\`config.cra\` is reserved: it contains one \`config\` declaration, is compiled into native runtime defaults, and never generates a Kotlin/Swift class. \`baseUrl\` only applies to relative paths. \`timeoutRequest\` is an \`Int\` in milliseconds.

### Post.cra

${post}

\`model\` creates semantic type \`Post\`. Field order is deterministic schema order and is used for native-backed field access. A standalone one-model file must use matching identity: \`Post.cra → Post\`.

### PostsApi.cra

\`\`\`cra
import #Post.cra#

@AsyncAfter
fun fetchPosts(): List<Post> {
    re CrossaRequest {
        url: "/posts",
        method: GET
    }
}
\`\`\`

Imports are top-of-file filename references. \`List<Post>\` is the eventual logical success type, not an immediate Kotlin/Swift return. \`@AsyncAfter\` schedules native work and produces exactly one terminal success, failure, or cancellation state.

## 2. Validate and generate

\`\`\`bash
crossa check ./posts/PostsApi.cra
crossa generate-build android ./posts --output ./build/crossa-android
crossa generate-build ios ./posts --output ./build/crossa-ios
\`\`\`

\`check\` validates source loading, imports, syntax, semantics, and typed IR without execution. Android generation writes a Gradle library project. iOS generation writes an Xcode framework project plus Debug/Release XCFrameworks when the Apple toolchain is available.`, ["tutorial", "config.cra", "Post.cra", "generate-build"], ["/docs/language/imports-and-source-files", "/docs/networking/crossa-request", "/docs/android/integration", "/docs/ios/integration"]),
  doc("/docs/getting-started/installation", "Installation and doctor", "Verify the CLI and Android/iOS prerequisites without modifying the machine.", "start", 30, ["README.md", "docs/development/cli.md", "src/cli/doctor/DoctorRunner.cpp"], `# Installation and doctor
Install a released Crossa CLI with the command documented in the core README, then verify it before generating artifacts.

\`\`\`bash
crossa --version
crossa doctor
\`\`\`

## What doctor does

\`doctor\` is read-only: it does not install dependencies, change PATH, download files, or edit shell configuration. It reports Crossa, host, Android, iOS, and storage checks as \`✓ Passed\`, \`! Warning\`, or \`✗ Failed\`. Required failures return non-zero and include a \`Fix:\` section.

Android checks include \`ANDROID_HOME\`, required SDK platform/build tools, side-by-side NDK, CMake, Ninja, Java, cache writability, and temporary storage. iOS checks validate relevant Apple prerequisites. A warning is advisory; a failure blocks that generation path.

> Android generation version flags affect only the generated Gradle project. Crossa validates version syntax, but compatibility among selected Gradle, AGP, Kotlin, and NDK versions remains the caller's responsibility.`, ["doctor", "NDK", "Xcode", "installation"], ["/docs/cli/commands", "/docs/troubleshooting"]),
  doc("/docs/concepts/compiler-pipeline", "Compiler pipeline", "Source loading, linking, semantic analysis, typed IR, and generation boundaries.", "concepts", 10, ["ARCHITECTURE.md", "src/compiler/source/SourceLoader.cpp", "src/compiler/parser/Parser.cpp", "src/compiler/semantic/SemanticAnalyzer.cpp", "src/compiler/ir/IrLowerer.cpp"], `# Compiler pipeline
| Stage | Input → output | Responsibility |
| --- | --- | --- |
| Source loader | Entry/project → source units | Finds .cra files; does not type-check |
| Lexer | text → tokens | Recognizes syntax; does not resolve names |
| Parser | tokens → AST | Creates source structure; does not generate code |
| Project linker | ASTs → linked AST | Resolves imports, duplicates, cycles, dependency order |
| Semantic analysis | linked AST → typed model | Registers symbols, resolves types/models, validates contracts |
| IR lowerer | typed model → typed IR | Removes syntax-only detail into platform-neutral operations |
| Generators | typed IR → output | Deterministic native/platform output; does not reinterpret source |

## Semantic analysis is the contract gate

It checks top-level and parameter/model-field duplicates, explicit variable and return types, function calls, execution annotations, interpolation symbols, \`config.cra\`, and every \`CrossaRequest\` field. Generators consume validated IR rather than creating a second interpretation of source. Diagnostics are source-aware; for example \`CRA7002\` means unknown request field and \`CRA7003\` means duplicate request field.

## IR

IR means Intermediate Representation: the typed, platform-neutral representation after validation. It allows native runtime execution, Kotlin generation, and Swift generation to agree on the same semantic outcome. This is why platform code never scans source strings to infer an endpoint, model, or parameter.`, ["lexer", "parser", "AST", "semantic analysis", "IR"], ["/docs/language/imports-and-source-files", "/docs/architecture/system-overview", "/docs/reference/glossary"]),
  doc("/docs/concepts/generated-apis", "Generated APIs and logical results", "How source return types map to terminal platform states and native-backed values.", "concepts", 20, ["docs/language/language-foundation.md", "docs/platform/android.md", "docs/platform/ios.md"], `# Generated APIs and logical results
${request}

The declared \`List<Post>\` is the language-level **logical success type**. For \`@AsyncAfter\`, it tells native response decoding what success shape to build; it does not mean Kotlin or Swift synchronously returns a list. Generated APIs expose one conceptual \`CrossaState<List<Post>>\`: \`Success(data)\`, \`Failed(error)\`, or \`Cancelled\`.

## Terminal behavior

The shared native scheduler runs the operation exactly once. Completion is exactly once. Cancellation is race-safe and idempotent: cancelling before execution skips the task; during execution reaches transport/decoder; after terminal publication cannot rewrite its state. Platform callback/coroutine bridges receive the final state and never run the .cra body.

## Values and ownership

Scalars can be copied then release their native result. Models, lists, and explicit JSON can be native-backed views with an owning result. Field/list reads cross a controlled ABI path. A view is invalid after its result owner or runtime is released.`, ["CrossaState", "logical success type", "native-backed", "@AsyncAfter"], ["/docs/language/execution-policies", "/docs/android/generated-api", "/docs/ios/generated-api"]),
  doc("/docs/language/overview", "Language overview", "The small typed .cra language, source identity, imports, and V0 limits.", "language", 10, ["docs/language/language-foundation.md", "src/compiler/project/ProjectLinker.cpp", "src/compiler/semantic/SemanticAnalyzer.cpp"], `# Crossa language overview
\`.cra\` is intentionally small. Its current public forms are \`fun\`, \`re\`, \`var\`, \`model\`, \`config\`, \`import\`, \`if\`, \`else\`, \`print\`, \`assert\`, \`CrossaRequest\`, and annotations \`@Sync\`, \`@Async\`, \`@AsyncAfter\`. Built-in types are \`Int\`, \`Long\`, \`Double\`, \`String\`, \`Bool\`, \`Json\`, and \`List<T>\`.

Identifiers are case-sensitive and match \`[A-Za-z_][A-Za-z0-9_]*\`. Sources are UTF-8, strings use double quotes, integers are base-10, and line comments use \`//\`. Block comments are not foundational syntax.

## Source identity and imports

An ordinary source unit maps its filename stem to its generated container identity: \`UsersController.cra\` owns \`UsersController\` generated operations. Renaming it can be a platform API breaking change. \`config.cra\` is reserved and never becomes a normal class.

\`\`\`cra
import #models.cra#
\`\`\`

Imports must be first, are filename-only/case-sensitive, require \`.cra\`, and may not contain paths. The project linker discovers targets recursively from the project root, rejects missing/ambiguous imports and cycles, prevents duplicate loading in a diamond graph, and creates deterministic order. Imported top-level executable expressions are rejected; direct execution belongs to the entry source.

## Not in V0

No variable type inference, nullable syntax, general maps, user-defined generics, overloads, reflection decoding, arbitrary interpolation expressions, or dynamic language object model.`, ["source files", "imports", "V0", "syntax"], ["/docs/language/types-and-expressions", "/docs/language/functions-models", "/docs/reference/language-reference"]),
  doc("/docs/language/types-and-expressions", "Types, expressions, and interpolation", "Built-in types, operators, scope, string interpolation, and JSON boundary.", "language", 20, ["docs/language/language-foundation.md", "src/compiler/types/SemanticType.cpp", "src/compiler/semantic/SemanticAnalyzer.cpp"], `# Types, expressions, and interpolation
## Type reference

| Type | Purpose | Important contract |
| --- | --- | --- |
| \`Int\`, \`Long\`, \`Double\` | Numeric scalars | Source is platform-neutral; do not infer storage width from Kotlin/Swift |
| \`String\` | UTF-8 text | Escapes include \`\\n\`, \`\\t\`, \`\\uXXXX\`, \`\\#\` |
| \`Bool\` | \`true\` / \`false\` | Required for conditional expressions |
| \`Json\` | Explicit generic JSON boundary | Objects, arrays, strings, numbers, booleans, null—not general maps |
| Model | Named schema type | Deterministic field order |
| \`List<T>\` | One resolved Crossa element type | Built-in typed collection, not general generics |

## Operators and evaluation

| Operators | Category | Result |
| --- | --- | --- |
| unary \`-\`, \`* /\`, \`+ -\` | Numeric | Numeric |
| \`< <= > >=\`, \`== !=\` | Comparison/equality | Bool |
| \`!\`, \`&&\`, \`||\` | Boolean | Bool |

Parentheses group explicitly. \`&&\` evaluates its right expression only if the left is true; \`||\` evaluates its right expression only if the left is false. Conditions require \`Bool\`.

## Variables and interpolation

\`\`\`cra
var name: String = "Crossa"
print("Hello #name")
\`\`\`

Variables require \`var name: Type = expression\`; V0 rejects \`var name = "Crossa"\`. The initializer must match the explicit type. Parameters, source variables, locals, and branch locals follow lexical scope.

\`#identifier\` must resolve in the current semantic scope. Conceptually the compiler stores static and symbol segments, so runtime does not rescan source text. \`#{name}\`, \`#user.name\`, \`#items[0]\`, and \`#function()\` are unsupported. Unknown identifiers are compile errors; \`\\#\` writes a literal hash.`, ["Int", "Json", "operators", "interpolation", "var"], ["/docs/language/functions-models", "/docs/networking/urls-and-parameters", "/docs/reference/language-reference"]),
  doc("/docs/language/functions-models", "Functions, models, lists, and execution", "Function and model contracts plus sync/async execution semantics.", "language", 30, ["docs/language/language-foundation.md", "docs/runtime/scheduling.md", "docs/runtime/memory-ownership.md"], `# Functions, models, lists, and execution
## Functions and conditionals

\`\`\`cra
fun add(a: Int, b: Int): Int {
    re a + b
}
\`\`\`

Parameters use \`name: Type\`. A value function declares a return type; a no-value function may omit it. \`re\` returns an expression. Semantic analysis rejects duplicate functions/parameters, incompatible arguments/returns, missing required returns, and value returns from no-value functions. V0 has no overloading.

\`\`\`cra
if (enabled && count > 0) {
    print("Ready")
} else {
    print("Not ready")
}
\`\`\`

At most one branch runs and each branch has its own lexical scope.

## Models and lists

${post}

A model field has \`name: Type\`. Duplicate fields are rejected and field order becomes native schema order. \`List<Int>\`, \`List<String>\`, and \`List<Post>\` are supported type forms; it takes exactly one valid element type. Typed response decoding parses scalars, models, and lists directly against the validated schema, skips unknown fields, and creates immutable \`NativeModel\`/ \`NativeList\` values. Explicit \`Json\` results use the generic JSON representation. Android/iOS can expose lazy native-backed views, so the result owner/runtime must remain alive.

## Execution policy

| Policy | Contract |
| --- | --- |
| default / \`@Sync\` | Executes inline and returns direct logical result |
| \`@Async\` | Fire-and-forget shared scheduler work; cannot declare a result type |
| \`@AsyncAfter\` | Shared scheduler; requires logical result type and publishes Success/Failed/Cancelled exactly once |

\`@Async\`/ \`@AsyncAfter\` use Crossa's bounded shared scheduler, never one thread per invocation. For \`@AsyncAfter\`, \`re\` describes the eventual logical success value.`, ["fun", "model", "List", "@AsyncAfter", "re"], ["/docs/concepts/generated-apis", "/docs/architecture/ownership-and-scheduler", "/docs/networking/response-decoding-errors"]),
  doc("/docs/networking/overview", "Networking overview", "Native HTTP planning, transport, bounded decoding, and policy inheritance.", "networking", 10, network, `# Networking overview
\`CrossaRequest\` is a language builtin, compiler semantic node, typed IR operation, and native runtime operation. It is not a user function, model, Retrofit/Ktor/Alamofire/URLSession client, or platform JSON parser.

Native code resolves URLs, percent-encodes query/path values, merges headers, serializes JSON bodies, applies policies, uses pooled reusable libcurl handles on the shared bounded scheduler, buffers responses, decodes to the enclosing function's logical return type, and owns errors/results. Kotlin and Swift do not duplicate this pipeline.

Defaults are 30,000 ms timeout, 8 MiB response limit, JSON depth 128, 1 MiB response headers, and 256 header count. Successful 2xx responses decode; non-2xx, timeout, connection/TLS, invalid JSON, type mismatch, cancellation, and internal runtime conditions become terminal failure/cancellation.`, ["networking", "libcurl", "HTTP"], ["/docs/networking/crossa-request", "/docs/networking/configuration", "/docs/networking/response-decoding-errors"]),
  doc("/docs/networking/crossa-request", "CrossaRequest reference", "Every supported request field, validation rule, inheritance behavior, and example.", "networking", 20, network, `# CrossaRequest reference
${request}

The expression is a runtime-backed operation inside a compatible function. The compiler rejects unknown fields (\`CRA7002\`) and duplicates (\`CRA7003\`) before artifact generation.

## Field reference

| Field | Type | Required | Default / inheritance | Behavior |
| --- | --- | --- | --- | --- |
| \`url\` | String literal | Yes unless \`path\` | none | Absolute HTTP(S) or base-relative URL |
| \`path\` | String literal | Alias | url behavior | Cannot appear with url |
| \`method\` | HTTP literal | Yes | none | GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, TRACE, CONNECT |
| \`headers\` | scalar JSON object | no | empty | After common headers |
| \`customHeaders\` | scalar JSON object | no | empty | Final overriding header layer |
| \`queryParams\` | scalar JSON object | no | empty | Percent-encoded query pairs |
| \`pathVariables\` | identifier alias object | no | none | Aliases used by \`#name\` segments |
| \`body\` | JSON-compatible value | no | no body | Native JSON serialization |
| \`timeout\` | Int | no | \`timeoutRequest\` | milliseconds |
| \`retryPolicy\` | JSON object | no | global policy | per-request override |
| \`auth\` | String or JSON object | no | default provider | named provider |
| \`multipart\` | JSON object | no | none | native MIME parts |
| \`uploadProgress\`, \`downloadStreaming\`, \`coalesce\` | Bool | no | global defaults | policy override |
| \`proxy\`, \`certificatePolicy\`, \`telemetry\` | JSON object | no | global policy | policy override |

## Full request example

\`\`\`cra
@AsyncAfter
fun createPost(title: String, userId: Int): Post {
    re CrossaRequest {
        url: "/users/#userId/posts",
        method: POST,
        headers: { Accept: "application/json" },
        customHeaders: { "X-Request-Id": "create-post" },
        queryParams: { include: "author" },
        body: { title: title, active: true },
        timeout: 5000
    }
}
\`\`\`

\`url\` and \`path\` are mutually exclusive. Header names/values reject CR/LF injection; names also reject empty text and \`:\`. For details of encoding, map restrictions, and header precedence, read [URLs, paths, headers, and bodies](/docs/networking/urls-and-parameters).`, ["CrossaRequest", "headers", "retryPolicy", "queryParams", "coalesce"], ["/docs/networking/urls-and-parameters", "/docs/networking/configuration", "/docs/networking/response-decoding-errors", "/docs/reference/request-and-config-reference"]),
  doc("/docs/networking/urls-and-parameters", "URLs, paths, headers, and bodies", "Native URL construction, interpolation, query encoding, header precedence, and JSON bodies.", "networking", 30, ["docs/features/networking.md", "src/compiler/semantic/SemanticAnalyzer.cpp", "src/network/request/RequestBuilder.cpp", "src/network/utils/UrlUtils.cpp"], `# URLs, paths, headers, and bodies
## URL and path variables

Absolute \`http://\` and \`https://\` URLs bypass \`baseUrl\`. Any other URL requires \`baseUrl\`; Crossa joins them with one slash boundary. \`path\` is a compatibility alias for \`url\`.

\`\`\`cra
path: "/users/#id",
pathVariables: { id: userId }
\`\`\`

The compiler resolves interpolation into a static/symbol plan. A path variable must be \`Int\`, \`Long\`, \`Double\`, \`String\`, or \`Bool\`; unknown variables are \`CRA2006\`; invalid aliases/types are \`CRA7009\`. Values are percent-encoded during native request preparation, not by a platform bridge.

## Query and headers

\`queryParams: { page: page, include: "profile" }\` accepts scalar map entries. Keys/values are encoded, existing query text is retained, and a URL fragment is restored after new query text. Object/array/null/model/list/unit entries are rejected.

Header precedence is \`commonHeaders\` → request \`headers\` → \`customHeaders\`; later layers replace prior names. Names/values are checked to prevent header injection.

## Body

\`\`\`cra
body: { name: name, active: true, tags: ["native", "mobile"], optional: null }
\`\`\`

Crossa serializes JSON natively. Scalars, arrays, objects, null, and scalar expressions are valid; models, lists, and no-value expressions are rejected. Kotlin/Swift never encode the body.`, ["pathVariables", "queryParams", "headers", "body", "URL"], ["/docs/networking/crossa-request", "/docs/networking/configuration"]),
  doc("/docs/networking/configuration", "config.cra and network policies", "Every current configuration key, default, unit, nested policy field, and security constraint.", "networking", 40, network, `# config.cra and network policies
\`config.cra\` is reserved and contains exactly one \`config { … }\` declaration. Its values are compile-time literals/JSON constants; string interpolation is not allowed. Semantic analysis validates key types; native configuration validates ranges and nested schemas.

## Top-level reference

| Property | Type | Default | Unit / validation |
| --- | --- | --- | --- |
| \`packageName\` | String | unset | generator metadata input |
| \`baseUrl\` | String | empty | non-empty must be HTTP/HTTPS |
| \`timeoutRequest\` | Int | 30000 | ms, 1…600000 |
| \`commonHeaders\` | JSON object | empty | scalar valid headers |
| \`interceptor\` | Bool/object | enabled; request/response logs true | logging policy |
| \`workerThreads\`, \`maxQueuedTasks\` | Int | runtime selected | positive scheduler bounds |
| \`maxResponseBytes\` | Int | 8388608 | bytes, 1…268435456 |
| \`maxJsonDepth\` | Int | 128 | 1…1024 |
| \`maxResponseHeaderBytes\` | Int | 1048576 | bytes, 1…16777216 |
| \`maxResponseHeaderCount\` | Int | 256 | 1…4096 |
| \`followRedirects\` | Bool | true | native redirect policy |
| \`retryPolicy\`, \`authProviders\`, \`proxy\`, \`certificatePolicy\`, \`telemetry\` | JSON object | policy defaults | schemas below |
| \`defaultAuthProvider\` | String | empty | must name declared provider |
| \`uploadProgress\`, \`downloadStreaming\`, \`requestCoalescing\` | Bool | false | request defaults |

## retryPolicy

| Key | Type | Default | Constraint |
| --- | --- | --- | --- |
| \`maxAttempts\` | Int | 1 | 1…10 |
| \`initialDelay\` | Int | 100 | ms, ≥0 |
| \`maxDelay\` | Int | 5000 | ms, ≥ initialDelay |
| \`backoffMultiplier\` | Number | 2.0 | ≥1.0 |
| \`retryStatusCodes\` | Int array | 408, 425, 429, 500, 502, 503, 504 | each 100…599 |
| \`retryNonIdempotent\` | Bool | false | required for POST/PATCH retry |

Retries default to idempotent methods and transient statuses. A malformed policy is a native configuration/request error.

## Interceptor, auth, proxy, TLS, telemetry

\`interceptor\` is Bool or an object with \`enabled\`, \`logRequests\`, \`logResponses\`, \`logHeaders\`, \`logBody\`, \`excludedHeaders\` (case-insensitive string array). Headers/body are never logged unless their own flags are enabled. Lifecycle logs remove query strings; emitted curl replay keeps final URL but omits excluded values.

\`authProviders\` is keyed by name. Each provider accepts \`tokenUrl\`, \`accessToken\`, \`refreshToken\`, \`clientId\`, \`clientSecret\`, \`tokenField\` (default \`access_token\`), and \`expiresAt\` (ms, default 0). Refresh-token flow retries original request once after 401. Never put production secrets in \`config.cra\` or artifacts.

\`proxy\`: \`url\`, \`username\`, \`password\`. \`certificatePolicy\`: \`verifyPeer\`, \`verifyHost\`, \`caInfo\`, \`clientCertificate\`, \`clientKey\`, \`pinnedPublicKey\`. Both verification booleans default true and cannot be disabled. \`telemetry\`: \`enabled\` false, \`serviceName\` "crossa", \`includeHeaders\` false, \`includeBody\` false; proxy/auth secrets are excluded.

## Request-only policy overrides

The global values above establish defaults. A request may supply its own \`retryPolicy\`, \`proxy\`, \`certificatePolicy\`, or \`telemetry\` object; its own \`timeout\`, \`uploadProgress\`, \`downloadStreaming\`, or \`coalesce\` Bool; and \`auth\` as a provider name or \`{ provider: "name" }\`. Request policy overrides win over global policy for that operation. \`auth\` uses the configured default provider only when no request provider is selected.

## Multipart, progress, coalescing, and streaming limit

\`multipart\` is request-only and must be \`{ parts: [...] }\`. Each part requires \`name\` and exactly one of \`data\` or \`filePath\`; optional \`filename\` and \`contentType\` describe the MIME part. Native libcurl reads a file path, so treat paths as trusted application input. \`uploadProgress\` records native transfer counters. \`downloadStreaming\` records native chunk/progress counters but still buffers the response for the current decoder contract; it is not incremental Android/iOS delivery.

When \`requestCoalescing\` or request \`coalesce\` is enabled, equivalent requests may share native execution and terminal work is fanned out to their consumers. Cancellation remains per operation handle and must not release shared result ownership for another consumer.`, ["config.cra", "retryStatusCodes", "pinnedPublicKey", "authProviders", "telemetry", "multipart", "coalesce"], ["/docs/networking/crossa-request", "/docs/reference/request-and-config-reference", "/docs/networking/response-decoding-errors"]),
  doc("/docs/networking/response-decoding-errors", "Response decoding, errors, and cancellation", "Native typed decoding, CrossaError, distinct cancellation state, and operation lifecycle.", "networking", 50, ["docs/features/networking.md", "docs/runtime/memory-ownership.md", "docs/runtime/scheduling.md", "src/network/response/ResponseDecoder.cpp"], `# Response decoding, errors, and cancellation
\`\`\`text
typed response bytes → bounded native buffer → direct schema decoder → RuntimeValue / NativeModel / NativeList → platform view

explicit \`Json\` response bytes → bounded native buffer → generic JSON representation → platform value
\`\`\`

\`String\` receives bounded raw response text. \`Int\`, \`Long\`, \`Double\`, \`Bool\` require matching JSON scalars. \`Json\` accepts any JSON value. Models/lists decode recursively against validated IR schema into immutable native storage without a generic DOM. Unknown fields are skipped; malformed JSON, duplicate fields, and incompatible responses are errors, never partially valid models.

## Failed is not Cancelled

\`CrossaState.Failed(CrossaError)\` covers HTTP status, timeout, connection, TLS, invalid JSON, response type mismatch, and internal errors. \`Cancelled\` is a distinct terminal state. HTTP/transport metadata is retained with the structured native error; C++ exceptions do not cross the ABI.

## Cancellation lifecycle

Every operation has a race-safe idempotent \`RequestHandle\`. Before execution cancellation skips the body. During execution it reaches transport and decoder. After terminal state, it cannot alter published state. Runtime shutdown rejects new operations, cancels accepted work, drains the cancelled queue, joins workers, then destroys result/error storage. Releasing an opaque platform operation ID drops cancellation bookkeeping only; it does not release a retained result.`, ["CrossaError", "Cancelled", "response decoding", "RequestHandle"], ["/docs/language/functions-models", "/docs/architecture/ownership-and-scheduler", "/docs/android/generated-api", "/docs/ios/generated-api"]),
  doc("/docs/android/integration", "Android integration and AAR", "Generate, assemble, integrate, configure, and release the generated Android library.", "android", 10, ["docs/platform/android.md", "src/packaging/android/AndroidProjectGenerator.cpp", "android-example/README.md"], `# Android integration and AAR
\`\`\`bash
crossa generate-build android ./crossa-project --output ./build/crossa-aar
cd ./build/crossa-aar
./gradlew :library:assembleRelease
\`\`\`

Generation runs the canonical C++ frontend and writes a self-contained Gradle library project. Its output includes generated Kotlin API/models, JNI bridge, native runtime/program, CMake configuration, manifest, consumer rules, artifact metadata, and a trusted Gradle Wrapper. The supported generated native ABI is \`arm64-v8a\`. \`config.cra\` is embedded as defaults, never a Kotlin API class.

## Integrate safely

Consume the generated AAR through your app's normal Gradle dependency policy; never edit generated source/AAR files. The generated project declares Debug and Release variants. Debug retains Kotlin unminified and JNI debugging; Release uses native Release configuration and R8/consumer rules. Use Release for consumers and benchmarks.

Create a runtime in the lifecycle scope that owns its operations. Android-only typed configuration overrides are serialized and validated once before runtime creation and do not mutate a running runtime. Keep result views closed before runtime teardown. Secrets must come from runtime secure storage, not artifact or flavor literals.`, ["Android", "AAR", "Gradle", "R8", "arm64-v8a"], ["/docs/android/generated-api", "/docs/networking/configuration", "/docs/troubleshooting"]),
  doc("/docs/android/generated-api", "Generated Kotlin API and values", "CrossaState, suspend/callback APIs, JNI bridge, result owners, and lifecycle rules.", "android", 20, ["docs/platform/android.md", "src/compiler/generators/kotlin/KotlinSourceWriter.cpp", "src/bindings/android/AndroidJniBridge.cpp"], `# Generated Kotlin API and native-backed values
Generated files are deterministic: \`api/<SourceUnit>.kt\`, \`model/<Model>.kt\`, \`runtime/CrossaState.kt\`, \`runtime/CrossaError.kt\`, and \`internal/CrossaNativeBridge.kt\`. Models are canonicalized once from the linked project; functions remain attached to their source unit.

Generated APIs expose cancellable callback and \`suspend\` forms backed by \`suspendCancellableCoroutine\`. \`@AsyncAfter\` publishes \`CrossaState.Success\`, \`Failed\`, or \`Cancelled\`; coroutine cancellation reaches native operation handle. \`@Sync\` is inline and \`@Async\` has no value result.

The JNI bridge is explicitly registered through \`RegisterNatives\`. It creates the runtime, forwards scalar arguments, retains callback references, and attaches a scheduler thread only to deliver completion. It contains no second interpreter/scheduler/result registry/networking implementation.

Models, \`CrossaNativeList\`, and \`CrossaJson\` are borrowed views over \`CrossaNativeResult\`. Nested access uses ABI value paths. Scalars copy then may close native handle. A closed result rejects later field/list/JSON access; no view remains valid after \`crossaReleaseRuntime\`.`, ["Kotlin", "CrossaState", "JNI", "suspend", "CrossaNativeList"], ["/docs/android/integration", "/docs/architecture/stable-abi", "/docs/networking/response-decoding-errors"]),
  doc("/docs/ios/integration", "iOS integration and XCFramework", "Generate, add, package, validate, and release the project-specific Apple framework.", "ios", 10, ["docs/platform/ios.md", "src/packaging/ios/IosProjectGenerator.cpp", "ios-example/README.md"], `# iOS integration and XCFramework
\`\`\`bash
crossa generate-build ios ./crossa-project --output ./build/crossa-ios
\`\`\`

The CLI writes \`<output>/project\`, archives Debug/Release device and simulator frameworks, and creates \`debug/Crossa.xcframework\` and \`release/Crossa.xcframework\`. It uses \`xcodebuild archive\` then \`-create-xcframework\`, not \`lipo\` across platforms.

The XCFramework contains the native runtime plus project operations/models, public Swift module, \`ios-arm64\` and \`ios-arm64-simulator\` slices, dSYMs, ZIP/checksum, \`Package.swift\`, and artifact manifest with CLI path/hash, source commit, ABI, target, and configuration.

Add \`Crossa.xcframework\` to Xcode, link/embed it according to app framework settings, then \`import Crossa\`. Default \`Package.swift\` uses a local binary target. Passing both \`--package-version\` and \`--package-base-url\` creates a remote binary target; that is optional, not part of local getting started. Use Release for consumer integration/benchmark observation and validate against the artifact manifest before distribution.`, ["iOS", "XCFramework", "SwiftPM", "dSYM"], ["/docs/ios/generated-api", "/docs/troubleshooting"]),
  doc("/docs/ios/generated-api", "Generated Swift API and values", "CrossaRuntime, CrossaOperation, CrossaState, callback thread, and native ownership.", "ios", 20, ["docs/platform/ios.md", "src/compiler/generators/swift/SwiftGenerator.cpp", "src/bindings/ios/CrossaIosRuntimeBridge.cpp", "ios-example/CrossaIOSExample/Networking/Crossa/CrossaPostsRepository.swift"], `# Generated Swift API and native-backed values
The public Swift module is \`Crossa\`. \`CrossaRuntime\` explicitly owns its native runtime handle and \`CrossaOperation\` maps cancellation to the native operation. \`@AsyncAfter\` becomes \`.success\`, \`.failed(CrossaError)\`, or \`.cancelled\`.

\`\`\`swift
let runtime = try CrossaRuntime()
let posts = try await CrossaFunctions.fetchPosts(runtime: runtime)
for index in posts.indices {
    print(posts[index].title)
}
\`\`\`

The iOS example uses this \`CrossaFunctions.fetchPosts(runtime:)\` shape. Native callbacks are not implicitly delivered on the main thread. Dispatch/actor-hop UI work in your application.

Generated model and \`CrossaList\` values retain an internal native result owner. Field/list access uses schema indexes and ABI value paths, keeping nested values lazy/native-backed. Scalar results are copied and can release native storage immediately. Do not retain views after their owner/runtime dies. Swift sees the controlled ABI wrapper—not C++ classes, STL, C++ exceptions, allocators, or scheduler pointers.`, ["Swift", "CrossaRuntime", "CrossaOperation", "CrossaList"], ["/docs/ios/integration", "/docs/architecture/stable-abi", "/docs/networking/response-decoding-errors"]),
  doc("/docs/cli/commands", "CLI commands", "Implemented commands, arguments, output, generation behavior, and doctor semantics.", "cli", 10, ["docs/development/cli.md", "src/cli/CrossaApplication.cpp", "src/cli/InteractiveCli.cpp"], `# CLI commands
| Command | Input | Behavior |
| --- | --- | --- |
| \`crossa check [--debug] <file.cra>\` | source entry | validates loader/import/parser/semantic/IR; no execution |
| \`crossa run [--project-root <dir>] <file.cra>\` | source entry | runs reachable top-level calls natively |
| \`crossa test [--debug] <file.cra>\` | source entry | assertion semantics; non-zero on assertion/runtime failure |
| \`crossa generate kotlin [--debug] <file.cra> --output <dir>\` | source+output | deterministic Kotlin for pure translated IR |
| \`crossa generate-build android [--debug] <project> --output <dir> [--entry <file>] [--ndk-version <v>] [--gradle-version <v>] [--kotlin-version <v>]\` | project+output | Android Gradle library project |
| \`crossa generate-build ios [--debug] <project> --output <dir> [--entry <file>] [--package-version <v>] [--package-base-url <url>]\` | project+output | Xcode project and XCFrameworks when prerequisites exist |
| \`crossa doctor\` / \`crossa --version\` | none | prerequisite report / version |

No-argument \`crossa\` starts the interactive wizard only when stdin is a terminal. Non-TTY invocations never wait; they produce a non-zero actionable diagnostic. \`--no-input\` is valid with explicit commands but fails alone rather than prompting.

Generation prints CLI path/version/source commit/SHA-256 and writes the same identity to the artifact manifest. \`generate kotlin\` does not turn runtime-backed \`CrossaRequest\` into a platform networking implementation; use build generation for native runtime artifacts.`, ["crossa check", "generate-build android", "generate-build ios", "doctor"], ["/docs/getting-started/installation", "/docs/android/integration", "/docs/ios/integration", "/docs/troubleshooting"]),
  doc("/docs/architecture/system-overview", "System architecture", "Compiler/runtime/bindings responsibility boundaries and why they exist.", "architecture", 10, ["ARCHITECTURE.md", "src/compiler", "src/runtime", "src/bindings"], `# System architecture
\`\`\`text
Source → compiler frontend → linked typed IR → generated native program
      → NativeRuntime → stable ABI → JNI / Swift bridge → app
\`\`\`

The frontend owns source processing; native generation owns compiled operations; \`NativeRuntime\` owns execution, scheduler, network, decoder, state, errors, and result storage; the ABI owns safe opaque crossing points; Android/iOS bridges own translation to their platform APIs only.

Semantic analysis is deliberately the single authority for names, types, annotations, interpolation, config, and request shape. Generators consume valid typed IR and do not reparse source. This prevents generated Kotlin/Swift from silently diverging from the native runtime contract.

The boundary does not expose internal C++ classes, STL containers, exceptions, allocators, RTTI assumptions, scheduler pointers, or transport handles.`, ["architecture", "NativeRuntime", "IR", "ABI"], ["/docs/architecture/ownership-and-scheduler", "/docs/architecture/stable-abi"]),
  doc("/docs/architecture/ownership-and-scheduler", "Ownership, lifetimes, and scheduler", "Runtime/result/view ownership, cancellation, shutdown, and bounded work execution.", "architecture", 20, ["docs/runtime/memory-ownership.md", "docs/runtime/scheduling.md", "src/runtime/NativeRuntime.cpp", "src/runtime/scheduler/TaskScheduler.cpp"], `# Ownership, lifetimes, and scheduler
\`\`\`text
Runtime
├── scheduler + transport + operation registry
├── operation / RequestHandle
│   └── terminal result or error handle
│       └── model/list/JSON platform view owner
└── temporary response DOM and scratch buffers
\`\`\`

Native models/lists own immutable values in schema/response order and never reference the temporary response buffer. \`Json\` explicitly retains generic JSON storage. A platform view requires both its result owner and runtime; close/release the runtime last.

One runtime owns one bounded scheduler. \`@Async\` and \`@AsyncAfter\` use its queue; no operation creates a thread per call. Worker count is hardware-derived/capped unless positive \`workerThreads\`/\`maxQueuedTasks\` configuration overrides it. Nested work may run inline on a scheduler worker to avoid deadlock.

Shutdown rejects new work, cancels accepted operations, drains queues, joins workers on a non-worker owner, then destroys runtime context. If a callback releases its runtime on a worker, a reaper performs final join to avoid self-join. Operation handle release only drops bookkeeping; result/error handles persist until explicitly released or runtime teardown.`, ["ownership", "RAII", "scheduler", "RequestHandle", "shutdown"], ["/docs/architecture/stable-abi", "/docs/networking/response-decoding-errors"]),
  doc("/docs/architecture/stable-abi", "Stable ABI", "Opaque runtime/operation/result/error handles and controlled native value paths.", "architecture", 30, ["ARCHITECTURE.md", "src/bindings/shared-abi/CrossaAbi.cpp", "src/bindings/shared-abi/CrossaRuntimeContext.cpp"], `# Stable ABI
ABI means the binary-level contract between separately compiled code. Crossa uses a narrow ABI so platform bindings do not need internal C++ runtime knowledge.

It exposes opaque runtime, operation, result, and error handles; create/release; cancellation; terminal state/error access; scalar reads; and index-based model/list/JSON value paths. A result always belongs to one runtime context.

Internal C++ classes, STL containers, C++ exceptions, allocation behavior, RTTI, transport handles, and scheduler pointers deliberately do not cross. The binding maps native failure into \`CrossaError\` and retains result owners when a model/list stays native-backed.

Release operation handles when cancellation bookkeeping is no longer needed, result/error handles when their data is no longer read, and runtime last. ABI accessors acquire a temporary strong runtime reference before accessing result storage, protecting against a concurrent release.`, ["ABI", "opaque handles", "result handle", "JNI"], ["/docs/architecture/ownership-and-scheduler", "/docs/android/generated-api", "/docs/ios/generated-api"]),
  doc("/docs/reference/request-and-config-reference", "Request and configuration reference", "One scan-friendly list of all supported request/config keys and HTTP literals.", "reference", 10, network, `# Request and configuration reference
## HTTP method literals

\`GET\`, \`POST\`, \`PUT\`, \`PATCH\`, \`DELETE\`, \`HEAD\`, \`OPTIONS\`, \`TRACE\`, and \`CONNECT\` are the current supported literals. Default retry policy applies only to idempotent methods; \`POST\`/\`PATCH\` require \`retryNonIdempotent: true\` to retry.

## Complete CrossaRequest field list

\`url\`, \`path\`, \`method\`, \`headers\`, \`customHeaders\`, \`queryParams\`, \`pathVariables\`, \`body\`, \`timeout\`, \`retryPolicy\`, \`auth\`, \`multipart\`, \`uploadProgress\`, \`downloadStreaming\`, \`coalesce\`, \`proxy\`, \`certificatePolicy\`, \`telemetry\`.

## Complete config.cra key list

\`packageName\`, \`baseUrl\`, \`timeoutRequest\`, \`commonHeaders\`, \`interceptor\`, \`workerThreads\`, \`maxQueuedTasks\`, \`maxResponseBytes\`, \`maxJsonDepth\`, \`maxResponseHeaderBytes\`, \`maxResponseHeaderCount\`, \`followRedirects\`, \`retryPolicy\`, \`authProviders\`, \`defaultAuthProvider\`, \`uploadProgress\`, \`downloadStreaming\`, \`requestCoalescing\`, \`proxy\`, \`certificatePolicy\`, \`telemetry\`.

Read [CrossaRequest](/docs/networking/crossa-request) and [config.cra](/docs/networking/configuration) for complete types/defaults/constraints.`, ["HTTP methods", "config keys", "request fields", "pinnedPublicKey"], ["/docs/networking/crossa-request", "/docs/networking/configuration"]),
  doc("/docs/reference/language-reference", "Language reference and diagnostics", "Quick syntax reference, current compiler diagnostic codes, and constraints.", "reference", 20, ["docs/language/language-foundation.md", "src/compiler/semantic/SemanticAnalyzer.cpp"], `# Language reference and diagnostics
\`\`\`cra
import #file.cra#
var name: String = "Crossa"
model User(id: Int, name: String)
fun add(a: Int, b: Int): Int { re a + b }
if (enabled) { print("yes") } else { print("no") }
@AsyncAfter
fun load(): Json { re CrossaRequest { url: "/items", method: GET } }
\`\`\`

| Code | Meaning |
| --- | --- |
| \`CRA2001…CRA2003\` | duplicate top-level symbol, parameter, or source variable |
| \`CRA3001\` | variable initializer type mismatch |
| \`CRA4001…CRA4002\` | duplicate model field or source/model identity mismatch |
| \`CRA5001…CRA5004\` | invalid config.cra location/shape |
| \`CRA6001…CRA6002\` | invalid @Async/@AsyncAfter result contract |
| \`CRA7002…CRA7015\` | invalid CrossaRequest field/shape/type/policy form |

Do not invent a code where source exposes only a runtime error. Preserve full source location and compiler text when reporting an issue.`, ["diagnostics", "CRA7002", "syntax"], ["/docs/troubleshooting", "/docs/language/overview"]),
  doc("/docs/reference/glossary", "Glossary", "Approachable technical definitions for Crossa architecture and platform terms.", "reference", 30, core, `# Glossary
| Term | Meaning |
| --- | --- |
| ABI | Binary contract through which bindings access native Crossa without C++ internals. |
| AAR | Android Archive produced by generated Gradle library. |
| AST | Abstract Syntax Tree, parser output representing source structure. |
| CRA / .cra | Crossa language and source extension. |
| CrossaState | Async terminal state: success, failed error, or cancelled. |
| IR | Typed platform-neutral Intermediate Representation. |
| JNI | Java Native Interface used by Android bridge. |
| Logical success type | Source function return type describing eventual async success payload. |
| Native-backed view | Platform model/list/JSON wrapper backed by native result storage. |
| Runtime | Native owner of execution, scheduler, transport, decoder, errors, results. |
| Semantic analysis | Compiler stage resolving names/types and validating contracts. |
| Source unit | One .cra file; ordinary filename may determine generated identity. |
| XCFramework | Apple bundle with device and simulator framework slices. |`, ["ABI", "AST", "IR", "JNI", "AAR", "XCFramework"], ["/docs/concepts/compiler-pipeline", "/docs/architecture/stable-abi"]),
  doc("/docs/troubleshooting", "Troubleshooting", "Actionable compiler, networking, Android, and iOS problem-to-fix guidance.", "troubleshooting", 10, ["docs/development/cli.md", "docs/platform/android.md", "docs/platform/ios.md", "src/compiler/semantic/SemanticAnalyzer.cpp"], `# Troubleshooting
## Import is missing, ambiguous, or cyclic

**Reason:** imports are exact filename-only, case-sensitive recursive project-root lookup. Duplicate filenames are ambiguous and cycles cannot create deterministic linking.

**Fix:** use one exact \`.cra\` filename, rename duplicates, keep imports at top, and remove circular direction. Do not add a path.

## config.cra errors

**Reason:** \`CRA5001…CRA5004\` indicates config outside \`config.cra\`, non-config declarations in it, more than one config, or no config.

**Fix:** keep exactly one declarative \`config { … }\` in \`config.cra\`.

## Request field/value errors

**Reason:** only documented request fields exist; headers/query/path maps require scalar JSON objects; timeout requires Int milliseconds; policy values require JSON objects.

**Fix:** compare against [CrossaRequest](/docs/networking/crossa-request). Use exactly one of \`url\`/\`path\`; add HTTP(S) \`baseUrl\` for relative paths.

## Android or iOS build errors

Run \`crossa doctor\`, fix required prerequisite failures, regenerate, and preserve command output/artifact manifest. Android artifacts support the documented \`arm64-v8a\` path. For iOS, use the device/simulator slice appropriate to the app build, link/embed the framework, and do not require remote SwiftPM for local integration.

## Native-backed value fails after cleanup

Model/list/JSON views require live result owner and runtime. Release operation bookkeeping separately; release results when no longer used; release runtime last.`, ["ambiguous import", "CRA7002", "NDK", "simulator", "native-backed"], ["/docs/getting-started/installation", "/docs/networking/crossa-request", "/docs/android/integration", "/docs/ios/integration"])] as const satisfies readonly DocumentationDefinition[];

export function getDocument(pathname: string): DocumentationDefinition | undefined {
  const normalized = pathname.replace(/\/$/, "") || "/docs";
  return documentationCatalog.find((entry) => entry.slug === normalized);
}

export function documentsInSection(section: DocumentationSection): readonly DocumentationDefinition[] {
  return documentationCatalog.filter((entry) => entry.section === section).sort((a, b) => a.order - b.order);
}
