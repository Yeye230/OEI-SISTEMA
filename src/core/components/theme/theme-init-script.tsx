import {
  DEFAULT_LIGHT_THEME,
  DEFAULT_THEME,
  PUBLIC_PATH_PREFIXES,
  PUBLIC_THEME,
  THEME_IDS,
  THEME_STORAGE_KEY
} from "@/core/lib/themes";

/**
 * Script bloqueante en <head>: fija data-theme / data-mode antes del primer
 * pintado para evitar el parpadeo de tema. Sin dependencias de React.
 */
export function ThemeInitScript() {
  const code = `(function(){try{
var ids=${JSON.stringify(THEME_IDS)};
var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
if(ids.indexOf(t)<0){t=window.matchMedia("(prefers-color-scheme: light)").matches?${JSON.stringify(DEFAULT_LIGHT_THEME)}:${JSON.stringify(DEFAULT_THEME)};}
var p=location.pathname,pp=${JSON.stringify(PUBLIC_PATH_PREFIXES)};
if(p==="/"||pp.some(function(x){return p===x||p.indexOf(x+"/")===0;})){t=${JSON.stringify(PUBLIC_THEME)};}
var r=document.documentElement;
r.setAttribute("data-theme",t);
r.setAttribute("data-mode",t.indexOf("lumina")===0?"light":"dark");
}catch(e){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
