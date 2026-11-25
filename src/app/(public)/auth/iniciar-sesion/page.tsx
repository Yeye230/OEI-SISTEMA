"use client";

import { FormError } from "@/core/components/form/form-error";
import Field from "@/core/components/form/input-field";
import SubmitButton from "@/core/components/form/submit-button";
import { CardWrapper } from "@/core/components/ui/card-wrapper";
import { Lock, Mail, Eye } from "lucide-react";
import { Controller } from "react-hook-form";
import { useLogin } from "./use-login";

const AuthPage = (): React.JSX.Element => {
  const { control, handleSubmit, onSubmit, errors } = useLogin();

  return (
    <main className="auth-shell">
      <div className="auth-orbit auth-orbit-one" aria-hidden="true" />
      <div className="auth-orbit auth-orbit-two" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-7 flex items-center justify-center gap-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-[18px] text-lg font-bold tracking-wider text-white"
            style={{
              background: "linear-gradient(135deg, #457B9D, #2A9D8F)",
              boxShadow: "0 12px 28px -6px rgba(42,157,143,0.55)"
            }}
          >
            OEI
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">Sistema de Actas</p>
            <p className="text-[11px] uppercase tracking-widest text-secondary">
              OEI · El Salvador
            </p>
          </div>
        </div>

        <CardWrapper className="w-full">
          <div className="mb-7">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Acceso institucional
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Iniciar sesión
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Ingresa tus credenciales institucionales para continuar.
            </p>
          </div>

          <form noValidate className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <FormError server={errors.root?.server} />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  label="Correo electrónico"
                  field={field}
                  isInvalid={fieldState.invalid}
                  errorMessage={fieldState.error?.message}
                  placeholder="nombre@institucion.org"
                  type="email"
                  startContent={<Mail className="h-4 w-4" aria-hidden="true" />}
                  isRequired={true}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  label="Contraseña"
                  field={field}
                  isInvalid={fieldState.invalid}
                  errorMessage={fieldState.error?.message}
                  placeholder="Ingresa tu contraseña"
                  type="password"
                  startContent={<Lock className="h-4 w-4" aria-hidden="true" />}
                  endContent={<Eye className="h-4 w-4" aria-hidden="true" />}
                  isRequired={true}
                />
              )}
            />

            <div className="space-y-3 pt-1">
              <SubmitButton
                buttonName="Iniciar sesión"
                type="submit"
                isDisabled={true}
              />
              <p className="text-center text-xs leading-5 text-muted">
                El acceso estará disponible cuando se complete la conexión con el servicio
                institucional.
              </p>
            </div>
          </form>
        </CardWrapper>

        <p className="mt-5 text-center text-xs text-muted">
          OEI · Organización de Estados Iberoamericanos
        </p>
      </div>
    </main>
  );
};

export default AuthPage;
