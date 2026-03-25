import { useState, type HTMLAttributes, type ReactNode } from "react";

import { cx } from "../../lib/cx";
import { Button } from "../button/button";

export interface FilterBarProps extends HTMLAttributes<HTMLDivElement> {
  heading?: ReactNode;
  description?: ReactNode;
  variant?: ReactNode;
  actions?: ReactNode;
  summary?: ReactNode;
  footer?: ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export function FilterBar({
  actions,
  children,
  className,
  defaultExpanded = true,
  description,
  expanded,
  footer,
  heading = "Filter bar",
  onExpandedChange,
  summary,
  variant,
  ...props
}: FilterBarProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const resolvedExpanded = expanded ?? internalExpanded;

  function toggleExpanded() {
    const nextExpanded = !resolvedExpanded;

    if (expanded === undefined) {
      setInternalExpanded(nextExpanded);
    }

    onExpandedChange?.(nextExpanded);
  }

  return (
    <section
      className={cx("ax-filter-bar", className)}
      data-expanded={resolvedExpanded}
      {...props}
    >
      <header className="ax-filter-bar__header">
        <div className="ax-filter-bar__headline">
          <div className="ax-filter-bar__titles">
            <h3 className="ax-filter-bar__heading">{heading}</h3>
            {description ? (
              <p className="ax-filter-bar__description">{description}</p>
            ) : null}
          </div>
          {variant ? <div className="ax-filter-bar__variant">{variant}</div> : null}
        </div>

        <div className="ax-filter-bar__controls">
          {actions ? <div className="ax-filter-bar__actions">{actions}</div> : null}
          <Button variant="transparent" onClick={toggleExpanded}>
            {resolvedExpanded ? "Hide filters" : "Show filters"}
          </Button>
        </div>
      </header>

      {summary ? <div className="ax-filter-bar__summary">{summary}</div> : null}

      {resolvedExpanded ? <div className="ax-filter-bar__body">{children}</div> : null}

      {footer ? <footer className="ax-filter-bar__footer">{footer}</footer> : null}
    </section>
  );
}

