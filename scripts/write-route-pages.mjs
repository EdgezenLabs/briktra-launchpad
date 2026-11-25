// Writes a complete HTML page for every sitemap route, after `vite build`.
//
// GitHub Pages serves /pricing from pricing.html with HTTP 200 (an unknown
// path gets 404.html with HTTP 404, which search engines and policy-URL
// checks treat as missing). Each page is rendered at build time with its own
// title, description, canonical, Open Graph tags, structured data and full
// text, so crawlers and link previews see the page without running
// JavaScript; the browser then hydrates it. 404.html is the empty app shell
// with the not-found head, for any other address.
//
//   node scripts/write-route-pages.mjs dist              (production)
//   node scripts/write-route-pages.mjs dist-qa qa        (QA build)
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const dist = process.argv[2] ?? "dist";
const mode = process.argv[3] ?? "production";
const ROOT_EMPTY = '<div id="root"></div>';
const HEAD_MARKER = "<!--seo-head-->";

function sitemapRoutes(xml) {
  return [...xml.matchAll(/<loc>\s*https:\/\/briktra\.com(\/[^<\s]*)\s*<\/loc>/g)].map(
    (m) => m[1].replace(/\/+$/, "") || "/",
  );
}

const shell = readFileSync(join(dist, "index.html"), "utf8");
if (!shell.includes(ROOT_EMPTY) || !shell.includes(HEAD_MARKER)) {
  throw new Error(`${dist}/index.html is not a fresh app shell; run vite build first`);
}

// Server build of src/entry-server.tsx, inside node_modules so its imports
// of React and the other packages resolve.
const ssrOut = resolve("node_modules/.cache/briktra-prerender");
rmSync(ssrOut, { recursive: true, force: true });
await build({
  mode,
  logLevel: "warn",
  build: { ssr: "src/entry-server.tsx", outDir: ssrOut, emptyOutDir: true, copyPublicDir: false },
});
const { render } = await import(pathToFileURL(join(ssrOut, "entry-server.js")).href);

// Preload the two latin font files every page uses, so headings and text
// paint in the brand fonts without a visible swap.
const fontPreloads = readdirSync(join(dist, "assets"))
  .filter((f) => /^(inter|plus-jakarta-sans)-latin-wght-normal-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`);
if (fontPreloads.length !== 2) throw new Error(`expected 2 latin font files in ${dist}/assets, found ${fontPreloads.length}`);

const page = ({ html, head }, withBody) =>
  shell
    .replace(HEAD_MARKER, [head, ...fontPreloads].join("\n    "))
    .replace(ROOT_EMPTY, withBody ? `<div id="root">${html}</div>` : ROOT_EMPTY);

const routes = sitemapRoutes(readFileSync(join(dist, "sitemap.xml"), "utf8"));
if (!routes.includes("/")) routes.unshift("/");
for (const route of routes) {
  const rendered = await render(route);
  const target = route === "/" ? join(dist, "index.html") : join(dist, `${route.slice(1)}.html`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, page(rendered, true));
  // /delete-account used to be a folder page (delete-account/index.html), and
  // that address is registered with the Play Store; keep it serving the same page.
  if (route === "/delete-account") {
    mkdirSync(join(dist, "delete-account"), { recursive: true });
    writeFileSync(join(dist, "delete-account", "index.html"), page(rendered, true));
  }
}

// Old addresses still linked from elsewhere. Pages cannot send a 301, so
// each gets a page whose instant meta refresh and canonical point at the new
// address; search engines treat that as a permanent redirect. Keep in step
// with the <Navigate> routes in src/App.tsx.
const REDIRECTS = { "/about-us": "/about", "/explore": "/features" };
for (const [from, to] of Object.entries(REDIRECTS)) {
  const url = `https://briktra.com${to}`;
  const head = [
    `<title>Moved to ${url}</title>`,
    `<meta name="robots" content="noindex, follow" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta http-equiv="refresh" content="0; url=${to}" />`,
  ].join("\n    ");
  writeFileSync(join(dist, `${from.slice(1)}.html`), page({ html: "", head }, false));
}

// Unknown addresses: the shell with the not-found title and noindex; the
// browser renders the not-found page.
writeFileSync(join(dist, "404.html"), page(await render("/this-page-does-not-exist"), false));

rmSync(ssrOut, { recursive: true, force: true });
if (!existsSync(join(dist, "404.html"))) throw new Error("404.html was not written");
console.log(`write-route-pages: ${routes.length} prerendered pages + 404.html (${mode})`);
