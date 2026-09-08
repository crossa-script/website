import { ChevronLeft, ChevronRight, Menu, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, Navigate, useLocation } from "react-router";
import { CodeBlock } from "../../components/ui/CodeBlock";
import { PageTransition } from "../../components/ui/PageTransition";
import { documentationCatalog, documentsInSection, getDocument, type DocumentationSection } from "../../content/docs/catalog";

const sections: readonly [DocumentationSection, string][] = [["start", "Start here"], ["language", "Language"], ["runtime", "Runtime"], ["platform", "Platforms"], ["cli", "CLI"], ["reference", "Reference"]];

function slugify(value: string): string { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

function DocsSidebar({ open, onClose }: { readonly open: boolean; readonly onClose: () => void }): React.JSX.Element {
  const location = useLocation();
  return <aside className={`docs-sidebar ${open ? "is-open" : ""}`} aria-label="Documentation navigation"><div className="docs-sidebar__heading">Crossa docs<button type="button" className="docs-sidebar__close" onClick={onClose}>Close</button></div>{sections.map(([section, label]) => <section key={section}><h2>{label}</h2>{documentsInSection(section).map((document) => <Link key={document.slug} to={document.slug} aria-current={location.pathname === document.slug ? "page" : undefined}>{document.title}</Link>)}</section>)}</aside>;
}

function MarkdownArticle({ content }: { readonly content: string }): React.JSX.Element {
  return <Markdown remarkPlugins={[remarkGfm]} components={{
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h2 id={slugify(String(children))}>{children}</h2>,
    h3: ({ children }) => <h3 id={slugify(String(children))}>{children}</h3>,
    pre: ({ children }) => <>{children}</>,
    code: ({ className, children }) => {
      const language = className?.replace("language-", "") ?? "text";
      const text = String(children).replace(/\n$/, "");
      return className ? <CodeBlock language={language}>{text}</CodeBlock> : <code>{children}</code>;
    },
    blockquote: ({ children }) => <aside className="callout">{children}</aside>,
    a: ({ href, children }) => <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noreferrer" : undefined}>{children}</a>
  }}>{content}</Markdown>;
}

function DocumentationNotes({ section }: { readonly section: DocumentationSection }): React.JSX.Element {
  const notes: Readonly<Record<DocumentationSection, readonly string[]>> = {
    start: ["Use `crossa check` before execution when you want to validate loading, imports, semantics, and typed IR without running reachable calls.", "Use `crossa doctor` for installation and toolchain diagnostics; it does not modify machine configuration.", "Move to the Android or iOS guide only after the .cra project is linked and validated."],
    language: ["The C++ frontend remains the only parser and semantic authority for .cra source.", "Kotlin and Swift consume typed compiler output; they do not define a second language implementation.", "Treat filenames and imports as deterministic build input when they determine generated API identity."],
    runtime: ["The native runtime owns transport, response buffering, typed decoding, scheduling, cancellation, errors, and lifetime coordination.", "Platform bindings bridge the ABI and platform lifecycle without taking ownership of a second request pipeline.", "Result views must respect the owning runtime/result lifetime before reading models, lists, or nested fields."],
    platform: ["Generated artifacts are project-specific output from the linked Crossa project, not universal Crossa SDK binaries.", "Record the generated artifact manifest when validating a consumer integration; it ties output to CLI and Crossa source identity.", "Use Release artifacts for consumer observation and distribution workflows; Debug artifacts remain for native troubleshooting."],
    cli: ["Explicit commands stay non-interactive; the no-argument wizard is available only when standard input is attached to a terminal.", "Generation writes artifacts from the canonical C++ frontend rather than generating an alternative platform networking implementation.", "Keep the command output and generated manifest when reporting an integration problem."],
    reference: ["This page is curated from the recorded source paths shown below the article.", "If Crossa changes its compiler, language, runtime, packaging, or benchmark methodology, update this public route with the corresponding source revision.", "Where behavior is still in progress, the documentation names that status instead of treating it as available." ]
  };
  return <section className="docs-notes"><h2>Implementation notes</h2><ul>{notes[section].map((note) => <li key={note}>{note}</li>)}</ul></section>;
}

export function Component(): React.JSX.Element {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const document = getDocument(location.pathname);
  const headings = useMemo(() => document?.content.split("\n").filter((line) => line.startsWith("## ")).map((line) => line.slice(3)) ?? [], [document]);
  useEffect(() => { if (document) window.document.title = `${document.title} — Crossa`; }, [document]);
  if (!document) return <Navigate to="/docs" replace />;
  const index = documentationCatalog.findIndex((entry) => entry.slug === document.slug);
  const previous = documentationCatalog[index - 1];
  const next = documentationCatalog[index + 1];
  return <PageTransition className="docs-page"><div className="docs-mobile-controls"><button type="button" onClick={() => setSidebarOpen(true)}><Menu size={17} /> Browse docs</button><button type="button" onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}><Search size={16} /> Search</button></div><DocsSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><article className="docs-article"><div className="breadcrumbs"><Link to="/docs">Docs</Link><span>/</span><span>{document.title}</span></div><p className="eyebrow">Crossa V0 · verified at {document.verifiedCommit}</p><MarkdownArticle content={document.content} /><DocumentationNotes section={document.section} /><div className="doc-source">Source: <code>{document.sourceRepository}</code> · {document.sourcePaths.join(", ")}</div><nav className="doc-pagination" aria-label="Documentation pagination">{previous ? <Link to={previous.slug}><ChevronLeft size={16} /><span><small>Previous</small>{previous.title}</span></Link> : <span />}{next ? <Link to={next.slug}><span><small>Next</small>{next.title}</span><ChevronRight size={16} /></Link> : <span />}</nav></article><aside className="docs-toc" aria-label="On this page"><b>On this page</b>{headings.map((heading) => <a key={heading} href={`#${slugify(heading)}`}>{heading}</a>)}</aside></PageTransition>;
}
