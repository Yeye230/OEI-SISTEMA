import { cookies } from "next/headers";

export const DEMO_SESSION_COOKIE_NAME = "oei_demo_session";
const DEMO_SESSION_VALUE = "active";
const DEMO_SESSION_MAX_AGE = 60 * 60 * 8;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: DEMO_SESSION_MAX_AGE
};

export async function hasDemoSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(DEMO_SESSION_COOKIE_NAME)?.value === DEMO_SESSION_VALUE;
}

export async function setDemoSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE_NAME, DEMO_SESSION_VALUE, cookieOptions);
}

export async function clearDemoSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE_NAME, "", { ...cookieOptions, maxAge: 0 });
}
