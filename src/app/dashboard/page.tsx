import { requireSession } from "@/core/server/auth/session";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const user = await requireSession();
  return <DashboardClient user={user} />;
}
