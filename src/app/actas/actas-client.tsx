"use client";

import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { Download, FilePlus2, FileText, Search, Pencil, Trash2, X, Save } from "lucide-react";
import SectionLayout from "@/components/SectionLayout";

type Acta = {
  id: string;
  createdAt: string;
  updatedAt: string;
  numero: string;
  tipo: string;
  responsable: string;
  proyecto: string;
  fecha: string;
  codigo: string;
  serie?: string;
  observaciones?: string;
};

const storageKey = "oei-demo:actas:v1";
const empty: Acta[] = [];
let cachedRaw: string | null | undefined;
let cachedRecords: Acta[] = empty;

const read = (): Acta[] => {
  const raw = window.localStorage.getItem(storageKey);
  if (cachedRaw === raw) return cachedRecords;
  cachedRaw = raw;
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    cachedRecords = Array.isArray(value) ? value as Acta[] : [];
  } catch {
    cachedRecords = [];
  }
  return cachedRecords;
};

const useActas = (): Acta[] => useSyncExternalStore(
  (callback) => {
    window.addEventListener("storage", callback);
    window.addEventListener("oei-workspace-change", callback);
    return () => {
      window.removeEventListener("storage", callback);
      window.removeEventListener("oei-workspace-change", callback);
    };
  },
  read,
  () => empty
);

function exportCsv(records: Acta[]): void {
  const header = ["numero", "tipo", "responsable", "proyecto", "fecha", "codigo", "serie", "observaciones"];
  const csv = [header, ...records.map((record) => header.map((field) => record[field as keyof Acta] ?? ""))]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "oei-actas.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function writeRecords(records: Acta[]): void {
  window.localStorage.setItem(storageKey, JSON.stringify(records));
  cachedRaw = null;
  window.dispatchEvent(new Event("oei-workspace-change"));
}

function addHistory(action: string, acta: Acta): void {
  const key = "oei-demo:historial:v1";
  let history: Array<Record<string, string>> = [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    history = Array.isArray(parsed) ? parsed as Array<Record<string, string>> : [];
  } catch {
    history = [];
  }
  const now = new Date().toISOString();
  history.unshift({
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    fecha: now.slice(0, 10),
    accion: action,
    modulo: "Actas",
    responsable: acta.responsable,
    detalle: `Acta ${acta.numero} · ${acta.tipo}`
  });
  window.localStorage.setItem(key, JSON.stringify(history));
  window.dispatchEvent(new Event("oei-workspace-change"));
}

export default function ActasClient(): React.JSX.Element {
  const records = useActas();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("todas");
  const [editing, setEditing] = useState<Acta | null>(null);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(
    () => records.filter((record) =>
      (type === "todas" || record.tipo.toLowerCase() === type) &&
      [record.numero, record.tipo, record.responsable, record.proyecto, record.codigo]
        .some((value) => value.toLowerCase().includes(search.toLowerCase()))
    ),
    [records, search, type]
  );

  const currentMonth = new Date().toISOString().slice(0, 7);
  const remove = (record: Acta): void => {
    if (!window.confirm(`¿Eliminar el acta ${record.numero}?`)) return;
    writeRecords(records.filter((item) => item.id !== record.id));
    addHistory("Eliminación", record);
    setNotice(`Acta ${record.numero} eliminada.`);
  };

  const saveEdit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!editing) return;
    const form = new FormData(event.currentTarget);
    const updated: Acta = {
      ...editing,
      numero: String(form.get("numero") ?? "").trim(),
      tipo: String(form.get("tipo") ?? ""),
      responsable: String(form.get("responsable") ?? "").trim(),
      proyecto: String(form.get("proyecto") ?? "").trim(),
      fecha: String(form.get("fecha") ?? ""),
      codigo: String(form.get("codigo") ?? "").trim(),
      serie: String(form.get("serie") ?? "").trim(),
      observaciones: String(form.get("observaciones") ?? "").trim(),
      updatedAt: new Date().toISOString()
    };
    if (!updated.numero || !updated.responsable || !updated.fecha) {
      setNotice("Completa el número, responsable y fecha.");
      return;
    }
    if (records.some((record) => record.id !== editing.id && record.numero.toLowerCase() === updated.numero.toLowerCase())) {
      setNotice("Ya existe otra acta con ese número.");
      return;
    }
    writeRecords(records.map((record) => record.id === editing.id ? updated : record));
    addHistory("Actualización", updated);
    setEditing(null);
    setNotice(`Acta ${updated.numero} actualizada.`);
  };

  return (
    <SectionLayout title="Actas registradas" subtitle="Consulta, filtra y administra las actas de entrega de equipos.">
      <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="text-xs font-bold uppercase tracking-widest text-primary">OEI · Gestión de Actas</p><h2 className="mt-2 text-2xl font-bold">Registro de entregas</h2><p className="mt-2 text-sm text-muted">Consulta, filtra, edita y exporta las actas de entrega.</p></div>
            <Link href="/actas/nueva" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"><FilePlus2 size={17} /> Nueva acta</Link>
          </header>
          {notice && <p role="status" className="rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-sm">{notice}</p>}
          <section className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-border bg-surface p-5"><p className="text-sm text-muted">Total de actas</p><p className="mt-2 text-3xl font-bold">{records.length}</p></article>
            <article className="rounded-2xl border border-border bg-surface p-5"><p className="text-sm text-muted">Registradas este mes</p><p className="mt-2 text-3xl font-bold">{records.filter((record) => record.fecha.startsWith(currentMonth)).length}</p></article>
            <article className="rounded-2xl border border-border bg-surface p-5"><p className="text-sm text-muted">Tipos de acta</p><p className="mt-2 text-3xl font-bold">3</p><p className="text-xs text-muted">Laptop, tablet y proyector</p></article>
          </section>
          <section className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row">
              <label className="relative min-w-0 flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por número, responsable, proyecto..." aria-label="Buscar actas" className="min-h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary" /></label>
              <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filtrar tipo de acta" className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm"><option value="todas">Todos los tipos</option><option value="laptop">Laptop</option><option value="tablet">Tablet</option><option value="proyector">Proyector</option></select>
              <button type="button" onClick={() => exportCsv(filtered)} disabled={!filtered.length} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm disabled:opacity-50"><Download size={16} /> Exportar</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-surface-muted text-xs uppercase text-muted"><tr>{["N.º de acta", "Tipo", "Responsable", "Proyecto", "Fecha", "Código equipo", "Acciones"].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}</tr></thead>
                <tbody>{filtered.map((record) => <tr key={record.id} className="border-t border-border"><td className="px-4 py-3 font-semibold">{record.numero}</td><td className="px-4 py-3">{record.tipo}</td><td className="px-4 py-3">{record.responsable}</td><td className="px-4 py-3">{record.proyecto || "—"}</td><td className="px-4 py-3">{record.fecha}</td><td className="px-4 py-3">{record.codigo || "—"}</td><td className="px-4 py-3"><div className="flex gap-1"><button type="button" onClick={() => setEditing(record)} aria-label={`Editar acta ${record.numero}`} className="rounded-lg p-2 text-primary hover:bg-primary-soft"><Pencil size={16} /></button><button type="button" onClick={() => remove(record)} aria-label={`Eliminar acta ${record.numero}`} className="rounded-lg p-2 text-danger hover:bg-danger-soft"><Trash2 size={16} /></button></div></td></tr>)}</tbody>
              </table>
              {!filtered.length && <div className="px-5 py-14 text-center"><FileText size={28} className="mx-auto text-muted" /><p className="mt-3 font-semibold">{records.length ? "No hay coincidencias" : "Todavía no hay actas"}</p><p className="mt-1 text-sm text-muted">Crea una nueva acta para comenzar el registro.</p><Link href="/actas/nueva" className="mt-4 inline-flex text-sm font-semibold text-primary">Crear primera acta</Link></div>}
            </div>
          </section>
          <p className="text-xs text-muted">Los datos se guardan localmente en este navegador. No están sincronizados con la base de datos institucional.</p>
        </div>
      </main>
      {editing && <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/50 p-4"><section role="dialog" aria-modal="true" aria-labelledby="edit-acta-title" className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 id="edit-acta-title" className="text-xl font-bold">Editar acta {editing.numero}</h2><button type="button" onClick={() => setEditing(null)} aria-label="Cerrar edición" className="rounded-lg p-2 hover:bg-surface-muted"><X size={18} /></button></div><form onSubmit={saveEdit} className="grid gap-4 sm:grid-cols-2">{([{ name: "numero", label: "Número de acta", required: true }, { name: "responsable", label: "Responsable", required: true }, { name: "proyecto", label: "Proyecto" }, { name: "fecha", label: "Fecha", type: "date", required: true }, { name: "codigo", label: "Código de equipo" }, { name: "serie", label: "Número de serie" }, { name: "observaciones", label: "Observaciones" }] as const).map((field) => <label key={field.name} className={field.name === "observaciones" ? "sm:col-span-2" : ""}><span className="mb-1 block text-sm font-medium">{field.label}</span><input name={field.name} type={field.type ?? "text"} defaultValue={editing[field.name] ?? ""} required={field.required} className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" /></label>)}<label><span className="mb-1 block text-sm font-medium">Tipo</span><select name="tipo" defaultValue={editing.tipo} className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"><option>Laptop</option><option>Tablet</option><option>Proyector</option></select></label><div className="flex gap-2 sm:col-span-2 sm:justify-end"><button type="button" onClick={() => setEditing(null)} className="min-h-11 rounded-xl border border-border px-4 text-sm font-semibold">Cancelar</button><button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"><Save size={16} /> Guardar cambios</button></div></form></section></div>}
    </SectionLayout>
  );
}
