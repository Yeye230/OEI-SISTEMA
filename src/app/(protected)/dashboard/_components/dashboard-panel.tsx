import type { ReactElement, ReactNode } from "react";

type DashboardPanelProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardPanel({
  children,
  className = ""
}: DashboardPanelProps): ReactElement {
  return (
    <section
      className={`min-w-0 rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}
