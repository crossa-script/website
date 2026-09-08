import { createBrowserRouter } from "react-router";
import { RouteLoading } from "../components/ui/RouteLoading";

export const router = createBrowserRouter([
  {
    path: "/",
    HydrateFallback: RouteLoading,
    lazy: () => import("../routes/layout/route"),
    children: [
      { index: true, lazy: () => import("../routes/home/route") },
      { path: "docs/*", lazy: () => import("../routes/docs/route") },
      { path: "benchmarks", lazy: () => import("../routes/benchmarks/route") },
      { path: "versions", lazy: () => import("../routes/versions/route") },
      { path: "repositories/:repository?", lazy: () => import("../routes/repositories/route") },
      { path: "examples", lazy: () => import("../routes/examples/route") },
      { path: "*", lazy: () => import("../routes/not-found/route") }
    ]
  }
]);
