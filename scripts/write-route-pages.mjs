// GitHub Pages answers an unknown path with 404.html, so a direct visit to
// /pricing rendered the page but with HTTP 404, which search engines and
// policy-URL checks (Play Console, payment gateways) treat as missing. Pages
// serves /pricing from pricing.html with 200, so each sitemap route gets a
// copy of the app shell under its own name.
//   node scripts/write-route-pages.mjs dist
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

function sitemapRoutes(xml) {
  return [...xml.matchAll(/<loc>\s*https:\/\/briktra\.com(\/[^<\s]*)\s*<\/loc>/g)]
    .map((m) => m[1].replace(/\/+$/, ""))
    .filter((p) => p !== "");
}

const dist = process.argv[2] ?? "dist";
const routes = sitemapRoutes(readFileSync(join(dist, "sitemap.xml"), "utf8"));
for (const route of routes) {
  const target = join(dist, `${route.slice(1)}.html`);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(dist, "index.html"), target);
}
console.log(`write-route-pages: ${routes.length} route pages`);
