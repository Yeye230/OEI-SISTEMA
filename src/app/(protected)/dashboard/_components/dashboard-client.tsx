"use client";

import { useState, type ReactElement } from "react";
import { Activity, FileCheck2, MapPinned, TrendingUp } from "lucide-react";
import DepartmentMap from "@/components/DepartmentMap";
import MetricCard from "@/components/MetricCard";
import MonthlyChart from "@/components/MonthlyChart";
import RecentActivity from "@/components/RecentActivity";
import Sidebar from "@/components/Sidebar";
import TerritorialRanking from "@/components/TerritorialRanking";
import Topbar from "@/components/Topbar";
import { departmentStats, recentActivity, type Metric } from "@/core/utils/demo-data";
import { DashboardHeading } from "./dashboard-heading";
import { DashboardPanel } from "./dashboard-panel";

const metrics = [
  {
    title: "Actas registradas",
    icon: FileCheck2,
    iconColor: "#0f766e",
    iconBg: "#ccfbf1",
    tint: "#ccfbf1",
    description: "Total incluido en los datos de ejemplo"
  },
  {
    title: "Departamentos",
    icon: MapPinned,
    iconColor: "#1d4ed8",
    iconBg: "#dbeafe",
    tint: "#dbeafe",
    description: "Departamentos incluidos en la muestra"
  },
  {
    title: "Avance promedio",
    icon: TrendingUp,
    iconColor: "#047857",
    iconBg: "#d1fae5",
    tint: "#d1fae5",
    description: "Promedio de avance de demostración"
  },
  {
    title: "Movimientos recientes",
    icon: Activity,
    iconColor: "#7c3aed",
    iconBg: "#ede9fe",
    tint: "#ede9fe",
    description: "Actividades ficticias de ejemplo"
  }
] as const;

const totalActas = departmentStats.reduce((total, department) => total + department.actas, 0);
const averageProgress = departmentStats.length
  ? departmentStats.reduce((total, department) => total + department.avance, 0) / departmentStats.length
  : 0;

export default function DashboardClient(): ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);
  const [metric, setMetric] = useState<Metric>("avance");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const values = [
    totalActas.toLocaleString("es-SV"),
    String(departmentStats.length),
    `${averageProgress.toFixed(1)}%`,
    String(recentActivity.length)
  ];

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

          <section aria-label="Indicadores generales" className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {metrics.map((item, index) => (
              <MetricCard
                key={item.title}
                {...item}
                value={values[index]}
              />
            ))}
          </section>

          <div className="grid min-w-0 grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
            <DashboardPanel>
              <DepartmentMap
                metric={metric}
                onMetricChange={setMetric}
                selected={selectedDepartment}
                onSelect={setSelectedDepartment}
              />
            </DashboardPanel>

            <DashboardPanel>
              <TerritorialRanking
                selected={selectedDepartment}
                onSelect={setSelectedDepartment}
              />
            </DashboardPanel>
          </div>

          <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
            <DashboardPanel>
              <MonthlyChart />
            </DashboardPanel>
            <DashboardPanel>
              <RecentActivity />
            </DashboardPanel>
          </div>
        </main>
      </div>
    </div>
  );
}
