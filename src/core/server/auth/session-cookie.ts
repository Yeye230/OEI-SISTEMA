import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DEFAULT_AUTH_REDIRECT_PATH } from "../urls";
import { SESSION_COOKIE_NAME } from "./session-config";

export { SESSION_COOKIE_NAME } from "./session-config";

const parsePositiveNumberEnv = (value: string | undefined, fallback: number): number => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

const resolveSameSiteEnv = (): "lax" | "strict" | "none" => {
  const sameSiteValue =
    process.env.SESSION_COOKIE_SAME_SITE ?? process.env.NEXT_PUBLIC_SESSION_COOKIE_SAME_SITE;
  return sameSiteValue === "strict" || sameSiteValue === "none" ? sameSiteValue : "lax";
};

const SESSION_COOKIE_SAME_SITE: "lax" | "strict" | "none" = resolveSameSiteEnv();

const SESSION_COOKIE_MAX_AGE = parsePositiveNumberEnv(
  process.env.SESSION_COOKIE_MAX_AGE ?? process.env.NEXT_PUBLIC_SESSION_COOKIE_MAX_AGE,
  60 * 60 * 24 * 7
);

const VERIFY_EMAIL_COOKIE_NAME = "verify_email";
const OTP_COOKIE_NAME = "verify_code";

const SESSION_COOKIE_DOMAIN =
  process.env.SESSION_COOKIE_DOMAIN ?? process.env.NEXT_PUBLIC_SESSION_COOKIE_DOMAIN;

const buildCookieOptions = (): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  maxAge?: number;
  path: string;
  domain?: string;
} => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: SESSION_COOKIE_SAME_SITE,
  maxAge: SESSION_COOKIE_MAX_AGE,
  path: "/",
  ...(SESSION_COOKIE_DOMAIN ? { domain: SESSION_COOKIE_DOMAIN } : {})
});

const buildVerifyEmailCookieOptions = (): ReturnType<typeof buildCookieOptions> => ({
  ...buildCookieOptions(),
  maxAge: undefined
});

const setCookie = async (
  name: string,
  value: string,
  options: ReturnType<typeof buildCookieOptions>
): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, options);
};

const clearCookie = async (
  name: string,
  options: ReturnType<typeof buildCookieOptions>
): Promise<void> =>
  setCookie(name, "", {
    ...options,
    maxAge: 0
  });

export const setSessionCookie = async (token: string): Promise<void> => {
  await setCookie(SESSION_COOKIE_NAME, token, buildCookieOptions());
};

export const clearSessionCookie = async (): Promise<void> => {
  await clearCookie(SESSION_COOKIE_NAME, buildCookieOptions());
};

export const setVerifyEmailCookie = async (email: string): Promise<void> => {
  await setCookie(VERIFY_EMAIL_COOKIE_NAME, email, buildVerifyEmailCookieOptions());
};

export const getVerifyEmailCookie = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(VERIFY_EMAIL_COOKIE_NAME)?.value ?? null;
};

export const clearVerifyEmailCookie = async (): Promise<void> => {
  await clearCookie(VERIFY_EMAIL_COOKIE_NAME, buildVerifyEmailCookieOptions());
};

export const setOtpCookie = async (email: string): Promise<void> => {
  await setCookie(OTP_COOKIE_NAME, email, buildVerifyEmailCookieOptions());
};

export const getOtpCookie = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(OTP_COOKIE_NAME)?.value ?? null;
};

export const clearOtpCookie = async (): Promise<void> => {
  await clearCookie(OTP_COOKIE_NAME, buildVerifyEmailCookieOptions());
};

export const resolveRedirectPath = (request: Request): string => {
  const requestUrl = new URL(request.url);
  const redirectTarget = requestUrl.searchParams.get("redirect");

  if (!redirectTarget) {
    return DEFAULT_AUTH_REDIRECT_PATH;
  }

  if (!redirectTarget.startsWith("/") || redirectTarget.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT_PATH;
  }

  return redirectTarget;
};

export const buildRedirectResponse = (request: Request, status = 303): NextResponse =>
  NextResponse.redirect(new URL(resolveRedirectPath(request), request.url), { status });
