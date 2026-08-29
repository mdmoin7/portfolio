import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ALLOWED_ORIGIN = "https://mdmoin7.github.io";

function headers(origin) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  };
}

function response(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: headers(origin) });
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

export default async function handler(request) {
  const origin = request.headers.get("origin") || "";

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: headers(origin) });
  }

  if (request.method !== "POST") {
    return response({ error: "Method not allowed" }, 405, origin);
  }

  if (origin && origin !== ALLOWED_ORIGIN) {
    return response({ error: "Origin not allowed" }, 403, origin);
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

  // Honeypot: bots typically fill hidden fields; real users leave it empty.
  if (company) {
    return response({ ok: true }, 200, origin);
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
