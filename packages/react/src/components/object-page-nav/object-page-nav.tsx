import { type HTMLAttributes, type ReactNode, useId } from "react";

import { cx } from "../../lib/cx";

export interface ObjectPageNavItem {
  key: string;
  label: ReactNode;
  count?: ReactNode;
}

export interface ObjectPageNavProps extends HTMLAttributes<HTMLDivElement> {
  items: ObjectPageNavItem[];
  listAriaLabel?: string;
  value: string;
  onValueChange?: (value: string) => void;
}

export interface ObjectPageSectionProps extends HTMLAttributes<HTMLElement> {
  sectionKey: string;
  heading: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export function ObjectPageNav({
  className,
  items,
  listAriaLabel,
  onValueChange,
  value,
  ...props
}: ObjectPageNavProps) {
  const generatedId = useId();

  return (
    <div className={cx("ax-object-page-nav", className)} {...props}>
      <div
        className="ax-object-page-nav__list"
        role="tablist"
        aria-label={listAriaLabel}
        aria-orientation="horizontal"
      >
        {items.map((item) => {
          const selected = item.key === value;

          return (
            <button
              key={item.key}
              id={`${generatedId}-${item.key}-tab`}
              className="ax-object-page-nav__item"
              data-selected={selected}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => onValueChange?.(item.key)}
            >
              <span className="ax-object-page-nav__label">{item.label}</span>
              {item.count !== undefined ? (
                <span className="ax-object-page-nav__count">{item.count}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ObjectPageSection({
  actions,
  children,
  className,
  description,
  heading,
  sectionKey,
  ...props
}: ObjectPageSectionProps) {
  return (
    <section
      className={cx("ax-object-page-section", className)}
      data-section-key={sectionKey}
      {...props}
    >
      <header className="ax-object-page-section__header">
        <div className="ax-object-page-section__headline">
          <h2 className="ax-object-page-section__heading">{heading}</h2>
          {description ? (
            <p className="ax-object-page-section__description">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="ax-object-page-section__actions">{actions}</div> : null}
      </header>
      <div className="ax-object-page-section__body">{children}</div>
    </section>
  );
}
