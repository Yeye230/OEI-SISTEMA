"use client";

import { useState, type FormEvent, type ReactElement } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity, ArrowUpRight, Bell, BriefcaseBusiness, ChevronDown, ClipboardList,
  CloudMoon, CloudSun, FileBarChart, FileText, Laptop, LogOut, MapPin,
  Menu, Monitor, Search, Settings, ShieldCheck, Tablet, Users, X
} from "lucide-react";
import type { AppUser } from "@/core/server/types";
import { useTheme } from "@/core/components/theme/theme-provider";
import "./dashboard.css";

type DashboardClientProps = { user: AppUser };

const navigation = [
  { label: "Panel principal", href: "/dashboard", icon: Activity },
  { label: "Actas", href: "/actas", icon: FileText },
  { label: "Equipos", href: "/equipos", icon: Laptop },
  { label: "Personas", href: "/personas", icon: Users },
  { label: "Proyectos", href: "/proyectos", icon: BriefcaseBusiness },
  { label: "Mapa territorial", href: "/mapa", icon: MapPin },
  { label: "Historial", href: "/historial", icon: ClipboardList },
  { label: "Reportes", href: "/reportes", icon: FileBarChart },
  { label: "Configuración", href: "/configuracion", icon: Settings }
];

const shortcuts = [
  { title: "Gestión de actas", description: "Crea y administra actas de entrega de laptops, tablets y proyectores.", href: "/actas", icon: FileText, tone: "blue" },
  { title: "Inventario institucional", description: "Consulta y actualiza los equipos registrados en el sistema.", href: "/equipos", icon: Laptop, tone: "green" },
  { title: "Directorio de personas", description: "Mantén organizados los responsables y colaboradores.", href: "/personas", icon: Users, tone: "orange" },
  { title: "Proyectos", description: "Da seguimiento a los proyectos y su información.", href: "/proyectos", icon: BriefcaseBusiness, tone: "blue" },
  { title: "Mapa territorial", description: "Visualiza los puntos registrados por ubicación.", href: "/mapa", icon: MapPin, tone: "green" },
  { title: "Reportes", description: "Consulta y exporta la información disponible.", href: "/reportes", icon: FileBarChart, tone: "orange" }
];

function initials(name: string): string {
  return name.trim().split(/\\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export default function DashboardClient({ user }: DashboardClientProps): ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleMode, mounted } = useTheme();
  const userName = user.name?.trim() || "Usuario OEI";
  const roleLabel = user.roleName === "ADMIN" ? "Administrador" : user.roleName || "Usuario";

  const submitSearch = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const query = search.trim();
    if (!query) return;
    router.push(`/busqueda?q=${encodeURIComponent(query)}`);
    setMenuOpen(false);
  };

  const logout = async (): Promise<void> => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/demo/session", { method: "DELETE" });
      router.replace("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="eq-app">
      <aside className={`eq-sidebar ${menuOpen ? "is-open" : ""}`} aria-label="Menú principal">
        <Link href="/dashboard" className="eq-brand" onClick={() => setMenuOpen(false)}>
          <span className="eq-brand-mark">OEI</span>
          <span className="eq-brand-copy"><strong>Equipment Hub</strong><small>OEI · El Salvador</small></span>
        </Link>
        <p className="eq-nav-label">Espacio de trabajo</p>
        <nav className="eq-nav" aria-label="Navegación principal">
          {navigation.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} className={`eq-nav-link ${pathname === href ? "is-active" : ""}`} aria-current={pathname === href ? "page" : undefined} onClick={() => setMenuOpen(false)}>
              <Icon size={17} aria-hidden="true" /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="eq-sidebar-footer">
          <span className="eq-status-dot" />
          <span>Entorno de demostración</span>
        </div>
        <button type="button" className="eq-logout-button" onClick={logout} disabled={loggingOut}>
          <LogOut size={17} />{loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
        </button>
      </aside>

      {menuOpen && <button type="button" className="eq-mobile-backdrop" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}
      <div className="eq-main">
        <header className="eq-topbar">
          <button type="button" className="eq-mobile-menu" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
          <form className="eq-global-search" role="search" onSubmit={submitSearch}>
            <Search size={17} aria-hidden="true" />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar personas, equipos, actas..." aria-label="Buscar en el sistema" />
            {search && <button type="button" aria-label="Limpiar búsqueda" onClick={() => setSearch("")}><X size={15} /></button>}
          </form>
          <span className="eq-live-pill"><span />DEMO</span>
          <Link href="/actas/nueva" className="eq-new-button"><FileText size={16} />Nueva acta</Link>
          <button type="button" className="eq-icon-button eq-theme-toggle" onClick={toggleMode} aria-label={`Cambiar a tema ${theme === "oscuro" ? "claro" : "oscuro"}`} title={`Tema ${theme === "oscuro" ? "oscuro" : "claro"}`}>
            {mounted && theme === "oscuro" ? <CloudSun size={19} /> : <CloudMoon size={19} />}
          </button>
          <details className="eq-popover">
            <summary className="eq-icon-button" aria-label="Aviso del entorno de demostración"><Bell size={18} /></summary>
            <div className="eq-popover-panel eq-notice-panel"><strong>Modo demostración</strong><p>Los registros se guardan localmente en este navegador. La conexión con la base de datos se realizará posteriormente.</p></div>
          </details>
          <div className="eq-popover eq-profile-popover">
            <button type="button" className="eq-profile-button" aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)}>
              <span className="eq-avatar">{initials(userName)}</span>
              <span className="eq-profile-copy"><strong>{userName}</strong><small>{roleLabel}</small></span>
              <ChevronDown size={15} />
            </button>
            {profileOpen && <div className="eq-popover-panel eq-profile-panel">
              <div className="eq-profile-panel-user"><strong>{userName}</strong><span>{user.email}</span></div>
              <Link href="/configuracion" onClick={() => setProfileOpen(false)}><Settings size={15} />Configuración</Link>
              <button type="button" onClick={logout} disabled={loggingOut}><LogOut size={15} />Cerrar sesión</button>
            </div>}
          </div>
        </header>

        <main className="eq-content">
          <div className="eq-heading-row">
            <div>
              <div className="eq-breadcrumb"><span><ShieldCheck size={13} />OEI El Salvador</span><i>›</i><strong>Panel principal</strong></div>
              <h1>Centro de gestión institucional</h1>
              <p className="eq-subtitle">Administra las actas, los equipos y la información institucional desde un solo lugar.</p>
            </div>
            <Link href="/actas/nueva" className="eq-register-button"><FileText size={16} />Registrar entrega</Link>
          </div>

          <section className="eq-welcome-panel">
            <div className="eq-welcome-copy">
              <span className="eq-welcome-eyebrow">PLATAFORMA DE GESTIÓN · OEI EL SALVADOR</span>
              <h2>Bienvenido, {userName.split(" ")[0]}</h2>
              <p>Este es tu espacio de trabajo para gestionar entregas, inventario y seguimiento institucional.</p>
              <div className="eq-welcome-actions"><Link href="/actas/nueva" className="eq-primary-button">Crear nueva acta <ArrowUpRight size={16} /></Link><Link href="/actas" className="eq-secondary-button">Consultar actas</Link></div>
            </div>
            <div className="eq-welcome-illustration" aria-hidden="true">
              <span className="eq-illustration-glow" />
              <span className="eq-illustration-screen"><Monitor size={48} /><b>OEI</b></span>
              <span className="eq-illustration-tablet"><Tablet size={34} /></span>
              <span className="eq-illustration-base" />
            </div>
          </section>

          <section className="eq-shortcuts-section" aria-labelledby="eq-shortcuts-title">
            <div className="eq-section-title-row"><div><span className="eq-section-eyebrow">MÓDULOS DEL SISTEMA</span><h2 id="eq-shortcuts-title">Accesos directos</h2><p>Selecciona el módulo en el que deseas trabajar.</p></div><span className="eq-module-count">6 módulos principales</span></div>
            <div className="eq-shortcuts-grid">
              {shortcuts.map(({ title, description, href, icon: Icon, tone }) => (
                <Link href={href} className="eq-shortcut-card" key={href}>
                  <span className={`eq-shortcut-icon is-${tone}`}><Icon size={21} /></span>
                  <span className="eq-shortcut-content"><strong>{title}</strong><small>{description}</small></span>
                  <ArrowUpRight size={17} className="eq-shortcut-arrow" />
                </Link>
              ))}
            </div>
          </section>

          <section className="eq-bottom-grid">
            <article className="eq-bottom-card">
              <div className="eq-bottom-card-heading"><span className="eq-bottom-icon"><Activity size={18} /></span><div><h2>Flujo de trabajo</h2><p>Pasos habituales para gestionar una entrega.</p></div></div>
              <ol className="eq-workflow-list">
                <li><span>01</span><div><strong>Registrar el acta</strong><small>Selecciona el tipo de equipo y completa los datos de entrega.</small></div></li>
                <li><span>02</span><div><strong>Verificar la información</strong><small>Revisa los datos de la persona, el equipo y sus accesorios.</small></div></li>
                <li><span>03</span><div><strong>Consultar y exportar</strong><small>Encuentra registros desde Actas o prepara tus reportes.</small></div></li>
              </ol>
            </article>
            <article className="eq-bottom-card eq-environment-card">
              <div className="eq-bottom-card-heading"><span className="eq-bottom-icon"><ShieldCheck size={18} /></span><div><h2>Entorno de trabajo</h2><p>Estado actual de esta versión.</p></div></div>
              <div className="eq-environment-status"><span className="eq-status-dot" /><div><strong>Modo demostración activo</strong><small>Sesión de prueba iniciada</small></div></div>
              <div className="eq-environment-status"><span className="eq-status-dot is-info" /><div><strong>Almacenamiento local</strong><small>Los datos permanecen en este navegador</small></div></div>
              <div className="eq-environment-note">La conexión al servidor y a la base de datos queda pendiente para una siguiente etapa.</div>
            </article>
          </section>
          <p className="eq-demo-note"><ShieldCheck size={13} />OEI Gestión de Actas · Interfaz de demostración</p>
        </main>
      </div>
    </div>
  );
}
