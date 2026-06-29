# Briktra.com — Website Review & Implementation Plan

**Document Version:** 1.0  
**Last Updated:** June 29, 2026  
**Scope:** Production-ready SaaS marketing site + Cashfree Payment Gateway compliance

---

## 1. Executive Summary

Briktra Launchpad is a Vite + React + TypeScript + Tailwind marketing site for the **Briktra** construction ERP SaaS product. The Flutter web app lives at `/app/`. This review covers gaps against enterprise SaaS standards and Cashfree production approval requirements.

**Primary gaps identified:**
- Single-page layout with anchor links instead of dedicated Features, Pricing, About, and Contact routes
- About page promotes EdgeZen Labs corporate portfolio and other products (CredoSafe, Expeniqo, etc.) — **must be removed**
- Incomplete legal pages (6 of 9 required policies missing or stub-level)
- Wrong contact email (`support@briktra.com` vs required `contact@edgezenlabs.com`)
- Missing GSTIN, full registered address, and business hours in footer/contact
- "Launching Soon" CTAs despite live product — misleading for payment gateway review
- No FAQ, testimonials, or trust/security badges on homepage
- SEO sitemap missing most routes; legal pages lack SEO component
- Accessibility gaps (skip link, focus styles, reduced-motion for flip cards)

---

## 2. Current Architecture

| Layer | Stack |
|-------|-------|
| Framework | React 18, Vite 5, TypeScript |
| Routing | react-router-dom v6 |
| Styling | Tailwind CSS + shadcn/ui |
| SEO | react-helmet-async |
| App | Flutter PWA at `public/app/` |

### Existing Routes (before enhancement)

| Route | Status |
|-------|--------|
| `/` | Homepage (all sections inline) |
| `/about-us` | Company-focused — needs product focus |
| `/explore` | Module deep-dive |
| `/privacy-policy` | Stub content |
| `/terms` | Stub content |
| `/refund-policy` | Stub content |
| `/app/*` | Flutter app (unchanged) |

### Missing Routes (required)

- `/features`, `/pricing`, `/contact`, `/faq`
- `/cancellation-policy`, `/shipping-delivery-policy`, `/cookie-policy`
- `/security-policy`, `/data-deletion-policy`, `/acceptable-use-policy`

---

## 3. Page-by-Page Review

### 3.1 Homepage (`Index.tsx`)

| Area | Issue | Action |
|------|-------|--------|
| Hero | "Launching" tone; no Start Free Trial | Update tagline, dual CTAs |
| Features | Flip cards inaccessible on mobile/touch | Add static fallback + aria |
| CTA | "Launching Soon" / waitlist | Replace with trial CTA |
| Trust | No SSL/payment badges | Add TrustBadges section |
| Social proof | No testimonials | Add placeholder testimonials |
| FAQ | Missing | Add FAQ accordion section |
| Contact | Minimal inline block | Link to `/contact` |

### 3.2 Header

| Issue | Action |
|-------|--------|
| Anchor-only nav | Route to `/features`, `/pricing`, `/about`, `/contact` |
| No Start Free Trial | Add secondary CTA button |
| Mobile menu incomplete | Mirror desktop links |

### 3.3 Footer

| Issue | Action |
|-------|--------|
| Wrong email | `contact@edgezenlabs.com` |
| Missing GSTIN | Add legal entity block |
| Missing legal links | All 9 policies + FAQ |
| Company prominence | "Powered by EDGEZEN LABS" only |

### 3.4 About (`AboutUs.tsx`)

| Issue | Action |
|-------|--------|
| EdgeZen Labs as hero | Reframe as "About Briktra" |
| Other products section | **Remove entirely** |
| Generic agency copy | Construction ERP mission/vision |

### 3.5 Contact (`ContactUs.tsx`)

| Issue | Action |
|-------|--------|
| Incomplete address | Full registered address |
| No form | Add accessible contact form |
| No phone/GSTIN/hours | Add all required fields |

### 3.6 Pricing (`Pricing.tsx`)

| Issue | Action |
|-------|--------|
| No GST disclaimer | Add 18% GST note |
| No Cashfree mention | Secure payments via Cashfree |
| "No credit card required" | Clarify subscription billing |
| Only on homepage | Dedicated `/pricing` page |

### 3.7 Legal Pages

All policies need: legal entity, GSTIN, address, contact email, India-specific SaaS language, subscription/refund/cancellation clarity for Cashfree.

---

## 4. Cashfree Compliance Checklist

| Requirement | Implementation |
|-------------|----------------|
| Subscription software clearly stated | Terms, Shipping policy, Pricing |
| Transparent pricing | Pricing page with monthly/yearly + GST |
| Refund policy | Dedicated page |
| Cancellation policy | Dedicated page |
| Contact information | Contact page + footer |
| Business information | Footer, Contact, legal pages |
| Privacy policy | Enhanced page |
| Terms & conditions | Enhanced page |
| Secure payments | TrustBadges — Cashfree wording (no PCI claims) |
| Invoice generation | Mention in Terms/Pricing |
| Customer support | Email, phone, business hours |
| No misleading claims | Remove "Launching Soon", inflated stats |

---

## 5. SEO Plan

- Update `index.html` meta defaults to new tagline
- Per-page `<SEO>` with canonical URLs
- Expand `sitemap.xml` with all public routes
- JSON-LD: `SoftwareApplication` + `Organization`
- Open Graph image (use hero screenshot path)
- `robots.txt` — allow all marketing pages

---

## 6. Performance Plan

- Replace CSS `@import` fonts with `<link rel="preconnect">` + font link in `index.html`
- Add `loading="lazy"` on below-fold images
- Add `font-display: swap` via Google Fonts URL param

---

## 7. Accessibility Plan

- Skip-to-main link in layout
- `:focus-visible` ring utilities on interactive elements
- `prefers-reduced-motion` — disable flip animations
- ARIA labels on nav, accordion FAQ
- Form labels associated with inputs

---

## 8. Implementation Phases

### Phase 1 — Foundation
- [x] `src/lib/site-config.ts` — single source of truth
- [x] `LegalPageLayout` component
- [x] Shared `FAQ`, `TrustBadges`, `Testimonials`

### Phase 2 — Pages
- [x] All legal pages with full content
- [x] `/features`, `/pricing`, `/contact`, `/faq`, `/about`
- [x] Rewrite About page (product-only)

### Phase 3 — Shell & Homepage
- [x] Header/Footer navigation
- [x] Homepage sections: FAQ, testimonials, trust
- [x] Hero/CTA copy updates

### Phase 4 — SEO & Compliance
- [x] sitemap.xml, robots.txt, SEO component
- [x] index.html structured data

### Phase 5 — Documentation & Commit
- [x] `WEBSITE_ENHANCEMENT_REPORT.md`
- [x] Git commits

---

## 9. Files to Create / Modify

### New Files
- `src/lib/site-config.ts`
- `src/lib/features-data.ts`
- `src/components/LegalPageLayout.tsx`
- `src/components/FAQ.tsx`
- `src/components/TrustBadges.tsx`
- `src/components/Testimonials.tsx`
- `src/components/SkipLink.tsx`
- `src/pages/FeaturesPage.tsx`
- `src/pages/PricingPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/FAQPage.tsx`
- `src/pages/CancellationPolicy.tsx`
- `src/pages/ShippingDeliveryPolicy.tsx`
- `src/pages/CookiePolicy.tsx`
- `src/pages/SecurityPolicy.tsx`
- `src/pages/DataDeletionPolicy.tsx`
- `src/pages/AcceptableUsePolicy.tsx`
- `docs/WEBSITE_ENHANCEMENT_REPORT.md`

### Modified Files
- `src/App.tsx`
- `src/pages/Index.tsx`
- `src/pages/AboutUs.tsx`
- `src/pages/PrivacyPolicy.tsx`
- `src/pages/Terms.tsx`
- `src/pages/RefundPolicy.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/Hero.tsx`
- `src/components/CTA.tsx`
- `src/components/ContactUs.tsx`
- `src/components/Pricing.tsx`
- `src/components/Features.tsx`
- `src/components/SEO.tsx`
- `index.html`
- `public/sitemap.xml`
- `src/index.css`

---

## 10. Status

**Implementation:** ✅ Complete (June 29, 2026)

See `WEBSITE_ENHANCEMENT_REPORT.md` for detailed outcomes, file list, and remaining recommendations.
