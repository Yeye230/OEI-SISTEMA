import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { INVALID_SESSION_REDIRECT_PATH } from "../urls";
import { AppUser, BackendResponse } from "../types";
import { SESSION_COOKIE_NAME } from "./session-cookie";
import { APP_ROLES, AppRole } from "../rolres";

const BACKEND_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;
const BACKEND_PROFILE_URL = `${BACKEND_AUTH_URL}/profile`;
const BACKEND_LOGOUT_URL = `${BACKEND_AUTH_URL}/logout`;
const DEMO_COOKIE_NAME = "oei_demo_session";

export const getSessionToken = cache(async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
});

const buildAuthHeaders = (sessionToken: string): HeadersInit => ({
  Authorization: `Bearer ${sessionToken}`
});

export const verifySession = cache(async (): Promise<AppUser | null> => {
  const cookieStore = await cookies();
  if (process.env.NODE_ENV !== "production" && cookieStore.get(DEMO_COOKIE_NAME)?.value === "local-demo") {
    const now = new Date().toISOString();
    return {
      id: "demo-admin",
      name: "Administrador de demostración",
      email: "demo@oei.local",
      emailVerified: true,
      image: null,
      createdAt: now,
      updatedAt: now,
      lastLoginDate: now,
      roleId: 1,
      roleName: APP_ROLES.admin
    };
  }

  const sessionToken = await getSessionToken();
  if (!sessionToken) return null;

  const response = await fetch(BACKEND_PROFILE_URL, {
    method: "GET",
    headers: buildAuthHeaders(sessionToken),
    cache: "no-store"
  });
  if (!response.ok) return null;

  const payload = (await response.json().catch(() => null)) as BackendResponse<AppUser> | null;
  return payload?.data ?? null;
});

export const requireSession = cache(async (): Promise<AppUser> => {
  const cookieStore = await cookies();
  if (process.env.NODE_ENV !== "production" && cookieStore.get(DEMO_COOKIE_NAME)?.value === "local-demo") {
    const demoUser = await verifySession();
    if (demoUser) return demoUser;
  }

  const sessionToken = await getSessionToken();
  if (!sessionToken) redirect("/");
  const user = await verifySession();
  if (!user) redirect(INVALID_SESSION_REDIRECT_PATH);
  return user;
});

export const requireRole = cache(async (allowedRoles: readonly AppRole[]): Promise<AppUser> => {
  const user = await requireSession();
  if (!user.roleName || !allowedRoles.includes(user.roleName)) redirect("/altar");
  return user;
});

export const requireAdminAccess = cache(async (): Promise<AppUser> => requireRole([APP_ROLES.admin]));

export const revokeSession = async (): Promise<boolean> => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) return false;
  const response = await fetch(BACKEND_LOGOUT_URL, {
    method: "POST",
    headers: buildAuthHeaders(sessionToken),
    cache: "no-store"
  });
  return response.ok;
};
