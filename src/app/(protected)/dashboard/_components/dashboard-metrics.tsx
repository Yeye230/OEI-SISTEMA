import type { ReactElement } from "react";
import { Activity, FileCheck2, MapPinned, TrendingUp } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import { departmentStats, recentActivity } from "@/core/utils/demo-data";

const totalActas = departmentStats.reduce((total, department) => total + department.actas, 0);
const averageProgress = departmentStats.length
  ? departmentStats.reduce((total, department) => total + department.avance, 0) / departmentStats.length
  : 0;

const metrics = [
  {
    title: "Actas registradas",
    icon: FileCheck2,
    iconColor: "#0f766e",
    iconBg: "#ccfbf1",
    tint: "#ccfbf1",
    value: totalActas.toLocaleString("es-SV"),
    description: "Total incluido en los datos de ejemplo"
  },
  {
    title: "Departamentos",
    icon: MapPinned,
    iconColor: "#1d4ed8",
    iconBg: "#dbeafe",
    tint: "#dbeafe",
    value: String(departmentStats.length),
    description: "Departamentos incluidos en la muestra"
  },
  {
    title: "Avance promedio",
    icon: TrendingUp,
    iconColor: "#047857",
    iconBg: "#d1fae5",
    tint: "#d1fae5",
    value: `${averageProgress.toFixed(1)}%`,
    description: "Promedio de avance de demostración"
  },
  {
    title: "Movimientos recientes",
    icon: Activity,
    iconColor: "#7c3aed",
    iconBg: "#ede9fe",
    tint: "#ede9fe",
    value: String(recentActivity.length),
    description: "Actividades ficticias de ejemplo"
  }
] as const;

export function DashboardMetrics(): ReactElement {
  return (
    <section
      aria-label="Indicadores generales"
      className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
    >
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </section>
  );
}
