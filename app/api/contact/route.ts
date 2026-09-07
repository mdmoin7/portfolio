import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://mohammadmoin.vercel.app",
  "http://localhost:3000",
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, ""),
].filter(Boolean) as string[];
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

type RateEntry = { windowStart: number; count: number };

const rateLimitStore: Map<string, RateEntry> =
  (globalThis as typeof globalThis & { __portfolioContactRateLimit?: Map<string, RateEntry> })
    .__portfolioContactRateLimit || new Map();
const requestStore: Map<string, number> =
  (globalThis as typeof globalThis & { __portfolioContactRequests?: Map<string, number> })
    .__portfolioContactRequests || new Map();

(globalThis as typeof globalThis & { __portfolioContactRateLimit?: Map<string, RateEntry> }).__portfolioContactRateLimit =
  rateLimitStore;
(globalThis as typeof globalThis & { __portfolioContactRequests?: Map<string, number> }).__portfolioContactRequests =
  requestStore;

function corsHeaders(origin: string | null) {
  const allowed =
    !origin || ALLOWED_ORIGINS.some((item) => origin.startsWith(item)) ? origin || "*" : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  return forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(key, { windowStart: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

async function verifyTurnstile(token: string, remoteIp: string) {
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
    const data = (await result.json()) as { success?: boolean };
    return { configured: true, success: data.success === true };
  } catch (error) {
    console.error("Turnstile verification error", error);
    return { configured: true, success: false };
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const clientKey = getClientKey(request);

  if (origin && !ALLOWED_ORIGINS.some((item) => origin.startsWith(item))) {
    return NextResponse.json(
      { error: "Origin not allowed" },
      { status: 403, headers: corsHeaders(origin) },
    );
  }

  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes or use the email option in the form." },
      {
        status: 429,
        headers: { ...corsHeaders(origin), "Retry-After": "600" },
      },
    );
  }

  if (
    !process.env.RESEND_API_KEY ||
    !process.env.RESEND_FROM_EMAIL ||
    !process.env.CONTACT_TO_EMAIL
  ) {
    console.error("Missing contact email environment variables");
    return NextResponse.json(
      { error: "Contact service is not configured" },
      { status: 503, headers: corsHeaders(origin) },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400, headers: corsHeaders(origin) },
    );
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
    return NextResponse.json({ ok: true }, { status: 200, headers: corsHeaders(origin) });
  }

  if (formStartedAt && Date.now() - formStartedAt < 1500) {
    return NextResponse.json(
      { error: "Please take a moment to complete the form." },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  if (requestId) {
    if (requestStore.has(requestId)) {
      return NextResponse.json(
        { ok: true, duplicate: true },
        { status: 200, headers: corsHeaders(origin) },
      );
    }
    requestStore.set(requestId, Date.now());
  }

  if (requestStore.size > 1000) {
    const cutoff = Date.now() - 60 * 60 * 1000;
    for (const [key, timestamp] of requestStore) {
      if (timestamp < cutoff) requestStore.delete(key);
    }
  }

  const turnstile = await verifyTurnstile(turnstileToken, clientKey);
  if (turnstile.configured && !turnstile.success) {
    return NextResponse.json(
      { error: "Spam verification failed. Please retry or use the email option in the form." },
      { status: 403, headers: corsHeaders(origin) },
    );
  }

  if (!name || name.length > 100) {
    return NextResponse.json(
      { error: "Please provide a valid name" },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  if (!isEmail(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Please provide a valid email address" },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  if (!subject || subject.length > 160) {
    return NextResponse.json(
      { error: "Please provide a valid subject" },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  if (!message || message.length < 10 || message.length > 5000) {
    return NextResponse.json(
      { error: "Message must be between 10 and 5000 characters" },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  const urlCount = (message.match(/https?:\/\//gi) || []).length;
  if (urlCount > 5) {
    return NextResponse.json(
      { error: "Message contains too many links. Please use the email option instead." },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
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
      return NextResponse.json(
        { error: "Unable to send your message right now" },
        { status: 502, headers: corsHeaders(origin) },
      );
    }

    return NextResponse.json(
      { ok: true, id: data?.id },
      { status: 200, headers: corsHeaders(origin) },
    );
  } catch (error) {
    console.error("Contact API error", error);
    return NextResponse.json(
      { error: "Unable to send your message right now" },
      { status: 500, headers: corsHeaders(origin) },
    );
  }
}
