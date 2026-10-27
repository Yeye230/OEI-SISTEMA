import type { Metadata } from "next";
import type { ReactElement } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./themes.css";
import "./globals.css";
import { ThemeInitScript } from "@/core/components/theme/theme-init-script";
import { ThemeProvider } from "@/core/components/theme/theme-provider";

const display = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap"
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Lumen Codex · Sistema visual",
  description: "Guía interactiva de temas, color y componentes de Lumen Codex."
};

export default function RootLayout({ children }: LayoutProps<"/">): ReactElement {
  return (
    <html
      lang="es"
      data-theme="gothic-1"
      data-mode="dark"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable}`}
    >
      <head>
        <ThemeInitScript />
      </head>
      <body>
        {/* Pasa `allowed` con los UserTema desbloqueados del usuario cuando lo conectes al backend. */}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
