"use client";

import { useMemo, useState } from "react";
import {
  Activity, Bell, CalendarDays, CheckCircle2, ChevronDown, Clock3,
  FileText, Filter, Laptop, LogOut, MapPin, Menu, Monitor, Plus,
  Printer, Search, Settings, ShieldCheck, Smartphone, Tablet, Wifi, X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AppUser } from "@/core/server/types";
import { logoutDashboardAction } from "./actions";
import WorkspaceSection, { type WorkspaceSectionKey } from "./workspace-sections";

type Assignment = {
  id: string; type: "Tablet" | "Computadora"; employee: string; position: string;
  model: string; serial: string; battery: string; location: string;
  status: "Pendiente" | "Verificado"; accessories: { name: string; verified: boolean }[];
};

const assignments: Assignment[] = [
  { id: "OEI-2026-0187", type: "Tablet", employee: "María José Alvarado", position: "Coordinadora de Proyectos · OEI", model: "Samsung · Galaxy Tab A9", serial: "SM-X110-88291", battery: "96%", location: "San Salvador", status: "Pendiente", accessories: [{ name: "Cable", verified: true }, { name: "Cargador", verified: true }, { name: "Estuche", verified: false }] },
  { id: "OEI-2026-0188", type: "Computadora", employee: "Carlos Alberto Menjívar", position: "Analista TIC · Tecnología", model: "Lenovo · ThinkPad E14", serial: "PF3-2287-1145", battery: "100%", location: "Santa Tecla", status: "Verificado", accessories: [{ name: "Cargador", verified: true }, { name: "Mouse", verified: true }, { name: "Mochila", verified: true }] }
];

const navigation: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Hub", href: "/dashboard", icon: Activity },
  { label: "Actas", href: "/actas", icon: FileText },
  { label: "Personas", href: "/personas", icon: Smartphone },
  { label: "Proyectos", href: "/proyectos", icon: Monitor },
  { label: "Inventario", href: "/inventario", icon: ShieldCheck },
  { label: "Historial", href: "/historial", icon: Clock3 },
  { label: "Reportes", href: "/reportes", icon: Activity },
  { label: "Ajustes", href: "/ajustes", icon: Settings }
];
const filters = [
  { label: "Todos", value: "todos" },
  { label: "Tablets", value: "tablet" },
  { label: "Computadoras", value: "computadora" },
  { label: "Proyectores", value: "proyector" }
] as const;

function getInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function AssignmentCard({ assignment, onOpenActas }: { assignment: Assignment; onOpenActas: () => void }): React.JSX.Element {
  const isTablet = assignment.type === "Tablet";
  const DeviceIcon = isTablet ? Tablet : Laptop;
  const verified = assignment.accessories.filter((item) => item.verified).length;
  return (
    <article className="eq-assignment-card">
      <div className="eq-assignment-top">
        <div className={`eq-device-icon ${isTablet ? "is-tablet" : "is-computer"}`}><DeviceIcon size={22} /></div>
        <div className="eq-assignment-info">
          <div className="eq-assignment-meta"><span className="eq-device-type"><DeviceIcon size={12} />{assignment.type}</span><span className="eq-acta-code">{assignment.id}</span></div>
          <h3>{assignment.employee}</h3><p>{assignment.position}</p>
        </div>
        <span className={`eq-status ${assignment.status === "Verificado" ? "is-verified" : "is-pending"}`}>{assignment.status}</span>
      </div>
      <div className="eq-device-details">
        <span><Settings size={13} />{assignment.model}</span><span><Monitor size={13} />{assignment.serial}</span><span><Activity size={13} />{assignment.battery}</span>
      </div>
      <div className="eq-accessory-heading"><span>Accesorios</span><span>{verified}/{assignment.accessories.length} verificados</span></div>
      <div className="eq-accessories">
        {assignment.accessories.map((item) => <span key={item.name} className={`eq-accessory ${item.verified ? "is-checked" : "is-unchecked"}`}>{item.verified ? <CheckCircle2 size={12} /> : <i />}{item.name}</span>)}
      </div>
      <div className="eq-progress"><span style={{ width: `${(verified / assignment.accessories.length) * 100}%` }} /></div>
      <div className="eq-assignment-footer">
        <span><MapPin size={14} />{assignment.location}</span>
        <button type="button" onClick={onOpenActas}><Printer size={14} />{assignment.status === "Verificado" ? "Ver acta" : "Revisar acta"}</button>
      </div>
    </article>
  );
}

export default function DashboardClient({ user }: { user: AppUser }): React.JSX.Element {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["value"]>("todos");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<WorkspaceSectionKey>("Hub");
  const selectSection = (section: WorkspaceSectionKey) => {
    setActiveSection(section);
    setMenuOpen(false);
  };
  const userName = user.name?.trim() || "Usuario OEI";
  const roleLabel = user.roleName === "ADMIN" ? "Administrador" : "Usuario";
  const dateLabel = "hoy";
  const visibleAssignments = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");
    return assignments.filter((item) => {
      const matchesFilter = activeFilter === "todos" || (activeFilter === "tablet" && item.type === "Tablet") || (activeFilter === "computadora" && item.type === "Computadora");
      const matchesSearch = !query || [item.id, item.employee, item.position, item.model, item.serial].some((value) => value.toLocaleLowerCase("es").includes(query));
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  return (
    <div className="eq-app">
      <aside className={`eq-sidebar ${menuOpen ? "is-open" : ""}`}>
        <button type="button" className="eq-brand eq-brand-button" onClick={() => selectSection("Hub")}><span className="eq-brand-mark">OEI</span><span className="eq-brand-copy"><strong>Equipment Hub</strong><small>OEI · El Salvador</small></span></button>
        <p className="eq-nav-label">Espacio de trabajo</p>
        <nav className="eq-nav" aria-label="Navegación principal">
          {navigation.map(({ label, icon: Icon }) => <button key={label} type="button" className={`eq-nav-link ${activeSection === label ? "is-active" : ""}`} aria-current={activeSection === label ? "page" : undefined} onClick={() => selectSection(label as WorkspaceSectionKey)}><Icon size={17} /><span>{label}</span>{label === "Actas" && <span className="eq-nav-count">4</span>}{label === "Inventario" && <span className="eq-nav-count">46</span>}</button>)}
        </nav>
        <form action={logoutDashboardAction} className="eq-logout-form"><button type="submit" className="eq-logout-button"><LogOut size={17} />Cerrar sesión</button></form>
      </aside>

      {menuOpen && <button type="button" className="eq-mobile-backdrop" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}
      <div className="eq-main">
        <header className="eq-topbar">
          <button type="button" className="eq-mobile-menu" aria-label="Abrir menú" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
          <div className="eq-global-search" role="search"><Search size={17} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por empleado, serial, código de acta..." aria-label="Buscar por empleado, serial o código de acta" />{search && <button type="button" aria-label="Limpiar búsqueda" onClick={() => setSearch("")}><X size={15} /></button>}</div>
          <span className="eq-live-pill"><span />LIVE</span>
          <button type="button" className="eq-verification-pill" onClick={() => selectSection("Actas")}><Printer size={15} />Pendiente de verificación</button>
          <button type="button" className="eq-new-button" onClick={() => selectSection("Actas")}><Plus size={17} />Nueva</button>
          <details className="eq-popover"><summary className="eq-icon-button" aria-label="Notificaciones"><Bell size={18} /><span className="eq-notification-dot" /></summary><div className="eq-popover-panel eq-notice-panel"><strong>Notificaciones</strong><p>Tienes 2 accesorios pendientes de verificación.</p><span>Última actualización: hace unos minutos</span></div></details>
          <details className="eq-popover eq-profile-popover"><summary className="eq-profile-button"><span className="eq-avatar">{getInitials(userName)}</span><span className="eq-profile-copy"><strong>{userName}</strong><small>{roleLabel}</small></span><ChevronDown size={15} /></summary><div className="eq-popover-panel eq-profile-panel"><div className="eq-profile-panel-user"><strong>{userName}</strong><span>{user.email}</span></div><button type="button" onClick={() => selectSection("Ajustes")}><Settings size={15} />Ajustes</button><form action={logoutDashboardAction}><button type="submit"><LogOut size={15} />Cerrar sesión</button></form></div></details>
        </header>

        <main className="eq-content">
          <div className="eq-heading-row">
            <div>
              <div className="eq-breadcrumb"><span><Activity size={13} />OEI El Salvador</span><i>›</i><span>Recursos Humanos</span><i>›</i><strong>{activeSection === "Hub" ? "Equipment Hub" : activeSection}</strong></div>
              <h1>{activeSection === "Hub" ? "Universal Equipment Assignment Hub" : activeSection}</h1>
              <p className="eq-subtitle">{activeSection === "Hub" ? `Jornada de ${dateLabel} · 4 actas en curso · modo demostración` : "Espacio de trabajo · modo demostración"}</p>
            </div>
            {activeSection === "Hub" && <div className="eq-filters" aria-label="Filtrar equipos">{filters.map((filter) => <button key={filter.value} type="button" className={activeFilter === filter.value ? "is-selected" : ""} onClick={() => setActiveFilter(filter.value)}>{filter.label}</button>)}</div>}
          </div>

          {activeSection === "Hub" ? <>
          <section className="eq-metrics" aria-label="Resumen de actas">
            <article className="eq-metric-card"><div><span className="eq-metric-label">Actas del día</span><strong>4</strong><small className="eq-trend"><b>↗</b> +3 vs ayer</small></div><span className="eq-metric-icon is-blue"><FileText size={21} /></span></article>
            <article className="eq-metric-card"><div><span className="eq-metric-label">Verificadas</span><strong>2/4</strong><small className="eq-trend"><b>↗</b> 50% completo</small><span className="eq-metric-progress"><i style={{ width: "50%" }} /></span></div><span className="eq-metric-icon is-green"><CheckCircle2 size={21} /></span></article>
            <article className="eq-metric-card"><div><span className="eq-metric-label">Sub-ítems verificados</span><strong>6/12</strong><small>Checklist fraccionado</small><span className="eq-metric-progress"><i style={{ width: "50%" }} /></span></div><span className="eq-metric-icon is-blue"><ShieldCheck size={21} /></span></article>
            <article className="eq-metric-card"><div><span className="eq-metric-label">Estado global</span><strong className="eq-pending-value">Pendiente</strong><small>↘ 2 por revisar</small></div><span className="eq-metric-icon is-orange"><Clock3 size={21} /></span></article>
          </section>

          <section className="eq-workspace">
            <article className="eq-equipment-panel" id="equipment-list">
              <div className="eq-panel-heading"><div><div className="eq-panel-title"><h2>Equipos por Entregar · Actas del Día</h2><span className="eq-live-pill eq-live-small"><span />LIVE</span></div><p>{visibleAssignments.length} resultados · verifique cada accesorio antes de imprimir</p></div><div className="eq-panel-actions"><button type="button" className="eq-filter-button" onClick={() => setActiveFilter("todos")}><Filter size={14} />Todos</button><button type="button" className="eq-register-button" onClick={() => selectSection("Actas")}><Plus size={16} />Registrar Entrega</button></div></div>
              {visibleAssignments.length ? <div className="eq-assignment-grid">{visibleAssignments.map((assignment) => <AssignmentCard key={assignment.id} assignment={assignment} onOpenActas={() => selectSection("Actas")} />)}</div> : <div className="eq-empty-state"><Search size={24} /><strong>No se encontraron equipos</strong><span>Prueba con otro nombre, serial o categoría.</span><button type="button" onClick={() => { setSearch(""); setActiveFilter("todos"); }}>Limpiar filtros</button></div>}
            </article>
            <aside className="eq-right-column">
              <article className="eq-dispatch-card">
                <div className="eq-dispatch-heading"><span>Centro de despacho</span><span className="eq-onair"><span />ON-AIR</span></div>
                <h2>Cubículo de soporte</h2><p>Dispositivos verificados y listos para despacho en tiempo real.</p>
                <div className="eq-network"><Wifi size={15} />Red institucional · 96% señal</div>
                <div className="eq-device-scene" aria-hidden="true"><span className="eq-scene-glow" /><span className="eq-scene-monitor"><b>OEI</b><i /></span><span className="eq-scene-laptop"><i /></span><span className="eq-scene-tablet"><i /></span><span className="eq-scene-phone" /><span className="eq-scene-base" /></div>
                <span className="eq-official-seal"><small>Oficial</small><strong>OEI</strong><small>El Salvador</small></span>
              </article>
            </aside>
          </section>
          <p className="eq-demo-note"><CalendarDays size={13} />Panel de demostración · Los datos y las acciones se guardan únicamente en esta sesión.</p>
          </> : <WorkspaceSection section={activeSection} searchTerm={search} />}
        </main>
      </div>
    </div>
  );
}
