import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from './core/server/auth/session-config';

const AUTH_SIGNIN_ROUTE = "/auth/iniciar-sesion";
const DEMO_COOKIE_NAME = "oei_demo_session";
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
  const hasDemoSession =
    process.env.NODE_ENV !== "production" &&
    request.cookies.get(DEMO_COOKIE_NAME)?.value === "local-demo";
  const hasSession = Boolean(sessionToken || hasDemoSession);

  if (pathname === "/") {
    return NextResponse.redirect(new URL(hasSession ? "/dashboard" : AUTH_SIGNIN_ROUTE, request.url));
  }

  // La cookie demo solo es válida en desarrollo; las páginas privadas verifican la sesión en servidor.
  if (isPublicAuthPath(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isKnownPath(pathname)) {
    return NextResponse.redirect(new URL(hasSession ? "/dashboard" : AUTH_SIGNIN_ROUTE, request.url));
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (hasSession) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(AUTH_SIGNIN_ROUTE, request.url));
}

export const config = {
  matcher: ["/", "/auth/:path*", "/dashboard/:path*", "/admin/:path*"]
};
