"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";\nimport SectionLayout from "@/components/SectionLayout";
import { Download, FilePlus2, FileText, Search } from "lucide-react";

type Acta = { id: string; createdAt: string; updatedAt: string; numero: string; tipo: string; responsable: string; proyecto: string; fecha: string; codigo: string };
const storageKey = "oei-demo:actas:v1";
const empty: Acta[] = [];
const read = (): Acta[] => {
  try { const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]"); return Array.isArray(value) ? value as Acta[] : []; }
  catch { return []; }
};
const useActas = (): Acta[] => useSyncExternalStore(
  (callback) => { window.addEventListener("storage", callback); window.addEventListener("oei-workspace-change", callback); return () => { window.removeEventListener("storage", callback); window.removeEventListener("oei-workspace-change", callback); }; },
  read,
  () => empty
);

export default function ActasPage() {
  const records = useActas();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("todas");
  const filtered = useMemo(() => records.filter((record) => (type === "todas" || record.tipo.toLowerCase() === type) && [record.numero, record.tipo, record.responsable, record.proyecto, record.codigo].some((value) => value.toLowerCase().includes(search.toLowerCase()))), [records, search, type]);
  const exportCsv = (): void => {
    const header = ["numero", "tipo", "responsable", "proyecto", "fecha", "codigo"];
    const csv = [header, ...filtered.map((record) => header.map((field) => record[field as keyof Acta] ?? ""))].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "oei-actas.csv"; anchor.click(); URL.revokeObjectURL(url);
  };
  const currentMonth = new Date().toISOString().slice(0, 7);
  return <SectionLayout title="Actas registradas" subtitle="Consulta, filtra y exporta las actas de entrega de equipos."><main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">OEI · Gestión de Actas</p><h1 className="mt-2 text-3xl font-bold">Actas registradas</h1><p className="mt-2 text-sm text-muted">Consulta, filtra y exporta las actas de entrega de equipos.</p></div><Link href="/actas/nueva" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"><FilePlus2 size={17} /> Nueva acta</Link></header>
    <section className="grid gap-4 sm:grid-cols-3"><article className="rounded-2xl border border-border bg-surface p-5"><p className="text-sm text-muted">Total de actas</p><p className="mt-2 text-3xl font-bold">{records.length}</p></article><article className="rounded-2xl border border-border bg-surface p-5"><p className="text-sm text-muted">Registradas este mes</p><p className="mt-2 text-3xl font-bold">{records.filter((record) => record.fecha.startsWith(currentMonth)).length}</p></article><article className="rounded-2xl border border-border bg-surface p-5"><p className="text-sm text-muted">Tipos de acta</p><p className="mt-2 text-3xl font-bold">3</p><p className="text-xs text-muted">Laptop, tablet y proyector</p></article></section>
    <section className="overflow-hidden rounded-2xl border border-border bg-surface"><div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row"><label className="relative min-w-0 flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por número, responsable, proyecto..." aria-label="Buscar actas" className="min-h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary" /></label><select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filtrar tipo de acta" className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm"><option value="todas">Todos los tipos</option><option value="laptop">Laptop</option><option value="tablet">Tablet</option><option value="proyector">Proyector</option></select><button type="button" onClick={exportCsv} disabled={!filtered.length} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm disabled:opacity-50"><Download size={16} /> Exportar</button></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-surface-muted text-xs uppercase text-muted"><tr>{["N.º de acta","Tipo","Responsable","Proyecto","Fecha","Código equipo"].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}</tr></thead><tbody>{filtered.map((record) => <tr key={record.id} className="border-t border-border"><td className="px-4 py-3 font-semibold">{record.numero}</td><td className="px-4 py-3">{record.tipo}</td><td className="px-4 py-3">{record.responsable}</td><td className="px-4 py-3">{record.proyecto || "—"}</td><td className="px-4 py-3">{record.fecha}</td><td className="px-4 py-3">{record.codigo || "—"}</td></tr>)}</tbody></table>{!filtered.length && <div className="px-5 py-14 text-center"><FileText size={28} className="mx-auto text-muted" /><p className="mt-3 font-semibold">{records.length ? "No hay coincidencias" : "Todavía no hay actas"}</p><p className="mt-1 text-sm text-muted">Crea una nueva acta para comenzar el registro.</p><Link href="/actas/nueva" className="mt-4 inline-flex text-sm font-semibold text-primary">Crear primera acta</Link></div>}</div></section>
    <p className="text-xs text-muted">Los datos se guardan localmente en este navegador. No están sincronizados con la base de datos institucional.</p>
  </div></main></SectionLayout>;
}
