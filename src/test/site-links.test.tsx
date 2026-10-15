import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import App from "@/App";
import { COMPANY, FOOTER_LINKS, NAV_LINKS, SITE } from "@/lib/site-config";

const PAGES = [
  "/", "/features", "/pricing", "/about", "/contact", "/faq", "/explore",
  "/privacy-policy", "/terms", "/refund-policy", "/cancellation-policy",
  "/shipping-delivery-policy", "/cookie-policy", "/security-policy",
  "/data-deletion-policy", "/delete-account", "/acceptable-use-policy",
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
  for (let i = 0; i < 5; i++) await act(() => new Promise((r) => setTimeout(r, 20)));
}

function anchors() {
  return Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]")).map((a) => ({
    a,
    href: a.getAttribute("href")!,
    label: a.textContent?.trim() || a.getAttribute("aria-label") || "",
  }));
}

function isNotFound() {
  return screen.queryByRole("heading", { level: 1, name: "Page Not Found" }) !== null;
}

describe("every page renders and its links are sound", () => {
  for (const page of PAGES) {
    it(`${page}`, async () => {
      await renderAt(page);
      expect(isNotFound(), `${page} rendered the 404 page`).toBe(false);

      for (const { a, href, label } of anchors()) {
        if (href.startsWith("/")) {
          const path = href.split(/[?#]/)[0] || "/";
          expect(PAGES, `"${label}" -> ${href} is not a site page`).toContain(path);
        }
        if (a.getAttribute("target") === "_blank") {
          const rel = (a.getAttribute("rel") ?? "").split(/\s+/);
          expect(rel, `"${label}" opens a new tab without noopener`).toContain("noopener");
          expect(href, `"${label}" opens a new tab to a non-https URL`).toMatch(/^https:\/\//);
        }
        if (href.startsWith("mailto:")) expect(href).toBe(`mailto:${COMPANY.email}`);
        if (href.startsWith("tel:")) expect(href).toBe(`tel:${COMPANY.phoneTel}`);
        expect(href, `"${label}" uses insecure http`).not.toMatch(/^http:\/\//);
        expect(href, `"${label}" has an empty or script href`).not.toMatch(/^(#?$|javascript:)/i);
      }
    });
  }
});

describe("navigation and legal reachability", () => {
  it("unknown addresses show the 404 page", async () => {
    await renderAt("/no-such-page");
    expect(isNotFound()).toBe(true);
  });

  it("the old /about-us address lands on About", async () => {
    await renderAt("/about-us");
    expect(window.location.pathname).toBe("/about");
    expect(isNotFound()).toBe(false);
  });

  it("every configured nav and footer target is a real page", () => {
    const targets = [
      ...NAV_LINKS.map((l) => l.href),
      ...Object.values(FOOTER_LINKS).flatMap((group) => group.map((l) => l.href)),
    ];
    for (const href of targets) expect(PAGES).toContain(href);
  });

  // The deploy writes a page per sitemap entry; a page missing here would answer 404.
  // /delete-account is a static page under public/ and is not listed.
  it("the sitemap lists every page and nothing else", () => {
    const xml = readFileSync(resolve(__dirname, "../../public/sitemap.xml"), "utf8");
    const listed = [...xml.matchAll(/<loc>https:\/\/briktra\.com(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
    expect([...listed].sort()).toEqual(PAGES.filter((p) => p !== "/delete-account").sort());
  });

  // Payment-gateway and Play Store review require every policy one click from any page.
  for (const page of ["/", "/pricing", "/contact", "/terms"]) {
    it(`${page} footer links to every legal page and the contact details`, async () => {
      await renderAt(page);
      const footer = document.querySelector('footer[role="contentinfo"]')!;
      expect(footer, "footer").toBeTruthy();
      const hrefs = Array.from(footer.querySelectorAll("a[href]")).map((a) => a.getAttribute("href"));
      for (const { href } of FOOTER_LINKS.legal) expect(hrefs).toContain(href);
      expect(hrefs).toContain(`mailto:${COMPANY.email}`);
      expect(hrefs).toContain(`tel:${COMPANY.phoneTel}`);
    });
  }

  it("Play Store buttons point at the Briktra listing", async () => {
    await renderAt("/");
    const play = anchors().filter(({ href }) => href.includes("play.google.com"));
    expect(play.length).toBeGreaterThan(0);
    for (const { href } of play) expect(href).toBe(SITE.playStoreUrl);
    expect(new URL(SITE.playStoreUrl).searchParams.get("id")).toBe("com.briktra.app");
  });
});
