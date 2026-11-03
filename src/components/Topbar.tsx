
"use client";

import { useState } from "react";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";

export default function Topbar({
  onMenu,
}: {
  onMenu: () => void;
}) {
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="flex min-h-[76px] w-full items-center gap-3 px-4 sm:gap-5 sm:px-6 xl:px-8">
        {/* Menú móvil */}
        <button
          type="button"
          aria-label="Abrir menú de navegación"
          aria-controls="oei-sidebar"
          onClick={onMenu}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 lg:hidden"
        >
          <Menu size={21} />
        </button>

        {/* Contexto de la página */}
        <div className="min-w-0 shrink-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
            OEI · Gestión de Actas
          </p>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Panel institucional
          </p>
        </div>

        {/* Buscador */}
        <div className="ml-auto flex min-w-0 flex-1 justify-end">
          <div className="relative w-full max-w-[420px]">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar actas, personas o equipos..."
              aria-label="Buscar actas, personas o equipos"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 sm:h-11 sm:pr-4"
            />
          </div>
        </div>

        {/* Acciones y perfil */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Notificaciones"
            title="Notificaciones"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <Bell size={20} strokeWidth={1.8} />

            <span
              aria-hidden="true"
              className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"
            />
          </button>

          <div className="hidden h-9 w-px bg-slate-200 sm:block" />

          <button
            type="button"
            aria-label="Perfil del administrador"
            className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:gap-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800 ring-1 ring-blue-200/70 sm:h-10 sm:w-10 sm:text-sm">
              LR
            </span>

            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-sm font-semibold text-slate-800">
                Administrador
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                Perfil de usuario
              </span>
            </span>

            <ChevronDown
              size={16}
              aria-hidden="true"
              className="hidden shrink-0 text-slate-400 sm:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
