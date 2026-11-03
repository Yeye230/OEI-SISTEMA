
"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Download,
} from "lucide-react";
import Link from "next/link";
import SectionLayout from "@/components/SectionLayout";

export default function ActasPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("todas");

  return (
    <SectionLayout
      title="Actas registradas"
      subtitle="Consulta y administra las actas de entrega de equipos."
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total de actas</p>
            <FileText size={20} className="text-blue-600" />
          </div>
          <p className="mt-3 text-3xl font-bold text-[#102b49]">—</p>
          <p className="mt-1 text-xs text-slate-400">
            Pendiente de conectar
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Este mes</p>
            <FileText size={20} className="text-teal-600" />
          </div>
          <p className="mt-3 text-3xl font-bold text-[#102b49]">—</p>
          <p className="mt-1 text-xs text-slate-400">
            Pendiente de conectar
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Tipos de acta</p>
            <Filter size={20} className="text-violet-600" />
          </div>
          <p className="mt-3 text-3xl font-bold text-[#102b49]">3</p>
          <p className="mt-1 text-xs text-slate-400">
            Laptop, tablet y proyector
          </p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:p-5">
          <div>
            <h2 className="font-bold text-[#102b49]">
              Registro de actas
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Busca documentos y filtra por tipo.
            </p>
          </div>

          <Link
            href="/actas/nueva"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <Plus size={17} />
            Nueva acta
          </Link>
        </div>

        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:p-5">
          <label className="relative min-w-0 flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por número, responsable o proyecto..."
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            aria-label="Filtrar por tipo de acta"
            className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-500"
          >
            <option value="todas">Todos los tipos</option>
            <option value="laptop">Laptop</option>
            <option value="tablet">Tablet</option>
            <option value="proyector">Proyector</option>
          </select>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Download size={16} />
            Imprimir
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">N.º de acta</th>
                <th className="px-5 py-4 font-semibold">Tipo de equipo</th>
                <th className="px-5 py-4 font-semibold">Responsable</th>
                <th className="px-5 py-4 font-semibold">Proyecto</th>
                <th className="px-5 py-4 font-semibold">Fecha</th>
                <th className="px-5 py-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="px-5 py-14 text-center">
                  <div className="flex flex-col items-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <FileText size={26} />
                    </span>
                    <p className="mt-4 font-semibold text-slate-700">
                      Todavía no hay actas conectadas
                    </p>
                    <p className="mt-1 max-w-md text-sm text-slate-500">
                      Los documentos aparecerán aquí cuando conectemos el
                      registro de actas a la fuente de datos.
                    </p>
                    <Link
                      href="/actas/nueva"
                      className="mt-4 text-sm font-semibold text-teal-700 hover:text-teal-800"
                    >
                      Crear la primera acta
                    </Link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-400">
          No se muestran registros ficticios como si fueran actas reales.
          {search || type !== "todas"
            ? " Los filtros se aplicarán cuando se conecten los registros."
            : ""}
        </div>
      </section>
    </SectionLayout>
  );
}
