# Briktra marketing site

Public website for [Briktra](https://briktra.com), a cloud construction ERP for contractors and builders in India. This repo is the marketing site. The product app is the Flutter web build served at `/app/`.

## Stack

- Vite, React, and TypeScript
- Tailwind CSS and shadcn/ui
- React Router
- Deployed with GitHub Pages when `main` is updated

## Local development

Node.js and npm are required.

```sh
npm install
npm run dev
```

The dev server runs at [http://localhost:8080](http://localhost:8080).

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the local site |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |

## Pages

| Path | Purpose |
| --- | --- |
| `/` | Homepage, including the mobile app guide video |
| `/features` | Product modules and the same guide video |
| `/pricing` | Starter, Pro, and Premium plans |
| `/about` | About Briktra |
| `/contact` | Support and sales contact form |
| `/faq` | Subscription, billing, and product questions |
| `/explore` | Module screenshots |
| `/app/` | Briktra web app (Flutter), not part of the React routes |

Legal pages live under paths such as `/privacy-policy`, `/terms`, `/refund-policy`, and `/cancellation-policy`.

## Product video

The homepage and Features page embed the [Briktra mobile app guide](https://www.youtube.com/watch?v=KtHkLIc76bo). `index.html` allows that player in `frame-src` (`https://www.youtube.com` and `https://www.youtube-nocookie.com`). Without those hosts, the browser blocks the embed.

The contact form posts to the API set by `VITE_API_URL`. That origin is listed in `connect-src` so the browser can send the request.

## Deploy

Pushes to `main` build the site and publish it with GitHub Pages (`.github/workflows/deploy.yml`). GitHub Pages cannot set HTTP security headers, so the content security policy and referrer policy are `<meta>` tags in `index.html`.
