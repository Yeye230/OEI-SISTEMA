import type { ReactElement } from "react";
import {
  DEFAULT_LIGHT_THEME,
  DEFAULT_THEME,
  LEGACY_THEME_STORAGE_KEY,
  THEME_IDS,
  THEME_STORAGE_KEY
} from "@/core/lib/themes";

/**
 * Script bloqueante en <head>: fija data-theme / data-mode antes del primer
 * pintado para evitar el parpadeo de tema. Sin dependencias de React.
 */
export function ThemeInitScript(): ReactElement {
  const code = `(function(){try{
var ids=${JSON.stringify(THEME_IDS)};
var key=${JSON.stringify(THEME_STORAGE_KEY)};
var legacyKey=${JSON.stringify(LEGACY_THEME_STORAGE_KEY)};
var saved=localStorage.getItem(key) || localStorage.getItem(legacyKey);
var t = null;
if(ids.indexOf(saved)>=0){t=saved;}
else if(["gothic-1","gothic-2","gothic-3","gothic-4","gothic-5"].indexOf(saved)>=0){t="oscuro";}
else if(["lumina-1","lumina-2","lumina-3","lumina-4","lumina-5"].indexOf(saved)>=0){t="claro";}
if(!t){t=window.matchMedia("(prefers-color-scheme: light)").matches?${JSON.stringify(DEFAULT_LIGHT_THEME)}:${JSON.stringify(DEFAULT_THEME)};}
localStorage.setItem(key,t);
localStorage.removeItem(legacyKey);
var r=document.documentElement;
r.setAttribute("data-theme",t);
r.setAttribute("data-mode",t==="claro"?"light":"dark");
}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
