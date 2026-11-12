
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  FilePlus2,
  FileText,
  Home,
  LogOut,
  Monitor,
  Settings,
  Users,
  FolderKanban,
  MapPin,
  History,
  X,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Nueva acta", icon: FilePlus2, href: "/actas/nueva" },
  { label: "Actas registradas", icon: FileText, href: "/actas" },
  { label: "Equipos", icon: Monitor, href: "/equipos" },
  { label: "Personas", icon: Users, href: "/personas" },
  { label: "Proyectos", icon: FolderKanban, href: "/proyectos" },
  { label: "Mapa", icon: MapPin, href: "/mapa" },
  { label: "Historial", icon: History, href: "/historial" },
  { label: "Reportes", icon: BarChart3, href: "/reportes" },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const signOut = async (): Promise<void> => {
    await fetch("/api/demo/session", { method: "DELETE" });
    router.push("/auth/iniciar-sesion");
    router.refresh();
  };

  const activeHref = navigation
    .filter(
      ({ href }) =>
        pathname === href ||
        (href !== "/" && pathname.startsWith(`${href}/`))
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <>
      {/* Fondo oscuro para el menú móvil */}
      {open && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        id="oei-sidebar"
        aria-label="Menú principal"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-hidden text-white shadow-xl transition-transform duration-200 ease-in-out lg:translate-x-0 lg:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(180deg, #0b2945 0%, #0a2540 58%, #071e35 100%)",
        }}
      >
        {/* Ilustración institucional del fondo */}
        <svg
          aria-hidden="true"
          viewBox="0 0 256 260"
          className="pointer-events-none absolute bottom-0 left-0 h-[260px] w-full"
          preserveAspectRatio="xMidYMax slice"
        >
          <path
            d="M0 260V150l50-50 40 40 45-60 55 70 66-45v155z"
            fill="#123b5e"
          />
          <path
            d="M0 260V190l60-35 50 30 60-45 86 55v65z"
            fill="#0e3050"
          />
          <g fill="#1a4a70">
            <rect x="78" y="168" width="100" height="62" />
            <polygon points="70,168 128,138 186,168" />
            <rect x="116" y="112" width="24" height="30" />
            <path d="M112 112a16 16 0 0 1 32 0z" />
          </g>
          <g fill="#0e3050">
            <rect x="88" y="182" width="8" height="48" />
            <rect x="106" y="182" width="8" height="48" />
            <rect x="124" y="182" width="8" height="48" />
            <rect x="142" y="182" width="8" height="48" />
            <rect x="160" y="182" width="8" height="48" />
          </g>
          <path d="M0 260v-24h256v24z" fill="#0a2742" />
        </svg>

        {/* Marca OEI */}
        <div className="relative flex shrink-0 items-start justify-between px-6 pb-5 pt-7">
          <Link
            href="/"
            onClick={onClose}
            aria-label="OEI Gestión de Actas, inicio"
            className="block"
          >
            <span className="block text-[40px] font-black leading-none tracking-[-0.07em] text-white">
              OEI
            </span>

            <span className="mt-2 block h-1 w-10 rounded-full bg-teal-400" />

            <span className="mt-3 block text-lg font-medium tracking-tight text-white">
              Gestión de Actas
            </span>
          </Link>

          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={onClose}
            className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegación desplazable */}
        <nav className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3">
          <div className="space-y-1">
            {navigation.map(({ label, icon: Icon, href, badge }) => {
              const active = href === activeHref;

              return (
                <Link
                  key={label}
                  href={href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`group flex min-h-12 items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-colors duration-150 ${
                    active
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 font-semibold text-white shadow-sm"
                      : "font-medium text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.8}
                    className={`shrink-0 ${
                      active
                        ? "text-white"
                        : "text-slate-200 group-hover:text-white"
                    }`}
                  />

                  <span className="min-w-0 flex-1 truncate">{label}</span>

                  {badge && (
                    <span
                      className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Opciones de configuración */}
          <div className="mt-4 border-t border-white/20 pt-4">
            <Link
              href="/configuracion"
              onClick={onClose}
              className={`flex min-h-12 items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors ${
                pathname === "/configuracion" ||
                pathname.startsWith("/configuracion/")
                  ? "bg-white/10 text-white"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Settings size={20} strokeWidth={1.8} />
              <span>Configuración</span>
            </Link>

            <button
              type="button"
              onClick={() => { onClose(); void signOut(); }}
              className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut size={20} strokeWidth={1.8} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </nav>

        {/* Identidad institucional inferior */}
        <div className="relative shrink-0 px-6 pb-7 pt-4">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent to-[#0a2540]/40" />

          <div className="relative">
            <p className="text-2xl font-black tracking-tight text-white">
              OEI
            </p>

            <p className="mt-1 text-xs leading-4 text-slate-200">
              Educación
              <br />
              para un futuro
              <br />
              mejor
            </p>

            <span className="mt-3 block h-1 w-10 rounded-full bg-teal-400" />
          </div>
        </div>
      </aside>
    </>
  );
}
