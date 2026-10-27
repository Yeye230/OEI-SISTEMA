"use client";

import {
  DEFAULT_THEME,
  getMode,
  isPublicPath,
  isThemeId,
  PUBLIC_THEME,
  THEME_STORAGE_KEY,
  ThemeId,
  ThemeMeta,
  ThemeMode,
  THEMES
} from "@/core/lib/themes";
import { usePathname } from "next/navigation";
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
  /** Todos los temas del sistema. */
  themes: readonly ThemeMeta[];
  /** Temas que el usuario puede seleccionar (UserTema desbloqueados). */
  isAllowed: (id: ThemeId) => boolean;
  setTheme: (id: ThemeId) => void;
  /** Cambia al mismo Cirio en el otro modo (oscuro ⇄ claro). */
  toggleMode: () => void;
  /** false hasta que el cliente leyó el tema real; evita desajustes de hidratación. */
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeId;
  /**
   * Lista blanca de temas desbloqueados por el usuario. Si se omite, todos
   * están disponibles. Valídala también en el servidor: esto es solo UX.
   */
  allowed?: readonly ThemeId[];
}

function applyToDocument(id: ThemeId | typeof PUBLIC_THEME, animate: boolean) {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (animate && !reduce) {
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), 400);
  }
  root.setAttribute("data-theme", id);
  root.setAttribute("data-mode", id === PUBLIC_THEME ? "dark" : getMode(id));
}

export function ThemeProvider({ children, defaultTheme = DEFAULT_THEME, allowed }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeId>(defaultTheme);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const isAllowed = useCallback((id: ThemeId) => !allowed || allowed.includes(id), [allowed]);

  const setTheme = useCallback(
    (id: ThemeId) => {
      if (!isThemeId(id) || !isAllowed(id)) return;
      applyToDocument(id, true);
      setThemeState(id);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, id);
      } catch {
        /* almacenamiento no disponible (modo privado) */
      }
    },
    [isAllowed]
  );

  // Revalida también cuando la lista de temas desbloqueados llega del backend.
  useEffect(() => {
    // En rutas públicas el atributo es "public": el tema real es el guardado.
    const current = document.documentElement.getAttribute("data-theme");
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      /* almacenamiento no disponible */
    }
    let next: ThemeId = isThemeId(current) ? current : isThemeId(stored) ? stored : defaultTheme;
    if (!isAllowed(next)) {
      next = allowed?.find(isAllowed) ?? defaultTheme;
      applyToDocument(next, false);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* almacenamiento no disponible (modo privado) */
      }
    }
    setThemeState(next);
    setMounted(true);
  }, [allowed, defaultTheme, isAllowed]);

  // Pantallas sin sesión usan el tema neutro; al salir de ellas se restaura el del usuario.
  useEffect(() => {
    if (!mounted) return;
    applyToDocument(isPublicPath(pathname) ? PUBLIC_THEME : theme, false);
  }, [mounted, pathname, theme]);

  // Sincroniza entre pestañas.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && isThemeId(e.newValue) && isAllowed(e.newValue)) {
        if (!isPublicPath(window.location.pathname)) applyToDocument(e.newValue, true);
        setThemeState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isAllowed]);

  const value = useMemo<ThemeContextValue>(() => {
    const meta = THEMES.find((t) => t.id === theme)!;
    return {
      theme,
      mode: meta.mode,
      meta,
      themes: THEMES,
      isAllowed,
      setTheme,
      toggleMode: () => {
        const other = `${meta.mode === "dark" ? "lumina" : "gothic"}-${meta.cirio}` as ThemeId;
        setTheme(other);
      },
      mounted
    };
  }, [theme, isAllowed, setTheme, mounted]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}
