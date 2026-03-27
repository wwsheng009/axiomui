import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../../lib/cx";
import type { ChartTone } from "./chart-utils";
import { normalizeChartSeriesIndex } from "./chart-utils";

export interface ChartLegendItem {
  description?: ReactNode;
  key: string;
  label: ReactNode;
  series?: number;
  tone?: ChartTone;
  value?: ReactNode;
}

export type ChartLegendLayout = "stack" | "grid";

export interface ChartLegendProps extends HTMLAttributes<HTMLUListElement> {
  items: ChartLegendItem[];
  layout?: ChartLegendLayout;
}

function hasSlotContent(value: ReactNode) {
  return value !== undefined && value !== null && value !== false;
}

export function ChartLegend({
  className,
  items,
  layout = "stack",
  ...props
}: ChartLegendProps) {
  return (
    <ul className={cx("ax-chart-legend", className)} data-layout={layout} {...props}>
      {items.map((item) => {
        const resolvedSeries = item.tone
          ? undefined
          : item.series !== undefined
            ? normalizeChartSeriesIndex(item.series)
            : undefined;
        const resolvedTone = item.tone ?? (resolvedSeries ? undefined : "neutral");

        return (
          <li
            key={item.key}
            className="ax-chart-legend__item"
            data-series={resolvedSeries}
            data-tone={resolvedTone}
          >
            <span className="ax-chart-legend__marker" aria-hidden="true">
              <span className="ax-chart-legend__marker-swatch" />
            </span>

            <span className="ax-chart-legend__content">
              <span className="ax-chart-legend__label">{item.label}</span>
              {hasSlotContent(item.description) ? (
                <span className="ax-chart-legend__description">
                  {item.description}
                </span>
              ) : null}
            </span>

            {hasSlotContent(item.value) ? (
              <span className="ax-chart-legend__value">{item.value}</span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
