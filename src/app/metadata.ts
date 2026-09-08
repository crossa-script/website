import { useEffect } from "react";
import { useLocation } from "react-router";
import seoPages from "../content/seo-pages.json";

interface SeoMetadata {
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly schemaType: string;
  readonly noIndex?: boolean;
}

interface SeoPage extends SeoMetadata {
  readonly path: string;
}

const pages = seoPages as readonly SeoPage[];
const fallbackKeywords = ["Crossa", ".cra", "native client runtime", "Android AAR", "iOS XCFramework", "C++ mobile runtime"];

function upsertMeta(selector: string, attributes: Readonly<Record<string, string>>): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.append(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
}

function upsertLink(selector: string, attributes: Readonly<Record<string, string>>): void {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.append(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
}

function structuredData(metadata: SeoMetadata, canonical: string): object {
  const origin = window.location.origin;
  const graph: object[] = [
    { "@type": "Organization", "@id": `${origin}/#organization`, name: "Crossa", url: origin, logo: { "@type": "ImageObject", url: `${origin}/brand/logo.png`, width: 256, height: 256 }, sameAs: ["https://github.com/crossa-script"] },
    { "@type": "WebSite", "@id": `${origin}/#website`, name: "Crossa", url: origin, description: pages[0]?.description, publisher: { "@id": `${origin}/#organization` }, inLanguage: "en" },
    { "@type": "SoftwareApplication", "@id": `${origin}/#software`, name: "Crossa", applicationCategory: "DeveloperApplication", operatingSystem: "Android, iOS, macOS, Linux", description: pages[0]?.description, url: origin, codeRepository: "https://github.com/crossa-script/Crossa", programmingLanguage: ["C++", "Kotlin", "Swift"] },
    { "@type": metadata.schemaType === "SoftwareApplication" ? "WebPage" : metadata.schemaType, "@id": `${canonical}#webpage`, url: canonical, name: metadata.title, headline: metadata.title, description: metadata.description, isPartOf: { "@id": `${origin}/#website` }, about: { "@id": `${origin}/#software` }, mainEntity: metadata.schemaType === "SoftwareApplication" ? { "@id": `${origin}/#software` } : undefined, inLanguage: "en" }
  ];
  return { "@context": "https://schema.org", "@graph": graph };
}

export function applyMetadata(metadata: SeoMetadata, path: string): void {
  const canonical = new URL(path, window.location.origin).href;
  const image = new URL("/brand/og-crossa.png", window.location.origin).href;
  const robots = metadata.noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  document.title = metadata.title;
  upsertMeta('meta[name="description"]', { name: "description", content: metadata.description });
  upsertMeta('meta[name="keywords"]', { name: "keywords", content: metadata.keywords.join(", ") });
  upsertMeta('meta[name="robots"]', { name: "robots", content: robots });
  upsertMeta('meta[name="googlebot"]', { name: "googlebot", content: robots });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: metadata.schemaType === "TechArticle" ? "article" : "website" });
  upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "Crossa" });
  upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: "en_US" });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: metadata.title });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: metadata.description });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
  upsertMeta('meta[property="og:image:type"]', { property: "og:image:type", content: "image/png" });
  upsertMeta('meta[property="og:image:width"]', { property: "og:image:width", content: "1200" });
  upsertMeta('meta[property="og:image:height"]', { property: "og:image:height", content: "630" });
  upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: "Crossa native client runtime for Android and iOS" });
  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: metadata.title });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: metadata.description });
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
  upsertMeta('meta[name="twitter:image:alt"]', { name: "twitter:image:alt", content: "Crossa native client runtime for Android and iOS" });
  upsertLink('link[rel="canonical"]', { rel: "canonical", href: canonical });
  upsertLink('link[rel="alternate"][hreflang="en"]', { rel: "alternate", hreflang: "en", href: canonical });
  upsertLink('link[rel="alternate"][hreflang="x-default"]', { rel: "alternate", hreflang: "x-default", href: canonical });
  let script = document.head.querySelector<HTMLScriptElement>("#crossa-structured-data");
  if (!script) {
    script = document.createElement("script");
    script.id = "crossa-structured-data";
    script.type = "application/ld+json";
    document.head.append(script);
  }
  script.textContent = JSON.stringify(structuredData(metadata, canonical));
}

export function applyDocumentMetadata(title: string, description: string, keywords: readonly string[], path: string): void {
  applyMetadata({ title: `${title} — Crossa Docs`, description, keywords: [...keywords, ...fallbackKeywords], schemaType: "TechArticle" }, path);
}

export function DocumentMetadata(): null {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith("/docs")) return;
    const metadata = pages.find((page) => page.path === location.pathname) ?? { title: "Page not found — Crossa", description: "The requested Crossa page does not exist.", keywords: fallbackKeywords, schemaType: "WebPage", noIndex: true };
    applyMetadata(metadata, location.pathname);
  }, [location.pathname]);
  return null;
}
