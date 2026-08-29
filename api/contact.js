import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ALLOWED_ORIGIN = "https://mdmoin7.github.io";
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = globalThis.__portfolioContactRateLimit || new Map();
globalThis.__portfolioContactRateLimit = rateLimitStore;
const requestStore = globalThis.__portfolioContactRequests || new Map();
globalThis.__portfolioContactRequests = requestStore;

function headers(origin) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  };
}

function response(body, status, origin, extraHeaders = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers(origin), ...extraHeaders } });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientKey(request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  return forwarded.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(key, { windowStart: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

async function verifyTurnstile(token, remoteIp) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { configured: false, success: true };
  if (!token) return { configured: true, success: false };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp);
    const result = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!result.ok) return { configured: true, success: false };
    const data = await result.json();
    return { configured: true, success: data.success === true };
  } catch (error) {
    console.error("Turnstile verification error", error);
    return { configured: true, success: false };
  }
}

export default async function handler(request) {
  const origin = request.headers.get("origin") || "";
  const clientKey = getClientKey(request);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: headers(origin) });
  }

  if (request.method !== "POST") {
    return response({ error: "Method not allowed" }, 405, origin);
  }

  if (origin && origin !== ALLOWED_ORIGIN) {
    return response({ error: "Origin not allowed" }, 403, origin);
  }

  if (isRateLimited(clientKey)) {
    return response({ error: "Too many requests. Please wait a few minutes or use the email option in the form." }, 429, origin, { "Retry-After": "600" });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.CONTACT_TO_EMAIL) {
    console.error("Missing contact email environment variables");
    return response({ error: "Contact service is not configured" }, 503, origin);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return response({ error: "Invalid request body" }, 400, origin);
  }

  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();
  const subject = String(payload.subject || "").trim();
  const message = String(payload.message || "").trim();
  const company = String(payload.company || "").trim();
  const requestId = String(payload.requestId || "").trim();
  const turnstileToken = String(payload.turnstileToken || "").trim();
  const formStartedAt = Number(payload.formStartedAt || 0);

  if (company) {
    return response({ ok: true }, 200, origin);
  }

  // Reject submissions that are unrealistically fast for a human visitor.
  if (formStartedAt && Date.now() - formStartedAt < 1500) {
    return response({ error: "Please take a moment to complete the form." }, 400, origin);
  }

  if (requestId) {
    if (requestStore.has(requestId)) return response({ ok: true, duplicate: true }, 200, origin);
    requestStore.set(requestId, Date.now());
  }

  if (requestStore.size > 1000) {
    const cutoff = Date.now() - 60 * 60 * 1000;
    for (const [key, timestamp] of requestStore) if (timestamp < cutoff) requestStore.delete(key);
  }

  const turnstile = await verifyTurnstile(turnstileToken, clientKey);
  if (turnstile.configured && !turnstile.success) {
    return response({ error: "Spam verification failed. Please retry or use the email option in the form." }, 403, origin);
  }

  if (!name || name.length > 100) {
    return response({ error: "Please provide a valid name" }, 400, origin);
  }

  if (!isEmail(email) || email.length > 254) {
    return response({ error: "Please provide a valid email address" }, 400, origin);
  }

  if (!subject || subject.length > 160) {
    return response({ error: "Please provide a valid subject" }, 400, origin);
  }

  if (!message || message.length < 10 || message.length > 5000) {
    return response({ error: "Message must be between 10 and 5000 characters" }, 400, origin);
  }

  // Basic abuse heuristics: reject obvious repeated URL spam.
  const urlCount = (message.match(/https?:\/\//gi) || []).length;
  if (urlCount > 5) {
    return response({ error: "Message contains too many links. Please use the email option instead." }, 400, origin);
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  try {
    const { data, error } = await resend.emails.send(
      {
        from: process.env.RESEND_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        replyTo: email,
        subject: `[Portfolio Contact] ${subject}`,
        text: `New portfolio contact\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
        html: `<!doctype html><html><body style="font-family:Arial,sans-serif;line-height:1.6;color:#142033"><h2>New portfolio contact</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Subject:</strong> ${safeSubject}</p><hr /><p>${safeMessage}</p></body></html>`,
      },
      requestId ? { idempotencyKey: `portfolio-contact/${requestId}` } : undefined,
    );

    if (error) {
      console.error("Resend error", error);
      return response({ error: "Unable to send your message right now" }, 502, origin);
    }

    return response({ ok: true, id: data?.id }, 200, origin);
  } catch (error) {
    console.error("Contact API error", error);
    return response({ error: "Unable to send your message right now" }, 500, origin);
  }
}
