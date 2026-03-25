import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";

export interface PageSectionProps extends HTMLAttributes<HTMLElement> {
  heading: string;
  description?: string;
  actions?: ReactNode;
}

export function PageSection({
  actions,
  children,
  className,
  description,
  heading,
  ...props
}: PageSectionProps) {
  return (
    <section className={cx("ax-page-section", className)} {...props}>
      <header className="ax-page-section__header">
        <div className="ax-page-section__headline">
          <h2 className="ax-page-section__heading">{heading}</h2>
          {description ? (
            <p className="ax-page-section__description">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="ax-page-section__actions">{actions}</div> : null}
      </header>
      <div className="ax-page-section__body">{children}</div>
    </section>
  );
}

