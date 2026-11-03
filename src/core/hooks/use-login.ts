"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "@/core/schemas/login.schema";
import type { LoginFormData } from "@/core/types/login.types";

interface UseLoginReturn {
  form: ReturnType<typeof useForm<LoginFormData>>;
  onSubmit: (event?: React.BaseSyntheticEvent) => Promise<void>;
}

const useLogin = (): UseLoginReturn => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const onSubmit = form.handleSubmit(() => {
    window.alert(
      "¡Todo funciona!\n\nLas validaciones del formulario se completaron correctamente. Esta es una prueba: todavía no se ha conectado ningún servidor ni se ha iniciado una sesión."
    );
  });

  return {
    form,
    onSubmit
  };
};

export { useLogin };
