// Fails the build when dist/ would publish the retired /app bundle or lose the
// links and redirect that send visitors to the product app on app.briktra.com.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dist = process.argv[2] ?? "dist";
const failures = [];

if (!existsSync(join(dist, "index.html"))) failures.push("dist/index.html is missing");
if (existsSync(join(dist, "app"))) failures.push("dist/app exists; the old Flutter bundle must not be published");

const indexHtml = existsSync(join(dist, "index.html")) ? readFileSync(join(dist, "index.html"), "utf8") : "";
if (!indexHtml.includes("'https://app.briktra.com'")) {
  failures.push("index.html no longer redirects /app/* to https://app.briktra.com");
}

const assetsDir = join(dist, "assets");
const js = existsSync(assetsDir)
  ? readdirSync(assetsDir).filter((f) => f.endsWith(".js")).map((f) => readFileSync(join(assetsDir, f), "utf8")).join("\n")
  : "";
for (const required of ["https://app.briktra.com/login", "https://app.briktra.com/register"]) {
  if (!js.includes(required)) failures.push(`no link to ${required} in the bundle`);
}
if (js.includes("/app/index.html")) failures.push("the bundle still links to /app/index.html");

if (failures.length) {
  for (const f of failures) console.error(`verify-dist: ${f}`);
  process.exit(1);
}
console.log("verify-dist: ok");
