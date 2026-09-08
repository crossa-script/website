import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = join(root, "dist");
const publicPages = JSON.parse(readFileSync(join(root, "src/content/seo-pages.json"), "utf8"));
const catalog = readFileSync(join(root, "src/content/docs/catalog.ts"), "utf8");
const docPattern = /doc\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"/g;
const docs = [];
let match;
while ((match = docPattern.exec(catalog))) {
  const [, path, title, description] = match;
  const section = path.split("/")[2] || "documentation";
  docs.push({ path, title: `${title} — Crossa Docs`, description, keywords: ["Crossa documentation", `Crossa ${section}`, title, ".cra language", "native client runtime", "Android AAR", "iOS XCFramework"], schemaType: "TechArticle" });
}

const configuredOrigin = process.env.SITE_URL || process.env.URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
const origin = (configuredOrigin || "http://localhost:4173").replace(/\/$/, "");
if (!/^https?:\/\//.test(origin)) throw new Error("SITE_URL must be an absolute http(s) origin");
if (!configuredOrigin) process.stderr.write("SEO build uses http://localhost:4173. Set SITE_URL for deployment.\n");

const pages = [...publicPages, ...docs.filter((doc) => !publicPages.some((page) => page.path === doc.path))];
if (new Set(pages.map((page) => page.path)).size !== pages.length) throw new Error("SEO routes must be unique");
if (new Set(pages.map((page) => page.title)).size !== pages.length) throw new Error("SEO titles must be unique");
if (pages.some((page) => !page.path.startsWith("/") || !page.title || !page.description || !page.keywords.length)) throw new Error("Every SEO route requires a path, title, description, and keywords");
const template = readFileSync(join(dist, "index.html"), "utf8");
const modified = (() => {
  try { return execFileSync("git", ["log", "-1", "--format=%cs", "--", "."], { cwd: root, encoding: "utf8" }).trim(); }
  catch { return ""; }
})();
const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const escapeXml = (value) => escapeHtml(value).replaceAll("'", "&apos;");
const absolute = (path) => `${origin}${path === "/" ? "/" : path}`;

function schema(page) {
  const url = absolute(page.path);
  const publisher = { "@type": "Person", "@id": `${origin}/#yazan-tarifi`, name: "Yazan Tarifi", url: "https://www.yazantarifi.com/", jobTitle: "Mobile Software Engineer", description: "Software engineer focused on native Android and iOS applications, Kotlin Multiplatform, Compose Multiplatform, SwiftUI, and scalable backend APIs.", sameAs: ["https://github.com/Yazan98", "https://www.yazantarifi.com/", "https://www.linkedin.com/in/yazantarifi", "https://medium.com/@yazantarifi98"] };
  const graph = [
    { ...publisher },
    { "@type": "Organization", "@id": `${origin}/#organization`, name: "Crossa Script", url: origin, logo: { "@type": "ImageObject", url: `${origin}/brand/logo.png`, width: 256, height: 256 }, founder: { "@id": `${origin}/#yazan-tarifi` }, sameAs: ["https://github.com/crossa-script", "https://www.yazantarifi.com/"] },
    { "@type": "WebSite", "@id": `${origin}/#website`, name: "Crossa", url: origin, description: publicPages[0].description, publisher: { "@id": `${origin}/#organization` }, inLanguage: "en" },
    { "@type": "SoftwareApplication", "@id": `${origin}/#software`, name: "Crossa", applicationCategory: "DeveloperApplication", operatingSystem: "Android, iOS, macOS, Linux", description: publicPages[0].description, url: origin, codeRepository: "https://github.com/crossa-script/Crossa", programmingLanguage: ["C++", "Kotlin", "Swift"] },
    { "@type": page.schemaType === "SoftwareApplication" ? "WebPage" : page.schemaType, "@id": `${url}#webpage`, url, name: page.title, headline: page.title, description: page.description, isPartOf: { "@id": `${origin}/#website` }, about: { "@id": `${origin}/#software` }, ...(page.path === "/" ? { mainEntity: { "@id": `${origin}/#software` } } : {}), inLanguage: "en", ...(modified ? { dateModified: modified } : {}) }
  ];
  if (page.path !== "/") {
    const names = page.path.split("/").filter(Boolean);
    graph.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Crossa", item: `${origin}/` }, ...names.map((name, index) => ({ "@type": "ListItem", position: index + 2, name: index === names.length - 1 ? page.title.replace(" — Crossa Docs", "") : name.replaceAll("-", " "), item: `${origin}/${names.slice(0, index + 1).join("/")}` }))] });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

function render(page) {
  const url = absolute(page.path);
  const image = `${origin}/brand/og-crossa.png`;
  const type = page.schemaType === "TechArticle" ? "article" : "website";
  const head = `<meta name="description" content="${escapeHtml(page.description)}" data-seo="true" />
    <meta name="keywords" content="${escapeHtml(page.keywords.join(", "))}" data-seo="true" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" data-seo="true" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" data-seo="true" />
    <meta name="author" content="Yazan Tarifi" data-seo="true" />
    <meta name="publisher" content="Crossa Script" data-seo="true" />
    <meta property="og:type" content="${type}" data-seo="true" />
    <meta property="og:site_name" content="Crossa" data-seo="true" />
    <meta property="og:locale" content="en_US" data-seo="true" />
    <meta property="og:title" content="${escapeHtml(page.title)}" data-seo="true" />
    <meta property="og:description" content="${escapeHtml(page.description)}" data-seo="true" />
    <meta property="og:url" content="${url}" data-seo="true" />
    <meta property="og:image" content="${image}" data-seo="true" />
    <meta property="og:image:type" content="image/png" data-seo="true" />
    <meta property="og:image:width" content="1200" data-seo="true" />
    <meta property="og:image:height" content="630" data-seo="true" />
    <meta property="og:image:alt" content="Crossa native client runtime for Android and iOS" data-seo="true" />
    <meta name="twitter:card" content="summary_large_image" data-seo="true" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" data-seo="true" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" data-seo="true" />
    <meta name="twitter:image" content="${image}" data-seo="true" />
    <meta name="twitter:image:alt" content="Crossa native client runtime for Android and iOS" data-seo="true" />
    <link rel="canonical" href="${url}" data-seo="true" />
    <link rel="alternate" hreflang="en" href="${url}" data-seo="true" />
    <link rel="alternate" hreflang="x-default" href="${url}" data-seo="true" />
    <script id="crossa-structured-data" type="application/ld+json">${JSON.stringify(schema(page)).replaceAll("<", "\\u003c")}</script>`;
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/\s*<(?:meta|link)[^>]*data-seo="true"[^>]*>/g, "")
    .replace(/\s*<script id="crossa-structured-data"[\s\S]*?<\/script>/g, "")
    .replace("</head>", `    ${head}\n  </head>`);
}

for (const page of pages) {
  const output = page.path === "/" ? join(dist, "index.html") : join(dist, page.path.slice(1), "index.html");
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, render(page));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${pages.map((page) => `  <url><loc>${escapeXml(absolute(page.path))}</loc>${modified ? `<lastmod>${modified}</lastmod>` : ""}${page.path === "/" ? `<image:image><image:loc>${escapeXml(`${origin}/brand/og-crossa.png`)}</image:loc><image:title>Crossa native client runtime</image:title></image:image>` : ""}</url>`).join("\n")}\n</urlset>\n`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);
writeFileSync(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
writeFileSync(join(dist, "llms.txt"), readFileSync(join(root, "public/llms.txt"), "utf8").replaceAll("](/", `](${origin}/`));
process.stdout.write(`Generated SEO metadata for ${pages.length} routes at ${origin}.\n`);
