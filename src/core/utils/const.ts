export const triggerClassName: string =
  "mt-1.5 flex h-12 w-full items-center rounded-2xl border border-border bg-background px-4 text-sm text-foreground transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15";

/*
 * - placeholder: text-muted. Antes parchment/25 = 1.96:1.
 * - estado inválido: utilidad glow-invalid (globals.css) en vez de repetir
 *   el hex #A63446 y su sombra en dos variantes.
 */
export const inputClassName: string =
  "w-full h-12 rounded-md bg-background border border-border focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-primary focus:shadow-glow text-sm text-foreground data-[focused=true]:ring-0 data-[invalid=true]:border-status-error-border data-[invalid=true]:glow-invalid data-[invalid=true]:focus:border-status-error-border data-[invalid=true]:focus:glow-invalid data-[invalid=true]:focus:ring-0 transition-all";

export const btnPrimaryClassName: string =
  "mt-5 group relative w-full rounded-md border border-primary bg-primary px-5 py-3.5 font-display tracking-[0.3em] uppercase text-primary-foreground transition-all hover:brightness-110 hover:shadow-glow";

export const btnSecondaryClassName: string =
  "mt-5 group relative w-full rounded-md border border-border bg-surface px-5 py-3.5 font-display tracking-[0.3em] uppercase text-foreground transition-all hover:border-primary hover:text-primary hover:shadow-glow";

export const formTransition = {
  initial: { opacity: 0, y: 14, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -14, filter: "blur(4px)" },
  transition: { duration: 0.35, ease: "easeInOut" as const }
};

export const genderOptions = [
  { id: "M", value: "M", title: "Masculino", icon: "Mars" },
  { id: "F", value: "F", title: "Femenino", icon: "Venus" }
];
