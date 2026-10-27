import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from './core/server/auth/session-config';

const AUTH_SIGNIN_ROUTE = "/auth/iniciar-sesion";
const PROTECTED_ROUTES = ["/dashboard"];
const PUBLIC_AUTH_ROUTES = ["/", "/auth", "/auth/iniciar-sesion"];

const isProtectedPath = (pathname: string): boolean =>
  PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

const isPublicAuthPath = (pathname: string): boolean => PUBLIC_AUTH_ROUTES.includes(pathname);

const isKnownPath = (pathname: string): boolean =>
  isProtectedPath(pathname) || isPublicAuthPath(pathname) || pathname === "/";

export function proxy(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(sessionToken ? "/dashboard" : AUTH_SIGNIN_ROUTE, request.url));
  }

  // A cookie only signals a possible session; server pages and backend APIs
  // must still verify the session and authorization before returning data.
  if (isPublicAuthPath(pathname) && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isKnownPath(pathname)) {
    return NextResponse.redirect(new URL(sessionToken ? "/dashboard" : AUTH_SIGNIN_ROUTE, request.url));
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (sessionToken) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(AUTH_SIGNIN_ROUTE, request.url));
}

export const config = {
  matcher: ["/", "/auth/:path*", "/dashboard/:path*", "/admin/:path*"]
};
