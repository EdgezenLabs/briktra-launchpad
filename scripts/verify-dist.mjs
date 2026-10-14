// Fails the build when dist/ would publish the retired /app bundle, lose the
// /app redirect, or send visitors or requests anywhere but production.
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

const indexHtml = existsSync(indexPath) ? readFileSync(indexPath, "utf8") : "";
if (!indexHtml.includes(`'${expected.app}' + rest`)) failures.push(`index.html does not redirect /app/* to ${expected.app}`);
if (!new RegExp(`connect-src[^;]*${expected.api.replace(/[.]/g, "\\.")}`).test(indexHtml)) {
  failures.push(`the content security policy does not allow ${expected.api}`);
}
if (indexHtml.includes("__BRIKTRA_")) failures.push("index.html still has an unreplaced __BRIKTRA_ placeholder");

const assetsDir = join(dist, "assets");
const js = existsSync(assetsDir)
  ? readdirSync(assetsDir).filter((f) => f.endsWith(".js")).map((f) => readFileSync(join(assetsDir, f), "utf8")).join("\n")
  : "";
for (const origin of [expected.app, expected.api]) {
  if (!js.includes(origin)) failures.push(`${origin} is not in the bundle`);
}
for (const text of forbidden) {
  if (js.includes(text) || indexHtml.includes(text)) failures.push(`the ${mode} build contains "${text}"`);
}
if (js.includes("/app/index.html")) failures.push("the bundle still links to /app/index.html");

if (failures.length) {
  for (const f of failures) console.error(`verify-dist: ${f}`);
  process.exit(1);
}
console.log(`verify-dist: ${mode} ok`);
