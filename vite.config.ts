import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { PRODUCTION_ORIGINS, originProblem } from "./src/lib/origins";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Production defaults to the real origins; every other mode (development,
  // qa) must name its own in .env.<mode>, so nothing silently points at
  // production or at a developer's machine.
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const fallback = mode === "production" ? PRODUCTION_ORIGINS : { app: undefined, api: undefined };
  const appOrigin = (env.VITE_APP_URL || fallback.app || "").replace(/\/$/, "");
  const apiOrigin = (env.VITE_API_URL || fallback.api || "").replace(/\/$/, "");
  const problems = [
    ["VITE_APP_URL", appOrigin],
    ["VITE_API_URL", apiOrigin],
  ]
    .map(([name, value]) => [name, originProblem(value || undefined, mode)])
    .filter(([, problem]) => problem)
    .map(([name, problem]) => `${name} ${problem} (mode "${mode}")`);
  if (problems.length) throw new Error(`Invalid site origins:\n  ${problems.join("\n  ")}`);

  const originsInHtml: Plugin = {
    name: "briktra-origins-in-html",
    transformIndexHtml: (html) =>
      html.replaceAll("__BRIKTRA_APP_ORIGIN__", appOrigin).replaceAll("__BRIKTRA_API_ORIGIN__", apiOrigin),
  };

  return {
    // Absolute base -- this site is served from the domain root via a
    // custom domain (CNAME: briktra.com), not a GitHub Pages project
    // subpath. The deploy workflow copies dist/index.html to
    // dist/404.html so GitHub Pages serves the SPA shell for any
    // unmatched path (e.g. /pricing on a hard refresh); with a relative
    // base ("./") the browser then resolves asset URLs relative to that
    // deep path (/pricing/assets/... instead of /assets/...), 404ing
    // every JS/CSS asset and leaving a blank page. Root-absolute base
    // keeps asset URLs correct regardless of which path served the shell.
    base: "/",

    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },

    define: {
      "import.meta.env.VITE_APP_URL": JSON.stringify(appOrigin),
      "import.meta.env.VITE_API_URL": JSON.stringify(apiOrigin),
    },

    plugins: [react(), originsInHtml, mode === "development" && componentTagger()].filter(Boolean),

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    build: {
      outDir: "dist",
      sourcemap: false,
    },
  };
});
