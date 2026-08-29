# Portfolio Contact API — Resend

The portfolio is hosted on GitHub Pages, which is static. The contact form therefore sends to a separate serverless API so the Resend API key never reaches the browser.

## Architecture

```text
GitHub Pages
  ↓ POST /api/contact
Client validation + honeypot + optional Turnstile
  ↓
Vercel Serverless Function
  ↓ origin + rate limit + validation + spam heuristics
  ↓ optional Turnstile verification
Resend SDK
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
- `TURNSTILE_SECRET_KEY` — optional Cloudflare Turnstile secret. When configured, the API verifies the browser's Turnstile token before sending.

The sending domain must be verified in Resend before using a custom `from` address.

Resend dashboard: https://resend.com/

## Frontend API URL

The static frontend currently uses:

```text
https://portfolio-contact-api.vercel.app/api/contact
```

If the Vercel project uses another hostname, set `window.PORTFOLIO_CONTACT_API` before `main.js` loads, or change the default in `main.js`.

## Optional Turnstile

Cloudflare Turnstile is supported but deliberately optional so the contact channel does not depend on a third-party CAPTCHA service.

To enable it:

1. Create a Turnstile site in Cloudflare for `mdmoin7.github.io`.
2. Add the returned site key to the static site as `window.PORTFOLIO_TURNSTILE_SITE_KEY` before `main.js` loads.
3. Add the corresponding `TURNSTILE_SECRET_KEY` to Vercel.
4. Redeploy the static site and API.

If the site key is not configured, the form remains usable with the layered controls below.

## Security controls

- Resend API key remains server-side.
- CORS is restricted to the GitHub Pages origin.
- Request payload and field lengths are validated on both client and server.
- Email address is validated server-side.
- HTML email content is escaped before insertion.
- Honeypot field rejects automated submissions without exposing an error.
- Minimum form-completion time rejects unrealistically fast automated submissions.
- Per-client in-memory rate limiting allows at most 5 API requests per 10 minutes per server instance.
- Basic repeated-link spam heuristics reject messages containing more than 5 URLs.
- Resend idempotency keys prevent accidental duplicate delivery when the same request is retried.
- Optional Cloudflare Turnstile can provide an additional bot challenge.

For higher-volume production traffic, put a durable edge/WAF rate limit in front of the endpoint because serverless in-memory rate limits are instance-local.

## Mailto fail-safe

The modal always provides **Open email app** and a direct email address. If Resend is unavailable, times out, rejects the request, or the API cannot be reached, the visitor is shown a populated `mailto:` fallback. The visitor never receives a false success message when the online service fails.
