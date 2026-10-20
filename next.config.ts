import type { NextConfig } from "next";

const ContentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-inline' for scripts is required by Next.js App Router hydration;
  // scripts are otherwise restricted to same-origin.
  "script-src 'self' 'unsafe-inline'",
  // Styles are largely inline (styled attributes, CSS-in-JS from framer-motion).
  "style-src 'self' 'unsafe-inline'",
  // Portraits and icons are self-hosted; data: covers the film-grain SVG.
  "img-src 'self' data:",
  "font-src 'self' data:",
  // The score is streamed from the same origin; chat/contact APIs are same-origin.
  "media-src 'self'",
  "connect-src 'self'",
  // Turnstile challenges (when enabled on the contact flow) load from Cloudflare.
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
