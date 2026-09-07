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

## Design branches (compare side-by-side)

| Branch | Palette | Vibe |
|--------|---------|------|
| `feature/creative-redesign` | Midnight Executive — navy + blue + gold | Consultant/trustworthy, editorial hybrid |
| `feature/palette-aurora` | Obsidian Aurora — near-black + violet/cyan | Cinematic 21st.dev, high contrast |
| `feature/palette-monochrome` | Monochrome Luxe — black/white/gray + blue accent | Minimal, bold, high-end |

```bash
git checkout feature/creative-redesign && npm run dev   # Midnight Executive
git checkout feature/palette-aurora && npm run dev      # Obsidian Aurora
git checkout feature/palette-monochrome && npm run dev  # Monochrome Luxe
```
