import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Clone the response
  const response = NextResponse.next();

  // Add cache control headers to prevent aggressive caching
  response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    // Apply to all routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
