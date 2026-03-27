import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../../lib/cx";

export type ChartSurfaceSize = "sm" | "md" | "lg";

export interface ChartSurfaceProps extends HTMLAttributes<HTMLElement> {
  bodyClassName?: string;
  eyebrow?: ReactNode;
  footer?: ReactNode;
  heading?: ReactNode;
  size?: ChartSurfaceSize;
  supportingText?: ReactNode;
  trend?: ReactNode;
  value?: ReactNode;
}

function hasSlotContent(value: ReactNode) {
  return value !== undefined && value !== null && value !== false;
}

export function ChartSurface({
  bodyClassName,
  children,
  className,
  eyebrow,
  footer,
  heading,
  size = "md",
  supportingText,
  trend,
  value,
  ...props
}: ChartSurfaceProps) {
  const hasCopy =
    hasSlotContent(eyebrow) ||
    hasSlotContent(heading) ||
    hasSlotContent(supportingText);
  const hasMetric = hasSlotContent(value) || hasSlotContent(trend);
  const hasHeader = hasCopy || hasMetric;

  return (
    <section className={cx("ax-chart-surface", className)} data-size={size} {...props}>
      {hasHeader ? (
        <header className="ax-chart-surface__header">
          {hasCopy ? (
            <div className="ax-chart-surface__copy">
              {hasSlotContent(eyebrow) ? (
                <span className="ax-chart-surface__eyebrow">{eyebrow}</span>
              ) : null}
              {hasSlotContent(heading) ? (
                <div className="ax-chart-surface__heading">{heading}</div>
              ) : null}
              {hasSlotContent(supportingText) ? (
                <div className="ax-chart-surface__supporting-text">
                  {supportingText}
                </div>
              ) : null}
            </div>
          ) : null}

          {hasMetric ? (
            <div className="ax-chart-surface__metric">
              {hasSlotContent(value) ? (
                <div className="ax-chart-surface__value">{value}</div>
              ) : null}
              {hasSlotContent(trend) ? (
                <div className="ax-chart-surface__trend">{trend}</div>
              ) : null}
            </div>
          ) : null}
        </header>
      ) : null}

      {hasSlotContent(children) ? (
        <div className={cx("ax-chart-surface__body", bodyClassName)}>{children}</div>
      ) : null}

      {hasSlotContent(footer) ? (
        <footer className="ax-chart-surface__footer">{footer}</footer>
      ) : null}
    </section>
  );
}
