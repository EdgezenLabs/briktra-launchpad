import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "dist",
    sourcemap: false,
  },
}));
