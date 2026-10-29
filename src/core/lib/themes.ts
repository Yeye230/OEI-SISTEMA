/** Registro único de los dos temas disponibles para OEI Sistema. */

export type ThemeMode = "dark" | "light";

export const THEME_IDS = ["oscuro", "claro"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export interface ThemeMeta {
  id: ThemeId;
  mode: ThemeMode;
  family: "Oscuro" | "Claro";
  name: string;
}

export const DEFAULT_THEME: ThemeId = "oscuro";
export const DEFAULT_LIGHT_THEME: ThemeId = "claro";
export const THEME_STORAGE_KEY = "oei-theme";
export const LEGACY_THEME_STORAGE_KEY = "cirio-theme";

export const THEMES: readonly ThemeMeta[] = [
  { id: "oscuro", mode: "dark", family: "Oscuro", name: "Oscuro" },
  { id: "claro", mode: "light", family: "Claro", name: "Claro" }
];

const BY_ID = new Map(THEMES.map((theme) => [theme.id, theme]));

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && (THEME_IDS as readonly string[]).includes(value);
}

/**
 * Convierte preferencias antiguas al tema equivalente. Los identificadores
 * heredados solo se aceptan durante la migración; no son temas disponibles.
 */
export function normalizeThemeId(value: unknown): ThemeId | null {
  if (isThemeId(value)) return value;
  if (typeof value !== "string") return null;
  if (value.startsWith("gothic-")) return "oscuro";
  if (value.startsWith("lumina-")) return "claro";
  return null;
}

export function getTheme(id: ThemeId): ThemeMeta {
  return BY_ID.get(id)!;
}

export function getMode(id: ThemeId): ThemeMode {
  return id === "claro" ? "light" : "dark";
}
