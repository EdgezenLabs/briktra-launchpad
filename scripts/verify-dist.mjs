// Fails the build when dist/ would publish the retired /app bundle, lose the
// /app redirect, send visitors or requests anywhere but production, answer a
// sitemap page with 404, or ship a page that search engines would misread.
// Run after scripts/write-route-pages.mjs.
//   node scripts/verify-dist.mjs dist            (production)
//   node scripts/verify-dist.mjs dist-qa qa      (QA build)
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dist = process.argv[2] ?? "dist";
const mode = process.argv[3] ?? "production";
const expected =
  mode === "qa"
    ? { app: "https://qa-rehearsal.briktra-app.pages.dev", api: "https://qa-api.briktra.com" }
    : { app: "https://app.briktra.com", api: "https://api.briktra.com" };
const forbidden =
  mode === "qa"
    ? ["https://app.briktra.com", "https://api.briktra.com", "localhost:", "execute-api"]
    : ["qa-api.briktra.com", "qa-rehearsal", "pages.dev", "localhost:", "127.0.0.1", "execute-api"];
// React Router carries a bare http://localhost fallback; a dev origin has a port.
const failures = [];

const indexPath = join(dist, "index.html");
if (!existsSync(indexPath)) failures.push("index.html is missing");
if (existsSync(join(dist, "app"))) failures.push("dist/app exists; the old Flutter bundle must not be published");
if (!existsSync(join(dist, "404.html"))) failures.push("404.html is missing");

const read = (file) => (existsSync(file) ? readFileSync(file, "utf8") : "");
const indexHtml = read(indexPath);

/** Every HTML page we publish must keep the /app redirect, the CSP and real origins. */
function checkShell(name, html) {
  if (!html.includes(`'${expected.app}' + rest`)) failures.push(`${name} does not redirect /app/* to ${expected.app}`);
  if (!new RegExp(`connect-src[^;]*${expected.api.replace(/[.]/g, "\\.")}`).test(html)) {
    failures.push(`${name}: the content security policy does not allow ${expected.api}`);
  }
  if (html.includes("__BRIKTRA_")) failures.push(`${name} still has an unreplaced __BRIKTRA_ placeholder`);
  if (html.includes("<!--seo-head-->")) failures.push(`${name} was not prerendered (the head marker is still there)`);
  for (const text of forbidden) {
    if (html.includes(text)) failures.push(`${name} in the ${mode} build contains "${text}"`);
  }
}

const assetsDir = join(dist, "assets");
const js = existsSync(assetsDir)
  ? readdirSync(assetsDir).filter((f) => f.endsWith(".js")).map((f) => read(join(assetsDir, f))).join("\n")
  : "";
for (const origin of [expected.app, expected.api]) {
  if (!js.includes(origin)) failures.push(`${origin} is not in the bundle`);
}
for (const text of forbidden) {
  if (js.includes(text)) failures.push(`the ${mode} bundle contains "${text}"`);
}
if (js.includes("/app/index.html")) failures.push("the bundle still links to /app/index.html");

const count = (html, re) => (html.match(re) ?? []).length;
const sitemapPath = join(dist, "sitemap.xml");
const routes = existsSync(sitemapPath)
  ? [...read(sitemapPath).matchAll(/<loc>\s*https:\/\/briktra\.com(\/[^<\s]*)\s*<\/loc>/g)].map(
      (m) => m[1].replace(/\/+$/, "") || "/",
    )
  : [];
if (routes.length === 0) failures.push("sitemap.xml lists no pages");
const titles = new Map();
for (const route of routes) {
  const file = route === "/" ? "index.html" : `${route.slice(1)}.html`;
  const html = read(join(dist, file));
  if (!html) {
    failures.push(`${route} has no ${file}, so a direct visit would return 404`);
    continue;
  }
  checkShell(file, html);
  const canonical = route === "/" ? "https://briktra.com/" : `https://briktra.com${route}`;
  if (count(html, /rel="canonical"/g) !== 1 || !html.includes(`rel="canonical" href="${canonical}"`)) {
    failures.push(`${file} must have exactly one canonical, ${canonical}`);
  }
  if (count(html, /<title/g) !== 1) failures.push(`${file} must have exactly one <title>`);
  if (count(html, /name="description"/g) !== 1) failures.push(`${file} must have exactly one meta description`);
  if (count(html, /<h1[\s>]/g) !== 1) failures.push(`${file} must have exactly one <h1>`);
  if (html.includes('<div id="root"></div>')) failures.push(`${file} has no prerendered content`);
  if (/noindex/.test(html)) failures.push(`${file} is in the sitemap but asks not to be indexed`);
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1];
  if (title && titles.has(title)) failures.push(`${file} has the same title as ${titles.get(title)}`);
  if (title) titles.set(title, file);
}
checkShell("404.html", read(join(dist, "404.html")));

if (failures.length) {
  for (const f of failures) console.error(`verify-dist: ${f}`);
  process.exit(1);
}
console.log(`verify-dist: ${mode} ok (${routes.length} pages)`);
