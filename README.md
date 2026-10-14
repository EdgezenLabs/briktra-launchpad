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
| `VITE_API_URL` | `https://api.briktra.com` | The contact form (`POST /contact`, which the API exempts from request signing) |

A production build (`vite build`) uses the defaults unless the variables are set, and fails if either is not an `https://` origin or names a QA, preview or local host. A QA build sets both to the QA hosts with `--mode qa` (`.env.qa`). The app's routes are the Flutter router's: `/login`, `/register`, and `/register?plan=<id>&billing=monthly|annual` from a pricing card (the app preselects that plan only if its catalogue lists it; the price is always the API's).

Old `/app/...` addresses on this site are forwarded to the same path on app.briktra.com by a script at the top of `index.html`, before analytics loads, so invitation tokens in those links never reach analytics.

## Pages

| Path | Purpose |
| --- | --- |
| `/` | Homepage, including the mobile app guide video |
| `/features` | Product modules and the same guide video |
| `/pricing` | Starter, Basic, Premium and Max plans |
| `/about` | About Briktra |
| `/contact` | Support and sales contact form |
| `/faq` | Subscription, billing, and product questions |
| `/explore` | Module screenshots |
| `/app/*` | Redirect to app.briktra.com |

Legal pages live under paths such as `/privacy-policy`, `/terms`, `/refund-policy`, and `/cancellation-policy`.

## Product video

The homepage and Features page embed the [Briktra mobile app guide](https://www.youtube.com/watch?v=KtHkLIc76bo). `index.html` allows that player in `frame-src` (`https://www.youtube.com` and `https://www.youtube-nocookie.com`). Without those hosts, the browser blocks the embed. The API origin is listed in `connect-src` so the contact form can post.

## Deploy

Pull requests run lint, tests, the build and `scripts/verify-dist.mjs` (`.github/workflows/ci.yml`). Pushes to `main` run the same gates, publish with GitHub Pages and confirm briktra.com serves the new commit (`.github/workflows/deploy.yml`). GitHub Pages cannot set HTTP security headers, so the content security policy and referrer policy are `<meta>` tags in `index.html`.
