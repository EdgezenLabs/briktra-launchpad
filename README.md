# Briktra marketing site

Public website for [Briktra](https://briktra.com), a cloud construction ERP for contractors and builders in India. The product itself is the Flutter web app at [app.briktra.com](https://app.briktra.com); this site only links into it and owns no sign-in, registration or payment of its own.

**Docs policy — read this before adding any documentation, human or AI agent:** this repo has at most three documentation files: this `README.md` (setup/run), `CURRENT.md` (known issues, gotchas, current state) and `PRODUCT.md` (features/product description). Do not create any other documentation file; fold new content into whichever of the three it belongs in.

## Stack

- Vite, React, and TypeScript
- Tailwind CSS and shadcn/ui
- React Router
- Deployed with GitHub Pages when `main` is updated

## Local development

Node.js 22 and npm are required.

```sh
npm ci
npm run dev
```

The dev server runs at [http://localhost:8080](http://localhost:8080).

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the local site |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests, including every app link on the site |

## Where links and requests go

All app and API origins come from `src/lib/app-links.ts`, and nothing else in `src/` names them:

| Variable | Production default | Used for |
| --- | --- | --- |
| `VITE_APP_URL` | `https://app.briktra.com` | Login, signup, free-trial and pricing links |
| `VITE_API_URL` | `https://api.briktra.com` | The contact form (`POST /contact`) and plan prices (`GET /public/plans`), both exempt from request signing |

A production build (`vite build`) uses the defaults unless the variables are set, and fails if either is not an `https://` origin or names a QA, preview or local host. A QA build sets both to the QA hosts with `--mode qa` (`.env.qa`). The app's routes are the Flutter router's: `/login`, `/register`, and `/register?plan=<id>&billing=monthly|annual` from a pricing card (the app preselects that plan only if its catalogue lists it; the price is always the API's).

Old `/app/...` addresses on this site are forwarded to the same path on app.briktra.com by a script at the top of `index.html`, before analytics loads, so invitation tokens in those links never reach analytics.

## Pages

| Path | Purpose |
| --- | --- |
| `/` | Homepage: hero, the two ways to work, the six feature groups, money rules, roles, pricing, FAQ |
| `/labour-payroll`, `/site-management`, `/purchase-stock`, `/boq-billing`, `/customers`, `/control-reports` | One page per feature group (`src/pages/FeatureGroupPage.tsx`) |
| `/features` | All features on one page |
| `/pricing` | Plans, limits table and pricing questions |
| `/about` | About Briktra |
| `/contact` | Contact form and WhatsApp |
| `/faq` | Questions |
| `/explore` | Redirects to `/features` |
| `/app/*` | Redirect to app.briktra.com |

Legal pages live under paths such as `/privacy-policy`, `/terms`, `/refund-policy`, and `/cancellation-policy`.

Every product claim is in `src/lib/content.ts`; pages never state features of their own. Testimonials show only when `TESTIMONIALS` there has real, approved quotes.

## Pricing and screenshots

`/pricing` and the homepage read `GET {VITE_API_URL}/public/plans` (no sign-in, no request signature) and show the built-in catalogue in `src/lib/plans.ts` until it answers or if it fails. Keep that copy in step with the API's plan catalogue.

App screenshots go in `src/assets/shots` as `<key>-phone.png` and `<key>-web.png`, with keys from `ShotKey` in `src/lib/content.ts`. A key with no file shows a drawn stand-in.

## Deploy

Pull requests run lint, tests, the build and `scripts/verify-dist.mjs` (`.github/workflows/ci.yml`). Pushes to `main` run the same gates, publish with GitHub Pages and confirm briktra.com serves the new commit (`.github/workflows/deploy.yml`). GitHub Pages cannot set HTTP security headers, so the content security policy and referrer policy are `<meta>` tags in `index.html`.
