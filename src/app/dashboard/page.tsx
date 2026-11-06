import { Suspense } from "react";
import { redirect } from "next/navigation";
import { hasDemoSession } from "@/core/server/auth/demo-session";
import type { AppUser } from "@/core/server/types";
import DashboardClient from "./dashboard-client";
import "./dashboard.css";

const demoUser: AppUser = {
  id: "demo-user",
  name: "Usuario de demostración",
  email: "demo@oei.local",
  emailVerified: true,
  image: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  lastLoginDate: null,
  roleId: 1,
  roleName: "ADMIN"
};

async function DashboardContent(): Promise<React.JSX.Element> {
  const hasSession = await hasDemoSession();

  if (!hasSession) {
    redirect("/login");
  }

  return <DashboardClient user={demoUser} />;
}

export default function DashboardPage(): React.JSX.Element {
  return (
    <Suspense fallback={<div className="eq-dashboard-loading">Cargando Equipment Hub...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
