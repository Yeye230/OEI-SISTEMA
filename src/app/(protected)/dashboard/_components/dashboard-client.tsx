"use client";

import { useMemo, useSyncExternalStore, type ReactElement } from "react";
import Link from "next/link";
import {
  Activity, ArrowUpRight, BriefcaseBusiness, FileBarChart, FileText, Laptop,
  MapPin, Monitor, ShieldCheck, Tablet, Users, GraduationCap
} from "lucide-react";
import type { AppUser } from "@/core/server/types";

type Props = { user: AppUser };
type ActaSummary = { proyectoId?: string; proyecto?: string };
type Counts = { docentes: number; directores: number };
const emptyCounts: Counts = { docentes: 0, directores: 0 };
let cachedRaw: string | null = null;
let cachedCounts = emptyCounts;
const readProjectCounts = (): Counts => {
  const raw = window.localStorage.getItem("oei-demo:actas:v1") ?? "[]";
  if (raw === cachedRaw) return cachedCounts;
  cachedRaw = raw;
  try {
    const parsed: unknown = JSON.parse(raw);
    const records = Array.isArray(parsed) ? parsed as ActaSummary[] : [];
    cachedCounts = records.reduce<Counts>((counts, record) => {
      const project = record.proyectoId ?? record.proyecto?.toLowerCase();
      if (project === "docentes") counts.docentes += 1;
      if (project === "directores") counts.directores += 1;
      return counts;
    }, { docentes: 0, directores: 0 });
  } catch { cachedCounts = emptyCounts; }
  return cachedCounts;
};
const subscribe = (callback: () => void): (() => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("oei-workspace-change", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("oei-workspace-change", callback); };
};
const shortcuts = [
  { title: "Gestión de actas", description: "Crea y administra actas de entrega de laptops, tablets y proyectores.", href: "/actas", icon: FileText, tone: "blue" },
  { title: "Inventario institucional", description: "Consulta y actualiza los equipos registrados en el sistema.", href: "/equipos", icon: Laptop, tone: "green" },
  { title: "Directorio de personas", description: "Mantén organizados los responsables y colaboradores.", href: "/personas", icon: Users, tone: "orange" },
  { title: "Proyectos", description: "Da seguimiento a los proyectos y su información.", href: "/proyectos", icon: BriefcaseBusiness, tone: "blue" },
  { title: "Mapa territorial", description: "Visualiza los puntos registrados por ubicación.", href: "/mapa", icon: MapPin, tone: "green" },
  { title: "Reportes", description: "Consulta y exporta la información disponible.", href: "/reportes", icon: FileBarChart, tone: "orange" }
];
export default function DashboardClient({ user }: Props): ReactElement {
  const userName = user.name?.trim() || "Usuario OEI";
  const counts = useSyncExternalStore(subscribe, readProjectCounts, () => emptyCounts);
  return <>
    <div className="eq-heading-row"><div><div className="eq-breadcrumb"><span><ShieldCheck size={13} />OEI El Salvador</span><i>›</i><strong>Panel principal</strong></div><h1>Centro de gestión institucional</h1><p className="eq-subtitle">Administra las actas, los equipos y la información institucional desde un solo lugar.</p></div><Link href="/actas/nueva" className="eq-register-button"><FileText size={16} />Registrar entrega</Link></div>
    <section className="eq-welcome-panel"><div className="eq-welcome-copy"><span className="eq-welcome-eyebrow">PLATAFORMA DE GESTIÓN · OEI EL SALVADOR</span><h2>Bienvenido, {userName.split(" ")[0]}</h2><p>Este es tu espacio de trabajo para gestionar entregas, inventario y seguimiento institucional.</p><div className="eq-welcome-actions"><Link href="/actas/nueva" className="eq-primary-button">Crear nueva acta <ArrowUpRight size={16} /></Link><Link href="/actas" className="eq-secondary-button">Consultar actas</Link></div></div><div className="eq-welcome-illustration" aria-hidden="true"><span className="eq-illustration-glow" /><span className="eq-illustration-screen"><Monitor size={48} /><b>OEI</b></span><span className="eq-illustration-tablet"><Tablet size={34} /></span><span className="eq-illustration-base" /></div></section>
    <section className="eq-shortcuts-section" aria-labelledby="project-summary-title">
      <div className="eq-section-title-row"><div><span className="eq-section-eyebrow">SEGUIMIENTO DE ENTREGAS</span><h2 id="project-summary-title">Actas por proyecto</h2><p>Consulta por separado las entregas de cada proyecto.</p></div><span className="eq-module-count">{counts.docentes + counts.directores} actas clasificadas</span></div>
      <div className="eq-shortcuts-grid">
        <Link href="/actas?proyecto=docentes" className="eq-shortcut-card"><span className="eq-shortcut-icon is-blue"><GraduationCap size={22} /></span><span className="eq-shortcut-content"><strong>Docentes</strong><small>{counts.docentes.toLocaleString("es-SV")} actas registradas · Consultar entregas</small></span><ArrowUpRight size={17} className="eq-shortcut-arrow" /></Link>
        <Link href="/actas?proyecto=directores" className="eq-shortcut-card"><span className="eq-shortcut-icon is-green"><Users size={22} /></span><span className="eq-shortcut-content"><strong>Directores</strong><small>{counts.directores.toLocaleString("es-SV")} actas registradas · Consultar entregas</small></span><ArrowUpRight size={17} className="eq-shortcut-arrow" /></Link>
      </div>
    </section>
    <section className="eq-shortcuts-section" aria-labelledby="eq-shortcuts-title"><div className="eq-section-title-row"><div><span className="eq-section-eyebrow">MÓDULOS DEL SISTEMA</span><h2 id="eq-shortcuts-title">Accesos directos</h2><p>Selecciona el módulo en el que deseas trabajar.</p></div><span className="eq-module-count">6 módulos principales</span></div><div className="eq-shortcuts-grid">{shortcuts.map(({ title, description, href, icon: Icon, tone }) => <Link href={href} className="eq-shortcut-card" key={href}><span className={`eq-shortcut-icon is-${tone}`}><Icon size={21} /></span><span className="eq-shortcut-content"><strong>{title}</strong><small>{description}</small></span><ArrowUpRight size={17} className="eq-shortcut-arrow" /></Link>)}</div></section>
    <section className="eq-bottom-grid"><article className="eq-bottom-card"><div className="eq-bottom-card-heading"><span className="eq-bottom-icon"><Activity size={18} /></span><div><h2>Flujo de trabajo</h2><p>Pasos habituales para gestionar una entrega.</p></div></div><ol className="eq-workflow-list"><li><span>01</span><div><strong>Registrar el acta</strong><small>Selecciona el proyecto, el tipo de equipo y completa los datos.</small></div></li><li><span>02</span><div><strong>Verificar la información</strong><small>Revisa los datos de la persona, el equipo y sus accesorios.</small></div></li><li><span>03</span><div><strong>Consultar y exportar</strong><small>Encuentra registros desde Actas o prepara tus reportes.</small></div></li></ol></article><article className="eq-bottom-card eq-environment-card"><div className="eq-bottom-card-heading"><span className="eq-bottom-icon"><ShieldCheck size={18} /></span><div><h2>Entorno de trabajo</h2><p>Estado actual de esta versión.</p></div></div><div className="eq-environment-status"><span className="eq-status-dot" /><div><strong>Modo demostración activo</strong><small>Sesión de prueba iniciada</small></div></div><div className="eq-environment-status"><span className="eq-status-dot is-info" /><div><strong>Almacenamiento local</strong><small>Los datos permanecen en este navegador</small></div></div><div className="eq-environment-note">La conexión al servidor y a la base de datos queda pendiente para una siguiente etapa.</div></article></section>
    <p className="eq-demo-note"><ShieldCheck size={13} />OEI Gestión de Actas · Interfaz de demostración</p>
  </>;
}
