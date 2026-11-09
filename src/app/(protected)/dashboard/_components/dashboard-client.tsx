"use client";

import { useState, type ReactElement } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { DashboardAnalytics } from "./dashboard-analytics";
import { DashboardHeading } from "./dashboard-heading";
import { DashboardMetrics } from "./dashboard-metrics";

export default function DashboardClient(): ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="min-h-screen min-w-0 lg:pl-64">
        <Topbar onMenu={() => setMenuOpen(true)} />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 xl:p-8">
          <DashboardHeading
            title="Panel principal"
            description="Resumen general de la gestión institucional y sus movimientos."
          />
          <DashboardMetrics />
          <DashboardAnalytics />
        </main>
      </div>
    </div>
  );
}
