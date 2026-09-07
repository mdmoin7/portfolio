# Mohammad Moin — Portfolio

Personal site for **Mohammad Moin** — Independent Software Engineering Consultant & Corporate Technology Trainer.

**Live:** [mohammadmoin.vercel.app](https://mohammadmoin.vercel.app)

## Overview

Next.js portfolio with a cinematic homepage (3D intro gate, aurora hero, scroll-driven motion) and a shared subpage system for consulting, training, and engineering content.

| Area | Routes |
|------|--------|
| Homepage | `/` |
| Services | `/about/`, `/training/`, `/consulting/`, `/contact/` |
| Engineering | `/engineering/react/`, `/engineering/angular/`, `/engineering/react-native/`, `/engineering/frontend-architecture/`, `/engineering/terraform/` |
| API | `/api/contact` |

Static assets (CV, consultant profile PDFs) live under `public/assets/`.

## Tech stack

| Layer | Tools |
|-------|-------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, Geist |
| Motion | Framer Motion, Lenis smooth scroll |
| 3D | React Three Fiber, Three.js, Drei |
| Contact | Resend API, optional Cloudflare Turnstile |

## Project structure

```
app/                 App Router pages and API routes
components/          Homepage sections, hero/3D, subpage UI
lib/                 Site content, SEO helpers, subpage data
lib/subpages/        Typed content for inner pages
public/              Favicon, robots, sitemap, PDFs
vercel.json          Vercel project config (Next.js, branch deploy rules)
```

## Local development

**Requirements:** Node.js 20+

```bash
npm install
cp .env.example .env.local   # optional; contact API needs Resend vars
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint      # ESLint (flat config)
npm run build     # production build
npm start         # serve production build locally
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical site URL — `https://mohammadmoin.vercel.app` |
| `RESEND_API_KEY` | For contact | Resend API key |
| `RESEND_FROM_EMAIL` | For contact | Verified sender address |
| `CONTACT_TO_EMAIL` | For contact | Inbox for form submissions |
| `TURNSTILE_SECRET_KEY` | No | Cloudflare Turnstile secret |

See [`.env.example`](.env.example) for a starter template.

## Google Search Console

The site exposes dynamic [`/sitemap.xml`](https://mohammadmoin.vercel.app/sitemap.xml) and [`/robots.txt`](https://mohammadmoin.vercel.app/robots.txt) for the Vercel domain.

Verification uses the HTML file in `public/googleb3a4c134ed2bd9fd.html`. `cleanUrls` is disabled in `vercel.json` so Vercel serves the `.html` path without stripping the extension.

Live URL: [https://mohammadmoin.vercel.app/googleb3a4c134ed2bd9fd.html](https://mohammadmoin.vercel.app/googleb3a4c134ed2bd9fd.html)

### 1. Add the property

1. Open [Google Search Console](https://search.google.com/search-console).
2. **Add property** → choose **URL prefix**.
3. Enter `https://mohammadmoin.vercel.app`.

### 2. Verify ownership (HTML file)

1. Pick **HTML file** verification.
2. Google expects the file `googleb3a4c134ed2bd9fd.html` — it is already deployed from `public/`.
3. Confirm the live URL returns the verification string, then click **Verify** in Search Console.

### 3. Submit the sitemap

1. In Search Console → **Sitemaps**.
2. Submit: `https://mohammadmoin.vercel.app/sitemap.xml`
3. After a few days, check **Pages** and **Performance** for indexing status.

Optional later: add a custom domain in Vercel and create a **Domain** property in Search Console for stronger branding in search results.

## Deployment

Production deploys from **`vercel-deploy`** to [mohammadmoin.vercel.app](https://mohammadmoin.vercel.app) via **Vercel Git integration**. Pushes to that branch trigger a production build (`next build`). Deploys from `main` are disabled in `vercel.json`.

Before pushing:

```bash
npm run lint && npm run build
```

<details>
<summary>One-time Vercel setup</summary>

1. Import `mdmoin7/portfolio` at [vercel.com/new](https://vercel.com/new).
2. **Settings → Git → Production Branch** → `vercel-deploy`.
3. **Settings → General** → Framework: **Next.js**, build command `npm run build`, output directory empty.
4. **Settings → Domains** → confirm `mohammadmoin.vercel.app`.
5. Add the environment variables above under **Settings → Environment Variables**.

Local CLI (optional):

```bash
npm i -g vercel
vercel login
vercel link
vercel pull
```

</details>

## Branches

| Branch | Purpose |
|--------|---------|
| `vercel-deploy` | Production — Vercel deploys on push |
| `main` | Default branch; no Vercel production deploy |
| `feature/*` | Design experiments and palette variants |

## Legacy static build

The original GitHub Pages static site (`dist/` via Python minification) is deprecated. It can still be built locally for reference:

```bash
npm run build:static
```

The live site runs the Next.js App Router build only.
