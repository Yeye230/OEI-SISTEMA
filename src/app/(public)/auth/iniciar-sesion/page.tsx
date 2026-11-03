"use client";

import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck
} from "lucide-react";

import { useLogin } from "@/core/hooks/use-login";

export default function LoginPage(): React.JSX.Element {
  const { form, onSubmit } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const {
    control,
    formState: { errors, isSubmitting }
  } = form;

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

            <form onSubmit={onSubmit} className="auth-form" noValidate>
              <div>
                <label htmlFor="email" className="auth-field-label">
                  Correo electrónico
                </label>
                <div className="auth-control">
                  <Mail size={19} strokeWidth={1.8} aria-hidden="true" />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="email"
                        type="email"
                        autoComplete="username"
                        inputMode="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        placeholder="nombre@institucion.org"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "email-error" : "email-hint"}
                      />
                    )}
                  />
                </div>
                {errors.email?.message ? (
                  <p id="email-error" className="auth-message" role="alert">
                    {errors.email.message}
                  </p>
                ) : (
                  <p id="email-hint" className="auth-hint">
                    Utiliza el correo asociado a tu cuenta institucional.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="auth-field-label">
                  Contraseña
                </label>
                <div className="auth-control">
                  <LockKeyhole size={19} strokeWidth={1.8} aria-hidden="true" />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Ingresa tu contraseña"
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={errors.password ? "password-error" : undefined}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    aria-pressed={showPassword}
                    className="auth-icon-button"
                  >
                    {showPassword ? (
                      <EyeOff size={19} aria-hidden="true" />
                    ) : (
                      <Eye size={19} aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password?.message ? (
                  <p id="password-error" className="auth-message" role="alert">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Validando..." : "Iniciar sesión"}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>

            <div className="auth-footer">
              <p className="flex items-center justify-center gap-2">
                <ShieldCheck size={15} aria-hidden="true" />
                Acceso reservado a personal autorizado
              </p>
              <p className="mt-2">
                © {year ?? ""} OEI · Organización de Estados Iberoamericanos
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
