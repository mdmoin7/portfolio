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

## Environment variables (Vercel)

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender address |
| `CONTACT_TO_EMAIL` | Inbox for contact form submissions |
| `TURNSTILE_SECRET_KEY` | Optional Cloudflare Turnstile secret |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (e.g. `https://your-domain.vercel.app`) |

## Deployment

The Next.js app deploys to **Vercel**. Static authority subpages (`/about/`, `/consulting/`, `/training/`, `/engineering/*`, `/contact/`) are served from `public/`.

Legacy static build (GitHub Pages):

```bash
npm run build:static
```

## Branch workflow

The creative redesign lives on `feature/creative-redesign` for review before merging to `main`.
