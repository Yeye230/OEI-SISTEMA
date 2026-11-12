"use client";

import { useMemo, useSyncExternalStore, useState, type FormEvent } from "react";
import { Search, Plus, Pencil, Trash2, X, Download, Save, FolderOpen } from "lucide-react";

type WorkspaceRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: string;
};

type Field = { name: string; label: string; type?: string; required?: boolean; options?: string[] };

type ModuleConfig = {
  title: string;
  description: string;
  singular: string;
  fields: Field[];
  columns: string[];
};

const configs: Record<string, ModuleConfig> = {
  equipos: {
    title: "Equipos", description: "Controla el inventario institucional y el estado de cada equipo.", singular: "equipo",
    fields: [
      { name: "codigo", label: "Código / inventario", required: true },
      { name: "tipo", label: "Tipo de equipo", options: ["Laptop", "Tablet", "Proyector", "Monitor", "Otro"], required: true },
      { name: "marca", label: "Marca" }, { name: "modelo", label: "Modelo" },
      { name: "serie", label: "Número de serie" },
      { name: "estado", label: "Estado", options: ["Disponible", "Asignado", "En reparación", "Baja"] },
      { name: "ubicacion", label: "Ubicación / departamento" }
    ], columns: ["codigo", "tipo", "marca", "serie", "estado"]
  },
  personas: {
    title: "Personas", description: "Administra responsables, colaboradores y personas relacionadas con las entregas.", singular: "persona",
    fields: [
      { name: "nombre", label: "Nombre completo", required: true }, { name: "documento", label: "Documento / código" },
      { name: "correo", label: "Correo electrónico", type: "email" }, { name: "telefono", label: "Teléfono" },
      { name: "cargo", label: "Cargo" }, { name: "departamento", label: "Departamento" }
    ], columns: ["nombre", "documento", "cargo", "departamento", "correo"]
  },
  proyectos: {
    title: "Proyectos", description: "Da seguimiento a los proyectos y a sus responsables.", singular: "proyecto",
    fields: [
      { name: "nombre", label: "Nombre del proyecto", required: true }, { name: "codigo", label: "Código" },
      { name: "responsable", label: "Responsable" }, { name: "departamento", label: "Departamento" },
      { name: "fechaInicio", label: "Fecha de inicio", type: "date" }, { name: "fechaFin", label: "Fecha de finalización", type: "date" },
      { name: "estado", label: "Estado", options: ["Planificación", "En ejecución", "Finalizado", "Suspendido"] }
    ], columns: ["nombre", "codigo", "responsable", "estado", "fechaInicio"]
  },
  mapa: {
    title: "Mapa territorial", description: "Consulta la distribución territorial de los registros capturados en esta demostración.", singular: "ubicación",
    fields: [
      { name: "nombre", label: "Nombre del punto", required: true }, { name: "departamento", label: "Departamento", required: true },
      { name: "municipio", label: "Municipio" }, { name: "referencia", label: "Dirección o referencia" },
      { name: "latitud", label: "Latitud" }, { name: "longitud", label: "Longitud" }, { name: "tipo", label: "Tipo de punto" }
    ], columns: ["nombre", "departamento", "municipio", "tipo", "referencia"]
  },
  historial: {
    title: "Historial", description: "Revisa los movimientos registrados durante el uso de esta demostración.", singular: "movimiento",
    fields: [
      { name: "fecha", label: "Fecha", type: "date", required: true }, { name: "accion", label: "Acción", required: true },
      { name: "modulo", label: "Módulo" }, { name: "responsable", label: "Responsable" }, { name: "detalle", label: "Detalle" }
    ], columns: ["fecha", "accion", "modulo", "responsable", "detalle"]
  },
  reportes: {
    title: "Reportes", description: "Genera una descarga CSV de los registros guardados localmente.", singular: "reporte",
    fields: [
      { name: "nombre", label: "Nombre del reporte", required: true }, { name: "modulo", label: "Módulo", options: ["Actas", "Equipos", "Personas", "Proyectos"] },
      { name: "desde", label: "Desde", type: "date" }, { name: "hasta", label: "Hasta", type: "date" }, { name: "observaciones", label: "Observaciones" }
    ], columns: ["nombre", "modulo", "desde", "hasta", "observaciones"]
  },
  configuracion: {
    title: "Configuración", description: "Ajustes de esta demostración y preferencias de uso.", singular: "preferencia",
    fields: [
      { name: "institucion", label: "Institución", required: true }, { name: "responsable", label: "Responsable del sistema" },
      { name: "correo", label: "Correo de contacto", type: "email" }, { name: "zona", label: "Zona horaria" },
      { name: "notas", label: "Notas" }
    ], columns: ["institucion", "responsable", "correo", "zona", "notas"]
  }
};

const keyFor = (slug: string): string => `oei-demo:${slug}:v1`;
const emptySnapshot: WorkspaceRecord[] = [];\nconst snapshotCache = new Map<string, { raw: string | null; records: WorkspaceRecord[] }>();
const notify = (): void => window.dispatchEvent(new Event("oei-workspace-change"));

function readRecords(slug: string): WorkspaceRecord[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(keyFor(slug)) ?? "[]");
    return Array.isArray(value) ? value as WorkspaceRecord[] : [];
  } catch {
    return [];
  }
}

function useRecords(slug: string): WorkspaceRecord[] {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      window.addEventListener("oei-workspace-change", callback);
      return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener("oei-workspace-change", callback);
      };
    },
    () => readRecords(slug),
    () => emptySnapshot
  );
}

function saveRecords(slug: string, records: WorkspaceRecord[]): void {
  window.localStorage.setItem(keyFor(slug), JSON.stringify(records));
  notify();
}

function exportBackup(): void {
  const modules = ["actas", "equipos", "personas", "proyectos", "mapa", "historial", "reportes", "configuracion"];
  const backup = Object.fromEntries(modules.map((module) => {
    try {
      const value: unknown = JSON.parse(window.localStorage.getItem(keyFor(module)) ?? "[]");
      return [module, Array.isArray(value) ? value : []];
    } catch {
      return [module, []];
    }
  }));
  const url = URL.createObjectURL(new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), source: "OEI demo local", data: backup }, null, 2)], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "oei-respaldo-demostracion.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportCsv(filename: string, records: WorkspaceRecord[], columns: string[]): void {
  const rows = [columns, ...records.map((record) => columns.map((column) => record[column] ?? ""))];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function WorkspaceClient({ slug }: { slug: string }) {
  const config = configs[slug];
  const records = useRecords(slug);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<WorkspaceRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const visible = useMemo(() => records.filter((record) => Object.values(record).some((value) => value.toLowerCase().includes(query.toLowerCase()))), [records, query]);

  if (!config) return <main className="mx-auto max-w-3xl p-10"><h1 className="text-2xl font-bold">Apartado no disponible</h1><p className="mt-2 text-muted">La sección solicitada no existe.</p></main>;

  const openNew = (): void => { setEditing(null); setFormOpen(true); setNotice(""); };
  const openEdit = (record: WorkspaceRecord): void => { setEditing(record); setFormOpen(true); setNotice(""); };
  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values: Record<string, string> = {};
    config.fields.forEach((field) => { values[field.name] = String(form.get(field.name) ?? "").trim(); });
    if (config.fields.some((field) => field.required && !values[field.name])) {
      setNotice("Completa los campos obligatorios."); return;
    }
    const now = new Date().toISOString();
    const next: WorkspaceRecord = { ...(editing ?? {} as WorkspaceRecord), ...values, id: editing?.id ?? crypto.randomUUID(), createdAt: editing?.createdAt ?? now, updatedAt: now };
    saveRecords(slug, editing ? records.map((record) => record.id === editing.id ? next : record) : [next, ...records]);
    setFormOpen(false); setEditing(null); setNotice(`${config.singular[0].toUpperCase()}${config.singular.slice(1)} guardado correctamente.`);
  };
  const remove = (record: WorkspaceRecord): void => {
    if (!window.confirm(`¿Eliminar este registro de ${config.singular}?`)) return;
    saveRecords(slug, records.filter((item) => item.id !== record.id));
    setNotice("Registro eliminado.");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-xs font-bold uppercase tracking-widest text-primary">OEI · Gestión de Actas</p><h1 className="mt-2 text-3xl font-bold">{config.title}</h1><p className="mt-2 max-w-2xl text-sm text-muted">{config.description}</p></div>
          <button type="button" onClick={openNew} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"><Plus size={17} /> Nuevo registro</button>
        </header>

        {notice && <p role="status" className="rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-sm">{notice}</p>}

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-border bg-surface p-5"><p className="text-sm text-muted">Registros guardados</p><p className="mt-2 text-3xl font-bold">{records.length}</p></article>
          <article className="rounded-2xl border border-border bg-surface p-5"><p className="text-sm text-muted">Coincidencias</p><p className="mt-2 text-3xl font-bold">{visible.length}</p></article>
          <article className="rounded-2xl border border-border bg-surface p-5"><p className="text-sm text-muted">Almacenamiento</p><p className="mt-2 text-lg font-semibold">Este navegador</p><p className="mt-1 text-xs text-muted">Datos de demostración local</p></article>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block min-w-0 flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en los registros..." aria-label="Buscar registros" className="min-h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
            <button type="button" onClick={() => exportCsv(`oei-${slug}.csv`, visible, config.columns)} disabled={visible.length === 0} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"><Download size={16} /> Exportar CSV</button>
            {slug === "reportes" && <button type="button" onClick={exportBackup} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary px-4 text-sm font-semibold text-primary"><Download size={16} /> Respaldo completo JSON</button>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-surface-muted text-xs uppercase text-muted"><tr>{config.columns.map((column) => <th key={column} className="px-4 py-3 font-semibold">{config.fields.find((field) => field.name === column)?.label ?? column}</th>)}<th className="px-4 py-3">Acciones</th></tr></thead>
              <tbody>{visible.map((record) => <tr key={record.id} className="border-t border-border hover:bg-surface-muted/60">{config.columns.map((column) => <td key={column} className="max-w-64 truncate px-4 py-3">{record[column] || "—"}</td>)}<td className="px-4 py-3"><div className="flex gap-2"><button type="button" onClick={() => openEdit(record)} aria-label="Editar registro" className="rounded-lg p-2 text-primary hover:bg-primary-soft"><Pencil size={16} /></button><button type="button" onClick={() => remove(record)} aria-label="Eliminar registro" className="rounded-lg p-2 text-danger hover:bg-danger-soft"><Trash2 size={16} /></button></div></td></tr>)}</tbody>
            </table>
            {visible.length === 0 && <div className="px-5 py-14 text-center"><FolderOpen size={28} className="mx-auto text-muted" /><p className="mt-3 font-semibold">{query ? "No hay coincidencias" : "Todavía no hay registros"}</p><p className="mt-1 text-sm text-muted">{query ? "Prueba con otro término." : "Crea el primer registro para comenzar."}</p></div>}
          </div>
        </section>

        {formOpen && <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/50 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormOpen(false); }}><section role="dialog" aria-modal="true" aria-labelledby="workspace-form-title" className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:p-7"><div className="mb-5 flex items-center justify-between"><div><h2 id="workspace-form-title" className="text-xl font-bold">{editing ? "Editar" : "Nuevo"} {config.singular}</h2><p className="mt-1 text-sm text-muted">Los campos con * son obligatorios.</p></div><button type="button" onClick={() => setFormOpen(false)} aria-label="Cerrar formulario" className="rounded-lg p-2 hover:bg-surface-muted"><X size={19} /></button></div><form onSubmit={submit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2">{config.fields.map((field) => <label key={field.name} className={field.name === "detalle" || field.name === "observaciones" || field.name === "notas" ? "sm:col-span-2" : ""}><span className="mb-1.5 block text-sm font-medium">{field.label}{field.required ? " *" : ""}</span>{field.options ? <select name={field.name} defaultValue={editing?.[field.name] ?? ""} required={field.required} className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"><option value="">Seleccionar...</option>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input name={field.name} type={field.type ?? "text"} defaultValue={editing?.[field.name] ?? ""} required={field.required} className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />}</label>)}</div><div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end"><button type="button" onClick={() => setFormOpen(false)} className="min-h-11 rounded-xl border border-border px-4 text-sm font-semibold">Cancelar</button><button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"><Save size={16} /> Guardar registro</button></div></form></section></div>}
      </div>
    </main>
  );
}
