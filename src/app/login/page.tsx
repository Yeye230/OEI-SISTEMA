"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

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
      "La autenticación aún no está conectada. Tus credenciales no se han enviado."
    );
  }

  return (
    <main className="auth-shell">
      <div className="auth-orbit auth-orbit-one" aria-hidden="true" />
      <div className="auth-orbit auth-orbit-two" aria-hidden="true" />

      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-form-panel">
          <div className="auth-form-content">
            <a href="/" className="auth-brand" aria-label="OEI, ir al inicio">
              <span className="auth-brand-mark" aria-hidden="true">OEI</span>
              <span>
                <span className="auth-brand-name block">OEI</span>
                <span className="auth-brand-caption block">Sistema administrativo</span>
              </span>
            </a>

            <p className="auth-eyebrow">Acceso institucional</p>
            <h1 id="login-title" className="auth-title">Bienvenido de nuevo</h1>
            <p className="auth-description">
              Ingresa tus credenciales institucionales para continuar con la
              gestión de actas y recursos.
            </p>

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div>
                <label htmlFor="email" className="auth-field-label">
                  Correo electrónico
                </label>
                <div className="auth-control">
                  <Mail size={19} strokeWidth={1.8} aria-hidden="true" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    inputMode="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="nombre@institucion.org"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "login-message" : "email-hint"}
                  />
                </div>
                <p id="email-hint" className="auth-hint">
                  Utiliza el correo asociado a tu cuenta institucional.
                </p>
              </div>

              <div>
                <label htmlFor="password" className="auth-field-label">
                  Contraseña
                </label>
                <div className="auth-control">
                  <LockKeyhole size={19} strokeWidth={1.8} aria-hidden="true" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "login-message" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    aria-pressed={showPassword}
                    className="auth-icon-button"
                  >
                    {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {error && (
                <p id="login-message" className="auth-message" role="alert" aria-live="polite">
                  {error}
                </p>
              )}

              <button type="submit" className="auth-submit">
                Iniciar sesión
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>

            <div className="auth-footer">
              <p className="flex items-center justify-center gap-2">
                <ShieldCheck size={15} aria-hidden="true" />
                Acceso reservado a personal autorizado
              </p>
              <p className="mt-2">© {year ?? ""} OEI · Organización de Estados Iberoamericanos</p>
            </div>
          </div>
        </div>


      </section>
    </main>
  );
}
