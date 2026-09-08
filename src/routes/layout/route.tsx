import { SiteShell } from "../../components/layout/SiteShell";
import { Link, useRouteError } from "react-router";

export function Component(): React.JSX.Element { return <SiteShell />; }

export function HydrateFallback(): React.JSX.Element {
  return <div className="route-loading" role="status" aria-label="Loading Crossa page"><span /><span /><span /></div>;
}

export function ErrorBoundary(): React.JSX.Element {
  const error = useRouteError();
  const message = error instanceof Error ? error.message : "The route could not be loaded.";
  return <main className="not-found shell"><p className="eyebrow">Route error</p><div className="not-found__glyph">!</div><h1>Crossa could not load this route.</h1><p>{message}</p><Link className="button button--primary" to="/">Back home</Link></main>;
}
