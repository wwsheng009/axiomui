import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  heading: string;
  description?: string;
  footer?: ReactNode;
  interactive?: boolean;
  tone?: "default" | "brand" | "positive" | "attention";
}

export function Card({
  children,
  className,
  description,
  eyebrow,
  footer,
  heading,
  interactive,
  tone = "default",
  ...props
}: CardProps) {
  return (
    <section
      className={cx("ax-card", className)}
      data-interactive={interactive}
      data-tone={tone}
      {...props}
    >
      <header className="ax-card__header">
        {eyebrow ? <span className="ax-card__eyebrow">{eyebrow}</span> : null}
        <div className="ax-card__headline">
          <h3 className="ax-card__heading">{heading}</h3>
          {description ? (
            <p className="ax-card__description">{description}</p>
          ) : null}
        </div>
      </header>

      <div className="ax-card__body">{children}</div>

      {footer ? <footer className="ax-card__footer">{footer}</footer> : null}
    </section>
  );
}

