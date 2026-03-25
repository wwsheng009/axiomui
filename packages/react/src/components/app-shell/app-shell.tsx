import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  brand?: ReactNode;
  primaryTitle: string;
  secondaryTitle?: string;
  search?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  contentClassName?: string;
}

export function AppShell({
  actions,
  brand,
  children,
  className,
  contentClassName,
  meta,
  primaryTitle,
  search,
  secondaryTitle,
  ...props
}: AppShellProps) {
  return (
    <div className={cx("ax-shell", className)} {...props}>
      <header className="ax-shell__bar">
        {brand ? <div className="ax-shell__brand">{brand}</div> : null}

        <div className="ax-shell__titles">
          <span className="ax-shell__title">{primaryTitle}</span>
          {secondaryTitle ? (
            <span className="ax-shell__secondary-title">{secondaryTitle}</span>
          ) : null}
        </div>

        {search ? <div className="ax-shell__search">{search}</div> : null}
        {actions ? <div className="ax-shell__actions">{actions}</div> : null}
        {meta ? <div className="ax-shell__meta">{meta}</div> : null}
      </header>

      <div className={cx("ax-shell__content", contentClassName)}>{children}</div>
    </div>
  );
}

