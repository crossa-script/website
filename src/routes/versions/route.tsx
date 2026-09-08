import { ArrowRight, Check, CircleDot, Fingerprint, GitCommitHorizontal, PackageCheck, ShieldCheck, Tags } from "lucide-react";
import { Link } from "react-router";
import { PageTransition } from "../../components/ui/PageTransition";

const identityRows = [
  ["CLI version", "crossa --version", "The executable version used to check and generate a project."],
  ["Source commit", "8c362e1", "The verified Crossa source revision behind the documented baseline."],
  ["Artifact digest", "SHA-256", "The release artifact manifest records a digest for reproducible handoff."],
] as const;

const scopeItems = [
  "Typed .cra source with explicit semantic validation",
  "C++ frontend, typed IR, and native request runtime",
  "Android Release AAR and iOS Release XCFramework outputs",
  "Artifact manifests that preserve version and source identity",
] as const;

export function Component(): React.JSX.Element {
  return <PageTransition className="versions-page">
    <section className="shell page-intro versions-intro">
      <p className="eyebrow"><Tags size={14} /> Release channel</p>
      <h1>Versioning that keeps every artifact traceable.</h1>
      <p>Crossa treats a release as more than a label. The CLI version, source revision, generated platform artifact, and digest travel together so teams can verify what they shipped.</p>
      <div className="version-current"><span className="version-current__mark"><CircleDot size={20} /></span><div><span className="version-current__label">Current documented baseline</span><strong>Crossa V0</strong><span>Compiler and native runtime foundation</span></div><span className="version-status"><Check size={14} /> Current</span></div>
    </section>

    <section className="shell version-layout">
      <div className="version-main">
        <div className="version-section-heading"><p className="eyebrow"><Fingerprint size={14} /> Version identity</p><h2>One identity across source and output.</h2><p>Use these fields when comparing a local build, a generated project, or a retained benchmark observation.</p></div>
        <div className="version-identity-table">{identityRows.map(([label, value, description]) => <div className="version-identity-row" key={label}><div className="version-identity-row__icon">{label === "CLI version" ? <PackageCheck size={18} /> : label === "Source commit" ? <GitCommitHorizontal size={18} /> : <ShieldCheck size={18} />}</div><div><strong>{label}</strong><code>{value}</code><p>{description}</p></div></div>)}</div>
        <div className="version-section-heading version-section-heading--scope"><p className="eyebrow"><Check size={14} /> V0 scope</p><h2>The current line is deliberately small.</h2><p>V0 documents the pieces that are implemented and verifiable today. It does not imply compatibility beyond the stated compiler, runtime, and generated artifact contract.</p></div>
        <ul className="version-scope-list">{scopeItems.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul>
      </div>
      <aside className="version-aside"><div className="version-aside__card"><span className="eyebrow">Release notes</span><h2>Read the contract before upgrading.</h2><p>The documentation describes supported syntax, runtime ownership, platform packaging, and compatibility boundaries for this baseline.</p><Link className="text-link" to="/docs">Open documentation <ArrowRight size={16} /></Link></div><div className="version-aside__card version-aside__card--muted"><span className="eyebrow">Artifact check</span><p>Generated projects print their Crossa identity and write it into the artifact manifest for downstream verification.</p><Link className="text-link" to="/docs/cli/commands">View CLI commands <ArrowRight size={16} /></Link></div></aside>
    </section>
  </PageTransition>;
}
