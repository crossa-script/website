import { Link } from "react-router";
import { PageTransition } from "../../components/ui/PageTransition";
import { Visual } from "../../features/product/Visual";

export function Component(): React.JSX.Element {
  return <PageTransition className="product-page"><section className="product-wide product-missing"><p className="chapter">404 / unresolved route</p><Visual name="broken" eager /><h1>This route<br />didn’t compile.</h1><p>The page you’re looking for isn’t in this source graph.</p><div className="product-actions"><Link className="button button--primary" to="/">Home</Link><Link className="product-link" to="/docs">Documentation ↗</Link><Link className="product-link" to="/examples">Examples ↗</Link></div></section></PageTransition>;
}
