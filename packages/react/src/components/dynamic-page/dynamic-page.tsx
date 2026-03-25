import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";

export interface DynamicPageProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: ReactNode;
  heading: ReactNode;
  subheading?: ReactNode;
  actions?: ReactNode;
  headerContent?: ReactNode;
  footer?: ReactNode;
}

export function DynamicPage({
  actions,
  children,
  className,
  eyebrow,
  footer,
  headerContent,
  heading,
  subheading,
  ...props
}: DynamicPageProps) {
  return (
    <section className={cx("ax-dynamic-page", className)} {...props}>
      <div className="ax-dynamic-page__title-area">
        <div className="ax-dynamic-page__title-stack">
          {eyebrow ? <span className="ax-dynamic-page__eyebrow">{eyebrow}</span> : null}
          <h1 className="ax-dynamic-page__heading">{heading}</h1>
          {subheading ? (
            <p className="ax-dynamic-page__subheading">{subheading}</p>
          ) : null}
        </div>

        {actions ? <div className="ax-dynamic-page__actions">{actions}</div> : null}
      </div>

      {headerContent ? (
        <div className="ax-dynamic-page__header-content">{headerContent}</div>
      ) : null}

      <div className="ax-dynamic-page__content">{children}</div>

      {footer ? <div className="ax-dynamic-page__footer">{footer}</div> : null}
    </section>
  );
}

