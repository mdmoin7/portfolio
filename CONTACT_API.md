# Portfolio Contact API — Resend

The portfolio is hosted on GitHub Pages, which is static. The contact form therefore sends to a separate serverless API so the Resend API key never reaches the browser.

## Architecture

```text
GitHub Pages
  ↓ POST /api/contact
Vercel Serverless Function
  ↓ Resend SDK
Resend
  ↓
Mohammad Moin inbox
```

Resend's Node SDK supports sending through `resend.emails.send()`. The API also supports idempotency keys, which this implementation uses when the browser supplies a request ID.

Official Resend Node.js guide: https://resend.com/nodejs

## Deploy the API

Create a Vercel project from this repository and deploy the repository as the API project. The included `vercel.json` configures the contact function to use Node.js 24.

Set these Vercel environment variables for Production:

- `RESEND_API_KEY` — a Resend API key with **sending access**; preferably restrict it to the verified sending domain.
- `RESEND_FROM_EMAIL` — for example `Mohammad Moin <contact@your-verified-domain.com>`.
- `CONTACT_TO_EMAIL` — the inbox that should receive portfolio enquiries.

The sending domain must be verified in Resend before using a custom `from` address.

Resend dashboard: https://resend.com/

## Frontend API URL

The static frontend currently uses:

```text
https://portfolio-contact-api.vercel.app/api/contact
```

If the Vercel project uses another hostname, set `window.PORTFOLIO_CONTACT_API` before `main.js` loads, or change the default in `main.js`.

## Security controls

- Resend API key remains server-side.
- CORS is restricted to the GitHub Pages origin.
- Request payload and field lengths are validated.
- Email address is validated server-side.
- HTML email content is escaped before insertion.
- Honeypot field rejects automated submissions without exposing an error.
- Resend idempotency keys prevent accidental duplicate delivery when the same request is retried.

For production use, add an edge/WAF rate limit or bot challenge in front of the endpoint if spam volume becomes material.
