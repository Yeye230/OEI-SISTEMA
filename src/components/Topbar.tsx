"use client";

import { useState, type FormEvent } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const submitSearch = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const query = search.trim();
    if (query) router.push(`/busqueda?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 text-foreground backdrop-blur-xl">
      <div className="flex min-h-[76px] w-full items-center gap-3 px-4 sm:gap-5 sm:px-6 xl:px-8">
        <button type="button" aria-label="Abrir menú de navegación" aria-controls="oei-sidebar" onClick={onMenu} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted transition hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring lg:hidden"><Menu size={21} /></button>
        <div className="min-w-0 shrink-0"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">OEI · Gestión de Actas</p><p className="mt-1 text-sm font-medium text-muted">Panel institucional</p></div>
        <form onSubmit={submitSearch} role="search" className="ml-auto flex min-w-0 flex-1 justify-end">
          <div className="relative w-full max-w-[420px]"><Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar actas, personas o equipos..." aria-label="Buscar en todos los módulos" className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/10 sm:h-11 sm:pr-4" /></div>
        </form>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div aria-label="Notificaciones de demostración" title="Notificaciones" className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted"><Bell size={20} strokeWidth={1.8} /><span aria-hidden="true" className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full bg-warning ring-2 ring-surface" /></div>
          <div className="hidden h-9 w-px bg-border sm:block" />
          <div className="flex items-center gap-2 rounded-xl p-1.5 text-left sm:gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary ring-1 ring-primary/20 sm:h-10 sm:w-10 sm:text-sm">OEI</span><span className="hidden min-w-0 sm:block"><span className="block truncate text-sm font-semibold text-foreground">Administrador demo</span><span className="mt-0.5 block text-xs text-muted">Sesión local</span></span></div>
        </div>
      </div>
    </header>
  );
}
