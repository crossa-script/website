# Crossa Website Architecture

## Purpose

The Crossa website is the public interface for understanding and adopting Crossa. It explains the product, teaches the current workflow, documents verified behavior, and presents the architecture and ecosystem. It is deliberately a client-rendered static application.

## Runtime

```text
React → React Router → route components → features/content → reusable UI → Tailwind tokens
Vite build → static assets → CDN/static host → browser → React CSR
```

No website backend is required. Every non-asset application URL must rewrite to `/index.html` on the static host.

## Technology and Boundaries

React, TypeScript, Vite, Tailwind CSS, and React Router are primary dependencies. Motion provides meaningful interaction enhancement and Lucide provides interface icons. Avoid a second styling system or large UI framework.

Dependencies flow inward: `routes → features → components → content/domain`. Shared infrastructure must not import routes; content must not import UI or routes; generic layout must not know a specific article.

## Source Structure

```text
src/
  app/          router, providers, metadata
  routes/       page composition
  components/   reusable UI, layout, brand
  features/     docs, code preview, architecture, benchmarks, navigation
  content/      typed documents, benchmark snapshots, repositories, examples
  styles/       tokens and global CSS
```

## Routing and Content

React Router Data Mode owns navigation. Major route modules are lazy-loaded and support deep links. `/`, `/docs/*`, `/benchmarks`, `/repositories/*`, `/examples`, and a 404 route are public routes.

Documentation is local typed content. One catalog powers routes, sidebar, search, breadcrumbs, previous/next links, and sitemap entries. Each record preserves source repository and paths, and where available the Crossa commit used to verify the material. Markdown-like blocks are rendered from trusted static content; raw arbitrary HTML is not accepted.

## Documentation Content Architecture

Documentation follows this flow:

```text
Crossa source-of-truth
    ↓
curated website content
    ↓
typed document metadata
    ↓
documentation registry
    ↓
routes / navigation / search / related content
```

Crossa engineering sources remain canonical; the website explains their verified behavior rather than competing with the language specification. Reused reference data, such as configuration properties, request properties, HTTP methods, and CLI commands, has one typed source. UI components render documentation but do not define Crossa technical semantics.

## Design, Motion, and Accessibility

The design is dark-first and technical: graphite surfaces, restrained spectral accents, code surfaces, diagrams, and crisp hierarchy. Semantic CSS variables define colors and components consume tokens rather than arbitrary palette values.

Motion is optional enhancement for pipeline progression, tabs, and menu transitions. It uses transform and opacity and honors reduced-motion preferences. Native semantic elements, skip navigation, visible focus, accessible dialogs, responsive typography, and keyboard operation are baseline requirements.

## Benchmarks

Benchmark source JSON is copied as versioned content and normalized behind a small repository adapter. UI consumes a stable domain model rather than Android/iOS source shapes. Benchmark presentation always identifies build type, artifact commit, emulator/simulator context, remote endpoint, and sample count. It makes no physical-device or product-performance guarantee.

## State and Performance

Routing is URL state; local component state handles interactions; a small theme context handles only theme preference. Static content is immutable. There is no Redux, database, hosted search, or runtime API.

Home does not load the documentation corpus, benchmark explorer, or command search eagerly. Use route-level chunks, browser-native APIs where clear, SVG/CSS for diagrams and charts, local assets, and tree-shaken icons.

## Metadata, Security, and Change Rule

Route metadata updates titles and descriptions in the browser. Static public files provide robots, sitemap, manifest, favicon, and a generic SPA redirect. CSR has inherent SEO limitations and no SSR is introduced silently.

Only trusted local content is displayed. Do not inject arbitrary HTML, expose secrets, add trackers by default, or use unsafe external-link behavior.

Any change to rendering strategy, router, content format, search, styling, global state, analytics, or deployment behavior must update this document.
