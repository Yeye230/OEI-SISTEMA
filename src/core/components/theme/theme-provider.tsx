"use client";

import {
  DEFAULT_THEME,
  getMode,
  isThemeId,
  LEGACY_THEME_STORAGE_KEY,
  normalizeThemeId,
  THEME_STORAGE_KEY,
  type ThemeId,
  type ThemeMeta,
  type ThemeMode,
  THEMES
} from "@/core/lib/themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

interface ThemeContextValue {
  theme: ThemeId;
  mode: ThemeMode;
  meta: ThemeMeta;
  themes: readonly ThemeMeta[];
  isAllowed: (id: ThemeId) => boolean;
  setTheme: (id: ThemeId) => void;
  toggleMode: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeId;
  /** Lista blanca opcional de temas habilitados para el usuario. */
  allowed?: readonly ThemeId[];
}

function applyToDocument(id: ThemeId, animate: boolean) {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (animate && !reduce) {
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), 400);
  }

  root.setAttribute("data-theme", id);
  root.setAttribute("data-mode", getMode(id));
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  allowed
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeId>(defaultTheme);
  const [mounted, setMounted] = useState(false);
  const isAllowed = useCallback((id: ThemeId) => !allowed || allowed.includes(id), [allowed]);

  const setTheme = useCallback(
    (id: ThemeId) => {
      if (!isThemeId(id) || !isAllowed(id)) return;

      applyToDocument(id, true);
      setThemeState(id);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, id);
        localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
      } catch {
        /* El almacenamiento puede no estar disponible en modo privado. */
      }
    },
    [isAllowed]
  );

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    let stored: string | null = null;

    try {
      stored =
        localStorage.getItem(THEME_STORAGE_KEY) ??
        localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    } catch {
      /* El almacenamiento puede no estar disponible. */
    }

    let next = normalizeThemeId(current) ?? normalizeThemeId(stored) ?? defaultTheme;
    if (!isAllowed(next)) next = allowed?.find(isAllowed) ?? defaultTheme;

    applyToDocument(next, false);
    setThemeState(next);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
      localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
    } catch {
      /* El almacenamiento puede no estar disponible en modo privado. */
    }

    setMounted(true);
  }, [allowed, defaultTheme, isAllowed]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      const next = normalizeThemeId(event.newValue);
      if (!next || !isAllowed(next)) return;

      applyToDocument(next, true);
      setThemeState(next);
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isAllowed]);

  const value = useMemo<ThemeContextValue>(() => {
    const meta = THEMES.find((item) => item.id === theme)!;

    return {
      theme,
      mode: meta.mode,
      meta,
      themes: THEMES,
      isAllowed,
      setTheme,
      toggleMode: () => setTheme(meta.mode === "dark" ? "claro" : "oscuro"),
      mounted
    };
  }, [theme, isAllowed, setTheme, mounted]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return context;
}
