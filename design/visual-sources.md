# Visual sources

Product verification: Crossa `8c362e10fba65cbc2279f08c06eb5469e16a72e5`, inspected September 8, 2026. Source: ARCHITECTURE.md, language/language-foundation.md, platform/android.md, platform/ios.md, runtime/memory-ownership.md, runtime/scheduling.md, features/networking.md and development/{cli,release,testing,v0-closure-report}.md.

- Pipeline, runtime, duplication, artifact and ecosystem SVGs: original engineering illustrations authored for this site. Regenerate using `node scripts/generate-visuals.mjs`. Layout primitives are shared; product labels must agree with `src/content/product/story.ts` and source documentation.
- Four CRA tabs: complete copies of `android-example/crossa/{Post,postRequests,postsRepository,config}.cra`. The request and model semantics agree with the iOS project.
- Android image: explicitly labeled source-based illustration of the idle Compose screen. Based on `android-example/app/src/main/java/com/crossa/androiddemo/MainActivity.kt`, Header and BenchmarkScreen, with current configuration. It is not a screenshot and contains no measured performance values. Further capture attempts stopped at the user's request.
- iOS image: actual local iPhone 14 Pro Max simulator capture, iOS 17.5, September 8, 2026. Installed app `io.crossa.example`; screen reports Release, cold, remote, eight measured rounds, two configured warmups. Binary commit was not independently established from the installed bundle. The displayed UI agrees with `CrossaIOSExample/Features/Posts/Presentation/PostsView.swift`. AVIF and WebP variants are 430 and 860 pixels wide. Charts use retained JSON, not screenshot readings.
- Official brand: existing `public/brand/logo.png`, resized losslessly in appearance to 256×256 and palette-compressed for web delivery. The logo design is unchanged.
- Benchmarks: website JSON snapshots match platform `benchmark-results` files. Raw inputs, artifact commit/hash, environment, round count and failure status are retained by BenchmarkRepository. Both source harnesses select index floor((n−1)×q). Do not substitute nearest-rank p95 or omit the maximum sample from the raw plot.

The old checked-in Android and iOS screenshots use five requests and were intentionally not presented as current validation evidence.
