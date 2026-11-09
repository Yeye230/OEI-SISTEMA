"use client";

import { useState, type ReactElement } from "react";
import DepartmentMap from "@/components/DepartmentMap";
import MonthlyChart from "@/components/MonthlyChart";
import RecentActivity from "@/components/RecentActivity";
import TerritorialRanking from "@/components/TerritorialRanking";
import { type Metric } from "@/core/utils/demo-data";
import { DashboardPanel } from "./dashboard-panel";

export function DashboardAnalytics(): ReactElement {
  const [metric, setMetric] = useState<Metric>("avance");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  return (
    <>
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
    </>
  );
}
