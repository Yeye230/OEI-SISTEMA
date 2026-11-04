import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El correo electrónico es obligatorio.")
    .email("Ingresa un correo electrónico válido."),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .regex(/[A-Z]/, "Incluye al menos una letra mayúscula.")
    .regex(/[a-z]/, "Incluye al menos una letra minúscula.")
    .regex(/[0-9]/, "Incluye al menos un número.")
    .regex(/[^A-Za-z0-9]/, "Incluye al menos un carácter especial.")
});

export type LoginFormValues = z.infer<typeof loginSchema>;
