import type { ReactElement } from "react";
import { requireSession } from "@/core/server/auth/session";
import DashboardClient from "./_components/dashboard-client";

export default async function DashboardPage(): Promise<ReactElement> {
  const user = await requireSession();
  return <DashboardClient user={user} />;
}
