"use client";

import { useState, type ReactElement, type ReactNode, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity, Bell, BriefcaseBusiness, ChevronDown, ClipboardList, CloudMoon, CloudSun,
  FileBarChart, FileText, Laptop, LogOut, MapPin, Menu, Search, Settings, ShieldCheck,
  Tablet, Users, X
} from "lucide-react";
import type { AppUser } from "@/core/server/types";
import { useTheme } from "@/core/components/theme/theme-provider";

type Props = { user: AppUser; children: ReactNode };
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

function initials(name: string): string {
  return name.trim().split(/\\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export default function ProtectedAppShell({ user, children }: Props): ReactElement {
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
    if (query) router.push(`/busqueda?q=${encodeURIComponent(query)}`);
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
          {navigation.map(({ label, href, icon: Icon }) => {
            const active = href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
            return <Link key={href} href={href} className={`eq-nav-link ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => setMenuOpen(false)}>
              <Icon size={17} aria-hidden="true" /><span>{label}</span>
            </Link>;
          })}
        </nav>
        <div className="eq-sidebar-footer"><span className="eq-status-dot" /><span>Entorno de demostración</span></div>
        <button type="button" className="eq-logout-button" onClick={() => void logout()} disabled={loggingOut}>
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
          <button type="button" className="eq-icon-button eq-theme-toggle" onClick={toggleMode} aria-label={`Cambiar a tema ${theme === "oscuro" ? "claro" : "oscuro"}`}>
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
              <button type="button" onClick={() => void logout()} disabled={loggingOut}><LogOut size={15} />Cerrar sesión</button>
            </div>}
          </div>
        </header>
        <main className="eq-content" id="main-content">{children}</main>
      </div>
    </div>
  );
}
