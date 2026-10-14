import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import App from "@/App";
import { APP_ORIGIN, appLinks } from "@/lib/app-links";
import { PRODUCTION_ORIGINS, originProblem } from "@/lib/origins";

// Routes the Flutter app actually serves for these links (lib/routes.dart).
const APP_PATHS = new Set(["/login", "/register"]);
const PLAN_IDS = new Set(["starter", "basic", "premium", "max"]);

const ROUTES = [
  "/", "/features", "/pricing", "/about", "/contact", "/faq", "/explore",
  "/privacy-policy", "/terms", "/refund-policy", "/cancellation-policy",
  "/shipping-delivery-policy", "/cookie-policy", "/security-policy",
  "/data-deletion-policy", "/delete-account", "/acceptable-use-policy", "/no-such-page",
];

beforeAll(() => {
  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }
  Object.assign(window, { IntersectionObserver: NoopObserver, ResizeObserver: NoopObserver });
  window.scrollTo = () => {};
});

afterEach(cleanup);

async function renderAt(path: string) {
  window.history.pushState({}, "", path);
  render(<App />);
  // Lazy routes resolve on the next ticks.
  for (let i = 0; i < 5; i++) await act(() => new Promise((r) => setTimeout(r, 20)));
}

function appAnchors(root: ParentNode = document) {
  return Array.from(root.querySelectorAll<HTMLAnchorElement>("a[href]")).filter((a) =>
    a.getAttribute("href")!.startsWith(APP_ORIGIN),
  );
}

describe("every page's links", () => {
  for (const route of ROUTES) {
    it(`${route} links only to real app routes, never /app/, QA or local hosts`, async () => {
      await renderAt(route);
      for (const a of Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))) {
        const href = a.getAttribute("href")!;
        expect(href, `"${a.textContent?.trim()}"`).not.toMatch(/^\/app(\/|$)/);
        expect(href).not.toMatch(/localhost|127\.0\.0\.1|qa-api|qa-rehearsal|pages\.dev|execute-api/);
        if (!href.startsWith(APP_ORIGIN)) continue;
        const url = new URL(href);
        expect(APP_PATHS.has(url.pathname), `${href} is not an app route`).toBe(true);
        for (const key of url.searchParams.keys()) expect(["plan", "billing"]).toContain(key);
        if (url.searchParams.has("plan")) {
          expect(url.pathname).toBe("/register");
          expect(PLAN_IDS.has(url.searchParams.get("plan")!)).toBe(true);
          expect(["monthly", "annual"]).toContain(url.searchParams.get("billing"));
        }
        // Same tab: the app is the continuation of the site, not a popup.
        expect(a.getAttribute("target")).toBeNull();
      }
    });
  }
});

describe("labelled calls to action", () => {
  it("header: Login goes to login, Start Free Trial to registration", async () => {
    await renderAt("/");
    const header = document.querySelector("header")!;
    expect(within(header).getByRole("link", { name: "Login to Briktra" })).toHaveAttribute("href", appLinks.login);
    expect(within(header).getByRole("link", { name: "Start Free Trial" })).toHaveAttribute("href", appLinks.freeTrial);
  });

  it("mobile menu offers the same two actions", async () => {
    await renderAt("/");
    const header = document.querySelector("header")!;
    const toggle = within(header).getAllByRole("button").find((b) => /menu/i.test(b.getAttribute("aria-label") ?? ""));
    expect(toggle, "mobile menu button").toBeTruthy();
    fireEvent.click(toggle!);
    expect(within(header).getAllByRole("link", { name: "Login to Briktra" })).toHaveLength(2);
    for (const a of within(header).getAllByRole("link", { name: "Login to Briktra" })) {
      expect(a).toHaveAttribute("href", appLinks.login);
    }
    for (const a of within(header).getAllByRole("link", { name: "Start Free Trial" })) {
      expect(a).toHaveAttribute("href", appLinks.freeTrial);
    }
  });

  it("homepage hero and closing band: trial to registration, login to login", async () => {
    await renderAt("/");
    const main = document.querySelector("main") ?? document.body;
    const trial = within(main as HTMLElement).getAllByRole("link", { name: /Start Free Trial/ });
    expect(trial.length).toBeGreaterThanOrEqual(2);
    for (const a of trial) expect(a).toHaveAttribute("href", appLinks.freeTrial);
    for (const a of within(main as HTMLElement).getAllByRole("link", { name: "Login to Briktra" })) {
      expect(a).toHaveAttribute("href", appLinks.login);
    }
  });

  it("about page trial button goes to registration", async () => {
    await renderAt("/about");
    const links = screen.getAllByRole("link", { name: /Start Free Trial/ });
    expect(links.every((a) => a.getAttribute("href") === appLinks.freeTrial)).toBe(true);
  });

  it("explore page login button goes to login", async () => {
    await renderAt("/explore");
    const links = screen.getAllByRole("link", { name: "Login to Briktra" });
    expect(links.every((a) => a.getAttribute("href") === appLinks.login)).toBe(true);
  });

  it("each pricing card carries its own plan and the chosen billing cycle", async () => {
    await renderAt("/pricing");
    const plans = ["Starter", "Basic", "Premium", "Max"];
    for (const name of plans) {
      expect(screen.getByRole("link", { name: `Get started with ${name}, billed monthly` })).toHaveAttribute(
        "href",
        appLinks.plan(name.toLowerCase() as "starter", "monthly"),
      );
    }
    fireEvent.click(screen.getByRole("button", { name: /Annual/ }));
    for (const name of plans) {
      expect(screen.getByRole("link", { name: `Get started with ${name}, billed annually` })).toHaveAttribute(
        "href",
        `${APP_ORIGIN}/register?plan=${name.toLowerCase()}&billing=annual`,
      );
    }
    // Prices are shown, never sent: the app takes them from the API.
    for (const a of appAnchors()) expect(a.getAttribute("href")).not.toMatch(/price|amount/);
  });
});

describe("origin rules", () => {
  it("tests run against the production origins", () => {
    expect(APP_ORIGIN).toBe(PRODUCTION_ORIGINS.app);
  });

  it("production refuses QA, preview, local, http and non-origin values", () => {
    for (const bad of [
      "https://qa-api.briktra.com",
      "https://qa-rehearsal.briktra-app.pages.dev",
      "http://app.briktra.com",
      "http://localhost:8080",
      "https://b05vnm4akk.execute-api.ap-south-1.amazonaws.com",
      "https://app.briktra.com/login",
      "https://app.briktra.com?x=1",
      "not a url",
      undefined,
    ]) {
      expect(originProblem(bad, "production"), String(bad)).not.toBeNull();
    }
    expect(originProblem("https://app.briktra.com", "production")).toBeNull();
    expect(originProblem("https://api.briktra.com", "production")).toBeNull();
  });

  it("qa refuses production origins", () => {
    expect(originProblem(PRODUCTION_ORIGINS.app, "qa")).not.toBeNull();
    expect(originProblem(PRODUCTION_ORIGINS.api, "qa")).not.toBeNull();
    expect(originProblem("https://qa-api.briktra.com", "qa")).toBeNull();
  });
});
