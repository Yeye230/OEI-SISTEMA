import { Suspense } from "react";
import { requireSession } from "@/core/server/auth/session";
import DashboardClient from "./dashboard-client";

async function DashboardContent(): Promise<React.JSX.Element> {
  const user = await requireSession();
  return <DashboardClient user={user} />;
}

export default function DashboardPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div className="eq-dashboard-loading">Cargando Equipment Hub...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
