import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE_NAME } from "@/core/server/auth/demo-session-config";

const LOGIN_ROUTE = "/login";
const DASHBOARD_ROUTE = "/dashboard";

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Remove tracking parameters from the login URL so the app keeps a clean address.
  if (pathname === LOGIN_ROUTE) {
    const trackingParameters = [...request.nextUrl.searchParams.keys()].filter((key) =>
      key.toLowerCase().startsWith("utm_")
    );

    if (trackingParameters.length > 0) {
      const cleanUrl = request.nextUrl.clone();
      trackingParameters.forEach((key) => cleanUrl.searchParams.delete(key));
      return NextResponse.redirect(cleanUrl);
    }
  }

  const hasDemoSession =
    request.cookies.get(DEMO_SESSION_COOKIE_NAME)?.value === "active";

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(hasDemoSession ? DASHBOARD_ROUTE : LOGIN_ROUTE, request.url)
    );
  }

  if (pathname === LOGIN_ROUTE && hasDemoSession) {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url));
  }

  if (pathname === DASHBOARD_ROUTE || pathname.startsWith(`${DASHBOARD_ROUTE}/`)) {
    if (!hasDemoSession) {
      return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  return NextResponse.redirect(
    new URL(hasDemoSession ? DASHBOARD_ROUTE : LOGIN_ROUTE, request.url)
  );
}

export const config = {
  matcher: ["/", "/login/:path*", "/dashboard/:path*", "/admin/:path*"]
};
