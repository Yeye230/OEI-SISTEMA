"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity, Archive, CalendarDays, CheckCircle2, ClipboardList,
  Clock3, Download, FileText, Laptop, Plus, Search, ShieldCheck,
  Tablet, Users, X, FolderKanban, Settings2, Monitor
} from "lucide-react";
import { useTheme } from "@/core/components/theme/theme-provider";
import type { LucideIcon } from "lucide-react";

export type WorkspaceSectionKey =
  | "Hub" | "Actas" | "Personas" | "Proyectos"
  | "Inventario" | "Historial" | "Reportes" | "Ajustes";

type Acta = { id: string; person: string; asset: string; date: string; status: "Pendiente" | "Verificada" };
type Person = { id: number; name: string; role: string; department: string; email: string; status: "Activo" | "Inactivo" };
type Project = { id: number; name: string; area: string; owner: string; progress: number; status: "En curso" | "Completado" | "Planificación" };
type Asset = { id: string; type: "Laptop" | "Tablet" | "Proyector"; model: string; serial: string; assigned: string; status: "Asignado" | "Disponible" | "Mantenimiento" };
type ActivityItem = { id: number; title: string; detail: string; date: string; type: "Acta" | "Inventario" | "Persona" | "Sistema" };

const initialActas: Acta[] = [
  { id: "OEI-2026-0187", person: "María José Alvarado", asset: "Samsung Galaxy Tab A9", date: "06 nov 2026", status: "Pendiente" },
  { id: "OEI-2026-0188", person: "Carlos Alberto Menjívar", asset: "Lenovo ThinkPad E14", date: "06 nov 2026", status: "Verificada" },
  { id: "OEI-2026-0186", person: "Ana Lucía Hernández", asset: "Dell Latitude 5440", date: "05 nov 2026", status: "Verificada" },
  { id: "OEI-2026-0185", person: "José Miguel Rivera", asset: "Epson PowerLite", date: "05 nov 2026", status: "Pendiente" }
];
const initialPeople: Person[] = [
  { id: 1, name: "María José Alvarado", role: "Coordinadora de Proyectos", department: "San Salvador", email: "m.alvarado@oei.org", status: "Activo" },
  { id: 2, name: "Carlos Alberto Menjívar", role: "Analista TIC", department: "Tecnología", email: "c.menjivar@oei.org", status: "Activo" },
  { id: 3, name: "Ana Lucía Hernández", role: "Asistente administrativa", department: "San Miguel", email: "a.hernandez@oei.org", status: "Activo" },
  { id: 4, name: "José Miguel Rivera", role: "Técnico de soporte", department: "Santa Ana", email: "j.rivera@oei.org", status: "Inactivo" }
];
const initialProjects: Project[] = [
  { id: 1, name: "Modernización de equipo institucional", area: "Tecnología", owner: "Equipo TIC", progress: 72, status: "En curso" },
  { id: 2, name: "Fortalecimiento educativo", area: "Educación", owner: "Coordinación OEI", progress: 100, status: "Completado" },
  { id: 3, name: "Renovación de inventario", area: "Administración", owner: "Recursos Humanos", progress: 28, status: "Planificación" }
];
const initialAssets: Asset[] = [
  { id: "EQ-LAP-001", type: "Laptop", model: "Lenovo ThinkPad E14", serial: "PF3-2287-1145", assigned: "Carlos A. Menjívar", status: "Asignado" },
  { id: "EQ-TAB-014", type: "Tablet", model: "Samsung Galaxy Tab A9", serial: "SM-X110-88291", assigned: "María J. Alvarado", status: "Asignado" },
  { id: "EQ-PRO-003", type: "Proyector", model: "Epson PowerLite X49", serial: "EPX49-2026-03", assigned: "Sin asignar", status: "Disponible" },
  { id: "EQ-LAP-009", type: "Laptop", model: "Dell Latitude 5440", serial: "DL5440-00981", assigned: "Ana L. Hernández", status: "Mantenimiento" },
  { id: "EQ-TAB-018", type: "Tablet", model: "Samsung Galaxy Tab A8", serial: "SM-X200-18722", assigned: "Sin asignar", status: "Disponible" }
];
const initialActivity: ActivityItem[] = [
  { id: 1, title: "Acta creada", detail: "OEI-2026-0187 · María José Alvarado", date: "Hoy · 09:42", type: "Acta" },
  { id: 2, title: "Equipo verificado", detail: "Lenovo ThinkPad E14 · Carlos Menjívar", date: "Hoy · 09:18", type: "Inventario" },
  { id: 3, title: "Persona actualizada", detail: "Ana Lucía Hernández · San Miguel", date: "Ayer · 15:36", type: "Persona" },
  { id: 4, title: "Acta verificada", detail: "OEI-2026-0186 · Dell Latitude 5440", date: "Ayer · 14:05", type: "Acta" }
];

function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }): React.JSX.Element {
  return <div className="eq-section-heading"><div><span className="eq-section-eyebrow">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>{action}</div>;
}
function Metric({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: LucideIcon }): React.JSX.Element {
  return <article className="eq-section-metric"><span className="eq-section-metric-icon"><Icon size={19} /></span><small>{label}</small><strong>{value}</strong><span>{note}</span></article>;
}
function Status({ children }: { children: string }): React.JSX.Element {
  const kind = children.toLowerCase().replaceAll(" ", "-");
  return <span className={`eq-section-status ${kind}`}>{children}</span>;
}
function Empty({ label }: { label: string }): React.JSX.Element {
  return <div className="eq-section-empty"><Search size={22} /><strong>No hay resultados</strong><span>{label}</span></div>;
}
function CreateModal({ title, onClose, onSave, children }: { title: string; onClose: () => void; onSave: (event: FormEvent<HTMLFormElement>) => void; children: ReactNode }): React.JSX.Element {
  return <div className="eq-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><form className="eq-modal" onSubmit={onSave}><div className="eq-modal-heading"><h3>{title}</h3><button type="button" onClick={onClose} aria-label="Cerrar"><X size={18} /></button></div><div className="eq-modal-fields">{children}</div><div className="eq-modal-actions"><button type="button" className="eq-secondary-button" onClick={onClose}>Cancelar</button><button type="submit" className="eq-primary-button">Guardar</button></div></form></div>;
}
function Field({ label, name, placeholder, required = true }: { label: string; name: string; placeholder: string; required?: boolean }): React.JSX.Element {
  return <label className="eq-form-field"><span>{label}</span><input name={name} placeholder={placeholder} required={required} /></label>;
}

export default function WorkspaceSection({ section, searchTerm }: { section: WorkspaceSectionKey; searchTerm: string }): React.JSX.Element {
  const [actas, setActas] = useState(initialActas);
  const [people, setPeople] = useState(initialPeople);
  const [projects, setProjects] = useState(initialProjects);
  const [assets, setAssets] = useState(initialAssets);
  const [activity, setActivity] = useState(initialActivity);
  const [filter, setFilter] = useState("Todos");
  const [modal, setModal] = useState<"acta" | "person" | "project" | "asset" | null>(null);
  const [reportRange, setReportRange] = useState("Este mes");
  const [notice, setNotice] = useState("");
  const { mode, toggleMode } = useTheme();

  const query = searchTerm.trim().toLocaleLowerCase("es");

  const filteredActas = useMemo(() => actas.filter((item) => (!query || [item.id, item.person, item.asset].some((v) => v.toLocaleLowerCase("es").includes(query))) && (filter === "Todos" || item.status === filter)), [actas, query, filter]);
  const filteredPeople = useMemo(() => people.filter((item) => (!query || [item.name, item.role, item.department, item.email].some((v) => v.toLocaleLowerCase("es").includes(query))) && (filter === "Todos" || item.status === filter)), [people, query, filter]);
  const filteredAssets = useMemo(() => assets.filter((item) => (!query || [item.id, item.model, item.serial, item.assigned].some((v) => v.toLocaleLowerCase("es").includes(query))) && (filter === "Todos" || item.type === filter || item.status === filter)), [assets, query, filter]);
  const filteredProjects = useMemo(() => projects.filter((item) => (!query || [item.name, item.area, item.owner].some((v) => v.toLocaleLowerCase("es").includes(query))) && (filter === "Todos" || item.status === filter)), [projects, query, filter]);
  const filteredActivity = useMemo(() => activity.filter((item) => (!query || [item.title, item.detail, item.type].some((v) => v.toLocaleLowerCase("es").includes(query))) && (filter === "Todos" || item.type === filter)), [activity, query, filter]);

  function saveForm(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (modal === "acta") {
      const person = String(data.get("person") ?? "").trim();
      const asset = String(data.get("asset") ?? "").trim();
      const id = `OEI-2026-${String(189 + actas.length - initialActas.length).padStart(4, "0")}`;
      setActas((current) => [{ id, person, asset, date: "Hoy", status: "Pendiente" }, ...current]);
      setActivity((current) => [{ id: Date.now(), title: "Acta creada", detail: `${id} · ${person}`, date: "Ahora", type: "Acta" }, ...current]);
      setNotice("El acta de demostración se creó correctamente.");
    } else if (modal === "person") {
      const name = String(data.get("name") ?? "").trim();
      setPeople((current) => [{ id: Math.max(0, ...current.map((item) => item.id)) + 1, name, role: String(data.get("role") ?? ""), department: String(data.get("department") ?? ""), email: String(data.get("email") ?? ""), status: "Activo" }, ...current]);
      setNotice("La persona se agregó al listado de demostración.");
    } else if (modal === "project") {
      const name = String(data.get("name") ?? "").trim();
      setProjects((current) => [{ id: Math.max(0, ...current.map((item) => item.id)) + 1, name, area: String(data.get("area") ?? ""), owner: String(data.get("owner") ?? ""), progress: 0, status: "Planificación" }, ...current]);
      setNotice("El proyecto se agregó correctamente.");
    } else if (modal === "asset") {
      const id = String(data.get("id") ?? "").trim();
      setAssets((current) => [{ id, type: data.get("type") as Asset["type"], model: String(data.get("model") ?? ""), serial: String(data.get("serial") ?? ""), assigned: "Sin asignar", status: "Disponible" }, ...current]);
      setNotice("El equipo se agregó al inventario.");
    }
    setModal(null);
  }

  const headingMap: Record<Exclude<WorkspaceSectionKey, "Hub">, [string, string, string]> = {
    Actas: ["GESTIÓN DOCUMENTAL", "Actas de entrega", "Registra, consulta y controla las actas de asignación de equipos."],
    Personas: ["DIRECTORIO INSTITUCIONAL", "Personas", "Administra el directorio de colaboradores y sus datos de contacto."],
    Proyectos: ["PLANIFICACIÓN", "Proyectos", "Consulta el avance de los proyectos y sus responsables."],
    Inventario: ["CONTROL DE ACTIVOS", "Inventario", "Administra equipos, asignaciones y disponibilidad institucional."],
    Historial: ["TRAZABILIDAD", "Historial de actividad", "Consulta los movimientos realizados dentro del sistema."],
    Reportes: ["ANÁLISIS Y RESULTADOS", "Reportes", "Indicadores de actas, personas y equipos del entorno de demostración."],
    Ajustes: ["PREFERENCIAS", "Ajustes del sistema", "Configura la apariencia y las preferencias de esta sesión."]
  };
  if (section === "Hub") return <></>;
  const [eyebrow, title, description] = headingMap[section];

  return (
    <div className="eq-section-view">
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={
          section === "Actas" || section === "Personas" || section === "Proyectos" || section === "Inventario"
            ? <button type="button" className="eq-primary-button" onClick={() => setModal(section === "Actas" ? "acta" : section === "Personas" ? "person" : section === "Proyectos" ? "project" : "asset")}><Plus size={16} />{section === "Actas" ? "Nueva acta" : section === "Personas" ? "Agregar persona" : section === "Proyectos" ? "Nuevo proyecto" : "Agregar equipo"}</button>
            : null
        }
      />
      {notice && <div className="eq-section-notice"><CheckCircle2 size={16} />{notice}<button type="button" onClick={() => setNotice("")} aria-label="Cerrar aviso"><X size={14} /></button></div>}

      {section === "Actas" && <>
        <div className="eq-section-metrics"><Metric label="Total de actas" value={String(actas.length)} note="Registros de demostración" icon={FileText} /><Metric label="Verificadas" value={String(actas.filter((x) => x.status === "Verificada").length)} note="Revisión completada" icon={CheckCircle2} /><Metric label="Pendientes" value={String(actas.filter((x) => x.status === "Pendiente").length)} note="Requieren revisión" icon={Clock3} /></div>
        <div className="eq-section-panel"><div className="eq-section-toolbar"><div><h3>Listado de actas</h3><p>{filteredActas.length} registros encontrados</p></div><select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar actas"><option>Todos</option><option>Pendiente</option><option>Verificada</option></select></div>
          {filteredActas.length ? <div className="eq-table-wrap"><table className="eq-data-table"><thead><tr><th>Código</th><th>Colaborador</th><th>Equipo</th><th>Fecha</th><th>Estado</th><th>Acción</th></tr></thead><tbody>{filteredActas.map((item) => <tr key={item.id}><td className="eq-code-cell">{item.id}</td><td>{item.person}</td><td>{item.asset}</td><td>{item.date}</td><td><Status>{item.status}</Status></td><td><button className="eq-table-action" type="button" onClick={() => { setActas((current) => current.map((a) => a.id === item.id ? { ...a, status: a.status === "Pendiente" ? "Verificada" : "Pendiente" } : a)); setNotice(`Estado de ${item.id} actualizado en la demostración.`); }}> {item.status === "Pendiente" ? "Verificar" : "Reabrir"}</button></td></tr>)}</tbody></table></div> : <Empty label="Prueba con otro código o cambia el filtro."/>}
        </div>
      </>}

      {section === "Personas" && <>
        <div className="eq-section-metrics"><Metric label="Colaboradores" value={String(people.length)} note="En el directorio" icon={Users}/><Metric label="Activos" value={String(people.filter((x) => x.status === "Activo").length)} note="Personal habilitado" icon={CheckCircle2}/><Metric label="Inactivos" value={String(people.filter((x) => x.status === "Inactivo").length)} note="Sin asignación activa" icon={Archive}/></div>
        <div className="eq-section-panel"><div className="eq-section-toolbar"><div><h3>Directorio de personas</h3><p>{filteredPeople.length} colaboradores encontrados</p></div><select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar personas"><option>Todos</option><option>Activo</option><option>Inactivo</option></select></div>
          {filteredPeople.length ? <div className="eq-people-grid">{filteredPeople.map((p) => <article className="eq-person-card" key={p.id}><span className="eq-person-avatar">{p.name.split(" ").slice(0,2).map((x) => x[0]).join("")}</span><div><strong>{p.name}</strong><small>{p.role}</small><span>{p.email}</span><span>{p.department}</span></div><Status>{p.status}</Status><button type="button" className="eq-table-action" onClick={() => { setPeople((current) => current.map((person) => person.id === p.id ? { ...person, status: person.status === "Activo" ? "Inactivo" : "Activo" } : person)); setNotice(`Estado de ${p.name} actualizado.`); }}>{p.status === "Activo" ? "Desactivar" : "Activar"}</button></article>)}</div> : <Empty label="No se encontraron personas con esos criterios."/>}
        </div>
      </>}

      {section === "Proyectos" && <>
        <div className="eq-section-metrics"><Metric label="Proyectos" value={String(projects.length)} note="Registrados" icon={FolderKanban}/><Metric label="En curso" value={String(projects.filter((x) => x.status === "En curso").length)} note="Con actividades activas" icon={Activity}/><Metric label="Completados" value={String(projects.filter((x) => x.status === "Completado").length)} note="Finalizados" icon={CheckCircle2}/></div>
        <div className="eq-section-toolbar eq-section-panel"><div><h3>Seguimiento de proyectos</h3><p>Visualiza responsables y progreso</p></div><select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar proyectos"><option>Todos</option><option>En curso</option><option>Completado</option><option>Planificación</option></select></div>
        <div className="eq-project-grid">{filteredProjects.map((p) => <article className="eq-project-card" key={p.id}><div className="eq-project-card-top"><span className="eq-project-icon"><FolderKanban size={20}/></span><Status>{p.status}</Status></div><h3>{p.name}</h3><p>{p.area} · Responsable: {p.owner}</p><div className="eq-project-progress-label"><span>Avance</span><strong>{p.progress}%</strong></div><div className="eq-section-progress"><i style={{width:`${p.progress}%`}}/></div><button type="button" className="eq-table-action" onClick={() => { setProjects((current) => current.map((project) => project.id === p.id ? { ...project, progress: Math.min(100, project.progress + 10), status: project.progress + 10 >= 100 ? "Completado" : "En curso" } : project)); setNotice(`Avance de ${p.name} actualizado.`); }}>Actualizar avance +10%</button></article>)}</div>
        {!filteredProjects.length && <Empty label="No hay proyectos para ese filtro."/>}
      </>}

      {section === "Inventario" && <>
        <div className="eq-section-metrics"><Metric label="Equipos" value={String(assets.length)} note="Activos registrados" icon={Monitor}/><Metric label="Asignados" value={String(assets.filter((x) => x.status === "Asignado").length)} note="En uso" icon={Laptop}/><Metric label="Disponibles" value={String(assets.filter((x) => x.status === "Disponible").length)} note="Listos para asignar" icon={CheckCircle2}/></div>
        <div className="eq-section-panel"><div className="eq-section-toolbar"><div><h3>Activos institucionales</h3><p>{filteredAssets.length} equipos encontrados</p></div><select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar inventario"><option>Todos</option><option>Laptop</option><option>Tablet</option><option>Proyector</option><option>Asignado</option><option>Disponible</option><option>Mantenimiento</option></select></div>
          {filteredAssets.length ? <div className="eq-table-wrap"><table className="eq-data-table"><thead><tr><th>Código</th><th>Tipo / Modelo</th><th>Número de serie</th><th>Asignado a</th><th>Estado</th><th>Acción</th></tr></thead><tbody>{filteredAssets.map((item) => <tr key={item.id}><td className="eq-code-cell">{item.id}</td><td><span className="eq-asset-type">{item.type === "Tablet" ? <Tablet size={15}/> : item.type === "Laptop" ? <Laptop size={15}/> : <Monitor size={15}/>} {item.model}</span></td><td>{item.serial}</td><td>{item.assigned}</td><td><Status>{item.status}</Status></td><td><button type="button" className="eq-table-action" onClick={() => { setAssets((current) => current.map((a) => a.id === item.id ? { ...a, status: a.status === "Mantenimiento" ? "Disponible" : a.status === "Disponible" ? "Asignado" : "Mantenimiento" } : a)); setNotice(`Estado del equipo ${item.id} actualizado.`); }}>Cambiar estado</button></td></tr>)}</tbody></table></div> : <Empty label="No se encontraron equipos."/>}
        </div>
      </>}

      {section === "Historial" && <>
        <div className="eq-section-metrics"><Metric label="Movimientos" value={String(activity.length)} note="Eventos registrados" icon={Activity}/><Metric label="Actas" value={String(activity.filter((x) => x.type === "Acta").length)} note="Eventos de actas" icon={FileText}/><Metric label="Hoy" value={String(activity.filter((x) => x.date.startsWith("Hoy") || x.date === "Ahora").length)} note="Actividad reciente" icon={CalendarDays}/></div>
        <div className="eq-section-panel"><div className="eq-section-toolbar"><div><h3>Registro de actividad</h3><p>Movimientos recientes del entorno de demostración</p></div><select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar historial"><option>Todos</option><option>Acta</option><option>Inventario</option><option>Persona</option><option>Sistema</option></select></div>
          {filteredActivity.length ? <div className="eq-timeline">{filteredActivity.map((item) => <article className="eq-timeline-item" key={item.id}><span className="eq-timeline-icon">{item.type === "Acta" ? <FileText size={17}/> : item.type === "Inventario" ? <Monitor size={17}/> : item.type === "Persona" ? <Users size={17}/> : <Settings2 size={17}/>}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div><time>{item.date}</time></article>)}</div> : <Empty label="No hay movimientos que coincidan con el filtro."/>}
        </div>
      </>}

      {section === "Reportes" && <>
        <div className="eq-report-toolbar"><div><h3>Resumen de indicadores</h3><p>Datos de ejemplo para validar la presentación de reportes.</p></div><select value={reportRange} onChange={(e) => setReportRange(e.target.value)} aria-label="Periodo del reporte"><option>Esta semana</option><option>Este mes</option><option>Este trimestre</option><option>Este año</option></select><button type="button" className="eq-secondary-button" onClick={() => setNotice(`Reporte de ${reportRange.toLowerCase()} preparado en modo demostración.`)}><Download size={15}/>Preparar reporte</button></div>
        <div className="eq-section-metrics"><Metric label="Actas generadas" value={String(actas.length)} note={reportRange} icon={FileText}/><Metric label="Tasa de verificación" value={`${Math.round((actas.filter((x) => x.status === "Verificada").length / Math.max(1, actas.length)) * 100)}%`} note="Actas verificadas" icon={CheckCircle2}/><Metric label="Equipos registrados" value={String(assets.length)} note="Inventario de muestra" icon={Monitor}/><Metric label="Personal" value={String(people.length)} note="En el directorio" icon={Users}/></div>
        <div className="eq-report-grid"><article className="eq-section-panel"><h3>Actas por mes</h3><p>Volumen de registros de ejemplo</p><div className="eq-chart-bars">{[{m:"Jun",v:35},{m:"Jul",v:55},{m:"Ago",v:42},{m:"Sep",v:75},{m:"Oct",v:63},{m:"Nov",v:88}].map((x) => <div key={x.m}><span style={{height:`${x.v}%`}}/><small>{x.m}</small></div>)}</div></article><article className="eq-section-panel"><h3>Estado de verificación</h3><p>Distribución de actas registradas</p><div className="eq-report-donut" style={{background:`conic-gradient(var(--success) 0 ${(actas.filter((x) => x.status === "Verificada").length / Math.max(1, actas.length)) * 100}%, var(--warning) 0 100%)`}}><strong>{Math.round((actas.filter((x) => x.status === "Verificada").length / Math.max(1, actas.length)) * 100)}%</strong></div><div className="eq-report-legend"><span><i className="verified"/>Verificadas</span><span><i className="pending"/>Pendientes</span></div></article></div>
      </>}

      {section === "Ajustes" && <>
        <div className="eq-settings-grid"><article className="eq-section-panel"><span className="eq-settings-icon"><Settings2 size={20}/></span><h3>Apariencia del sistema</h3><p>Selecciona el tema que prefieres para trabajar.</p><div className="eq-theme-choice"><button type="button" className={mode === "dark" ? "selected" : ""} onClick={() => { if (mode !== "dark") toggleMode(); }}><span className="eq-theme-preview dark"/>Oscuro</button><button type="button" className={mode === "light" ? "selected" : ""} onClick={() => { if (mode !== "light") toggleMode(); }}><span className="eq-theme-preview light"/>Claro</button></div></article><article className="eq-section-panel"><span className="eq-settings-icon"><ShieldCheck size={20}/></span><h3>Sesión de demostración</h3><p>El sistema está funcionando con datos locales de prueba. No se envía información a un servidor ni a una base de datos.</p><Status>Modo demostración</Status></article><article className="eq-section-panel"><span className="eq-settings-icon"><ClipboardList size={20}/></span><h3>Preferencias generales</h3><p>Las opciones avanzadas estarán disponibles cuando se conecte la configuración institucional.</p><label className="eq-setting-toggle"><input type="checkbox" defaultChecked/> Mostrar notificaciones de actividad</label><label className="eq-setting-toggle"><input type="checkbox" defaultChecked/> Confirmar antes de cambiar estados</label></article></div>
      </>}
      {modal && <CreateModal title={modal === "acta" ? "Crear acta de entrega" : modal === "person" ? "Agregar persona" : modal === "project" ? "Crear proyecto" : "Agregar equipo al inventario"} onClose={() => setModal(null)} onSave={saveForm}>
        {modal === "acta" && <><Field name="person" label="Colaborador" placeholder="Nombre completo"/><Field name="asset" label="Equipo asignado" placeholder="Marca y modelo"/></>}
        {modal === "person" && <><Field name="name" label="Nombre completo" placeholder="Nombre y apellidos"/><Field name="role" label="Cargo" placeholder="Cargo institucional"/><Field name="department" label="Departamento" placeholder="Área o sede"/><Field name="email" label="Correo electrónico" placeholder="persona@oei.org"/></>}
        {modal === "project" && <><Field name="name" label="Nombre del proyecto" placeholder="Nombre del proyecto"/><Field name="area" label="Área" placeholder="Área responsable"/><Field name="owner" label="Responsable" placeholder="Equipo o persona"/></>}
        {modal === "asset" && <><Field name="id" label="Código de inventario" placeholder="EQ-LAP-020"/><label className="eq-form-field"><span>Tipo de equipo</span><select name="type"><option>Laptop</option><option>Tablet</option><option>Proyector</option></select></label><Field name="model" label="Marca y modelo" placeholder="Marca y modelo"/><Field name="serial" label="Número de serie" placeholder="Número de serie"/></>}
      </CreateModal>}
    </div>
  );
}
