"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type RecordItem = { id?: string; [key: string]: unknown };
type Result = { id: string; module: string; title: string; detail: string; href: string };
const modules = [
  { key: "actas", label: "Actas", href: "/actas" },
  { key: "equipos", label: "Equipos", href: "/equipos" },
  { key: "personas", label: "Personas", href: "/personas" },
  { key: "proyectos", label: "Proyectos", href: "/proyectos" },
  { key: "mapa", label: "Mapa", href: "/mapa" },
  { key: "historial", label: "Historial", href: "/historial" },
  { key: "reportes", label: "Reportes", href: "/reportes" },
  { key: "configuracion", label: "Configuración", href: "/configuracion" }
];
const empty: Result[] = [];
let cachedRaw = "";
let cachedResults: Result[] = empty;

const readAll = (): Result[] => {
  const raw = modules.map((item) => window.localStorage.getItem(`oei-demo:${item.key}:v1`) ?? "[]").join("|");
  if (raw === cachedRaw) return cachedResults;
  cachedRaw = raw;
  const results: Result[] = [];
  modules.forEach((module) => {
    let records: RecordItem[] = [];
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(`oei-demo:${module.key}:v1`) ?? "[]");
      records = Array.isArray(parsed) ? parsed as RecordItem[] : [];
    } catch {
      records = [];
    }
    records.forEach((record) => {
      const values = Object.entries(record).filter(([key, value]) => key !== "id" && key !== "createdAt" && key !== "updatedAt" && typeof value === "string");
      const title = String(record.numero ?? record.nombre ?? record.codigo ?? record.accion ?? module.label);
      const detail = values.slice(0, 4).map(([key, value]) => `${key}: ${String(value)}`).join(" · ");
      results.push({ id: String(record.id ?? `${module.key}-${results.length}`), module: module.label, title, detail, href: module.href });
    });
  });
  cachedResults = results;
  return cachedResults;
};

const subscribe = (callback: () => void): (() => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("oei-workspace-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("oei-workspace-change", callback);
  };
};

export default function SearchResultsClient({ query }: { query: string }): React.JSX.Element {
  const records = useSyncExternalStore(subscribe, readAll, () => empty);
  const matches = useMemo(() => records.filter((record) => `${record.title} ${record.detail} ${record.module}`.toLowerCase().includes(query.toLowerCase())), [records, query]);
  return <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6"><div className="mx-auto max-w-5xl space-y-5"><header><p className="text-xs font-bold uppercase tracking-widest text-primary">Búsqueda global</p><h1 className="mt-2 text-3xl font-bold">Resultados para “{query}”</h1><p className="mt-2 text-sm text-muted">{matches.length} coincidencias en los registros locales.</p></header>{matches.length ? <div className="overflow-hidden rounded-2xl border border-border bg-surface">{matches.map((record) => <Link key={record.id} href={record.href} className="block border-b border-border p-4 last:border-0 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"><span className="text-xs font-semibold uppercase tracking-wide text-primary">{record.module}</span><p className="mt-1 font-semibold">{record.title}</p><p className="mt-1 text-sm text-muted">{record.detail}</p></Link>)}</div> : <div className="rounded-2xl border border-border bg-surface px-5 py-14 text-center"><Search size={28} className="mx-auto text-muted" /><p className="mt-3 font-semibold">No encontramos coincidencias</p><p className="mt-1 text-sm text-muted">Prueba con otro nombre, código o número de acta.</p></div>}</div></main>;
}
