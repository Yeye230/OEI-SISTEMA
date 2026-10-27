"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DepartmentMap from "@/components/DepartmentMap";

import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Computer,
  Eye,
  FilePlus2,
  FileText,
  Laptop,
  Layers3,
  ListFilter,
  LogOut,
  Menu,
  Monitor,
  MoreVertical,
  Search,
  Settings,
  Users,
} from "lucide-react";

type Acta = {
  id: string;
  date: string;
  person: string;
  equipment: string;
  responsible: string;
  status: "Entregada" | "Pendiente";
};

const demoActs: Acta[] = [
  {
    id: "ACT-2026-0128",
    date: "15/06/2026",
    person: "María González",
    equipment: "Laptop",
    responsible: "Luis Rosales",
    status: "Entregada",
  },
  {
    id: "ACT-2026-0127",
    date: "14/06/2026",
    person: "Carlos Mendoza",
    equipment: "Tablet",
    responsible: "Karla Flores",
    status: "Entregada",
  },
  {
    id: "ACT-2026-0126",
    date: "13/06/2026",
    person: "Ana Martínez",
    equipment: "Proyector",
    responsible: "Luis Rosales",
    status: "Pendiente",
  },
  {
    id: "ACT-2026-0125",
    date: "12/06/2026",
    person: "Juan Pérez",
    equipment: "Laptop",
    responsible: "Luis Rosales",
    status: "Entregada",
  },
  {
    id: "ACT-2026-0124",
    date: "11/06/2026",
    person: "Lucía Ramírez",
    equipment: "Tablet",
    responsible: "Karla Flores",
    status: "Entregada",
  },
];

const monthlyData = [
  { month: "Ene", value: 20 },
  { month: "Feb", value: 30 },
  { month: "Mar", value: 20 },
  { month: "Abr", value: 22 },
  { month: "May", value: 27 },
  { month: "Jun", value: 38 },
];

const equipmentData = [
  { name: "Laptops", count: 52, color: "#075477" },
  { name: "Tablets", count: 46, color: "#398bc9" },
  { name: "Proyectores", count: 18, color: "#79b4e8" },
  { name: "Otros", count: 12, color: "#b5d7f5" },
];

const navigation = [
  { label: "Dashboard", icon: Activity, href: "/" },
  { label: "Nueva acta", icon: FilePlus2, href: "/actas/nueva" },
  { label: "Actas registradas", icon: FileText, href: "/actas" },
  { label: "Equipos", icon: Monitor, href: "/equipos" },
  { label: "Personas", icon: Users, href: "/personas" },
  { label: "Reportes", icon: Layers3, href: "/reportes" },
];

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendType,
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof FileText;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
}) {
  return (
    <article className="group min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[#172b3a]">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f2fa] text-[#075477]">
          <Icon size={23} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-4 flex min-h-5 items-center gap-1.5 text-xs">
        {trendType === "up" && (
          <ArrowUpRight size={15} className="text-emerald-600" />
        )}
        {trendType === "down" && (
          <ArrowDownRight size={15} className="text-red-500" />
        )}
        {trend && (
          <span
            className={
              trendType === "up"
                ? "font-semibold text-emerald-700"
                : trendType === "down"
                  ? "font-semibold text-red-600"
                  : "font-semibold text-slate-600"
            }
          >
            {trend}
          </span>
        )}
        <span className="text-slate-400">{description}</span>
      </div>
    </article>
  );
}

function CalendarPanel() {
  const [monthOffset, setMonthOffset] = useState(0);

  const calendar = useMemo(() => {
    const baseDate = new Date(2026, 5 + monthOffset, 1);
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDay = (baseDate.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const previousMonthDays = new Date(year, month, 0).getDate();
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    return {
      title: baseDate.toLocaleDateString("es-SV", {
        month: "long",
        year: "numeric",
      }),
      days: Array.from({ length: totalCells }, (_, index) => {
        const day = index - firstDay + 1;

        if (day < 1) {
          return {
            day: previousMonthDays + day,
            type: "previous",
            key: `p-${index}`,
          };
        }

        if (day > daysInMonth) {
          return {
            day: day - daysInMonth,
            type: "next",
            key: `n-${index}`,
          };
        }

        return {
          day,
          type: "current",
          key: `c-${day}`,
        };
      }),
    };
  }, [monthOffset]);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[#172b3a]">Calendario</h3>

        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Mes anterior"
            onClick={() => setMonthOffset((value) => value - 1)}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-50"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            aria-label="Mes siguiente"
            onClick={() => setMonthOffset((value) => value + 1)}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 transition hover:bg-slate-50"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-semibold capitalize text-slate-700">
        {calendar.title}
      </p>

      <div className="mt-4 grid grid-cols-7 gap-y-2 text-center">
        {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map((day) => (
          <span
            key={day}
            className="pb-2 text-xs font-medium text-slate-400"
          >
            {day}
          </span>
        ))}

        {calendar.days.map((item) => (
          <span key={item.key} className="flex justify-center">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                item.type !== "current"
                  ? "text-slate-300"
                  : monthOffset === 0 && item.day === 15
                    ? "bg-[#075477] font-semibold text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.day}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Todas");

  const filteredActs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return demoActs.filter((act) => {
      const matchesSearch =
        !query ||
        [
          act.id,
          act.person,
          act.equipment,
          act.responsible,
          act.status,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "Todas" || act.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-800">
      {/* Barra lateral */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-slate-200/80 bg-white px-5 py-7 transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href="/" className="mb-10 block px-3">
          <div className="text-[40px] font-black leading-none tracking-[-0.07em] text-[#172b3a]">
            OEI
          </div>
          <div className="mt-2 h-1 w-9 rounded-full bg-[#075477]" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            Gestión de Actas
          </p>
        </Link>

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Menú principal
        </p>

        <nav className="space-y-1">
          {navigation.map(({ label, icon: Icon, href }, index) => (
            <Link
              key={label}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                index === 0
                  ? "bg-[#e8f2fa] text-[#075477] shadow-[inset_3px_0_0_#075477]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#075477]"
              }`}
            >
              <Icon size={19} strokeWidth={1.8} />
              {label}
              {label === "Actas registradas" && (
                <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                  5
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-100 pt-5">
          <Link
            href="/configuracion"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Settings size={19} />
            Configuración
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <LogOut size={19} />
            Cerrar sesión
          </Link>
        </div>

        <p className="mt-5 px-3 text-[10px] text-slate-400">
          OEI · Sistema administrativo
        </p>
      </aside>

      {/* Fondo para cerrar el menú móvil */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
        />
      )}

      {/* Área principal */}
      <div className="min-h-screen lg:pl-[250px]">
        <header className="sticky top-0 z-[1100] border-b border-slate-200/80 bg-white/95 backdrop-blur">
          <div className="flex min-h-[84px] flex-wrap items-center gap-4 px-5 py-4 sm:px-8">
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-[#172b3a] sm:text-[28px]">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Resumen general del sistema
              </p>
            </div>

            <div className="relative order-3 w-full sm:order-none sm:w-auto sm:flex-1 sm:max-w-[330px]">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar actas, personas o equipos..."
                aria-label="Buscar actas, personas o equipos"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#398bc9] focus:ring-4 focus:ring-[#398bc9]/10"
              />
            </div>

            <div className="relative flex items-center gap-3">
              <button
                type="button"
                aria-label="Notificaciones"
                onClick={() => setShowNotice((value) => !value)}
                className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100"
              >
                <Bell size={19} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#398bc9] ring-2 ring-white" />
              </button>

              {showNotice && (
                <div className="absolute right-0 top-12 z-30 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                  <p className="text-sm font-semibold text-slate-800">
                    Notificaciones
                  </p>
                  <p className="mt-2 text-sm leading-5 text-slate-500">
                    La conexión con las notificaciones reales se configurará
                    más adelante.
                  </p>
                </div>
              )}

              <div className="hidden h-9 w-px bg-slate-200 sm:block" />

              <button
                type="button"
                onClick={() => setShowProfile((value) => !value)}
                className="flex items-center gap-3 rounded-xl p-1.5 text-left transition hover:bg-slate-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f2fa] text-sm font-bold text-[#075477]">
                  LR
                </span>
                <span className="hidden sm:block">
                  <span className="block text-sm font-semibold text-slate-800">
                    Administrador
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    Perfil de usuario
                  </span>
                </span>
                <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
              </button>

              {showProfile && (
                <div className="absolute right-0 top-14 z-30 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <Link
                    href="/configuracion"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <Settings size={16} />
                    Configuración
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1700px] space-y-6 px-5 py-7 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">
                Bienvenido al sistema de gestión
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Vista de demostración · Datos de ejemplo
              </p>
            </div>

            <Link
              href="/actas/nueva"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#075477] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064765]"
            >
              <FilePlus2 size={18} />
              Nueva acta
            </Link>
          </div>

          {/* Indicadores */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Total de actas"
              value="128"
              description="respecto al mes anterior"
              trend="12%"
              trendType="up"
              icon={FileText}
            />
            <MetricCard
              title="Equipos entregados"
              value="96"
              description="respecto al mes anterior"
              trend="8%"
              trendType="up"
              icon={Laptop}
            />
            <MetricCard
              title="Equipos disponibles"
              value="42"
              description="Sin cambios este mes"
              trendType="neutral"
              icon={Layers3}
            />
            <MetricCard
              title="Actas pendientes"
              value="5"
              description="respecto al mes anterior"
              trend="25%"
              trendType="down"
              icon={Clock3}
            />
          </section>

          {/* Gráficas y acciones */}
          <section className="grid gap-5 2xl:grid-cols-[1.35fr_1fr_0.68fr]">
            <article className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#172b3a]">
                    Actas registradas
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Últimos 6 meses
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600">
                  <CalendarDays size={15} />
                  Últimos 6 meses
                </span>
              </div>

              <div className="mt-7 flex h-[215px] min-w-0">
                <div className="flex flex-col justify-between pb-7 pr-3 text-right text-xs text-slate-400">
                  {[40, 30, 20, 10, 0].map((value) => (
                    <span key={value}>{value}</span>
                  ))}
                </div>

                <div className="relative flex min-w-0 flex-1 flex-col">
                  <div className="absolute inset-0 bottom-7 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((line) => (
                      <div
                        key={line}
                        className="w-full border-t border-slate-100"
                      />
                    ))}
                  </div>

                  <div className="relative flex min-h-0 flex-1 items-end justify-around gap-2 px-1">
                    {monthlyData.map((item) => (
                      <div
                        key={item.month}
                        className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                      >
                        <span className="mb-1 text-xs font-semibold text-[#172b3a]">
                          {item.value}
                        </span>
                        <div
                          title={`${item.month}: ${item.value} actas de ejemplo`}
                          className="w-full max-w-12 rounded-t-md bg-gradient-to-t from-[#398bc9] to-[#a9d2f2] transition hover:from-[#075477] hover:to-[#75b7e8]"
                          style={{ height: `${(item.value / 40) * 72}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex h-7 justify-around gap-2 border-t border-slate-200 pt-2">
                    {monthlyData.map((item) => (
                      <span
                        key={item.month}
                        className="min-w-0 flex-1 text-center text-xs text-slate-500"
                      >
                        {item.month}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-[#172b3a]">
                Tipos de equipos entregados
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Distribución de ejemplo
              </p>

              <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                <div
                  className="relative h-[180px] w-[180px] shrink-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(#075477 0% 40.625%, #398bc9 40.625% 76.5625%, #79b4e8 76.5625% 90.625%, #b5d7f5 90.625% 100%)",
                  }}
                  role="img"
                  aria-label="Distribución ilustrativa de tipos de equipos"
                >
                  <div className="absolute inset-[32px] flex flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-3xl font-bold text-[#172b3a]">
                      128
                    </span>
                    <span className="mt-1 text-xs text-slate-500">
                      Equipos
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-4">
                  {equipmentData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="flex min-w-0 items-center gap-2 text-slate-600">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </span>
                      <span className="shrink-0 font-semibold text-slate-800">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#172b3a]">
                  Acciones rápidas
                </h2>
                <ArrowRight size={18} className="text-slate-400" />
              </div>

              <div className="mt-5 space-y-2.5">
                <Link
                  href="/actas/nueva"
                  className="flex min-h-[52px] items-center gap-3 rounded-xl bg-[#075477] px-3.5 py-3 text-sm font-semibold text-white transition hover:bg-[#064765]"
                >
                  <FilePlus2 size={19} />
                  <span className="flex-1">Nueva acta</span>
                  <ChevronRight size={17} />
                </Link>

                <Link
                  href="/actas"
                  className="flex min-h-[52px] items-center gap-3 rounded-xl bg-[#edf4fb] px-3.5 py-3 text-sm font-medium text-[#173d5c] transition hover:bg-[#e0edf8]"
                >
                  <ListFilter size={19} />
                  <span className="flex-1">Consultar actas</span>
                  <ChevronRight size={17} />
                </Link>

                <Link
                  href="/equipos"
                  className="flex min-h-[52px] items-center gap-3 rounded-xl bg-[#edf4fb] px-3.5 py-3 text-sm font-medium text-[#173d5c] transition hover:bg-[#e0edf8]"
                >
                  <Computer size={19} />
                  <span className="flex-1">Gestionar equipos</span>
                  <ChevronRight size={17} />
                </Link>

                <Link
                  href="/personas"
                  className="flex min-h-[52px] items-center gap-3 rounded-xl bg-[#edf4fb] px-3.5 py-3 text-sm font-medium text-[#173d5c] transition hover:bg-[#e0edf8]"
                >
                  <Users size={19} />
                  <span className="flex-1">Gestionar personas</span>
                  <ChevronRight size={17} />
                </Link>
              </div>
            </article>
          </section>

          {/* Rendimiento geográfico: mapa y ranking territorial */}
          <div className="relative z-0 w-full min-w-0">
            <DepartmentMap />
          </div>

          {/* Tabla y calendario */}
          <section className="grid gap-5 2xl:grid-cols-[1fr_268px]">
            <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-6">
                <div>
                  <h2 className="text-lg font-bold text-[#172b3a]">
                    Últimas actas registradas
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Registros recientes de demostración
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="sr-only" htmlFor="status-filter">
                    Filtrar por estado
                  </label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none focus:border-[#398bc9]"
                  >
                    <option>Todas</option>
                    <option>Entregada</option>
                    <option>Pendiente</option>
                  </select>

                  <Link
                    href="/actas"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#075477] hover:text-[#398bc9]"
                  >
                    Ver todas
                    <ChevronRight size={17} />
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto px-4 pb-4 sm:px-6">
                <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-[#f2f6fa] text-xs font-semibold text-slate-500">
                      <th className="rounded-l-lg px-3 py-3">N.º de acta</th>
                      <th className="px-3 py-3">Fecha</th>
                      <th className="px-3 py-3">Persona</th>
                      <th className="px-3 py-3">Equipo</th>
                      <th className="px-3 py-3">Responsable</th>
                      <th className="px-3 py-3">Estado</th>
                      <th className="rounded-r-lg px-3 py-3 text-center">
                        Acción
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredActs.map((act) => (
                      <tr
                        key={act.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="whitespace-nowrap px-3 py-4 font-medium text-[#173d5c]">
                          {act.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-slate-500">
                          {act.date}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-slate-700">
                          {act.person}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-slate-600">
                          {act.equipment}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-slate-600">
                          {act.responsible}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              act.status === "Entregada"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {act.status === "Entregada" ? (
                              <CheckCircle2 size={13} />
                            ) : (
                              <Clock3 size={13} />
                            )}
                            {act.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              title="Consultar acta (demostración)"
                              onClick={() =>
                                window.alert(
                                  `Acta ${act.id}: datos de demostración.`
                                )
                              }
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-[#e8f2fa] hover:text-[#075477]"
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              type="button"
                              title="Más opciones"
                              onClick={() =>
                                window.alert(
                                  "Las opciones de gestión se habilitarán al conectar los datos reales."
                                )
                              }
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                            >
                              <MoreVertical size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredActs.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-12 text-center text-sm text-slate-500"
                        >
                          No se encontraron actas con esos criterios.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-100 px-6 py-3">
                <p className="text-xs text-slate-400">
                  Mostrando {filteredActs.length} de {demoActs.length} registros
                  de demostración
                </p>
              </div>
            </article>

            <CalendarPanel />
          </section>

          <footer className="pb-2 pt-1 text-center text-xs text-slate-400">
            OEI · Gestión de Actas · Interfaz en desarrollo
          </footer>
        </div>
      </div>
    </main>
  );
}