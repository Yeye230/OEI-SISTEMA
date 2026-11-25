import { z } from "zod";
import { PASSWORD_MIN_LENGTH } from "./rules";

export const emailSchema = z
  .string()
  .trim()
  .check(z.email({ error: "Ingresa un correo electrónico válido." }));

// Do not trim passwords: whitespace can be part of a legitimate credential.
// Keep login validation permissive enough to accept existing backend accounts.
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`);

export * from "./regex";
export * from "./rules";
