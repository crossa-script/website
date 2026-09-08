import { ChevronLeft, ChevronRight, Menu, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, Navigate, useLocation } from "react-router";
import { applyDocumentMetadata } from "../../app/metadata";
import { CodeBlock } from "../../components/ui/CodeBlock";
import { PageTransition } from "../../components/ui/PageTransition";
import { documentationCatalog, documentsInSection, getDocument, type DocumentationSection } from "../../content/docs/catalog";

const sections: readonly [DocumentationSection, string][] = [
  ["start", "Getting started"],
  ["concepts", "Core concepts"],
  ["language", "Crossa language"],
  ["networking", "Networking"],
  ["android", "Android"],
  ["ios", "iOS"],
  ["cli", "CLI"],
  ["architecture", "Architecture"],
  ["reference", "Reference"],
  ["troubleshooting", "Troubleshooting"],
];

function slugify(value: string): string { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

function DocsSidebar({ open, onClose }: { readonly open: boolean; readonly onClose: () => void }): React.JSX.Element {
  const location = useLocation();
  return <aside className={`docs-sidebar ${open ? "is-open" : ""}`} aria-label="Documentation navigation"><div className="docs-sidebar__heading">Crossa docs<button type="button" className="docs-sidebar__close" onClick={onClose}>Close</button></div>{sections.map(([section, label]) => <section key={section}><h2>{label}</h2>{documentsInSection(section).map((document) => <Link key={document.slug} to={document.slug} aria-current={location.pathname === document.slug ? "page" : undefined}>{document.title}</Link>)}</section>)}</aside>;
}

function MarkdownArticle({ content }: { readonly content: string }): React.JSX.Element {
  return <Markdown remarkPlugins={[remarkGfm]} components={{
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h2 id={slugify(String(children))}><a className="heading-anchor" href={`#${slugify(String(children))}`} aria-label={`Link to ${String(children)}`}>{children}</a></h2>,
    h3: ({ children }) => <h3 id={slugify(String(children))}><a className="heading-anchor" href={`#${slugify(String(children))}`} aria-label={`Link to ${String(children)}`}>{children}</a></h3>,
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

function RelatedDocuments({ slugs }: { readonly slugs: readonly string[] }): React.JSX.Element | null {
  const documents = slugs.flatMap((slug) => {
    const entry = getDocument(slug);
    return entry ? [entry] : [];
  });
  if (!documents.length) return null;
  return <section className="related-documents"><h2>Related documentation</h2><div>{documents.map((entry) => <Link key={entry.slug} to={entry.slug}><strong>{entry.title}</strong><span>{entry.description}</span></Link>)}</div></section>;
}

export function Component(): React.JSX.Element {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const document = getDocument(location.pathname);
  const headings = useMemo(() => document?.content.split("\n").filter((line) => line.startsWith("## ") || line.startsWith("### ")).map((line) => line.replace(/^#{2,3} /, "")) ?? [], [document]);
  useEffect(() => { if (document) applyDocumentMetadata(document.title, document.description, document.keywords, document.slug); }, [document]);
  if (!document) return <Navigate to="/docs" replace />;
  const index = documentationCatalog.findIndex((entry) => entry.slug === document.slug);
  const previous = documentationCatalog[index - 1];
  const next = documentationCatalog[index + 1];
  return <PageTransition className="docs-page"><div className="docs-mobile-controls"><button type="button" onClick={() => setSidebarOpen(true)}><Menu size={17} /> Browse docs</button><button type="button" onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}><Search size={16} /> Search</button></div><DocsSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><article className="docs-article"><div className="breadcrumbs"><Link to="/docs">Docs</Link><span>/</span><span>{document.title}</span></div><p className="eyebrow">Crossa V0 · verified at {document.verifiedCommit}</p><MarkdownArticle content={document.content} /><RelatedDocuments slugs={document.related} /><section className="doc-traceability"><h2>Source traceability</h2><p>This page is explanatory documentation. Crossa engineering sources remain authoritative.</p><ul><li><code>{document.sourceRepository}</code></li>{document.sourcePaths.map((path) => <li key={path}><code>{path}</code></li>)}</ul></section><nav className="doc-pagination" aria-label="Documentation pagination">{previous ? <Link to={previous.slug}><ChevronLeft size={16} /><span><small>Previous</small>{previous.title}</span></Link> : <span />}{next ? <Link to={next.slug}><span><small>Next</small>{next.title}</span><ChevronRight size={16} /></Link> : <span />}</nav></article><aside className="docs-toc" aria-label="On this page"><b>On this page</b>{headings.map((heading) => <a key={heading} href={`#${slugify(heading)}`}>{heading}</a>)}</aside></PageTransition>;
}
