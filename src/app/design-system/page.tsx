"use client";

import { CheckCircle2, CircleAlert, Command, Eye, Info, Palette, ShieldCheck, Type } from "lucide-react";
import { THEMES, type ThemeId } from "@/core/lib/themes";
import { useTheme } from "@/core/components/theme/theme-provider";

const colorTokens = [
  ["Fondo", "--background"], ["Texto principal", "--foreground"], ["Superficie", "--surface"],
  ["Superficie secundaria", "--surface-muted"], ["Borde", "--border"], ["Primario", "--primary"],
  ["Acento", "--accent"], ["Éxito", "--success"], ["Advertencia", "--warning"],
  ["Error", "--danger"], ["Información", "--info"],
] as const;

export default function DesignSystemPage() {
  const { theme: activeTheme, setTheme } = useTheme();

  function selectTheme(theme: ThemeId) {
    setTheme(theme);
  }


  return (
    <main className="ds-page">
      <aside className="ds-sidebar">
        <a href="#overview" className="ds-brand"><span className="ds-brand-mark">OEI</span><span><strong>OEI Sistema</strong><small>Design System</small></span></a>
        <p className="ds-nav-label">DOCUMENTACIÓN</p>
        <nav className="ds-nav" aria-label="Secciones del Design System">
          <a className="active" href="#overview"><Command size={17} /> Introducción</a>
          <a href="#colors"><Palette size={17} /> Colores y temas</a>
          <a href="#typography"><Type size={17} /> Tipografía</a>
          <a href="#components"><ShieldCheck size={17} /> Componentes</a>
          <a href="#feedback"><Info size={17} /> Estados y feedback</a>
        </nav>
        <div className="ds-sidebar-footer"><span className="ds-status-dot" /> Tokens semánticos activos</div>
      </aside>

      <div className="ds-main">
        <header className="ds-topbar"><div className="ds-breadcrumb">Sistema de diseño <span>/</span> Documentación</div><div className="ds-version">BASE VISUAL <span>v1.0</span></div></header>
        <section id="overview" className="ds-hero">
          <div className="ds-hero-copy"><div className="ds-kicker"><span /> FUNDAMENTOS DE INTERFAZ</div>
            <h1>Un sistema.<br /><em>Una experiencia coherente.</em></h1>
            <p>Los fundamentos visuales de OEI: colores semánticos, temas, tipografía y componentes reutilizables para construir experiencias claras, accesibles y consistentes.</p>
            <div className="ds-hero-actions"><a className="ds-button primary" href="#components">Explorar componentes</a><a className="ds-button secondary" href="#colors">Ver paleta</a></div>
          </div>
          <div className="ds-hero-art" aria-hidden="true"><div className="ds-art-orbit orbit-a" /><div className="ds-art-orbit orbit-b" /><div className="ds-art-card"><span className="ds-art-label">OEI / DESIGN</span><div className="ds-art-glyph">O</div><div className="ds-art-lines"><i /><i /><i /></div><span className="ds-art-caption">Claridad · Consistencia · Accesibilidad</span></div></div>
        </section>

        <section id="colors" className="ds-section">
          <div className="ds-section-heading"><div><p className="ds-eyebrow">01 / FUNDAMENTOS</p><h2>Colores y temas</h2><p className="ds-section-desc">Dos temas comparten los mismos tokens y significados semánticos.</p></div>
          </div>
          <div className="ds-theme-grid">{THEMES.map((theme) => <button key={theme.id} type="button" className={`ds-theme-option ${activeTheme === theme.id ? "selected" : ""}`} onClick={() => selectTheme(theme.id)} aria-pressed={activeTheme === theme.id}>
            <span className={`ds-theme-preview ${theme.mode}`} data-preview={theme.id}><i /><i /><i /><b /></span><span className="ds-theme-copy"><strong>{theme.name}</strong><small>{theme.mode === "dark" ? "Tema oscuro" : "Tema claro"}</small></span>{activeTheme === theme.id && <CheckCircle2 size={17} className="ds-theme-check" />}
          </button>)}</div>
          <div className="ds-token-grid">{colorTokens.map(([label, token]) => <div className="ds-token-card" key={token}><span className="ds-swatch" style={{ background: `var(${token})` }} /><span><strong>{label}</strong><code>{token}</code></span></div>)}</div>
        </section>

        <section id="typography" className="ds-section"><div className="ds-section-heading"><div><p className="ds-eyebrow">02 / VOZ VISUAL</p><h2>Tipografía y jerarquía</h2><p className="ds-section-desc">Una jerarquía legible que combina una sans funcional con una display expresiva.</p></div></div>
          <div className="ds-type-panel"><div className="ds-type-main"><span className="ds-type-label">DISPLAY / PLAYFAIR DISPLAY</span><h3>Diseñado para<br /><em>personas reales.</em></h3><p>Interfaz clara para tareas importantes.</p></div><div className="ds-type-scale"><div><span>H1 / 40–56 px</span><strong className="scale-h1">Aa</strong></div><div><span>H2 / 28–36 px</span><strong className="scale-h2">Aa</strong></div><div><span>Body / 16 px</span><strong className="scale-body">Aa</strong></div><div><span>Caption / 12 px</span><strong className="scale-caption">Aa</strong></div></div></div>
        </section>

        <section id="components" className="ds-section"><div className="ds-section-heading"><div><p className="ds-eyebrow">03 / PIEZAS REUTILIZABLES</p><h2>Componentes</h2><p className="ds-section-desc">Muestras para revisar apariencia, contraste y estados comunes.</p></div></div>
          <div className="ds-component-grid">
            <article className="ds-demo-card"><div className="ds-demo-heading"><h3>Botones</h3><span>BUTTON / VARIANTS</span></div><div className="ds-demo-row"><button className="ds-button primary" type="button">Acción principal</button><button className="ds-button secondary" type="button">Secundario</button><button className="ds-button ghost" type="button">Terciario</button></div><div className="ds-demo-row"><button className="ds-button primary" type="button" disabled>Deshabilitado</button><button className="ds-button primary small" type="button"><CheckCircle2 size={15} /> Guardar cambios</button></div></article>
            <article className="ds-demo-card"><div className="ds-demo-heading"><h3>Campos</h3><span>FORM / INPUT</span></div><label className="ds-field-label" htmlFor="ds-email">Correo electrónico</label><div className="ds-input-wrap"><Search size={17} /><input id="ds-email" type="email" placeholder="nombre@institucion.org" /></div><p className="ds-helper">Usa el correo asociado a tu cuenta.</p><label className="ds-field-label" htmlFor="ds-password">Contraseña</label><div className="ds-input-wrap"><input id="ds-password" type="password" defaultValue="Ejemplo123!" /><Eye size={17} /></div></article>
          </div>
        </section>

        <section id="feedback" className="ds-section"><div className="ds-section-heading"><div><p className="ds-eyebrow">04 / RESPUESTA DEL SISTEMA</p><h2>Estados y feedback</h2><p className="ds-section-desc">El significado se conserva entre temas; cambia su representación visual.</p></div></div>
          <div className="ds-feedback-grid"><div className="ds-feedback success"><CheckCircle2 size={19} /><span><strong>Operación completada</strong><small>Los cambios se guardaron correctamente.</small></span></div><div className="ds-feedback warning"><CircleAlert size={19} /><span><strong>Revisa esta información</strong><small>Hay datos que requieren tu atención.</small></span></div><div className="ds-feedback danger"><CircleAlert size={19} /><span><strong>No se pudo completar</strong><small>Verifica los datos e inténtalo de nuevo.</small></span></div><div className="ds-feedback info"><Info size={19} /><span><strong>Información importante</strong><small>Este mensaje explica el siguiente paso.</small></span></div></div>
        </section>
        <footer className="ds-footer"><span>OEI SISTEMA · DESIGN SYSTEM</span><span>Diseñado para consistencia y accesibilidad.</span></footer>
      </div>
    </main>
  );
}
