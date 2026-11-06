/**
 * Registro de temas. Los colores viven en src/app/themes.css; aquí solo quedan
 * los metadatos y la lógica mínima para resolver y alternar entre los dos
 * temas disponibles del sistema.
 */

export type ThemeMode = 'dark' | 'light';

export const THEME_IDS = ['oscuro', 'claro'] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export interface ThemeMeta {
	id: ThemeId;
	mode: ThemeMode;
	family: 'Oscuro' | 'Claro';
	name: string;
}

export const DEFAULT_THEME: ThemeId = 'oscuro';
export const DEFAULT_LIGHT_THEME: ThemeId = 'claro';
export const THEME_STORAGE_KEY = 'oei-theme';
export const LEGACY_THEME_STORAGE_KEY = 'cirio-theme';

export const THEMES: readonly ThemeMeta[] = [
	{ id: 'oscuro', mode: 'dark', family: 'Oscuro', name: 'Oscuro' },
	{ id: 'claro', mode: 'light', family: 'Claro', name: 'Claro' },
];

export function isThemeId(value: unknown): value is ThemeId {
	return typeof value === 'string' && (THEME_IDS as readonly string[]).includes(value);
}

export function normalizeThemeId(value: unknown): ThemeId | null {
	return isThemeId(value) ? value : null;
}

export function getMode(id: ThemeId): ThemeMode {
	return id === 'claro' ? 'light' : 'dark';
}

export function counterpartTheme(id: ThemeId): ThemeId {
	return id === 'oscuro' ? 'claro' : 'oscuro';
}
