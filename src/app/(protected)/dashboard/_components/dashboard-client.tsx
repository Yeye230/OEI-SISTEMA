"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import {
  Activity, ArrowUpRight, BriefcaseBusiness, FileBarChart, FileText, Laptop,
  MapPin, Monitor, ShieldCheck, Tablet, Users
} from "lucide-react";
import type { AppUser } from "@/core/server/types";

type Props = { user: AppUser };

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
  return (
    <>
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
          <span className="eq-illustration-glow" /><span className="eq-illustration-screen"><Monitor size={48} /><b>OEI</b></span>
          <span className="eq-illustration-tablet"><Tablet size={34} /></span><span className="eq-illustration-base" />
        </div>
      </section>
      <section className="eq-shortcuts-section" aria-labelledby="eq-shortcuts-title">
        <div className="eq-section-title-row"><div><span className="eq-section-eyebrow">MÓDULOS DEL SISTEMA</span><h2 id="eq-shortcuts-title">Accesos directos</h2><p>Selecciona el módulo en el que deseas trabajar.</p></div><span className="eq-module-count">6 módulos principales</span></div>
        <div className="eq-shortcuts-grid">
          {shortcuts.map(({ title, description, href, icon: Icon, tone }) => <Link href={href} className="eq-shortcut-card" key={href}>
            <span className={`eq-shortcut-icon is-${tone}`}><Icon size={21} /></span><span className="eq-shortcut-content"><strong>{title}</strong><small>{description}</small></span><ArrowUpRight size={17} className="eq-shortcut-arrow" />
          </Link>)}
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
    </>
  );
}
