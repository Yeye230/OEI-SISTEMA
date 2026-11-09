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
      className={`min-w-0 rounded-card border border-hairline bg-surface p-4 shadow-card sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}
