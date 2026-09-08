import { useEffect } from "react";
import { useLocation } from "react-router";

const routeMetadata: Readonly<Record<string, { readonly title: string; readonly description: string }>> = {
  "/": { title: "Crossa — Native client infrastructure", description: "Compile .cra source into native Android and iOS APIs." },
  "/benchmarks": { title: "Benchmarks — Crossa", description: "Retained Crossa development benchmark observations." },
  "/repositories": { title: "Repositories — Crossa", description: "Explore the Crossa core and example repositories." },
  "/examples": { title: "Examples — Crossa", description: "Verified .cra, Android, and iOS examples." }
};

export function DocumentMetadata(): null {
  const location = useLocation();

  useEffect(() => {
    const metadata = routeMetadata[location.pathname] ?? (location.pathname.startsWith("/docs") ? {
      title: "Documentation — Crossa",
      description: "Verified documentation for the Crossa compiler and native runtime."
    } : {
      title: "Not found — Crossa",
      description: "The requested Crossa page does not exist."
    });
    document.title = metadata.title;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", metadata.description);
  }, [location.pathname]);

  return null;
}
