/**
 * Registro de temas. Los colores viven en src/app/themes.css (única fuente
 * de verdad); aquí solo hay metadatos. El número de Cirio (1–5) es fijo de por
 * vida y es la clave para mapear UserTema / UserCirio a un tema.
 */

export type ThemeMode = "dark" | "light";
export type CirioLevel = 1 | 2 | 3 | 4 | 5;

export const THEME_IDS = [
  "gothic-1",
  "gothic-2",
  "gothic-3",
  "gothic-4",
  "gothic-5",
  "lumina-1",
  "lumina-2",
  "lumina-3",
  "lumina-4",
  "lumina-5"
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

/**
 * Tema neutro de las pantallas sin sesión: aún no se sabe qué tema tendrá el
 * usuario, así que no se usa ninguno de los 10. No es un ThemeId.
 */
export const PUBLIC_THEME = "public";
export const PUBLIC_PATH_PREFIXES = ["/auth", "/login"] as const;

export function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/" ||
    PUBLIC_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  );
}

export interface ThemeMeta {
  id: ThemeId;
  mode: ThemeMode;
  /** Familia visual: Gótico (oscuro) o Lumina (claro). */
  family: "Gótico" | "Lumina";
  cirio: CirioLevel;
  name: string;
  keywords: readonly [string, string, string];
}

export const DEFAULT_THEME: ThemeId = "gothic-1";
export const DEFAULT_LIGHT_THEME: ThemeId = "lumina-1";
export const THEME_STORAGE_KEY = "cirio-theme";

export const THEMES: readonly ThemeMeta[] = [
  {
    id: "gothic-1",
    mode: "dark",
    family: "Gótico",
    cirio: 1,
    name: "Gótico",
    keywords: ["Oscuridad", "Misterio", "Pasión"]
  },
  {
    id: "gothic-2",
    mode: "dark",
    family: "Gótico",
    cirio: 2,
    name: "Biblioteca Antigua",
    keywords: ["Conocimiento", "Historia", "Sabiduría"]
  },
  {
    id: "gothic-3",
    mode: "dark",
    family: "Gótico",
    cirio: 3,
    name: "Romanticismo",
    keywords: ["Emoción", "Imaginación", "Melancolía"]
  },
  {
    id: "gothic-4",
    mode: "dark",
    family: "Gótico",
    cirio: 4,
    name: "Naturaleza Encantada",
    keywords: ["Exploración", "Fantasía", "Equilibrio"]
  },
  {
    id: "gothic-5",
    mode: "dark",
    family: "Gótico",
    cirio: 5,
    name: "Arcano",
    keywords: ["Misticismo", "Conocimiento", "Poder"]
  },
  {
    id: "lumina-1",
    mode: "light",
    family: "Lumina",
    cirio: 1,
    name: "Lumina",
    keywords: ["Claridad", "Inspiración", "Trascendencia"]
  },
  {
    id: "lumina-2",
    mode: "light",
    family: "Lumina",
    cirio: 2,
    name: "Biblioteca Antigua",
    keywords: ["Conocimiento", "Historia", "Sabiduría"]
  },
  {
    id: "lumina-3",
    mode: "light",
    family: "Lumina",
    cirio: 3,
    name: "Romanticismo",
    keywords: ["Emoción", "Imaginación", "Melancolía"]
  },
  {
    id: "lumina-4",
    mode: "light",
    family: "Lumina",
    cirio: 4,
    name: "Naturaleza Encantada",
    keywords: ["Exploración", "Fantasía", "Equilibrio"]
  },
  {
    id: "lumina-5",
    mode: "light",
    family: "Lumina",
    cirio: 5,
    name: "Arcano",
    keywords: ["Misticismo", "Conocimiento", "Poder"]
  }
];

const BY_ID = new Map(THEMES.map((t) => [t.id, t]));

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && (THEME_IDS as readonly string[]).includes(value);
}

export function getTheme(id: ThemeId): ThemeMeta {
  return BY_ID.get(id)!;
}

export function getMode(id: ThemeId): ThemeMode {
  return id.startsWith("lumina") ? "light" : "dark";
}

/** Tema de un nivel de Cirio dentro de una familia. */
export function themeForCirio(cirio: CirioLevel, mode: ThemeMode): ThemeId {
  return `${mode === "dark" ? "gothic" : "lumina"}-${cirio}` as ThemeId;
}

/** Mismo Cirio en el otro modo (útil para un toggle claro/oscuro). */
export function counterpartTheme(id: ThemeId): ThemeId {
  const { cirio, mode } = getTheme(id);
  return themeForCirio(cirio, mode === "dark" ? "light" : "dark");
}
