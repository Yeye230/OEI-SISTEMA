"use client";

import type { ReactElement } from "react";
import { useSyncExternalStore } from "react";
import { FileCheck2, Monitor, Users, FolderKanban } from "lucide-react";
import MetricCard from "@/components/MetricCard";

type Counts = { actas: number; equipos: number; personas: number; proyectos: number };
const emptyCounts: Counts = { actas: 0, equipos: 0, personas: 0, proyectos: 0 };
let cachedRaw = "";
let cachedCounts = emptyCounts;

const readCounts = (): Counts => {
  const keys = ["actas", "equipos", "personas", "proyectos"];
  const raw = keys.map((key) => window.localStorage.getItem(`oei-demo:${key}:v1`) ?? "[]").join("|");
  if (raw === cachedRaw) return cachedCounts;
  cachedRaw = raw;
  const count = (value: string): number => {
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  };
  cachedCounts = {
    actas: count(window.localStorage.getItem("oei-demo:actas:v1") ?? "[]"),
    equipos: count(window.localStorage.getItem("oei-demo:equipos:v1") ?? "[]"),
    personas: count(window.localStorage.getItem("oei-demo:personas:v1") ?? "[]"),
    proyectos: count(window.localStorage.getItem("oei-demo:proyectos:v1") ?? "[]")
  };
  return cachedCounts;
};

const subscribe = (callback: () => void): (() => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("oei-workspace-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("oei-workspace-change", callback);
  };
};

export function DashboardMetrics(): ReactElement {
  const counts = useSyncExternalStore(subscribe, readCounts, () => emptyCounts);
  const metrics = [
    { title: "Actas registradas", icon: FileCheck2, iconColor: "#0f766e", iconBg: "#ccfbf1", tint: "#ccfbf1", value: counts.actas.toLocaleString("es-SV"), description: "Actas guardadas en este navegador" },
    { title: "Equipos", icon: Monitor, iconColor: "#1d4ed8", iconBg: "#dbeafe", tint: "#dbeafe", value: String(counts.equipos), description: "Registros de inventario local" },
    { title: "Personas", icon: Users, iconColor: "#047857", iconBg: "#d1fae5", tint: "#d1fae5", value: String(counts.personas), description: "Personas registradas localmente" },
    { title: "Proyectos", icon: FolderKanban, iconColor: "#7c3aed", iconBg: "#ede9fe", tint: "#ede9fe", value: String(counts.proyectos), description: "Proyectos de demostración" }
  ] as const;

  return (
    <section aria-label="Indicadores generales" className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {metrics.map((metric) => <MetricCard key={metric.title} {...metric} />)}
    </section>
  );
}
