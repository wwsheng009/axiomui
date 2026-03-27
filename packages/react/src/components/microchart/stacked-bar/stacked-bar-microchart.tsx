import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../../lib/cx";
import {
  ChartLegend,
  type ChartLegendLayout,
} from "../_shared/chart-legend";
import { ChartSurface, type ChartSurfaceSize } from "../_shared/chart-surface";
import {
  buildChartAriaLabel,
  formatChartValueText,
  normalizeChartSeriesIndex,
  type ChartTone,
} from "../_shared/chart-utils";

export type StackedBarMicroChartLabelMode = "none" | "compact" | "full";

export interface StackedBarMicroChartSegment {
  description?: ReactNode;
  key: string;
  label: ReactNode;
  series?: number;
  tone?: ChartTone;
  value?: number | null;
  valueDisplay?: ReactNode;
}

export interface StackedBarMicroChartProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  ariaLabel?: string;
  footer?: ReactNode;
  formatValue?: (value: number, total: number, ratio: number) => string;
  heading?: ReactNode;
  labelMode?: StackedBarMicroChartLabelMode;
  legendLayout?: ChartLegendLayout;
  segments: StackedBarMicroChartSegment[];
  showLegend?: boolean;
  size?: ChartSurfaceSize;
  supportingText?: ReactNode;
  total?: number | null;
  trend?: ReactNode;
  value?: ReactNode;
}

interface ResolvedStackedBarMicroChartSegment
  extends Omit<StackedBarMicroChartSegment, "value"> {
  ratio: number;
  resolvedSeries?: number;
  tone?: ChartTone;
  value: number;
  valueText: string;
}

function isFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function resolveTextAttribute(value: ReactNode) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return undefined;
}

function defaultFormatValue(value: number, total: number, ratio: number) {
  if (total <= 0) {
    return formatChartValueText(value, {
      maximumFractionDigits: Math.abs(value) >= 100 ? 0 : 1,
    });
  }

  return formatChartValueText(ratio * 100, {
    maximumFractionDigits: ratio === 0 || ratio === 1 ? 0 : 1,
    suffix: "%",
  });
}

function resolveTotal(
  total: number | null | undefined,
  segmentValues: number[],
) {
  if (isFiniteNumber(total) && total > 0) {
    return total;
  }

  const derivedTotal = segmentValues.reduce((sum, value) => sum + value, 0);

  if (derivedTotal > 0) {
    return derivedTotal;
  }

  return 0;
}

export function StackedBarMicroChart({
  ariaLabel,
  className,
  footer,
  formatValue = defaultFormatValue,
  heading,
  labelMode = "compact",
  legendLayout = "stack",
  segments,
  showLegend = false,
  size = "md",
  supportingText,
  total,
  trend,
  value,
  ...props
}: StackedBarMicroChartProps) {
  const normalizedSegmentValues = segments.map((segment) =>
    isFiniteNumber(segment.value) ? Math.max(segment.value, 0) : 0,
  );
  const resolvedTotal = resolveTotal(total, normalizedSegmentValues);
  const resolvedSegments: ResolvedStackedBarMicroChartSegment[] = segments.map(
    (segment, index) => {
      const resolvedValue = normalizedSegmentValues[index] ?? 0;
      const ratio =
        resolvedTotal > 0 ? clamp(resolvedValue / resolvedTotal, 0, 1) : 0;
      const resolvedSeries =
        segment.tone === undefined && segment.series !== undefined
          ? normalizeChartSeriesIndex(segment.series)
          : undefined;

      return {
        ...segment,
        ratio,
        resolvedSeries,
        value: resolvedValue,
        valueText:
          resolveTextAttribute(segment.valueDisplay) ??
          formatValue(resolvedValue, resolvedTotal, ratio),
      };
    },
  );
  const renderableSegments = resolvedSegments.filter((segment) => segment.ratio > 0);
  const consumedRatio = renderableSegments.reduce(
    (sum, segment) => sum + segment.ratio,
    0,
  );
  const remainderRatio =
    resolvedTotal > 0 ? clamp(1 - consumedRatio, 0, 1) : 0;
  const resolvedAriaLabel =
    ariaLabel ??
    buildChartAriaLabel({
      title: resolveTextAttribute(heading),
      description: resolveTextAttribute(supportingText),
      valueText:
        renderableSegments.length > 0
          ? resolvedSegments
              .map((segment) => {
                const label = resolveTextAttribute(segment.label);

                return label ? `${label} ${segment.valueText}` : segment.valueText;
              })
              .filter(Boolean)
              .join(", ")
          : "No segment data",
      trendText: resolveTextAttribute(trend),
    });
  const shouldRenderSummary = !showLegend && labelMode !== "none";

  return (
    <ChartSurface
      bodyClassName="ax-stacked-bar-microchart__surface-body"
      className={cx("ax-stacked-bar-microchart", className)}
      footer={footer}
      heading={heading}
      size={size}
      supportingText={supportingText}
      trend={trend}
      value={value}
      {...props}
    >
      <div
        className="ax-stacked-bar-microchart__track"
        aria-label={resolvedAriaLabel || undefined}
        role={resolvedAriaLabel ? "img" : undefined}
      >
        {renderableSegments.length ? (
          <>
            {renderableSegments.map((segment) => (
              <span
                key={segment.key}
                className="ax-stacked-bar-microchart__segment"
                data-series={segment.resolvedSeries}
                data-tone={segment.tone ?? (segment.resolvedSeries ? undefined : "neutral")}
                style={{ width: `${segment.ratio * 100}%` }}
                title={[
                  resolveTextAttribute(segment.label),
                  segment.valueText,
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            ))}
            {remainderRatio > 0 ? (
              <span
                className="ax-stacked-bar-microchart__segment ax-stacked-bar-microchart__segment--remainder"
                style={{ width: `${remainderRatio * 100}%` }}
                title="Remaining capacity"
              />
            ) : null}
          </>
        ) : (
          <span className="ax-stacked-bar-microchart__empty">No segment data</span>
        )}
      </div>

      {shouldRenderSummary ? (
        <div className="ax-stacked-bar-microchart__summary" data-mode={labelMode}>
          {resolvedSegments.map((segment) => (
            <div
              key={segment.key}
              className="ax-stacked-bar-microchart__summary-item"
              data-series={segment.resolvedSeries}
              data-tone={segment.tone ?? (segment.resolvedSeries ? undefined : "neutral")}
            >
              <span
                className="ax-stacked-bar-microchart__summary-marker"
                aria-hidden="true"
              />
              <span className="ax-stacked-bar-microchart__summary-copy">
                <span
                  className="ax-stacked-bar-microchart__summary-label"
                  title={resolveTextAttribute(segment.label)}
                >
                  {segment.label}
                </span>
                {labelMode === "full" && segment.description ? (
                  <span className="ax-stacked-bar-microchart__summary-description">
                    {segment.description}
                  </span>
                ) : null}
              </span>
              <span className="ax-stacked-bar-microchart__summary-value">
                {segment.valueText}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {showLegend && resolvedSegments.length ? (
        <ChartLegend
          className="ax-stacked-bar-microchart__legend"
          items={resolvedSegments.map((segment) => ({
            description: segment.description,
            key: segment.key,
            label: segment.label,
            series: segment.resolvedSeries,
            tone: segment.resolvedSeries ? undefined : segment.tone,
            value: segment.valueText,
          }))}
          layout={legendLayout}
        />
      ) : null}
    </ChartSurface>
  );
}
