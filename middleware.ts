import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** Served at exact path required by Google Search Console (bypasses cleanUrls redirect). */
const GOOGLE_VERIFICATION_PATH = "/googleb3a4c134ed2bd9fd.html";
const GOOGLE_VERIFICATION_BODY =
  "google-site-verification: googleb3a4c134ed2bd9fd.html";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === GOOGLE_VERIFICATION_PATH) {
    return new NextResponse(GOOGLE_VERIFICATION_BODY, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/googleb3a4c134ed2bd9fd.html",
};
