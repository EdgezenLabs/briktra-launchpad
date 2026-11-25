import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
// Fonts are served from this site (no Google Fonts request on first load).
// Only the subsets a page uses download: latin, plus latin-ext for ₹.
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "./index.css";

// Sitemap pages arrive prerendered (scripts/write-route-pages.mjs): hydrate
// that HTML. Any other address gets the empty shell (404.html): render fresh.
const root = document.getElementById("root")!;
if (root.hasChildNodes()) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}
