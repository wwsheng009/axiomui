import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";
import { Card, type CardProps } from "../card/card";
import type { ChartTone } from "../microchart/_shared/chart-utils";

export type KpiCardTone = CardProps["tone"];
export type KpiCardStatusTone = ChartTone;

export interface KpiCardIndicator {
  description?: ReactNode;
  key: string;
  label: ReactNode;
  tone?: ChartTone;
  value: ReactNode;
}

export interface KpiCardProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  chart?: ReactNode;
  description?: string;
  eyebrow?: string;
  footer?: ReactNode;
  heading: string;
  indicators?: KpiCardIndicator[];
  interactive?: boolean;
  mainValue: ReactNode;
  secondaryValue?: ReactNode;
  status?: ReactNode;
  statusTone?: KpiCardStatusTone;
  tone?: KpiCardTone;
  trend?: ReactNode;
}

function hasSlotContent(value: ReactNode) {
  return value !== undefined && value !== null && value !== false;
}

export function KpiCard({
  chart,
  className,
  description,
  eyebrow,
  footer,
  heading,
  indicators = [],
  interactive,
  mainValue,
  secondaryValue,
  status,
  statusTone = "neutral",
  tone = "default",
  trend,
  ...props
}: KpiCardProps) {
  const hasChart = hasSlotContent(chart);
  const hasIndicators = indicators.length > 0;
  const hasMeta = hasSlotContent(status) || hasSlotContent(trend);

  return (
    <Card
      className={cx("ax-kpi-card", className)}
      description={description}
      eyebrow={eyebrow}
      footer={footer}
      heading={heading}
      interactive={interactive}
      tone={tone}
      {...props}
    >
      <div
        className="ax-kpi-card__shell"
        data-has-chart={hasChart}
        data-has-indicators={hasIndicators}
      >
        <div className="ax-kpi-card__hero">
          <div className="ax-kpi-card__metric">
            {hasSlotContent(secondaryValue) ? (
              <span className="ax-kpi-card__secondary-value">{secondaryValue}</span>
            ) : null}
            <span className="ax-kpi-card__main-value">{mainValue}</span>

            {hasMeta ? (
              <div className="ax-kpi-card__meta">
                {hasSlotContent(status) ? (
                  <span className="ax-kpi-card__status" data-tone={statusTone}>
                    {status}
                  </span>
                ) : null}
                {hasSlotContent(trend) ? (
                  <span className="ax-kpi-card__trend">{trend}</span>
                ) : null}
              </div>
            ) : null}
          </div>

          {hasChart ? <div className="ax-kpi-card__chart">{chart}</div> : null}
        </div>

        {hasIndicators ? (
          <div className="ax-kpi-card__indicators">
            {indicators.map((indicator) => (
              <div
                key={indicator.key}
                className="ax-kpi-card__indicator"
                data-tone={indicator.tone ?? "neutral"}
              >
                <span className="ax-kpi-card__indicator-label">
                  {indicator.label}
                </span>
                <span className="ax-kpi-card__indicator-value">
                  {indicator.value}
                </span>
                {hasSlotContent(indicator.description) ? (
                  <span className="ax-kpi-card__indicator-description">
                    {indicator.description}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
