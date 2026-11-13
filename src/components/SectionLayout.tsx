import type { ReactElement, ReactNode } from "react";

type Props = { title: string; subtitle: string; children: ReactNode };

export default function SectionLayout({ title, subtitle, children }: Props): ReactElement {
  return (
    <section className="eq-module-page">
      <header className="eq-heading-row">
        <div>
          <div className="eq-breadcrumb"><span>OEI El Salvador</span><i>›</i><strong>{title}</strong></div>
          <h1>{title}</h1>
          <p className="eq-subtitle">{subtitle}</p>
        </div>
      </header>
      {children}
    </section>
  );
}
