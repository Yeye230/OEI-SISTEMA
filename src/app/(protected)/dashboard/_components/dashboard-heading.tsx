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
        <p className="text-overline uppercase text-primary">OEI · Gestión de Actas</p>
        <h1 className="mt-2 text-page-title text-foreground">{title}</h1>
        <p className="mt-1 max-w-2xl text-body-sm text-muted">{description}</p>
      </div>
      <span className="w-fit rounded-pill border border-status-warning-border bg-status-warning-bg px-3 py-1 text-caption text-status-warning-text">
        Datos de demostración
      </span>
    </header>
  );
}
