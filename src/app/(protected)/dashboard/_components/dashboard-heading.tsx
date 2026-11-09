import type { ReactElement } from "react";

type DashboardHeadingProps = {
  title: string;
  description: string;
};

export function DashboardHeading({
  title,
  description
}: DashboardHeadingProps): ReactElement {
  return (
    <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          OEI · Gestión de Actas
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>
      </div>
      <span className="w-fit rounded-full border border-warning/40 bg-warning-soft px-3 py-1 text-xs text-warning">
        Datos de demostración
      </span>
    </header>
  );
}
