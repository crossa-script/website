# Crossa Website Agent Instructions

## Responsibility

This repository contains the official Crossa public website and documentation portal. It explains the product, documents supported APIs and language behavior, presents verified architecture and benchmark snapshots, and links the Crossa ecosystem.

`ARCHITECTURE.md` is the primary technical architecture for this repository. Read it before changing routing, application structure, documentation infrastructure, tokens, content loading, search, animation, dependencies, accessibility, performance, or deployment behavior.

Crossa behavior must be sourced from the Crossa core repository and its current documentation. Do not invent capabilities.

## Technology Contract

The site uses React, TypeScript, Vite, Tailwind CSS, React Router, Motion, and Lucide React. It is client-side rendered and deployed as static assets. Do not add Next.js, SSR, server components, backend services, databases, CMS dependencies, or remote search services without an explicit architectural decision.

## Working Rules

Before substantial work, inspect the affected route, existing tokens and components, responsive and keyboard behavior, reduced-motion behavior, route chunking, and the source supporting any Crossa claim. Prefer the smallest complete solution.

Use functional React components, strict TypeScript, composition, focused components, derived state, local state, and reusable hooks only when they carry real responsibility. Never use `any` as a convenience. Do not add comments to code.

Components belong in `components/ui`, `components/layout`, `features`, `routes`, or `content` according to their responsibility. Content must not depend on UI or routes. Generic UI must not depend on route-specific Crossa content.

## Design, Accessibility, and Performance

Tailwind and semantic CSS tokens are the styling system. Avoid scattered colors, generic SaaS patterns, stock imagery, decorative WebGL, or uniform card grids. Use a dark-first, native-systems visual language with diagrams, code, clear hierarchy, and deliberate spacing.

All interactions must be keyboard accessible with semantic HTML, visible focus, meaningful names, responsive behavior, and reduced-motion equivalents. Motion is an enhancement: prefer opacity and transforms and never animate simply because the dependency is present.

Keep initial marketing code small. Route-load pages, documentation search, and benchmark UI. Do not add a large framework or charting dependency for a small feature.

## Documentation and Content

The typed documentation catalog is the single source for documentation routing, navigation, search, breadcrumbs, previous/next links, and sitemap entries. Every document records slug, title, description, section, order, source repository/path, and verified commit where available.

Crossa snippets must match the current language foundation. Check `fun`, `re`, `var`, `model`, `import #file.cra#`, `if`/`else`, `@Sync`, `@Async`, `@AsyncAfter`, `CrossaRequest`, `config.cra`, `#identifier` interpolation, and `List<T>` before publishing examples.

Benchmark snapshots are development observations. Always disclose simulator/emulator and remote-endpoint context; never treat them as physical-device guarantees.

## Documentation Depth Contract

A public documentation page explains the complete user-facing contract of its topic. For a feature or API, document applicable syntax, parameters, properties, types, required/optional status, defaults, allowed values, units, compile-time validation, runtime behavior, ownership/lifetime, errors, Android mapping, iOS mapping, limitations, examples, and troubleshooting.

Navigation summaries and short feature cards are not documentation. Do not publish an API or configuration page when a developer still needs Crossa source to discover supported options. Complex topics including `config.cra`, `CrossaRequest`, `@AsyncAfter`, Android integration, and iOS integration require comprehensive treatment. Accuracy takes precedence over concise copy.

## Validation

Validate implementation with install, typecheck, lint, and production build. Do not add a test framework unless explicitly asked. Keep the static hosting requirement documented: unknown application routes must fall back to `/index.html`.
