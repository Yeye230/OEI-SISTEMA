import Link from "next/link";
import { Plus } from "lucide-react";
 
export default function WelcomeBanner() {
  return (
    <section
      className="relative flex flex-wrap items-center gap-4 overflow-hidden rounded-2xl border border-slate-200/70 px-6 py-5 shadow-sm"
      style={{
        background: "linear-gradient(90deg,#ffffff 0%,#f4f9fd 55%,#e3effa 100%)",
      }}
    >
      <div
        className="rounded-full"
        style={{ width: 4, height: 48, flexShrink: 0, backgroundColor: "#10b981" }}
      />
 
      <div className="relative z-10 min-w-0 flex-1">
        <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
          Bienvenido al sistema de gestión
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Aquí puedes administrar las actas, equipos y personas de manera
          rápida y sencilla.
        </p>
      </div>
 
      {/* Ilustración decorativa */}
      <svg
        aria-hidden="true"
        viewBox="0 0 420 110"
        className="oei-banner-art"
        preserveAspectRatio="xMaxYMax meet"
      >
        <defs>
          <linearGradient id="bannerFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#dbeafe" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <rect width="420" height="110" fill="url(#bannerFade)" />
        <path d="M110 110 L190 38 L240 78 L300 28 L390 110 Z" fill="#9fc3b4" opacity="0.55" />
        <path d="M200 110 L280 55 L340 92 L420 48 L420 110Z" fill="#7fb3a2" opacity="0.65" />
        <g fill="#eef2f6" stroke="#c3cfda" strokeWidth="1">
          <rect x="225" y="62" width="150" height="46" />
          <polygon points="280,62 300,40 320,62" />
          <rect x="293" y="30" width="14" height="12" />
          <path d="M290 30a10 10 0 0 1 20 0z" fill="#d7dee6" />
        </g>
        <g fill="#b8c5d1">
          {[238, 254, 270, 286, 302, 318, 334, 350].map((x) => (
            <rect key={x} x={x} y="70" width="6" height="38" />
          ))}
        </g>
        <rect y="102" width="420" height="8" fill="#5fa86b" opacity="0.8" />
      </svg>
 
      <Link
        href="/actas/nueva"
        className="relative z-10 inline-flex items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold text-white shadow-md transition hover:brightness-105"
        style={{
          height: 48,
          background: "linear-gradient(90deg,#f26a4b 0%,#f4875a 100%)",
        }}
      >
        <Plus size={20} />
        Nueva acta
      </Link>
    </section>
  );
}
 