import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Google Search Console requires this exact verification string. */
const GOOGLE_VERIFICATION_BODY =
  "google-site-verification: googleb3a4c134ed2bd9fd.html";

const GOOGLE_VERIFICATION_PATHS = new Set([
  "/googleb3a4c134ed2bd9fd.html",
  "/googleb3a4c134ed2bd9fd",
  "/googleb3a4c134ed2bd9fd/",
]);

function verificationResponse() {
  return new NextResponse(GOOGLE_VERIFICATION_BODY, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

export function middleware(request: NextRequest) {
  if (GOOGLE_VERIFICATION_PATHS.has(request.nextUrl.pathname)) {
    return verificationResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/googleb3a4c134ed2bd9fd.html",
    "/googleb3a4c134ed2bd9fd",
    "/googleb3a4c134ed2bd9fd/",
  ],
};
