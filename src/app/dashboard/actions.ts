"use server";

import { redirect } from "next/navigation";
import { clearDemoSessionCookie } from "@/core/server/auth/demo-session";

export async function logoutDashboardAction(): Promise<void> {
  await clearDemoSessionCookie();
  redirect("/login");
}
