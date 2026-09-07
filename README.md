# Mohammad Moin — Portfolio

Personal portfolio site for Mohammad Moin — Independent Software Engineering Consultant & Corporate Technology Trainer.

**Production:** [https://mohammadmoin.vercel.app](https://mohammadmoin.vercel.app)

## Stack

- **Next.js 16** (App Router)
- **React Three Fiber** + **Three.js** for the interactive hero scene
- **Framer Motion** for intro, scroll, and section animations
- **Tailwind CSS v4** for styling
- **Resend** for the contact API

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

## Deployment (Vercel)

Production deploys from the **`vercel-deploy`** branch to **[mohammadmoin.vercel.app](https://mohammadmoin.vercel.app)**.

### One-time Vercel setup

The live site currently serves the **legacy static build from `main`** (`outputDirectory: dist`). Production must deploy from **`vercel-deploy`**, which runs `next build`.

1. Import or open the existing project at [vercel.com/new](https://vercel.com/new) for `mdmoin7/portfolio`.
2. **Settings → Git → Production Branch** → set to **`vercel-deploy`** (not `main`).
3. **Settings → General → Framework Preset** → confirm **Next.js** (not “Other”).
4. Confirm **Build Command** is `npm run build` and **Output Directory** is empty (Next.js default).
5. Confirm the production domain is `mohammadmoin.vercel.app` (Project → Settings → Domains).
6. Add environment variables in Vercel:

| Variable | Value / description |
|----------|---------------------|
| `NEXT_PUBLIC_SITE_URL` | `https://mohammadmoin.vercel.app` |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender address |
| `CONTACT_TO_EMAIL` | Inbox for contact form submissions |
| `TURNSTILE_SECRET_KEY` | Optional Cloudflare Turnstile secret |

7. Add GitHub Actions secrets (Repository → Settings → Secrets → Actions):

| Secret | Source |
|--------|--------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | `.vercel/project.json` after `vercel link`, or Vercel project settings |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` after `vercel link`, or Vercel project settings |

After linking locally, copy IDs from `.vercel/project.json`:

```bash
npm i -g vercel
vercel login
vercel link
cat .vercel/project.json
```

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

### CI/CD

Every push to `vercel-deploy` runs [`.github/workflows/vercel-deploy.yml`](.github/workflows/vercel-deploy.yml):

1. **Lint & build** — validates the Next.js app
2. **Deploy** — `vercel pull` → `vercel build --prod` → `vercel deploy --prebuilt --prod`

`vercel.json` disables automatic deploys from `main`; only `vercel-deploy` triggers production.

### Local Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel pull
```

## Branch workflow

- **`vercel-deploy`** — production branch (Vercel + GitHub Actions)
- **`feature/creative-redesign`** — redesign work in review
- **`main`** — source history only (no GitHub Pages deploy)

## Legacy static build

The old GitHub Pages static pipeline has been removed. To build static HTML locally:

```bash
npm run build:static
```
