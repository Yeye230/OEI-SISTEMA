"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  CloudSun,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck
} from "lucide-react";
import { useTheme } from "@/core/components/theme/theme-provider";
import { loginSchema, type LoginFormValues } from "@/core/schemas/login.schema";

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [feedback, setFeedback] = useState("");
  const { mode, toggleMode, mounted } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "" }
  });

  async function onSubmit(values: LoginFormValues): Promise<void> {
    setFeedback("");

    try {
      const response = await fetch("/api/demo-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        setFeedback(payload?.message ?? "No fue posible iniciar la sesión de demostración.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setFeedback("No se pudo iniciar la demostración. Intenta nuevamente.");
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-orbit auth-orbit-one" aria-hidden="true" />
      <div className="auth-orbit auth-orbit-two" aria-hidden="true" />

      <button
        type="button"
        className="auth-theme-toggle"
        onClick={toggleMode}
        disabled={!mounted}
        aria-label={mode === "dark" ? "Cambiar al tema claro" : "Cambiar al tema oscuro"}
        title={mode === "dark" ? "Cambiar al tema claro" : "Cambiar al tema oscuro"}
      >
        <CloudSun size={19} aria-hidden="true" />
        <span>{mode === "dark" ? "Claro" : "Oscuro"}</span>
      </button>

      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-form-panel">
          <div className="auth-form-content">
            <Link href="/" className="auth-brand" aria-label="OEI, ir al inicio">
              <span className="auth-brand-mark" aria-hidden="true">OEI</span>
              <span>
                <span className="auth-brand-name block">OEI</span>
                <span className="auth-brand-caption block">Sistema administrativo</span>
              </span>
            </Link>

            <p className="auth-eyebrow">Acceso institucional</p>
            <h1 id="login-title" className="auth-title">Bienvenido de nuevo</h1>
            <p className="auth-description">
              Ingresa tus credenciales institucionales para continuar con la
              gestión de actas y recursos.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
              <div>
                <label htmlFor="email" className="auth-field-label">
                  Correo electrónico
                </label>
                <div className={`auth-control ${errors.email ? "has-error" : ""}`}>
                  <Mail size={19} strokeWidth={1.8} aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    inputMode="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="nombre@institucion.org"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : "email-hint"}
                    {...register("email")}
                  />
                </div>
                {errors.email ? (
                  <p id="email-error" className="auth-field-error" role="alert">{errors.email.message}</p>
                ) : (
                  <p id="email-hint" className="auth-hint">
                    Utiliza cualquier correo válido para esta prueba.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="auth-field-label">
                  Contraseña
                </label>
                <div className={`auth-control ${errors.password ? "has-error" : ""}`}>
                  <LockKeyhole size={19} strokeWidth={1.8} aria-hidden="true" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Ingresa una contraseña"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    {...register("password")}
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
                {errors.password && (
                  <p id="password-error" className="auth-field-error" role="alert">{errors.password.message}</p>
                )}
              </div>

              {feedback && (
                <p className="auth-message" role="alert" aria-live="polite">
                  {feedback}
                </p>
              )}

              <button type="submit" className="auth-submit" disabled={isSubmitting}>
                {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <p className="auth-hint">
                Modo demostración: cualquier correo válido y contraseña no vacía.
              </p>
            </form>

            <div className="auth-footer">
              <p className="flex items-center justify-center gap-2">
                <ShieldCheck size={15} aria-hidden="true" />
                Acceso reservado a personal autorizado
              </p>
              <p className="mt-2">© OEI · Organización de Estados Iberoamericanos</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
