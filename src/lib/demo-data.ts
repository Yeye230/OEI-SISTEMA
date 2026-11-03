
export type Metric = "avance" | "actas";

export type DepartmentStat = {
  name: string;
  key: string;
  avance: number;
  actas: number;
};

/**
 * Normaliza nombres de departamentos para compararlos con el GeoJSON.
 */
export function normalizeName(name: string): string {
  return name
    .replace(/^Departamento de\s+/i, "")
    .replace(/\s+Department$/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * DATOS DE DEMOSTRACIÓN.
 * Sustituir por datos reales cuando se conecte la base de datos.
 */
const raw: Array<[string, number, number]> = [
  ["Santa Ana", 66.2, 504],
  ["San Salvador", 62, 476],
  ["San Miguel", 83, 471],
  ["La Libertad", 73.9, 417],
  ["Usulután", 76.6, 390],
  ["La Unión", 76, 321],
  ["Sonsonate", 73.1, 319],
  ["Ahuachapán", 80.4, 290],
  ["La Paz", 68.1, 280],
  ["Chalatenango", 65.3, 260],
  ["Cuscatlán", 83.7, 240],
  ["San Vicente", 77.4, 190],
  ["Cabañas", 67.6, 180],
  ["Morazán", 86.2, 170],
];

export const departmentStats: DepartmentStat[] = raw
  .map(([name, avance, actas]) => ({
    name,
    key: normalizeName(name),
    avance,
    actas,
  }))
  .sort((a, b) => b.actas - a.actas);

export const statsByKey = Object.fromEntries(
  departmentStats.map((item) => [item.key, item]),
) as Record<string, DepartmentStat>;

/* ---------- Leyendas y colores del mapa ---------- */

export const avanceLegend = [
  { label: "≥ 85%", color: "#14b87a" },
  { label: "75–84%", color: "#1aa5b8" },
  { label: "65–74%", color: "#fbbf24" },
  { label: "55–64%", color: "#fb923c" },
  { label: "< 55%", color: "#f87171" },
];

export const actasLegend = [
  { label: "≥ 450", color: "#0b4a6b" },
  { label: "350–449", color: "#1879a8" },
  { label: "250–349", color: "#3fa3cf" },
  { label: "200–249", color: "#8cc9e6" },
  { label: "< 200", color: "#c9e6f4" },
];

export function avanceColor(value: number): string {
  if (value >= 85) return avanceLegend[0].color;
  if (value >= 75) return avanceLegend[1].color;
  if (value >= 65) return avanceLegend[2].color;
  if (value >= 55) return avanceLegend[3].color;
  return avanceLegend[4].color;
}

export function actasColor(value: number): string {
  if (value >= 450) return actasLegend[0].color;
  if (value >= 350) return actasLegend[1].color;
  if (value >= 250) return actasLegend[2].color;
  if (value >= 200) return actasLegend[3].color;
  return actasLegend[4].color;
}

/* ---------- Colores del ranking territorial ---------- */

export const rankColors = [
  "#14b87a",
  "#14b8a6",
  "#2f7de1",
  "#fbbf24",
  "#fb7f6b",
  "#8b5cf6",
  "#93c5fd",
  "#bfdbfe",
];

/* ---------- Datos mensuales de demostración ---------- */

export type MonthlyItem = {
  month: string;
  value: number;
  from: string;
  to: string;
};

export const monthlyData: MonthlyItem[] = [
  { month: "Ene", value: 20, from: "#22c7cf", to: "#47d9d2" },
  { month: "Feb", value: 30, from: "#6d4de0", to: "#9a74f0" },
  { month: "Mar", value: 20, from: "#f9736b", to: "#fb9a8f" },
  { month: "Abr", value: 22, from: "#f9a90f", to: "#fdc94a" },
  { month: "May", value: 27, from: "#1d7be0", to: "#3b9bf0" },
  { month: "Jun", value: 38, from: "#10b981", to: "#34d9a1" },
];

/* ---------- Actividad reciente de demostración ---------- */

export type ActivityItem = {
  kind: "acta" | "equipo" | "pendiente" | "persona" | "disponible";
  title: string;
  subtitle: string;
  time: string;
  status:
    | "Completada"
    | "Entregado"
    | "Pendiente"
    | "Registrada"
    | "Disponible";
};

export const recentActivity: ActivityItem[] = [
  {
    kind: "acta",
    title: "Nueva acta registrada",
    subtitle: "Centro Escolar San José",
    time: "Hoy, 10:24",
    status: "Completada",
  },
  {
    kind: "equipo",
    title: "Equipo entregado",
    subtitle: "Laptop - Inventario #OEI-001",
    time: "Hoy, 09:18",
    status: "Entregado",
  },
  {
    kind: "pendiente",
    title: "Acta pendiente",
    subtitle: "Centro Escolar La Esperanza",
    time: "Ayer, 16:45",
    status: "Pendiente",
  },
  {
    kind: "persona",
    title: "Persona registrada",
    subtitle: "Docente agregado al sistema",
    time: "Ayer, 11:30",
    status: "Registrada",
  },
  {
    kind: "disponible",
    title: "Equipo disponible",
    subtitle: "Tablet - Inventario #OEI-045",
    time: "15 Oct, 14:20",
    status: "Disponible",
  },
];
