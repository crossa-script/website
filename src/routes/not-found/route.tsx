import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router";
import { PageTransition } from "../../components/ui/PageTransition";

export function Component(): React.JSX.Element { return <PageTransition><section className="not-found shell"><p className="eyebrow">404 · unresolved route</p><div className="not-found__glyph">/?</div><h1>This path is not in the Crossa build.</h1><p>Return to the public entry point or continue from the verified documentation map.</p><div><Link className="button button--primary" to="/">Back home <ArrowRight size={17} /></Link><Link className="button button--secondary" to="/docs"><Search size={17} /> Documentation</Link></div></section></PageTransition>; }
