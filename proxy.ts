import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_SIGNIN_ROUTE = "/auth/iniciar-sesion";
const PROTECTED_ROUTES = ["/altar", "/admin"];
const PUBLIC_AUTH_ROUTES = ["/", "/auth", "/auth/iniciar-sesion"];

const isProtectedPath = (pathname: string): boolean =>
  PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

const isPublicAuthPath = (pathname: string): boolean => PUBLIC_AUTH_ROUTES.includes(pathname);

const isKnownPath = (pathname: string): boolean =>
  isProtectedPath(pathname) || isPublicAuthPath(pathname) || pathname === "/";

export function proxy(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get("session_token")?.value;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(sessionToken ? "/altar" : AUTH_SIGNIN_ROUTE, request.url));
  }

  // Authenticated user trying to access auth routes -> redirect to the dashboard
  if (isPublicAuthPath(pathname) && sessionToken) {
    return NextResponse.redirect(new URL("/altar", request.url));
  }

  // Unknown route or route without permission -> redirect to sign in
  if (!isKnownPath(pathname)) {
    return NextResponse.redirect(new URL(sessionToken ? "/altar" : AUTH_SIGNIN_ROUTE, request.url));
  }

  // Unprotected route -> allow access
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  // Protected route with a valid session -> allow access
  if (sessionToken) {
    return NextResponse.next();
  }

  // Protected route without a session -> redirect to sign in
  return NextResponse.redirect(new URL(AUTH_SIGNIN_ROUTE, request.url));
}

export const config = {
  matcher: ["/", "/auth/:path*", "/altar/:path*", "/admin/:path*"]
};
