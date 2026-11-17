"use client";

import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { Download, FilePlus2, FileText, Search, Pencil, Trash2, X, Save } from "lucide-react";
import SectionLayout from "@/components/SectionLayout";

type ProjectId = "docentes" | "directores";
type Acta = { id: string; createdAt: string; updatedAt: string; numero: string; tipo: string; responsable: string; proyectoId?: ProjectId; proyecto?: string; fecha: string; codigo: string; marca?: string; modelo?: string; serie?: string; mouse?: string; modem?: string; simBarra?: string; audifonos?: string; cargadorLaptop?: string; mochila?: string; accesorios?: string; observaciones?: string };
type ProjectFilter = "todas" | ProjectId | "sin-clasificar";
const storageKey = "oei-demo:actas:v1";
const empty: Acta[] = [];
let cachedRaw: string | null | undefined;
let cachedRecords: Acta[] = empty;
const projectName = (record: Acta): string => record.proyectoId === "docentes" || record.proyecto?.toLowerCase() === "docentes" ? "Docentes" : record.proyectoId === "directores" || record.proyecto?.toLowerCase() === "directores" ? "Directores" : "Sin clasificar";
const read = (): Acta[] => {
  const raw = window.localStorage.getItem(storageKey);
  if (cachedRaw === raw) return cachedRecords;
  cachedRaw = raw;
  try { const value: unknown = JSON.parse(raw ?? "[]"); cachedRecords = Array.isArray(value) ? value as Acta[] : []; }
  catch { cachedRecords = []; }
  return cachedRecords;
};
const useActas = (): Acta[] => useSyncExternalStore((callback) => {
  window.addEventListener("storage", callback);
  window.addEventListener("oei-workspace-change", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("oei-workspace-change", callback); };
}, read, () => empty);
function exportCsv(records: Acta[]): void {
  const header = ["numero", "equipo", "responsable", "proyecto_interno", "fecha", "codigo", "marca", "modelo", "serie", "mouse", "modem", "sim_barra", "audifonos", "cargador_laptop", "mochila", "accesorios", "observaciones"];
  const csv = [header, ...records.map((record) => [record.numero, record.tipo, record.responsable, projectName(record), record.fecha, record.codigo, record.marca ?? "", record.modelo ?? "", record.serie ?? "", record.mouse ?? "No", record.modem ?? "No", record.simBarra ?? "", record.audifonos ?? "No", record.cargadorLaptop ?? "No", record.mochila ?? "No", record.accesorios ?? "", record.observaciones ?? ""])]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = "oei-actas.csv"; anchor.click(); URL.revokeObjectURL(url);
}
function writeRecords(records: Acta[]): void { window.localStorage.setItem(storageKey, JSON.stringify(records)); cachedRaw = null; window.dispatchEvent(new Event("oei-workspace-change")); }
function addHistory(action: string, acta: Acta): void {
  const key = "oei-demo:historial:v1";
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    const history = Array.isArray(parsed) ? parsed as Array<Record<string, string>> : [];
    const now = new Date().toISOString();
    history.unshift({ id: crypto.randomUUID(), createdAt: now, updatedAt: now, fecha: now.slice(0, 10), accion: action, modulo: "Actas", responsable: acta.responsable, proyectoId: acta.proyectoId ?? "", proyecto: projectName(acta), detalle: `Acta ${acta.numero} · ${acta.tipo}` });
    window.localStorage.setItem(key, JSON.stringify(history));
    window.dispatchEvent(new Event("oei-workspace-change"));
  } catch { /* El historial no debe impedir administrar un acta. */ }
}
export default function ActasClient(): React.JSX.Element {
  const records = useActas();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("todas");
  const [project, setProject] = useState<ProjectFilter>("todas");
  const [editing, setEditing] = useState<Acta | null>(null);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => records.filter((record) =>
    (type === "todas" || record.tipo.toLowerCase() === type) &&
    (project === "todas" || (project === "sin-clasificar" ? projectName(record) === "Sin clasificar" : projectName(record).toLowerCase() === project)) &&
    [record.numero, record.tipo, record.responsable, projectName(record), record.codigo, record.marca ?? "", record.modelo ?? "", record.serie ?? ""].some((value) => value.toLowerCase().includes(search.toLowerCase()))
  ), [records, search, type, project]);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const remove = (record: Acta): void => {
    if (!window.confirm(`¿Eliminar el acta ${record.numero}?`)) return;
    writeRecords(records.filter((item) => item.id !== record.id)); addHistory("Eliminación", record); setNotice(`Acta ${record.numero} eliminada.`);
  };
  const saveEdit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault(); if (!editing) return;
    const form = new FormData(event.currentTarget);
    const updated: Acta = { ...editing, numero: String(form.get("numero") ?? "").trim(), tipo: String(form.get("tipo") ?? ""), responsable: String(form.get("responsable") ?? "").trim(), proyectoId: String(form.get("proyectoId") ?? "") as ProjectId, fecha: String(form.get("fecha") ?? ""), codigo: String(form.get("codigo") ?? "").trim(), marca: String(form.get("marca") ?? "").trim(), modelo: String(form.get("modelo") ?? "").trim(), serie: String(form.get("serie") ?? "").trim(), mouse: String(form.get("mouse") ?? "No"), modem: String(form.get("modem") ?? "No"), simBarra: String(form.get("simBarra") ?? "").trim(), audifonos: String(form.get("audifonos") ?? "No"), cargadorLaptop: String(form.get("cargadorLaptop") ?? "No"), mochila: String(form.get("mochila") ?? "No"), accesorios: String(form.get("accesorios") ?? "").trim(), observaciones: String(form.get("observaciones") ?? "").trim(), updatedAt: new Date().toISOString() };
    if (!updated.numero || !updated.responsable || !updated.fecha || !["docentes", "directores"].includes(updated.proyectoId)) { setNotice("Completa el número, responsable, fecha y proyecto."); return; }
    if (records.some((record) => record.id !== editing.id && record.numero.toLowerCase() === updated.numero.toLowerCase())) { setNotice("Ya existe otra acta con ese número."); return; }
    writeRecords(records.map((record) => record.id === editing.id ? updated : record)); addHistory("Actualización", updated); setEditing(null); setNotice(`Acta ${updated.numero} actualizada.`);
  };
  return <SectionLayout title="Actas registradas" subtitle="Consulta, filtra y administra las actas de entrega de equipos.">
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">OEI · Gestión de Actas</p><h2 className="mt-2 text-2xl font-bold">Registro de entregas</h2><p className="mt-2 text-sm text-muted">Consulta, filtra, edita y exporta las actas por proyecto.</p></div><Link href="/actas/nueva" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"><FilePlus2 size={17} /> Nueva acta</Link></header>
      {notice && <p role="status" className="rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-sm">{notice}</p>}
      <section className="grid gap-4 sm:grid-cols-3"><article className="rounded-2xl border border-border bg-surface p-5"><p className="text-sm text-muted">Total de actas</p><p className="mt-2 text-3xl font-bold">{records.length}</p></article><article className="rounded-2xl border border-border bg-surface p-5"><p className="text-sm text-muted">Registradas este mes</p><p className="mt-2 text-3xl font-bold">{records.filter((record) => record.fecha.startsWith(currentMonth)).length}</p></article><article className="rounded-2xl border border-border bg-surface p-5"><p className="text-sm text-muted">Docentes / Directores</p><p className="mt-2 text-3xl font-bold">{records.filter((record) => projectName(record) === "Docentes").length} / {records.filter((record) => projectName(record) === "Directores").length}</p></article></section>
      <section className="overflow-hidden rounded-2xl border border-border bg-surface"><div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row">
        <label className="relative min-w-0 flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por número, responsable o proyecto..." aria-label="Buscar actas" className="min-h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary" /></label>
        <select value={project} onChange={(event) => setProject(event.target.value as ProjectFilter)} aria-label="Filtrar por proyecto" className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm"><option value="todas">Todos los proyectos</option><option value="docentes">Docentes</option><option value="directores">Directores</option><option value="sin-clasificar">Sin clasificar (anteriores)</option></select>
        <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filtrar tipo de acta" className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm"><option value="todas">Todos los equipos</option><option value="laptop">Laptop</option><option value="tablet">Tablet</option><option value="proyector">Proyector</option></select>
        <button type="button" onClick={() => exportCsv(filtered)} disabled={!filtered.length} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm disabled:opacity-50"><Download size={16} /> Exportar</button>
      </div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-surface-muted text-xs uppercase text-muted"><tr>{["N.º de acta", "Tipo", "Responsable", "Proyecto interno", "Fecha", "Código equipo", "Acciones"].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}</tr></thead><tbody>{filtered.map((record) => <tr key={record.id} className="border-t border-border"><td className="px-4 py-3 font-semibold">{record.numero}</td><td className="px-4 py-3">{record.tipo}</td><td className="px-4 py-3">{record.responsable}</td><td className="px-4 py-3">{projectName(record)}</td><td className="px-4 py-3">{record.fecha}</td><td className="px-4 py-3">{record.codigo || "—"}</td><td className="px-4 py-3"><div className="flex gap-1"><button type="button" onClick={() => setEditing(record)} aria-label={`Editar acta ${record.numero}`} className="rounded-lg p-2 text-primary hover:bg-primary-soft"><Pencil size={16} /></button><button type="button" onClick={() => remove(record)} aria-label={`Eliminar acta ${record.numero}`} className="rounded-lg p-2 text-danger hover:bg-danger-soft"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table>
      {!filtered.length && <div className="px-5 py-14 text-center"><FileText size={28} className="mx-auto text-muted" /><p className="mt-3 font-semibold">{records.length ? "No hay coincidencias" : "Todavía no hay actas"}</p><p className="mt-1 text-sm text-muted">Crea una nueva acta para comenzar el registro.</p><Link href="/actas/nueva" className="mt-4 inline-flex text-sm font-semibold text-primary">Crear primera acta</Link></div>}</div></section>
      <p className="text-xs text-muted">Los datos se guardan localmente en este navegador; las actas anteriores sin proyecto asignado se conservan como «Sin clasificar».</p>
    </div></main>
    {editing && <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/50 p-4"><section role="dialog" aria-modal="true" aria-labelledby="edit-acta-title" className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 id="edit-acta-title" className="text-xl font-bold">Editar acta {editing.numero}</h2><button type="button" onClick={() => setEditing(null)} aria-label="Cerrar edición" className="rounded-lg p-2 hover:bg-surface-muted"><X size={18} /></button></div><form onSubmit={saveEdit} className="grid gap-4 sm:grid-cols-2">
      {([{ name: "numero", label: "Número de acta", required: true }, { name: "responsable", label: "Persona destinataria", required: true }, { name: "fecha", label: "Fecha de entrega", type: "date", required: true }, { name: "codigo", label: "Código de inventario" }, { name: "marca", label: "Marca" }, { name: "modelo", label: "Modelo" }, { name: "serie", label: "N.º Serial" }, { name: "simBarra", label: "SIM Barra" }, { name: "accesorios", label: "Accesorios adicionales" }, { name: "observaciones", label: "Observaciones" }] as const).map((field) => <label key={field.name} className={field.name === "observaciones" ? "sm:col-span-2" : ""}><span className="mb-1 block text-sm font-medium">{field.label}</span><input name={field.name} type={field.type ?? "text"} defaultValue={editing[field.name] ?? ""} required={field.required} className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" /></label>)}
      <label><span className="mb-1 block text-sm font-medium">Proyecto interno *</span><select name="proyectoId" defaultValue={editing.proyectoId ?? (editing.proyecto?.toLowerCase() === "directores" ? "directores" : editing.proyecto?.toLowerCase() === "docentes" ? "docentes" : "")} required className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"><option value="">Seleccionar...</option><option value="docentes">Docentes</option><option value="directores">Directores</option></select></label>
      <label><span className="mb-1 block text-sm font-medium">Equipo</span><select name="tipo" defaultValue={editing.tipo} className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"><option>Laptop</option><option>Tablet</option><option>Proyector</option></select></label>{([{ name: "mouse", label: "Mouse" }, { name: "modem", label: "Módem" }, { name: "audifonos", label: "Audífonos" }, { name: "cargadorLaptop", label: "Cargador de laptop" }, { name: "mochila", label: "Mochila" }] as const).map((field) => <label key={field.name}><span className="mb-1 block text-sm font-medium">{field.label}</span><select name={field.name} defaultValue={editing[field.name] ?? "No"} className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"><option>No</option><option>Sí</option></select></label>)}
      <div className="flex gap-2 sm:col-span-2 sm:justify-end"><button type="button" onClick={() => setEditing(null)} className="min-h-11 rounded-xl border border-border px-4 text-sm font-semibold">Cancelar</button><button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"><Save size={16} /> Guardar cambios</button></div>
    </form></section></div>}
  </SectionLayout>;
}
