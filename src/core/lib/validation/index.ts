import { z } from "zod";
import { PASSWORD_MIN_LENGTH } from "./rules";

export const emailSchema = z
  .string()
  .trim()
  .check(z.email({ error: "El sigilo del correo permanece en la sombra." }));

// Do not trim passwords: whitespace can be part of a legitimate credential.
// Keep login validation permissive enough to accept existing backend accounts.
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `El conjuro debe portar al menos ${PASSWORD_MIN_LENGTH} caracteres.`);

export * from "./regex";
export * from "./rules";
