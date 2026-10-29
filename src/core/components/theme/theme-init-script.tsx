import {
  DEFAULT_LIGHT_THEME,
  DEFAULT_THEME,
  LEGACY_THEME_STORAGE_KEY,
  normalizeThemeId,
  THEME_STORAGE_KEY
} from "@/core/lib/themes";

/**
 * Aplica el tema antes del primer pintado y migra preferencias antiguas.
 */
export function ThemeInitScript() {
  const code = `(function(){try{
var key=${JSON.stringify(THEME_STORAGE_KEY)};
var legacyKey=${JSON.stringify(LEGACY_THEME_STORAGE_KEY)};
var saved=localStorage.getItem(key)||localStorage.getItem(legacyKey);
var t=null;
if(saved==="oscuro"||saved==="claro"){t=saved;}
else if(typeof saved==="string"&&saved.indexOf("gothic-")===0){t="oscuro";}
else if(typeof saved==="string"&&saved.indexOf("lumina-")===0){t="claro";}
if(!t){t=window.matchMedia("(prefers-color-scheme: light)").matches?${JSON.stringify(DEFAULT_LIGHT_THEME)}:${JSON.stringify(DEFAULT_THEME)};}
localStorage.setItem(key,t);
localStorage.removeItem(legacyKey);
var r=document.documentElement;
r.setAttribute("data-theme",t);
r.setAttribute("data-mode",t==="claro"?"light":"dark");
}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
