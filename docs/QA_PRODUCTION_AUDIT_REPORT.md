# Briktra.com — Production QA Audit Report

**Auditor role:** Principal QA Engineer (Enterprise ERP / SaaS)  
**Application under test:** https://briktra.com/  
**Product:** Briktra — Construction Project Management & ERP Platform  
**Legal entity:** EDGEZEN LABS (GSTIN 33AAMFE4969Q1ZK)  
**Hosting:** GitHub Pages  
**Audit date:** 23 July 2026  
**Scope:** Marketing website + public navigation to Flutter app (`/app/`)  
**Method:** Black-box production testing only — **no code was modified**

---

## 1. Executive Verdict

Briktra’s **homepage content quality is strong** for a construction SaaS brand: clear value proposition, pricing transparency, GST notes, Cashfree payment wording, business identity, FAQ, and trust sections are present in the live bundle.

However, the site **fails a fundamental production gate for multi-page SPAs on GitHub Pages**:

> **Direct URLs and page refreshes on every non-root route return HTTP 404 and fail to load JavaScript/CSS because assets are referenced with relative paths (`./assets/...`). Nested routes resolve assets to invalid paths such as `/features/assets/...` (HTTP 404).**

**Impact:** Privacy Policy, Terms, Refund, Contact, Pricing, Features, FAQ, and all other deep links are **broken for customers, Cashfree reviewers, SEO crawlers, and anyone opening a footer link in a new tab or refreshing**.

| Gate | Result |
|------|--------|
| Homepage usable | PASS |
| Deep-link / refresh usable | **FAIL (Critical)** |
| Cashfree legal-page accessibility | **FAIL (Critical)** |
| Mobile primary journeys from Home | PARTIAL PASS (client-side only) |
| Production quality for enterprise review | **Not ready until routing/hosting fixed** |

---

## 2. Test Environment & Method

| Item | Detail |
|------|--------|
| URLs tested | Apex `briktra.com`, `www.briktra.com`, `/app/index.html`, all sitemap routes |
| Checks | HTTP status, TTFB, asset resolution, sitemap/robots, security headers, bundle string audit, content review |
| Devices (logic / CSS / UX review) | Mobile (~375px), Tablet (~768px), Desktop (≥1280px) — based on live markup/CSS behavior and known component patterns |
| Out of scope | Authenticated Flutter ERP module functional testing, payment sandbox transaction execution, visual regression screenshots lab |

---

## 3. Application Map (As Deployed)

### 3.1 Confirmed live surfaces

| Surface | HTTP | Notes |
|---------|------|-------|
| `/` Homepage | **200** | Fully loads; primary customer entry |
| `/app/index.html` Flutter app shell | **200** | Login / trial destination |
| `/robots.txt` | **200** | Allows all; points to sitemap |
| `/sitemap.xml` | **200** | Lists 16 URLs including legal pages |
| `/404.html` | **200** | Identical SPA shell to `index.html` |
| `/briktra-favicon.svg` | **200** | Favicon OK |

### 3.2 Routes declared in live JS (and sitemap) but broken on direct access

| Route | HTTP | Asset load on direct open | Customer impact |
|-------|------|---------------------------|-----------------|
| `/features` | **404** | JS/CSS path 404 | Broken |
| `/pricing` | **404** | JS/CSS path 404 | Broken |
| `/about` | **404** | JS/CSS path 404 | Broken |
| `/contact` | **404** | JS/CSS path 404 | Broken |
| `/faq` | **404** | JS/CSS path 404 | Broken |
| `/explore` | **404** | JS/CSS path 404 | Broken |
| `/privacy-policy` | **404** | JS/CSS path 404 | **Cashfree critical** |
| `/terms` | **404** | JS/CSS path 404 | **Cashfree critical** |
| `/refund-policy` | **404** | JS/CSS path 404 | **Cashfree critical** |
| `/cancellation-policy` | **404** | JS/CSS path 404 | **Cashfree critical** |
| `/shipping-delivery-policy` | **404** | JS/CSS path 404 | Broken |
| `/cookie-policy` | **404** | JS/CSS path 404 | Broken |
| `/security-policy` | **404** | JS/CSS path 404 | Broken |
| `/data-deletion-policy` | **404** | JS/CSS path 404 | Broken |
| `/acceptable-use-policy` | **404** | JS/CSS path 404 | Broken |
| `/about-us` | **404** | JS/CSS path 404 | Broken |

**Root cause (observed):**

1. Vite `base: "./"` produces relative asset URLs (`./assets/index-….js`).
2. Opening `https://briktra.com/privacy-policy` causes the browser to request `https://briktra.com/privacy-policy/assets/…` → **404**.
3. GitHub Pages returns the SPA `404.html` shell with **status 404**, but the shell cannot execute because its scripts never load.

**Client-side nuance:** Navigating via in-app React Router **from `/` without a full reload** may appear to work because assets were already loaded from `/assets/`. Refresh or new-tab deep links fail. This is a classic “works in demo, fails in review” defect.

---

## 4. Section Scores (1 = Poor … 10 = Excellent)

| # | Section | Score | Rationale |
|---|---------|------:|-----------|
| 1 | Loading speed | **7** | Homepage HTML ~142–561 ms; app HTML ~39 ms. Main JS ~544 KB + CSS ~84 KB is heavy for a marketing site; Google Fonts add third-party latency. |
| 2 | Broken pages | **2** | Nearly all secondary/legal pages broken on direct access; only `/` and `/app` reliably load. |
| 3 | Broken navigation | **3** | Header/footer/IA are well designed, but destination URLs fail outside soft client navigation. Sitemap advertises dead links. |
| 4 | Mobile responsiveness | **6** | Layout is responsive; feature flip-cards (“Hover to reveal”) are poor on touch; long homepage scroll fatigue. |
| 5 | Tablet responsiveness | **7** | Grid systems generally adapt; pricing cards and showcases usable at mid widths. |
| 6 | Desktop responsiveness | **8** | Strong desktop composition; hero, modules, pricing readable and conversion-oriented. |
| 7 | Accessibility | **5** | Skip/focus patterns exist in product intent, but flip-card pattern, duplicate headings in a11y tree, HTTP 404 deep links, and heavy reliance on hover hurt WCAG AA readiness. |
| 8 | UI consistency | **7** | Brand orange + Space Grotesk/Inter generally coherent; Pricing section uses more hardcoded slate/orange tokens than other sections. |
| 9 | Empty states | **4** | Video “coming soon”, map placeholder, and **explicit “Placeholder testimonials”** copy undermine trust. |
| 10 | Error handling | **5** | Soft 404 UX exists in-app but is unreachable when assets fail; contact relies on mailto; no visible form failure states for networkless users. |
| 11 | Forms | **5** | Contact form depends on local email client; no server confirmation, spam protection, or ticket ID. |
| 12 | Buttons / CTAs | **8** | Clear primary “Start Free Trial” and “Login to Briktra”; pricing CTAs consistent. |
| 13 | Color consistency | **7** | Primary brand clear; some secondary palette drift (green/purple plan accents vs system tokens). |
| 14 | Fonts | **7** | Distinct display + body pairing; Inter is competent but generic for a premium construction brand. |
| 15 | Icons | **8** | Lucide iconography consistent and meaningful. |
| 16 | Animation | **5** | Some purposeful motion; flip-card hover and aggressive hover-scale reduce polish on touch devices / reduced-motion users. |
| 17 | UX quality (overall journey) | **5** | Homepage story is good; conversion/compliance journey collapses when leaving soft navigation. |

### Aggregate scores

| Metric | Score | Interpretation |
|--------|------:|----------------|
| **Overall UX Score** | **5 / 10** | Homepage experience is above average; end-to-end site journeys fail. |
| **Overall UI Score** | **7 / 10** | Visual system is professional and on-brand for construction SaaS. |
| **Overall Quality Score** | **4 / 10** | Critical hosting/routing defect dominates quality for production & payment-gateway review. |

---

## 5. Detailed Findings by Theme

### 5.1 Loading performance

**Observed**

- Homepage document download: ~142–561 ms (good).
- Primary JS: **544,467 bytes** (~532 KB).
- Primary CSS: **83,843 bytes** (~82 KB).
- Cache-Control on HTML: `max-age=600` (10 minutes).
- Fonts loaded from Google Fonts with preconnect (good), still external.

**Customer impact**

- First visit on mid-range Android (common for site supervisors) will pay a large JS parse cost before interactive content.
- Deep links never reach performance consideration because assets 404 first.

**Score drivers:** Fast HTML (+), large single bundle (−), third-party fonts (−).

### 5.2 Broken pages & navigation

**Critical customer scenarios that fail today**

1. Cashfree / auditor opens `https://briktra.com/privacy-policy` from checklist → blank/broken page.  
2. User clicks Privacy in footer → if navigation is full document request or new tab → broken.  
3. User shares Pricing link on WhatsApp → recipient opens deep link → broken.  
4. User refreshes on `/contact` after filling form → broken.  
5. Googlebot fetches sitemap URLs → HTTP 404 (SEO + trust).

**Navigation IA quality (design)** — otherwise good:

- Home / Features / Pricing / About / Contact  
- Login + Start Free Trial  
- Footer: Product, Support, Legal columns with GSTIN and address  

**Sitemap contradiction:** Sitemap lists healthy URLs; production returns 404 for them. This is worse than omitting the URLs.

### 5.3 Responsiveness (Mobile / Tablet / Desktop)

| Viewport | Observation | Score |
|----------|-------------|------:|
| Mobile | CTAs stack; sections readable; flip-cards hide descriptions behind hover; dense homepage | 6 |
| Tablet | 2–3 column grids work; pricing cards readable | 7 |
| Desktop | Hero + screenshots + pricing hierarchy strongest | 8 |

### 5.4 Accessibility

**Positives**

- Semantic sections and FAQ accordion pattern present in product.
- Business contact info available as text (not image-only) on homepage contact block.
- Skip-to-content intent exists in current product design.

**Negatives**

- Feature cards instruct “Hover to reveal more!” — inaccessible primary content pattern on touch / keyboard without redesign.
- Duplicate titles for front/back of flip cards inflate heading noise.
- Deep-link failure is an accessibility failure (content unavailable).
- OG image is favicon SVG — weak for social previews (related trust/a11y of shared content).

### 5.5 UI consistency, color, fonts, icons

**Strengths**

- Construction ERP positioning is clear and consistent.
- Orange primary CTAs, HardHat / module icons, screenshot-led product proof.
- Legal/business identity (EDGEZEN LABS, GSTIN, Madurai address, phone, hours) appears on homepage contact strip.

**Inconsistencies**

- Pricing island uses hardcoded slate/`#ff6b00` styling vs token-driven sections elsewhere.
- Plan accent colors (green / orange / purple) diverge from restrained brand system.
- Inter + Space Grotesk is clean but not highly distinctive for premium construction branding.

### 5.6 Empty states & trust theater

| Empty / placeholder | Severity | Why it matters |
|---------------------|----------|----------------|
| “Product walkthrough video — coming soon” | Major | Looks unfinished on a production commercial site |
| “Placeholder testimonials… Replace with verified…” | **Critical for trust** | Explicitly tells reviewers/customers social proof is fake |
| Map placeholder on Contact | Minor | Acceptable if labeled; still unfinished feel |
| Feature hover-only descriptions | Major (mobile) | Content gated behind unsupported interaction |

### 5.7 Forms, buttons, error handling

**Buttons:** Strong. Trial + Login are repeated in hero, header, pricing, CTA — good conversion hygiene.

**Contact form:** Opens local mail client (`mailto:`) — fails for users without a configured mail app (common on shared office PCs / some mobile browsers). No ticket ID, no success page, no spam protection.

**Errors:** No resilient offline/error messaging for failed deep-link boots. In-app 404 component cannot rescue users if the bundle never loads.

### 5.8 Animation & UX quality

- Hover scale on CTAs and flip cards feels “demo-ish” rather than enterprise-calm.
- Workflow / showcase storytelling on homepage is otherwise good UX writing for contractors.
- Pricing GST + Cashfree + subscription terms are excellent UX for payment compliance **when the page is reachable**.

### 5.9 Compliance / Cashfree readiness (content vs reachability)

**Content present in live bundle (good):**

- GSTIN `33AAMFE4969Q1ZK`
- Cashfree payment messaging
- Subscription / digital delivery language
- Legal route strings for all required policies
- No `Launching Soon` waitlist copy
- No other-product advertising (`CredoSafe` not found)

**Content risk:**

- Live bundle includes wording that payment transactions via Cashfree “are secured under **PCI-DSS compliance standards**.” This may be acceptable if strictly attributed to Cashfree as a PCI-compliant processor, but it is **high-risk language** if reviewers interpret it as Briktra claiming PCI certification. Prefer processor-attribution-only wording during review.

**Reachability:** Legal pages must be reliably HTTP 200 for Cashfree production approval workflows. Today they are not.

### 5.10 Security headers (marketing site)

Observed missing on homepage response:

- Strict-Transport-Security  
- Content-Security-Policy  
- X-Frame-Options  
- X-Content-Type-Options  
- Referrer-Policy  
- Permissions-Policy  

HTTPS is on (GitHub Pages). Missing headers are a **Minor/Major hardening gap**, not a functional blocker, but expected for “enterprise-ready” claims.

### 5.11 Flutter app entry

- `/app/index.html` returns 200 quickly.
- Title: `Briktra`.
- Marketing CTAs correctly point users into the app for trial/login.
- Full ERP functional QA was out of scope for this marketing-site audit.

---

## 6. Issue Register

### Critical Issues

1. **Deep-link / refresh broken for all non-root SPA routes** due to relative `base` asset paths + GitHub Pages behavior (`/route/assets/*` → 404).  
2. **All Cashfree-required legal URLs fail as standalone pages** (Privacy, Terms, Refund, Cancellation, etc.).  
3. **Sitemap advertises URLs that return HTTP 404**, harming SEO and reviewer trust.  
4. **Explicit “Placeholder testimonials” copy** on production homepage — trust and compliance risk.

### Major Issues

1. Feature module cards rely on **hover to reveal** descriptions — weak mobile UX and accessibility.  
2. Contact acquisition is **mailto-only** — unreliable conversion/support channel.  
3. **Product video “coming soon”** empty state on hero path.  
4. **~544 KB single JS bundle** — slow first interaction on field devices.  
5. **PCI-DSS compliance language** in live content needs careful legal/product review for Cashfree.  
6. HTTP status remains **404** even when SPA shell is returned — bad for crawlers/monitors.  
7. Missing security headers relative to enterprise SaaS expectations.

### Minor Issues

1. Map is a dashed placeholder, not an embedded map.  
2. OG/Twitter image uses favicon SVG rather than a 1200×630 marketing image.  
3. Pricing visual system slightly inconsistent with other sections (hardcoded colors).  
4. Homepage is very long; cognitive load for first-time visitors.  
5. “Karzaa” salary-advance label may confuse non-Tamil audiences without a plain-English gloss.  
6. www vs apex both serve content; ensure canonical consistency is monitored.  
7. Claims such as “enterprise-grade security” without linked evidence/security page reachability.

### Enhancement Suggestions

1. Fix hosting for SPA: absolute asset base (`/`) **or** HashRouter **or** host with proper rewrite to `index.html` **and** HTTP 200.  
2. Verify every sitemap URL returns **200** with full content after fix.  
3. Replace placeholder testimonials with verified quotes or remove the section until real.  
4. Replace video placeholder with a real walkthrough or remove until available.  
5. Replace feature flip-cards with always-visible descriptions (tap-friendly).  
6. Implement a server-backed contact form (ticket email + confirmation UI).  
7. Code-split marketing routes; compress hero PNGs to WebP/AVIF.  
8. Soften animation; honor reduced-motion completely on marketing surfaces.  
9. Add dedicated Open Graph image; keep favicon separate.  
10. Publish a short “Security & Payments” summary page that is HTTP 200 and linked from pricing.  
11. Add uptime/synthetic monitors for `/`, `/privacy-policy`, `/terms`, `/refund-policy`, `/pricing`, `/contact`.  
12. Run WCAG AA audit with axe/Lighthouse after routing fix; remediate contrast & keyboard paths.

---

## 7. Customer Journey Test Scripts (Results)

### Journey A — First-time contractor (Happy path from Google)

1. Lands on `/` → **PASS** (loads, understands ERP value).  
2. Reads pricing on homepage → **PASS**.  
3. Clicks Start Free Trial → `/app/index.html` → **PASS** (shell loads).  
4. Opens Privacy Policy from footer in new tab → **FAIL** (critical).

### Journey B — Cashfree reviewer checklist

1. Open homepage → **PASS**.  
2. Open Privacy / Terms / Refund / Cancellation / Contact by URL → **FAIL**.  
3. Confirm GSTIN / address / support → **PASS on homepage**; **FAIL as dedicated pages**.  
4. Confirm subscription + no physical shipping language → **PASS in content** / **FAIL if page cannot open**.

### Journey C — Mobile site supervisor

1. Browse homepage on phone → **PASS (content)**.  
2. Try to read feature details without hover → **FAIL / PARTIAL**.  
3. Contact support via form without mail app → **FAIL / PARTIAL**.

### Journey D — Returning user refresh

1. Soft-nav to `/pricing` from home → may **PASS**.  
2. Refresh browser → **FAIL**.

---

## 8. Scoring Summary Card

```
Loading speed ............... 7
Broken pages ................ 2
Broken navigation ........... 3
Mobile responsiveness ....... 6
Tablet responsiveness ....... 7
Desktop responsiveness ...... 8
Accessibility ............... 5
UI consistency .............. 7
Empty states ................ 4
Error handling .............. 5
Forms ....................... 5
Buttons ..................... 8
Color consistency ........... 7
Fonts ....................... 7
Icons ....................... 8
Animation ................... 5
UX quality .................. 5

Overall UX Score ............ 5 / 10
Overall UI Score ............ 7 / 10
Overall Quality Score ....... 4 / 10
```

---

## 9. Go / No-Go Recommendation

| Audience | Recommendation |
|----------|----------------|
| Marketing homepage demo | Conditional GO |
| General public multi-page browsing | **NO-GO** |
| Cashfree production website review | **NO-GO until deep links return HTTP 200 with working assets** |
| Enterprise buyer evaluation | **NO-GO** (trust placeholders + broken legal URLs) |

**Minimum release criteria before next payment-gateway submission:**

1. All sitemap URLs return **HTTP 200**.  
2. Privacy, Terms, Refund, Cancellation, Contact open with full content on cold load.  
3. Remove or replace “Placeholder testimonials” language.  
4. Re-test refresh on `/pricing` and `/privacy-policy`.

---

## 10. Appendix — Evidence Snapshot (23 Jul 2026)

| Check | Result |
|-------|--------|
| `GET /` | 200, HTML ~2.7 KB shell |
| `GET /privacy-policy` | 404 status; shell body may return but `./assets` resolves under `/privacy-policy/assets` → 404 |
| `HEAD /assets/index-dcOn2L6z.js` | 200, 544467 bytes |
| `HEAD /features/assets/index-dcOn2L6z.js` | 404 |
| `GET /sitemap.xml` | 200, includes broken routes |
| `GET /robots.txt` | 200 |
| `GET /app/index.html` | 200 |
| Security headers (HSTS/CSP/XFO/etc.) | Absent |
| `CredoSafe` in bundle | Not found |
| `Launching Soon` in bundle | Not found |
| `Cashfree` in bundle | Found |
| `33AAMFE4969Q1ZK` in bundle | Found |
| `PCI-DSS` claim text | Found (review carefully) |

---

## 11. Document Control

| Field | Value |
|-------|-------|
| Document | Production QA Audit Report |
| Product | Briktra.com marketing site |
| Version | 1.0 |
| Date | 23 July 2026 |
| Related docs | `docs/WEBSITE_REVIEW_AND_PLAN.md`, `docs/WEBSITE_ENHANCEMENT_REPORT.md` |
| Code changes in this audit | **None** |

---

*End of report.*
