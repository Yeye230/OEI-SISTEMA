"use server";

import { redirect } from "next/navigation";
import { revokeSession } from "@/core/server/auth/session";
import { clearSessionCookie } from "@/core/server/auth/session-cookie";

export async function logoutDashboardAction(): Promise<void> {
  try {
    await revokeSession();
  } catch {
    // Se limpia la cookie local aunque el servicio de autenticación no responda.
  }

  await clearSessionCookie();
  redirect("/auth/iniciar-sesion");
}
