import { Menu, Search, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { lazy, Suspense, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { DocumentMetadata } from "../../app/metadata";
import { Logo } from "../brand/Logo";
import { GitHubMark } from "../ui/GitHubMark";

const CommandMenu = lazy(() => import("../../features/command-menu/CommandMenu").then((module) => ({ default: module.CommandMenu })));

const navigation = [
  ["Product", "/#product"], ["Docs", "/docs"], ["Examples", "/examples"], ["Benchmarks", "/benchmarks"], ["Repositories", "/repositories"]
] as const;

export function SiteShell(): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <>
      <DocumentMetadata />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <div className="shell header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navigation.map(([label, href]) => href.includes("#") ? <a key={href} href={href}>{label}</a> : <NavLink key={href} to={href}>{label}</NavLink>)}
          </nav>
          <div className="header-actions">
            <button className="search-trigger" type="button" onClick={() => setSearchOpen(true)} aria-label="Search documentation"><Search size={16} /><span>Search</span><kbd>⌘K</kbd></button>
            <a className="github-link" href="https://github.com/crossa-script/Crossa" target="_blank" rel="noreferrer"><GitHubMark size={17} /><span>GitHub</span></a>
            <Link className="button button--primary header-cta" to="/docs/getting-started">Get started</Link>
            <button className="icon-button mobile-menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && <motion.nav onClick={() => setMenuOpen(false)} onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }} className="mobile-nav" aria-label="Mobile navigation" initial={reduceMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}>
            {navigation.map(([label, href]) => href.includes("#") ? <a key={href} href={href}>{label}</a> : <NavLink key={href} to={href}>{label}</NavLink>)}
            <Link to="/docs/getting-started">Get started</Link>
          </motion.nav>}
        </AnimatePresence>
      </header>
      <main id="main-content"><Outlet /></main>
      <footer className="site-footer">
        <div className="shell footer-pipeline">.cra → Crossa → Android + iOS</div><div className="shell footer-grid"><div><Logo /><p>One language, one native runtime, Android and iOS APIs from shared semantics.</p></div><div><strong>Explore</strong><Link to="/docs">Documentation</Link><Link to="/docs/architecture">Architecture</Link><Link to="/versions">Versions</Link><Link to="/benchmarks">Benchmarks</Link></div><div><strong>Ecosystem</strong><Link to="/repositories">Repositories</Link><Link to="/docs/android">Android</Link><Link to="/docs/ios">iOS</Link></div><a className="footer-github" href="https://github.com/crossa-script/Crossa" target="_blank" rel="noreferrer"><GitHubMark size={18} /> Crossa on GitHub</a></div>
      </footer>
      <Suspense fallback={null}><CommandMenu open={searchOpen} onOpen={() => setSearchOpen(true)} onClose={() => setSearchOpen(false)} /></Suspense>
    </>
  );
}
