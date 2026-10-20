
"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Ingresa tu correo electrónico y contraseña.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setError(
      "La interfaz está lista. La autenticación todavía debe conectarse al sistema."
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8fafc] px-4 py-8 sm:px-8">
      {/* Decoración discreta del fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 -top-44 h-[430px] w-[430px] rounded-full border border-[#17658a]/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-72 -right-36 h-[570px] w-[570px] rounded-full border border-[#17658a]/10"
      />

      {/* Tarjeta principal */}
      <section className="relative grid w-full max-w-[1040px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_80px_-35px_rgba(15,45,65,0.25)] md:min-h-[590px] md:grid-cols-2">
        {/* Panel del formulario */}
        <div className="flex items-center justify-center px-7 py-12 sm:px-12 md:px-14 lg:px-16">
          <div className="w-full max-w-[390px]">
            <header className="mb-10">
              <div
                className="text-[48px] font-black leading-none tracking-[-0.07em] text-[#30363b]"
                aria-label="OEI"
              >
                OEI
              </div>

              <div className="mt-3 h-1 w-12 rounded-full bg-[#17658a]" />

              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                Sistema administrativo
              </p>

              <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[#172b3a] sm:text-[28px]">
                Bienvenido de nuevo
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Ingresa tus credenciales para acceder al sistema.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Correo electrónico
                </label>

                <div className="flex h-[52px] items-center gap-3 rounded-xl border border-slate-200 bg-[#fbfcfd] px-4 transition focus-within:border-[#17658a] focus-within:ring-4 focus-within:ring-[#17658a]/10">
                  <Mail
                    size={19}
                    strokeWidth={1.8}
                    className="shrink-0 text-slate-500"
                    aria-hidden="true"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    aria-describedby={error ? "login-message" : undefined}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Contraseña
                </label>

                <div className="flex h-[52px] items-center gap-3 rounded-xl border border-slate-200 bg-[#fbfcfd] px-4 transition focus-within:border-[#17658a] focus-within:ring-4 focus-within:ring-[#17658a]/10">
                  <LockKeyhole
                    size={19}
                    strokeWidth={1.8}
                    className="shrink-0 text-slate-500"
                    aria-hidden="true"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    aria-describedby={error ? "login-message" : undefined}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    className="rounded-md p-1 text-slate-500 transition hover:text-[#17658a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17658a]"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  id="login-message"
                  role="status"
                  aria-live="polite"
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-5 text-slate-600"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="group flex h-[54px] w-full items-center justify-center gap-3 rounded-xl bg-[#075477] px-5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#064765] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#17658a] active:scale-[0.99]"
              >
                Iniciar sesión
                <ArrowRight
                  size={19}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>
            </form>

            <footer className="mt-10 border-t border-slate-100 pt-5 text-center">
              <p className="text-xs leading-5 text-slate-400">
                © 2026 OEI · Organización de Estados Iberoamericanos
              </p>
            </footer>
          </div>
        </div>

        {/* Panel institucional */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#f0f7fb] via-[#e4f0f8] to-[#d4e8f4] px-10 py-12 md:flex md:items-center md:justify-center lg:px-14">
          <div
            aria-hidden="true"
            className="absolute -right-32 -top-36 h-[420px] w-[420px] rounded-full border border-[#17658a]/15"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-48 -left-20 h-[410px] w-[410px] rounded-full bg-[#17658a]/[0.045]"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-56 -right-28 h-[480px] w-[480px] rounded-full border border-[#17658a]/15"
          />

          <div className="relative z-10 max-w-[380px]">
            <div className="mb-8 h-1 w-14 rounded-full bg-[#17658a]" />

            <h2 className="text-4xl font-bold leading-[1.15] tracking-tight text-[#172b3a] lg:text-[44px]">
              Gestión de <span className="text-[#17658a]">Actas</span>
            </h2>

            <div className="mt-7 h-px w-16 bg-[#17658a]/40" />

            <p className="mt-6 text-xs font-semibold uppercase leading-6 tracking-[0.18em] text-slate-500">
              Organización de Estados Iberoamericanos
            </p>

            <div className="mt-12 flex items-center gap-3">
              <div className="text-3xl font-black tracking-[-0.06em] text-[#30363b]">
                OEI
              </div>

              <div className="h-9 w-px bg-[#17658a]/50" />

              <p className="max-w-[180px] text-[10px] leading-4 tracking-wide text-slate-500">
                Educación · Cooperación · Desarrollo
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
