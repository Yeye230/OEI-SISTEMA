
"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

type SectionLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function SectionLayout({
  title,
  subtitle,
  children,
}: SectionLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f3f6fa] text-slate-800">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen min-w-0 lg:pl-64">
        <Topbar onMenu={() => setSidebarOpen(true)} />

        <div className="mx-auto w-full max-w-[1800px] space-y-5 px-4 py-5 sm:px-6 xl:px-7">
          <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#102b49]">
                {title}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            </div>
          </header>

          {children}

          <footer className="border-t border-slate-200/70 py-4 text-center text-xs text-slate-400">
            OEI · Gestión de Actas
          </footer>
        </div>
      </div>
    </main>
  );
}
