# Mohammad Moin — Portfolio

Personal portfolio site for Mohammad Moin — Independent Software Engineering Consultant & Corporate Technology Trainer.

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

## Deployment

### Vercel (`vercel-deploy` branch)

Production deployments run from the **`vercel-deploy`** branch.

1. **Connect the repo in Vercel** (if not already linked): Import `mdmoin7/portfolio` from GitHub.
2. **Set the production branch**: Project → Settings → Git → **Production Branch** → `vercel-deploy`.
3. **Add env vars in Vercel** (Project → Settings → Environment Variables) for the contact API:

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender address |
| `CONTACT_TO_EMAIL` | Inbox for contact form submissions |
| `TURNSTILE_SECRET_KEY` | Optional Cloudflare Turnstile secret |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (e.g. `https://your-domain.vercel.app`) |

4. **Optional**: set repository variable `NEXT_PUBLIC_SITE_URL` in GitHub for the CI build step.

Every push to `vercel-deploy` runs **`.github/workflows/vercel-deploy.yml`** (lint + build). When the repo is linked in Vercel with production branch `vercel-deploy`, Vercel also builds and deploys automatically on each push.

### Legacy static build (GitHub Pages)

Static authority subpages in the repo root are used only by the legacy GitHub Pages pipeline on `main`:

```bash
npm run build:static
```

## Branch workflow

- **`vercel-deploy`** — Vercel production branch (Next.js app + inner pages)
- **`feature/creative-redesign`** — creative redesign work in review
- **`main`** — legacy GitHub Pages static site
