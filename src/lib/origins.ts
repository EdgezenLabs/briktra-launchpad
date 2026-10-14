// Where the site sends people (the app) and where the contact form posts
// (the API). Shared by vite.config.ts, which validates them at build time,
// and by app-links.ts, which builds every app link from them.

export const PRODUCTION_ORIGINS = {
  app: "https://app.briktra.com",
  api: "https://api.briktra.com",
} as const;

const NON_PRODUCTION_HOST =
  /(^|[.-])(qa|dev|test|staging|preview|rehearsal)([.-]|$)|localhost|^127\.|\.pages\.dev$|execute-api/i;

/** Why `value` cannot be used as an origin in `mode`, or null if it can. */
export function originProblem(value: string | undefined, mode: string): string | null {
  if (!value) return "is not set";
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return "is not a URL";
  }
  if (url.origin !== value.replace(/\/$/, "")) {
    return "must be a bare origin, without a path, query or fragment";
  }
  if (mode === "production") {
    if (url.protocol !== "https:") return "must use https";
    if (NON_PRODUCTION_HOST.test(url.hostname)) return "names a QA, preview or local host";
  } else if (mode === "qa") {
    if (url.protocol !== "https:") return "must use https";
    if (url.origin === PRODUCTION_ORIGINS.app || url.origin === PRODUCTION_ORIGINS.api) {
      return "is a production origin";
    }
  }
  return null;
}
